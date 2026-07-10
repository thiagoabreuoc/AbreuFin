/* ═══════════════════════════════════════
   CATEGORIZAÇÃO POR IA
   Heurística local (sem chamada externa): casa palavras-chave (incluindo
   frases de duas palavras, ex. "lava jato") do texto da Observação
   contra as categorias/sub-categorias que o usuário já tem cadastradas.

   Cada palavra-chave aponta pra um conceito {categoria, subcategoria}.
   Toda sub-categoria sugerida precisa necessariamente estar vinculada a
   uma categoria: se existir uma categoria que já sirva pro conceito, a
   sub é anexada a ela; se nenhuma servir, a categoria é criada junto.
═══════════════════════════════════════ */
function K(categoria, subcategoria) { return { categoria: categoria, subcategoria: subcategoria || null }; }

const AI_CATEGORY_KEYWORDS = {
  // despesa — transporte
  uber: K('transporte', 'Aplicativos'), '99': K('transporte', 'Aplicativos'),
  combustivel: K('transporte', 'Combustível'), gasolina: K('transporte', 'Combustível'), posto: K('transporte', 'Combustível'),
  estacionamento: K('transporte', 'Estacionamento'), pedagio: K('transporte', 'Pedágio'),
  onibus: K('transporte', 'Transporte público'), metro: K('transporte', 'Transporte público'),
  oficina: K('transporte', 'Manutenção'), mecanico: K('transporte', 'Manutenção'), pneu: K('transporte', 'Manutenção'),
  'lava jato': K('transporte', 'Lavagem'), lavajato: K('transporte', 'Lavagem'), 'lava rapido': K('transporte', 'Lavagem'),
  ipva: K('transporte', 'IPVA'), multa: K('transporte', 'Multas'),
  // despesa — alimentação
  mercado: K('alimentacao', 'Supermercado'), supermercado: K('alimentacao', 'Supermercado'), feira: K('alimentacao', 'Supermercado'), acougue: K('alimentacao', 'Supermercado'),
  ifood: K('alimentacao', 'Delivery'), delivery: K('alimentacao', 'Delivery'),
  restaurante: K('alimentacao', 'Restaurantes'), lanchonete: K('alimentacao', 'Restaurantes'), pizza: K('alimentacao', 'Restaurantes'), hamburguer: K('alimentacao', 'Restaurantes'),
  padaria: K('alimentacao', 'Padaria'), acai: K('alimentacao', 'Padaria'), sorvete: K('alimentacao', 'Padaria'),
  // despesa — moradia
  aluguel: K('moradia', 'Aluguel/Financiamento'), financiamento: K('moradia', 'Aluguel/Financiamento'),
  condominio: K('moradia', 'Aluguel/Financiamento'), iptu: K('moradia', 'Aluguel/Financiamento'),
  luz: K('moradia', 'Contas de casa'), energia: K('moradia', 'Contas de casa'), agua: K('moradia', 'Contas de casa'),
  gas: K('moradia', 'Contas de casa'), internet: K('moradia', 'Contas de casa'), wifi: K('moradia', 'Contas de casa'),
  faxina: K('moradia', 'Manutenção do lar'), diarista: K('moradia', 'Manutenção do lar'),
  encanador: K('moradia', 'Manutenção do lar'), eletricista: K('moradia', 'Manutenção do lar'),
  // despesa — saúde
  farmacia: K('saude', 'Farmácia'), remedio: K('saude', 'Farmácia'),
  medico: K('saude', 'Consultas e exames'), consulta: K('saude', 'Consultas e exames'), exame: K('saude', 'Consultas e exames'),
  dentista: K('saude', 'Consultas e exames'), hospital: K('saude', 'Consultas e exames'), psicologo: K('saude', 'Consultas e exames'),
  academia: K('saude', 'Academia e bem-estar'),
  // despesa — lazer / viagens
  netflix: K('lazer', 'Streaming'), spotify: K('lazer', 'Streaming'), streaming: K('lazer', 'Streaming'),
  cinema: K('lazer', 'Saídas'), show: K('lazer', 'Saídas'), bar: K('lazer', 'Saídas'), passeio: K('lazer', 'Saídas'),
  viagem: K('viagens', null), passagem: K('viagens', 'Passagens'), hospedagem: K('viagens', 'Hospedagem'), hotel: K('viagens', 'Hospedagem'),
  // despesa — educação
  curso: K('educacao', 'Cursos'), faculdade: K('educacao', 'Mensalidade'), mensalidade: K('educacao', 'Mensalidade'),
  escola: K('educacao', 'Mensalidade'), livro: K('educacao', 'Livros e material'), material: K('educacao', 'Livros e material'),
  // despesa — pessoais / pets / presentes / seguros
  roupa: K('pessoais', 'Vestuário'), vestuario: K('pessoais', 'Vestuário'),
  cabeleireiro: K('pessoais', 'Cuidados pessoais'), salao: K('pessoais', 'Cuidados pessoais'), manicure: K('pessoais', 'Cuidados pessoais'), barbeiro: K('pessoais', 'Cuidados pessoais'),
  pet: K('pets', null), veterinario: K('pets', 'Veterinário'), racao: K('pets', 'Alimentação pet'), petshop: K('pets', 'Higiene e acessórios'),
  'banho e tosa': K('pets', 'Higiene e acessórios'),
  presente: K('presentes', 'Presentes'), aniversario: K('presentes', 'Festas e comemorações'), lembranca: K('presentes', 'Presentes'),
  seguro: K('seguros', null),
  // receita
  salario: K('trabalho', 'Salário'), pagamento: K('trabalho', null), freelance: K('trabalho', 'Freelance'), bonus: K('trabalho', 'Bônus/13º'),
  dividendo: K('rendimentos', 'Dividendos'), juros: K('rendimentos', 'Juros'), rendimento: K('rendimentos', 'Rendimento de fundos'),
  // investimento
  tesouro: K('renda fixa', 'Tesouro Direto'), cdb: K('renda fixa', 'CDB'), lci: K('renda fixa', 'LCI/LCA'), lca: K('renda fixa', 'LCI/LCA'),
  acao: K('renda variavel', 'Ações'), acoes: K('renda variavel', 'Ações'), fii: K('renda variavel', 'Fundos Imobiliários'), etf: K('renda variavel', 'ETFs'),
  bitcoin: K('cripto', 'Bitcoin'), cripto: K('cripto', null),
};

