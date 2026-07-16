/* ═══════════════════════════════════════
   ACCOUNT — recuperação e alteração de senha
═══════════════════════════════════════ */
async function doForgotPassword() {
  const email = document.getElementById('fp-email').value.trim();
  const err = document.getElementById('forgot-err');
  const result = document.getElementById('forgot-result');
  const btn = document.getElementById('forgot-submit-btn');
  err.textContent = '';
  result.style.display = 'none';
  if (!email || !email.includes('@')) { err.textContent = 'Informe um e-mail válido.'; return; }
  setBtnLoading(btn, true);
  try {
    const data = await apiForgotPassword(email);
    if (data.resetLink) {
      result.innerHTML = '<b>Link de redefinição (simulado, sem envio de e-mail):</b><br>';
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = data.resetLink;
      a.onclick = (ev) => { ev.preventDefault(); openResetFromLink(data.resetToken); };
      result.appendChild(a);
    } else {
      result.textContent = data.message;
    }
    result.style.display = 'block';
  } catch (e) {
    err.textContent = e.message;
  } finally {
    setBtnLoading(btn, false);
  }
}

function openResetFromLink(token) {
  document.getElementById('rp-token').value = token;
  document.getElementById('rp-senha').value = '';
  document.getElementById('rp-senha2').value = '';
  document.getElementById('reset-err').textContent = '';
  showScreen('reset');
}

async function doResetPassword() {
  const token = document.getElementById('rp-token').value;
  const senha = document.getElementById('rp-senha').value;
  const senha2 = document.getElementById('rp-senha2').value;
  const err = document.getElementById('reset-err');
  const btn = document.getElementById('reset-submit-btn');
  err.textContent = '';
  if (senha.length < 8) { err.textContent = 'A senha deve ter pelo menos 8 caracteres.'; return; }
  if (senha !== senha2) { err.textContent = 'As senhas não coincidem.'; return; }
  setBtnLoading(btn, true);
  try {
    await apiResetPassword(token, senha);
    showToast('Senha redefinida com sucesso!', 'success');
    screenStack = ['login'];
    showScreen('login', false);
  } catch (e) {
    err.textContent = e.message;
  } finally {
    setBtnLoading(btn, false);
  }
}

function initChangePasswordScreen() {
  const hasPassword = !!(currentUser && currentUser.hasPassword);
  const wrap = document.getElementById('cp-atual-wrap');
  const helper = document.getElementById('cp-helper');
  if (wrap) wrap.style.display = hasPassword ? '' : 'none';
  if (helper) helper.textContent = hasPassword
    ? 'Confirme sua senha atual e defina uma nova.'
    : 'Você entrou com o Google e ainda não tem uma senha. Crie uma pra também poder entrar com e-mail e senha.';
  ['cp-atual', 'cp-nova', 'cp-nova2'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.type = 'password'; }
  });
  document.querySelectorAll('#screen-change-password .material-symbols-outlined').forEach(function(icon) {
    if (icon.textContent === 'visibility_off') icon.textContent = 'visibility';
  });
  document.getElementById('change-password-err').textContent = '';
  updatePwStrength();
}

function togglePwVisibility(id, btn) {
  const input = document.getElementById(id);
  const icon = btn.querySelector('.material-symbols-outlined');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  icon.textContent = show ? 'visibility_off' : 'visibility';
}

function passwordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { pct: 33,  label: 'Fraca',  color: 'var(--md-sys-color-error)' };
  if (score <= 3) return { pct: 66,  label: 'Média',  color: 'var(--md-extended-color-aviso-color)' };
  return           { pct: 100, label: 'Forte',  color: 'var(--md-extended-color-success-color)' };
}

function updatePwStrength() {
  const pwd = document.getElementById('cp-nova').value;
  const wrap = document.getElementById('cp-strength');
  const bar = document.getElementById('cp-strength-bar');
  const label = document.getElementById('cp-strength-label');
  if (!wrap || !bar || !label) return;
  if (!pwd) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const s = passwordStrength(pwd);
  bar.style.width = s.pct + '%';
  bar.style.backgroundColor = s.color;
  label.textContent = s.label;
  label.style.color = s.color;
}

