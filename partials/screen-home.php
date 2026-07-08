<!-- ═══════════════ HOME ═══════════════ -->
<div class="screen hidden" id="screen-home">
  <div class="d-flex align-items-center p-3 flex-shrink-0" style="gap:10px">
    <button class="btn btn-link text-dark p-0" id="hamburger-btn" onclick="openDrawer()" aria-label="Menu" style="width:32px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span class="material-symbols-outlined">menu</span></button>
    <div class="m3-appbar-pill flex-grow-1" onclick="navigate('home')">
      <span class="material-symbols-outlined">account_balance_wallet</span>
      <span>AbreuFin</span>
    </div>
    <div class="avatar-sm rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center overflow-hidden" id="home-nav-avatar" style="cursor:pointer;flex-shrink:0" onclick="navigate('profile')"><span class="material-symbols-outlined" style="font-size:1.1rem">person</span></div>
  </div>
  <div class="screen-body p-3" id="home-body">
    <div id="home-banners"></div>

    <div class="m3-tabs mb-3">
      <button class="m3-tab active" id="tab-anos" onclick="switchHomeTab('anos')">Anual</button>
      <button class="m3-tab" id="tab-meses" onclick="switchHomeTab('meses')">Mensal</button>
    </div>

    <div class="no-scrollbar" style="display:none;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;margin-left:8px;margin-right:8px;justify-content:center" id="year-strip"></div>
    <div class="no-scrollbar" style="display:none;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;margin-left:8px;margin-right:8px" id="month-strip"></div>

    <div id="home-summary"></div>

  </div>
</div>
