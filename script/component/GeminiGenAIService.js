export class GeminiGenAIService extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .ai-text {
          font-family: "Poppins", serif;
          font-size: 0.9em;
          line-height: 1.6;
          color: #333;
        }
        /* Basic Markdown Styling */
        .ai-text strong { font-weight: 600; }
        .ai-text em { font-style: italic; }
        .ai-text ul { padding-left: 20px; }
        .ai-text code { 
            background: #f4f4f4; 
            padding: 2px 5px; 
            border-radius: 4px; 
            font-family: "JetBrains Mono", monospace;
            font-size: 0.9em;
        }
        .error { color: #dc3545; font-weight: bold; }
        .thinking { color: #666; font-style: italic; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      </style>
      <div class="ai-text"></div>
    `;
  }

  static get observedAttributes() {
    return ["prompt", "apikey", "modelname"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "prompt" && newVal) {
      this.generateAIResponse(newVal);
    }
  }

  async generateAIResponse(prompt) {
    const aiResponseElement = this.shadowRoot.querySelector(".ai-text");
    const converter = new showdown.Converter();
    const apiKey = this.getAttribute("apikey");
    const modelName = this.getAttribute("modelname") || "gemini-2.5-flash";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // Show thinking state
    aiResponseElement.innerHTML = '<span class="thinking">Thinking... </span>';

    try {
      this.dispatchEvent(new CustomEvent("genInit", { bubbles: true, composed: true }));

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Render Markdown
      aiResponseElement.innerHTML = converter.makeHtml(text);

      this.dispatchEvent(new CustomEvent("genAIComplete", { bubbles: true, composed: true }));

    } catch (error) {
      console.error(error);
      aiResponseElement.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      this.dispatchEvent(new CustomEvent("genAIComplete", { bubbles: true, composed: true }));
    }
  }
}