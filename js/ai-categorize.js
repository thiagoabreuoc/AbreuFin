/* ═══════════════════════════════════════
   CATEGORIZAÇÃO POR IA
   Heurística local (sem chamada externa): casa palavras-chave (incluindo
   frases de duas palavras, ex. "lava jato") do texto da Observação
   contra as categorias/sub-categorias que o usuário já tem cadastradas.

   Cada palavra-chave aponta pra um conceito {categoria, subcategoria} —
   sempre o nome de uma CATEGORIA concreta (o mesmo padrão criado pelo
   "Grupos inteligentes"), nunca o nome de um grupo. O dicionário é
   separado por tipo (despesa/receita/investimento) pra "aluguel" em
   despesa não colidir com "aluguel" (recebido) em receita, por exemplo.

   Toda sub-categoria sugerida precisa necessariamente estar vinculada a
   uma categoria: se existir uma categoria que já sirva pro conceito, a
   sub é anexada a ela; se nenhuma servir, a categoria é criada junto.
═══════════════════════════════════════ */
function K(categoria, subcategoria) { return { categoria: categoria, subcategoria: subcategoria || null }; }

const AI_CATEGORY_KEYWORDS = {
  despesa: {
    // Transporte
    uber: K('Aplicativos', 'Uber'), '99': K('Aplicativos', '99'),
    combustivel: K('Combustível'), gasolina: K('Combustível'), posto: K('Combustível'),
    pedagio: K('Documentação do veículo', 'Pedágio'), estacionamento: K('Documentação do veículo', 'Estacionamento'),
    ipva: K('Documentação do veículo', 'IPVA'), multa: K('Documentação do veículo', 'Multas'), licenciamento: K('Documentação do veículo', 'Licenciamento'),
    onibus: K('Transporte público', 'Ônibus'), metro: K('Transporte público', 'Metrô'),
    oficina: K('Manutenção'), mecanico: K('Manutenção'), pneu: K('Manutenção', 'Pneus'), revisao: K('Manutenção', 'Revisão'),
    'lava jato': K('Manutenção', 'Lavagem'), lavajato: K('Manutenção', 'Lavagem'), 'lava rapido': K('Manutenção', 'Lavagem'), lavagem: K('Manutenção', 'Lavagem'),
    alcool: K('Combustível'), etanol: K('Combustível'), 'troca de oleo': K('Manutenção', 'Revisão'), oleo: K('Manutenção', 'Revisão'),
    'corrida de app': K('Aplicativos'),
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
    manicure: K('Cuidados pessoais'), pedicure: K('Cuidados pessoais'), cabeleireiro: K('Cuidados pessoais'),
    barbearia: K('Cuidados pessoais'), 'salao de beleza': K('Cuidados pessoais'), estetica: K('Cuidados pessoais'), depilacao: K('Cuidados pessoais'),
    // Lazer / Viagens
    netflix: K('Streaming', 'Netflix'), spotify: K('Streaming', 'Spotify'), streaming: K('Streaming'),
    'prime video': K('Streaming', 'Prime Video'), 'amazon prime': K('Streaming', 'Prime Video'), disney: K('Streaming'), 'disney plus': K('Streaming'), hbo: K('Streaming'),
    cinema: K('Saídas', 'Cinema'), show: K('Saídas', 'Shows'), bar: K('Saídas', 'Bares'), 'happy hour': K('Saídas', 'Bares'), passeio: K('Saídas'),
    jogo: K('Hobbies', 'Jogos'), videogame: K('Hobbies', 'Jogos'), 'video game': K('Hobbies', 'Jogos'),
    viagem: K('Passagens'), passagem: K('Passagens'), hospedagem: K('Hospedagem'), hotel: K('Hospedagem'),
    // Educação
    curso: K('Cursos'), idioma: K('Cursos', 'Idiomas'), faculdade: K('Mensalidade'), mensalidade: K('Mensalidade'), escola: K('Mensalidade'),
    livro: K('Livros e material'), material: K('Livros e material'),
    // Pets / Presentes / Compras / Seguros
    veterinario: K('Veterinário'), racao: K('Alimentação pet'), petshop: K('Higiene e acessórios'), 'banho e tosa': K('Higiene e acessórios'),
    presente: K('Presentes'), lembranca: K('Presentes'), aniversario: K('Festas e comemorações'), festa: K('Festas e comemorações'),
    roupa: K('Vestuário e calçados'), vestuario: K('Vestuário e calçados'), calcado: K('Vestuário e calçados'), tenis: K('Vestuário e calçados'), mochila: K('Vestuário e calçados'),
    eletronico: K('Eletrônicos'), celular: K('Eletrônicos'), iphone: K('Eletrônicos'), notebook: K('Eletrônicos'), computador: K('Eletrônicos'), tablet: K('Eletrônicos'), 'fone de ouvido': K('Eletrônicos'),
    seguro: K('Seguro de vida'),
    revista: K('Publicações', 'Jornais e revistas'), jornal: K('Publicações', 'Jornais e revistas'),
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
    premio: K('Outros recebimentos', 'Prêmio'), heranca: K('Outros recebimentos', 'Herança'),
    doacao: K('Outros recebimentos', 'Doação'), 'doacao recebida': K('Outros recebimentos', 'Doação'),
    'pix recebido': K('Outros recebimentos', 'Pix'),
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
      return code < 0x0300 || code > 0x036f; // remove marcas de acentuação combinadas
    }).join('')
    .replace(/[-_]/g, ' ') // "lava-a-jato" -> "lava a jato", pra casar frases do dicionário
    .trim();
}

