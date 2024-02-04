export const $ = (selector) => document.querySelector(selector);

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
