/* ═══════════════════════════════════════
   LISTING
═══════════════════════════════════════ */
function openFilterPanel() {
  document.getElementById('filter-overlay').classList.add('open');
  document.getElementById('filter-sheet').classList.add('open');
}
function closeFilterPanel() {
  document.getElementById('filter-overlay').classList.remove('open');
  document.getElementById('filter-sheet').classList.remove('open');
}
const STATUS_BADGE = {
  recebido:  'status-cell status-cell-success',
  a_receber: 'status-cell status-cell-neutral',
  pago:      'status-cell status-cell-success',
  a_pagar:   'status-cell status-cell-neutral',
  investido: 'status-cell status-cell-success',
  a_investir:'status-cell status-cell-neutral',
};

let _csFilterInited = false;
function ensureCSFilterInit() {
  if (_csFilterInited) return;
  _csFilterInited = true;
  csInit('f-cat');
  csInit('f-subcat');
  csInit('f-repeat');
  csStoreOptions('f-repeat', [
    {value:'semanal',   label:'Semanal'},
    {value:'quinzenal', label:'Quinzenal'},
    {value:'mensal',    label:'Mensal'},
    {value:'anual',     label:'Anual'},
  ]);
  csSetDisabled('f-subcat', true);
}

function _setFilterDepDisabled(disabled) {
  csSetDisabled('f-subcat', disabled);
  const wrap = document.getElementById('f-subcat-label');
  if (wrap) wrap.style.opacity = disabled ? '0.45' : '';
}

function openListing(tipo, pinId) {
  currentListingType = tipo;
  listingStatusFilter = '';
  listingLimit = 10;
  pinnedEntryId = pinId || null;
  sortField = 'prioridade';
  sortDir = 'asc';
  ensureCSFilterInit();
  closeFilterPanel();
  csReset('f-cat'); csReset('f-subcat'); csReset('f-repeat');
  _setFilterDepDisabled(true);
  updateFilterBadge();
  updateSortBtns();
  const STATUS_TABS = {
    receita:     [{val:'',label:'Tudo'},{val:'recebido',label:'Recebido'},{val:'a_receber',label:'A receber'}],
    despesa:     [{val:'',label:'Tudo'},{val:'pago',label:'Pago'},{val:'a_pagar',label:'A pagar'}],
    investimento:[{val:'',label:'Tudo'},{val:'investido',label:'Investido'},{val:'a_investir',label:'A investir'}],
  };
  const STATUS_COLOR_CLASS = {
    '':           'status-cell-white',
    recebido:     'status-cell-success',
    a_receber:    'status-cell-neutral',
    pago:         'status-cell-success',
    a_pagar:      'status-cell-neutral',
    investido:    'status-cell-success',
    a_investir:   'status-cell-neutral',
  };
  const tabs = STATUS_TABS[tipo] || STATUS_TABS.despesa;
  document.getElementById('listing-status-tabs').innerHTML = tabs.map((t,i)=>
    `<button class="badge status-cell ${STATUS_COLOR_CLASS[t.val]}" style="box-shadow:${i===0?'inset 0 0 0 2px currentColor':'none'}" onclick="selectStatus(this,'${t.val}')">${t.label}</button>`
  ).join('');
  const labels={receita:'Receitas',despesa:'Despesas',investimento:'Investimentos'};
  const TIPO_HEADER_ICON={receita:'arrow_upward',despesa:'arrow_downward',investimento:'trending_up'};
  const TIPO_HEADER_CLASS={receita:'badge status-cell status-cell-receita',despesa:'badge status-cell status-cell-despesa',investimento:'badge status-cell status-cell-investimento'};
  const titleEl=document.getElementById('listing-title');
  titleEl.innerHTML=`<span class="material-symbols-outlined" style="font-size:1rem;line-height:1;display:inline-flex">${TIPO_HEADER_ICON[tipo]}</span><span style="line-height:1">${labels[tipo]}</span>`;
  titleEl.className=(TIPO_HEADER_CLASS[tipo]||'badge bg-secondary fw-semibold')+' d-inline-flex align-items-center';
  titleEl.style.gap='6px';
  listingYear  = homeYear;
  listingMonth = homeTab === 'meses' ? homeMonth : null;
  updateListingDateLabel();
  const catOpts = (categories[tipo]||[]).map(c=>({value:c.name, label:c.name}));
  csStoreOptions('f-cat', catOpts);
  showScreen('listing');
  renderListing();
  attachListingScroll();
}

