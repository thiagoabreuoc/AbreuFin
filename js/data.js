/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const MONTHS      = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const fmt = v => 'R$ ' + v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
// Valor com os centavos menores/sobrescritos (ex.: "R$ 23.452," seguido de "34" menor), como em referências de apps bancários
const fmtBig = v => {
  const [intPart, centsPart] = v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).split(',');
  return `R$ ${intPart}<span style="font-size:.6em;vertical-align:text-top">,${centsPart}</span>`;
};
const escapeHtml = str => String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/* Loading M3 — spinner circular em botões durante ações assíncronas.
   setBtnLoading(btn, true) guarda o conteúdo original e mostra o spinner;
   setBtnLoading(btn, false) restaura. Idempotente (chamadas repetidas não
   perdem o conteúdo original). */
function setBtnLoading(btn, loading, label) {
  if (!btn) return;
  if (loading) {
    // usa textContent (não innerHTML) pra não capturar um <span class="md-ripple">
    // que o ripple.js possa ter acabado de inserir no mesmo clique
    if (btn.dataset.origText === undefined) btn.dataset.origText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="m3-spinner"></span>' + (label ? ' ' + escapeHtml(label) : '');
  } else {
    btn.disabled = false;
    if (btn.dataset.origText !== undefined) {
      btn.textContent = btn.dataset.origText;
      delete btn.dataset.origText;
    }
  }
}

/* Linear progress M3 — barra no topo do app, usada em carregamentos de tela
   inteira (ex.: bootstrap inicial após login). */
function setAppLoading(active) {
  const el = document.getElementById('app-loading-bar');
  if (el) el.classList.toggle('active', !!active);
}

/* Populados via API após login/registro (ver js/main.js e js/auth.js) */
let catGroups  = { receita: [], despesa: [], investimento: [] };
let categories = { receita: [], despesa: [], investimento: [] };
let entries = [];
let currentUser = null;
let insights = [];
