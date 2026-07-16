<!-- ═══════════════ CHANGE PASSWORD ═══════════════ -->
<div class="screen hidden" id="screen-change-password">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <span class="flex-grow-1 text-center fw-bold">Alterar senha</span>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <p class="text-secondary small mb-3" id="cp-helper">Confirme sua senha atual e defina uma nova.</p>
    <fieldset class="form-box" id="cp-atual-wrap">
      <legend class="form-box-lbl">Senha atual</legend>
      <div style="display:flex;align-items:center">
        <input class="form-control form-control-borderless" type="password" id="cp-atual" autocomplete="current-password" style="flex:1">
        <button type="button" class="btn btn-link text-secondary p-0" onclick="togglePwVisibility('cp-atual', this)" aria-label="Mostrar senha atual" tabindex="-1">
          <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
        </button>
      </div>
    </fieldset>
    <fieldset class="form-box" style="margin-bottom:8px">
      <legend class="form-box-lbl">Nova senha</legend>
      <div style="display:flex;align-items:center">
        <input class="form-control form-control-borderless" type="password" id="cp-nova" autocomplete="new-password" style="flex:1" oninput="updatePwStrength()">
        <button type="button" class="btn btn-link text-secondary p-0" onclick="togglePwVisibility('cp-nova', this)" aria-label="Mostrar nova senha" tabindex="-1">
          <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
        </button>
      </div>
    </fieldset>
    <div id="cp-strength" class="mb-3" style="display:none">
      <div style="height:4px;border-radius:2px;background:var(--md-sys-color-surface-variant);overflow:hidden">
        <div id="cp-strength-bar" style="height:100%;width:0%;border-radius:2px;transition:width .2s ease,background-color .2s ease"></div>
      </div>
      <div class="small mt-1" id="cp-strength-label"></div>
    </div>
    <fieldset class="form-box">
      <legend class="form-box-lbl">Confirmar nova senha</legend>
      <div style="display:flex;align-items:center">
        <input class="form-control form-control-borderless" type="password" id="cp-nova2" autocomplete="new-password" style="flex:1">
        <button type="button" class="btn btn-link text-secondary p-0" onclick="togglePwVisibility('cp-nova2', this)" aria-label="Mostrar confirmação" tabindex="-1">
          <span class="material-symbols-outlined" style="font-size:1.2rem">visibility</span>
        </button>
      </div>
    </fieldset>
    <p class="text-secondary small">Use pelo menos 8 caracteres, com letras e números.</p>
    <div class="text-danger small" id="change-password-err"></div>
  </div>
  <div class="d-flex gap-2 p-3 border-top flex-shrink-0">
    <button class="btn btn-outline-primary flex-fill" style="padding-top:10px;padding-bottom:10px" onclick="goBack()">Cancelar</button>
    <button class="btn btn-primary flex-fill" id="change-password-submit-btn" style="padding-top:10px;padding-bottom:10px" onclick="doChangePassword()">Salvar</button>
  </div>
</div>
