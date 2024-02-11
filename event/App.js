import EventView from "../src/view/EventView.js";
import { $ } from "../src/utilities.js";
import { events } from "./data.js";

class App {
  constructor() {
    this.init();
  }

  init() {
    EventView.render();
    const mainElem = $("#header");
    const selectElem = document.createElement("select");

    const newOption = document.createElement("option");
    newOption.value = "none";
    newOption.textContent = "dfalskdjf";
    selectElem.append(newOption);

    events.forEach((event) => {
      const newOption = document.createElement("option");
      newOption.value = event.theme;
      newOption.textContent = event.title;
      selectElem.append(newOption);
    });

    mainElem.append(selectElem);
  }
}

export default App;
