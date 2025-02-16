import { AssignmentManagement } from "./backend/AssignmentManagement.js";
import { Assignment } from "./backend/Assignment.js";
import { addCard, updateCard } from "./cardManager.js";

// Getting the two forms
const addAssignmentForm = document.querySelector("#add-assignment-form");
const editAssignmentForm = document.querySelector("#edit-assignment-form");
// Adding event Listeners
addAssignmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get Form Data
  let title = addAssignmentForm.querySelector("#assignment-title").value;
  let description = addAssignmentForm.querySelector(
    "#assignment-description"
  ).value;
  let duedate = addAssignmentForm.querySelector("#assignment-duedate").value;
  let status = addAssignmentForm
    .querySelector("#assignment-status")
    .querySelector('input[type="radio"]:checked').value;
  // Creating assignment object
  let lastIdx = await AssignmentManagement.getLastIndex();

  let assignment = new Assignment(
    lastIdx + 1,
    title,
    description,
    duedate,
    status
  );
  // Adding to DB
  await AssignmentManagement.addAssignment(assignment);
  // ADd card
  addCard(assignment);
  // Close Modal
  addAssignmentForm.reset();
  document.querySelector("#add-assignment-modal").close();
});

editAssignmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // TODO: Make sure that you set data-assignment-id=id for #edit-assignment-modal
  const editAssignmentModal = document.querySelector("#edit-assignment-modal");
  let id = Number(editAssignmentModal.dataset.assignmentId);
  // Get Form Data
  let title = editAssignmentForm.querySelector("#assignment-title").value;
  let description = editAssignmentForm.querySelector(
    "#assignment-description"
  ).value;
  let duedate = editAssignmentForm.querySelector("#assignment-duedate").value;
  let status = editAssignmentForm
    .querySelector("#assignment-status")
    .querySelector('input[type="radio"]:checked').value;
  // Creating new assignment objects
  let assignment = new Assignment(id, title, description, duedate, status);
  await AssignmentManagement.editAssignment(assignment);
  // Remove data-assignment-id attribute;
  editAssignmentModal.removeAttribute("data-assignment-id");
  editAssignmentForm.reset();
  // Closing the modal
  editAssignmentModal.close();
  updateCard(id, assignment);
});

// Search bar
const searchBar = document.querySelector("#search");
searchBar.addEventListener("keyup", (e) => {
  let cards = document.querySelectorAll("assignment-card");

  var searchvalue = searchBar.value.toLowerCase();
  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].getAttribute("title").toLowerCase();
    let description = cards[i].getAttribute("description").toLowerCase();

    if (title.includes(searchvalue) || description.includes(searchvalue)) {
      cards[i].classList.remove("inactive");
    } else {
      cards[i].classList.add("inactive");
    }
  }
});
