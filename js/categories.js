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

const SMART_GROUP_SUGGESTIONS = {
  despesa: [
    { group: 'Moradia', categories: [
      { name: 'Aluguel/Financiamento', subs: ['Condomínio', 'IPTU'] },
      { name: 'Contas de casa', subs: ['Água', 'Luz', 'Internet', 'Gás'] },
    ]},
    { group: 'Transporte', categories: [
      { name: 'Combustível', subs: [] },
      { name: 'Aplicativos', subs: ['Uber', '99'] },
      { name: 'Manutenção', subs: ['Revisão', 'Pneus', 'Estacionamento'] },
    ]},
    { group: 'Alimentação', categories: [
      { name: 'Supermercado', subs: [] },
      { name: 'Restaurantes', subs: ['Delivery'] },
    ]},
    { group: 'Saúde', categories: [
      { name: 'Plano de saúde', subs: [] },
      { name: 'Farmácia', subs: [] },
      { name: 'Consultas e exames', subs: [] },
    ]},
    { group: 'Lazer', categories: [
      { name: 'Streaming', subs: ['Netflix', 'Spotify'] },
      { name: 'Viagens', subs: [] },
    ]},
    { group: 'Educação', categories: [
      { name: 'Cursos', subs: [] },
      { name: 'Mensalidade', subs: [] },
      { name: 'Livros', subs: [] },
    ]},
    { group: 'Pessoais', categories: [
      { name: 'Vestuário', subs: [] },
      { name: 'Cuidados pessoais', subs: [] },
    ]},
  ],
  receita: [
    { group: 'Trabalho', categories: [
      { name: 'Salário', subs: [] },
      { name: 'Freelance', subs: [] },
      { name: 'Bônus/13º', subs: [] },
    ]},
    { group: 'Rendimentos', categories: [
      { name: 'Dividendos', subs: [] },
      { name: 'Juros', subs: [] },
      { name: 'Aluguel recebido', subs: [] },
    ]},
    { group: 'Outros', categories: [
      { name: 'Presentes', subs: [] },
      { name: 'Reembolsos', subs: [] },
    ]},
  ],
  investimento: [
    { group: 'Renda Fixa', categories: [
      { name: 'Tesouro Direto', subs: [] },
      { name: 'CDB', subs: [] },
      { name: 'LCI/LCA', subs: [] },
    ]},
    { group: 'Renda Variável', categories: [
      { name: 'Ações', subs: [] },
      { name: 'Fundos Imobiliários', subs: [] },
      { name: 'ETFs', subs: [] },
    ]},
    { group: 'Reserva', categories: [
      { name: 'Poupança', subs: [] },
      { name: 'Reserva de emergência', subs: [] },
    ]},
  ],
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
  html += '<div class="text-center" style="margin-bottom:16px">' +
    '<button class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2" type="button" onclick="openSmartGroupsModal()" style="padding:10px 24px">' +
    '<span class="material-symbols-outlined" style="font-size:1.1rem">auto_awesome</span>Grupos inteligentes</button></div>';
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

async function saveNewGroup() {
  var inp  = document.getElementById('new-group-input');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
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
  var suggestions = SMART_GROUP_SUGGESTIONS[_catsTab] || [];
  var el = document.getElementById('smart-groups-body');
  if (!el) return;
  if (!suggestions.length) {
    el.innerHTML = '<div class="text-muted small text-center py-4 fst-italic">Nenhuma sugestão disponível.</div>';
    return;
  }
  el.innerHTML = suggestions.map(function(sg, gi) {
    var catsHtml = sg.categories.map(function(cat, ci) {
      var subsHtml = (cat.subs || []).map(function(sub, si) {
        var id = 'sg-sub-' + gi + '-' + ci + '-' + si;
        return '<div class="form-check ms-4">' +
          '<input class="form-check-input" type="checkbox" id="' + id + '" data-g="' + gi + '" data-c="' + ci + '" disabled>' +
          '<label class="form-check-label small" for="' + id + '">' + escapeHtml(sub) + '</label>' +
          '</div>';
      }).join('');
      var catId = 'sg-cat-' + gi + '-' + ci;
      return '<div class="mb-2">' +
        '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" id="' + catId + '" onchange="toggleSmartCatSubs(' + gi + ',' + ci + ')">' +
        '<label class="form-check-label fw-semibold small" for="' + catId + '">' + escapeHtml(cat.name) + '</label>' +
        '</div>' + subsHtml + '</div>';
    }).join('');
    return '<div class="mb-3">' +
      '<div class="text-secondary text-uppercase fw-semibold mb-1" style="font-size:.7rem;letter-spacing:.03em">' + escapeHtml(sg.group) + '</div>' +
      catsHtml + '</div>';
  }).join('');
}

function toggleSmartCatSubs(gi, ci) {
  var catChecked = document.getElementById('sg-cat-' + gi + '-' + ci).checked;
  document.querySelectorAll('input[data-g="' + gi + '"][data-c="' + ci + '"]').forEach(function(cb) {
    cb.disabled = !catChecked;
    cb.checked = catChecked;
  });
}

async function applySmartGroups() {
  var suggestions = SMART_GROUP_SUGGESTIONS[_catsTab] || [];
  var tipo = _catsTab;
  var toCreate = [];
  suggestions.forEach(function(sg, gi) {
    var groupCats = [];
    sg.categories.forEach(function(cat, ci) {
      var catCb = document.getElementById('sg-cat-' + gi + '-' + ci);
      if (!catCb || !catCb.checked) return;
      var subs = [];
      (cat.subs || []).forEach(function(sub, si) {
        var subCb = document.getElementById('sg-sub-' + gi + '-' + ci + '-' + si);
        if (subCb && subCb.checked) subs.push(sub);
      });
      groupCats.push({ name: cat.name, subs: subs });
    });
    if (groupCats.length) toCreate.push({ groupName: sg.group, categories: groupCats });
  });

  if (!toCreate.length) { showToast('Selecione ao menos uma categoria.', 'error'); return; }

  try {
    for (var gi2 = 0; gi2 < toCreate.length; gi2++) {
      var item = toCreate[gi2];
      var existingGroup = (catGroups[tipo] || []).find(function(g) { return g.name.toLowerCase() === item.groupName.toLowerCase(); });
      var groupId;
      if (existingGroup) {
        groupId = existingGroup.id;
      } else {
        var gdata = await apiCreateGroup(tipo, item.groupName);
        if (!catGroups[tipo]) catGroups[tipo] = [];
        catGroups[tipo].push(gdata.group);
        groupId = gdata.group.id;
      }
      for (var ci2 = 0; ci2 < item.categories.length; ci2++) {
        var catItem = item.categories[ci2];
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
}
