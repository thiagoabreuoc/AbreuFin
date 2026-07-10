/* ═══════════════════════════════════════
   CATEGORIZAÇÃO POR IA
   Heurística local (sem chamada externa): casa palavras-chave (incluindo
   frases de duas palavras, ex. "lava jato") do texto da Observação
   contra as categorias/sub-categorias que o usuário já tem cadastradas.
   Se nenhuma categoria existente corresponder mas uma palavra-chave bater,
   sugere CRIAR a categoria (não deixa a sugestão morta por falta de
   categorias cadastradas).
═══════════════════════════════════════ */
const AI_CATEGORY_KEYWORDS = {
  // despesa
  uber: 'transporte', '99': 'transporte', combustivel: 'transporte', gasolina: 'transporte',
  posto: 'transporte', estacionamento: 'transporte', pedagio: 'transporte', onibus: 'transporte',
  metro: 'transporte', oficina: 'transporte', mecanico: 'transporte', pneu: 'transporte',
  'lava jato': 'transporte', lavajato: 'transporte', 'lava rapido': 'transporte', ipva: 'transporte', multa: 'transporte',
  mercado: 'alimentacao', supermercado: 'alimentacao', ifood: 'alimentacao', restaurante: 'alimentacao',
  lanchonete: 'alimentacao', padaria: 'alimentacao', feira: 'alimentacao', acougue: 'alimentacao', delivery: 'alimentacao',
  pizza: 'alimentacao', hamburguer: 'alimentacao', acai: 'alimentacao', sorvete: 'alimentacao',
  aluguel: 'moradia', condominio: 'moradia', iptu: 'moradia', luz: 'moradia', energia: 'moradia',
  agua: 'moradia', gas: 'moradia', internet: 'moradia', financiamento: 'moradia', wifi: 'moradia',
  faxina: 'moradia', diarista: 'moradia', encanador: 'moradia', eletricista: 'moradia',
  farmacia: 'saude', remedio: 'saude', medico: 'saude', dentista: 'saude',
  consulta: 'saude', exame: 'saude', academia: 'saude', hospital: 'saude', psicologo: 'saude',
  netflix: 'lazer', spotify: 'lazer', streaming: 'lazer', cinema: 'lazer', show: 'lazer', viagem: 'lazer',
  passagem: 'lazer', hospedagem: 'lazer', hotel: 'lazer', bar: 'lazer', passeio: 'lazer',
  curso: 'educacao', faculdade: 'educacao', mensalidade: 'educacao', escola: 'educacao', livro: 'educacao', material: 'educacao',
  roupa: 'pessoais', vestuario: 'pessoais', cabeleireiro: 'pessoais', salao: 'pessoais', manicure: 'pessoais', barbeiro: 'pessoais',
  pet: 'pets', veterinario: 'pets', racao: 'pets', petshop: 'pets', 'banho e tosa': 'pets',
  presente: 'presentes', aniversario: 'presentes', 'lembranca': 'presentes',
  seguro: 'seguros',
  // receita
  salario: 'trabalho', pagamento: 'trabalho', freelance: 'trabalho', bonus: 'trabalho',
  dividendo: 'rendimentos', juros: 'rendimentos', rendimento: 'rendimentos',
  // investimento
  tesouro: 'renda fixa', cdb: 'renda fixa', lci: 'renda fixa', lca: 'renda fixa',
  acao: 'renda variavel', acoes: 'renda variavel', fii: 'renda variavel', etf: 'renda variavel',
  bitcoin: 'cripto', cripto: 'cripto',
};

const AI_CONCEPT_LABELS = {
  transporte: 'Transporte', alimentacao: 'Alimentação', moradia: 'Moradia', saude: 'Saúde',
  lazer: 'Lazer', educacao: 'Educação', pessoais: 'Pessoais', pets: 'Pets', presentes: 'Presentes',
  seguros: 'Seguros', trabalho: 'Trabalho', rendimentos: 'Rendimentos',
  'renda fixa': 'Renda Fixa', 'renda variavel': 'Renda Variável', cripto: 'Cripto',
};

let _aiSuggestTimer = null;
let _aiSuggestion = null;

function aiNormalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .split('').filter(function(ch) {
      var code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f; // remove marcas de acentuação combinadas
    }).join('')
    .replace(/[-_]/g, ' ') // "lava-a-jato" -> "lava a jato", pra casar frases do dicionário
    .trim();
}

