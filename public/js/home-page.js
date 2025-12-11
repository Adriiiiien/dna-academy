// page : index.html (page d'accueil)
// rôle : afficher un personnage "à la une" choisi aléatoirement
// ce script :
// récupère tous les personnages (/api/characters)
// en choisit un au hasard à chaque chargement de la page
// affiche sa petite carte en haut de la home avec un lien vers sa fiche détaillée
document.addEventListener('DOMContentLoaded', async () => {
  const featuredContainer = document.getElementById('featured-character-container');
  if (!featuredContainer) return;

  try {
    // récupère la liste complète des personnages depuis l'api
    const response = await fetch('/api/characters');
    if (!response.ok) throw new Error('Network error');

    const characters = await response.json();

    if (characters.length === 0) {
      featuredContainer.innerHTML = '<p>Add a character in the admin panel to see it here.</p>';
      return;
    }

    // choix aléatoire d'un personnage dans la liste
    const randomIndex = Math.floor(Math.random() * characters.length);
    const featuredChar = characters[randomIndex];

    // injecte la carte "personnage à la une" dans le container
    featuredContainer.innerHTML = `
      <div class="featured-card" data-element="${featuredChar.element}">
        <div class="featured-image-wrapper">
          <img src="${featuredChar.images.card}.png" alt="${featuredChar.name}" class="featured-image">
        </div>
        <div class="featured-info">
          <h3 class="featured-name">${featuredChar.name}</h3>
          <div class="featured-element" style="color: var(--color-element-${featuredChar.element.toLowerCase()})">
            ${featuredChar.element}
          </div>
          <p class="featured-desc">
            Discover more about ${featuredChar.name}, a powerful ${featuredChar.element} character in Duet Night Abyss.
          </p>
          <a href="character.html?id=${featuredChar.id}" class="featured-cta">View guide →</a>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Error loading featured character :', error);
    featuredContainer.innerHTML = '<p>Unable to load the featured character.</p>';
  }
});