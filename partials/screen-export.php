<!-- ═══════════════ EXPORT ═══════════════ -->
<div class="screen hidden" id="screen-export">
  <div class="d-flex align-items-center p-3 border-bottom">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><i class="bi bi-chevron-left fs-4"></i></button>
    <div class="flex-grow-1 text-center fw-bold">Exportar dados</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="list-group">
      <div class="list-group-item d-flex align-items-center gap-3" onclick="exportCSV()" style="cursor:pointer">
        <i class="bi bi-filetype-csv fs-3 text-success"></i>
        <div class="flex-grow-1">
          <div class="fw-medium">Exportar CSV</div>
          <div class="text-muted small">Planilha compatível com Excel e Google Sheets</div>
        </div>
        <i class="bi bi-chevron-right text-secondary"></i>
      </div>
      <div class="list-group-item d-flex align-items-center gap-3" onclick="exportJSON()" style="cursor:pointer">
        <i class="bi bi-filetype-json fs-3 text-primary"></i>
        <div class="flex-grow-1">
          <div class="fw-medium">Exportar JSON</div>
          <div class="text-muted small">Backup completo para importar depois</div>
        </div>
        <i class="bi bi-chevron-right text-secondary"></i>
      </div>
      <div class="list-group-item d-flex align-items-center gap-3" onclick="exportTxt()" style="cursor:pointer">
        <i class="bi bi-file-text fs-3 text-warning"></i>
        <div class="flex-grow-1">
          <div class="fw-medium">Relatório texto</div>
          <div class="text-muted small">Resumo por mês para imposto de renda</div>
        </div>
        <i class="bi bi-chevron-right text-secondary"></i>
      </div>
    </div>
  </div>
</div>
