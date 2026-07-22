<!-- ═══════════════ APOIE O PROJETO (DOAÇÃO VIA PIX) ═══════════════ -->
<div class="screen hidden" id="screen-doar">
  <div class="d-flex align-items-center p-3 flex-shrink-0 app-header-gradient">
    <button class="btn btn-link text-dark p-0" onclick="goBack()" aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Apoie o projeto</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3 app-body-rounded">
    <div class="text-center" style="padding:8px 8px 20px">
      <span class="material-symbols-outlined text-primary" style="font-size:2.4rem">volunteer_activism</span>
      <p class="text-secondary small mt-2 mb-0">
        O AB Finanças é mantido de forma independente. Se ele te ajuda a organizar suas finanças, considere fazer uma doação via Pix para cobrir os custos de manutenção.
      </p>
    </div>

    <div class="card" id="doar-pix-card" style="border-radius:var(--md-sys-shape-corner-large)!important">
      <div class="card-body d-flex flex-column" style="gap:16px;padding:20px">
        <div class="d-flex align-items-start gap-2">
          <span class="material-symbols-outlined text-secondary" style="font-size:1.1rem;margin-top:1px">qr_code_2</span>
          <div>
            <div class="fw-semibold" style="font-size:.82rem">Chave Pix (Celular)</div>
            <div class="text-secondary small mt-1" id="doar-pix-key">(21) 97574-5997</div>
          </div>
        </div>
        <div class="d-flex align-items-start gap-2">
          <span class="material-symbols-outlined text-secondary" style="font-size:1.1rem;margin-top:1px">account_balance</span>
          <div>
            <div class="fw-semibold" style="font-size:.82rem">Banco</div>
            <div class="text-secondary small mt-1">Itaú</div>
          </div>
        </div>
        <div class="d-flex align-items-start gap-2">
          <span class="material-symbols-outlined text-secondary" style="font-size:1.1rem;margin-top:1px">person</span>
          <div>
            <div class="fw-semibold" style="font-size:.82rem">Titular</div>
            <div class="text-secondary small mt-1">Thiago Oliveira Chagas de Abreu</div>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-primary d-flex align-items-center justify-content-center gap-2 mt-3 mx-auto" id="doar-copy-btn" style="padding:10px 32px" onclick="copyPixKey()">
      <span class="material-symbols-outlined" style="font-size:1.2rem">content_copy</span>
      <span id="doar-copy-btn-label">Copiar chave Pix</span>
    </button>
  </div>
</div>
