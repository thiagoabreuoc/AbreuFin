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
      screenStack = ['login'];
      showScreen('login', false);
      document.getElementById('login-err').textContent =
        GOOGLE_ERROR_MESSAGES[window.__GOOGLE_ERROR__] || 'Não foi possível entrar com Google.';
    } else {
      screenStack = ['welcome'];
      showScreen('welcome', false);
    }
  }
})();

/* Sidebar desktop: expande por posição do mouse (não :hover puro) — o
   .fab-scrim cobre a tela inteira (pointer-events:all) quando o menu do
   botão Novo abre, e ficaria por cima da sidebar, então :hover nunca
   dispararia nela nesse estado. mousemove no document não depende de
   quem é o elemento "por cima" no ponto do cursor. */
document.addEventListener('mousemove', (e) => {
  const sidebar = document.getElementById('sidebar-desktop');
  if (!sidebar) return;
  const r = sidebar.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return;
  // r.right já reflete a largura REAL atual (72 colapsada, 260 expandida)
  // — usar um valor fixo de 260 aqui fazia qualquer elemento de conteúdo
  // nessa faixa horizontal (ex.: botão de voltar da Listagem) também
  // disparar a expansão, mesmo com a sidebar colapsada em 72px.
  const inside = e.clientX >= r.left && e.clientX < r.right && e.clientY >= r.top && e.clientY < r.bottom;
  sidebar.classList.toggle('expanded', inside);
});
