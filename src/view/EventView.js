import { $ } from "../utilities.js";
import { events } from "../../event/data.js";
import CardView from "./CardView.js";

const NewCard = `<div class="card">hola!</div>`;

const EventView = {
  render() {
    const root = $("#root");

    // Main container
    const header = document.createElement("div");
    header.id = "header";
    header.textContent = "이벤트 시뮬레이터";
    root.append(header);

    const main = document.createElement("div");
    main.id = "main";
    root.append(main);

    // Schedule section
    const schedule = document.createElement("div");
    schedule.classList.add("schedule");
    main.append(schedule);

    // List of cards
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    schedule.append(cardContainer);

    // // Get current event
    // const currentEvent = events[0];
    // // CardView.render(currentEvent.missions, currentEvent.bonusDragons);

    // // Add card button
    // const button = document.createElement("div");
    // button.classList.add("btn-card");
    // button.textContent = "+";
    // button.addEventListener("click", () => {
    //   CardView.render(currentEvent.missions, currentEvent.bonusDragons);
    // });

    // schedule.append(button);
  },
};

export default EventView;
