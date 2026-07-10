/* ═══════════════════════════════════════
   CATEGORIES
   Fluxo em 3 telas: Categorias (grupos) → Grupo (categorias) →
   Categoria (sub-categorias), navegando via screenStack/goBack().
═══════════════════════════════════════ */
let _catsTab        = 'receita';
let _groupModalEditId = null; // null = modal em modo criação; id = modo edição
let _currentGroupId = undefined; // grupo aberto na tela 2 (null = "Sem grupo")
let _currentCatId   = null;   // categoria aberta na tela 3
let _catModalEditId = null;   // null = modal de categoria em modo criação; id = modo edição
let _subModalEditIdx = null;  // null = modal de sub-categoria em modo criação; índice = modo edição
let _groupsSortDir  = 'asc';
let _catsSortDir    = 'asc';
let _subsSortDir    = 'asc';

const CATS_TABS = [
  { key: 'receita',      label: 'Receitas',      colorClass: 'status-cell-receita' },
  { key: 'despesa',      label: 'Despesas',      colorClass: 'status-cell-despesa' },
  { key: 'investimento', label: 'Investimentos', colorClass: 'status-cell-investimento' },
];

/* Perguntas curtas de perfil — cada escolha é um sinal específico do
   estilo de vida da pessoa. Quanto mais traços cobertos, mais o
   conjunto final de grupos fica personalizado pra combinação escolhida. */
const SMART_PROFILE_TRAITS = {
  despesa: [
    { key: 'moradia',      label: 'Moro de aluguel ou tenho financiamento', icon: 'home' },
    { key: 'transporte',   label: 'Tenho carro ou uso apps de transporte', icon: 'directions_car' },
    { key: 'alimentacao',  label: 'Faço compras de mercado ou peço delivery', icon: 'restaurant' },
    { key: 'saude',        label: 'Tenho plano de saúde ou consultas frequentes', icon: 'health_and_safety' },
    { key: 'lazer',        label: 'Assino streaming ou saio com frequência', icon: 'live_tv' },
    { key: 'estudos',      label: 'Faço cursos ou pago mensalidade escolar', icon: 'school' },
    { key: 'viagens',      label: 'Viajo com frequência', icon: 'flight' },
    { key: 'pets',         label: 'Tenho animais de estimação', icon: 'pets' },
    { key: 'assinaturas',  label: 'Tenho assinaturas de apps e serviços digitais', icon: 'subscriptions' },
    { key: 'financas',     label: 'Pago anuidade de cartão, tarifas ou juros bancários', icon: 'credit_card' },
    { key: 'seguros',      label: 'Tenho seguros (vida, celular, carro, residência)', icon: 'verified_user' },
    { key: 'filhos',       label: 'Tenho filhos ou dependentes', icon: 'family_restroom' },
    { key: 'compras',      label: 'Compro roupas, eletrônicos ou itens de casa com frequência', icon: 'shopping_bag' },
    { key: 'presentes',    label: 'Compro presentes ou organizo festas com frequência', icon: 'redeem' },
  ],
  receita: [
    { key: 'clt',          label: 'Trabalho com carteira assinada / salário fixo', icon: 'work' },
    { key: 'autonomo',     label: 'Trabalho como autônomo ou freelancer', icon: 'badge' },
    { key: 'rendimentos',  label: 'Recebo rendimentos de investimentos', icon: 'trending_up' },
    { key: 'aluguel',      label: 'Recebo aluguel de imóveis', icon: 'apartment' },
    { key: 'vendas',       label: 'Vendo produtos ou faço bicos/vendas extras', icon: 'sell' },
    { key: 'reembolsos',   label: 'Recebo reembolsos ou restituições com frequência', icon: 'currency_exchange' },
  ],
  investimento: [
    { key: 'renda_fixa',     label: 'Invisto em renda fixa (Tesouro, CDB...)', icon: 'account_balance' },
    { key: 'renda_variavel', label: 'Invisto em renda variável (Ações, FIIs...)', icon: 'show_chart' },
    { key: 'reserva',        label: 'Mantenho uma reserva de emergência', icon: 'savings' },
    { key: 'cripto',         label: 'Invisto em criptomoedas', icon: 'currency_bitcoin' },
    { key: 'previdencia',    label: 'Contribuo pra previdência privada ou aposentadoria', icon: 'elderly' },
  ],
};

