/* ═══════════════════════════════════════
   RIPPLE (Material 3) — feedback tátil em
   .btn, .list-group-item e .cs-item, incluindo
   elementos injetados dinamicamente (delegação)
═══════════════════════════════════════ */
(function () {
  const SELECTOR = '.btn, .list-group-item, .profile-item, .cs-item, .fab-main-btn, .fab-item, .drawer-item, .m3-tab, button.status-cell, .dp-day';

  document.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const host = e.target.closest(SELECTOR);
    if (!host || host.disabled || host.classList.contains('disabled')) return;

    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const ripple = document.createElement('span');
    ripple.className = 'md-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    ripple.addEventListener('animationend', () => ripple.remove());
    host.appendChild(ripple);
  });
})();
