<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/lib/webpush.php';
startSession();
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
$resetToken = isset($_GET['reset']) ? preg_replace('/[^a-f0-9]/', '', $_GET['reset']) : '';
$googleError = isset($_GET['google_error']) ? preg_replace('/[^a-z_]/', '', $_GET['google_error']) : '';
$csrfToken = csrfToken();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>AbreuFin</title>
<script>
(function() {
  var saved = localStorage.getItem('theme');
  var theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/flatly/bootstrap.min.css">
<link rel="stylesheet" href="css/material3-tokens.css?v=<?= filemtime(__DIR__.'/css/material3-tokens.css') ?>">
<link rel="stylesheet" href="css/design-system.css?v=<?= filemtime(__DIR__.'/css/design-system.css') ?>">
<link rel="stylesheet" href="css/style.css?v=<?= filemtime(__DIR__.'/css/style.css') ?>">
</head>
<body>
<div class="app" id="app">

  <!-- ── Conteúdo principal ── -->
  <div class="app-content" id="app-content">

    <?php include 'partials/screen-login.php'; ?>
    <?php include 'partials/screen-register.php'; ?>
    <?php include 'partials/screen-forgot.php'; ?>
    <?php include 'partials/screen-reset.php'; ?>
    <?php include 'partials/screen-change-password.php'; ?>
    <?php include 'partials/screen-home.php'; ?>
    <?php include 'partials/screen-listing.php'; ?>
    <?php include 'partials/screen-vencendo.php'; ?>
    <?php include 'partials/screen-form.php'; ?>
    <?php include 'partials/screen-cats.php'; ?>
    <?php include 'partials/screen-profile.php'; ?>
    <?php include 'partials/screen-personalizacao.php'; ?>
    <?php include 'partials/screen-export.php'; ?>
    <?php include 'partials/screen-notifications.php'; ?>
    <?php include 'partials/screen-privacy.php'; ?>
    <?php include 'partials/modal.php'; ?>
    <?php include 'partials/toast.php'; ?>

    <!-- Period Picker dropdown card -->
    <div class="sheet-overlay" id="period-overlay" onclick="closePeriodPicker()"></div>
    <div class="sheet-card" id="period-sheet">
      <div class="text-center py-3" style="position:relative">
        <span class="fw-semibold">Alteração de período</span>
        <button class="btn btn-link text-secondary p-0" onclick="closePeriodPicker()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%)"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
      </div>
      <div class="m3-tabs" id="period-year-strip" style="margin:0 16px 0"></div>
      <div class="pb-4" style="display:grid;grid-template-columns:repeat(5,auto);justify-content:center;gap:8px;margin-top:16px;padding-left:16px;padding-right:16px" id="period-month-grid"></div>
    </div>

    <!-- Filtros dropdown card -->
    <div class="sheet-overlay" id="filter-overlay" onclick="closeFilterPanel()"></div>
    <div class="sheet-card" id="filter-sheet">
      <div class="text-center py-3" style="position:relative">
        <span class="fw-semibold">Mais filtros</span>
        <button class="btn btn-link text-secondary p-0" onclick="closeFilterPanel()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%)"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
      </div>
      <div style="padding:0 16px 16px">
        <div class="form-box mb-0">
          <div class="form-box-lbl">Categoria</div>
          <select class="form-select form-select-borderless" id="f-cat" onchange="onFilterCatChange()"></select>
        </div>
        <div class="form-box mb-0 mt-2" id="f-subcat-label" style="opacity:0.45">
          <div class="form-box-lbl">Sub-categoria</div>
          <select class="form-select form-select-borderless" id="f-subcat" onchange="applyFilter()"></select>
        </div>
        <div class="form-box mb-0 mt-2" id="f-repeat-label">
          <div class="form-box-lbl">Repetir a cada</div>
          <select class="form-select form-select-borderless" id="f-repeat" onchange="applyFilter()"></select>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <button class="btn btn-link btn-sm fw-semibold text-primary p-0" type="button" onclick="clearListingFilter();closeFilterPanel()">
            <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">filter_alt_off</span> Limpar filtros
          </button>
          <button class="btn btn-primary btn-sm" type="button" onclick="applyFilter();closeFilterPanel()">Aplicar filtro</button>
        </div>
      </div>
    </div>

    <!-- FAB Menu — https://m3.material.io/components/fab-menu/overview -->
    <div class="fab-scrim" id="fab-scrim" onclick="closeFabMenu()"></div>
    <div id="btn-novo-wrap" style="position:absolute;bottom:0;left:0;right:0;padding:20px 20px 28px;background:linear-gradient(to bottom, transparent, var(--md-sys-color-surface));display:none;justify-content:center;pointer-events:none;z-index:210">
      <div style="position:relative">
        <div class="fab-item-list" id="fab-item-list">
          <button class="fab-item fab-item-receita" onclick="selectFabAction('receita')"><span class="material-symbols-outlined">arrow_upward</span>Receita</button>
          <button class="fab-item" onclick="selectFabAction('despesa')"><span class="material-symbols-outlined">arrow_downward</span>Despesa</button>
          <button class="fab-item" onclick="selectFabAction('investimento')"><span class="material-symbols-outlined">trending_up</span>Investimento</button>
        </div>
        <button class="fab-main-btn" onclick="toggleFabMenu()" id="fab-main" aria-label="Novo lançamento" aria-haspopup="true" aria-expanded="false" style="pointer-events:auto">
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>

  </div><!-- /.app-content -->

  <!-- Drawer — mobile only -->
  <div id="drawer-overlay" onclick="closeDrawer()"></div>
  <div id="drawer">
    <div class="drawer-header">
      <span class="fw-bold fs-5 text-primary">AbreuFin</span>
      <button class="btn btn-link text-secondary p-0" onclick="closeDrawer()"><span class="material-symbols-outlined">close</span></button>
    </div>
    <a href="#" class="drawer-item" onclick="openListing('receita');closeDrawer();return false;"><span class="material-symbols-outlined">arrow_downward</span>Receitas</a>
    <a href="#" class="drawer-item" onclick="openListing('despesa');closeDrawer();return false;"><span class="material-symbols-outlined">arrow_upward</span>Despesas</a>
    <a href="#" class="drawer-item" onclick="openListing('investimento');closeDrawer();return false;"><span class="material-symbols-outlined">trending_up</span>Investimentos</a>
  </div>

</div><!-- /.app -->

<!-- custom searchable select (shared panel, outside .app to avoid stacking context) -->
<div class="cs-backdrop" id="cs-backdrop" onclick="csClose()"></div>
<div class="cs-panel" id="cs-panel">
  <div class="cs-header">
    <input class="cs-search" id="cs-search" type="text" inputmode="text" autocomplete="off"
           placeholder="Buscar..." oninput="csFilter(this.value)">
  </div>
  <div class="cs-list" id="cs-list"></div>
</div>

<script>
window.__RESET_TOKEN__ = <?= json_encode($resetToken) ?>;
window.__GOOGLE_ERROR__ = <?= json_encode($googleError) ?>;
window.__CSRF_TOKEN__ = <?= json_encode($csrfToken) ?>;
window.__VAPID_PUBLIC_KEY__ = <?= json_encode(wpVapidPublicKey()) ?>;
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<?php
$jsFiles = ['data','ripple','api','navigation','auth','account','theme','toast','home','listing','vencendo','form','categories','profile','notifications','export','main'];
foreach ($jsFiles as $f):
  $v = filemtime(__DIR__."/js/{$f}.js");
?>
<script src="js/<?= $f ?>.js?v=<?= $v ?>"></script>
<?php endforeach; ?>
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function(e) {
    console.warn('SW registration failed:', e);
  });
}
</script>
</body>
</html>