/* Cada escolha traz um grupo já bem preenchido com categorias e
   sub-categorias — cobrindo também os gastos extras e corriqueiros do
   dia a dia daquele domínio, não apenas o item principal marcado. */
const SMART_TRAIT_GROUPS = {
  despesa: {
    moradia: { group: 'Moradia', categories: [
      { name: 'Aluguel/Financiamento', subs: ['Condomínio', 'IPTU', 'Seguro residencial'] },
      { name: 'Contas de casa', subs: ['Água', 'Luz', 'Internet', 'Gás', 'TV a cabo'] },
      { name: 'Manutenção do lar', subs: ['Reparos', 'Móveis e utensílios', 'Diarista/Faxina', 'Jardinagem'] },
      { name: 'Produtos de limpeza e higiene', subs: [] },
    ]},
    transporte: { group: 'Transporte', categories: [
      { name: 'Combustível', subs: [] },
      { name: 'Aplicativos', subs: ['Uber', '99'] },
      { name: 'Manutenção', subs: ['Revisão', 'Pneus', 'Lavagem'] },
      { name: 'Transporte público', subs: ['Ônibus', 'Metrô'] },
      { name: 'Documentação do veículo', subs: ['IPVA', 'Licenciamento', 'Estacionamento', 'Multas'] },
    ]},
    alimentacao: { group: 'Alimentação', categories: [
      { name: 'Supermercado', subs: ['Feira', 'Hortifruti', 'Açougue'] },
      { name: 'Restaurantes', subs: ['Delivery', 'Lanches'] },
      { name: 'Padaria e conveniência', subs: ['Café', 'Bebidas'] },
    ]},
    saude: { group: 'Saúde', categories: [
      { name: 'Plano de saúde', subs: [] },
      { name: 'Farmácia', subs: ['Medicamentos', 'Suplementos'] },
      { name: 'Consultas e exames', subs: ['Médico', 'Dentista', 'Psicólogo'] },
      { name: 'Academia e bem-estar', subs: [] },
    ]},
    lazer: { group: 'Lazer', categories: [
      { name: 'Streaming', subs: ['Netflix', 'Spotify', 'Prime Video'] },
      { name: 'Saídas', subs: ['Cinema', 'Shows', 'Bares'] },
      { name: 'Hobbies', subs: ['Jogos', 'Livros'] },
    ]},
    estudos: { group: 'Educação', categories: [
      { name: 'Cursos', subs: ['Idiomas'] },
      { name: 'Mensalidade', subs: [] },
      { name: 'Livros e material', subs: [] },
    ]},
    viagens: { group: 'Viagens', categories: [
      { name: 'Passagens', subs: [] },
      { name: 'Hospedagem', subs: [] },
      { name: 'Passeios', subs: ['Alimentação em viagem', 'Souvenirs'] },
    ]},
    pets: { group: 'Pets', categories: [
      { name: 'Alimentação pet', subs: [] },
      { name: 'Veterinário', subs: ['Consultas', 'Vacinas', 'Medicamentos'] },
      { name: 'Higiene e acessórios', subs: ['Banho e tosa'] },
    ]},
    assinaturas: { group: 'Assinaturas', categories: [
      { name: 'Serviços digitais', subs: ['Armazenamento em nuvem', 'Aplicativos'] },
      { name: 'Publicações', subs: ['Jornais e revistas'] },
    ]},
    financas: { group: 'Finanças pessoais', categories: [
      { name: 'Cartão de crédito', subs: ['Anuidade', 'Juros'] },
      { name: 'Tarifas bancárias', subs: [] },
      { name: 'Empréstimos', subs: [] },
    ]},
    seguros: { group: 'Seguros', categories: [
      { name: 'Seguro de vida', subs: [] },
      { name: 'Seguro do celular', subs: [] },
      { name: 'Seguro do carro', subs: [] },
    ]},
    filhos: { group: 'Filhos e dependentes', categories: [
      { name: 'Escola/Creche', subs: [] },
      { name: 'Vestuário infantil', subs: [] },
      { name: 'Atividades extracurriculares', subs: [] },
      { name: 'Saúde infantil', subs: [] },
    ]},
    compras: { group: 'Compras', categories: [
      { name: 'Vestuário e calçados', subs: [] },
      { name: 'Eletrônicos', subs: [] },
      { name: 'Casa e decoração', subs: [] },
    ]},
    presentes: { group: 'Presentes e ocasiões', categories: [
      { name: 'Presentes', subs: [] },
      { name: 'Festas e comemorações', subs: [] },
    ]},
  },
  receita: {
    clt: { group: 'Trabalho', categories: [
      { name: 'Salário', subs: ['Vale-alimentação', 'Vale-transporte'] },
      { name: 'Bônus/13º', subs: ['Férias', 'PLR'] },
    ]},
    autonomo: { group: 'Trabalho', categories: [
      { name: 'Freelance', subs: [] },
      { name: 'Prestação de serviços', subs: [] },
      { name: 'Consultoria', subs: [] },
    ]},
    rendimentos: { group: 'Rendimentos', categories: [
      { name: 'Dividendos', subs: [] },
      { name: 'Juros', subs: [] },
      { name: 'Rendimento de fundos', subs: [] },
    ]},
    aluguel: { group: 'Rendimentos', categories: [
      { name: 'Aluguel recebido', subs: [] },
    ]},
    vendas: { group: 'Vendas', categories: [
      { name: 'Vendas online', subs: [] },
      { name: 'Bicos/Freelas extras', subs: [] },
    ]},
    reembolsos: { group: 'Outros recebimentos', categories: [
      { name: 'Reembolsos', subs: [] },
      { name: 'Restituição de IR', subs: [] },
      { name: 'Presentes recebidos', subs: [] },
    ]},
  },
  investimento: {
    renda_fixa: { group: 'Renda Fixa', categories: [
      { name: 'Tesouro Direto', subs: [] },
      { name: 'CDB', subs: [] },
      { name: 'LCI/LCA', subs: [] },
    ]},
    renda_variavel: { group: 'Renda Variável', categories: [
      { name: 'Ações', subs: [] },
      { name: 'Fundos Imobiliários', subs: [] },
      { name: 'ETFs', subs: ['BDRs'] },
    ]},
    reserva: { group: 'Reserva', categories: [
      { name: 'Poupança', subs: [] },
      { name: 'Reserva de emergência', subs: [] },
    ]},
    cripto: { group: 'Cripto', categories: [
      { name: 'Bitcoin', subs: [] },
      { name: 'Altcoins', subs: ['Staking/Rendimentos'] },
    ]},
    previdencia: { group: 'Previdência', categories: [
      { name: 'PGBL', subs: [] },
      { name: 'VGBL', subs: [] },
    ]},
  },
};

