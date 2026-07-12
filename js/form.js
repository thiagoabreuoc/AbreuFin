/* ═══════════════════════════════════════
   FORM (2 steps)
═══════════════════════════════════════ */

// ─── Custom Searchable Select ────────────────────────────────
let _csActive = null;
let _csFormInited = false;

function ensureCSInit() {
  if (_csFormInited) return;
  _csFormInited = true;
  csInit('f-categoria');
  csInit('f-subcategoria');
}

function csInit(id) {
  const sel = document.getElementById(id);
  if (!sel || sel._csInited) return;
  sel._csInited = true;
  sel.style.display = 'none';
  const btn = document.createElement('div');
  btn.className = 'form-control cs-btn';
  btn.id = id + '-btn';
  btn.innerHTML = `<span class="cs-display text-muted" id="${id}-display">Selecione</span><span class="material-symbols-outlined text-secondary ms-1 flex-shrink-0" style="font-size:1.2rem">expand_more</span>`;
  btn.addEventListener('click', () => csOpen(id));
  sel.parentNode.insertBefore(btn, sel);
}

function csOpen(id) {
  const sel = document.getElementById(id);
  const btn = document.getElementById(id + '-btn');
  if (!sel || !btn || btn._csDisabled) return;
  _csActive = id;

  // Position dropdown anchored to the form-box (or btn as fallback)
  const anchor = btn.closest('.form-box') || btn;
  const r = anchor.getBoundingClientRect();
  const panel = document.getElementById('cs-panel');
  const spaceBelow = window.innerHeight - r.bottom - 8;
  const spaceAbove = r.top - 8;
  const maxH = Math.min(Math.max(spaceBelow, spaceAbove, 160), 320);

  panel.style.width  = r.width + 'px';
  panel.style.left   = r.left + 'px';
  panel.style.maxHeight = maxH + 'px';

  if (spaceBelow >= 160 || spaceBelow >= spaceAbove) {
    panel.style.top    = (r.bottom + 4) + 'px';
    panel.style.bottom = 'auto';
    panel.style.transformOrigin = 'top center';
  } else {
    panel.style.top    = 'auto';
    panel.style.bottom = (window.innerHeight - r.top + 4) + 'px';
    panel.style.transformOrigin = 'bottom center';
  }

  const search = document.getElementById('cs-search');
  search.value = '';
  csRenderItems(sel._csOptions || [], sel.value, '');
  document.getElementById('cs-backdrop').classList.add('open');
  panel.classList.add('open');
  setTimeout(() => search.focus(), 120);
}

function csRenderItems(options, currentVal, query) {
  const list = document.getElementById('cs-list');
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter(o => o.label.toLowerCase().startsWith(q)) : options;
  if (!filtered.length) { list.innerHTML = '<div class="cs-none">Nenhum resultado</div>'; return; }
  list.innerHTML = filtered.map(o =>
    `<div class="cs-item${o.value === currentVal ? ' selected' : ''}" data-value="${escapeHtml(o.value)}" data-label="${escapeHtml(o.label)}" onclick="csPickItem(this)">${escapeHtml(o.label)}</div>`
  ).join('');
}

function csFilter(query) {
  if (!_csActive) return;
  const sel = document.getElementById(_csActive);
  csRenderItems(sel._csOptions || [], sel.value, query);
}

function csPickItem(el) {
  if (!_csActive) return;
  const value = el.dataset.value;
  const label = el.dataset.label;
  const sel = document.getElementById(_csActive);
  const display = document.getElementById(_csActive + '-display');
  sel.value = value;
  if (display) { display.textContent = label || 'Selecione'; display.classList.toggle('text-muted', !value); }
  sel.dispatchEvent(new Event('change'));
  csClose();
}

function csClose() {
  document.getElementById('cs-backdrop').classList.remove('open');
  document.getElementById('cs-panel').classList.remove('open');
  _csActive = null;
}

