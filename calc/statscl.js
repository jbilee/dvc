class Stats {
    constructor(agility = 0, strength = 0, focus = 0, intellect = 0) {
        this.agility = agility;
        this.strength = strength;
        this.focus = focus;
        this.intellect = intellect;
    }

    getMaxTrait() {
        const maxVal = this.getMaxVal();
        const maxTraits = [];
        if (this.agility === maxVal) maxTraits.push("agility");
        if (this.strength === maxVal) maxTraits.push("strength");
        if (this.focus === maxVal) maxTraits.push("focus");
        if (this.intellect === maxVal) maxTraits.push("intellect");
        return maxTraits;
    }

    getMinTrait() {
        const minVal = this.getMinVal();
        const minTraits = [];
        if (this.agility === minVal) minTraits.push("agility");
        if (this.strength === minVal) minTraits.push("strength");
        if (this.focus === minVal) minTraits.push("focus");
        if (this.intellect === minVal) minTraits.push("intellect");
        return minTraits;
    }

    getMaxVal() {
        return Math.max(this.agility, this.strength, this.focus, this.intellect);
    }

    getMinVal() {
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

export default Stats;