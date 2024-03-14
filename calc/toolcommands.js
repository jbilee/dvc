import { $, displayToast } from "../src/utilities.js";
import {
  STAT_LISTS,
  COUNT_PREFIX,
  CLIP_TEXT_KO,
  CLIP_TEXT_EN,
  NUMBER_REGEX,
} from "../src/constants.js";

export default function copyResults(lang) {
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
      if (lang === "ko") {
        text.push(`${CLIP_TEXT_KO[stat](req)}${spanText}`);
      } else {
        text.push(`${CLIP_TEXT_EN[stat](req)}${spanText}`);
      }
    }
  });

  navigator.clipboard.writeText(text.join("\n")).then(
    () => {
      displayToast(lang === "ko" ? "복사되었습니다." : "Copied!", 1200);
    },
    () => {
      displayToast(
        lang === "ko" ? "복사에 실패했습니다." : "Failed to copy.",
        1200
      );
    }
  );
}
