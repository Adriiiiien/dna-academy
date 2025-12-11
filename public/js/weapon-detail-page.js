// page : weapon.html
// rôle : affichage du détail d'une arme
// charge les infos d'une arme via /api/weapons/:id
// affiche image, élément, type, stats, description
// met à jour le titre de l’onglet du navigateur
// ajoute un lien "← Back to weapons list"
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('weapon-detail-container');

  // récupère l'id de l'arme dans l'url (weapon.html?id=w001)
  const params = new URLSearchParams(window.location.search);
  const weaponId = params.get('id');

  // si pas d'id → retour vers la liste des armes
  if (!weaponId) {
    window.location.href = 'weapons.html';
    return;
  }

  initWeaponDetail(weaponId, container);
});

// charge les infos de l'arme et construit la page
async function initWeaponDetail(weaponId, container) {
  try {
    const response = await fetch(`/api/weapons/${weaponId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Arme introuvable.');
      } else {
        throw new Error('Erreur réseau lors du chargement de l\'arme.');
      }
    }

    const weapon = await response.json();

    // met à jour le titre de l’onglet du navigateur
    document.title = `${weapon.name} - Weapon Detail`;

    // valeurs avec fallback si jamais la bdd n'a rien
    const imageUrl = weapon.image_url || 'assets/images/placeholder_weapon.png';
    const elementLabel = weapon.element || 'Neutral';
    const damageType = weapon.damage_type || 'Unknown';
    const description = weapon.description || 'No description available.';

    const baseAtk = weapon.base_atk ?? 'N/A';
    const maxAtk = weapon.max_atk ?? 'N/A';
    const critChance = weapon.crit_chance_pct ?? 'N/A';
    const critDamage = weapon.crit_damage_pct ?? 'N/A';

    container.innerHTML = `
      <article class="weapon-detail">
        <div class="detail-header">
          <picture>
            <source srcset="${imageUrl}" type="image/png">
            <img src="${imageUrl}"
                 alt="${weapon.name}"
                 class="detail-image">
          </picture>
        </div>

        <div class="detail-content">
          <h1 class="detail-title">${weapon.name}</h1>

          <div class="detail-tags">
            <span class="element-tag" data-element="${elementLabel}">
              ${elementLabel}
            </span>
            <span class="weapon-type-tag">
              ${weapon.weapon_type}
            </span>
            <span class="damage-type-tag">
              ${damageType}
            </span>
          </div>

          <p class="weapon-description">
            ${description}
          </p>

          <div class="weapon-stats">
            <h2>Stats</h2>
            <ul class="stats-list">
              <li><strong>Base ATK :</strong> ${baseAtk}</li>
              <li><strong>Max ATK :</strong> ${maxAtk}</li>
              <li><strong>Crit Chance :</strong> ${critChance}%</li>
              <li><strong>Crit Damage :</strong> ${critDamage}%</li>
            </ul>
          </div>

          <a href="weapons.html" class="back-link">
            ← Back to weapons list
          </a>
        </div>
      </article>
    `;

  } catch (error) {
    console.error('Erreur détail arme :', error);
    container.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}