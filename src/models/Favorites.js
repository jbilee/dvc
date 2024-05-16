import { $, displayToast, newElem } from "../utilities.js";
import { dragonList } from "../dd.js";

class Favorites {
  #favorites;

  constructor() {
    this.#favorites = this.getFromStorage() || [];
  }

  getFromStorage() {
    const storedItem = localStorage.getItem("dvcfvs");
    return JSON.parse(storedItem);
  }

  getFavorites(lang) {
    const favorites = this.#favorites.map(({ nameEn, nameKo }) => ({
      nameEn,
      nameKo,
    }));
    if (lang === "ko") {
      const names = favorites.map(({ nameKo }) => nameKo);
      names.sort((a, b) => a.localeCompare(b));
      return names.map((name) => favorites.find((fav) => fav.nameKo === name));
    } else {
      const names = favorites.map(({ nameEn }) => nameEn);
      names.sort((a, b) => a.localeCompare(b));
      return names.map((name) => favorites.find((fav) => fav.nameEn === name));
    }
  }

  getFavoriteIds() {
    const favorites = this.#favorites.map((fav) => fav.id);
    return favorites;
  }

  saveToStorage() {
    localStorage.setItem("dvcfvs", JSON.stringify(this.#favorites));
  }

  addFavorites(name, lang) {
    const existingData = this.#favorites.find(({ nameEn }) => nameEn === name);
    if (existingData) return this.renderMessage(lang);

    const id = Date.now().toString();
    const nameEn = name;
    const nameKo = dragonList.find(({ name }) => name.includes(nameEn)).name[1];
    this.#favorites.push({ nameEn, nameKo, id });
    if (this.#favorites.length === 1) $("#favorites").innerHTML = "";
    const newRow = this.renderNewFav({ nameEn, nameKo, id }, lang);
    this.saveToStorage();
    displayToast(lang === "ko" ? "설정이 저장됐습니다." : "Saved changes.", 2000);
    return newRow;
  }

  removeFavorites(targetElem, lang) {
    const targetId = targetElem.dataset.id;
    this.#favorites = this.#favorites.filter(({ id }) => id !== targetId);
    targetElem.remove();
    if (this.#favorites.length === 0) {
      const parentElem = $("#favorites");
      const defaultElem = newElem("div");
      defaultElem.id = "fav-default";
      defaultElem.textContent = lang === "ko" ? "즐겨찾기한 드래곤이 없습니다." : "No Favorites";
      parentElem.append(defaultElem);
    }
    this.saveToStorage();
    displayToast(lang === "ko" ? "설정이 저장됐습니다." : "Saved changes.", 2000);
  }

  renderMessage(lang) {
    displayToast(lang === "ko" ? "이미 추가한 드래곤입니다." : "Already in Favorites.", 2000);
  }

  renderNewFav({ nameEn, nameKo, id }, lang) {
    const newRow = newElem("div");
    newRow.classList.add("favorites-row");
    newRow.dataset.id = id;
    const rowText = newElem("span");
    rowText.textContent = lang === "ko" ? nameKo : nameEn;
    const rowBtn = newElem("button");
    rowBtn.textContent = lang === "ko" ? "삭제" : "Remove";
    newRow.append(rowText, rowBtn);
    $("#favorites").append(newRow);
    return newRow;
  }

  render(lang) {
    if (this.#favorites.length <= 0) return;

    $("#favorites").innerHTML = "";
    this.#favorites.forEach((fav) => this.renderNewFav(fav, lang));
  }
}

export default Favorites;
