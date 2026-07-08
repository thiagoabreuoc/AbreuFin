/* ═══════════════════════════════════════
   CATEGORIES
═══════════════════════════════════════ */
const _expandedCats   = new Set();
const _expandedGroups = new Set();
let _catsTab       = 'receita';
let _addingGroup   = false;
let _renamingGroup = null;       // group id being renamed
let _addingCatGroup = null;      // null=closed  0=sem-grupo  N=group id
let _addingSub      = null;       // { id, tipo }

const CATS_TABS = [
  { key: 'receita',      label: 'Receitas',      color: 'text-success' },
  { key: 'despesa',      label: 'Despesas',      color: 'text-danger'  },
  { key: 'investimento', label: 'Investimentos', color: 'text-info'    },
];

function _tipoColor(tipo) {
  return tipo === 'receita' ? 'text-success' : tipo === 'despesa' ? 'text-danger' : 'text-info';
}

function switchCatsTab(tipo) {
  _catsTab        = tipo;
  _addingGroup    = false;
  _renamingGroup  = null;
  _addingCatGroup = null;
  _addingSub      = null;
  renderCats();
}

/* ─────────────── RENDER PRINCIPAL ─────────────── */
function renderCats() {
  var el = document.getElementById('cats-body');
  if (!el) return;

  CATS_TABS.forEach(function(t) {
    var btn = document.getElementById('cats-tab-' + t.key);
    if (!btn) return;
    btn.className = 'btn btn-sm rounded-pill ' + (t.key === _catsTab ? 'btn-primary' : 'bg-transparent text-primary');
    btn.style.border = 'none';
  });

  var tipo   = _catsTab;
  var groups = catGroups[tipo]  || [];
  var allCats = categories[tipo] || [];
  var html = '';

  if (groups.length === 0) {
    html += renderFlatSection(tipo, allCats);
  } else {
    groups.forEach(function(g) {
      var gCats = allCats.filter(function(c) { return c.groupId === g.id; });
      html += renderGroup(tipo, g, gCats);
    });
    var ungrouped = allCats.filter(function(c) { return !c.groupId; });
    if (ungrouped.length) html += renderUngroupedSection(tipo, ungrouped);
  }

  // Botão / formulário Novo grupo
  if (_addingGroup) {
    html += '<div class="mt-3 p-2 border rounded-3">' +
      '<div class="d-flex gap-2 align-items-center">' +
      '<input type="text" class="form-control form-control-sm flex-grow-1" id="new-group-name" placeholder="Nome do grupo"' +
      ' onkeydown="if(event.key===\'Enter\')saveNewGroup();if(event.key===\'Escape\')cancelNewGroup()">' +
      '<button class="btn btn-primary btn-sm px-2" onclick="saveNewGroup()"><span class="material-symbols-outlined" style="font-size:1rem">check</span></button>' +
      '<button class="btn btn-outline-secondary btn-sm px-2" onclick="cancelNewGroup()"><span class="material-symbols-outlined" style="font-size:1rem">close</span></button>' +
      '</div></div>';
  } else {
    html += '<div class="mt-2 text-center"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewGroup()">Novo grupo</button></div>';
  }

  el.innerHTML = html;

  // Auto-focus
  if (_addingGroup) {
    setTimeout(function() { var i = document.getElementById('new-group-name'); if (i) i.focus(); }, 60);
  } else if (_renamingGroup !== null) {
    var rid = _renamingGroup;
    setTimeout(function() { var i = document.getElementById('rename-group-' + rid); if (i) { i.focus(); i.select(); } }, 60);
  } else if (_addingCatGroup !== null) {
    var cg = _addingCatGroup;
    setTimeout(function() { var i = document.getElementById('new-cat-name-' + cg); if (i) i.focus(); }, 60);
  } else if (_addingSub !== null) {
    var sid = _addingSub.id;
    setTimeout(function() { var i = document.getElementById('new-sub-' + sid); if (i) i.focus(); }, 60);
  }
}

/* ─────────────── SEÇÕES ─────────────── */
function renderFlatSection(tipo, cats) {
  var items = cats.map(function(c) { return renderCatItem(tipo, c); }).join('');
  var empty = '<div class="text-muted small text-center py-4 fst-italic">' +
    'Crie um <strong>grupo</strong> para começar a adicionar categorias.</div>';
  return '<div class="mb-1">' + (items || empty) + '</div>';
}

