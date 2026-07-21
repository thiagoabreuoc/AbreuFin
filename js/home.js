/* ═══════════════════════════════════════
   HOME
═══════════════════════════════════════ */
let homeTab = 'anos';
let homeMonth = new Date().getMonth();
let homeYear = new Date().getFullYear();
let dismissedBanners = { vencido: false, vencendo: false };

// Modo de entendimento dos valores da Home: "confirmado" (padrão) só soma
// o que já foi pago/recebido/investido; "todos" soma tudo, independente
// do status. Afeta saldo, gráficos (mensal e anual) e comparações.
let homeValueMode = 'confirmado';
function onHomeValueModeChange() {
  homeValueMode = document.getElementById('home-value-mode-toggle').checked ? 'todos' : 'confirmado';
  renderHome();
}
function homeValueModeToggleHtml() {
  const isTodos = homeValueMode === 'todos';
  return `<div class="d-flex align-items-center justify-content-center gap-2 mb-3" id="home-value-toggle-wrap">
    <span class="text-secondary" id="value-mode-label-off" style="font-size:.68rem;font-weight:${isTodos ? '400' : '700'}">Realizado</span>
    <div class="form-check form-switch mb-0">
      <input class="form-check-input" type="checkbox" id="home-value-mode-toggle" role="switch" onchange="onHomeValueModeChange()"${isTodos ? ' checked' : ''}>
    </div>
    <span class="text-secondary" id="value-mode-label-on" style="font-size:.68rem;font-weight:${isTodos ? '700' : '400'}">Previsto</span>
  </div>`;
}
function homeMonthTotals(month, year) {
  return homeValueMode === 'todos' ? getMonthTotals(month, year) : getConfirmedTotals(month, year);
}
function homeYearTotals(year) {
  return homeValueMode === 'todos' ? getYearTotals(year) : getConfirmedYearTotals(year);
}

let _areaYs  = null;
let _areaXs  = null;
let _areaRaf = null;

// Insights dispensados ficam guardados no localStorage (por conteúdo, não só
// por sessão) — o banner só reaparece se surgir um insight com conteúdo novo,
// nunca visto antes, mesmo depois de recarregar a página.
function insightSignature(ins) { return ins.key + '|' + ins.message; }
function getDismissedInsightSignatures() {
  try { return JSON.parse(localStorage.getItem('dismissedInsightSignatures') || '[]'); } catch (e) { return []; }
}
function hasUndismissedInsight() {
  if (!insights || !insights.length) return false;
  const dismissed = getDismissedInsightSignatures();
  return insights.some(ins => !dismissed.includes(insightSignature(ins)));
}

function dismissBanner(kind) {
  if (kind === 'insights') {
    const dismissed = getDismissedInsightSignatures();
    const merged = Array.from(new Set(dismissed.concat(insights.map(insightSignature))));
    localStorage.setItem('dismissedInsightSignatures', JSON.stringify(merged));
  } else {
    dismissedBanners[kind] = true;
  }
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
  positionNovoBtnDesktop();
}

