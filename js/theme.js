/* ═══════════════════════════════════════
   THEME (Material 3 — claro/escuro)

   A paleta de cor (Verde ABFinanças) é fixa e vive inteiramente em
   css/material3-tokens.css — este arquivo só alterna o atributo
   [data-theme] do <html>, que já basta pra trocar todos os tokens
   via CSS (:root vs :root[data-theme="dark"]).
═══════════════════════════════════════ */
function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', theme);
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
