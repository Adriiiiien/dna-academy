// gère le chargement du header et du footer sur chaque page :
//  charge components/header.html et components/footer.html
//  met à jour les liens (login, register, admin, logout)
//  affiche le pseudo de l'utilisateur connecté
//  protège le lien admin dans le footer
//  applique les effets du header (scroll + menu mobile)
//  synchronise l'ui avec l'état réel de session (via Session.ensureSessionValid)
// met à jour le header en fonction de l'état de connexion
function initHeaderAuthUI() {
  const loginItem = document.getElementById('nav-login-item');
  const registerItem = document.getElementById('nav-register-item');
  const adminItem = document.getElementById('nav-admin-item');
  const logoutItem = document.getElementById('nav-logout-item');
  const logoutLink = document.getElementById('nav-logout-link');
  const usernameEl = document.getElementById('nav-username');

  const user = Session.getUser();
  const logged = Session.isLoggedIn();
  const admin = Session.isAdmin();

  // on affiche ou non les liens selon l'état de session
  if (loginItem) loginItem.style.display = logged ? 'none' : 'list-item';
  if (registerItem) registerItem.style.display = logged ? 'none' : 'list-item';
  if (adminItem) adminItem.style.display = admin ? 'list-item' : 'none';
  if (logoutItem) logoutItem.style.display = logged ? 'flex' : 'none';

  // pseudo de l'utilisateur loggé dans la nav
  if (usernameEl) {
    if (logged && user && user.username) {
      usernameEl.textContent = user.username;
      usernameEl.style.display = '';
    } else {
      usernameEl.textContent = '';
      usernameEl.style.display = 'none';
    }
  }

  // déconnexion depuis le header
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      Session.clear();
      window.location.href = 'index.html';
    });
  }
}

// cache ou affiche le lien admin dans le footer
function hideAdminLinkIfNeeded() {
  const adminLink = document.querySelector('.footer-admin-link');
  if (!adminLink) return;
  adminLink.style.display = Session.isAdmin() ? '' : 'none';
}

// protège le lien admin du footer : si pas admin, redirige vers login
function initAdminLinkGuard() {
  const adminLink = document.querySelector('.footer-admin-link');
  if (!adminLink) return;

  adminLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = Session.isAdmin()
      ? 'admin.html'
      : 'login.html?reason=admin';
  });
}

// charge le header html et initialise les effets + état de connexion
async function loadHeader() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (!headerPlaceholder) return;

  try {
    const response = await fetch('components/header.html');
    if (!response.ok) throw new Error('Network header error');

    // on injecte le html du header dans la page
    headerPlaceholder.innerHTML = await response.text();

    // effets visuels (scroll + burger mobile), fournis par headerEffects.js
    if (window.initScrollEffect) window.initScrollEffect();
    if (window.initMobileMenu) window.initMobileMenu();

    // lien actif dans la nav en fonction de la page actuelle
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const activeLink = document.querySelector(`.main-nav a[href="${currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');

    // 1) ui immédiate (avant même de vérifier le token côté serveur)
    initHeaderAuthUI();

    // 2) vérifie la session auprès du serveur, puis met à jour si besoin
    await Session.ensureSessionValid();
    initHeaderAuthUI();

  } catch (error) {
    console.error('Header loading error :', error);
  }
}

// charge le footer html et met à jour le lien admin
async function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;

  try {
    const response = await fetch('components/footer.html');
    if (!response.ok) return;

    // on injecte le html du footer
    footerPlaceholder.innerHTML = await response.text();

    // 1) ui immédiate selon l'état de session actuel (local)
    hideAdminLinkIfNeeded();
    initAdminLinkGuard();

    // 2) vérifie la session auprès du serveur, puis met à jour le footer
    await Session.ensureSessionValid();
    hideAdminLinkIfNeeded();

  } catch (error) {
    console.error('Footer loading error :', error);
  }
}

// au chargement de chaque page, on initialise la mise en page globale
document.addEventListener('DOMContentLoaded', () => {
  // on lance une vérification de session en arrière-plan (refresh token / user)
  Session.ensureSessionValid();

  // puis on charge le header et le footer dynamiques
  loadHeader();
  loadFooter();
});