import { displayToast } from "../utilities.js";

class Settings {
  #settings;

  constructor() {
    this.#settings = this.getFromStorage() || {
      noSerious: false,
      priorityOn: true,
      prefStat: "none",
      language: this.getLanguage(),
    };
  }

  getLanguage() {
    const userLanguage = window.navigator.language;
    if (userLanguage === "ko" || userLanguage === "ko-KR") return "ko";
    else return "en-US";
  }

  getFromStorage() {
    const storedItem = localStorage.getItem("dvct_d");
    return JSON.parse(storedItem);
  }

  getCurrentSettings() {
    return this.#settings;
  }

  updatePriority(selection) {
    this.#settings.priorityOn = selection;
    localStorage.setItem("dvct_d", JSON.stringify(this.#settings));
    displayToast(this.#settings.language === "ko" ? "설정이 저장됐습니다." : "Saved changes.", 2000);
  }

  updateSerious(selection) {
    this.#settings.noSerious = selection;
    localStorage.setItem("dvct_d", JSON.stringify(this.#settings));
    displayToast(this.#settings.language === "ko" ? "설정이 저장됐습니다." : "Saved changes.", 2000);
  }

  updatePreference(selection) {
    this.#settings.prefStat = selection;
    localStorage.setItem("dvct_d", JSON.stringify(this.#settings));
    displayToast(this.#settings.language === "ko" ? "설정이 저장됐습니다." : "Saved changes.", 2000);
  }

  updateLanguage(language) {
    this.#settings.language = language;
    localStorage.setItem("dvct_d", JSON.stringify(this.#settings));
  }
}

export default Settings;
