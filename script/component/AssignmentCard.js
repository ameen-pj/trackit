import { Assignment } from "../backend/Assignment.js";

export class AssignmentCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <style>
      .assignment-card {
        display: flex;
        flex-direction:column;
        justify-content:space-evenly;
        height:100%;
        padding: 20px;
        margin: 10px;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
        border-radius: 8px;
        font-family: Arial, sans-serif;
      }

      .assignment-card:hover {
        box-shadow: rgba(0, 0, 0, 0.6) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.6) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.6) 0px 0px 0px 1px inset;
        transition: 0.8s all ease;
      }

      .assignment-card.disabled {
        opacity: 0.5;
      }

      .assignment-header {
        padding: 0px;
        margin: 0px;
        font-size: 1.5em;
        margin-bottom: 10px;
      }

      .assignment-description {
        padding: 0px;
        margin: 0px;
        font-size: 1em;
        color: #505050;
        margin-bottom: 10px;
      }

      .assignment-due {
        padding: 0px;
        margin: 0px;
        font-size: 0.9em;
        color: #808080;
      }

      .assignment-due.past-due {
        color: #cc4132;
      }


      .assignment-status-container {
        border: none;
        height: auto;
        min-height: 40px;
        box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
            rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
        display:flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 8px;
        font-family: "JetBrains Mono", monospace;
        font-weight: 800;
        font-size:0.75em;
        border-radius: 5px;
      }

      .assignment-status-container label {
        width: auto;
        // height:100%;
        display:flex;
        justify-content: center;
        align-items:center;
        white-space: nowrap;
        cursor: pointer;

      }

      @media (min-width: 992px){
        .assignment-status-container{
          flex-wrap: nowrap;
          justify-content: center ; 
          min-height: unset;
          padding: 10px 0;
          gap: 20px;
        }
      
      }


      .assignment-status-container input[type="radio"] {
        margin-top: 0;
        margin-right: 5px;
      
      
      }


      .assignment-buttons {
        width:100%;
        height:30%;
        display: flex;
        justify-content:space-around;
        align-items:center;
      }

      .btn {
        padding: 8px 15px;
        font-size: 0.9em;
        cursor: pointer;
        border: none;
        border-radius: 5px;
      }

      .btn:hover {
        background-color: rgb(215, 215, 215);
        transition: 0.35s all ease;
      }

      /* Button primary */

      .btn.btn-primary {
        background-color: #dbeafe;
        color: #4d6bfe;
      }

      .btn.btn-primary:hover {
        background-color: #c6dcf8;
      }

      /* Button Danger */

      .btn.btn-danger {
        background-color: #de2f1b;
        color: #fff;
      }

      .btn.btn-danger:hover {
        background-color: #c61602;
      }

      .btn.btn-success {
        color: #fff;
        background-color: #07dc6e;
      }

      .btn.btn-success:hover {
        background-color: #05c461;
      }
            
      .btn.btn-ai {
        color: #fff;
        background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
      }
        
    </style>

    <div class="assignment-card">
      <h1 class="assignment-header"></h1>
      <p class="assignment-description"></p>
      <b><p class="assignment-due"></p></b>
      <br>
      <fieldset class="assignment-status-container">
        <label>
            <input
            type="radio"
            name="assignment-status-radio"
            data-assignment-status="INCOMPLETE"
            value="INCOMPLETE"
            />Incomplete ❌
        </label>
        <label>
            <input
            type="radio"
            name="assignment-status-radio"
            data-assignment-status="IN_PROGRESS"
            value="IN_PROGRESS"
            />In Progress 🏃‍➡️
        </label>
        <label>
            <input
            type="radio"
            name="assignment-status-radio"
            data-assignment-status="COMPLETE"
            value="COMPLETE"
            />Complete ✅
        </label>
      </fieldset>
      <br>
      <div class="assignment-buttons">
        <button class="btn edit-button">Edit ✏️</button>
        <button class="btn btn-danger delete-button">Delete 🗑️</button>
        <button class="btn btn-ai ai-button">Ask AI ✨</button>
      </div>
    </div>
`;
  }

  static get observedAttributes() {
    return ["id", "title", "description", "duedate", "status"];
  }

  connectedCallback() {
    this.render();

    this.id = this.getAttribute("id");
    this.shadowRoot
      .querySelector(".edit-button")
      .addEventListener("click", () => this.onEditClick());
    this.shadowRoot
      .querySelector(".delete-button")
      .addEventListener("click", () => this.onDeleteClick());
    this.shadowRoot
      .querySelector(".ai-button")
      .addEventListener("click", () => this.onGenAIClick());
    // Update status callback
    this.shadowRoot
      .querySelectorAll('input[name="assignment-status-radio"]')
      .forEach((radio) => {
        radio.addEventListener("change", (event) =>
          this.onStatusUpdate(event.target.dataset.assignmentStatus)
        );
      });
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const container = this.shadowRoot.querySelector(".assignment-card");
    const title = this.shadowRoot.querySelector(".assignment-header");
    const description = this.shadowRoot.querySelector(
      ".assignment-description"
    );
    const dueDate = this.shadowRoot.querySelector(".assignment-due");

    if (this.getAttribute("status") == "COMPLETE") {
      title.innerHTML = `<s>${this.getAttribute("title")}</s>`;
      container.classList.add("disabled");
    } else {
      title.innerText = this.getAttribute("title");
      container.classList.remove("disabled");
    }

    description.innerText = this.getAttribute("description");

    const due = new Date(this.getAttribute("duedate"));

    dueDate.innerText = "Due : " + due.toLocaleString();
    if (Date.now() > due) {
      dueDate.classList.add("past-due");
    } else {
      dueDate.classList.remove("past-due");
    }

    this.shadowRoot.querySelector(
      `input[data-assignment-status="${this.getAttribute("status")}"]`
    ).checked = true;
  }

  onEditClick() {
    const event = new CustomEvent("populateEditAssignmentModal", {
      composed: true,
      bubbles: true,
      detail: {
        id: Number(this.id),
        title: this.getAttribute("title"),
        description: this.getAttribute("description"),
        duedate: this.getAttribute("duedate"),
        status: this.getAttribute("status"),
      },
    });
    this.dispatchEvent(event);
  }

  onDeleteClick() {
    const event = new CustomEvent("deleteAssignment", {
      composed: true,
      bubbles: true,
      detail: { id: Number(this.id) },
    });
    this.dispatchEvent(event);
  }

  onGenAIClick() {
    const event = new CustomEvent("genAI", {
      composed: true,
      bubbles: true,
      detail: {
        title: this.getAttribute("title"),
        description: this.getAttribute("description"),
      },
    });
    this.dispatchEvent(event);
  }

  onStatusUpdate(status) {
    let assignment = new Assignment(
      Number(this.getAttribute("id")),
      this.getAttribute("title"),
      this.getAttribute("description"),
      this.getAttribute("duedate"),
      status
    );

    const event = new CustomEvent("updateStatus", {
      composed: true,
      bubbles: true,
      detail: {
        assignment: assignment,
      },
    });
    this.dispatchEvent(event);
  }
}
