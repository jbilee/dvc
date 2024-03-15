import Stats from "../Stats.js";
import {
  $,
  displayToast,
  getArraySum,
  getFirstKeyByValue,
  getTargetSum,
} from "../utilities.js";
import { TRAIN_VALUES, EXCLUDED_VALUES, STAT_LISTS } from "../constants.js";
import { dragonList } from "../dd.js";
import { normalTraits, specialTraits } from "../td.js";

class Calculator {
  constructor(settings) {
    this.poisonedValue = null;
    this.updateSettings(settings);
    this.addListeners();
  }

  updateSettings({ priorityOn, prefStat, noSerious, language }) {
    this.highestFirst = priorityOn;
    this.preference = prefStat;
    this.noSerious = noSerious;
    this.language = language;
  }

  addListeners() {
    STAT_LISTS.start.forEach((stat) =>
      $(stat).addEventListener("change", () => this.checkDullAvailability())
    );
    $("#dragon-selector").addEventListener("change", (e) =>
      this.selectDragon(e)
    );
    $("#start-trait-selector").addEventListener("change", (e) =>
      this.selectStartTrait(e)
    );
    $("#normal-trait-selector").addEventListener("change", (e) =>
      this.selectNormalTrait(e)
    );
    $("#special-trait-selector").addEventListener("change", (e) =>
      this.selectSpecialTrait(e)
    );
    $("#btn-calculate").addEventListener("click", () => this.calculate());
    $("#btn-reset").addEventListener("click", () => this.reset());
    $("#poisoned").addEventListener("change", (e) =>
      this.handleCheckPoisoned(e)
    );
  }

  handleCheckPoisoned(e) {
    const currentStats = this.getStatFields("#start-");
    const maxStatNames = currentStats.getMaxStatName();

    // Display warning if highest value is more than one
    if (!this.poisonedValue && maxStatNames.length > 1)
      displayToast(
        this.language === "ko"
          ? "맹독은 한 가지 노력치에만 적용할 수 있습니다."
          : "Venom applies to only one stat.",
        3700
      );

    const maxStatName = maxStatNames[0];
    const maxStatValue = currentStats.getMaxStatValue();

    if (e.target.checked) {
      $(`#start-${maxStatName}`).value =
        maxStatValue - 10 <= 0 ? 0 : maxStatValue - 10;
      this.poisonedValue = { stat: maxStatName, value: maxStatValue };
      this.checkDullAvailability();
      this.reset();
    } else {
      $(`#start-${this.poisonedValue.stat}`).value = this.poisonedValue.value;
      this.poisonedValue = null;
      this.checkDullAvailability();
      this.reset();
    }
  }

  resetCheckboxes() {
    $("#poisoned").checked = false;
    this.poisonedValue = null;
  }

  handleCheckHigh(e) {
    if (e.target.checked) this.highestFirst = true;
    else this.highestFirst = false;
  }

  checkDullAvailability() {
    const currentStartValues = this.getStatFields("#start-");
    const isAvailable =
      currentStartValues.getMaxStatValue() <= 25 ? true : false;
    this.changeDullAvailability(isAvailable);
  }

  selectDragon(e) {
    // Initialize variables
    const dragonName = e.target.value;
    const { traitsEn, traitsKo } = dragonList.find(
      ({ name }) => name[0] === dragonName
    );
    const firstTrait = $("#trait1");
    const secondTrait = $("#trait2");

    // Enable trait selector
    $("#start-trait-selector").removeAttribute("disabled");

    // Reset previously selected base stat values and trait
    $("#start-trait-selector").selectedIndex = 0;
    STAT_LISTS.start.forEach((stat) => ($(stat).value = 0));
    this.resetCheckboxes();

    // Fill in trait dropdown choices
    firstTrait.textContent = this.language === "ko" ? traitsKo[0] : traitsEn[0];
    firstTrait.value = traitsEn[0];
    secondTrait.textContent =
      this.language === "ko" ? traitsKo[1] : traitsEn[1];
    secondTrait.value = traitsEn[1];
  }

