import { displayToast } from "../utilities.js";

class Settings {
  #settings;

  constructor() {
    this.#settings = this.getFromStorage() || {
      priorityOn: true,
      prefStat: "none",
    };
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
    displayToast("설정이 저장됐습니다.", 2000);
  }

  updatePreference(selection) {
    this.#settings.prefStat = selection;
    localStorage.setItem("dvct_d", JSON.stringify(this.#settings));
    displayToast("설정이 저장됐습니다.", 2000);
  }
}

export default Settings;
