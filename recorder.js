let dragons = [];
let counterData, nameCount, idCount, sortedList;
let filteredList = [];
const entriesPerPage = 10;
let pageIndex = 0;
let sortOn = false;
let filterMode = "default";
let filterOn = false;
let filtersChecked = { gender: [], species: [], trait: [] };
let isEditing = false;

if (!localStorage.getItem("mydragons")) {
    let counters = { "name-count": 1, "id-count": 0 }

    const startCounters = JSON.stringify(counters);
    localStorage.setItem("counters", startCounters);

    counterData = counters;
    nameCount = counterData["name-count"];
    idCount = counterData["id-count"];

    printPage();
}
else {
    refreshDragons();
    refreshCounters();

    nameCount = counterData["name-count"];
    idCount = counterData["id-count"];

    printPage();
}

printSpeciesFilters();
printTraitFilters();
printGenderFilters();
setTimeout(catchError, 1500);

document.addEventListener("click", (e) => {
    const isDropdownButton = e.target.matches("[data-dropdown-button]");
    // Ignore function if we click anywhere other than the dropdown area
    if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return;

    // Detects currently selected dropdown
    let currentDropdown;
    if (isDropdownButton) {
        currentDropdown = e.target.closest("[data-dropdown]");
        currentDropdown.classList.toggle("active");
    }

    // Closes all other dropdowns except one that's currently selected
    document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
        if (dropdown === currentDropdown) return;
        dropdown.classList.remove("active");
    });
});

document.querySelector(".field-name").addEventListener("keydown", (e) => {
    if (e.key == "Enter") addDragonData(e);
});

document.querySelector(".field-gen").addEventListener("keydown", (e) => {
    if (e.key == "Enter") addDragonData(e);
});

document.querySelector(".field-memo").addEventListener("keydown", (e) => {
    if (e.key == "Enter") addDragonData(e);
});

function toggleStrictFilter() {
    resetFilters();
    const button = document.querySelector(".mode-button");

    if (filterMode === "default") {
        filterMode = "strict";
        button.style.backgroundColor = "rgb(60, 60, 60)";
        button.innerText = "필터 옵션 전체해당 ON";
    }
    else if (filterMode === "strict") {
        filterMode = "default";
        button.style.backgroundColor = "rgb(105, 86, 90)";
        button.innerText = "필터 옵션 전체해당 OFF";
    }
}

function printSpeciesFilters() {
    const speciesArea = document.querySelector(".filter-species");

    // Get species from current dragon list
    let speciesSet = new Set();
    dragons.forEach((x) => {
        speciesSet.add(x.species);
    }, 0);
    const speciesKeys = speciesSet.keys();

    for (const species of speciesKeys) {
        const newLabel = document.createElement("label");
        newLabel.innerHTML = `${species}<input type="checkbox" class="filter-checkbox" id="${species}" name="species" onchange="filterChange(event, name, id)">`;
        speciesArea.append(newLabel);
    }
}

function printTraitFilters() {
    const traitsArea = document.querySelector(".filter-trait");

    // Get traits from current dragon list
    let traitsSet = new Set();
    dragons.forEach((x) => {
        traitsSet.add(x.trait);
    }, 0);
    const traitsKeys = traitsSet.keys();

    for (const trait of traitsKeys) {
        const newLabel = document.createElement("label");
        newLabel.innerHTML = `${trait}<input type="checkbox" class="filter-checkbox" id="${trait}" name="trait" onchange="filterChange(event, name, id)">`;
        traitsArea.append(newLabel);
    }
}

function printGenderFilters() {
    const genderArea = document.querySelector(".filter-gender");

    // Get gender from current dragon list
    let genderSet = new Set();
    dragons.forEach((x) => {
        genderSet.add(x.gender);
    }, 0);
    const genderKeys = genderSet.keys();

    for (const gender of genderKeys) {
        const newLabel = document.createElement("label");
        const traitsArea = document.querySelector(".filter-trait");
        newLabel.innerHTML = `${gender}<input type="checkbox" class="filter-checkbox" id="${gender}" name="gender" onchange="filterChange(event, name, id)">`;
        genderArea.append(newLabel);
    }
}

