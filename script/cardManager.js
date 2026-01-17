const mainContainer = document.querySelector(".main-container");

export function addCard(assignment) {
  let card = `<assignment-card class="col-12 col-md-6 col-lg-4" id="${assignment.id}" title="${assignment.title}" description="${assignment.description}" duedate="${assignment.duedate}" status="${assignment.status}" />`;
  mainContainer.insertAdjacentHTML("beforeend", card);
}

export function deleteCard(id) {
  mainContainer.querySelector(`assignment-card[id="${id}"]`).remove();
}

export function updateCard(id, assignment) {
  let card = mainContainer.querySelector(`assignment-card[id="${id}"]`);

  card.setAttribute("data-assignment-id", assignment.id);
  card.setAttribute("title", assignment.title);
  card.setAttribute("description", assignment.description);
  card.setAttribute("duedate", assignment.duedate);
  card.setAttribute("status", assignment.status);
}
