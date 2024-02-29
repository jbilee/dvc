const specialTraits = [
  { name: "고귀한", stats: [20, 20, 20, 20], optimizable: true },
  { name: "고독한", stats: [0, 0, 0, 0], optimizable: false },
  { name: "몰입하는", stats: [0, 0, 0, 0], optimizable: true },
  { name: "산만한", stats: [0, 0, 0, 0], optimizable: true },
  { name: "오만한", stats: [20, 20, 20, 20], optimizable: true },
  { name: "완벽주의자", stats: [25, 25, 25, 25], optimizable: true },
  { name: "유능한", stats: [28, 28, 28, 28], optimizable: false },
  { name: "정확한", stats: [0, 0, 0, 0], optimizable: false },
  { name: "평범한", stats: [0, 0, 0, 0], optimizable: false },
  { name: "품위있는", stats: [20, 20, 20, 20], optimizable: true }
];

const normalTraits = [
  { name: "온순한", reqValue: "lowest", reqStat: "agility", hasSameStats: false },
  { name: "차분한", reqValue: "lowest", reqStat: "agility", hasSameStats: true },
  { name: "천진난만한", reqValue: "lowest", reqStat: "strength", hasSameStats: false },
  { name: "노력하는", reqValue: "lowest", reqStat: "strength", hasSameStats: true },
  { name: "덜렁대는", reqValue: "lowest", reqStat: "focus", hasSameStats: false },
  { name: "변덕쟁이", reqValue: "lowest", reqStat: "focus", hasSameStats: true },
  { name: "성급한", reqValue: "lowest", reqStat: "intellect", hasSameStats: false },
  { name: "고집있는", reqValue: "lowest", reqStat: "intellect", hasSameStats: true },
  { name: "촐랑대는", reqValue: "highest", reqStat: "agility", hasSameStats: false },
  { name: "눈치빠른", reqValue: "highest", reqStat: "agility", hasSameStats: true },
  { name: "대담한", reqValue: "highest", reqStat: "strength", hasSameStats: false },
  { name: "용감한", reqValue: "highest", reqStat: "strength", hasSameStats: true },
  { name: "냉정한", reqValue: "highest", reqStat: "focus", hasSameStats: false },
  { name: "신중한", reqValue: "highest", reqStat: "focus", hasSameStats: true },
  { name: "수줍은", reqValue: "highest", reqStat: "intellect", hasSameStats: false },
  { name: "똑똑한", reqValue: "highest", reqStat: "intellect", hasSameStats: true }
];
