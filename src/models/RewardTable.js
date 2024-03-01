import { $, $$, newElem } from "../utilities.js";

class RewardTable {
  constructor(rewards) {
    this.rewardList = rewards;
    this.render();
  }

  checkTier(currentTotal) {
    const clearedTiers = this.rewardList.filter((tier) => tier.points <= currentTotal)

    if (clearedTiers.length > 0) {
      //render
      const currentTier = clearedTiers.length - 1;
      const rows = $$(".row__tier")
      rows.forEach((row, i) => {
        if (i <= currentTier) row.setAttribute("style", "text-decoration: line-through;")
        if (i > currentTier) row.removeAttribute("style")
      })
    }
  }

  render() {
    const tableBody = $(".reward-table");

    this.rewardList.forEach((reward) => {
      const div = newElem("div");
      div.classList.add("row__tier");
      const item = newElem("div");
      item.textContent = reward.item;
      const points = newElem("div");
      points.textContent = reward.points;
      div.append(item);
      div.append(points);
      tableBody.append(div);
    });

    const currentPoints = newElem("div");
    currentPoints.classList.add("current-points");
    currentPoints.textContent = "0";
    tableBody.append(currentPoints);
  }
}

export default RewardTable;
