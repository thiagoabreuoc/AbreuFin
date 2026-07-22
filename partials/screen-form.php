<!-- ═══════════════ FORM ═══════════════ -->
<div class="screen hidden" id="screen-form">
  <div class="d-flex align-items-center p-3 flex-shrink-0 app-header-gradient">
    <button class="btn btn-link text-dark p-0" onclick="formBack()" aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold" id="form-title">Novo</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3 app-body-rounded">

    <!-- Tipo: tabs -->
    <div class="d-flex justify-content-center gap-2" id="form-type-tabs" style="margin-bottom:28px">
      <button class="badge status-cell status-cell-white d-inline-flex align-items-center" style="gap:8px" id="tab-tipo-receita"      onclick="setTipo('receita')"      ><span class="material-symbols-outlined" style="font-size:1rem">arrow_upward</span>Receita</button>
      <button class="badge status-cell status-cell-white d-inline-flex align-items-center" style="gap:8px" id="tab-tipo-despesa"      onclick="setTipo('despesa')"      ><span class="material-symbols-outlined" style="font-size:1rem">arrow_downward</span>Despesa</button>
      <button class="badge status-cell status-cell-white d-inline-flex align-items-center" style="gap:8px" id="tab-tipo-investimento" onclick="setTipo('investimento')" ><span class="material-symbols-outlined" style="font-size:1rem">trending_up</span>Investimento</button>
    </div>
    <input type="hidden" id="f-tipo">

    <div id="form-fields">

    <!-- Categoria -->
    <fieldset class="form-box" id="fieldset-categoria">
      <legend class="form-box-lbl">Categoria</legend>
      <select class="form-select form-select-borderless" id="f-categoria" onchange="onCatChange()"><option value="">Selecione</option></select>
      <div class="text-secondary mt-1 d-none" id="f-categoria-group" style="opacity:.8;font-size:.7rem"></div>
      <div id="f-categoria-custom-wrap" style="display:none" class="mt-2">
        <input type="text" class="form-control" id="f-categoria-custom" placeholder="Digite a categoria">
        <div class="form-check mt-2">
          <input class="form-check-input" type="checkbox" id="f-categoria-save" checked>
          <label class="form-check-label small text-secondary" for="f-categoria-save">Salvar na lista de categorias</label>
        </div>
      </div>
    </fieldset>

    <!-- Sub-categoria (condicional) -->
    <fieldset class="form-box" id="subcategoria-wrap" style="display:none">
      <legend class="form-box-lbl">Sub-categoria</legend>
      <select class="form-select form-select-borderless" id="f-subcategoria" onchange="onSubCatChange()">
        <option value="">Selecione</option>
      </select>
      <div id="f-subcategoria-custom-wrap" style="display:none" class="mt-2">
        <input type="text" class="form-control" id="f-subcategoria-custom" placeholder="Digite a sub-categoria">
        <div class="form-check mt-2">
          <input class="form-check-input" type="checkbox" id="f-subcategoria-save" checked>
          <label class="form-check-label small text-secondary" for="f-subcategoria-save">Salvar na lista de sub-categorias</label>
        </div>
      </div>
    </fieldset>

    <!-- Valor + Data (lado a lado) -->
    <div class="d-flex gap-2 form-row-full" id="fieldset-valor-data">
      <fieldset class="form-box" style="flex:1;width:auto;min-width:0">
        <legend class="form-box-lbl">Valor (R$)</legend>
        <input class="form-control form-control-borderless" type="text" inputmode="numeric" id="f-valor" placeholder="0,00" autocomplete="off" oninput="onValorInput(this)">
      </fieldset>

      <fieldset class="form-box" style="flex:1;width:auto;min-width:0">
        <legend class="form-box-lbl">Data pagto.</legend>
        <div class="input-group" style="position:relative;display:flex;align-items:center">
          <input type="text" class="form-control form-control-borderless" id="f-data" inputmode="numeric"
                 maxlength="10" placeholder="DD/MM/AAAA" autocomplete="off"
                 oninput="onDataInput(this)">
          <button type="button" class="btn btn-link text-secondary p-0" onclick="openDatePicker()">
            <span class="material-symbols-outlined" style="font-size:1.25rem">calendar_today</span>
          </button>
        </div>
      </fieldset>
    </div>
    <input type="hidden" id="f-dd">
    <input type="hidden" id="f-mm">
    <input type="hidden" id="f-yyyy">

    <!-- Repetir a cada -->
    <fieldset class="form-box" id="fieldset-repetir">
      <legend class="form-box-lbl">Repetir a cada</legend>
      <div class="d-flex gap-2 flex-nowrap justify-content-between" id="repetir-pills">
        <div class="form-check form-check-inline m-0">
          <input class="form-check-input" type="radio" name="f-repetir" id="repetir-none" value="" autocomplete="off" checked onchange="onRepetirChange()">
          <label class="form-check-label small" for="repetir-none">Nunca</label>
        </div>
        <div class="form-check form-check-inline m-0">
          <input class="form-check-input" type="radio" name="f-repetir" id="repetir-semanal" value="semanal" autocomplete="off" onchange="onRepetirChange()">
          <label class="form-check-label small" for="repetir-semanal">Semana</label>
        </div>
        <div class="form-check form-check-inline m-0">
          <input class="form-check-input" type="radio" name="f-repetir" id="repetir-quinzenal" value="quinzenal" autocomplete="off" onchange="onRepetirChange()">
          <label class="form-check-label small" for="repetir-quinzenal">Quinzena</label>
        </div>
        <div class="form-check form-check-inline m-0">
          <input class="form-check-input" type="radio" name="f-repetir" id="repetir-mensal" value="mensal" autocomplete="off" onchange="onRepetirChange()">
          <label class="form-check-label small" for="repetir-mensal">Mês</label>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2 mt-3 d-none" id="repetir-count-wrap">
        <label class="small text-secondary mb-0" for="f-repetir-count">Repetir por</label>
        <input type="number" class="form-control form-control-sm text-center" id="f-repetir-count" min="1" max="60" value="3" style="width:60px">
        <span class="small text-secondary" id="repetir-count-unit">meses</span>
      </div>
    </fieldset>

    <!-- Observação -->
    <fieldset class="form-box form-row-full" id="fieldset-obs">
      <legend class="form-box-lbl">Observação</legend>
      <textarea class="form-control form-control-borderless" id="f-obs" style="height:72px" placeholder="Opcional"></textarea>
    </fieldset>

    <!-- Status -->
    <fieldset class="form-box" id="fieldset-status">
      <legend class="form-box-lbl">Status</legend>
      <div class="d-flex gap-2 flex-wrap" id="status-pills">
        <span class="text-muted small">Selecione o tipo primeiro</span>
      </div>
    </fieldset>

    <div class="text-center mb-3 form-row-full" id="remove-row" style="display:none;margin-top:24px">
      <a href="#" class="text-danger small text-decoration-none" onclick="confirmRemove();return false;">
        <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">delete</span> Remover
      </a>
    </div>

    <div class="d-flex gap-2 form-row-full" id="form-actions-row" style="margin-top:40px;margin-bottom:32px">
      <button class="btn btn-outline-primary flex-fill" style="padding-top:10px;padding-bottom:10px" onclick="formBack()">Cancelar</button>
      <button class="btn btn-primary flex-fill" id="save-entry-btn" style="padding-top:10px;padding-bottom:10px" onclick="saveEntry()">Salvar</button>
    </div>

    </div><!-- /form-fields -->

  </div>
</div>
