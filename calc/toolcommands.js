import { $, displayToast } from "../src/utilities.js";
import {
  STAT_LISTS,
  COUNT_PREFIX,
  CLIP_TEXT,
  NUMBER_REGEX,
} from "../src/constants.js";

$("#btn-clipboard").addEventListener("click", copyResults);

function copyResults() {
  const text = [];
  STAT_LISTS.base.forEach((stat) => {
    const field = $(`#${COUNT_PREFIX}${stat}`);
    if (field.innerText !== "-") {
      const counts = field.childNodes;
      let spanText = "";
      counts.forEach((child) => {
        if (child.innerText) {
          if (!NUMBER_REGEX.test(child.innerText)) {
            const numberText = child.innerText
              .replace("(x", "")
              .replace(")", "");
            const lastText = spanText.slice(-1);
            spanText += lastText.repeat(Number(numberText) - 1);
          } else {
            spanText += child.innerText;
          }
        }
      });
      const req = $(`#required-${stat}`).textContent;
      text.push(`${CLIP_TEXT[stat](req)}${spanText}`);
    }
  });

  navigator.clipboard.writeText(text.join("\n")).then(
    () => {
      displayToast("복사되었습니다.", 1200);
    },
    () => {
      displayToast("복사에 실패했습니다.", 1200);
    }
  );
}
