import RewardTable from "./RewardTable.js";
import ScheduleCard from "./ScheduleCard.js";
import { $, newElem } from "../utilities.js";
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

    this.rewards = new RewardTable(this.currentEvent.rewards);

    this.cards = [
      new ScheduleCard(0, this.currentEvent, () => {
        const total = this.cards.reduce((sum, cur) => sum + cur.dailyTotal, 0);
        $(".current-points").textContent = total;
        this.rewards.checkTier(total);
      }),
    ];

    const button = newElem("div");
    button.classList.add("btn-card");
    button.textContent = "+";
    button.addEventListener("click", () => {
      this.createCard();
      // fill card with dragon values of last card in this.cards list
    });

    $(".schedule").append(button);
  }

  createCard() {
    this.cards = [
      ...this.cards,
      new ScheduleCard(this.cards.length, this.currentEvent, () => {
        const total = this.cards.reduce((sum, cur) => sum + cur.dailyTotal, 0);
        $(".current-points").textContent = total;
        this.rewards.checkTier(total);
      }),
    ];
  }
}

export default Schedule;
