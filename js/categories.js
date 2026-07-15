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
    html += '</div>';
    if (ungrouped.length) {
      html += '<div class="small text-secondary fw-semibold" style="margin:20px 0 8px">Sem grupo</div>';
      html += '<div class="text-secondary" style="font-size:.72rem;margin-bottom:8px">Arraste um card pra cima de um grupo pra atribuir.</div>';
      html += '<div class="list-group cat-row-list">';
      html += ungrouped.map(renderDraggableUngroupedCatRow).join('');
      html += '</div>';
    }
  }

  html += '<div class="mt-3 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewGroup()">+ Novo grupo</button></div>';

  el.innerHTML = html;
  initCatDragDrop(el);
}

function renderGroupRow(id, name, count, editable) {
  var idArg = id === null ? 'null' : id;
  var actions = editable
    ? '<button class="btn btn-link text-primary p-0" onclick="event.stopPropagation();startRenameGroup(' + id + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">edit</span></button>' +
      '<button class="btn btn-link text-danger p-0" onclick="event.stopPropagation();confirmDeleteGroup(' + id + ',\'' + _catsTab + '\')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>'
    : '';
  var dropAttrs = editable ? ' data-drop-group-id="' + id + '"' : '';
  return '<div class="list-group-item cat-row-card d-flex align-items-center justify-content-between' + (editable ? ' drop-target-group' : '') + '"' + dropAttrs + ' style="cursor:pointer" onclick="openGroup(' + idArg + ')">' +
    '<div class="d-flex align-items-center gap-2">' +
    '<span class="badge status-cell bg-info-subtle text-info">Grupo</span>' +
    '<span class="fw-normal small">' + escapeHtml(name) + '</span>' +
    '</div>' +
    '<div class="d-flex align-items-center" style="gap:12px">' +
    '<span class="m3-count-badge">' + count + '</span>' + actions +
    '</div></div>';
}

function renderDraggableUngroupedCatRow(c) {
  return '<div class="list-group-item cat-row-card d-flex align-items-center justify-content-between draggable-cat-card" data-cat-id="' + c.id + '" style="cursor:grab" onclick="openCatDetail(' + c.id + ')">' +
    '<div class="d-flex align-items-center gap-2">' +
    '<span class="badge status-cell status-cell-lilac">Cat</span>' +
    '<span class="fw-normal small">' + escapeHtml(c.name) + '</span>' +
    '</div>' +
    '<div class="d-flex align-items-center" style="gap:12px">' +
    '<span class="m3-count-badge">' + c.subs.length + '</span>' +
    '<button class="btn btn-link text-primary p-0" onclick="event.stopPropagation();startRenameCat(' + c.id + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">edit</span></button>' +
    '<button class="btn btn-link text-danger p-0" onclick="event.stopPropagation();confirmDeleteCat(' + c.id + ',\'' + _catsTab + '\')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>' +
    '<span class="material-symbols-outlined text-secondary" style="font-size:1.2rem">drag_indicator</span>' +
    '</div></div>';
}

/* ─────────────── Arrastar categoria sem grupo pra dentro de um grupo ───────────────
   Baseado em pointer events (funciona com mouse e touch) — segue o mesmo
   padrão do swipe dos cards de lançamento em listing.js. */
let _catDrag = null;
const CAT_DRAG_THRESHOLD = 10;

function initCatDragDrop(container) {
  if (!container || container._catDragInited) return;
  container._catDragInited = true;
  container.addEventListener('pointerdown', onCatDragStart);
  container.addEventListener('pointermove', onCatDragMove);
  container.addEventListener('pointerup', onCatDragEnd);
  container.addEventListener('pointercancel', onCatDragEnd);
}

function onCatDragStart(e) {
  if (e.button !== undefined && e.button !== 0) return;
  const card = e.target.closest('.draggable-cat-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  _catDrag = {
    card, catId: parseInt(card.dataset.catId, 10),
    startX: e.clientX, startY: e.clientY,
    offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top,
    width: rect.width, height: rect.height,
    pointerId: e.pointerId, moved: false, ghost: null, overGroup: null,
  };
}