function csStoreOptions(id, options) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel._csOptions = options;
  sel.innerHTML = '<option value=""></option>' +
    options.map(o => `<option value="${escapeHtml(String(o.value))}">${escapeHtml(String(o.label))}</option>`).join('');
}

function csSetValue(id, value, labelOverride) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.value = value;
  const display = document.getElementById(id + '-display');
  if (!display) return;
  const opts = sel._csOptions || [];
  const found = opts.find(o => o.value === value);
  const label = labelOverride || (found ? found.label : null) || value || '';
  display.textContent = label || 'Selecione';
  display.classList.toggle('text-muted', !label || !value);
}

function csReset(id) {
  const sel = document.getElementById(id);
  if (sel) sel.value = '';
  const display = document.getElementById(id + '-display');
  if (display) { display.textContent = 'Selecione'; display.classList.add('text-muted'); }
}

function csSetDisabled(id, disabled) {
  const btn = document.getElementById(id + '-btn');
  if (!btn) return;
  btn._csDisabled = disabled;
  btn.style.opacity = disabled ? '0.5' : '';
  btn.style.pointerEvents = disabled ? 'none' : '';
  btn.style.cursor = disabled ? 'not-allowed' : '';
}
// ─────────────────────────────────────────────────────────────

function formBack() {
  goBack();
}

function populateCatOptions(tipo) {
  const catSel=document.getElementById('f-categoria');
  catSel.innerHTML='<option value="">Selecione</option>';
  const cats=categories[tipo]||[];
  cats.forEach(c=>{const o=document.createElement('option');o.value=c.name;o.textContent=c.name;catSel.appendChild(o);});
  const outros=document.createElement('option'); outros.value='Outros'; outros.textContent='Outros'; catSel.appendChild(outros);
  csStoreOptions('f-categoria', [...cats.map(c=>({value:c.name, label:c.name})), {value:'Outros', label:'Outros'}]);
  csReset('f-categoria');
}

function onCatChange() {
  const val = document.getElementById('f-categoria').value;
  const isOutros = val === 'Outros';
  document.getElementById('f-categoria-custom-wrap').style.display = isOutros ? 'block' : 'none';
  if (!isOutros) document.getElementById('f-categoria-custom').value = '';
  const tipo = document.getElementById('f-tipo').value;
  populateSubCatFromCat(tipo, val);
  updateCategoriaGroupHint(tipo, val);
}

function updateCategoriaGroupHint(tipo, catName) {
  const el = document.getElementById('f-categoria-group');
  if (!el) return;
  const cat = (categories[tipo] || []).find(c => c.name === catName);
  const group = cat && cat.groupId ? (catGroups[tipo] || []).find(g => g.id === cat.groupId) : null;
  el.textContent = group ? group.name : '';
  el.classList.toggle('d-none', !group);
}

