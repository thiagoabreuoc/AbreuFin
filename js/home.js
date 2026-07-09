/* ═══════════════════════════════════════
   HOME
═══════════════════════════════════════ */
let homeTab = 'anos';
let homeMonth = new Date().getMonth();
let homeYear = new Date().getFullYear();
let dismissedBanners = { vencido: false, vencendo: false };

let _areaYs  = null;
let _areaXs  = null;
let _areaRaf = null;

function dismissBanner(kind) {
  dismissedBanners[kind] = true;
  const el = document.getElementById('banner-'+kind);
  if (el) el.remove();
}

function setTabActive(btn, active) {
  btn.classList.toggle('active', active);
}

function updateNovoBtn() {
  const now = new Date();
  const curYear  = now.getFullYear();
  const curMonth = now.getMonth();
  const activeScreen = document.querySelector('.screen.active');
  const screenId = activeScreen && activeScreen.id;
  const onAllowed = screenId === 'screen-home' || screenId === 'screen-listing';
  let allowed;
  if (homeTab === 'anos') {
    allowed = homeYear >= curYear;
  } else {
    if (homeYear < curYear) allowed = false;
    else if (homeYear === curYear) allowed = homeMonth >= curMonth;
    else allowed = true;
  }
  const wrap = document.getElementById('btn-novo-wrap');
  if (wrap) {
    const show = onAllowed && allowed;
    wrap.style.display = show ? 'flex' : 'none';
    if (!show) closeFabMenu();
  }
}

/* ── FAB Menu (M3) ── */
function toggleFabMenu() {
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen && activeScreen.id === 'screen-listing' && currentListingType) {
    selectFabAction(currentListingType);
    return;
  }
  const wrap = document.getElementById('btn-novo-wrap');
  if (wrap && wrap.classList.contains('fab-open')) closeFabMenu();
  else openFabMenu();
}
function openFabMenu() {
  const wrap = document.getElementById('btn-novo-wrap');
  if (!wrap) return;
  wrap.classList.add('fab-open');
  document.getElementById('fab-scrim').classList.add('open');
  document.getElementById('fab-main').setAttribute('aria-expanded', 'true');
}
function closeFabMenu() {
  const wrap = document.getElementById('btn-novo-wrap');
  if (!wrap) return;
  wrap.classList.remove('fab-open');
  const scrim = document.getElementById('fab-scrim');
  if (scrim) scrim.classList.remove('open');
  const btn = document.getElementById('fab-main');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}
function selectFabAction(tipo) {
  closeFabMenu();
  openNovo(tipo);
}

function switchHomeTab(tab) {
  homeTab = tab;
  ['anos','meses'].forEach(t => setTabActive(document.getElementById('tab-'+t), t===tab));
  document.getElementById('year-strip').style.display  = tab==='anos'  ? 'flex' : 'none';
  document.getElementById('month-strip').style.display = tab==='meses' ? 'flex' : 'none';
  if (tab === 'anos') buildYearStrip();
  _areaYs  = null;
  updateNovoBtn();
  renderHome();
}

function attachStripScroll(strip) {
  strip.addEventListener('wheel', e => {
    if (e.deltaY !== 0) { e.preventDefault(); strip.scrollLeft += e.deltaY; }
  }, { passive: false });
  let isDragging = false, startX, startScroll, dragMoved = false;
  strip.addEventListener('mousedown', e => { isDragging = true; dragMoved = false; startX = e.pageX; startScroll = strip.scrollLeft; strip.style.cursor = 'grabbing'; });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 4) { dragMoved = true; strip.scrollLeft = startScroll - dx; }
  });
  document.addEventListener('mouseup', () => { isDragging = false; strip.style.cursor = ''; });
  strip.addEventListener('click', e => { if (dragMoved) e.stopPropagation(); }, true);
}

