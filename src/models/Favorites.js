import { $, displayToast, newElem } from "../utilities.js";

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

  addFavorites(name, lang) {
    const existingData = this.#favorites.find((obj) => obj.name === name);
    if (existingData) return this.renderMessage(lang);

    const id = Date.now().toString();
    this.#favorites.push({ name, id });
    if (this.#favorites.length === 1) $("#favorites").innerHTML = "";
    const newRow = this.renderNewFav(name, id, lang);
    this.saveToStorage();
    displayToast(
      lang === "ko" ? "설정이 저장됐습니다." : "Saved changes.",
      2000
    );
    return newRow;
  }

  removeFavorites(targetElem, lang) {
    const targetId = targetElem.dataset.id;
    this.#favorites = this.#favorites.filter(({ id }) => id !== targetId);
    targetElem.remove();
    if (this.#favorites.length === 0) {
      const parentElem = $("#favorites");
      const newElem = newElem("div");
      newElem.id = "fav-default";
      newElem.textContent =
        lang === "ko" ? "즐겨찾기한 드래곤이 없습니다." : "No Favorites";
      parentElem.append(newElem);
    }
    this.saveToStorage();
    displayToast(
      lang === "ko" ? "설정이 저장됐습니다." : "Saved changes.",
      2000
    );
  }

  renderMessage(lang) {
    displayToast(
      lang === "ko" ? "이미 추가한 드래곤입니다." : "Already in Favorites.",
      2000
    );
  }

  renderNewFav(fav, id, lang) {
    const newRow = newElem("div");
    newRow.classList.add("favorites-row");
    newRow.dataset.id = id;
    const rowText = newElem("span");
    rowText.textContent = fav;
    const rowBtn = newElem("button");
    rowBtn.textContent = lang === "ko" ? "삭제" : "Remove";
    newRow.append(rowText, rowBtn);
    $("#favorites").append(newRow);
    return newRow;
  }

  render(lang) {
    if (this.#favorites.length <= 0) return;

    $("#favorites").innerHTML = "";
    this.#favorites.forEach(({ name, id }) =>
      this.renderNewFav(name, id, lang)
    );
  }
}

export default Favorites;
