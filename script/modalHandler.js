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

// Shortcut for search bar
document.addEventListener("keyup", (event) => {
  if (event.key === "/" && document.activeElement.tagName !== "INPUT") {
    event.preventDefault();
    document.querySelector("#search").focus();
  }
});
// Close all modals on escape except AI modal
document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    
    document.querySelector("#add-assignment-modal").close();
    document.querySelector("#edit-assignment-modal").close();

    document.querySelector("#search").blur();
  }
});