function buildMonthStrip() {
  const strip = document.getElementById('month-strip');
  strip.innerHTML =
    MONTHS.map((m,i) => `<button class="btn btn-sm rounded-pill flex-shrink-0 ${i===homeMonth?'btn-primary':'tab-inactive text-primary'}" style="border:none" onclick="selectMonth(${i})">${m}</button>`).join('');
  attachStripScroll(strip);
  setTimeout(function() {
    var active = strip.querySelector('.btn-primary');
    if (active) strip.scrollLeft = active.offsetLeft - (strip.offsetWidth / 2) + (active.offsetWidth / 2);
  }, 50);
}

function buildYearStrip() {
  const years = [...new Set(entries.map(e => e.yyyy))].sort((a,b) => a-b);
  if (!years.length) years.push(homeYear);
  if (!years.includes(homeYear)) homeYear = years[years.length - 1];
  const strip = document.getElementById('year-strip');
  strip.innerHTML = years.map(y =>
    `<button class="btn btn-sm rounded-pill flex-shrink-0 ${y===homeYear?'btn-primary':'tab-inactive text-primary'}" style="border:none" onclick="selectYear(${y})">${y}</button>`
  ).join('');
  attachStripScroll(strip);
}

function selectYear(y) {
  homeYear = y;
  document.querySelectorAll('#year-strip .btn').forEach(b => {
    const by = parseInt(b.textContent);
    b.classList.toggle('btn-primary', by===y);
    b.classList.toggle('tab-inactive', by!==y);
    b.classList.toggle('text-primary', by!==y);
  });
  updateNovoBtn();
  if (document.getElementById('chart-area-svg')) {
    updateYearView();
  } else {
    renderHome();
  }
}

function selectMonth(i) {
  homeMonth = i;
  document.querySelectorAll('#month-strip .btn').forEach((b,idx) => {
    b.classList.toggle('btn-primary', idx===i);
    b.classList.toggle('tab-inactive', idx!==i);
    b.classList.toggle('text-primary', idx!==i);
  });
  updateNovoBtn();
  if (homeTab === 'meses' && document.getElementById('chart-bars-svg')) {
    const d = getMonthTotals(homeMonth);
    renderBanners();
    animateBarsTo(d);
    document.getElementById('home-legend').innerHTML = buildLegendHtml(d);
    const dc = getConfirmedTotals(homeMonth);
    const saldo = dc.receita - dc.despesa - dc.investimento;
    const sv = document.getElementById('home-saldo-val');
    if (sv) sv.textContent = fmt(saldo);
    const sl = document.getElementById('home-periodo');
    if (sl) sl.textContent = `${MONTHS_FULL[homeMonth]} ${homeYear}`;
  } else {
    renderHome();
  }
}

const TIPO_META = {
  get receita()      { return {cor: cssVar('--md-extended-color-receita-color'),      label:'Receita'}; },
  get despesa()      { return {cor: cssVar('--md-sys-color-error'),                   label:'Despesa'}; },
  get investimento() { return {cor: cssVar('--md-extended-color-investimento-color'), label:'Investido'}; },
};
const TIPOS = ['receita','despesa','investimento'];

function getMonthTotals(month, year=2026) {
  return entries.filter(e => e.mm-1===month && e.yyyy===year)
    .reduce((a,e)=>{ a[e.tipo]=(a[e.tipo]||0)+e.valor; return a; },{receita:0,despesa:0,investimento:0});
}
function getYearTotals(year=2026) {
  return entries.filter(e=>e.yyyy===year)
    .reduce((a,e)=>{ a[e.tipo]=(a[e.tipo]||0)+e.valor; return a; },{receita:0,despesa:0,investimento:0});
}

