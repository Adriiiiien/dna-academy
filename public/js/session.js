// gère la session côté front :
// stockage du token et de l'utilisateur dans localStorage
// helpers : est connecté ? est admin ?
// vérification du token auprès de /api/auth/me
// évite les appels multiples grâce à une promesse partagée
// objet simple pour regrouper toute la logique de session
const Session = {
  // récupère l'utilisateur stocké dans localStorage (ou null)
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  },

  // sauvegarde l'utilisateur dans localStorage
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // récupère le token jwt (ou null)
  getToken() {
    return localStorage.getItem('token');
  },

  // enregistre un nouveau token jwt
  setToken(token) {
    localStorage.setItem('token', token);
  },

  // supprime toutes les infos liées à la session
  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // indique si quelqu'un est connecté (token + user + rôle présents)
  isLoggedIn() {
    const token = this.getToken();
    const user = this.getUser();
    return Boolean(token && user && user.role);
  },

  // indique si l'utilisateur connecté est admin
  isAdmin() {
    const token = this.getToken();
    const user = this.getUser();
    return Boolean(token && user && user.role === 'admin');
  }
};

// promesse utilisée pour ne vérifier le token qu'une seule fois
let sessionCheckPromise = null;

/*
 * vérifie si le token côté front est toujours valide côté back
 * - appelle /api/auth/me avec le token actuel
 * - si le token est invalide : supprime la session
 * - si valide : met à jour le user dans le localStorage
 * retourne une promesse booléenne (true = session ok, false = invalide)
 */
Session.ensureSessionValid = function () {
  // si on a déjà lancé la vérification, on réutilise la même promesse
  if (sessionCheckPromise) return sessionCheckPromise;

  const token = Session.getToken();
  if (!token) {
    sessionCheckPromise = Promise.resolve(false);
    return sessionCheckPromise;
  }

  sessionCheckPromise = fetch('/api/auth/me', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(async (resp) => {
      if (!resp.ok) {
        // token invalide ou expiré => on nettoie la session
        Session.clear();
        return false;
      }

      const data = await resp.json().catch(() => ({}));
      if (data && data.user) {
        // on synchronise les infos côté front (role, username, etc.)
        Session.setUser(data.user);
        return true;
      }

      Session.clear();
      return false;
    })
    .catch(() => {
      // si le serveur ne répond pas, on ne force pas le logout :
      // on considère que c'est un souci réseau temporaire
      return true;
    });

  return sessionCheckPromise;
};

// on expose l'objet Session dans window pour l'utiliser dans d'autres scripts
window.Session = Session;