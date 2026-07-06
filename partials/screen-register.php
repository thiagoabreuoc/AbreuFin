<!-- ═══════════════ REGISTER ═══════════════ -->
<div class="screen hidden" id="screen-register">
  <div class="screen-body center-col">
    <h4 class="text-primary fw-bold mb-0">TF</h4>
    <p class="text-secondary mb-4">Crie sua conta</p>

    <div class="form-floating mb-3">
      <input class="form-control" id="r-name" type="text" placeholder="Nome" autocomplete="name">
      <label for="r-name">Nome</label>
    </div>
    <div class="form-floating mb-3">
      <input class="form-control" id="r-email" type="email" placeholder="E-mail" autocomplete="email">
      <label for="r-email">E-mail</label>
    </div>
    <div class="form-floating mb-3">
      <input class="form-control" id="r-senha" type="password" placeholder="Senha" autocomplete="new-password">
      <label for="r-senha">Senha</label>
    </div>
    <div class="form-floating mb-3">
      <input class="form-control" id="r-senha2" type="password" placeholder="Confirmar senha" autocomplete="new-password">
      <label for="r-senha2">Confirmar senha</label>
    </div>
    <div class="text-danger text-center small" style="min-height:18px;margin:6px 0" id="register-err"></div>
    <button class="btn btn-primary w-100" onclick="doRegister()">Criar conta</button>

    <div class="text-center text-secondary my-3 d-flex align-items-center gap-2">
      <span class="flex-grow-1 border-top"></span>ou<span class="flex-grow-1 border-top"></span>
    </div>
    <a class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2" href="api/google_login.php">
      <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
      Continuar com Google
    </a>

    <div class="text-center small mt-4">
      <a href="#" onclick="goBack();return false;">Já tenho conta — entrar</a>
    </div>
  </div>
</div>