const CONFIRMED_STATUS = {receita:'recebido', despesa:'pago', investimento:'investido'};
function getConfirmedTotals(month, year=2026) {
  return entries.filter(e => e.mm-1===month && e.yyyy===year && e.status===CONFIRMED_STATUS[e.tipo])
    .reduce((a,e)=>{ a[e.tipo]=(a[e.tipo]||0)+e.valor; return a; },{receita:0,despesa:0,investimento:0});
}
function getConfirmedYearTotals(year=2026) {
  return entries.filter(e => e.yyyy===year && e.status===CONFIRMED_STATUS[e.tipo])
    .reduce((a,e)=>{ a[e.tipo]=(a[e.tipo]||0)+e.valor; return a; },{receita:0,despesa:0,investimento:0});
}

function formatAxisValue(v) {
  return Math.round(v).toLocaleString('pt-BR');
}

// Arredonda o valor máximo do eixo pra um número "redondo" (1/2/5 × 10^n),
// em vez de usar a fração exata do maior valor real
function niceCeil(value) {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  const frac = value / base;
  let niceFrac;
  if (frac <= 1) niceFrac = 1;
  else if (frac <= 2) niceFrac = 2;
  else if (frac <= 5) niceFrac = 5;
  else niceFrac = 10;
  return niceFrac * base;
}

function buildGridLines(chartW, H, maxVal) {
  const stroke = cssVar('--md-sys-color-outline-variant');
  return [1, 0.75, 0.5, 0.25, 0].map(pct => {
    const y = H - pct * H * 0.92;
    return pct > 0
      ? `<line x1="0" y1="${y}" x2="${chartW}" y2="${y}" stroke="${stroke}" stroke-width="1" stroke-dasharray="4,3"/>`
      : `<line x1="0" y1="${y}" x2="${chartW}" y2="${y}" stroke="${stroke}" stroke-width="1"/>`;
  }).join('');
}

function makeLinePath(ys, xs) {
  const n = ys.length;
  if (n === 1) return `M 0 ${ys[0]} L ${xs[0]} ${ys[0]}`;
  let path = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < n; i++) {
    const cpx = (xs[i-1] + xs[i]) / 2;
    path += ` C ${cpx} ${ys[i-1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  return path;
}

function buildAreaChart(data, xLabels) {
  if (data.every(d => TIPOS.every(t => d[t] === 0))) return emptyChart();
  const W = 320, H = 100, PAD_B = 20, PAD_R = 8;
  const chartW = W - PAD_R;
  const n = data.length;
  const maxVal = niceCeil(Math.max(1, ...data.flatMap(d => TIPOS.map(t => d[t]))));
  const xs = data.map((_, i) => n === 1 ? chartW/2 : (i / (n-1)) * chartW);

  _areaXs = xs;
  _areaYs = {};
  TIPOS.forEach(tipo => {
    _areaYs[tipo] = data.map(d => H - (d[tipo] / maxVal) * H * 0.92);
  });

  const lines = TIPOS.map(tipo =>
    `<path id="chart-area-${tipo}" d="${makeLinePath(_areaYs[tipo], xs)}" fill="none" stroke="${TIPO_META[tipo].cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  ).join('');

  const labelColor = cssVar('--md-sys-color-outline');
  // rótulos esparsos no eixo X (primeiro/meio/último), como no gráfico de referência
  const idxs = n <= 3 ? data.map((_, i) => i) : [0, Math.floor((n - 1) / 2), n - 1];
  const xLabelsSvg = idxs.map(i =>
    `<text x="${xs[i]}" y="${H + PAD_B - 2}" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}" font-size="8" fill="${labelColor}">${xLabels[i]}</text>`
  ).join('');

  return `<svg id="chart-area-svg" viewBox="0 0 ${W} ${H + PAD_B}" width="100%" style="display:block;overflow:visible">${buildGridLines(chartW,H,maxVal)}${lines}${xLabelsSvg}</svg>`;
}

