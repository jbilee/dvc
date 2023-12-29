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
  requirements.lowest = normalTraits.filter((trait) => trait.nameEn === currentTrait).map((trait) => trait.lowestTrait).toString();
  requirements.highest = normalTraits.filter((trait) => trait.nameEn === currentTrait).map((trait) => trait.highestTrait).toString();

  // Early return 1: user input error (personality user selected and checkboxes don't match)
  if (!checkedHighest.includes(requirements.highest)) {
    console.log("impossible")
    return
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
  console.log("dragonTraits ---");
  console.log(dragonTraits);

  const trainAmount = new Stats(...fields);

  console.log("base stats ---------");
  console.log(dragonTraits.firstTrait.baseStats);
  console.log(dragonTraits.secondTrait.baseStats);

  // add the affected stats to base stats
  dragonTraits.firstTrait.trainedStats = getStatSum(dragonTraits.firstTrait.baseStats, trainAmount);
  dragonTraits.secondTrait.trainedStats = getStatSum(dragonTraits.secondTrait.baseStats, trainAmount);

  console.log("stats after training ---------");
  console.log(dragonTraits.firstTrait.trainedStats);
  console.log(dragonTraits.secondTrait.trainedStats);

  // find final trait based on the changes
  dragonTraits.firstTrait.trainedHighest = dragonTraits.firstTrait.trainedStats.getMaxStatName();
  dragonTraits.secondTrait.trainedHighest = dragonTraits.secondTrait.trainedStats.getMaxStatName();

  for (const trait in dragonTraits) {
    const minStats = dragonTraits[trait].trainedStats.getMinStatName();
    if (minStats.length > 1) {
      dragonTraits[trait].trainedLowest = "none";
    } else {
      dragonTraits[trait].trainedLowest = minStats.toString();
    }
  }

  console.log(requirements)

  const resultSpan = document.createElement("div");

  if (dragonTraits.firstTrait.trainedHighest.includes(requirements.highest) && dragonTraits.firstTrait.trainedLowest === requirements.lowest) {
    resultSpan.innerText = dragonTraits.firstTrait.trait;
  } else if (dragonTraits.secondTrait.trainedHighest.includes(requirements.highest) && dragonTraits.secondTrait.trainedLowest === requirements.lowest) {
    resultSpan.innerText = dragonTraits.secondTrait.trait;
  } else {
    // exception handling
    console.log("impossible")
  }

  const mama = document.getElementById("controls");
  mama.appendChild(resultSpan)

  // let matches1;
  // let matches2;

  // for (let i = 0; i < checkedHighest.length; i++) {
  //   if (!highest1.includes(checkedHighest[i])) {
  //     matches1 = false;
  //     break;
  //   }
  //   if (i === checkedHighest.length - 1 && highest1.includes(checkedHighest[i])) {
  //     matches1 = true;
  //   }
  // }

  // for (let i = 0; i < checkedHighest.length; i++) {
  //   if (!highest2.includes(checkedHighest[i])) {
  //     matches2 = false;
  //     break;
  //   }
  //   if (i === checkedHighest.length - 1 && highest2.includes(checkedHighest[i])) {
  //     matches2 = true;
  //   }
  // }

  // if (lowestStats1 !== requirements.lowest[0]) {
  //   matches1 = false;
  // }

  // if (lowestStats2 !== requirements.lowest[0]) {
  //   matches2 = false;
  // }

  // console.log(matches1) // expect false
  // console.log(matches2) // expect true

  /*
유저 인풋:
가장 높은 스텟
현재 성격

if there's a tie in highest, 마지막으로 올린 스탯을 기준으로 새로 잡음

가장 높은 스탯들이 다 일치하는지 확인

  */

  // test data:
  // { name: ["Knight Dragon", "나이트"], traitsKo: ["용감한", "똑똑한"], Brave: [0, 30, 10, 10], Smart: [10, 0, 0, 20] },
  // 나이트 순발+10, 성격 대담
  // 1 to match
  // expect: 성격 눈치빠른

  // both highest and lowest have to match

  // exception handling -- maybe I don't need to do this; completely depends on info provided by user

  // need to consider ties in stats -> change dropdown to checkbox

  // const trueTrait;
  // const resultDiv = document.getElementById("result");
  // resultDiv.innerHTML = trueTrait;
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