// Palavras de ligação removidas só na hora de casar frases do dicionário
// (ex.: "lava-a-jato" -> "lava a jato" -> "lava jato", batendo com a chave
// "lava jato" mesmo com o "a" no meio). Não usado nos passos 1/2, que
// comparam o nome completo da categoria do usuário.
const AI_STOPWORDS = ['a', 'o', 'as', 'os', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'com', 'e', 'ao', 'um', 'uma'];
function aiStripStopwords(norm) {
  return norm.split(' ').filter(function(w) { return w && AI_STOPWORDS.indexOf(w) === -1; }).join(' ');
}

function suggestCategoryFromText(text, tipo) {
  const norm = aiNormalize(text);
  if (norm.length < 3) return null;
  const cats = categories[tipo] || [];

  // 1) casa direto contra sub-categorias que o usuário já tem
  for (const c of cats) {
    for (const s of (c.subs || [])) {
      const sNorm = aiNormalize(s);
      if (sNorm.length >= 3 && norm.includes(sNorm)) return { categoria: c.name, subcategoria: s, isNew: false };
    }
  }
  // 2) casa direto contra nomes de categorias que o usuário já tem
  for (const c of cats) {
    const cNorm = aiNormalize(c.name);
    if (cNorm.length >= 3 && norm.includes(cNorm)) return { categoria: c.name, subcategoria: null, isNew: false };
  }
  // 3) dicionário de palavras-chave (inclui frases de 2 palavras) -> conceito.
  // Ordena as chaves da mais longa pra mais curta, pra "lava jato" vencer
  // antes de qualquer palavra isolada mais genérica bater primeiro.
  const compact = aiStripStopwords(norm);
  const keys = Object.keys(AI_CATEGORY_KEYWORDS).sort((a, b) => b.length - a.length);
  let concept = null;
  for (const key of keys) {
    if (compact.includes(key)) { concept = AI_CATEGORY_KEYWORDS[key]; break; }
  }
  if (!concept) return null;

  const existing = cats.find(c => {
    const cNorm = aiNormalize(c.name);
    return cNorm.includes(concept) || concept.includes(cNorm);
  });
  if (existing) return { categoria: existing.name, subcategoria: null, isNew: false };

  // Nenhuma categoria correspondente ainda: sugere criar uma nova.
  const label = AI_CONCEPT_LABELS[concept] || (concept.charAt(0).toUpperCase() + concept.slice(1));
  return { categoria: label, subcategoria: null, isNew: true };
}

function onObsInputAi() {
  clearTimeout(_aiSuggestTimer);
  _aiSuggestTimer = setTimeout(runAiSuggestion, 500);
}

function runAiSuggestion() {
  const tipo = document.getElementById('f-tipo').value;
  const catVal = document.getElementById('f-categoria').value;
  const obs = document.getElementById('f-obs').value;
  if (!tipo || catVal) { hideAiSuggestion(); return; }
  const suggestion = suggestCategoryFromText(obs, tipo);
  if (!suggestion) { hideAiSuggestion(); return; }
  _aiSuggestion = suggestion;
  const label = suggestion.subcategoria ? `${suggestion.categoria} › ${suggestion.subcategoria}` : suggestion.categoria;
  const text = suggestion.isNew ? `Criar categoria "${label}"?` : 'Sugestão: ' + label;
  document.getElementById('ai-suggest-text').textContent = text;
  document.getElementById('ai-suggest-row').classList.remove('d-none');
}

function hideAiSuggestion() {
  _aiSuggestion = null;
  const row = document.getElementById('ai-suggest-row');
  if (row) row.classList.add('d-none');
}

async function applyAiSuggestion() {
  if (!_aiSuggestion) return;
  const suggestion = _aiSuggestion;
  const btn = document.querySelector('#ai-suggest-row button');

  if (suggestion.isNew) {
    const tipo = document.getElementById('f-tipo').value;
    setBtnLoading(btn, true);
    try {
      const data = await apiCreateCategory(tipo, suggestion.categoria, '📌');
      if (!categories[tipo]) categories[tipo] = [];
      categories[tipo].push(data.category);
      populateCatOptions(tipo);
    } catch (e) {
      showToast(e.message, 'error');
      setBtnLoading(btn, false);
      return;
    }
    setBtnLoading(btn, false);
  }

  csSetValue('f-categoria', suggestion.categoria);
  onCatChange(); // popula sub-categorias e esconde a sugestão
  if (suggestion.subcategoria) {
    csSetValue('f-subcategoria', suggestion.subcategoria);
    onSubCatChange();
  }
}
