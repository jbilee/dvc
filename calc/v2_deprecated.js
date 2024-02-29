import Stats from "../src/Stats.js";
import {
  $,
  getArraySum,
  getFirstKeyByValue,
  getTargetSum,
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

        if (
          remainingStats.length === 2 &&
          base[remainingStats[0]] === base[remainingStats[1]]
        ) {
          const targetValue = base[remainingStats[0]];
          switch (targetValue) {
            case 0: {
              const goal = new Stats(54, 36, 20, 0);
              return printStatFields(goal, "#end-");
            }
            case 5: {
              const goal = new Stats(0, 0, 20, 0);
              const remainingValues = [50, 35];
              remainingStats.forEach(
                (stat, i) => (goal[stat] = remainingValues[i])
              );
              return printStatFields(goal, "#end-");
            }
            case 10: {
              const goal = new Stats(0, 0, 20, 0);
              const remainingValues = [55, 37];
              remainingStats.forEach(
                (stat, i) => (goal[stat] = remainingValues[i])
              );
              return printStatFields(goal, "#end-");
            }
            case 15: {
              const goal = new Stats(0, 0, 20, 0);
              const remainingValues = [51, 36];
              remainingStats.forEach(
                (stat, i) => (goal[stat] = remainingValues[i])
              );
              return printStatFields(goal, "#end-");
            }
          }
        } else {
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
      }
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

// Print recommended end stats for selected normal trait
function selectNormalTrait(e) {
  // Store dragon's base stats
  const base = getStatFields("#start-");

  const traitSelected = e.target.value;
  const { reqValue, reqStat, hasSameStats } = normalTraits.find(
    (trait) => trait.nameEn === traitSelected
  );

  // Satisfy stat requirement
  const goal = copyStats(base);

  switch (reqValue) {
    case "lowest": {
      const baseMinStat = base.getMinStatName();

      if (!baseMinStat.includes(reqStat)) {
        STAT_LISTS.base.forEach((stat) => {
          if (stat === reqStat) return;
          const newPotentialValue =
            goal[reqStat] + 1 < goal[stat] ? goal[stat] : goal[reqStat] + 1;

          if (EXCLUDED_VALUES.includes(newPotentialValue - base[stat])) {
            const newFinalValue = getValidReqValue(
              newPotentialValue - base[stat]
            );
            goal[stat] += newFinalValue;
          } else {
            goal[stat] = newPotentialValue;
          }
        });
      }
      if (baseMinStat.includes(reqStat) && baseMinStat.length > 1) {
        const otherMinStats = baseMinStat.filter((stat) => stat !== reqStat);
        otherMinStats.forEach((stat) => {
          goal[stat] += BASE_INCREMENT;
        });
      }

      // Optimization
      STAT_LISTS.base.forEach((stat) => {
        if (goal[stat] === base[stat]) return;
        const trainingCounts = getTargetSum(
          goal[stat] - base[stat],
          TRAIN_VALUES
        );
        const optimizedCounts = replaceWithNine(trainingCounts);
        const furtherOptimized = replaceWithNine2(trainingCounts);
        if (optimizedCounts) {
          goal[stat] = base[stat] + getArraySum(optimizedCounts);
        }
        if (furtherOptimized) {
          goal[stat] = base[stat] + getArraySum(furtherOptimized);
        }
      });
      break;
    }
    case "highest": {
      const baseMaxStat = base.getMaxStatName();
      const baseMaxValue = base.getMaxStatValue();

      if (!baseMaxStat.includes(reqStat)) {
        goal[reqStat] = baseMaxValue + 1;
      }

      // Optimization
      const trainingCounts = getTargetSum(
        goal[reqStat] - base[reqStat],
        TRAIN_VALUES
      );
      const optimizedCounts = replaceWithNine(trainingCounts);
      const furtherOptimized = replaceWithNine2(trainingCounts);
      if (optimizedCounts) {
        goal[reqStat] = base[reqStat] + getArraySum(optimizedCounts);
      }
      if (furtherOptimized) {
        goal[reqStat] = base[reqStat] + getArraySum(furtherOptimized);
      }
      break;
    }
  }

  // Satisfy hasSameStats requirement
  if (hasSameStats === goal.hasSameStats()) {
    return printStatFields(goal, "#end-");
  }

  switch (hasSameStats) {
    case true: {
      // Leave out lowest and highest stats to balance out the middle
      const allKeys = Object.keys(goal);
      const [firstKey, secondKey] = allKeys.filter(
        (key) => key !== reqStat && key !== goal.getMaxStatName()[0]
      );

      if (goal[firstKey] !== goal[secondKey]) {
        switch (goal[firstKey] > goal[secondKey]) {
          case true: {
            goal[secondKey] = goal[firstKey];
            break;
          }
          case false: {
            goal[firstKey] = goal[secondKey];
          }
        }
      }

      // Ensure all stats can be trained using 3, 5, and 9
      while (
        EXCLUDED_VALUES.includes(goal[firstKey] - base[firstKey]) ||
        EXCLUDED_VALUES.includes(goal[secondKey] - base[secondKey])
      ) {
        goal[firstKey] += 1;
        goal[secondKey] += 1;
      }
      break;
    }
    case false: {
      const allValues = Object.values(goal);
      const duplicateValues = [];
      allValues.forEach((value) => {
        if (allValues.indexOf(value) !== allValues.lastIndexOf(value))
          duplicateValues.push(value);
      });

      if (duplicateValues.length !== 2)
        return alert(
          `[계산식 에러] 아래 문자를 드래곤, 시작 성격, 목표 성격과 함께 오픈카톡으로 제보해주세요!:\n${duplicateValues.join(
            "-"
          )}`
        );

      const duplicateKeys = [];
      STAT_LISTS.base.forEach((stat) => {
        if (goal[stat] === duplicateValues[0]) duplicateKeys.push(stat);
      });
      goal[duplicateKeys[0]] = goal[duplicateKeys[0]] + BASE_INCREMENT;
      break;
    }
  }

  printStatFields(goal, "#end-");
}

function getValidReqValue(currentValue) {
  let newValue;
  TRAIN_VALUES.forEach((value) => {
    if (!newValue && currentValue < value) {
      newValue = value;
    }
  });
  return newValue;
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

function replaceWithNine(count) {
  const optimizable = count.includes(3) && count.includes(5);
  if (!optimizable) return null;
  while (count.includes(3) && count.includes(5)) {
    count.splice(count.indexOf(3), 1);
    count.splice(count.indexOf(5), 1);
    count.unshift(9);
  }
  return [...count];
}

function replaceWithNine2(count) {
  const optimizable = count.indexOf(3) !== count.lastIndexOf(3);
  if (!optimizable) return null;
  while (count.indexOf(3) !== count.lastIndexOf(3)) {
    count.splice(count.indexOf(3), 1);
    count.splice(count.indexOf(3), 1);
    count.unshift(9);
  }
  return [...count];
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