function switchCatsTab(tipo) {
  _catsTab = tipo;
  renderCats();
}

function byNameAlpha(dir) {
  return function(a, b) {
    var cmp = a.localeCompare(b, 'pt-BR', { sensitivity: 'base' });
    return dir === 'asc' ? cmp : -cmp;
  };
}

function renderAlphaSortRow(dir, ascCall, descCall) {
  return '<div style="display:flex;justify-content:center;align-items:center;gap:16px;margin-bottom:12px">' +
    '<a href="#" class="' + (dir === 'asc' ? 'text-primary' : 'text-secondary') + ' text-decoration-none d-inline-flex align-items-center gap-1" onclick="' + ascCall + ';return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_upward</span><span class="material-symbols-outlined" style="font-size:.9rem">sort_by_alpha</span></a>' +
    '<a href="#" class="' + (dir === 'desc' ? 'text-primary' : 'text-secondary') + ' text-decoration-none d-inline-flex align-items-center gap-1" onclick="' + descCall + ';return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_downward</span><span class="material-symbols-outlined" style="font-size:.9rem">sort_by_alpha</span></a>' +
    '</div>';
}

function sortGroups(dir) { _groupsSortDir = dir; renderCats(); }
function sortCatsInGroup(dir) { _catsSortDir = dir; renderCatGroupScreen(); }
function sortSubs(dir) { _subsSortDir = dir; renderCatDetailScreen(); }