function resetFilters() {
    const genderFilters = document.querySelector(`.filter-gender`).children;
    const speciesFilters = document.querySelector(`.filter-species`).children;
    const traitFilters = document.querySelector(`.filter-trait`).children;

    for (const elem of genderFilters) {
        if (elem.firstElementChild.checked === true) elem.firstElementChild.click();
    }
    for (const elem of speciesFilters) {
        if (elem.firstElementChild.checked === true) elem.firstElementChild.click();
    }
    for (const elem of traitFilters) {
        if (elem.firstElementChild.checked === true) elem.firstElementChild.click();
    }

    filterOn = false;
}

function resetSort() {
    sortOn = false;
    const target = document.querySelector(".table-header").firstElementChild.children[1];
    target.setAttribute("class", "neutral");
    target.firstElementChild.setAttribute("src", "./images/neutral.png");
}

function filterChange(e, filterType, filterName) {
    // Reset current sort setting and turn filter off
    if (sortOn) resetSort();
    filterOn = false;
    isEditing = false;

    // If target's checkbox is checked, then add to filters list; if checked false, then remove from filters list
    filteredList = [];

    // If in strict filter mode, prevent duplicate checks and keep only one filterName for each filterType
    if (e.target.checked && filterMode === "strict") {
        if (filtersChecked[filterType].length >= 1) {
            const prevCheck = filtersChecked[filterType][0];
            document.getElementById(prevCheck).checked = false;
            filtersChecked[filterType].pop();
            filtersChecked[filterType].push(filterName);
        }
        else {
            filtersChecked[filterType].push(filterName);
        }
    }
    if (e.target.checked && filterMode === "default") filtersChecked[filterType].push(filterName);
    if (!e.target.checked) filtersChecked[filterType] = filtersChecked[filterType].filter((x) => x !== filterName);

    // Indicate whether at least one of the filters is on
    for (const filter in filtersChecked) {
        if (filtersChecked[filter].length > 0) {
            filterOn = true;
            break;
        }
    }
    if (!filterOn) {
        // refreshData(); // don't think I need this but reapply if there's an error
        try {
            printPage();
        }
        catch (err) {
            alert("Line 361 error: " + err);
        }
        return;
    }

    // Strict filter: add dragon to filteredList only if all filters match with data
    if (filterMode === "strict") {
        // Create map of things
        const filterMap = new Map();
        for (const filter in filtersChecked) {
            if (filtersChecked[filter].length > 0) filterMap.set(filter, filtersChecked[filter][0]);
        }

        // Fill in isMatch for each dragon and add to filteredList if perfect match
        dragons.forEach((dragon) => {
            let isMatch = [];

            filterMap.forEach((value, key, map) => {
                if (dragon[key] === filterMap.get(key)) isMatch.push(true);
                else isMatch.push(false);
            });
            if (isMatch.indexOf(false) < 0) filteredList.push(dragon);
        });
    }
    // Default filter: for each dragon, if it matches any of the filters, add the dragon to the filteredList
    else {
        for (const dragon of dragons) {
            for (const prop in dragon) {
                // Skip check for dragon-name, generation, memo, and id
                if (prop === "dragon-name" || prop === "generation" || prop === "memo" || prop === "id") continue;
                let searchValue = dragon[prop];
                if (filtersChecked[prop].indexOf(searchValue) >= 0) {
                    filteredList.push(dragon)
                    break;
                }
            }
        }
    }

    printPage();
}

