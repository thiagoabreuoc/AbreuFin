<!-- ═══════════════ PROFILE ═══════════════ -->
<div class="screen hidden" id="screen-profile">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><i class="bi bi-chevron-left fs-4"></i></button>
    <div class="flex-grow-1 text-center fw-bold">Perfil</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="text-center py-3">
      <div class="avatar-lg rounded-circle bg-primary-subtle text-primary fw-bold d-inline-flex align-items-center justify-content-center mb-2 overflow-hidden" id="profile-avatar">T</div>
      <div class="fs-5 fw-bold" id="profile-name">Usuário</div>
      <div class="text-muted small" id="profile-email">usuario@email.com</div>
      <span class="badge bg-light text-dark border d-inline-flex align-items-center gap-1 mt-2" id="profile-google-badge" style="display:none">
        <svg width="14" height="14" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
        Conectado com Google
      </span>
    </div>

    <div class="mb-4">
      <div class="list-group">
        <div class="list-group-item d-flex justify-content-between align-items-center">
          <span>Tema escuro</span>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="theme-toggle" role="switch" onchange="toggleTheme(this.checked)">
          </div>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center" onclick="navigate('cats')" style="cursor:pointer">
          <span>Categorias</span>
          <i class="bi bi-chevron-right text-secondary"></i>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center" onclick="openExport()" style="cursor:pointer">
          <span>Exportar dados</span>
          <i class="bi bi-chevron-right text-secondary"></i>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center" onclick="showScreen('change-password')" style="cursor:pointer">
          <span>Alterar senha</span>
          <i class="bi bi-chevron-right text-secondary"></i>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center" onclick="showScreen('notifications');loadNotifSettings()" style="cursor:pointer">
          <span>Notificações</span>
          <i class="bi bi-chevron-right text-secondary"></i>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center" onclick="showScreen('privacy')" style="cursor:pointer">
          <span>Privacidade e LGPD</span>
          <i class="bi bi-chevron-right text-secondary"></i>
        </div>
      </div>
    </div>

    <div class="text-center mt-2">
      <button class="btn btn-link btn-sm fw-semibold text-primary" onclick="doLogout()">Sair da conta</button>
    </div>
  </div>
</div>
