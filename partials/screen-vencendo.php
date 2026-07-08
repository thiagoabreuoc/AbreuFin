<!-- ═══════════════ VENCENDO ═══════════════ -->
<div class="screen hidden" id="screen-vencendo">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center">
      <span class="badge fw-semibold" id="vencendo-badge">Despesas vencendo</span>
      <div class="fw-semibold mt-1" style="font-size:0.95rem" id="vencendo-subtitle">Em 3 dias</div>
    </div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body" style="padding:24px 16px 16px;position:relative">
    <div style="margin-top:0;display:flex;justify-content:center;align-items:center;gap:16px;margin-bottom:16px">
      <a href="#" id="vsort-btn-desc"      class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortVend('valor','desc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_upward</span><span class="material-symbols-outlined" style="font-size:.9rem">attach_money</span></a>
      <a href="#" id="vsort-btn-asc"       class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortVend('valor','asc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_downward</span><span class="material-symbols-outlined" style="font-size:.9rem">attach_money</span></a>
      <span class="text-secondary" style="opacity:.35;font-size:.75rem;user-select:none">|</span>
      <a href="#" id="vsort-btn-date-desc" class="text-secondary text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortVend('data','desc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_upward</span><span class="material-symbols-outlined" style="font-size:.9rem">calendar_today</span></a>
      <a href="#" id="vsort-btn-date-asc"  class="text-primary  text-decoration-none d-inline-flex align-items-center gap-1" onclick="sortVend('data','asc');return false;"><span class="material-symbols-outlined" style="font-size:.8rem">arrow_downward</span><span class="material-symbols-outlined" style="font-size:.9rem">calendar_today</span></a>
    </div>
    <ul class="list-group" id="vencendo-entries" style="display:flex;flex-direction:column;gap:8px;padding-bottom:72px"></ul>
  </div>
</div>
