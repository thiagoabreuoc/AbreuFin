/* ═══════════════════════════════════════
   CATEGORIZAÇÃO POR IA (hierárquica: Grupo › Categoria › Sub-categoria)
   Heurística local (sem chamada externa): casa palavras-chave do texto
   digitado contra os grupos/categorias/sub-categorias que o usuário já
   tem, contra a taxonomia padrão (SMART_TRAIT_GROUPS, a mesma usada nos
   "Grupos inteligentes") e, por fim, contra um dicionário de termos
   coloquiais (ex. "uber", "ifood"). Sempre devolve o caminho completo
   Grupo › Categoria › Sub-categoria — nenhuma categoria fica sem grupo.
═══════════════════════════════════════ */
function K(categoria, subcategoria) { return { categoria: categoria, subcategoria: subcategoria || null }; }

const AI_CATEGORY_KEYWORDS = {
  despesa: {
    // Transporte
    uber: K('Aplicativos', 'Uber'), '99': K('Aplicativos', '99'),
    combustivel: K('Combustível'), gasolina: K('Combustível'), posto: K('Combustível'),
    alcool: K('Combustível'), etanol: K('Combustível'), 'corrida de app': K('Aplicativos'),
    pedagio: K('Documentação do veículo', 'Pedágio'), estacionamento: K('Documentação do veículo', 'Estacionamento'),
    ipva: K('Documentação do veículo', 'IPVA'), multa: K('Documentação do veículo', 'Multas'), licenciamento: K('Documentação do veículo', 'Licenciamento'),
    onibus: K('Transporte público', 'Ônibus'), metro: K('Transporte público', 'Metrô'),
    oficina: K('Manutenção'), mecanico: K('Manutenção'), pneu: K('Manutenção', 'Pneus'), revisao: K('Manutenção', 'Revisão'),
    'lava jato': K('Manutenção', 'Lavagem'), lavajato: K('Manutenção', 'Lavagem'), 'lava rapido': K('Manutenção', 'Lavagem'), lavagem: K('Manutenção', 'Lavagem'),
    'troca de oleo': K('Manutenção', 'Revisão'), oleo: K('Manutenção', 'Revisão'),
    // Alimentação
    mercado: K('Supermercado'), supermercado: K('Supermercado'), feira: K('Supermercado', 'Feira'), acougue: K('Supermercado', 'Açougue'), hortifruti: K('Supermercado', 'Hortifruti'),
    'compras do mes': K('Supermercado'),
    ifood: K('Restaurantes', 'Delivery'), delivery: K('Restaurantes', 'Delivery'), lanchonete: K('Restaurantes', 'Lanches'),
    restaurante: K('Restaurantes'), pizza: K('Restaurantes'), hamburguer: K('Restaurantes'),
    padaria: K('Padaria e conveniência'), acai: K('Padaria e conveniência'), sorvete: K('Padaria e conveniência'), cafe: K('Padaria e conveniência', 'Café'),
    // Moradia
    aluguel: K('Aluguel/Financiamento'), financiamento: K('Aluguel/Financiamento'),
    condominio: K('Aluguel/Financiamento', 'Condomínio'), iptu: K('Aluguel/Financiamento', 'IPTU'),
    luz: K('Contas de casa', 'Luz'), energia: K('Contas de casa', 'Luz'), agua: K('Contas de casa', 'Água'),
    gas: K('Contas de casa', 'Gás'), internet: K('Contas de casa', 'Internet'), wifi: K('Contas de casa', 'Internet'),
    faxina: K('Manutenção do lar', 'Diarista/Faxina'), diarista: K('Manutenção do lar', 'Diarista/Faxina'),
    encanador: K('Manutenção do lar', 'Reparos'), eletricista: K('Manutenção do lar', 'Reparos'), jardinagem: K('Manutenção do lar', 'Jardinagem'),
    'produtos de limpeza': K('Produtos de limpeza e higiene'), limpeza: K('Produtos de limpeza e higiene'),
    // Saúde
    farmacia: K('Farmácia'), remedio: K('Farmácia', 'Medicamentos'), suplemento: K('Farmácia', 'Suplementos'),
    medico: K('Consultas e exames', 'Médico'), consulta: K('Consultas e exames'), exame: K('Consultas e exames'),
    dentista: K('Consultas e exames', 'Dentista'), hospital: K('Consultas e exames'), psicologo: K('Consultas e exames', 'Psicólogo'),
    academia: K('Academia e bem-estar'),
    'plano de saude': K('Plano de saúde'),
    oculos: K('Consultas e exames'), 'oculos de grau': K('Consultas e exames'),
    // Lazer
    netflix: K('Streaming', 'Netflix'), spotify: K('Streaming', 'Spotify'), streaming: K('Streaming'),
    'prime video': K('Streaming', 'Prime Video'), 'amazon prime': K('Streaming', 'Prime Video'), disney: K('Streaming'), 'disney plus': K('Streaming'), hbo: K('Streaming'),
    cinema: K('Saídas', 'Cinema'), show: K('Saídas', 'Shows'), bar: K('Saídas', 'Bares'), 'happy hour': K('Saídas', 'Bares'), passeio: K('Saídas'),
    jogo: K('Hobbies', 'Jogos'), videogame: K('Hobbies', 'Jogos'), 'video game': K('Hobbies', 'Jogos'),
    // Viagens
    viagem: K('Passagens'), passagem: K('Passagens'), hospedagem: K('Hospedagem'), hotel: K('Hospedagem'), souvenir: K('Passeios', 'Souvenirs'),
    // Educação
    curso: K('Cursos'), idioma: K('Cursos', 'Idiomas'), faculdade: K('Mensalidade'), mensalidade: K('Mensalidade'), escola: K('Mensalidade'),
    livro: K('Livros e material'), material: K('Livros e material'),
    // Pets
    veterinario: K('Veterinário'), racao: K('Alimentação pet'), petshop: K('Higiene e acessórios'), 'banho e tosa': K('Higiene e acessórios'),
    // Assinaturas
    'nuvem': K('Serviços digitais', 'Armazenamento em nuvem'), icloud: K('Serviços digitais', 'Armazenamento em nuvem'), 'google one': K('Serviços digitais', 'Armazenamento em nuvem'),
    revista: K('Publicações', 'Jornais e revistas'), jornal: K('Publicações', 'Jornais e revistas'),
    // Finanças pessoais
    anuidade: K('Cartão de crédito', 'Anuidade'), fatura: K('Cartão de crédito'), 'tarifa bancaria': K('Tarifas bancárias'), tarifa: K('Tarifas bancárias'),
    emprestimo: K('Empréstimos'), consignado: K('Empréstimos'),
    // Seguros
    'seguro de vida': K('Seguro de vida'), 'seguro do celular': K('Seguro do celular'), 'seguro do carro': K('Seguro do carro'),
    seguro: K('Seguro de vida'),
    // Filhos
    creche: K('Escola/Creche'),
    // Compras / Presentes
    roupa: K('Vestuário e calçados'), vestuario: K('Vestuário e calçados'), calcado: K('Vestuário e calçados'), tenis: K('Vestuário e calçados'), mochila: K('Vestuário e calçados'),
    eletronico: K('Eletrônicos'), celular: K('Eletrônicos'), iphone: K('Eletrônicos'), notebook: K('Eletrônicos'), computador: K('Eletrônicos'), tablet: K('Eletrônicos'), 'fone de ouvido': K('Eletrônicos'),
    decoracao: K('Casa e decoração'), moveis: K('Casa e decoração'),
    presente: K('Presentes'), lembranca: K('Presentes'), aniversario: K('Festas e comemorações'), festa: K('Festas e comemorações'),
    manicure: K('Presentes'), // cuidados pessoais avulsos entram como gasto de ocasião até criar categoria própria
  },
  receita: {
    salario: K('Salário'), pagamento: K('Salário'),
    'vale alimentacao': K('Salário', 'Vale-alimentação'), 'vale transporte': K('Salário', 'Vale-transporte'),
    freelance: K('Freelance'), 'prestacao de servico': K('Prestação de serviços'), consultoria: K('Consultoria'),
    bonus: K('Bônus/13º'), decimoterceiro: K('Bônus/13º'), 'decimo terceiro': K('Bônus/13º'), ferias: K('Bônus/13º', 'Férias'), plr: K('Bônus/13º', 'PLR'),
    dividendo: K('Dividendos'), juros: K('Juros'), rendimento: K('Rendimento de fundos'),
    'aluguel recebido': K('Aluguel recebido'), inquilino: K('Aluguel recebido'),
    venda: K('Vendas online'), bico: K('Bicos/Freelas extras'),
    reembolso: K('Reembolsos'), cashback: K('Reembolsos'), restituicao: K('Restituição de IR'), 'imposto de renda': K('Restituição de IR'),
    presente: K('Presentes recebidos'),
  },
  investimento: {
    tesouro: K('Tesouro Direto'), cdb: K('CDB'), lci: K('LCI/LCA'), lca: K('LCI/LCA'),
    acao: K('Ações'), acoes: K('Ações'), fii: K('Fundos Imobiliários'), 'fundo imobiliario': K('Fundos Imobiliários'), etf: K('ETFs'), bdr: K('ETFs', 'BDRs'),
    bitcoin: K('Bitcoin'), altcoin: K('Altcoins'), ethereum: K('Altcoins'), cripto: K('Bitcoin'), criptomoeda: K('Bitcoin'),
    poupanca: K('Poupança'), reserva: K('Reserva de emergência'),
    pgbl: K('PGBL'), vgbl: K('VGBL'), previdencia: K('PGBL'),
  },
};

