/* ═══════════════════════════════════════
   VENCENDO
═══════════════════════════════════════ */
function goToVencendo(mode='vencendo') {
  window._vMode = mode;
  const sub = document.getElementById('vencendo-subtitle');
  const badge = document.getElementById('vencendo-badge');
  const today2 = new Date(); today2.setHours(0,0,0,0);
  if (mode === 'vencido') {
    if (badge) { badge.className = 'badge bg-danger fw-semibold'; badge.textContent = 'Vencidas'; }
    const count = entries.filter(e => {
      if (e.tipo!=='despesa'||e.status!=='pendente') return false;
      const d=new Date(e.yyyy,e.mm-1,e.dd); d.setHours(0,0,0,0);
      return d < today2;
    }).length;
    if (sub) sub.textContent = count > 0 ? `${count} despesa${count!==1?'s':''}` : '0 despesas';
  } else {
    if (badge) { badge.className = 'badge bg-warning text-dark fw-semibold'; badge.textContent = 'Vencendo'; }
    const count = entries.filter(e => {
      if (e.tipo!=='despesa'||e.status!=='pendente') return false;
      const d=new Date(e.yyyy,e.mm-1,e.dd); d.setHours(0,0,0,0);
      return d >= today2 && d <= new Date(today2.getTime()+3*86400000);
    }).length;
    if (sub) sub.textContent = count > 0 ? `${count} despesa${count!==1?'s':''}` : '0 despesas';
  }
  showScreen('vencendo');
  updateVencendoSortBtns();
  renderVencendo();
}

function updateVencendoSortBtns() {
  const active = (f,d) => (vSortField===f&&vSortDir===d) ? 'text-primary text-decoration-none' : 'text-secondary text-decoration-none';
  const dd = document.getElementById('vsort-btn-desc');      if (dd) dd.className = active('valor','desc') + ' d-inline-flex align-items-center gap-1';
  const da = document.getElementById('vsort-btn-asc');       if (da) da.className = active('valor','asc')  + ' d-inline-flex align-items-center gap-1';
  const td = document.getElementById('vsort-btn-date-desc'); if (td) td.className = active('data','desc')  + ' d-inline-flex align-items-center gap-1';
  const ta = document.getElementById('vsort-btn-date-asc');  if (ta) ta.className = active('data','asc')   + ' d-inline-flex align-items-center gap-1';
}

function sortVend(field, dir) {
  vSortField = field; vSortDir = dir;
  updateVencendoSortBtns();
  renderVencendo();
}

function renderVencendo() {
  const today = new Date(); today.setHours(0,0,0,0);
  const in3   = new Date(today); in3.setDate(today.getDate()+3);
  const mode  = window._vMode || 'vencendo';
  const list  = entries.filter(e => {
    if (e.tipo !== 'despesa' || e.status !== 'pendente') return false;
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
    el.innerHTML = `<li class="list-group-item text-center text-secondary py-5 border-0" style="border-radius:12px">Nenhuma despesa encontrada.</li>`;
    return;
  }
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  el.innerHTML = list.map(e => `
    <li class="list-group-item d-flex justify-content-between align-items-start" onclick="openEdit(${e.id})" style="cursor:pointer;border-radius:12px;border:1px solid var(--md-sys-color-outline-variant)">
      <div>
        <div class="fw-semibold small">${cap(escapeHtml(e.subcategoria||e.categoria))}</div>
        <div class="text-secondary small" style="margin-top:4px">${cap(escapeHtml(e.categoria))}</div>
      </div>
      <div class="text-end">
        <span class="badge badge-despesa-soft mb-1">A pagar</span>
        <div class="text-primary fw-semibold small">${fmt(e.valor)}</div>
        <div class="text-secondary small">${String(e.dd).padStart(2,'0')}/${String(e.mm).padStart(2,'0')}/${e.yyyy}</div>
      </div></li>`).join('');
}
