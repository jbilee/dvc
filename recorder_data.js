const dragonList = [
    { name: ["gaian", "가이안"], traitsEn: ["bold", "calm"], traitsKo: ["대담한", "차분한"], bold: [0, 30, 10, 0], calm: [5, 0, 20, 5] },
    { name: ["girdletail", "거들테일"], traitsEn: ["bold", "rash"], traitsKo: ["대담한", "덜렁대는"], bold: [10, 30, 0, 0], rash: [25, 0, 0, 10] },
    { name: ["gust", "거스트"], traitsEn: ["hasty", "adamant"], traitsKo: ["성급한", "고집있는"], hasty: [25, 10, 10, 0], adamant: [5, 20, 5, 0] },
    { name: ["ancientmascot", "고대신룡"], traitsEn: ["brave", "docile"], traitsKo: ["용감한", "온순한"], brave: [0, 25, 10, 10], docile: [0, 10, 10, 30] },
    { name: ["ancientjr", "고대주니어"], traitsEn: ["brave", "hasty"], traitsKo: ["용감한", "성급한"], brave: [0, 30, 15, 15], hasty: [30, 10, 10, 0] },
    { name: ["gold", "골드"], traitsEn: ["docile", "calm"], traitsKo: ["온순한", "차분한"], docile: [0, 5, 5, 20], calm: [10, 0, 15, 10] },
    { name: ["goldmetal", "골드메탈"], traitsEn: ["hasty", "bold"], traitsKo: ["성급한", "대담한"], hasty: [20, 10, 10, 0], bold: [10, 25, 0, 0] },
    { name: ["goldpike", "골드파이크"], traitsEn: ["hasty", "lax"], traitsKo: ["성급한", "촐랑대는"], hasty: [25, 10, 10, 0], lax: [10, 10, 0, 20] },
    { name: ["goldy", "골디"], traitsEn: ["bold", "lax"], traitsKo: ["대담한", "촐랑대는"], bold: [0, 30, 10, 0], lax: [15, 15, 0, 30] },
    { name: ["madpower", "광기의 파워드래곤"], traitsEn: ["bold", "lax"], traitsKo: ["대담한", "촐랑대는"], bold: [0, 30, 10, 0], lax: [15, 15, 0, 30] },
    { name: ["gracia", "그라치아"], traitsEn: ["brave", "quickWitted"], traitsKo: ["용감한", "눈치빠른"], brave: [0, 20, 10, 10], quickWitted: [20, 10, 0, 0] },
    { name: ["kkabi", "깨비곤"], traitsEn: ["naive", "brave"], traitsKo: ["천진난만한", "용감한"], naive: [25, 0, 10, 10], brave: [0, 25, 10, 10] },
    { name: ["knight", "나이트"], traitsEn: ["brave", "smart"], traitsKo: ["용감한", "똑똑한"], brave: [0, 30, 10, 10], smart: [10, 0, 0, 20] },
    { name: ["nebula", "네뷸라"], traitsEn: ["quiet", "careful"], traitsKo: ["냉정한", "신중한"], quiet: [0, 10, 30, 10], careful: [10, 10, 25, 0] },
    { name: ["nessi", "네시"], traitsEn: ["smart", "hardy"], traitsKo: ["똑똑한", "노력하는"], smart: [0, 0, 10, 30], hardy: [5, 0, 20, 0] },
    { name: ["nessibig", "네시빅"], traitsEn: ["quiet", "hasty"], traitsKo: ["냉정한", "성급한"], quiet: [0, 15, 30, 15], hasty: [20, 10, 10, 0] },
    { name: ["nello", "넬로"], traitsEn: ["quiet", "brave"], traitsKo: ["냉정한", "용감한"], quiet: [0, 10, 20, 10], brave: [0, 25, 10, 10] },
    { name: ["nox", "녹스"], traitsEn: ["brave", "quiet"], traitsKo: ["용감한", "냉정한"], brave: [0, 20, 10, 10], quiet: [0, 10, 20, 10] },
    { name: ["ninja", "닌자"], traitsEn: ["careful", "quickWitted"], traitsKo: ["신중한", "눈치빠른"], careful: [5, 5, 20, 0], quickWitted: [20, 0, 5, 0] },
    { name: ["darknix", "다크닉스"], traitsEn: ["quiet", "careful"], traitsKo: ["냉정한", "신중한"], quiet: [0, 15, 30, 15], careful: [15, 15, 30, 0] },
    { name: ["darkangel", "다크 엔젤"], traitsEn: ["bold", "lax"], traitsKo: ["대담한", "촐랑대는"], bold: [0, 30, 10, 0], lax: [15, 15, 0, 30] },
    { name: ["darkcloud", "다크클라우드"], traitsEn: ["naive", "quirky"], traitsKo: ["천진난만한", "변덕쟁이"], naive: [30, 0, 10, 10], quirky: [10, 20, 0, 10] },
    { name: ["deva", "데바"], traitsEn: ["adamant", "quiet"], traitsKo: ["고집있는", "냉정한"], adamant: [5, 20, 5, 0], quiet: [0, 5, 20, 5] },
    { name: ["devared", "데바레드"], traitsEn: ["brave", "smart"], traitsKo: ["용감한", "똑똑한"], brave: [0, 20, 5, 5], smart: [10, 0, 0, 20] },
    { name: ["dimension", "디멘션"], traitsEn: ["smart", "bold"], traitsKo: ["똑똑한", "대담한"], smart: [10, 0, 0, 30], bold: [0, 30, 0, 0] },
    { name: ["dianu", "디아누"], traitsEn: ["quiet", "adamant"], traitsKo: ["냉정한", "고집있는"], quiet: [0, 10, 30, 10], adamant: [10, 25, 10, 0] },
    { name: ["larus", "라루스"], traitsEn: ["brave", "smart"], traitsKo: ["용감한", "똑똑한"], brave: [0, 30, 10, 10], smart: [10, 0, 0, 20] },
    { name: ["lava", "라바"], traitsEn: ["quirky", "lax"], traitsKo: ["변덕쟁이", "촐랑대는"], quirky: [10, 25, 0, 10], lax: [10, 10, 0, 20] },
    { name: ["lavasalt", "라바솔트"], traitsEn: ["adamant", "calm"], traitsKo: ["고집있는", "차분한"], adamant: [15, 30, 15, 0], calm: [10, 0, 20, 10] },
    { name: ["lightspicy", "라이트스파이시"], traitsEn: ["calm", "docile"], traitsKo: ["차분한", "온순한"], calm: [5, 0, 20, 5], docile: [0, 10, 10, 30] },
    { name: ["rakion", "라키온"], traitsEn: ["quirky", "careful"], traitsKo: ["변덕쟁이", "신중한"], quirky: [10, 25, 0, 10], careful: [10, 10, 20, 0] },
    { name: ["raphael", "라파엘"], traitsEn: ["docile", "hardy"], traitsKo: ["온순한", "노력하는"], docile: [0, 10, 10, 30], hardy: [0, 0, 20, 0] },
    { name: ["lakshasa", "락샤사"], traitsEn: ["quickWitted", "careful"], traitsKo: ["눈치빠른", "신중한"], quickWitted: [25, 0, 0, 5], careful: [10, 10, 20, 0] },
    { name: ["leglien", "레그리언"], traitsEn: ["hardy", "careful"], traitsKo: ["노력하는", "신중한"], hardy: [10, 0, 30, 0], careful: [10, 10, 25, 0] },
    { name: ["redbull", "레드불"], traitsEn: ["adamant", "quiet"], traitsKo: ["고집있는", "냉정한"], adamant: [10, 25, 10, 0], quiet: [0, 5, 20, 5] },
    { name: ["redwyvern", "레드와이번"], traitsEn: ["hasty", "quirky"], traitsKo: ["성급한", "변덕쟁이"], hasty: [20, 10, 10, 0], quirky: [5, 20, 0, 5] },
    { name: ["redtaavire", "레드타아비레"], traitsEn: ["hasty", "quirky"], traitsKo: ["성급한", "변덕쟁이"], hasty: [30, 15, 15, 0], quirky: [10, 25, 0, 10] },
    { name: ["leopard", "레오파드"], traitsEn: ["careful", "brave"], traitsKo: ["신중한", "용감한"], careful: [15, 15, 30, 0], brave: [0, 30, 15, 15] },
    { name: ["lady", "레이디"], traitsEn: ["quickWitted", "quirky"], traitsKo: ["눈치빠른", "변덕쟁이"], quickWitted: [20, 0, 0, 10], quirky: [5, 20, 0, 5] },
    { name: ["regmal", "렉몰"], traitsEn: ["docile", "calm"], traitsKo: ["온순한", "차분한"], docile: [0, 10, 10, 30], calm: [10, 0, 25, 10] },
    { name: ["lololli", "로롤리"], traitsEn: ["quickWitted", "smart"], traitsKo: ["눈치빠른", "똑똑한"], quickWitted: [30, 0, 0, 10], smart: [0, 0, 0, 25] },
    { name: ["rosegold", "로즈골드"], traitsEn: ["bashful", "calm"], traitsKo: ["수줍은", "차분한"], bashful: [10, 0, 10, 25], calm: [5, 0, 20, 5] },
    { name: ["lunera", "루네라"], traitsEn: ["quirky", "quiet"], traitsKo: ["변덕쟁이", "냉정한"], quirky: [10, 30, 0, 10], quiet: [0, 10, 25, 10] },
    { name: ["ludeore", "루드오어"], traitsEn: ["calm", "quiet"], traitsKo: ["차분한", "냉정한"], calm: [15, 0, 30, 15], quiet: [0, 15, 30, 15] },
    { name: ["lupo", "루포"], traitsEn: ["bold", "quiet"], traitsKo: ["대담한", "냉정한"], bold: [0, 30, 10, 0], quiet: [0, 10, 20, 10] },
    { name: ["lufia", "루피아"], traitsEn: ["docile", "smart"], traitsKo: ["온순한", "똑똑한"], docile: [0, 10, 10, 30], smart: [10, 0, 0, 30] },
    { name: ["libera", "리베라"], traitsEn: ["adamant", "careful"], traitsKo: ["고집있는", "신중한"], adamant: [5, 20, 5, 0], careful: [5, 5, 20, 0] },
    { name: ["libety", "리베티"], traitsEn: ["calm", "hardy"], traitsKo: ["차분한", "노력하는"], calm: [5, 0, 20, 5], hardy: [0, 0, 20, 0] },
    { name: ["leaf", "리프"], traitsEn: ["naive", "rash"], traitsKo: ["천진난만한", "덜렁대는"], naive: [25, 0, 10, 10], rash: [20, 10, 0, 10] },
    { name: ["maga", "마가"], traitsEn: ["bold", "naive"], traitsKo: ["대담한", "천진난만한"], bold: [0, 30, 10, 0], naive: [20, 0, 10, 10] },
    { name: ["marino", "마리노"], traitsEn: ["brave", "rash"], traitsKo: ["용감한", "덜렁대는"], brave: [0, 25, 10, 10], rash: [25, 10, 0, 10] },
    { name: ["malothan", "말로단"], traitsEn: ["quiet", "bold"], traitsKo: ["냉정한", "대담한"], quiet: [0, 5, 20, 5], bold: [0, 20, 0, 5] },
    { name: ["mud", "머드"], traitsEn: ["quiet", "adamant"], traitsKo: ["냉정한", "고집있는"], quiet: [0, 5, 20, 5], adamant: [10, 20, 10, 0] },
    { name: ["mushroom", "머쉬룸"], traitsEn: ["calm", "docile"], traitsKo: ["차분한", "온순한"], calm: [10, 0, 25, 10], docile: [0, 10, 10, 20] },
    { name: ["mushknight", "머쉬룸나이트"], traitsEn: ["calm", "brave"], traitsKo: ["차분한", "용감한"], calm: [5, 0, 20, 5], brave: [0, 20, 10, 10] },
    { name: ["mustardhammer", "머스타드해머"], traitsEn: ["naive", "docile"], traitsKo: ["천진난만한", "온순한"], naive: [25, 0, 10, 10], docile: [0, 10, 10, 20] },
    { name: ["metal", "메탈"], traitsEn: ["calm", "docile"], traitsKo: ["차분한", "온순한"], calm: [10, 0, 25, 10], docile: [0, 5, 5, 20] },
    { name: ["mellow", "멜로우"], traitsEn: ["smart", "rash"], traitsKo: ["똑똑한", "덜렁대는"], smart: [5, 0, 0, 30], rash: [20, 10, 0, 10] },
    { name: ["mongsuryong", "몽수룡"], traitsEn: ["calm", "smart"], traitsKo: ["차분한", "똑똑한"], calm: [10, 0, 20, 10], smart: [10, 0, 0, 20] },
    { name: ["mitra", "미트라"], traitsEn: ["careful", "brave"], traitsKo: ["신중한", "용감한"], careful: [10, 10, 30, 0], brave: [0, 25, 10, 10] },
    { name: ["baal", "바알"], traitsEn: ["brave", "quiet"], traitsKo: ["용감한", "냉정한"], brave: [0, 30, 15, 15], quiet: [0, 5, 20, 5] },
    { name: ["boulder", "바위"], traitsEn: ["adamant", "bold"], traitsKo: ["고집있는", "대담한"], adamant: [10, 25, 10, 0], bold: [5, 20, 0, 0] },
    { name: ["bala", "발라"], traitsEn: ["docile", "brave"], traitsKo: ["온순한", "용감한"], docile: [0, 10, 10, 25], brave: [0, 30, 15, 15] },
    { name: ["whitedragon", "백룡"], traitsEn: ["smart", "docile"], traitsKo: ["똑똑한", "온순한"], smart: [0, 10, 0, 30], docile: [0, 5, 5, 20] },
    { name: ["ancientthunder", "번개고룡"], traitsEn: ["brave", "bold"], traitsKo: ["용감한", "대담한"], brave: [0, 30, 10, 10], bold: [0, 30, 5, 0] },
    { name: ["vagabond", "베가본드"], traitsEn: ["bold", "quiet"], traitsKo: ["대담한", "냉정한"], bold: [10, 30, 0, 0], quiet: [0, 5, 20, 5] },
    { name: ["vepal", "베팔"], traitsEn: ["quickWitted", "smart"], traitsKo: ["눈치빠른", "똑똑한"], quickWitted: [30, 0, 5, 0], smart: [5, 0, 0, 20] },
    { name: ["bonshas", "본샤스"], traitsEn: ["docile", "naive"], traitsKo: ["온순한", "천진난만한"], docile: [0, 10, 10, 30], naive: [30, 0, 10, 10] },
    { name: ["bonsharkgon", "본샤크곤"], traitsEn: ["rash", "bashful"], traitsKo: ["덜렁대는", "수줍은"], rash: [30, 15, 0, 15], bashful: [10, 0, 10, 30] },
    { name: ["bonehead", "본헤드"], traitsEn: ["quirky", "bashful"], traitsKo: ["변덕쟁이", "수줍은"], quirky: [5, 20, 0, 5], bashful: [15, 0, 15, 30] },
    { name: ["volcano", "볼케이노"], traitsEn: ["docile", "hasty"], traitsKo: ["온순한", "성급한"], docile: [0, 10, 10, 20], hasty: [20, 10, 10, 0] },
    { name: ["bomber", "봄버"], traitsEn: ["naive", "lax"], traitsKo: ["천진난만한", "촐랑대는"], naive: [30, 0, 10, 10], lax: [10, 10, 0, 30] },
    { name: ["gumiho", "불나래"], traitsEn: ["quickWitted", "quirky"], traitsKo: ["눈치빠른", "변덕쟁이"], quickWitted: [25, 0, 0, 0], quirky: [10, 25, 0, 10] },
    { name: ["blackarmor", "블랙아머"], traitsEn: ["bold", "adamant"], traitsKo: ["대담한", "고집있는"], bold: [0, 30, 0, 10], adamant: [15, 30, 15, 0] },
    { name: ["blackarmorsword", "블랙아머소드"], traitsEn: ["brave", "hardy"], traitsKo: ["용감한", "노력하는"], brave: [0, 30, 15, 15], hardy: [5, 0, 30, 0] },
    { name: ["blackarmorspear", "블랙아머스피어"], traitsEn: ["quickWitted", "careful"], traitsKo: ["눈치빠른", "신중한"], quickWitted: [20, 5, 0, 0], careful: [10, 10, 30, 0] },
    { name: ["bluelightning", "블루라이트닝"], traitsEn: ["hasty", "naive"], traitsKo: ["성급한", "천진난만한"], hasty: [20, 5, 5, 0], naive: [30, 0, 10, 10] },
    { name: ["bluethunder", "블루썬더"], traitsEn: ["careful", "docile"], traitsKo: ["신중한", "온순한"], careful: [5, 5, 20, 0], docile: [0, 10, 10, 20] },
    { name: ["bluecarathan", "블루카라선"], traitsEn: ["bashful", "adamant"], traitsKo: ["수줍은", "고집있는"], bashful: [15, 0, 15, 30], adamant: [15, 30, 15, 0] },
    { name: ["ancientglacier", "빙하고룡"], traitsEn: ["careful", "quiet"], traitsKo: ["신중한", "냉정한"], careful: [10, 10, 20, 0], quiet: [0, 10, 20, 10] },
    { name: ["glaciercheong", "빙하청룡"], traitsEn: ["quiet", "bashful"], traitsKo: ["냉정한", "수줍은"], quiet: [0, 10, 25, 10], bashful: [10, 0, 10, 30] },
    { name: ["pierrot", "삐에로"], traitsEn: ["lax", "smart"], traitsKo: ["촐랑대는", "똑똑한"], lax: [10, 10, 0, 30], smart: [0, 0, 5, 20] },
    { name: ["sand", "샌드"], traitsEn: ["naive", "calm"], traitsKo: ["천진난만한", "차분한"], naive: [25, 0, 10, 10], calm: [10, 0, 25, 10] },
    { name: ["sharkgon", "샤크곤"], traitsEn: ["quiet", "rash"], traitsKo: ["냉정한", "덜렁대는"], quiet: [0, 5, 20, 5], rash: [20, 10, 0, 10] },
    { name: ["siam", "샴"], traitsEn: ["quickWitted", "hasty"], traitsKo: ["눈치빠른", "성급한"], quickWitted: [25, 0, 0, 0], hasty: [20, 5, 5, 0] },
    { name: ["shadow", "섀도우"], traitsEn: ["quickWitted", "calm"], traitsKo: ["눈치빠른", "차분한"], quickWitted: [20, 0, 0, 5], calm: [5, 0, 20, 5] },
    { name: ["serpent", "서펀트"], traitsEn: ["hardy", "lax"], traitsKo: ["노력하는", "촐랑대는"], hardy: [0, 0, 25, 0], lax: [10, 10, 0, 20] },
    { name: ["serpentflower", "서펀트플라워"], traitsEn: ["quickWitted", "quirky"], traitsKo: ["눈치빠른", "변덕쟁이"], quickWitted: [30, 10, 0, 0], quirky: [10, 20, 0, 10] },
    { name: ["cerae", "세에레"], traitsEn: ["naive", "quirky"], traitsKo: ["천진난만한", "변덕쟁이"], naive: [20, 0, 15, 15], quirky: [10, 20, 0, 10] },
    { name: ["sentura", "센투라"], traitsEn: ["careful", "adamant"], traitsKo: ["신중한", "고집있는"], careful: [10, 10, 25, 0], adamant: [10, 25, 10, 0] },
    { name: ["solar", "솔라"], traitsEn: ["lax", "naive"], traitsKo: ["촐랑대는", "천진난만한"], lax: [15, 15, 0, 30], naive: [30, 0, 15, 15] },
    { name: ["solukanis", "솔루카니스"], traitsEn: ["bold", "hasty"], traitsKo: ["대담한", "성급한"], bold: [0, 30, 10, 0], hasty: [20, 10, 10, 0] },
    { name: ["suryong", "수룡"], traitsEn: ["docile", "naive"], traitsKo: ["온순한", "천진난만한"], docile: [0, 10, 10, 20], naive: [20, 0, 10, 10] },
    { name: ["snowice", "스노우 빙하고룡"], traitsEn: ["bold", "lax"], traitsKo: ["대담한", "촐랑대는"], bold: [0, 30, 10, 0], lax: [15, 15, 0, 30] },
    { name: ["smart", "스마트"], traitsEn: ["smart", "docile"], traitsKo: ["똑똑한", "온순한"], smart: [0, 10, 0, 20], docile: [0, 5, 5, 20] },
    { name: ["swamp", "스왐프"], traitsEn: ["calm", "docile"], traitsKo: ["차분한", "온순한"], calm: [5, 0, 20, 5], docile: [0, 5, 5, 20] },
    { name: ["skroom", "스쿠룸"], traitsEn: ["hasty", "adamant"], traitsKo: ["성급한", "고집있는"], hasty: [30, 10, 10, 0], adamant: [10, 30, 10, 0] },
    { name: ["skink", "스킨크"], traitsEn: ["adamant", "docile"], traitsKo: ["고집있는", "온순한"], adamant: [10, 25, 10, 0], docile: [0, 15, 15, 30] },
    { name: ["stealth", "스텔스"], traitsEn: ["quirky", "adamant"], traitsKo: ["변덕쟁이", "고집있는"], quirky: [10, 20, 0, 10], adamant: [10, 25, 10, 0] },
    { name: ["spicy", "스파이시"], traitsEn: ["naive", "hardy"], traitsKo: ["천진난만한", "노력하는"], naive: [20, 0, 5, 5], hardy: [0, 5, 20, 0] },
    { name: ["spike", "스파이크"], traitsEn: ["careful", "calm"], traitsKo: ["신중한", "차분한"], careful: [10, 10, 25, 0], calm: [10, 0, 20, 10] },
    { name: ["slime", "슬라임"], traitsEn: ["quirky", "lax"], traitsKo: ["변덕쟁이", "촐랑대는"], quirky: [15, 30, 0, 15], lax: [15, 15, 0, 30] },
    { name: ["citael", "시타엘"], traitsEn: ["calm", "docile"], traitsKo: ["차분한", "온순한"], calm: [15, 0, 30, 15], docile: [0, 10, 10, 20] },
    { name: ["sixleghorn", "식스레그혼"], traitsEn: ["careful", "docile"], traitsKo: ["신중한", "온순한"], careful: [10, 10, 20, 0], docile: [0, 15, 15, 30] },
    { name: ["anemone", "아네모네"], traitsEn: ["docile", "bashful"], traitsKo: ["온순한", "수줍은"], docile: [0, 5, 5, 20], bashful: [10, 0, 10, 20] },
    { name: ["asti", "아스티"], traitsEn: ["docile", "bold"], traitsKo: ["온순한", "대담한"], docile: [0, 5, 5, 20], bold: [0, 20, 10, 0] },
    { name: ["iron", "아이언"], traitsEn: ["quiet", "quirky"], traitsKo: ["냉정한", "변덕쟁이"], quiet: [0, 5, 20, 5], quirky: [15, 30, 0, 15] },
    { name: ["irondeva", "아이언데바"], traitsEn: ["quickWitted", "careful"], traitsKo: ["눈치빠른", "신중한"], quickWitted: [20, 0, 0, 10], careful: [5, 5, 20, 0] },
    { name: ["azark", "아자크"], traitsEn: ["careful", "smart"], traitsKo: ["신중한", "똑똑한"], careful: [5, 5, 20, 0], smart: [0, 0, 10, 30] },
    { name: ["afrit", "아프리트"], traitsEn: ["quiet", "quickWitted"], traitsKo: ["냉정한", "눈치빠른"], quiet: [0, 10, 25, 10], quickWitted: [30, 10, 0, 0] },
    { name: ["angra", "앙그라"], traitsEn: ["hasty", "adamant"], traitsKo: ["성급한", "고집있는"], hasty: [25, 10, 10, 0], adamant: [10, 30, 10, 0] },
    { name: ["applechick", "애플칙"], traitsEn: ["quickWitted", "bashful"], traitsKo: ["눈치빠른", "수줍은"], quickWitted: [20, 5, 0, 0], bashful: [10, 0, 10, 20] },
    { name: ["darkancient", "어둠의 고대신룡"], traitsEn: ["bold", "lax"], traitsKo: ["대담한", "촐랑대는"], bold: [0, 30, 10, 0], lax: [15, 15, 0, 30] },
    { name: ["darkthunder", "어둠의 번개고룡"], traitsEn: ["bold", "lax"], traitsKo: ["대담한", "촐랑대는"], bold: [0, 30, 10, 0], lax: [15, 15, 0, 30] },
    { name: ["abyssedge", "어비스엣지"], traitsEn: ["quiet", "adamant"], traitsKo: ["냉정한", "고집있는"], quiet: [0, 15, 30, 15], adamant: [5, 20, 5, 0] },
    { name: ["egg", "에그드래곤"], traitsEn: ["adamant", "docile"], traitsKo: ["고집있는", "온순한"], adamant: [10, 25, 10, 0], docile: [0, 5, 5, 20] },
    { name: ["emerald", "에메랄드"], traitsEn: ["brave", "calm"], traitsKo: ["용감한", "차분한"], brave: [0, 30, 15, 15], calm: [10, 0, 20, 10] },
    { name: ["alien", "에일리언"], traitsEn: ["docile", "smart"], traitsKo: ["온순한", "똑똑한"], docile: [0, 15, 15, 30], smart: [0, 0, 0, 25] },
    { name: ["angel", "엔젤"], traitsEn: ["docile", "calm"], traitsKo: ["온순한", "차분한"], docile: [0, 10, 10, 30], calm: [10, 0, 30, 10] },
    { name: ["angeljr", "엔젤주니어"], traitsEn: ["calm", "smart"], traitsKo: ["차분한", "똑똑한"], calm: [10, 0, 30, 10], smart: [0, 5, 0, 30] },
    { name: ["angelcat", "엔젤캣"], traitsEn: ["docile", "brave"], traitsKo: ["온순한", "용감한"], docile: [0, 10, 10, 25], brave: [0, 20, 10, 10] },
    { name: ["oculus", "오쿠러스"], traitsEn: ["smart", "quickWitted"], traitsKo: ["똑똑한", "눈치빠른"], smart: [10, 0, 0, 30], quickWitted: [30, 10, 0, 0] },
    { name: ["wind", "윈드"], traitsEn: ["quickWitted", "hasty"], traitsKo: ["눈치빠른", "성급한"], quickWitted: [25, 0, 0, 0], hasty: [20, 10, 10, 0] },
    { name: ["wings", "윙스"], traitsEn: ["rash", "bashful"], traitsKo: ["덜렁대는", "수줍어하는"], rash: [25, 10, 0, 10], bashful: [5, 0, 5, 20] },
    { name: ["ignis", "이그니스"], traitsEn: ["calm", "docile"], traitsKo: ["차분한", "온순한"], calm: [10, 0, 20, 10], docile: [0, 10, 10, 25] },
    { name: ["insect", "인섹트"], traitsEn: ["naive", "bashful"], traitsKo: ["천진난만한", "수줍은"], naive: [20, 0, 5, 5], bashful: [15, 0, 15, 30] },
    { name: ["insectqueen", "인섹트퀸"], traitsEn: ["quickWitted", "smart"], traitsKo: ["눈치빠른", "똑똑한"], quickWitted: [30, 0, 5, 0], smart: [0, 10, 0, 30] },
    { name: ["illios", "일리오스"], traitsEn: ["brave", "smart"], traitsKo: ["용감한", "똑똑한"], brave: [0, 20, 10, 10], smart: [0, 0, 0, 30] },
    { name: ["zmn", "즈믄"], traitsEn: ["quickWitted", "smart"], traitsKo: ["눈치빠른", "똑똑한"], quickWitted: [25, 0, 0, 0], smart: [10, 0, 0, 20] },
    { name: ["gne", "G네"], traitsEn: ["quirky", "careful"], traitsKo: ["변덕쟁이", "신중한"], quirky: [15, 30, 0, 15], careful: [10, 10, 25, 0] },
    { name: ["underground", "지하땅굴"], traitsEn: ["quiet", "bashful"], traitsKo: ["냉정한", "수줍은"], quiet: [0, 10, 25, 10], bashful: [10, 0, 10, 20] },
    { name: ["jealouscupid", "질투의 큐피트"], traitsEn: ["hasty", "adamant"], traitsKo: ["성급한", "고집있는"], hasty: [25, 10, 10, 0], adamant: [10, 30, 10, 0] },
    { name: ["cheong", "청룡"], traitsEn: ["docile", "rash"], traitsKo: ["온순한", "덜렁대는"], docile: [0, 5, 5, 20], rash: [20, 10, 0, 10] },
    { name: ["carathan", "카라선"], traitsEn: ["lax", "naive"], traitsKo: ["촐랑대는", "천진난만한"], lax: [15, 15, 0, 30], naive: [25, 0, 10, 10] },
    { name: ["kalura", "카루라"], traitsEn: ["calm", "quiet"], traitsKo: ["차분한", "냉정한"], calm: [5, 0, 20, 5], quiet: [0, 15, 30, 15] },
    { name: ["khan", "칸"], traitsEn: ["careful", "quiet"], traitsKo: ["신중한", "냉정한"], careful: [10, 10, 25, 0], quiet: [0, 10, 20, 10] },
    { name: ["khanmarino", "칸마리노"], traitsEn: ["adamant", "hasty"], traitsKo: ["고집있는", "성급한"], adamant: [10, 25, 10, 0], hasty: [20, 10, 10, 0] },
    { name: ["catsgon", "캣츠곤"], traitsEn: ["quickWitted", "quirky"], traitsKo: ["눈치빠른", "변덕쟁이"], quickWitted: [30, 10, 0, 0], quirky: [10, 20, 0, 10] },
    { name: ["cobragon", "코브라곤"], traitsEn: ["quirky", "adamant"], traitsKo: ["변덕쟁이", "고집있는"], quirky: [10, 30, 0, 10], adamant: [10, 25, 10, 0] },
    { name: ["kuzmara", "쿠즈마라"], traitsEn: ["brave", "careful"], traitsKo: ["용감한", "신중한"], brave: [0, 25, 10, 10], careful: [10, 10, 25, 0] },
    { name: ["cupid", "큐피트"], traitsEn: ["naive", "hardy"], traitsKo: ["천진난만한", "노력하는"], naive: [30, 0, 10, 10], hardy: [0, 0, 25, 0] },
    { name: ["cupifriend", "큐피프렌드"], traitsEn: ["brave", "hardy"], traitsKo: ["용감한", "노력하는"], brave: [0, 20, 5, 5], hardy: [0, 0, 25, 0] },
    { name: ["crested", "크레스티드"], traitsEn: ["lax", "quickWitted"], traitsKo: ["촐랑대는", "눈치빠른"], lax: [5, 5, 0, 20], quickWitted: [20, 5, 0, 0] },
    { name: ["cloud", "클라우드"], traitsEn: ["hasty", "quirky"], traitsKo: ["성급한", "변덕쟁이"], hasty: [20, 5, 5, 0], quirky: [10, 25, 0, 10] },
    { name: ["taavire", "타아비레"], traitsEn: ["quiet", "brave"], traitsKo: ["냉정한", "용감한"], quiet: [0, 10, 25, 10], brave: [0, 20, 10, 10] },
    { name: ["taigeta", "타이게타"], traitsEn: ["careful", "quiet"], traitsKo: ["신중한", "냉정한"], careful: [10, 10, 25, 0], quiet: [0, 10, 20, 10] },
    { name: ["tycane", "타이케인"], traitsEn: ["quirky", "hasty"], traitsKo: ["변덕쟁이", "성급한"], quirky: [10, 20, 0, 10], hasty: [20, 10, 10, 0] },
    { name: ["typhoon", "타이푼"], traitsEn: ["quirky", "quickWitted"], traitsKo: ["변덕쟁이", "눈치빠른"], quirky: [10, 25, 0, 10], quickWitted: [20, 5, 0, 0] },
    { name: ["totem", "토템"], traitsEn: ["careful", "calm"], traitsKo: ["신중한", "차분한"], careful: [10, 10, 25, 0], calm: [5, 0, 20, 5] },
    { name: ["timber", "팀버"], traitsEn: ["docile", "adamant"], traitsKo: ["온순한", "고집있는"], docile: [0, 10, 10, 25], adamant: [10, 30, 10, 0] },
    { name: ["fire", "파이어"], traitsEn: ["hasty", "adamant"], traitsKo: ["성급한", "고집있는"], hasty: [20, 10, 10, 0], adamant: [5, 20, 5, 0] },
    { name: ["power", "파워"], traitsEn: ["smart", "calm"], traitsKo: ["똑똑한", "차분한"], smart: [0, 0, 0, 25], calm: [10, 0, 25, 10] },
    { name: ["party", "파티"], traitsEn: ["lax", "naive"], traitsKo: ["촐랑대는", "천진난만한"], lax: [15, 15, 0, 30], naive: [30, 0, 10, 10] },
    { name: ["pangpang", "팡팡"], traitsEn: ["hardy", "quickWitted"], traitsKo: ["노력하는", "눈치빠른"], hardy: [0, 10, 10, 0], quickWitted: [30, 0, 10, 0] },
    { name: ["pat", "패트"], traitsEn: ["calm", "docile"], traitsKo: ["신중한", "온순한"], calm: [10, 0, 25, 10], docile: [0, 10, 10, 20] },
    { name: ["petroa", "패트로아"], traitsEn: ["naive", "hardy"], traitsKo: ["천진난만한", "노력하는"], naive: [20, 0, 5, 5], hardy: [0, 0, 25, 0] },
    { name: ["inokimush", "팽이버섯"], traitsEn: ["adamant", "rash"], traitsKo: ["고집있는", "덜렁대는"], adamant: [10, 30, 10, 0], rash: [25, 10, 0, 10] },
    { name: ["purplelips", "퍼플립스"], traitsEn: ["smart", "docile"], traitsKo: ["똑똑한", "온순한"], smart: [0, 10, 0, 30], docile: [0, 15, 15, 30] },
    { name: ["feroth", "페로스"], traitsEn: ["smart", "careful"], traitsKo: ["똑똑한", "신중한"], smart: [10, 0, 0, 30], careful: [10, 10, 30, 0] },
    { name: ["petra", "페트라"], traitsEn: ["calm", "quiet"], traitsKo: ["차분한", "냉정한"], calm: [15, 0, 30, 15], quiet: [0, 5, 20, 5] },
    { name: ["porta", "포르타"], traitsEn: ["calm", "brave"], traitsKo: ["차분한", "용감한"], calm: [10, 0, 25, 10], brave: [0, 30, 10, 10] },
    { name: ["popomo", "포포모"], traitsEn: ["naive", "lax"], traitsKo: ["천진난만한", "촐랑대는"], naive: [20, 0, 10, 10], lax: [10, 10, 0, 30] },
    { name: ["popon", "포폰"], traitsEn: ["bashful", "lax"], traitsKo: ["수줍은", "촐랑대는"], bashful: [10, 0, 10, 20], lax: [5, 5, 0, 20] },
    { name: ["flame", "플레임"], traitsEn: ["careful", "calm"], traitsKo: ["신중한", "차분한"], careful: [5, 5, 20, 0], calm: [10, 0, 20, 10] },
    { name: ["frog", "프로그"], traitsEn: ["quirky", "calm"], traitsKo: ["변덕쟁이", "차분한"], quirky: [10, 25, 0, 10], calm: [10, 0, 20, 10] },
    { name: ["flower", "플라워"], traitsEn: ["bashful", "rash"], traitsKo: ["수줍은", "덜렁대는"], bashful: [10, 0, 10, 30], rash: [20, 10, 0, 10] },
    { name: ["phoenix", "피닉스"], traitsEn: ["naive", "docile"], traitsKo: ["천진난만한", "온순한"], naive: [20, 0, 10, 10], docile: [0, 15, 15, 30] },
    { name: ["hurricane", "허리케인"], traitsEn: ["quickWitted", "quirky"], traitsKo: ["눈치빠른", "변덕쟁이"], quickWitted: [20, 0, 0, 0], quirky: [15, 30, 0, 15] },
    { name: ["henneth", "헤네스"], traitsEn: ["careful", "adamant"], traitsKo: ["신중한", "고집있는"], careful: [15, 15, 30, 0], adamant: [15, 30, 15, 0] },
    { name: ["hell", "헬"], traitsEn: ["quirky", "quickWitted"], traitsKo: ["변덕쟁이", "눈치빠른"], quirky: [15, 30, 0, 15], quickWitted: [20, 10, 0, 0] },
    { name: ["hyunmu", "현무"], traitsEn: ["brave", "bold"], traitsKo: ["용감한", "대담한"], brave: [0, 20, 5, 5], bold: [0, 30, 0, 10] },
    { name: ["whitegold", "화이트골드"], traitsEn: ["bold", "calm"], traitsKo: ["대담한", "차분한"], bold: [10, 20, 0, 0], calm: [15, 0, 30, 15] },
    { name: ["whitethunder", "화이트썬더"], traitsEn: ["hasty", "bold"], traitsKo: ["성급한", "대담한"], hasty: [30, 10, 10, 0], bold: [0, 30, 5, 0] },
    { name: ["goldapple", "황금 애플칙"], traitsEn: ["hasty", "adamant"], traitsKo: ["성급한", "고집있는"], hasty: [25, 10, 10, 0], adamant: [10, 30, 10, 0] },
    { name: ["blackdragon", "흑룡"], traitsEn: ["quiet", "careful"], traitsKo: ["냉정한", "신중한"], quiet: [0, 5, 20, 5], careful: [5, 5, 20, 0] },
    { name: ["hydragon", "히드라곤"], traitsEn: ["adamant", "hasty"], traitsKo: ["고집있는", "성급한"], adamant: [10, 20, 10, 0], hasty: [20, 5, 5, 0] }
];

