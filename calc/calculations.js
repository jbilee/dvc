// import Stats from "../src/Stats.js"

const BASE_INCREMENT = 3;
const STAT_COUNT = 4;
const TRAIN_VALUES = [3, 5, 9];
const STAT_LISTS = {
  base: ["agility", "strength", "focus", "intellect"],
  start: [
    "#start-agility",
    "#start-strength",
    "#start-focus",
    "#start-intellect",
  ],
  end: ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"],
};
const COUNT_PREFIX = "train-count-";
const CLIP_TEXT = {
  agility: "순발력: ",
  strength: "근력: ",
  focus: "집중력: ",
  intellect: "지력: ",
};

const ADJUSTMENTS = {
  regular: new Map([
    [8, 9],
    [13, 14],
    [16, 18],
    [20, 21],
    [26, 27],
    [28, 27],
    [31, 32],
    [33, 32],
    [40, 41], // remove if gives invalid training
    [125, 126],
    [130, 131],
  ]),
  twenty: new Map([
    [0, 27],
    [5, 23],
    [10, 20],
    [15, 20],
  ]),
  twentyFive: new Map([
    [0, 27],
    [5, 26],
    [10, 28],
    [15, 25],
    [20, 25],
  ]),
};

// Attach event listeners to base stat input fields (to disable/enable dull trait)
for (const stat of STAT_LISTS.base) {
  const field = document.getElementById(`start-${stat}`);
  field.addEventListener("change", detectBase);
}

function detectBase(e) {
  if (e.target.value <= 25) return enableDull();
  return disableDull();
}

function selectDragon() {
  // Initialize variables
  const firstTrait = document.getElementById("trait1");
  const secondTrait = document.getElementById("trait2");
  const dragonName = document.getElementById("dragon-selector").value;
  const dragonIndex = dragonList.findIndex((dragons) => {
    return dragons.name[0] === dragonName;
  });

  // Enable trait selector
  document.getElementById("start-trait-selector").removeAttribute("disabled");

  // Reset previously selected base stat values and trait
  document.getElementById("start-trait-selector").selectedIndex = 0;
  STAT_LISTS.start.forEach((stat) => (document.querySelector(stat).value = 0));

  // Fill in trait dropdown choices
  firstTrait.textContent = dragonList[dragonIndex].traitsKo[0];
  firstTrait.value = dragonList[dragonIndex].traitsEn[0];
  secondTrait.textContent = dragonList[dragonIndex].traitsKo[1];
  secondTrait.value = dragonList[dragonIndex].traitsEn[1];
}

// Print the selected dragon's base stats
function selectStartTrait(e) {
  const traitSelected = e.target.value;
  const dragonName = document.querySelector("#dragon-selector").value;
  const dragonIndex = dragonList.findIndex((dragons) => {
    return dragons.name[0] === dragonName;
  });

  // Fill in base stats
  STAT_LISTS.start.forEach(
    (stat, i) =>
      (document.querySelector(stat).value =
        dragonList[dragonIndex][traitSelected][i])
  );

  // Disable selector for end traits where applicable
  unavailabilityCheck(dragonIndex, traitSelected);
}

// Print recommended end stats for selected special trait
function selectSpecialTrait(e) {
  const traitSelected = e.target.value;
  const traitIndex = specialTraits.findIndex((traits) => {
    return traits.nameEn === traitSelected;
  });

  //Check for 9-only
  const testAreaCheckbox = document.querySelector(".test-area input");

  // Store dragon's base stats
  const base = getStatFields("#start-");

  switch (traitSelected) {
    case "Perfectionist": {
      const final = new Stats(...calcTwenty(base));
      if (testAreaCheckbox.checked && !specialTraits[traitIndex].valueSensitive) {
        filteredAdjustment(base, final);
      }
      printStatFields(final, "#end-");
      break;
    }

    case "Classy": {
      const final = new Stats(...calcTwenty(base));
      printStatFields(final, "#end-");
      break;
    }

    case "Noble": {
      const final = new Stats(...calcTwenty(base));
      printStatFields(final, "#end-");
      break;
    }

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
          goal[change.traitName] = change.value;
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
          goal[change.traitName] = change.value;
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
            goal[change.traitName] = change.value;
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
            goal[change.traitName] = change.value;
          });
          printStatFields(goal, "#end-");
        } else {
          const changesToMake = compareTrainingCounts(
            base,
            remainingStats,
            keptValues
          );
          changesToMake.forEach((change) => {
            goal[change.traitName] = change.value;
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
          goal[change.traitName] = change.value;
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
      if (maxValue <= 20) {
        for (let i = 0; i < STAT_COUNT; i++) {
          document.querySelector(STAT_LISTS.end[i]).value =
            specialTraits[traitIndex].stats[i];
        }
      } else {
        for (let i = 0; i < STAT_COUNT; i++) {
          document.querySelector(STAT_LISTS.end[i]).value = 25;
        }
      }
      break;
    }

    case "Capable": {
      const maxValue = base.getMaxStatValue();
      if (maxValue < 30) {
        for (let i = 0; i < STAT_COUNT; i++) {
          document.querySelector(STAT_LISTS.end[i]).value =
            specialTraits[traitIndex].stats[i];
        }
      } else {
        for (let i = 0; i < STAT_COUNT; i++) {
          document.querySelector(STAT_LISTS.end[i]).value = 30;
        }
      }
      break;
    }

    case "Solitary": {
      const goal = new Stats();
      STAT_LISTS.base.forEach((stat) => {
        if (base[stat].toString().endsWith("5")) {
          goal[stat] = base[stat] + 6;
        } else {
          goal[stat] = base[stat] + 11;
        }
      });

      printStatFields(goal, "#end-");
      break;
    }

    default:
      for (let i = 0; i < STAT_COUNT; i++) {
        document.querySelector(STAT_LISTS.end[i]).value =
          specialTraits[traitIndex].stats[i];
      }
  }
}

