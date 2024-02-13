import ScheduleCard from "./ScheduleCard.js";
import { $ } from "../utilities.js";
import { events } from "../../event/data.js";

class Schedule {
  constructor() {
    this.init();
  }

  init() {
    // Read event selector value
    const currentTheme = $("select").value;

    // Fetch corresponding event index
    this.currentEvent = events.filter(
      (event) => event.theme === currentTheme
    )[0];

    this.cards = [new ScheduleCard(this.currentEvent)];

    const button = document.createElement("div");
    button.classList.add("btn-card");
    button.textContent = "+";
    button.addEventListener("click", () => {
      this.createCard();
      // fill card with dragon values of last card in this.cards list
    });

    $(".schedule").append(button);
  }

  createCard() {
    this.cards = [...this.cards, new ScheduleCard(this.currentEvent)];
  }
}

export default Schedule;
