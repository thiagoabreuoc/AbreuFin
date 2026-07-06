/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
function showToast(msg, type='') {
  const t = document.getElementById('toast');
  document.getElementById('toast-body').textContent = msg;
  t.classList.remove('bg-success','bg-danger','bg-dark');
  t.classList.add(type==='success' ? 'bg-success' : type==='error' ? 'bg-danger' : 'bg-dark');
  bootstrap.Toast.getOrCreateInstance(t).show();
}
