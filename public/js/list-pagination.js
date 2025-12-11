// composant générique de pagination
// utilisé pour characters, weapons, etc.
// container : élément dom qui contiendra les boutons
// totalItems : nombre total d'éléments (après filtre/recherche)
// currentPage : numéro de page actuelle (1, 2, 3…)
// itemsPerPage : combien d'éléments par page
// onPageChange : fonction appelée avec le nouveau numéro de page
const ListPagination = (function () {

  function renderPagination(container, totalItems, currentPage, itemsPerPage, onPageChange) {
    if (!container) return;

    container.innerHTML = '';

    // si tout rentre sur une page → pas de pagination
    if (totalItems <= itemsPerPage) {
      return;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // bouton "précédent"
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = (currentPage === 1);
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    });
    container.appendChild(prevBtn);

    // boutons numérotés (1, 2, 3, …)
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.className = 'pagination-btn';
      if (i === currentPage) {
        pageBtn.classList.add('active');
      }
      pageBtn.addEventListener('click', () => {
        onPageChange(i);
      });
      container.appendChild(pageBtn);
    }

    // bouton "suivant"
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = (currentPage === totalPages);
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    });
    container.appendChild(nextBtn);
  }

  return {
    renderPagination
  };

})();