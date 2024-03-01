import { $, newElem } from "../utilities.js";

const EventView = {
  render() {
    const root = $("#root");

    // Main container
    const header = newElem("div");
    header.id = "header";
    header.textContent = "이벤트 시뮬레이터";
    root.append(header);

    const main = newElem("div");
    main.id = "main";
    root.append(main);

    // Rewards section
    const rewardTable = newElem("div");
    rewardTable.classList.add("reward-table");
    main.append(rewardTable);

    // Schedule section
    const schedule = newElem("div");
    schedule.classList.add("schedule");
    main.append(schedule);

    // List of cards
    const cardContainer = newElem("div");
    cardContainer.classList.add("card-container");
    schedule.append(cardContainer);
  },
};

export default EventView;
