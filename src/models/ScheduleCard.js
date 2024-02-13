import {
  $,
  forceNumberInput,
  handleDecreaseButton,
  handleIncreaseButton,
} from "../utilities.js";
import { events } from "../../event/data.js";

class ScheduleCard {
  constructor(currentEvent) {
    this.actionCount = Array(5).fill(0);
    this.dragonCount = Array(6).fill(0);
    console.log("card instance created");
    this.render(currentEvent.missions, currentEvent.bonusDragons);
  }

  validateInput(value, limit) {
    if (Number(value) > limit) return limit;
    return Number(value);
  }

  calculatePercentage() {
    return 200;
  }

  calculatePoints() {
    const multiplier = this.calculatePercentage() / 100;
    const result =
      multiplier *
      this.actionCount.reduce(
        (sum, cur, i) => sum + cur * events[0].missions[i].baseReward,
        0
      );
    $(".total-points").textContent = result;
  }

  render(missions, dragons) {
    // Each schedule card
    const newCard = document.createElement("div");
    newCard.classList.add("card");

    // Fill card with content
    missions.forEach((mission, i) => {
      const div = document.createElement("div");
      div.classList.add("card-row", "card__mission");
      div.innerHTML = `${mission.action}<br>${
        mission.baseReward
      }포인트<br><button class="btn-input down">▼</button><div class="input-wrapper"><input type="text" inputmode="numeric" placeholder="0"></div><button class="btn-input up">▲</button>/${
        mission.limit > 0 ? mission.limit : "∞"
      }회`;
      newCard.append(div);
      const inputElem = div.querySelector("input");
      inputElem.addEventListener("input", () => forceNumberInput(inputElem));
      inputElem.addEventListener("blur", () => {
        const result = this.validateInput(
          inputElem.value,
          mission.limit > 0 ? mission.limit : 999999999
        );
        inputElem.value = result;
        this.actionCount[i] = result;
      });

      const downbtn = div.querySelector(".down");
      downbtn.addEventListener("click", () => {
        handleDecreaseButton(inputElem, 0);
        this.actionCount[i] = Number(inputElem.value);
      });

      const upbtn = div.querySelector(".up");
      upbtn.addEventListener("click", () => {
        handleIncreaseButton(
          inputElem,
          mission.limit > 0 ? mission.limit : 999999999
        );
        this.actionCount[i] = Number(inputElem.value);
      });
    });

    // Bonus dragons
    dragons.forEach((dragon, i) => {
      const div = document.createElement("div");
      div.classList.add("card-row", "card__dragon");
      div.innerHTML = `${dragon} (+ 0%) <button class="btn-input down">▼</button><div class="input-wrapper"><input type="text" inputmode="numeric" placeholder="0"></div><button class="btn-input up">▲</button>마리`;
      newCard.append(div);

      const inputElem = div.querySelector("input");
      inputElem.addEventListener("input", () => forceNumberInput(inputElem));
      inputElem.addEventListener("blur", () => {
        const result = this.validateInput(inputElem.value, 100);
        inputElem.value = result;
        this.dragonCount[i] = result;
      });

      const downbtn = div.querySelector(".down");
      downbtn.addEventListener("click", () => {
        handleDecreaseButton(inputElem, 0);
        this.dragonCount[i] = Number(inputElem.value);
      });

      const upbtn = div.querySelector(".up");
      upbtn.addEventListener("click", () => {
        handleIncreaseButton(inputElem, 100);
        this.dragonCount[i] = Number(inputElem.value);
      });
    });

    // For test purposes; delete later
    const testbtn = document.createElement("button");
    testbtn.classList.add("mytest");
    testbtn.textContent = "Test";
    newCard.append(testbtn);
    testbtn.addEventListener("click", () => {
      console.log("missions completed");
      console.log(this.actionCount);
      console.log("bonus added");
      console.log(this.dragonCount);
    });

    const testbtn2 = document.createElement("button");
    testbtn2.textContent = "Calculate";
    newCard.append(testbtn2);
    testbtn2.addEventListener("click", () => {
      console.log("calculating...");
      this.calculatePoints();
    });

    const percentage = document.createElement("div");
    percentage.innerHTML = `보너스: <span class="percentage-points">0</span>%`;
    newCard.append(percentage);

    const total = document.createElement("div");
    total.innerHTML = `일일 합계: <span class="total-points">0</span>`;
    newCard.append(total);

    $(".card-container").append(newCard);
  }

  addHandlers(card) {
    //test
    $(".mytest").addEventListener("click", () => {
      console.log("missions completed");
      console.log(this.actionCount);
      console.log("bonus added");
      console.log(this.dragonCount);
    });
    //

    const missionRows = card.querySelectorAll(".card__mission");
    missionRows.forEach((row, i) => {
      const input = row.querySelector("input");
      row
        .querySelector(".down")
        .addEventListener("click", () => (this.actionCount[i] -= 1));
      row
        .querySelector(".up")
        .addEventListener("click", () => (this.actionCount[i] += 1));
      input.addEventListener(
        "change",
        (e) => (this.actionCount[i] = Number(e.target.value))
      );
    });

    const bonusRows = card.querySelectorAll(".card__dragon");
    bonusRows.forEach((row, i) => {
      const input = row.querySelector("input");
      row
        .querySelector(".down")
        .addEventListener("click", () => this.handlePointChange(i, decrease));
      row
        .querySelector(".up")
        .addEventListener("click", () => this.handlePointChange(i, increase));
    });
  }

  handlePercentageChange(i, operation) {
    switch (operation) {
      case "increase": {
        this.dragonCount[i] += 1;
        return;
      }
      case "decrease": {
        this.dragonCount[i] -= 1;
        return;
      }
      default: {
        this.dragonC;
      }
    }
    console.log(this.dragonCount);
  }

  handlePointChange(i, operation) {
    switch (operation) {
      case "increase": {
        this.actionCount[i] += 1;
        return;
      }
      case "decrease": {
        this.actionCount[i] -= 1;
        return;
      }
      default:
    }
    console.log(this.actionCount);
  }
}

export default ScheduleCard;
