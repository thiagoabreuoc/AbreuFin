<!-- ═══════════════ LISTING ═══════════════ -->
<div class="screen hidden" id="screen-listing">
  <div class="d-flex align-items-center p-3 flex-shrink-0 app-header-gradient">
    <button class="btn btn-link text-dark p-0" onclick="goBack()" aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 d-flex flex-column align-items-center" style="gap:8px;min-width:0">
      <span class="badge bg-success-subtle text-success fw-semibold" id="listing-title">Receitas</span>
      <div class="d-flex align-items-center justify-content-center" style="gap:6px;min-width:0">
        <span class="fw-semibold text-truncate" style="font-size:0.95rem" id="listing-date">JAN 26</span>
        <button class="btn btn-link btn-sm fw-semibold text-primary p-0 flex-shrink-0" onclick="openPeriodPicker()" aria-label="Alterar período">
          <span class="material-symbols-outlined" style="font-size:1.2rem;vertical-align:-4px">edit_calendar</span>
        </button>
      </div>
    </div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body app-body-rounded" style="padding:16px 16px 16px">
    <div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-bottom:28px" id="listing-status-tabs">
      <!-- preenchido dinamicamente por openListing() -->
    </div>
    <div class="mb-2" id="listing-filter-sort-row" style="display:flex;justify-content:space-between;align-items:center;gap:16px;padding-left:8px;padding-right:8px">
      <button class="btn btn-link text-primary p-0 d-inline-flex align-items-center" type="button" onclick="openFilterPanel()" aria-label="Mais filtros">
        <span class="material-symbols-outlined" style="font-size:1.4rem">filter_alt</span><span id="filter-count" class="m3-badge-large" style="display:none">0</span>
      </button>
      <div style="display:flex;align-items:center;gap:16px">
        <a href="#" id="sort-btn-valor" class="text-primary text-decoration-none d-inline-flex align-items-center gap-1" onclick="toggleSort('valor');return false;" aria-label="Ordenar por valor"><span class="material-symbols-outlined" id="sort-valor-arrow" style="font-size:.8rem">arrow_upward</span><span class="material-symbols-outlined" style="font-size:.9rem">attach_money</span></a>
        <span class="text-secondary" style="opacity:.6;font-size:.9rem;user-select:none">|</span>
        <a href="#" id="sort-btn-data" class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="toggleSort('data');return false;" aria-label="Ordenar por data"><span class="material-symbols-outlined" id="sort-data-arrow" style="font-size:.8rem">arrow_upward</span><span class="material-symbols-outlined" style="font-size:.9rem">calendar_today</span></a>
        <span class="text-secondary" id="sort-urgency-sep" style="opacity:.6;font-size:.9rem;user-select:none">|</span>
        <div style="display:flex;align-items:center;gap:24px">
          <a href="#" id="sort-btn-vencido" class="text-decoration-none d-inline-flex align-items-center" onclick="sortEntries('vencido','asc');return false;" aria-label="Ordenar por vencidos"><span class="m3-badge-small m3-badge-small-error"></span></a>
          <a href="#" id="sort-btn-vencendo" class="text-decoration-none d-inline-flex align-items-center" onclick="sortEntries('vencendo','asc');return false;" aria-label="Ordenar por a vencer"><span class="m3-badge-small m3-badge-small-warning"></span></a>
          <a href="#" id="sort-btn-neutro" class="text-decoration-none d-inline-flex align-items-center" onclick="sortEntries('neutro','asc');return false;" aria-label="Ordenar por sem vencimento próximo"><span class="m3-badge-small m3-badge-small-neutral"></span></a>
        </div>
      </div>
    </div>
    <div class="text-center" id="listing-totals" style="padding:6px 0 14px"></div>
    <div id="listing-table-header" style="display:none">
      <div>Descrição</div>
      <div>Categoria</div>
      <div>Recorrência</div>
      <div>Status</div>
      <div>Valor</div>
      <div>Data</div>
    </div>
    <ul class="list-group" id="listing-entries" style="display:flex;flex-direction:column;gap:8px;padding-bottom:72px"></ul>
  </div>
</div>
