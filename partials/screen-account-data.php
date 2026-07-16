<!-- ═══════════════ DADOS DA CONTA (somente leitura) ═══════════════ -->
<div class="screen hidden" id="screen-account-data">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Dados da conta</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <fieldset class="form-box">
      <legend class="form-box-lbl">Nome</legend>
      <input class="form-control form-control-borderless" type="text" id="ad-name" value="" readonly tabindex="-1" style="cursor:default">
    </fieldset>

    <fieldset class="form-box">
      <legend class="form-box-lbl">E-mail</legend>
      <input class="form-control form-control-borderless" type="text" id="ad-email" value="" readonly tabindex="-1" style="cursor:default">
    </fieldset>

    <fieldset class="form-box">
      <legend class="form-box-lbl">Método de login</legend>
      <input class="form-control form-control-borderless" type="text" id="ad-login-method" value="" readonly tabindex="-1" style="cursor:default">
    </fieldset>

    <fieldset class="form-box">
      <legend class="form-box-lbl">Membro desde</legend>
      <input class="form-control form-control-borderless" type="text" id="ad-created-at" value="" readonly tabindex="-1" style="cursor:default">
    </fieldset>

    <div class="mt-4" id="ad-google-section" style="display:none">
      <button class="btn btn-outline-danger w-100" id="ad-unlink-btn">Desconectar do Google</button>
      <p class="text-secondary small mt-2 mb-0" id="ad-unlink-hint"></p>
    </div>
  </div>
</div>
