/* ═══════════════════════════════════════
   INSTALL (Adicionar à tela de início / instalar como app)
═══════════════════════════════════════ */
let _deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  updateInstallMenuItem();
});
window.addEventListener('appinstalled', () => {
  _deferredInstallPrompt = null;
  updateInstallMenuItem();
});
document.addEventListener('DOMContentLoaded', updateInstallMenuItem);

function isStandaloneApp() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function isIOSDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}
// Já instalado (aberto a partir do ícone na tela de início) — esconde o
// item do menu, não faz sentido oferecer instalar de novo.
function updateInstallMenuItem() {
  const item = document.getElementById('drawer-install-item');
  if (item) item.style.display = isStandaloneApp() ? 'none' : 'flex';
}

async function installApp() {
  if (_deferredInstallPrompt) {
    _deferredInstallPrompt.prompt();
    const choice = await _deferredInstallPrompt.userChoice;
    _deferredInstallPrompt = null;
    updateInstallMenuItem();
    if (choice.outcome === 'accepted') showToast('App instalado!', 'success');
    return;
  }
  if (isIOSDevice()) { confirmInstallIOS(); return; }
  showToast('Pra instalar, abra este site no Chrome (Android) ou Safari (iPhone).', 'error');
}

// iOS não tem API de instalação — só o passo manual pelo menu Compartilhar
// do Safari, então mostramos o caminho em vez de tentar automatizar.
function confirmInstallIOS() {
  document.getElementById('modal-title').textContent = 'Instalar no iPhone/iPad';
  document.getElementById('modal-desc').innerHTML =
    'Toque no ícone de compartilhar <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-3px">ios_share</span> na barra do Safari e depois em <b>"Adicionar à Tela de Início"</b>.';
  const btn = document.getElementById('modal-confirm-btn');
  btn.className = 'btn btn-primary flex-fill';
  btn.textContent = 'Entendi';
  btn.onclick = hideConfirmModal;
  showConfirmModal();
}

/* ─────────── Modal "instale o app" — aparece 1x, após o 5º lançamento ─────────── */
function showInstallModal() {
  const el = document.getElementById('install-modal');
  if (!el) return;
  el.style.display = 'flex';
  requestAnimationFrame(() => { requestAnimationFrame(() => { el.style.opacity = '1'; }); });
}
function dismissInstallModal() {
  const el = document.getElementById('install-modal');
  if (!el) return;
  el.style.opacity = '0';
  localStorage.setItem('installModalShown', '1');
  setTimeout(() => { el.style.display = 'none'; }, 190);
}
// Chamado depois de criar um lançamento novo — só dispara na primeira vez
// que o total chega a 5, nunca mais depois de fechado (já tem o atalho
// fixo "Instale o app" no menu pra quem quiser depois).
function maybeShowInstallModal() {
  if (isStandaloneApp()) return;
  if (localStorage.getItem('installModalShown')) return;
  if (entries.length < 5) return;
  showInstallModal();
}