function populateSubCatFromCat(tipo, catName) {
  const sel = document.getElementById('f-subcategoria');
  if (!sel) return;
  const hasCategory = !!catName;
  let subs = [];
  if (hasCategory) {
    const cat = (categories[tipo] || []).find(c => c.name === catName);
    if (cat && cat.subs && cat.subs.length) subs = cat.subs;
  }
  const opts = hasCategory ? [...subs, 'outros'] : ['outros'];
  sel.innerHTML = '<option value="">Selecione</option>' +
    opts.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v === 'outros' ? 'Outros' : v)}</option>`).join('');
  // inclui uma opção em branco na lista pra permitir desmarcar a sub-categoria
  // depois de escolhida — ela não é obrigatória, o lançamento pode ficar sem.
  csStoreOptions('f-subcategoria', [{value: '', label: 'Nenhuma'}, ...opts.map(v => ({value: v, label: v === 'outros' ? 'Outros' : v}))]);
  csReset('f-subcategoria');
  document.getElementById('f-subcategoria-custom-wrap').style.display = 'none';
  document.getElementById('f-subcategoria-custom').value = '';
  csSetDisabled('f-subcategoria', !hasCategory);
  const wrap = document.getElementById('subcategoria-wrap');
  if (wrap) {
    wrap.style.opacity = hasCategory ? '' : '0.45';
    wrap.style.pointerEvents = hasCategory ? '' : 'none';
  }
}

function onSubCatChange() {
  const val = document.getElementById('f-subcategoria').value;
  document.getElementById('f-subcategoria-custom-wrap').style.display = val === 'outros' ? 'block' : 'none';
  if (val !== 'outros') document.getElementById('f-subcategoria-custom').value = '';
}

function getCustomSubcats(tipo) {
  try { return JSON.parse(localStorage.getItem('ff_custom_subcats_' + tipo) || '[]'); } catch { return []; }
}

function saveCustomSubcat(tipo, val) {
  const list = getCustomSubcats(tipo);
  if (list.includes(val)) return;
  list.push(val);
  localStorage.setItem('ff_custom_subcats_' + tipo, JSON.stringify(list));
  const idx = SUBCAT_MAP[tipo]?.indexOf('outros');
  if (idx != null && idx >= 0) SUBCAT_MAP[tipo].splice(idx, 0, val);
}

function openNovo(tipo) {
  ensureCSInit();
  editingId=null;
  document.getElementById('form-title').textContent='Novo';
  document.getElementById('remove-row').style.display='none';
  clearForm();
  const t=new Date();
  setDataField(String(t.getDate()).padStart(2,'0'), String(t.getMonth()+1).padStart(2,'0'), t.getFullYear());
  const preselect = tipo || currentListingType;
  if (preselect) setTipo(preselect);
  showScreen('form');
}

function openEdit(id) {
  ensureCSInit();
  editingId=id;
  const e=entries.find(x=>x.id===id); if (!e) return;
  document.getElementById('form-title').textContent='Editar';
  clearForm();
  document.getElementById('remove-row').style.display='block';
  setTipo(e.tipo);
  setValorField(e.valor);
  setDataField(String(e.dd).padStart(2,'0'), String(e.mm).padStart(2,'0'), e.yyyy);
  document.getElementById('f-obs').value=e.obs;
  setRepetirField(e.repetir);
  const pill=document.getElementById('status-'+e.status);
  if (pill) pill.checked=true;
  else { const first=document.querySelector('#status-pills input'); if (first) first.checked=true; }
  // restore categoria synchronously (setTipo already populated options via populateCatOptions)
  const catSel=document.getElementById('f-categoria');
  const knownCats=Array.from(catSel.options).map(o=>o.value);
  if (e.categoria && !knownCats.includes(e.categoria)) {
    catSel.value='Outros';
    csSetValue('f-categoria','Outros');
    document.getElementById('f-categoria-custom-wrap').style.display='block';
    document.getElementById('f-categoria-custom').value=e.categoria;
  } else {
    catSel.value=e.categoria||'';
    csSetValue('f-categoria', e.categoria||'');
    document.getElementById('f-categoria-custom-wrap').style.display = e.categoria==='Outros'?'block':'none';
    document.getElementById('f-categoria-custom').value='';
  }
  // populate subcategoria options then restore value
  const resolvedCat=(e.categoria && knownCats.includes(e.categoria)) ? e.categoria : null;
  populateSubCatFromCat(e.tipo, resolvedCat);
  updateCategoriaGroupHint(e.tipo, resolvedCat);
  const subSel=document.getElementById('f-subcategoria');
  const knownValues=Array.from(subSel.options).map(o=>o.value);
  const subcatWrap=document.getElementById('f-subcategoria-custom-wrap');
  const customInp=document.getElementById('f-subcategoria-custom');
  if (e.subcategoria && !knownValues.includes(e.subcategoria)) {
    subSel.value='outros';
    csSetValue('f-subcategoria','outros','Outros');
    subcatWrap.style.display='block';
    customInp.value=e.subcategoria;
  } else {
    subSel.value=e.subcategoria||'';
    csSetValue('f-subcategoria', e.subcategoria||'');
    subcatWrap.style.display='none';
    customInp.value='';
  }
  showScreen('form');
}

const TIPO_TAB_COLOR_CLASS = {receita:'status-cell-receita', despesa:'status-cell-despesa', investimento:'status-cell-investimento'};
function clearForm() {
  ['f-tipo','f-categoria','f-subcategoria','f-obs'].forEach(id=>{ document.getElementById(id).value=''; });
  TIPO_TABS.forEach(t => {
    const btn = document.getElementById('tab-tipo-' + t);
    if (btn) btn.className = 'badge status-cell status-cell-white d-inline-flex align-items-center';
  });
  _setFormFieldsDisabled(true);
  csReset('f-categoria');
  csReset('f-subcategoria');
  csSetDisabled('f-subcategoria', true);
  const _swrap = document.getElementById('subcategoria-wrap');
  if (_swrap) { _swrap.style.opacity = '0.45'; _swrap.style.pointerEvents = 'none'; }
  document.getElementById('f-categoria-custom').value='';
  document.getElementById('f-categoria-custom-wrap').style.display='none';
  document.getElementById('f-categoria-save').checked=true;
  document.getElementById('f-categoria-group').classList.add('d-none');
  document.getElementById('f-subcategoria-custom').value='';
  document.getElementById('f-subcategoria-custom-wrap').style.display='none';
  document.getElementById('f-subcategoria-save').checked=true;
  document.getElementById('repetir-none').checked = true;
  document.getElementById('f-valor').value='';
  document.getElementById('f-data').value='';
  document.getElementById('f-dd').value='';
  document.getElementById('f-mm').value='';
  document.getElementById('f-yyyy').value='';
  renderStatusPills('');
}

function onDataInput(el) {
  const cur = el.selectionStart;
  const prev = el.value;
  let digits = prev.replace(/\D/g, '').slice(0, 8);
  let out = '';
  if (digits.length > 0) out = digits.slice(0, 2);
  if (digits.length > 2) out += '/' + digits.slice(2, 4);
  if (digits.length > 4) out += '/' + digits.slice(4, 8);
  el.value = out;
  // restore cursor, skipping over auto-inserted slashes
  let newPos = cur;
  if (prev.length < out.length && (out[cur] === '/')) newPos = cur + 1;
  el.setSelectionRange(newPos, newPos);
  syncDateHidden(out);
}

function syncDateHidden(val) {
  const p = val.split('/');
  document.getElementById('f-dd').value   = p[0] || '';
  document.getElementById('f-mm').value   = p[1] || '';
  document.getElementById('f-yyyy').value = p[2] || '';
}

function setDataField(dd, mm, yyyy) {
  const val = `${dd}/${mm}/${yyyy}`;
  document.getElementById('f-data').value  = val;
  document.getElementById('f-dd').value    = dd;
  document.getElementById('f-mm').value    = mm;
  document.getElementById('f-yyyy').value  = String(yyyy);
}

/* ── Date Picker (M3) ── */
const DP_WEEKDAYS = ['D','S','T','Q','Q','S','S'];
const DP_MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
let dpYear, dpMonth, dpSelectedDay;

function openDatePicker() {
  const ddEl = document.getElementById('f-dd'), mmEl = document.getElementById('f-mm'), yyyyEl = document.getElementById('f-yyyy');
  const today = new Date();
  dpYear  = yyyyEl.value ? parseInt(yyyyEl.value) : today.getFullYear();
  dpMonth = mmEl.value ? parseInt(mmEl.value) - 1 : today.getMonth();
  dpSelectedDay = ddEl.value ? parseInt(ddEl.value) : null;
  renderDatePicker();
  document.getElementById('datepicker-overlay').classList.add('open');
  document.getElementById('datepicker-sheet').classList.add('open');
}

function closeDatePicker() {
  document.getElementById('datepicker-overlay').classList.remove('open');
  document.getElementById('datepicker-sheet').classList.remove('open');
}

function dpChangeMonth(delta) {
  dpMonth += delta;
  if (dpMonth < 0) { dpMonth = 11; dpYear--; }
  else if (dpMonth > 11) { dpMonth = 0; dpYear++; }
  renderDatePicker();
}

function dpSelectDay(d) {
  dpSelectedDay = d;
  renderDatePicker();
}

function dpConfirm() {
  if (!dpSelectedDay) { closeDatePicker(); return; }
  setDataField(String(dpSelectedDay).padStart(2,'0'), String(dpMonth+1).padStart(2,'0'), dpYear);
  closeDatePicker();
}

function renderDatePicker() {
  document.getElementById('dp-month-label').textContent = `${DP_MONTHS_FULL[dpMonth]} ${dpYear}`;
  document.getElementById('dp-weekdays').innerHTML = DP_WEEKDAYS.map(w =>
    `<span class="small text-secondary">${w}</span>`
  ).join('');

  const today = new Date(); today.setHours(0,0,0,0);
  const firstWeekday = new Date(dpYear, dpMonth, 1).getDay();
  const daysInMonth = new Date(dpYear, dpMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push('<span></span>');
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getFullYear()===dpYear && today.getMonth()===dpMonth && today.getDate()===d;
    const isSelected = dpSelectedDay === d;
    const cls = isSelected ? 'dp-day dp-day-selected' : (isToday ? 'dp-day dp-day-today' : 'dp-day');
    cells.push(`<button type="button" class="${cls}" onclick="dpSelectDay(${d})">${d}</button>`);
  }
  document.getElementById('dp-days').innerHTML = cells.join('');
}

function onValorInput(el) {
  const digits = el.value.replace(/\D/g, '');
  if (!digits) { el.value = ''; return; }
  const num = parseInt(digits, 10);
  const cents = num % 100;
  const reais = Math.floor(num / 100);
  el.value = (reais > 0 ? reais.toLocaleString('pt-BR') : '0') + ',' + String(cents).padStart(2, '0');
}

function setValorField(val) {
  const num = Math.round(val * 100);
  const cents = num % 100;
  const reais = Math.floor(num / 100);
  document.getElementById('f-valor').value =
    (reais > 0 ? reais.toLocaleString('pt-BR') : '0') + ',' + String(cents).padStart(2, '0');
}

function parseValor() {
  const v = document.getElementById('f-valor').value.replace(/\./g, '').replace(',', '.');
  return parseFloat(v) || 0;
}

const SUBCAT_MAP = {
  investimento: [
    'Ações',
    'CDB',
    'COE',
    'Criptomoedas',
    'Debêntures',
    'ETFs',
    'FIIs',
    'Fundos de Investimento',
    'LCI / LCA',
    'Poupança',
    'Previdência (PGBL/VGBL)',
    'Tesouro Direto',
    'outros',
  ],
  receita: [
    '13º Salário',
    'Adiantamento de Salário',
    'Aluguel Recebido',
    'Benefício',
    'Bonificação',
    'Cashback',
    'Comissão',
    'Dividendos',
    'Doação Recebida',
    'Férias – 1/3 Constitucional',
    'Férias – Adiantamento',
    'Freelance',
    'Pagamento de Serviço',
    'Participação nos Lucros (PL)',
    'Reembolso',
    'Rendimento de Aplicação',
    'Resgate de Investimento',
    'Retorno de Investimento',
    'Salário',
    'Venda de Bem',
    'outros',
  ],
  despesa: [
    'Alimentação',
    'Aposta',
    'Assinatura',
    'Beleza',
    'Cartão de crédito',
    'Casa',
    'Combustível',
    'Compras',
    'Conveniência',
    'Doação',
    'Educação',
    'Empréstimo',
    'Farmácia',
    'Financiamento',
    'Freelance',
    'Hospedagem',
    'Imposto/Juros',
    'Internet/Telefone',
    'Investimento',
    'Lazer',
    'Manutenção',
    'Moradia',
    'Pessoal',
    'Pet',
    'Restaurante',
    'Saúde',
    'Seguro',
    'Transporte',
    'Vestuário',
    'Viagem',
    'outros',
  ],
};

function populateSubCatOptions(tipo) {
  const sel = document.getElementById('f-subcategoria');
  const base = SUBCAT_MAP[tipo] || [];
  const custom = getCustomSubcats(tipo);
  const othersIdx = base.indexOf('outros');
  const merged = [...base];
  custom.forEach(v => { if (!merged.includes(v)) merged.splice(othersIdx >= 0 ? othersIdx : merged.length, 0, v); });
  sel.innerHTML = '<option value="">Selecione</option>' +
    merged.map(v => `<option value="${v}">${v === 'outros' ? 'Outros' : v}</option>`).join('');
  csStoreOptions('f-subcategoria', merged.map(v=>({value:v, label: v==='outros'?'Outros':v})));
  csReset('f-subcategoria');
  document.getElementById('f-subcategoria-custom-wrap').style.display = 'none';
  document.getElementById('f-subcategoria-custom').value = '';
}

const STATUS_MAP = {
  receita:      [{value:'a_receber',  label:'A receber'}, {value:'recebido',   label:'Recebido'}],
  despesa:      [{value:'pendente',   label:'A pagar'},   {value:'pago',       label:'Pago'}],
  investimento: [{value:'a_investir', label:'A investir'},{value:'investido',  label:'Investido'}],
};
const STATUS_PILL_COLOR_CLASS = {
  a_receber:'status-cell-neutral', recebido:'status-cell-success',
  pendente:'status-cell-neutral',  pago:'status-cell-success',
  a_investir:'status-cell-neutral',investido:'status-cell-success',
};

function renderStatusPills(tipo) {
  const container = document.getElementById('status-pills');
  const opts = STATUS_MAP[tipo] || [];
  if (!opts.length) {
    container.innerHTML = '<span class="text-muted small">Selecione o tipo primeiro.</span>';
    return;
  }
  container.innerHTML = opts.map((o, i) =>
    `<input type="radio" class="btn-check" name="f-status" id="status-${o.value}" value="${o.value}" autocomplete="off"${i===0?' checked':''}>` +
    `<label class="badge status-cell ${STATUS_PILL_COLOR_CLASS[o.value]}" for="status-${o.value}">${o.label}</label>`
  ).join('');
}

const TIPO_TABS = ['receita','despesa','investimento'];

function _setFormFieldsDisabled(disabled) {
  const wrap = document.getElementById('form-fields');
  if (!wrap) return;
  wrap.style.opacity = disabled ? '0.4' : '';
  wrap.style.pointerEvents = disabled ? 'none' : '';
}

function setTipo(tipo) {
  if (document.getElementById('f-tipo').value === tipo) return;
  document.getElementById('f-tipo').value = tipo;
  TIPO_TABS.forEach(t => {
    const btn = document.getElementById('tab-tipo-' + t);
    if (!btn) return;
    btn.className = 'badge status-cell d-inline-flex align-items-center ' + (t === tipo ? TIPO_TAB_COLOR_CLASS[t] : 'status-cell-white');
  });
  _setFormFieldsDisabled(false);
  onTipoChange();
}

function onTipoChange() {
  const tipo = document.getElementById('f-tipo').value;
  renderStatusPills(tipo);
  populateCatOptions(tipo);
  document.getElementById('subcategoria-wrap').style.display = tipo ? 'block' : 'none';
  populateSubCatFromCat(tipo, '');
}

function getActiveRepetir() {
  const p = document.querySelector('#repetir-pills input:checked');
  return p ? p.value : '';
}

function setRepetirField(val) {
  const r = document.querySelector(`#repetir-pills input[value="${CSS.escape(val)}"]`);
  if (r) r.checked = true;
  else document.getElementById('repetir-none').checked = true;
}

