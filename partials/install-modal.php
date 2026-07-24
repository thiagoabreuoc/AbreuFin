<!-- Modal "instale o app" — aparece 1x, após o 5º lançamento incluído -->
<div id="install-modal" onclick="if(event.target===this)dismissInstallModal()" style="position:absolute;inset:0;background:color-mix(in srgb, var(--md-sys-color-scrim) 45%, transparent);z-index:500;display:none;align-items:center;justify-content:center;padding:0 24px;opacity:0;transition:opacity .18s">
  <div style="position:relative;width:100%;max-width:300px;border-radius:var(--md-sys-shape-corner-large);overflow:hidden;box-shadow:var(--md-sys-elevation-level3);background:linear-gradient(135deg,#0f9b7e 0%,#4caf7d 100%);color:#fff;text-align:center;padding:28px 20px 24px">
    <button type="button" onclick="dismissInstallModal()" style="position:absolute;top:10px;right:10px;background:none;border:none;color:#fff;opacity:.85;line-height:0;padding:4px" aria-label="Fechar">
      <span class="material-symbols-outlined" style="font-size:1.3rem">close</span>
    </button>
    <img src="icons/logo-white.png" alt="AB" style="height:44px">
    <div class="fw-bold" style="font-size:1.05rem;margin-top:10px">Instale o app!</div>
    <p style="font-size:.82rem;margin:6px 0 18px;opacity:.95">Tenha o AB Finanças na tela inicial do seu Android ou iPhone.</p>
    <button type="button" class="btn fw-bold" style="background:#fff;color:#0f9b7e;border:none;border-radius:999px;padding:8px 24px;font-size:.85rem" onclick="dismissInstallModal();installApp();">Instalar</button>
  </div>
</div>
