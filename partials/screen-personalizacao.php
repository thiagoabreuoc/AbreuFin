<!-- ═══════════════ PERSONALIZAÇÃO ═══════════════ -->
<div class="screen hidden" id="screen-personalizacao">
  <div class="d-flex align-items-center p-3 flex-shrink-0 app-header-gradient">
    <button class="btn btn-link text-dark p-0" onclick="goBack()" aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Personalização</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3 app-body-rounded">
    <div class="list-group cat-row-list">
      <div class="list-group-item cat-row-card" id="personalizacao-tema-card">
        <div class="mb-2 text-secondary small fw-semibold">Tema</div>
        <div class="d-flex gap-2">
          <button class="badge status-cell status-cell-white d-inline-flex align-items-center justify-content-center gap-1" id="theme-mode-light" style="flex:1;padding:10px!important" onclick="toggleTheme(false)">
            <span class="material-symbols-outlined" style="font-size:1.1rem">light_mode</span> Claro
          </button>
          <button class="badge status-cell status-cell-white d-inline-flex align-items-center justify-content-center gap-1" id="theme-mode-dark" style="flex:1;padding:10px!important" onclick="toggleTheme(true)">
            <span class="material-symbols-outlined" style="font-size:1.1rem">dark_mode</span> Escuro
          </button>
        </div>
      </div>

      <div class="list-group-item cat-row-card">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-outlined text-primary">fingerprint</span>
            <div>
              <div class="fw-semibold small">Bloqueio biométrico</div>
              <div class="text-muted" id="biometric-status-text" style="font-size:.72rem">Verificando...</div>
            </div>
          </div>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="biometric-toggle" role="switch" onchange="onBiometricToggle(this.checked)" disabled>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