const dragonTraits = [
    { traitName: "timid", nameKo: "겁이 많은" },
    { traitName: "noble", nameKo: "고귀한" },
    { traitName: "adamant", nameKo: "고집있는" },
    { traitName: "lunatic", nameKo: "광적인" },
    { traitName: "elegant", nameKo: "기품있는" },
    { traitName: "neat", nameKo: "깨끗한" },
    { traitName: "introvert", nameKo: "내향적인" },
    { traitName: "quiet", nameKo: "냉정한" },
    { traitName: "hardy", nameKo: "노력하는" },
    { traitName: "quickWitted", nameKo: "눈치빠른" },
    { traitName: "bold", nameKo: "대담한" },
    { traitName: "rash", nameKo: "덜렁대는" },
    { traitName: "smart", nameKo: "똑똑한" },
    { traitName: "immersedIn", nameKo: "몰입하는" },
    { traitName: "quirky", nameKo: "변덕쟁이" },
    { traitName: "lovely", nameKo: "사랑스러운" },
    { traitName: "clumsy", nameKo: "서투른" },
    { traitName: "hasty", nameKo: "성급한" },
    { traitName: "serious", nameKo: "성실한" },
    { traitName: "passive", nameKo: "소극적인" },
    { traitName: "bashful", nameKo: "수줍은" },
    { traitName: "pure", nameKo: "순수한" },
    { traitName: "careful", nameKo: "신중한" },
    { traitName: "charming", nameKo: "애교많은" },
    { traitName: "arrogant", nameKo: "오만한" },
    { traitName: "docile", nameKo: "온순한" },
    { traitName: "perfectionist", nameKo: "완벽주의자" },
    { traitName: "lonely", nameKo: "외로워하는" },
    { traitName: "brave", nameKo: "용감한" },
    { traitName: "capable", nameKo: "유능한" },
    { traitName: "quiet", nameKo: "조용한" },
    { traitName: "calm", nameKo: "차분한" },
    { traitName: "naive", nameKo: "천진난만한" },
    { traitName: "lax", nameKo: "촐랑대는" },
    { traitName: "dull", nameKo: "평범한" },
    { traitName: "classy", nameKo: "품위있는" },
    { traitName: "curious", nameKo: "호기심많은" }
];

document.addEventListener("DOMContentLoaded", function () {
    for (let i = 0; i < dragonList.length; i++) {
        let newOption = document.createElement("option");
        // newOption.setAttribute("value", dragonList[i].name[0]);
        newOption.textContent = dragonList[i].name[1];
        document.querySelector("#dragon-selector").append(newOption);
    }

    for (let i = 0; i < dragonTraits.length; i++) {
        let newOption = document.createElement("option");
        // newOption.setAttribute("value", dragonTraits[i].traitName);
        newOption.textContent = dragonTraits[i].nameKo;
        document.querySelector("#trait-selector").append(newOption);
    }
});
