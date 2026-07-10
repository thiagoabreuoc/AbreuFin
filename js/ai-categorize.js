/* ═══════════════════════════════════════
   CATEGORIZAÇÃO POR IA
   Heurística local (sem chamada externa): casa palavras-chave do
   texto da Observação contra as categorias/sub-categorias que o
   próprio usuário já tem cadastradas, sugerindo o preenchimento.
═══════════════════════════════════════ */
const AI_CATEGORY_KEYWORDS = {
  // despesa
  uber: 'transporte', '99': 'transporte', combustivel: 'transporte', gasolina: 'transporte',
  posto: 'transporte', estacionamento: 'transporte', pedagio: 'transporte', onibus: 'transporte',
  metro: 'transporte', oficina: 'transporte', mecanico: 'transporte', pneu: 'transporte',
  mercado: 'alimentacao', supermercado: 'alimentacao', ifood: 'alimentacao', restaurante: 'alimentacao',
  lanchonete: 'alimentacao', padaria: 'alimentacao', feira: 'alimentacao', acougue: 'alimentacao', delivery: 'alimentacao',
  aluguel: 'moradia', condominio: 'moradia', iptu: 'moradia', luz: 'moradia', energia: 'moradia',
  agua: 'moradia', gas: 'moradia', internet: 'moradia', financiamento: 'moradia', wifi: 'moradia',
  farmacia: 'saude', remedio: 'saude', medico: 'saude', dentista: 'saude',
  consulta: 'saude', exame: 'saude', academia: 'saude', hospital: 'saude',
  netflix: 'lazer', spotify: 'lazer', streaming: 'lazer', cinema: 'lazer', show: 'lazer', viagem: 'lazer',
  passagem: 'lazer', hospedagem: 'lazer', hotel: 'lazer', bar: 'lazer', passeio: 'lazer',
  curso: 'educacao', faculdade: 'educacao', mensalidade: 'educacao', escola: 'educacao', livro: 'educacao', material: 'educacao',
  roupa: 'pessoais', vestuario: 'pessoais', cabeleireiro: 'pessoais', salao: 'pessoais',
  pet: 'pets', veterinario: 'pets', racao: 'pets', petshop: 'pets',
  // receita
  salario: 'trabalho', pagamento: 'trabalho', freelance: 'trabalho', bonus: 'trabalho',
  dividendo: 'rendimentos', juros: 'rendimentos', rendimento: 'rendimentos',
  // investimento
  tesouro: 'renda fixa', cdb: 'renda fixa', lci: 'renda fixa', lca: 'renda fixa',
  acao: 'renda variavel', acoes: 'renda variavel', fii: 'renda variavel', etf: 'renda variavel',
  bitcoin: 'cripto', cripto: 'cripto',
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
    .trim();
}

function suggestCategoryFromText(text, tipo) {
  const norm = aiNormalize(text);
  if (norm.length < 3) return null;
  const cats = categories[tipo] || [];

  // 1) casa direto contra sub-categorias que o usuário já tem
  for (const c of cats) {
    for (const s of (c.subs || [])) {
      const sNorm = aiNormalize(s);
      if (sNorm.length >= 3 && norm.includes(sNorm)) return { categoria: c.name, subcategoria: s };
    }
  }
  // 2) casa direto contra nomes de categorias que o usuário já tem
  for (const c of cats) {
    const cNorm = aiNormalize(c.name);
    if (cNorm.length >= 3 && norm.includes(cNorm)) return { categoria: c.name, subcategoria: null };
  }
  // 3) dicionário de palavras-chave -> conceito, casado com categorias existentes
  const words = norm.split(/[^a-z0-9]+/).filter(Boolean);
  let concept = null;
  for (const w of words) { if (AI_CATEGORY_KEYWORDS[w]) { concept = AI_CATEGORY_KEYWORDS[w]; break; } }
  if (!concept) return null;
  const match = cats.find(c => {
    const cNorm = aiNormalize(c.name);
    return cNorm.includes(concept) || concept.includes(cNorm);
  });
  return match ? { categoria: match.name, subcategoria: null } : null;
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
  document.getElementById('ai-suggest-text').textContent = 'Sugestão: ' + label;
  document.getElementById('ai-suggest-row').classList.remove('d-none');
}

function hideAiSuggestion() {
  _aiSuggestion = null;
  const row = document.getElementById('ai-suggest-row');
  if (row) row.classList.add('d-none');
}

function applyAiSuggestion() {
  if (!_aiSuggestion) return;
  const suggestion = _aiSuggestion;
  csSetValue('f-categoria', suggestion.categoria);
  onCatChange(); // popula sub-categorias e esconde a sugestão
  if (suggestion.subcategoria) {
    csSetValue('f-subcategoria', suggestion.subcategoria);
    onSubCatChange();
  }
}
