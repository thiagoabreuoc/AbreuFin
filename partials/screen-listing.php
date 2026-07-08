<!-- ═══════════════ LISTING ═══════════════ -->
<div class="screen hidden" id="screen-listing">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 d-flex align-items-center justify-content-center" style="gap:16px">
      <span class="badge bg-success-subtle text-success fw-semibold" id="listing-title">Receitas</span>
      <span class="fw-semibold" style="font-size:0.95rem" id="listing-date">JAN 26</span>
      <button class="btn btn-link p-0 d-inline-flex align-items-center" style="color:var(--md-sys-color-primary)" onclick="openPeriodPicker()" aria-label="Alterar período">
        <span class="material-symbols-outlined" style="font-size:1.1rem;line-height:1">edit</span>
      </button>
    </div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body" style="padding:4px 16px 16px;position:relative">
    <div class="m3-tabs" id="listing-status-tabs" style="margin-bottom:16px">
      <!-- preenchido dinamicamente por openListing() -->
    </div>
    <div class="mb-3">
      <div class="text-center" style="position:relative">
        <button class="btn btn-link btn-sm fw-semibold text-primary p-0" type="button" data-bs-toggle="collapse" data-bs-target="#filter-panel" aria-expanded="false">
          <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">filter_alt</span> Mais filtros
          <span id="filter-count" style="display:none;background:var(--md-extended-color-aviso-color);color:var(--md-extended-color-aviso-on-color);border-radius:50%;width:18px;height:18px;font-size:0.7rem;font-weight:700;line-height:18px;text-align:center;vertical-align:middle;margin-left:4px">0</span>
        </button>
        <div class="collapse" id="filter-panel" style="position:absolute;left:0;right:0;z-index:100;top:100%">
          <div class="text-start" style="margin-top:8px;border-radius:var(--md-sys-shape-corner-medium);background:var(--md-sys-color-surface-container-high);box-shadow:var(--md-sys-elevation-level2);padding:12px 14px">
            <div class="form-box mb-0">
              <div class="form-box-lbl">Categoria</div>
              <select class="form-select form-select-borderless" id="f-cat" onchange="onFilterCatChange()"></select>
            </div>
            <div class="form-box mb-0 mt-2" id="f-subcat-label" style="opacity:0.45">
              <div class="form-box-lbl">Sub-categoria</div>
              <select class="form-select form-select-borderless" id="f-subcat" onchange="applyFilter()"></select>
            </div>
            <div class="form-box mb-0 mt-2" id="f-repeat-label" style="opacity:0.45">
              <div class="form-box-lbl">Repetir a cada</div>
              <select class="form-select form-select-borderless" id="f-repeat" onchange="applyFilter()"></select>
            </div>
            <div class="text-center mt-3">
              <button class="btn btn-link btn-sm fw-semibold text-primary p-0" type="button" onclick="clearListingFilter()">Limpar filtros</button>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top:16px;display:flex;justify-content:center;align-items:center;gap:16px">
        <a href="#" id="sort-btn-desc"      class="text-primary  text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('valor','desc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_upward</span><span class="material-symbols-outlined" style="font-size:.9rem">attach_money</span></a>
        <a href="#" id="sort-btn-asc"       class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('valor','asc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_downward</span><span class="material-symbols-outlined" style="font-size:.9rem">attach_money</span></a>
        <span class="text-secondary" style="opacity:.35;font-size:.75rem;user-select:none">|</span>
        <a href="#" id="sort-btn-date-desc" class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('data','desc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_upward</span><span class="material-symbols-outlined" style="font-size:.9rem">calendar_today</span></a>
        <a href="#" id="sort-btn-date-asc"  class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('data','asc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_downward</span><span class="material-symbols-outlined" style="font-size:.9rem">calendar_today</span></a>
      </div>
    </div>
    <ul class="list-group" id="listing-entries" style="display:flex;flex-direction:column;gap:8px;padding-bottom:72px"></ul>
  </div>
</div>
