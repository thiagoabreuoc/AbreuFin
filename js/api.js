/* ═══════════════════════════════════════
   API CLIENT
═══════════════════════════════════════ */
async function apiCall(url, method = 'GET', body = null) {
  const opts = { method, credentials: 'same-origin', headers: {} };
  if (method !== 'GET' && window.__CSRF_TOKEN__) {
    opts.headers['X-CSRF-Token'] = window.__CSRF_TOKEN__;
  }
  if (body !== null) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const raw = await res.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error(`Resposta inválida do servidor em ${url} (status ${res.status}).`, raw);
    throw new Error('Não foi possível falar com o servidor. Tente novamente em instantes.');
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || 'Algo deu errado. Tente novamente.');
  }
  return data;
}

const apiRegister = (name, email, password) => apiCall('api/register.php', 'POST', { name, email, password });
const apiLogin = (email, password, remember = false) => apiCall('api/login.php', 'POST', { email, password, remember });
const apiLogout = () => apiCall('api/logout.php', 'POST', {});
const apiBootstrap = () => apiCall('api/bootstrap.php');
const apiForgotPassword = (email) => apiCall('api/forgot_password.php', 'POST', { email });
const apiResetPassword = (token, password) => apiCall('api/reset_password.php', 'POST', { token, password });
const apiChangePassword = (currentPassword, newPassword) => apiCall('api/change_password.php', 'POST', { currentPassword, newPassword });
const apiCreateCategory = (tipo, name, emoji, groupId) => apiCall('api/categories.php', 'POST', { tipo, name, emoji, group_id: groupId || null });
const apiCreateGroup  = (tipo, name) => apiCall('api/category_groups.php', 'POST', { tipo, name });
const apiRenameGroup  = (id, name)   => apiCall('api/category_groups.php?id=' + id, 'PUT', { name });
const apiDeleteGroup  = (id)         => apiCall('api/category_groups.php?id=' + id, 'DELETE');
const apiUpdateCategory = (id, data) => apiCall(`api/categories.php?id=${id}`, 'PUT', data);
const apiDeleteCategory = (id) => apiCall(`api/categories.php?id=${id}`, 'DELETE');
const apiCreateEntry = (entry) => apiCall('api/entries.php', 'POST', entry);
const apiUpdateEntry = (id, entry) => apiCall(`api/entries.php?id=${id}`, 'PUT', entry);
const apiDeleteEntry = (id) => apiCall(`api/entries.php?id=${id}`, 'DELETE');
