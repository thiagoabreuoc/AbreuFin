/* ═══════════════════════════════════════
   THEME (Material 3 — claro/escuro + paleta)
═══════════════════════════════════════ */
function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', theme);
  applyMaterialTheme(getMaterialTheme());
  if (typeof renderHome === 'function' && document.getElementById('screen-home') &&
      document.getElementById('screen-home').classList.contains('active')) {
    renderHome();
  }
}

function toggleTheme(checked) {
  applyTheme(checked ? 'dark' : 'light');
  updateThemeModeButtons();
}

function updateThemeModeButtons() {
  const isDark = getTheme() === 'dark';
  const lightBtn = document.getElementById('theme-mode-light');
  const darkBtn  = document.getElementById('theme-mode-dark');
  if (lightBtn) lightBtn.style.boxShadow = isDark ? 'none' : 'inset 0 0 0 2px currentColor';
  if (darkBtn)  darkBtn.style.boxShadow  = isDark ? 'inset 0 0 0 2px currentColor' : 'none';
}

function initThemeToggle() {
  updateThemeModeButtons();
}

/* ── Paleta M3 (cor semente = verde da marca AbreuFin) ── */
const MATERIAL_THEMES = {
  verde: {
    label: 'Verde', funName: 'Verde AbreuFin', swatch: '#0f9b7e',
    light: {
      '--md-sys-color-primary':'#0f9b7e','--md-sys-color-on-primary':'#ffffff',
      '--md-sys-color-primary-container':'#d3eee8','--md-sys-color-on-primary-container':'#174f43',
      '--md-sys-color-inverse-primary':'#aee0d6',
      '--md-sys-color-secondary':'#517061','--md-sys-color-on-secondary':'#ffffff',
      '--md-sys-color-secondary-container':'#e0ebe6','--md-sys-color-on-secondary-container':'#364940',
      '--md-sys-color-tertiary':'#983e51','--md-sys-color-on-tertiary':'#ffffff',
      '--md-sys-color-tertiary-container':'#f1d0d7','--md-sys-color-on-tertiary-container':'#511f29',
      '--md-sys-color-error':'#ba1a1a','--md-sys-color-on-error':'#ffffff',
      '--md-sys-color-error-container':'#ffdad6','--md-sys-color-on-error-container':'#93000a',
      '--md-sys-color-background':'#f9fafa','--md-sys-color-on-background':'#2a2e2c',
      '--md-sys-color-surface':'#f9fafa','--md-sys-color-on-surface':'#2a2e2c',
      '--md-sys-color-surface-variant':'#e3e8e6','--md-sys-color-on-surface-variant':'#424d47',
      '--md-sys-color-surface-dim':'#d6dcd9','--md-sys-color-surface-bright':'#f9fafa',
      '--md-sys-color-surface-container-lowest':'#ffffff','--md-sys-color-surface-container-low':'#f4f6f5',
      '--md-sys-color-surface-container':'#eef1f0','--md-sys-color-surface-container-high':'#e9eceb',
      '--md-sys-color-surface-container-highest':'#e3e8e6',
      '--md-sys-color-outline':'#6c7f75','--md-sys-color-outline-variant':'#c2cbc7',
      '--md-sys-color-inverse-surface':'#2a322e','--md-sys-color-inverse-on-surface':'#f1f3f2',
      '--md-sys-color-surface-tint':'#0f9b7e',
      '--md-extended-color-receita-color':'#006a66','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#6bf8f0','--md-extended-color-receita-on-color-container':'#00201e',
      '--md-extended-color-investimento-color':'#0061a4','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#d1e4ff','--md-extended-color-investimento-on-color-container':'#001d36',
      '--md-extended-color-aviso-color':'#944a00','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdcc5','--md-extended-color-aviso-on-color-container':'#301400',
    },
    dark: {
      '--md-sys-color-primary':'#aee0d6','--md-sys-color-on-primary':'#1c4a40',
      '--md-sys-color-primary-container':'#2e6056','--md-sys-color-on-primary-container':'#d3eee8',
      '--md-sys-color-inverse-primary':'#0f9b7e',
      '--md-sys-color-secondary':'#c6d2cc','--md-sys-color-on-secondary':'#2d3933',
      '--md-sys-color-secondary-container':'#3b4f45','--md-sys-color-on-secondary-container':'#e0ebe6',
      '--md-sys-color-tertiary':'#e6bcc5','--md-sys-color-on-tertiary':'#471f27',
      '--md-sys-color-tertiary-container':'#6b2e3b','--md-sys-color-on-tertiary-container':'#f4d7dd',
      '--md-sys-color-error':'#ffb4ab','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000a','--md-sys-color-on-error-container':'#ffdad6',
      '--md-sys-color-background':'#101312','--md-sys-color-on-background':'#e3e8e6',
      '--md-sys-color-surface':'#101312','--md-sys-color-on-surface':'#e3e8e6',
      '--md-sys-color-surface-variant':'#424d47','--md-sys-color-on-surface-variant':'#c2cbc7',
      '--md-sys-color-surface-dim':'#101312','--md-sys-color-surface-bright':'#343d38',
      '--md-sys-color-surface-container-lowest':'#0c0e0d','--md-sys-color-surface-container-low':'#171c1a',
      '--md-sys-color-surface-container':'#1c211f','--md-sys-color-surface-container-high':'#262c29',
      '--md-sys-color-surface-container-highest':'#2f3733',
      '--md-sys-color-outline':'#899a91','--md-sys-color-outline-variant':'#424d47',
      '--md-sys-color-inverse-surface':'#e3e8e6','--md-sys-color-inverse-on-surface':'#2a322e',
      '--md-sys-color-surface-tint':'#aee0d6',
      '--md-extended-color-receita-color':'#48dbd3','--md-extended-color-receita-on-color':'#003735',
      '--md-extended-color-receita-color-container':'#00504d','--md-extended-color-receita-on-color-container':'#6bf8f0',
      '--md-extended-color-investimento-color':'#9fcaff','--md-extended-color-investimento-on-color':'#003259',
      '--md-extended-color-investimento-color-container':'#00497d','--md-extended-color-investimento-on-color-container':'#d1e4ff',
      '--md-extended-color-aviso-color':'#ffb783','--md-extended-color-aviso-on-color':'#4f2500',
      '--md-extended-color-aviso-color-container':'#713700','--md-extended-color-aviso-on-color-container':'#ffdcc5',
    },
  },
};

function getMaterialTheme() {
  return 'verde';
}

function applyMaterialTheme(name) {
  const theme = MATERIAL_THEMES[name];
  if (!theme) return;
  const tokens = theme[getTheme()];
  const root = document.documentElement.style;
  Object.entries(tokens).forEach(([k, v]) => root.setProperty(k, v));
  if (typeof renderHome === 'function' && document.getElementById('screen-home') &&
      document.getElementById('screen-home').classList.contains('active')) {
    renderHome();
  }
}

function initMaterialTheme() {
  applyMaterialTheme(getMaterialTheme());
}

initMaterialTheme();
