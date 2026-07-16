<!-- ═══════════════ DADOS DA CONTA (somente leitura) ═══════════════ -->
<div class="screen hidden" id="screen-account-data">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Dados da conta</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="card" style="border-radius:var(--md-sys-shape-corner-large)!important">
      <div class="card-body d-flex flex-column" style="gap:20px;padding:20px">
        <div>
          <div class="fw-semibold small">Nome</div>
          <div class="text-secondary mt-1" id="ad-name">—</div>
        </div>
        <div>
          <div class="fw-semibold small">E-mail</div>
          <div class="text-secondary mt-1" id="ad-email">—</div>
        </div>
        <div>
          <div class="fw-semibold small">Método de login</div>
          <div class="text-secondary mt-1" id="ad-login-method">—</div>
        </div>
        <div>
          <div class="fw-semibold small">Membro desde</div>
          <div class="text-secondary mt-1" id="ad-created-at">—</div>
        </div>
      </div>
    </div>

    <div class="mt-4" id="ad-google-section" style="display:none">
      <button class="btn w-100 d-flex align-items-center justify-content-center gap-2" id="ad-unlink-btn" style="background:#fff;border:1px solid #dadce0;color:#3c4043;padding-top:10px;padding-bottom:10px">
        <svg width="18" height="18" viewBox="0 0 18 18" style="flex-shrink:0"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
        <span id="ad-unlink-btn-label">Desconectar do Google</span>
      </button>
      <div class="mt-2 px-3 py-2" id="ad-unlink-hint-box" style="background:#fffde7;color:#5c4d00;border-radius:var(--md-sys-shape-corner-medium)">
        <span class="small" id="ad-unlink-hint"></span>
      </div>
    </div>
  </div>
</div>