// Na Home, o conteúdo costuma ser bem menor que a altura da tela
// (diferente da Listagem, rolável) — em vez de deixar o botão Novo fixo
// no rodapé do viewport (longe do card de saldo), gruda ele logo abaixo
// do card, tanto no mobile quanto no desktop. Usa `top` (relativo ao
// .app-content, offsetParent do wrap) em vez de `bottom`+altura da
// viewport — a conta antiga ignorava a altura do próprio wrap e acabava
// sobrepondo o card de saldo.
function positionNovoBtnDesktop() {
  const wrap = document.getElementById('btn-novo-wrap');
  if (!wrap) return;
  const saldoCard = document.getElementById('home-card-saldo');
  const homeActive = document.querySelector('.screen.active') && document.querySelector('.screen.active').id === 'screen-home';
  if (!homeActive || !saldoCard || getComputedStyle(saldoCard).display === 'none') {
    // Listagem, ou Home sem card de saldo visível (aba Anual): volta pro
    // fixo perto do rodapé do viewport, só que com um respiro (16px) em
    // vez de colado — `wrap.style.bottom=''` sozinho NÃO bastaria aqui,
    // porque remove de vez o `bottom:0` que só existia como style inline
    // no HTML (não uma classe/regra CSS).
    wrap.style.top = '';
    wrap.style.bottom = '16px';
    return;
  }
  const container = wrap.offsetParent;
  const containerTop = container ? container.getBoundingClientRect().top : 0;
  const cardBottom = saldoCard.getBoundingClientRect().bottom;
  // Respiro visível entre o fim do card de saldo e o topo do botão
  // (20px é o padding-top do wrap antes do botão em si começar).
  const gap = 40;
  wrap.style.bottom = 'auto';
  wrap.style.top = Math.round(cardBottom - containerTop + gap - 20) + 'px';
}
window.addEventListener('resize', positionNovoBtnDesktop);

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
    MONTHS.map((m,i) => `<button class="btn btn-sm rounded-pill flex-shrink-0 ${i===homeMonth?'btn-primary':'tab-inactive'}" style="border:none" onclick="selectMonth(${i})">${m}</button>`).join('');
  attachStripScroll(strip);
  setTimeout(function() {
    var active = strip.querySelector('.btn-primary');
    if (active) strip.scrollLeft = active.offsetLeft - (strip.offsetWidth / 2) + (active.offsetWidth / 2);
  }, 50);
}

function buildYearStrip() {
  // Sequência fixa: ano anterior, atual e o próximo — nada de listar
  // todo ano com lançamento (recorrências podem gerar ocorrências em
  // qualquer ano futuro, o que bagunçaria a tira).
  const curYear = new Date().getFullYear();
  const years = [curYear - 1, curYear, curYear + 1];
  if (!years.includes(homeYear)) homeYear = curYear;
  const strip = document.getElementById('year-strip');
  strip.innerHTML = years.map(y =>
    `<button class="btn btn-sm rounded-pill flex-shrink-0 ${y===homeYear?'btn-primary':'tab-inactive text-primary'}" style="border:none" onclick="selectYear(${y})">${y}</button>`
  ).join('');
  attachStripScroll(strip);
}

function selectYear(y) {
  homeYear = y;
  updateNovoBtn();
  // Sempre um render completo (não só updateYearView/animateAreaTo): os
  // dois gráficos ficam visíveis ao mesmo tempo, então trocar o ano
  // também precisa atualizar o card Mensal (mesmo mês, ano novo) — e o
  // "fast path" antigo só existe(ia) pra reaproveitar o SVG do gráfico
  // Anual, que agora está sempre presente (checagem nunca cai no else).
  renderHome();
}

