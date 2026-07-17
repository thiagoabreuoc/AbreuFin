<!-- ═══════════════ LOGIN ═══════════════ -->
<div class="screen hidden auth-screen" id="screen-login">
  <div class="screen-body center-col">
    <h4 class="auth-title auth-title-left">Bem-vindo<br>de volta</h4>
    <p class="auth-subtitle auth-subtitle-left">Entre e continue no controle das suas finanças.</p>

    <div class="mb-3">
      <input class="form-control auth-input-box" id="l-email" type="email" placeholder="E-mail" autocomplete="email">
    </div>
    <div class="mb-3">
      <input class="form-control auth-input-box" id="l-senha" type="password" placeholder="Senha" autocomplete="current-password">
    </div>
    <div class="d-flex justify-content-between align-items-center mb-2 auth-check">
      <div class="form-check mb-0">
        <input class="form-check-input" type="checkbox" id="l-remember">
        <label class="form-check-label" for="l-remember">Lembrar-me</label>
      </div>
      <a href="#" class="auth-link small" style="text-decoration:none" onclick="showScreen('forgot');return false;">Esqueci a senha?</a>
    </div>
    <div class="text-center small auth-err" style="min-height:18px;margin:6px 0" id="login-err"></div>
    <button class="btn auth-btn-primary w-100 mt-2" id="login-submit-btn" onclick="doLogin()">Entrar</button>

    <p class="text-center auth-subtitle mt-4" style="margin-bottom:12px">ou continue com</p>
    <div class="text-center">
      <a class="auth-social-circle d-inline-flex" href="api/google_login.php" aria-label="Continuar com Google">
        <svg width="20" height="20" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
      </a>
    </div>

    <div class="text-center small mt-4">
      <a href="#" class="auth-link" onclick="showScreen('register');return false;">Não tem conta? Criar conta</a>
    </div>
    <div class="text-center small mt-2">
      <a href="#" class="auth-link text-muted" onclick="showScreen('privacy');return false;">Política de Privacidade e LGPD</a>
    </div>
  </div>
</div>
