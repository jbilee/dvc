class InputBox extends HTMLElement {
  static observedAttributes = ["boxlength", "boxcolor", "cap"];

  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");

    const container = document.createElement("div");
    container.setAttribute("class", "container");
    container.innerHTML = `<input class="input-field" type="number" inputmode="numeric" min="0" value="0">`;

    wrapper.append(container);
    shadow.append(wrapper);

    const style = document.createElement("style");
    style.textContent = `
      .wrapper {
        box-sizing: border-box;
      }
      .container {
        border-radius: 6px;
        background: rgb(237, 240, 240);
        padding: 6px 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      input {
        background: transparent;
        border: none;
        width: 100%;
        height: 100%;
        text-align: center;
      }
    `;

    shadow.append(style);
    this.initializeAttributes();
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (this.shadowRoot === null) return;

    const shadow = this.shadowRoot;

    switch (attribute) {
      case "boxlength": {
        const container = shadow.querySelector(".wrapper");
        container.setAttribute("style", `width:${newValue};`);
        return;
      }
      case "boxcolor": {
        const container = shadow.querySelector(".container");
        container.setAttribute("style", `background:${newValue};`);
        return;
      }
      case "cap": {
        const inputField = shadow.querySelector("input");
        inputField.setAttribute("max", newValue);
        return;
      }
      default:
    }
  }

  initializeAttributes() {
    const attributes = ["boxlength", "boxcolor", "cap"];
    attributes.forEach((attribute) => {
      if (this.getAttribute(attribute))
        this.attributeChangedCallback(
          attribute,
          null,
          this.getAttribute(attribute)
        );
    });
  }
}

export default InputBox;
