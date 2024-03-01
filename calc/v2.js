// import Stats from "../src/Stats.js";
// import {
//   $,
//   displayToast,
//   getArraySum,
//   getFirstKeyByValue,
//   getTargetSum,
// } from "../src/utilities.js";
// import {
//   BASE_INCREMENT,
//   STAT_COUNT,
//   TRAIN_VALUES,
//   EXCLUDED_VALUES,
//   STAT_LISTS,
//   ADJUSTMENTS,
// } from "../src/constants.js";
import Calculator from "../src/models/Calculator.js";

new Calculator();

// let poisonedValue;
// let highestFirst = false;

// STAT_LISTS.start.forEach((stat) =>
//   $(stat).addEventListener("change", checkDullAvailability)
// );

// // apply dev controls
// $("#dev-increase").addEventListener("click", () => {
//   STAT_LISTS.end.forEach((stat) => $(stat).value = Number($(stat).value) + 1)
// })
// $("#dev-decrease").addEventListener("click", () => {
//   STAT_LISTS.end.forEach((stat) => $(stat).value = Number($(stat).value) - 1)
// })
// // delete later

// $("#dragon-selector").addEventListener("change", selectDragon);
// $("#start-trait-selector").addEventListener("change", selectStartTrait);
// $("#normal-trait-selector").addEventListener("change", selectNormalTrait);
// $("#special-trait-selector").addEventListener("change", selectSpecialTrait);
// $("#btn-calculate").addEventListener("click", calculate);
// $("#btn-reset").addEventListener("click", reset);
// $("#nines").addEventListener("change", handleCheckHigh);
// $("#poisoned").addEventListener("change", handleCheckPoisoned);

// function handleCheckPoisoned(e) {
//   const currentStats = getStatFields("#start-");
//   const maxStatName = currentStats.getMaxStatName();
//   const maxStatValue = currentStats.getMaxStatValue();

//   // Turn off check if highest starting value is 0
//   if (!poisonedValue && maxStatValue === 0) {
//     e.target.checked = false;
//     return displayToast("맹독을 적용할 대상이 없습니다.");
//   }

//   if (e.target.checked) {
//     $(`#start-${maxStatName}`).value =
//       maxStatValue - 10 <= 0 ? 0 : maxStatValue - 10;
//     poisonedValue = { stat: maxStatName, value: maxStatValue };
//     changeDullAvailability(true);
//     reset();
//   } else {
//     if (poisonedValue.value > 25) changeDullAvailability(false);
//     reset();
//     $(`#start-${poisonedValue.stat}`).value = poisonedValue.value;
//     poisonedValue = null;
//   }
// }

// function resetCheckboxes() {
//   $("#nines").checked = false;
//   $("#poisoned").checked = false;
//   highestFirst = false;
//   poisonedValue = null;
// }

// function handleCheckHigh(e) {
//   if (e.target.checked) highestFirst = true;
//   else highestFirst = false;
// }

// function checkDullAvailability(e) {
//   const isAvailable = e.target.value <= 25 ? true : false;
//   changeDullAvailability(isAvailable);
// }

// function selectDragon(e) {
//   // Initialize variables
//   const dragonName = e.target.value;
//   const { traitsEn, traitsKo } = dragonList.find(
//     (data) => data.name[0] === dragonName
//   );
//   const firstTrait = $("#trait1");
//   const secondTrait = $("#trait2");

//   // Enable trait selector
//   $("#start-trait-selector").removeAttribute("disabled");

//   // Reset previously selected base stat values and trait
//   $("#start-trait-selector").selectedIndex = 0;
//   STAT_LISTS.start.forEach((stat) => ($(stat).value = 0));
//   resetCheckboxes();

//   // Fill in trait dropdown choices
//   firstTrait.textContent = traitsKo[0];
//   firstTrait.value = traitsEn[0];
//   secondTrait.textContent = traitsKo[1];
//   secondTrait.value = traitsEn[1];
// }

// // Print the selected dragon's base stats
// function selectStartTrait(e) {
//   const traitSelected = e.target.value;
//   const dragonName = $("#dragon-selector").value;
//   const dragonData = dragonList.find((data) => data.name[0] === dragonName);
//   const dragonStats = dragonData[traitSelected];