const AI_CONCEPT_LABELS = {
  transporte: 'Transporte', alimentacao: 'Alimentação', moradia: 'Moradia', saude: 'Saúde',
  lazer: 'Lazer', viagens: 'Viagens', educacao: 'Educação', pessoais: 'Pessoais', pets: 'Pets', presentes: 'Presentes',
  seguros: 'Seguros', trabalho: 'Trabalho', rendimentos: 'Rendimentos',
  'renda fixa': 'Renda Fixa', 'renda variavel': 'Renda Variável', cripto: 'Cripto',
};

let _aiSuggestTimer = null;
let _aiSuggestions = [];

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

function suggestCategoriesFromText(text, tipo) {
  const norm = aiNormalize(text);
  if (norm.length < 3) return [];
  const cats = categories[tipo] || [];
  const results = [];
  const seen = {};
  function add(categoria, subcategoria, isNewCategoria, isNewSub) {
    const key = categoria + '|' + (subcategoria || '');
    if (seen[key]) return;
    seen[key] = true;
    results.push({
      categoria: categoria,
      subcategoria: subcategoria || null,
      isNewCategoria: !!isNewCategoria,
      isNewSub: !!isNewSub,
    });
  }

  // 1) casa direto contra sub-categorias que o usuário já tem — pode haver
  // mais de uma sub-categoria com o mesmo nome em categorias diferentes,
  // então TODAS as combinações que baterem viram opções.
  for (const c of cats) {
    for (const s of (c.subs || [])) {
      const sNorm = aiNormalize(s);
      if (sNorm.length >= 3 && norm.includes(sNorm)) add(c.name, s, false, false);
    }
  }
  // 2) casa direto contra nomes de categorias que o usuário já tem
  for (const c of cats) {
    const cNorm = aiNormalize(c.name);
    if (cNorm.length >= 3 && norm.includes(cNorm)) add(c.name, null, false, false);
  }
  // 3) dicionário de palavras-chave (inclui frases de 2 palavras) -> conceito
  // {categoria, subcategoria}, só entra em jogo se nada acima bateu. Ordena
  // as chaves da mais longa pra mais curta, pra "lava jato" vencer antes de
  // qualquer palavra isolada mais genérica.
  if (!results.length) {
    const compact = aiStripStopwords(norm);
    const keys = Object.keys(AI_CATEGORY_KEYWORDS).sort((a, b) => b.length - a.length);
    let concept = null;
    for (const key of keys) {
      if (compact.includes(key)) { concept = AI_CATEGORY_KEYWORDS[key]; break; }
    }
    if (concept) {
      const existing = cats.filter(c => {
        const cNorm = aiNormalize(c.name);
        return cNorm.includes(concept.categoria) || concept.categoria.includes(cNorm);
      });
      const label = AI_CONCEPT_LABELS[concept.categoria] || (concept.categoria.charAt(0).toUpperCase() + concept.categoria.slice(1));

      if (existing.length) {
        // já existe categoria pro conceito: a sub-categoria (se houver) é
        // anexada a ela — necessariamente atrelada, nunca solta.
        existing.forEach(c => {
          if (!concept.subcategoria) { add(c.name, null, false, false); return; }
          const hasSub = (c.subs || []).some(s => aiNormalize(s) === aiNormalize(concept.subcategoria));
          add(c.name, concept.subcategoria, false, !hasSub);
        });
      } else {
        // nenhuma categoria serve: cria a categoria pra receber a sub-categoria.
        add(label, concept.subcategoria, true, !!concept.subcategoria);
      }
    }
  }
  return results.slice(0, 4);
}

