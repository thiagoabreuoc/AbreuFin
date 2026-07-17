/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
const GOOGLE_ERROR_MESSAGES = {
  state_invalido: 'Sua sessão expirou. Tente entrar novamente.',
  acesso_negado: 'Login com Google cancelado.',
  codigo_ausente: 'Não foi possível entrar com Google. Tente novamente.',
  token_falhou: 'Não foi possível confirmar sua conta Google.',
  email_nao_verificado: 'Seu e-mail do Google precisa estar verificado.',
};

(async function init() {
  if (window.__RESET_TOKEN__) {
    openResetFromLink(window.__RESET_TOKEN__);
    return;
  }
  try {
    await enterApp();
  } catch (e) {
    console.error('Falha ao entrar no app:', e);
    if (window.__GOOGLE_ERROR__) {
      showScreen('login', false);
      document.getElementById('login-err').textContent =
        GOOGLE_ERROR_MESSAGES[window.__GOOGLE_ERROR__] || 'Não foi possível entrar com Google.';
    } else {
      showScreen('welcome', false);
    }
  }
})();