let _aiSuggestTimer = null;
let _aiSuggestions = [];

function aiNormalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .split('').filter(function(ch) {
      var code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f;
    }).join('')
    .replace(/[-_]/g, ' ')
    .trim();
}

function aiMatches(normText, normName) {
  if (normName.length < 3) return false;
  return normText.includes(normName) || normName.includes(normText);
}

const AI_STOPWORDS = ['a', 'o', 'as', 'os', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'com', 'e', 'ao', 'um', 'uma'];
function aiStripStopwords(norm) {
  return norm.split(' ').filter(function(w) { return w && AI_STOPWORDS.indexOf(w) === -1; }).join(' ');
}

function aiCommonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

// Casa uma chave do dicionário contra o texto digitado; se não bater como
// substring exata (falha em variação de gênero/plural, ex. "faxina" vs
// "faxineira"), cai pro fallback de radical comum pra chaves de 1 palavra.
function aiKeyMatches(compactText, key) {
  const strippedKey = aiStripStopwords(key);
  if (compactText.includes(strippedKey)) return true;
  if (strippedKey.indexOf(' ') !== -1) return false;
  const words = compactText.split(' ');
  for (const w of words) {
    const commonLen = aiCommonPrefixLength(w, strippedKey);
    if (commonLen >= 5 && commonLen >= Math.min(w.length, strippedKey.length) - 4) return true;
  }
  return false;
}