function entryStatus(e) {
  if (e.status==='pendente'&&e.tipo==='despesa')       return 'a_pagar';
  if (e.status==='pendente'&&e.tipo==='receita')       return 'a_receber';
  if (e.status==='pendente'&&e.tipo==='investimento')  return 'a_investir';
  return e.status;
}

function dueRank(e) {
  if (!['a_pagar','a_receber','a_investir'].includes(entryStatus(e))) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const in3 = new Date(today); in3.setDate(today.getDate()+3);
  const d2 = new Date(e.yyyy, e.mm-1, e.dd); d2.setHours(0,0,0,0);
  if (d2 < today) return 'vencido';
  if (d2 <= in3) return 'vencendo';
  return 'neutro';
}
function urgencyScore(e, primary) {
  const r = dueRank(e);
  if (r === primary) return 0;
  if (r) return 1;
  return 2;
}
function overallPriority(e) {
  const r = dueRank(e);
  if (r === 'vencido')  return 0;
  if (r === 'vencendo') return 1;
  if (r === 'neutro')   return 2;
  return 3; // confirmado (recebido/pago/investido)
}

function getListingEntries() {
  const cat=document.getElementById('f-cat').value;
  const sub=document.getElementById('f-subcat').value;
  const rep=document.getElementById('f-repeat').value;
  return entries.filter(e=>{
    if (e.tipo!==currentListingType) return false;
    const _yr = listingYear || homeYear;
    if (e.yyyy !== _yr) return false;
    if (listingMonth !== null && e.mm-1 !== listingMonth) return false;
    const es=entryStatus(e);
    if (listingStatusFilter&&es!==listingStatusFilter) return false;
    if (cat&&e.categoria!==cat) return false;
    if (sub&&e.subcategoria!==sub) return false;
    if (rep&&e.repetir!==rep) return false;
    return true;
  }).sort((a,b)=>{
    if (pinnedEntryId) {
      if (a.id===pinnedEntryId) return -1;
      if (b.id===pinnedEntryId) return 1;
    }
    if (sortField==='prioridade') {
      const pa=overallPriority(a), pb=overallPriority(b);
      if (pa!==pb) return pa-pb;
      const da=a.yyyy*10000+a.mm*100+a.dd, db=b.yyyy*10000+b.mm*100+b.dd;
      return da-db;
    }
    if (sortField==='vencido' || sortField==='vencendo' || sortField==='neutro') {
      const sa=urgencyScore(a,sortField), sb=urgencyScore(b,sortField);
      if (sa!==sb) return sa-sb;
      const da=a.yyyy*10000+a.mm*100+a.dd, db=b.yyyy*10000+b.mm*100+b.dd;
      return da-db;
    }
    if (sortField==='data') {
      const da=a.yyyy*10000+a.mm*100+a.dd, db=b.yyyy*10000+b.mm*100+b.dd;
      return sortDir==='desc' ? db-da : da-db;
    }
    return sortDir==='desc' ? b.valor-a.valor : a.valor-b.valor;
  });
}

const DUE_RANK_CLASS = {vencido:'m3-badge-small-error', vencendo:'m3-badge-small-warning', neutro:'m3-badge-small-neutral'};
function dueBadge(e) {
  if (!['a_pagar','a_receber'].includes(entryStatus(e))) return '';
  const r = dueRank(e);
  return `<span class="m3-badge-small ${DUE_RANK_CLASS[r]}" style="margin-left:4px"></span>`;
}

