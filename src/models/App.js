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
    const faultyData1 = storageData.find((obj) => obj.nameKo === "페이몬");
    const faultyData2 = storageData.find((obj) => obj.nameEn === "Haemagon");
    if (faultyData1) {
      console.log("Fixing 페이몬...");
      const index = storageData.findIndex((obj) => obj.nameKo === "페이몬");
      storageData[index].nameKo = "파이몬";
      localStorage.setItem("dvcfvs", JSON.stringify(storageData));
    } else if (faultyData2) {
      console.log("Fixing Haemagon...");
      const index = storageData.findIndex((obj) => obj.nameEn === "Haemagon");
      storageData[index].nameEn = "Seahorse Dragon";
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
