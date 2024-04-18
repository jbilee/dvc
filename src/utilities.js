export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);
export const newElem = (elem) => document.createElement(elem);

export const getFirstKeyByValue = (obj, value) => {
  return Object.keys(obj).find((key) => obj[key] === value) || null;
};

export const getArraySum = (array) => {
  return array.reduce((sum, cur) => sum + cur, 0);
};

export const isShallowCopy = (obj1, obj2) => {
  let checks = [];
  for (const stat in obj1) {
    if (obj1[stat] === obj2[stat]) checks.push(true);
    else checks.push(false);
  }
  return checks.includes(false) ? false : true;
};

export const getTargetSum = (targetSum, numbers, memo = {}) => {
  if (targetSum in memo) return memo[targetSum];
  if (targetSum === 0) return [];
  if (targetSum < 0) return null;

  let shortestCombination = null;

  for (let num of numbers) {
    const remainder = targetSum - num;
    const remainderResult = getTargetSum(remainder, numbers, memo);
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

export const forceNumberInput = (input) => {
  input.value = input.value.replace(/[^0-9]/g, "");
};

export const validateInput = (value, limit) => {
  if (Number(value) > limit) return limit;
  return Number(value);
};

export const handleIncreaseButton = (targetElem, max) => {
  if (Number(targetElem.value) + 1 > max) return;
  targetElem.value = Number(targetElem.value) + 1;
};

export const handleDecreaseButton = (targetElem, min) => {
  if (Number(targetElem.value) - 1 < min) return;
  targetElem.value = Number(targetElem.value) - 1;
};

export const displayToast = (message, timeout) => {
  const container = $("#main-content");
  if (container.lastElementChild.id === "toast") {
    container.lastElementChild.remove();
  }

  const newToast = document.createElement("div");
  newToast.id = "toast";
  newToast.innerText = message;

  container.appendChild(newToast);
  newToast.style.animationPlayState = "running";
  setTimeout(() => {
    newToast.remove();
  }, timeout);
};