function renderListing() {
  const list=getListingEntries();
  const hasVencido  = list.some(e=>dueRank(e)==='vencido');
  const hasVencendo = list.some(e=>dueRank(e)==='vencendo');
  const hasNeutro   = list.some(e=>dueRank(e)==='neutro');
  document.getElementById('sort-btn-vencido').style.display  = hasVencido  ? 'inline-flex' : 'none';
  document.getElementById('sort-btn-vencendo').style.display = hasVencendo ? 'inline-flex' : 'none';
  document.getElementById('sort-btn-neutro').style.display   = hasNeutro   ? 'inline-flex' : 'none';
  document.getElementById('sort-urgency-sep').style.display  = (hasVencido || hasVencendo || hasNeutro) ? 'inline' : 'none';
  const el=document.getElementById('listing-entries');
  if (!list.length){el.innerHTML=`<li class="list-group-item text-center text-secondary small py-5 border-0" style="border-radius:12px">Nenhum lançamento encontrado.</li>`;return;}
  const visible=list.slice(0,listingLimit);
  el.innerHTML=visible.map(e=>{
    const es=entryStatus(e);
    const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    const title = cap(escapeHtml(e.subcategoria||e.categoria));
    const sub   = cap(escapeHtml(e.categoria));
    const rep   = e.repetir ? `<div class="text-secondary small" style="margin-top:6px"><span class="material-symbols-outlined me-1" style="font-size:.9rem;vertical-align:-2px">repeat</span>${cap(escapeHtml(e.repetir))}</div>` : '';
    return `<li class="list-group-item d-flex justify-content-between align-items-start" onclick="openEdit(${e.id})" style="cursor:pointer;border-radius:12px;border:1px solid var(--md-sys-color-outline-variant);padding:14px 16px">
      <div>
        <div class="fw-semibold small">${title}</div>
        <div class="text-secondary small" style="margin-top:6px">${sub}</div>
        ${rep}
      </div>
      <div class="text-end">
        <span class="badge ${STATUS_BADGE[es]}" style="margin-bottom:6px">${statusLabel(es)}</span>
        <div class="fw-semibold small">${fmt(e.valor)}</div>
        <div class="text-secondary small" style="margin-top:4px">${String(e.dd).padStart(2,'0')}/${String(e.mm).padStart(2,'0')}/${e.yyyy}${dueBadge(e)}</div>
      </div></li>`;
  }).join('');
}

function statusLabel(s){return{a_pagar:'A pagar',a_receber:'A receber',a_investir:'A investir',pago:'Pago',investido:'Investido',recebido:'Recebido'}[s]||s}

let _listingScrollEl = null;
function _listingScrollHandler() {
  const el = _listingScrollEl;
  if (!el) return;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
    const total = getListingEntries().length;
    if (listingLimit < total) { listingLimit += 10; renderListing(); }
  }
}
function attachListingScroll() {
  const el = document.querySelector('#screen-listing .screen-body');
  if (!el || el === _listingScrollEl) return;
  if (_listingScrollEl) _listingScrollEl.removeEventListener('scroll', _listingScrollHandler);
  _listingScrollEl = el;
  el.addEventListener('scroll', _listingScrollHandler, {passive:true});
}
function detachListingScroll() {
  if (_listingScrollEl) { _listingScrollEl.removeEventListener('scroll', _listingScrollHandler); _listingScrollEl = null; }
}

