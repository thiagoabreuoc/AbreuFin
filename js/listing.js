/* ═══════════════════════════════════════
   LISTING
═══════════════════════════════════════ */
document.addEventListener('click', e => {
  const panel      = document.getElementById('filter-panel');
  const btn        = document.querySelector('[data-bs-target="#filter-panel"]');
  const csPanel    = document.getElementById('cs-panel');
  const csBackdrop = document.getElementById('cs-backdrop');
  const inCs = (csPanel && csPanel.contains(e.target)) || e.target === csBackdrop;
  if (panel && panel.classList.contains('show') && !panel.contains(e.target) && btn && !btn.contains(e.target) && !inCs) {
    bootstrap.Collapse.getOrCreateInstance(panel).hide();
  }
});
const STATUS_BADGE = {
  recebido:  'bg-success',
  a_receber: 'badge-receita-soft',
  pago:      'bg-danger',
  a_pagar:   'badge-despesa-soft',
  investido: 'bg-info',
  a_investir:'badge-investimento-soft',
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
  csSetDisabled('f-repeat', true);
}

function _setFilterDepDisabled(disabled) {
  ['f-subcat','f-repeat'].forEach(id => {
    csSetDisabled(id, disabled);
    const wrap = document.getElementById(id+'-label');
    if (wrap) wrap.style.opacity = disabled ? '0.45' : '';
  });
}

function openListing(tipo) {
  currentListingType = tipo;
  listingStatusFilter = '';
  listingLimit = 10;
  ensureCSFilterInit();
  bootstrap.Collapse.getOrCreateInstance(document.getElementById('filter-panel'), {toggle:false}).hide();
  csReset('f-cat'); csReset('f-subcat'); csReset('f-repeat');
  _setFilterDepDisabled(true);
  updateFilterBadge();
  updateSortBtns();
  const STATUS_TABS = {
    receita:     [{val:'',label:'Tudo'},{val:'recebido',label:'Recebido'},{val:'a_receber',label:'A receber'}],
    despesa:     [{val:'',label:'Tudo'},{val:'pago',label:'Pago'},{val:'a_pagar',label:'A pagar'}],
    investimento:[{val:'',label:'Tudo'},{val:'investido',label:'Investido'},{val:'a_investir',label:'A investir'}],
  };
  const tabs = STATUS_TABS[tipo] || STATUS_TABS.despesa;
  document.getElementById('listing-status-tabs').innerHTML = tabs.map((t,i)=>
    `<button class="btn btn-sm rounded-pill flex-shrink-0 ${i===0?'btn-primary':'tab-inactive text-primary'}" onclick="selectStatus(this,'${t.val}')" style="border:none">${t.label}</button>`
  ).join('');
  const labels={receita:'Receitas',despesa:'Despesas',investimento:'Investimentos'};
  const TIPO_HEADER_CLASS={receita:'badge bg-success fw-semibold',despesa:'badge bg-danger fw-semibold',investimento:'badge bg-info fw-semibold'};
  const titleEl=document.getElementById('listing-title');
  titleEl.textContent=labels[tipo];
  titleEl.className=TIPO_HEADER_CLASS[tipo]||'badge bg-secondary fw-semibold';
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
    if (sortField==='data') {
      const da=a.yyyy*10000+a.mm*100+a.dd, db=b.yyyy*10000+b.mm*100+b.dd;
      return sortDir==='desc' ? db-da : da-db;
    }
    return sortDir==='desc' ? b.valor-a.valor : a.valor-b.valor;
  });
}

function renderListing() {
  const list=getListingEntries();
  const el=document.getElementById('listing-entries');
  if (!list.length){el.innerHTML=`<li class="list-group-item text-center text-secondary py-5 border-0" style="border-radius:12px">Nenhum lançamento encontrado.</li>`;return;}
  const visible=list.slice(0,listingLimit);
  el.innerHTML=visible.map(e=>{
    const es=entryStatus(e);
    const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    const title = cap(escapeHtml(e.subcategoria||e.categoria));
    const sub   = cap(escapeHtml(e.categoria));
    const rep   = e.repetir ? `<div class="text-secondary small mt-1"><i class="bi bi-arrow-repeat me-1"></i>${cap(escapeHtml(e.repetir))}</div>` : '';
    return `<li class="list-group-item d-flex justify-content-between align-items-start" onclick="openEdit(${e.id})" style="cursor:pointer;border-radius:12px;border:1px solid #dee2e6">
      <div>
        <div class="fw-semibold small">${title}</div>
        <div class="text-secondary small" style="margin-top:4px">${sub}</div>
        ${rep}
      </div>
      <div class="text-end">
        <span class="badge ${STATUS_BADGE[es]} mb-1">${statusLabel(es)}</span>
        <div class="text-primary fw-semibold small">${fmt(e.valor)}</div>
        <div class="text-secondary small">${String(e.dd).padStart(2,'0')}/${String(e.mm).padStart(2,'0')}/${e.yyyy}</div>
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
  document.querySelectorAll('#listing-status-tabs .btn').forEach(b=>{
    b.classList.remove('btn-primary');
    b.classList.add('tab-inactive','text-primary');
  });
  btn.classList.add('btn-primary');
  btn.classList.remove('tab-inactive','text-primary');
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
    `<button class="btn btn-sm rounded-pill flex-shrink-0 ${y===yr?'btn-primary':'tab-inactive text-primary'}" style="border:none" onclick="selectPeriodYear(${y})">${y}</button>`
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
  document.querySelectorAll('#period-year-strip .btn').forEach(b => {
    const by = parseInt(b.textContent);
    b.classList.toggle('btn-primary', by===y);
    b.classList.toggle('tab-inactive', by!==y);
    b.classList.toggle('text-primary', by!==y);
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