/* ─────────────── TELA 1: CATEGORIAS (lista de grupos) ─────────────── */
function renderCats() {
  var el = document.getElementById('cats-body');
  if (!el) return;

  CATS_TABS.forEach(function(t) {
    var btn = document.getElementById('cats-tab-' + t.key);
    if (!btn) return;
    var active = t.key === _catsTab;
    btn.className = 'badge status-cell d-inline-flex align-items-center ' + (active ? t.colorClass : 'status-cell-white');
  });

  var tipo      = _catsTab;
  var groups    = (catGroups[tipo]  || []).slice().sort(function(a, b) { return byNameAlpha(_groupsSortDir)(a.name, b.name); });
  var allCats   = categories[tipo] || [];
  var ungrouped = allCats.filter(function(c) { return !c.groupId; });

  var html = '';
  if (!groups.length && !ungrouped.length) {
    html += '<div class="text-muted small text-center py-4 fst-italic">Nenhum grupo encontrado.</div>';
  } else {
    html += renderAlphaSortRow(_groupsSortDir, "sortGroups('asc')", "sortGroups('desc')");
    html += '<div class="list-group cat-row-list">';
    html += groups.map(function(g) {
      var count = allCats.filter(function(c) { return c.groupId === g.id; }).length;
      return renderGroupRow(g.id, g.name, count, true);
    }).join('');
    if (ungrouped.length) html += renderGroupRow(null, 'Sem grupo', ungrouped.length, false);
    html += '</div>';
  }

  html += '<div class="mt-3 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewGroup()">+ Novo grupo</button></div>';
  html += '<div class="text-center" style="margin-top:16px">' +
    '<button class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2" type="button" onclick="openSmartGroupsModal()" style="padding:10px 24px">' +
    '<span class="material-symbols-outlined" style="font-size:1.1rem">auto_awesome</span>Grupos inteligentes</button></div>';

  el.innerHTML = html;
}

function renderGroupRow(id, name, count, editable) {
  var idArg = id === null ? 'null' : id;
  var actions = editable
    ? '<button class="btn btn-link text-primary p-0" onclick="event.stopPropagation();startRenameGroup(' + id + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">edit</span></button>' +
      '<button class="btn btn-link text-danger p-0" onclick="event.stopPropagation();confirmDeleteGroup(' + id + ',\'' + _catsTab + '\')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>'
    : '';
  return '<div class="list-group-item cat-row-card d-flex align-items-center justify-content-between" style="cursor:pointer" onclick="openGroup(' + idArg + ')">' +
    '<div class="d-flex align-items-center gap-2">' +
    '<span class="badge status-cell bg-info-subtle text-info">Grupo</span>' +
    '<span class="fw-normal small">' + escapeHtml(name) + '</span>' +
    '</div>' +
    '<div class="d-flex align-items-center" style="gap:12px">' +
    '<span class="m3-count-badge">' + count + '</span>' + actions +
    '</div></div>';
}

function startNewGroup() {
  _groupModalEditId = null;
  document.getElementById('new-group-modal-title').textContent = 'Novo grupo';
  document.getElementById('new-group-save-btn').textContent = 'Criar';
  document.getElementById('new-group-input').value = '';
  openNewGroupModal();
}

function startRenameGroup(id) {
  var g = (catGroups[_catsTab] || []).find(function(x) { return x.id === id; });
  if (!g) return;
  _groupModalEditId = id;
  document.getElementById('new-group-modal-title').textContent = 'Editar grupo';
  document.getElementById('new-group-save-btn').textContent = 'Salvar';
  document.getElementById('new-group-input').value = g.name;
  openNewGroupModal();
}

function openNewGroupModal() {
  document.getElementById('new-group-overlay').classList.add('open');
  document.getElementById('new-group-sheet').classList.add('open');
  setTimeout(function() { var i = document.getElementById('new-group-input'); i.focus(); i.select(); }, 60);
}
function closeNewGroupModal() {
  document.getElementById('new-group-overlay').classList.remove('open');
  document.getElementById('new-group-sheet').classList.remove('open');
  _groupModalEditId = null;
}

