class Settings {
  #settings;

  constructor() {
    this.#settings = this.getFromStorage() || {
      priorityOn: false,
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
  }

  updatePreference(selection) {
    this.#settings.prefStat = selection;
    localStorage.setItem("dvct_d", JSON.stringify(this.#settings));
  }
}

export default Settings;
