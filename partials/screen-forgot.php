<!-- ═══════════════ FORGOT PASSWORD ═══════════════ -->
<div class="screen hidden" id="screen-forgot">
  <div class="screen-body center-col">
    <h5 class="text-primary fw-bold mb-0">Recuperar senha</h5>
    <p class="text-secondary mb-4">Informe seu e-mail para gerar um link de redefinição.</p>

    <div class="form-floating mb-3">
      <input class="form-control" id="fp-email" type="email" placeholder="E-mail" autocomplete="email">
      <label for="fp-email">E-mail</label>
    </div>
    <div class="text-danger text-center small" style="min-height:18px;margin:6px 0" id="forgot-err"></div>
    <div class="alert alert-info small" id="forgot-result" style="display:none;word-break:break-all"></div>
    <button class="btn btn-primary w-100" onclick="doForgotPassword()">Gerar link de redefinição</button>
    <div class="text-center small mt-4">
      <a href="#" onclick="goBack();return false;">Voltar para o login</a>
    </div>
  </div>
</div>
