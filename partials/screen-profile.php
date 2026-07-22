<!-- ═══════════════ PROFILE ═══════════════ -->
<div class="screen hidden" id="screen-profile">
  <div class="d-flex align-items-center p-3 flex-shrink-0 app-header-gradient">
    <button class="btn btn-link text-dark p-0" onclick="goBack()" aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Perfil</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3 app-body-rounded">
    <div class="text-center py-3">
      <div class="avatar-lg rounded-circle bg-primary-subtle text-primary fw-bold d-inline-flex align-items-center justify-content-center mb-2 overflow-hidden" id="profile-avatar">T</div>
      <div class="fs-5 fw-bold" id="profile-name">Usuário</div>
      <div class="text-muted small" id="profile-email">usuario@email.com</div>
      <span class="badge bg-light text-dark border align-items-center gap-1 mt-2 d-none" id="profile-google-badge">
        <svg width="14" height="14" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
        Conectado com Google
      </span>
    </div>

    <div class="mb-4">
      <div class="profile-item d-flex align-items-center gap-3" onclick="showScreen('account-data');initAccountDataScreen()">
        <span class="material-symbols-outlined" style="font-size:1.3rem">badge</span>
        <span class="fw-normal small">Dados da conta</span>
      </div>
      <div class="profile-item d-flex align-items-center gap-3" onclick="showScreen('personalizacao');initThemeToggle()">
        <span class="material-symbols-outlined" style="font-size:1.3rem">palette</span>
        <span class="fw-normal small">Personalização</span>
      </div>
      <div class="profile-item d-flex align-items-center gap-3" onclick="showScreen('cats');renderCats()">
        <span class="material-symbols-outlined" style="font-size:1.3rem">category</span>
        <span class="fw-normal small">Categorias</span>
      </div>
      <div class="profile-item d-flex align-items-center gap-3" onclick="openExport()">
        <span class="material-symbols-outlined" style="font-size:1.3rem">file_download</span>
        <span class="fw-normal small">Exportar dados</span>
      </div>
      <div class="profile-item d-flex align-items-center gap-3" onclick="showScreen('change-password');initChangePasswordScreen()">
        <span class="material-symbols-outlined" style="font-size:1.3rem">lock</span>
        <span class="fw-normal small">Alterar senha</span>
      </div>
      <div class="profile-item d-flex align-items-center gap-3" onclick="showScreen('notifications');loadNotifSettings()">
        <span class="material-symbols-outlined" style="font-size:1.3rem">notifications</span>
        <span class="fw-normal small">Notificações</span>
      </div>
      <div class="profile-item d-flex align-items-center gap-3" onclick="showScreen('privacy')">
        <span class="material-symbols-outlined" style="font-size:1.3rem">privacy_tip</span>
        <span class="fw-normal small">Privacidade e LGPD</span>
      </div>
      <div class="profile-item d-flex align-items-center gap-3" onclick="showScreen('doar')">
        <span class="material-symbols-outlined" style="font-size:1.3rem">volunteer_activism</span>
        <span class="fw-normal small">Apoie o projeto</span>
      </div>
    </div>

    <div class="text-center mt-2">
      <button class="btn btn-link btn-sm fw-semibold text-danger" onclick="doLogout()"><span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">logout</span> Sair da conta</button>
    </div>

    <div class="text-center" style="margin-top:32px;padding-bottom:8px">
      <div class="text-secondary" style="font-size:.7rem">Desenvolvido por Abreu Soluções</div>
      <a href="https://wa.me/5521975745997" target="_blank" rel="noopener" class="d-inline-flex align-items-center gap-1 text-decoration-none" style="font-size:.72rem;color:var(--md-sys-color-primary);margin-top:6px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.42c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.183 8.183 0 0 1 2.41 5.83c0 4.54-3.7 8.27-8.23 8.27zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
        Solicite um orçamento
      </a>
    </div>
  </div>
</div>