// Grupos que não existem na taxonomia padrão (SMART_TRAIT_GROUPS) mas que
// o dicionário de palavras-chave às vezes referencia.
const AI_GROUP_FALLBACK_OVERRIDES = {
  'cuidados pessoais': 'Saúde',
  'recebimentos diversos': 'Outros recebimentos',
};
function aiGroupNameForCategoria(tipo, categoriaName) {
  const traitGroups = SMART_TRAIT_GROUPS[tipo] || {};
  const normName = aiNormalize(categoriaName);
  for (const key of Object.keys(traitGroups)) {
    const def = traitGroups[key];
    for (const c of def.categories) {
      if (aiNormalize(c.name) === normName) return def.group;
    }
  }
  return AI_GROUP_FALLBACK_OVERRIDES[normName] || 'Outros';
}

/* ─────────────── Sugestão hierárquica (Grupo › Categoria › Sub) ─────────────── */
function suggestPathsFromText(text, tipo) {
  const norm = aiNormalize(text);
  if (norm.length < 3) return [];
  const cats = categories[tipo] || [];
  const groups = catGroups[tipo] || [];
  const results = [];
  const seen = {};

  function groupNameFor(groupId) {
    const g = groupId ? groups.find(x => x.id === groupId) : null;
    return g ? g.name : 'Outros';
  }
  function isNewGroupName(name) {
    return !groups.some(g => g.name.toLowerCase() === name.toLowerCase());
  }
  function add(grupo, categoria, subcategoria, isNewGrupo, isNewCategoria, isNewSub) {
    const key = grupo + '|' + categoria + '|' + (subcategoria || '');
    if (seen[key]) return;
    seen[key] = true;
    results.push({
      grupo: grupo, categoria: categoria, subcategoria: subcategoria || null,
      isNewGrupo: !!isNewGrupo, isNewCategoria: !!isNewCategoria, isNewSub: !!isNewSub,
    });
  }

  // 1) sub-categorias que o usuário já tem — pode haver mais de uma sub
  // com o mesmo nome em categorias diferentes, então todas viram opções.
  for (const c of cats) {
    for (const s of (c.subs || [])) {
      if (aiMatches(norm, aiNormalize(s))) add(groupNameFor(c.groupId), c.name, s, false, false, false);
    }
  }
  // 2) categorias que o usuário já tem
  for (const c of cats) {
    if (aiMatches(norm, aiNormalize(c.name))) add(groupNameFor(c.groupId), c.name, null, false, false, false);
  }
  // 3) taxonomia padrão (SMART_TRAIT_GROUPS) — categoria/sub que o usuário
  // ainda não tem, mas que já existe no "catálogo" de Grupos inteligentes.
  if (!results.length) {
    const traitGroups = SMART_TRAIT_GROUPS[tipo] || {};
    for (const key of Object.keys(traitGroups)) {
      const def = traitGroups[key];
      for (const catDef of def.categories) {
        for (const sub of (catDef.subs || [])) {
          if (aiMatches(norm, aiNormalize(sub))) add(def.group, catDef.name, sub, isNewGroupName(def.group), true, true);
        }
        if (aiMatches(norm, aiNormalize(catDef.name))) add(def.group, catDef.name, null, isNewGroupName(def.group), true, false);
      }
    }
  }
  // 4) dicionário de termos coloquiais (ex. "uber", "ifood"), só entra em
  // jogo se nada acima bateu. Ordena as chaves da mais longa pra mais
  // curta, pra frases de 2 palavras vencerem antes de um termo genérico.
  if (!results.length) {
    const dict = AI_CATEGORY_KEYWORDS[tipo] || {};
    const compact = aiStripStopwords(norm);
    const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
    let concept = null;
    for (const key of keys) {
      if (aiKeyMatches(compact, key)) { concept = dict[key]; break; }
    }
    if (concept) {
      const grupo = aiGroupNameForCategoria(tipo, concept.categoria);
      const existing = cats.filter(c => aiMatches(aiNormalize(c.name), aiNormalize(concept.categoria)) || aiMatches(aiNormalize(concept.categoria), aiNormalize(c.name)));
      if (existing.length) {
        existing.forEach(c => {
          const g = groupNameFor(c.groupId);
          if (!concept.subcategoria) { add(g, c.name, null, false, false, false); return; }
          const hasSub = (c.subs || []).some(s => aiNormalize(s) === aiNormalize(concept.subcategoria));
          add(g, c.name, concept.subcategoria, false, false, !hasSub);
        });
      } else {
        add(grupo, concept.categoria, concept.subcategoria, isNewGroupName(grupo), true, !!concept.subcategoria);
      }
    }
  }
  // 5) fallback universal: nada bateu em lugar nenhum — sugere criar uma
  // categoria nova com o próprio texto digitado, dentro do grupo "Outros",
  // garantindo que toda palavra digitada gere ao menos uma sugestão.
  if (!results.length) {
    const label = text.trim().replace(/\s+/g, ' ');
    const titled = label.charAt(0).toUpperCase() + label.slice(1);
    add('Outros', titled, null, isNewGroupName('Outros'), true, false);
  }
  return results.slice(0, 4);
}