function selectMonth(i) {
  homeMonth = i;
  document.querySelectorAll('#month-strip .btn').forEach((b,idx) => {
    b.classList.toggle('btn-primary', idx===i);
    b.classList.toggle('tab-inactive', idx!==i);
  });
  updateNovoBtn();
  const dc = homeMonthTotals(homeMonth, homeYear);
  const isEmpty = dc.receita + dc.despesa + dc.investimento === 0;
  // Só anima em cima do SVG existente se ele já estava lá E o mês novo
  // também tem dado — do contrário (virando vazio, ou saindo do vazio)
  // precisa de um render completo pra trocar o SVG pelo emptyChart() (ou
  // vice-versa), animateBarsTo() não dá conta dessa transição de estado.
  if (document.getElementById('chart-bars-svg') && !isEmpty) {
    renderBanners();
    animateBarsTo(dc);
    document.getElementById('home-legend-meses').innerHTML = buildLegendHtml(dc, 'meses');
    const saldo = dc.receita - dc.despesa - dc.investimento;
    const sv = document.getElementById('home-saldo-val');
    if (sv) sv.innerHTML = fmtBig(saldo);
    const sl = document.getElementById('home-periodo-meses');
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
  const chartData = Array.from({length:12}, (_, m) => homeMonthTotals(m, yr));
  const d = homeYearTotals(yr);
  renderBanners();
  animateAreaTo(chartData);
  document.getElementById('home-legend-anos').innerHTML = buildLegendHtml(d, 'anos');
  const pl = document.getElementById('home-periodo-anos');
  if (pl) pl.textContent = String(yr);
}

function emptyChart() {
  return `<div style="height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:${cssVar('--md-sys-color-outline')}">
    <span class="material-symbols-outlined" style="font-size:1.6rem;margin-bottom:6px">bar_chart</span>
    <span class="small">Nenhum lançamento neste período ainda</span>
  </div>`;
}

let _barRaf = null;

function buildBarChart(d) {
  if (d.receita + d.despesa + d.investimento === 0) return emptyChart();
  const W = 320, H = 100, R = 6, GAP = 8, MARGIN_X = 4;
  const chartW = W;
  const barsW = chartW - MARGIN_X * 2;
  const maxVal = niceCeil(Math.max(1, ...TIPOS.map(t => d[t])));
  const barW = (barsW - GAP * (TIPOS.length - 1)) / TIPOS.length;
  const bars = TIPOS.map((tipo, i) => {
    const x = MARGIN_X + i * (barW + GAP);
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

function buildSubLabels(d, periodType) {
  const sub = {receita:'', despesa:'', investimento:''};

  if (periodType === 'meses') {
    const prevMonth = homeMonth === 0 ? 11 : homeMonth - 1;
    const prevYear  = homeMonth === 0 ? homeYear - 1 : homeYear;
    const prev = homeMonthTotals(prevMonth, prevYear);
    const faint = cssVar('--md-sys-color-outline');
    if (prev.receita > 0) {
      const pct = ((d.receita - prev.receita) / prev.receita) * 100;
      const up = pct >= 0;
      sub.receita = `<div class="smaller" style="color:${up ? TIPO_META.receita.cor : TIPO_META.despesa.cor}">${up?'↑':'↓'} ${Math.abs(pct).toFixed(1)}% vs mês ant.</div>`;
    } else if (d.receita > 0) {
      sub.receita = `<div class="smaller" style="color:${faint}">sem comparação</div>`;
    }
    if (d.receita > 0) {
      sub.despesa      = `<div class="smaller" style="color:${faint}">${((d.despesa / d.receita)*100).toFixed(1)}% da receita</div>`;
      sub.investimento = `<div class="smaller" style="color:${faint}">${((d.investimento / d.receita)*100).toFixed(1)}% da receita</div>`;
    }
  } else if (periodType === 'anos') {
    const faint = cssVar('--md-sys-color-outline');
    const prev = homeYearTotals(homeYear - 1);
    const hasPrev = prev.receita + prev.despesa + prev.investimento > 0;
    TIPOS.forEach(tipo => {
      if (prev[tipo] > 0) {
        const pct = ((d[tipo] - prev[tipo]) / prev[tipo]) * 100;
        const up = pct >= 0;
        sub[tipo] = `<div class="smaller" style="color:${up ? TIPO_META.receita.cor : TIPO_META.despesa.cor}">${up?'↑':'↓'} ${Math.abs(pct).toFixed(1)}% vs ano ant.</div>`;
      } else if (hasPrev && d[tipo] > 0) {
        sub[tipo] = `<div class="smaller" style="color:${faint}">novo</div>`;
      } else if (!hasPrev && d[tipo] > 0) {
        sub[tipo] = `<div class="smaller" style="color:${faint}">sem comparação</div>`;
      }
    });
  }

  return sub;
}

function buildLegendHtml(d, periodType) {
  const sub = buildSubLabels(d, periodType);
  // Só a legenda do gráfico Mensal é clicável (abre a listagem filtrada
  // pelo mês); a do Anual é só leitura — título/valores/%/Detalhe não
  // reagem a clique.
  const clickable = periodType === 'meses';
  const detalheLbl = clickable
    ? `<div class="fw-semibold text-primary" style="font-size:.7rem;margin-top:8px">Detalhe</div>`
    : '';
  return TIPOS.map(tipo =>
    `<div class="text-center" style="flex:1${clickable ? ';cursor:pointer' : ''}" ${clickable ? `onclick="openListing('${tipo}', null, ${homeMonth})"` : ''}>
      <div class="small d-flex align-items-center justify-content-center gap-2"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:color-mix(in srgb, ${TIPO_META[tipo].cor} 25%, var(--md-sys-color-surface));border:1.5px solid ${TIPO_META[tipo].cor};flex-shrink:0"></span>${TIPO_META[tipo].label}</div>
      <div class="small">${fmt(d[tipo])}</div>
      ${sub[tipo] || '<div class="smaller">&nbsp;</div>'}
      ${detalheLbl}
    </div>`
  ).join('');
}

function getAlertCounts() {
  const today = new Date(); today.setHours(0,0,0,0);
  const in3 = new Date(today); in3.setDate(today.getDate()+3);
  const isPending = e => ['a_pagar','a_receber','a_investir'].includes(entryStatus(e));
  let minVencendoDays = null;
  const vencendoCount = entries.filter(e => {
    if (!isPending(e)) return false;
    const d2 = new Date(e.yyyy,e.mm-1,e.dd); d2.setHours(0,0,0,0);
    if (d2 < today || d2 > in3) return false;
    const days = Math.round((d2 - today) / 86400000);
    if (minVencendoDays === null || days < minVencendoDays) minVencendoDays = days;
    return true;
  }).length;
  const vencidoCount = entries.filter(e => {
    if (!isPending(e)) return false;
    const d2 = new Date(e.yyyy,e.mm-1,e.dd); d2.setHours(0,0,0,0);
    return d2 < today;
  }).length;
  return { vencendoCount, vencidoCount, minVencendoDays };
}

function vencendoLabel(minDays) {
  if (minDays === 0) return 'vencendo hoje';
  if (minDays === 1) return 'vencendo amanhã';
  return `vencendo em ${minDays} dias`;
}

function updateNotifBell() {
  const dot = document.getElementById('notif-bell-dot');
  if (!dot) return;
  const { vencendoCount, vencidoCount } = getAlertCounts();
  const hasAlert = vencendoCount > 0 || vencidoCount > 0 || hasUndismissedInsight();
  dot.style.display = hasAlert ? '' : 'none';
}

function renderBanners() {
  const { vencendoCount, vencidoCount, minVencendoDays } = getAlertCounts();
  updateNotifBell();

  let banners = '';
  if (hasUndismissedInsight())
    banners += `<div class="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded" id="banner-insights" style="background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);max-height:60px;cursor:pointer" onclick="navigate('insights')">
      <span class="small d-flex align-items-center gap-2"><span class="material-symbols-outlined" style="font-size:1.1rem;flex-shrink:0">tips_and_updates</span>Novos insights financeiros.</span>
      <button type="button" class="btn btn-link p-0" style="color:inherit;line-height:0" onclick="event.stopPropagation();dismissBanner('insights')"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
    </div>`;
  if (vencidoCount > 0 && !dismissedBanners.vencido)
    banners += `<div class="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded" id="banner-vencido" style="background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container)">
      <span class="small" onclick="goToVencendo('vencido')" style="cursor:pointer">${vencidoCount} lançamento${vencidoCount>1?'s':''} vencido${vencidoCount>1?'s':''}. <u>Resolver</u></span>
      <button type="button" class="btn btn-link p-0" style="color:inherit;line-height:0" onclick="dismissBanner('vencido')"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
    </div>`;
  if (vencendoCount > 0 && !dismissedBanners.vencendo)
    banners += `<div class="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded" id="banner-vencendo" style="background:var(--md-extended-color-aviso-color-container);color:var(--md-extended-color-aviso-on-color-container)">
      <span class="small" onclick="goToVencendo('vencendo')" style="cursor:pointer">${vencendoCount} lançamento${vencendoCount>1?'s':''} ${vencendoLabel(minVencendoDays)}. <u>Ver</u></span>
      <button type="button" class="btn btn-link p-0" style="color:inherit;line-height:0" onclick="dismissBanner('vencendo')"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
    </div>`;
  const bannersEl = document.getElementById('home-banners');
  bannersEl.innerHTML = banners;
  bannersEl.style.marginTop = banners ? '16px' : '0';
  bannersEl.style.marginBottom = banners ? '16px' : '0';
}

function renderHome() {
  renderBanners();

  // Ambos os gráficos são sempre calculados/renderizados: no mobile só um
  // fica visível por vez (controlado pela aba, via display inline abaixo);
  // no desktop css/responsive.css força os dois a aparecerem lado a lado.
  const showAnos = homeTab === 'anos';

  const yrA = homeYear;
  const dcA = homeYearTotals(yrA);
  const chartDataA = Array.from({length:12}, (_, m) => homeMonthTotals(m, yrA));
  const chartLabelsA = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const chartA = buildAreaChart(chartDataA, chartLabelsA);

  const dcM = homeMonthTotals(homeMonth, homeYear);
  const chartM = buildBarChart(dcM);
  const saldo = dcM.receita - dcM.despesa - dcM.investimento;
  const periodoLabelM = `${MONTHS_FULL[homeMonth]} ${homeYear}`;

  const cardAnual = `<div class="home-chart-block" id="home-block-anual" style="margin-bottom:12px${showAnos ? '' : ';display:none'}">
    <div class="no-scrollbar" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px;justify-content:center" id="year-strip"></div>
    <div class="card home-chart-card" id="home-card-anual" style="border-radius:var(--md-sys-shape-corner-small)!important">
      <div class="card-body py-3 px-3">
        <div class="small text-center mb-2" id="home-periodo-anos" style="font-weight:400">${String(yrA)}</div>
        <div class="mb-3">${chartA}</div>
        <div id="home-legend-anos" style="display:flex;justify-content:space-around">${buildLegendHtml(dcA, 'anos')}</div>
      </div>
    </div>
  </div>`;

  const cardMensal = `<div class="home-chart-block" id="home-block-mensal" style="margin-bottom:12px${showAnos ? ';display:none' : ''}">
    <div class="no-scrollbar" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:12px" id="month-strip"></div>
    <div class="card home-chart-card" id="home-card-mensal" style="border-radius:var(--md-sys-shape-corner-small)!important">
      <div class="card-body py-3 px-3">
        <div class="small text-center mb-2" id="home-periodo-meses" style="font-weight:400">${periodoLabelM}</div>
        <div class="mb-3">${chartM}</div>
        <div id="home-legend-meses" style="display:flex;justify-content:space-around">${buildLegendHtml(dcM, 'meses')}</div>
      </div>
    </div>
  </div>`;

  const cardSaldo = `<div class="card mb-2" id="home-card-saldo" style="border-radius:var(--md-sys-shape-corner-small)!important${showAnos ? ';display:none' : ''}">
    <div class="card-body d-flex justify-content-between align-items-center py-3 px-3">
      <div>
        <div style="font-size:1rem;color:var(--md-sys-color-on-surface-variant)"><span style="font-weight:300">Olá,</span> <span style="font-weight:600">${escapeHtml((currentUser && currentUser.name ? currentUser.name.split(' ')[0] : ''))}</span>,</div>
        <div style="font-size:.72rem;color:var(--md-sys-color-outline);margin-top:1px">Balanço total</div>
      </div>
      <div style="font-size:1.4rem;font-weight:600;letter-spacing:-.5px;color:#4caf7d" id="home-saldo-val">${fmtBig(saldo)}</div>
    </div>
  </div>`;

  document.getElementById('home-value-toggle-slot').innerHTML = homeValueModeToggleHtml();
  document.getElementById('home-summary').innerHTML = cardAnual + cardMensal + cardSaldo;
  buildYearStrip();
  buildMonthStrip();
  positionNovoBtnDesktop();
}

/* ─────────────── CENTRAL DE NOTIFICAÇÕES ─────────────── */
function notifCenterRow(icon, iconBg, iconColor, title, subtitle, onclick) {
  const cls = onclick ? 'list-group-item cat-row-card' : 'card cat-row-card';
  const attrs = onclick ? ` style="cursor:pointer" onclick="${onclick}"` : '';
  return `<div class="${cls}"${attrs}>
    <div class="d-flex gap-3 align-items-start">
      <div class="d-inline-flex align-items-center justify-content-center flex-shrink-0" style="width:40px;height:40px;border-radius:50%;background:${iconBg}">
        <span class="material-symbols-outlined" style="font-size:1.3rem;color:${iconColor}">${icon}</span>
      </div>
      <div>
        <div class="fw-semibold mb-1">${escapeHtml(title)}</div>
        <div class="text-secondary small">${escapeHtml(subtitle)}</div>
      </div>
    </div>
  </div>`;
}

let _notifTab = 'vencimentos';
function switchNotifTab(tab) {
  _notifTab = tab;
  ['vencimentos','insights'].forEach(t => setTabActive(document.getElementById('notif-tab-'+t), t===tab));
  renderNotifCenter();
}

function openNotifCenter() {
  _notifTab = 'vencimentos';
  ['vencimentos','insights'].forEach(t => setTabActive(document.getElementById('notif-tab-'+t), t==='vencimentos'));
  renderNotifCenter();
}

const NOTIF_TAB_EMPTY = {
  vencimentos: 'Nenhum lançamento vencido ou a vencer. Tudo em dia!',
  insights: 'Nenhum insight no momento.',
};

function renderNotifCenter() {
  const el = document.getElementById('notif-center-body');
  if (!el) return;
  const { vencendoCount, vencidoCount, minVencendoDays } = getAlertCounts();
  const rows = [];

  if (_notifTab === 'vencimentos') {
    if (vencidoCount > 0)
      rows.push(notifCenterRow('error', 'var(--md-sys-color-error-container)', 'var(--md-sys-color-on-error-container)',
        `${vencidoCount} lançamento${vencidoCount>1?'s':''} vencido${vencidoCount>1?'s':''}`,
        'Toque pra ver e resolver.', "goToVencendo('vencido')"));

    if (vencendoCount > 0)
      rows.push(notifCenterRow('event_upcoming', 'var(--md-extended-color-aviso-color-container)', 'var(--md-extended-color-aviso-on-color-container)',
        `${vencendoCount} lançamento${vencendoCount>1?'s':''} ${vencendoLabel(minVencendoDays)}`,
        'Toque pra ver os detalhes.', "goToVencendo('vencendo')"));
  }

  if (_notifTab === 'insights')
    (insights || []).forEach(function(ins) {
      rows.push(notifCenterRow('tips_and_updates', 'var(--md-sys-color-primary-container)', 'var(--md-sys-color-on-primary-container)',
        ins.title, ins.message + (ins.date ? ' · ' + ins.date : ''), null));
    });

  el.innerHTML = rows.length
    ? '<div class="d-flex flex-column" style="gap:12px">' + rows.join('') + '</div>'
    : `<div class="text-muted small text-center py-5 fst-italic">${NOTIF_TAB_EMPTY[_notifTab]}</div>`;
}

/* ─────────────── TELA DE INSIGHTS ─────────────── */
function renderInsightsScreen() {
  const el = document.getElementById('insights-body');
  if (!el) return;
  if (!insights || !insights.length) {
    el.innerHTML = '<div class="text-muted small text-center py-5 fst-italic">Nenhum insight no momento. Continue registrando seus lançamentos.</div>';
    return;
  }
  el.innerHTML = '<div class="d-flex flex-column" style="gap:12px">' + insights.map(function(ins) {
    return `<div class="card cat-row-card">
      <div class="d-flex gap-3 align-items-start">
        <div class="d-inline-flex align-items-center justify-content-center flex-shrink-0" style="width:40px;height:40px;border-radius:50%;background:var(--md-sys-color-primary-container)">
          <span class="material-symbols-outlined" style="font-size:1.3rem;color:var(--md-sys-color-on-primary-container)">tips_and_updates</span>
        </div>
        <div>
          <div class="fw-semibold mb-1">${escapeHtml(ins.title)}</div>
          <div class="text-secondary small">${escapeHtml(ins.message)}</div>
          ${ins.date ? `<div class="text-secondary small mt-1" style="opacity:.7">${escapeHtml(ins.date)}</div>` : ''}
        </div>
      </div>
    </div>`;
  }).join('') + '</div>';
}
