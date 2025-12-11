// page : characters.html
// rôle : "cerveau" de la page (liste des personnages)
// utilise les modules génériques :
// ListFilters (filtres par élément actif)
// ListSearch (barre de recherche par nom)
// ListPagination (pagination générique sur la liste filtrée)
document.addEventListener('DOMContentLoaded', () => {

  // références dom principales
  const charContainer = document.getElementById('character-list-container');
  const filterContainer = document.getElementById('filter-container');
  const searchInput = document.getElementById('search-input');
  const paginationContainer = document.getElementById('character-pagination');

  // état global de la page (liste complète + filtres + pagination)
  let allCharacters = [];
  let currentElementFilter = 'all';
  let currentSearchQuery = '';

  let currentPage = 1;
  const ITEMS_PER_PAGE = 15; // nombre de cartes affichées par page

  // chargement des données (personnages + éléments) depuis l'api
  async function loadData() {
    try {
      const [charResponse, elemResponse] = await Promise.all([
        fetch('/api/characters'),
        fetch('/api/elements')
      ]);

      if (!charResponse.ok || !elemResponse.ok) {
        throw new Error('Network error while retrieving data');
      }

      allCharacters = await charResponse.json();
      const elements = await elemResponse.json();

      // on garde uniquement les éléments réellement utilisés par les personnages
      const usedElementNames = new Set(allCharacters.map(char => char.element));
      const characterElements = elements.filter(el => usedElementNames.has(el.name));

      // 1) initialiser les filtres (module générique ListFilters)
      ListFilters.renderFilters(filterContainer, characterElements, (newElement) => {
        currentElementFilter = newElement;
        currentPage = 1;
        renderCharactersPage();
      });

      // 2) initialiser la search-bar (module générique ListSearch)
      ListSearch.initSearch(searchInput, (query) => {
        currentSearchQuery = query;
        currentPage = 1;
        renderCharactersPage();
      });

      // 3) premier rendu de la page (filtres + recherche + pagination)
      renderCharactersPage();

    } catch (error) {
      console.error('Unable to load data :', error);
      if (charContainer) {
        charContainer.innerHTML = '<p class="error-message">Error: Unable to load data.</p>';
      }
    }
  }

  // filtrage (par élément + recherche texte sur le nom)
  function getFilteredCharacters() {
    return allCharacters.filter(perso => {
      const elementMatch = (currentElementFilter === 'all' || perso.element === currentElementFilter);
      const searchMatch = perso.name.toLowerCase().includes(currentSearchQuery);
      return elementMatch && searchMatch;
    });
  }

  // rendu de la page courante (après filtrage + calcul des indices)
  function renderCharactersPage() {
    const filteredList = getFilteredCharacters();
    const totalItems = filteredList.length;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageItems = filteredList.slice(startIndex, endIndex);

    renderCharacters(pageItems);
    updateCounter(totalItems);

    // pagination (module générique ListPagination)
    ListPagination.renderPagination(
      paginationContainer,
      totalItems,
      currentPage,
      ITEMS_PER_PAGE,
      (newPage) => {
        currentPage = newPage;
        renderCharactersPage();
      }
    );
  }

  // affichage des cartes personnages dans le container
  function renderCharacters(personnages) {
    if (!charContainer) return;
    charContainer.innerHTML = '';

    if (personnages.length === 0) {
      charContainer.innerHTML = '<p class="no-results">No characters found.</p>';
      return;
    }

    personnages.forEach(perso => {
      const card = document.createElement('article');
      card.className = 'character-card';
      card.dataset.element = perso.element;

      // clic sur la carte → redirection vers la page de détail du personnage
      card.addEventListener('click', () => {
        window.location.href = `character.html?id=${perso.id}`;
      });

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${perso.images.card}.png" alt="${perso.name}" class="card-image" loading="lazy">
        </div>
        <div class="card-content">
          <h3 class="card-title">${perso.name}</h3>
          <div class="card-detail">
            <span class="element-tag" data-element="${perso.element}">${perso.element}</span>
          </div>
        </div>
      `;
      charContainer.appendChild(card);
    });
  }

  // compteur d'éléments (nombre total après filtre)
  function updateCounter(totalCount) {
    let counterElement = document.getElementById('char-counter');

    if (!counterElement) {
      counterElement = document.createElement('p');
      counterElement.id = 'char-counter';
      const listContainer = document.getElementById('character-list-container');
      listContainer.parentNode.insertBefore(counterElement, listContainer);
    }

    const s = totalCount > 1 ? 's' : '';
    counterElement.textContent = `Showing ${totalCount} character${s}`;
  }

  // lancement initial de la page (chargement des données + init ui)
  loadData();
});