// Compara com inclusão nos dois sentidos: cobre tanto "digitei mais do que
// o nome" (ex. "pagamento da restituicao") quanto "o nome é mais longo/no
// plural do que eu digitei" (ex. digitei "reembolso", categoria é "Reembolsos").
function aiMatches(normText, normName) {
  if (normName.length < 3) return false;
  return normText.includes(normName) || normName.includes(normText);
}

// Palavras de ligação removidas só na hora de casar frases do dicionário
// (ex.: "lava-a-jato" -> "lava a jato" -> "lava jato", batendo com a chave
// "lava jato" mesmo com o "a" no meio). Não usado nos passos 1/2, que
// comparam o nome completo da categoria do usuário.
const AI_STOPWORDS = ['a', 'o', 'as', 'os', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'com', 'e', 'ao', 'um', 'uma'];
function aiStripStopwords(norm) {
  return norm.split(' ').filter(function(w) { return w && AI_STOPWORDS.indexOf(w) === -1; }).join(' ');
}

// Casa uma chave do dicionário (já sem stopwords) contra o texto (já sem
// stopwords). Se não bater como substring exata — o que falha em variações
// de gênero/plural/conjugação, ex. "faxina" (chave) vs "faxineira" (digitado)
// — cai pro fallback de radical: pra chaves de uma palavra só, considera
// bate se o radical comum entre a chave e alguma palavra do texto for longo
// o bastante pra não ser coincidência (ex. "jardin" em "jardinagem"/"jardineiro").
function aiKeyMatches(compactText, key) {
  const strippedKey = aiStripStopwords(key);
  if (compactText.includes(strippedKey)) return true;
  if (strippedKey.indexOf(' ') !== -1) return false; // radical só pra chave de 1 palavra
  const words = compactText.split(' ');
  for (const w of words) {
    const commonLen = aiCommonPrefixLength(w, strippedKey);
    if (commonLen >= 5 && commonLen >= Math.min(w.length, strippedKey.length) - 4) return true;
  }
  return false;
}

function aiCommonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
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
      if (aiMatches(norm, aiNormalize(s))) add(c.name, s, false, false);
    }
  }
  // 2) casa direto contra nomes de categorias que o usuário já tem
  for (const c of cats) {
    if (aiMatches(norm, aiNormalize(c.name))) add(c.name, null, false, false);
  }
  // 3) dicionário de palavras-chave (inclui frases de 2 palavras) -> conceito
  // {categoria, subcategoria}, só entra em jogo se nada acima bateu. Ordena
  // as chaves da mais longa pra mais curta, pra "lava jato" vencer antes de
  // qualquer palavra isolada mais genérica. Dicionário é específico do tipo
  // (evita "aluguel" de despesa colidir com "aluguel recebido" de receita).
  if (!results.length) {
    const dict = AI_CATEGORY_KEYWORDS[tipo] || {};
    const compact = aiStripStopwords(norm);
    const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
    let concept = null;
    for (const key of keys) {
      if (aiKeyMatches(compact, key)) { concept = dict[key]; break; }
    }
    if (concept) {
      const existing = cats.filter(c => aiMatches(aiNormalize(c.name), aiNormalize(concept.categoria)) || aiMatches(aiNormalize(concept.categoria), aiNormalize(c.name)));

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
        add(concept.categoria, concept.subcategoria, true, !!concept.subcategoria);
      }
    }
  }
  // 4) fallback universal: nada bateu nas categorias do usuário nem no
  // dicionário (é impossível prever toda palavra possível) — sugere criar
  // uma categoria nova com o próprio texto digitado, garantindo que toda
  // palavra digitada gere ao menos uma opção em vez de nada aparecer.
  if (!results.length) {
    const label = text.trim().replace(/\s+/g, ' ');
    add(label.charAt(0).toUpperCase() + label.slice(1), null, true, false);
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
  const aiText = document.getElementById('f-ai-input').value;
  const row = document.getElementById('ai-suggest-row');
  if (!tipo) { hideAiSuggestion(); return; }

  // campo de categorização inteligente vazio: desmarca categoria/sub-categoria
  // pra permitir que uma nova palavra digitada gere uma sugestão do zero.
  if (!aiText.trim()) {
    csReset('f-categoria');
    onCatChange();
    return;
  }

  let suggestions = suggestCategoriesFromText(aiText, tipo);
  if (!suggestions.length) { hideAiSuggestion(); return; }

  // não repete uma sugestão idêntica ao que já está selecionado no
  // formulário — mas continua sugerindo se o usuário seguir digitando
  // e o texto passar a apontar pra outra categoria/sub-categoria.
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
  } else {
    // categoria/sub já existiam desde antes: garante que o select reflete
    // o estado atual de categories[tipo] mesmo assim, por segurança.
    populateCatOptions(tipo);
  }

  csSetValue('f-categoria', suggestion.categoria);
  onCatChange(); // popula sub-categorias e esconde a sugestão
  if (suggestion.subcategoria) {
    csSetValue('f-subcategoria', suggestion.subcategoria);
    onSubCatChange();
  }

  // sugestão pré-estabelecida: não precisa abrir o acordeon. Categoria ou
  // sub-categoria nova: abre pra mostrar o que foi criado.
  if (suggestion.isNewCategoria || suggestion.isNewSub) openCatAccordion();
}