function compareTrainingCounts(base, traits, goals) {
  const firstComboOne = calculateTrainCount(
    goals[0] - base[traits[0]],
    TRAIN_VALUES
  );
  const firstComboTwo = calculateTrainCount(
    goals[1] - base[traits[1]],
    TRAIN_VALUES
  );

  const secondComboOne = calculateTrainCount(
    goals[1] - base[traits[0]],
    TRAIN_VALUES
  );
  const secondComboTwo = calculateTrainCount(
    goals[0] - base[traits[1]],
    TRAIN_VALUES
  );

  if (!firstComboOne || !firstComboTwo) {
    return [
      { traitName: traits[0], value: goals[1] },
      { traitName: traits[1], value: goals[0] },
    ];
  }
  if (!secondComboOne || !secondComboTwo) {
    return [
      { traitName: traits[0], value: goals[0] },
      { traitName: traits[1], value: goals[1] },
    ];
  }

  const firstComboCounts = firstComboOne.length + firstComboTwo.length;
  const secondComboCounts = secondComboOne.length + secondComboTwo.length;

  if (firstComboCounts < secondComboCounts) {
    return [
      { traitName: traits[0], value: goals[0] },
      { traitName: traits[1], value: goals[1] },
    ];
  } else {
    return [
      { traitName: traits[0], value: goals[1] },
      { traitName: traits[1], value: goals[0] },
    ];
  }
}

function getStatFields(prefix) {
  const values = new Stats();
  for (const stat of STAT_LISTS.base) {
    values[stat] = Number(document.querySelector(`${prefix}${stat}`).value);
  }
  return values;
}

function printStatFields(stats, prefix) {
  for (const stat in stats) {
    document.querySelector(`${prefix}${stat}`).value = stats[stat];
  }
}

function getFirstKeyByValue(obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value) || null;
}

// Print recommended end stats for selected normal trait
function selectNormalTrait(e) {
  // Store dragon's base stats
  const base = getStatFields("#start-");

  const traitSelected = e.target.value;
  const traitIndex = normalTraits.findIndex((trait) => {
    return trait.nameEn === traitSelected;
  });
  const highestReq = normalTraits[traitIndex].highestStat;
  const lowestReq = normalTraits[traitIndex].lowestTrait;
  let req;

  if (lowestReq === "none") req = doubleTraining(base, highestReq);
  else req = singleTraining(base, highestReq, lowestReq);

  printStatFields(req, "#end-");

  // Make coloring the borders optional for now
  // colorStatFields(traitIndex);
}

