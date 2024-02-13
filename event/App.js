import Schedule from "../src/models/Schedule.js";
import EventView from "../src/view/EventView.js";
import { $, newElem } from "../src/utilities.js";
import { events } from "./data.js";

class App {
  constructor() {
    this.init();
    this.schedule = new Schedule();
  }

  init() {
    EventView.render();
    const mainElem = $("#header");
    const selectElem = newElem("select");

    events.forEach((event) => {
      const newOption = newElem("option");
      newOption.value = event.theme;
      newOption.textContent = event.title;
      selectElem.append(newOption);
    });
    // Selects latest event by default on load
    selectElem.selectedIndex = selectElem.length - 1;
    mainElem.append(selectElem);
  }
}

export default App;
