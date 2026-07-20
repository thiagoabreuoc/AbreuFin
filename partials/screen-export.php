<!-- ═══════════════ EXPORT ═══════════════ -->
<div class="screen hidden" id="screen-export">
  <div class="d-flex align-items-center p-3 flex-shrink-0 app-header-gradient">
    <button class="btn btn-link text-dark p-0" onclick="goBack()" aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Exportar dados</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3 app-body-rounded">
    <div class="list-group cat-row-list" style="gap:8px">
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportCSV()" style="cursor:pointer;padding:14px 16px">
        <span class="material-symbols-outlined" style="font-size:1.3rem">table_chart</span>
        <div class="fw-normal small">Exportar CSV</div>
      </div>
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportJSON()" style="cursor:pointer;padding:14px 16px">
        <span class="material-symbols-outlined" style="font-size:1.3rem">code</span>
        <div class="fw-normal small">Exportar JSON</div>
      </div>
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportTxt()" style="cursor:pointer;padding:14px 16px">
        <span class="material-symbols-outlined" style="font-size:1.3rem">description</span>
        <div class="fw-normal small">Relatório texto</div>
      </div>
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportEmail()" style="cursor:pointer;padding:14px 16px">
        <span class="material-symbols-outlined" style="font-size:1.3rem">mail</span>
        <div class="fw-normal small">Enviar por e-mail</div>
      </div>
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportWhatsapp()" style="cursor:pointer;padding:14px 16px">
        <span class="material-symbols-outlined" style="font-size:1.3rem">chat</span>
        <div class="fw-normal small">Enviar por WhatsApp</div>
      </div>
    </div>
  </div>
</div>
