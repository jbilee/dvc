import Stats from "../src/Stats.js";
import { $, newElem } from "../src/utilities.js";
import { STAT_LISTS } from "../src/constants.js";
import { dragonList } from "../src/dd.js";
import { normalTraits } from "../src/td.js";

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

$("#btn-find").addEventListener("click", getChangedFields);
$("#btn-reset").addEventListener("click", reset);

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
  const checkedHighest = getCheckedTraits();
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
    alert("드래곤과 드래곤의 현재 성격을 선택해주세요!");
    return;
  }

  // Early return 2: user input error (personality user selected and checkboxes don't match)
  if (!checkedHighest.includes(requirements.highest)) {
    alert(
      "입력하신 정보로는 드래곤의 초기 성격을 예측할 수 없습니다.\n입력값에 오류가 없는지 확인해주세요."
    );
    return;
  }

  // get dragon's trait data
  const dragonTraits = {};
  dragonList.forEach((data) => {
    if (data.name.includes(dragonName)) {
      dragonTraits.firstTrait = findTraitData(data.traitsKo[0]);
      dragonTraits.firstTrait.baseStats = new Stats(...data[data.traitsEn[0]]);
      dragonTraits.secondTrait = findTraitData(data.traitsKo[1]);
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

  const resultDiv = $("#find-result");

  if (
    dragonTraits.firstTrait.trainedHighest.includes(requirements.highest) &&
    dragonTraits.firstTrait.trainedLowest === requirements.lowest
  ) {
    resultDiv.innerText = dragonTraits.firstTrait.trait;
  } else if (
    dragonTraits.secondTrait.trainedHighest.includes(requirements.highest) &&
    dragonTraits.secondTrait.trainedLowest === requirements.lowest
  ) {
    resultDiv.innerText = dragonTraits.secondTrait.trait;
  } else {
    // exception handling
    alert(
      "입력하신 정보로는 드래곤의 초기 성격을 예측할 수 없습니다.\n입력값에 오류가 없는지 확인해주세요."
    );
  }
}

function findTraitData(traitName) {
  const statInfo = normalTraits.reduce((final, cur) => {
    if (cur.nameKo === traitName) {
      final.highest = cur.highestStat;
      final.lowest = cur.lowestStat;
    }
    return final;
  }, {});

  return {
    trait: traitName,
    highestStat: statInfo.highest,
    lowestStat: statInfo.lowest,
  };
}

function getCheckedTraits() {
  const checked = [];

  STAT_LISTS.base.forEach((stat) => {
    if ($(`#checkbox-${stat}`).checked) {
      checked.push(stat);
    }
  });

  return checked;
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

  STAT_LISTS.base.forEach((stat) => ($(`#checkbox-${stat}`).checked = false));

  const resultDiv = $("#find-result");
  resultDiv.innerText = "";
}

function getStatSum(a, b) {
  const sum = new Stats();
  for (const stat of STAT_LISTS.base) {
    sum[stat] = a[stat] + b[stat];
  }
  return sum;
}