function orderAscending(e) {
    sortOn = true;
    let size;

    if (filterOn) size = filteredList.length;
    else size = dragons.length;

    const baseArray = Array(size);
    sortedList = Array(size);

    // Extract names only from dragon list
    if (filterOn) {
        for (let i = 0; i < size; i++) {
            baseArray[i] = filteredList[i]["dragon-name"];
        }
    }
    else {
        for (let i = 0; i < size; i++) {
            baseArray[i] = dragons[i]["dragon-name"];
        }
    }

    // Sort names in A-to-Z order
    baseArray.sort((a, b) => a.localeCompare(b));

    // Create new array of reordered data objects (temporary order, will not be reflected in localStorage)
    if (filterOn) {
        for (let i = 0; i < size; i++) {
            const objIndex = filteredList.findIndex((x) => {
                return x["dragon-name"] == baseArray[i];
            });
            sortedList[i] = filteredList[objIndex];
        }
    }
    else {
        for (let i = 0; i < size; i++) {
            const objIndex = dragons.findIndex((x) => {
                return x["dragon-name"] == baseArray[i];
            });
            sortedList[i] = dragons[objIndex];
        }
    }

    printPage();
}

function orderDescending(e) {
    sortOn = true;
    let size;

    if (filterOn) size = filteredList.length;
    else size = dragons.length;

    const baseArray = Array(size);
    sortedList = Array(size);

    // Extract names only from dragon list
    if (filterOn) {
        for (let i = 0; i < size; i++) {
            baseArray[i] = filteredList[i]["dragon-name"];
        }
    }
    else {
        for (let i = 0; i < size; i++) {
            baseArray[i] = dragons[i]["dragon-name"];
        }
    }

    // Sort names in Z-to-A order
    baseArray.sort((a, b) => b.localeCompare(a));

    // Create new array of reordered data objects (temporary order, will not be reflected in localStorage)
    if (filterOn) {
        for (let i = 0; i < size; i++) {
            const objIndex = filteredList.findIndex((x) => {
                return x["dragon-name"] == baseArray[i];
            });
            sortedList[i] = filteredList[objIndex];
        }
    }
    else {
        for (let i = 0; i < size; i++) {
            const objIndex = dragons.findIndex((x) => {
                return x["dragon-name"] == baseArray[i];
            });
            sortedList[i] = dragons[objIndex];
        }
    }

    printPage();
}

function checkFilterMatch(newEntry) {
    // Iterate through filtered species for any match
    for (const filtered of filtersChecked.species) {
        if (newEntry.species === filtered) {
            return true;
        }
    }

    // Iterate through filtered traits for any match
    for (const filtered of filtersChecked.trait) {
        if (newEntry.trait === filtered) {
            return true;
        }
    }

    return false;
}

function refreshDragons() {
    const getDragonData = localStorage.getItem("mydragons");
    dragons = JSON.parse(getDragonData);
}

function refreshCounters() {
    const getCounterData = localStorage.getItem("counters");
    counterData = JSON.parse(getCounterData);
}

function validate(e) {
    if (e.target.value === "" || e.target.value <= 0) {
        e.target.value = 1;
    }
}

function sortChange(e) {
    if (isEditing) isEditing = false;
    const targetNode = e.target.parentNode;
    const state = targetNode.classList[0];

    switch (state) {
        case "neutral":
            targetNode.classList.replace("neutral", "ascending");
            e.target.src = "./images/ascending.png";
            orderAscending(event);
            break;
        case "ascending":
            targetNode.classList.replace("ascending", "descending");
            e.target.src = "./images/descending.png";
            orderDescending(event);
            break;
        case "descending":
            targetNode.classList.replace("descending", "neutral");
            e.target.src = "./images/neutral.png";
            sortOn = false;
            printPage();
    }
}

