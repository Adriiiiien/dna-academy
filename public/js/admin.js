// page : admin.html
// rôle : gestion des personnages (crud) côté admin
// ce script permet à un administrateur de :
//  vérifier l'accès (token + rôle admin via Session)
//  lister tous les personnages (GET /api/characters)
//  créer un personnage (POST /api/characters)
//  modifier un personnage (PUT /api/characters/:id)
//  supprimer un personnage (DELETE /api/characters/:id)
//  basculer le formulaire entre mode création et mode édition
document.addEventListener('DOMContentLoaded', () => {

  const API_BASE = '/api';

  // références dom principales (formulaire + zone de messages + liste de gestion)
  const form = document.getElementById('add-character-form');
  const messageEl = document.getElementById('form-message');
  const listContainer = document.getElementById('management-list');

  const formTitle = document.querySelector('#admin-form-container h1');
  const submitButton = document.querySelector('.submit-btn');
  const idInput = document.getElementById('char-id');

  const logoutBtn = document.getElementById('logout-btn');

  // état local : liste de persos + état du formulaire (création/édition)
  let allCharacters = [];
  let isUpdateMode = false;
  let currentEditingId = null;

  // helpers d'auth front :
  // utilise l'objet global Session (défini dans session.js) pour gérer le token
  function getToken() {
    return Session.getToken();
  }

  function redirectToLogin() {
    // on précise au login qu'on voulait accéder à l'admin
    window.location.href = 'login.html?reason=admin';
  }

  // affiche un message au-dessus du formulaire (succès / erreur)
  function setMessage(text, type) {
    if (!messageEl) return;
    messageEl.textContent = text || '';
    messageEl.className = '';
    if (type === 'success') messageEl.className = 'success';
    if (type === 'error') messageEl.className = 'error';
  }

  // bouton "logout" en haut de la page admin : vide la session et renvoie au login
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Session.clear();
      window.location.href = 'login.html';
    });
  }

  // garde d'accès à la page admin :
  // on contrôle dès le chargement que l'utilisateur actuel est bien admin
  if (!Session.isAdmin()) {
    redirectToLogin();
    return;
  }

  // gestion centralisée des erreurs 401 / 403 sur les appels fetch protégés
  async function handleAuthErrors(response) {
    if (response.status === 401 || response.status === 403) {
      // token invalide / expiré / ou pas admin
      Session.clear();
      setMessage('Acces denied. Reconnect with an administrator account.', 'error');
      setTimeout(() => redirectToLogin(), 700);
      return true;
    }
    return false;
  }

  // soumission du formulaire :
  // mode création ou mode édition selon isUpdateMode
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('char-name').value;
      const element = document.getElementById('char-element').value;
      const image_icon_url = document.getElementById('char-icon-url').value;
      const image_card_url = document.getElementById('char-card-url').value;

      const token = getToken();
      if (!token) {
        redirectToLogin();
        return;
      }

      if (isUpdateMode) {
        // mise à jour d'un personnage existant (PUT /characters/:id)
        setMessage('Update is loading...', null);

        const updatedData = { name, element, image_icon_url, image_card_url };

        try {
          const response = await fetch(`${API_BASE}/characters/${currentEditingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
          });

          if (await handleAuthErrors(response)) return;

          if (response.ok) {
            setMessage('Character updated !', 'success');
            resetFormToCreateMode();
            loadCharacters();
          } else {
            const errorData = await response.json().catch(() => ({}));
            setMessage(`Erreur: ${errorData.message || 'Impossible to update.'}`, 'error');
          }
        } catch (err) {
          console.error('Erreur Fetch PUT:', err);
          setMessage('Error to connect with the server', 'error');
        }

      } else {
        // création d'un nouveau personnage (POST /characters)
        const id = idInput.value;
        const newCharacter = { id, name, element, image_icon_url, image_card_url };

        try {
          const response = await fetch(`${API_BASE}/characters`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newCharacter)
          });

          if (await handleAuthErrors(response)) return;

          if (response.ok) {
            setMessage('Character updated !', 'success');
            form.reset();
            loadCharacters();
          } else {
            const errorData = await response.json().catch(() => ({}));
            setMessage(`Erreur: ${errorData.message || "Impossible to add the character"}`, 'error');
          }
        } catch (err) {
          console.error('Erreur Fetch POST:', err);
          setMessage('Error to connect with the server.', 'error');
        }
      }
    });
  }

  // chargement de la liste :
  // récupère tous les personnages (api publique, pas besoin de token)
  async function loadCharacters() {
    if (!listContainer) return;
    listContainer.innerHTML = '<p>List is loading...</p>';

    try {
      const response = await fetch(`${API_BASE}/characters`);
      if (!response.ok) throw new Error('Network error');

      const characters = await response.json();
      allCharacters = characters;
      renderCharacterList(allCharacters);
    } catch (error) {
      console.error('Error loading', error);
      listContainer.innerHTML = '<p class="error-message">Impossible to load the list.</p>';
    }
  }

  // affiche la liste des personnages dans le panneau de gestion admin
  function renderCharacterList(characters) {
    listContainer.innerHTML = '';
    if (characters.length === 0) {
      listContainer.innerHTML = '<p>No character to manage</p>';
      return;
    }

    characters.forEach(char => {
      const item = document.createElement('div');
      item.className = 'management-item';

      item.innerHTML = `
        <span class="item-name">${char.name} (ID: ${char.id})</span>
        <div class="item-actions">
          <button class="edit-btn" data-id="${char.id}">Modify</button>
          <button class="delete-btn" data-id="${char.id}">Delete</button>
        </div>
      `;

      // bouton "modify" -> passe le formulaire en mode édition pour ce perso
      item.querySelector('.edit-btn').addEventListener('click', handleEditStart);
      // bouton "delete" -> supprime le perso après confirmation
      item.querySelector('.delete-btn').addEventListener('click', handleDelete);

      listContainer.appendChild(item);
    });
  }

  // mode édition :
  // remplit le formulaire avec les infos du personnage et bascule en mode "update"
  function handleEditStart(event) {
    const id = event.target.dataset.id;

    const charToEdit = allCharacters.find(char => char.id === id);
    if (!charToEdit) return;

    idInput.value = charToEdit.id;
    idInput.readOnly = true; // on ne modifie pas l'ID en édition
    document.getElementById('char-name').value = charToEdit.name;
    document.getElementById('char-element').value = charToEdit.element;
    document.getElementById('char-icon-url').value = charToEdit.images.icon;
    document.getElementById('char-card-url').value = charToEdit.images.card;

    isUpdateMode = true;
    currentEditingId = charToEdit.id;

    formTitle.textContent = `Modify : ${charToEdit.name}`;
    submitButton.textContent = 'Update';
    addCancelButton();

    // remonte la page vers le formulaire pour une meilleure ux
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // revient au mode "création" (nouveau personnage)
  function resetFormToCreateMode() {
    form.reset();
    idInput.readOnly = false;

    isUpdateMode = false;
    currentEditingId = null;

    formTitle.textContent = 'Add a character';
    submitButton.textContent = 'Add the character';

    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) cancelBtn.remove();
  }

  // ajoute un bouton "cancel" uniquement en mode édition
  function addCancelButton() {
    if (document.getElementById('cancel-edit-btn')) return;

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.id = 'cancel-edit-btn';
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'cancel-btn';

    cancelButton.addEventListener('click', resetFormToCreateMode);

    submitButton.after(cancelButton);
  }

  // suppression d'un personnage (DELETE /characters/:id)
  async function handleDelete(event) {
    const id = event.target.dataset.id;
    const item = event.target.closest('.management-item');

    if (!confirm(`Are you sure you want to delete this character : ${id} ?`)) {
      return;
    }

    const token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    setMessage('Delete is loading...', null);

    try {
      const response = await fetch(`${API_BASE}/characters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (await handleAuthErrors(response)) return;

      if (response.ok) {
        setMessage('Character delete !', 'success');
        item.remove();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(`Erreur: ${errorData.message || 'Impossible to delete'}`, 'error');
      }
    } catch (err) {
      console.error('Erreur Fetch DELETE:', err);
      setMessage('Network Error.', 'error');
    }
  }

  // chargement initial de la liste au démarrage de la page admin
  loadCharacters();
});