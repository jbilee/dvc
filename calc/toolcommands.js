import { $ } from "../src/utilities.js";
import { STAT_LISTS, COUNT_PREFIX, CLIP_TEXT } from "../src/constants.js";

$("#btn-clipboard").addEventListener("click", copyResults);

function copyResults() {
  const text = [];
  STAT_LISTS.base.forEach((stat) => {
    const field = $(`#${COUNT_PREFIX}${stat}`);
    if (field.innerText !== "-") {
      const counts = field.childNodes;
      let spanText = "";
      counts.forEach((child) => {
        if (child.innerText) spanText += child.innerText;
      });
      text.push(`${CLIP_TEXT[stat]}${spanText}`);
    }
  });

  navigator.clipboard.writeText(text.join("\n")).then(
    () => {
      displayToast(true);
    },
    () => {
      displayToast(false);
    }
  );
}

function displayToast(isSuccessful) {
  const container = $("#main-content");
  if (container.lastElementChild.id === "toast") {
    container.lastElementChild.remove();
  }

  const newToast = document.createElement("div");
  newToast.id = "toast";
  newToast.innerText = isSuccessful
    ? "복사되었습니다."
    : "복사에 실패했습니다.";

  container.appendChild(newToast);
  newToast.style.animationPlayState = "running";
  setTimeout(() => {
    newToast.remove();
  }, 610);
}

function addFavorites() {
  // get favoritesData values
  localStorage.setItem("dcfvs", JSON.stringify(favoritesData));
}

function loadFavorites() {
  const favoritesData = JSON.parse(localStorage.getItem("dcfvs"));
  if (favoritesData) {
    // loading logic
  }
}
