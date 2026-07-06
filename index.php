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
<title>TF</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/flatly/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<link rel="stylesheet" href="css/style.css?v=<?= filemtime(__DIR__.'/css/style.css') ?>">
</head>
<body>
<div class="app" id="app">

  <!-- ── Sidebar (desktop only) ── -->
  <aside class="app-sidebar" id="app-sidebar">
    <div class="sidebar-brand">TF</div>
    <nav class="sidebar-nav">
      <a href="#" class="sidebar-item" id="snav-home" onclick="navigate('home');return false;">
        <i class="bi bi-house-fill"></i><span>Início</span>
      </a>
      <a href="#" class="sidebar-item" id="snav-receita" onclick="openListing('receita');return false;">
        <i class="bi bi-arrow-down-circle-fill"></i><span>Receitas</span>
      </a>
      <a href="#" class="sidebar-item" id="snav-despesa" onclick="openListing('despesa');return false;">
        <i class="bi bi-arrow-up-circle-fill"></i><span>Despesas</span>
      </a>
      <a href="#" class="sidebar-item" id="snav-investimento" onclick="openListing('investimento');return false;">
        <i class="bi bi-graph-up-arrow"></i><span>Investimentos</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <a href="#" class="sidebar-item" id="snav-profile" onclick="navigate('profile');return false;">
        <i class="bi bi-person-circle"></i><span>Perfil</span>
      </a>
    </div>
  </aside>

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
    <?php include 'partials/screen-export.php'; ?>
    <?php include 'partials/screen-notifications.php'; ?>
    <?php include 'partials/screen-privacy.php'; ?>
    <?php include 'partials/modal.php'; ?>
    <?php include 'partials/toast.php'; ?>

    <!-- Period Picker dropdown card -->
    <div id="period-overlay" onclick="closePeriodPicker()"></div>
    <div id="period-sheet">
      <div class="text-center py-3" style="position:relative">
        <span class="fw-semibold">Período</span>
        <button class="btn btn-link text-secondary p-0" onclick="closePeriodPicker()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%)"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="no-scrollbar d-flex gap-2 overflow-auto justify-content-center px-4 pb-3" id="period-year-strip"></div>
      <div class="text-center py-3" style="border-top:1px solid #f0f0f0">
        <span class="fw-semibold">Meses</span>
      </div>
      <div class="d-flex flex-wrap gap-2 justify-content-center px-4 pb-4" id="period-month-grid"></div>
    </div>

    <!-- Botão Novo -->
    <div id="btn-novo-wrap" style="position:absolute;bottom:0;left:0;right:0;padding:32px 0 24px;background:linear-gradient(to bottom, transparent, #fff);display:none;justify-content:center;align-items:flex-end;pointer-events:none;z-index:40">
      <button class="fab-main-btn" onclick="openNovo()" id="fab-main" aria-label="Novo lançamento" style="pointer-events:auto">
        <i class="bi bi-plus"></i>
      </button>
    </div>

  </div><!-- /.app-content -->

  <!-- Drawer — mobile only -->
  <div id="drawer-overlay" onclick="closeDrawer()"></div>
  <div id="drawer">
    <div class="drawer-header">
      <span class="fw-bold fs-5 text-primary">TF</span>
      <button class="btn btn-link text-secondary p-0" onclick="closeDrawer()"><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="drawer-section-label">Lançamentos</div>
    <a href="#" class="drawer-item" onclick="openListing('receita');closeDrawer();return false;">Receitas</a>
    <a href="#" class="drawer-item" onclick="openListing('despesa');closeDrawer();return false;">Despesas</a>
    <a href="#" class="drawer-item" onclick="openListing('investimento');closeDrawer();return false;">Investimentos</a>
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
$jsFiles = ['data','api','navigation','auth','account','toast','home','listing','vencendo','form','categories','profile','notifications','export','main'];
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