function animateAreaTo(targetData) {
  if (_areaRaf) { cancelAnimationFrame(_areaRaf); _areaRaf = null; }

  const W = 320, H = 100, PAD_R = 8;
  const chartW = W - PAD_R;
  const n = targetData.length;
  const maxVal = niceCeil(Math.max(1, ...targetData.flatMap(d => TIPOS.map(t => d[t]))));
  const xs = _areaXs || targetData.map((_, i) => n === 1 ? chartW/2 : (i / (n-1)) * chartW);

  const toYs = {};
  TIPOS.forEach(tipo => {
    toYs[tipo] = targetData.map(d => H - (d[tipo] / maxVal) * H * 0.92);
  });

  // Read current Y values from DOM paths as starting point
  const fromYs = _areaYs
    ? {..._areaYs}
    : Object.fromEntries(TIPOS.map(t => [t, new Array(n).fill(H)]));

  const DURATION = 380;
  const startTime = performance.now();
  const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

  function frame(now) {
    const t = ease(Math.min((now - startTime) / DURATION, 1));
    const curYs = {};
    TIPOS.forEach(tipo => {
      curYs[tipo] = fromYs[tipo].map((fy, i) => fy + (toYs[tipo][i] - fy) * t);
      const path = document.getElementById('chart-area-' + tipo);
      if (path) path.setAttribute('d', makeLinePath(curYs[tipo], xs));
    });
    _areaYs = curYs;
    if (t < 1) _areaRaf = requestAnimationFrame(frame);
    else _areaRaf = null;
  }

  _areaRaf = requestAnimationFrame(frame);
}

function updateYearView() {
  const yr = homeYear;
  const chartData = Array.from({length:12}, (_, m) =>
    entries.filter(e => e.mm-1===m && e.yyyy===yr)
      .reduce((a,e)=>{ a[e.tipo]=(a[e.tipo]||0)+e.valor; return a; },{receita:0,despesa:0,investimento:0})
  );
  const d = getYearTotals(yr);
  renderBanners();
  animateAreaTo(chartData);
  document.getElementById('home-legend').innerHTML = buildLegendHtml(d);
  const pl = document.getElementById('home-periodo');
  if (pl) pl.textContent = String(yr);
}

function emptyChart() {
  return `<div style="height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:${cssVar('--md-sys-color-outline')}">
    <span class="material-symbols-outlined" style="font-size:1.6rem;margin-bottom:6px">bar_chart</span>
    <span class="small">Sem movimentação até o momento</span>
  </div>`;
}

let _barRaf = null;

function buildBarChart(d) {
  if (d.receita + d.despesa + d.investimento === 0) return emptyChart();
  const W = 320, H = 100, R = 6, GAP = 4, PAD_R = 8;
  const chartW = W - PAD_R;
  const maxVal = niceCeil(Math.max(1, ...TIPOS.map(t => d[t])));
  const barW = (chartW - GAP * (TIPOS.length - 1)) / TIPOS.length;
  const bars = TIPOS.map((tipo, i) => {
    const x = i * (barW + GAP);
    const barH = Math.max((d[tipo] / maxVal) * H * 0.92, d[tipo] > 0 ? 4 : 0);
    const y = H - barH;
    const c = TIPO_META[tipo].cor;
    return `<rect id="chart-bar-${tipo}" x="${x}" y="${y}" width="${barW}" height="${barH}" rx="${R}" ry="${R}"
      fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.5"/>`;
  }).join('');
  return `<svg id="chart-bars-svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible">${buildGridLines(chartW,H,maxVal)}${bars}</svg>`;
}

