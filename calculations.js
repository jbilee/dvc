let dragonName;
let dragonIndex;

let reqAgility;
let reqStrength;
let reqFocus;
let reqIntellect;

let nineCount;
let fiveCount;
let threeCount;

let exactCalc;

function dragonSelect() {
    let arr = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    dragonName = document.querySelector("#dragon-selector").value;
    dragonIndex = dragonList.findIndex((dragons) => { return dragons.name[0] == dragonName; });
    document.querySelector("#trait-selector").selectedIndex = 0;
    for (let i = 0; i < 4; i++) {
        document.querySelector(arr[i]).value = 0;
    }
    document.querySelector("#init1").textContent = dragonList[dragonIndex].traitsKo[0];
    document.querySelector("#init1").value = dragonList[dragonIndex].traitsEn[0];
    document.querySelector("#init2").textContent = dragonList[dragonIndex].traitsKo[1];
    document.querySelector("#init2").value = dragonList[dragonIndex].traitsEn[1];
}

function startTraitSelect() {
    dragonName = document.querySelector("#dragon-selector").value;
    let trait = event.target.value;
    dragonIndex = dragonList.findIndex((dragons) => { return dragons.name[0] == dragonName; });
    let arr = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    for (let i = 0; i < 4; i++) {
        document.querySelector(arr[i]).value = dragonList[dragonIndex][trait][i];
    }
}

function findLowestStat(baseArray) {
    let lowestBase = Math.min(...baseArray);
    let lowestArray = [];

    for (let i = 0; i < 4; i++) {
        if (baseArray[i] == lowestBase) {
            switch (i) {
                case 0:
                    lowestArray.push("agility");
                    break;
                case 1:
                    lowestArray.push("strength");
                    break;
                case 2:
                    lowestArray.push("focus");
                    break;
                case 3:
                    lowestArray.push("intellect");
            }
        }
    }

    return lowestArray;
}

function findHighestStat(baseArray) {
    let indexHighest = baseArray.indexOf(Math.max(...baseArray));

    switch (indexHighest) {
        case 0:
            return "agility";
        case 1:
            return "strength";
        case 2:
            return "focus";
        case 3:
            return "intellect";
        default:
            return -1;
    }
}

function selectSpecialTrait() {
    let traitSelected = event.target.value;
    traitIndex = specialTraits.findIndex((traits) => { return traits.traitName == traitSelected; });
    let baseStats = [];
    let arr1 = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    let arr2 = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];

    for (let i = 0; i < 4; i++) {
        baseStats[i] = Number(document.querySelector(arr1[i]).value);
    }

    if (specialTraits[traitIndex].traitName == "immersedIn") {
        for (let i = 0; i < 4; i++) {
            document.querySelector(arr2[i]).value = specialTraits[traitIndex].stats[i];
        }

        let highestEnd = "#end-".concat(findHighestStat(baseStats));
        document.querySelector(highestEnd).value = 150;
    }
    else {
        for (let i = 0; i < 4; i++) {
            document.querySelector(arr2[i]).value = specialTraits[traitIndex].stats[i];
        }
    }
}

function selectNormalTrait() {
    let baseStats = [];
    let arr2 = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    let arr3 = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];

    for (let i = 0; i < 4; i++) {
        baseStats[i] = Number(document.querySelector(arr2[i]).value);
    }

    let traitSelected = event.target.value;
    traitIndex = normalTraits.findIndex((traits) => { return traits.traitName == traitSelected; });

    let lowestBaseArray = findLowestStat(baseStats);
    let highestReq = normalTraits[traitIndex].highest;
    let lowestReq = normalTraits[traitIndex].lowest;
    let reqArray = new Array(4).fill(0);

    // Handles null trait values
    if (lowestReq == null) {
        let highestBase = statList[baseStats.indexOf(Math.max(...baseStats))];
        if (highestBase == highestReq) {
            let baseCopy = baseStats.slice();
            baseCopy.sort((a, b) => { return b - a; });
            baseStats.forEach((e, i) => { if (e < baseCopy[1]) reqArray[i] = baseCopy[1]; });
            reqArray[statList.indexOf(highestReq)] = baseStats[statList.indexOf(highestReq)];
        }
        else {
            for (let i = 0; i < 4; i++) {
                reqArray[i] = Math.max(...baseStats);
            }
            reqArray[statList.indexOf(highestReq)] = Math.max(...reqArray) + 1;
        }
    }
    else {
        if (lowestBaseArray.length > 1) { // For when base lowest is more than one
            for (let i = 0; i < lowestBaseArray.length; i++) {
                if (lowestBaseArray[i] != lowestReq) reqArray[statList.indexOf(lowestBaseArray[i])] = 1;
            }
        }
        else if (lowestBaseArray.indexOf(lowestReq) < 0) { // if required lowest is not in current lowest array (meaning current lowest has to change)
            let iLowestReq = statList.indexOf(lowestReq); // find index of lowest required (identify which stat it is)
            for (let i = 0; i < 4; i++) { // go through each stat and if current stat is smaller than required lowest, then make its goal stat be 1 higher than required lowest
                if (baseStats[iLowestReq] > baseStats[i]) {
                    reqArray[i] = baseStats[iLowestReq] + 1;
                }
            }
        }

        // Determines highest stat needed
        let highestBase = statList[baseStats.indexOf(Math.max(...baseStats))];
        if (highestBase == highestReq) {
            reqArray[statList.indexOf(highestReq)] = baseStats[statList.indexOf(highestReq)];
        }
        else {
            if (highestBase == lowestReq) {
                reqArray[statList.indexOf(highestReq)] = Math.max(...reqArray) + 1;
            }
            else {
                reqArray[statList.indexOf(highestReq)] = Math.max(...baseStats) + 1;
            }
        }
    }

    // Print goal stats on page
    for (let i = 0; i < 4; i++) {
        document.querySelector(arr3[i]).value = reqArray[i];
    }
}

