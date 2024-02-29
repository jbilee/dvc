const specialTraits = [
  { nameEn: "Noble", nameKo: "고귀한", stats: [20, 20, 20, 20], optimizable: true },
  { nameEn: "Solitary", nameKo: "고독한", stats: [0, 0, 0, 0], optimizable: false },
  { nameEn: "Immersed", nameKo: "몰입하는", stats: [0, 0, 0, 0], optimizable: true },
  { nameEn: "Distracted", nameKo: "산만한", stats: [0, 0, 0, 0], optimizable: true },
  { nameEn: "Arrogant", nameKo: "오만한", stats: [20, 20, 20, 20], optimizable: true },
  { nameEn: "Perfectionist", nameKo: "완벽주의자", stats: [25, 25, 25, 25], optimizable: true },
  { nameEn: "Capable", nameKo: "유능한", stats: [28, 28, 28, 28], optimizable: false },
  { nameEn: "Meticulous", nameKo: "정확한", stats: [0, 0, 0, 0], optimizable: false },
  { nameEn: "Dull", nameKo: "평범한", stats: [0, 0, 0, 0], optimizable: false },
  { nameEn: "Classy", nameKo: "품위있는", stats: [20, 20, 20, 20], optimizable: true }
];

const normalTraits = [
  { nameEn: "Docile", nameKo: "온순한", reqValue: "lowest", reqStat: "agility", hasSameStats: false },
  { nameEn: "Calm", nameKo: "차분한", reqValue: "lowest", reqStat: "agility", hasSameStats: true },
  { nameEn: "Naive", nameKo: "천진난만한", reqValue: "lowest", reqStat: "strength", hasSameStats: false },
  { nameEn: "Hardy", nameKo: "노력하는", reqValue: "lowest", reqStat: "strength", hasSameStats: true },
  { nameEn: "Rash", nameKo: "덜렁대는", reqValue: "lowest", reqStat: "focus", hasSameStats: false },
  { nameEn: "Quirky", nameKo: "변덕쟁이", reqValue: "lowest", reqStat: "focus", hasSameStats: true },
  { nameEn: "Hasty", nameKo: "성급한", reqValue: "lowest", reqStat: "intellect", hasSameStats: false },
  { nameEn: "Adamant", nameKo: "고집있는", reqValue: "lowest", reqStat: "intellect", hasSameStats: true },
  { nameEn: "Lax", nameKo: "촐랑대는", reqValue: "highest", reqStat: "agility", hasSameStats: false },
  { nameEn: "QuickWitted", nameKo: "눈치빠른", reqValue: "highest", reqStat: "agility", hasSameStats: true },
  { nameEn: "Bold", nameKo: "대담한", reqValue: "highest", reqStat: "strength", hasSameStats: false },
  { nameEn: "Brave", nameKo: "용감한", reqValue: "highest", reqStat: "strength", hasSameStats: true },
  { nameEn: "Quiet", nameKo: "냉정한", reqValue: "highest", reqStat: "focus", hasSameStats: false },
  { nameEn: "Careful", nameKo: "신중한", reqValue: "highest", reqStat: "focus", hasSameStats: true },
  { nameEn: "Bashful", nameKo: "수줍은", reqValue: "highest", reqStat: "intellect", hasSameStats: false },
  { nameEn: "Smart", nameKo: "똑똑한", reqValue: "highest", reqStat: "intellect", hasSameStats: true }
];
