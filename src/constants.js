export const TRAIN_VALUES = [3, 5, 9];
export const EXCLUDED_VALUES = [1, 2, 4, 7];
export const NUMBER_REGEX = /^[0-9]*$/;
export const COUNT_PREFIX = "train-count-";

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
