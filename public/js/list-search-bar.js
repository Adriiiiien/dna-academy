// composant générique de barre de recherche
// utilisé pour characters, weapons, etc.
// ListSearch.initSearch(inputElement, onSearchChange)
// inputElement : l'input de recherche
// onSearchChange : fonction appelée avec la valeur en minuscule/trimée
const ListSearch = (function () {

  // initialise la recherche sur un input donné
  // à chaque saisie, on appelle le callback avec une version normalisée (lowercase + trim)
  function initSearch(inputElement, onSearchChange) {
    if (!inputElement || typeof onSearchChange !== 'function') return;

    inputElement.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase().trim();
      onSearchChange(value);
    });
  }

  return {
    initSearch
  };

})();