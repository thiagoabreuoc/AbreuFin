<!-- ═══════════════ LISTING ═══════════════ -->
<div class="screen hidden" id="screen-listing">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><i class="bi bi-chevron-left fs-4"></i></button>
    <div class="flex-grow-1 text-center">
      <span class="badge bg-success-subtle text-success fw-semibold" id="listing-title">Receitas</span>
      <div class="fw-semibold mt-1" style="font-size:0.95rem" id="listing-date">JAN 26</div>
      <button class="btn btn-link btn-sm fw-semibold text-primary p-0" style="font-size:0.75rem;margin-top:2px" onclick="openPeriodPicker()">Alterar período</button>
    </div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body" style="padding:24px 16px 16px;position:relative">
    <div class="no-scrollbar d-flex gap-2 overflow-auto pb-1 justify-content-center" id="listing-status-tabs" style="margin-bottom:16px">
      <!-- preenchido dinamicamente por openListing() -->
    </div>
    <div class="mb-3">
      <div class="text-center" style="position:relative">
        <button class="btn btn-link btn-sm fw-semibold text-primary p-0" type="button" data-bs-toggle="collapse" data-bs-target="#filter-panel" aria-expanded="false">
          <i class="bi bi-funnel"></i> Mais filtros
          <span id="filter-count" style="display:none;background:#f39c12;color:#fff;border-radius:50%;width:18px;height:18px;font-size:0.7rem;font-weight:700;line-height:18px;text-align:center;vertical-align:middle;margin-left:4px">0</span>
        </button>
        <div class="collapse" id="filter-panel" style="position:absolute;left:0;right:0;z-index:100;top:100%">
          <div class="bg-white border text-start" style="margin-top:8px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.08);padding:12px 14px">
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
        <a href="#" id="sort-btn-desc"      class="text-primary  text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('valor','desc');return false;"><i class="bi bi-arrow-up" style="font-size:0.65rem"></i><i class="bi bi-currency-dollar" style="font-size:0.75rem"></i></a>
        <a href="#" id="sort-btn-asc"       class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('valor','asc');return false;"><i class="bi bi-arrow-down" style="font-size:0.65rem"></i><i class="bi bi-currency-dollar" style="font-size:0.75rem"></i></a>
        <span class="text-secondary" style="opacity:.35;font-size:.75rem;user-select:none">|</span>
        <a href="#" id="sort-btn-date-desc" class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('data','desc');return false;"><i class="bi bi-arrow-up" style="font-size:0.65rem"></i><i class="bi bi-calendar3" style="font-size:0.75rem"></i></a>
        <a href="#" id="sort-btn-date-asc"  class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortEntries('data','asc');return false;"><i class="bi bi-arrow-down" style="font-size:0.65rem"></i><i class="bi bi-calendar3" style="font-size:0.75rem"></i></a>
      </div>
    </div>
    <ul class="list-group" id="listing-entries" style="display:flex;flex-direction:column;gap:8px;padding-bottom:72px"></ul>
  </div>
</div>