function getActivePill() {
  const p = document.querySelector('#status-pills input:checked');
  return p ? p.value : null;
}

let _saving = false;
async function saveEntry() {
  if (_saving) return;
  const saveBtn = document.getElementById('save-entry-btn');
  const tipo=document.getElementById('f-tipo').value;
  const valor=parseValor();
  const dd=parseInt(document.getElementById('f-dd').value);
  const mm=parseInt(document.getElementById('f-mm').value);
  const yyyy=parseInt(document.getElementById('f-yyyy').value);
  const status=getActivePill();
  if (!tipo){showToast('Selecione o tipo.','error');return;}
  if (!valor||valor<=0){showToast('Informe um valor válido.','error');return;}
  if (!dd||!mm||!yyyy){showToast('Informe a data completa.','error');return;}
  if (!status){showToast('Selecione o status.','error');return;}
  _saving = true;
  setBtnLoading(saveBtn, true);

  const repetir=getActiveRepetir();
  const rawSubcat=document.getElementById('f-subcategoria').value;
  const customSubcat=document.getElementById('f-subcategoria-custom').value.trim();
  const subcategoria=rawSubcat==='outros' ? (customSubcat||'Outros') : rawSubcat;
  if (rawSubcat==='outros' && customSubcat && document.getElementById('f-subcategoria-save').checked) {
    saveCustomSubcat(tipo, customSubcat);
  }
  const rawCat=document.getElementById('f-categoria').value;
  const customCat=document.getElementById('f-categoria-custom').value.trim();
  const categoria=rawCat==='Outros' ? (customCat||'Outros') : rawCat;
  if (rawCat==='Outros' && customCat && document.getElementById('f-categoria-save').checked) {
    try {
      const data=await apiCreateCategory(tipo, customCat, '📌');
      categories[tipo].push(data.category);
    } catch(_) {}
  }
  const entry={tipo,categoria,subcategoria,valor,dd,mm,yyyy,status,obs:document.getElementById('f-obs').value,repetir,notif:false};

  try {
    let newId = null;
    if (editingId) {
      await apiUpdateEntry(editingId, entry);
      showToast('Lançamento atualizado.','success');
      newId = editingId; // fixa o card editado na primeira posição da listagem, igual ao criado
    } else {
      // recorrências mensal/anual são geradas no servidor (api/entries.php)
      const res = await apiCreateEntry(entry);
      newId = res.ids[0] || null;
      showToast(res.ids.length>1?`Salvo + ${res.ids.length-1} recorrência(s)!`:'Lançamento salvo.','success');
    }
    await refreshData();
    screenStack = ['home'];
    openListing(tipo, newId);
  } catch (e) {
    showToast(e.message,'error');
  } finally {
    _saving = false;
    setBtnLoading(saveBtn, false);
  }
}

function confirmRemove() {
  document.getElementById('modal-title').textContent='Remover lançamento?';
  document.getElementById('modal-desc').textContent='Esta ação não pode ser desfeita.';
  document.getElementById('modal-confirm-btn').onclick=removeEntry;
  showConfirmModal();
}
async function removeEntry() {
  hideConfirmModal();
  try {
    const tipo = (entries.find(x=>x.id===editingId)||{}).tipo||'';
    await apiDeleteEntry(editingId);
    await refreshData();
    showToast('Lançamento removido.','success');
    screenStack = ['home'];
    if (tipo) openListing(tipo); else { showScreen('home',false); renderHome(); }
  } catch (e) {
    showToast(e.message,'error');
  }
}