function renderGroup(tipo, g, gCats) {
  var isOpen     = _expandedGroups.has(g.id);
  var isRenaming = _renamingGroup === g.id;
  var headerHtml;

  if (isRenaming) {
    headerHtml =
      '<div class="d-flex align-items-center px-3 py-2 gap-2">' +
      '<input type="text" class="form-control form-control-sm flex-grow-1" id="rename-group-' + g.id +
      '" value="' + escapeHtml(g.name) + '"' +
      ' onkeydown="if(event.key===\'Enter\')saveRenameGroup(' + g.id + ');if(event.key===\'Escape\')cancelRenameGroup()">' +
      '<button class="btn btn-primary btn-sm px-2" onclick="saveRenameGroup(' + g.id + ')"><span class="material-symbols-outlined" style="font-size:1rem">check</span></button>' +
      '<button class="btn btn-outline-secondary btn-sm px-2" onclick="cancelRenameGroup()"><span class="material-symbols-outlined" style="font-size:1rem">close</span></button>' +
      '</div>';
  } else {
    headerHtml =
      '<div class="d-flex align-items-center px-3 py-2 gap-2" style="cursor:pointer" onclick="toggleGroupExpand(' + g.id + ')">' +
      '<span class="badge bg-info-subtle text-info fw-semibold" style="font-size:.65rem">Grupo</span>' +
      '<span class="flex-grow-1">' + escapeHtml(g.name) + '</span>' +
      '<span class="text-muted small">' + gCats.length + '</span>' +
      '<span class="material-symbols-outlined text-secondary me-1" style="font-size:1.1rem">' + (isOpen ? 'expand_less' : 'expand_more') + '</span>' +
      '<button class="btn btn-link text-secondary p-0" onclick="event.stopPropagation();startRenameGroup(' + g.id + ')">' +
      '<span class="material-symbols-outlined" style="font-size:.9rem">edit</span></button>' +
      '<button class="btn btn-link text-primary p-0 ms-1" onclick="event.stopPropagation();confirmDeleteGroup(' + g.id + ',\'' + tipo + '\')">' +
      '<span class="material-symbols-outlined" style="font-size:.95rem">delete</span></button>' +
      '</div>';
  }

  var content = '';
  if (isOpen || isRenaming) {
    var catItems = gCats.map(function(c) { return renderCatItem(tipo, c); }).join('');
    var emptyMsg = !catItems && _addingCatGroup !== g.id
      ? '<div class="text-muted small fst-italic py-3 px-3">Sem categorias neste grupo.</div>' : '';
    var addRow = _addingCatGroup === g.id ? renderAddCatForm(g.id, g.name) : '';
    var addBtn = _addingCatGroup !== g.id
      ? '<div class="text-center py-2"><button class="btn btn-link btn-sm fw-semibold text-primary p-0" onclick="startNewCat(' + g.id + ')">Nova categoria</button></div>'
      : '';
    content = '<div class="m-2 border rounded-2 overflow-hidden">' +
      (catItems || emptyMsg) + addRow + addBtn + '</div>';
  }

  return '<div class="mb-2 border rounded-3 overflow-hidden" id="group-item-' + g.id + '">' +
    headerHtml + content + '</div>';
}

function renderUngroupedSection(tipo, cats) {
  if (!cats.length) return '';
  var items = cats.map(function(c) { return renderCatItem(tipo, c); }).join('');
  return '<div class="mb-2 border rounded-3 overflow-hidden">' +
    '<div class="px-3 py-2 border-bottom"><span class="text-muted small">Sem grupo</span></div>' +
    '<div class="m-2 border rounded-2 overflow-hidden">' + items + '</div>' +
    '</div>';
}

function renderAddCatForm(groupId, groupName) {
  var breadcrumb = groupName
    ? '<div class="small text-muted mb-1">' +
      '<span class="badge bg-info-subtle text-info fw-semibold me-1" style="font-size:.6rem">Grupo</span>' +
      '<span class="fw-medium">' + escapeHtml(groupName) + '</span>' +
      ' <span class="text-muted">›</span> ' +
      '<span class="badge bg-success-subtle text-success fw-semibold" style="font-size:.6rem">Nova Categoria</span>' +
      '</div>'
    : '';
  return '<div class="py-2 px-3">' +
    breadcrumb +
    '<div class="d-flex gap-2 align-items-center">' +
    '<input type="text" class="form-control form-control-sm flex-grow-1" id="new-cat-name-' + groupId +
    '" placeholder="Nome da categoria"' +
    ' onkeydown="if(event.key===\'Enter\')saveNewCat(' + groupId + ');if(event.key===\'Escape\')cancelNewCat()">' +
    '<button class="btn btn-primary btn-sm px-2" onclick="saveNewCat(' + groupId + ')"><span class="material-symbols-outlined" style="font-size:1rem">check</span></button>' +
    '<button class="btn btn-outline-secondary btn-sm px-2" onclick="cancelNewCat()"><span class="material-symbols-outlined" style="font-size:1rem">close</span></button>' +
    '</div></div>';
}