function selectStatus(btn,val){
  listingStatusFilter=val;
  listingLimit=10;
  document.querySelectorAll('#listing-status-tabs button').forEach(b=>{ b.style.boxShadow = 'none'; });
  btn.style.boxShadow = 'inset 0 0 0 2px currentColor';
  renderListing();
}
function updateSortBtns(){
  const active = (id,f,d) => (sortField===f&&sortDir===d)?'text-primary text-decoration-none':'text-secondary text-decoration-none';
  document.getElementById('sort-btn-desc').className      = active('sort-btn-desc','valor','desc');
  document.getElementById('sort-btn-asc').className       = active('sort-btn-asc','valor','asc');
  document.getElementById('sort-btn-date-desc').className = active('sort-btn-date-desc','data','desc');
  document.getElementById('sort-btn-date-asc').className  = active('sort-btn-date-asc','data','asc');
}
function sortEntries(field,dir){
  pinnedEntryId=null; sortField=field; sortDir=dir; listingLimit=10;
  updateSortBtns();
  renderListing();
}
function clearListingFilter(){
  csReset('f-cat'); csReset('f-subcat'); csReset('f-repeat');
  _setFilterDepDisabled(true);
  applyFilter();
}

function onFilterCatChange(){
  const catVal = document.getElementById('f-cat').value;
  const hasCat = !!catVal;
  if (hasCat) {
    const cat = (categories[currentListingType]||[]).find(c=>c.name===catVal);
    const subs = cat && cat.subs && cat.subs.length
      ? [...cat.subs.map(s=>({value:s, label:s.charAt(0).toUpperCase()+s.slice(1)})), {value:'outros', label:'Outros'}]
      : [{value:'outros', label:'Outros'}];
    csStoreOptions('f-subcat', subs);
  } else {
    csStoreOptions('f-subcat', []);
  }
  csReset('f-subcat');
  _setFilterDepDisabled(!hasCat);
  applyFilter();
}
function updateListingDateLabel() {
  const yr = listingYear || homeYear;
  const label = listingMonth !== null ? (MONTHS_FULL[listingMonth] + ' ' + yr) : String(yr);
  document.getElementById('listing-date').textContent = label;
}

function openPeriodPicker() {
  const years = [...new Set(entries.map(e => e.yyyy))].sort((a,b) => a-b);
  if (!years.length) years.push(listingYear || homeYear);
  const yr = listingYear || homeYear;

  document.getElementById('period-year-strip').innerHTML = years.map(y =>
    `<button class="m3-tab${y===yr?' active':''}" onclick="selectPeriodYear(${y})">${y}</button>`
  ).join('');
  _renderPeriodMonths();
  document.getElementById('period-overlay').classList.add('open');
  document.getElementById('period-sheet').classList.add('open');
}

function closePeriodPicker() {
  document.getElementById('period-overlay').classList.remove('open');
  document.getElementById('period-sheet').classList.remove('open');
}

function _renderPeriodMonths() {
  document.getElementById('period-month-grid').innerHTML = MONTHS.map((m,i) =>
    `<button class="btn btn-sm rounded-pill flex-shrink-0 ${i===listingMonth?'btn-primary':'tab-inactive text-primary'}" style="border:none" onclick="selectPeriodMonth(${i})">${m}</button>`
  ).join('');
}

function selectPeriodYear(y) {
  listingYear = y;
  document.querySelectorAll('#period-year-strip .m3-tab').forEach(b => {
    b.classList.toggle('active', parseInt(b.textContent)===y);
  });
  updateListingDateLabel();
  listingLimit = 10;
  renderListing();
}

function selectPeriodMonth(m) {
  listingMonth = m;
  _renderPeriodMonths();
  updateListingDateLabel();
  listingLimit = 10;
  renderListing();
  closePeriodPicker();
}

function selectPeriodAllYear() {
  listingMonth = null;
  _renderPeriodMonths();
  updateListingDateLabel();
  listingLimit = 10;
  renderListing();
  closePeriodPicker();
}

function applyFilter(){listingLimit=10;updateFilterBadge();renderListing()}
function updateFilterBadge(){
  const c=[document.getElementById('f-cat').value,document.getElementById('f-subcat').value,document.getElementById('f-repeat').value].filter(Boolean).length;
  const b=document.getElementById('filter-count');
  b.style.display=c?'inline-block':'none';b.textContent=c;
}
