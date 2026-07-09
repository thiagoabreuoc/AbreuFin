<!-- ═══════════════ CATEGORIES ═══════════════ -->
<div class="screen hidden" id="screen-cats">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Categorias</div>
    <div style="width:24px"></div>
  </div>
  <div class="d-flex justify-content-center px-3 py-2 gap-2 border-bottom flex-shrink-0">
    <button class="badge status-cell status-cell-receita d-inline-flex align-items-center" style="gap:8px" id="cats-tab-receita"      onclick="switchCatsTab('receita')"      ><span class="material-symbols-outlined" style="font-size:1rem">arrow_upward</span>Receitas</button>
    <button class="badge status-cell status-cell-despesa d-inline-flex align-items-center" style="gap:8px" id="cats-tab-despesa"      onclick="switchCatsTab('despesa')"      ><span class="material-symbols-outlined" style="font-size:1rem">arrow_downward</span>Despesas</button>
    <button class="badge status-cell status-cell-investimento d-inline-flex align-items-center" style="gap:8px" id="cats-tab-investimento" onclick="switchCatsTab('investimento')" ><span class="material-symbols-outlined" style="font-size:1rem">trending_up</span>Investimentos</button>
  </div>
  <div class="screen-body p-3" id="cats-body">
    <!-- rendered by JS -->
  </div>
</div>
