import { AssignmentManagement } from "./backend/AssignmentManagement.js";
import { deleteCard, updateCard } from "./cardManager.js";

// Update status
document.addEventListener("updateStatus", async (event) => {
  let assignment = event.detail.assignment;
  await AssignmentManagement.editAssignment(assignment);
  updateCard(assignment.id, assignment);
});

// Delete card
document.addEventListener("deleteAssignment", async (event) => {
  let id = event.detail.id;
  await AssignmentManagement.deleteAssignment(id);
  deleteCard(id);
});

// Edit Card
document.addEventListener("populateEditAssignmentModal", (event) => {
  const editAssignmentModal = document.querySelector("#edit-assignment-modal");
  const editAssignmentForm = editAssignmentModal.querySelector(
    "#edit-assignment-form"
  );
  editAssignmentModal.setAttribute("data-assignment-id", event.detail.id);

  editAssignmentForm.querySelector("#assignment-title").value =
    event.detail.title;
  editAssignmentForm.querySelector("#assignment-description").value =
    event.detail.description;
  editAssignmentForm.querySelector("#assignment-duedate").value =
    event.detail.duedate;
  editAssignmentForm.querySelector(
    `input[data-assignment-status="${event.detail.status}"]`
  ).checked = true;

  editAssignmentModal.showModal();
});