//   // Fill in base stats
//   STAT_LISTS.start.forEach((stat, i) => ($(stat).value = dragonStats[i]));

//   const maxStatValue = Math.max(...dragonStats);
//   if (maxStatValue > 25) changeDullAvailability(false);
//   else changeDullAvailability(true);

//   reset();
//   resetCheckboxes();
// }

// // Print recommended end stats for selected special trait
// function selectSpecialTrait(e) {
//   const traitSelected = e.target.value;
//   const traitIndex = specialTraits.findIndex((traits) => {
//     return traits.nameEn === traitSelected;
//   });

//   //Check for 9-only
//   const testAreaCheckbox = $(".test-area input");

//   // Store dragon's base stats
//   const base = getStatFields("#start-");

//   switch (traitSelected) {
//     case "Perfectionist": {
//       const goal = new Stats(...calcTwentyFive(base));
//       return printStatFields(goal, "#end-");
//     }

//     case "Meticulous": {
//       const goal = copyStats(base);
//       const allKeys = Object.keys(goal);
//       allKeys.forEach((key) => {
//         if (goal[key] % 10 !== 0) {
//           goal[key] += 5;
//         }
//       });
//       return printStatFields(goal, "#end-");
//     }

//     case "Distracted": {
//       const goal = copyStats(base);
//       const applicableKeys = ["agility", "strength", "intellect"];
//       const unavailableValues = [goal.focus];



//       return printStatFields(goal, "#end-");
//     }

//     case "Immersed": {
//       const goal = copyStats(base);
//       const maxStatKey = base.getMaxStatName();
//       const goalValue = getOptimizedValue(120 - base[maxStatKey]);
//       goal[maxStatKey] = base[maxStatKey] + goalValue;
//       return printStatFields(goal, "#end-");
//     }

//     case "Dull": {
//       const maxValue = base.getMaxStatValue();
//       const goal = new Stats(maxValue, maxValue, maxValue, maxValue);

//       // Optimization
//       if (maxValue < 25) {
//         const tempGoal = copyStats(goal);
//         const countsArray = STAT_LISTS.base.map((stat) =>
//           getTargetSum(goal[stat] - base[stat], TRAIN_VALUES)
//         );
//         const currentTrainingCounts = countsArray.reduce((sum, cur) => {
//           if (cur.length === 0) return sum;
//           return sum + cur.length;
//         }, 0);

//         STAT_LISTS.base.forEach((stat) => (tempGoal[stat] += 3));
//         const tempArray = STAT_LISTS.base.map((stat) =>
//           getTargetSum(tempGoal[stat] - base[stat], TRAIN_VALUES)
//         );
//         const tempTrainingCounts = tempArray.reduce((sum, cur) => {
//           if (cur.length === 0) return sum;
//           return sum + cur.length;
//         }, 0);

//         if (tempTrainingCounts < currentTrainingCounts)
//           return printStatFields(tempGoal, "#end-");
//       }
//       return printStatFields(goal, "#end-");
//     }

//     case "Capable": {
//       const maxValue = base.getMaxStatValue();
//       if (maxValue === 30) {
//         const goal = new Stats(30, 30, 30, 30);
//         return printStatFields(goal, "#end-");
//       }
//       const recommendedStats = specialTraits[traitIndex].stats;
//       const goal = new Stats(...recommendedStats);
//       return printStatFields(goal, "#end-");
//     }

//     case "Solitary": {
//       const goal = copyStats(base);
//       STAT_LISTS.base.forEach((stat) => {
//         while (!goal[stat].toString().endsWith("1")) {
//           goal[stat] += 1;
//         }
//         if (EXCLUDED_VALUES.includes(goal[stat] - base[stat])) goal[stat] += 10;
//       });
//       return printStatFields(goal, "#end-");
//     }

//     default:
//       // Standard calculation
//       const final = new Stats(...calcTwenty(base));
//       printStatFields(final, "#end-");

//     // If 9-only training is checked:
//     // const final = calcDefault(traitSelected, base);
//     // printStatFields(final, "#end-");
//   }
// }