function onObsInputAi() {
  clearTimeout(_aiSuggestTimer);
  _aiSuggestTimer = setTimeout(runAiSuggestion, 500);
}

function aiSuggestionLabel(s) {
  return s.subcategoria ? `${s.categoria} › ${s.subcategoria}` : s.categoria;
}

function aiSuggestionActionText(s) {
  const label = aiSuggestionLabel(s);
  if (s.isNewCategoria) return `Criar "${label}"?`;
  if (s.isNewSub) return `Adicionar "${s.subcategoria}" em ${s.categoria}?`;
  return 'Sugestão: ' + label;
}

function runAiSuggestion() {
  const tipo = document.getElementById('f-tipo').value;
  const catVal = document.getElementById('f-categoria').value;
  const obs = document.getElementById('f-obs').value;
  const row = document.getElementById('ai-suggest-row');
  if (!tipo || catVal) { hideAiSuggestion(); return; }
  const suggestions = suggestCategoriesFromText(obs, tipo);
  if (!suggestions.length) { hideAiSuggestion(); return; }
  _aiSuggestions = suggestions;

  if (suggestions.length === 1) {
    const s = suggestions[0];
    row.innerHTML =
      '<div class="d-flex align-items-center justify-content-between p-2 rounded-3" style="background:var(--md-sys-color-primary-container);gap:8px">' +
      '<div class="d-flex align-items-center gap-2 small" style="color:var(--md-sys-color-on-primary-container)">' +
      '<span class="material-symbols-outlined" style="font-size:1.1rem">auto_awesome</span>' +
      '<span>' + escapeHtml(aiSuggestionActionText(s)) + '</span></div>' +
      '<button type="button" class="btn btn-sm btn-primary flex-shrink-0" onclick="applyAiSuggestion(0,this)" style="padding:4px 12px">Aplicar</button>' +
      '</div>';
  } else {
    const chips = suggestions.map(function(s, i) {
      return '<button type="button" class="btn btn-sm btn-outline-primary" onclick="applyAiSuggestion(' + i + ',this)" style="padding:4px 10px;font-size:.78rem">' + escapeHtml(aiSuggestionLabel(s)) + '</button>';
    }).join('');
    row.innerHTML =
      '<div class="p-2 rounded-3" style="background:var(--md-sys-color-primary-container)">' +
      '<div class="d-flex align-items-center gap-2 small mb-2" style="color:var(--md-sys-color-on-primary-container)">' +
      '<span class="material-symbols-outlined" style="font-size:1.1rem">auto_awesome</span>' +
      '<span>Qual categoria combina melhor?</span></div>' +
      '<div class="d-flex flex-wrap gap-2">' + chips + '</div>' +
      '</div>';
  }
  row.classList.remove('d-none');
}

function hideAiSuggestion() {
  _aiSuggestions = [];
  const row = document.getElementById('ai-suggest-row');
  if (row) { row.classList.add('d-none'); row.innerHTML = ''; }
}

async function applyAiSuggestion(idx, btnEl) {
  const suggestion = _aiSuggestions[idx];
  if (!suggestion) return;
  const tipo = document.getElementById('f-tipo').value;

  if (suggestion.isNewCategoria || suggestion.isNewSub) {
    setBtnLoading(btnEl, true);
    try {
      let catObj;
      if (suggestion.isNewCategoria) {
        const initialSubs = suggestion.subcategoria ? [suggestion.subcategoria] : [];
        const data = await apiCreateCategory(tipo, suggestion.categoria, '📌');
        catObj = data.category;
        if (initialSubs.length) {
          await apiUpdateCategory(catObj.id, { subs: initialSubs });
          catObj.subs = initialSubs;
        }
        if (!categories[tipo]) categories[tipo] = [];
        categories[tipo].push(catObj);
      } else {
        // categoria já existe, só falta anexar a sub-categoria nova a ela
        catObj = categories[tipo].find(c => c.name === suggestion.categoria);
        if (catObj) {
          const newSubs = catObj.subs.concat([suggestion.subcategoria]);
          await apiUpdateCategory(catObj.id, { subs: newSubs });
          catObj.subs = newSubs;
        }
      }
      populateCatOptions(tipo);
    } catch (e) {
      showToast(e.message, 'error');
      setBtnLoading(btnEl, false);
      return;
    }
    setBtnLoading(btnEl, false);
  }

  csSetValue('f-categoria', suggestion.categoria);
  onCatChange(); // popula sub-categorias e esconde a sugestão
  if (suggestion.subcategoria) {
    csSetValue('f-subcategoria', suggestion.subcategoria);
    onSubCatChange();
  }
}
