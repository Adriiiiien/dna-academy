// page : register.html
// rôle : gestion de l'inscription utilisateur
// valide les champs (mot de passe, confirmation, longueur minimale)
// appelle l'api /api/auth/register
// affiche un message de succès ou d'erreur
// redirige vers login.html en cas de succès
// affiche un message au-dessus du formulaire d'inscription
function setRegisterMessage(text, type) {
  const el = document.getElementById('form-message');
  if (!el) return;

  el.textContent = text || '';
  el.classList.remove('success', 'error');

  if (type === 'success') el.classList.add('success');
  if (type === 'error') el.classList.add('error');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  if (!form) return;

  // si déjà connecté -> on renvoie à l'accueil
  if (Session.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setRegisterMessage('', null);

    const username = document.getElementById('username')?.value?.trim();
    const password = document.getElementById('password')?.value;
    const passwordConfirm = document.getElementById('passwordConfirm')?.value;

    // vérification des champs requis
    if (!username || !password || !passwordConfirm) {
      setRegisterMessage('Please fill in all fields.', 'error');
      return;
    }

    // mot de passe et confirmation identiques
    if (password !== passwordConfirm) {
      setRegisterMessage('The passwords do not match.', 'error');
      return;
    }

    // règle de longueur minimale
    if (password.length < 4) {
      setRegisterMessage('Password too short (minimum 4 characters).', 'error');
      return;
    }

    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setRegisterMessage(data.message || 'Unable to create the account.', 'error');
        return;
      }

      setRegisterMessage('Account created! You can now log in.', 'success');

      // petite pause avant la redirection vers la page de connexion
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 700);

    } catch (err) {
      console.error(err);
      setRegisterMessage('Network error. Check that the server is running properly.', 'error');
    }
  });
});