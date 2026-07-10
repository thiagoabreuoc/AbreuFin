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

async function doChangePassword() {
  const nova = document.getElementById('cp-nova').value;
  const nova2 = document.getElementById('cp-nova2').value;
  const err = document.getElementById('change-password-err');
  const btn = document.getElementById('change-password-submit-btn');
  err.textContent = '';
  if (nova.length < 8) { err.textContent = 'A nova senha deve ter pelo menos 8 caracteres.'; return; }
  if (nova !== nova2) { err.textContent = 'As senhas não coincidem.'; return; }
  setBtnLoading(btn, true);
  try {
    await apiChangePassword(nova);
    document.getElementById('cp-nova').value = '';
    document.getElementById('cp-nova2').value = '';
    showToast('Senha alterada com sucesso!', 'success');
    goBack();
  } catch (e) {
    err.textContent = e.message;
  } finally {
    setBtnLoading(btn, false);
  }
}
