<!-- Modal confirm -->
<div id="confirm-modal" onclick="if(event.target===this)hideConfirmModal()" style="position:absolute;inset:0;background:rgba(0,0,0,.45);z-index:500;display:none;align-items:center;justify-content:center;padding:0 24px;opacity:0;transition:opacity .18s">
  <div style="background:#fff;border-radius:14px;width:100%;max-width:320px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.2)">
    <div style="padding:24px 20px 12px;text-align:center">
      <h5 id="modal-title" style="margin:0 0 8px">Remover lançamento?</h5>
      <p class="text-secondary mb-0" id="modal-desc">Esta ação não pode ser desfeita.</p>
    </div>
    <div style="display:flex;gap:8px;padding:12px 16px 16px">
      <button type="button" class="btn btn-outline-primary flex-fill" onclick="hideConfirmModal()">Cancelar</button>
      <button type="button" class="btn btn-danger flex-fill" id="modal-confirm-btn">Remover</button>
    </div>
  </div>
</div>