function doubleTraining(base, highest) {
  let req = calcSingleHighest(base, highest);
  const sortedArr = req.sortInc();

  if (sortedArr[0] !== sortedArr[1]) req = calcDoubleLowest(req, sortedArr);

  const diff = getStatDifference(base, req);
  const optimized = optimizeHighest(base, diff, highest);
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

function optimizeHighest(base, change, targetTrait) {
  const newStats = copyStats(change);
  for (const stat in newStats) {
    const curValue = newStats[stat];
    if (ADJUSTMENTS.regular.has(curValue)) {
      newStats[stat] = ADJUSTMENTS.regular.get(curValue);
    }
  }
  const application = getStatSum(base, newStats);
  const newMax = application.getMaxStatName();
  if (newMax.length === 1 && newMax.includes(targetTrait)) return newStats;
  return change;
}

function colorStatFields(index) {
  const high = normalTraits[index].highestStat;
  const low = normalTraits[index].lowestTrait;
  document.querySelector(`#end-${high}`).style.border = "solid 2px red";
  document.querySelector(`#end-${low}`).style.border = "solid 2px blue";
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

// Will always return one lowest trait
function calcSingleLowest(curStats, lowestReq) {
  const newStats = copyStats(curStats);
  const baseMinTrait = curStats.getMinStatName();
  const reqVal = curStats[lowestReq];

  if (baseMinTrait.length === 1 && baseMinTrait[0] === lowestReq)
    return newStats;
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

// Always returns one highest trait
function calcSingleHighest(curStats, highestReq) {
  const newStats = copyStats(curStats);
  const baseMaxTrait = curStats.getMaxStatName();
  const baseMaxValue = curStats.getMaxStatValue();
  const includesReq = baseMaxTrait.includes(highestReq);

  if (baseMaxTrait.length === 1 && includesReq) return newStats;
  if (
    (baseMaxTrait.length > 1 && includesReq) ||
    baseMaxTrait[0] !== highestReq
  )
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

function printTrainingCount(traitType) {
  let reqStat =
    document.querySelector(`#end-${traitType}`).value -
    document.querySelector(`#start-${traitType}`).value;

  const trainCount = calculateTrainCount(reqStat, TRAIN_VALUES);

  if (!trainCount) {
    throw new Error(
      `조합할 수 없는 숫자가 있습니다 (${reqStat}). 다른 목표치를 설정해주세요!`
    );
  }

  if (reqStat < 0) {
    reqStat = 0;
    document.querySelector(`#required-${traitType}`).textContent = "+0";
  } else {
    document.querySelector(`#required-${traitType}`).textContent =
      "+" + reqStat;
  }

  let trainText;

  if (trainCount[5] === 9) {
    let nineCount = trainCount.lastIndexOf(9) + 1;
    trainCountCondensed = trainCount.slice(nineCount);
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
    document.querySelector(`#train-count-${traitType}`).textContent = "-";
  } else {
    document.querySelector(`#train-count-${traitType}`).innerHTML = trainText;
  }
}

function calculateTrainCount(targetSum, trainValues, memo = {}) {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;

  let shortestCombination = null;

  for (let num of trainValues) {
    const remainder = targetSum - num;
    const remainderResult = calculateTrainCount(remainder, trainValues, memo);
    if (remainderResult !== null) {
      const combination = [...remainderResult, num];
      if (
        shortestCombination === null ||
        combination.length < shortestCombination.length
      ) {
        shortestCombination = combination;
      }
    }
  }
  memo[targetSum] = shortestCombination;
  return shortestCombination;
}

function disableDull() {
  document.getElementById("special-trait-selector").selectedIndex = 0;
  const dull = document.getElementById("Dull");
  dull.setAttribute("disabled", "");
  dull.textContent = "평범한 (조건초과)";
}

function enableDull() {
  const dull = document.getElementById("Dull");
  dull.removeAttribute("disabled");
  dull.textContent = "평범한";
}

function unavailabilityCheck(dragonIndex, traitSelected) {
  if (
    dragonList[dragonIndex][traitSelected].findIndex((item) => item > 25) === -1
  )
    return enableDull();

  for (let i = 0; i < STAT_COUNT; i++) {
    if (dragonList[dragonIndex][traitSelected][i] > 25) return disableDull();
  }
}

function reset() {
  for (let i = 0; i < STAT_COUNT; i++) {
    document.querySelector(STAT_LISTS.end[i]).value = 0;
  }

  document.getElementById("special-trait-selector").selectedIndex = 0;
  document.getElementById("normal-trait-selector").selectedIndex = 0;
}

function copyResults() {
  const text = [];
  STAT_LISTS.base.forEach((stat) => {
    const field = document.getElementById(`${COUNT_PREFIX}${stat}`);
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

function displayToast(successful) {
  const container = document.getElementById("main-content");
  if (container.lastElementChild.id === "toast") {
    container.lastElementChild.remove();
  }

  const newToast = document.createElement("div");
  newToast.id = "toast";
  newToast.innerText = successful ? "복사되었습니다." : "복사에 실패했습니다.";

  container.appendChild(newToast);
  newToast.style.animationPlayState = "running";
  setTimeout(() => {
    newToast.remove();
  }, 610);
}

function addFavorites() {
  // get favoritesData values
  localStorage.setItem("dcfvs", JSON.stringify(favoritesData))
}

function loadFavorites() {
  const favoritesData = JSON.parse(localStorage.getItem("dcfvs"));
  if (favoritesData) {
    // loading logic
  }
}

function filteredAdjustment(base, goal) {
  console.log(goal)
  STAT_LISTS.base.forEach((stat) => {
    if ((goal[stat] - base[stat]) % 9 !== 0) {
      while ((goal[stat] - base[stat]) % 9 !== 0) {
        goal[stat] += 1;
      }
    }
  });

  console.log(goal)
}

// Delete later
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
}