function onAiFieldInput() {
  clearTimeout(_aiSuggestTimer);
  _aiSuggestTimer = setTimeout(runAiSuggestion, 500);
}

/* ─────────────── Acordeon Categoria/Sub-categoria ─────────────── */
let _catAccordionOpen = false;
function applyCatAccordionState() {
  const body = document.getElementById('cat-accordion-body');
  const chevron = document.getElementById('cat-accordion-chevron');
  if (body) body.classList.toggle('d-none', !_catAccordionOpen);
  if (chevron) chevron.style.transform = _catAccordionOpen ? 'rotate(180deg)' : '';
}
function toggleCatAccordion() {
  _catAccordionOpen = !_catAccordionOpen;
  applyCatAccordionState();
}
function openCatAccordion() {
  _catAccordionOpen = true;
  applyCatAccordionState();
}
function closeCatAccordion() {
  _catAccordionOpen = false;
  applyCatAccordionState();
}

function aiSuggestionLabel(s) {
  let label = s.grupo + ' › ' + s.categoria;
  if (s.subcategoria) label += ' › ' + s.subcategoria;
  return label;
}

function aiSuggestionActionText(s) {
  const label = aiSuggestionLabel(s);
  if (s.isNewGrupo || s.isNewCategoria) return `Criar "${label}"?`;
  if (s.isNewSub) return `Adicionar "${s.subcategoria}" em ${s.grupo} › ${s.categoria}?`;
  return 'Sugestão: ' + label;
}

