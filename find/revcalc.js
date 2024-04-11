import Stats from "../src/Stats.js";
import FinderView from "../src/views/FinderView.js";
import { $, newElem } from "../src/utilities.js";
import { STAT_LISTS } from "../src/constants.js";
import { dragonList } from "../src/dd.js";
import { normalTraits } from "../src/td.js";

let lang;

lang = localStorage.getItem("dvct_f") || getLanguage();
// render
lang === "ko" ? FinderView.renderKo() : FinderView.renderEn();

if (lang === "ko") {
  dragonList.forEach(({ name: [nameEn, nameKo] }) => {
    const newOption = newElem("option");
    newOption.setAttribute("value", nameEn);
    newOption.textContent = nameKo;
    $("#dragon-selector").append(newOption);
  });

  normalTraits.forEach(({ nameEn, nameKo }) => {
    const newOption = newElem("option");
    newOption.setAttribute("value", nameEn);
    newOption.textContent = nameKo;
    $("#trait-selector").append(newOption);
  });

  $("#settings").addEventListener("click", () => {
    localStorage.setItem("dvct_f", "en-US");
    location.reload();
  });
} else {
  const sortedDragonNames = dragonList
    .map(({ name }) => name[0])
    .sort((a, b) => (a > b ? 1 : -1));
  const sortedDragons = sortedDragonNames.map((nameEn) =>
    dragonList.find(({ name }) => name.includes(nameEn))
  );
  sortedDragons.forEach(({ name: [nameEn] }) => {
    const newOption = newElem("option");
    newOption.setAttribute("value", nameEn);
    newOption.textContent = nameEn;
    $("#dragon-selector").append(newOption);
  });

  const sortedTraitNames = normalTraits
    .map((item) => item.nameEn)
    .sort((a, b) => (a > b ? 1 : -1));
  const sortedTraits = sortedTraitNames.map((name) =>
    normalTraits.find(({ nameEn }) => nameEn === name)
  );
  sortedTraits.forEach(({ nameEn, nameKo }) => {
    const newOption = newElem("option");
    newOption.setAttribute("value", nameEn);
    if (newOption.value === "Dull") newOption.setAttribute("id", nameEn);
    newOption.textContent = lang === "ko" ? nameKo : nameEn;
    $("#trait-selector").append(newOption);
  });

  $("#settings").addEventListener("click", () => {
    localStorage.setItem("dvct_f", "ko");
    location.reload();
  });
}

$("#btn-find").addEventListener("click", getChangedFields);
$("#btn-reset").addEventListener("click", reset);

function getLanguage() {
  const userLanguage = window.navigator.language;
  if (userLanguage === "ko" || userLanguage === "ko-KR") return "ko";
  else return "en-US";
}

function getChangedFields() {
  // read DOM fields
  const fields = [];
  STAT_LISTS.start.forEach((stat) => {
    const field = Number($(stat).value);
    fields.push(field);
  });
  const requirements = {};
  // read dragon name field
  const dragonName = $("#dragon-selector").value;
  const currentTrait = $("#trait-selector").value;
  requirements.lowest = normalTraits
    .filter((trait) => trait.nameEn === currentTrait)
    .map((trait) => trait.lowestStat)
    .toString();
  requirements.highest = normalTraits
    .filter((trait) => trait.nameEn === currentTrait)
    .map((trait) => trait.highestStat)
    .toString();

  // Early return 1: no data (user did not provide required information)
  if (
    $("#dragon-selector").selectedIndex === 0 ||
    $("#trait-selector").selectedIndex === 0
  ) {
    alert(
      lang === "ko"
        ? "드래곤과 드래곤의 현재 일반 성격을 선택해주세요!"
        : "Please select a dragon and its current Basic Personality!"
    );
    return;
  }

  // get dragon's trait data
  const dragonTraits = {};
  dragonList.forEach((data) => {
    if (data.name.includes(dragonName)) {
      dragonTraits.firstTrait = findTraitData(
        lang === "ko" ? data.traitsKo[0] : data.traitsEn[0]
      );
      dragonTraits.firstTrait.baseStats = new Stats(...data[data.traitsEn[0]]);
      dragonTraits.secondTrait = findTraitData(
        lang === "ko" ? data.traitsKo[1] : data.traitsEn[1]
      );
      dragonTraits.secondTrait.baseStats = new Stats(...data[data.traitsEn[1]]);
    }
  });

  const trainAmount = new Stats(...fields);

  // add the affected stats to base stats
  dragonTraits.firstTrait.trainedStats = getStatSum(
    dragonTraits.firstTrait.baseStats,
    trainAmount
  );
  dragonTraits.secondTrait.trainedStats = getStatSum(
    dragonTraits.secondTrait.baseStats,
    trainAmount
  );

  // find final trait based on the changes
  dragonTraits.firstTrait.trainedHighest =
    dragonTraits.firstTrait.trainedStats.getMaxStatName();
  dragonTraits.secondTrait.trainedHighest =
    dragonTraits.secondTrait.trainedStats.getMaxStatName();

  for (const trait in dragonTraits) {
    const minStats = dragonTraits[trait].trainedStats.getMinStatName();
    if (minStats.length > 1) {
      dragonTraits[trait].trainedLowest = "none";
    } else {
      dragonTraits[trait].trainedLowest = minStats.toString();
    }
  }

  if (
    dragonTraits.firstTrait.trainedHighest.includes(requirements.highest) &&
    dragonTraits.firstTrait.trainedLowest === requirements.lowest
  ) {
    $("#result__trait").innerText = dragonTraits.firstTrait.trait;
    $("#result__stats").innerText = getStatsString(
      dragonTraits.firstTrait.baseStats
    );
  } else if (
    dragonTraits.secondTrait.trainedHighest.includes(requirements.highest) &&
    dragonTraits.secondTrait.trainedLowest === requirements.lowest
  ) {
    $("#result__trait").innerText = dragonTraits.secondTrait.trait;
    $("#result__stats").innerText = getStatsString(
      dragonTraits.secondTrait.baseStats
    );
  } else {
    // exception handling
    alert(
      lang === "ko"
        ? "입력하신 정보로는 드래곤의 초기 성격을 예측할 수 없습니다.\n입력값에 오류가 없는지 확인해주세요."
        : "Couldn't determine the dragon's starting personality.\nPlease check for any errors in the input fields."
    );
  }
}

function getStatsString(stats) {
  const values = STAT_LISTS.base.map((stat) => stats[stat]);
  return values.join(" ");
}

function findTraitData(traitName) {
  const statInfo = normalTraits.reduce((final, cur) => {
    if (lang === "ko") {
      if (cur.nameKo === traitName) {
        final.highest = cur.highestStat;
        final.lowest = cur.lowestStat;
      }
      return final;
    } else {
      if (cur.nameEn === traitName) {
        final.highest = cur.highestStat;
        final.lowest = cur.lowestStat;
      }
      return final;
    }
  }, {});

  return {
    trait: traitName,
    highestStat: statInfo.highest,
    lowestStat: statInfo.lowest,
  };
}

function reset() {
  STAT_LISTS.start.forEach((stat) => {
    const field = $(stat);
    field.value = 0;
  });

  const nameSelector = $("#dragon-selector");
  nameSelector.selectedIndex = 0;
  const traitSelector = $("#trait-selector");
  traitSelector.selectedIndex = 0;

  $("#result__trait").innerText = "";
  $("#result__stats").innerText = "";
}

function getStatSum(a, b) {
  const sum = new Stats();
  for (const stat of STAT_LISTS.base) {
    sum[stat] = a[stat] + b[stat];
  }
  return sum;
}
