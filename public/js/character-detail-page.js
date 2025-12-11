// Page : character.html
// Charge les infos d'un personnage via /api/characters/:id
// Affiche son image, son élément, etc.
// Charge les armes recommandées via /api/characters/:id/weapons
// Chaque arme cliquée envoie vers weapon.html?id=...
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('character-detail-container');

  // récupère l'id du personnage dans l'URL (character.html?id=c003)
  const params = new URLSearchParams(window.location.search);
  const characterId = params.get('id');

  // si pas d'id → retour vers la liste de tous les personnages
  if (!characterId) {
    window.location.href = 'characters.html';
    return;
  }

  // lancement initial
  initCharacterDetail(characterId, container);
});

// charge les infos du perso + construit le HTML
async function initCharacterDetail(characterId, container) {
  try {
    // récupérer les infos du personnage
    const response = await fetch(`/api/characters/${characterId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Character not found.');
      } else {
        throw new Error('Network error.');
      }
    }

    const perso = await response.json();

    // met à jour le titre de l’onglet du navigateur
    document.title = `${perso.name} - Détails`;

    // construire le HTML principal du personnage
    container.innerHTML = `
      <article class="character-detail">
        <div class="detail-header">
          <picture>
            <source srcset="${perso.images.icon}.png" type="image/png">
            <img src="${perso.images.icon}.png"
                 alt="${perso.name}"
                 class="detail-image">
          </picture>
        </div>

        <div class="detail-content">
          <h1 class="detail-title">${perso.name}</h1>

          <div class="detail-info">
            <span class="element-tag" data-element="${perso.element}">
              ${perso.element}
            </span>
          </div>

          <!-- Bloc armes recommandées -->
          <section class="detail-weapons">
            <h2 class="detail-subtitle">Recommended weapons</h2>
            <div id="character-weapons-list" class="detail-weapons-list">
              <p class="weapons-loading">Loading weapons...</p>
            </div>
          </section>

          <!-- Lien de retour vers la liste des personnages -->
          <div class="detail-back-link">
            <a href="characters.html" class="back-link">
              ← Back to characters list
            </a>
          </div>
        </div>
      </article>
    `;

    // charger les armes liées au personnage
    await loadCharacterWeapons(characterId);

  } catch (error) {
    console.error('Error :', error);
    container.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}

// charge les armes recommandées pour un perso
async function loadCharacterWeapons(characterId) {
  const listEl = document.getElementById('character-weapons-list');
  if (!listEl) return;

  try {
    const resp = await fetch(`/api/characters/${characterId}/weapons`);
    if (!resp.ok) {
      throw new Error('Error loading weapons.');
    }

    const weapons = await resp.json();
    listEl.innerHTML = '';

    // si aucune arme encore liée
    if (!weapons || weapons.length === 0) {
      listEl.innerHTML = '<p class="no-weapons">No recommended weapons linked yet.</p>';
      return;
    }

    // création d'une carte pour chaque arme
    weapons.forEach(weapon => {
      const card = document.createElement('article');
      card.className = 'character-card weapon-card';
      card.dataset.element = weapon.element;

      // clic = on va sur la page de détail de l'arme
      card.addEventListener('click', () => {
        window.location.href = `weapon.html?id=${weapon.id}`;
      });

      const imgSrc = weapon.image_url || 'assets/images/placeholder_weapon.png';

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${imgSrc}"
               alt="${weapon.name}"
               class="card-image"
               loading="lazy">
        </div>
        <div class="card-content">
          <h3 class="card-title">${weapon.name}</h3>
          <div class="card-detail">
            <span class="element-tag" data-element="${weapon.element || 'Neutral'}">
              ${weapon.element || 'Neutral'}
            </span>
            <span class="weapon-type-tag">${weapon.weapon_type}</span>
          </div>
          ${weapon.is_best_in_slot ? `<p class="bis-tag">Best in Slot</p>` : ''}
          ${weapon.notes ? `<p class="weapon-notes">${weapon.notes}</p>` : ''}
        </div>
      `;

      listEl.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    listEl.innerHTML = '<p class="error-message">Unable to load weapons.</p>';
  }
}