function onCatDragMove(e) {
  if (!_catDrag || e.pointerId !== _catDrag.pointerId) return;
  const dx = e.clientX - _catDrag.startX, dy = e.clientY - _catDrag.startY;
  if (!_catDrag.moved && Math.hypot(dx, dy) > CAT_DRAG_THRESHOLD) {
    _catDrag.moved = true;
    _catDrag.card.style.opacity = '0.35';
    const ghost = _catDrag.card.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.left = '0'; ghost.style.top = '0';
    ghost.style.width = _catDrag.width + 'px';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '2000';
    ghost.style.boxShadow = 'var(--md-sys-elevation-level3)';
    ghost.style.opacity = '0.95';
    document.body.appendChild(ghost);
    _catDrag.ghost = ghost;
  }
  if (!_catDrag.moved) return;
  e.preventDefault();
  const x = e.clientX - _catDrag.offsetX, y = e.clientY - _catDrag.offsetY;
  _catDrag.ghost.style.transform = `translate(${x}px, ${y}px)`;

  const under = document.elementFromPoint(e.clientX, e.clientY);
  const groupEl = under ? under.closest('.drop-target-group') : null;
  if (_catDrag.overGroup !== groupEl) {
    if (_catDrag.overGroup) _catDrag.overGroup.classList.remove('drop-target-active');
    if (groupEl) groupEl.classList.add('drop-target-active');
    _catDrag.overGroup = groupEl;
  }
}

async function onCatDragEnd(e) {
  if (!_catDrag || e.pointerId !== _catDrag.pointerId) return;
  const drag = _catDrag;
  _catDrag = null;

  if (!drag.moved) return; // tap simples: deixa o onclick abrir a categoria normalmente

  drag.card.addEventListener('click', suppressNextCatClick, { once: true, capture: true });
  drag.card.style.opacity = '';
  if (drag.ghost) drag.ghost.remove();
  if (drag.overGroup) drag.overGroup.classList.remove('drop-target-active');

  const groupId = drag.overGroup ? parseInt(drag.overGroup.dataset.dropGroupId, 10) : null;
  if (!groupId) return;

  const tipo = _catsTab;
  const cat = (categories[tipo] || []).find(c => c.id === drag.catId);
  if (!cat) return;
  const prevGroupId = cat.groupId;
  cat.groupId = groupId;
  renderCats();
  try {
    await apiUpdateCategory(drag.catId, { group_id: groupId });
    const g = (catGroups[tipo] || []).find(x => x.id === groupId);
    showToast('Categoria movida pra "' + (g ? g.name : 'grupo') + '".', 'success');
  } catch (err) {
    cat.groupId = prevGroupId;
    renderCats();
    showToast(err.message, 'error');
  }
}

function suppressNextCatClick(e) {
  e.preventDefault();
  e.stopPropagation();
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
  var btn = document.getElementById('new-group-save-btn');
  setBtnLoading(btn, true);
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
    setBtnLoading(btn, false);
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
  setBtnLoading(btn, false);
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

let _savingCat = false;
async function saveNewCat() {
  if (_savingCat) return;
  var inp  = document.getElementById('new-cat-input');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  _savingCat = true;
  var btn = document.getElementById('new-cat-save-btn');
  setBtnLoading(btn, true);
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
    _savingCat = false;
    setBtnLoading(btn, false);
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
  _savingCat = false;
  setBtnLoading(btn, false);
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

let _savingSub = false;
async function saveNewSub() {
  if (_savingSub) return;
  var inp  = document.getElementById('new-sub-input');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  var cat = (categories[_catsTab] || []).find(function(c) { return c.id === _currentCatId; });
  if (!cat) return;
  var newSubs = cat.subs.slice();
  var isEdit  = _subModalEditIdx !== null;
  if (isEdit) newSubs[_subModalEditIdx] = name; else newSubs.push(name);
  _savingSub = true;
  var btn = document.getElementById('new-sub-save-btn');
  setBtnLoading(btn, true);
  try {
    await apiUpdateCategory(cat.id, { subs: newSubs });
    cat.subs = newSubs;
    closeNewSubModal();
    renderCatDetailScreen();
    showToast(isEdit ? 'Sub-categoria renomeada.' : 'Sub-categoria adicionada!', 'success');
  } catch (e) { showToast(e.message, 'error'); }
  _savingSub = false;
  setBtnLoading(btn, false);
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