  // Print the selected dragon's base stats
  selectStartTrait(e) {
    const traitSelected = e.target.value;
    const dragonName = $("#dragon-selector").value;
    const dragonData = dragonList.find((data) => data.name[0] === dragonName);
    const dragonStats = dragonData[traitSelected];

    // Fill in base stats
    STAT_LISTS.start.forEach((stat, i) => ($(stat).value = dragonStats[i]));

    const maxStatValue = Math.max(...dragonStats);
    if (maxStatValue > 25) this.changeDullAvailability(false);
    else this.changeDullAvailability(true);

    this.reset();
    this.resetCheckboxes();
  }

  // Print recommended end stats for selected special trait
  selectSpecialTrait(e) {
    const traitSelected = e.target.value;
    const traitIndex = specialTraits.findIndex((traits) => {
      return traits.nameEn === traitSelected;
    });

    // Store dragon's base stats
    const base = this.getStatFields("#start-");

    switch (traitSelected) {
      case "Meticulous": {
        const goal = this.copyStats(base);
        const startSum = base.getTotal();
        const reqSum = 100 - startSum;

        if (this.noSerious) {
          const adjustedSum = reqSum - 9;
          if (this.preference !== "none") {
            goal[this.preference] += adjustedSum;
            if (this.preference === "strength") goal.intellect += 9;
            else goal.strength += 9;
          } else {
            goal.strength += adjustedSum;
            goal.intellect += 9;
          }
        } else {
          if (this.preference !== "none") goal[this.preference] += reqSum;
          else goal.strength += reqSum;
        }

        return this.printStatFields(goal, "#end-");
      }

      case "Distracted": {
        const curFocus = base.focus;
        const goal = this.copyStats(base);
        const baseStatValues = Object.values(base);

        if (curFocus === 15) {
          const zeroStat = getFirstKeyByValue(base, 0); // Will cause error if lowest stat isn't 0 (such as when user enters values themselves)
          const remainingStats = STAT_LISTS.base.filter(
            (x) => x !== zeroStat && x !== "focus"
          );
          const changesToMake = this.compareTrainingCounts(
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

          const [currentHighestStat] = goal.getMaxStatName();
          goal[currentHighestStat] =
            this.getOptimizedValue(
              goal[currentHighestStat] - base[currentHighestStat]
            ) + base[currentHighestStat];

          if (this.highestFirst) {
            goal[currentHighestStat] =
              this.replaceWithNine(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];
          }

          return this.printStatFields(goal, "#end-");
        }

        if (curFocus === 30) {
          const zeroStat = getFirstKeyByValue(base, 0);
          const remainingStats = STAT_LISTS.base.filter(
            (x) => x !== zeroStat && x !== "focus"
          );
          const changesToMake = this.compareTrainingCounts(
            base,
            remainingStats,
            [15, 45]
          ); // This line needs to be refactored if any of the other stats is bigger than 15
          changesToMake.forEach((change) => {
            goal[change.statName] = change.value;
          });

          const maxGoalStat = goal.getMaxStatName();
          const optimizedMaxGoal =
            this.getOptimizedValue(goal[maxGoalStat] - base[maxGoalStat]) +
            base[maxGoalStat];
          const finalMaxGoal =
            this.replaceWithNine(optimizedMaxGoal - base[maxGoalStat]) +
            base[maxGoalStat];
          goal[maxGoalStat] = finalMaxGoal;

          const [currentHighestStat] = goal.getMaxStatName();
          goal[currentHighestStat] =
            this.getOptimizedValue(
              goal[currentHighestStat] - base[currentHighestStat]
            ) + base[currentHighestStat];

          if (this.highestFirst) {
            goal[currentHighestStat] =
              this.replaceWithNine(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];
          }

          return this.printStatFields(goal, "#end-");
        }

        if (curFocus === 10 && goal.getMaxStatValue() === 30) {
          const allValues = Object.values(goal);
          if (allValues.indexOf(10) !== allValues.lastIndexOf(10)) {
            const maxKey = goal.getMaxStatName();
            goal[maxKey] = 57;
            const zeroKey = getFirstKeyByValue(goal, 0);
            goal[zeroKey] = 27;
            const leftoverKey = STAT_LISTS.base.filter(
              (stat) => goal[stat] === 10 && stat !== "focus"
            );
            goal[leftoverKey] = 42;

            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];
            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }

            return this.printStatFields(goal, "#end-");
          } else if (allValues.indexOf(0) !== allValues.lastIndexOf(0)) {
            const [zero1, zero2] = STAT_LISTS.base.filter(
              (stat) => goal[stat] === 0 && stat !== "focus"
            );
            goal[zero1] = 57;
            goal[zero2] = 27;
            const maxKey = getFirstKeyByValue(goal, 30);
            goal[maxKey] = 42;

            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];
            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }

            return this.printStatFields(goal, "#end-");
          }
        }

