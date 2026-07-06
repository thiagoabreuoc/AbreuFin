<!-- ═══════════════ RESET PASSWORD ═══════════════ -->
<div class="screen hidden" id="screen-reset">
  <div class="screen-body center-col">
    <h5 class="text-primary fw-bold mb-0">Nova senha</h5>
    <p class="text-secondary mb-4">Defina uma nova senha para sua conta.</p>

    <input type="hidden" id="rp-token">
    <div class="form-floating mb-3">
      <input class="form-control" id="rp-senha" type="password" placeholder="Nova senha" autocomplete="new-password">
      <label for="rp-senha">Nova senha</label>
    </div>
    <div class="form-floating mb-3">
      <input class="form-control" id="rp-senha2" type="password" placeholder="Confirmar nova senha" autocomplete="new-password">
      <label for="rp-senha2">Confirmar nova senha</label>
    </div>
    <div class="text-danger text-center small" style="min-height:18px;margin:6px 0" id="reset-err"></div>
    <button class="btn btn-primary w-100" onclick="doResetPassword()">Redefinir senha</button>
    <div class="text-center small mt-4">
      <a href="#" onclick="showScreen('login');return false;">Voltar para o login</a>
    </div>
  </div>
</div>
