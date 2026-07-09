/* ═══════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════ */
let screenStack = ['login'];
let currentListingType = '';
let listingStatusFilter = '';
let sortDir = 'desc';
let sortField = 'data';
let listingLimit = 10;
let pinnedEntryId = null;
let vSortDir = 'asc';
let vSortField = 'data';
let listingYear = null;
let listingMonth = null;
let editingId = null;
let formStep = 0;

function showScreen(id, push = true) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active','hidden');
    s.classList.add('hidden');
  });
  document.getElementById('screen-'+id).classList.remove('hidden');
  document.getElementById('screen-'+id).classList.add('active');
  if (push && screenStack[screenStack.length-1] !== id) screenStack.push(id);
  if (typeof updateNovoBtn === 'function') updateNovoBtn();
}

function goBack() {
  screenStack.pop();
  const prev = screenStack[screenStack.length-1] || 'home';
  showScreen(prev, false);
  if (prev === 'home') renderHome();
  if (prev === 'listing') renderListing();
  if (prev === 'cats') renderCats();
  if (prev === 'cat-group') renderCatGroupScreen();
}

function showConfirmModal() {
  const el = document.getElementById('confirm-modal');
  el.style.display = 'flex';
  requestAnimationFrame(() => { requestAnimationFrame(() => { el.style.opacity = '1'; }); });
}
function hideConfirmModal() {
  const el = document.getElementById('confirm-modal');
  el.style.opacity = '0';
  setTimeout(() => { el.style.display = 'none'; }, 190);
}

function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}

function navigate(id) {
  screenStack = [id === 'login' ? 'login' : 'home', id].filter((v,i,a)=>a.indexOf(v)===i);
  showScreen(id, false);
  if (id === 'home') renderHome();
  if (id === 'cats') renderCats();
  if (id === 'profile') { renderProfile(); initThemeToggle(); }
}