function printNavBar() {
    // Clear out pagination
    const navArea = document.querySelector("#display-nav");
    navArea.innerHTML = "";

    // Calculate number of pages
    let pages;
    if (filterOn) pages = Math.ceil(filteredList.length / entriesPerPage);
    else pages = Math.ceil(dragons.length / entriesPerPage);
    const startPage = Math.floor(pageIndex / 5) * 5;

    // Print left arrow
    let leftArrow = document.createElement("div");
    leftArrow.innerHTML = "&lt;";
    leftArrow.setAttribute("class", "nav-button");
    leftArrow.removeEventListener;
    navArea.append(leftArrow);

    for (let i = startPage; i < startPage + 5; i++) {
        if (i === pages || pages === 0) break;
        let pageNumber = document.createElement("div");
        pageNumber.textContent = i + 1;
        pageNumber.addEventListener("click", (e) => {
            pageIndex = pageNumber.textContent - 1;
            printPage();
        });
        pageNumber.setAttribute("class", "nav-button");
        if (pageIndex === i) pageNumber.setAttribute("class", "nav-button page-cur");
        navArea.append(pageNumber);
    }

    // Print right arrow
    let rightArrow = document.createElement("div");
    rightArrow.innerHTML = "&gt;";
    rightArrow.setAttribute("class", "nav-button");
    rightArrow.removeEventListener;
    navArea.append(rightArrow);

    // Activate/deactivate left arrow
    // Get first child element of page numbers, if it's 1 then inactive, if > 1 then change pageIndex accordingly
    let firstPage = navArea.firstChild.nextElementSibling.innerHTML;
    let lastPage = navArea.lastChild.previousElementSibling.innerHTML;

    if (filterOn) {
        if (firstPage <= 1 || filteredList.length === 0) {
            leftArrow.setAttribute("class", "nav-button arrow-inactive");
        }
        else if (firstPage >= 6) {
            leftArrow.addEventListener("click", (e) => {
                pageIndex = parseInt(firstPage) - 6;
                printPage();
            });
        }
    }
    else {
        if (firstPage <= 1 || dragons.length === 0) {
            leftArrow.setAttribute("class", "nav-button arrow-inactive");
        }
        else if (firstPage >= 6) {
            leftArrow.addEventListener("click", (e) => {
                pageIndex = parseInt(firstPage) - 6;
                printPage();
            });
        }
    }

    if (pages <= 5 || lastPage % 5 !== 0 || pages <= parseInt(lastPage)) {
        rightArrow.setAttribute("class", "nav-button arrow-inactive");
    }
    else {
        rightArrow.addEventListener("click", (e) => {
            pageIndex = parseInt(lastPage);
            printPage();
        });
    }
}

function getPrintData(startIndex) {
    let dataToPrint;

    if (filterOn) {
        if (sortOn) dataToPrint = sortedList.slice(startIndex, startIndex + entriesPerPage);
        else {
            try {
                dataToPrint = filteredList.slice(startIndex, startIndex + entriesPerPage);
            }
            catch (err) {
                alert("getPrintData error: " + err);
            }
        }
    }
    else {
        if (sortOn) dataToPrint = sortedList.slice(startIndex, startIndex + entriesPerPage);
        else dataToPrint = dragons.slice(startIndex, startIndex + entriesPerPage);
    }

    return dataToPrint;
}

