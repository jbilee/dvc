const BASEINCREMENT = 3;
const STATCOUNT = 4;
const trainValues = [3, 5, 9];
let dragonName, dragonIndex;
let reqAgility, reqStrength, reqFocus, reqIntellect;

function selectDragon() {
    // Initialize variables
    let baseStats = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    let firstTrait = document.querySelector("#trait1");
    let secondTrait = document.querySelector("#trait2");
    dragonName = document.querySelector("#dragon-selector").value;
    dragonIndex = dragonList.findIndex((dragons) => { return dragons.name[0] === dragonName; });

    // Enable trait selector
    document.querySelector("#start-trait-selector").removeAttribute("disabled");

    // Reset previously selected base stat values and trait
    document.querySelector("#start-trait-selector").selectedIndex = 0;
    for (let i = 0; i < STATCOUNT; i++) {
        document.querySelector(baseStats[i]).value = 0;
    }

    // Fill in trait dropdown choices
    firstTrait.textContent = dragonList[dragonIndex].traitsKo[0];
    firstTrait.value = dragonList[dragonIndex].traitsEn[0];
    secondTrait.textContent = dragonList[dragonIndex].traitsKo[1];
    secondTrait.value = dragonList[dragonIndex].traitsEn[1];
}

// Print the selected dragon's base stats 
function selectStartTrait() {
    let traitSelected = event.target.value;
    dragonName = document.querySelector("#dragon-selector").value;
    dragonIndex = dragonList.findIndex((dragons) => { return dragons.name[0] === dragonName; });
    let baseStats = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];

    // Fill in base stats
    for (let i = 0; i < STATCOUNT; i++) {
        document.querySelector(baseStats[i]).value = dragonList[dragonIndex][traitSelected][i];
    }

    // Disable selector for end traits where applicable
    unavailabilityCheck(dragonIndex, traitSelected);
}

// Print recommended end stats for selected special trait
function selectSpecialTrait() {
    let traitSelected = event.target.value;
    traitIndex = specialTraits.findIndex((traits) => { return traits.traitName === traitSelected; });
    let baseStats = [];
    let startStats = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    let endStats = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];
    let maxValue;

    // Store dragon's base stats
    for (let i = 0; i < STATCOUNT; i++) {
        baseStats[i] = Number(document.querySelector(startStats[i]).value);
    }

    switch (traitSelected) {
        case "immersedIn":
            for (let i = 0; i < STATCOUNT; i++) {
                document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
            }

            let highestEnd = "#end-".concat(statList[baseStats.indexOf(Math.max(...baseStats))]);
            document.querySelector(highestEnd).value = 150;
            break;

        case "dull":
            maxValue = Math.max(...baseStats);
            if (maxValue <= 20) {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
                }
            }
            else {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = 25;
                }
            }
            break;

        case "capable":
            maxValue = Math.max(...baseStats);
            if (maxValue < 30) {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
                }
            }
            else {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = 30;
                }
            }
            break;

        default:
            for (let i = 0; i < STATCOUNT; i++) {
                document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
            }
    }
}

