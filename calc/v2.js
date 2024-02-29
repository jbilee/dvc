import Stats from "../src/Stats.js";
import {
  $,
  getFirstKeyByValue,
  getTargetSum,
  popValues,
} from "../src/utilities.js";
import {
  BASE_INCREMENT,
  STAT_COUNT,
  TRAIN_VALUES,
  EXCLUDED_VALUES,
  STAT_LISTS,
  ADJUSTMENTS,
} from "../src/constants.js";

STAT_LISTS.start.forEach((stat) =>
  $(stat).addEventListener("change", checkDullAvailability)
);

$("#dragon-selector").addEventListener("change", selectDragon);
$("#start-trait-selector").addEventListener("change", selectStartTrait);
$("#normal-trait-selector").addEventListener("change", selectNormalTrait);
$("#special-trait-selector").addEventListener("change", selectSpecialTrait);
$("#btn-calculate").addEventListener("click", calculate);
$("#btn-reset").addEventListener("click", reset);

function checkDullAvailability(e) {
  const isAvailable = e.target.value <= 25 ? true : false;
  changeDullAvailability(isAvailable);
}

function selectDragon(e) {
  // Initialize variables
  const dragonName = e.target.value;
  const { traitsEn, traitsKo } = dragonList.find(
    (data) => data.name[0] === dragonName
  );
  const firstTrait = $("#trait1");
  const secondTrait = $("#trait2");

  // Enable trait selector
  $("#start-trait-selector").removeAttribute("disabled");

  // Reset previously selected base stat values and trait
  $("#start-trait-selector").selectedIndex = 0;
  STAT_LISTS.start.forEach((stat) => ($(stat).value = 0));

  // Fill in trait dropdown choices
  firstTrait.textContent = traitsKo[0];
  firstTrait.value = traitsEn[0];
  secondTrait.textContent = traitsKo[1];
  secondTrait.value = traitsEn[1];
}

// Print the selected dragon's base stats
function selectStartTrait(e) {
  const traitSelected = e.target.value;
  const dragonName = $("#dragon-selector").value;
  const dragonData = dragonList.find((data) => data.name[0] === dragonName);
  const dragonStats = dragonData[traitSelected];

  // Fill in base stats
  STAT_LISTS.start.forEach((stat, i) => ($(stat).value = dragonStats[i]));

  const maxStatValue = Math.max(...dragonStats);
  if (maxStatValue > 25) changeDullAvailability(false);
  else changeDullAvailability(true);

  reset();
}

// Print recommended end stats for selected special trait
function selectSpecialTrait(e) {
  const traitSelected = e.target.value;
  const traitIndex = specialTraits.findIndex((traits) => {
    return traits.nameEn === traitSelected;
  });

  //Check for 9-only
  const testAreaCheckbox = $(".test-area input");

  // Store dragon's base stats
  const base = getStatFields("#start-");

  switch (traitSelected) {
    case "Perfectionist": {
      const final = new Stats(...calcTwentyFive(base));
      printStatFields(final, "#end-");
      break;
    }

    case "Meticulous": {
      const startSum = base.getTotal();
      const reqSum = 100 - startSum;
      const goal = new Stats(reqSum);
      const final = getStatSum(base, goal);
      printStatFields(final, "#end-");
      break;
    }

    case "Distracted": {
      break;
    }

    case "Immersed": {
      const goal = copyStats(base);
      const highestValue = base.getMaxStatValue();
      const highestStat = getFirstKeyByValue(base, highestValue);
      const difference = 120 - highestValue;

      if (ADJUSTMENTS.regular.has(difference)) {
        goal[highestStat] =
          base[highestStat] + ADJUSTMENTS.regular.get(difference);
        return printStatFields(goal, "#end-");
      }

      goal[highestStat] = base[highestStat] + difference;
      printStatFields(goal, "#end-");
      break;
    }

    case "Dull": {
      const maxValue = base.getMaxStatValue();
      STAT_LISTS.end.forEach((stat) => ($(stat).value = maxValue));

      // Make adjustments here
      // Conditional: if maxValue >= 23, cannot make any adjustments
      // if maxValue < 22, can make upper adjustments +3 at a time
      break;
    }

    case "Capable": {
      const maxValue = base.getMaxStatValue();
      if (maxValue < 30) {
        for (let i = 0; i < STAT_COUNT; i++) {
          $(STAT_LISTS.end[i]).value = specialTraits[traitIndex].stats[i];
        }
      } else {
        for (let i = 0; i < STAT_COUNT; i++) {
          $(STAT_LISTS.end[i]).value = 30;
        }
      }
      break;
    }

    case "Solitary": {
      const goal = copyStats(base);
      STAT_LISTS.base.forEach((stat) => {
        while (!goal[stat].toString().endsWith("1")) {
          goal[stat] += 1;
        }
        if (EXCLUDED_VALUES.includes(goal[stat] - base[stat])) goal[stat] += 10;
      });

      printStatFields(goal, "#end-");
      break;
    }

    default:
      // Standard calculation
      const final = new Stats(...calcTwenty(base));
      printStatFields(final, "#end-");

    // If 9-only training is checked:
    // const final = calcDefault(traitSelected, base);
    // printStatFields(final, "#end-");
  }
}

