import { $, newElem } from "../utilities.js";
import copyResults from "../../calc/toolcommands.js";
import Calculator from "./Calculator.js";
import Favorites from "./Favorites.js";
import Settings from "./Settings.js";
import ModalView from "../view/ModalView.js";
import CalculatorView from "../view/CalculatorView.js";
import { dragonList } from "../dd.js";
import { normalTraits, specialTraits } from "../td.js";

class App {
  constructor() {
    this.fixUserData();
    this.settings = new Settings();
    const initialSettings = this.settings.getCurrentSettings();
    this.language = initialSettings.language;
    this.renderApp();
    this.calculator = new Calculator(initialSettings);
    this.favorites = new Favorites();
    this.init(initialSettings);
  }

  fixUserData() {
    const storageData = JSON.parse(localStorage.getItem("dvcfvs"));
    if (!storageData || storageData.length <= 0) return;
    const faultyData1 = storageData.find((obj) => obj.nameEn === "Gandharba");
    const faultyData2 = storageData.find((obj) => obj.nameEn === "Gautling-Gon");
    const faultyData3 = storageData.find((obj) => obj.nameEn === "Gold Pike");
    const faultyData4 = storageData.find((obj) => obj.nameEn === "Devilgon");
    const faultyData5 = storageData.find((obj) => obj.nameEn === "Lattegon");
    const faultyData6 = storageData.find((obj) => obj.nameEn === "Lalux");
    const faultyData7 = storageData.find((obj) => obj.nameEn === "Lambgon");
    const faultyData8 = storageData.find((obj) => obj.nameEn === "Rose Gold");
    const faultyData9 = storageData.find((obj) => obj.nameEn === "Libro");
    const faultyData10 = storageData.find((obj) => obj.nameEn === "Manimekalai");
    const faultyData11 = storageData.find((obj) => obj.nameEn === "Mushroom Knight");
    const faultyData12 = storageData.find((obj) => obj.nameEn === "Mystictiny");
    const faultyData13 = storageData.find((obj) => obj.nameEn === "Hedgebat");
    const faultyData14 = storageData.find((obj) => obj.nameEn === "Venom");
    const faultyData15 = storageData.find((obj) => obj.nameEn === "Vonsharkgon");
    const faultyData16 = storageData.find((obj) => obj.nameEn === "Bonehead");
    const faultyData17 = storageData.find((obj) => obj.nameEn === "Shadow");
    const faultyData18 = storageData.find((obj) => obj.nameEn === "Serpent Flower");
    const faultyData19 = storageData.find((obj) => obj.nameEn === "Skelegon");
    const faultyData20 = storageData.find((obj) => obj.nameEn === "Six-leg Horn");
    const faultyData21 = storageData.find((obj) => obj.nameEn === "Iguagon");
    const faultyData22 = storageData.find((obj) => obj.nameEn === "Caracen");
    const faultyData23 = storageData.find((obj) => obj.nameEn === "Catsgon");
    const faultyData24 = storageData.find((obj) => obj.nameEn === "Qualle");
    const faultyData25 = storageData.find((obj) => obj.nameEn === "Tutankhagon");
    const faultyData26 = storageData.find((obj) => obj.nameEn === "Pharaogon");
    const faultyData27 = storageData.find((obj) => obj.nameEn === "Enoki Mushroom Dragon");
    const faultyData28 = storageData.find((obj) => obj.nameEn === "White Gold");
    const faultyData29 = storageData.find((obj) => obj.nameEn === "Hydragon");
    if (faultyData1) {
      console.log("Fixing Gandharba...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Gandharba");
      storageData[index].nameEn = "Gandharva";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData2) {
      console.log("Fixing Gautling-Gon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Gautling-Gon");
      storageData[index].nameEn = "Gatling-Gun Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData3) {
      console.log("Fixing Gold Pike...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Gold Pike");
      storageData[index].nameEn = "Goldpike";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData4) {
      console.log("Fixing Devilgon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Devilgon");
      storageData[index].nameEn = "Devil Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData5) {
      console.log("Fixing Lattegon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Lattegon");
      storageData[index].nameEn = "Latte Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData6) {
      console.log("Fixing Lalux...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Lalux");
      storageData[index].nameEn = "La Lux";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData7) {
      console.log("Fixing Lambgon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Lambgon");
      storageData[index].nameEn = "Lamb Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData8) {
      console.log("Fixing Rose Gold...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Rose Gold");
      storageData[index].nameEn = "Rose Gold Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData9) {
      console.log("Fixing Libro...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Libro");
      storageData[index].nameEn = "Libro Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData10) {
      console.log("Fixing Manimekalai...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Manimekalai");
      storageData[index].nameEn = "Manimekhala";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData11) {
      console.log("Fixing Mushroom Knight...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Mushroom Knight");
      storageData[index].nameEn = "Mushroom Knight Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData12) {
      console.log("Fixing Mystictiny...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Mystictiny");
      storageData[index].nameEn = "Mystic Tiny";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData13) {
      console.log("Fixing Hedgebat...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Hedgebat");
      storageData[index].nameEn = "Hedgebat Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData14) {
      console.log("Fixing Venom...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Venom");
      storageData[index].nameEn = "Venom Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData15) {
      console.log("Fixing Vonsharkgon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Vonsharkgon");
      storageData[index].nameEn = "Vonshark Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData16) {
      console.log("Fixing Bonehead...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Bonehead");
      storageData[index].nameEn = "Bone Head";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData17) {
      console.log("Fixing Shadow...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Shadow");
      storageData[index].nameEn = "Shadow Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData18) {
      console.log("Fixing Serpent Flower...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Serpent Flower");
      storageData[index].nameEn = "Serpent Flower Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData19) {
      console.log("Fixing Skelegon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Skelegon");
      storageData[index].nameEn = "Skeleton Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData20) {
      console.log("Fixing Six-leg Horn...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Six-leg Horn");
      storageData[index].nameEn = "Six-Leg Horn";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData21) {
      console.log("Fixing Iguagon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Iguagon");
      storageData[index].nameEn = "Iguana Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData22) {
      console.log("Fixing Caracen...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Caracen");
      storageData[index].nameEn = "Characen";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData23) {
      console.log("Fixing Catsgon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Catsgon");
      storageData[index].nameEn = "Cat Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData24) {
      console.log("Fixing Qualle...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Qualle");
      storageData[index].nameEn = "Quale";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData25) {
      console.log("Fixing Tutankhagon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Tutankhagon");
      storageData[index].nameEn = "Tutankha Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData26) {
      console.log("Fixing Pharaogon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Pharaogon");
      storageData[index].nameEn = "Pharaoh Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData27) {
      console.log("Fixing Enoki Mushroom Dragon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Enoki Mushroom Dragon");
      storageData[index].nameEn = "Enoki Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData28) {
      console.log("Fixing White Gold...");
      const index = storageData.findIndex((obj) => obj.nameEn === "White Gold");
      storageData[index].nameEn = "White Gold Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
    if (faultyData29) {
      console.log("Fixing Hydragon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Hydragon");
      storageData[index].nameEn = "Hydra Dragon";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    }
  }

  init({ priorityOn, noSerious, prefStat, language }) {
    // Calculator controls
    const loadedFavs = this.favorites.getFavorites(language);
    this.renderDragonOptions(loadedFavs);
    this.renderTraitOptions();

    // Modal
    if (language === "ko") {
      ModalView.renderKo();
      $("#lang-ko").classList.add("lang__selected");
    } else {
      ModalView.renderEn();
      $("#lang-en").classList.add("lang__selected");
    }
    if (priorityOn) $("#priority").checked = true;
    if (noSerious) $("#noserious").checked = true;
    if (prefStat !== "none") $(`#pref-${prefStat}`).checked = true;
    this.favorites.render(language);
    this.addListeners();

    // Clipboard
    $("#btn-clipboard").addEventListener("click", () => copyResults(language));
  }

  renderApp() {
    if (this.language === "ko") {
      const css = newElem("link");
      css.rel = "stylesheet";
      css.href = "./index.css";
      document.head.append(css);
      return CalculatorView.renderKo();
    }
    const css = newElem("link");
    css.rel = "stylesheet";
    css.href = "./en.css";
    document.head.append(css);
    return CalculatorView.renderEn();
  }

  renderDragonOptions(favorites) {
    favorites.forEach(({ nameEn, nameKo }) => {
      const newOption = newElem("option");
      newOption.setAttribute("value", nameEn);
      newOption.textContent = `★ ${this.language === "ko" ? nameKo : nameEn}`;
      $("#dragon-selector").append(newOption);
    });

    if (this.language === "ko") {
      dragonList.forEach(({ name: [nameEn, nameKo] }) => {
        if (favorites.includes(nameEn)) return;
        const newOption = newElem("option");
        newOption.setAttribute("value", nameEn);
        newOption.textContent = nameKo;
        $("#dragon-selector").append(newOption);
      });
    } else {
      const sortedNames = dragonList.map(({ name }) => name[0]).sort((a, b) => (a > b ? 1 : -1));
      const sortedDragons = sortedNames.map((nameEn) => dragonList.find(({ name }) => name.includes(nameEn)));
      sortedDragons.forEach(({ name: [nameEn] }) => {
        if (favorites.includes(nameEn)) return;
        const newOption = newElem("option");
        newOption.setAttribute("value", nameEn);
        newOption.textContent = nameEn;
        $("#dragon-selector").append(newOption);
      });
    }
  }

  renderTraitOptions() {
    normalTraits.forEach(({ nameEn, nameKo }) => {
      const newOption = newElem("option");
      newOption.setAttribute("value", nameEn);
      newOption.textContent = this.language === "ko" ? nameKo : nameEn;
      $("#normal-trait-selector").append(newOption);
    });

    if (this.language === "ko") {
      specialTraits.forEach(({ nameEn, nameKo }) => {
        const newOption = newElem("option");
        newOption.setAttribute("value", nameEn);
        if (newOption.value === "Dull") newOption.setAttribute("id", nameEn);
        newOption.textContent = this.language === "ko" ? nameKo : nameEn;
        $("#special-trait-selector").append(newOption);
      });
    } else {
      const sortedNames = specialTraits.map((item) => item.nameEn).sort((a, b) => (a > b ? 1 : -1));
      const sortedTraits = sortedNames.map((name) => specialTraits.find(({ nameEn }) => nameEn === name));
      sortedTraits.forEach(({ nameEn, nameKo }) => {
        const newOption = newElem("option");
        newOption.setAttribute("value", nameEn);
        if (newOption.value === "Dull") newOption.setAttribute("id", nameEn);
        newOption.textContent = this.language === "ko" ? nameKo : nameEn;
        $("#special-trait-selector").append(newOption);
      });
    }
  }

  resetDragonOptions() {
    $("#dragon-selector").innerHTML = "";
    const defaultOption = newElem("option");
    defaultOption.textContent = this.language === "ko" ? "드래곤 선택" : "Select dragon";
    defaultOption.setAttribute("disabled", true);
    defaultOption.setAttribute("selected", true);
    $("#dragon-selector").append(defaultOption);
  }

  addListeners() {
    const settingsBtn = $("#settings");
    settingsBtn.addEventListener("click", () => {
      $(".modal").classList.remove("modal__inactive");
      $("body").style.overflow = "hidden";
      $("html").style.paddingRight = "17px";
    });

    const select = $("#fav-selector");
    if (this.language === "ko") {
      dragonList.forEach(({ name: [nameEn, nameKo] }) => {
        const newOption = newElem("option");
        newOption.setAttribute("value", nameEn);
        newOption.textContent = nameKo;
        select.append(newOption);
      });
    } else {
      const sortedNames = dragonList.map(({ name }) => name[0]).sort((a, b) => (a > b ? 1 : -1));
      const sortedDragons = sortedNames.map((nameEn) => dragonList.find(({ name }) => name.includes(nameEn)));
      sortedDragons.forEach(({ name: [nameEn] }) => {
        const newOption = newElem("option");
        newOption.setAttribute("value", nameEn);
        newOption.textContent = nameEn;
        select.append(newOption);
      });
    }

    const btn = $("#add-fav");
    btn.addEventListener("click", () => {
      const newRow = this.favorites.addFavorites($("#fav-selector").value, this.language);
      if (!newRow) return;
      const newRowBtn = newRow.querySelector("button");
      newRowBtn.addEventListener("click", () => {
        this.favorites.removeFavorites(newRow, this.language);
        const newFavs = this.favorites.getFavorites(this.language);
        this.resetDragonOptions();
        this.renderDragonOptions(newFavs);
      });
      const newFavs = this.favorites.getFavorites(this.language);
      this.resetDragonOptions();
      this.renderDragonOptions(newFavs);
    });

    const currentFavIds = this.favorites.getFavoriteIds();
    currentFavIds.forEach((id) => {
      const elem = $(`div[data-id="${id}"]`);
      const deleteBtn = elem.querySelector("button");
      deleteBtn.addEventListener("click", () => {
        this.favorites.removeFavorites(elem, this.language);
        const newFavs = this.favorites.getFavorites(this.language);
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

    const langEn = $("#lang-en");
    langEn.addEventListener("click", () => {
      if (this.language === "en-US") return;
      this.settings.updateLanguage("en-US");
      location.reload();
    });

    const langKo = $("#lang-ko");
    langKo.addEventListener("click", () => {
      if (this.language === "ko") return;
      this.settings.updateLanguage("ko");
      location.reload();
    });
  }
}

export default App;