let _savingGroup = false;
function groupNameExists(tipo, name, excludeId) {
  var norm = name.trim().toLowerCase();
  return (catGroups[tipo] || []).some(function(g) {
    return g.id !== excludeId && g.name.trim().toLowerCase() === norm;
  });
}

async function saveNewGroup() {
  if (_savingGroup) return;
  var inp  = document.getElementById('new-group-input');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  if (groupNameExists(_catsTab, name, _groupModalEditId)) {
    showToast('Já existe um grupo com esse nome.', 'error');
    return;
  }
  _savingGroup = true;
  if (_groupModalEditId !== null) {
    var editId = _groupModalEditId;
    try {
      await apiRenameGroup(editId, name);
      var g = (catGroups[_catsTab] || []).find(function(x) { return x.id === editId; });
      if (g) g.name = name;
      closeNewGroupModal();
      renderCats();
      showToast('Grupo renomeado.', 'success');
    } catch (e) { showToast(e.message, 'error'); }
    _savingGroup = false;
    return;
  }
  try {
    var data = await apiCreateGroup(_catsTab, name);
    if (!catGroups[_catsTab]) catGroups[_catsTab] = [];
    catGroups[_catsTab].push(data.group);
    closeNewGroupModal();
    renderCats();
    showToast('Grupo criado!', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  _savingGroup = false;
}

function confirmDeleteGroup(id, tipo) {
  document.getElementById('modal-title').textContent = 'Remover grupo?';
  document.getElementById('modal-desc').textContent  = 'O grupo e todas as suas categorias e subcategorias serão removidos.';
  document.getElementById('modal-confirm-btn').onclick = async function() {
    hideConfirmModal();
    try {
      await apiDeleteGroup(id);
      catGroups[tipo] = (catGroups[tipo] || []).filter(function(g) { return g.id !== id; });
      categories[tipo] = (categories[tipo] || []).filter(function(c) { return c.groupId !== id; });
      renderCats();
      showToast('Grupo removido.', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };
  showConfirmModal();
}

/* ─────────────── TELA 2: CATEGORIAS DE UM GRUPO ─────────────── */
function openGroup(groupId) {
  _currentGroupId = groupId;
  showScreen('cat-group');
  renderCatGroupScreen();
}

function renderCatGroupScreen() {
  var tipo    = _catsTab;
  var groupId = _currentGroupId;
  var group   = groupId !== null ? (catGroups[tipo] || []).find(function(g) { return g.id === groupId; }) : null;
  var titleEl = document.getElementById('cat-group-title');
  if (titleEl) titleEl.textContent = group ? group.name : 'Sem grupo';

  var cats = (categories[tipo] || []).filter(function(c) {
    return groupId === null ? !c.groupId : c.groupId === groupId;
  }).sort(function(a, b) { return byNameAlpha(_catsSortDir)(a.name, b.name); });

  var el = document.getElementById('cat-group-body');
  if (!el) return;
  var html = '';
  if (!cats.length) {
    html += '<div class="text-muted small text-center py-4 fst-italic">Nenhuma categoria neste grupo ainda.</div>';
  } else {
    html += renderAlphaSortRow(_catsSortDir, "sortCatsInGroup('asc')", "sortCatsInGroup('desc')");
    html += '<div class="list-group cat-row-list">' + cats.map(renderCatRow).join('') + '</div>';
  }

  html += '<div class="mt-3 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewCat()">+ Nova categoria</button></div>';
  el.innerHTML = html;
}

function renderCatRow(c) {
  return '<div class="list-group-item cat-row-card d-flex align-items-center justify-content-between" style="cursor:pointer" onclick="openCatDetail(' + c.id + ')">' +
    '<div class="d-flex align-items-center gap-2">' +
    '<span class="badge status-cell status-cell-lilac">Cat</span>' +
    '<span class="fw-normal small">' + escapeHtml(c.name) + '</span>' +
    '</div>' +
    '<div class="d-flex align-items-center" style="gap:12px">' +
    '<span class="m3-count-badge">' + c.subs.length + '</span>' +
    '<button class="btn btn-link text-primary p-0" onclick="event.stopPropagation();startRenameCat(' + c.id + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">edit</span></button>' +
    '<button class="btn btn-link text-danger p-0" onclick="event.stopPropagation();confirmDeleteCat(' + c.id + ',\'' + _catsTab + '\')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>' +
    '</div></div>';
}

function startNewCat() {
  _catModalEditId = null;
  document.getElementById('new-cat-modal-title').textContent = 'Nova categoria';
  document.getElementById('new-cat-save-btn').textContent = 'Criar';
  document.getElementById('new-cat-input').value = '';
  openNewCatModal();
}

function startRenameCat(id) {
  var c = (categories[_catsTab] || []).find(function(x) { return x.id === id; });
  if (!c) return;
  _catModalEditId = id;
  document.getElementById('new-cat-modal-title').textContent = 'Editar categoria';
  document.getElementById('new-cat-save-btn').textContent = 'Salvar';
  document.getElementById('new-cat-input').value = c.name;
  openNewCatModal();
}

function openNewCatModal() {
  document.getElementById('new-cat-overlay').classList.add('open');
  document.getElementById('new-cat-sheet').classList.add('open');
  setTimeout(function() { var i = document.getElementById('new-cat-input'); i.focus(); i.select(); }, 60);
}
function closeNewCatModal() {
  document.getElementById('new-cat-overlay').classList.remove('open');
  document.getElementById('new-cat-sheet').classList.remove('open');
  _catModalEditId = null;
}

async function saveNewCat() {
  var inp  = document.getElementById('new-cat-input');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  if (_catModalEditId !== null) {
    var editId = _catModalEditId;
    try {
      await apiUpdateCategory(editId, { name: name });
      var c = (categories[_catsTab] || []).find(function(x) { return x.id === editId; });
      if (c) c.name = name;
      closeNewCatModal();
      renderCatGroupScreen();
      showToast('Categoria renomeada.', 'success');
    } catch (e) { showToast(e.message, 'error'); }
    return;
  }
  try {
    var data = await apiCreateCategory(_catsTab, name, '📌', _currentGroupId);
    if (!categories[_catsTab]) categories[_catsTab] = [];
    categories[_catsTab].push(data.category);
    closeNewCatModal();
    renderCatGroupScreen();
    showToast('Categoria criada!', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

function confirmDeleteCat(id, tipo) {
  document.getElementById('modal-title').textContent = 'Remover categoria?';
  document.getElementById('modal-desc').textContent  = 'Esta ação não pode ser desfeita.';
  document.getElementById('modal-confirm-btn').onclick = async function() {
    hideConfirmModal();
    try {
      await apiDeleteCategory(id);
      categories[tipo] = (categories[tipo] || []).filter(function(c) { return c.id !== id; });
      renderCatGroupScreen();
      showToast('Categoria removida.', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };
  showConfirmModal();
}

/* ─────────────── TELA 3: SUB-CATEGORIAS DE UMA CATEGORIA ─────────────── */
function openCatDetail(catId) {
  _currentCatId = catId;
  showScreen('cat-detail');
  renderCatDetailScreen();
}

function renderCatDetailScreen() {
  var tipo = _catsTab;
  var cat  = (categories[tipo] || []).find(function(c) { return c.id === _currentCatId; });
  if (!cat) { goBack(); return; }
  var group = cat.groupId ? (catGroups[tipo] || []).find(function(g) { return g.id === cat.groupId; }) : null;

  var bc = document.getElementById('cat-detail-breadcrumb');
  var ti = document.getElementById('cat-detail-title');
  if (bc) bc.textContent = group ? group.name : 'Sem grupo';
  if (ti) ti.textContent = cat.name;

  var el = document.getElementById('cat-detail-body');
  if (!el) return;
  var html = '';
  if (!cat.subs.length) {
    html += '<div class="text-muted small text-center py-4 fst-italic">Nenhuma sub-categoria ainda.</div>';
  } else {
    var subsIndexed = cat.subs.map(function(s, i) { return { name: s, idx: i }; })
      .sort(function(a, b) { return byNameAlpha(_subsSortDir)(a.name, b.name); });
    html += renderAlphaSortRow(_subsSortDir, "sortSubs('asc')", "sortSubs('desc')");
    html += '<div class="list-group cat-row-list">' + subsIndexed.map(function(item) {
      return '<div class="list-group-item cat-row-card d-flex align-items-center justify-content-between">' +
        '<div class="d-flex align-items-center gap-2">' +
        '<span class="badge status-cell status-cell-success">Sub</span>' +
        '<span class="small">' + escapeHtml(item.name) + '</span>' +
        '</div>' +
        '<div class="d-flex align-items-center" style="gap:12px">' +
        '<button class="btn btn-link text-primary p-0" onclick="startRenameSub(' + item.idx + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">edit</span></button>' +
        '<button class="btn btn-link text-danger p-0" onclick="deleteSub(' + item.idx + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>' +
        '</div></div>';
    }).join('') + '</div>';
  }

  html += '<div class="mt-3 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewSub()">+ Nova sub-categoria</button></div>';
  el.innerHTML = html;
}

function startNewSub() {
  _subModalEditIdx = null;
  document.getElementById('new-sub-modal-title').textContent = 'Nova sub-categoria';
  document.getElementById('new-sub-save-btn').textContent = 'Criar';
  document.getElementById('new-sub-input').value = '';
  openNewSubModal();
}

function startRenameSub(idx) {
  var cat = (categories[_catsTab] || []).find(function(c) { return c.id === _currentCatId; });
  if (!cat) return;
  _subModalEditIdx = idx;
  document.getElementById('new-sub-modal-title').textContent = 'Editar sub-categoria';
  document.getElementById('new-sub-save-btn').textContent = 'Salvar';
  document.getElementById('new-sub-input').value = cat.subs[idx];
  openNewSubModal();
}

function openNewSubModal() {
  document.getElementById('new-sub-overlay').classList.add('open');
  document.getElementById('new-sub-sheet').classList.add('open');
  setTimeout(function() { var i = document.getElementById('new-sub-input'); i.focus(); i.select(); }, 60);
}
function closeNewSubModal() {
  document.getElementById('new-sub-overlay').classList.remove('open');
  document.getElementById('new-sub-sheet').classList.remove('open');
  _subModalEditIdx = null;
}

async function saveNewSub() {
  var inp  = document.getElementById('new-sub-input');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  var cat = (categories[_catsTab] || []).find(function(c) { return c.id === _currentCatId; });
  if (!cat) return;
  var newSubs = cat.subs.slice();
  var isEdit  = _subModalEditIdx !== null;
  if (isEdit) newSubs[_subModalEditIdx] = name; else newSubs.push(name);
  try {
    await apiUpdateCategory(cat.id, { subs: newSubs });
    cat.subs = newSubs;
    closeNewSubModal();
    renderCatDetailScreen();
    showToast(isEdit ? 'Sub-categoria renomeada.' : 'Sub-categoria adicionada!', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

async function deleteSub(idx) {
  var cat = (categories[_catsTab] || []).find(function(c) { return c.id === _currentCatId; });
  if (!cat) return;
  var newSubs = cat.subs.filter(function(_, i) { return i !== idx; });
  try {
    await apiUpdateCategory(cat.id, { subs: newSubs });
    cat.subs = newSubs;
    renderCatDetailScreen();
    showToast('Sub-categoria removida.', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

/* ─────────────── GRUPOS INTELIGENTES ─────────────── */
function openSmartGroupsModal() {
  renderSmartGroupsModal();
  document.getElementById('smart-groups-overlay').classList.add('open');
  document.getElementById('smart-groups-sheet').classList.add('open');
}
function closeSmartGroupsModal() {
  document.getElementById('smart-groups-overlay').classList.remove('open');
  document.getElementById('smart-groups-sheet').classList.remove('open');
}

function renderSmartGroupsModal() {
  var traits = SMART_PROFILE_TRAITS[_catsTab] || [];
  var el = document.getElementById('smart-groups-body');
  if (!el) return;
  if (!traits.length) {
    el.innerHTML = '<div class="text-muted small text-center py-4 fst-italic">Nenhuma sugestão disponível.</div>';
    return;
  }
  el.innerHTML = traits.map(function(t) {
    var id = 'sg-trait-' + t.key;
    return '<div class="form-check d-flex align-items-center gap-2 py-2" style="border-bottom:1px solid var(--md-sys-color-outline-variant)">' +
      '<input class="form-check-input mt-0" type="checkbox" id="' + id + '" style="flex-shrink:0">' +
      '<span class="material-symbols-outlined text-secondary" style="font-size:1.2rem">' + t.icon + '</span>' +
      '<label class="form-check-label small" for="' + id + '">' + escapeHtml(t.label) + '</label>' +
      '</div>';
  }).join('');
}

let _savingSmartGroups = false;

async function applySmartGroups() {
  if (_savingSmartGroups) return;
  var traits = SMART_PROFILE_TRAITS[_catsTab] || [];
  var traitGroups = SMART_TRAIT_GROUPS[_catsTab] || {};
  var tipo = _catsTab;

  var byGroupName = {};
  traits.forEach(function(t) {
    var cb = document.getElementById('sg-trait-' + t.key);
    if (!cb || !cb.checked) return;
    var def = traitGroups[t.key];
    if (!def) return;
    var groupKey = def.group.trim();
    if (!byGroupName[groupKey]) byGroupName[groupKey] = [];
    def.categories.forEach(function(cat) {
      var existing = byGroupName[groupKey].find(function(c) { return c.name.toLowerCase() === cat.name.toLowerCase(); });
      if (existing) {
        cat.subs.forEach(function(s) { if (existing.subs.indexOf(s) === -1) existing.subs.push(s); });
      } else {
        byGroupName[groupKey].push({ name: cat.name, subs: cat.subs.slice() });
      }
    });
  });

  var groupNames = Object.keys(byGroupName);
  if (!groupNames.length) { showToast('Marque ao menos uma opção para montar seus grupos.', 'error'); return; }

  _savingSmartGroups = true;
  var saveBtn = document.getElementById('smart-groups-save-btn');
  var cancelBtn = document.getElementById('smart-groups-cancel-btn');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Criando...'; }
  if (cancelBtn) cancelBtn.disabled = true;

  try {
    for (var gi = 0; gi < groupNames.length; gi++) {
      var groupName = groupNames[gi];
      var groupCats = byGroupName[groupName];
      var existingGroup = (catGroups[tipo] || []).find(function(g) { return g.name.trim().toLowerCase() === groupName.toLowerCase(); });
      var groupId;
      if (existingGroup) {
        groupId = existingGroup.id;
      } else {
        var gdata = await apiCreateGroup(tipo, groupName);
        if (!catGroups[tipo]) catGroups[tipo] = [];
        catGroups[tipo].push(gdata.group);
        groupId = gdata.group.id;
      }
      for (var ci = 0; ci < groupCats.length; ci++) {
        var catItem = groupCats[ci];
        var existingCat = (categories[tipo] || []).find(function(c) { return c.groupId === groupId && c.name.toLowerCase() === catItem.name.toLowerCase(); });
        if (existingCat) {
          var mergedSubs = existingCat.subs.slice();
          catItem.subs.forEach(function(s) { if (mergedSubs.indexOf(s) === -1) mergedSubs.push(s); });
          if (mergedSubs.length !== existingCat.subs.length) {
            await apiUpdateCategory(existingCat.id, { subs: mergedSubs });
            existingCat.subs = mergedSubs;
          }
        } else {
          var cdata = await apiCreateCategory(tipo, catItem.name, '📌', groupId);
          if (catItem.subs.length) {
            await apiUpdateCategory(cdata.category.id, { subs: catItem.subs });
            cdata.category.subs = catItem.subs;
          }
          if (!categories[tipo]) categories[tipo] = [];
          categories[tipo].push(cdata.category);
        }
      }
    }
    closeSmartGroupsModal();
    renderCats();
    showToast('Grupos inteligentes criados!', 'success');
  } catch (e) { showToast(e.message, 'error'); }

  _savingSmartGroups = false;
  if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Criar grupos'; }
  if (cancelBtn) cancelBtn.disabled = false;
}