function compareTrainingCounts(base, stats, goals) {
  const firstComboOne = getTargetSum(goals[0] - base[stats[0]], TRAIN_VALUES);
  const firstComboTwo = getTargetSum(goals[1] - base[stats[1]], TRAIN_VALUES);

  const secondComboOne = getTargetSum(goals[1] - base[stats[0]], TRAIN_VALUES);
  const secondComboTwo = getTargetSum(goals[0] - base[stats[1]], TRAIN_VALUES);

  if (!firstComboOne || !firstComboTwo) {
    return [
      { statName: stats[0], value: goals[1] },
      { statName: stats[1], value: goals[0] },
    ];
  }
  if (!secondComboOne || !secondComboTwo) {
    return [
      { statName: stats[0], value: goals[0] },
      { statName: stats[1], value: goals[1] },
    ];
  }

  const firstComboCounts = firstComboOne.length + firstComboTwo.length;
  const secondComboCounts = secondComboOne.length + secondComboTwo.length;

  if (firstComboCounts < secondComboCounts) {
    return [
      { statName: stats[0], value: goals[0] },
      { statName: stats[1], value: goals[1] },
    ];
  } else {
    return [
      { statName: stats[0], value: goals[1] },
      { statName: stats[1], value: goals[0] },
    ];
  }
}

function getStatFields(prefix) {
  const values = new Stats();
  for (const stat of STAT_LISTS.base) {
    values[stat] = Number($(`${prefix}${stat}`).value);
  }
  return values;
}

function printStatFields(stats, prefix) {
  for (const stat in stats) {
    $(`${prefix}${stat}`).value = stats[stat];
  }
}

// function getFirstKeyByValue(obj, value) {
//   return Object.keys(obj).find((key) => obj[key] === value) || null;
// }

// Print recommended end stats for selected normal trait
function selectNormalTrait(e) {
  // Store dragon's base stats
  const base = getStatFields("#start-");

  const traitSelected = e.target.value;
  const traitIndex = normalTraits.findIndex((trait) => {
    return trait.nameEn === traitSelected;
  });
  const highestReqStat = normalTraits[traitIndex].highestStat;
  const lowestReqStat = normalTraits[traitIndex].lowestStat;
  let req;

  if (lowestReqStat === "none") req = doubleTraining(base, highestReqStat);
  else req = singleTraining(base, highestReqStat, lowestReqStat);

  printStatFields(req, "#end-");
}

