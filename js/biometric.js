/* ═══════════════════════════════════════
   BIOMETRIC LOCK (WebAuthn — Face ID / Touch ID / impressão digital)

   Não é login sem senha: a sessão de 30 dias continua sendo a
   autenticação de verdade (config/session.php). Isto é só um cadeado
   local, tipo app de banco — trava a tela até o gesto biométrico da
   plataforma confirmar, sem nenhuma verificação no servidor (não há
   nada a provar pro backend, só "este aparelho específico" de novo).
   Por isso tudo aqui é client-side: sem endpoint novo, sem tabela nova.
═══════════════════════════════════════ */
const BIOMETRIC_ENABLED_KEY = 'biometricLockEnabled';
const BIOMETRIC_CRED_KEY = 'biometricCredentialId';

function isBiometricLockEnabled() {
  return localStorage.getItem(BIOMETRIC_ENABLED_KEY) === '1' && !!localStorage.getItem(BIOMETRIC_CRED_KEY);
}

async function isBiometricAvailable() {
  return !!(window.PublicKeyCredential &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
}

function b64urlEncode(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function b64urlDecode(str) {
  str = str.replace(/-/g,'+').replace(/_/g,'/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

async function enableBiometricLock() {
  if (!(await isBiometricAvailable())) {
    showToast('Seu dispositivo ou navegador não suporta biometria.', 'error');
    return false;
  }
  try {
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: 'AB Finanças' },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: (currentUser && currentUser.email) || 'usuario',
          displayName: (currentUser && currentUser.name) || 'Usuário',
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
        timeout: 60000,
      },
    });
    localStorage.setItem(BIOMETRIC_CRED_KEY, b64urlEncode(cred.rawId));
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, '1');
    showToast('Bloqueio biométrico ativado.', 'success');
    return true;
  } catch (e) {
    showToast('Não foi possível ativar a biometria.', 'error');
    return false;
  }
}

function disableBiometricLock() {
  localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
  localStorage.removeItem(BIOMETRIC_CRED_KEY);
}

async function verifyBiometric() {
  const credId = localStorage.getItem(BIOMETRIC_CRED_KEY);
  if (!credId) return false;
  try {
    await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [{ id: b64urlDecode(credId), type: 'public-key', transports: ['internal'] }],
        userVerification: 'required',
        timeout: 60000,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}

function showBiometricLock() {
  const el = document.getElementById('biometric-lock');
  if (el) el.style.display = 'flex';
}
function hideBiometricLock() {
  const el = document.getElementById('biometric-lock');
  if (el) el.style.display = 'none';
}

async function attemptBiometricUnlock() {
  if (await verifyBiometric()) hideBiometricLock();
  else showToast('Não foi possível confirmar a biometria.', 'error');
}

// Chamado quando o app reabre sozinho com uma sessão já válida (reload,
// volta do bfcache) — não em login/registro manual, pra não pedir a
// biometria de novo logo depois de já ter digitado a senha.
async function lockIfBiometricEnabled() {
  if (!isBiometricLockEnabled()) return;
  showBiometricLock();
  if (await verifyBiometric()) hideBiometricLock();
}

// Reforça o cadeado ao voltar pro app (ex.: minimizou e reabriu) —
// é justamente o cenário que a biometria existe pra cobrir.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && isBiometricLockEnabled() && typeof currentUser !== 'undefined' && currentUser) {
    lockIfBiometricEnabled();
  }
});

/* ─────────── Toggle na tela de Personalização ─────────── */
async function initBiometricSettings() {
  const toggle = document.getElementById('biometric-toggle');
  const statusText = document.getElementById('biometric-status-text');
  if (!toggle) return;
  const available = await isBiometricAvailable();
  toggle.disabled = !available;
  toggle.checked = isBiometricLockEnabled();
  if (statusText) {
    statusText.textContent = available
      ? (toggle.checked ? 'Ativado neste aparelho' : 'Peça Face ID, digital ou tela de bloqueio pra abrir o app')
      : 'Indisponível neste aparelho/navegador';
  }
}

async function onBiometricToggle(checked) {
  const toggle = document.getElementById('biometric-toggle');
  if (checked) {
    const ok = await enableBiometricLock();
    if (!ok && toggle) toggle.checked = false;
  } else {
    disableBiometricLock();
    showToast('Bloqueio biométrico desativado.', 'success');
  }
  initBiometricSettings();
}

/* ─────────── Entrar com biometria (tela de login) ─────────── */
// Mostra/esconde o botão de acordo com o aparelho ter (ou não) a
// biometria configurada — chamado sempre que a tela de login aparece.
function updateLoginBiometricOption() {
  const wrap = document.getElementById('login-biometric-option');
  if (!wrap) return;
  wrap.style.display = isBiometricLockEnabled() ? 'block' : 'none';
}

async function attemptBiometricLogin() {
  const ok = await verifyBiometric();
  if (!ok) { showToast('Não foi possível confirmar a biometria.', 'error'); return; }
  try {
    // Só funciona porque doLogout() (com biometria ativada) não destrói
    // a sessão no servidor — a biometria confirma "é este aparelho de
    // novo", e enterApp() reaproveita a sessão que já estava válida.
    await enterApp();
  } catch (e) {
    // Sessão não está mais válida (expirou, ou "Sair de verdade" foi
    // usado) — biometria sozinha não loga sem sessão por trás, então
    // esconde a opção e deixa o formulário normal de e-mail/senha.
    showToast('Sessão expirada. Entre com e-mail e senha.', 'error');
    const wrap = document.getElementById('login-biometric-option');
    if (wrap) wrap.style.display = 'none';
  }
}

/* ─────────── Sugestão de ativar após login manual ─────────── */
async function maybeSuggestBiometric() {
  if (isBiometricLockEnabled()) return;
  if (!(await isBiometricAvailable())) return;
  document.getElementById('modal-title').textContent = 'Ativar bloqueio biométrico?';
  document.getElementById('modal-desc').textContent =
    'Da próxima vez, abra o app com Face ID, digital ou reconhecimento facial, sem digitar senha.';
  const btn = document.getElementById('modal-confirm-btn');
  btn.className = 'btn btn-primary flex-fill';
  btn.textContent = 'Ativar';
  btn.onclick = async () => { hideConfirmModal(); await enableBiometricLock(); };
  showConfirmModal();
}
