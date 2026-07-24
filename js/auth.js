/* ═══════════════════════════════════════
   AUTH
═══════════════════════════════════════ */
function applyCurrentUser(user) {
  currentUser = user;
  document.getElementById('profile-name').textContent  = user.name;
  document.getElementById('profile-email').textContent = user.email;

  const photo   = user.googlePhoto || '';
  const initial = user.name[0].toUpperCase();

  // Large avatar on profile screen
  const lg = document.getElementById('profile-avatar');
  if (lg) {
    if (photo) {
      lg.className = 'avatar-lg rounded-circle d-inline-flex align-items-center justify-content-center mb-2 overflow-hidden';
      const img = document.createElement('img');
      img.src = photo;
      img.alt = user.name;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover';
      lg.textContent = '';
      lg.appendChild(img);
    } else {
      lg.className = 'avatar-lg rounded-circle bg-primary-subtle text-primary fw-bold d-inline-flex align-items-center justify-content-center mb-2 overflow-hidden';
      lg.textContent = initial;
    }
  }

  // Small nav avatars (home header + profile header)
  ['home-nav-avatar', 'profile-nav-avatar'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (photo) {
      el.className = 'avatar-sm rounded-circle d-flex align-items-center justify-content-center overflow-hidden';
      el.style.background = '';
      var img = document.createElement('img');
      img.src = photo;
      img.alt = user.name;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover';
      el.textContent = '';
      el.appendChild(img);
    } else {
      el.className = 'avatar-sm rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center overflow-hidden';
      el.style.background = '';
      el.textContent = initial;
    }
  });

  updateGoogleBadge(user.viaGoogle);
}

function updateGoogleBadge(viaGoogle) {
  const badge = document.getElementById('profile-google-badge');
  if (!badge) return;
  badge.classList.toggle('d-none', !viaGoogle);
  badge.classList.toggle('d-inline-flex', viaGoogle);
}

async function refreshData() {
  setAppLoading(true);
  try {
    const data = await apiBootstrap();
    catGroups  = data.groups || { receita: [], despesa: [], investimento: [] };
    categories = data.categories;
    entries    = data.entries;
    insights   = data.insights || [];
    return data;
  } finally {
    setAppLoading(false);
  }
}

async function enterApp() {
  const data = await refreshData();
  if (!localStorage.getItem('ff_cats_reset_v5')) {
    ['receita','despesa','investimento'].forEach(t => localStorage.removeItem('ff_custom_subcats_' + t));
    localStorage.setItem('ff_cats_reset_v5', '1');
  }
  applyCurrentUser(data.user);
  screenStack = ['home'];
  showScreen('home', false);
  switchHomeTab('meses');
}

async function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const senha = document.getElementById('l-senha').value;
  const lembrar = document.getElementById('l-remember').checked;
  const err = document.getElementById('login-err');
  const btn = document.getElementById('login-submit-btn');
  err.textContent = '';
  if (!email || !email.includes('@')) { err.textContent = 'Informe um e-mail válido.'; return; }
  if (!senha) { err.textContent = 'Informe sua senha.'; return; }
  setBtnLoading(btn, true);
  try {
    await apiLogin(email, senha, lembrar);
    document.getElementById('l-senha').value = '';
    await enterApp();
  } catch (e) {
    err.textContent = e.message;
  } finally {
    setBtnLoading(btn, false);
  }
}

async function doRegister() {
  const name = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const senha = document.getElementById('r-senha').value;
  const senha2 = document.getElementById('r-senha2').value;
  const err = document.getElementById('register-err');
  const btn = document.getElementById('register-submit-btn');
  err.textContent = '';
  if (!name) { err.textContent = 'Informe seu nome.'; return; }
  if (!email || !email.includes('@')) { err.textContent = 'Informe um e-mail válido.'; return; }
  if (senha.length < 8) { err.textContent = 'A senha deve ter pelo menos 8 caracteres.'; return; }
  if (senha !== senha2) { err.textContent = 'As senhas não coincidem.'; return; }
  setBtnLoading(btn, true);
  try {
    await apiRegister(name, email, senha);
    document.getElementById('r-senha').value = '';
    document.getElementById('r-senha2').value = '';
    await enterApp();
  } catch (e) {
    err.textContent = e.message;
  } finally {
    setBtnLoading(btn, false);
  }
}

async function doLogout() {
  try { await apiLogout(); } catch (e) {}
  currentUser = null;
  catGroups   = { receita: [], despesa: [], investimento: [] };
  categories  = { receita: [], despesa: [], investimento: [] };
  entries = [];
  screenStack = ['welcome', 'login'];
  showScreen('login', false);
  document.getElementById('l-senha').value = '';
  document.getElementById('login-err').textContent = '';
}
