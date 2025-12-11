// page : login.html
// rôle : gestion de la connexion utilisateur
// affiche des messages d'erreur / succès
// récupère la raison de redirection (?reason=admin)
// appelle l'api /api/auth/login
// stocke token + user dans Session
// redirige en fonction du rôle (admin ou user)
// affiche un message au-dessus du formulaire de login
function setLoginMessage(text, type) {
  const el = document.getElementById('form-message');
  if (!el) return;

  el.textContent = text || '';
  el.classList.remove('success', 'error');

  if (type === 'success') el.classList.add('success');
  if (type === 'error') el.classList.add('error');
}

// récupère la valeur d'un paramètre dans l'url (ex : ?reason=admin)
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  // si on arrive ici depuis une tentative d'accès admin
  const reason = getQueryParam('reason');
  if (reason === 'admin') {
    setLoginMessage('Admin access required. Log in with an administrator account.', 'error');
  }

  // si déjà connecté -> redirection immédiate selon le rôle
  if (Session.isLoggedIn()) {
    const user = Session.getUser();
    if (user && user.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'index.html';
    }
    return;
  }

  // soumission du formulaire de login
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // efface le message précédent
    setLoginMessage('', null);

    const username = document.getElementById('username')?.value?.trim();
    const password = document.getElementById('password')?.value;

    if (!username || !password) {
      setLoginMessage('Please fill in all fields.', 'error');
      return;
    }

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setLoginMessage(data.message || 'Incorrect credentials.', 'error');
        return;
      }

      if (!data.token || !data.user || !data.user.role) {
        setLoginMessage('Connection failed: incomplete server response.', 'error');
        return;
      }

      // enregistre la session via Session (token + infos user)
      Session.setToken(data.token);
      Session.setUser(data.user);

      setLoginMessage('Connection successful. Redirecting...', 'success');

      // redirige rapidement après succès
      setTimeout(() => {
        if (data.user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 300);

    } catch (err) {
      console.error(err);
      setLoginMessage('Network error. Check that the server is running properly.', 'error');
    }
  });
});