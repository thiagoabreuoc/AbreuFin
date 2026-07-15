<!-- ═══════════════ DADOS DA CONTA (somente leitura) ═══════════════ -->
<div class="screen hidden" id="screen-account-data">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Dados da conta</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="list-group cat-row-list">
      <div class="list-group-item cat-row-card">
        <div class="text-secondary small">Nome</div>
        <div class="fw-medium" id="ad-name">—</div>
      </div>
      <div class="list-group-item cat-row-card">
        <div class="text-secondary small">E-mail</div>
        <div class="fw-medium" id="ad-email">—</div>
      </div>
      <div class="list-group-item cat-row-card">
        <div class="text-secondary small">Método de login</div>
        <div class="fw-medium" id="ad-login-method">—</div>
      </div>
      <div class="list-group-item cat-row-card">
        <div class="text-secondary small">Membro desde</div>
        <div class="fw-medium" id="ad-created-at">—</div>
      </div>
    </div>

    <div class="mt-4" id="ad-google-section" style="display:none">
      <button class="btn btn-outline-danger w-100" id="ad-unlink-btn">Desconectar do Google</button>
      <p class="text-secondary small mt-2 mb-0" id="ad-unlink-hint"></p>
    </div>
  </div>
</div>
