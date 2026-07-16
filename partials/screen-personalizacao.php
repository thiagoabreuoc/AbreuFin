<!-- ═══════════════ PERSONALIZAÇÃO ═══════════════ -->
<div class="screen hidden" id="screen-personalizacao">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Personalização</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">
    <div class="list-group cat-row-list">
      <div class="list-group-item cat-row-card">
        <div class="mb-2 text-secondary small fw-semibold">Tema</div>
        <div class="d-flex gap-2">
          <button class="badge status-cell status-cell-white d-inline-flex align-items-center justify-content-center gap-1" id="theme-mode-light" style="flex:1;padding:10px!important" onclick="toggleTheme(false)">
            <span class="material-symbols-outlined" style="font-size:1.1rem">light_mode</span> Tema claro
          </button>
          <button class="badge status-cell status-cell-white d-inline-flex align-items-center justify-content-center gap-1" id="theme-mode-dark" style="flex:1;padding:10px!important" onclick="toggleTheme(true)">
            <span class="material-symbols-outlined" style="font-size:1.1rem">dark_mode</span> Tema escuro
          </button>
        </div>
      </div>
      <div class="list-group-item cat-row-card">
        <div class="mb-2 text-secondary small fw-semibold">Cor do tema</div>
        <div class="theme-carousel" id="theme-carousel" onscroll="onThemeCarouselScroll()"></div>
      </div>
    </div>
  </div>
</div>
