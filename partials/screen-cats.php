<!-- ═══════════════ CATEGORIES ═══════════════ -->
<div class="screen hidden" id="screen-cats">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold">Categorias</div>
    <div style="width:24px"></div>
  </div>
  <div class="d-flex justify-content-center px-3 py-2 gap-2 border-bottom flex-shrink-0">
    <button class="btn btn-sm rounded-pill btn-primary"            id="cats-tab-receita"      onclick="switchCatsTab('receita')"      style="border:none">Receitas</button>
    <button class="btn btn-sm rounded-pill bg-transparent text-primary" id="cats-tab-despesa"      onclick="switchCatsTab('despesa')"      style="border:none">Despesas</button>
    <button class="btn btn-sm rounded-pill bg-transparent text-primary" id="cats-tab-investimento" onclick="switchCatsTab('investimento')" style="border:none">Investimentos</button>
  </div>
  <div class="screen-body p-3" id="cats-body">
    <!-- rendered by JS -->
  </div>
</div>
