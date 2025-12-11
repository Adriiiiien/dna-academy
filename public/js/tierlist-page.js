// page : tierlist.html
// rôle : affichage de la tier list des personnages
// définit une config de tier list (SSS / S / A / B)
// charge tous les personnages via /api/characters
// remplit chaque colonne avec les persos correspondants
// sur clic, redirige vers character.html?id=...
document.addEventListener('DOMContentLoaded', () => {

  // configuration de la tier list :
  // modifier librement les ids ici (par rang / tier)
  const tierConfig = {
    SSS: ['c007', 'c018', 'c015', 'c013', 'c016', 'c006'], // ids des personnages
    S:   ['c001', 'c002', 'c008', 'c012', 'c017'],
    A:   ['c003', 'c004', 'c009', 'c010', 'c011', 'c019'],
    B:   ['c005', 'c014', 'c020']
  };

  initTierList(tierConfig);
});

// charge tous les persos puis remplit les colonnes de la tier list
async function initTierList(tierConfig) {
  let allCharacters = [];

  try {
    const response = await fetch('/api/characters');
    if (!response.ok) {
      throw new Error('Error loading characters.');
    }
    allCharacters = await response.json();
  } catch (err) {
    console.error(err);
    return;
  }

  // pour chaque tier (SSS, S, A, B), on remplit la colonne correspondante
  Object.keys(tierConfig).forEach(tierKey => {
    const container = document.getElementById(`tier-${tierKey}`);
    if (!container) return;

    const ids = tierConfig[tierKey];

    // on garde uniquement les persos dont l'id figure dans cette tier
    const characters = allCharacters.filter(ch => ids.includes(ch.id));

    container.innerHTML = '';

    characters.forEach(perso => {
      const card = document.createElement('article');
      card.className = 'character-card tier-card';
      card.dataset.element = perso.element;

      // clic = page détail du perso
      card.addEventListener('click', () => {
        window.location.href = `character.html?id=${perso.id}`;
      });

      // on privilégie l'image "card" (500x500), sinon l'icon
      const imgSrc = (perso.images.card || perso.images.icon) + '.png';

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${imgSrc}"
               alt="${perso.name}"
               class="card-image"
               loading="lazy">
        </div>
        <div class="card-content">
          <h3 class="card-title">${perso.name}</h3>
          <div class="card-detail">
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  });
}