function runAiSuggestion() {
  const tipo = document.getElementById('f-tipo').value;
  const aiText = document.getElementById('f-ai-input').value;
  const row = document.getElementById('ai-suggest-row');
  if (!tipo) { hideAiSuggestion(); return; }

  if (!aiText.trim()) {
    csReset('f-categoria');
    onCatChange();
    return;
  }

  let suggestions = suggestPathsFromText(aiText, tipo);
  if (!suggestions.length) { hideAiSuggestion(); return; }

  const curCat = document.getElementById('f-categoria').value;
  const curSub = document.getElementById('f-subcategoria').value;
  suggestions = suggestions.filter(s => !(s.categoria === curCat && (s.subcategoria || '') === (curSub || '')));
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
      '<span>Qual caminho combina melhor?</span></div>' +
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

async function aiEnsureGroup(tipo, groupName) {
  if (!catGroups[tipo]) catGroups[tipo] = [];
  const existing = catGroups[tipo].find(g => g.name.trim().toLowerCase() === groupName.toLowerCase());
  if (existing) return existing.id;
  const data = await apiCreateGroup(tipo, groupName);
  catGroups[tipo].push(data.group);
  return data.group.id;
}

async function applyAiSuggestion(idx, btnEl) {
  const suggestion = _aiSuggestions[idx];
  if (!suggestion) return;
  const tipo = document.getElementById('f-tipo').value;

  if (suggestion.isNewGrupo || suggestion.isNewCategoria || suggestion.isNewSub) {
    setBtnLoading(btnEl, true);
    try {
      const groupId = await aiEnsureGroup(tipo, suggestion.grupo);
      let catObj = categories[tipo].find(c => c.name === suggestion.categoria);
      if (!catObj) {
        const initialSubs = suggestion.subcategoria ? [suggestion.subcategoria] : [];
        const data = await apiCreateCategory(tipo, suggestion.categoria, '📌', groupId);
        catObj = data.category;
        if (initialSubs.length) {
          await apiUpdateCategory(catObj.id, { subs: initialSubs });
          catObj.subs = initialSubs;
        }
        if (!categories[tipo]) categories[tipo] = [];
        categories[tipo].push(catObj);
      } else if (suggestion.subcategoria && !(catObj.subs || []).includes(suggestion.subcategoria)) {
        const newSubs = catObj.subs.concat([suggestion.subcategoria]);
        await apiUpdateCategory(catObj.id, { subs: newSubs });
        catObj.subs = newSubs;
      }
      populateCatOptions(tipo);
    } catch (e) {
      showToast(e.message, 'error');
      setBtnLoading(btnEl, false);
      return;
    }
    setBtnLoading(btnEl, false);
  } else {
    // caminho já existia inteiro: garante que o select reflete o estado
    // atual de categories[tipo] mesmo assim, por segurança.
    populateCatOptions(tipo);
  }

  csSetValue('f-categoria', suggestion.categoria);
  onCatChange();
  if (suggestion.subcategoria) {
    csSetValue('f-subcategoria', suggestion.subcategoria);
    onSubCatChange();
  }

  // caminho pré-estabelecido: não precisa abrir o acordeon. Grupo,
  // categoria ou sub nova: abre pra mostrar o que foi criado.
  if (suggestion.isNewGrupo || suggestion.isNewCategoria || suggestion.isNewSub) openCatAccordion();
}