// function compareTrainingCounts(base, stats, goals) {
//   const firstComboOne = getTargetSum(goals[0] - base[stats[0]], TRAIN_VALUES);
//   const firstComboTwo = getTargetSum(goals[1] - base[stats[1]], TRAIN_VALUES);

//   const secondComboOne = getTargetSum(goals[1] - base[stats[0]], TRAIN_VALUES);
//   const secondComboTwo = getTargetSum(goals[0] - base[stats[1]], TRAIN_VALUES);

//   if (!firstComboOne || !firstComboTwo) {
//     return [
//       { statName: stats[0], value: goals[1] },
//       { statName: stats[1], value: goals[0] },
//     ];
//   }
//   if (!secondComboOne || !secondComboTwo) {
//     return [
//       { statName: stats[0], value: goals[0] },
//       { statName: stats[1], value: goals[1] },
//     ];
//   }

//   const firstComboCounts = firstComboOne.length + firstComboTwo.length;
//   const secondComboCounts = secondComboOne.length + secondComboTwo.length;

//   if (firstComboCounts < secondComboCounts) {
//     return [
//       { statName: stats[0], value: goals[0] },
//       { statName: stats[1], value: goals[1] },
//     ];
//   } else {
//     return [
//       { statName: stats[0], value: goals[1] },
//       { statName: stats[1], value: goals[0] },
//     ];
//   }
// }

// function getStatFields(prefix) {
//   const values = new Stats();
//   for (const stat of STAT_LISTS.base) {
//     values[stat] = Number($(`${prefix}${stat}`).value);
//   }
//   return values;
// }

// function printStatFields(stats, prefix) {
//   for (const stat in stats) {
//     $(`${prefix}${stat}`).value = stats[stat];
//   }
// }

// // function getFirstKeyByValue(obj, value) {
// //   return Object.keys(obj).find((key) => obj[key] === value) || null;
// // }

// // Print recommended end stats for selected normal trait
// function selectNormalTrait(e) {
//   // Store dragon's base stats
//   const base = getStatFields("#start-");

//   const traitSelected = e.target.value;
//   const traitIndex = normalTraits.findIndex((trait) => {
//     return trait.nameEn === traitSelected;
//   });
//   const highestReqStat = normalTraits[traitIndex].highestStat;
//   const lowestReqStat = normalTraits[traitIndex].lowestStat;
//   let req;

//   if (lowestReqStat === "none") req = doubleTraining(base, highestReqStat);
//   else req = singleTraining(base, highestReqStat, lowestReqStat);

//   printStatFields(req, "#end-");
// }

// function doubleTraining(base, highest) {
//   let req = calcSingleHighest(base, highest);
//   const sortedArr = req.sortByIncreasing();

//   if (sortedArr[0] !== sortedArr[1]) req = calcDoubleLowest(req, sortedArr);

//   const diff = getStatDifference(base, req);
//   const optimized = optimizeHighest(diff, highest);
//   const final = getStatSum(base, optimized);

//   return final;
// }

// function singleTraining(base, highest, lowest) {
//   // Determine lowest required state
//   let req = calcSingleLowest(base, lowest);

//   // Determine highest required stat
//   req = calcSingleHighest(req, highest);

//   const diff = getStatDifference(base, req);

//   // Optimization
//   const optimized = optimizeAll(base, diff, highest, lowest);
//   const final = getStatSum(base, optimized);

//   return final;
// }

// function optimizeAll(base, change, highest, lowest) {
//   const newStats = copyStats(change);
//   for (const stat in newStats) {
//     const curValue = newStats[stat];
//     if (ADJUSTMENTS.regular.has(curValue)) {
//       // try inserting new value
//       newStats[stat] = ADJUSTMENTS.regular.get(curValue);
//       // replace value and see if highest of stats and lowest of stats changed (compare newStats highest and lowest using getMax and getMin)
//     }
//   }
//   const application = getStatSum(base, newStats);
//   const newMax = application.getMaxStatName();
//   const newMin = application.getMinStatName();
//   if (
//     newMax.length === 1 &&
//     newMin.length === 1 &&
//     newMax.includes(highest) &&
//     newMin.includes(lowest)
//   )
//     return newStats;
//   return change;
// }