async function doChangePassword() {
  const hasPassword = !!(currentUser && currentUser.hasPassword);
  const atual = document.getElementById('cp-atual').value;
  const nova = document.getElementById('cp-nova').value;
  const nova2 = document.getElementById('cp-nova2').value;
  const err = document.getElementById('change-password-err');
  const btn = document.getElementById('change-password-submit-btn');
  err.textContent = '';
  if (hasPassword && !atual) { err.textContent = 'Informe sua senha atual.'; return; }
  if (nova.length < 8) { err.textContent = 'A nova senha deve ter pelo menos 8 caracteres.'; return; }
  if (!/[A-Za-z]/.test(nova) || !/[0-9]/.test(nova)) { err.textContent = 'A nova senha deve ter letras e números.'; return; }
  if (nova !== nova2) { err.textContent = 'As senhas não coincidem.'; return; }
  if (hasPassword && atual === nova) { err.textContent = 'A nova senha deve ser diferente da atual.'; return; }
  setBtnLoading(btn, true);
  try {
    await apiChangePassword(atual, nova);
    document.getElementById('cp-atual').value = '';
    document.getElementById('cp-nova').value = '';
    document.getElementById('cp-nova2').value = '';
    updatePwStrength();
    showToast('Senha alterada com sucesso!', 'success');
    goBack();
  } catch (e) {
    err.textContent = e.message;
  } finally {
    setBtnLoading(btn, false);
  }
}

/* ─────────────── Dados da conta (somente leitura) ─────────────── */
function formatAccountDate(raw) {
  if (!raw) return '—';
  const iso = raw.indexOf('T') === -1 ? raw.replace(' ', 'T') + 'Z' : raw;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function initAccountDataScreen() {
  const u = currentUser || {};
  document.getElementById('ad-name').textContent  = u.name  || '—';
  document.getElementById('ad-email').textContent = u.email || '—';

  let method = '—';
  if (u.viaGoogle && u.hasPassword) method = 'Google e e-mail/senha';
  else if (u.viaGoogle) method = 'Google';
  else if (u.hasPassword) method = 'E-mail e senha';
  document.getElementById('ad-login-method').textContent = method;
  document.getElementById('ad-created-at').textContent = formatAccountDate(u.created_at);

  const section = document.getElementById('ad-google-section');
  const btn = document.getElementById('ad-unlink-btn');
  const btnLabel = document.getElementById('ad-unlink-btn-label');
  const hint = document.getElementById('ad-unlink-hint');
  if (!section || !btn || !btnLabel || !hint) return;

  if (!u.viaGoogle) { section.style.display = 'none'; return; }
  section.style.display = '';

  if (u.hasPassword) {
    btnLabel.textContent = 'Desconectar do Google';
    btn.onclick = confirmUnlinkGoogle;
    hint.textContent = 'Você continua podendo entrar com seu e-mail e senha.';
  } else {
    btnLabel.textContent = 'Definir senha pra poder desconectar';
    btn.onclick = function () { showScreen('change-password'); initChangePasswordScreen(); };
    hint.textContent = 'Defina uma senha antes de desconectar do Google, senão você perde o acesso à conta.';
  }
}

function confirmUnlinkGoogle() {
  document.getElementById('modal-title').textContent = 'Desconectar do Google?';
  document.getElementById('modal-desc').textContent  = 'Você continua podendo entrar com seu e-mail e senha.';
  document.getElementById('modal-confirm-btn').textContent = 'Desconectar';
  document.getElementById('modal-confirm-btn').onclick = async function () {
    hideConfirmModal();
    try {
      await apiUnlinkGoogle();
      currentUser.viaGoogle = false;
      updateGoogleBadge(false);
      initAccountDataScreen();
      showToast('Conta desconectada do Google.', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };
  showConfirmModal();
}
