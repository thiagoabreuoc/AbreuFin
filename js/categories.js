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

const CATS_TABS = [
  { key: 'receita',      label: 'Receitas',      colorClass: 'status-cell-receita' },
  { key: 'despesa',      label: 'Despesas',      colorClass: 'status-cell-despesa' },
  { key: 'investimento', label: 'Investimentos', colorClass: 'status-cell-investimento' },
];

function switchCatsTab(tipo) {
  _catsTab = tipo;
  renderCats();
}

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
  var groups    = catGroups[tipo]  || [];
  var allCats   = categories[tipo] || [];
  var ungrouped = allCats.filter(function(c) { return !c.groupId; });

  var html = '';
  if (!groups.length && !ungrouped.length) {
    html += '<div class="text-muted small text-center py-4 fst-italic">Nenhum grupo encontrado.</div>';
  } else {
    html += '<div class="list-group">';
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
  return '<div class="list-group-item d-flex align-items-center justify-content-between" style="cursor:pointer" onclick="openGroup(' + idArg + ')">' +
    '<div>' +
    '<div class="fw-semibold">' + escapeHtml(name) + '</div>' +
    '<div class="text-secondary small">' + count + (count === 1 ? ' categoria' : ' categorias') + '</div>' +
    '</div>' +
    '<div class="d-flex align-items-center" style="gap:12px">' + actions +
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
  });

  var el = document.getElementById('cat-group-body');
  if (!el) return;
  var html = '';
  if (!cats.length) {
    html += '<div class="text-muted small text-center py-4 fst-italic">Nenhuma categoria neste grupo ainda.</div>';
  } else {
    html += '<div class="list-group">' + cats.map(renderCatRow).join('') + '</div>';
  }

  html += '<div class="mt-3 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewCat()">+ Nova categoria</button></div>';
  el.innerHTML = html;
}

function renderCatRow(c) {
  return '<div class="list-group-item d-flex align-items-center justify-content-between" style="cursor:pointer" onclick="openCatDetail(' + c.id + ')">' +
    '<div class="fw-semibold">' + escapeHtml(c.name) + '</div>' +
    '<div class="d-flex align-items-center" style="gap:12px">' +
    '<span class="text-secondary small">' + c.subs.length + (c.subs.length === 1 ? ' sub-categoria' : ' sub-categorias') + '</span>' +
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
    html += '<div class="list-group">' + cat.subs.map(function(s, i) {
      return '<div class="list-group-item d-flex align-items-center justify-content-between">' +
        '<div class="small">' + escapeHtml(s) + '</div>' +
        '<div class="d-flex align-items-center" style="gap:12px">' +
        '<button class="btn btn-link text-primary p-0" onclick="startRenameSub(' + i + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">edit</span></button>' +
        '<button class="btn btn-link text-danger p-0" onclick="deleteSub(' + i + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>' +
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