// function optimizeHighest(change, targetStat) {
//   const newStats = copyStats(change);
//   const targetValue = newStats[targetStat];

//   if (ADJUSTMENTS.regular.has(targetValue)) {
//     newStats[targetStat] = ADJUSTMENTS.regular.get(targetValue);
//   }

//   return newStats;
// }

// function copyStats(object) {
//   const newAgility = Number(object.agility);
//   const newStrength = Number(object.strength);
//   const newFocus = Number(object.focus);
//   const newIntellect = Number(object.intellect);
//   const newObject = new Stats(newAgility, newStrength, newFocus, newIntellect);
//   return newObject;
// }

// function getStatDifference(a, b) {
//   const sub = new Stats();
//   for (const stat of STAT_LISTS.base) {
//     sub[stat] = Math.abs(a[stat] - b[stat]);
//   }
//   return sub;
// }

// function getStatSum(a, b) {
//   const sum = new Stats();
//   for (const stat of STAT_LISTS.base) {
//     sum[stat] = a[stat] + b[stat];
//   }
//   return sum;
// }

// function calcDefault(targetTrait, curStats) {
//   const targetValues = specialTraits.filter(
//     (trait) => trait.nameEn === targetTrait
//   )[0].stats;

//   const goal = new Stats(...targetValues);

//   STAT_LISTS.base.forEach((stat) => {
//     if (curStats[stat] > goal[stat]) {
//       goal[stat] = curStats[stat];
//     }
//   });

//   console.log(goal);

//   filteredAdjustment(curStats, goal);

//   return goal;
// }

// function calcTwenty(curStats) {
//   const array = STAT_LISTS.base.map((stat) => curStats[stat]);

//   const final = array.map((stat) => {
//     if (ADJUSTMENTS.twenty.has(stat)) {
//       return ADJUSTMENTS.twenty.get(stat);
//     }
//     return stat;
//   });

//   return final;
// }

// function calcTwentyFive(curStats) {
//   const array = STAT_LISTS.base.map((stat) => curStats[stat]);

//   const final = array.map((stat) => {
//     if (ADJUSTMENTS.twentyFive.has(stat)) {
//       return ADJUSTMENTS.twentyFive.get(stat);
//     }
//     return stat;
//   });

//   return final;
// }

// // Will always return one lowest stat
// function calcSingleLowest(curStats, lowestReqStat) {
//   const newStats = copyStats(curStats);
//   const baseMinStat = curStats.getMinStatName();
//   const reqVal = curStats[lowestReqStat];

//   if (baseMinStat.length === 1 && baseMinStat[0] === lowestReqStat)
//     return newStats;
//   for (const stat in curStats) {
//     if (stat === lowestReqStat) continue;
//     if (curStats[stat] <= reqVal) newStats[stat] = reqVal + BASE_INCREMENT;
//   }
//   return newStats;
// }

// function calcDoubleLowest(curStats, array) {
//   const newStats = copyStats(curStats);
//   const lowestValue = array[0];
//   const adjustmentValue = array[1];
//   const adjustmentKey = getFirstKeyByValue(newStats, lowestValue);

//   newStats[adjustmentKey] = adjustmentValue;
//   return newStats;
// }

// // Always returns one highest stat
// function calcSingleHighest(curStats, highestReqStat) {
//   const newStats = copyStats(curStats);
//   const baseMaxStat = curStats.getMaxStatName();
//   const baseMaxValue = curStats.getMaxStatValue();
//   const includesReq = baseMaxStat.includes(highestReqStat);

//   if (baseMaxStat.length === 1 && includesReq) return newStats;
//   if (
//     (baseMaxStat.length > 1 && includesReq) ||
//     baseMaxStat[0] !== highestReqStat
//   )
//     newStats[highestReqStat] = baseMaxValue + BASE_INCREMENT;
//   return newStats;
// }

// function calculate() {
//   try {
//     STAT_LISTS.base.forEach((stat) => checkViability(stat));
//     STAT_LISTS.base.forEach((stat) => printTrainingCount(stat));
//   } catch (e) {
//     alert(e);
//   }
// }

