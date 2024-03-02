import RewardTable from "./RewardTable.js";
import ScheduleCard from "./ScheduleCard.js";
import { $, newElem } from "../utilities.js";
import { events } from "../../event/data.js";

class Schedule {
  constructor() {
    this.idCounter = 0;
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
      new ScheduleCard(
        null,
        0,
        this.idCounter++,
        this.currentEvent,
        () => {
          const total = this.cards.reduce(
            (sum, cur) => sum + cur.dailyTotal,
            0
          );
          $(".current-points").textContent = total;
          this.rewards.checkTier(total);
        },
        (id) => this.deleteCard(id)
      ),
    ];

    const button = newElem("div");
    button.classList.add("btn-card");
    button.textContent = "+";
    button.addEventListener("click", () => {
      if (this.cards.length >= this.currentEvent.eventPeriod)
        return alert("이벤트 기간을 초과할 수 없습니다.");
      this.createCard();
    });

    $(".schedule").append(button);
  }

  deleteCard(targetId) {
    if (this.cards.length === 1) return true;
    this.cards = this.cards.filter((card) => card.id !== targetId);
    return false;
  }

  createCard() {
    const lastCard = this.cards[this.cards.length - 1];
    const prevData = {dragonCount: lastCard.dragonCount, bonusPercentages: lastCard.bonusPercentages}
    this.cards = [
      ...this.cards,
      new ScheduleCard(
        prevData,
        this.cards.length,
        this.idCounter++,
        this.currentEvent,
        () => {
          const total = this.cards.reduce(
            (sum, cur) => sum + cur.dailyTotal,
            0
          );
          $(".current-points").textContent = total;
          this.rewards.checkTier(total);
        },
        (id) => this.deleteCard(id)
      ),
    ];
  }
}

export default Schedule;
