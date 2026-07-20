<!-- ═══════════════ CENTRAL DE NOTIFICAÇÕES ═══════════════ -->
<div class="screen hidden" id="screen-notif-center">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()" aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Notificações</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="m3-tabs mb-3">
      <button class="m3-tab active" id="notif-tab-vencimentos" onclick="switchNotifTab('vencimentos')">Vencimentos</button>
      <button class="m3-tab" id="notif-tab-insights" onclick="switchNotifTab('insights')">Insights</button>
    </div>
    <div id="notif-center-body">
      <!-- preenchido por JS -->
    </div>
  </div>
</div>