// function checkViability(statType) {
//   const reqStat = $(`#end-${statType}`).value - $(`#start-${statType}`).value;
//   if (reqStat < 0)
//     throw new Error(
//       `목표치가 기본치보다 낮습니다. 더 높은 목표치를 설정해주세요!`
//     );
//   if (EXCLUDED_VALUES.includes(reqStat)) {
//     throw new Error(
//       `조합할 수 없는 숫자가 있습니다 (${reqStat}). 다른 목표치를 설정해주세요!`
//     );
//   }
// }

// function printTrainingCount(statType) {
//   const reqStat = $(`#end-${statType}`).value - $(`#start-${statType}`).value;
//   const trainCount = getTargetSum(reqStat, TRAIN_VALUES);

//   $(`#required-${statType}`).textContent = "+" + reqStat;

//   let trainText;

//   if (trainCount[5] === 9) {
//     let nineCount = trainCount.lastIndexOf(9) + 1;
//     const trainCountCondensed = trainCount.slice(nineCount);
//     trainText =
//       `<span class="nine">9</span><sub>(x${nineCount})</sub> ` +
//       trainCountCondensed
//         .map((e) => {
//           return e === 5
//             ? `<span class="five">${e}</span>`
//             : `<span class="three">${e}</span>`;
//         })
//         .join(" ");
//   } else {
//     trainText = trainCount
//       .map((e) => {
//         return e === 9
//           ? `<span class="nine">${e}</span>`
//           : e === 5
//           ? `<span class="five">${e}</span>`
//           : `<span class="three">${e}</span>`;
//       })
//       .join(" ");
//   }

//   if (trainCount.length === 0) {
//     $(`#train-count-${statType}`).textContent = "-";
//   } else {
//     $(`#train-count-${statType}`).innerHTML = trainText;
//   }
// }

// function optimizeByOne(count) {
//   const optimizable = count.includes(3) && count.includes(5);
//   if (!optimizable) return null;
//   while (count.includes(3) && count.includes(5)) {
//     count.splice(count.indexOf(3), 1);
//     count.splice(count.indexOf(5), 1);
//     count.unshift(9);
//   }
//   return [...count];
// }

// function optimizeByThree(count) {
//   const optimizable = count.indexOf(3) !== count.lastIndexOf(3);
//   if (!optimizable) return null;
//   while (count.indexOf(3) !== count.lastIndexOf(3)) {
//     count.splice(count.indexOf(3), 1);
//     count.splice(count.indexOf(3), 1);
//     count.unshift(9);
//   }
//   return [...count];
// }

// function getOptimizedValue(value) {
//   const initialCounts = getTargetSum(value, TRAIN_VALUES);
//   const filteredCounts = initialCounts.filter((value) => value !== 9);
//   const optimizableByOne =
//     filteredCounts.includes(5) && filteredCounts.includes(3);
//   const optimizableByThree =
//     filteredCounts.indexOf(3) !== filteredCounts.lastIndexOf(3);
//   const optimizedCounts = optimizableByOne
//     ? optimizeByOne(initialCounts)
//     : optimizableByThree
//     ? optimizeByThree(initialCounts)
//     : initialCounts;
//   return getArraySum(optimizedCounts);
// }

// const changeDullAvailability = (isAvailable) => {
//   const dull = $("#Dull");
//   if (isAvailable) return dull.removeAttribute("disabled");

//   $("#special-trait-selector").selectedIndex = 0;
//   dull.setAttribute("disabled", "");
// };

// function reset() {
//   STAT_LISTS.end.forEach((stat) => ($(stat).value = 0));
//   $("#special-trait-selector").selectedIndex = 0;
//   $("#normal-trait-selector").selectedIndex = 0;
// }

// function filteredAdjustment(base, goal) {
//   STAT_LISTS.base.forEach((stat) => {
//     if ((goal[stat] - base[stat]) % 9 !== 0) {
//       while ((goal[stat] - base[stat]) % 9 !== 0) {
//         goal[stat] += 1;
//       }
//     }
//   });

//   console.log(goal);
// }

// function adjustOneStat(base, goal) {
//   let adjusted = goal;
//   if ((goal - base) % 9 !== 0) {
//     while ((goal - base) % 9 !== 0) {
//       adjusted += 1;
//     }
//   }

//   return adjusted;
// }
