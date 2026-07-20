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
<title>AbreuFin — Controle financeiro pessoal</title>
<meta name="description" content="AbreuFin é um aplicativo de controle financeiro pessoal: gerencie receitas, despesas e investimentos em um só lugar, de forma simples e segura.">
<meta property="og:type" content="website">
<meta property="og:title" content="AbreuFin — Controle financeiro pessoal">
<meta property="og:description" content="Gerencie receitas, despesas e investimentos em um só lugar, de forma simples e segura.">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="AbreuFin — Controle financeiro pessoal">
<meta name="twitter:description" content="Gerencie receitas, despesas e investimentos em um só lugar, de forma simples e segura.">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<script>
(function() {
  var saved = localStorage.getItem('theme');
  var theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/flatly/bootstrap.min.css">
<link rel="stylesheet" href="css/material3-tokens.css?v=<?= filemtime(__DIR__.'/css/material3-tokens.css') ?>">
<link rel="stylesheet" href="css/style.css?v=<?= filemtime(__DIR__.'/css/style.css') ?>">
<link rel="stylesheet" href="css/responsive.css?v=<?= filemtime(__DIR__.'/css/responsive.css') ?>">
</head>
<body>
<div id="app-shell">
  <nav class="sidebar-desktop" id="sidebar-desktop">
    <div class="drawer-header"><span class="fw-bold fs-5 text-primary">AB</span></div>
    <a href="#" class="drawer-item" onclick="navigate('home');return false;"><span class="material-symbols-outlined">home</span><span class="drawer-item-label">Home</span></a>
    <a href="#" class="drawer-item" onclick="openListing('receita');return false;"><span class="material-symbols-outlined">arrow_upward</span><span class="drawer-item-label">Receitas</span></a>
    <a href="#" class="drawer-item" onclick="openListing('despesa');return false;"><span class="material-symbols-outlined">arrow_downward</span><span class="drawer-item-label">Despesas</span></a>
    <a href="#" class="drawer-item" onclick="openListing('investimento');return false;"><span class="material-symbols-outlined">trending_up</span><span class="drawer-item-label">Investimentos</span></a>
  </nav>
<div class="app" id="app">

  <div class="m3-linear-progress" id="app-loading-bar"></div>

  <!-- ── Conteúdo principal ── -->
  <div class="app-content" id="app-content">

    <?php include 'partials/screen-splash.php'; ?>
    <?php include 'partials/screen-welcome.php'; ?>
    <?php include 'partials/screen-login.php'; ?>
    <?php include 'partials/screen-register.php'; ?>
    <?php include 'partials/screen-forgot.php'; ?>
    <?php include 'partials/screen-reset.php'; ?>
    <?php include 'partials/screen-change-password.php'; ?>
    <?php include 'partials/screen-home.php'; ?>
    <?php include 'partials/screen-listing.php'; ?>
    <?php include 'partials/screen-vencendo.php'; ?>
    <?php include 'partials/screen-insights.php'; ?>
    <?php include 'partials/screen-notif-center.php'; ?>
    <?php include 'partials/screen-form.php'; ?>
    <?php include 'partials/screen-cats.php'; ?>
    <?php include 'partials/screen-cat-group.php'; ?>
    <?php include 'partials/screen-cat-detail.php'; ?>
    <?php include 'partials/screen-profile.php'; ?>
    <?php include 'partials/screen-account-data.php'; ?>
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
        <fieldset class="form-box mb-0">
          <legend class="form-box-lbl">Categoria</legend>
          <select class="form-select form-select-borderless" id="f-cat" onchange="onFilterCatChange()"></select>
        </fieldset>
        <fieldset class="form-box mb-0 mt-2" id="f-subcat-label" style="opacity:0.45">
          <legend class="form-box-lbl">Sub-categoria</legend>
          <select class="form-select form-select-borderless" id="f-subcat" onchange="applyFilter()"></select>
        </fieldset>
        <fieldset class="form-box mb-0 mt-2" id="f-repeat-label">
          <legend class="form-box-lbl">Repetir a cada</legend>
          <select class="form-select form-select-borderless" id="f-repeat" onchange="applyFilter()"></select>
        </fieldset>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <button class="btn btn-link btn-sm fw-semibold text-primary p-0" type="button" onclick="clearListingFilter();closeFilterPanel()">
            <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">filter_alt_off</span> Limpar filtros
          </button>
          <button class="btn btn-primary btn-sm" type="button" onclick="applyFilter();closeFilterPanel()" style="padding:10px 24px">Aplicar filtro</button>
        </div>
      </div>
    </div>

    <!-- Novo grupo (categorias) -->
    <div class="sheet-overlay" id="new-group-overlay" onclick="closeNewGroupModal()"></div>
    <div class="sheet-card" id="new-group-sheet">
      <div class="text-center py-3" style="position:relative">
        <span class="fw-semibold" id="new-group-modal-title">Novo grupo</span>
        <button class="btn btn-link text-secondary p-0" onclick="closeNewGroupModal()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%)"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
      </div>
      <div style="padding:0 16px 16px">
        <fieldset class="form-box mb-0">
          <legend class="form-box-lbl">Nome do grupo</legend>
          <input type="text" class="form-control form-control-borderless" id="new-group-input" placeholder="Ex: Bancos"
                 onkeydown="if(event.key==='Enter')saveNewGroup();if(event.key==='Escape')closeNewGroupModal()">
        </fieldset>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-outline-primary btn-sm" type="button" onclick="closeNewGroupModal()">Cancelar</button>
          <button class="btn btn-primary btn-sm" type="button" id="new-group-save-btn" onclick="saveNewGroup()" style="padding:10px 24px">Criar</button>
        </div>
      </div>
    </div>

    <!-- Nova/Editar categoria -->
    <div class="sheet-overlay" id="new-cat-overlay" onclick="closeNewCatModal()"></div>
    <div class="sheet-card" id="new-cat-sheet">
      <div class="text-center py-3" style="position:relative">
        <span class="fw-semibold" id="new-cat-modal-title">Nova categoria</span>
        <button class="btn btn-link text-secondary p-0" onclick="closeNewCatModal()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%)"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
      </div>
      <div style="padding:0 16px 16px">
        <fieldset class="form-box mb-0">
          <legend class="form-box-lbl">Nome da categoria</legend>
          <input type="text" class="form-control form-control-borderless" id="new-cat-input" placeholder="Ex: Itaú"
                 onkeydown="if(event.key==='Enter')saveNewCat();if(event.key==='Escape')closeNewCatModal()">
        </fieldset>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-outline-primary btn-sm" type="button" onclick="closeNewCatModal()">Cancelar</button>
          <button class="btn btn-primary btn-sm" type="button" id="new-cat-save-btn" onclick="saveNewCat()" style="padding:10px 24px">Criar</button>
        </div>
      </div>
    </div>

    <!-- Nova/Editar sub-categoria -->
    <div class="sheet-overlay" id="new-sub-overlay" onclick="closeNewSubModal()"></div>
    <div class="sheet-card" id="new-sub-sheet">
      <div class="text-center py-3" style="position:relative">
        <span class="fw-semibold" id="new-sub-modal-title">Nova sub-categoria</span>
        <button class="btn btn-link text-secondary p-0" onclick="closeNewSubModal()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%)"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
      </div>
      <div style="padding:0 16px 16px">
        <fieldset class="form-box mb-0">
          <legend class="form-box-lbl">Nome da sub-categoria</legend>
          <input type="text" class="form-control form-control-borderless" id="new-sub-input" placeholder="Ex: Cartão de crédito"
                 onkeydown="if(event.key==='Enter')saveNewSub();if(event.key==='Escape')closeNewSubModal()">
        </fieldset>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-outline-primary btn-sm" type="button" onclick="closeNewSubModal()">Cancelar</button>
          <button class="btn btn-primary btn-sm" type="button" id="new-sub-save-btn" onclick="saveNewSub()" style="padding:10px 24px">Criar</button>
        </div>
      </div>
    </div>

    <!-- Date Picker (M3) -->
    <div class="sheet-overlay" id="datepicker-overlay" onclick="closeDatePicker()"></div>
    <div class="sheet-card" id="datepicker-sheet">
      <div class="text-center py-3" style="position:relative">
        <span class="fw-semibold">Selecionar data</span>
        <button class="btn btn-link text-secondary p-0" onclick="closeDatePicker()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%)"><span class="material-symbols-outlined" style="font-size:1.1rem">close</span></button>
      </div>
      <div class="d-flex align-items-center justify-content-between" style="padding:0 8px">
        <button type="button" class="btn btn-link text-secondary p-0" onclick="dpChangeMonth(-1)" aria-label="Mês anterior"><span class="material-symbols-outlined">chevron_left</span></button>
        <span class="fw-semibold" id="dp-month-label" style="font-size:.95rem"></span>
        <button type="button" class="btn btn-link text-secondary p-0" onclick="dpChangeMonth(1)" aria-label="Próximo mês"><span class="material-symbols-outlined">chevron_right</span></button>
      </div>
      <div id="dp-weekdays" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;padding:12px 12px 4px;text-align:center"></div>
      <div id="dp-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;padding:0 12px 8px;text-align:center"></div>
      <div class="d-flex justify-content-end gap-2" style="padding:8px 16px 16px">
        <button class="btn btn-outline-primary btn-sm" type="button" onclick="closeDatePicker()">Cancelar</button>
        <button class="btn btn-primary btn-sm" type="button" onclick="dpConfirm()" style="padding:10px 24px">OK</button>
      </div>
    </div>

    <!-- FAB Menu — https://m3.material.io/components/fab-menu/overview -->
    <div class="fab-scrim" id="fab-scrim" onclick="closeFabMenu()"></div>
    <div id="btn-novo-wrap" style="position:absolute;bottom:0;left:0;right:0;padding:20px 20px 28px;background:linear-gradient(to bottom, transparent, var(--md-sys-color-surface));display:none;justify-content:center;pointer-events:none;z-index:100">
      <div style="position:relative">
        <div class="fab-item-list" id="fab-item-list">
          <button class="fab-item fab-item-receita" onclick="selectFabAction('receita')" aria-label="Receita"><span class="material-symbols-outlined">arrow_upward</span></button>
          <button class="fab-item fab-item-despesa" onclick="selectFabAction('despesa')" aria-label="Despesa"><span class="material-symbols-outlined">arrow_downward</span></button>
          <button class="fab-item fab-item-investimento" onclick="selectFabAction('investimento')" aria-label="Investimento"><span class="material-symbols-outlined">trending_up</span></button>
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
      <span class="fw-bold fs-5 text-primary">AB</span>
      <button class="btn btn-link text-secondary p-0" onclick="closeDrawer()"><span class="material-symbols-outlined">close</span></button>
    </div>
    <a href="#" class="drawer-item" onclick="navigate('home');closeDrawer();return false;"><span class="material-symbols-outlined">home</span>Home</a>
    <a href="#" class="drawer-item" onclick="openListing('receita');closeDrawer();return false;"><span class="material-symbols-outlined">arrow_downward</span>Receitas</a>
    <a href="#" class="drawer-item" onclick="openListing('despesa');closeDrawer();return false;"><span class="material-symbols-outlined">arrow_upward</span>Despesas</a>
    <a href="#" class="drawer-item" onclick="openListing('investimento');closeDrawer();return false;"><span class="material-symbols-outlined">trending_up</span>Investimentos</a>
  </div>

</div><!-- /.app -->
</div><!-- /#app-shell -->

<!-- custom searchable select (shared panel, outside .app to avoid stacking context) -->
<div class="cs-backdrop" id="cs-backdrop" onclick="csClose()"></div>
<div class="cs-panel" id="cs-panel">
  <div class="cs-header">
    <input class="cs-search" id="cs-search" type="text" inputmode="text" autocomplete="off"
           placeholder="Buscar..." oninput="csFilter(this.value)" onkeydown="csSearchKeydown(event)">
  </div>
  <div class="cs-list" id="cs-list" role="listbox"></div>
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
