<!-- ═══════════════ HOME ═══════════════ -->
<div class="screen hidden" id="screen-home">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0" style="position:relative">
    <button class="btn btn-link text-dark p-0" id="hamburger-btn" onclick="openDrawer()" aria-label="Menu" style="width:32px;display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined">menu</span></button>
    <div class="flex-grow-1"></div>
    <button class="btn btn-link text-dark p-0 position-relative" id="notif-bell-btn" onclick="navigate('notif-center')" aria-label="Notificações" style="width:32px;display:flex;align-items:center;justify-content:center;margin-right:8px">
      <span class="material-symbols-outlined">notifications</span>
      <span class="m3-badge-small m3-badge-small-error position-absolute" id="notif-bell-dot" style="top:4px;right:4px;display:none"></span>
    </button>
    <div class="avatar-sm rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center overflow-hidden" id="home-nav-avatar" style="cursor:pointer" onclick="navigate('profile')"><span class="material-symbols-outlined" style="font-size:1.1rem">person</span></div>
    <div class="fw-bold fs-5 text-primary" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);cursor:pointer" onclick="navigate('home')">AbreuFin</div>
  </div>
  <div class="screen-body" id="home-body" style="padding:0 16px 16px">
    <div id="home-banners"></div>

    <div class="m3-tabs mb-3" style="margin-top:8px">
      <button class="m3-tab active" id="tab-anos" onclick="switchHomeTab('anos')">Anual</button>
      <button class="m3-tab" id="tab-meses" onclick="switchHomeTab('meses')">Mensal</button>
    </div>

    <div class="no-scrollbar" style="display:none;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;margin-left:8px;margin-right:8px;justify-content:center" id="year-strip"></div>
    <div class="no-scrollbar" style="display:none;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;margin-left:8px;margin-right:8px" id="month-strip"></div>

    <div id="home-summary"></div>

  </div>
</div>
