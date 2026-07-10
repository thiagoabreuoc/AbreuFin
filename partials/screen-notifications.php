<!-- ═══════════════ NOTIFICATIONS ═══════════════ -->
<div class="screen hidden" id="screen-notifications">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Notificações</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">

    <p class="text-muted small mb-3">Receba alertas de despesas vencidas ou vencendo em breve diretamente neste dispositivo.</p>

    <div class="card mb-3" style="border-radius:12px">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-outlined text-primary">notifications</span>
            <div>
              <div class="fw-semibold">Notificações Push</div>
              <div class="text-muted" id="notif-status-text" style="font-size:.72rem">Verificando...</div>
            </div>
          </div>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="notif-toggle" role="switch"
                   onchange="onNotifToggle()" disabled>
          </div>
        </div>

        <div id="notif-denied-msg" class="mt-3 p-2 rounded-2 small" style="display:none;background:var(--md-extended-color-aviso-color-container);color:var(--md-extended-color-aviso-on-color-container)">
          <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">warning</span>
          Permissão bloqueada pelo navegador. Acesse as configurações do site para liberar.
        </div>

        <div id="notif-unsupported-msg" class="mt-3 p-2 rounded-2 small" style="display:none;background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container)">
          <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">cancel</span>
          Seu navegador não suporta notificações push.
        </div>
      </div>
    </div>

    <p class="text-muted small text-center">Notificações são enviadas até uma vez por dia: alertas de despesas vencidas/a vencer e insights proativos sobre seus gastos.</p>

  </div>
</div>
