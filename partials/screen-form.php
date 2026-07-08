<!-- ═══════════════ FORM ═══════════════ -->
<div class="screen hidden" id="screen-form">
  <div class="d-flex align-items-center p-3 border-bottom flex-shrink-0">
    <button class="btn btn-link text-dark p-0" onclick="formBack()"><span class="material-symbols-outlined">arrow_back</span></button>
    <div class="flex-grow-1 text-center fw-bold" id="form-title">Novo</div>
    <div style="width:24px"></div>
  </div>
  <div class="screen-body p-3">

    <!-- Tipo: tabs -->
    <div class="d-flex justify-content-center gap-2 mb-3">
      <button class="badge status-cell status-cell-receita" id="tab-tipo-receita"      onclick="setTipo('receita')"      >Receita</button>
      <button class="badge status-cell status-cell-despesa" id="tab-tipo-despesa"      onclick="setTipo('despesa')"      >Despesa</button>
      <button class="badge status-cell status-cell-investimento" id="tab-tipo-investimento" onclick="setTipo('investimento')" >Investimento</button>
    </div>
    <input type="hidden" id="f-tipo">

    <div id="form-fields">

    <!-- Categoria -->
    <fieldset class="form-box">
      <legend class="form-box-lbl">Categoria</legend>
      <select class="form-select form-select-borderless" id="f-categoria" onchange="onCatChange()"><option value="">Selecione</option></select>
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
        <input type="text" class="form-control" id="f-subcategoria-custom" placeholder="Descreva">
        <div class="form-check mt-2">
          <input class="form-check-input" type="checkbox" id="f-subcategoria-save" checked>
          <label class="form-check-label small text-secondary" for="f-subcategoria-save">Salvar na lista de sub-categorias</label>
        </div>
      </div>
    </fieldset>

    <!-- Valor -->
    <fieldset class="form-box">
      <legend class="form-box-lbl">Valor (R$)</legend>
      <input class="form-control form-control-borderless" type="text" inputmode="numeric" id="f-valor" placeholder="0,00" autocomplete="off" oninput="onValorInput(this)">
    </fieldset>

    <!-- Data -->
    <fieldset class="form-box">
      <legend class="form-box-lbl">Data de vencimento</legend>
      <div class="input-group" style="position:relative">
        <input type="text" class="form-control form-control-borderless" id="f-data" inputmode="numeric"
               maxlength="10" placeholder="DD/MM/AAAA" autocomplete="off"
               oninput="onDataInput(this)">
        <input type="date" id="f-date-picker"
               style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;pointer-events:none"
               onchange="onDatePickerChange()">
        <button type="button" class="btn btn-link text-secondary" onclick="openDatePicker()">
          <span class="material-symbols-outlined" style="font-size:1.25rem">calendar_today</span>
        </button>
      </div>
    </fieldset>
    <input type="hidden" id="f-dd">
    <input type="hidden" id="f-mm">
    <input type="hidden" id="f-yyyy">

    <!-- Repetir a cada -->
    <fieldset class="form-box">
      <legend class="form-box-lbl">Repetir a cada</legend>
      <div class="d-flex gap-2 flex-wrap" id="repetir-pills">
        <input type="radio" class="btn-check" name="f-repetir" id="repetir-none"      value=""          autocomplete="off" checked>
        <label class="btn btn-sm rounded-pill btn-outline-primary" for="repetir-none">Nunca</label>
        <input type="radio" class="btn-check" name="f-repetir" id="repetir-semanal"   value="semanal"   autocomplete="off">
        <label class="btn btn-sm rounded-pill btn-outline-primary" for="repetir-semanal">Semana</label>
        <input type="radio" class="btn-check" name="f-repetir" id="repetir-quinzenal" value="quinzenal" autocomplete="off">
        <label class="btn btn-sm rounded-pill btn-outline-primary" for="repetir-quinzenal">Quinzena</label>
        <input type="radio" class="btn-check" name="f-repetir" id="repetir-mensal"    value="mensal"    autocomplete="off">
        <label class="btn btn-sm rounded-pill btn-outline-primary" for="repetir-mensal">Mês</label>
      </div>
    </fieldset>

    <!-- Observação -->
    <fieldset class="form-box">
      <legend class="form-box-lbl">Observação</legend>
      <textarea class="form-control form-control-borderless" id="f-obs" style="height:72px" placeholder="Opcional"></textarea>
    </fieldset>

    <!-- Status -->
    <fieldset class="form-box">
      <legend class="form-box-lbl">Status</legend>
      <div class="d-flex gap-2 flex-wrap" id="status-pills">
        <span class="text-muted small">Selecione o tipo primeiro</span>
      </div>
    </fieldset>

    <div class="text-center mb-3" id="remove-row" style="display:none">
      <a href="#" class="text-danger small text-decoration-underline" onclick="confirmRemove();return false;">
        <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-2px">delete</span> Remover lançamento
      </a>
    </div>

    <div class="d-flex gap-2 mb-2" style="margin-top:40px">
      <button class="btn btn-outline-primary flex-fill" onclick="formBack()">Cancelar</button>
      <button class="btn btn-primary flex-fill" onclick="saveEntry()">Salvar</button>
    </div>

    </div><!-- /form-fields -->

  </div>
</div>
