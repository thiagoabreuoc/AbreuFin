<!-- ═══════════════ PERSONALIZAÇÃO ═══════════════ -->
<div class="screen hidden" id="screen-personalizacao">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Personalização</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="list-group">
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span>Tema escuro</span>
        <div class="form-check form-switch mb-0">
          <input class="form-check-input" type="checkbox" id="theme-toggle" role="switch" onchange="toggleTheme(this.checked)">
        </div>
      </div>
      <div class="list-group-item">
        <div class="mb-2">Cor do tema (Material 3)</div>
        <div class="d-flex gap-3">
          <button class="md-theme-swatch" data-theme-name="azul" style="background:#415F91" aria-label="Azul" onclick="applyMaterialTheme('azul')"></button>
          <button class="md-theme-swatch" data-theme-name="roxo" style="background:#65558f" aria-label="Roxo" onclick="applyMaterialTheme('roxo')"></button>
          <button class="md-theme-swatch" data-theme-name="oliva" style="background:#566238" aria-label="Oliva" onclick="applyMaterialTheme('oliva')"></button>
          <button class="md-theme-swatch" data-theme-name="marinho" style="background:#162839" aria-label="Marinho" onclick="applyMaterialTheme('marinho')"></button>
        </div>
      </div>
    </div>
  </div>
</div>
