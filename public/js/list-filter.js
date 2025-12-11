// composant générique de filtres (boutons)
// utilisé pour characters, weapons, etc.
// ListFilters.renderFilters(container, items, onFilterChange)
// container élément dom qui contiendra les boutons
// items tableau d'objets { name, icon } (ex : éléments, types d'arme…)
// onFilterChange fonction appelée avec "all" ou le nom de l'item cliqué
const ListFilters = (function () {

  // met la classe .active sur le bouton actuellement sélectionné
  function updateActiveButton(container, clickedButton) {
    const allButtons = container.querySelectorAll('.filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    if (clickedButton) {
      clickedButton.classList.add('active');
    }
  }

  // génère les boutons de filtre dans le container (bouton "all" + 1 bouton par item)
  function renderFilters(container, items, onFilterChange) {
    if (!container) return;

    container.innerHTML = '';

    // bouton "all" (filtre désactivé = tous les éléments)
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.className = 'filter-btn active';
    allButton.addEventListener('click', (e) => {
      onFilterChange('all'); // valeur spéciale "all"
      updateActiveButton(container, e.currentTarget);
    });
    container.appendChild(allButton);

    // bouton pour chaque item (élément, type d'arme, etc.)
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.element = item.name; // utile pour le style ou pour cibler par data-attribute

      if (item.icon) {
        btn.innerHTML = `
          <img src="${item.icon}" alt="${item.name}" class="filter-icon">
          <span>${item.name}</span>
        `;
      } else {
        btn.textContent = item.name;
      }

      btn.addEventListener('click', (e) => {
        onFilterChange(item.name);
        updateActiveButton(container, e.currentTarget);
      });

      container.appendChild(btn);
    });
  }

  return {
    renderFilters
  };

})();