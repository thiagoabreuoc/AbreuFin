<!-- ═══════════════ NOTIFICATIONS ═══════════════ -->
<div class="screen hidden" id="screen-notifications">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><i class="bi bi-chevron-left fs-4"></i></button>
    <div class="flex-grow-1 text-center fw-bold">Notificações</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">

    <p class="text-muted small mb-3">Receba alertas de despesas vencidas ou vencendo em breve diretamente neste dispositivo.</p>

    <div class="card mb-3" style="border-radius:12px">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-bell-fill text-primary fs-5"></i>
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

        <div id="notif-denied-msg" class="mt-3 p-2 rounded-2 small" style="display:none;background:#fff3cd">
          <i class="bi bi-exclamation-triangle-fill text-warning me-1"></i>
          Permissão bloqueada pelo navegador. Acesse as configurações do site para liberar.
        </div>

        <div id="notif-unsupported-msg" class="mt-3 p-2 rounded-2 small" style="display:none;background:#f8d7da">
          <i class="bi bi-x-circle-fill text-danger me-1"></i>
          Seu navegador não suporta notificações push.
        </div>
      </div>
    </div>

    <p class="text-muted small text-center">Notificações são enviadas uma vez por dia quando há despesas vencidas ou vencendo nos próximos 3 dias.</p>

  </div>
</div>