        if (curFocus === 10 && goal.getMaxStatValue() === 20) {
          if (baseStatValues.indexOf(0) !== baseStatValues.lastIndexOf(0)) {
            const [zero1, zero2] = STAT_LISTS.base.filter(
              (stat) => base[stat] === 0
            );
            goal[zero1] = 45;
            goal[zero2] = 63;
            const maxBaseStat = base.getMaxStatName();
            goal[maxBaseStat] = 25;
            return this.printStatFields(goal, "#end-");
          } else if (
            baseStatValues.indexOf(0) >= 0 &&
            baseStatValues.indexOf(0) === baseStatValues.lastIndexOf(0)
          ) {
            const [zeroKey] = STAT_LISTS.base.filter(
              (stat) => base[stat] === 0
            );
            goal[zeroKey] = 45;
            const [maxBaseStat] = base.getMaxStatName();
            goal[maxBaseStat] = 25;
            const [remainingKey] = STAT_LISTS.base.filter(
              (stat) =>
                stat !== "focus" && stat !== zeroKey && stat !== maxBaseStat
            );
            goal[remainingKey] = 64;
            return this.printStatFields(goal, "#end-");
          }
        }

        if (
          curFocus === 5 &&
          goal.getMaxStatValue() === 30 &&
          baseStatValues.indexOf(0) !== baseStatValues.lastIndexOf(0)
        ) {
          const [zero1, zero2] = STAT_LISTS.base.filter(
            (stat) => base[stat] === 0
          );
          goal[zero1] = 21;
          goal[zero2] = 54;
          const maxBaseStat = base.getMaxStatName();
          goal[maxBaseStat] = 39;
          return this.printStatFields(goal, "#end-");
        }

        if (
          curFocus === 5 &&
          goal.getMaxStatValue() === 20 &&
          baseStatValues.indexOf(0) !== baseStatValues.lastIndexOf(0)
        ) {
          const [zero1, zero2] = STAT_LISTS.base.filter(
            (stat) => base[stat] === 0
          );
          goal[zero1] = 36;
          goal[zero2] = 54;
          return this.printStatFields(goal, "#end-");
        }