function calculator() {
    reqAgility = document.querySelector("#end-agility").value - document.querySelector("#start-agility").value;
    reqStrength = document.querySelector("#end-strength").value - document.querySelector("#start-strength").value;
    reqFocus = document.querySelector("#end-focus").value - document.querySelector("#start-focus").value;
    reqIntellect = document.querySelector("#end-intellect").value - document.querySelector("#start-intellect").value;

    reqAgility < 0 ? document.querySelector(".result-agility").textContent = "+0" : document.querySelector(".result-agility").textContent = "+" + reqAgility;
    reqStrength < 0 ? document.querySelector(".result-strength").textContent = "+0" : document.querySelector(".result-strength").textContent = "+" + reqStrength;
    reqFocus < 0 ? document.querySelector(".result-focus").textContent = "+0" : document.querySelector(".result-focus").textContent = "+" + reqFocus;
    reqIntellect < 0 ? document.querySelector(".result-intellect").textContent = "+0" : document.querySelector(".result-intellect").textContent = "+" + reqIntellect;

    resetCounter();
    let trainingAgility = reqAgility;
    let trainingStrength = reqStrength;
    let trainingFocus = reqFocus;
    let trainingIntellect = reqIntellect;

    //for agil
    while (trainingAgility > 0) {
        if (trainingAgility >= 9) {
            trainingAgility -= 9;
            nineCount++;
        }
        else if (trainingAgility >= 5) {
            trainingAgility -= 5;
            fiveCount++;
        }
        else if (trainingAgility >= 3) {
            trainingAgility -= 3;
            threeCount++;
        }
        else {
            trainingAgility -= 3;
            threeCount++;
        }
    }

    if (nineCount + fiveCount + threeCount == 0) {
        document.querySelector(".recommended-agility").textContent = "-";
    }
    else {
        if (nineCount > 0) {
            let tester = document.createElement("span");
            tester.setAttribute("class", "nine");
            tester.textContent = "dfhalwijeljfg";
            document.querySelector(".recommended-agility").textContent = `<u>9점(${nineCount}회)</u>`;
            document.querySelector(".recommended-agility").textContent = tester;
        }
        if (fiveCount > 0) {
            if (nineCount > 0) {
                document.querySelector(".recommended-agility").textContent += ` + 5점(${fiveCount}회)`;
            }
            else {
                document.querySelector(".recommended-agility").textContent = `5점(${fiveCount}회)`;
            }
        }
        if (threeCount > 0) {
            if (nineCount > 0 || fiveCount > 0) {
                document.querySelector(".recommended-agility").textContent += ` + 3점(${threeCount}회)`;
            }
            else {
                document.querySelector(".recommended-agility").textContent = `3점(${threeCount}회)`;
            }
        }
    }

    resetCounter();

    while (trainingStrength > 0) {
        if (trainingStrength >= 9) {
            trainingStrength -= 9;
            nineCount++;
        }
        else if (trainingStrength >= 5) {
            trainingStrength -= 5;
            fiveCount++;
        }
        else if (trainingStrength >= 3) {
            trainingStrength -= 3;
            threeCount++;
        }
        else {
            trainingStrength -= 3;
            threeCount++;
        }
    }

    if (nineCount + fiveCount + threeCount == 0) {
        document.querySelector(".recommended-strength").textContent = "-";
    }
    else {
        if (nineCount > 0) {
            document.querySelector(".recommended-strength").textContent = `9점(${nineCount}회)`;
        }
        if (fiveCount > 0) {
            if (nineCount > 0) {
                document.querySelector(".recommended-strength").textContent += ` + 5점(${fiveCount}회)`;
            }
            else {
                document.querySelector(".recommended-strength").textContent = `5점(${fiveCount}회)`;
            }
        }
        if (threeCount > 0) {
            if (nineCount > 0 || fiveCount > 0) {
                document.querySelector(".recommended-strength").textContent += ` + 3점(${threeCount}회)`;
            }
            else {
                document.querySelector(".recommended-strength").textContent = `3점(${threeCount}회)`;
            }
        }
    }

    resetCounter();

    while (trainingFocus > 0) {
        if (trainingFocus >= 9) {
            trainingFocus -= 9;
            nineCount++;
        }
        else if (trainingFocus >= 5) {
            trainingFocus -= 5;
            fiveCount++;
        }
        else if (trainingFocus >= 3) {
            trainingFocus -= 3;
            threeCount++;
        }
        else {
            trainingFocus -= 3;
            threeCount++;
        }
    }

    if (nineCount + fiveCount + threeCount == 0) {
        document.querySelector(".recommended-focus").textContent = "-";
    }
    else {
        if (nineCount > 0) {
            document.querySelector(".recommended-focus").textContent = `9점(${nineCount}회)`;
        }
        if (fiveCount > 0) {
            if (nineCount > 0) {
                document.querySelector(".recommended-focus").textContent += ` + 5점(${fiveCount}회)`;
            }
            else {
                document.querySelector(".recommended-focus").textContent = `5점(${fiveCount}회)`;
            }
        }
        if (threeCount > 0) {
            if (nineCount > 0 || fiveCount > 0) {
                document.querySelector(".recommended-focus").textContent += ` + 3점(${threeCount}회)`;
            }
            else {
                document.querySelector(".recommended-focus").textContent = `3점(${threeCount}회)`;
            }
        }
    }

    resetCounter();

    while (trainingIntellect > 0) {
        if (trainingIntellect >= 9) {
            trainingIntellect -= 9;
            nineCount++;
        }
        else if (trainingIntellect >= 5) {
            trainingIntellect -= 5;
            fiveCount++;
        }
        else if (trainingIntellect >= 3) {
            trainingIntellect -= 3;
            threeCount++;
        }
        else {
            trainingIntellect -= 3;
            threeCount++;
        }
    }

    if (nineCount + fiveCount + threeCount == 0) {
        document.querySelector(".recommended-intellect").textContent = "-";
    }
    else {
        if (nineCount > 0) {
            document.querySelector(".recommended-intellect").textContent = `9점(${nineCount}회)`;
        }
        if (fiveCount > 0) {
            if (nineCount > 0) {
                document.querySelector(".recommended-intellect").textContent += ` + 5점(${fiveCount}회)`;
            }
            else {
                document.querySelector(".recommended-intellect").textContent = `5점(${fiveCount}회)`;
            }
        }
        if (threeCount > 0) {
            if (nineCount > 0 || fiveCount > 0) {
                document.querySelector(".recommended-intellect").textContent += ` + 3점(${threeCount}회)`;
            }
            else {
                document.querySelector(".recommended-intellect").textContent = `3점(${threeCount}회)`;
            }
        }
    }
}

function calculateMatch() {
    console.log(":)");
}

function resetCounter() {
    nineCount = 0;
    fiveCount = 0;
    threeCount = 0;
}

function unavailabilityCheck() {
    dragonName = document.querySelector("#dragon-selector").value;
    let trait = event.target.value;
    let endTrait = document.getElementById("dull");

    dragonIndex = dragonList.findIndex((dragons) => { return dragons.name[0] == dragonName; });

    if (dragonList[dragonIndex][trait].findIndex((item) => item > 25) == -1) {
        endTrait.removeAttribute("disabled");
        endTrait.textContent = "평범한";
        return;
    }

    for (let i = 0; i < 4; i++) {
        if (dragonList[dragonIndex][trait][i] > 25) {
            document.querySelector("#trait-selector2").selectedIndex = 0;
            endTrait.setAttribute("disabled", "");
            endTrait.textContent = "평범한 (조건초과)";
        }
    }
}

function reset() {
    let arr2 = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];

    for (let i = 0; i < 4; i++) {
        document.querySelector(arr2[i]).value = 0;
    }

    document.querySelector("#trait-selector2").selectedIndex = 0;
    document.querySelector("#normal-trait-selector2").selectedIndex = 0;
}
