<!-- ═══════════════ HOME ═══════════════ -->
<div class="screen hidden" id="screen-home">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" id="hamburger-btn" onclick="openDrawer()" aria-label="Menu" style="width:32px;display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined">menu</span></button>
    <div class="flex-grow-1 text-center fw-bold fs-5 text-primary" style="cursor:pointer" onclick="navigate('home')">AbreuFin</div>
    <div class="avatar-sm rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center overflow-hidden" id="home-nav-avatar" style="cursor:pointer" onclick="navigate('profile')"><span class="material-symbols-outlined" style="font-size:1.1rem">person</span></div>
  </div>
  <div class="screen-body p-3" id="home-body">
    <div id="home-banners"></div>

    <div class="m3-tabs mb-3">
      <button class="m3-tab active" id="tab-anos" onclick="switchHomeTab('anos')">Anual</button>
      <button class="m3-tab" id="tab-meses" onclick="switchHomeTab('meses')">Mensal</button>
    </div>

    <div class="no-scrollbar" style="display:none;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;justify-content:center" id="year-strip"></div>
    <div class="no-scrollbar" style="display:none;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;margin-left:8px;margin-right:8px" id="month-strip"></div>

    <div id="home-summary"></div>

  </div>
</div>
