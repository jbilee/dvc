import { $, newElem } from "../utilities.js";

class Favorites {
  #favorites;

  constructor() {
    this.#favorites = this.getFromStorage() || [];
  }

  getFromStorage() {
    const storedItem = localStorage.getItem("dvcfvs");
    return JSON.parse(storedItem);
  }

  getNames() {
    const dragonNames = this.#favorites.map((favorite) => favorite.name);
    console.log(dragonNames)
    console.log(dragonNames.sort((a, b) => a.localeCompare(b)))
    return dragonNames.sort((a, b) => a.localeCompare(b));
  }

  saveToStorage() {
    localStorage.setItem("dvcfvs", JSON.stringify(this.#favorites));
  }

  addFavorites(name) {
    const existingData = this.#favorites.find((obj) => obj.name === name);
    if (existingData) return this.renderMessage();

    const id = Date.now().toString();
    this.#favorites.push({ name, id });
    this.renderNewFav(name, id);
    this.saveToStorage();
  }

  removeFavorites(targetId) {
    const targetElem = $(`div[data-id="${targetId}"]`);
    this.#favorites = this.#favorites.filter(({ id }) => id !== targetId);
    targetElem.remove();
    this.saveToStorage();
  }

  renderMessage() {
    "이미 추가한 드래곤입니다.";
  }

  renderNewFav(fav, id) {
    const newRow = newElem("div");
    newRow.dataset.id = id;
    const rowText = newElem("span");
    rowText.textContent = fav;
    const rowBtn = newElem("button");
    rowBtn.textContent = "x";
    newRow.append(rowText, rowBtn);
    $("#favorites").append(newRow);

    rowBtn.addEventListener("click", () => this.removeFavorites(id));
  }

  render() {
    if (this.#favorites.length <= 0) return;

    this.#favorites.forEach(({ name, id }) => this.renderNewFav(name, id));
  }
}

export default Favorites;
