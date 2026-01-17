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
        justify-content:space-between;
        height:100%;
        box-sizing: border-box;
        padding: 20px;
        // margin: 10px;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
        border-radius: 8px;
        background-color: white;
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
        margin: 0 0 10px 0;
        // padding: 0px;
        font-size: 1.5em;
        // margin-bottom: 10px;
        word-wrap: break-word;
      }

      .assignment-description {
        margin: 0 0 10px 0;
        font-size: 1em;
        color: #505050;
        word-warp: break-word;
        // padding: 0px;
        // margin-bottom: 10px;
      }

      .assignment-due {
        margin: 0px;
        font-size: 0.9em;
        color: #808080;
        // padding: 0px;
        
        
      }

      .assignment-due.past-due {
        color: #cc4132;
      }


      .assignment-status-container {
        border: none;
        min-height: unset;
        height: auto;
         padding: 10px;
         margin-top: 15px;
        box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
            rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
        display:flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
       
        border-radius: 5px;
        font-family: "JetBrains Mono", monospace;
        font-weight: 800;
        font-size:0.75em;
        
      }

      @media (min-width: 1200px){
        .assignment-status-container{
          flex-wrap: nowrap;
          gap: 15px;
          padding: 10px 0;
        }
      
      }





      .assignment-status-container label {
        display:flex;
        // width: auto;
        // height:100%;
        
        // justify-content: center;
        align-items:center;
        white-space: nowrap;
        cursor: pointer;

      }

       .assignment-status-container input[type="radio"] {
        margin: 0 5px 0 0;
      
      
      }

      // @media (min-width: 992px){
      //   .assignment-status-container{
      //     flex-wrap: nowrap;
      //     gap: 20px;
      //     padding: 10px 0;
      //     // justify-content: center ; 
      //     // min-height: unset;
          
          
      //   }
      
      // }


     


      .assignment-buttons {
        width:100%;
        margin-top: 20px;
        // height:30%;
        display: flex;
        justify-content:space-between;
        align-items:center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .btn {
        flex: 1 1 auto;
        padding: 8px 10px;
        font-size: 0.9em;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        white-space: nowrap;
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