        if (
          curFocus === 5 &&
          goal.getMaxStatValue() === 20 &&
          baseStatValues.indexOf(0) === baseStatValues.lastIndexOf(0) &&
          this.highestFirst
        ) {
          const [zeroKey] = STAT_LISTS.base.filter((stat) => base[stat] === 0);
          goal[zeroKey] = 36;
          const [remainingFive] = STAT_LISTS.base.filter(
            (stat) => base[stat] === 5 && stat !== "focus"
          );
          goal[remainingFive] = 59;
          return this.printStatFields(goal, "#end-");
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
            const maxGoalStat = goal.getMaxStatName();
            const optimizedMaxGoal =
              this.getOptimizedValue(goal[maxGoalStat] - base[maxGoalStat]) +
              base[maxGoalStat];
            const finalMaxGoal =
              this.replaceWithNine(optimizedMaxGoal - base[maxGoalStat]) +
              base[maxGoalStat];
            goal[maxGoalStat] = finalMaxGoal;

            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];

            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }

            return this.printStatFields(goal, "#end-");
          }
          if (remainingStats.length === 2) {
            const changesToMake = this.compareTrainingCounts(
              base,
              remainingStats,
              keptValues
            );
            changesToMake.forEach((change) => {
              goal[change.statName] = change.value;
            });
            const maxGoalStat = goal.getMaxStatName();
            const optimizedMaxGoal =
              this.getOptimizedValue(goal[maxGoalStat] - base[maxGoalStat]) +
              base[maxGoalStat];
            const finalMaxGoal =
              this.replaceWithNine(optimizedMaxGoal - base[maxGoalStat]) +
              base[maxGoalStat];
            goal[maxGoalStat] = finalMaxGoal;

            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];

            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }

            return this.printStatFields(goal, "#end-");
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

            const changesToMake = this.compareTrainingCounts(
              base,
              remainingStats,
              keptValues
            );
            changesToMake.forEach((change) => {
              goal[change.statName] = change.value;
            });

            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];

            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }

            return this.printStatFields(goal, "#end-");
          } else {
            const changesToMake = this.compareTrainingCounts(
              base,
              remainingStats,
              keptValues
            );
            changesToMake.forEach((change) => {
              goal[change.statName] = change.value;
            });

            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];

            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }

            return this.printStatFields(goal, "#end-");
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
            let goal;
            switch (targetValue) {
              case 0: {
                if (curFocus === 20) {
                  goal = new Stats(0, 0, 20, 0);
                  const remainingValues = this.highestFirst
                    ? [54, 36]
                    : [50, 36];
                  if (
                    this.preference !== "none" &&
                    this.preference !== "focus"
                  ) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    goal.strength = remainingValues.shift();
                    goal.intellect = remainingValues[0];
                  }
                }
                if (curFocus === 25) {
                  goal = new Stats(0, 0, 25, 0);
                  const remainingValues = this.highestFirst
                    ? [63, 41]
                    : [57, 41];
                  if (
                    this.preference !== "none" &&
                    this.preference !== "focus"
                  ) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    goal.strength = remainingValues.shift();
                    goal.intellect = remainingValues[0];
                  }
                }
                break;
              }
              case 5: {
                if (curFocus === 20) {
                  goal = new Stats(0, 0, 20, 0);
                  const remainingValues = [50, 35];
                  if (remainingStats.includes(this.preference)) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    const prefStat = remainingStats.includes("strength")
                      ? "strength"
                      : "intellect";
                    goal[prefStat] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== prefStat
                    );
                    goal[lastStat] = remainingValues[0];
                  }
                }
                if (curFocus === 25) {
                  goal = new Stats(0, 0, 25, 0);
                  const remainingValues = [59, 41];
                  if (remainingStats.includes(this.preference)) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    const prefStat = remainingStats.includes("strength")
                      ? "strength"
                      : "intellect";
                    goal[prefStat] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== prefStat
                    );
                    goal[lastStat] = remainingValues[0];
                  }
                }
                break;
              }
              case 10: {
                if (curFocus === 20) {
                  goal = new Stats(0, 0, 20, 0);
                  const remainingValues = [55, 37];
                  if (remainingStats.includes(this.preference)) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    const prefStat = remainingStats.includes("strength")
                      ? "strength"
                      : "intellect";
                    goal[prefStat] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== prefStat
                    );
                    goal[lastStat] = remainingValues[0];
                  }
                }
                if (curFocus === 25) {
                  goal = new Stats(0, 0, 25, 0);
                  const remainingValues = [55, 40];
                  if (remainingStats.includes(this.preference)) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    const prefStat = remainingStats.includes("strength")
                      ? "strength"
                      : "intellect";
                    goal[prefStat] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== prefStat
                    );
                    goal[lastStat] = remainingValues[0];
                  }
                }
                break;
              }
              case 15: {
                if (curFocus === 20) {
                  goal = new Stats(0, 0, 20, 0);
                  const remainingValues = [51, 36];
                  if (remainingStats.includes(this.preference)) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    const prefStat = remainingStats.includes("strength")
                      ? "strength"
                      : "intellect";
                    goal[prefStat] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== prefStat
                    );
                    goal[lastStat] = remainingValues[0];
                  }
                }
                if (curFocus === 25) {
                  goal = new Stats(0, 0, 25, 0);
                  const remainingValues = [60, 42];
                  if (remainingStats.includes(this.preference)) {
                    goal[this.preference] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== this.preference
                    );
                    goal[lastStat] = remainingValues[0];
                  } else {
                    const prefStat = remainingStats.includes("strength")
                      ? "strength"
                      : "intellect";
                    goal[prefStat] = remainingValues.shift();
                    const lastStat = remainingStats.filter(
                      (stat) => stat !== prefStat
                    );
                    goal[lastStat] = remainingValues[0];
                  }
                }
                break;
              }
            }
            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];
            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }
            return this.printStatFields(goal, "#end-");
          } else {
            const goals = [curFocus + 15, curFocus + 30];

            const changesToMake = this.compareTrainingCounts(
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

            const [currentHighestStat] = goal.getMaxStatName();
            goal[currentHighestStat] =
              this.getOptimizedValue(
                goal[currentHighestStat] - base[currentHighestStat]
              ) + base[currentHighestStat];

            if (this.highestFirst) {
              goal[currentHighestStat] =
                this.replaceWithNine(
                  goal[currentHighestStat] - base[currentHighestStat]
                ) + base[currentHighestStat];
            }

            this.printStatFields(goal, "#end-");
          }
        }
        break;
      }

      case "Immersed": {
        const goal = this.copyStats(base);
        const highestStats = base.getMaxStatName();
        const maxStatKey = highestStats.includes(this.preference)
          ? this.preference
          : highestStats.includes("strength")
          ? "strength"
          : highestStats.includes("intellect")
          ? "intellect"
          : highestStats[0];
        let goalValue = this.getOptimizedValue(150 - base[maxStatKey]);
        if (this.highestFirst) goalValue = this.replaceWithNine(goalValue);
        goal[maxStatKey] = base[maxStatKey] + goalValue;
        if (this.noSerious) {
          if (this.preference !== "none" && this.preference !== maxStatKey)
            goal[this.preference] += 9;
          else if (maxStatKey !== "intellect") goal.intellect += 9;
          else goal.strength += 9;
        }
        return this.printStatFields(goal, "#end-");
      }

      case "Dull": {
        try {
          const maxValue = base.getMaxStatValue();
          const goal = new Stats(maxValue, maxValue, maxValue, maxValue);

          // Optimization
          if (maxValue < 25) {
            let countsArray = STAT_LISTS.base.map((stat) =>
              getTargetSum(goal[stat] - base[stat], TRAIN_VALUES)
            );

            while (countsArray.includes(null)) {
              STAT_LISTS.base.forEach((stat) => (goal[stat] += 1));
              countsArray = STAT_LISTS.base.map((stat) =>
                getTargetSum(goal[stat] - base[stat], TRAIN_VALUES)
              );
            }

            if (goal.getMaxStatValue() > 25)
              throw new Error(
                this.language === "ko"
                  ? "현재 기본치로는 평범한 성격을 만들 수 없습니다."
                  : "It's not possible to train for Dull with current Base stats."
              );

            const currentTrainingCounts = countsArray.reduce((sum, cur) => {
              if (cur.length === 0) return sum;
              return sum + cur.length;
            }, 0);

            const tempGoal = this.copyStats(goal);
            STAT_LISTS.base.forEach((stat) => (tempGoal[stat] += 3));
            const tempArray = STAT_LISTS.base.map((stat) =>
              getTargetSum(tempGoal[stat] - base[stat], TRAIN_VALUES)
            );
            const tempTrainingCounts = tempArray.reduce((sum, cur) => {
              if (cur.length === 0) return sum;
              return sum + cur.length;
            }, 0);

            if (
              tempGoal.getMaxStatValue() < 25 &&
              tempTrainingCounts < currentTrainingCounts
            )
              return this.printStatFields(tempGoal, "#end-");
          }
          return this.printStatFields(goal, "#end-");
        } catch (e) {
          alert(e);
        }
      }

      case "Capable": {
        const maxValue = base.getMaxStatValue();
        if (maxValue === 0) {
          const goal = new Stats(27, 27, 27, 27);
          return this.printStatFields(goal, "#end-");
        }
        if (maxValue === 30) {
          const goal = new Stats(30, 30, 30, 30);
          return this.printStatFields(goal, "#end-");
        }
        const recommendedValues = specialTraits[traitIndex].stats;
        const goal = new Stats(...recommendedValues);

        const containsEight = STAT_LISTS.base.map((stat) => {
          const trainingCounts = getTargetSum(
            goal[stat] - base[stat],
            TRAIN_VALUES
          );
          return trainingCounts.includes(5) && trainingCounts.includes(3)
            ? true
            : false;
        });
        const containsEightSet = new Set(containsEight);
        if (containsEightSet.size === 1 && containsEightSet.has(true)) {
          STAT_LISTS.base.forEach((stat) => {
            goal[stat] += 1;
          });
        }

        const containsSix = STAT_LISTS.base.map((stat) => {
          const trainingCounts = getTargetSum(
            goal[stat] - base[stat],
            TRAIN_VALUES
          );
          return trainingCounts.indexOf(3) !== trainingCounts.lastIndexOf(3)
            ? true
            : false;
        });
        const containsSixSet = new Set(containsSix);
        if (
          containsSixSet.size === 1 &&
          containsSixSet.has(true) &&
          goal.getMaxStatValue() >= 27
        ) {
          STAT_LISTS.base.forEach((stat) => {
            goal[stat] -= 1;
          });
        }

        if (this.highestFirst) {
          for (let i = 0; i < 2; i++) {
            const containsFive = STAT_LISTS.base.map((stat) => {
              const trainingCounts = getTargetSum(
                goal[stat] - base[stat],
                TRAIN_VALUES
              );
              return trainingCounts.includes(5) ? true : false;
            });
            const containsFiveSet = new Set(containsFive);
            if (containsFiveSet.size === 1 && containsFiveSet.has(true)) {
              STAT_LISTS.base.forEach((stat) => (goal[stat] += 4));
            }
          }
          const containsThree = STAT_LISTS.base.map((stat) => {
            const trainingCounts = getTargetSum(
              goal[stat] - base[stat],
              TRAIN_VALUES
            );
            return trainingCounts.includes(3) ? true : false;
          });
          const containsThreeSet = new Set(containsThree);
          if (containsThreeSet.size === 1 && containsThreeSet.has(true)) {
            STAT_LISTS.base.forEach((stat) => (goal[stat] += 6));
          }
        }

        return this.printStatFields(goal, "#end-");
      }

      case "Solitary": {
        const goal = this.copyStats(base);
        STAT_LISTS.base.forEach((stat) => {
          while (!goal[stat].toString().endsWith("1")) {
            goal[stat] += 1;
          }
          if (EXCLUDED_VALUES.includes(goal[stat] - base[stat]))
            goal[stat] += 10;
        });
        return this.printStatFields(goal, "#end-");
      }

      default: {
        const dbValues = new Stats(...specialTraits[traitIndex].stats);
        const minStatValues = STAT_LISTS.base.map((stat) =>
          base[stat] > dbValues[stat] ? base[stat] : dbValues[stat]
        );
        const goal = new Stats(...minStatValues);

        STAT_LISTS.base.forEach(
          (stat) =>
            (goal[stat] =
              this.getOptimizedValue(goal[stat] - base[stat]) + base[stat])
        );

        if (this.highestFirst) {
          STAT_LISTS.base.forEach(
            (stat) =>
              (goal[stat] =
                this.replaceWithNine(goal[stat] - base[stat]) + base[stat])
          );
        }

        return this.printStatFields(goal, "#end-");
      }
    }
  }

  compareTrainingCounts(base, stats, goals) {
    const firstComboOne = getTargetSum(goals[0] - base[stats[0]], TRAIN_VALUES);
    const firstComboTwo = getTargetSum(goals[1] - base[stats[1]], TRAIN_VALUES);

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

  getStatFields(prefix) {
    const values = new Stats();
    for (const stat of STAT_LISTS.base) {
      values[stat] = Number($(`${prefix}${stat}`).value);
    }
    return values;
  }

  printStatFields(stats, prefix) {
    for (const stat in stats) {
      $(`${prefix}${stat}`).value = stats[stat];
    }
  }

  // Print recommended end stats for selected normal trait
  selectNormalTrait(e) {
    const startingTrait = $("#start-trait-selector").value;
    const traitSelected = e.target.value;

    // Store dragon's base stats
    const base = this.getStatFields("#start-");

    if (startingTrait === traitSelected)
      return this.printStatFields(base, "#end-");

    const traitIndex = normalTraits.findIndex((trait) => {
      return trait.nameEn === traitSelected;
    });
    const highestReqStat = normalTraits[traitIndex].highestStat;
    const lowestReqStat = normalTraits[traitIndex].lowestStat;
    let req;

    if (lowestReqStat === "none")
      req = this.doubleTraining(base, highestReqStat);
    else req = this.singleTraining(base, highestReqStat, lowestReqStat);

    this.printStatFields(req, "#end-");
  }

  doubleTraining(base, highestReqStat) {
    const goal = this.copyStats(base);
    const highestStats = goal.getMaxStatName();
    const highestValue = goal.getMaxStatValue();

    if (highestValue === 0) {
      goal[highestReqStat] = this.highestFirst ? 9 : 3;
      return goal;
    }

    if (
      !highestStats.includes(highestReqStat) ||
      (highestStats.includes(highestReqStat) && highestStats.length > 1)
    )
      goal[highestReqStat] = highestValue + 1;

    // Optimization
    goal[highestReqStat] =
      this.getOptimizedValue(goal[highestReqStat] - base[highestReqStat]) +
      base[highestReqStat];

    if (this.highestFirst) {
      goal[highestReqStat] =
        this.replaceWithNine(goal[highestReqStat] - base[highestReqStat]) +
        base[highestReqStat];
    }

    // Balance out lowest stat
    const [lowest1, lowest2] = goal.sortByIncreasing();
    if (lowest1 !== lowest2) {
      const lowest1Name = getFirstKeyByValue(goal, lowest1);
      goal[lowest1Name] = lowest2;
    }

    return goal;
  }

  singleTraining(base, highestReqStat, lowestReqStat) {
    const goal = this.copyStats(base);
    const targetStats = Object.keys(goal).filter(
      (key) => key !== highestReqStat && key !== lowestReqStat
    );

    if (goal.getMaxStatValue() === 0) {
      goal[highestReqStat] = this.highestFirst ? 9 : 5;
      targetStats.forEach((stat) => (goal[stat] = this.highestFirst ? 5 : 3));
      return goal;
    }

    targetStats.forEach((stat) => {
      if (goal[stat] <= goal[lowestReqStat]) {
        goal[stat] = goal[lowestReqStat] + 1;
      }
      while (EXCLUDED_VALUES.includes(goal[stat] - base[stat])) {
        goal[stat] += 1;
      }
      goal[stat] = this.getOptimizedValue(goal[stat] - base[stat]) + base[stat];
    });

    if (!goal.getMaxStatName().includes(highestReqStat)) {
      goal[highestReqStat] = goal.getMaxStatValue() + 1;
    }
    goal[highestReqStat] =
      this.getOptimizedValue(goal[highestReqStat] - base[highestReqStat]) +
      base[highestReqStat];

    if (this.highestFirst) {
      goal[highestReqStat] =
        this.replaceWithNine(goal[highestReqStat] - base[highestReqStat]) +
        base[highestReqStat];
      targetStats.forEach((stat) => {
        if (goal[highestReqStat] - goal[stat] > 6) {
          goal[stat] =
            this.replaceWithNine(goal[stat] - base[stat]) + base[stat];
        } else if (goal[highestReqStat] - goal[stat] > 4) {
          const trainingCounts = getTargetSum(
            goal[stat] - base[stat],
            TRAIN_VALUES
          );
          if (trainingCounts.includes(5)) goal[stat] += 4;
          if (trainingCounts.includes(3)) goal[stat] += 2;
        }
      });
    }

    return goal;
  }

  copyStats(object) {
    const newAgility = Number(object.agility);
    const newStrength = Number(object.strength);
    const newFocus = Number(object.focus);
    const newIntellect = Number(object.intellect);
    const newObject = new Stats(
      newAgility,
      newStrength,
      newFocus,
      newIntellect
    );
    return newObject;
  }

  calculate() {
    try {
      STAT_LISTS.base.forEach((stat) => this.checkViability(stat));
      STAT_LISTS.base.forEach((stat) => this.printTrainingCount(stat));
    } catch (e) {
      alert(e);
    }
  }

  checkViability(statType) {
    const endValue = $(`#end-${statType}`).value;
    const startValue = $(`#start-${statType}`).value;
    const reqStat = endValue - startValue;

    if (reqStat < 0)
      throw new Error(
        this.language === "ko"
          ? `목표치(${endValue})가 기본치(${startValue})보다 낮습니다. 더 높은 목표치를 설정해주세요!`
          : `The Goal(${endValue}) is lower than the Base(${startValue}). Try setting a higher goal!`
      );
    if (EXCLUDED_VALUES.includes(reqStat)) {
      throw new Error(
        this.language === "ko"
          ? `조합할 수 없는 숫자가 있습니다(${reqStat}). 다른 목표치를 설정해주세요!`
          : `Impossible to gain ${reqStat} Effort Values by training. Try setting a different goal!`
      );
    }
  }

  printTrainingCount(statType) {
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

  optimizeByOne(count) {
    const optimizable = count.includes(3) && count.includes(5);
    if (!optimizable) return null;
    while (count.includes(3) && count.includes(5)) {
      count.splice(count.indexOf(3), 1);
      count.splice(count.indexOf(5), 1);
      count.unshift(9);
    }
    return [...count];
  }

  optimizeByThree(count) {
    const optimizable = count.indexOf(3) !== count.lastIndexOf(3);
    if (!optimizable) return null;
    while (count.indexOf(3) !== count.lastIndexOf(3)) {
      count.splice(count.indexOf(3), 1);
      count.splice(count.indexOf(3), 1);
      count.unshift(9);
    }
    return [...count];
  }

  getOptimizedValue(value) {
    let trainingCounts = getTargetSum(value, TRAIN_VALUES);
    if (
      !trainingCounts.includes(5) &&
      !trainingCounts.includes(3) &&
      trainingCounts.indexOf(3) === trainingCounts.lastIndexOf(3)
    )
      return value;

    if (trainingCounts.includes(5) && trainingCounts.includes(3))
      trainingCounts = this.optimizeByOne(trainingCounts);
    if (trainingCounts.indexOf(3) !== trainingCounts.lastIndexOf(3))
      trainingCounts = this.optimizeByThree(trainingCounts);
    return getArraySum(trainingCounts);
  }

  replaceWithNine(value) {
    const trainingCounts = getTargetSum(value, TRAIN_VALUES);
    while (trainingCounts.includes(5) || trainingCounts.includes(3)) {
      if (trainingCounts.includes(5))
        trainingCounts.splice(trainingCounts.indexOf(5), 1, 9);
      if (trainingCounts.includes(3))
        trainingCounts.splice(trainingCounts.indexOf(3), 1, 9);
    }
    return getArraySum(trainingCounts);
  }

  changeDullAvailability(isAvailable) {
    const dull = $("#Dull");
    if (isAvailable) return dull.removeAttribute("disabled");

    $("#special-trait-selector").selectedIndex = 0;
    dull.setAttribute("disabled", "");
  }

  reset() {
    STAT_LISTS.end.forEach((stat) => ($(stat).value = 0));
    $("#special-trait-selector").selectedIndex = 0;
    $("#normal-trait-selector").selectedIndex = 0;
  }
}

export default Calculator;
