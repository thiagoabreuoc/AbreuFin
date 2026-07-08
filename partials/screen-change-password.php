<!-- ═══════════════ CHANGE PASSWORD ═══════════════ -->
<div class="screen hidden" id="screen-change-password">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <span class="flex-grow-1 text-center fw-bold">Alterar senha</span>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="form-floating mb-3">
      <input class="form-control" id="cp-nova" type="password" placeholder="Nova senha" autocomplete="new-password">
      <label for="cp-nova">Nova senha</label>
    </div>
    <div class="form-floating mb-3">
      <input class="form-control" id="cp-nova2" type="password" placeholder="Confirmar nova senha" autocomplete="new-password">
      <label for="cp-nova2">Confirmar nova senha</label>
    </div>
    <div class="text-danger small" id="change-password-err"></div>
  </div>
  <div class="d-flex gap-2 p-3 border-top flex-shrink-0">
    <button class="btn btn-outline-primary flex-fill" onclick="goBack()">Cancelar</button>
    <button class="btn btn-primary flex-fill" onclick="doChangePassword()">Salvar</button>
  </div>
</div>
