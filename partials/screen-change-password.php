<!-- ═══════════════ CHANGE PASSWORD ═══════════════ -->
<div class="screen hidden" id="screen-change-password">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <span class="flex-grow-1 text-center fw-bold">Alterar senha</span>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <p class="text-secondary small mb-3" id="cp-helper">Confirme sua senha atual e defina uma nova.</p>
    <div class="form-floating mb-3 position-relative" id="cp-atual-wrap">
      <input class="form-control" id="cp-atual" type="password" placeholder="Senha atual" autocomplete="current-password" style="padding-right:44px">
      <label for="cp-atual">Senha atual</label>
      <button type="button" class="btn btn-link text-secondary p-0 position-absolute" style="right:12px;top:50%;transform:translateY(-50%)" onclick="togglePwVisibility('cp-atual', this)" aria-label="Mostrar senha atual" tabindex="-1">
        <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
      </button>
    </div>
    <div class="form-floating mb-2 position-relative">
      <input class="form-control" id="cp-nova" type="password" placeholder="Nova senha" autocomplete="new-password" style="padding-right:44px" oninput="updatePwStrength()">
      <label for="cp-nova">Nova senha</label>
      <button type="button" class="btn btn-link text-secondary p-0 position-absolute" style="right:12px;top:50%;transform:translateY(-50%)" onclick="togglePwVisibility('cp-nova', this)" aria-label="Mostrar nova senha" tabindex="-1">
        <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
      </button>
    </div>
    <div id="cp-strength" class="mb-3" style="display:none">
      <div style="height:4px;border-radius:2px;background:var(--md-sys-color-surface-variant);overflow:hidden">
        <div id="cp-strength-bar" style="height:100%;width:0%;border-radius:2px;transition:width .2s ease,background-color .2s ease"></div>
      </div>
      <div class="small mt-1" id="cp-strength-label"></div>
    </div>
    <div class="form-floating mb-3 position-relative">
      <input class="form-control" id="cp-nova2" type="password" placeholder="Confirmar nova senha" autocomplete="new-password" style="padding-right:44px">
      <label for="cp-nova2">Confirmar nova senha</label>
      <button type="button" class="btn btn-link text-secondary p-0 position-absolute" style="right:12px;top:50%;transform:translateY(-50%)" onclick="togglePwVisibility('cp-nova2', this)" aria-label="Mostrar confirmação" tabindex="-1">
        <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
      </button>
    </div>
    <p class="text-secondary small">Use pelo menos 8 caracteres, com letras e números.</p>
    <div class="text-danger small" id="change-password-err"></div>
  </div>
  <div class="d-flex gap-2 p-3 border-top flex-shrink-0">
    <button class="btn btn-outline-primary flex-fill" style="padding-top:10px;padding-bottom:10px" onclick="goBack()">Cancelar</button>
    <button class="btn btn-primary flex-fill" id="change-password-submit-btn" style="padding-top:10px;padding-bottom:10px" onclick="doChangePassword()">Salvar</button>
  </div>
</div>
