/* ═══════════════════════════════════════
   THEME (Material 3 — claro/escuro)
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
}

function initThemeToggle() {
  const el = document.getElementById('theme-toggle');
  if (el) el.checked = getTheme() === 'dark';
}