function printPage() {
    isEditing = false;
    if (dragons.length <= 0) {
        const tableArea = document.querySelector(".display-entries");
        tableArea.innerHTML = `<div class="no-dragons">용용이가 없네용 ㅠ0ㅠ</div>`;
        printNavBar();
        return;
    }
    if (filterOn && filterMode === "strict" && filteredList.length === 0) {
        const tableArea = document.querySelector(".display-entries");
        tableArea.innerHTML = `<div class="no-dragons">선택한 필터에 모두 해당하는 용용이가 없어요!</div>`;
        printNavBar();
        return;
    }

    let startIndex = pageIndex * entriesPerPage;
    const dataToPrint = getPrintData(startIndex);

    const tableArea = document.querySelector(".display-entries");
    tableArea.innerHTML = "";

    for (const data of dataToPrint) {
        let newRow = document.createElement("div");
        newRow.setAttribute("class", "entry");

        // Print object property for each row of entry (name, species, trait, etc.)
        for (const prop in data) {
            let entryText = document.createElement("div");
            entryText.classList.add(`e-${prop}`);
            entryText.classList.add(`${prop}`);
            entryText.innerText = `${data[prop]}`;

            newRow.appendChild(entryText);
        }

        let editBtn = document.createElement("div");
        editBtn.innerHTML = '<img src="./images/edit.png" width="18" alt="Edit button" class="btn-img">';
        editBtn.firstElementChild.addEventListener("click", editEntry);
        newRow.appendChild(editBtn);

        let deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = '<img src="./images/delete.png" width="18" alt="Delete button" class="btn-img">';
        deleteBtn.firstElementChild.addEventListener("click", deleteData);
        newRow.appendChild(deleteBtn);

        tableArea.append(newRow);
    }

    printNavBar();

    // Automatically move to previous page if deleted everything on this page
    if (tableArea.innerHTML == "" && pageIndex !== 0) {
        pageIndex--;
        try {
            printPage();
        }
        catch (err) {
            alert("Line 901 error: " + err);
        }
    }
}

function disableEntries(currentRow) {
    const parentDiv = document.querySelector(".entry").parentNode;
    const children = parentDiv.children;
    currentRow.classList.add("editing");

    for (const entry of children) {
        if (entry.classList.contains("editing")) {
            entry.lastElementChild.firstElementChild.removeEventListener("click", deleteData);
            entry.lastElementChild.classList.add("untouchable");
        }
        else {
            entry.classList.add("untouchable");
            entry.lastElementChild.firstElementChild.removeEventListener("click", deleteData);
            entry.lastElementChild.previousElementSibling.firstElementChild.removeEventListener("click", editEntry);
        }
    }
}

function enableEntries(currentRow) {
    const parentDiv = document.querySelector(".entry").parentNode;
    const children = parentDiv.children;

    for (const entry of children) {
        if (entry.classList.contains("editing")) {
            entry.lastElementChild.firstElementChild.addEventListener("click", deleteData);
            entry.lastElementChild.classList.remove("untouchable");
        }
        else {
            entry.classList.remove("untouchable");
            entry.lastElementChild.firstElementChild.addEventListener("click", deleteData);
            entry.lastElementChild.previousElementSibling.firstElementChild.addEventListener("click", editEntry);
        }
    }

    currentRow.classList.remove("editing");
}

function editEntry() {
    if (isEditing) return;
    isEditing = true;

    const thisRow = event.target.parentNode.parentNode;
    const getId = event.target.parentNode.previousElementSibling.textContent;
    const rowFields = thisRow.children;

    disableEntries(thisRow);

    // Make shallow copy of current entry
    const dataIndex = dragons.findIndex((x) => {
        return x["id"] == getId;
    });
    // const oldEntry = dragons[dataIndex]; // THIS IS A SHALLOW COPY!!!!!!
    const oldEntry = JSON.parse(JSON.stringify(dragons[dataIndex]));

    function dragonSelectors() {
        for (let i = 0; i < dragonList.length; i++) {
            let newOption = document.createElement("option");
            newOption.textContent = dragonList[i].speciesKo;
            document.querySelector(".e-dragon-selector").append(newOption);
        }
    }

    function traitSelectors() {
        for (let i = 0; i < dragonTraits.length; i++) {
            let newOption = document.createElement("option");
            newOption.textContent = dragonTraits[i].traitKo;
            document.querySelector(".e-trait-selector").append(newOption);
        }
    }

    const entrySet = {
        "e-dragon-name": `<input class="field-name change-name" type="text" name="dragon-name" maxlength="14" size="14">`, "e-species": `<select class="e-dragon-selector"></select>`, "e-gender": `<select class="e-gender-selector"><option>수컷</option><option>암컷</option><option>중성</option></select>`, "e-trait": `<select class="e-trait-selector"></select>`, "e-generation": `<input class="field-gen" type="number" inputmode="numeric" name="generation" value="1" min="1"
                        onchange="validate(event)">`, "e-memo": `<input class="field-memo memo-change" type="text" name="memo" maxlength="25" size="35">`
    };

    // Draw out edit field
    for (const field of rowFields) {
        if (field.classList[0] === "e-id") break;

        const current = field.textContent; // 기존값

        field.innerHTML = entrySet[field.classList[0]];
        if (field.classList[0] === "e-species") dragonSelectors();
        if (field.classList[0] === "e-trait") traitSelectors();

        field.firstElementChild.value = current;
    }

    // Change icon image
    thisRow.children[7].innerHTML = `<img src="./images/check.png" width="18" alt="Submit button" class="btn-img">`;
    const submitBtn = thisRow.children[7].firstElementChild;
    submitBtn.addEventListener("click", (e) => {
        submitChange(submitBtn, oldEntry);
    });
}

