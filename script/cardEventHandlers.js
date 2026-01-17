import { AssignmentManagement } from "./backend/AssignmentManagement.js";
import { deleteCard, updateCard } from "./cardManager.js";
import { CONFIG } from "./config.js";


// Gen AI
document.addEventListener("genAI", async (event) => {
  // show modal
  const genAIModal = document.querySelector("#gen-ai-modal");
  genAIModal.showModal();

  genAIModal.querySelector(".close-modal-button").disabled = true;

  let prompt = `Write an assignment in not more that 300 words on topic: ${event.detail.title}. Here is a brief description: ${event.detail.description}. `;
  genAIModal.querySelector("h1").innerText = `AI ✨ - ${event.detail.title}`;

  const aiComponent = genAIModal.querySelector("gen-ai");

  // CHANGE: Passing Config keys instead of Ollama host/port
  aiComponent.setAttribute("apikey", CONFIG.GEMINI_API_KEY);
  aiComponent.setAttribute("modelname", CONFIG.GEMINI_MODEL);
  
  // Trigger generation
  aiComponent.setAttribute("prompt", prompt);
});
document.addEventListener("genAIComplete", (event) => {
  const genAIModal = document.querySelector("#gen-ai-modal");
  genAIModal.querySelector(".close-modal-button").disabled = false;
});

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
    "#edit-assignment-form",
  );
  editAssignmentModal.setAttribute("data-assignment-id", event.detail.id);

  editAssignmentForm.querySelector("#assignment-title").value =
    event.detail.title;
  editAssignmentForm.querySelector("#assignment-description").value =
    event.detail.description;
  editAssignmentForm.querySelector("#assignment-duedate").value =
    event.detail.duedate;
  editAssignmentForm.querySelector(
    `input[data-assignment-status="${event.detail.status}"]`,
  ).checked = true;

  editAssignmentModal.showModal();
});