function animateBarsTo(target) {
  if (_barRaf) { cancelAnimationFrame(_barRaf); _barRaf = null; }

  const H = 100;
  const maxVal = niceCeil(Math.max(1, target.receita, target.despesa, target.investimento));
  const DURATION = 380;
  const startTime = performance.now();
  const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

  // Lê as alturas atuais do DOM — ponto de partida visual exato
  const fromH = {};
  TIPOS.forEach(tipo => {
    const rect = document.getElementById('chart-bar-' + tipo);
    fromH[tipo] = rect ? parseFloat(rect.getAttribute('height')) || 0 : 0;
  });

  const toH = {};
  TIPOS.forEach(tipo => {
    toH[tipo] = Math.max((target[tipo] / maxVal) * H * 0.92, 0);
  });

  function frame(now) {
    const t = ease(Math.min((now - startTime) / DURATION, 1));
    TIPOS.forEach(tipo => {
      const rect = document.getElementById('chart-bar-' + tipo);
      if (!rect) return;
      const barH = fromH[tipo] + (toH[tipo] - fromH[tipo]) * t;
      rect.setAttribute('y', H - barH);
      rect.setAttribute('height', barH);
    });
    if (t < 1) _barRaf = requestAnimationFrame(frame);
    else _barRaf = null;
  }

  _barRaf = requestAnimationFrame(frame);
}

function buildSubLabels(d) {
  const sub = {receita:'', despesa:'', investimento:''};

  if (homeTab === 'meses') {
    const prevMonth = homeMonth === 0 ? 11 : homeMonth - 1;
    const prevYear  = homeMonth === 0 ? homeYear - 1 : homeYear;
    const prev = getMonthTotals(prevMonth, prevYear);
    const faint = cssVar('--md-sys-color-outline');
    if (prev.receita > 0) {
      const pct = ((d.receita - prev.receita) / prev.receita) * 100;
      const up = pct >= 0;
      sub.receita = `<div class="smaller" style="color:${up ? TIPO_META.receita.cor : TIPO_META.despesa.cor}">${up?'↑':'↓'} ${Math.abs(pct).toFixed(1)}% vs mês ant.</div>`;
    } else if (d.receita > 0) {
      sub.receita = `<div class="smaller" style="color:${faint}">sem mês ant.</div>`;
    }
    if (d.receita > 0) {
      sub.despesa      = `<div class="smaller" style="color:${faint}">${((d.despesa / d.receita)*100).toFixed(1)}% da receita</div>`;
      sub.investimento = `<div class="smaller" style="color:${faint}">${((d.investimento / d.receita)*100).toFixed(1)}% da receita</div>`;
    }
  } else if (homeTab === 'anos') {
    const faint = cssVar('--md-sys-color-outline');
    const prev = getYearTotals(homeYear - 1);
    const hasPrev = prev.receita + prev.despesa + prev.investimento > 0;
    TIPOS.forEach(tipo => {
      if (prev[tipo] > 0) {
        const pct = ((d[tipo] - prev[tipo]) / prev[tipo]) * 100;
        const up = pct >= 0;
        sub[tipo] = `<div class="smaller" style="color:${up ? TIPO_META.receita.cor : TIPO_META.despesa.cor}">${up?'↑':'↓'} ${Math.abs(pct).toFixed(1)}% vs ano ant.</div>`;
      } else if (hasPrev && d[tipo] > 0) {
        sub[tipo] = `<div class="smaller" style="color:${faint}">novo</div>`;
      } else if (!hasPrev && d[tipo] > 0) {
        sub[tipo] = `<div class="smaller" style="color:${faint}">sem ano ant.</div>`;
      }
    });
  }

  return sub;
}

function buildLegendHtml(d) {
  const sub = (homeTab === 'meses' || homeTab === 'anos') ? buildSubLabels(d) : {receita:'', despesa:'', investimento:''};
  const clickable = homeTab === 'meses';
  const detalheLbl = clickable
    ? `<div class="fw-semibold text-primary" style="font-size:.7rem;margin-top:8px">Detalhe</div>`
    : '';
  return TIPOS.map(tipo =>
    `<div class="text-center" style="flex:1${clickable ? ';cursor:pointer' : ''}" ${clickable ? `onclick="openListing('${tipo}')"` : ''}>
      <div class="small">${TIPO_META[tipo].label}</div>
      <div class="small">${fmt(d[tipo])}</div>
      ${sub[tipo]}
      ${detalheLbl}
    </div>`
  ).join('');
}