function submitChange(btn, oldData) { // got rid of '${oldEntry["species"]}' '${oldEntry["gender"]}' '${oldEntry["trait"]}'
    btn.removeEventListener;
    const thisRow = event.currentTarget.parentNode.parentNode;
    const getId = event.currentTarget.parentNode.previousElementSibling.textContent;
    const rowFields = thisRow.children;
    const newData = new Object();
    const dataIndex = dragons.findIndex((x) => {
        return x["id"] == getId;
    });

    // Get data from input fields
    for (const field of rowFields) {
        if (field.classList[0] === "e-id") newData[field.classList[1]] = Number(field.textContent);
        else newData[field.classList[1]] = field.firstElementChild.value;
    }

    // Apply changes
    for (const field of rowFields) {
        if (field.classList[0] === "e-id") break;
        field.innerHTML = newData[field.classList[1]];
    }

    enableEntries(thisRow);

    // If there's a change in data, then do everything below
    if (JSON.stringify(oldData) !== JSON.stringify(newData)) {

        // Get index of new data before pushing to localStorage
        const iSpeciesNew = dragons.findIndex((entry) => {
            return entry["species"] === newData["species"];
        });
        const iGenderNew = dragons.findIndex((entry) => {
            return entry["gender"] === newData["gender"];
        });
        const iTraitNew = dragons.findIndex((entry) => {
            return entry["trait"] === newData["trait"];
        });

        // Push new data to localStorage
        for (const field of rowFields) {
            if (field.classList[0] === "e-id") break;
            dragons[dataIndex][field.classList[1]] = newData[field.classList[1]];
        }

        // Update filters if needed
        const iSpeciesOld = dragons.findIndex((entry) => {
            return entry["species"] === oldData["species"];
        });
        const iGenderOld = dragons.findIndex((entry) => {
            return entry["gender"] === oldData["gender"];
        });
        const iTraitOld = dragons.findIndex((entry) => {
            return entry["trait"] === oldData["trait"];
        });

        const updatedEntry = JSON.stringify(dragons);
        localStorage.setItem("mydragons", updatedEntry);

        if (iSpeciesNew < 0) addFilter("species", newData["species"]);
        if (iGenderNew < 0) addFilter("gender", newData["gender"]);
        if (iTraitNew < 0) addFilter("trait", newData["trait"]);
        if (iSpeciesOld < 0) deleteFilter("species", oldData["species"]);
        if (iGenderOld < 0) deleteFilter("gender", oldData["gender"]);
        if (iTraitOld < 0) deleteFilter("trait", oldData["trait"]);
    }

    // Revert edit icon back to edit
    // thisRow.children[7].innerHTML = '<img src="edit.png" width="18" alt="Edit button" class="btn-img" onclick="editEntry()">'; // removed editingOn()
    thisRow.children[7].innerHTML = '<img src="./images/edit.png" width="18" alt="Edit button" class="btn-img">'; // removed editingOn()
    thisRow.children[7].firstElementChild.addEventListener("click", editEntry);
    isEditing = false;

    event.stopPropagation();
}

