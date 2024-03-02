import { $, newElem } from "../utilities.js";
import Calculator from "./Calculator.js";
import Favorites from "./Favorites.js";
import Settings from "./Settings.js";
import ModalView from "../view/ModalView.js";

class App {
  constructor() {
    this.calculator = new Calculator();
    this.settings = new Settings();
    this.favorites = new Favorites();
    this.init();
  }

  init() {
    ModalView.render();
    this.addListeners();
    this.favorites.render();
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
