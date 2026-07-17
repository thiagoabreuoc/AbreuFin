<!-- ═══════════════ REGISTER ═══════════════ -->
<div class="screen hidden auth-screen" id="screen-register">
  <button class="btn btn-link p-0" style="position:absolute;top:20px;left:20px;color:#fff;z-index:2" onclick="goBack()" aria-label="Voltar">
    <span class="material-symbols-outlined">arrow_back</span>
  </button>
  <div class="screen-body center-col">
    <div class="auth-icon-badge"><span class="material-symbols-outlined">account_balance_wallet</span></div>
    <h4 class="auth-title">Crie sua<br>nova conta</h4>
    <p class="auth-subtitle">E comece a controlar suas finanças.</p>

    <div class="mb-3">
      <input class="form-control auth-input" id="r-name" type="text" placeholder="Nome" autocomplete="name">
    </div>
    <div class="mb-3">
      <input class="form-control auth-input" id="r-email" type="email" placeholder="E-mail" autocomplete="email">
    </div>
    <div class="mb-3">
      <input class="form-control auth-input" id="r-senha" type="password" placeholder="Senha" autocomplete="new-password">
    </div>
    <div class="mb-3">
      <input class="form-control auth-input" id="r-senha2" type="password" placeholder="Confirmar senha" autocomplete="new-password">
    </div>
    <div class="text-center small auth-err" style="min-height:18px;margin:6px 0" id="register-err"></div>
    <button class="btn auth-btn-primary d-block mx-auto" id="register-submit-btn" onclick="doRegister()">Criar conta</button>

    <div class="text-center small mt-4">
      <a href="#" class="auth-link" onclick="showScreen('login');return false;">Já tenho conta — entrar</a>
    </div>
  </div>
</div>
