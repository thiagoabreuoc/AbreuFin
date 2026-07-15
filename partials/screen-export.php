<!-- ═══════════════ EXPORT ═══════════════ -->
<div class="screen hidden" id="screen-export">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Exportar dados</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="list-group cat-row-list">
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportCSV()" style="cursor:pointer">
        <span class="material-symbols-outlined" style="font-size:1.75rem">table_chart</span>
        <div class="fw-medium">Exportar CSV</div>
      </div>
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportJSON()" style="cursor:pointer">
        <span class="material-symbols-outlined" style="font-size:1.75rem">code</span>
        <div class="fw-medium">Exportar JSON</div>
      </div>
      <div class="list-group-item cat-row-card d-flex align-items-center gap-3" onclick="exportTxt()" style="cursor:pointer">
        <span class="material-symbols-outlined" style="font-size:1.75rem">description</span>
        <div class="fw-medium">Relatório texto</div>
      </div>
    </div>
  </div>
</div>
