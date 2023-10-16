document.addEventListener("DOMContentLoaded", function () {
    for (let i = 0; i < dragonList.length; i++) {
        let newOption = document.createElement("option");
        newOption.textContent = dragonList[i].speciesKo;
        document.querySelector(".field-dragon").append(newOption);
    }

    for (let i = 0; i < dragonTraits.length; i++) {
        let newOption = document.createElement("option");
        newOption.textContent = dragonTraits[i].traitKo;
        document.querySelector(".field-trait").append(newOption);
    }
});