/* ─────────────── GRUPOS ─────────────── */
function toggleGroupExpand(id) {
  if (_expandedGroups.has(id)) { _expandedGroups.delete(id); } else { _expandedGroups.add(id); }
  if (_addingSub !== null) {
    var cat = (_addingSub && (categories[_catsTab] || []).filter(function(c) { return c.id === _addingSub.id; })[0]);
    if (cat && cat.groupId === id) _addingSub = null;
  }
  renderCats();
}

function startNewGroup() {
  _addingGroup    = true;
  _addingCatGroup = null;
  renderCats();
}

function cancelNewGroup() {
  _addingGroup = false;
  renderCats();
}

async function saveNewGroup() {
  var inp  = document.getElementById('new-group-name');
  var name = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  try {
    var data = await apiCreateGroup(_catsTab, name);
    if (!catGroups[_catsTab]) catGroups[_catsTab] = [];
    catGroups[_catsTab].push(data.group);
    _addingGroup = false;
    _expandedGroups.add(data.group.id);
    renderCats();
    showToast('Grupo criado!', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

function startRenameGroup(id) {
  _renamingGroup = id;
  renderCats();
}

function cancelRenameGroup() {
  _renamingGroup = null;
  renderCats();
}

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

/* ─────────────── CATEGORIAS ─────────────── */
function startNewCat(groupId) {
  _addingCatGroup = groupId;
  renderCats();
}

function cancelNewCat() {
  _addingCatGroup = null;
  renderCats();
}

async function saveNewCat(groupId) {
  var nameEl  = document.getElementById('new-cat-name-' + groupId);
  var emojiEl = document.getElementById('new-cat-emoji-' + groupId);
  var name    = nameEl  ? nameEl.value.trim()  : '';
  var emoji   = (emojiEl && emojiEl.value.trim()) ? emojiEl.value.trim() : '📌';
  if (!name) { if (nameEl) nameEl.focus(); return; }
  var gId = groupId > 0 ? groupId : null;
  try {
    var data = await apiCreateCategory(_catsTab, name, emoji, gId);
    if (!categories[_catsTab]) categories[_catsTab] = [];
    categories[_catsTab].push(data.category);
    _addingCatGroup = null;
    _expandedCats.add(data.category.id);
    if (gId) _expandedGroups.add(gId);
    _addingSub = { id: data.category.id, tipo: _catsTab };
    renderCats();
    showToast('Categoria criada! Adicione sub-categorias.', 'success');
    setTimeout(function() {
      var el = document.getElementById('new-sub-' + data.category.id);
      if (el) el.focus();
    }, 80);
  } catch (e) { showToast(e.message, 'error'); }
}

function renderCatItem(tipo, c) {
  var open = _expandedCats.has(c.id);
  var group = c.groupId ? (catGroups[tipo] || []).filter(function(g) { return g.id === c.groupId; })[0] : null;
  var groupName = group ? group.name : null;
  var subsContent = '';

  if (open) {
    var subRows = c.subs.length ? c.subs.map(function(s, i) {
      return (
        '<div class="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">' +
        '<div>' +
        '<span class="badge bg-primary-subtle text-primary fw-semibold" style="font-size:.65rem">Sub-categoria</span>' +
        '<span class="small ms-3" style="font-size:.875rem">' + escapeHtml(s) + '</span>' +
        '</div>' +
        '<button class="btn btn-link text-primary btn-sm p-0 pe-1" onclick="deleteSub(' + c.id + ',\'' + tipo + '\',' + i + ')">' +
        '<span class="material-symbols-outlined" style="font-size:1.1rem">cancel</span></button></div>'
      );
    }).join('') : '<div class="text-muted small py-2 fst-italic px-3">Sem sub-categorias</div>';

    var addingThisSub = _addingSub !== null && _addingSub.id === c.id;

    var subBreadcrumb = addingThisSub
      ? '<div class="small text-muted mb-1">' +
        (groupName ? '<span class="badge bg-info-subtle text-info fw-semibold me-1" style="font-size:.6rem">Grupo</span><span class="fw-medium">' + escapeHtml(groupName) + '</span> <span class="text-muted">›</span> ' : '') +
        '<span class="badge bg-success-subtle text-success fw-semibold me-1" style="font-size:.6rem">Categoria</span>' +
        '<span class="fw-normal">' + escapeHtml(c.name) + '</span>' +
        ' <span class="text-muted">›</span> ' +
        '<span class="badge bg-primary-subtle text-primary fw-semibold" style="font-size:.6rem">Nova Sub-categoria</span>' +
        '</div>'
      : '';

    var addSubRow = addingThisSub
      ? '<div class="border-top px-3 py-2">' +
        subBreadcrumb +
        '<div class="d-flex gap-2 align-items-center">' +
        '<input type="text" class="form-control form-control-sm flex-grow-1" id="new-sub-' + c.id +
        '" placeholder="Nome da sub-categoria"' +
        ' onkeydown="if(event.key===\'Enter\')saveNewSub();if(event.key===\'Escape\')cancelNewSub()">' +
        '<button class="btn btn-primary btn-sm px-2" onclick="saveNewSub()"><span class="material-symbols-outlined" style="font-size:1rem">check</span></button>' +
        '<button class="btn btn-outline-secondary btn-sm px-2" onclick="cancelNewSub()"><span class="material-symbols-outlined" style="font-size:1rem">close</span></button>' +
        '</div></div>'
      : '';

    var addSubBtn = !addingThisSub
      ? '<div class="text-center py-2 border-top"><button class="btn btn-link btn-sm fw-semibold text-primary" onclick="startNewSub(' + c.id + ',\'' + tipo + '\')">' +
        'Adicionar sub-categoria</button></div>'
      : '';

    subsContent =
      '<div id="cat-subs-' + c.id + '" class="mx-2 mb-2 border rounded-2 overflow-hidden">' +
      subRows + addSubRow + addSubBtn + '</div>';
  }

  return (
    '<div class="p-0 border-bottom" id="cat-item-' + c.id + '">' +
    '<div class="d-flex align-items-center px-3 py-2 gap-2" style="cursor:pointer" onclick="toggleCatExpand(' + c.id + ',\'' + tipo + '\')">' +
    '<div class="flex-grow-1">' +
    '<span class="badge bg-success-subtle text-success fw-semibold" style="font-size:.65rem">Categoria</span>' +
    '<span class="ms-3" style="font-size:.875rem">' + escapeHtml(c.name) + '</span>' +
    '</div>' +
    '<span class="text-muted small me-1">' + c.subs.length + '</span>' +
    '<span class="material-symbols-outlined text-secondary me-1" style="font-size:1.1rem">' + (open ? 'expand_less' : 'expand_more') + '</span>' +
    '<button class="btn btn-link text-primary p-0 flex-shrink-0" onclick="event.stopPropagation();confirmDeleteCat(' + c.id + ',\'' + tipo + '\')">' +
    '<span class="material-symbols-outlined" style="font-size:1rem">delete</span></button></div>' +
    subsContent + '</div>'
  );
}

function toggleCatExpand(id, tipo) {
  if (_expandedCats.has(id)) { _expandedCats.delete(id); } else { _expandedCats.add(id); }
  if (_addingSub !== null && _addingSub.id === id) _addingSub = null;
  renderCats();
}

/* ─────────────── SUB-CATEGORIAS ─────────────── */
function startNewSub(catId, tipo) {
  _addingSub = { id: catId, tipo: tipo };
  _expandedCats.add(catId);
  renderCats();
  setTimeout(function() {
    var el = document.getElementById('new-sub-' + catId);
    if (el) el.focus();
  }, 60);
}

function cancelNewSub() {
  _addingSub = null;
  renderCats();
}

async function saveNewSub() {
  if (!_addingSub) return;
  var catId = _addingSub.id;
  var tipo  = _addingSub.tipo;
  var inp   = document.getElementById('new-sub-' + catId);
  var name  = inp ? inp.value.trim() : '';
  if (!name) { if (inp) inp.focus(); return; }
  var cat = (categories[tipo] || []).filter(function(c) { return c.id === catId; })[0];
  if (!cat) return;
  var newSubs = cat.subs.concat([name]);
  try {
    await apiUpdateCategory(catId, { subs: newSubs });
    cat.subs = newSubs;
    renderCats();
    showToast('Sub-categoria adicionada!', 'success');
    setTimeout(function() {
      var newInp = document.getElementById('new-sub-' + catId);
      if (newInp) newInp.focus();
    }, 60);
  } catch (e) { showToast(e.message, 'error'); }
}

async function deleteSub(catId, tipo, idx) {
  var cat = (categories[tipo] || []).filter(function(c) { return c.id === catId; })[0];
  if (!cat) return;
  var newSubs = cat.subs.filter(function(_, i) { return i !== idx; });
  try {
    await apiUpdateCategory(catId, { subs: newSubs });
    cat.subs = newSubs;
    _expandedCats.add(catId);
    renderCats();
    showToast('Sub-categoria removida.', 'success');
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
      _expandedCats.delete(id);
      if (_addingSub !== null && _addingSub.id === id) _addingSub = null;
      renderCats();
      showToast('Categoria removida.', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };
  showConfirmModal();
}