function doubleTraining(base, highest) {
  let req = calcSingleHighest(base, highest);
  const sortedArr = req.sortByIncreasing();

  if (sortedArr[0] !== sortedArr[1]) req = calcDoubleLowest(req, sortedArr);

  const diff = getStatDifference(base, req);
  const optimized = optimizeHighest(diff, highest);
  const final = getStatSum(base, optimized);

  return final;
}

function singleTraining(base, highest, lowest) {
  // Determine lowest required state
  let req = calcSingleLowest(base, lowest);

  // Determine highest required stat
  req = calcSingleHighest(req, highest);

  const diff = getStatDifference(base, req);

  // Optimization
  const optimized = optimizeAll(base, diff, highest, lowest);
  const final = getStatSum(base, optimized);

  return final;
}

function optimizeAll(base, change, highest, lowest) {
  const newStats = copyStats(change);
  for (const stat in newStats) {
    const curValue = newStats[stat];
    if (ADJUSTMENTS.regular.has(curValue)) {
      // try inserting new value
      newStats[stat] = ADJUSTMENTS.regular.get(curValue);
      // replace value and see if highest of stats and lowest of stats changed (compare newStats highest and lowest using getMax and getMin)
    }
  }
  const application = getStatSum(base, newStats);
  const newMax = application.getMaxStatName();
  const newMin = application.getMinStatName();
  if (
    newMax.length === 1 &&
    newMin.length === 1 &&
    newMax.includes(highest) &&
    newMin.includes(lowest)
  )
    return newStats;
  return change;
}

function optimizeHighest(change, targetStat) {
  const newStats = copyStats(change);
  const targetValue = newStats[targetStat];

  if (ADJUSTMENTS.regular.has(targetValue)) {
    newStats[targetStat] = ADJUSTMENTS.regular.get(targetValue);
  }

  return newStats;
}

function copyStats(object) {
  const newAgility = Number(object.agility);
  const newStrength = Number(object.strength);
  const newFocus = Number(object.focus);
  const newIntellect = Number(object.intellect);
  const newObject = new Stats(newAgility, newStrength, newFocus, newIntellect);
  return newObject;
}

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

function calcDefault(targetTrait, curStats) {
  const targetValues = specialTraits.filter(
    (trait) => trait.nameEn === targetTrait
  )[0].stats;

  const goal = new Stats(...targetValues);

  STAT_LISTS.base.forEach((stat) => {
    if (curStats[stat] > goal[stat]) {
      goal[stat] = curStats[stat];
    }
  });

  console.log(goal);

  filteredAdjustment(curStats, goal);

  return goal;
}

function calcTwenty(curStats) {
  const array = STAT_LISTS.base.map((stat) => curStats[stat]);

  const final = array.map((stat) => {
    if (ADJUSTMENTS.twenty.has(stat)) {
      return ADJUSTMENTS.twenty.get(stat);
    }
    return stat;
  });

  return final;
}

function calcTwentyFive(curStats) {
  const array = STAT_LISTS.base.map((stat) => curStats[stat]);

  const final = array.map((stat) => {
    if (ADJUSTMENTS.twentyFive.has(stat)) {
      return ADJUSTMENTS.twentyFive.get(stat);
    }
    return stat;
  });

  return final;
}

// Will always return one lowest stat
function calcSingleLowest(curStats, lowestReqStat) {
  const newStats = copyStats(curStats);
  const baseMinStat = curStats.getMinStatName();
  const reqVal = curStats[lowestReqStat];

  if (baseMinStat.length === 1 && baseMinStat[0] === lowestReqStat)
    return newStats;
  for (const stat in curStats) {
    if (stat === lowestReqStat) continue;
    if (curStats[stat] <= reqVal) newStats[stat] = reqVal + BASE_INCREMENT;
  }
  return newStats;
}

function calcDoubleLowest(curStats, array) {
  const newStats = copyStats(curStats);
  const lowestValue = array[0];
  const adjustmentValue = array[1];
  const adjustmentKey = getFirstKeyByValue(newStats, lowestValue);

  newStats[adjustmentKey] = adjustmentValue;
  return newStats;
}

