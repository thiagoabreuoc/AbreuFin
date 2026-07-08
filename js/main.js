/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
const GOOGLE_ERROR_MESSAGES = {
  state_invalido: 'Sessão de login expirou, tente novamente.',
  acesso_negado: 'Login com Google cancelado.',
  codigo_ausente: 'Login com Google falhou. Tente novamente.',
  token_falhou: 'Não foi possível confirmar sua conta Google.',
  email_nao_verificado: 'Seu e-mail Google precisa estar verificado.',
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
    showScreen('login', false);
    if (window.__GOOGLE_ERROR__) {
      document.getElementById('login-err').textContent =
        GOOGLE_ERROR_MESSAGES[window.__GOOGLE_ERROR__] || 'Não foi possível entrar com Google.';
    }
  }
})();