function renderBanners() {
  const today = new Date(); today.setHours(0,0,0,0);
  const in3 = new Date(today); in3.setDate(today.getDate()+3);
  const vencendoCount = entries.filter(e => {
    if (e.tipo!=='despesa'||e.status!=='pendente') return false;
    const d2 = new Date(e.yyyy,e.mm-1,e.dd); d2.setHours(0,0,0,0);
    return d2 >= today && d2 <= in3;
  }).length;
  const vencidoCount = entries.filter(e => {
    if (e.tipo!=='despesa'||e.status!=='pendente') return false;
    const d2 = new Date(e.yyyy,e.mm-1,e.dd); d2.setHours(0,0,0,0);
    return d2 < today;
  }).length;

  let banners = '';
  if (vencidoCount > 0 && !dismissedBanners.vencido)
    banners += `<div class="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded" id="banner-vencido" style="background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container)">
      <span class="small" onclick="goToVencendo('vencido')" style="cursor:pointer">${vencidoCount} despesa${vencidoCount>1?'s':''} vencida${vencidoCount>1?'s':''}. <u>Resolver</u></span>
      <button type="button" class="btn btn-link p-0" style="color:inherit;line-height:0" onclick="dismissBanner('vencido')"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
    </div>`;
  if (vencendoCount > 0 && !dismissedBanners.vencendo)
    banners += `<div class="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded" id="banner-vencendo" style="background:var(--md-extended-color-aviso-color-container);color:var(--md-extended-color-aviso-on-color-container)">
      <span class="small" onclick="goToVencendo('vencendo')" style="cursor:pointer">${vencendoCount} despesa${vencendoCount>1?'s':''} vencendo em 3 dias. <u>Ver</u></span>
      <button type="button" class="btn btn-link p-0" style="color:inherit;line-height:0" onclick="dismissBanner('vencendo')"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
    </div>`;
  const bannersEl = document.getElementById('home-banners');
  bannersEl.innerHTML = banners;
  bannersEl.style.marginTop = banners ? '16px' : '0';
  bannersEl.style.marginBottom = banners ? '16px' : '0';
}

function renderHome() {
  const yr = homeTab==='anos' ? homeYear : new Date().getFullYear();
  const d = homeTab==='meses' ? getMonthTotals(homeMonth) : getYearTotals(yr);
  renderBanners();

  let chartData, chartLabels;
  if (homeTab === 'anos') {
    const yr = homeYear;
    chartData = Array.from({length:12}, (_, m) =>
      entries.filter(e => e.mm-1===m && e.yyyy===yr)
        .reduce((a,e)=>{ a[e.tipo]=(a[e.tipo]||0)+e.valor; return a; },{receita:0,despesa:0,investimento:0})
    );
    chartLabels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  }

  const dc = homeTab==='meses' ? getConfirmedTotals(homeMonth) : getConfirmedYearTotals(yr);
  const saldo = dc.receita - dc.despesa - dc.investimento;
  const periodoLabel = homeTab==='meses' ? `${MONTHS_FULL[homeMonth]} ${homeYear}` : String(homeYear);
  const chart = homeTab==='meses' ? buildBarChart(d) : buildAreaChart(chartData, chartLabels);

  const summary =
    `<div class="card" style="border-radius:8px!important;margin-bottom:24px">
      <div class="card-body py-3 px-3">
        <div class="small text-center mb-3" id="home-periodo" style="font-weight:400">${periodoLabel}</div>
        <div class="mb-3">${chart}</div>
        <div id="home-legend" style="display:flex;justify-content:space-around">${buildLegendHtml(d)}</div>
      </div>
    </div>` +
    (homeTab==='meses' ? `<div class="card mb-2" style="border-radius:10px!important">
      <div class="card-body d-flex justify-content-between align-items-center py-2">
        <b>Saldo</b>
        <b id="home-saldo-val">${fmt(saldo)}</b>
      </div>
    </div>` : '');
  document.getElementById('home-summary').innerHTML = summary;
}
