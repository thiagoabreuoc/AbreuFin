/* ═══════════════════════════════════════
   NOTIFICATIONS — Web Push
═══════════════════════════════════════ */
function _notifB64ToUint8(str) {
  var pad = '='.repeat((4 - str.length % 4) % 4);
  var b64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
  var raw = window.atob(b64);
  var arr = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function _notifSetStatus(text, active, disabled, denied, unsupported) {
  var el = document.getElementById('notif-status-text');
  var tg = document.getElementById('notif-toggle');
  var dm = document.getElementById('notif-denied-msg');
  var um = document.getElementById('notif-unsupported-msg');
  if (el) el.textContent = text;
  if (tg) { tg.checked = !!active; tg.disabled = !!disabled; }
  if (dm) dm.style.display = denied ? 'block' : 'none';
  if (um) um.style.display = unsupported ? 'block' : 'none';
}

async function loadNotifSettings() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    _notifSetStatus('Não suportado neste navegador', false, true, false, true);
    return;
  }
  if (Notification.permission === 'denied') {
    _notifSetStatus('Permissão bloqueada', false, true, true, false);
    return;
  }
  try {
    var reg = await navigator.serviceWorker.ready;
    var sub = await reg.pushManager.getSubscription();
    if (sub) {
      _notifSetStatus('Ativa', true, false, false, false);
    } else {
      _notifSetStatus('Inativa', false, false, false, false);
    }
  } catch (e) {
    _notifSetStatus('Erro ao verificar', false, true, false, false);
  }
}

async function onNotifToggle() {
  var tg = document.getElementById('notif-toggle');
  if (tg.checked) {
    // Ativar: pedir permissão → subscrever → salvar no servidor
    tg.disabled = true;
    try {
      var perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        _notifSetStatus(
          perm === 'denied' ? 'Permissão bloqueada' : 'Permissão negada',
          false, perm === 'denied', perm === 'denied', false
        );
        return;
      }
      var reg = await navigator.serviceWorker.ready;
      var sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: _notifB64ToUint8(window.__VAPID_PUBLIC_KEY__),
      });
      var json = sub.toJSON();
      await apiCall('api/push_subscribe.php', 'POST', {
        endpoint: json.endpoint,
        p256dh:   json.keys.p256dh,
        auth:     json.keys.auth,
      });
      _notifSetStatus('Ativa', true, false, false, false);
      showToast('Notificações ativadas!', 'success');
    } catch (e) {
      _notifSetStatus('Inativa', false, false, false, false);
      showToast('Não foi possível ativar as notificações.', 'error');
    }
  } else {
    // Desativar: cancelar subscrição → remover do servidor
    tg.disabled = true;
    try {
      var reg = await navigator.serviceWorker.ready;
      var sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      await apiCall('api/push_subscribe.php', 'DELETE');
      _notifSetStatus('Inativa', false, false, false, false);
      showToast('Notificações desativadas.', 'success');
    } catch (e) {
      showToast('Erro ao desativar.', 'error');
      await loadNotifSettings();
    }
  }
}
