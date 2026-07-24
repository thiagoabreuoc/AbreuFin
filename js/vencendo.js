/* ═══════════════════════════════════════
   VENCENDO
═══════════════════════════════════════ */
function goToVencendo(mode='vencendo') {
  window._vMode = mode;
  const sub = document.getElementById('vencendo-subtitle');
  const badge = document.getElementById('vencendo-badge');
  const today2 = new Date(); today2.setHours(0,0,0,0);
  const isPending = e => ['a_pagar','a_receber','a_investir'].includes(entryStatus(e));
  if (mode === 'vencido') {
    if (badge) { badge.className = 'badge status-cell status-cell-despesa'; badge.textContent = 'Vencidas'; }
    const count = entries.filter(e => {
      if (!isPending(e)) return false;
      const d=new Date(e.yyyy,e.mm-1,e.dd); d.setHours(0,0,0,0);
      return d < today2;
    }).length;
    if (sub) sub.textContent = count > 0 ? `${count} lançamento${count!==1?'s':''}` : '0 lançamentos';
  } else {
    if (badge) { badge.className = 'badge status-cell status-cell-warning'; badge.textContent = 'Vencendo'; }
    const count = entries.filter(e => {
      if (!isPending(e)) return false;
      const d=new Date(e.yyyy,e.mm-1,e.dd); d.setHours(0,0,0,0);
      return d >= today2 && d <= new Date(today2.getTime()+3*86400000);
    }).length;
    if (sub) sub.textContent = count > 0 ? `${count} lançamento${count!==1?'s':''}` : '0 lançamentos';
  }
  showScreen('vencendo');
  updateVencendoSortBtns();
  renderVencendo();
  initSwipeCards(document.getElementById('vencendo-entries'), renderVencendo);
}

// Um ícone só por campo (valor/data), igual à tela de Receitas: clicar de
// novo no mesmo campo inverte a direção; clicar no outro campo troca pra
// ele com a direção padrão (asc), a mesma que a seta em repouso já sugere.
function updateVencendoSortBtns() {
  const base = 'text-decoration-none d-inline-flex align-items-center gap-1';
  const active = f => (vSortField===f?'text-primary':'text-secondary') + ' ' + base;
  document.getElementById('vsort-btn-valor').className = active('valor');
  document.getElementById('vsort-btn-data').className  = active('data');
  document.getElementById('vsort-valor-arrow').textContent =
    (vSortField==='valor' && vSortDir==='desc') ? 'arrow_downward' : 'arrow_upward';
  document.getElementById('vsort-data-arrow').textContent =
    (vSortField==='data' && vSortDir==='desc') ? 'arrow_downward' : 'arrow_upward';
}

function sortVend(field, dir) {
  vSortField = field; vSortDir = dir;
  updateVencendoSortBtns();
  renderVencendo();
}

function toggleSortVend(field) {
  const dir = (vSortField===field && vSortDir==='asc') ? 'desc' : 'asc';
  sortVend(field, dir);
}

function renderVencendo() {
  const today = new Date(); today.setHours(0,0,0,0);
  const in3   = new Date(today); in3.setDate(today.getDate()+3);
  const mode  = window._vMode || 'vencendo';
  const list  = entries.filter(e => {
    if (!['a_pagar','a_receber','a_investir'].includes(entryStatus(e))) return false;
    const d = new Date(e.yyyy, e.mm-1, e.dd); d.setHours(0,0,0,0);
    return mode === 'vencido' ? d < today : d >= today && d <= in3;
  }).sort((a,b) => {
    if (vSortField === 'data') {
      const da = a.yyyy*10000+a.mm*100+a.dd, db = b.yyyy*10000+b.mm*100+b.dd;
      return vSortDir === 'desc' ? db-da : da-db;
    }
    return vSortDir === 'desc' ? b.valor-a.valor : a.valor-b.valor;
  });

  const el = document.getElementById('vencendo-entries');
  if (!list.length) {
    el.innerHTML = `<li class="list-group-item text-center text-secondary small py-5 border-0" style="border-radius:var(--md-sys-shape-corner-medium)">Nenhum lançamento vencido ou a vencer. Tudo em dia!</li>`;
    return;
  }
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  el.innerHTML = list.map(e => `
    <li class="swipe-card-wrap" data-entry-id="${e.id}">
      <div class="swipe-bg swipe-bg-left"><span class="material-symbols-outlined">check_circle</span></div>
      <div class="swipe-bg swipe-bg-right"><span class="material-symbols-outlined">schedule</span></div>
      <div class="list-group-item cat-row-card swipe-card-front d-flex justify-content-between align-items-start" onclick="openEdit(${e.id})" style="cursor:pointer">
        <div>
          <div class="fw-semibold small">${cap(escapeHtml(e.subcategoria||e.categoria))}</div>
          <div class="text-secondary small" style="margin-top:4px">${cap(escapeHtml(e.categoria))}</div>
        </div>
        <div class="text-end">
          <span class="badge status-cell status-cell-neutral mb-1">${statusLabel(entryStatus(e))}</span>
          <div class="fw-semibold small">${fmt(e.valor)}</div>
          <div class="text-secondary small">${String(e.dd).padStart(2,'0')}/${String(e.mm).padStart(2,'0')}/${e.yyyy}${dueBadge(e)}</div>
        </div>
      </div></li>`).join('');
}
