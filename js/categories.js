/* ═══════════════════════════════════════
   CATEGORIES
   Fluxo em 3 telas: Categorias (grupos) → Grupo (categorias) →
   Categoria (sub-categorias), navegando via screenStack/goBack().
═══════════════════════════════════════ */
let _catsTab        = 'receita';
let _renamingGroup  = null;   // id do grupo sendo renomeado
let _currentGroupId = undefined; // grupo aberto na tela 2 (null = "Sem grupo")
let _currentCatId   = null;   // categoria aberta na tela 3
let _addingCat      = false;
let _addingSub      = false;

const CATS_TABS = [
  { key: 'receita',      label: 'Receitas',      colorClass: 'status-cell-receita' },
  { key: 'despesa',      label: 'Despesas',      colorClass: 'status-cell-despesa' },
  { key: 'investimento', label: 'Investimentos', colorClass: 'status-cell-investimento' },
];

function switchCatsTab(tipo) {
  _catsTab       = tipo;
  _renamingGroup = null;
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

  if (_renamingGroup !== null) {
    var rid = _renamingGroup;
    setTimeout(function() { var i = document.getElementById('rename-group-' + rid); if (i) { i.focus(); i.select(); } }, 60);
  }
}

function renderGroupRow(id, name, count, editable) {
  var isRenaming = editable && _renamingGroup === id;
  if (isRenaming) {
    return '<div class="list-group-item d-flex align-items-center gap-2 py-2">' +
      '<input type="text" class="form-control form-control-sm flex-grow-1" id="rename-group-' + id + '" value="' + escapeHtml(name) + '"' +
      ' onkeydown="if(event.key===\'Enter\')saveRenameGroup(' + id + ');if(event.key===\'Escape\')cancelRenameGroup()">' +
      '<button class="btn btn-primary btn-sm px-2" onclick="saveRenameGroup(' + id + ')"><span class="material-symbols-outlined" style="font-size:1rem">check</span></button>' +
      '<button class="btn btn-outline-secondary btn-sm px-2" onclick="cancelRenameGroup()"><span class="material-symbols-outlined" style="font-size:1rem">close</span></button>' +
      '</div>';
  }
  var idArg = id === null ? 'null' : id;
  var actions = editable
    ? '<button class="btn btn-link text-secondary p-0 ms-2" onclick="event.stopPropagation();startRenameGroup(' + id + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">edit</span></button>' +
      '<button class="btn btn-link text-danger p-0 ms-1" onclick="event.stopPropagation();confirmDeleteGroup(' + id + ',\'' + _catsTab + '\')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>'
    : '';
  return '<div class="list-group-item d-flex align-items-center justify-content-between" style="cursor:pointer" onclick="openGroup(' + idArg + ')">' +
    '<div>' +
    '<div class="fw-semibold">' + escapeHtml(name) + '</div>' +
    '<div class="text-secondary small">' + count + (count === 1 ? ' categoria' : ' categorias') + '</div>' +
    '</div>' +
    '<div class="d-flex align-items-center">' + actions +
    '<span class="material-symbols-outlined text-secondary ms-1">chevron_right</span>' +
    '</div></div>';
}

function startNewGroup() {
  document.getElementById('new-group-input').value = '';
  document.getElementById('new-group-overlay').classList.add('open');
  document.getElementById('new-group-sheet').classList.add('open');
  setTimeout(function() { document.getElementById('new-group-input').focus(); }, 60);
}
function closeNewGroupModal() {
  document.getElementById('new-group-overlay').classList.remove('open');
  document.getElementById('new-group-sheet').classList.remove('open');
}

