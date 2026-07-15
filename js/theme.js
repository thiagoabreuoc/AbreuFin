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
  renderThemeCarousel();
}

/* ── Paletas M3 (cor semente diferente cada uma) ── */
const MATERIAL_THEMES = {
  azul: {
    label: 'Azul', funName: 'Sr. Azulejo', swatch: '#415F91',
    light: {
      '--md-sys-color-primary':'#415F91','--md-sys-color-on-primary':'#FFFFFF',
      '--md-sys-color-primary-container':'#D6E3FF','--md-sys-color-on-primary-container':'#284777',
      '--md-sys-color-inverse-primary':'#AAC7FF',
      '--md-sys-color-secondary':'#565F71','--md-sys-color-on-secondary':'#FFFFFF',
      '--md-sys-color-secondary-container':'#DAE2F9','--md-sys-color-on-secondary-container':'#3E4759',
      '--md-sys-color-tertiary':'#705575','--md-sys-color-on-tertiary':'#FFFFFF',
      '--md-sys-color-tertiary-container':'#FAD8FD','--md-sys-color-on-tertiary-container':'#573E5C',
      '--md-sys-color-error':'#BA1A1A','--md-sys-color-on-error':'#FFFFFF',
      '--md-sys-color-error-container':'#FFDAD6','--md-sys-color-on-error-container':'#93000A',
      '--md-sys-color-background':'#F9F9FF','--md-sys-color-on-background':'#191C20',
      '--md-sys-color-surface':'#F9F9FF','--md-sys-color-on-surface':'#191C20',
      '--md-sys-color-surface-variant':'#E0E2EC','--md-sys-color-on-surface-variant':'#44474E',
      '--md-sys-color-surface-dim':'#D9D9E0','--md-sys-color-surface-bright':'#F9F9FF',
      '--md-sys-color-surface-container-lowest':'#FFFFFF','--md-sys-color-surface-container-low':'#F3F3FA',
      '--md-sys-color-surface-container':'#EDEDF4','--md-sys-color-surface-container-high':'#E7E8EE',
      '--md-sys-color-surface-container-highest':'#E2E2E9',
      '--md-sys-color-outline':'#74777F','--md-sys-color-outline-variant':'#C4C6D0',
      '--md-sys-color-inverse-surface':'#2E3036','--md-sys-color-inverse-on-surface':'#F0F0F7',
      '--md-sys-color-surface-tint':'#415F91',
      '--md-extended-color-receita-color':'#006a66','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#6bf8f0','--md-extended-color-receita-on-color-container':'#00201e',
      '--md-extended-color-investimento-color':'#0061a4','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#d1e4ff','--md-extended-color-investimento-on-color-container':'#001d36',
      '--md-extended-color-aviso-color':'#944a00','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdcc5','--md-extended-color-aviso-on-color-container':'#301400',
    },
    dark: {
      '--md-sys-color-primary':'#AAC7FF','--md-sys-color-on-primary':'#0A305F',
      '--md-sys-color-primary-container':'#284777','--md-sys-color-on-primary-container':'#D6E3FF',
      '--md-sys-color-inverse-primary':'#415F91',
      '--md-sys-color-secondary':'#BEC6DC','--md-sys-color-on-secondary':'#283141',
      '--md-sys-color-secondary-container':'#3E4759','--md-sys-color-on-secondary-container':'#DAE2F9',
      '--md-sys-color-tertiary':'#DDBCE0','--md-sys-color-on-tertiary':'#3F2844',
      '--md-sys-color-tertiary-container':'#573E5C','--md-sys-color-on-tertiary-container':'#FAD8FD',
      '--md-sys-color-error':'#FFB4AB','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000A','--md-sys-color-on-error-container':'#FFDAD6',
      '--md-sys-color-background':'#111318','--md-sys-color-on-background':'#E2E2E9',
      '--md-sys-color-surface':'#111318','--md-sys-color-on-surface':'#E2E2E9',
      '--md-sys-color-surface-variant':'#44474E','--md-sys-color-on-surface-variant':'#C4C6D0',
      '--md-sys-color-surface-dim':'#111318','--md-sys-color-surface-bright':'#37393E',
      '--md-sys-color-surface-container-lowest':'#0C0E13','--md-sys-color-surface-container-low':'#191C20',
      '--md-sys-color-surface-container':'#1D2024','--md-sys-color-surface-container-high':'#282A2F',
      '--md-sys-color-surface-container-highest':'#33353A',
      '--md-sys-color-outline':'#8E9099','--md-sys-color-outline-variant':'#44474E',
      '--md-sys-color-inverse-surface':'#E2E2E9','--md-sys-color-inverse-on-surface':'#2E3036',
      '--md-sys-color-surface-tint':'#AAC7FF',
      '--md-extended-color-receita-color':'#48dbd3','--md-extended-color-receita-on-color':'#003735',
      '--md-extended-color-receita-color-container':'#00504d','--md-extended-color-receita-on-color-container':'#6bf8f0',
      '--md-extended-color-investimento-color':'#9fcaff','--md-extended-color-investimento-on-color':'#003259',
      '--md-extended-color-investimento-color-container':'#00497d','--md-extended-color-investimento-on-color-container':'#d1e4ff',
      '--md-extended-color-aviso-color':'#ffb783','--md-extended-color-aviso-on-color':'#4f2500',
      '--md-extended-color-aviso-color-container':'#713700','--md-extended-color-aviso-on-color-container':'#ffdcc5',
    },
  },
  roxo: {
    label: 'Roxo', funName: 'Uva Passa', swatch: '#65558f',
    light: {
      '--md-sys-color-primary':'#65558f','--md-sys-color-on-primary':'#ffffff',
      '--md-sys-color-primary-container':'#e9ddff','--md-sys-color-on-primary-container':'#4d3d75',
      '--md-sys-color-inverse-primary':'#cfbdfe',
      '--md-sys-color-secondary':'#625b71','--md-sys-color-on-secondary':'#ffffff',
      '--md-sys-color-secondary-container':'#e8def8','--md-sys-color-on-secondary-container':'#4a4458',
      '--md-sys-color-tertiary':'#7e5260','--md-sys-color-on-tertiary':'#ffffff',
      '--md-sys-color-tertiary-container':'#ffd9e3','--md-sys-color-on-tertiary-container':'#633b48',
      '--md-sys-color-error':'#ba1a1a','--md-sys-color-on-error':'#ffffff',
      '--md-sys-color-error-container':'#ffdad6','--md-sys-color-on-error-container':'#93000a',
      '--md-sys-color-background':'#fdf7ff','--md-sys-color-on-background':'#1d1b20',
      '--md-sys-color-surface':'#fdf7ff','--md-sys-color-on-surface':'#1d1b20',
      '--md-sys-color-surface-variant':'#e7e0eb','--md-sys-color-on-surface-variant':'#49454e',
      '--md-sys-color-surface-dim':'#ded8e0','--md-sys-color-surface-bright':'#fdf7ff',
      '--md-sys-color-surface-container-lowest':'#ffffff','--md-sys-color-surface-container-low':'#f8f2fa',
      '--md-sys-color-surface-container':'#f2ecf4','--md-sys-color-surface-container-high':'#ece6ee',
      '--md-sys-color-surface-container-highest':'#e6e0e9',
      '--md-sys-color-outline':'#7a757f','--md-sys-color-outline-variant':'#cac4cf',
      '--md-sys-color-inverse-surface':'#322f35','--md-sys-color-inverse-on-surface':'#f5eff7',
      '--md-sys-color-surface-tint':'#65558f',
      '--md-extended-color-receita-color':'#006a66','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#6bf8f0','--md-extended-color-receita-on-color-container':'#00201e',
      '--md-extended-color-investimento-color':'#185eac','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#d5e3ff','--md-extended-color-investimento-on-color-container':'#001b3c',
      '--md-extended-color-aviso-color':'#944a00','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdcc5','--md-extended-color-aviso-on-color-container':'#301400',
    },
    dark: {
      '--md-sys-color-primary':'#cfbdfe','--md-sys-color-on-primary':'#36275d',
      '--md-sys-color-primary-container':'#4d3d75','--md-sys-color-on-primary-container':'#e9ddff',
      '--md-sys-color-inverse-primary':'#65558f',
      '--md-sys-color-secondary':'#cbc2db','--md-sys-color-on-secondary':'#332d41',
      '--md-sys-color-secondary-container':'#4a4458','--md-sys-color-on-secondary-container':'#e8def8',
      '--md-sys-color-tertiary':'#efb8c8','--md-sys-color-on-tertiary':'#4a2532',
      '--md-sys-color-tertiary-container':'#633b48','--md-sys-color-on-tertiary-container':'#ffd9e3',
      '--md-sys-color-error':'#ffb4ab','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000a','--md-sys-color-on-error-container':'#ffdad6',
      '--md-sys-color-background':'#141218','--md-sys-color-on-background':'#e6e0e9',
      '--md-sys-color-surface':'#141218','--md-sys-color-on-surface':'#e6e0e9',
      '--md-sys-color-surface-variant':'#49454e','--md-sys-color-on-surface-variant':'#cac4cf',
      '--md-sys-color-surface-dim':'#141218','--md-sys-color-surface-bright':'#3b383e',
      '--md-sys-color-surface-container-lowest':'#0f0d13','--md-sys-color-surface-container-low':'#1d1b20',
      '--md-sys-color-surface-container':'#211f24','--md-sys-color-surface-container-high':'#2b292f',
      '--md-sys-color-surface-container-highest':'#36343a',
      '--md-sys-color-outline':'#948f99','--md-sys-color-outline-variant':'#49454e',
      '--md-sys-color-inverse-surface':'#e6e0e9','--md-sys-color-inverse-on-surface':'#322f35',
      '--md-sys-color-surface-tint':'#cfbdfe',
      '--md-extended-color-receita-color':'#48dbd3','--md-extended-color-receita-on-color':'#003735',
      '--md-extended-color-receita-color-container':'#00504d','--md-extended-color-receita-on-color-container':'#6bf8f0',
      '--md-extended-color-investimento-color':'#a7c8ff','--md-extended-color-investimento-on-color':'#003061',
      '--md-extended-color-investimento-color-container':'#004788','--md-extended-color-investimento-on-color-container':'#d5e3ff',
      '--md-extended-color-aviso-color':'#ffb783','--md-extended-color-aviso-on-color':'#4f2500',
      '--md-extended-color-aviso-color-container':'#713700','--md-extended-color-aviso-on-color-container':'#ffdcc5',
    },
  },
  oliva: {
    label: 'Oliva', funName: 'Zé Oliveira', swatch: '#566238',
    light: {
      '--md-sys-color-primary':'#566238','--md-sys-color-on-primary':'#ffffff',
      '--md-sys-color-primary-container':'#6e7b4f','--md-sys-color-on-primary-container':'#ffffff',
      '--md-sys-color-inverse-primary':'#becc9a',
      '--md-sys-color-secondary':'#5b614d','--md-sys-color-on-secondary':'#ffffff',
      '--md-sys-color-secondary-container':'#dde2c9','--md-sys-color-on-secondary-container':'#606551',
      '--md-sys-color-tertiary':'#3c6653','--md-sys-color-on-tertiary':'#ffffff',
      '--md-sys-color-tertiary-container':'#557f6b','--md-sys-color-on-tertiary-container':'#ffffff',
      '--md-sys-color-error':'#ba1a1a','--md-sys-color-on-error':'#ffffff',
      '--md-sys-color-error-container':'#ffdad6','--md-sys-color-on-error-container':'#93000a',
      '--md-sys-color-background':'#fbf9f3','--md-sys-color-on-background':'#1b1c18',
      '--md-sys-color-surface':'#fbf9f3','--md-sys-color-on-surface':'#1b1c18',
      '--md-sys-color-surface-variant':'#e3e3d5','--md-sys-color-on-surface-variant':'#46483e',
      '--md-sys-color-surface-dim':'#dcdad4','--md-sys-color-surface-bright':'#fbf9f3',
      '--md-sys-color-surface-container-lowest':'#ffffff','--md-sys-color-surface-container-low':'#f6f3ed',
      '--md-sys-color-surface-container':'#f0eee8','--md-sys-color-surface-container-high':'#eae8e2',
      '--md-sys-color-surface-container-highest':'#e4e2dc',
      '--md-sys-color-outline':'#76786c','--md-sys-color-outline-variant':'#c6c8ba',
      '--md-sys-color-inverse-surface':'#30312d','--md-sys-color-inverse-on-surface':'#f3f1ea',
      '--md-sys-color-surface-tint':'#576339',
      '--md-extended-color-receita-color':'#006c44','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#88f9bb','--md-extended-color-receita-on-color-container':'#002112',
      '--md-extended-color-investimento-color':'#006686','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#c0e8ff','--md-extended-color-investimento-on-color-container':'#001e2b',
      '--md-extended-color-aviso-color':'#7a5900','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdea1','--md-extended-color-aviso-on-color-container':'#261900',
    },
    dark: {
      '--md-sys-color-primary':'#becc9a','--md-sys-color-on-primary':'#293410',
      '--md-sys-color-primary-container':'#6e7b4f','--md-sys-color-on-primary-container':'#ffffff',
      '--md-sys-color-inverse-primary':'#576339',
      '--md-sys-color-secondary':'#c4c9b1','--md-sys-color-on-secondary':'#2d3221',
      '--md-sys-color-secondary-container':'#444936','--md-sys-color-on-secondary-container':'#b3b8a0',
      '--md-sys-color-tertiary':'#a4d0b9','--md-sys-color-on-tertiary':'#0b3727',
      '--md-sys-color-tertiary-container':'#557f6b','--md-sys-color-on-tertiary-container':'#ffffff',
      '--md-sys-color-error':'#ffb4ab','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000a','--md-sys-color-on-error-container':'#ffdad6',
      '--md-sys-color-background':'#131410','--md-sys-color-on-background':'#e4e2dc',
      '--md-sys-color-surface':'#131410','--md-sys-color-on-surface':'#e4e2dc',
      '--md-sys-color-surface-variant':'#46483e','--md-sys-color-on-surface-variant':'#c6c8ba',
      '--md-sys-color-surface-dim':'#131410','--md-sys-color-surface-bright':'#393935',
      '--md-sys-color-surface-container-lowest':'#0e0e0b','--md-sys-color-surface-container-low':'#1b1c18',
      '--md-sys-color-surface-container':'#1f201c','--md-sys-color-surface-container-high':'#2a2a26',
      '--md-sys-color-surface-container-highest':'#353531',
      '--md-sys-color-outline':'#909285','--md-sys-color-outline-variant':'#46483e',
      '--md-sys-color-inverse-surface':'#e4e2dc','--md-sys-color-inverse-on-surface':'#30312d',
      '--md-sys-color-surface-tint':'#becc9a',
      '--md-extended-color-receita-color':'#6bdca1','--md-extended-color-receita-on-color':'#003821',
      '--md-extended-color-receita-color-container':'#005232','--md-extended-color-receita-on-color-container':'#88f9bb',
      '--md-extended-color-investimento-color':'#6fd2ff','--md-extended-color-investimento-on-color':'#003547',
      '--md-extended-color-investimento-color-container':'#004d66','--md-extended-color-investimento-on-color-container':'#c0e8ff',
      '--md-extended-color-aviso-color':'#f9bd28','--md-extended-color-aviso-on-color':'#402d00',
      '--md-extended-color-aviso-color-container':'#5c4300','--md-extended-color-aviso-on-color-container':'#ffdea1',
    },
  },
  marinho: {
    label: 'Marinho', funName: 'Capitão Marinho', swatch: '#162839',
    light: {
      '--md-sys-color-primary':'#162839','--md-sys-color-on-primary':'#ffffff',
      '--md-sys-color-primary-container':'#2c3e50','--md-sys-color-on-primary-container':'#96a9be',
      '--md-sys-color-inverse-primary':'#b5c8df',
      '--md-sys-color-secondary':'#585f67','--md-sys-color-on-secondary':'#ffffff',
      '--md-sys-color-secondary-container':'#dae0ea','--md-sys-color-on-secondary-container':'#5c636c',
      '--md-sys-color-tertiary':'#322134','--md-sys-color-on-tertiary':'#ffffff',
      '--md-sys-color-tertiary-container':'#49364b','--md-sys-color-on-tertiary-container':'#b89fb9',
      '--md-sys-color-error':'#ba1a1a','--md-sys-color-on-error':'#ffffff',
      '--md-sys-color-error-container':'#ffdad6','--md-sys-color-on-error-container':'#93000a',
      '--md-sys-color-background':'#fbf9fa','--md-sys-color-on-background':'#1b1c1d',
      '--md-sys-color-surface':'#fbf9fa','--md-sys-color-on-surface':'#1b1c1d',
      '--md-sys-color-surface-variant':'#e0e2e9','--md-sys-color-on-surface-variant':'#43474c',
      '--md-sys-color-surface-dim':'#dbd9db','--md-sys-color-surface-bright':'#fbf9fa',
      '--md-sys-color-surface-container-lowest':'#ffffff','--md-sys-color-surface-container-low':'#f5f3f4',
      '--md-sys-color-surface-container':'#efedef','--md-sys-color-surface-container-high':'#e9e8e9',
      '--md-sys-color-surface-container-highest':'#e4e2e3',
      '--md-sys-color-outline':'#74777d','--md-sys-color-outline-variant':'#c4c6cd',
      '--md-sys-color-inverse-surface':'#303032','--md-sys-color-inverse-on-surface':'#f2f0f2',
      '--md-sys-color-surface-tint':'#4e6073',
      '--md-extended-color-receita-color':'#006a66','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#6bf8f0','--md-extended-color-receita-on-color-container':'#00201e',
      '--md-extended-color-investimento-color':'#00639a','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#cee5ff','--md-extended-color-investimento-on-color-container':'#001d32',
      '--md-extended-color-aviso-color':'#7a5900','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdea1','--md-extended-color-aviso-on-color-container':'#261900',
    },
    dark: {
      '--md-sys-color-primary':'#b5c8df','--md-sys-color-on-primary':'#203243',
      '--md-sys-color-primary-container':'#2c3e50','--md-sys-color-on-primary-container':'#96a9be',
      '--md-sys-color-inverse-primary':'#4e6073',
      '--md-sys-color-secondary':'#c1c7d1','--md-sys-color-on-secondary':'#2a3139',
      '--md-sys-color-secondary-container':'#434a52','--md-sys-color-on-secondary-container':'#b2b9c3',
      '--md-sys-color-tertiary':'#d9bed9','--md-sys-color-on-tertiary':'#3c2a3f',
      '--md-sys-color-tertiary-container':'#49364b','--md-sys-color-on-tertiary-container':'#b89fb9',
      '--md-sys-color-error':'#ffb4ab','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000a','--md-sys-color-on-error-container':'#ffdad6',
      '--md-sys-color-background':'#131315','--md-sys-color-on-background':'#e4e2e3',
      '--md-sys-color-surface':'#131315','--md-sys-color-on-surface':'#e4e2e3',
      '--md-sys-color-surface-variant':'#43474c','--md-sys-color-on-surface-variant':'#c4c6cd',
      '--md-sys-color-surface-dim':'#131315','--md-sys-color-surface-bright':'#39393b',
      '--md-sys-color-surface-container-lowest':'#0d0e10','--md-sys-color-surface-container-low':'#1b1c1d',
      '--md-sys-color-surface-container':'#1f2021','--md-sys-color-surface-container-high':'#292a2b',
      '--md-sys-color-surface-container-highest':'#343536',
      '--md-sys-color-outline':'#8e9197','--md-sys-color-outline-variant':'#43474c',
      '--md-sys-color-inverse-surface':'#e4e2e3','--md-sys-color-inverse-on-surface':'#303032',
      '--md-sys-color-surface-tint':'#b5c8df',
      '--md-extended-color-receita-color':'#48dbd3','--md-extended-color-receita-on-color':'#003735',
      '--md-extended-color-receita-color-container':'#00504d','--md-extended-color-receita-on-color-container':'#6bf8f0',
      '--md-extended-color-investimento-color':'#95ccff','--md-extended-color-investimento-on-color':'#003353',
      '--md-extended-color-investimento-color-container':'#004a75','--md-extended-color-investimento-on-color-container':'#cee5ff',
      '--md-extended-color-aviso-color':'#f9bd28','--md-extended-color-aviso-on-color':'#402d00',
      '--md-extended-color-aviso-color-container':'#5c4300','--md-extended-color-aviso-on-color-container':'#ffdea1',
    },
  },
};

