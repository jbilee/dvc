import { $, newElem } from "../utilities.js";
import Calculator from "./Calculator.js";
import Favorites from "./Favorites.js";
import Settings from "./Settings.js";
import ModalView from "../view/ModalView.js";
import { dragonList } from "../dd.js";
import { normalTraits, specialTraits } from "../td.js";

class App {
  constructor() {
    this.settings = new Settings();
    const initialSettings = this.settings.getCurrentSettings();
    this.calculator = new Calculator(initialSettings);
    this.favorites = new Favorites();
    this.init(initialSettings);
  }

  init({ priorityOn, prefStat }) {
    // Calculator controls
    const loadedFavs = this.favorites.getFavorites("name");
    this.renderDragonOptions(loadedFavs);
    this.renderTraitOptions();

    // Modal
    ModalView.render();
    if (priorityOn) $("#priority").checked = true;
    if (prefStat !== "none") $(`#pref-${prefStat}`).checked = true;
    this.favorites.render();
    this.addListeners();
  }

  renderDragonOptions(favorites) {
    favorites.forEach((fav) => {
      const newOption = document.createElement("option");
      const {
        name: [nameEn, nameKo],
      } = dragonList.find(({ name: [, nameKo] }) => nameKo === fav);
      newOption.setAttribute("value", nameEn);
      newOption.textContent = `★ ${nameKo}`;
      $("#dragon-selector").append(newOption);
    });

    dragonList.forEach(({ name: [nameEn, nameKo] }) => {
      if (favorites.includes(nameKo)) return;
      const newOption = document.createElement("option");
      newOption.setAttribute("value", nameEn);
      newOption.textContent = nameKo;
      $("#dragon-selector").append(newOption);
    });
  }

  renderTraitOptions() {
    normalTraits.forEach(({ nameEn, nameKo }) => {
      const newOption = document.createElement("option");
      newOption.setAttribute("value", nameEn);
      newOption.textContent = nameKo;
      $("#normal-trait-selector").append(newOption);
    });

    specialTraits.forEach(({ nameEn, nameKo }) => {
      const newOption = document.createElement("option");
      newOption.setAttribute("value", nameEn);
      if (newOption.value === "Dull") newOption.setAttribute("id", nameEn);
      newOption.textContent = nameKo;
      $("#special-trait-selector").append(newOption);
    });
  }

  resetDragonOptions() {
    $("#dragon-selector").innerHTML = "";
    const defaultOption = newElem("option");
    defaultOption.textContent = "드래곤 선택";
    defaultOption.setAttribute("disabled", true);
    defaultOption.setAttribute("selected", true);
    $("#dragon-selector").append(defaultOption);
  }

  addListeners() {
    const settingsBtn = $("#settings");
    settingsBtn.addEventListener("click", () => {
      $(".modal").classList.remove("modal__inactive");
      document.body.setAttribute("style", "overflow: hidden;");
    });

    const select = $("#fav-selector");
    dragonList.forEach(({ name: [, name] }) => {
      const newOption = newElem("option");
      newOption.setAttribute("value", name);
      newOption.textContent = name;
      select.append(newOption);
    });

    const btn = $("#add-fav");
    btn.addEventListener("click", () => {
      const newRow = this.favorites.addFavorites($("#fav-selector").value);
      if (!newRow) return;
      const newRowBtn = newRow.querySelector("button");
      newRowBtn.addEventListener("click", () => {
        this.favorites.removeFavorites(newRow);
        const newFavs = this.favorites.getFavorites("name");
        this.resetDragonOptions();
        this.renderDragonOptions(newFavs);
      });
      const newFavs = this.favorites.getFavorites("name");
      this.resetDragonOptions();
      this.renderDragonOptions(newFavs);
    });

    const currentFavIds = this.favorites.getFavorites("id");
    currentFavIds.forEach((id) => {
      const elem = $(`div[data-id="${id}"]`);
      const deleteBtn = elem.querySelector("button");
      deleteBtn.addEventListener("click", () => {
        this.favorites.removeFavorites(elem);
        const newFavs = this.favorites.getFavorites("name");
        this.resetDragonOptions();
        this.renderDragonOptions(newFavs);
      });
    });

    const priority = $("#priority");
    priority.addEventListener("change", (e) => {
      const priorityStatus = e.target.checked;
      this.settings.updatePriority(priorityStatus);
      this.calculator.updateSettings(this.settings.getCurrentSettings());
    });

    const serious = $("#noserious");
    serious.addEventListener("change", (e) => {
      const seriousStatus = e.target.checked;
      this.settings.updateSerious(seriousStatus);
      this.calculator.updateSettings(this.settings.getCurrentSettings());
    });

    const pref = $("#preferences");
    const prefOptions = pref.firstElementChild.children;
    for (const child of prefOptions) {
      const radioBtn = child.querySelector("input");
      radioBtn.addEventListener("change", (e) => {
        const statName = e.target.value;
        this.settings.updatePreference(statName);
        this.calculator.updateSettings(this.settings.getCurrentSettings());
      });
    }
  }
}

export default App;