async function saveNewGroup() {
  var inp  = document.getElementById('new-group-input');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  try {
    var data = await apiCreateGroup(_catsTab, name);
    if (!catGroups[_catsTab]) catGroups[_catsTab] = [];
    catGroups[_catsTab].push(data.group);
    closeNewGroupModal();
    renderCats();
    showToast('Grupo criado!', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

function startRenameGroup(id) { _renamingGroup = id; renderCats(); }
function cancelRenameGroup() { _renamingGroup = null; renderCats(); }

async function saveRenameGroup(id) {
  var inp  = document.getElementById('rename-group-' + id);
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  try {
    await apiRenameGroup(id, name);
    var g = (catGroups[_catsTab] || []).filter(function(x) { return x.id === id; })[0];
    if (g) g.name = name;
    _renamingGroup = null;
    renderCats();
    showToast('Grupo renomeado.', 'success');
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
  _addingCat = false;
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
  if (!cats.length && !_addingCat) {
    html += '<div class="text-muted small text-center py-4 fst-italic">Nenhuma categoria neste grupo ainda.</div>';
  } else if (cats.length) {
    html += '<div class="list-group">' + cats.map(renderCatRow).join('') + '</div>';
  }

  if (_addingCat) {
    html += '<div class="mt-3 p-2 border rounded-3">' +
      '<div class="d-flex gap-2 align-items-center">' +
      '<input type="text" class="form-control form-control-sm flex-grow-1" id="new-cat-name" placeholder="Nome da categoria"' +
      ' onkeydown="if(event.key===\'Enter\')saveNewCat();if(event.key===\'Escape\')cancelNewCat()">' +
      '<button class="btn btn-primary btn-sm px-2" onclick="saveNewCat()"><span class="material-symbols-outlined" style="font-size:1rem">check</span></button>' +
      '<button class="btn btn-outline-secondary btn-sm px-2" onclick="cancelNewCat()"><span class="material-symbols-outlined" style="font-size:1rem">close</span></button>' +
      '</div></div>';
  } else {
    html += '<div class="mt-3 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewCat()">+ Nova categoria</button></div>';
  }
  el.innerHTML = html;
  if (_addingCat) setTimeout(function() { var i = document.getElementById('new-cat-name'); if (i) i.focus(); }, 60);
}

function renderCatRow(c) {
  return '<div class="list-group-item d-flex align-items-center justify-content-between" style="cursor:pointer" onclick="openCatDetail(' + c.id + ')">' +
    '<div class="fw-semibold">' + escapeHtml(c.name) + '</div>' +
    '<div class="d-flex align-items-center">' +
    '<span class="text-secondary small me-2">' + c.subs.length + (c.subs.length === 1 ? ' sub-categoria' : ' sub-categorias') + '</span>' +
    '<button class="btn btn-link text-danger p-0 me-1" onclick="event.stopPropagation();confirmDeleteCat(' + c.id + ',\'' + _catsTab + '\')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>' +
    '<span class="material-symbols-outlined text-secondary">chevron_right</span>' +
    '</div></div>';
}

function startNewCat() { _addingCat = true; renderCatGroupScreen(); }
function cancelNewCat() { _addingCat = false; renderCatGroupScreen(); }

async function saveNewCat() {
  var nameEl = document.getElementById('new-cat-name');
  var name   = nameEl ? nameEl.value.trim() : '';
  if (!name) { if (nameEl) nameEl.focus(); return; }
  try {
    var data = await apiCreateCategory(_catsTab, name, '📌', _currentGroupId);
    if (!categories[_catsTab]) categories[_catsTab] = [];
    categories[_catsTab].push(data.category);
    _addingCat = false;
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
  _addingSub = false;
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
  if (!cat.subs.length && !_addingSub) {
    html += '<div class="text-muted small text-center py-4 fst-italic">Nenhuma sub-categoria ainda.</div>';
  } else if (cat.subs.length) {
    html += '<div class="list-group">' + cat.subs.map(function(s, i) {
      return '<div class="list-group-item d-flex align-items-center justify-content-between">' +
        '<div class="small">' + escapeHtml(s) + '</div>' +
        '<button class="btn btn-link text-danger p-0" onclick="deleteSub(' + i + ')"><span class="material-symbols-outlined" style="font-size:1.1rem">delete</span></button>' +
        '</div>';
    }).join('') + '</div>';
  }

  if (_addingSub) {
    html += '<div class="mt-3 p-2 border rounded-3">' +
      '<div class="d-flex gap-2 align-items-center">' +
      '<input type="text" class="form-control form-control-sm flex-grow-1" id="new-sub-name" placeholder="Nome da sub-categoria"' +
      ' onkeydown="if(event.key===\'Enter\')saveNewSub();if(event.key===\'Escape\')cancelNewSub()">' +
      '<button class="btn btn-primary btn-sm px-2" onclick="saveNewSub()"><span class="material-symbols-outlined" style="font-size:1rem">check</span></button>' +
      '<button class="btn btn-outline-secondary btn-sm px-2" onclick="cancelNewSub()"><span class="material-symbols-outlined" style="font-size:1rem">close</span></button>' +
      '</div></div>';
  } else {
    html += '<div class="mt-3 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewSub()">+ Nova sub-categoria</button></div>';
  }
  el.innerHTML = html;
  if (_addingSub) setTimeout(function() { var i = document.getElementById('new-sub-name'); if (i) i.focus(); }, 60);
}

function startNewSub() { _addingSub = true; renderCatDetailScreen(); }
function cancelNewSub() { _addingSub = false; renderCatDetailScreen(); }

async function saveNewSub() {
  var inp  = document.getElementById('new-sub-name');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  var cat = (categories[_catsTab] || []).find(function(c) { return c.id === _currentCatId; });
  if (!cat) return;
  var newSubs = cat.subs.concat([name]);
  try {
    await apiUpdateCategory(cat.id, { subs: newSubs });
    cat.subs = newSubs;
    _addingSub = false;
    renderCatDetailScreen();
    showToast('Sub-categoria adicionada!', 'success');
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
