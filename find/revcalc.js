const STAT_LISTS = {
  base: ["agility", "strength", "focus", "intellect"],
  dom: ["start-agility", "start-strength", "start-focus", "start-intellect"],
};

function getChangedFields() {
  // read DOM fields
  const fields = [];
  STAT_LISTS.dom.forEach((selector) => {
    const field = Number(document.getElementById(selector).value);
    fields.push(field);
  });
  const requirements = {};
  // read dragon name field
  const dragonName = document.getElementById("dragon-selector").value;
  const checkedHighest = getCheckedTraits();
  const currentTrait = document.getElementById("trait-selector").value;
  requirements.lowest = normalTraits
    .filter((trait) => trait.nameEn === currentTrait)
    .map((trait) => trait.lowestTrait)
    .toString();
  requirements.highest = normalTraits
    .filter((trait) => trait.nameEn === currentTrait)
    .map((trait) => trait.highestTrait)
    .toString();

  // Early return 1: no data (user did not provide required information)
  if (
    document.getElementById("dragon-selector").selectedIndex === 0 ||
    document.getElementById("trait-selector").selectedIndex === 0
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

  const resultDiv = document.getElementById("find-result");

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
      "예상치 못한 오류가 발생했습니다.\n내용을 공유해주시면 버그 해결에 큰 힘이 됩니다!"
    );
  }
}

function findLowestStatName(stats) {
  const lowestStatList = stats.getMinStatName();

  if (lowestStatList.length >= 2) {
    return "none";
  }

  return lowestStatList;
}

function findTraitData(traitName) {
  const statInfo = normalTraits.reduce((final, cur) => {
    if (cur.nameKo === traitName) {
      final.highest = cur.highestTrait;
      final.lowest = cur.lowestTrait;
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
    if (document.getElementById(`checkbox-${stat}`).checked) {
      checked.push(stat);
    }
  });

  return checked;
}

function reset() {
  STAT_LISTS.dom.forEach((selector) => {
    const field = document.getElementById(selector);
    field.value = 0;
  });

  const nameSelector = document.getElementById("dragon-selector");
  nameSelector.selectedIndex = 0;
  const traitSelector = document.getElementById("trait-selector");
  traitSelector.selectedIndex = 0;

  STAT_LISTS.base.forEach(
    (stat) => (document.getElementById(`checkbox-${stat}`).checked = false)
  );

  const resultDiv = document.getElementById("find-result");
  resultDiv.innerText = "";
}

// separate as utilities later
function getStatDifference(a, b) {
  const sub = new Stats();
  for (const stat of STAT_LISTS.base) {
    sub[stat] = Math.abs(a[stat] - b[stat]);
  }
  return sub;
}

function getStatSum(a, b) {
  const sum = new Stats();
  for (const stat of STAT_LISTS.base) {
    sum[stat] = a[stat] + b[stat];
  }
  return sum;
}

// delete later
class Stats {
  constructor(agility = 0, strength = 0, focus = 0, intellect = 0) {
    this.agility = agility;
    this.strength = strength;
    this.focus = focus;
    this.intellect = intellect;
  }

  getMaxStatName() {
    const maxVal = this.getMaxStatValue();
    const maxTraits = [];
    if (this.agility === maxVal) maxTraits.push("agility");
    if (this.strength === maxVal) maxTraits.push("strength");
    if (this.focus === maxVal) maxTraits.push("focus");
    if (this.intellect === maxVal) maxTraits.push("intellect");
    return maxTraits;
  }

  getMinStatName() {
    const minVal = this.getMinStatValue();
    const minTraits = [];
    if (this.agility === minVal) minTraits.push("agility");
    if (this.strength === minVal) minTraits.push("strength");
    if (this.focus === minVal) minTraits.push("focus");
    if (this.intellect === minVal) minTraits.push("intellect");
    return minTraits;
  }

  getMaxStatValue() {
    return Math.max(this.agility, this.strength, this.focus, this.intellect);
  }

  getMinStatValue() {
    return Math.min(this.agility, this.strength, this.focus, this.intellect);
  }

  getTotal() {
    return this.agility + this.strength + this.focus + this.intellect;
  }

  sortInc() {
    const cur = [this.agility, this.strength, this.focus, this.intellect];
    return cur.sort((a, b) => a - b);
  }

  getTraitsByValue(value) {
    const traits = [];
    if (this.agility === value) {
      traits.push("agility");
    }
  }
}
