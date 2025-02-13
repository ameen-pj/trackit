// Modal Box Handlers
const openModalButtons = document.querySelectorAll(".open-modal-button");
const closeModalButtons = document.querySelectorAll(".close-modal-button");

openModalButtons.forEach((openModalButton) => {
  openModalButton.addEventListener("click", (e) => {
    let modalId = e.target.dataset.modalId;
    if (modalId == "#search-modal") {
      document.querySelector(modalId).show();
    } else {
      document.querySelector(modalId).showModal();
    }
  });
});

closeModalButtons.forEach((closeModalButton) => {
  closeModalButton.addEventListener("click", (e) => {
    document.querySelector(e.target.dataset.modalId).close();
  });
});
