import { AssignmentManagement } from "./backend/AssignmentManagement.js";
import { addCard } from "./cardManager.js";
import { AssignmentCard } from "./component/AssignmentCard.js";
// CHANGE: Importing Gemini instead of Ollama
import { GeminiGenAIService } from "./component/GeminiGenAIService.js";

const refreshAssignmentCards = new CustomEvent("refreshAssignmentCards");

// Refresh Assignment Cards Event Listeners
document.addEventListener("refreshAssignmentCards", async (event) => {
  let results = await AssignmentManagement.getAllAssignments();
  // Add card individually
  results.forEach((assignment) => {
    addCard(assignment);
  });
});

// Define components
customElements.define("assignment-card", AssignmentCard);

// CHANGE: Registering Gemini service to the <gen-ai> tag
customElements.define("gen-ai", GeminiGenAIService);

document.dispatchEvent(refreshAssignmentCards);