function addDragonData(e) {
    e.preventDefault();

    // Get fresh dragon data
    if (localStorage.getItem("mydragons")) {
        const getDragonData = localStorage.getItem("mydragons");
        dragons = JSON.parse(getDragonData);
    }

    // Get entryData
    let entryData = {};
    const fieldElements = document.querySelector(".new-entry").children;
    const formData = Array.from(fieldElements);
    formData.forEach((x) => {
        if (x.lastElementChild.id == "btn") return;
        entryData[x.lastElementChild.name] = x.lastElementChild.value;
    });

    // Before adding entry data, check if it already exists in the dragons list -- if not, must create new filter button
    const indexSpecies = dragons.findIndex((entry) => {
        return entry["species"] === entryData["species"];
    });
    const indexTrait = dragons.findIndex((entry) => {
        return entry["trait"] === entryData["trait"];
    });
    const indexGender = dragons.findIndex((entry) => {
        return entry["gender"] === entryData["gender"];
    });

    // Add auto-generated dragon name to entryData if user did not specify
    if (entryData["dragon-name"] == '') {
        const defaultName = `드래곤 #${nameCount}`;
        nameCount++;
        entryData["dragon-name"] = defaultName;
    }

    // Assign id to entryData (increase id index for next data)
    entryData.id = idCount++;
    dragons.push(entryData);

    // If sortOn with no filters, then also push new entry data to currently sorted list (in order to reflect the change even if user is using sorted view)
    if (sortOn && !filterOn && !strictFilterOn) sortedList.push(entryData);

    // If sortOn with filters, then only push to sortedList if new entry matches the filter
    if (sortOn && filterOn || sortOn && strictFilterOn) {
        if (checkFilterMatch(entryData) === true) sortedList.push(entryData);
    }

    // If only filtersOn, then check whether to push new data to current filteredList
    if (!sortOn && filterOn || !sortOn && strictFilterOn) {
        if (checkFilterMatch(entryData) === true) {
            filteredList.push(entryData);
        }
    }

    // Save newly added dragon data to localStorage and update counter data
    const newData = JSON.stringify(dragons);
    localStorage.setItem("mydragons", newData);

    counterData["name-count"] = nameCount;
    counterData["id-count"] = idCount;
    const newCount = JSON.stringify(counterData);
    localStorage.setItem("counters", newCount);

    // Reset text input fields only
    document.querySelector(".field-name").value = "";
    document.querySelector(".field-memo").value = "";

    // This goes through the process of re-printing entire current page even when the added data appears in another page; refactor later if possible
    // refactor: if current page index is not the same as the (dragons.length / entriesperpage) - 1, then no need to printpage()
    printPage();

    // Update filters if added new species or trait
    if (indexSpecies < 0) addFilter("species", entryData["species"]);
    if (indexTrait < 0) addFilter("trait", entryData["trait"]);
    if (indexGender < 0) addFilter("gender", entryData["gender"]);
}

function deleteData() {
    // Identify this row's id, species, and trait
    const getId = event.target.parentNode.previousElementSibling.previousElementSibling.textContent;
    const getSpecies = event.target.parentNode.parentNode.children[1].textContent;
    const getGender = event.target.parentNode.parentNode.children[2].textContent;
    const getTrait = event.target.parentNode.parentNode.children[3].textContent;

    // Update dragon list
    const dragonsUpdated = dragons.filter(x => x["id"] != getId);
    const updatedList = JSON.stringify(dragonsUpdated);
    localStorage.setItem("mydragons", updatedList);
    dragons = dragonsUpdated.slice();

    // Also update sorted list/filtered list if sortOn/filterOn
    if (sortOn) {
        sortedList = sortedList.filter(x => x["id"] != getId);
    }
    if (filterOn) {
        filteredList = filteredList.filter(x => x["id"] != getId);
    }

    // Update filters if needed
    const indexSpecies = dragons.findIndex((entry) => {
        return entry["species"] === getSpecies;
    });
    const indexGender = dragons.findIndex((entry) => {
        return entry["gender"] === getGender;
    });
    const indexTrait = dragons.findIndex((entry) => {
        return entry["trait"] === getTrait;
    });

    if (indexSpecies < 0) deleteFilter("species", getSpecies);
    if (indexGender < 0) deleteFilter("gender", getGender);
    if (indexTrait < 0) deleteFilter("trait", getTrait);

    // Remove row element from table
    const thisRow = event.target.parentNode.parentNode;
    thisRow.style.animationPlayState = "running";
    thisRow.addEventListener("animationend", () => {
        thisRow.remove();
        printPage();
    });
}