// Print recommended end stats for selected normal trait
function selectNormalTrait() {
    let baseStats = [];
    let startStats = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    let endStats = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];

    // Store dragon's base stats
    for (let i = 0; i < STATCOUNT; i++) {
        baseStats[i] = Number(document.querySelector(startStats[i]).value);
    }

    let traitSelected = event.target.value;
    traitIndex = normalTraits.findIndex((traits) => { return traits.traitName === traitSelected; });

    let highestReq = normalTraits[traitIndex].highest;
    let lowestReq = normalTraits[traitIndex].lowest;
    let reqArray = baseStats.slice();

    // Handle null trait values
    if (lowestReq == null) {
        let maxValue = Math.max(...baseStats);
        let highestBase = statList[baseStats.indexOf(maxValue)];

        if (highestBase === highestReq) {
            let baseOrdered = baseStats.slice();
            baseOrdered.sort((a, b) => { return b - a; });
            baseStats.forEach((e, i) => { if (e < baseOrdered[1]) reqArray[i] = baseOrdered[1]; });
        }
        else {
            for (let i = 0; i < STATCOUNT; i++) {
                reqArray[i] = maxValue;
            }
        }
    }
    else {
        // Determine lowest required stat (iterates through indices except `lowestReq`)
        let iLowestReq = statList.indexOf(lowestReq);
        for (let i = 0; i < STATCOUNT; i++) {
            if (baseStats[i] <= baseStats[iLowestReq] && i != iLowestReq) {
                reqArray[i] = baseStats[iLowestReq] + BASEINCREMENT;
            }
        }
    }

    // Determine highest required stat
    let iHighestReq = statList.indexOf(highestReq);
    let currentMax = Math.max(...reqArray);
    if (reqArray.indexOf(currentMax) != reqArray.lastIndexOf(currentMax)) {
        reqArray[iHighestReq] = currentMax + BASEINCREMENT;
    }
    else if (reqArray[iHighestReq] != currentMax) {
        reqArray[iHighestReq] = currentMax + BASEINCREMENT;
    }

    // Print goal stats on page
    for (let i = 0; i < STATCOUNT; i++) {
        document.querySelector(endStats[i]).value = reqArray[i];
    }
}

function calculator() {
    printCount("agility");
    printCount("strength");
    printCount("focus");
    printCount("intellect");
}

function printCount(traitType) {
    let reqStat = document.querySelector(`#end-${traitType}`).value - document.querySelector(`#start-${traitType}`).value;
    if (reqStat < 0) {
        reqStat = 0;
        document.querySelector(`#required-${traitType}`).textContent = "+0";
    }
    else {
        document.querySelector(`#required-${traitType}`).textContent = "+" + reqStat;
    }

    let trainCount = calculateTrainCount(reqStat, trainValues);
    let trainText;

    if (trainCount[5] == 9) {
        let nineCount = trainCount.lastIndexOf(9) + 1;
        trainCountCondensed = trainCount.slice(nineCount);
        trainText = `<span class="nine">9</span><sub>(x${nineCount})</sub> ` + trainCountCondensed.map((e) => {
            return e === 5 ? `<span class="five">${e}</span>` : `<span class="three">${e}</span>`;
        }).join(" ");
    }
    else {
        trainText = trainCount.map((e) => {
            return e === 9 ? `<span class="nine">${e}</span>` : e === 5 ? `<span class="five">${e}</span>` : `<span class="three">${e}</span>`;
        }).join(" ");
    }

    if (trainCount.length === 0) {
        document.querySelector(`#train-count-${traitType}`).textContent = "-";
    }
    else {
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
            if (shortestCombination === null || combination.length < shortestCombination.length) {
                shortestCombination = combination;
            }
        }
    }
    memo[targetSum] = shortestCombination;
    return shortestCombination;
};

function unavailabilityCheck(dragonIndex, traitSelected) {
    let endTrait = document.getElementById("dull");

    if (dragonList[dragonIndex][traitSelected].findIndex((item) => item > 25) === -1) {
        endTrait.removeAttribute("disabled");
        endTrait.textContent = "평범한";
        return;
    }

    for (let i = 0; i < STATCOUNT; i++) {
        if (dragonList[dragonIndex][traitSelected][i] > 25) {
            document.querySelector("#special-trait-selector").selectedIndex = 0;
            endTrait.setAttribute("disabled", "");
            endTrait.textContent = "평범한 (조건초과)";
        }
    }
}

function reset() {
    let endStats = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];

    for (let i = 0; i < STATCOUNT; i++) {
        document.querySelector(endStats[i]).value = 0;
    }

    document.querySelector("#special-trait-selector").selectedIndex = 0;
    document.querySelector("#normal-trait-selector").selectedIndex = 0;
}
