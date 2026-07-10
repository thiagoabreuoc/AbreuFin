/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const MONTHS      = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const fmt = v => 'R$ ' + v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const escapeHtml = str => String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/* Populados via API após login/registro (ver js/main.js e js/auth.js) */
let catGroups  = { receita: [], despesa: [], investimento: [] };
let categories = { receita: [], despesa: [], investimento: [] };
let entries = [];
let currentUser = null;
let insights = [];
