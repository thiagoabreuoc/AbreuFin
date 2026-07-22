<!-- ═══════════════ REGISTER ═══════════════ -->
<div class="screen hidden auth-screen" id="screen-register">
  <button class="btn btn-link p-0" style="position:absolute;top:20px;left:20px;color:#fff;z-index:2" onclick="goBack()" aria-label="Voltar">
    <span class="material-symbols-outlined">arrow_back</span>
  </button>
  <div class="screen-body center-col">
    <h4 class="auth-title">Crie sua<br>nova conta</h4>
    <p class="auth-subtitle">E comece a controlar suas finanças.</p>

    <div class="mb-3">
      <input class="form-control auth-input-box" id="r-name" type="text" placeholder="Nome" autocomplete="name">
    </div>
    <div class="mb-3">
      <input class="form-control auth-input-box" id="r-email" type="email" placeholder="E-mail" autocomplete="email">
    </div>
    <div class="mb-3 position-relative">
      <input class="form-control auth-input-box" id="r-senha" type="password" placeholder="Senha" autocomplete="new-password" style="padding-right:44px">
      <button type="button" class="btn btn-link p-0 position-absolute" style="right:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.85)" onclick="togglePwVisibility('r-senha', this)" aria-label="Mostrar senha" tabindex="-1">
        <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
      </button>
    </div>
    <div class="mb-3 position-relative">
      <input class="form-control auth-input-box" id="r-senha2" type="password" placeholder="Confirmar senha" autocomplete="new-password" style="padding-right:44px">
      <button type="button" class="btn btn-link p-0 position-absolute" style="right:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.85)" onclick="togglePwVisibility('r-senha2', this)" aria-label="Mostrar confirmação de senha" tabindex="-1">
        <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
      </button>
    </div>
    <div class="text-center small auth-err" style="min-height:18px;margin:6px 0" id="register-err"></div>
    <button class="btn auth-btn-primary d-block mx-auto" id="register-submit-btn" onclick="doRegister()">Criar conta</button>

    <div class="text-center small mt-4">
      <a href="#" class="auth-link" onclick="showScreen('login');return false;">Já tenho conta — Entrar</a>
    </div>
  </div>
</div>
