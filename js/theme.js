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
      '--md-sys-color-background':'#F9F9FF','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#F9F9FF','--md-sys-color-on-surface':'#1a73e8',
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
      '--md-sys-color-surface-container-lowest':'#0C0E13','--md-sys-color-surface-container-low':'#292c30',
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
      '--md-sys-color-background':'#fdf7ff','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#fdf7ff','--md-sys-color-on-surface':'#1a73e8',
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
      '--md-sys-color-surface-container-lowest':'#0f0d13','--md-sys-color-surface-container-low':'#2d2b30',
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
      '--md-sys-color-background':'#fbf9f3','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#fbf9f3','--md-sys-color-on-surface':'#1a73e8',
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
      '--md-sys-color-surface-container-lowest':'#0e0e0b','--md-sys-color-surface-container-low':'#2b2c28',
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
      '--md-sys-color-background':'#fbf9fa','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#fbf9fa','--md-sys-color-on-surface':'#1a73e8',
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
      '--md-sys-color-surface-container-lowest':'#0d0e10','--md-sys-color-surface-container-low':'#2b2c2d',
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
      '--md-sys-color-background':'#f9fafa','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#f9fafa','--md-sys-color-on-surface':'#1a73e8',
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
  vermelho: {
    label: 'Vermelho', funName: 'Dona Pimenta', swatch: '#86473c',
    light: {
      '--md-sys-color-primary':'#86473c','--md-sys-color-on-primary':'#ffffff',
      '--md-sys-color-primary-container':'#eed7d3','--md-sys-color-on-primary-container':'#592e26',
      '--md-sys-color-inverse-primary':'#e0beb8',
      '--md-sys-color-secondary':'#705651','--md-sys-color-on-secondary':'#ffffff',
      '--md-sys-color-secondary-container':'#ebe2e0','--md-sys-color-on-secondary-container':'#493936',
      '--md-sys-color-tertiary':'#78804d','--md-sys-color-on-tertiary':'#ffffff',
      '--md-sys-color-tertiary-container':'#e8ebd6','--md-sys-color-on-tertiary-container':'#4d532d',
      '--md-sys-color-error':'#ba1a1a','--md-sys-color-on-error':'#ffffff',
      '--md-sys-color-error-container':'#ffdad6','--md-sys-color-on-error-container':'#93000a',
      '--md-sys-color-background':'#fafaf9','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#fafaf9','--md-sys-color-on-surface':'#1a73e8',
      '--md-sys-color-surface-variant':'#e8e4e3','--md-sys-color-on-surface-variant':'#4d4342',
      '--md-sys-color-surface-dim':'#dcd7d6','--md-sys-color-surface-bright':'#fafaf9',
      '--md-sys-color-surface-container-lowest':'#ffffff','--md-sys-color-surface-container-low':'#f6f4f4',
      '--md-sys-color-surface-container':'#f1efee','--md-sys-color-surface-container-high':'#ece9e9',
      '--md-sys-color-surface-container-highest':'#e8e4e3',
      '--md-sys-color-outline':'#7f6f6c','--md-sys-color-outline-variant':'#cbc4c2',
      '--md-sys-color-inverse-surface':'#322b2a','--md-sys-color-inverse-on-surface':'#f3f2f1',
      '--md-sys-color-surface-tint':'#86473c',
      '--md-extended-color-receita-color':'#006a66','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#6bf8f0','--md-extended-color-receita-on-color-container':'#00201e',
      '--md-extended-color-investimento-color':'#0061a4','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#d1e4ff','--md-extended-color-investimento-on-color-container':'#001d36',
      '--md-extended-color-aviso-color':'#944a00','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdcc5','--md-extended-color-aviso-on-color-container':'#301400',
    },
    dark: {
      '--md-sys-color-primary':'#e0beb8','--md-sys-color-on-primary':'#4c2a24',
      '--md-sys-color-primary-container':'#673a32','--md-sys-color-on-primary-container':'#eed7d3',
      '--md-sys-color-inverse-primary':'#86473c',
      '--md-sys-color-secondary':'#d2c8c6','--md-sys-color-on-secondary':'#392f2d',
      '--md-sys-color-secondary-container':'#4f3e3b','--md-sys-color-on-secondary-container':'#ebe2e0',
      '--md-sys-color-tertiary':'#d9ddc6','--md-sys-color-on-tertiary':'#42462a',
      '--md-sys-color-tertiary-container':'#5d6336','--md-sys-color-on-tertiary-container':'#e8ebd6',
      '--md-sys-color-error':'#ffb4ab','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000a','--md-sys-color-on-error-container':'#ffdad6',
      '--md-sys-color-background':'#131110','--md-sys-color-on-background':'#e8e4e3',
      '--md-sys-color-surface':'#131110','--md-sys-color-on-surface':'#e8e4e3',
      '--md-sys-color-surface-variant':'#4d4342','--md-sys-color-on-surface-variant':'#cbc4c2',
      '--md-sys-color-surface-dim':'#131110','--md-sys-color-surface-bright':'#3d3534',
      '--md-sys-color-surface-container-lowest':'#0e0c0c','--md-sys-color-surface-container-low':'#1c1817',
      '--md-sys-color-surface-container':'#211d1c','--md-sys-color-surface-container-high':'#2c2626',
      '--md-sys-color-surface-container-highest':'#37302f',
      '--md-sys-color-outline':'#9a8b89','--md-sys-color-outline-variant':'#4d4342',
      '--md-sys-color-inverse-surface':'#e8e4e3','--md-sys-color-inverse-on-surface':'#322b2a',
      '--md-sys-color-surface-tint':'#e0beb8',
      '--md-extended-color-receita-color':'#48dbd3','--md-extended-color-receita-on-color':'#003735',
      '--md-extended-color-receita-color-container':'#00504d','--md-extended-color-receita-on-color-container':'#6bf8f0',
      '--md-extended-color-investimento-color':'#9fcaff','--md-extended-color-investimento-on-color':'#003259',
      '--md-extended-color-investimento-color-container':'#00497d','--md-extended-color-investimento-on-color-container':'#d1e4ff',
      '--md-extended-color-aviso-color':'#ffb783','--md-extended-color-aviso-on-color':'#4f2500',
      '--md-extended-color-aviso-color-container':'#713700','--md-extended-color-aviso-on-color-container':'#ffdcc5',
    },
  },
  teal: {
    label: 'Teal', funName: 'Sereia Turquesa', swatch: '#3c8681',
    light: {
      '--md-sys-color-primary':'#3c8681','--md-sys-color-on-primary':'#ffffff',
      '--md-sys-color-primary-container':'#d3eeed','--md-sys-color-on-primary-container':'#265956',
      '--md-sys-color-inverse-primary':'#b8e0de',
      '--md-sys-color-secondary':'#51706f','--md-sys-color-on-secondary':'#ffffff',
      '--md-sys-color-secondary-container':'#e0ebea','--md-sys-color-on-secondary-container':'#364948',
      '--md-sys-color-tertiary':'#4d5080','--md-sys-color-on-tertiary':'#ffffff',
      '--md-sys-color-tertiary-container':'#d6d7eb','--md-sys-color-on-tertiary-container':'#2d2f53',
      '--md-sys-color-error':'#ba1a1a','--md-sys-color-on-error':'#ffffff',
      '--md-sys-color-error-container':'#ffdad6','--md-sys-color-on-error-container':'#93000a',
      '--md-sys-color-background':'#f9fafa','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#f9fafa','--md-sys-color-on-surface':'#1a73e8',
      '--md-sys-color-surface-variant':'#e3e8e8','--md-sys-color-on-surface-variant':'#424d4c',
      '--md-sys-color-surface-dim':'#d6dcdb','--md-sys-color-surface-bright':'#f9fafa',
      '--md-sys-color-surface-container-lowest':'#ffffff','--md-sys-color-surface-container-low':'#f4f6f6',
      '--md-sys-color-surface-container':'#eef1f1','--md-sys-color-surface-container-high':'#e9ecec',
      '--md-sys-color-surface-container-highest':'#e3e8e7',
      '--md-sys-color-outline':'#6c7f7e','--md-sys-color-outline-variant':'#c2cbcb',
      '--md-sys-color-inverse-surface':'#2a3231','--md-sys-color-inverse-on-surface':'#f1f3f3',
      '--md-sys-color-surface-tint':'#3c8681',
      '--md-extended-color-receita-color':'#006a66','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#6bf8f0','--md-extended-color-receita-on-color-container':'#00201e',
      '--md-extended-color-investimento-color':'#0061a4','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#d1e4ff','--md-extended-color-investimento-on-color-container':'#001d36',
      '--md-extended-color-aviso-color':'#944a00','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdcc5','--md-extended-color-aviso-on-color-container':'#301400',
    },
    dark: {
      '--md-sys-color-primary':'#b8e0de','--md-sys-color-on-primary':'#244c49',
      '--md-sys-color-primary-container':'#326764','--md-sys-color-on-primary-container':'#d3eeed',
      '--md-sys-color-inverse-primary':'#3c8681',
      '--md-sys-color-secondary':'#c6d2d1','--md-sys-color-on-secondary':'#2d3938',
      '--md-sys-color-secondary-container':'#3b4f4e','--md-sys-color-on-secondary-container':'#e0ebea',
      '--md-sys-color-tertiary':'#c6c7dd','--md-sys-color-on-tertiary':'#2a2c46',
      '--md-sys-color-tertiary-container':'#363863','--md-sys-color-on-tertiary-container':'#d6d7eb',
      '--md-sys-color-error':'#ffb4ab','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000a','--md-sys-color-on-error-container':'#ffdad6',
      '--md-sys-color-background':'#101313','--md-sys-color-on-background':'#e3e8e7',
      '--md-sys-color-surface':'#101313','--md-sys-color-on-surface':'#e3e8e7',
      '--md-sys-color-surface-variant':'#424d4c','--md-sys-color-on-surface-variant':'#c2cbcb',
      '--md-sys-color-surface-dim':'#101313','--md-sys-color-surface-bright':'#343d3c',
      '--md-sys-color-surface-container-lowest':'#0c0e0e','--md-sys-color-surface-container-low':'#171c1b',
      '--md-sys-color-surface-container':'#1c2121','--md-sys-color-surface-container-high':'#262c2c',
      '--md-sys-color-surface-container-highest':'#2f3737',
      '--md-sys-color-outline':'#899a99','--md-sys-color-outline-variant':'#424d4c',
      '--md-sys-color-inverse-surface':'#e3e8e7','--md-sys-color-inverse-on-surface':'#2a3231',
      '--md-sys-color-surface-tint':'#b8e0de',
      '--md-extended-color-receita-color':'#48dbd3','--md-extended-color-receita-on-color':'#003735',
      '--md-extended-color-receita-color-container':'#00504d','--md-extended-color-receita-on-color-container':'#6bf8f0',
      '--md-extended-color-investimento-color':'#9fcaff','--md-extended-color-investimento-on-color':'#003259',
      '--md-extended-color-investimento-color-container':'#00497d','--md-extended-color-investimento-on-color-container':'#d1e4ff',
      '--md-extended-color-aviso-color':'#ffb783','--md-extended-color-aviso-on-color':'#4f2500',
      '--md-extended-color-aviso-color-container':'#713700','--md-extended-color-aviso-on-color-container':'#ffdcc5',
    },
  },
  mostarda: {
    label: 'Mostarda', funName: 'Seu Mostarda', swatch: '#86713c',
    light: {
      '--md-sys-color-primary':'#86713c','--md-sys-color-on-primary':'#ffffff',
      '--md-sys-color-primary-container':'#eee6d3','--md-sys-color-on-primary-container':'#594b26',
      '--md-sys-color-inverse-primary':'#e0d5b8',
      '--md-sys-color-secondary':'#706851','--md-sys-color-on-secondary':'#ffffff',
      '--md-sys-color-secondary-container':'#ebe8e0','--md-sys-color-on-secondary-container':'#494436',
      '--md-sys-color-tertiary':'#5b804d','--md-sys-color-on-tertiary':'#ffffff',
      '--md-sys-color-tertiary-container':'#dcebd6','--md-sys-color-on-tertiary-container':'#38532d',
      '--md-sys-color-error':'#ba1a1a','--md-sys-color-on-error':'#ffffff',
      '--md-sys-color-error-container':'#ffdad6','--md-sys-color-on-error-container':'#93000a',
      '--md-sys-color-background':'#fafaf9','--md-sys-color-on-background':'#1a73e8',
      '--md-sys-color-surface':'#fafaf9','--md-sys-color-on-surface':'#1a73e8',
      '--md-sys-color-surface-variant':'#e8e7e3','--md-sys-color-on-surface-variant':'#4d4a42',
      '--md-sys-color-surface-dim':'#dcdad6','--md-sys-color-surface-bright':'#fafaf9',
      '--md-sys-color-surface-container-lowest':'#ffffff','--md-sys-color-surface-container-low':'#f6f5f4',
      '--md-sys-color-surface-container':'#f1f0ee','--md-sys-color-surface-container-high':'#ecebe9',
      '--md-sys-color-surface-container-highest':'#e8e6e3',
      '--md-sys-color-outline':'#7f796c','--md-sys-color-outline-variant':'#cbc9c2',
      '--md-sys-color-inverse-surface':'#322f2a','--md-sys-color-inverse-on-surface':'#f3f3f1',
      '--md-sys-color-surface-tint':'#86713c',
      '--md-extended-color-receita-color':'#006a66','--md-extended-color-receita-on-color':'#ffffff',
      '--md-extended-color-receita-color-container':'#6bf8f0','--md-extended-color-receita-on-color-container':'#00201e',
      '--md-extended-color-investimento-color':'#0061a4','--md-extended-color-investimento-on-color':'#ffffff',
      '--md-extended-color-investimento-color-container':'#d1e4ff','--md-extended-color-investimento-on-color-container':'#001d36',
      '--md-extended-color-aviso-color':'#944a00','--md-extended-color-aviso-on-color':'#ffffff',
      '--md-extended-color-aviso-color-container':'#ffdcc5','--md-extended-color-aviso-on-color-container':'#301400',
    },
    dark: {
      '--md-sys-color-primary':'#e0d5b8','--md-sys-color-on-primary':'#4c4124',
      '--md-sys-color-primary-container':'#675832','--md-sys-color-on-primary-container':'#eee6d3',
      '--md-sys-color-inverse-primary':'#86713c',
      '--md-sys-color-secondary':'#d2cfc6','--md-sys-color-on-secondary':'#39362d',
      '--md-sys-color-secondary-container':'#4f493b','--md-sys-color-on-secondary-container':'#ebe8e0',
      '--md-sys-color-tertiary':'#ccddc6','--md-sys-color-on-tertiary':'#32462a',
      '--md-sys-color-tertiary-container':'#436336','--md-sys-color-on-tertiary-container':'#dcebd6',
      '--md-sys-color-error':'#ffb4ab','--md-sys-color-on-error':'#690005',
      '--md-sys-color-error-container':'#93000a','--md-sys-color-on-error-container':'#ffdad6',
      '--md-sys-color-background':'#131210','--md-sys-color-on-background':'#e8e6e3',
      '--md-sys-color-surface':'#131210','--md-sys-color-on-surface':'#e8e6e3',
      '--md-sys-color-surface-variant':'#4d4a42','--md-sys-color-on-surface-variant':'#cbc9c2',
      '--md-sys-color-surface-dim':'#131210','--md-sys-color-surface-bright':'#3d3a34',
      '--md-sys-color-surface-container-lowest':'#0e0d0c','--md-sys-color-surface-container-low':'#1c1a17',
      '--md-sys-color-surface-container':'#21201c','--md-sys-color-surface-container-high':'#2c2a26',
      '--md-sys-color-surface-container-highest':'#37352f',
      '--md-sys-color-outline':'#9a9589','--md-sys-color-outline-variant':'#4d4a42',
      '--md-sys-color-inverse-surface':'#e8e6e3','--md-sys-color-inverse-on-surface':'#322f2a',
      '--md-sys-color-surface-tint':'#e0d5b8',
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
  return localStorage.getItem('md-theme') || 'verde';
}

function applyMaterialTheme(name) {
  const theme = MATERIAL_THEMES[name];
  if (!theme) return;
  const tokens = theme[getTheme()];
  const root = document.documentElement.style;
  Object.entries(tokens).forEach(([k, v]) => root.setProperty(k, v));
  localStorage.setItem('md-theme', name);
  updateThemeCarouselActive();
  if (typeof renderHome === 'function' && document.getElementById('screen-home') &&
      document.getElementById('screen-home').classList.contains('active')) {
    renderHome();
  }
}

function themeCarouselItemHtml(key, t, active) {
  return `<div class="theme-carousel-item" data-theme-name="${key}" onclick="applyMaterialTheme('${key}')">
    <div class="theme-carousel-swatch${active ? ' active' : ''}" style="background:${t.swatch}">${active ? '<span class="material-symbols-outlined">check</span>' : ''}</div>
    <div class="theme-carousel-name${active ? ' active' : ''}">${t.funName}</div>
  </div>`;
}

/* Carrossel infinito: triplica os itens e recentra o scroll na cópia
   do meio; onThemeCarouselScroll() pula silenciosamente pra cópia
   equivalente quando o usuário se aproxima de uma ponta. */
function renderThemeCarousel() {
  const el = document.getElementById('theme-carousel');
  if (!el) return;
  const current = getMaterialTheme();
  const entries = Object.entries(MATERIAL_THEMES);
  const oneSet = entries.map(([key, t]) => themeCarouselItemHtml(key, t, key === current)).join('');
  el.innerHTML = oneSet + oneSet + oneSet;
  el.scrollLeft = el.scrollWidth / 3;
}

function updateThemeCarouselActive() {
  const el = document.getElementById('theme-carousel');
  if (!el) return;
  const current = getMaterialTheme();
  el.querySelectorAll('.theme-carousel-item').forEach(item => {
    const active = item.dataset.themeName === current;
    const t = MATERIAL_THEMES[item.dataset.themeName];
    const swatch = item.querySelector('.theme-carousel-swatch');
    const nameEl = item.querySelector('.theme-carousel-name');
    swatch.classList.toggle('active', active);
    swatch.innerHTML = active ? '<span class="material-symbols-outlined">check</span>' : '';
    nameEl.classList.toggle('active', active);
  });
}

function onThemeCarouselScroll() {
  const el = document.getElementById('theme-carousel');
  if (!el) return;
  const oneSetWidth = el.scrollWidth / 3;
  if (el.scrollLeft < oneSetWidth * 0.5) el.scrollLeft += oneSetWidth;
  else if (el.scrollLeft > oneSetWidth * 2.5) el.scrollLeft -= oneSetWidth;
}

function initMaterialTheme() {
  applyMaterialTheme(getMaterialTheme());
}

initMaterialTheme();