function deleteFilter(category, property) {
    const nodes = document.querySelector(`.filter-${category}`).children;

    for (const elem of nodes) {
        if (elem.textContent === property) {
            if (elem.firstElementChild.checked === true) elem.firstElementChild.click();
            elem.remove();
            break;
        }
    }

    if (filteredList.length === 0) filterOn = false;
}

function addFilter(category, value) {
    const parentNode = document.querySelector(`.filter-${category}`);
    const newLabel = document.createElement("label");
    newLabel.innerHTML = `${value}<input type="checkbox" class="filter-checkbox" id="${value}" name="${category}" onchange="filterChange(event, name, id)">`;
    parentNode.append(newLabel);
}

function clearLocalStorage() {
    let key = prompt("❗ 브라우저에 저장된 내 데이터를 일괄 삭제합니다. 삭제된 데이터는 복구할 수 없습니다.\n삭제를 원하시면 단어 [삭제]를 입력해주세요.");

    if (key === "삭제" || key === "[삭제]") {
        localStorage.clear();
        location.reload();
    }
}

function download() {
    if (dragons.length <= 0) {
        alert("저장할 데이터가 없습니다. 정보를 먼저 입력해주세요.")
        return;
    }

    const curDate = new Date();
    let yr = curDate.getFullYear();
    let mth = curDate.getMonth() + 1;
    let d = curDate.getDate();
    const fileName = "dvctd" + yr + "_" + mth + "_" + d;
    const saveData = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("counters")) + "@dvcdata@" + encodeURIComponent(localStorage.getItem("mydragons"));
    const downloadPrompt = document.createElement("a");
    downloadPrompt.setAttribute("href", saveData);
    downloadPrompt.setAttribute("download", fileName + ".txt");
    downloadPrompt.click();
    downloadPrompt.remove();
}

function callFile() {
    let loadOld = true;

    if (localStorage.getItem("mydragons")) {
        loadOld = confirm("이미 내 용용이에 대한 데이터가 있습니다. 다른 데이터로 교체할까요?\n현재 기록되어 있는 데이터는 전부 삭제됩니다.");
    }
    if (loadOld == false) return;

    document.getElementById("upload").click();
}

function load() {
    const reader = new FileReader();
    const [fileContent] = document.getElementById("upload").files;

    reader.addEventListener("load", () => {
        const retrieved = reader.result;
        if (retrieved.indexOf("@dvcdata@") < 0) return alert("올바른 데이터 형식이 아닙니다. DVC툴과 호환되는 파일을 열어주세요.");
        const rvdArray = retrieved.split("@dvcdata@");
        dragons = JSON.parse(rvdArray[1]);
        localStorage.setItem("counters", rvdArray[0]);
        localStorage.setItem("mydragons", rvdArray[1]);
        location.reload();
    });

    if (fileContent) {
        reader.readAsText(fileContent);
    }
}

function catchError() {
    const entriesArea = document.querySelector(".display-entries");
    if (entriesArea.innerHTML == "") {
        entriesArea.innerHTML = "<div>에러가 발생했습니다. 페이지를 새로고침 해주세요!</div>";
    }
}