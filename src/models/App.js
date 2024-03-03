import { $, newElem } from "../utilities.js";
import Calculator from "./Calculator.js";
import Favorites from "./Favorites.js";
import Settings from "./Settings.js";
import ModalView from "../view/ModalView.js";
import { dragonList } from "../dd.js";
import { normalTraits, specialTraits } from "../td.js";

class App {
  constructor() {
    this.calculator = new Calculator();
    this.settings = new Settings();
    this.favorites = new Favorites();
    this.init();
  }

  init() {
    // Calculator controls
    const loadedFavs = this.favorites.getNames();
    this.renderDragonOptions(loadedFavs);
    this.renderTraitOptions();

    // Modal
    ModalView.render();
    this.addListeners();
    this.favorites.render();
  }

  renderDragonOptions(favorites) {
    favorites.forEach((name) => {
      const newOption = document.createElement("option");
      newOption.setAttribute("value", name);
      newOption.textContent = "★" + name;
      document.querySelector("#dragon-selector").append(newOption);
    });

    dragonList.forEach(({ name: [nameEn, nameKo] }) => {
      if (favorites.includes(nameKo)) return;
      const newOption = document.createElement("option");
      newOption.setAttribute("value", nameEn);
      newOption.textContent = nameKo;
      document.querySelector("#dragon-selector").append(newOption);
    });
  }

  renderTraitOptions() {
    normalTraits.forEach(({ nameEn, nameKo }) => {
      const newOption = document.createElement("option");
      newOption.setAttribute("value", nameEn);
      newOption.textContent = nameKo;
      document.querySelector("#normal-trait-selector").append(newOption);
    });

    specialTraits.forEach(({ nameEn, nameKo }) => {
      const newOption = document.createElement("option");
      newOption.setAttribute("value", nameEn);
      if (newOption.value === "Dull") newOption.setAttribute("id", nameEn);
      newOption.textContent = nameKo;
      document.querySelector("#special-trait-selector").append(newOption);
    });
  }

  addListeners() {
    const select = $("#fav-selector");
    dragonList.forEach(({ name: [, name] }) => {
      const newOption = newElem("option");
      newOption.setAttribute("value", name);
      newOption.textContent = name;
      select.append(newOption);
    });

    const btn = $("#add-fav");
    btn.addEventListener("click", () => {
      this.favorites.addFavorites($("#fav-selector").value);
    });
  }
}

export default App;