function getMaterialTheme() {
  return localStorage.getItem('md-theme') || 'azul';
}

function applyMaterialTheme(name) {
  const theme = MATERIAL_THEMES[name];
  if (!theme) return;
  const tokens = theme[getTheme()];
  const root = document.documentElement.style;
  Object.entries(tokens).forEach(([k, v]) => root.setProperty(k, v));
  localStorage.setItem('md-theme', name);
  renderThemeCarousel();
  if (typeof renderHome === 'function' && document.getElementById('screen-home') &&
      document.getElementById('screen-home').classList.contains('active')) {
    renderHome();
  }
}

function renderThemeCarousel() {
  const el = document.getElementById('theme-carousel');
  if (!el) return;
  const current = getMaterialTheme();
  el.innerHTML = Object.entries(MATERIAL_THEMES).map(([key, t]) => {
    const active = key === current;
    return `<div class="theme-carousel-item" onclick="applyMaterialTheme('${key}')">
      <div class="theme-carousel-swatch${active ? ' active' : ''}" style="background:${t.swatch}">${active ? '<span class="material-symbols-outlined">check</span>' : ''}</div>
      <div class="theme-carousel-name${active ? ' active' : ''}">${t.funName}</div>
    </div>`;
  }).join('');
}

function initMaterialTheme() {
  applyMaterialTheme(getMaterialTheme());
}

initMaterialTheme();