// Always returns one highest stat
function calcSingleHighest(curStats, highestReqStat) {
  const newStats = copyStats(curStats);
  const baseMaxStat = curStats.getMaxStatName();
  const baseMaxValue = curStats.getMaxStatValue();
  const includesReq = baseMaxStat.includes(highestReqStat);

  if (baseMaxStat.length === 1 && includesReq) return newStats;
  if (
    (baseMaxStat.length > 1 && includesReq) ||
    baseMaxStat[0] !== highestReqStat
  )
    newStats[highestReqStat] = baseMaxValue + BASE_INCREMENT;
  return newStats;
}

function calculate() {
  try {
    STAT_LISTS.base.forEach((stat) => checkViability(stat));
    STAT_LISTS.base.forEach((stat) => printTrainingCount(stat));
  } catch (e) {
    alert(e);
  }
}

function checkViability(statType) {
  const reqStat = $(`#end-${statType}`).value - $(`#start-${statType}`).value;
  if (reqStat < 0)
    throw new Error(
      `목표치가 기본치보다 낮습니다. 더 높은 목표치를 설정해주세요!`
    );
  if (EXCLUDED_VALUES.includes(reqStat)) {
    throw new Error(
      `조합할 수 없는 숫자가 있습니다 (${reqStat}). 다른 목표치를 설정해주세요!`
    );
  }
}

function printTrainingCount(statType) {
  const reqStat = $(`#end-${statType}`).value - $(`#start-${statType}`).value;
  const trainCount = getTargetSum(reqStat, TRAIN_VALUES);

  $(`#required-${statType}`).textContent = "+" + reqStat;

  let trainText;

  if (trainCount[5] === 9) {
    let nineCount = trainCount.lastIndexOf(9) + 1;
    const trainCountCondensed = trainCount.slice(nineCount);
    trainText =
      `<span class="nine">9</span><sub>(x${nineCount})</sub> ` +
      trainCountCondensed
        .map((e) => {
          return e === 5
            ? `<span class="five">${e}</span>`
            : `<span class="three">${e}</span>`;
        })
        .join(" ");
  } else {
    trainText = trainCount
      .map((e) => {
        return e === 9
          ? `<span class="nine">${e}</span>`
          : e === 5
          ? `<span class="five">${e}</span>`
          : `<span class="three">${e}</span>`;
      })
      .join(" ");
  }

  if (trainCount.length === 0) {
    $(`#train-count-${statType}`).textContent = "-";
  } else {
    $(`#train-count-${statType}`).innerHTML = trainText;
  }
}

function replaceWithNine(currentCount) {
  if (!currentCount.includes(3) && !currentCount.includes(5)) return null;

  const newCount = popValues(currentCount, 3, 5);
  newCount.unshift(9);

  return newCount;
}

const changeDullAvailability = (isAvailable) => {
  const dull = $("#Dull");
  if (isAvailable) return dull.removeAttribute("disabled");

  $("#special-trait-selector").selectedIndex = 0;
  dull.setAttribute("disabled", "");
};

function reset() {
  STAT_LISTS.end.forEach((stat) => ($(stat).value = 0));
  $("#special-trait-selector").selectedIndex = 0;
  $("#normal-trait-selector").selectedIndex = 0;
}

function filteredAdjustment(base, goal) {
  STAT_LISTS.base.forEach((stat) => {
    if ((goal[stat] - base[stat]) % 9 !== 0) {
      while ((goal[stat] - base[stat]) % 9 !== 0) {
        goal[stat] += 1;
      }
    }
  });

  console.log(goal);
}

function adjustOneStat(base, goal) {
  let adjusted = goal;
  if ((goal - base) % 9 !== 0) {
    while ((goal - base) % 9 !== 0) {
      adjusted += 1;
    }
  }

  return adjusted;
}
