import { AssignmentManagement } from "./backend/AssignmentManagement.js";
import { addCard } from "./cardManager.js";
import { AssignmentCard } from "./component/AssignmentCard.js";
import { OllamaGenAIService } from "./component/OllamaGenAIService.js";

const refreshAssignmentCards = new CustomEvent("refreshAssignmentCards");

// Refresh Assignment Cards Event Listeners
document.addEventListener("refreshAssignmentCards", async (event) => {
  let results = await AssignmentManagement.getAllAssignments();
  // Add card individually
  results.forEach((assignment) => {
    addCard(assignment);
  });
});

// Define assignment card
customElements.define("assignment-card", AssignmentCard);
customElements.define("gen-ai", OllamaGenAIService);

document.dispatchEvent(refreshAssignmentCards);
