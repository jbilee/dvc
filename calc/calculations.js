import Stats from "../src/Stats.js";
import { $, getFirstKeyByValue, getTargetSum } from "../src/utilities.js";
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

function selectDragon() {
  // Initialize variables
  const firstTrait = $("#trait1");
  const secondTrait = $("#trait2");
  const dragonName = $("#dragon-selector").value;
  const dragonIndex = dragonList.findIndex((dragons) => {
    return dragons.name[0] === dragonName;
  });

  // Enable trait selector
  $("#start-trait-selector").removeAttribute("disabled");

  // Reset previously selected base stat values and trait
  $("#start-trait-selector").selectedIndex = 0;
  STAT_LISTS.start.forEach((stat) => ($(stat).value = 0));

  // Fill in trait dropdown choices
  firstTrait.textContent = dragonList[dragonIndex].traitsKo[0];
  firstTrait.value = dragonList[dragonIndex].traitsEn[0];
  secondTrait.textContent = dragonList[dragonIndex].traitsKo[1];
  secondTrait.value = dragonList[dragonIndex].traitsEn[1];
}

// Print the selected dragon's base stats
function selectStartTrait(e) {
  const traitSelected = e.target.value;
  const dragonName = $("#dragon-selector").value;
  const dragonIndex = dragonList.findIndex((dragons) => {
    return dragons.name[0] === dragonName;
  });
  const dragonStats = dragonList[dragonIndex][traitSelected];

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
    case "Arrogant": {
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
      const curFocus = base.focus;
      const goal = copyStats(base);

      if (curFocus === 15) {
        const zeroStat = getFirstKeyByValue(base, 0); // Will cause error if lowest stat isn't 0 (such as when user enters values themselves)
        const remainingStats = STAT_LISTS.base.filter(
          (x) => x !== zeroStat && x !== "focus"
        );
        const changesToMake = compareTrainingCounts(
          base,
          remainingStats,
          [30, 45]
        );
        changesToMake.forEach((change) => {
          goal[change.statName] = change.value;
        });
        const highestGoal = goal.getMaxStatName();
        if (
          goal[highestGoal] - base[highestGoal] > 30 &&
          goal[highestGoal] - base[highestGoal] !== 45
        ) {
          goal[highestGoal] = 46;
        }
        const thirtyRemains = getFirstKeyByValue(goal, 30);
        if (goal[highestGoal] === 46 && thirtyRemains) {
          goal[thirtyRemains] = 31;
        }
        return printStatFields(goal, "#end-");
      }

      if (curFocus === 30) {
        const zeroStat = getFirstKeyByValue(base, 0);
        const remainingStats = STAT_LISTS.base.filter(
          (x) => x !== zeroStat && x !== "focus"
        );
        const changesToMake = compareTrainingCounts(
          base,
          remainingStats,
          [15, 45]
        ); // This line needs to be refactored if any of the other stats is bigger than 15
        changesToMake.forEach((change) => {
          goal[change.statName] = change.value;
        });
        const highestGoal = goal.getMaxStatName();
        if (goal[highestGoal] - base[highestGoal] > 30) {
          goal[highestGoal] = 46;
        }
        return printStatFields(goal, "#end-");
      }

      if (curFocus < 15) {
        const goals = [curFocus + 15, curFocus + 30, curFocus + 45];
        const excludedValues = [];
        const excludedStats = [];
        for (let i = 0; i < goals.length; i++) {
          if (Object.values(base).includes(goals[i])) {
            excludedValues.push(goals[i]);
            excludedStats.push(getFirstKeyByValue(base, goals[i]));
          }
        }
        let keptValues = goals.filter((x) => !excludedValues.includes(x));
        const remainingStats = STAT_LISTS.base.filter(
          (x) => !excludedStats.includes(x) && x !== "focus"
        );
        if (remainingStats.length === 1) {
          goal[remainingStats[0]] = keptValues[0];
          return printStatFields(goal, "#end-");
        }
        if (remainingStats.length === 2) {
          const changesToMake = compareTrainingCounts(
            base,
            remainingStats,
            keptValues
          );
          changesToMake.forEach((change) => {
            goal[change.statName] = change.value;
          });
          return printStatFields(goal, "#end-");
        }

        // if (keptValues.includes(25)) {
        //     keptValues = [27, 45, 60]; // find cases where this may be better -> this is when 30 is present
        // }

        for (let i = 0; i < keptValues.length; i++) {
          const diffOne = keptValues[i] - base[remainingStats[0]];
          const diffTwo = keptValues[i] - base[remainingStats[1]];
          const diffThree = keptValues[i] - base[remainingStats[2]];

          if (diffOne === 45 || diffOne === 10) {
            goal[remainingStats[0]] = keptValues[i];
            remainingStats.splice(0, 1);
            keptValues.splice(i, 1);
            break;
          }
          if (diffTwo === 45 || diffTwo === 10) {
            goal[remainingStats[1]] = keptValues[i];
            remainingStats.splice(1, 1);
            keptValues.splice(i, 1);
            break;
          }
          if (diffThree === 45 || diffThree === 10) {
            goal[remainingStats[2]] = keptValues[i];
            remainingStats.splice(2, 1);
            keptValues.splice(i, 1);
            break;
          }
        }

        if (remainingStats.length === 3) {
          const lastValue = keptValues.pop();
          const lastStat = remainingStats.pop();
          goal[lastStat] = lastValue;

          const changesToMake = compareTrainingCounts(
            base,
            remainingStats,
            keptValues
          );
          changesToMake.forEach((change) => {
            goal[change.statName] = change.value;
          });
          printStatFields(goal, "#end-");
        } else {
          const changesToMake = compareTrainingCounts(
            base,
            remainingStats,
            keptValues
          );
          changesToMake.forEach((change) => {
            goal[change.statName] = change.value;
          });
          printStatFields(goal, "#end-");
        }
      }
      if (curFocus > 15 && curFocus < 30) {
        const zeroStat = getFirstKeyByValue(base, 0);
        const remainingStats = STAT_LISTS.base.filter(
          (x) => x !== zeroStat && x !== "focus"
        );
        const goals = [curFocus + 15, curFocus + 30];
        const changesToMake = compareTrainingCounts(
          base,
          remainingStats,
          goals
        );
        changesToMake.forEach((change) => {
          goal[change.statName] = change.value;
        });
        const highestGoal = goal.getMaxStatName();
        if (
          goal[highestGoal] - base[highestGoal] >= 40 &&
          goal[highestGoal] - base[highestGoal] < 45
        ) {
          goal[highestGoal] = 51;
          const thirtyFive = getFirstKeyByValue(goal, 35);
          if (thirtyFive && base[thirtyFive] === 0) {
            goal[thirtyFive] = 36;
          }
        }
        printStatFields(goal, "#end-");
      }
      break;
    }

    case "Immersed": {
      const goal = copyStats(base);
      const highestValue = base.getMaxStatValue();
      const highestStat = getFirstKeyByValue(base, highestValue);
      const difference = 150 - highestValue;

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
  const firstComboOne = getTargetSum(
    goals[0] - base[stats[0]],
    TRAIN_VALUES
  );
  const firstComboTwo = getTargetSum(
    goals[1] - base[stats[1]],
    TRAIN_VALUES
  );

  const secondComboOne = getTargetSum(
    goals[1] - base[stats[0]],
    TRAIN_VALUES
  );
  const secondComboTwo = getTargetSum(
    goals[0] - base[stats[1]],
    TRAIN_VALUES
  );

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
  const highestReq = normalTraits[traitIndex].highestStat;
  const lowestReq = normalTraits[traitIndex].lowestStat;
  let req;

  if (lowestReq === "none") req = doubleTraining(base, highestReq);
  else req = singleTraining(base, highestReq, lowestReq);

  printStatFields(req, "#end-");
}

function doubleTraining(base, highest) {
  let req = calcSingleHighest(base, highest);
  const sortedArr = req.sortInc();

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
function calcSingleLowest(curStats, lowestReq) {
  const newStats = copyStats(curStats);
  const baseMinStat = curStats.getMinStatName();
  const reqVal = curStats[lowestReq];

  if (baseMinStat.length === 1 && baseMinStat[0] === lowestReq) return newStats;
  for (const stat in curStats) {
    if (stat === lowestReq) continue;
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
function calcSingleHighest(curStats, highestReq) {
  const newStats = copyStats(curStats);
  const baseMaxStat = curStats.getMaxStatName();
  const baseMaxValue = curStats.getMaxStatValue();
  const includesReq = baseMaxStat.includes(highestReq);

  if (baseMaxStat.length === 1 && includesReq) return newStats;
  if ((baseMaxStat.length > 1 && includesReq) || baseMaxStat[0] !== highestReq)
    newStats[highestReq] = baseMaxValue + BASE_INCREMENT;
  return newStats;
}

function calculate() {
  try {
    STAT_LISTS.base.forEach((stat) => printTrainingCount(stat));
  } catch (e) {
    alert(e);
  }
}

function printTrainingCount(statType) {
  const reqStat = $(`#end-${statType}`).value - $(`#start-${statType}`).value;

  if (EXCLUDED_VALUES.includes(reqStat)) {
    throw new Error(
      `조합할 수 없는 숫자가 있습니다 (${reqStat}). 다른 목표치를 설정해주세요!`
    );
  }

  const trainCount = getTargetSum(reqStat, TRAIN_VALUES);

  if (reqStat < 0) {
    $(`#required-${statType}`).textContent = "+0";
  } else {
    $(`#required-${statType}`).textContent = "+" + reqStat;
  }

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

function lowerTrainCount(count) {
  if (!newCount.includes(3) && !newCount.includes(5)) return null;

  const newCount = [...count];

  if (newCount.includes(3) && newCount.includes(5)) {
    const threeIndex = newCount.indexOf(3);
    newCount.splice(threeIndex, 1);
    const fiveIndex = newCount.indexOf(5);
    newCount.splice(fiveIndex, 1, 9);
  }

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
