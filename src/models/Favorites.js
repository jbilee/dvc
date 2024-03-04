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

  getFavorites(key) {
    const favorites = this.#favorites.map((favorite) => favorite[key]);
    if (key === "name") return favorites.sort((a, b) => a.localeCompare(b));
    return favorites;
  }

  saveToStorage() {
    localStorage.setItem("dvcfvs", JSON.stringify(this.#favorites));
  }

  addFavorites(name) {
    const existingData = this.#favorites.find((obj) => obj.name === name);
    if (existingData) return this.renderMessage();

    const id = Date.now().toString();
    this.#favorites.push({ name, id });
    const newRow = this.renderNewFav(name, id);
    this.saveToStorage();

    return newRow;
  }

  removeFavorites(targetElem) {
    const targetId = targetElem.dataset.id;
    this.#favorites = this.#favorites.filter(({ id }) => id !== targetId);
    targetElem.remove();
    this.saveToStorage();
  }

  renderMessage() {
    "이미 추가한 드래곤입니다.";
  }

  renderNewFav(fav, id) {
    const newRow = newElem("div");
    newRow.classList.add("favorites-row");
    newRow.dataset.id = id;
    const rowText = newElem("span");
    rowText.textContent = fav;
    const rowBtn = newElem("button");
    rowBtn.textContent = "x";
    newRow.append(rowText, rowBtn);
    $("#favorites").append(newRow);

    // rowBtn.addEventListener("click", () => this.removeFavorites(id));

    return newRow;
  }

  render() {
    if (this.#favorites.length <= 0) return;

    this.#favorites.forEach(({ name, id }) => this.renderNewFav(name, id));
  }
}

export default Favorites;
