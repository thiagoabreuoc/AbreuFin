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
  if (!localStorage.getItem('pwaInstallTracked')) {
    localStorage.setItem('pwaInstallTracked', '1');
    trackPwaInstall('android_appinstalled');
  }
});
document.addEventListener('DOMContentLoaded', () => {
  updateInstallMenuItem();
  // iOS (e qualquer instalação que o appinstalled não tenha pego) não tem
  // evento de "acabou de instalar" — a melhor aproximação é: primeira vez
  // que o app abre em modo standalone (ícone na tela de início), nesse
  // dispositivo/navegador. Um flag no localStorage evita contar de novo
  // a cada abertura, e evita duplicar quando o appinstalled já contou.
  if (isStandaloneApp() && !localStorage.getItem('pwaInstallTracked')) {
    localStorage.setItem('pwaInstallTracked', '1');
    trackPwaInstall(isIOSDevice() ? 'ios_standalone' : 'android_standalone');
  }
});

function isStandaloneApp() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function isIOSDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}
function trackPwaInstall(method) {
  if (typeof gtag === 'function') gtag('event', 'pwa_install', { method });
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
