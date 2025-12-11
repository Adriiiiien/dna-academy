// page : weapons.html
// rôle : "cerveau" de la page des armes
// utilise les modules génériques :
// ListFilters (filtres par type d'arme)
// ListSearch (barre de recherche par nom)
// ListPagination (pagination de la liste filtrée)

document.addEventListener('DOMContentLoaded', () => {

  // références dom
  const weaponContainer = document.getElementById('weapon-list-container');
  const filterContainer = document.getElementById('weapon-filter-container');
  const searchInput = document.getElementById('search-input');
  const paginationContainer = document.getElementById('weapon-pagination');

  // état global de la page
  let allWeapons = [];
  let currentTypeFilter = 'all'; // Bow, Sword, etc. ou "all"
  let currentSearchQuery = '';

  let currentPage = 1;
  const ITEMS_PER_PAGE = 15;

  // chargement des données depuis l'api (armes)
  async function loadData() {
    try {
      const weaponResponse = await fetch('/api/weapons');

      if (!weaponResponse.ok) {
        throw new Error('Network error while retrieving weapons');
      }

      allWeapons = await weaponResponse.json();

      // récupération de la liste des types d’armes (Bow, Sword, etc.)
      const weaponTypes = extractWeaponTypes(allWeapons);

      // initialisation des filtres (module générique ListFilters)
      ListFilters.renderFilters(filterContainer, weaponTypes, (newType) => {
        currentTypeFilter = newType;   // "all" ou "Bow" / "Sword" / ...
        currentPage = 1;
        renderWeaponsPage();
      });

      // initialisation de la barre de recherche (module générique ListSearch)
      ListSearch.initSearch(searchInput, (query) => {
        currentSearchQuery = query;
        currentPage = 1;
        renderWeaponsPage();
      });

      // premier affichage de la liste (avec filtres et pagination)
      renderWeaponsPage();

    } catch (error) {
      console.error('Unable to load weapons :', error);
      if (weaponContainer) {
        weaponContainer.innerHTML =
          '<p class="error-message">Error : Unable to load data.</p>';
      }
    }
  }

  // transforme la liste d’armes en liste de types uniques { name, icon }
  function extractWeaponTypes(weapons) {
    const types = new Set(weapons.map(w => w.weapon_type));
    const sortedTypes = [...types].sort();
    return sortedTypes.map(name => ({ name, icon: null }));
  }

  // filtrage (type + recherche)
  function getFilteredWeapons() {
    return allWeapons.filter(weapon => {
      const typeMatch =
        (currentTypeFilter === 'all' || weapon.weapon_type === currentTypeFilter);

      const searchMatch =
        weapon.name.toLowerCase().includes(currentSearchQuery);

      return typeMatch && searchMatch;
    });
  }

  // rendu de la page courante (après filtrage + pagination)
  function renderWeaponsPage() {
    const filteredList = getFilteredWeapons();
    const totalItems = filteredList.length;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageItems = filteredList.slice(startIndex, endIndex);

    renderWeapons(pageItems);
    updateCounter(totalItems);

    ListPagination.renderPagination(
      paginationContainer,
      totalItems,
      currentPage,
      ITEMS_PER_PAGE,
      (newPage) => {
        currentPage = newPage;
        renderWeaponsPage();
      }
    );
  }

  // affichage des cartes d’armes
  function renderWeapons(weapons) {
    if (!weaponContainer) return;
    weaponContainer.innerHTML = '';

    if (weapons.length === 0) {
      weaponContainer.innerHTML = '<p class="no-results">No weapons found.</p>';
      return;
    }

    weapons.forEach(weapon => {
      const card = document.createElement('article');
      card.className = 'character-card'; // même style que les persos
      card.dataset.element = weapon.element;  // sert à colorer la bordure

      // clic sur la carte → redirection vers la page détail de l’arme
      card.addEventListener('click', () => {
        window.location.href = `weapon.html?id=${weapon.id}`;
      });

      const imgSrc = weapon.image_url || 'assets/images/placeholder_weapon.png';

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${imgSrc}" alt="${weapon.name}" class="card-image" loading="lazy">
        </div>
        <div class="card-content">
          <h3 class="card-title">${weapon.name}</h3>
          <div class="card-detail">
            <span class="element-tag" data-element="${weapon.element}">
              ${weapon.element}
            </span>
            <span class="weapon-type-tag">${weapon.weapon_type}</span>
          </div>
        </div>
      `;
      weaponContainer.appendChild(card);
    });
  }

  // compteur "showing x weapons"
  function updateCounter(totalCount) {
    let counterElement = document.getElementById('char-counter');

    if (!counterElement) {
      counterElement = document.createElement('p');
      counterElement.id = 'char-counter';
      weaponContainer.parentNode.insertBefore(counterElement, weaponContainer);
    }

    const s = totalCount > 1 ? 's' : '';
    counterElement.textContent = `Showing ${totalCount} weapon${s}`;
  }

  // lancement initial
  loadData();
});