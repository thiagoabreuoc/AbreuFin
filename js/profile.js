/* ═══════════════════════════════════════
   PROFILE
═══════════════════════════════════════ */
function renderProfile() {}

/* ── Apoie o projeto (doação via Pix) ── */
const DOAR_PIX_KEY = '21975745997';

function copyPixKey() {
  const label = document.getElementById('doar-copy-btn-label');
  const restore = () => { label.textContent = 'Copiar chave Pix'; };
  navigator.clipboard.writeText(DOAR_PIX_KEY).then(() => {
    showToast('Chave Pix copiada!', 'success');
    label.textContent = 'Copiado!';
    setTimeout(restore, 2000);
    if (typeof apiTrackEvent === 'function') apiTrackEvent('pix_copy').catch(() => {});
  }).catch(() => {
    showToast('Não foi possível copiar a chave. Copie manualmente: ' + DOAR_PIX_KEY, 'error');
  });
}
