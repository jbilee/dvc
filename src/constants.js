export const BASE_INCREMENT = 3;
export const STAT_COUNT = 4;
export const TRAIN_VALUES = [3, 5, 9];
export const COUNT_PREFIX = "train-count-";
export const EXCLUDED_VALUES = [1, 2, 4, 7];
export const NUMBER_REGEX = /^[0-9]*$/;

export const STAT_LISTS = {
  base: ["agility", "strength", "focus", "intellect"],
  start: [
    "#start-agility",
    "#start-strength",
    "#start-focus",
    "#start-intellect",
  ],
  end: ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"],
};

export const CLIP_TEXT = {
  agility: (input) => `순발력(${input}): `,
  strength: (input) => `근력(${input}): `,
  focus: (input) => `집중력(${input}): `,
  intellect: (input) => `지력(${input}): `,
};

export const ADJUSTMENTS = {
  regular: new Map([
    [8, 9],
    [13, 14],
    [16, 18],
    [20, 21],
    [26, 27],
    [28, 27],
    [31, 32],
    [33, 32],
    [40, 41], // remove if gives invalid training
    [125, 126],
    [130, 131],
  ]),
  twenty: new Map([
    [0, 27],
    [5, 23],
    [10, 20],
    [15, 20],
  ]),
  twentyFive: new Map([
    [0, 27],
    [5, 26],
    [10, 28],
    [15, 25],
    [20, 25],
  ]),
};
