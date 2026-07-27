/* ═══════════════════════════════════════
   ADMIN STATS (só visível pra thiagoabreuoc@gmail.com — a checagem de
   verdade é sempre no servidor, api/admin_stats.php; o menu escondido
   no front é só conveniência de UI)
═══════════════════════════════════════ */
function adminStatCardHtml(icon, label, value) {
  return `<div class="list-group-item cat-row-card d-flex align-items-center gap-3">
    <span class="material-symbols-outlined text-primary" style="font-size:1.5rem">${icon}</span>
    <div class="flex-grow-1">
      <div class="text-secondary small">${label}</div>
      <div class="fw-bold" style="font-size:1.3rem">${value}</div>
    </div>
  </div>`;
}

async function openAdminStats() {
  showScreen('admin-stats');
  const el = document.getElementById('admin-stats-body');
  el.innerHTML = '<div class="text-center text-secondary small py-4">Carregando...</div>';
  try {
    const data = await apiAdminStats();
    el.innerHTML =
      adminStatCardHtml('group', 'Contas cadastradas', data.totalUsers) +
      adminStatCardHtml('install_mobile', 'Vezes que o app foi baixado', data.totalInstalls) +
      adminStatCardHtml('qr_code_2', 'Pessoas que copiaram a chave Pix', data.totalPixCopies);
  } catch (e) {
    el.innerHTML = `<div class="text-center text-danger small py-4">${escapeHtml(e.message)}</div>`;
  }
}
