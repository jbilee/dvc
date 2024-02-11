import {
  $,
  forceNumberInput,
  validateInput,
  handleDecreaseButton,
  handleIncreaseButton,
} from "../utilities.js";
import { events } from "../../event/data.js";

const NewCard = `<div class="card">hola!</div>`;

const EventView = {
  render() {
    const root = $("#root");

    // Main container
    const header = document.createElement("div");
    header.id = "header";
    header.textContent = "이벤트 시뮬레이터";

    const main = document.createElement("div");
    main.id = "main";

    // Schedule section
    const schedule = document.createElement("div");
    schedule.classList.add("schedule");

    // List of cards
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    // Each schedule card
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    // newCard.innerHTML = ``

    const cardHeader = document.createElement("h4")
    cardHeader.textContent = "D1"
    newCard.append(cardHeader)

    // Fill card with content
    // Missions
    events[0].missions.forEach((mission) => {
      const div = document.createElement("div");
      div.innerHTML = `${mission.action}<br>${
        mission.baseReward
      }포인트<br><button class="btn-input down">▼</button><div class="input-wrapper"><input type="text" inputmode="numeric" placeholder="0"></div><button class="btn-input up">▲</button>/${
        mission.limit > 0 ? mission.limit : "∞"
      }회`;
      newCard.append(div);
      const inputElem = div.querySelector("input");
      inputElem.addEventListener("input", () => forceNumberInput(inputElem));
      inputElem.addEventListener("blur", () =>
        validateInput(inputElem, mission.limit > 0 ? mission.limit : 999999999)
      );

      const downbtn = div.querySelector(".down");
      downbtn.addEventListener("click", () =>
        handleDecreaseButton(inputElem, 0)
      );

      const upbtn = div.querySelector(".up");
      upbtn.addEventListener("click", () =>
        handleIncreaseButton(
          inputElem,
          mission.limit > 0 ? mission.limit : 999999999
        )
      );
    });

    // Bonus dragons
    events[0].bonusDragons.forEach((dragon) => {
      const div = document.createElement("div");
      div.innerHTML = `${dragon} (+ 0%) <button class="btn-input down">▼</button><div class="input-wrapper"><input type="text" inputmode="numeric" placeholder="0"></div><button class="btn-input up">▲</button>마리`;
      newCard.append(div);
    });
    // events[0].bonusDragons.forEach((dragon) => {
    //   const div = document.createElement("div");
    //   div.innerHTML = `${dragon} (+ 0%) <button class="btn-input">▼</button><my-test-input><button class="btn-input">▲</button>마리`;
    //   newCard.append(div);
    // });

    const total = document.createElement("div")
    total.textContent = "총 000포인트"
    newCard.append(total)

    // Add card button
    const button = document.createElement("div");
    button.classList.add("btn-card");
    button.textContent = "+";
    button.addEventListener("click", () => {
      cardContainer.append(NewCard)
    })

    cardContainer.append(newCard);
    schedule.append(cardContainer);
    schedule.append(button);
    main.append(schedule);
    root.append(header);
    root.append(main);
  },
};

export default EventView;
