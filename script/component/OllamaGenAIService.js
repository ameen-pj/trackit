export class OllamaGenAIService extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .ai-text {
          font-family: "Poppins", serif;
          font-size: 0.8em;
        }
      </style>
      <p class="ai-text"></p>
    `;
  }

  static get observedAttributes() {
    return ["prompt", "modelname", "ollamahost", "ollamaport"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name == "prompt") {
      this.generateAIResponse(newVal);
    }
  }

  async generateAIResponse(prompt) {
    const converter = new showdown.Converter();

    console.log("Inside GenAI Response:" + prompt);

    const ollamaURL = `http://${this.getAttribute(
      "ollamahost",
    )}:${this.getAttribute("ollamaport")}/api/generate`;

    console.log("ollamaURL:" + ollamaURL);

    try {
      this.dispatchEvent(
        new CustomEvent("genInit", {
          bubbles: true,
          composed: true,
          detail: {
            data: "Gen AI Started with prompt" + " " + prompt,
          },
        }),
      );

      const response = await fetch(ollamaURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.getAttribute("modelname"),
          prompt: prompt,
          stream: true,
        }),
      });

      // Read the response as a stream of text
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      const aiResponseElement = this.shadowRoot.querySelector(".ai-text");
      aiResponseElement.innerText = "";

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          // Decode and split by newline to parse each JSON object
          const chunk = decoder.decode(value, { stream: true });
          const parts = chunk.split("\n").filter(Boolean);
          parts.forEach((part) => {
            try {
              const json = JSON.parse(part);
              aiResponseElement.innerText += json.response; // Append response text
            } catch (err) {
              console.error("Error parsing chunk:", err);
            }
          });
        }
      }
      this.dispatchEvent(
        new CustomEvent("genAIComplete", {
          bubbles: true,
          composed: true,
          detail: {
            data: "Gen AI Completed with prompt:" + " " + prompt,
          },
        }),
      );

      aiResponseElement.innerHTML = converter.makeHtml(
        aiResponseElement.innerText,
      );
    } catch (error) {
      console.log(error);
      alert("Error calling the API:", error);
    }
  }

  connectedCallback() {
    console.log("Appending element");
  }

  disconnectedCallback() {
    console.log("Removing element");
  }
}
