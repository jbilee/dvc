export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export const getFirstKeyByValue = (obj, value) => {
  return Object.keys(obj).find((key) => obj[key] === value) || null;
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
};

export const popValues = (array, ...targets) => {
  const newArray = [...array];

  while (targets.length > 0) {
    const targetValue = targets.shift();
    const targetIndex = newArray.indexOf(targetValue);
    if (targetIndex < 0) continue;
    newArray.splice(targetIndex, 1);
  }

  return newArray;
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
