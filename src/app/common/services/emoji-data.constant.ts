const EMOJI_DATA = {
    "2049": {
        "id": "2049",
        "name": "exclamation question mark",
        "category": "symbols"
    },
    "2122": {
        "id": "2122",
        "name": "trade mark",
        "category": "symbols"
    },
    "2139": {
        "id": "2139",
        "name": "information",
        "category": "symbols"
    },
    "2194": {
        "id": "2194",
        "name": "left-right arrow",
        "category": "symbols"
    },
    "2195": {
        "id": "2195",
        "name": "up-down arrow",
        "category": "symbols"
    },
    "2196": {
        "id": "2196",
        "name": "up-left arrow",
        "category": "symbols"
    },
    "2197": {
        "id": "2197",
        "name": "up-right arrow",
        "category": "symbols"
    },
    "2198": {
        "id": "2198",
        "name": "down-right arrow",
        "category": "symbols"
    },
    "2199": {
        "id": "2199",
        "name": "down-left arrow",
        "category": "symbols"
    },
    "2328": {
        "id": "2328",
        "name": "keyboard",
        "category": "objects"
    },
    "2600": {
        "id": "2600",
        "name": "sun",
        "category": "nature"
    },
    "2601": {
        "id": "2601",
        "name": "cloud",
        "category": "nature"
    },
    "2602": {
        "id": "2602",
        "name": "umbrella",
        "category": "nature"
    },
    "2603": {
        "id": "2603",
        "name": "snowman",
        "category": "nature"
    },
    "2604": {
        "id": "2604",
        "name": "comet",
        "category": "nature"
    },
    "2611": {
        "id": "2611",
        "name": "ballot box with check",
        "category": "symbols"
    },
    "2614": {
        "id": "2614",
        "name": "umbrella with rain drops",
        "category": "nature"
    },
    "2615": {
        "id": "2615",
        "name": "hot beverage",
        "category": "food"
    },
    "2618": {
        "id": "2618",
        "name": "shamrock",
        "category": "nature"
    },
    "2620": {
        "id": "2620",
        "name": "skull and crossbones",
        "category": "people"
    },
    "2622": {
        "id": "2622",
        "name": "radioactive",
        "category": "symbols"
    },
    "2623": {
        "id": "2623",
        "name": "biohazard",
        "category": "symbols"
    },
    "2626": {
        "id": "2626",
        "name": "orthodox cross",
        "category": "symbols"
    },
    "2638": {
        "id": "2638",
        "name": "wheel of dharma",
        "category": "symbols"
    },
    "2639": {
        "id": "2639",
        "name": "frowning face",
        "category": "people"
    },
    "2640": {
        "id": "2640",
        "name": "female sign",
        "category": "symbols"
    },
    "2642": {
        "id": "2642",
        "name": "male sign",
        "category": "symbols"
    },
    "2648": {
        "id": "2648",
        "name": "Aries",
        "category": "symbols"
    },
    "2649": {
        "id": "2649",
        "name": "Taurus",
        "category": "symbols"
    },
    "2650": {
        "id": "2650",
        "name": "Sagittarius",
        "category": "symbols"
    },
    "2651": {
        "id": "2651",
        "name": "Capricorn",
        "category": "symbols"
    },
    "2652": {
        "id": "2652",
        "name": "Aquarius",
        "category": "symbols"
    },
    "2653": {
        "id": "2653",
        "name": "Pisces",
        "category": "symbols"
    },
    "2660": {
        "id": "2660",
        "name": "spade suit",
        "category": "symbols"
    },
    "2663": {
        "id": "2663",
        "name": "club suit",
        "category": "symbols"
    },
    "2665": {
        "id": "2665",
        "name": "heart suit",
        "category": "symbols"
    },
    "2666": {
        "id": "2666",
        "name": "diamond suit",
        "category": "symbols"
    },
    "2668": {
        "id": "2668",
        "name": "hot springs",
        "category": "symbols"
    },
    "2692": {
        "id": "2692",
        "name": "hammer and pick",
        "category": "objects"
    },
    "2693": {
        "id": "2693",
        "name": "anchor",
        "category": "travel"
    },
    "2694": {
        "id": "2694",
        "name": "crossed swords",
        "category": "objects"
    },
    "2695": {
        "id": "2695",
        "name": "medical symbol",
        "category": "symbols"
    },
    "2696": {
        "id": "2696",
        "name": "balance scale",
        "category": "objects"
    },
    "2697": {
        "id": "2697",
        "name": "alembic",
        "category": "objects"
    },
    "2699": {
        "id": "2699",
        "name": "gear",
        "category": "objects"
    },
    "2702": {
        "id": "2702",
        "name": "scissors",
        "category": "objects"
    },
    "2705": {
        "id": "2705",
        "name": "white heavy check mark",
        "category": "symbols"
    },
    "2708": {
        "id": "2708",
        "name": "airplane",
        "category": "travel"
    },
    "2709": {
        "id": "2709",
        "name": "envelope",
        "category": "objects"
    },
    "2712": {
        "id": "2712",
        "name": "black nib",
        "category": "objects"
    },
    "2714": {
        "id": "2714",
        "name": "heavy check mark",
        "category": "symbols"
    },
    "2716": {
        "id": "2716",
        "name": "heavy multiplication x",
        "category": "symbols"
    },
    "2721": {
        "id": "2721",
        "name": "star of David",
        "category": "symbols"
    },
    "2728": {
        "id": "2728",
        "name": "sparkles",
        "category": "nature"
    },
    "2733": {
        "id": "2733",
        "name": "eight-spoked asterisk",
        "category": "symbols"
    },
    "2734": {
        "id": "2734",
        "name": "eight-pointed star",
        "category": "symbols"
    },
    "2744": {
        "id": "2744",
        "name": "snowflake",
        "category": "nature"
    },
    "2747": {
        "id": "2747",
        "name": "sparkle",
        "category": "symbols"
    },
    "2753": {
        "id": "2753",
        "name": "question mark",
        "category": "symbols"
    },
    "2754": {
        "id": "2754",
        "name": "white question mark",
        "category": "symbols"
    },
    "2755": {
        "id": "2755",
        "name": "white exclamation mark",
        "category": "symbols"
    },
    "2757": {
        "id": "2757",
        "name": "exclamation mark",
        "category": "symbols"
    },
    "2763": {
        "id": "2763",
        "name": "heavy heart exclamation",
        "category": "symbols"
    },
    "2764": {
        "id": "2764",
        "name": "red heart",
        "category": "symbols"
    },
    "2795": {
        "id": "2795",
        "name": "heavy plus sign",
        "category": "symbols"
    },
    "2796": {
        "id": "2796",
        "name": "heavy minus sign",
        "category": "symbols"
    },
    "2797": {
        "id": "2797",
        "name": "heavy division sign",
        "category": "symbols"
    },
    "2934": {
        "id": "2934",
        "name": "right arrow curving up",
        "category": "symbols"
    },
    "2935": {
        "id": "2935",
        "name": "right arrow curving down",
        "category": "symbols"
    },
    "3030": {
        "id": "3030",
        "name": "wavy dash",
        "category": "symbols"
    },
    "3297": {
        "id": "3297",
        "name": "Japanese “congratulations” button",
        "category": "symbols"
    },
    "3299": {
        "id": "3299",
        "name": "Japanese “secret” button",
        "category": "symbols"
    },
    "1f9e1": {
        "id": "1f9e1",
        "name": "orange heart",
        "category": "symbols"
    },
    "1f49b": {
        "id": "1f49b",
        "name": "yellow heart",
        "category": "symbols"
    },
    "1f49a": {
        "id": "1f49a",
        "name": "green heart",
        "category": "symbols"
    },
    "1f499": {
        "id": "1f499",
        "name": "blue heart",
        "category": "symbols"
    },
    "1f49c": {
        "id": "1f49c",
        "name": "purple heart",
        "category": "symbols"
    },
    "1f5a4": {
        "id": "1f5a4",
        "name": "black heart",
        "category": "symbols"
    },
    "1f494": {
        "id": "1f494",
        "name": "broken heart",
        "category": "symbols"
    },
    "1f495": {
        "id": "1f495",
        "name": "two hearts",
        "category": "symbols"
    },
    "1f49e": {
        "id": "1f49e",
        "name": "revolving hearts",
        "category": "symbols"
    },
    "1f493": {
        "id": "1f493",
        "name": "beating heart",
        "category": "symbols"
    },
    "1f497": {
        "id": "1f497",
        "name": "growing heart",
        "category": "symbols"
    },
    "1f496": {
        "id": "1f496",
        "name": "sparkling heart",
        "category": "symbols"
    },
    "1f498": {
        "id": "1f498",
        "name": "heart with arrow",
        "category": "symbols"
    },
    "1f49d": {
        "id": "1f49d",
        "name": "heart with ribbon",
        "category": "symbols"
    },
    "1f49f": {
        "id": "1f49f",
        "name": "heart decoration",
        "category": "symbols"
    },
    "262e": {
        "id": "262e",
        "name": "peace symbol",
        "category": "symbols"
    },
    "271d": {
        "id": "271d",
        "name": "latin cross",
        "category": "symbols"
    },
    "262a": {
        "id": "262a",
        "name": "star and crescent",
        "category": "symbols"
    },
    "1f549": {
        "id": "1f549",
        "name": "om",
        "category": "symbols"
    },
    "1f52f": {
        "id": "1f52f",
        "name": "dotted six-pointed star",
        "category": "symbols"
    },
    "1f54e": {
        "id": "1f54e",
        "name": "menorah",
        "category": "symbols"
    },
    "262f": {
        "id": "262f",
        "name": "yin yang",
        "category": "symbols"
    },
    "1f6d0": {
        "id": "1f6d0",
        "name": "place of worship",
        "category": "symbols"
    },
    "26ce": {
        "id": "26ce",
        "name": "Ophiuchus",
        "category": "symbols"
    },
    "264a": {
        "id": "264a",
        "name": "Gemini",
        "category": "symbols"
    },
    "264b": {
        "id": "264b",
        "name": "Cancer",
        "category": "symbols"
    },
    "264c": {
        "id": "264c",
        "name": "Leo",
        "category": "symbols"
    },
    "264d": {
        "id": "264d",
        "name": "Virgo",
        "category": "symbols"
    },
    "264e": {
        "id": "264e",
        "name": "Libra",
        "category": "symbols"
    },
    "264f": {
        "id": "264f",
        "name": "Scorpio",
        "category": "symbols"
    },
    "1f194": {
        "id": "1f194",
        "name": "ID button",
        "category": "symbols"
    },
    "269b": {
        "id": "269b",
        "name": "atom symbol",
        "category": "symbols"
    },
    "267e": {
        "id": "267e",
        "name": "infinity",
        "category": "symbols"
    },
    "1f251": {
        "id": "1f251",
        "name": "Japanese “acceptable” button",
        "category": "symbols"
    },
    "1f4f4": {
        "id": "1f4f4",
        "name": "mobile phone off",
        "category": "symbols"
    },
    "1f4f3": {
        "id": "1f4f3",
        "name": "vibration mode",
        "category": "symbols"
    },
    "1f236": {
        "id": "1f236",
        "name": "Japanese “not free of charge” button",
        "category": "symbols"
    },
    "1f21a": {
        "id": "1f21a",
        "name": "Japanese “free of charge” button",
        "category": "symbols"
    },
    "1f238": {
        "id": "1f238",
        "name": "Japanese “application” button",
        "category": "symbols"
    },
    "1f23a": {
        "id": "1f23a",
        "name": "Japanese “open for business” button",
        "category": "symbols"
    },
    "1f237": {
        "id": "1f237",
        "name": "Japanese “monthly amount” button",
        "category": "symbols"
    },
    "1f19a": {
        "id": "1f19a",
        "name": "VS button",
        "category": "symbols"
    },
    "1f4ae": {
        "id": "1f4ae",
        "name": "white flower",
        "category": "symbols"
    },
    "1f250": {
        "id": "1f250",
        "name": "Japanese “bargain” button",
        "category": "symbols"
    },
    "1f234": {
        "id": "1f234",
        "name": "Japanese “passing grade” button",
        "category": "symbols"
    },
    "1f235": {
        "id": "1f235",
        "name": "Japanese “no vacancy” button",
        "category": "symbols"
    },
    "1f239": {
        "id": "1f239",
        "name": "Japanese “discount” button",
        "category": "symbols"
    },
    "1f232": {
        "id": "1f232",
        "name": "Japanese “prohibited” button",
        "category": "symbols"
    },
    "1f170": {
        "id": "1f170",
        "name": "A button (blood type)",
        "category": "symbols"
    },
    "1f171": {
        "id": "1f171",
        "name": "B button (blood type)",
        "category": "symbols"
    },
    "1f18e": {
        "id": "1f18e",
        "name": "AB button (blood type)",
        "category": "symbols"
    },
    "1f191": {
        "id": "1f191",
        "name": "CL button",
        "category": "symbols"
    },
    "1f17e": {
        "id": "1f17e",
        "name": "O button (blood type)",
        "category": "symbols"
    },
    "1f198": {
        "id": "1f198",
        "name": "SOS button",
        "category": "symbols"
    },
    "274c": {
        "id": "274c",
        "name": "cross mark",
        "category": "symbols"
    },
    "2b55": {
        "id": "2b55",
        "name": "heavy large circle",
        "category": "symbols"
    },
    "1f6d1": {
        "id": "1f6d1",
        "name": "stop sign",
        "category": "symbols"
    },
    "26d4": {
        "id": "26d4",
        "name": "no entry",
        "category": "symbols"
    },
    "1f4db": {
        "id": "1f4db",
        "name": "name badge",
        "category": "symbols"
    },
    "1f6ab": {
        "id": "1f6ab",
        "name": "prohibited",
        "category": "symbols"
    },
    "1f4af": {
        "id": "1f4af",
        "name": "hundred points",
        "category": "symbols"
    },
    "1f4a2": {
        "id": "1f4a2",
        "name": "anger symbol",
        "category": "symbols"
    },
    "1f6b7": {
        "id": "1f6b7",
        "name": "no pedestrians",
        "category": "symbols"
    },
    "1f6af": {
        "id": "1f6af",
        "name": "no littering",
        "category": "symbols"
    },
    "1f6b3": {
        "id": "1f6b3",
        "name": "no bicycles",
        "category": "symbols"
    },
    "1f6b1": {
        "id": "1f6b1",
        "name": "non-potable water",
        "category": "symbols"
    },
    "1f51e": {
        "id": "1f51e",
        "name": "no one under eighteen",
        "category": "symbols"
    },
    "1f4f5": {
        "id": "1f4f5",
        "name": "no mobile phones",
        "category": "symbols"
    },
    "1f6ad": {
        "id": "1f6ad",
        "name": "no smoking",
        "category": "symbols"
    },
    "203c": {
        "id": "203c",
        "name": "double exclamation mark",
        "category": "symbols"
    },
    "1f505": {
        "id": "1f505",
        "name": "dim button",
        "category": "symbols"
    },
    "1f506": {
        "id": "1f506",
        "name": "bright button",
        "category": "symbols"
    },
    "303d": {
        "id": "303d",
        "name": "part alternation mark",
        "category": "symbols"
    },
    "26a0": {
        "id": "26a0",
        "name": "warning",
        "category": "symbols"
    },
    "1f6b8": {
        "id": "1f6b8",
        "name": "children crossing",
        "category": "symbols"
    },
    "1f531": {
        "id": "1f531",
        "name": "trident emblem",
        "category": "symbols"
    },
    "269c": {
        "id": "269c",
        "name": "fleur-de-lis",
        "category": "symbols"
    },
    "1f530": {
        "id": "1f530",
        "name": "Japanese symbol for beginner",
        "category": "symbols"
    },
    "267b": {
        "id": "267b",
        "name": "recycling symbol",
        "category": "symbols"
    },
    "1f22f": {
        "id": "1f22f",
        "name": "Japanese “reserved” button",
        "category": "symbols"
    },
    "1f4b9": {
        "id": "1f4b9",
        "name": "chart increasing with yen",
        "category": "symbols"
    },
    "274e": {
        "id": "274e",
        "name": "cross mark button",
        "category": "symbols"
    },
    "1f310": {
        "id": "1f310",
        "name": "globe with meridians",
        "category": "symbols"
    },
    "1f4a0": {
        "id": "1f4a0",
        "name": "diamond with a dot",
        "category": "symbols"
    },
    "24c2": {
        "id": "24c2",
        "name": "circled M",
        "category": "symbols"
    },
    "1f300": {
        "id": "1f300",
        "name": "cyclone",
        "category": "symbols"
    },
    "1f4a4": {
        "id": "1f4a4",
        "name": "zzz",
        "category": "symbols"
    },
    "1f3e7": {
        "id": "1f3e7",
        "name": "ATM sign",
        "category": "symbols"
    },
    "1f6be": {
        "id": "1f6be",
        "name": "water closet",
        "category": "symbols"
    },
    "267f": {
        "id": "267f",
        "name": "wheelchair symbol",
        "category": "symbols"
    },
    "1f17f": {
        "id": "1f17f",
        "name": "P button",
        "category": "symbols"
    },
    "1f233": {
        "id": "1f233",
        "name": "Japanese “vacancy” button",
        "category": "symbols"
    },
    "1f202": {
        "id": "1f202",
        "name": "Japanese “service charge” button",
        "category": "symbols"
    },
    "1f6c2": {
        "id": "1f6c2",
        "name": "passport control",
        "category": "symbols"
    },
    "1f6c3": {
        "id": "1f6c3",
        "name": "customs",
        "category": "symbols"
    },
    "1f6c4": {
        "id": "1f6c4",
        "name": "baggage claim",
        "category": "symbols"
    },
    "1f6c5": {
        "id": "1f6c5",
        "name": "left luggage",
        "category": "symbols"
    },
    "1f6b9": {
        "id": "1f6b9",
        "name": "men’s room",
        "category": "symbols"
    },
    "1f6ba": {
        "id": "1f6ba",
        "name": "women’s room",
        "category": "symbols"
    },
    "1f6bc": {
        "id": "1f6bc",
        "name": "baby symbol",
        "category": "symbols"
    },
    "1f6bb": {
        "id": "1f6bb",
        "name": "restroom",
        "category": "symbols"
    },
    "1f6ae": {
        "id": "1f6ae",
        "name": "litter in bin sign",
        "category": "symbols"
    },
    "1f3a6": {
        "id": "1f3a6",
        "name": "cinema",
        "category": "symbols"
    },
    "1f4f6": {
        "id": "1f4f6",
        "name": "antenna bars",
        "category": "symbols"
    },
    "1f201": {
        "id": "1f201",
        "name": "Japanese “here” button",
        "category": "symbols"
    },
    "1f523": {
        "id": "1f523",
        "name": "input symbols",
        "category": "symbols"
    },
    "1f524": {
        "id": "1f524",
        "name": "input latin letters",
        "category": "symbols"
    },
    "1f521": {
        "id": "1f521",
        "name": "input latin lowercase",
        "category": "symbols"
    },
    "1f520": {
        "id": "1f520",
        "name": "input latin uppercase",
        "category": "symbols"
    },
    "1f196": {
        "id": "1f196",
        "name": "NG button",
        "category": "symbols"
    },
    "1f197": {
        "id": "1f197",
        "name": "OK button",
        "category": "symbols"
    },
    "1f199": {
        "id": "1f199",
        "name": "UP! button",
        "category": "symbols"
    },
    "1f192": {
        "id": "1f192",
        "name": "COOL button",
        "category": "symbols"
    },
    "1f195": {
        "id": "1f195",
        "name": "NEW button",
        "category": "symbols"
    },
    "1f193": {
        "id": "1f193",
        "name": "FREE button",
        "category": "symbols"
    },
    "0030-20e3": {
        "id": "0030-20e3",
        "name": "keycap: 0",
        "category": "symbols"
    },
    "0031-20e3": {
        "id": "0031-20e3",
        "name": "keycap: 1",
        "category": "symbols"
    },
    "0032-20e3": {
        "id": "0032-20e3",
        "name": "keycap: 2",
        "category": "symbols"
    },
    "0033-20e3": {
        "id": "0033-20e3",
        "name": "keycap: 3",
        "category": "symbols"
    },
    "0034-20e3": {
        "id": "0034-20e3",
        "name": "keycap: 4",
        "category": "symbols"
    },
    "0035-20e3": {
        "id": "0035-20e3",
        "name": "keycap: 5",
        "category": "symbols"
    },
    "0036-20e3": {
        "id": "0036-20e3",
        "name": "keycap: 6",
        "category": "symbols"
    },
    "0037-20e3": {
        "id": "0037-20e3",
        "name": "keycap: 7",
        "category": "symbols"
    },
    "0038-20e3": {
        "id": "0038-20e3",
        "name": "keycap: 8",
        "category": "symbols"
    },
    "0039-20e3": {
        "id": "0039-20e3",
        "name": "keycap: 9",
        "category": "symbols"
    },
    "1f51f": {
        "id": "1f51f",
        "name": "keycap: 10",
        "category": "symbols"
    },
    "1f522": {
        "id": "1f522",
        "name": "input numbers",
        "category": "symbols"
    },
    "0023-20e3": {
        "id": "0023-20e3",
        "name": "keycap: #",
        "category": "symbols"
    },
    "002a-20e3": {
        "id": "002a-20e3",
        "name": "keycap: *",
        "category": "symbols"
    },
    "23cf": {
        "id": "23cf",
        "name": "eject button",
        "category": "symbols"
    },
    "25b6": {
        "id": "25b6",
        "name": "play button",
        "category": "symbols"
    },
    "23f8": {
        "id": "23f8",
        "name": "pause button",
        "category": "symbols"
    },
    "23ef": {
        "id": "23ef",
        "name": "play or pause button",
        "category": "symbols"
    },
    "23f9": {
        "id": "23f9",
        "name": "stop button",
        "category": "symbols"
    },
    "23fa": {
        "id": "23fa",
        "name": "record button",
        "category": "symbols"
    },
    "23ed": {
        "id": "23ed",
        "name": "next track button",
        "category": "symbols"
    },
    "23ee": {
        "id": "23ee",
        "name": "last track button",
        "category": "symbols"
    },
    "23e9": {
        "id": "23e9",
        "name": "fast-forward button",
        "category": "symbols"
    },
    "23ea": {
        "id": "23ea",
        "name": "fast reverse button",
        "category": "symbols"
    },
    "23eb": {
        "id": "23eb",
        "name": "fast up button",
        "category": "symbols"
    },
    "23ec": {
        "id": "23ec",
        "name": "fast down button",
        "category": "symbols"
    },
    "25c0": {
        "id": "25c0",
        "name": "reverse button",
        "category": "symbols"
    },
    "1f53c": {
        "id": "1f53c",
        "name": "upwards button",
        "category": "symbols"
    },
    "1f53d": {
        "id": "1f53d",
        "name": "downwards button",
        "category": "symbols"
    },
    "27a1": {
        "id": "27a1",
        "name": "right arrow",
        "category": "symbols"
    },
    "2b05": {
        "id": "2b05",
        "name": "left arrow",
        "category": "symbols"
    },
    "2b06": {
        "id": "2b06",
        "name": "up arrow",
        "category": "symbols"
    },
    "2b07": {
        "id": "2b07",
        "name": "down arrow",
        "category": "symbols"
    },
    "21aa": {
        "id": "21aa",
        "name": "left arrow curving right",
        "category": "symbols"
    },
    "21a9": {
        "id": "21a9",
        "name": "right arrow curving left",
        "category": "symbols"
    },
    "1f500": {
        "id": "1f500",
        "name": "shuffle tracks button",
        "category": "symbols"
    },
    "1f501": {
        "id": "1f501",
        "name": "repeat button",
        "category": "symbols"
    },
    "1f502": {
        "id": "1f502",
        "name": "repeat single button",
        "category": "symbols"
    },
    "1f504": {
        "id": "1f504",
        "name": "counterclockwise arrows button",
        "category": "symbols"
    },
    "1f503": {
        "id": "1f503",
        "name": "clockwise vertical arrows",
        "category": "symbols"
    },
    "1f3b5": {
        "id": "1f3b5",
        "name": "musical note",
        "category": "symbols"
    },
    "1f3b6": {
        "id": "1f3b6",
        "name": "musical notes",
        "category": "symbols"
    },
    "1f4b2": {
        "id": "1f4b2",
        "name": "heavy dollar sign",
        "category": "symbols"
    },
    "1f4b1": {
        "id": "1f4b1",
        "name": "currency exchange",
        "category": "symbols"
    },
    "00a9": {
        "id": "00a9",
        "name": "copyright",
        "category": "symbols"
    },
    "00ae": {
        "id": "00ae",
        "name": "registered",
        "category": "symbols"
    },
    "27b0": {
        "id": "27b0",
        "name": "curly loop",
        "category": "symbols"
    },
    "27bf": {
        "id": "27bf",
        "name": "double curly loop",
        "category": "symbols"
    },
    "1f51a": {
        "id": "1f51a",
        "name": "END arrow",
        "category": "symbols"
    },
    "1f519": {
        "id": "1f519",
        "name": "BACK arrow",
        "category": "symbols"
    },
    "1f51b": {
        "id": "1f51b",
        "name": "ON! arrow",
        "category": "symbols"
    },
    "1f51d": {
        "id": "1f51d",
        "name": "TOP arrow",
        "category": "symbols"
    },
    "1f51c": {
        "id": "1f51c",
        "name": "SOON arrow",
        "category": "symbols"
    },
    "1f518": {
        "id": "1f518",
        "name": "radio button",
        "category": "symbols"
    },
    "26aa": {
        "id": "26aa",
        "name": "white circle",
        "category": "symbols"
    },
    "26ab": {
        "id": "26ab",
        "name": "black circle",
        "category": "symbols"
    },
    "1f534": {
        "id": "1f534",
        "name": "red circle",
        "category": "symbols"
    },
    "1f535": {
        "id": "1f535",
        "name": "blue circle",
        "category": "symbols"
    },
    "1f53a": {
        "id": "1f53a",
        "name": "red triangle pointed up",
        "category": "symbols"
    },
    "1f53b": {
        "id": "1f53b",
        "name": "red triangle pointed down",
        "category": "symbols"
    },
    "1f538": {
        "id": "1f538",
        "name": "small orange diamond",
        "category": "symbols"
    },
    "1f539": {
        "id": "1f539",
        "name": "small blue diamond",
        "category": "symbols"
    },
    "1f536": {
        "id": "1f536",
        "name": "large orange diamond",
        "category": "symbols"
    },
    "1f537": {
        "id": "1f537",
        "name": "large blue diamond",
        "category": "symbols"
    },
    "1f533": {
        "id": "1f533",
        "name": "white square button",
        "category": "symbols"
    },
    "1f532": {
        "id": "1f532",
        "name": "black square button",
        "category": "symbols"
    },
    "25aa": {
        "id": "25aa",
        "name": "black small square",
        "category": "symbols"
    },
    "25ab": {
        "id": "25ab",
        "name": "white small square",
        "category": "symbols"
    },
    "25fe": {
        "id": "25fe",
        "name": "black medium-small square",
        "category": "symbols"
    },
    "25fd": {
        "id": "25fd",
        "name": "white medium-small square",
        "category": "symbols"
    },
    "25fc": {
        "id": "25fc",
        "name": "black medium square",
        "category": "symbols"
    },
    "25fb": {
        "id": "25fb",
        "name": "white medium square",
        "category": "symbols"
    },
    "2b1b": {
        "id": "2b1b",
        "name": "black large square",
        "category": "symbols"
    },
    "2b1c": {
        "id": "2b1c",
        "name": "white large square",
        "category": "symbols"
    },
    "1f508": {
        "id": "1f508",
        "name": "speaker low volume",
        "category": "symbols"
    },
    "1f507": {
        "id": "1f507",
        "name": "muted speaker",
        "category": "symbols"
    },
    "1f509": {
        "id": "1f509",
        "name": "speaker medium volume",
        "category": "symbols"
    },
    "1f50a": {
        "id": "1f50a",
        "name": "speaker high volume",
        "category": "symbols"
    },
    "1f514": {
        "id": "1f514",
        "name": "bell",
        "category": "symbols"
    },
    "1f515": {
        "id": "1f515",
        "name": "bell with slash",
        "category": "symbols"
    },
    "1f4e3": {
        "id": "1f4e3",
        "name": "megaphone",
        "category": "symbols"
    },
    "1f4e2": {
        "id": "1f4e2",
        "name": "loudspeaker",
        "category": "symbols"
    },
    "1f5e8": {
        "id": "1f5e8",
        "name": "left speech bubble",
        "category": "symbols"
    },
    "1f441-1f5e8": {
        "id": "1f441-1f5e8",
        "name": "eye in speech bubble",
        "category": "symbols"
    },
    "1f4ac": {
        "id": "1f4ac",
        "name": "speech balloon",
        "category": "symbols"
    },
    "1f4ad": {
        "id": "1f4ad",
        "name": "thought balloon",
        "category": "symbols"
    },
    "1f5ef": {
        "id": "1f5ef",
        "name": "right anger bubble",
        "category": "symbols"
    },
    "1f0cf": {
        "id": "1f0cf",
        "name": "joker",
        "category": "symbols"
    },
    "1f3b4": {
        "id": "1f3b4",
        "name": "flower playing cards",
        "category": "symbols"
    },
    "1f004": {
        "id": "1f004",
        "name": "mahjong red dragon",
        "category": "symbols"
    },
    "1f550": {
        "id": "1f550",
        "name": "one o’clock",
        "category": "symbols"
    },
    "1f551": {
        "id": "1f551",
        "name": "two o’clock",
        "category": "symbols"
    },
    "1f552": {
        "id": "1f552",
        "name": "three o’clock",
        "category": "symbols"
    },
    "1f553": {
        "id": "1f553",
        "name": "four o’clock",
        "category": "symbols"
    },
    "1f554": {
        "id": "1f554",
        "name": "five o’clock",
        "category": "symbols"
    },
    "1f555": {
        "id": "1f555",
        "name": "six o’clock",
        "category": "symbols"
    },
    "1f556": {
        "id": "1f556",
        "name": "seven o’clock",
        "category": "symbols"
    },
    "1f557": {
        "id": "1f557",
        "name": "eight o’clock",
        "category": "symbols"
    },
    "1f558": {
        "id": "1f558",
        "name": "nine o’clock",
        "category": "symbols"
    },
    "1f559": {
        "id": "1f559",
        "name": "ten o’clock",
        "category": "symbols"
    },
    "1f55a": {
        "id": "1f55a",
        "name": "eleven o’clock",
        "category": "symbols"
    },
    "1f55b": {
        "id": "1f55b",
        "name": "twelve o’clock",
        "category": "symbols"
    },
    "1f55c": {
        "id": "1f55c",
        "name": "one-thirty",
        "category": "symbols"
    },
    "1f55d": {
        "id": "1f55d",
        "name": "two-thirty",
        "category": "symbols"
    },
    "1f55e": {
        "id": "1f55e",
        "name": "three-thirty",
        "category": "symbols"
    },
    "1f55f": {
        "id": "1f55f",
        "name": "four-thirty",
        "category": "symbols"
    },
    "1f560": {
        "id": "1f560",
        "name": "five-thirty",
        "category": "symbols"
    },
    "1f561": {
        "id": "1f561",
        "name": "six-thirty",
        "category": "symbols"
    },
    "1f562": {
        "id": "1f562",
        "name": "seven-thirty",
        "category": "symbols"
    },
    "1f563": {
        "id": "1f563",
        "name": "eight-thirty",
        "category": "symbols"
    },
    "1f564": {
        "id": "1f564",
        "name": "nine-thirty",
        "category": "symbols"
    },
    "1f565": {
        "id": "1f565",
        "name": "ten-thirty",
        "category": "symbols"
    },
    "1f566": {
        "id": "1f566",
        "name": "eleven-thirty",
        "category": "symbols"
    },
    "1f567": {
        "id": "1f567",
        "name": "twelve-thirty",
        "category": "symbols"
    },
    "0030": {
        "id": "0030",
        "name": "digit zero",
        "category": "symbols"
    },
    "0031": {
        "id": "0031",
        "name": "digit one",
        "category": "symbols"
    },
    "0032": {
        "id": "0032",
        "name": "digit two",
        "category": "symbols"
    },
    "0033": {
        "id": "0033",
        "name": "digit three",
        "category": "symbols"
    },
    "0034": {
        "id": "0034",
        "name": "digit four",
        "category": "symbols"
    },
    "0035": {
        "id": "0035",
        "name": "digit five",
        "category": "symbols"
    },
    "0036": {
        "id": "0036",
        "name": "digit six",
        "category": "symbols"
    },
    "0037": {
        "id": "0037",
        "name": "digit seven",
        "category": "symbols"
    },
    "0038": {
        "id": "0038",
        "name": "digit eight",
        "category": "symbols"
    },
    "0039": {
        "id": "0039",
        "name": "digit nine",
        "category": "symbols"
    },
    "0023": {
        "id": "0023",
        "name": "pound symbol",
        "category": "symbols"
    },
    "002a": {
        "id": "002a",
        "name": "asterisk",
        "category": "symbols"
    },
    "26bd": {
        "id": "26bd",
        "name": "soccer ball",
        "category": "activity"
    },
    "1f3c0": {
        "id": "1f3c0",
        "name": "basketball",
        "category": "activity"
    },
    "1f3c8": {
        "id": "1f3c8",
        "name": "american football",
        "category": "activity"
    },
    "26be": {
        "id": "26be",
        "name": "baseball",
        "category": "activity"
    },
    "1f94e": {
        "id": "1f94e",
        "name": "softball",
        "category": "activity"
    },
    "1f3be": {
        "id": "1f3be",
        "name": "tennis",
        "category": "activity"
    },
    "1f3d0": {
        "id": "1f3d0",
        "name": "volleyball",
        "category": "activity"
    },
    "1f3c9": {
        "id": "1f3c9",
        "name": "rugby football",
        "category": "activity"
    },
    "1f3b1": {
        "id": "1f3b1",
        "name": "pool 8 ball",
        "category": "activity"
    },
    "1f3d3": {
        "id": "1f3d3",
        "name": "ping pong",
        "category": "activity"
    },
    "1f3f8": {
        "id": "1f3f8",
        "name": "badminton",
        "category": "activity"
    },
    "1f945": {
        "id": "1f945",
        "name": "goal net",
        "category": "activity"
    },
    "1f3d2": {
        "id": "1f3d2",
        "name": "ice hockey",
        "category": "activity"
    },
    "1f3d1": {
        "id": "1f3d1",
        "name": "field hockey",
        "category": "activity"
    },
    "1f3cf": {
        "id": "1f3cf",
        "name": "cricket game",
        "category": "activity"
    },
    "1f94d": {
        "id": "1f94d",
        "name": "lacrosse",
        "category": "activity"
    },
    "26f3": {
        "id": "26f3",
        "name": "flag in hole",
        "category": "activity"
    },
    "1f94f": {
        "id": "1f94f",
        "name": "flying disc",
        "category": "activity"
    },
    "1f3f9": {
        "id": "1f3f9",
        "name": "bow and arrow",
        "category": "activity"
    },
    "1f3a3": {
        "id": "1f3a3",
        "name": "fishing pole",
        "category": "activity"
    },
    "1f94a": {
        "id": "1f94a",
        "name": "boxing glove",
        "category": "activity"
    },
    "1f94b": {
        "id": "1f94b",
        "name": "martial arts uniform",
        "category": "activity"
    },
    "1f3bd": {
        "id": "1f3bd",
        "name": "running shirt",
        "category": "activity"
    },
    "1f6f9": {
        "id": "1f6f9",
        "name": "skateboard",
        "category": "activity"
    },
    "26f8": {
        "id": "26f8",
        "name": "ice skate",
        "category": "activity"
    },
    "1f94c": {
        "id": "1f94c",
        "name": "curling stone",
        "category": "activity"
    },
    "1f6f7": {
        "id": "1f6f7",
        "name": "sled",
        "category": "activity"
    },
    "1f3bf": {
        "id": "1f3bf",
        "name": "skis",
        "category": "activity"
    },
    "26f7": {
        "id": "26f7",
        "name": "skier",
        "category": "activity"
    },
    "1f3c2": {
        "id": "1f3c2",
        "name": "snowboarder",
        "category": "activity",
        "diversities": [
            "1f3c2-1f3fb",
            "1f3c2-1f3fc",
            "1f3c2-1f3fd",
            "1f3c2-1f3fe",
            "1f3c2-1f3ff"
        ]
    },
    "1f3c2-1f3fb": {
        "id": "1f3c2-1f3fb",
        "name": "snowboarder: light skin tone",
        "category": "activity",
        "diversity": "1f3fb"
    },
    "1f3c2-1f3fc": {
        "id": "1f3c2-1f3fc",
        "name": "snowboarder: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc"
    },
    "1f3c2-1f3fd": {
        "id": "1f3c2-1f3fd",
        "name": "snowboarder: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd"
    },
    "1f3c2-1f3fe": {
        "id": "1f3c2-1f3fe",
        "name": "snowboarder: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe"
    },
    "1f3c2-1f3ff": {
        "id": "1f3c2-1f3ff",
        "name": "snowboarder: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff"
    },
    "1f3cb": {
        "id": "1f3cb",
        "name": "person lifting weights",
        "category": "activity",
        "diversities": [
            "1f3cb-1f3fb",
            "1f3cb-1f3fc",
            "1f3cb-1f3fd",
            "1f3cb-1f3fe",
            "1f3cb-1f3ff"
        ],
        "genders": [
            "1f3cb-2642",
            "1f3cb-2640"
        ]
    },
    "1f3cb-1f3fb": {
        "id": "1f3cb-1f3fb",
        "name": "person lifting weights: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f3cb-1f3fb-2642",
            "1f3cb-1f3fb-2640"
        ]
    },
    "1f3cb-1f3fc": {
        "id": "1f3cb-1f3fc",
        "name": "person lifting weights: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f3cb-1f3fc-2642",
            "1f3cb-1f3fc-2640"
        ]
    },
    "1f3cb-1f3fd": {
        "id": "1f3cb-1f3fd",
        "name": "person lifting weights: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f3cb-1f3fd-2642",
            "1f3cb-1f3fd-2640"
        ]
    },
    "1f3cb-1f3fe": {
        "id": "1f3cb-1f3fe",
        "name": "person lifting weights: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f3cb-1f3fe-2642",
            "1f3cb-1f3fe-2640"
        ]
    },
    "1f3cb-1f3ff": {
        "id": "1f3cb-1f3ff",
        "name": "person lifting weights: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f3cb-1f3ff-2642",
            "1f3cb-1f3ff-2640"
        ]
    },
    "1f3cb-2640": {
        "id": "1f3cb-2640",
        "name": "woman lifting weights",
        "category": "activity",
        "diversities": [
            "1f3cb-1f3fb-2640",
            "1f3cb-1f3fc-2640",
            "1f3cb-1f3fd-2640",
            "1f3cb-1f3fe-2640",
            "1f3cb-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f3cb-1f3fb-2640": {
        "id": "1f3cb-1f3fb-2640",
        "name": "woman lifting weights: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f3cb-1f3fc-2640": {
        "id": "1f3cb-1f3fc-2640",
        "name": "woman lifting weights: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f3cb-1f3fd-2640": {
        "id": "1f3cb-1f3fd-2640",
        "name": "woman lifting weights: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f3cb-1f3fe-2640": {
        "id": "1f3cb-1f3fe-2640",
        "name": "woman lifting weights: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f3cb-1f3ff-2640": {
        "id": "1f3cb-1f3ff-2640",
        "name": "woman lifting weights: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f3cb-2642": {
        "id": "1f3cb-2642",
        "name": "man lifting weights",
        "category": "activity",
        "diversities": [
            "1f3cb-1f3fb-2642",
            "1f3cb-1f3fc-2642",
            "1f3cb-1f3fd-2642",
            "1f3cb-1f3fe-2642",
            "1f3cb-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f3cb-1f3fb-2642": {
        "id": "1f3cb-1f3fb-2642",
        "name": "man lifting weights: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f3cb-1f3fc-2642": {
        "id": "1f3cb-1f3fc-2642",
        "name": "man lifting weights: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f3cb-1f3fd-2642": {
        "id": "1f3cb-1f3fd-2642",
        "name": "man lifting weights: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f3cb-1f3fe-2642": {
        "id": "1f3cb-1f3fe-2642",
        "name": "man lifting weights: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f3cb-1f3ff-2642": {
        "id": "1f3cb-1f3ff-2642",
        "name": "man lifting weights: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f93c": {
        "id": "1f93c",
        "name": "people wrestling",
        "category": "activity",
        "genders": [
            "1f93c-2642",
            "1f93c-2640"
        ]
    },
    "1f93c-2640": {
        "id": "1f93c-2640",
        "name": "women wrestling",
        "category": "activity",
        "gender": "2640"
    },
    "1f93c-2642": {
        "id": "1f93c-2642",
        "name": "men wrestling",
        "category": "activity",
        "gender": "2642"
    },
    "1f938": {
        "id": "1f938",
        "name": "person cartwheeling",
        "category": "activity",
        "diversities": [
            "1f938-1f3fb",
            "1f938-1f3fc",
            "1f938-1f3fd",
            "1f938-1f3fe",
            "1f938-1f3ff"
        ],
        "genders": [
            "1f938-2642",
            "1f938-2640"
        ]
    },
    "1f938-1f3fb": {
        "id": "1f938-1f3fb",
        "name": "person cartwheeling: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f938-1f3fb-2642",
            "1f938-1f3fb-2640"
        ]
    },
    "1f938-1f3fc": {
        "id": "1f938-1f3fc",
        "name": "person cartwheeling: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f938-1f3fc-2642",
            "1f938-1f3fc-2640"
        ]
    },
    "1f938-1f3fd": {
        "id": "1f938-1f3fd",
        "name": "person cartwheeling: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f938-1f3fd-2642",
            "1f938-1f3fd-2640"
        ]
    },
    "1f938-1f3fe": {
        "id": "1f938-1f3fe",
        "name": "person cartwheeling: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f938-1f3fe-2642",
            "1f938-1f3fe-2640"
        ]
    },
    "1f938-1f3ff": {
        "id": "1f938-1f3ff",
        "name": "person cartwheeling: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f938-1f3ff-2642",
            "1f938-1f3ff-2640"
        ]
    },
    "1f938-2640": {
        "id": "1f938-2640",
        "name": "woman cartwheeling",
        "category": "activity",
        "diversities": [
            "1f938-1f3fb-2640",
            "1f938-1f3fc-2640",
            "1f938-1f3fd-2640",
            "1f938-1f3fe-2640",
            "1f938-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f938-1f3fb-2640": {
        "id": "1f938-1f3fb-2640",
        "name": "woman cartwheeling: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f938-1f3fc-2640": {
        "id": "1f938-1f3fc-2640",
        "name": "woman cartwheeling: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f938-1f3fd-2640": {
        "id": "1f938-1f3fd-2640",
        "name": "woman cartwheeling: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f938-1f3fe-2640": {
        "id": "1f938-1f3fe-2640",
        "name": "woman cartwheeling: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f938-1f3ff-2640": {
        "id": "1f938-1f3ff-2640",
        "name": "woman cartwheeling: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f938-2642": {
        "id": "1f938-2642",
        "name": "man cartwheeling",
        "category": "activity",
        "diversities": [
            "1f938-1f3fb-2642",
            "1f938-1f3fc-2642",
            "1f938-1f3fd-2642",
            "1f938-1f3fe-2642",
            "1f938-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f938-1f3fb-2642": {
        "id": "1f938-1f3fb-2642",
        "name": "man cartwheeling: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f938-1f3fc-2642": {
        "id": "1f938-1f3fc-2642",
        "name": "man cartwheeling: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f938-1f3fd-2642": {
        "id": "1f938-1f3fd-2642",
        "name": "man cartwheeling: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f938-1f3fe-2642": {
        "id": "1f938-1f3fe-2642",
        "name": "man cartwheeling: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f938-1f3ff-2642": {
        "id": "1f938-1f3ff-2642",
        "name": "man cartwheeling: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "26f9": {
        "id": "26f9",
        "name": "person bouncing ball",
        "category": "activity",
        "diversities": [
            "26f9-1f3fb",
            "26f9-1f3fc",
            "26f9-1f3fd",
            "26f9-1f3fe",
            "26f9-1f3ff"
        ],
        "genders": [
            "26f9-2642",
            "26f9-2640"
        ]
    },
    "26f9-1f3fb": {
        "id": "26f9-1f3fb",
        "name": "person bouncing ball: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "26f9-1f3fb-2642",
            "26f9-1f3fb-2640"
        ]
    },
    "26f9-1f3fc": {
        "id": "26f9-1f3fc",
        "name": "person bouncing ball: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "26f9-1f3fc-2642",
            "26f9-1f3fc-2640"
        ]
    },
    "26f9-1f3fd": {
        "id": "26f9-1f3fd",
        "name": "person bouncing ball: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "26f9-1f3fd-2642",
            "26f9-1f3fd-2640"
        ]
    },
    "26f9-1f3fe": {
        "id": "26f9-1f3fe",
        "name": "person bouncing ball: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "26f9-1f3fe-2642",
            "26f9-1f3fe-2640"
        ]
    },
    "26f9-1f3ff": {
        "id": "26f9-1f3ff",
        "name": "person bouncing ball: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "26f9-1f3ff-2642",
            "26f9-1f3ff-2640"
        ]
    },
    "26f9-2640": {
        "id": "26f9-2640",
        "name": "woman bouncing ball",
        "category": "activity",
        "diversities": [
            "26f9-1f3fb-2640",
            "26f9-1f3fc-2640",
            "26f9-1f3fd-2640",
            "26f9-1f3fe-2640",
            "26f9-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "26f9-1f3fb-2640": {
        "id": "26f9-1f3fb-2640",
        "name": "woman bouncing ball: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "26f9-1f3fc-2640": {
        "id": "26f9-1f3fc-2640",
        "name": "woman bouncing ball: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "26f9-1f3fd-2640": {
        "id": "26f9-1f3fd-2640",
        "name": "woman bouncing ball: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "26f9-1f3fe-2640": {
        "id": "26f9-1f3fe-2640",
        "name": "woman bouncing ball: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "26f9-1f3ff-2640": {
        "id": "26f9-1f3ff-2640",
        "name": "woman bouncing ball: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "26f9-2642": {
        "id": "26f9-2642",
        "name": "man bouncing ball",
        "category": "activity",
        "diversities": [
            "26f9-1f3fb-2642",
            "26f9-1f3fc-2642",
            "26f9-1f3fd-2642",
            "26f9-1f3fe-2642",
            "26f9-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "26f9-1f3fb-2642": {
        "id": "26f9-1f3fb-2642",
        "name": "man bouncing ball: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "26f9-1f3fc-2642": {
        "id": "26f9-1f3fc-2642",
        "name": "man bouncing ball: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "26f9-1f3fd-2642": {
        "id": "26f9-1f3fd-2642",
        "name": "man bouncing ball: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "26f9-1f3fe-2642": {
        "id": "26f9-1f3fe-2642",
        "name": "man bouncing ball: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "26f9-1f3ff-2642": {
        "id": "26f9-1f3ff-2642",
        "name": "man bouncing ball: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f93a": {
        "id": "1f93a",
        "name": "person fencing",
        "category": "activity"
    },
    "1f93e": {
        "id": "1f93e",
        "name": "person playing handball",
        "category": "activity",
        "diversities": [
            "1f93e-1f3fb",
            "1f93e-1f3fc",
            "1f93e-1f3fd",
            "1f93e-1f3fe",
            "1f93e-1f3ff"
        ],
        "genders": [
            "1f93e-2642",
            "1f93e-2640"
        ]
    },
    "1f93e-1f3fb": {
        "id": "1f93e-1f3fb",
        "name": "person playing handball: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f93e-1f3fb-2642",
            "1f93e-1f3fb-2640"
        ]
    },
    "1f93e-1f3fc": {
        "id": "1f93e-1f3fc",
        "name": "person playing handball: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f93e-1f3fc-2642",
            "1f93e-1f3fc-2640"
        ]
    },
    "1f93e-1f3fd": {
        "id": "1f93e-1f3fd",
        "name": "person playing handball: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f93e-1f3fd-2642",
            "1f93e-1f3fd-2640"
        ]
    },
    "1f93e-1f3fe": {
        "id": "1f93e-1f3fe",
        "name": "person playing handball: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f93e-1f3fe-2642",
            "1f93e-1f3fe-2640"
        ]
    },
    "1f93e-1f3ff": {
        "id": "1f93e-1f3ff",
        "name": "person playing handball: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f93e-1f3ff-2642",
            "1f93e-1f3ff-2640"
        ]
    },
    "1f93e-2640": {
        "id": "1f93e-2640",
        "name": "woman playing handball",
        "category": "activity",
        "diversities": [
            "1f93e-1f3fb-2640",
            "1f93e-1f3fc-2640",
            "1f93e-1f3fd-2640",
            "1f93e-1f3fe-2640",
            "1f93e-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f93e-1f3fb-2640": {
        "id": "1f93e-1f3fb-2640",
        "name": "woman playing handball: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f93e-1f3fc-2640": {
        "id": "1f93e-1f3fc-2640",
        "name": "woman playing handball: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f93e-1f3fd-2640": {
        "id": "1f93e-1f3fd-2640",
        "name": "woman playing handball: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f93e-1f3fe-2640": {
        "id": "1f93e-1f3fe-2640",
        "name": "woman playing handball: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f93e-1f3ff-2640": {
        "id": "1f93e-1f3ff-2640",
        "name": "woman playing handball: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f93e-2642": {
        "id": "1f93e-2642",
        "name": "man playing handball",
        "category": "activity",
        "diversities": [
            "1f93e-1f3fb-2642",
            "1f93e-1f3fc-2642",
            "1f93e-1f3fd-2642",
            "1f93e-1f3fe-2642",
            "1f93e-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f93e-1f3fb-2642": {
        "id": "1f93e-1f3fb-2642",
        "name": "man playing handball: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f93e-1f3fc-2642": {
        "id": "1f93e-1f3fc-2642",
        "name": "man playing handball: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f93e-1f3fd-2642": {
        "id": "1f93e-1f3fd-2642",
        "name": "man playing handball: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f93e-1f3fe-2642": {
        "id": "1f93e-1f3fe-2642",
        "name": "man playing handball: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f93e-1f3ff-2642": {
        "id": "1f93e-1f3ff-2642",
        "name": "man playing handball: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f3cc": {
        "id": "1f3cc",
        "name": "person golfing",
        "category": "activity",
        "diversities": [
            "1f3cc-1f3fb",
            "1f3cc-1f3fc",
            "1f3cc-1f3fd",
            "1f3cc-1f3fe",
            "1f3cc-1f3ff"
        ],
        "genders": [
            "1f3cc-2642",
            "1f3cc-2640"
        ]
    },
    "1f3cc-1f3fb": {
        "id": "1f3cc-1f3fb",
        "name": "person golfing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f3cc-1f3fb-2642",
            "1f3cc-1f3fb-2640"
        ]
    },
    "1f3cc-1f3fc": {
        "id": "1f3cc-1f3fc",
        "name": "person golfing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f3cc-1f3fc-2642",
            "1f3cc-1f3fc-2640"
        ]
    },
    "1f3cc-1f3fd": {
        "id": "1f3cc-1f3fd",
        "name": "person golfing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f3cc-1f3fd-2642",
            "1f3cc-1f3fd-2640"
        ]
    },
    "1f3cc-1f3fe": {
        "id": "1f3cc-1f3fe",
        "name": "person golfing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f3cc-1f3fe-2642",
            "1f3cc-1f3fe-2640"
        ]
    },
    "1f3cc-1f3ff": {
        "id": "1f3cc-1f3ff",
        "name": "person golfing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f3cc-1f3ff-2642",
            "1f3cc-1f3ff-2640"
        ]
    },
    "1f3cc-2640": {
        "id": "1f3cc-2640",
        "name": "woman golfing",
        "category": "activity",
        "diversities": [
            "1f3cc-1f3fb-2640",
            "1f3cc-1f3fc-2640",
            "1f3cc-1f3fd-2640",
            "1f3cc-1f3fe-2640",
            "1f3cc-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f3cc-1f3fb-2640": {
        "id": "1f3cc-1f3fb-2640",
        "name": "woman golfing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f3cc-1f3fc-2640": {
        "id": "1f3cc-1f3fc-2640",
        "name": "woman golfing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f3cc-1f3fd-2640": {
        "id": "1f3cc-1f3fd-2640",
        "name": "woman golfing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f3cc-1f3fe-2640": {
        "id": "1f3cc-1f3fe-2640",
        "name": "woman golfing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f3cc-1f3ff-2640": {
        "id": "1f3cc-1f3ff-2640",
        "name": "woman golfing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f3cc-2642": {
        "id": "1f3cc-2642",
        "name": "man golfing",
        "category": "activity",
        "diversities": [
            "1f3cc-1f3fb-2642",
            "1f3cc-1f3fc-2642",
            "1f3cc-1f3fd-2642",
            "1f3cc-1f3fe-2642",
            "1f3cc-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f3cc-1f3fb-2642": {
        "id": "1f3cc-1f3fb-2642",
        "name": "man golfing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f3cc-1f3fc-2642": {
        "id": "1f3cc-1f3fc-2642",
        "name": "man golfing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f3cc-1f3fd-2642": {
        "id": "1f3cc-1f3fd-2642",
        "name": "man golfing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f3cc-1f3fe-2642": {
        "id": "1f3cc-1f3fe-2642",
        "name": "man golfing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f3cc-1f3ff-2642": {
        "id": "1f3cc-1f3ff-2642",
        "name": "man golfing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f3c7": {
        "id": "1f3c7",
        "name": "horse racing",
        "category": "activity",
        "diversities": [
            "1f3c7-1f3fb",
            "1f3c7-1f3fc",
            "1f3c7-1f3fd",
            "1f3c7-1f3fe",
            "1f3c7-1f3ff"
        ]
    },
    "1f3c7-1f3fb": {
        "id": "1f3c7-1f3fb",
        "name": "horse racing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb"
    },
    "1f3c7-1f3fc": {
        "id": "1f3c7-1f3fc",
        "name": "horse racing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc"
    },
    "1f3c7-1f3fd": {
        "id": "1f3c7-1f3fd",
        "name": "horse racing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd"
    },
    "1f3c7-1f3fe": {
        "id": "1f3c7-1f3fe",
        "name": "horse racing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe"
    },
    "1f3c7-1f3ff": {
        "id": "1f3c7-1f3ff",
        "name": "horse racing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff"
    },
    "1f9d8": {
        "id": "1f9d8",
        "name": "person in lotus position",
        "category": "activity",
        "diversities": [
            "1f9d8-1f3fb",
            "1f9d8-1f3fc",
            "1f9d8-1f3fd",
            "1f9d8-1f3fe",
            "1f9d8-1f3ff"
        ],
        "genders": [
            "1f9d8-2642",
            "1f9d8-2640"
        ]
    },
    "1f9d8-1f3fb": {
        "id": "1f9d8-1f3fb",
        "name": "person in lotus position: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f9d8-1f3fb-2642",
            "1f9d8-1f3fb-2640"
        ]
    },
    "1f9d8-1f3fc": {
        "id": "1f9d8-1f3fc",
        "name": "person in lotus position: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f9d8-1f3fc-2642",
            "1f9d8-1f3fc-2640"
        ]
    },
    "1f9d8-1f3fd": {
        "id": "1f9d8-1f3fd",
        "name": "person in lotus position: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f9d8-1f3fd-2642",
            "1f9d8-1f3fd-2640"
        ]
    },
    "1f9d8-1f3fe": {
        "id": "1f9d8-1f3fe",
        "name": "person in lotus position: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f9d8-1f3fe-2642",
            "1f9d8-1f3fe-2640"
        ]
    },
    "1f9d8-1f3ff": {
        "id": "1f9d8-1f3ff",
        "name": "person in lotus position: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f9d8-1f3ff-2642",
            "1f9d8-1f3ff-2640"
        ]
    },
    "1f9d8-2640": {
        "id": "1f9d8-2640",
        "name": "woman in lotus position",
        "category": "activity",
        "diversities": [
            "1f9d8-1f3fb-2640",
            "1f9d8-1f3fc-2640",
            "1f9d8-1f3fd-2640",
            "1f9d8-1f3fe-2640",
            "1f9d8-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9d8-1f3fb-2640": {
        "id": "1f9d8-1f3fb-2640",
        "name": "woman in lotus position: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9d8-1f3fc-2640": {
        "id": "1f9d8-1f3fc-2640",
        "name": "woman in lotus position: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9d8-1f3fd-2640": {
        "id": "1f9d8-1f3fd-2640",
        "name": "woman in lotus position: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9d8-1f3fe-2640": {
        "id": "1f9d8-1f3fe-2640",
        "name": "woman in lotus position: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9d8-1f3ff-2640": {
        "id": "1f9d8-1f3ff-2640",
        "name": "woman in lotus position: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9d8-2642": {
        "id": "1f9d8-2642",
        "name": "man in lotus position",
        "category": "activity",
        "diversities": [
            "1f9d8-1f3fb-2642",
            "1f9d8-1f3fc-2642",
            "1f9d8-1f3fd-2642",
            "1f9d8-1f3fe-2642",
            "1f9d8-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9d8-1f3fb-2642": {
        "id": "1f9d8-1f3fb-2642",
        "name": "man in lotus position: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9d8-1f3fc-2642": {
        "id": "1f9d8-1f3fc-2642",
        "name": "man in lotus position: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9d8-1f3fd-2642": {
        "id": "1f9d8-1f3fd-2642",
        "name": "man in lotus position: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9d8-1f3fe-2642": {
        "id": "1f9d8-1f3fe-2642",
        "name": "man in lotus position: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9d8-1f3ff-2642": {
        "id": "1f9d8-1f3ff-2642",
        "name": "man in lotus position: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f3c4": {
        "id": "1f3c4",
        "name": "person surfing",
        "category": "activity",
        "diversities": [
            "1f3c4-1f3fb",
            "1f3c4-1f3fc",
            "1f3c4-1f3fd",
            "1f3c4-1f3fe",
            "1f3c4-1f3ff"
        ],
        "genders": [
            "1f3c4-2642",
            "1f3c4-2640"
        ]
    },
    "1f3c4-1f3fb": {
        "id": "1f3c4-1f3fb",
        "name": "person surfing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f3c4-1f3fb-2642",
            "1f3c4-1f3fb-2640"
        ]
    },
    "1f3c4-1f3fc": {
        "id": "1f3c4-1f3fc",
        "name": "person surfing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f3c4-1f3fc-2642",
            "1f3c4-1f3fc-2640"
        ]
    },
    "1f3c4-1f3fd": {
        "id": "1f3c4-1f3fd",
        "name": "person surfing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f3c4-1f3fd-2642",
            "1f3c4-1f3fd-2640"
        ]
    },
    "1f3c4-1f3fe": {
        "id": "1f3c4-1f3fe",
        "name": "person surfing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f3c4-1f3fe-2642",
            "1f3c4-1f3fe-2640"
        ]
    },
    "1f3c4-1f3ff": {
        "id": "1f3c4-1f3ff",
        "name": "person surfing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f3c4-1f3ff-2642",
            "1f3c4-1f3ff-2640"
        ]
    },
    "1f3c4-2640": {
        "id": "1f3c4-2640",
        "name": "woman surfing",
        "category": "activity",
        "diversities": [
            "1f3c4-1f3fb-2640",
            "1f3c4-1f3fc-2640",
            "1f3c4-1f3fd-2640",
            "1f3c4-1f3fe-2640",
            "1f3c4-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f3c4-1f3fb-2640": {
        "id": "1f3c4-1f3fb-2640",
        "name": "woman surfing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f3c4-1f3fc-2640": {
        "id": "1f3c4-1f3fc-2640",
        "name": "woman surfing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f3c4-1f3fd-2640": {
        "id": "1f3c4-1f3fd-2640",
        "name": "woman surfing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f3c4-1f3fe-2640": {
        "id": "1f3c4-1f3fe-2640",
        "name": "woman surfing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f3c4-1f3ff-2640": {
        "id": "1f3c4-1f3ff-2640",
        "name": "woman surfing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f3c4-2642": {
        "id": "1f3c4-2642",
        "name": "man surfing",
        "category": "activity",
        "diversities": [
            "1f3c4-1f3fb-2642",
            "1f3c4-1f3fc-2642",
            "1f3c4-1f3fd-2642",
            "1f3c4-1f3fe-2642",
            "1f3c4-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f3c4-1f3fb-2642": {
        "id": "1f3c4-1f3fb-2642",
        "name": "man surfing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f3c4-1f3fc-2642": {
        "id": "1f3c4-1f3fc-2642",
        "name": "man surfing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f3c4-1f3fd-2642": {
        "id": "1f3c4-1f3fd-2642",
        "name": "man surfing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f3c4-1f3fe-2642": {
        "id": "1f3c4-1f3fe-2642",
        "name": "man surfing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f3c4-1f3ff-2642": {
        "id": "1f3c4-1f3ff-2642",
        "name": "man surfing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f3ca": {
        "id": "1f3ca",
        "name": "person swimming",
        "category": "activity",
        "diversities": [
            "1f3ca-1f3fb",
            "1f3ca-1f3fc",
            "1f3ca-1f3fd",
            "1f3ca-1f3fe",
            "1f3ca-1f3ff"
        ],
        "genders": [
            "1f3ca-2642",
            "1f3ca-2640"
        ]
    },
    "1f3ca-1f3fb": {
        "id": "1f3ca-1f3fb",
        "name": "person swimming: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f3ca-1f3fb-2642",
            "1f3ca-1f3fb-2640"
        ]
    },
    "1f3ca-1f3fc": {
        "id": "1f3ca-1f3fc",
        "name": "person swimming: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f3ca-1f3fc-2642",
            "1f3ca-1f3fc-2640"
        ]
    },
    "1f3ca-1f3fd": {
        "id": "1f3ca-1f3fd",
        "name": "person swimming: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f3ca-1f3fd-2642",
            "1f3ca-1f3fd-2640"
        ]
    },
    "1f3ca-1f3fe": {
        "id": "1f3ca-1f3fe",
        "name": "person swimming: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f3ca-1f3fe-2642",
            "1f3ca-1f3fe-2640"
        ]
    },
    "1f3ca-1f3ff": {
        "id": "1f3ca-1f3ff",
        "name": "person swimming: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f3ca-1f3ff-2642",
            "1f3ca-1f3ff-2640"
        ]
    },
    "1f3ca-2640": {
        "id": "1f3ca-2640",
        "name": "woman swimming",
        "category": "activity",
        "diversities": [
            "1f3ca-1f3fb-2640",
            "1f3ca-1f3fc-2640",
            "1f3ca-1f3fd-2640",
            "1f3ca-1f3fe-2640",
            "1f3ca-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f3ca-1f3fb-2640": {
        "id": "1f3ca-1f3fb-2640",
        "name": "woman swimming: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f3ca-1f3fc-2640": {
        "id": "1f3ca-1f3fc-2640",
        "name": "woman swimming: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f3ca-1f3fd-2640": {
        "id": "1f3ca-1f3fd-2640",
        "name": "woman swimming: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f3ca-1f3fe-2640": {
        "id": "1f3ca-1f3fe-2640",
        "name": "woman swimming: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f3ca-1f3ff-2640": {
        "id": "1f3ca-1f3ff-2640",
        "name": "woman swimming: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f3ca-2642": {
        "id": "1f3ca-2642",
        "name": "man swimming",
        "category": "activity",
        "diversities": [
            "1f3ca-1f3fb-2642",
            "1f3ca-1f3fc-2642",
            "1f3ca-1f3fd-2642",
            "1f3ca-1f3fe-2642",
            "1f3ca-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f3ca-1f3fb-2642": {
        "id": "1f3ca-1f3fb-2642",
        "name": "man swimming: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f3ca-1f3fc-2642": {
        "id": "1f3ca-1f3fc-2642",
        "name": "man swimming: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f3ca-1f3fd-2642": {
        "id": "1f3ca-1f3fd-2642",
        "name": "man swimming: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f3ca-1f3fe-2642": {
        "id": "1f3ca-1f3fe-2642",
        "name": "man swimming: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f3ca-1f3ff-2642": {
        "id": "1f3ca-1f3ff-2642",
        "name": "man swimming: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f93d": {
        "id": "1f93d",
        "name": "person playing water polo",
        "category": "activity",
        "diversities": [
            "1f93d-1f3fb",
            "1f93d-1f3fc",
            "1f93d-1f3fd",
            "1f93d-1f3fe",
            "1f93d-1f3ff"
        ],
        "genders": [
            "1f93d-2642",
            "1f93d-2640"
        ]
    },
    "1f93d-1f3fb": {
        "id": "1f93d-1f3fb",
        "name": "person playing water polo: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f93d-1f3fb-2642",
            "1f93d-1f3fb-2640"
        ]
    },
    "1f93d-1f3fc": {
        "id": "1f93d-1f3fc",
        "name": "person playing water polo: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f93d-1f3fc-2642",
            "1f93d-1f3fc-2640"
        ]
    },
    "1f93d-1f3fd": {
        "id": "1f93d-1f3fd",
        "name": "person playing water polo: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f93d-1f3fd-2642",
            "1f93d-1f3fd-2640"
        ]
    },
    "1f93d-1f3fe": {
        "id": "1f93d-1f3fe",
        "name": "person playing water polo: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f93d-1f3fe-2642",
            "1f93d-1f3fe-2640"
        ]
    },
    "1f93d-1f3ff": {
        "id": "1f93d-1f3ff",
        "name": "person playing water polo: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f93d-1f3ff-2642",
            "1f93d-1f3ff-2640"
        ]
    },
    "1f93d-2640": {
        "id": "1f93d-2640",
        "name": "woman playing water polo",
        "category": "activity",
        "diversities": [
            "1f93d-1f3fb-2640",
            "1f93d-1f3fc-2640",
            "1f93d-1f3fd-2640",
            "1f93d-1f3fe-2640",
            "1f93d-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f93d-1f3fb-2640": {
        "id": "1f93d-1f3fb-2640",
        "name": "woman playing water polo: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f93d-1f3fc-2640": {
        "id": "1f93d-1f3fc-2640",
        "name": "woman playing water polo: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f93d-1f3fd-2640": {
        "id": "1f93d-1f3fd-2640",
        "name": "woman playing water polo: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f93d-1f3fe-2640": {
        "id": "1f93d-1f3fe-2640",
        "name": "woman playing water polo: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f93d-1f3ff-2640": {
        "id": "1f93d-1f3ff-2640",
        "name": "woman playing water polo: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f93d-2642": {
        "id": "1f93d-2642",
        "name": "man playing water polo",
        "category": "activity",
        "diversities": [
            "1f93d-1f3fb-2642",
            "1f93d-1f3fc-2642",
            "1f93d-1f3fd-2642",
            "1f93d-1f3fe-2642",
            "1f93d-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f93d-1f3fb-2642": {
        "id": "1f93d-1f3fb-2642",
        "name": "man playing water polo: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f93d-1f3fc-2642": {
        "id": "1f93d-1f3fc-2642",
        "name": "man playing water polo: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f93d-1f3fd-2642": {
        "id": "1f93d-1f3fd-2642",
        "name": "man playing water polo: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f93d-1f3fe-2642": {
        "id": "1f93d-1f3fe-2642",
        "name": "man playing water polo: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f93d-1f3ff-2642": {
        "id": "1f93d-1f3ff-2642",
        "name": "man playing water polo: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f6a3": {
        "id": "1f6a3",
        "name": "person rowing boat",
        "category": "activity",
        "diversities": [
            "1f6a3-1f3fb",
            "1f6a3-1f3fc",
            "1f6a3-1f3fd",
            "1f6a3-1f3fe",
            "1f6a3-1f3ff"
        ],
        "genders": [
            "1f6a3-2642",
            "1f6a3-2640"
        ]
    },
    "1f6a3-1f3fb": {
        "id": "1f6a3-1f3fb",
        "name": "person rowing boat: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f6a3-1f3fb-2642",
            "1f6a3-1f3fb-2640"
        ]
    },
    "1f6a3-1f3fc": {
        "id": "1f6a3-1f3fc",
        "name": "person rowing boat: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f6a3-1f3fc-2642",
            "1f6a3-1f3fc-2640"
        ]
    },
    "1f6a3-1f3fd": {
        "id": "1f6a3-1f3fd",
        "name": "person rowing boat: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f6a3-1f3fd-2642",
            "1f6a3-1f3fd-2640"
        ]
    },
    "1f6a3-1f3fe": {
        "id": "1f6a3-1f3fe",
        "name": "person rowing boat: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f6a3-1f3fe-2642",
            "1f6a3-1f3fe-2640"
        ]
    },
    "1f6a3-1f3ff": {
        "id": "1f6a3-1f3ff",
        "name": "person rowing boat: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f6a3-1f3ff-2642",
            "1f6a3-1f3ff-2640"
        ]
    },
    "1f6a3-2640": {
        "id": "1f6a3-2640",
        "name": "woman rowing boat",
        "category": "activity",
        "diversities": [
            "1f6a3-1f3fb-2640",
            "1f6a3-1f3fc-2640",
            "1f6a3-1f3fd-2640",
            "1f6a3-1f3fe-2640",
            "1f6a3-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f6a3-1f3fb-2640": {
        "id": "1f6a3-1f3fb-2640",
        "name": "woman rowing boat: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f6a3-1f3fc-2640": {
        "id": "1f6a3-1f3fc-2640",
        "name": "woman rowing boat: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f6a3-1f3fd-2640": {
        "id": "1f6a3-1f3fd-2640",
        "name": "woman rowing boat: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f6a3-1f3fe-2640": {
        "id": "1f6a3-1f3fe-2640",
        "name": "woman rowing boat: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f6a3-1f3ff-2640": {
        "id": "1f6a3-1f3ff-2640",
        "name": "woman rowing boat: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f6a3-2642": {
        "id": "1f6a3-2642",
        "name": "man rowing boat",
        "category": "activity",
        "diversities": [
            "1f6a3-1f3fb-2642",
            "1f6a3-1f3fc-2642",
            "1f6a3-1f3fd-2642",
            "1f6a3-1f3fe-2642",
            "1f6a3-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f6a3-1f3fb-2642": {
        "id": "1f6a3-1f3fb-2642",
        "name": "man rowing boat: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f6a3-1f3fc-2642": {
        "id": "1f6a3-1f3fc-2642",
        "name": "man rowing boat: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f6a3-1f3fd-2642": {
        "id": "1f6a3-1f3fd-2642",
        "name": "man rowing boat: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f6a3-1f3fe-2642": {
        "id": "1f6a3-1f3fe-2642",
        "name": "man rowing boat: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f6a3-1f3ff-2642": {
        "id": "1f6a3-1f3ff-2642",
        "name": "man rowing boat: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9d7": {
        "id": "1f9d7",
        "name": "person climbing",
        "category": "activity",
        "diversities": [
            "1f9d7-1f3fb",
            "1f9d7-1f3fc",
            "1f9d7-1f3fd",
            "1f9d7-1f3fe",
            "1f9d7-1f3ff"
        ],
        "genders": [
            "1f9d7-2642",
            "1f9d7-2640"
        ]
    },
    "1f9d7-1f3fb": {
        "id": "1f9d7-1f3fb",
        "name": "person climbing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f9d7-1f3fb-2642",
            "1f9d7-1f3fb-2640"
        ]
    },
    "1f9d7-1f3fc": {
        "id": "1f9d7-1f3fc",
        "name": "person climbing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f9d7-1f3fc-2642",
            "1f9d7-1f3fc-2640"
        ]
    },
    "1f9d7-1f3fd": {
        "id": "1f9d7-1f3fd",
        "name": "person climbing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f9d7-1f3fd-2642",
            "1f9d7-1f3fd-2640"
        ]
    },
    "1f9d7-1f3fe": {
        "id": "1f9d7-1f3fe",
        "name": "person climbing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f9d7-1f3fe-2642",
            "1f9d7-1f3fe-2640"
        ]
    },
    "1f9d7-1f3ff": {
        "id": "1f9d7-1f3ff",
        "name": "person climbing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f9d7-1f3ff-2642",
            "1f9d7-1f3ff-2640"
        ]
    },
    "1f9d7-2640": {
        "id": "1f9d7-2640",
        "name": "woman climbing",
        "category": "activity",
        "diversities": [
            "1f9d7-1f3fb-2640",
            "1f9d7-1f3fc-2640",
            "1f9d7-1f3fd-2640",
            "1f9d7-1f3fe-2640",
            "1f9d7-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9d7-1f3fb-2640": {
        "id": "1f9d7-1f3fb-2640",
        "name": "woman climbing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9d7-1f3fc-2640": {
        "id": "1f9d7-1f3fc-2640",
        "name": "woman climbing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9d7-1f3fd-2640": {
        "id": "1f9d7-1f3fd-2640",
        "name": "woman climbing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9d7-1f3fe-2640": {
        "id": "1f9d7-1f3fe-2640",
        "name": "woman climbing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9d7-1f3ff-2640": {
        "id": "1f9d7-1f3ff-2640",
        "name": "woman climbing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9d7-2642": {
        "id": "1f9d7-2642",
        "name": "man climbing",
        "category": "activity",
        "diversities": [
            "1f9d7-1f3fb-2642",
            "1f9d7-1f3fc-2642",
            "1f9d7-1f3fd-2642",
            "1f9d7-1f3fe-2642",
            "1f9d7-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9d7-1f3fb-2642": {
        "id": "1f9d7-1f3fb-2642",
        "name": "man climbing: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9d7-1f3fc-2642": {
        "id": "1f9d7-1f3fc-2642",
        "name": "man climbing: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9d7-1f3fd-2642": {
        "id": "1f9d7-1f3fd-2642",
        "name": "man climbing: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9d7-1f3fe-2642": {
        "id": "1f9d7-1f3fe-2642",
        "name": "man climbing: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9d7-1f3ff-2642": {
        "id": "1f9d7-1f3ff-2642",
        "name": "man climbing: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f6b5": {
        "id": "1f6b5",
        "name": "person mountain biking",
        "category": "activity",
        "diversities": [
            "1f6b5-1f3fb",
            "1f6b5-1f3fc",
            "1f6b5-1f3fd",
            "1f6b5-1f3fe",
            "1f6b5-1f3ff"
        ],
        "genders": [
            "1f6b5-2642",
            "1f6b5-2640"
        ]
    },
    "1f6b5-1f3fb": {
        "id": "1f6b5-1f3fb",
        "name": "person mountain biking: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f6b5-1f3fb-2642",
            "1f6b5-1f3fb-2640"
        ]
    },
    "1f6b5-1f3fc": {
        "id": "1f6b5-1f3fc",
        "name": "person mountain biking: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f6b5-1f3fc-2642",
            "1f6b5-1f3fc-2640"
        ]
    },
    "1f6b5-1f3fd": {
        "id": "1f6b5-1f3fd",
        "name": "person mountain biking: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f6b5-1f3fd-2642",
            "1f6b5-1f3fd-2640"
        ]
    },
    "1f6b5-1f3fe": {
        "id": "1f6b5-1f3fe",
        "name": "person mountain biking: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f6b5-1f3fe-2642",
            "1f6b5-1f3fe-2640"
        ]
    },
    "1f6b5-1f3ff": {
        "id": "1f6b5-1f3ff",
        "name": "person mountain biking: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f6b5-1f3ff-2642",
            "1f6b5-1f3ff-2640"
        ]
    },
    "1f6b5-2640": {
        "id": "1f6b5-2640",
        "name": "woman mountain biking",
        "category": "activity",
        "diversities": [
            "1f6b5-1f3fb-2640",
            "1f6b5-1f3fc-2640",
            "1f6b5-1f3fd-2640",
            "1f6b5-1f3fe-2640",
            "1f6b5-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f6b5-1f3fb-2640": {
        "id": "1f6b5-1f3fb-2640",
        "name": "woman mountain biking: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f6b5-1f3fc-2640": {
        "id": "1f6b5-1f3fc-2640",
        "name": "woman mountain biking: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f6b5-1f3fd-2640": {
        "id": "1f6b5-1f3fd-2640",
        "name": "woman mountain biking: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f6b5-1f3fe-2640": {
        "id": "1f6b5-1f3fe-2640",
        "name": "woman mountain biking: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f6b5-1f3ff-2640": {
        "id": "1f6b5-1f3ff-2640",
        "name": "woman mountain biking: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f6b5-2642": {
        "id": "1f6b5-2642",
        "name": "man mountain biking",
        "category": "activity",
        "diversities": [
            "1f6b5-1f3fb-2642",
            "1f6b5-1f3fc-2642",
            "1f6b5-1f3fd-2642",
            "1f6b5-1f3fe-2642",
            "1f6b5-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f6b5-1f3fb-2642": {
        "id": "1f6b5-1f3fb-2642",
        "name": "man mountain biking: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f6b5-1f3fc-2642": {
        "id": "1f6b5-1f3fc-2642",
        "name": "man mountain biking: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f6b5-1f3fd-2642": {
        "id": "1f6b5-1f3fd-2642",
        "name": "man mountain biking: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f6b5-1f3fe-2642": {
        "id": "1f6b5-1f3fe-2642",
        "name": "man mountain biking: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f6b5-1f3ff-2642": {
        "id": "1f6b5-1f3ff-2642",
        "name": "man mountain biking: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f6b4": {
        "id": "1f6b4",
        "name": "person biking",
        "category": "activity",
        "diversities": [
            "1f6b4-1f3fb",
            "1f6b4-1f3fc",
            "1f6b4-1f3fd",
            "1f6b4-1f3fe",
            "1f6b4-1f3ff"
        ],
        "genders": [
            "1f6b4-2642",
            "1f6b4-2640"
        ]
    },
    "1f6b4-1f3fb": {
        "id": "1f6b4-1f3fb",
        "name": "person biking: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f6b4-1f3fb-2642",
            "1f6b4-1f3fb-2640"
        ]
    },
    "1f6b4-1f3fc": {
        "id": "1f6b4-1f3fc",
        "name": "person biking: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f6b4-1f3fc-2642",
            "1f6b4-1f3fc-2640"
        ]
    },
    "1f6b4-1f3fd": {
        "id": "1f6b4-1f3fd",
        "name": "person biking: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f6b4-1f3fd-2642",
            "1f6b4-1f3fd-2640"
        ]
    },
    "1f6b4-1f3fe": {
        "id": "1f6b4-1f3fe",
        "name": "person biking: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f6b4-1f3fe-2642",
            "1f6b4-1f3fe-2640"
        ]
    },
    "1f6b4-1f3ff": {
        "id": "1f6b4-1f3ff",
        "name": "person biking: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f6b4-1f3ff-2642",
            "1f6b4-1f3ff-2640"
        ]
    },
    "1f6b4-2640": {
        "id": "1f6b4-2640",
        "name": "woman biking",
        "category": "activity",
        "diversities": [
            "1f6b4-1f3fb-2640",
            "1f6b4-1f3fc-2640",
            "1f6b4-1f3fd-2640",
            "1f6b4-1f3fe-2640",
            "1f6b4-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f6b4-1f3fb-2640": {
        "id": "1f6b4-1f3fb-2640",
        "name": "woman biking: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f6b4-1f3fc-2640": {
        "id": "1f6b4-1f3fc-2640",
        "name": "woman biking: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f6b4-1f3fd-2640": {
        "id": "1f6b4-1f3fd-2640",
        "name": "woman biking: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f6b4-1f3fe-2640": {
        "id": "1f6b4-1f3fe-2640",
        "name": "woman biking: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f6b4-1f3ff-2640": {
        "id": "1f6b4-1f3ff-2640",
        "name": "woman biking: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f6b4-2642": {
        "id": "1f6b4-2642",
        "name": "man biking",
        "category": "activity",
        "diversities": [
            "1f6b4-1f3fb-2642",
            "1f6b4-1f3fc-2642",
            "1f6b4-1f3fd-2642",
            "1f6b4-1f3fe-2642",
            "1f6b4-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f6b4-1f3fb-2642": {
        "id": "1f6b4-1f3fb-2642",
        "name": "man biking: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f6b4-1f3fc-2642": {
        "id": "1f6b4-1f3fc-2642",
        "name": "man biking: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f6b4-1f3fd-2642": {
        "id": "1f6b4-1f3fd-2642",
        "name": "man biking: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f6b4-1f3fe-2642": {
        "id": "1f6b4-1f3fe-2642",
        "name": "man biking: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f6b4-1f3ff-2642": {
        "id": "1f6b4-1f3ff-2642",
        "name": "man biking: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f3c6": {
        "id": "1f3c6",
        "name": "trophy",
        "category": "activity"
    },
    "1f947": {
        "id": "1f947",
        "name": "1st place medal",
        "category": "activity"
    },
    "1f948": {
        "id": "1f948",
        "name": "2nd place medal",
        "category": "activity"
    },
    "1f949": {
        "id": "1f949",
        "name": "3rd place medal",
        "category": "activity"
    },
    "1f3c5": {
        "id": "1f3c5",
        "name": "sports medal",
        "category": "activity"
    },
    "1f396": {
        "id": "1f396",
        "name": "military medal",
        "category": "activity"
    },
    "1f3f5": {
        "id": "1f3f5",
        "name": "rosette",
        "category": "activity"
    },
    "1f397": {
        "id": "1f397",
        "name": "reminder ribbon",
        "category": "activity"
    },
    "1f3ab": {
        "id": "1f3ab",
        "name": "ticket",
        "category": "activity"
    },
    "1f39f": {
        "id": "1f39f",
        "name": "admission tickets",
        "category": "activity"
    },
    "1f3aa": {
        "id": "1f3aa",
        "name": "circus tent",
        "category": "activity"
    },
    "1f939": {
        "id": "1f939",
        "name": "person juggling",
        "category": "activity",
        "diversities": [
            "1f939-1f3fb",
            "1f939-1f3fc",
            "1f939-1f3fd",
            "1f939-1f3fe",
            "1f939-1f3ff"
        ],
        "genders": [
            "1f939-2642",
            "1f939-2640"
        ]
    },
    "1f939-1f3fb": {
        "id": "1f939-1f3fb",
        "name": "person juggling: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "genders": [
            "1f939-1f3fb-2642",
            "1f939-1f3fb-2640"
        ]
    },
    "1f939-1f3fc": {
        "id": "1f939-1f3fc",
        "name": "person juggling: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "genders": [
            "1f939-1f3fc-2642",
            "1f939-1f3fc-2640"
        ]
    },
    "1f939-1f3fd": {
        "id": "1f939-1f3fd",
        "name": "person juggling: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "genders": [
            "1f939-1f3fd-2642",
            "1f939-1f3fd-2640"
        ]
    },
    "1f939-1f3fe": {
        "id": "1f939-1f3fe",
        "name": "person juggling: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "genders": [
            "1f939-1f3fe-2642",
            "1f939-1f3fe-2640"
        ]
    },
    "1f939-1f3ff": {
        "id": "1f939-1f3ff",
        "name": "person juggling: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "genders": [
            "1f939-1f3ff-2642",
            "1f939-1f3ff-2640"
        ]
    },
    "1f939-2640": {
        "id": "1f939-2640",
        "name": "woman juggling",
        "category": "activity",
        "diversities": [
            "1f939-1f3fb-2640",
            "1f939-1f3fc-2640",
            "1f939-1f3fd-2640",
            "1f939-1f3fe-2640",
            "1f939-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f939-1f3fb-2640": {
        "id": "1f939-1f3fb-2640",
        "name": "woman juggling: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f939-1f3fc-2640": {
        "id": "1f939-1f3fc-2640",
        "name": "woman juggling: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f939-1f3fd-2640": {
        "id": "1f939-1f3fd-2640",
        "name": "woman juggling: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f939-1f3fe-2640": {
        "id": "1f939-1f3fe-2640",
        "name": "woman juggling: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f939-1f3ff-2640": {
        "id": "1f939-1f3ff-2640",
        "name": "woman juggling: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f939-2642": {
        "id": "1f939-2642",
        "name": "man juggling",
        "category": "activity",
        "diversities": [
            "1f939-1f3fb-2642",
            "1f939-1f3fc-2642",
            "1f939-1f3fd-2642",
            "1f939-1f3fe-2642",
            "1f939-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f939-1f3fb-2642": {
        "id": "1f939-1f3fb-2642",
        "name": "man juggling: light skin tone",
        "category": "activity",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f939-1f3fc-2642": {
        "id": "1f939-1f3fc-2642",
        "name": "man juggling: medium-light skin tone",
        "category": "activity",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f939-1f3fd-2642": {
        "id": "1f939-1f3fd-2642",
        "name": "man juggling: medium skin tone",
        "category": "activity",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f939-1f3fe-2642": {
        "id": "1f939-1f3fe-2642",
        "name": "man juggling: medium-dark skin tone",
        "category": "activity",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f939-1f3ff-2642": {
        "id": "1f939-1f3ff-2642",
        "name": "man juggling: dark skin tone",
        "category": "activity",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f3ad": {
        "id": "1f3ad",
        "name": "performing arts",
        "category": "activity"
    },
    "1f3a8": {
        "id": "1f3a8",
        "name": "artist palette",
        "category": "activity"
    },
    "1f3ac": {
        "id": "1f3ac",
        "name": "clapper board",
        "category": "activity"
    },
    "1f3a4": {
        "id": "1f3a4",
        "name": "microphone",
        "category": "activity"
    },
    "1f3a7": {
        "id": "1f3a7",
        "name": "headphone",
        "category": "activity"
    },
    "1f3bc": {
        "id": "1f3bc",
        "name": "musical score",
        "category": "activity"
    },
    "1f3b9": {
        "id": "1f3b9",
        "name": "musical keyboard",
        "category": "activity"
    },
    "1f941": {
        "id": "1f941",
        "name": "drum",
        "category": "activity"
    },
    "1f3b7": {
        "id": "1f3b7",
        "name": "saxophone",
        "category": "activity"
    },
    "1f3ba": {
        "id": "1f3ba",
        "name": "trumpet",
        "category": "activity"
    },
    "1f3b8": {
        "id": "1f3b8",
        "name": "guitar",
        "category": "activity"
    },
    "1f3bb": {
        "id": "1f3bb",
        "name": "violin",
        "category": "activity"
    },
    "1f3b2": {
        "id": "1f3b2",
        "name": "game die",
        "category": "activity"
    },
    "1f3af": {
        "id": "1f3af",
        "name": "direct hit",
        "category": "activity"
    },
    "1f3b3": {
        "id": "1f3b3",
        "name": "bowling",
        "category": "activity"
    },
    "1f3ae": {
        "id": "1f3ae",
        "name": "video game",
        "category": "activity"
    },
    "1f3b0": {
        "id": "1f3b0",
        "name": "slot machine",
        "category": "activity"
    },
    "231a": {
        "id": "231a",
        "name": "watch",
        "category": "objects"
    },
    "1f4f1": {
        "id": "1f4f1",
        "name": "mobile phone",
        "category": "objects"
    },
    "1f4f2": {
        "id": "1f4f2",
        "name": "mobile phone with arrow",
        "category": "objects"
    },
    "1f4bb": {
        "id": "1f4bb",
        "name": "laptop computer",
        "category": "objects"
    },
    "1f5a5": {
        "id": "1f5a5",
        "name": "desktop computer",
        "category": "objects"
    },
    "1f5a8": {
        "id": "1f5a8",
        "name": "printer",
        "category": "objects"
    },
    "1f5b1": {
        "id": "1f5b1",
        "name": "computer mouse",
        "category": "objects"
    },
    "1f5b2": {
        "id": "1f5b2",
        "name": "trackball",
        "category": "objects"
    },
    "1f579": {
        "id": "1f579",
        "name": "joystick",
        "category": "objects"
    },
    "265f": {
        "id": "265f",
        "name": "chess pawn",
        "category": "objects"
    },
    "1f9e9": {
        "id": "1f9e9",
        "name": "jigsaw",
        "category": "objects"
    },
    "1f5dc": {
        "id": "1f5dc",
        "name": "clamp",
        "category": "objects"
    },
    "1f4bd": {
        "id": "1f4bd",
        "name": "computer disk",
        "category": "objects"
    },
    "1f4be": {
        "id": "1f4be",
        "name": "floppy disk",
        "category": "objects"
    },
    "1f4bf": {
        "id": "1f4bf",
        "name": "optical disk",
        "category": "objects"
    },
    "1f4c0": {
        "id": "1f4c0",
        "name": "dvd",
        "category": "objects"
    },
    "1f4fc": {
        "id": "1f4fc",
        "name": "videocassette",
        "category": "objects"
    },
    "1f4f7": {
        "id": "1f4f7",
        "name": "camera",
        "category": "objects"
    },
    "1f4f8": {
        "id": "1f4f8",
        "name": "camera with flash",
        "category": "objects"
    },
    "1f4f9": {
        "id": "1f4f9",
        "name": "video camera",
        "category": "objects"
    },
    "1f3a5": {
        "id": "1f3a5",
        "name": "movie camera",
        "category": "objects"
    },
    "1f4fd": {
        "id": "1f4fd",
        "name": "film projector",
        "category": "objects"
    },
    "1f39e": {
        "id": "1f39e",
        "name": "film frames",
        "category": "objects"
    },
    "1f4de": {
        "id": "1f4de",
        "name": "telephone receiver",
        "category": "objects"
    },
    "260e": {
        "id": "260e",
        "name": "telephone",
        "category": "objects"
    },
    "1f4df": {
        "id": "1f4df",
        "name": "pager",
        "category": "objects"
    },
    "1f4e0": {
        "id": "1f4e0",
        "name": "fax machine",
        "category": "objects"
    },
    "1f4fa": {
        "id": "1f4fa",
        "name": "television",
        "category": "objects"
    },
    "1f4fb": {
        "id": "1f4fb",
        "name": "radio",
        "category": "objects"
    },
    "1f399": {
        "id": "1f399",
        "name": "studio microphone",
        "category": "objects"
    },
    "1f39a": {
        "id": "1f39a",
        "name": "level slider",
        "category": "objects"
    },
    "1f39b": {
        "id": "1f39b",
        "name": "control knobs",
        "category": "objects"
    },
    "23f1": {
        "id": "23f1",
        "name": "stopwatch",
        "category": "objects"
    },
    "23f2": {
        "id": "23f2",
        "name": "timer clock",
        "category": "objects"
    },
    "23f0": {
        "id": "23f0",
        "name": "alarm clock",
        "category": "objects"
    },
    "1f570": {
        "id": "1f570",
        "name": "mantelpiece clock",
        "category": "objects"
    },
    "231b": {
        "id": "231b",
        "name": "hourglass done",
        "category": "objects"
    },
    "23f3": {
        "id": "23f3",
        "name": "hourglass not done",
        "category": "objects"
    },
    "1f4e1": {
        "id": "1f4e1",
        "name": "satellite antenna",
        "category": "objects"
    },
    "1f9ed": {
        "id": "1f9ed",
        "name": "compass",
        "category": "objects"
    },
    "1f50b": {
        "id": "1f50b",
        "name": "battery",
        "category": "objects"
    },
    "1f50c": {
        "id": "1f50c",
        "name": "electric plug",
        "category": "objects"
    },
    "1f9f2": {
        "id": "1f9f2",
        "name": "magnet",
        "category": "objects"
    },
    "1f4a1": {
        "id": "1f4a1",
        "name": "light bulb",
        "category": "objects"
    },
    "1f526": {
        "id": "1f526",
        "name": "flashlight",
        "category": "objects"
    },
    "1f56f": {
        "id": "1f56f",
        "name": "candle",
        "category": "objects"
    },
    "1f9ef": {
        "id": "1f9ef",
        "name": "fire extinguisher",
        "category": "objects"
    },
    "1f5d1": {
        "id": "1f5d1",
        "name": "wastebasket",
        "category": "objects"
    },
    "1f6e2": {
        "id": "1f6e2",
        "name": "oil drum",
        "category": "objects"
    },
    "1f4b8": {
        "id": "1f4b8",
        "name": "money with wings",
        "category": "objects"
    },
    "1f4b5": {
        "id": "1f4b5",
        "name": "dollar banknote",
        "category": "objects"
    },
    "1f4b4": {
        "id": "1f4b4",
        "name": "yen banknote",
        "category": "objects"
    },
    "1f4b6": {
        "id": "1f4b6",
        "name": "euro banknote",
        "category": "objects"
    },
    "1f4b7": {
        "id": "1f4b7",
        "name": "pound banknote",
        "category": "objects"
    },
    "1f4b0": {
        "id": "1f4b0",
        "name": "money bag",
        "category": "objects"
    },
    "1f4b3": {
        "id": "1f4b3",
        "name": "credit card",
        "category": "objects"
    },
    "1f48e": {
        "id": "1f48e",
        "name": "gem stone",
        "category": "objects"
    },
    "1f9ff": {
        "id": "1f9ff",
        "name": "nazar amulet",
        "category": "objects"
    },
    "1f9f1": {
        "id": "1f9f1",
        "name": "bricks",
        "category": "objects"
    },
    "1f9f0": {
        "id": "1f9f0",
        "name": "toolbox",
        "category": "objects"
    },
    "1f527": {
        "id": "1f527",
        "name": "wrench",
        "category": "objects"
    },
    "1f528": {
        "id": "1f528",
        "name": "hammer",
        "category": "objects"
    },
    "1f6e0": {
        "id": "1f6e0",
        "name": "hammer and wrench",
        "category": "objects"
    },
    "26cf": {
        "id": "26cf",
        "name": "pick",
        "category": "objects"
    },
    "1f529": {
        "id": "1f529",
        "name": "nut and bolt",
        "category": "objects"
    },
    "26d3": {
        "id": "26d3",
        "name": "chains",
        "category": "objects"
    },
    "1f52b": {
        "id": "1f52b",
        "name": "pistol",
        "category": "objects"
    },
    "1f4a3": {
        "id": "1f4a3",
        "name": "bomb",
        "category": "objects"
    },
    "1f52a": {
        "id": "1f52a",
        "name": "kitchen knife",
        "category": "objects"
    },
    "1f5e1": {
        "id": "1f5e1",
        "name": "dagger",
        "category": "objects"
    },
    "1f6e1": {
        "id": "1f6e1",
        "name": "shield",
        "category": "objects"
    },
    "1f6ac": {
        "id": "1f6ac",
        "name": "cigarette",
        "category": "objects"
    },
    "26b0": {
        "id": "26b0",
        "name": "coffin",
        "category": "objects"
    },
    "26b1": {
        "id": "26b1",
        "name": "funeral urn",
        "category": "objects"
    },
    "1f3fa": {
        "id": "1f3fa",
        "name": "amphora",
        "category": "objects"
    },
    "1f52e": {
        "id": "1f52e",
        "name": "crystal ball",
        "category": "objects"
    },
    "1f4ff": {
        "id": "1f4ff",
        "name": "prayer beads",
        "category": "objects"
    },
    "1f488": {
        "id": "1f488",
        "name": "barber pole",
        "category": "objects"
    },
    "1f9ea": {
        "id": "1f9ea",
        "name": "test tube",
        "category": "objects"
    },
    "1f9eb": {
        "id": "1f9eb",
        "name": "petri dish",
        "category": "objects"
    },
    "1f9ec": {
        "id": "1f9ec",
        "name": "dna",
        "category": "objects"
    },
    "1f9ee": {
        "id": "1f9ee",
        "name": "abacus",
        "category": "objects"
    },
    "1f52d": {
        "id": "1f52d",
        "name": "telescope",
        "category": "objects"
    },
    "1f52c": {
        "id": "1f52c",
        "name": "microscope",
        "category": "objects"
    },
    "1f573": {
        "id": "1f573",
        "name": "hole",
        "category": "objects"
    },
    "1f48a": {
        "id": "1f48a",
        "name": "pill",
        "category": "objects"
    },
    "1f489": {
        "id": "1f489",
        "name": "syringe",
        "category": "objects"
    },
    "1f321": {
        "id": "1f321",
        "name": "thermometer",
        "category": "objects"
    },
    "1f6bd": {
        "id": "1f6bd",
        "name": "toilet",
        "category": "objects"
    },
    "1f6b0": {
        "id": "1f6b0",
        "name": "potable water",
        "category": "objects"
    },
    "1f6bf": {
        "id": "1f6bf",
        "name": "shower",
        "category": "objects"
    },
    "1f6c1": {
        "id": "1f6c1",
        "name": "bathtub",
        "category": "objects"
    },
    "1f6c0": {
        "id": "1f6c0",
        "name": "person taking bath",
        "category": "objects",
        "diversities": [
            "1f6c0-1f3fb",
            "1f6c0-1f3fc",
            "1f6c0-1f3fd",
            "1f6c0-1f3fe",
            "1f6c0-1f3ff"
        ]
    },
    "1f6c0-1f3fb": {
        "id": "1f6c0-1f3fb",
        "name": "person taking bath: light skin tone",
        "category": "objects",
        "diversity": "1f3fb"
    },
    "1f6c0-1f3fc": {
        "id": "1f6c0-1f3fc",
        "name": "person taking bath: medium-light skin tone",
        "category": "objects",
        "diversity": "1f3fc"
    },
    "1f6c0-1f3fd": {
        "id": "1f6c0-1f3fd",
        "name": "person taking bath: medium skin tone",
        "category": "objects",
        "diversity": "1f3fd"
    },
    "1f6c0-1f3fe": {
        "id": "1f6c0-1f3fe",
        "name": "person taking bath: medium-dark skin tone",
        "category": "objects",
        "diversity": "1f3fe"
    },
    "1f6c0-1f3ff": {
        "id": "1f6c0-1f3ff",
        "name": "person taking bath: dark skin tone",
        "category": "objects",
        "diversity": "1f3ff"
    },
    "1f9f9": {
        "id": "1f9f9",
        "name": "broom",
        "category": "objects"
    },
    "1f9fa": {
        "id": "1f9fa",
        "name": "basket",
        "category": "objects"
    },
    "1f9fb": {
        "id": "1f9fb",
        "name": "roll of paper",
        "category": "objects"
    },
    "1f9fc": {
        "id": "1f9fc",
        "name": "soap",
        "category": "objects"
    },
    "1f9fd": {
        "id": "1f9fd",
        "name": "sponge",
        "category": "objects"
    },
    "1f9f4": {
        "id": "1f9f4",
        "name": "squeeze bottle",
        "category": "objects"
    },
    "1f9f5": {
        "id": "1f9f5",
        "name": "thread",
        "category": "objects"
    },
    "1f9f6": {
        "id": "1f9f6",
        "name": "yarn",
        "category": "objects"
    },
    "1f6ce": {
        "id": "1f6ce",
        "name": "bellhop bell",
        "category": "objects"
    },
    "1f511": {
        "id": "1f511",
        "name": "key",
        "category": "objects"
    },
    "1f5dd": {
        "id": "1f5dd",
        "name": "old key",
        "category": "objects"
    },
    "1f6aa": {
        "id": "1f6aa",
        "name": "door",
        "category": "objects"
    },
    "1f6cb": {
        "id": "1f6cb",
        "name": "couch and lamp",
        "category": "objects"
    },
    "1f6cf": {
        "id": "1f6cf",
        "name": "bed",
        "category": "objects"
    },
    "1f6cc": {
        "id": "1f6cc",
        "name": "person in bed",
        "category": "objects",
        "diversities": [
            "1f6cc-1f3fb",
            "1f6cc-1f3fc",
            "1f6cc-1f3fd",
            "1f6cc-1f3fe",
            "1f6cc-1f3ff"
        ]
    },
    "1f6cc-1f3fb": {
        "id": "1f6cc-1f3fb",
        "name": "person in bed: light skin tone",
        "category": "objects",
        "diversity": "1f3fb"
    },
    "1f6cc-1f3fc": {
        "id": "1f6cc-1f3fc",
        "name": "person in bed: medium-light skin tone",
        "category": "objects",
        "diversity": "1f3fc"
    },
    "1f6cc-1f3fd": {
        "id": "1f6cc-1f3fd",
        "name": "person in bed: medium skin tone",
        "category": "objects",
        "diversity": "1f3fd"
    },
    "1f6cc-1f3fe": {
        "id": "1f6cc-1f3fe",
        "name": "person in bed: medium-dark skin tone",
        "category": "objects",
        "diversity": "1f3fe"
    },
    "1f6cc-1f3ff": {
        "id": "1f6cc-1f3ff",
        "name": "person in bed: dark skin tone",
        "category": "objects",
        "diversity": "1f3ff"
    },
    "1f9f8": {
        "id": "1f9f8",
        "name": "teddy bear",
        "category": "objects"
    },
    "1f5bc": {
        "id": "1f5bc",
        "name": "framed picture",
        "category": "objects"
    },
    "1f6cd": {
        "id": "1f6cd",
        "name": "shopping bags",
        "category": "objects"
    },
    "1f6d2": {
        "id": "1f6d2",
        "name": "shopping cart",
        "category": "objects"
    },
    "1f381": {
        "id": "1f381",
        "name": "wrapped gift",
        "category": "objects"
    },
    "1f388": {
        "id": "1f388",
        "name": "balloon",
        "category": "objects"
    },
    "1f38f": {
        "id": "1f38f",
        "name": "carp streamer",
        "category": "objects"
    },
    "1f380": {
        "id": "1f380",
        "name": "ribbon",
        "category": "objects"
    },
    "1f38a": {
        "id": "1f38a",
        "name": "confetti ball",
        "category": "objects"
    },
    "1f389": {
        "id": "1f389",
        "name": "party popper",
        "category": "objects"
    },
    "1f38e": {
        "id": "1f38e",
        "name": "Japanese dolls",
        "category": "objects"
    },
    "1f3ee": {
        "id": "1f3ee",
        "name": "red paper lantern",
        "category": "objects"
    },
    "1f390": {
        "id": "1f390",
        "name": "wind chime",
        "category": "objects"
    },
    "1f9e7": {
        "id": "1f9e7",
        "name": "red envelope",
        "category": "objects"
    },
    "1f4e9": {
        "id": "1f4e9",
        "name": "envelope with arrow",
        "category": "objects"
    },
    "1f4e8": {
        "id": "1f4e8",
        "name": "incoming envelope",
        "category": "objects"
    },
    "1f4e7": {
        "id": "1f4e7",
        "name": "e-mail",
        "category": "objects"
    },
    "1f48c": {
        "id": "1f48c",
        "name": "love letter",
        "category": "objects"
    },
    "1f4e5": {
        "id": "1f4e5",
        "name": "inbox tray",
        "category": "objects"
    },
    "1f4e4": {
        "id": "1f4e4",
        "name": "outbox tray",
        "category": "objects"
    },
    "1f4e6": {
        "id": "1f4e6",
        "name": "package",
        "category": "objects"
    },
    "1f3f7": {
        "id": "1f3f7",
        "name": "label",
        "category": "objects"
    },
    "1f4ea": {
        "id": "1f4ea",
        "name": "closed mailbox with lowered flag",
        "category": "objects"
    },
    "1f4eb": {
        "id": "1f4eb",
        "name": "closed mailbox with raised flag",
        "category": "objects"
    },
    "1f4ec": {
        "id": "1f4ec",
        "name": "open mailbox with raised flag",
        "category": "objects"
    },
    "1f4ed": {
        "id": "1f4ed",
        "name": "open mailbox with lowered flag",
        "category": "objects"
    },
    "1f4ee": {
        "id": "1f4ee",
        "name": "postbox",
        "category": "objects"
    },
    "1f4ef": {
        "id": "1f4ef",
        "name": "postal horn",
        "category": "objects"
    },
    "1f4dc": {
        "id": "1f4dc",
        "name": "scroll",
        "category": "objects"
    },
    "1f4c3": {
        "id": "1f4c3",
        "name": "page with curl",
        "category": "objects"
    },
    "1f4c4": {
        "id": "1f4c4",
        "name": "page facing up",
        "category": "objects"
    },
    "1f9fe": {
        "id": "1f9fe",
        "name": "receipt",
        "category": "objects"
    },
    "1f4d1": {
        "id": "1f4d1",
        "name": "bookmark tabs",
        "category": "objects"
    },
    "1f4ca": {
        "id": "1f4ca",
        "name": "bar chart",
        "category": "objects"
    },
    "1f4c8": {
        "id": "1f4c8",
        "name": "chart increasing",
        "category": "objects"
    },
    "1f4c9": {
        "id": "1f4c9",
        "name": "chart decreasing",
        "category": "objects"
    },
    "1f5d2": {
        "id": "1f5d2",
        "name": "spiral notepad",
        "category": "objects"
    },
    "1f5d3": {
        "id": "1f5d3",
        "name": "spiral calendar",
        "category": "objects"
    },
    "1f4c6": {
        "id": "1f4c6",
        "name": "tear-off calendar",
        "category": "objects"
    },
    "1f4c5": {
        "id": "1f4c5",
        "name": "calendar",
        "category": "objects"
    },
    "1f4c7": {
        "id": "1f4c7",
        "name": "card index",
        "category": "objects"
    },
    "1f5c3": {
        "id": "1f5c3",
        "name": "card file box",
        "category": "objects"
    },
    "1f5f3": {
        "id": "1f5f3",
        "name": "ballot box with ballot",
        "category": "objects"
    },
    "1f5c4": {
        "id": "1f5c4",
        "name": "file cabinet",
        "category": "objects"
    },
    "1f4cb": {
        "id": "1f4cb",
        "name": "clipboard",
        "category": "objects"
    },
    "1f4c1": {
        "id": "1f4c1",
        "name": "file folder",
        "category": "objects"
    },
    "1f4c2": {
        "id": "1f4c2",
        "name": "open file folder",
        "category": "objects"
    },
    "1f5c2": {
        "id": "1f5c2",
        "name": "card index dividers",
        "category": "objects"
    },
    "1f5de": {
        "id": "1f5de",
        "name": "rolled-up newspaper",
        "category": "objects"
    },
    "1f4f0": {
        "id": "1f4f0",
        "name": "newspaper",
        "category": "objects"
    },
    "1f4d3": {
        "id": "1f4d3",
        "name": "notebook",
        "category": "objects"
    },
    "1f4d4": {
        "id": "1f4d4",
        "name": "notebook with decorative cover",
        "category": "objects"
    },
    "1f4d2": {
        "id": "1f4d2",
        "name": "ledger",
        "category": "objects"
    },
    "1f4d5": {
        "id": "1f4d5",
        "name": "closed book",
        "category": "objects"
    },
    "1f4d7": {
        "id": "1f4d7",
        "name": "green book",
        "category": "objects"
    },
    "1f4d8": {
        "id": "1f4d8",
        "name": "blue book",
        "category": "objects"
    },
    "1f4d9": {
        "id": "1f4d9",
        "name": "orange book",
        "category": "objects"
    },
    "1f4da": {
        "id": "1f4da",
        "name": "books",
        "category": "objects"
    },
    "1f4d6": {
        "id": "1f4d6",
        "name": "open book",
        "category": "objects"
    },
    "1f516": {
        "id": "1f516",
        "name": "bookmark",
        "category": "objects"
    },
    "1f517": {
        "id": "1f517",
        "name": "link",
        "category": "objects"
    },
    "1f4ce": {
        "id": "1f4ce",
        "name": "paperclip",
        "category": "objects"
    },
    "1f587": {
        "id": "1f587",
        "name": "linked paperclips",
        "category": "objects"
    },
    "1f4d0": {
        "id": "1f4d0",
        "name": "triangular ruler",
        "category": "objects"
    },
    "1f4cf": {
        "id": "1f4cf",
        "name": "straight ruler",
        "category": "objects"
    },
    "1f9f7": {
        "id": "1f9f7",
        "name": "safety pin",
        "category": "objects"
    },
    "1f4cc": {
        "id": "1f4cc",
        "name": "pushpin",
        "category": "objects"
    },
    "1f4cd": {
        "id": "1f4cd",
        "name": "round pushpin",
        "category": "objects"
    },
    "1f58a": {
        "id": "1f58a",
        "name": "pen",
        "category": "objects"
    },
    "1f58b": {
        "id": "1f58b",
        "name": "fountain pen",
        "category": "objects"
    },
    "1f58c": {
        "id": "1f58c",
        "name": "paintbrush",
        "category": "objects"
    },
    "1f58d": {
        "id": "1f58d",
        "name": "crayon",
        "category": "objects"
    },
    "1f4dd": {
        "id": "1f4dd",
        "name": "memo",
        "category": "objects"
    },
    "270f": {
        "id": "270f",
        "name": "pencil",
        "category": "objects"
    },
    "1f50d": {
        "id": "1f50d",
        "name": "magnifying glass tilted left",
        "category": "objects"
    },
    "1f50e": {
        "id": "1f50e",
        "name": "magnifying glass tilted right",
        "category": "objects"
    },
    "1f50f": {
        "id": "1f50f",
        "name": "locked with pen",
        "category": "objects"
    },
    "1f510": {
        "id": "1f510",
        "name": "locked with key",
        "category": "objects"
    },
    "1f436": {
        "id": "1f436",
        "name": "dog face",
        "category": "nature"
    },
    "1f431": {
        "id": "1f431",
        "name": "cat face",
        "category": "nature"
    },
    "1f42d": {
        "id": "1f42d",
        "name": "mouse face",
        "category": "nature"
    },
    "1f439": {
        "id": "1f439",
        "name": "hamster face",
        "category": "nature"
    },
    "1f430": {
        "id": "1f430",
        "name": "rabbit face",
        "category": "nature"
    },
    "1f98a": {
        "id": "1f98a",
        "name": "fox face",
        "category": "nature"
    },
    "1f99d": {
        "id": "1f99d",
        "name": "raccoon",
        "category": "nature"
    },
    "1f43b": {
        "id": "1f43b",
        "name": "bear face",
        "category": "nature"
    },
    "1f43c": {
        "id": "1f43c",
        "name": "panda face",
        "category": "nature"
    },
    "1f998": {
        "id": "1f998",
        "name": "kangaroo",
        "category": "nature"
    },
    "1f9a1": {
        "id": "1f9a1",
        "name": "badger",
        "category": "nature"
    },
    "1f428": {
        "id": "1f428",
        "name": "koala",
        "category": "nature"
    },
    "1f42f": {
        "id": "1f42f",
        "name": "tiger face",
        "category": "nature"
    },
    "1f981": {
        "id": "1f981",
        "name": "lion face",
        "category": "nature"
    },
    "1f42e": {
        "id": "1f42e",
        "name": "cow face",
        "category": "nature"
    },
    "1f437": {
        "id": "1f437",
        "name": "pig face",
        "category": "nature"
    },
    "1f43d": {
        "id": "1f43d",
        "name": "pig nose",
        "category": "nature"
    },
    "1f438": {
        "id": "1f438",
        "name": "frog face",
        "category": "nature"
    },
    "1f435": {
        "id": "1f435",
        "name": "monkey face",
        "category": "nature"
    },
    "1f648": {
        "id": "1f648",
        "name": "see-no-evil monkey",
        "category": "nature"
    },
    "1f649": {
        "id": "1f649",
        "name": "hear-no-evil monkey",
        "category": "nature"
    },
    "1f64a": {
        "id": "1f64a",
        "name": "speak-no-evil monkey",
        "category": "nature"
    },
    "1f412": {
        "id": "1f412",
        "name": "monkey",
        "category": "nature"
    },
    "1f414": {
        "id": "1f414",
        "name": "chicken",
        "category": "nature"
    },
    "1f427": {
        "id": "1f427",
        "name": "penguin",
        "category": "nature"
    },
    "1f426": {
        "id": "1f426",
        "name": "bird",
        "category": "nature"
    },
    "1f424": {
        "id": "1f424",
        "name": "baby chick",
        "category": "nature"
    },
    "1f423": {
        "id": "1f423",
        "name": "hatching chick",
        "category": "nature"
    },
    "1f425": {
        "id": "1f425",
        "name": "front-facing baby chick",
        "category": "nature"
    },
    "1f986": {
        "id": "1f986",
        "name": "duck",
        "category": "nature"
    },
    "1f9a2": {
        "id": "1f9a2",
        "name": "swan",
        "category": "nature"
    },
    "1f985": {
        "id": "1f985",
        "name": "eagle",
        "category": "nature"
    },
    "1f989": {
        "id": "1f989",
        "name": "owl",
        "category": "nature"
    },
    "1f99c": {
        "id": "1f99c",
        "name": "parrot",
        "category": "nature"
    },
    "1f99a": {
        "id": "1f99a",
        "name": "peacock",
        "category": "nature"
    },
    "1f987": {
        "id": "1f987",
        "name": "bat",
        "category": "nature"
    },
    "1f43a": {
        "id": "1f43a",
        "name": "wolf face",
        "category": "nature"
    },
    "1f417": {
        "id": "1f417",
        "name": "boar",
        "category": "nature"
    },
    "1f434": {
        "id": "1f434",
        "name": "horse face",
        "category": "nature"
    },
    "1f984": {
        "id": "1f984",
        "name": "unicorn face",
        "category": "nature"
    },
    "1f41d": {
        "id": "1f41d",
        "name": "honeybee",
        "category": "nature"
    },
    "1f41b": {
        "id": "1f41b",
        "name": "bug",
        "category": "nature"
    },
    "1f98b": {
        "id": "1f98b",
        "name": "butterfly",
        "category": "nature"
    },
    "1f40c": {
        "id": "1f40c",
        "name": "snail",
        "category": "nature"
    },
    "1f41a": {
        "id": "1f41a",
        "name": "spiral shell",
        "category": "nature"
    },
    "1f41e": {
        "id": "1f41e",
        "name": "lady beetle",
        "category": "nature"
    },
    "1f41c": {
        "id": "1f41c",
        "name": "ant",
        "category": "nature"
    },
    "1f997": {
        "id": "1f997",
        "name": "cricket",
        "category": "nature"
    },
    "1f577": {
        "id": "1f577",
        "name": "spider",
        "category": "nature"
    },
    "1f578": {
        "id": "1f578",
        "name": "spider web",
        "category": "nature"
    },
    "1f982": {
        "id": "1f982",
        "name": "scorpion",
        "category": "nature"
    },
    "1f99f": {
        "id": "1f99f",
        "name": "mosquito",
        "category": "nature"
    },
    "1f9a0": {
        "id": "1f9a0",
        "name": "microbe",
        "category": "nature"
    },
    "1f422": {
        "id": "1f422",
        "name": "turtle",
        "category": "nature"
    },
    "1f40d": {
        "id": "1f40d",
        "name": "snake",
        "category": "nature"
    },
    "1f98e": {
        "id": "1f98e",
        "name": "lizard",
        "category": "nature"
    },
    "1f996": {
        "id": "1f996",
        "name": "T-Rex",
        "category": "nature"
    },
    "1f995": {
        "id": "1f995",
        "name": "sauropod",
        "category": "nature"
    },
    "1f419": {
        "id": "1f419",
        "name": "octopus",
        "category": "nature"
    },
    "1f991": {
        "id": "1f991",
        "name": "squid",
        "category": "nature"
    },
    "1f990": {
        "id": "1f990",
        "name": "shrimp",
        "category": "nature"
    },
    "1f980": {
        "id": "1f980",
        "name": "crab",
        "category": "nature"
    },
    "1f99e": {
        "id": "1f99e",
        "name": "lobster",
        "category": "nature"
    },
    "1f421": {
        "id": "1f421",
        "name": "blowfish",
        "category": "nature"
    },
    "1f420": {
        "id": "1f420",
        "name": "tropical fish",
        "category": "nature"
    },
    "1f41f": {
        "id": "1f41f",
        "name": "fish",
        "category": "nature"
    },
    "1f42c": {
        "id": "1f42c",
        "name": "dolphin",
        "category": "nature"
    },
    "1f433": {
        "id": "1f433",
        "name": "spouting whale",
        "category": "nature"
    },
    "1f40b": {
        "id": "1f40b",
        "name": "whale",
        "category": "nature"
    },
    "1f988": {
        "id": "1f988",
        "name": "shark",
        "category": "nature"
    },
    "1f40a": {
        "id": "1f40a",
        "name": "crocodile",
        "category": "nature"
    },
    "1f405": {
        "id": "1f405",
        "name": "tiger",
        "category": "nature"
    },
    "1f406": {
        "id": "1f406",
        "name": "leopard",
        "category": "nature"
    },
    "1f993": {
        "id": "1f993",
        "name": "zebra",
        "category": "nature"
    },
    "1f98d": {
        "id": "1f98d",
        "name": "gorilla",
        "category": "nature"
    },
    "1f418": {
        "id": "1f418",
        "name": "elephant",
        "category": "nature"
    },
    "1f98f": {
        "id": "1f98f",
        "name": "rhinoceros",
        "category": "nature"
    },
    "1f99b": {
        "id": "1f99b",
        "name": "hippopotamus",
        "category": "nature"
    },
    "1f42a": {
        "id": "1f42a",
        "name": "camel",
        "category": "nature"
    },
    "1f42b": {
        "id": "1f42b",
        "name": "two-hump camel",
        "category": "nature"
    },
    "1f992": {
        "id": "1f992",
        "name": "giraffe",
        "category": "nature"
    },
    "1f999": {
        "id": "1f999",
        "name": "llama",
        "category": "nature"
    },
    "1f403": {
        "id": "1f403",
        "name": "water buffalo",
        "category": "nature"
    },
    "1f402": {
        "id": "1f402",
        "name": "ox",
        "category": "nature"
    },
    "1f404": {
        "id": "1f404",
        "name": "cow",
        "category": "nature"
    },
    "1f40e": {
        "id": "1f40e",
        "name": "horse",
        "category": "nature"
    },
    "1f416": {
        "id": "1f416",
        "name": "pig",
        "category": "nature"
    },
    "1f40f": {
        "id": "1f40f",
        "name": "ram",
        "category": "nature"
    },
    "1f411": {
        "id": "1f411",
        "name": "ewe",
        "category": "nature"
    },
    "1f410": {
        "id": "1f410",
        "name": "goat",
        "category": "nature"
    },
    "1f98c": {
        "id": "1f98c",
        "name": "deer",
        "category": "nature"
    },
    "1f415": {
        "id": "1f415",
        "name": "dog",
        "category": "nature"
    },
    "1f429": {
        "id": "1f429",
        "name": "poodle",
        "category": "nature"
    },
    "1f408": {
        "id": "1f408",
        "name": "cat",
        "category": "nature"
    },
    "1f413": {
        "id": "1f413",
        "name": "rooster",
        "category": "nature"
    },
    "1f983": {
        "id": "1f983",
        "name": "turkey",
        "category": "nature"
    },
    "1f54a": {
        "id": "1f54a",
        "name": "dove",
        "category": "nature"
    },
    "1f407": {
        "id": "1f407",
        "name": "rabbit",
        "category": "nature"
    },
    "1f401": {
        "id": "1f401",
        "name": "mouse",
        "category": "nature"
    },
    "1f400": {
        "id": "1f400",
        "name": "rat",
        "category": "nature"
    },
    "1f43f": {
        "id": "1f43f",
        "name": "chipmunk",
        "category": "nature"
    },
    "1f994": {
        "id": "1f994",
        "name": "hedgehog",
        "category": "nature"
    },
    "1f43e": {
        "id": "1f43e",
        "name": "paw prints",
        "category": "nature"
    },
    "1f409": {
        "id": "1f409",
        "name": "dragon",
        "category": "nature"
    },
    "1f432": {
        "id": "1f432",
        "name": "dragon face",
        "category": "nature"
    },
    "1f335": {
        "id": "1f335",
        "name": "cactus",
        "category": "nature"
    },
    "1f384": {
        "id": "1f384",
        "name": "Christmas tree",
        "category": "nature"
    },
    "1f332": {
        "id": "1f332",
        "name": "evergreen tree",
        "category": "nature"
    },
    "1f333": {
        "id": "1f333",
        "name": "deciduous tree",
        "category": "nature"
    },
    "1f334": {
        "id": "1f334",
        "name": "palm tree",
        "category": "nature"
    },
    "1f331": {
        "id": "1f331",
        "name": "seedling",
        "category": "nature"
    },
    "1f33f": {
        "id": "1f33f",
        "name": "herb",
        "category": "nature"
    },
    "1f340": {
        "id": "1f340",
        "name": "four leaf clover",
        "category": "nature"
    },
    "1f38d": {
        "id": "1f38d",
        "name": "pine decoration",
        "category": "nature"
    },
    "1f38b": {
        "id": "1f38b",
        "name": "tanabata tree",
        "category": "nature"
    },
    "1f343": {
        "id": "1f343",
        "name": "leaf fluttering in wind",
        "category": "nature"
    },
    "1f342": {
        "id": "1f342",
        "name": "fallen leaf",
        "category": "nature"
    },
    "1f341": {
        "id": "1f341",
        "name": "maple leaf",
        "category": "nature"
    },
    "1f344": {
        "id": "1f344",
        "name": "mushroom",
        "category": "nature"
    },
    "1f33e": {
        "id": "1f33e",
        "name": "sheaf of rice",
        "category": "nature"
    },
    "1f490": {
        "id": "1f490",
        "name": "bouquet",
        "category": "nature"
    },
    "1f337": {
        "id": "1f337",
        "name": "tulip",
        "category": "nature"
    },
    "1f339": {
        "id": "1f339",
        "name": "rose",
        "category": "nature"
    },
    "1f940": {
        "id": "1f940",
        "name": "wilted flower",
        "category": "nature"
    },
    "1f33a": {
        "id": "1f33a",
        "name": "hibiscus",
        "category": "nature"
    },
    "1f338": {
        "id": "1f338",
        "name": "cherry blossom",
        "category": "nature"
    },
    "1f33c": {
        "id": "1f33c",
        "name": "blossom",
        "category": "nature"
    },
    "1f33b": {
        "id": "1f33b",
        "name": "sunflower",
        "category": "nature"
    },
    "1f31e": {
        "id": "1f31e",
        "name": "sun with face",
        "category": "nature"
    },
    "1f31d": {
        "id": "1f31d",
        "name": "full moon face",
        "category": "nature"
    },
    "1f31b": {
        "id": "1f31b",
        "name": "first quarter moon face",
        "category": "nature"
    },
    "1f31c": {
        "id": "1f31c",
        "name": "last quarter moon face",
        "category": "nature"
    },
    "1f31a": {
        "id": "1f31a",
        "name": "new moon face",
        "category": "nature"
    },
    "1f315": {
        "id": "1f315",
        "name": "full moon",
        "category": "nature"
    },
    "1f316": {
        "id": "1f316",
        "name": "waning gibbous moon",
        "category": "nature"
    },
    "1f317": {
        "id": "1f317",
        "name": "last quarter moon",
        "category": "nature"
    },
    "1f318": {
        "id": "1f318",
        "name": "waning crescent moon",
        "category": "nature"
    },
    "1f311": {
        "id": "1f311",
        "name": "new moon",
        "category": "nature"
    },
    "1f312": {
        "id": "1f312",
        "name": "waxing crescent moon",
        "category": "nature"
    },
    "1f313": {
        "id": "1f313",
        "name": "first quarter moon",
        "category": "nature"
    },
    "1f314": {
        "id": "1f314",
        "name": "waxing gibbous moon",
        "category": "nature"
    },
    "1f319": {
        "id": "1f319",
        "name": "crescent moon",
        "category": "nature"
    },
    "1f30e": {
        "id": "1f30e",
        "name": "globe showing Americas",
        "category": "nature"
    },
    "1f30d": {
        "id": "1f30d",
        "name": "globe showing Europe-Africa",
        "category": "nature"
    },
    "1f30f": {
        "id": "1f30f",
        "name": "globe showing Asia-Australia",
        "category": "nature"
    },
    "1f4ab": {
        "id": "1f4ab",
        "name": "dizzy",
        "category": "nature"
    },
    "2b50": {
        "id": "2b50",
        "name": "star",
        "category": "nature"
    },
    "1f31f": {
        "id": "1f31f",
        "name": "glowing star",
        "category": "nature"
    },
    "26a1": {
        "id": "26a1",
        "name": "high voltage",
        "category": "nature"
    },
    "1f4a5": {
        "id": "1f4a5",
        "name": "collision",
        "category": "nature"
    },
    "1f525": {
        "id": "1f525",
        "name": "fire",
        "category": "nature"
    },
    "1f32a": {
        "id": "1f32a",
        "name": "tornado",
        "category": "nature"
    },
    "1f308": {
        "id": "1f308",
        "name": "rainbow",
        "category": "nature"
    },
    "1f324": {
        "id": "1f324",
        "name": "sun behind small cloud",
        "category": "nature"
    },
    "26c5": {
        "id": "26c5",
        "name": "sun behind cloud",
        "category": "nature"
    },
    "1f325": {
        "id": "1f325",
        "name": "sun behind large cloud",
        "category": "nature"
    },
    "1f326": {
        "id": "1f326",
        "name": "sun behind rain cloud",
        "category": "nature"
    },
    "1f327": {
        "id": "1f327",
        "name": "cloud with rain",
        "category": "nature"
    },
    "26c8": {
        "id": "26c8",
        "name": "cloud with lightning and rain",
        "category": "nature"
    },
    "1f329": {
        "id": "1f329",
        "name": "cloud with lightning",
        "category": "nature"
    },
    "1f328": {
        "id": "1f328",
        "name": "cloud with snow",
        "category": "nature"
    },
    "26c4": {
        "id": "26c4",
        "name": "snowman without snow",
        "category": "nature"
    },
    "1f32c": {
        "id": "1f32c",
        "name": "wind face",
        "category": "nature"
    },
    "1f4a8": {
        "id": "1f4a8",
        "name": "dashing away",
        "category": "nature"
    },
    "1f4a7": {
        "id": "1f4a7",
        "name": "droplet",
        "category": "nature"
    },
    "1f4a6": {
        "id": "1f4a6",
        "name": "sweat droplets",
        "category": "nature"
    },
    "1f30a": {
        "id": "1f30a",
        "name": "water wave",
        "category": "nature"
    },
    "1f32b": {
        "id": "1f32b",
        "name": "fog",
        "category": "nature"
    },
    "1f34f": {
        "id": "1f34f",
        "name": "green apple",
        "category": "food"
    },
    "1f34e": {
        "id": "1f34e",
        "name": "red apple",
        "category": "food"
    },
    "1f350": {
        "id": "1f350",
        "name": "pear",
        "category": "food"
    },
    "1f34a": {
        "id": "1f34a",
        "name": "tangerine",
        "category": "food"
    },
    "1f34b": {
        "id": "1f34b",
        "name": "lemon",
        "category": "food"
    },
    "1f34c": {
        "id": "1f34c",
        "name": "banana",
        "category": "food"
    },
    "1f349": {
        "id": "1f349",
        "name": "watermelon",
        "category": "food"
    },
    "1f347": {
        "id": "1f347",
        "name": "grapes",
        "category": "food"
    },
    "1f353": {
        "id": "1f353",
        "name": "strawberry",
        "category": "food"
    },
    "1f348": {
        "id": "1f348",
        "name": "melon",
        "category": "food"
    },
    "1f352": {
        "id": "1f352",
        "name": "cherries",
        "category": "food"
    },
    "1f351": {
        "id": "1f351",
        "name": "peach",
        "category": "food"
    },
    "1f96d": {
        "id": "1f96d",
        "name": "mango",
        "category": "food"
    },
    "1f34d": {
        "id": "1f34d",
        "name": "pineapple",
        "category": "food"
    },
    "1f965": {
        "id": "1f965",
        "name": "coconut",
        "category": "food"
    },
    "1f95d": {
        "id": "1f95d",
        "name": "kiwi fruit",
        "category": "food"
    },
    "1f345": {
        "id": "1f345",
        "name": "tomato",
        "category": "food"
    },
    "1f346": {
        "id": "1f346",
        "name": "eggplant",
        "category": "food"
    },
    "1f951": {
        "id": "1f951",
        "name": "avocado",
        "category": "food"
    },
    "1f966": {
        "id": "1f966",
        "name": "broccoli",
        "category": "food"
    },
    "1f96c": {
        "id": "1f96c",
        "name": "leafy green",
        "category": "food"
    },
    "1f952": {
        "id": "1f952",
        "name": "cucumber",
        "category": "food"
    },
    "1f336": {
        "id": "1f336",
        "name": "hot pepper",
        "category": "food"
    },
    "1f33d": {
        "id": "1f33d",
        "name": "ear of corn",
        "category": "food"
    },
    "1f955": {
        "id": "1f955",
        "name": "carrot",
        "category": "food"
    },
    "1f954": {
        "id": "1f954",
        "name": "potato",
        "category": "food"
    },
    "1f360": {
        "id": "1f360",
        "name": "roasted sweet potato",
        "category": "food"
    },
    "1f950": {
        "id": "1f950",
        "name": "croissant",
        "category": "food"
    },
    "1f35e": {
        "id": "1f35e",
        "name": "bread",
        "category": "food"
    },
    "1f956": {
        "id": "1f956",
        "name": "baguette bread",
        "category": "food"
    },
    "1f968": {
        "id": "1f968",
        "name": "pretzel",
        "category": "food"
    },
    "1f96f": {
        "id": "1f96f",
        "name": "bagel",
        "category": "food"
    },
    "1f9c0": {
        "id": "1f9c0",
        "name": "cheese wedge",
        "category": "food"
    },
    "1f95a": {
        "id": "1f95a",
        "name": "egg",
        "category": "food"
    },
    "1f373": {
        "id": "1f373",
        "name": "cooking",
        "category": "food"
    },
    "1f95e": {
        "id": "1f95e",
        "name": "pancakes",
        "category": "food"
    },
    "1f953": {
        "id": "1f953",
        "name": "bacon",
        "category": "food"
    },
    "1f969": {
        "id": "1f969",
        "name": "cut of meat",
        "category": "food"
    },
    "1f357": {
        "id": "1f357",
        "name": "poultry leg",
        "category": "food"
    },
    "1f356": {
        "id": "1f356",
        "name": "meat on bone",
        "category": "food"
    },
    "1f32d": {
        "id": "1f32d",
        "name": "hot dog",
        "category": "food"
    },
    "1f354": {
        "id": "1f354",
        "name": "hamburger",
        "category": "food"
    },
    "1f35f": {
        "id": "1f35f",
        "name": "french fries",
        "category": "food"
    },
    "1f355": {
        "id": "1f355",
        "name": "pizza",
        "category": "food"
    },
    "1f96a": {
        "id": "1f96a",
        "name": "sandwich",
        "category": "food"
    },
    "1f959": {
        "id": "1f959",
        "name": "stuffed flatbread",
        "category": "food"
    },
    "1f32e": {
        "id": "1f32e",
        "name": "taco",
        "category": "food"
    },
    "1f32f": {
        "id": "1f32f",
        "name": "burrito",
        "category": "food"
    },
    "1f957": {
        "id": "1f957",
        "name": "green salad",
        "category": "food"
    },
    "1f958": {
        "id": "1f958",
        "name": "shallow pan of food",
        "category": "food"
    },
    "1f96b": {
        "id": "1f96b",
        "name": "canned food",
        "category": "food"
    },
    "1f35d": {
        "id": "1f35d",
        "name": "spaghetti",
        "category": "food"
    },
    "1f35c": {
        "id": "1f35c",
        "name": "steaming bowl",
        "category": "food"
    },
    "1f372": {
        "id": "1f372",
        "name": "pot of food",
        "category": "food"
    },
    "1f35b": {
        "id": "1f35b",
        "name": "curry rice",
        "category": "food"
    },
    "1f363": {
        "id": "1f363",
        "name": "sushi",
        "category": "food"
    },
    "1f371": {
        "id": "1f371",
        "name": "bento box",
        "category": "food"
    },
    "1f364": {
        "id": "1f364",
        "name": "fried shrimp",
        "category": "food"
    },
    "1f359": {
        "id": "1f359",
        "name": "rice ball",
        "category": "food"
    },
    "1f35a": {
        "id": "1f35a",
        "name": "cooked rice",
        "category": "food"
    },
    "1f358": {
        "id": "1f358",
        "name": "rice cracker",
        "category": "food"
    },
    "1f365": {
        "id": "1f365",
        "name": "fish cake with swirl",
        "category": "food"
    },
    "1f960": {
        "id": "1f960",
        "name": "fortune cookie",
        "category": "food"
    },
    "1f362": {
        "id": "1f362",
        "name": "oden",
        "category": "food"
    },
    "1f361": {
        "id": "1f361",
        "name": "dango",
        "category": "food"
    },
    "1f367": {
        "id": "1f367",
        "name": "shaved ice",
        "category": "food"
    },
    "1f368": {
        "id": "1f368",
        "name": "ice cream",
        "category": "food"
    },
    "1f366": {
        "id": "1f366",
        "name": "soft ice cream",
        "category": "food"
    },
    "1f967": {
        "id": "1f967",
        "name": "pie",
        "category": "food"
    },
    "1f370": {
        "id": "1f370",
        "name": "shortcake",
        "category": "food"
    },
    "1f382": {
        "id": "1f382",
        "name": "birthday cake",
        "category": "food"
    },
    "1f96e": {
        "id": "1f96e",
        "name": "moon cake",
        "category": "food"
    },
    "1f9c1": {
        "id": "1f9c1",
        "name": "cupcake",
        "category": "food"
    },
    "1f36e": {
        "id": "1f36e",
        "name": "custard",
        "category": "food"
    },
    "1f36d": {
        "id": "1f36d",
        "name": "lollipop",
        "category": "food"
    },
    "1f36c": {
        "id": "1f36c",
        "name": "candy",
        "category": "food"
    },
    "1f36b": {
        "id": "1f36b",
        "name": "chocolate bar",
        "category": "food"
    },
    "1f37f": {
        "id": "1f37f",
        "name": "popcorn",
        "category": "food"
    },
    "1f9c2": {
        "id": "1f9c2",
        "name": "salt",
        "category": "food"
    },
    "1f369": {
        "id": "1f369",
        "name": "doughnut",
        "category": "food"
    },
    "1f95f": {
        "id": "1f95f",
        "name": "dumpling",
        "category": "food"
    },
    "1f36a": {
        "id": "1f36a",
        "name": "cookie",
        "category": "food"
    },
    "1f330": {
        "id": "1f330",
        "name": "chestnut",
        "category": "food"
    },
    "1f95c": {
        "id": "1f95c",
        "name": "peanuts",
        "category": "food"
    },
    "1f36f": {
        "id": "1f36f",
        "name": "honey pot",
        "category": "food"
    },
    "1f95b": {
        "id": "1f95b",
        "name": "glass of milk",
        "category": "food"
    },
    "1f37c": {
        "id": "1f37c",
        "name": "baby bottle",
        "category": "food"
    },
    "1f375": {
        "id": "1f375",
        "name": "teacup without handle",
        "category": "food"
    },
    "1f964": {
        "id": "1f964",
        "name": "cup with straw",
        "category": "food"
    },
    "1f376": {
        "id": "1f376",
        "name": "sake",
        "category": "food"
    },
    "1f37a": {
        "id": "1f37a",
        "name": "beer mug",
        "category": "food"
    },
    "1f37b": {
        "id": "1f37b",
        "name": "clinking beer mugs",
        "category": "food"
    },
    "1f942": {
        "id": "1f942",
        "name": "clinking glasses",
        "category": "food"
    },
    "1f377": {
        "id": "1f377",
        "name": "wine glass",
        "category": "food"
    },
    "1f943": {
        "id": "1f943",
        "name": "tumbler glass",
        "category": "food"
    },
    "1f378": {
        "id": "1f378",
        "name": "cocktail glass",
        "category": "food"
    },
    "1f379": {
        "id": "1f379",
        "name": "tropical drink",
        "category": "food"
    },
    "1f37e": {
        "id": "1f37e",
        "name": "bottle with popping cork",
        "category": "food"
    },
    "1f944": {
        "id": "1f944",
        "name": "spoon",
        "category": "food"
    },
    "1f374": {
        "id": "1f374",
        "name": "fork and knife",
        "category": "food"
    },
    "1f37d": {
        "id": "1f37d",
        "name": "fork and knife with plate",
        "category": "food"
    },
    "1f963": {
        "id": "1f963",
        "name": "bowl with spoon",
        "category": "food"
    },
    "1f961": {
        "id": "1f961",
        "name": "takeout box",
        "category": "food"
    },
    "1f962": {
        "id": "1f962",
        "name": "chopsticks",
        "category": "food"
    },
    "1f600": {
        "id": "1f600",
        "name": "grinning face",
        "category": "people"
    },
    "1f603": {
        "id": "1f603",
        "name": "grinning face with big eyes",
        "category": "people"
    },
    "1f604": {
        "id": "1f604",
        "name": "grinning face with smiling eyes",
        "category": "people"
    },
    "1f601": {
        "id": "1f601",
        "name": "beaming face with smiling eyes",
        "category": "people"
    },
    "1f606": {
        "id": "1f606",
        "name": "grinning squinting face",
        "category": "people"
    },
    "1f605": {
        "id": "1f605",
        "name": "grinning face with sweat",
        "category": "people"
    },
    "1f602": {
        "id": "1f602",
        "name": "face with tears of joy",
        "category": "people"
    },
    "1f923": {
        "id": "1f923",
        "name": "rolling on the floor laughing",
        "category": "people"
    },
    "263a": {
        "id": "263a",
        "name": "smiling face",
        "category": "people"
    },
    "1f60a": {
        "id": "1f60a",
        "name": "smiling face with smiling eyes",
        "category": "people"
    },
    "1f607": {
        "id": "1f607",
        "name": "smiling face with halo",
        "category": "people"
    },
    "1f642": {
        "id": "1f642",
        "name": "slightly smiling face",
        "category": "people"
    },
    "1f643": {
        "id": "1f643",
        "name": "upside-down face",
        "category": "people"
    },
    "1f609": {
        "id": "1f609",
        "name": "winking face",
        "category": "people"
    },
    "1f60c": {
        "id": "1f60c",
        "name": "relieved face",
        "category": "people"
    },
    "1f60d": {
        "id": "1f60d",
        "name": "smiling face with heart-eyes",
        "category": "people"
    },
    "1f618": {
        "id": "1f618",
        "name": "face blowing a kiss",
        "category": "people"
    },
    "1f970": {
        "id": "1f970",
        "name": "smiling face with 3 hearts",
        "category": "people"
    },
    "1f617": {
        "id": "1f617",
        "name": "kissing face",
        "category": "people"
    },
    "1f619": {
        "id": "1f619",
        "name": "kissing face with smiling eyes",
        "category": "people"
    },
    "1f61a": {
        "id": "1f61a",
        "name": "kissing face with closed eyes",
        "category": "people"
    },
    "1f60b": {
        "id": "1f60b",
        "name": "face savoring food",
        "category": "people"
    },
    "1f61b": {
        "id": "1f61b",
        "name": "face with tongue",
        "category": "people"
    },
    "1f61d": {
        "id": "1f61d",
        "name": "squinting face with tongue",
        "category": "people"
    },
    "1f61c": {
        "id": "1f61c",
        "name": "winking face with tongue",
        "category": "people"
    },
    "1f92a": {
        "id": "1f92a",
        "name": "zany face",
        "category": "people"
    },
    "1f928": {
        "id": "1f928",
        "name": "face with raised eyebrow",
        "category": "people"
    },
    "1f9d0": {
        "id": "1f9d0",
        "name": "face with monocle",
        "category": "people"
    },
    "1f913": {
        "id": "1f913",
        "name": "nerd face",
        "category": "people"
    },
    "1f60e": {
        "id": "1f60e",
        "name": "smiling face with sunglasses",
        "category": "people"
    },
    "1f929": {
        "id": "1f929",
        "name": "star-struck",
        "category": "people"
    },
    "1f973": {
        "id": "1f973",
        "name": "partying face",
        "category": "people"
    },
    "1f60f": {
        "id": "1f60f",
        "name": "smirking face",
        "category": "people"
    },
    "1f612": {
        "id": "1f612",
        "name": "unamused face",
        "category": "people"
    },
    "1f61e": {
        "id": "1f61e",
        "name": "disappointed face",
        "category": "people"
    },
    "1f614": {
        "id": "1f614",
        "name": "pensive face",
        "category": "people"
    },
    "1f61f": {
        "id": "1f61f",
        "name": "worried face",
        "category": "people"
    },
    "1f615": {
        "id": "1f615",
        "name": "confused face",
        "category": "people"
    },
    "1f641": {
        "id": "1f641",
        "name": "slightly frowning face",
        "category": "people"
    },
    "1f623": {
        "id": "1f623",
        "name": "persevering face",
        "category": "people"
    },
    "1f616": {
        "id": "1f616",
        "name": "confounded face",
        "category": "people"
    },
    "1f62b": {
        "id": "1f62b",
        "name": "tired face",
        "category": "people"
    },
    "1f629": {
        "id": "1f629",
        "name": "weary face",
        "category": "people"
    },
    "1f622": {
        "id": "1f622",
        "name": "crying face",
        "category": "people"
    },
    "1f62d": {
        "id": "1f62d",
        "name": "loudly crying face",
        "category": "people"
    },
    "1f624": {
        "id": "1f624",
        "name": "face with steam from nose",
        "category": "people"
    },
    "1f620": {
        "id": "1f620",
        "name": "angry face",
        "category": "people"
    },
    "1f621": {
        "id": "1f621",
        "name": "pouting face",
        "category": "people"
    },
    "1f92c": {
        "id": "1f92c",
        "name": "face with symbols on mouth",
        "category": "people"
    },
    "1f92f": {
        "id": "1f92f",
        "name": "exploding head",
        "category": "people"
    },
    "1f633": {
        "id": "1f633",
        "name": "flushed face",
        "category": "people"
    },
    "1f631": {
        "id": "1f631",
        "name": "face screaming in fear",
        "category": "people"
    },
    "1f628": {
        "id": "1f628",
        "name": "fearful face",
        "category": "people"
    },
    "1f630": {
        "id": "1f630",
        "name": "anxious face with sweat",
        "category": "people"
    },
    "1f975": {
        "id": "1f975",
        "name": "hot face",
        "category": "people"
    },
    "1f976": {
        "id": "1f976",
        "name": "cold face",
        "category": "people"
    },
    "1f97a": {
        "id": "1f97a",
        "name": "pleading face",
        "category": "people"
    },
    "1f625": {
        "id": "1f625",
        "name": "sad but relieved face",
        "category": "people"
    },
    "1f613": {
        "id": "1f613",
        "name": "downcast face with sweat",
        "category": "people"
    },
    "1f917": {
        "id": "1f917",
        "name": "hugging face",
        "category": "people"
    },
    "1f914": {
        "id": "1f914",
        "name": "thinking face",
        "category": "people"
    },
    "1f92d": {
        "id": "1f92d",
        "name": "face with hand over mouth",
        "category": "people"
    },
    "1f92b": {
        "id": "1f92b",
        "name": "shushing face",
        "category": "people"
    },
    "1f925": {
        "id": "1f925",
        "name": "lying face",
        "category": "people"
    },
    "1f636": {
        "id": "1f636",
        "name": "face without mouth",
        "category": "people"
    },
    "1f610": {
        "id": "1f610",
        "name": "neutral face",
        "category": "people"
    },
    "1f611": {
        "id": "1f611",
        "name": "expressionless face",
        "category": "people"
    },
    "1f62c": {
        "id": "1f62c",
        "name": "grimacing face",
        "category": "people"
    },
    "1f644": {
        "id": "1f644",
        "name": "face with rolling eyes",
        "category": "people"
    },
    "1f62f": {
        "id": "1f62f",
        "name": "hushed face",
        "category": "people"
    },
    "1f626": {
        "id": "1f626",
        "name": "frowning face with open mouth",
        "category": "people"
    },
    "1f627": {
        "id": "1f627",
        "name": "anguished face",
        "category": "people"
    },
    "1f62e": {
        "id": "1f62e",
        "name": "face with open mouth",
        "category": "people"
    },
    "1f632": {
        "id": "1f632",
        "name": "astonished face",
        "category": "people"
    },
    "1f634": {
        "id": "1f634",
        "name": "sleeping face",
        "category": "people"
    },
    "1f924": {
        "id": "1f924",
        "name": "drooling face",
        "category": "people"
    },
    "1f62a": {
        "id": "1f62a",
        "name": "sleepy face",
        "category": "people"
    },
    "1f635": {
        "id": "1f635",
        "name": "dizzy face",
        "category": "people"
    },
    "1f910": {
        "id": "1f910",
        "name": "zipper-mouth face",
        "category": "people"
    },
    "1f974": {
        "id": "1f974",
        "name": "woozy face",
        "category": "people"
    },
    "1f922": {
        "id": "1f922",
        "name": "nauseated face",
        "category": "people"
    },
    "1f92e": {
        "id": "1f92e",
        "name": "face vomiting",
        "category": "people"
    },
    "1f927": {
        "id": "1f927",
        "name": "sneezing face",
        "category": "people"
    },
    "1f637": {
        "id": "1f637",
        "name": "face with medical mask",
        "category": "people"
    },
    "1f912": {
        "id": "1f912",
        "name": "face with thermometer",
        "category": "people"
    },
    "1f915": {
        "id": "1f915",
        "name": "face with head-bandage",
        "category": "people"
    },
    "1f911": {
        "id": "1f911",
        "name": "money-mouth face",
        "category": "people"
    },
    "1f920": {
        "id": "1f920",
        "name": "cowboy hat face",
        "category": "people"
    },
    "1f608": {
        "id": "1f608",
        "name": "smiling face with horns",
        "category": "people"
    },
    "1f47f": {
        "id": "1f47f",
        "name": "angry face with horns",
        "category": "people"
    },
    "1f479": {
        "id": "1f479",
        "name": "ogre",
        "category": "people"
    },
    "1f47a": {
        "id": "1f47a",
        "name": "goblin",
        "category": "people"
    },
    "1f921": {
        "id": "1f921",
        "name": "clown face",
        "category": "people"
    },
    "1f4a9": {
        "id": "1f4a9",
        "name": "pile of poo",
        "category": "people"
    },
    "1f47b": {
        "id": "1f47b",
        "name": "ghost",
        "category": "people"
    },
    "1f480": {
        "id": "1f480",
        "name": "skull",
        "category": "people"
    },
    "1f47d": {
        "id": "1f47d",
        "name": "alien",
        "category": "people"
    },
    "1f47e": {
        "id": "1f47e",
        "name": "alien monster",
        "category": "people"
    },
    "1f916": {
        "id": "1f916",
        "name": "robot face",
        "category": "people"
    },
    "1f383": {
        "id": "1f383",
        "name": "jack-o-lantern",
        "category": "people"
    },
    "1f63a": {
        "id": "1f63a",
        "name": "grinning cat face",
        "category": "people"
    },
    "1f638": {
        "id": "1f638",
        "name": "grinning cat face with smiling eyes",
        "category": "people"
    },
    "1f639": {
        "id": "1f639",
        "name": "cat face with tears of joy",
        "category": "people"
    },
    "1f63b": {
        "id": "1f63b",
        "name": "smiling cat face with heart-eyes",
        "category": "people"
    },
    "1f63c": {
        "id": "1f63c",
        "name": "cat face with wry smile",
        "category": "people"
    },
    "1f63d": {
        "id": "1f63d",
        "name": "kissing cat face",
        "category": "people"
    },
    "1f640": {
        "id": "1f640",
        "name": "weary cat face",
        "category": "people"
    },
    "1f63f": {
        "id": "1f63f",
        "name": "crying cat face",
        "category": "people"
    },
    "1f63e": {
        "id": "1f63e",
        "name": "pouting cat face",
        "category": "people"
    },
    "1f932": {
        "id": "1f932",
        "name": "palms up together",
        "category": "people",
        "diversities": [
            "1f932-1f3fb",
            "1f932-1f3fc",
            "1f932-1f3fd",
            "1f932-1f3fe",
            "1f932-1f3ff"
        ]
    },
    "1f932-1f3fb": {
        "id": "1f932-1f3fb",
        "name": "palms up together: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f932-1f3fc": {
        "id": "1f932-1f3fc",
        "name": "palms up together: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f932-1f3fd": {
        "id": "1f932-1f3fd",
        "name": "palms up together: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f932-1f3fe": {
        "id": "1f932-1f3fe",
        "name": "palms up together: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f932-1f3ff": {
        "id": "1f932-1f3ff",
        "name": "palms up together: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f450": {
        "id": "1f450",
        "name": "open hands",
        "category": "people",
        "diversities": [
            "1f450-1f3fb",
            "1f450-1f3fc",
            "1f450-1f3fd",
            "1f450-1f3fe",
            "1f450-1f3ff"
        ]
    },
    "1f450-1f3fb": {
        "id": "1f450-1f3fb",
        "name": "open hands: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f450-1f3fc": {
        "id": "1f450-1f3fc",
        "name": "open hands: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f450-1f3fd": {
        "id": "1f450-1f3fd",
        "name": "open hands: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f450-1f3fe": {
        "id": "1f450-1f3fe",
        "name": "open hands: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f450-1f3ff": {
        "id": "1f450-1f3ff",
        "name": "open hands: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f64c": {
        "id": "1f64c",
        "name": "raising hands",
        "category": "people",
        "diversities": [
            "1f64c-1f3fb",
            "1f64c-1f3fc",
            "1f64c-1f3fd",
            "1f64c-1f3fe",
            "1f64c-1f3ff"
        ]
    },
    "1f64c-1f3fb": {
        "id": "1f64c-1f3fb",
        "name": "raising hands: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f64c-1f3fc": {
        "id": "1f64c-1f3fc",
        "name": "raising hands: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f64c-1f3fd": {
        "id": "1f64c-1f3fd",
        "name": "raising hands: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f64c-1f3fe": {
        "id": "1f64c-1f3fe",
        "name": "raising hands: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f64c-1f3ff": {
        "id": "1f64c-1f3ff",
        "name": "raising hands: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f44f": {
        "id": "1f44f",
        "name": "clapping hands",
        "category": "people",
        "diversities": [
            "1f44f-1f3fb",
            "1f44f-1f3fc",
            "1f44f-1f3fd",
            "1f44f-1f3fe",
            "1f44f-1f3ff"
        ]
    },
    "1f44f-1f3fb": {
        "id": "1f44f-1f3fb",
        "name": "clapping hands: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f44f-1f3fc": {
        "id": "1f44f-1f3fc",
        "name": "clapping hands: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f44f-1f3fd": {
        "id": "1f44f-1f3fd",
        "name": "clapping hands: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f44f-1f3fe": {
        "id": "1f44f-1f3fe",
        "name": "clapping hands: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f44f-1f3ff": {
        "id": "1f44f-1f3ff",
        "name": "clapping hands: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f91d": {
        "id": "1f91d",
        "name": "handshake",
        "category": "people"
    },
    "1f44d": {
        "id": "1f44d",
        "name": "thumbs up",
        "category": "people",
        "diversities": [
            "1f44d-1f3fb",
            "1f44d-1f3fc",
            "1f44d-1f3fd",
            "1f44d-1f3fe",
            "1f44d-1f3ff"
        ]
    },
    "1f44d-1f3fb": {
        "id": "1f44d-1f3fb",
        "name": "thumbs up: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f44d-1f3fc": {
        "id": "1f44d-1f3fc",
        "name": "thumbs up: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f44d-1f3fd": {
        "id": "1f44d-1f3fd",
        "name": "thumbs up: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f44d-1f3fe": {
        "id": "1f44d-1f3fe",
        "name": "thumbs up: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f44d-1f3ff": {
        "id": "1f44d-1f3ff",
        "name": "thumbs up: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f44e": {
        "id": "1f44e",
        "name": "thumbs down",
        "category": "people",
        "diversities": [
            "1f44e-1f3fb",
            "1f44e-1f3fc",
            "1f44e-1f3fd",
            "1f44e-1f3fe",
            "1f44e-1f3ff"
        ]
    },
    "1f44e-1f3fb": {
        "id": "1f44e-1f3fb",
        "name": "thumbs down: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f44e-1f3fc": {
        "id": "1f44e-1f3fc",
        "name": "thumbs down: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f44e-1f3fd": {
        "id": "1f44e-1f3fd",
        "name": "thumbs down: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f44e-1f3fe": {
        "id": "1f44e-1f3fe",
        "name": "thumbs down: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f44e-1f3ff": {
        "id": "1f44e-1f3ff",
        "name": "thumbs down: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f44a": {
        "id": "1f44a",
        "name": "oncoming fist",
        "category": "people",
        "diversities": [
            "1f44a-1f3fb",
            "1f44a-1f3fc",
            "1f44a-1f3fd",
            "1f44a-1f3fe",
            "1f44a-1f3ff"
        ]
    },
    "1f44a-1f3fb": {
        "id": "1f44a-1f3fb",
        "name": "oncoming fist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f44a-1f3fc": {
        "id": "1f44a-1f3fc",
        "name": "oncoming fist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f44a-1f3fd": {
        "id": "1f44a-1f3fd",
        "name": "oncoming fist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f44a-1f3fe": {
        "id": "1f44a-1f3fe",
        "name": "oncoming fist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f44a-1f3ff": {
        "id": "1f44a-1f3ff",
        "name": "oncoming fist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "270a": {
        "id": "270a",
        "name": "raised fist",
        "category": "people",
        "diversities": [
            "270a-1f3fb",
            "270a-1f3fc",
            "270a-1f3fd",
            "270a-1f3fe",
            "270a-1f3ff"
        ]
    },
    "270a-1f3fb": {
        "id": "270a-1f3fb",
        "name": "raised fist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "270a-1f3fc": {
        "id": "270a-1f3fc",
        "name": "raised fist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "270a-1f3fd": {
        "id": "270a-1f3fd",
        "name": "raised fist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "270a-1f3fe": {
        "id": "270a-1f3fe",
        "name": "raised fist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "270a-1f3ff": {
        "id": "270a-1f3ff",
        "name": "raised fist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f91b": {
        "id": "1f91b",
        "name": "left-facing fist",
        "category": "people",
        "diversities": [
            "1f91b-1f3fb",
            "1f91b-1f3fc",
            "1f91b-1f3fd",
            "1f91b-1f3fe",
            "1f91b-1f3ff"
        ]
    },
    "1f91b-1f3fb": {
        "id": "1f91b-1f3fb",
        "name": "left-facing fist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f91b-1f3fc": {
        "id": "1f91b-1f3fc",
        "name": "left-facing fist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f91b-1f3fd": {
        "id": "1f91b-1f3fd",
        "name": "left-facing fist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f91b-1f3fe": {
        "id": "1f91b-1f3fe",
        "name": "left-facing fist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f91b-1f3ff": {
        "id": "1f91b-1f3ff",
        "name": "left-facing fist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f91c": {
        "id": "1f91c",
        "name": "right-facing fist",
        "category": "people",
        "diversities": [
            "1f91c-1f3fb",
            "1f91c-1f3fc",
            "1f91c-1f3fd",
            "1f91c-1f3fe",
            "1f91c-1f3ff"
        ]
    },
    "1f91c-1f3fb": {
        "id": "1f91c-1f3fb",
        "name": "right-facing fist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f91c-1f3fc": {
        "id": "1f91c-1f3fc",
        "name": "right-facing fist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f91c-1f3fd": {
        "id": "1f91c-1f3fd",
        "name": "right-facing fist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f91c-1f3fe": {
        "id": "1f91c-1f3fe",
        "name": "right-facing fist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f91c-1f3ff": {
        "id": "1f91c-1f3ff",
        "name": "right-facing fist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f91e": {
        "id": "1f91e",
        "name": "crossed fingers",
        "category": "people",
        "diversities": [
            "1f91e-1f3fb",
            "1f91e-1f3fc",
            "1f91e-1f3fd",
            "1f91e-1f3fe",
            "1f91e-1f3ff"
        ]
    },
    "1f91e-1f3fb": {
        "id": "1f91e-1f3fb",
        "name": "crossed fingers: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f91e-1f3fc": {
        "id": "1f91e-1f3fc",
        "name": "crossed fingers: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f91e-1f3fd": {
        "id": "1f91e-1f3fd",
        "name": "crossed fingers: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f91e-1f3fe": {
        "id": "1f91e-1f3fe",
        "name": "crossed fingers: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f91e-1f3ff": {
        "id": "1f91e-1f3ff",
        "name": "crossed fingers: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "270c": {
        "id": "270c",
        "name": "victory hand",
        "category": "people",
        "diversities": [
            "270c-1f3fb",
            "270c-1f3fc",
            "270c-1f3fd",
            "270c-1f3fe",
            "270c-1f3ff"
        ]
    },
    "270c-1f3fb": {
        "id": "270c-1f3fb",
        "name": "victory hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "270c-1f3fc": {
        "id": "270c-1f3fc",
        "name": "victory hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "270c-1f3fd": {
        "id": "270c-1f3fd",
        "name": "victory hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "270c-1f3fe": {
        "id": "270c-1f3fe",
        "name": "victory hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "270c-1f3ff": {
        "id": "270c-1f3ff",
        "name": "victory hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f91f": {
        "id": "1f91f",
        "name": "love-you gesture",
        "category": "people",
        "diversities": [
            "1f91f-1f3fb",
            "1f91f-1f3fc",
            "1f91f-1f3fd",
            "1f91f-1f3fe",
            "1f91f-1f3ff"
        ]
    },
    "1f91f-1f3fb": {
        "id": "1f91f-1f3fb",
        "name": "love-you gesture: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f91f-1f3fc": {
        "id": "1f91f-1f3fc",
        "name": "love-you gesture: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f91f-1f3fd": {
        "id": "1f91f-1f3fd",
        "name": "love-you gesture: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f91f-1f3fe": {
        "id": "1f91f-1f3fe",
        "name": "love-you gesture: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f91f-1f3ff": {
        "id": "1f91f-1f3ff",
        "name": "love-you gesture: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f918": {
        "id": "1f918",
        "name": "sign of the horns",
        "category": "people",
        "diversities": [
            "1f918-1f3fb",
            "1f918-1f3fc",
            "1f918-1f3fd",
            "1f918-1f3fe",
            "1f918-1f3ff"
        ]
    },
    "1f918-1f3fb": {
        "id": "1f918-1f3fb",
        "name": "sign of the horns: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f918-1f3fc": {
        "id": "1f918-1f3fc",
        "name": "sign of the horns: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f918-1f3fd": {
        "id": "1f918-1f3fd",
        "name": "sign of the horns: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f918-1f3fe": {
        "id": "1f918-1f3fe",
        "name": "sign of the horns: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f918-1f3ff": {
        "id": "1f918-1f3ff",
        "name": "sign of the horns: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f44c": {
        "id": "1f44c",
        "name": "OK hand",
        "category": "people",
        "diversities": [
            "1f44c-1f3fb",
            "1f44c-1f3fc",
            "1f44c-1f3fd",
            "1f44c-1f3fe",
            "1f44c-1f3ff"
        ]
    },
    "1f44c-1f3fb": {
        "id": "1f44c-1f3fb",
        "name": "OK hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f44c-1f3fc": {
        "id": "1f44c-1f3fc",
        "name": "OK hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f44c-1f3fd": {
        "id": "1f44c-1f3fd",
        "name": "OK hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f44c-1f3fe": {
        "id": "1f44c-1f3fe",
        "name": "OK hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f44c-1f3ff": {
        "id": "1f44c-1f3ff",
        "name": "OK hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f448": {
        "id": "1f448",
        "name": "backhand index pointing left",
        "category": "people",
        "diversities": [
            "1f448-1f3fb",
            "1f448-1f3fc",
            "1f448-1f3fd",
            "1f448-1f3fe",
            "1f448-1f3ff"
        ]
    },
    "1f448-1f3fb": {
        "id": "1f448-1f3fb",
        "name": "backhand index pointing left: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f448-1f3fc": {
        "id": "1f448-1f3fc",
        "name": "backhand index pointing left: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f448-1f3fd": {
        "id": "1f448-1f3fd",
        "name": "backhand index pointing left: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f448-1f3fe": {
        "id": "1f448-1f3fe",
        "name": "backhand index pointing left: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f448-1f3ff": {
        "id": "1f448-1f3ff",
        "name": "backhand index pointing left: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f449": {
        "id": "1f449",
        "name": "backhand index pointing right",
        "category": "people",
        "diversities": [
            "1f449-1f3fb",
            "1f449-1f3fc",
            "1f449-1f3fd",
            "1f449-1f3fe",
            "1f449-1f3ff"
        ]
    },
    "1f449-1f3fb": {
        "id": "1f449-1f3fb",
        "name": "backhand index pointing right: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f449-1f3fc": {
        "id": "1f449-1f3fc",
        "name": "backhand index pointing right: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f449-1f3fd": {
        "id": "1f449-1f3fd",
        "name": "backhand index pointing right: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f449-1f3fe": {
        "id": "1f449-1f3fe",
        "name": "backhand index pointing right: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f449-1f3ff": {
        "id": "1f449-1f3ff",
        "name": "backhand index pointing right: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f446": {
        "id": "1f446",
        "name": "backhand index pointing up",
        "category": "people",
        "diversities": [
            "1f446-1f3fb",
            "1f446-1f3fc",
            "1f446-1f3fd",
            "1f446-1f3fe",
            "1f446-1f3ff"
        ]
    },
    "1f446-1f3fb": {
        "id": "1f446-1f3fb",
        "name": "backhand index pointing up: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f446-1f3fc": {
        "id": "1f446-1f3fc",
        "name": "backhand index pointing up: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f446-1f3fd": {
        "id": "1f446-1f3fd",
        "name": "backhand index pointing up: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f446-1f3fe": {
        "id": "1f446-1f3fe",
        "name": "backhand index pointing up: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f446-1f3ff": {
        "id": "1f446-1f3ff",
        "name": "backhand index pointing up: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f447": {
        "id": "1f447",
        "name": "backhand index pointing down",
        "category": "people",
        "diversities": [
            "1f447-1f3fb",
            "1f447-1f3fc",
            "1f447-1f3fd",
            "1f447-1f3fe",
            "1f447-1f3ff"
        ]
    },
    "1f447-1f3fb": {
        "id": "1f447-1f3fb",
        "name": "backhand index pointing down: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f447-1f3fc": {
        "id": "1f447-1f3fc",
        "name": "backhand index pointing down: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f447-1f3fd": {
        "id": "1f447-1f3fd",
        "name": "backhand index pointing down: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f447-1f3fe": {
        "id": "1f447-1f3fe",
        "name": "backhand index pointing down: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f447-1f3ff": {
        "id": "1f447-1f3ff",
        "name": "backhand index pointing down: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "261d": {
        "id": "261d",
        "name": "index pointing up",
        "category": "people",
        "diversities": [
            "261d-1f3fb",
            "261d-1f3fc",
            "261d-1f3fd",
            "261d-1f3fe",
            "261d-1f3ff"
        ]
    },
    "261d-1f3fb": {
        "id": "261d-1f3fb",
        "name": "index pointing up: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "261d-1f3fc": {
        "id": "261d-1f3fc",
        "name": "index pointing up: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "261d-1f3fd": {
        "id": "261d-1f3fd",
        "name": "index pointing up: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "261d-1f3fe": {
        "id": "261d-1f3fe",
        "name": "index pointing up: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "261d-1f3ff": {
        "id": "261d-1f3ff",
        "name": "index pointing up: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "270b": {
        "id": "270b",
        "name": "raised hand",
        "category": "people",
        "diversities": [
            "270b-1f3fb",
            "270b-1f3fc",
            "270b-1f3fd",
            "270b-1f3fe",
            "270b-1f3ff"
        ]
    },
    "270b-1f3fb": {
        "id": "270b-1f3fb",
        "name": "raised hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "270b-1f3fc": {
        "id": "270b-1f3fc",
        "name": "raised hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "270b-1f3fd": {
        "id": "270b-1f3fd",
        "name": "raised hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "270b-1f3fe": {
        "id": "270b-1f3fe",
        "name": "raised hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "270b-1f3ff": {
        "id": "270b-1f3ff",
        "name": "raised hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f91a": {
        "id": "1f91a",
        "name": "raised back of hand",
        "category": "people",
        "diversities": [
            "1f91a-1f3fb",
            "1f91a-1f3fc",
            "1f91a-1f3fd",
            "1f91a-1f3fe",
            "1f91a-1f3ff"
        ]
    },
    "1f91a-1f3fb": {
        "id": "1f91a-1f3fb",
        "name": "raised back of hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f91a-1f3fc": {
        "id": "1f91a-1f3fc",
        "name": "raised back of hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f91a-1f3fd": {
        "id": "1f91a-1f3fd",
        "name": "raised back of hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f91a-1f3fe": {
        "id": "1f91a-1f3fe",
        "name": "raised back of hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f91a-1f3ff": {
        "id": "1f91a-1f3ff",
        "name": "raised back of hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f590": {
        "id": "1f590",
        "name": "hand with fingers splayed",
        "category": "people",
        "diversities": [
            "1f590-1f3fb",
            "1f590-1f3fc",
            "1f590-1f3fd",
            "1f590-1f3fe",
            "1f590-1f3ff"
        ]
    },
    "1f590-1f3fb": {
        "id": "1f590-1f3fb",
        "name": "hand with fingers splayed: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f590-1f3fc": {
        "id": "1f590-1f3fc",
        "name": "hand with fingers splayed: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f590-1f3fd": {
        "id": "1f590-1f3fd",
        "name": "hand with fingers splayed: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f590-1f3fe": {
        "id": "1f590-1f3fe",
        "name": "hand with fingers splayed: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f590-1f3ff": {
        "id": "1f590-1f3ff",
        "name": "hand with fingers splayed: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f596": {
        "id": "1f596",
        "name": "vulcan salute",
        "category": "people",
        "diversities": [
            "1f596-1f3fb",
            "1f596-1f3fc",
            "1f596-1f3fd",
            "1f596-1f3fe",
            "1f596-1f3ff"
        ]
    },
    "1f596-1f3fb": {
        "id": "1f596-1f3fb",
        "name": "vulcan salute: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f596-1f3fc": {
        "id": "1f596-1f3fc",
        "name": "vulcan salute: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f596-1f3fd": {
        "id": "1f596-1f3fd",
        "name": "vulcan salute: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f596-1f3fe": {
        "id": "1f596-1f3fe",
        "name": "vulcan salute: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f596-1f3ff": {
        "id": "1f596-1f3ff",
        "name": "vulcan salute: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f44b": {
        "id": "1f44b",
        "name": "waving hand",
        "category": "people",
        "diversities": [
            "1f44b-1f3fb",
            "1f44b-1f3fc",
            "1f44b-1f3fd",
            "1f44b-1f3fe",
            "1f44b-1f3ff"
        ]
    },
    "1f44b-1f3fb": {
        "id": "1f44b-1f3fb",
        "name": "waving hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f44b-1f3fc": {
        "id": "1f44b-1f3fc",
        "name": "waving hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f44b-1f3fd": {
        "id": "1f44b-1f3fd",
        "name": "waving hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f44b-1f3fe": {
        "id": "1f44b-1f3fe",
        "name": "waving hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f44b-1f3ff": {
        "id": "1f44b-1f3ff",
        "name": "waving hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f919": {
        "id": "1f919",
        "name": "call me hand",
        "category": "people",
        "diversities": [
            "1f919-1f3fb",
            "1f919-1f3fc",
            "1f919-1f3fd",
            "1f919-1f3fe",
            "1f919-1f3ff"
        ]
    },
    "1f919-1f3fb": {
        "id": "1f919-1f3fb",
        "name": "call me hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f919-1f3fc": {
        "id": "1f919-1f3fc",
        "name": "call me hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f919-1f3fd": {
        "id": "1f919-1f3fd",
        "name": "call me hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f919-1f3fe": {
        "id": "1f919-1f3fe",
        "name": "call me hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f919-1f3ff": {
        "id": "1f919-1f3ff",
        "name": "call me hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f4aa": {
        "id": "1f4aa",
        "name": "flexed biceps",
        "category": "people",
        "diversities": [
            "1f4aa-1f3fb",
            "1f4aa-1f3fc",
            "1f4aa-1f3fd",
            "1f4aa-1f3fe",
            "1f4aa-1f3ff"
        ]
    },
    "1f4aa-1f3fb": {
        "id": "1f4aa-1f3fb",
        "name": "flexed biceps: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f4aa-1f3fc": {
        "id": "1f4aa-1f3fc",
        "name": "flexed biceps: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f4aa-1f3fd": {
        "id": "1f4aa-1f3fd",
        "name": "flexed biceps: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f4aa-1f3fe": {
        "id": "1f4aa-1f3fe",
        "name": "flexed biceps: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f4aa-1f3ff": {
        "id": "1f4aa-1f3ff",
        "name": "flexed biceps: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f9b5": {
        "id": "1f9b5",
        "name": "leg",
        "category": "people",
        "diversities": [
            "1f9b5-1f3fb",
            "1f9b5-1f3fc",
            "1f9b5-1f3fd",
            "1f9b5-1f3fe",
            "1f9b5-1f3ff"
        ]
    },
    "1f9b5-1f3fb": {
        "id": "1f9b5-1f3fb",
        "name": "leg: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f9b5-1f3fc": {
        "id": "1f9b5-1f3fc",
        "name": "leg: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f9b5-1f3fd": {
        "id": "1f9b5-1f3fd",
        "name": "leg: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f9b5-1f3fe": {
        "id": "1f9b5-1f3fe",
        "name": "leg: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f9b5-1f3ff": {
        "id": "1f9b5-1f3ff",
        "name": "leg: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f9b6": {
        "id": "1f9b6",
        "name": "foot",
        "category": "people",
        "diversities": [
            "1f9b6-1f3fb",
            "1f9b6-1f3fc",
            "1f9b6-1f3fd",
            "1f9b6-1f3fe",
            "1f9b6-1f3ff"
        ]
    },
    "1f9b6-1f3fb": {
        "id": "1f9b6-1f3fb",
        "name": "foot: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f9b6-1f3fc": {
        "id": "1f9b6-1f3fc",
        "name": "foot: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f9b6-1f3fd": {
        "id": "1f9b6-1f3fd",
        "name": "foot: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f9b6-1f3fe": {
        "id": "1f9b6-1f3fe",
        "name": "foot: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f9b6-1f3ff": {
        "id": "1f9b6-1f3ff",
        "name": "foot: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f595": {
        "id": "1f595",
        "name": "middle finger",
        "category": "people",
        "diversities": [
            "1f595-1f3fb",
            "1f595-1f3fc",
            "1f595-1f3fd",
            "1f595-1f3fe",
            "1f595-1f3ff"
        ]
    },
    "1f595-1f3fb": {
        "id": "1f595-1f3fb",
        "name": "middle finger: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f595-1f3fc": {
        "id": "1f595-1f3fc",
        "name": "middle finger: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f595-1f3fd": {
        "id": "1f595-1f3fd",
        "name": "middle finger: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f595-1f3fe": {
        "id": "1f595-1f3fe",
        "name": "middle finger: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f595-1f3ff": {
        "id": "1f595-1f3ff",
        "name": "middle finger: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "270d": {
        "id": "270d",
        "name": "writing hand",
        "category": "people",
        "diversities": [
            "270d-1f3fb",
            "270d-1f3fc",
            "270d-1f3fd",
            "270d-1f3fe",
            "270d-1f3ff"
        ]
    },
    "270d-1f3fb": {
        "id": "270d-1f3fb",
        "name": "writing hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "270d-1f3fc": {
        "id": "270d-1f3fc",
        "name": "writing hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "270d-1f3fd": {
        "id": "270d-1f3fd",
        "name": "writing hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "270d-1f3fe": {
        "id": "270d-1f3fe",
        "name": "writing hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "270d-1f3ff": {
        "id": "270d-1f3ff",
        "name": "writing hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f64f": {
        "id": "1f64f",
        "name": "folded hands",
        "category": "people",
        "diversities": [
            "1f64f-1f3fb",
            "1f64f-1f3fc",
            "1f64f-1f3fd",
            "1f64f-1f3fe",
            "1f64f-1f3ff"
        ]
    },
    "1f64f-1f3fb": {
        "id": "1f64f-1f3fb",
        "name": "folded hands: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f64f-1f3fc": {
        "id": "1f64f-1f3fc",
        "name": "folded hands: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f64f-1f3fd": {
        "id": "1f64f-1f3fd",
        "name": "folded hands: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f64f-1f3fe": {
        "id": "1f64f-1f3fe",
        "name": "folded hands: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f64f-1f3ff": {
        "id": "1f64f-1f3ff",
        "name": "folded hands: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f48d": {
        "id": "1f48d",
        "name": "ring",
        "category": "people"
    },
    "1f484": {
        "id": "1f484",
        "name": "lipstick",
        "category": "people"
    },
    "1f48b": {
        "id": "1f48b",
        "name": "kiss mark",
        "category": "people"
    },
    "1f444": {
        "id": "1f444",
        "name": "mouth",
        "category": "people"
    },
    "1f445": {
        "id": "1f445",
        "name": "tongue",
        "category": "people"
    },
    "1f442": {
        "id": "1f442",
        "name": "ear",
        "category": "people",
        "diversities": [
            "1f442-1f3fb",
            "1f442-1f3fc",
            "1f442-1f3fd",
            "1f442-1f3fe",
            "1f442-1f3ff"
        ]
    },
    "1f442-1f3fb": {
        "id": "1f442-1f3fb",
        "name": "ear: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f442-1f3fc": {
        "id": "1f442-1f3fc",
        "name": "ear: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f442-1f3fd": {
        "id": "1f442-1f3fd",
        "name": "ear: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f442-1f3fe": {
        "id": "1f442-1f3fe",
        "name": "ear: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f442-1f3ff": {
        "id": "1f442-1f3ff",
        "name": "ear: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f443": {
        "id": "1f443",
        "name": "nose",
        "category": "people",
        "diversities": [
            "1f443-1f3fb",
            "1f443-1f3fc",
            "1f443-1f3fd",
            "1f443-1f3fe",
            "1f443-1f3ff"
        ]
    },
    "1f443-1f3fb": {
        "id": "1f443-1f3fb",
        "name": "nose: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f443-1f3fc": {
        "id": "1f443-1f3fc",
        "name": "nose: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f443-1f3fd": {
        "id": "1f443-1f3fd",
        "name": "nose: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f443-1f3fe": {
        "id": "1f443-1f3fe",
        "name": "nose: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f443-1f3ff": {
        "id": "1f443-1f3ff",
        "name": "nose: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f463": {
        "id": "1f463",
        "name": "footprints",
        "category": "people"
    },
    "1f441": {
        "id": "1f441",
        "name": "eye",
        "category": "people"
    },
    "1f440": {
        "id": "1f440",
        "name": "eyes",
        "category": "people"
    },
    "1f9e0": {
        "id": "1f9e0",
        "name": "brain",
        "category": "people"
    },
    "1f9b4": {
        "id": "1f9b4",
        "name": "bone",
        "category": "people"
    },
    "1f9b7": {
        "id": "1f9b7",
        "name": "tooth",
        "category": "people"
    },
    "1f5e3": {
        "id": "1f5e3",
        "name": "speaking head",
        "category": "people"
    },
    "1f464": {
        "id": "1f464",
        "name": "bust in silhouette",
        "category": "people"
    },
    "1f465": {
        "id": "1f465",
        "name": "busts in silhouette",
        "category": "people"
    },
    "1f476": {
        "id": "1f476",
        "name": "baby",
        "category": "people",
        "diversities": [
            "1f476-1f3fb",
            "1f476-1f3fc",
            "1f476-1f3fd",
            "1f476-1f3fe",
            "1f476-1f3ff"
        ]
    },
    "1f476-1f3fb": {
        "id": "1f476-1f3fb",
        "name": "baby: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f476-1f3fc": {
        "id": "1f476-1f3fc",
        "name": "baby: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f476-1f3fd": {
        "id": "1f476-1f3fd",
        "name": "baby: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f476-1f3fe": {
        "id": "1f476-1f3fe",
        "name": "baby: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f476-1f3ff": {
        "id": "1f476-1f3ff",
        "name": "baby: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f467": {
        "id": "1f467",
        "name": "girl",
        "category": "people",
        "diversities": [
            "1f467-1f3fb",
            "1f467-1f3fc",
            "1f467-1f3fd",
            "1f467-1f3fe",
            "1f467-1f3ff"
        ]
    },
    "1f467-1f3fb": {
        "id": "1f467-1f3fb",
        "name": "girl: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f467-1f3fc": {
        "id": "1f467-1f3fc",
        "name": "girl: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f467-1f3fd": {
        "id": "1f467-1f3fd",
        "name": "girl: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f467-1f3fe": {
        "id": "1f467-1f3fe",
        "name": "girl: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f467-1f3ff": {
        "id": "1f467-1f3ff",
        "name": "girl: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f9d2": {
        "id": "1f9d2",
        "name": "child",
        "category": "people",
        "diversities": [
            "1f9d2-1f3fb",
            "1f9d2-1f3fc",
            "1f9d2-1f3fd",
            "1f9d2-1f3fe",
            "1f9d2-1f3ff"
        ]
    },
    "1f9d2-1f3fb": {
        "id": "1f9d2-1f3fb",
        "name": "child: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f9d2-1f3fc": {
        "id": "1f9d2-1f3fc",
        "name": "child: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f9d2-1f3fd": {
        "id": "1f9d2-1f3fd",
        "name": "child: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f9d2-1f3fe": {
        "id": "1f9d2-1f3fe",
        "name": "child: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f9d2-1f3ff": {
        "id": "1f9d2-1f3ff",
        "name": "child: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f466": {
        "id": "1f466",
        "name": "boy",
        "category": "people",
        "diversities": [
            "1f466-1f3fb",
            "1f466-1f3fc",
            "1f466-1f3fd",
            "1f466-1f3fe",
            "1f466-1f3ff"
        ]
    },
    "1f466-1f3fb": {
        "id": "1f466-1f3fb",
        "name": "boy: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f466-1f3fc": {
        "id": "1f466-1f3fc",
        "name": "boy: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f466-1f3fd": {
        "id": "1f466-1f3fd",
        "name": "boy: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f466-1f3fe": {
        "id": "1f466-1f3fe",
        "name": "boy: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f466-1f3ff": {
        "id": "1f466-1f3ff",
        "name": "boy: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469": {
        "id": "1f469",
        "name": "woman",
        "category": "people",
        "diversities": [
            "1f469-1f3fb",
            "1f469-1f3fc",
            "1f469-1f3fd",
            "1f469-1f3fe",
            "1f469-1f3ff",
            "1f471-1f3fb-2640",
            "1f471-1f3fc-2640",
            "1f471-1f3fd-2640",
            "1f471-1f3fe-2640",
            "1f471-1f3ff-2640",
            "1f469-1f3fb-1f9b0",
            "1f469-1f3fc-1f9b0",
            "1f469-1f3fd-1f9b0",
            "1f469-1f3fe-1f9b0",
            "1f469-1f3ff-1f9b0",
            "1f469-1f3fb-1f9b1",
            "1f469-1f3fc-1f9b1",
            "1f469-1f3fd-1f9b1",
            "1f469-1f3fe-1f9b1",
            "1f469-1f3ff-1f9b1",
            "1f469-1f3fb-1f9b3",
            "1f469-1f3fc-1f9b3",
            "1f469-1f3fd-1f9b3",
            "1f469-1f3fe-1f9b3",
            "1f469-1f3ff-1f9b3",
            "1f469-1f3fb-1f9b2",
            "1f469-1f3fc-1f9b2",
            "1f469-1f3fd-1f9b2",
            "1f469-1f3fe-1f9b2",
            "1f469-1f3ff-1f9b2"
        ]
    },
    "1f469-1f3fb": {
        "id": "1f469-1f3fb",
        "name": "woman: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc": {
        "id": "1f469-1f3fc",
        "name": "woman: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd": {
        "id": "1f469-1f3fd",
        "name": "woman: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe": {
        "id": "1f469-1f3fe",
        "name": "woman: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff": {
        "id": "1f469-1f3ff",
        "name": "woman: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f9d1": {
        "id": "1f9d1",
        "name": "adult",
        "category": "people",
        "diversities": [
            "1f9d1-1f3fb",
            "1f9d1-1f3fc",
            "1f9d1-1f3fd",
            "1f9d1-1f3fe",
            "1f9d1-1f3ff",
            "1f471-1f3fb",
            "1f471-1f3fc",
            "1f471-1f3fd",
            "1f471-1f3fe",
            "1f471-1f3ff"
        ],
        "genders": [
            "1f468",
            "1f469"
        ]
    },
    "1f9d1-1f3fb": {
        "id": "1f9d1-1f3fb",
        "name": "adult: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f468-1f3fb",
            "1f471-1f3fb-2642",
            "1f468-1f3fb-1f9b0",
            "1f468-1f3fb-1f9b1",
            "1f468-1f3fb-1f9b3",
            "1f468-1f3fb-1f9b2",
            "1f9d4-1f3fb",
            "1f469-1f3fb",
            "1f471-1f3fb-2640",
            "1f469-1f3fb-1f9b0",
            "1f469-1f3fb-1f9b1",
            "1f469-1f3fb-1f9b3",
            "1f469-1f3fb-1f9b2"
        ]
    },
    "1f9d1-1f3fc": {
        "id": "1f9d1-1f3fc",
        "name": "adult: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f468-1f3fc",
            "1f471-1f3fc-2642",
            "1f468-1f3fc-1f9b0",
            "1f468-1f3fc-1f9b1",
            "1f468-1f3fc-1f9b3",
            "1f468-1f3fc-1f9b2",
            "1f9d4-1f3fc",
            "1f469-1f3fc",
            "1f471-1f3fc-2640",
            "1f469-1f3fc-1f9b0",
            "1f469-1f3fc-1f9b1",
            "1f469-1f3fc-1f9b3",
            "1f469-1f3fc-1f9b2"
        ]
    },
    "1f9d1-1f3fd": {
        "id": "1f9d1-1f3fd",
        "name": "adult: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f468-1f3fd",
            "1f471-1f3fd-2642",
            "1f468-1f3fd-1f9b0",
            "1f468-1f3fd-1f9b1",
            "1f468-1f3fd-1f9b3",
            "1f468-1f3fd-1f9b2",
            "1f9d4-1f3fd",
            "1f469-1f3fd",
            "1f471-1f3fd-2640",
            "1f469-1f3fd-1f9b0",
            "1f469-1f3fd-1f9b1",
            "1f469-1f3fd-1f9b3",
            "1f469-1f3fd-1f9b2"
        ]
    },
    "1f9d1-1f3fe": {
        "id": "1f9d1-1f3fe",
        "name": "adult: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f468-1f3fe",
            "1f471-1f3fe-2642",
            "1f468-1f3fe-1f9b0",
            "1f468-1f3fe-1f9b1",
            "1f468-1f3fe-1f9b3",
            "1f468-1f3fe-1f9b2",
            "1f9d4-1f3fe",
            "1f469-1f3fe",
            "1f471-1f3fe-2640",
            "1f469-1f3fe-1f9b0",
            "1f469-1f3fe-1f9b1",
            "1f469-1f3fe-1f9b3",
            "1f469-1f3fe-1f9b2"
        ]
    },
    "1f9d1-1f3ff": {
        "id": "1f9d1-1f3ff",
        "name": "adult: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f468-1f3ff",
            "1f471-1f3ff-2642",
            "1f468-1f3ff-1f9b0",
            "1f468-1f3ff-1f9b1",
            "1f468-1f3ff-1f9b3",
            "1f468-1f3ff-1f9b2",
            "1f9d4-1f3ff",
            "1f469-1f3ff",
            "1f471-1f3ff-2640",
            "1f469-1f3ff-1f9b0",
            "1f469-1f3ff-1f9b1",
            "1f469-1f3ff-1f9b3",
            "1f469-1f3ff-1f9b2"
        ]
    },
    "1f468": {
        "id": "1f468",
        "name": "man",
        "category": "people",
        "diversities": [
            "1f468-1f3fb",
            "1f468-1f3fc",
            "1f468-1f3fd",
            "1f468-1f3fe",
            "1f468-1f3ff",
            "1f471-1f3fb-2642",
            "1f471-1f3fc-2642",
            "1f471-1f3fd-2642",
            "1f471-1f3fe-2642",
            "1f471-1f3ff-2642",
            "1f468-1f3fb-1f9b0",
            "1f468-1f3fc-1f9b0",
            "1f468-1f3fd-1f9b0",
            "1f468-1f3fe-1f9b0",
            "1f468-1f3ff-1f9b0",
            "1f468-1f3fb-1f9b1",
            "1f468-1f3fc-1f9b1",
            "1f468-1f3fd-1f9b1",
            "1f468-1f3fe-1f9b1",
            "1f468-1f3ff-1f9b1",
            "1f468-1f3fb-1f9b3",
            "1f468-1f3fc-1f9b3",
            "1f468-1f3fd-1f9b3",
            "1f468-1f3fe-1f9b3",
            "1f468-1f3ff-1f9b3",
            "1f468-1f3fb-1f9b2",
            "1f468-1f3fc-1f9b2",
            "1f468-1f3fd-1f9b2",
            "1f468-1f3fe-1f9b2",
            "1f468-1f3ff-1f9b2",
            "1f9d4-1f3fb",
            "1f9d4-1f3fc",
            "1f9d4-1f3fd",
            "1f9d4-1f3fe",
            "1f9d4-1f3ff"
        ]
    },
    "1f468-1f3fb": {
        "id": "1f468-1f3fb",
        "name": "man: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc": {
        "id": "1f468-1f3fc",
        "name": "man: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd": {
        "id": "1f468-1f3fd",
        "name": "man: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe": {
        "id": "1f468-1f3fe",
        "name": "man: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff": {
        "id": "1f468-1f3ff",
        "name": "man: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f471": {
        "id": "1f471",
        "name": "blond-haired person",
        "category": "people",
        "diversities": [
            "1f471-1f3fb",
            "1f471-1f3fc",
            "1f471-1f3fd",
            "1f471-1f3fe",
            "1f471-1f3ff"
        ]
    },
    "1f471-1f3fb": {
        "id": "1f471-1f3fb",
        "name": "blond-haired person: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f468-1f3fb",
            "1f471-1f3fb-2642",
            "1f468-1f3fb-1f9b0",
            "1f468-1f3fb-1f9b1",
            "1f468-1f3fb-1f9b3",
            "1f468-1f3fb-1f9b2",
            "1f9d4-1f3fb",
            "1f469-1f3fb",
            "1f471-1f3fb-2640",
            "1f469-1f3fb-1f9b0",
            "1f469-1f3fb-1f9b1",
            "1f469-1f3fb-1f9b3",
            "1f469-1f3fb-1f9b2"
        ]
    },
    "1f471-1f3fc": {
        "id": "1f471-1f3fc",
        "name": "blond-haired person: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f468-1f3fc",
            "1f471-1f3fc-2642",
            "1f468-1f3fc-1f9b0",
            "1f468-1f3fc-1f9b1",
            "1f468-1f3fc-1f9b3",
            "1f468-1f3fc-1f9b2",
            "1f9d4-1f3fc",
            "1f469-1f3fc",
            "1f471-1f3fc-2640",
            "1f469-1f3fc-1f9b0",
            "1f469-1f3fc-1f9b1",
            "1f469-1f3fc-1f9b3",
            "1f469-1f3fc-1f9b2"
        ]
    },
    "1f471-1f3fd": {
        "id": "1f471-1f3fd",
        "name": "blond-haired person: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f468-1f3fd",
            "1f471-1f3fd-2642",
            "1f468-1f3fd-1f9b0",
            "1f468-1f3fd-1f9b1",
            "1f468-1f3fd-1f9b3",
            "1f468-1f3fd-1f9b2",
            "1f9d4-1f3fd",
            "1f469-1f3fd",
            "1f471-1f3fd-2640",
            "1f469-1f3fd-1f9b0",
            "1f469-1f3fd-1f9b1",
            "1f469-1f3fd-1f9b3",
            "1f469-1f3fd-1f9b2"
        ]
    },
    "1f471-1f3fe": {
        "id": "1f471-1f3fe",
        "name": "blond-haired person: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f468-1f3fe",
            "1f471-1f3fe-2642",
            "1f468-1f3fe-1f9b0",
            "1f468-1f3fe-1f9b1",
            "1f468-1f3fe-1f9b3",
            "1f468-1f3fe-1f9b2",
            "1f9d4-1f3fe",
            "1f469-1f3fe",
            "1f471-1f3fe-2640",
            "1f469-1f3fe-1f9b0",
            "1f469-1f3fe-1f9b1",
            "1f469-1f3fe-1f9b3",
            "1f469-1f3fe-1f9b2"
        ]
    },
    "1f471-1f3ff": {
        "id": "1f471-1f3ff",
        "name": "blond-haired person: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f468-1f3ff",
            "1f471-1f3ff-2642",
            "1f468-1f3ff-1f9b0",
            "1f468-1f3ff-1f9b1",
            "1f468-1f3ff-1f9b3",
            "1f468-1f3ff-1f9b2",
            "1f9d4-1f3ff",
            "1f469-1f3ff",
            "1f471-1f3ff-2640",
            "1f469-1f3ff-1f9b0",
            "1f469-1f3ff-1f9b1",
            "1f469-1f3ff-1f9b3",
            "1f469-1f3ff-1f9b2"
        ]
    },
    "1f471-2640": {
        "id": "1f471-2640",
        "name": "blond-haired woman",
        "category": "people",
        "diversities": [
            "1f471-1f3fb-2640",
            "1f471-1f3fc-2640",
            "1f471-1f3fd-2640",
            "1f471-1f3fe-2640",
            "1f471-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f471-1f3fb-2640": {
        "id": "1f471-1f3fb-2640",
        "name": "blond-haired woman: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f471-1f3fc-2640": {
        "id": "1f471-1f3fc-2640",
        "name": "blond-haired woman: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f471-1f3fd-2640": {
        "id": "1f471-1f3fd-2640",
        "name": "blond-haired woman: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f471-1f3fe-2640": {
        "id": "1f471-1f3fe-2640",
        "name": "blond-haired woman: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f471-1f3ff-2640": {
        "id": "1f471-1f3ff-2640",
        "name": "blond-haired woman: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f471-2642": {
        "id": "1f471-2642",
        "name": "blond-haired man",
        "category": "people",
        "diversities": [
            "1f471-1f3fb-2642",
            "1f471-1f3fc-2642",
            "1f471-1f3fd-2642",
            "1f471-1f3fe-2642",
            "1f471-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f471-1f3fb-2642": {
        "id": "1f471-1f3fb-2642",
        "name": "blond-haired man: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f471-1f3fc-2642": {
        "id": "1f471-1f3fc-2642",
        "name": "blond-haired man: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f471-1f3fd-2642": {
        "id": "1f471-1f3fd-2642",
        "name": "blond-haired man: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f471-1f3fe-2642": {
        "id": "1f471-1f3fe-2642",
        "name": "blond-haired man: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f471-1f3ff-2642": {
        "id": "1f471-1f3ff-2642",
        "name": "blond-haired man: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f469-1f9b0": {
        "id": "1f469-1f9b0",
        "name": "woman, red haired",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f9b0",
            "1f469-1f3fc-1f9b0",
            "1f469-1f3fd-1f9b0",
            "1f469-1f3fe-1f9b0",
            "1f469-1f3ff-1f9b0"
        ]
    },
    "1f469-1f3fb-1f9b0": {
        "id": "1f469-1f3fb-1f9b0",
        "name": "woman, red haired: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f9b0": {
        "id": "1f469-1f3fc-1f9b0",
        "name": "woman, red haired: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f9b0": {
        "id": "1f469-1f3fd-1f9b0",
        "name": "woman, red haired: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f9b0": {
        "id": "1f469-1f3fe-1f9b0",
        "name": "woman, red haired: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f9b0": {
        "id": "1f469-1f3ff-1f9b0",
        "name": "woman, red haired: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f9b0": {
        "id": "1f468-1f9b0",
        "name": "man, red haired",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f9b0",
            "1f468-1f3fd-1f9b0",
            "1f468-1f3fe-1f9b0",
            "1f468-1f3ff-1f9b0"
        ]
    },
    "1f468-1f3fb-1f9b0": {
        "id": "1f468-1f3fb-1f9b0",
        "name": "man, red haired: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f9b0": {
        "id": "1f468-1f3fc-1f9b0",
        "name": "man, red haired: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f9b0": {
        "id": "1f468-1f3fd-1f9b0",
        "name": "man, red haired: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f9b0": {
        "id": "1f468-1f3fe-1f9b0",
        "name": "man, red haired: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f9b0": {
        "id": "1f468-1f3ff-1f9b0",
        "name": "man, red haired: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f9b1": {
        "id": "1f469-1f9b1",
        "name": "woman, curly haired",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f9b1",
            "1f469-1f3fc-1f9b1",
            "1f469-1f3fd-1f9b1",
            "1f469-1f3fe-1f9b1",
            "1f469-1f3ff-1f9b1"
        ]
    },
    "1f469-1f3fb-1f9b1": {
        "id": "1f469-1f3fb-1f9b1",
        "name": "woman, curly haired: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f9b1": {
        "id": "1f469-1f3fc-1f9b1",
        "name": "woman, curly haired: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f9b1": {
        "id": "1f469-1f3fd-1f9b1",
        "name": "woman, curly haired: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f9b1": {
        "id": "1f469-1f3fe-1f9b1",
        "name": "woman, curly haired: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f9b1": {
        "id": "1f469-1f3ff-1f9b1",
        "name": "woman, curly haired: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f9b1": {
        "id": "1f468-1f9b1",
        "name": "man, curly haired",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f9b1",
            "1f468-1f3fc-1f9b1",
            "1f468-1f3fd-1f9b1",
            "1f468-1f3fe-1f9b1",
            "1f468-1f3ff-1f9b1"
        ]
    },
    "1f468-1f3fb-1f9b1": {
        "id": "1f468-1f3fb-1f9b1",
        "name": "man, curly haired: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f9b1": {
        "id": "1f468-1f3fc-1f9b1",
        "name": "man, curly haired: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f9b1": {
        "id": "1f468-1f3fd-1f9b1",
        "name": "man, curly haired: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f9b1": {
        "id": "1f468-1f3fe-1f9b1",
        "name": "man, curly haired: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f9b1": {
        "id": "1f468-1f3ff-1f9b1",
        "name": "man, curly haired: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f9b3": {
        "id": "1f469-1f9b3",
        "name": "woman, white haired",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f9b3",
            "1f469-1f3fc-1f9b3",
            "1f469-1f3fd-1f9b3",
            "1f469-1f3fe-1f9b3",
            "1f469-1f3ff-1f9b3"
        ]
    },
    "1f469-1f3fb-1f9b3": {
        "id": "1f469-1f3fb-1f9b3",
        "name": "woman, white haired: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f9b3": {
        "id": "1f469-1f3fc-1f9b3",
        "name": "woman, white haired: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f9b3": {
        "id": "1f469-1f3fd-1f9b3",
        "name": "woman, white haired: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f9b3": {
        "id": "1f469-1f3fe-1f9b3",
        "name": "woman, white haired: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f9b3": {
        "id": "1f469-1f3ff-1f9b3",
        "name": "woman, white haired: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f9b3": {
        "id": "1f468-1f9b3",
        "name": "man, white haired",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f9b3",
            "1f468-1f3fc-1f9b3",
            "1f468-1f3fd-1f9b3",
            "1f468-1f3fe-1f9b3",
            "1f468-1f3ff-1f9b3"
        ]
    },
    "1f468-1f3fb-1f9b3": {
        "id": "1f468-1f3fb-1f9b3",
        "name": "man, white haired: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f9b3": {
        "id": "1f468-1f3fc-1f9b3",
        "name": "man, white haired: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f9b3": {
        "id": "1f468-1f3fd-1f9b3",
        "name": "man, white haired: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f9b3": {
        "id": "1f468-1f3fe-1f9b3",
        "name": "man, white haired: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f9b3": {
        "id": "1f468-1f3ff-1f9b3",
        "name": "man, white haired: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f9b2": {
        "id": "1f469-1f9b2",
        "name": "woman, bald",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f9b2",
            "1f469-1f3fc-1f9b2",
            "1f469-1f3fd-1f9b2",
            "1f469-1f3fe-1f9b2",
            "1f469-1f3ff-1f9b2"
        ]
    },
    "1f469-1f3fb-1f9b2": {
        "id": "1f469-1f3fb-1f9b2",
        "name": "woman, bald: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f9b2": {
        "id": "1f469-1f3fc-1f9b2",
        "name": "woman, bald: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f9b2": {
        "id": "1f469-1f3fd-1f9b2",
        "name": "woman, bald: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f9b2": {
        "id": "1f469-1f3fe-1f9b2",
        "name": "woman, bald: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f9b2": {
        "id": "1f469-1f3ff-1f9b2",
        "name": "woman, bald: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f9b2": {
        "id": "1f468-1f9b2",
        "name": "man, bald",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f9b2",
            "1f468-1f3fc-1f9b2",
            "1f468-1f3fd-1f9b2",
            "1f468-1f3fe-1f9b2",
            "1f468-1f3ff-1f9b2"
        ]
    },
    "1f468-1f3fb-1f9b2": {
        "id": "1f468-1f3fb-1f9b2",
        "name": "man, bald: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f9b2": {
        "id": "1f468-1f3fc-1f9b2",
        "name": "man, bald: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f9b2": {
        "id": "1f468-1f3fd-1f9b2",
        "name": "man, bald: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f9b2": {
        "id": "1f468-1f3fe-1f9b2",
        "name": "man, bald: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f9b2": {
        "id": "1f468-1f3ff-1f9b2",
        "name": "man, bald: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f9d4": {
        "id": "1f9d4",
        "name": "bearded person",
        "category": "people",
        "diversities": [
            "1f9d4-1f3fb",
            "1f9d4-1f3fc",
            "1f9d4-1f3fd",
            "1f9d4-1f3fe",
            "1f9d4-1f3ff"
        ]
    },
    "1f9d4-1f3fb": {
        "id": "1f9d4-1f3fb",
        "name": "bearded person: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f9d4-1f3fc": {
        "id": "1f9d4-1f3fc",
        "name": "bearded person: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f9d4-1f3fd": {
        "id": "1f9d4-1f3fd",
        "name": "bearded person: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f9d4-1f3fe": {
        "id": "1f9d4-1f3fe",
        "name": "bearded person: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f9d4-1f3ff": {
        "id": "1f9d4-1f3ff",
        "name": "bearded person: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f475": {
        "id": "1f475",
        "name": "old woman",
        "category": "people",
        "diversities": [
            "1f475-1f3fb",
            "1f475-1f3fc",
            "1f475-1f3fd",
            "1f475-1f3fe",
            "1f475-1f3ff"
        ]
    },
    "1f475-1f3fb": {
        "id": "1f475-1f3fb",
        "name": "old woman: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f475-1f3fc": {
        "id": "1f475-1f3fc",
        "name": "old woman: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f475-1f3fd": {
        "id": "1f475-1f3fd",
        "name": "old woman: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f475-1f3fe": {
        "id": "1f475-1f3fe",
        "name": "old woman: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f475-1f3ff": {
        "id": "1f475-1f3ff",
        "name": "old woman: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f9d3": {
        "id": "1f9d3",
        "name": "older adult",
        "category": "people",
        "diversities": [
            "1f9d3-1f3fb",
            "1f9d3-1f3fc",
            "1f9d3-1f3fd",
            "1f9d3-1f3fe",
            "1f9d3-1f3ff"
        ]
    },
    "1f9d3-1f3fb": {
        "id": "1f9d3-1f3fb",
        "name": "older adult: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f9d3-1f3fc": {
        "id": "1f9d3-1f3fc",
        "name": "older adult: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f9d3-1f3fd": {
        "id": "1f9d3-1f3fd",
        "name": "older adult: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f9d3-1f3fe": {
        "id": "1f9d3-1f3fe",
        "name": "older adult: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f9d3-1f3ff": {
        "id": "1f9d3-1f3ff",
        "name": "older adult: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f474": {
        "id": "1f474",
        "name": "old man",
        "category": "people",
        "diversities": [
            "1f474-1f3fb",
            "1f474-1f3fc",
            "1f474-1f3fd",
            "1f474-1f3fe",
            "1f474-1f3ff"
        ]
    },
    "1f474-1f3fb": {
        "id": "1f474-1f3fb",
        "name": "old man: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f474-1f3fc": {
        "id": "1f474-1f3fc",
        "name": "old man: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f474-1f3fd": {
        "id": "1f474-1f3fd",
        "name": "old man: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f474-1f3fe": {
        "id": "1f474-1f3fe",
        "name": "old man: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f474-1f3ff": {
        "id": "1f474-1f3ff",
        "name": "old man: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f472": {
        "id": "1f472",
        "name": "man with Chinese cap",
        "category": "people",
        "diversities": [
            "1f472-1f3fb",
            "1f472-1f3fc",
            "1f472-1f3fd",
            "1f472-1f3fe",
            "1f472-1f3ff"
        ]
    },
    "1f472-1f3fb": {
        "id": "1f472-1f3fb",
        "name": "man with Chinese cap: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f472-1f3fc": {
        "id": "1f472-1f3fc",
        "name": "man with Chinese cap: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f472-1f3fd": {
        "id": "1f472-1f3fd",
        "name": "man with Chinese cap: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f472-1f3fe": {
        "id": "1f472-1f3fe",
        "name": "man with Chinese cap: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f472-1f3ff": {
        "id": "1f472-1f3ff",
        "name": "man with Chinese cap: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f473": {
        "id": "1f473",
        "name": "person wearing turban",
        "category": "people",
        "diversities": [
            "1f473-1f3fb",
            "1f473-1f3fc",
            "1f473-1f3fd",
            "1f473-1f3fe",
            "1f473-1f3ff"
        ],
        "genders": [
            "1f473-2642",
            "1f473-2640"
        ]
    },
    "1f473-1f3fb": {
        "id": "1f473-1f3fb",
        "name": "person wearing turban: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f473-1f3fb-2642",
            "1f473-1f3fb-2640"
        ]
    },
    "1f473-1f3fc": {
        "id": "1f473-1f3fc",
        "name": "person wearing turban: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f473-1f3fc-2642",
            "1f473-1f3fc-2640"
        ]
    },
    "1f473-1f3fd": {
        "id": "1f473-1f3fd",
        "name": "person wearing turban: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f473-1f3fd-2642",
            "1f473-1f3fd-2640"
        ]
    },
    "1f473-1f3fe": {
        "id": "1f473-1f3fe",
        "name": "person wearing turban: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f473-1f3fe-2642",
            "1f473-1f3fe-2640"
        ]
    },
    "1f473-1f3ff": {
        "id": "1f473-1f3ff",
        "name": "person wearing turban: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f473-1f3ff-2642",
            "1f473-1f3ff-2640"
        ]
    },
    "1f473-2640": {
        "id": "1f473-2640",
        "name": "woman wearing turban",
        "category": "people",
        "diversities": [
            "1f473-1f3fb-2640",
            "1f473-1f3fc-2640",
            "1f473-1f3fd-2640",
            "1f473-1f3fe-2640",
            "1f473-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f473-1f3fb-2640": {
        "id": "1f473-1f3fb-2640",
        "name": "woman wearing turban: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f473-1f3fc-2640": {
        "id": "1f473-1f3fc-2640",
        "name": "woman wearing turban: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f473-1f3fd-2640": {
        "id": "1f473-1f3fd-2640",
        "name": "woman wearing turban: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f473-1f3fe-2640": {
        "id": "1f473-1f3fe-2640",
        "name": "woman wearing turban: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f473-1f3ff-2640": {
        "id": "1f473-1f3ff-2640",
        "name": "woman wearing turban: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f473-2642": {
        "id": "1f473-2642",
        "name": "man wearing turban",
        "category": "people",
        "diversities": [
            "1f473-1f3fb-2642",
            "1f473-1f3fc-2642",
            "1f473-1f3fd-2642",
            "1f473-1f3fe-2642",
            "1f473-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f473-1f3fb-2642": {
        "id": "1f473-1f3fb-2642",
        "name": "man wearing turban: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f473-1f3fc-2642": {
        "id": "1f473-1f3fc-2642",
        "name": "man wearing turban: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f473-1f3fd-2642": {
        "id": "1f473-1f3fd-2642",
        "name": "man wearing turban: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f473-1f3fe-2642": {
        "id": "1f473-1f3fe-2642",
        "name": "man wearing turban: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f473-1f3ff-2642": {
        "id": "1f473-1f3ff-2642",
        "name": "man wearing turban: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9d5": {
        "id": "1f9d5",
        "name": "woman with headscarf",
        "category": "people",
        "diversities": [
            "1f9d5-1f3fb",
            "1f9d5-1f3fc",
            "1f9d5-1f3fd",
            "1f9d5-1f3fe",
            "1f9d5-1f3ff"
        ]
    },
    "1f9d5-1f3fb": {
        "id": "1f9d5-1f3fb",
        "name": "woman with headscarf: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f9d5-1f3fc": {
        "id": "1f9d5-1f3fc",
        "name": "woman with headscarf: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f9d5-1f3fd": {
        "id": "1f9d5-1f3fd",
        "name": "woman with headscarf: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f9d5-1f3fe": {
        "id": "1f9d5-1f3fe",
        "name": "woman with headscarf: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f9d5-1f3ff": {
        "id": "1f9d5-1f3ff",
        "name": "woman with headscarf: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f46e": {
        "id": "1f46e",
        "name": "police officer",
        "category": "people",
        "diversities": [
            "1f46e-1f3fb",
            "1f46e-1f3fc",
            "1f46e-1f3fd",
            "1f46e-1f3fe",
            "1f46e-1f3ff"
        ],
        "genders": [
            "1f46e-2642",
            "1f46e-2640"
        ]
    },
    "1f46e-1f3fb": {
        "id": "1f46e-1f3fb",
        "name": "police officer: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f46e-1f3fb-2642",
            "1f46e-1f3fb-2640"
        ]
    },
    "1f46e-1f3fc": {
        "id": "1f46e-1f3fc",
        "name": "police officer: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f46e-1f3fc-2642",
            "1f46e-1f3fc-2640"
        ]
    },
    "1f46e-1f3fd": {
        "id": "1f46e-1f3fd",
        "name": "police officer: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f46e-1f3fd-2642",
            "1f46e-1f3fd-2640"
        ]
    },
    "1f46e-1f3fe": {
        "id": "1f46e-1f3fe",
        "name": "police officer: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f46e-1f3fe-2642",
            "1f46e-1f3fe-2640"
        ]
    },
    "1f46e-1f3ff": {
        "id": "1f46e-1f3ff",
        "name": "police officer: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f46e-1f3ff-2642",
            "1f46e-1f3ff-2640"
        ]
    },
    "1f46e-2640": {
        "id": "1f46e-2640",
        "name": "woman police officer",
        "category": "people",
        "diversities": [
            "1f46e-1f3fb-2640",
            "1f46e-1f3fc-2640",
            "1f46e-1f3fd-2640",
            "1f46e-1f3fe-2640",
            "1f46e-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f46e-1f3fb-2640": {
        "id": "1f46e-1f3fb-2640",
        "name": "woman police officer: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f46e-1f3fc-2640": {
        "id": "1f46e-1f3fc-2640",
        "name": "woman police officer: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f46e-1f3fd-2640": {
        "id": "1f46e-1f3fd-2640",
        "name": "woman police officer: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f46e-1f3fe-2640": {
        "id": "1f46e-1f3fe-2640",
        "name": "woman police officer: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f46e-1f3ff-2640": {
        "id": "1f46e-1f3ff-2640",
        "name": "woman police officer: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f46e-2642": {
        "id": "1f46e-2642",
        "name": "man police officer",
        "category": "people",
        "diversities": [
            "1f46e-1f3fb-2642",
            "1f46e-1f3fc-2642",
            "1f46e-1f3fd-2642",
            "1f46e-1f3fe-2642",
            "1f46e-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f46e-1f3fb-2642": {
        "id": "1f46e-1f3fb-2642",
        "name": "man police officer: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f46e-1f3fc-2642": {
        "id": "1f46e-1f3fc-2642",
        "name": "man police officer: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f46e-1f3fd-2642": {
        "id": "1f46e-1f3fd-2642",
        "name": "man police officer: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f46e-1f3fe-2642": {
        "id": "1f46e-1f3fe-2642",
        "name": "man police officer: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f46e-1f3ff-2642": {
        "id": "1f46e-1f3ff-2642",
        "name": "man police officer: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f477": {
        "id": "1f477",
        "name": "construction worker",
        "category": "people",
        "diversities": [
            "1f477-1f3fb",
            "1f477-1f3fc",
            "1f477-1f3fd",
            "1f477-1f3fe",
            "1f477-1f3ff"
        ],
        "genders": [
            "1f477-2642",
            "1f477-2640"
        ]
    },
    "1f477-1f3fb": {
        "id": "1f477-1f3fb",
        "name": "construction worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f477-1f3fb-2642",
            "1f477-1f3fb-2640"
        ]
    },
    "1f477-1f3fc": {
        "id": "1f477-1f3fc",
        "name": "construction worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f477-1f3fc-2642",
            "1f477-1f3fc-2640"
        ]
    },
    "1f477-1f3fd": {
        "id": "1f477-1f3fd",
        "name": "construction worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f477-1f3fd-2642",
            "1f477-1f3fd-2640"
        ]
    },
    "1f477-1f3fe": {
        "id": "1f477-1f3fe",
        "name": "construction worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f477-1f3fe-2642",
            "1f477-1f3fe-2640"
        ]
    },
    "1f477-1f3ff": {
        "id": "1f477-1f3ff",
        "name": "construction worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f477-1f3ff-2642",
            "1f477-1f3ff-2640"
        ]
    },
    "1f477-2640": {
        "id": "1f477-2640",
        "name": "woman construction worker",
        "category": "people",
        "diversities": [
            "1f477-1f3fb-2640",
            "1f477-1f3fc-2640",
            "1f477-1f3fd-2640",
            "1f477-1f3fe-2640",
            "1f477-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f477-1f3fb-2640": {
        "id": "1f477-1f3fb-2640",
        "name": "woman construction worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f477-1f3fc-2640": {
        "id": "1f477-1f3fc-2640",
        "name": "woman construction worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f477-1f3fd-2640": {
        "id": "1f477-1f3fd-2640",
        "name": "woman construction worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f477-1f3fe-2640": {
        "id": "1f477-1f3fe-2640",
        "name": "woman construction worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f477-1f3ff-2640": {
        "id": "1f477-1f3ff-2640",
        "name": "woman construction worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f477-2642": {
        "id": "1f477-2642",
        "name": "man construction worker",
        "category": "people",
        "diversities": [
            "1f477-1f3fb-2642",
            "1f477-1f3fc-2642",
            "1f477-1f3fd-2642",
            "1f477-1f3fe-2642",
            "1f477-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f477-1f3fb-2642": {
        "id": "1f477-1f3fb-2642",
        "name": "man construction worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f477-1f3fc-2642": {
        "id": "1f477-1f3fc-2642",
        "name": "man construction worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f477-1f3fd-2642": {
        "id": "1f477-1f3fd-2642",
        "name": "man construction worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f477-1f3fe-2642": {
        "id": "1f477-1f3fe-2642",
        "name": "man construction worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f477-1f3ff-2642": {
        "id": "1f477-1f3ff-2642",
        "name": "man construction worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f482": {
        "id": "1f482",
        "name": "guard",
        "category": "people",
        "diversities": [
            "1f482-1f3fb",
            "1f482-1f3fc",
            "1f482-1f3fd",
            "1f482-1f3fe",
            "1f482-1f3ff"
        ],
        "genders": [
            "1f482-2642",
            "1f482-2640"
        ]
    },
    "1f482-1f3fb": {
        "id": "1f482-1f3fb",
        "name": "guard: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f482-1f3fb-2642",
            "1f482-1f3fb-2640"
        ]
    },
    "1f482-1f3fc": {
        "id": "1f482-1f3fc",
        "name": "guard: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f482-1f3fc-2642",
            "1f482-1f3fc-2640"
        ]
    },
    "1f482-1f3fd": {
        "id": "1f482-1f3fd",
        "name": "guard: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f482-1f3fd-2642",
            "1f482-1f3fd-2640"
        ]
    },
    "1f482-1f3fe": {
        "id": "1f482-1f3fe",
        "name": "guard: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f482-1f3fe-2642",
            "1f482-1f3fe-2640"
        ]
    },
    "1f482-1f3ff": {
        "id": "1f482-1f3ff",
        "name": "guard: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f482-1f3ff-2642",
            "1f482-1f3ff-2640"
        ]
    },
    "1f482-2640": {
        "id": "1f482-2640",
        "name": "woman guard",
        "category": "people",
        "diversities": [
            "1f482-1f3fb-2640",
            "1f482-1f3fc-2640",
            "1f482-1f3fd-2640",
            "1f482-1f3fe-2640",
            "1f482-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f482-1f3fb-2640": {
        "id": "1f482-1f3fb-2640",
        "name": "woman guard: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f482-1f3fc-2640": {
        "id": "1f482-1f3fc-2640",
        "name": "woman guard: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f482-1f3fd-2640": {
        "id": "1f482-1f3fd-2640",
        "name": "woman guard: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f482-1f3fe-2640": {
        "id": "1f482-1f3fe-2640",
        "name": "woman guard: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f482-1f3ff-2640": {
        "id": "1f482-1f3ff-2640",
        "name": "woman guard: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f482-2642": {
        "id": "1f482-2642",
        "name": "man guard",
        "category": "people",
        "diversities": [
            "1f482-1f3fb-2642",
            "1f482-1f3fc-2642",
            "1f482-1f3fd-2642",
            "1f482-1f3fe-2642",
            "1f482-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f482-1f3fb-2642": {
        "id": "1f482-1f3fb-2642",
        "name": "man guard: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f482-1f3fc-2642": {
        "id": "1f482-1f3fc-2642",
        "name": "man guard: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f482-1f3fd-2642": {
        "id": "1f482-1f3fd-2642",
        "name": "man guard: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f482-1f3fe-2642": {
        "id": "1f482-1f3fe-2642",
        "name": "man guard: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f482-1f3ff-2642": {
        "id": "1f482-1f3ff-2642",
        "name": "man guard: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f575": {
        "id": "1f575",
        "name": "detective",
        "category": "people",
        "diversities": [
            "1f575-1f3fb",
            "1f575-1f3fc",
            "1f575-1f3fd",
            "1f575-1f3fe",
            "1f575-1f3ff"
        ],
        "genders": [
            "1f575-2642",
            "1f575-2640"
        ]
    },
    "1f575-1f3fb": {
        "id": "1f575-1f3fb",
        "name": "detective: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f575-1f3fb-2642",
            "1f575-1f3fb-2640"
        ]
    },
    "1f575-1f3fc": {
        "id": "1f575-1f3fc",
        "name": "detective: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f575-1f3fc-2642",
            "1f575-1f3fc-2640"
        ]
    },
    "1f575-1f3fd": {
        "id": "1f575-1f3fd",
        "name": "detective: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f575-1f3fd-2642",
            "1f575-1f3fd-2640"
        ]
    },
    "1f575-1f3fe": {
        "id": "1f575-1f3fe",
        "name": "detective: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f575-1f3fe-2642",
            "1f575-1f3fe-2640"
        ]
    },
    "1f575-1f3ff": {
        "id": "1f575-1f3ff",
        "name": "detective: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f575-1f3ff-2642",
            "1f575-1f3ff-2640"
        ]
    },
    "1f575-2640": {
        "id": "1f575-2640",
        "name": "woman detective",
        "category": "people",
        "diversities": [
            "1f575-1f3fb-2640",
            "1f575-1f3fc-2640",
            "1f575-1f3fd-2640",
            "1f575-1f3fe-2640",
            "1f575-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f575-1f3fb-2640": {
        "id": "1f575-1f3fb-2640",
        "name": "woman detective: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f575-1f3fc-2640": {
        "id": "1f575-1f3fc-2640",
        "name": "woman detective: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f575-1f3fd-2640": {
        "id": "1f575-1f3fd-2640",
        "name": "woman detective: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f575-1f3fe-2640": {
        "id": "1f575-1f3fe-2640",
        "name": "woman detective: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f575-1f3ff-2640": {
        "id": "1f575-1f3ff-2640",
        "name": "woman detective: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f575-2642": {
        "id": "1f575-2642",
        "name": "man detective",
        "category": "people",
        "diversities": [
            "1f575-1f3fb-2642",
            "1f575-1f3fc-2642",
            "1f575-1f3fd-2642",
            "1f575-1f3fe-2642",
            "1f575-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f575-1f3fb-2642": {
        "id": "1f575-1f3fb-2642",
        "name": "man detective: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f575-1f3fc-2642": {
        "id": "1f575-1f3fc-2642",
        "name": "man detective: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f575-1f3fd-2642": {
        "id": "1f575-1f3fd-2642",
        "name": "man detective: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f575-1f3fe-2642": {
        "id": "1f575-1f3fe-2642",
        "name": "man detective: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f575-1f3ff-2642": {
        "id": "1f575-1f3ff-2642",
        "name": "man detective: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f469-2695": {
        "id": "1f469-2695",
        "name": "woman health worker",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-2695",
            "1f469-1f3fc-2695",
            "1f469-1f3fd-2695",
            "1f469-1f3fe-2695",
            "1f469-1f3ff-2695"
        ]
    },
    "1f469-1f3fb-2695": {
        "id": "1f469-1f3fb-2695",
        "name": "woman health worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-2695": {
        "id": "1f469-1f3fc-2695",
        "name": "woman health worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-2695": {
        "id": "1f469-1f3fd-2695",
        "name": "woman health worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-2695": {
        "id": "1f469-1f3fe-2695",
        "name": "woman health worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-2695": {
        "id": "1f469-1f3ff-2695",
        "name": "woman health worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-2695": {
        "id": "1f468-2695",
        "name": "man health worker",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-2695",
            "1f468-1f3fc-2695",
            "1f468-1f3fd-2695",
            "1f468-1f3fe-2695",
            "1f468-1f3ff-2695"
        ]
    },
    "1f468-1f3fb-2695": {
        "id": "1f468-1f3fb-2695",
        "name": "man health worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-2695": {
        "id": "1f468-1f3fc-2695",
        "name": "man health worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-2695": {
        "id": "1f468-1f3fd-2695",
        "name": "man health worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-2695": {
        "id": "1f468-1f3fe-2695",
        "name": "man health worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-2695": {
        "id": "1f468-1f3ff-2695",
        "name": "man health worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f33e": {
        "id": "1f469-1f33e",
        "name": "woman farmer",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f33e",
            "1f469-1f3fc-1f33e",
            "1f469-1f3fd-1f33e",
            "1f469-1f3fe-1f33e",
            "1f469-1f3ff-1f33e"
        ]
    },
    "1f469-1f3fb-1f33e": {
        "id": "1f469-1f3fb-1f33e",
        "name": "woman farmer: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f33e": {
        "id": "1f469-1f3fc-1f33e",
        "name": "woman farmer: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f33e": {
        "id": "1f469-1f3fd-1f33e",
        "name": "woman farmer: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f33e": {
        "id": "1f469-1f3fe-1f33e",
        "name": "woman farmer: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f33e": {
        "id": "1f469-1f3ff-1f33e",
        "name": "woman farmer: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f33e": {
        "id": "1f468-1f33e",
        "name": "man farmer",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f33e",
            "1f468-1f3fc-1f33e",
            "1f468-1f3fd-1f33e",
            "1f468-1f3fe-1f33e",
            "1f468-1f3ff-1f33e"
        ]
    },
    "1f468-1f3fb-1f33e": {
        "id": "1f468-1f3fb-1f33e",
        "name": "man farmer: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f33e": {
        "id": "1f468-1f3fc-1f33e",
        "name": "man farmer: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f33e": {
        "id": "1f468-1f3fd-1f33e",
        "name": "man farmer: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f33e": {
        "id": "1f468-1f3fe-1f33e",
        "name": "man farmer: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f33e": {
        "id": "1f468-1f3ff-1f33e",
        "name": "man farmer: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f373": {
        "id": "1f469-1f373",
        "name": "woman cook",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f373",
            "1f469-1f3fc-1f373",
            "1f469-1f3fd-1f373",
            "1f469-1f3fe-1f373",
            "1f469-1f3ff-1f373"
        ]
    },
    "1f469-1f3fb-1f373": {
        "id": "1f469-1f3fb-1f373",
        "name": "woman cook: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f373": {
        "id": "1f469-1f3fc-1f373",
        "name": "woman cook: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f373": {
        "id": "1f469-1f3fd-1f373",
        "name": "woman cook: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f373": {
        "id": "1f469-1f3fe-1f373",
        "name": "woman cook: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f373": {
        "id": "1f469-1f3ff-1f373",
        "name": "woman cook: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f373": {
        "id": "1f468-1f373",
        "name": "man cook",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f373",
            "1f468-1f3fc-1f373",
            "1f468-1f3fd-1f373",
            "1f468-1f3fe-1f373",
            "1f468-1f3ff-1f373"
        ]
    },
    "1f468-1f3fb-1f373": {
        "id": "1f468-1f3fb-1f373",
        "name": "man cook: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f373": {
        "id": "1f468-1f3fc-1f373",
        "name": "man cook: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f373": {
        "id": "1f468-1f3fd-1f373",
        "name": "man cook: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f373": {
        "id": "1f468-1f3fe-1f373",
        "name": "man cook: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f373": {
        "id": "1f468-1f3ff-1f373",
        "name": "man cook: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f393": {
        "id": "1f469-1f393",
        "name": "woman student",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f393",
            "1f469-1f3fc-1f393",
            "1f469-1f3fd-1f393",
            "1f469-1f3fe-1f393",
            "1f469-1f3ff-1f393"
        ]
    },
    "1f469-1f3fb-1f393": {
        "id": "1f469-1f3fb-1f393",
        "name": "woman student: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f393": {
        "id": "1f469-1f3fc-1f393",
        "name": "woman student: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f393": {
        "id": "1f469-1f3fd-1f393",
        "name": "woman student: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f393": {
        "id": "1f469-1f3fe-1f393",
        "name": "woman student: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f393": {
        "id": "1f469-1f3ff-1f393",
        "name": "woman student: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f393": {
        "id": "1f468-1f393",
        "name": "man student",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f393",
            "1f468-1f3fc-1f393",
            "1f468-1f3fd-1f393",
            "1f468-1f3fe-1f393",
            "1f468-1f3ff-1f393"
        ]
    },
    "1f468-1f3fb-1f393": {
        "id": "1f468-1f3fb-1f393",
        "name": "man student: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f393": {
        "id": "1f468-1f3fc-1f393",
        "name": "man student: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f393": {
        "id": "1f468-1f3fd-1f393",
        "name": "man student: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f393": {
        "id": "1f468-1f3fe-1f393",
        "name": "man student: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f393": {
        "id": "1f468-1f3ff-1f393",
        "name": "man student: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f3a4": {
        "id": "1f469-1f3a4",
        "name": "woman singer",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f3a4",
            "1f469-1f3fc-1f3a4",
            "1f469-1f3fd-1f3a4",
            "1f469-1f3fe-1f3a4",
            "1f469-1f3ff-1f3a4"
        ]
    },
    "1f469-1f3fb-1f3a4": {
        "id": "1f469-1f3fb-1f3a4",
        "name": "woman singer: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f3a4": {
        "id": "1f469-1f3fc-1f3a4",
        "name": "woman singer: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f3a4": {
        "id": "1f469-1f3fd-1f3a4",
        "name": "woman singer: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f3a4": {
        "id": "1f469-1f3fe-1f3a4",
        "name": "woman singer: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f3a4": {
        "id": "1f469-1f3ff-1f3a4",
        "name": "woman singer: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f3a4": {
        "id": "1f468-1f3a4",
        "name": "man singer",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f3a4",
            "1f468-1f3fc-1f3a4",
            "1f468-1f3fd-1f3a4",
            "1f468-1f3fe-1f3a4",
            "1f468-1f3ff-1f3a4"
        ]
    },
    "1f468-1f3fb-1f3a4": {
        "id": "1f468-1f3fb-1f3a4",
        "name": "man singer: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f3a4": {
        "id": "1f468-1f3fc-1f3a4",
        "name": "man singer: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f3a4": {
        "id": "1f468-1f3fd-1f3a4",
        "name": "man singer: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f3a4": {
        "id": "1f468-1f3fe-1f3a4",
        "name": "man singer: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f3a4": {
        "id": "1f468-1f3ff-1f3a4",
        "name": "man singer: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f3eb": {
        "id": "1f469-1f3eb",
        "name": "woman teacher",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f3eb",
            "1f469-1f3fc-1f3eb",
            "1f469-1f3fd-1f3eb",
            "1f469-1f3fe-1f3eb",
            "1f469-1f3ff-1f3eb"
        ]
    },
    "1f469-1f3fb-1f3eb": {
        "id": "1f469-1f3fb-1f3eb",
        "name": "woman teacher: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f3eb": {
        "id": "1f469-1f3fc-1f3eb",
        "name": "woman teacher: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f3eb": {
        "id": "1f469-1f3fd-1f3eb",
        "name": "woman teacher: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f3eb": {
        "id": "1f469-1f3fe-1f3eb",
        "name": "woman teacher: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f3eb": {
        "id": "1f469-1f3ff-1f3eb",
        "name": "woman teacher: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f3eb": {
        "id": "1f468-1f3eb",
        "name": "man teacher",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f3eb",
            "1f468-1f3fc-1f3eb",
            "1f468-1f3fd-1f3eb",
            "1f468-1f3fe-1f3eb",
            "1f468-1f3ff-1f3eb"
        ]
    },
    "1f468-1f3fb-1f3eb": {
        "id": "1f468-1f3fb-1f3eb",
        "name": "man teacher: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f3eb": {
        "id": "1f468-1f3fc-1f3eb",
        "name": "man teacher: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f3eb": {
        "id": "1f468-1f3fd-1f3eb",
        "name": "man teacher: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f3eb": {
        "id": "1f468-1f3fe-1f3eb",
        "name": "man teacher: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f3eb": {
        "id": "1f468-1f3ff-1f3eb",
        "name": "man teacher: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f3ed": {
        "id": "1f469-1f3ed",
        "name": "woman factory worker",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f3ed",
            "1f469-1f3fc-1f3ed",
            "1f469-1f3fd-1f3ed",
            "1f469-1f3fe-1f3ed",
            "1f469-1f3ff-1f3ed"
        ]
    },
    "1f469-1f3fb-1f3ed": {
        "id": "1f469-1f3fb-1f3ed",
        "name": "woman factory worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f3ed": {
        "id": "1f469-1f3fc-1f3ed",
        "name": "woman factory worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f3ed": {
        "id": "1f469-1f3fd-1f3ed",
        "name": "woman factory worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f3ed": {
        "id": "1f469-1f3fe-1f3ed",
        "name": "woman factory worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f3ed": {
        "id": "1f469-1f3ff-1f3ed",
        "name": "woman factory worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f3ed": {
        "id": "1f468-1f3ed",
        "name": "man factory worker",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f3ed",
            "1f468-1f3fc-1f3ed",
            "1f468-1f3fd-1f3ed",
            "1f468-1f3fe-1f3ed",
            "1f468-1f3ff-1f3ed"
        ]
    },
    "1f468-1f3fb-1f3ed": {
        "id": "1f468-1f3fb-1f3ed",
        "name": "man factory worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f3ed": {
        "id": "1f468-1f3fc-1f3ed",
        "name": "man factory worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f3ed": {
        "id": "1f468-1f3fd-1f3ed",
        "name": "man factory worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f3ed": {
        "id": "1f468-1f3fe-1f3ed",
        "name": "man factory worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f3ed": {
        "id": "1f468-1f3ff-1f3ed",
        "name": "man factory worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f4bb": {
        "id": "1f469-1f4bb",
        "name": "woman technologist",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f4bb",
            "1f469-1f3fc-1f4bb",
            "1f469-1f3fd-1f4bb",
            "1f469-1f3fe-1f4bb",
            "1f469-1f3ff-1f4bb"
        ]
    },
    "1f469-1f3fb-1f4bb": {
        "id": "1f469-1f3fb-1f4bb",
        "name": "woman technologist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f4bb": {
        "id": "1f469-1f3fc-1f4bb",
        "name": "woman technologist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f4bb": {
        "id": "1f469-1f3fd-1f4bb",
        "name": "woman technologist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f4bb": {
        "id": "1f469-1f3fe-1f4bb",
        "name": "woman technologist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f4bb": {
        "id": "1f469-1f3ff-1f4bb",
        "name": "woman technologist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f4bb": {
        "id": "1f468-1f4bb",
        "name": "man technologist",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f4bb",
            "1f468-1f3fc-1f4bb",
            "1f468-1f3fd-1f4bb",
            "1f468-1f3fe-1f4bb",
            "1f468-1f3ff-1f4bb"
        ]
    },
    "1f468-1f3fb-1f4bb": {
        "id": "1f468-1f3fb-1f4bb",
        "name": "man technologist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f4bb": {
        "id": "1f468-1f3fc-1f4bb",
        "name": "man technologist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f4bb": {
        "id": "1f468-1f3fd-1f4bb",
        "name": "man technologist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f4bb": {
        "id": "1f468-1f3fe-1f4bb",
        "name": "man technologist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f4bb": {
        "id": "1f468-1f3ff-1f4bb",
        "name": "man technologist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f4bc": {
        "id": "1f469-1f4bc",
        "name": "woman office worker",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f4bc",
            "1f469-1f3fc-1f4bc",
            "1f469-1f3fd-1f4bc",
            "1f469-1f3fe-1f4bc",
            "1f469-1f3ff-1f4bc"
        ]
    },
    "1f469-1f3fb-1f4bc": {
        "id": "1f469-1f3fb-1f4bc",
        "name": "woman office worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f4bc": {
        "id": "1f469-1f3fc-1f4bc",
        "name": "woman office worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f4bc": {
        "id": "1f469-1f3fd-1f4bc",
        "name": "woman office worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f4bc": {
        "id": "1f469-1f3fe-1f4bc",
        "name": "woman office worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f4bc": {
        "id": "1f469-1f3ff-1f4bc",
        "name": "woman office worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f4bc": {
        "id": "1f468-1f4bc",
        "name": "man office worker",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f4bc",
            "1f468-1f3fc-1f4bc",
            "1f468-1f3fd-1f4bc",
            "1f468-1f3fe-1f4bc",
            "1f468-1f3ff-1f4bc"
        ]
    },
    "1f468-1f3fb-1f4bc": {
        "id": "1f468-1f3fb-1f4bc",
        "name": "man office worker: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f4bc": {
        "id": "1f468-1f3fc-1f4bc",
        "name": "man office worker: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f4bc": {
        "id": "1f468-1f3fd-1f4bc",
        "name": "man office worker: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f4bc": {
        "id": "1f468-1f3fe-1f4bc",
        "name": "man office worker: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f4bc": {
        "id": "1f468-1f3ff-1f4bc",
        "name": "man office worker: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f527": {
        "id": "1f469-1f527",
        "name": "woman mechanic",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f527",
            "1f469-1f3fc-1f527",
            "1f469-1f3fd-1f527",
            "1f469-1f3fe-1f527",
            "1f469-1f3ff-1f527"
        ]
    },
    "1f469-1f3fb-1f527": {
        "id": "1f469-1f3fb-1f527",
        "name": "woman mechanic: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f527": {
        "id": "1f469-1f3fc-1f527",
        "name": "woman mechanic: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f527": {
        "id": "1f469-1f3fd-1f527",
        "name": "woman mechanic: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f527": {
        "id": "1f469-1f3fe-1f527",
        "name": "woman mechanic: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f527": {
        "id": "1f469-1f3ff-1f527",
        "name": "woman mechanic: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f527": {
        "id": "1f468-1f527",
        "name": "man mechanic",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f527",
            "1f468-1f3fc-1f527",
            "1f468-1f3fd-1f527",
            "1f468-1f3fe-1f527",
            "1f468-1f3ff-1f527"
        ]
    },
    "1f468-1f3fb-1f527": {
        "id": "1f468-1f3fb-1f527",
        "name": "man mechanic: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f527": {
        "id": "1f468-1f3fc-1f527",
        "name": "man mechanic: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f527": {
        "id": "1f468-1f3fd-1f527",
        "name": "man mechanic: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f527": {
        "id": "1f468-1f3fe-1f527",
        "name": "man mechanic: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f527": {
        "id": "1f468-1f3ff-1f527",
        "name": "man mechanic: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f52c": {
        "id": "1f469-1f52c",
        "name": "woman scientist",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f52c",
            "1f469-1f3fc-1f52c",
            "1f469-1f3fd-1f52c",
            "1f469-1f3fe-1f52c",
            "1f469-1f3ff-1f52c"
        ]
    },
    "1f469-1f3fb-1f52c": {
        "id": "1f469-1f3fb-1f52c",
        "name": "woman scientist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f52c": {
        "id": "1f469-1f3fc-1f52c",
        "name": "woman scientist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f52c": {
        "id": "1f469-1f3fd-1f52c",
        "name": "woman scientist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f52c": {
        "id": "1f469-1f3fe-1f52c",
        "name": "woman scientist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f52c": {
        "id": "1f469-1f3ff-1f52c",
        "name": "woman scientist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f52c": {
        "id": "1f468-1f52c",
        "name": "man scientist",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f52c",
            "1f468-1f3fc-1f52c",
            "1f468-1f3fd-1f52c",
            "1f468-1f3fe-1f52c",
            "1f468-1f3ff-1f52c"
        ]
    },
    "1f468-1f3fb-1f52c": {
        "id": "1f468-1f3fb-1f52c",
        "name": "man scientist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f52c": {
        "id": "1f468-1f3fc-1f52c",
        "name": "man scientist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f52c": {
        "id": "1f468-1f3fd-1f52c",
        "name": "man scientist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f52c": {
        "id": "1f468-1f3fe-1f52c",
        "name": "man scientist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f52c": {
        "id": "1f468-1f3ff-1f52c",
        "name": "man scientist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f3a8": {
        "id": "1f469-1f3a8",
        "name": "woman artist",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f3a8",
            "1f469-1f3fc-1f3a8",
            "1f469-1f3fd-1f3a8",
            "1f469-1f3fe-1f3a8",
            "1f469-1f3ff-1f3a8"
        ]
    },
    "1f469-1f3fb-1f3a8": {
        "id": "1f469-1f3fb-1f3a8",
        "name": "woman artist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f3a8": {
        "id": "1f469-1f3fc-1f3a8",
        "name": "woman artist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f3a8": {
        "id": "1f469-1f3fd-1f3a8",
        "name": "woman artist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f3a8": {
        "id": "1f469-1f3fe-1f3a8",
        "name": "woman artist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f3a8": {
        "id": "1f469-1f3ff-1f3a8",
        "name": "woman artist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f3a8": {
        "id": "1f468-1f3a8",
        "name": "man artist",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f3a8",
            "1f468-1f3fc-1f3a8",
            "1f468-1f3fd-1f3a8",
            "1f468-1f3fe-1f3a8",
            "1f468-1f3ff-1f3a8"
        ]
    },
    "1f468-1f3fb-1f3a8": {
        "id": "1f468-1f3fb-1f3a8",
        "name": "man artist: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f3a8": {
        "id": "1f468-1f3fc-1f3a8",
        "name": "man artist: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f3a8": {
        "id": "1f468-1f3fd-1f3a8",
        "name": "man artist: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f3a8": {
        "id": "1f468-1f3fe-1f3a8",
        "name": "man artist: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f3a8": {
        "id": "1f468-1f3ff-1f3a8",
        "name": "man artist: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f692": {
        "id": "1f469-1f692",
        "name": "woman firefighter",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f692",
            "1f469-1f3fc-1f692",
            "1f469-1f3fd-1f692",
            "1f469-1f3fe-1f692",
            "1f469-1f3ff-1f692"
        ]
    },
    "1f469-1f3fb-1f692": {
        "id": "1f469-1f3fb-1f692",
        "name": "woman firefighter: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f692": {
        "id": "1f469-1f3fc-1f692",
        "name": "woman firefighter: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f692": {
        "id": "1f469-1f3fd-1f692",
        "name": "woman firefighter: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f692": {
        "id": "1f469-1f3fe-1f692",
        "name": "woman firefighter: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f692": {
        "id": "1f469-1f3ff-1f692",
        "name": "woman firefighter: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f692": {
        "id": "1f468-1f692",
        "name": "man firefighter",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f692",
            "1f468-1f3fc-1f692",
            "1f468-1f3fd-1f692",
            "1f468-1f3fe-1f692",
            "1f468-1f3ff-1f692"
        ]
    },
    "1f468-1f3fb-1f692": {
        "id": "1f468-1f3fb-1f692",
        "name": "man firefighter: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f692": {
        "id": "1f468-1f3fc-1f692",
        "name": "man firefighter: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f692": {
        "id": "1f468-1f3fd-1f692",
        "name": "man firefighter: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f692": {
        "id": "1f468-1f3fe-1f692",
        "name": "man firefighter: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f692": {
        "id": "1f468-1f3ff-1f692",
        "name": "man firefighter: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-2708": {
        "id": "1f469-2708",
        "name": "woman pilot",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-2708",
            "1f469-1f3fc-2708",
            "1f469-1f3fd-2708",
            "1f469-1f3fe-2708",
            "1f469-1f3ff-2708"
        ]
    },
    "1f469-1f3fb-2708": {
        "id": "1f469-1f3fb-2708",
        "name": "woman pilot: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-2708": {
        "id": "1f469-1f3fc-2708",
        "name": "woman pilot: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-2708": {
        "id": "1f469-1f3fd-2708",
        "name": "woman pilot: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-2708": {
        "id": "1f469-1f3fe-2708",
        "name": "woman pilot: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-2708": {
        "id": "1f469-1f3ff-2708",
        "name": "woman pilot: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-2708": {
        "id": "1f468-2708",
        "name": "man pilot",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-2708",
            "1f468-1f3fc-2708",
            "1f468-1f3fd-2708",
            "1f468-1f3fe-2708",
            "1f468-1f3ff-2708"
        ]
    },
    "1f468-1f3fb-2708": {
        "id": "1f468-1f3fb-2708",
        "name": "man pilot: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-2708": {
        "id": "1f468-1f3fc-2708",
        "name": "man pilot: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-2708": {
        "id": "1f468-1f3fd-2708",
        "name": "man pilot: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-2708": {
        "id": "1f468-1f3fe-2708",
        "name": "man pilot: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-2708": {
        "id": "1f468-1f3ff-2708",
        "name": "man pilot: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-1f680": {
        "id": "1f469-1f680",
        "name": "woman astronaut",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-1f680",
            "1f469-1f3fc-1f680",
            "1f469-1f3fd-1f680",
            "1f469-1f3fe-1f680",
            "1f469-1f3ff-1f680"
        ]
    },
    "1f469-1f3fb-1f680": {
        "id": "1f469-1f3fb-1f680",
        "name": "woman astronaut: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-1f680": {
        "id": "1f469-1f3fc-1f680",
        "name": "woman astronaut: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-1f680": {
        "id": "1f469-1f3fd-1f680",
        "name": "woman astronaut: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-1f680": {
        "id": "1f469-1f3fe-1f680",
        "name": "woman astronaut: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-1f680": {
        "id": "1f469-1f3ff-1f680",
        "name": "woman astronaut: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-1f680": {
        "id": "1f468-1f680",
        "name": "man astronaut",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-1f680",
            "1f468-1f3fc-1f680",
            "1f468-1f3fd-1f680",
            "1f468-1f3fe-1f680",
            "1f468-1f3ff-1f680"
        ]
    },
    "1f468-1f3fb-1f680": {
        "id": "1f468-1f3fb-1f680",
        "name": "man astronaut: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-1f680": {
        "id": "1f468-1f3fc-1f680",
        "name": "man astronaut: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-1f680": {
        "id": "1f468-1f3fd-1f680",
        "name": "man astronaut: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-1f680": {
        "id": "1f468-1f3fe-1f680",
        "name": "man astronaut: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-1f680": {
        "id": "1f468-1f3ff-1f680",
        "name": "man astronaut: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f469-2696": {
        "id": "1f469-2696",
        "name": "woman judge",
        "category": "people",
        "diversities": [
            "1f469-1f3fb-2696",
            "1f469-1f3fc-2696",
            "1f469-1f3fd-2696",
            "1f469-1f3fe-2696",
            "1f469-1f3ff-2696"
        ]
    },
    "1f469-1f3fb-2696": {
        "id": "1f469-1f3fb-2696",
        "name": "woman judge: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f469-1f3fc-2696": {
        "id": "1f469-1f3fc-2696",
        "name": "woman judge: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f469-1f3fd-2696": {
        "id": "1f469-1f3fd-2696",
        "name": "woman judge: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f469-1f3fe-2696": {
        "id": "1f469-1f3fe-2696",
        "name": "woman judge: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f469-1f3ff-2696": {
        "id": "1f469-1f3ff-2696",
        "name": "woman judge: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f468-2696": {
        "id": "1f468-2696",
        "name": "man judge",
        "category": "people",
        "diversities": [
            "1f468-1f3fb-2696",
            "1f468-1f3fc-2696",
            "1f468-1f3fd-2696",
            "1f468-1f3fe-2696",
            "1f468-1f3ff-2696"
        ]
    },
    "1f468-1f3fb-2696": {
        "id": "1f468-1f3fb-2696",
        "name": "man judge: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f468-1f3fc-2696": {
        "id": "1f468-1f3fc-2696",
        "name": "man judge: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f468-1f3fd-2696": {
        "id": "1f468-1f3fd-2696",
        "name": "man judge: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f468-1f3fe-2696": {
        "id": "1f468-1f3fe-2696",
        "name": "man judge: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f468-1f3ff-2696": {
        "id": "1f468-1f3ff-2696",
        "name": "man judge: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f470": {
        "id": "1f470",
        "name": "bride with veil",
        "category": "people",
        "diversities": [
            "1f470-1f3fb",
            "1f470-1f3fc",
            "1f470-1f3fd",
            "1f470-1f3fe",
            "1f470-1f3ff"
        ]
    },
    "1f470-1f3fb": {
        "id": "1f470-1f3fb",
        "name": "bride with veil: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f470-1f3fc": {
        "id": "1f470-1f3fc",
        "name": "bride with veil: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f470-1f3fd": {
        "id": "1f470-1f3fd",
        "name": "bride with veil: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f470-1f3fe": {
        "id": "1f470-1f3fe",
        "name": "bride with veil: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f470-1f3ff": {
        "id": "1f470-1f3ff",
        "name": "bride with veil: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f935": {
        "id": "1f935",
        "name": "man in tuxedo",
        "category": "people",
        "diversities": [
            "1f935-1f3fb",
            "1f935-1f3fc",
            "1f935-1f3fd",
            "1f935-1f3fe",
            "1f935-1f3ff"
        ]
    },
    "1f935-1f3fb": {
        "id": "1f935-1f3fb",
        "name": "man in tuxedo: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f935-1f3fc": {
        "id": "1f935-1f3fc",
        "name": "man in tuxedo: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f935-1f3fd": {
        "id": "1f935-1f3fd",
        "name": "man in tuxedo: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f935-1f3fe": {
        "id": "1f935-1f3fe",
        "name": "man in tuxedo: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f935-1f3ff": {
        "id": "1f935-1f3ff",
        "name": "man in tuxedo: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f478": {
        "id": "1f478",
        "name": "princess",
        "category": "people",
        "diversities": [
            "1f478-1f3fb",
            "1f478-1f3fc",
            "1f478-1f3fd",
            "1f478-1f3fe",
            "1f478-1f3ff"
        ]
    },
    "1f478-1f3fb": {
        "id": "1f478-1f3fb",
        "name": "princess: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f478-1f3fc": {
        "id": "1f478-1f3fc",
        "name": "princess: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f478-1f3fd": {
        "id": "1f478-1f3fd",
        "name": "princess: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f478-1f3fe": {
        "id": "1f478-1f3fe",
        "name": "princess: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f478-1f3ff": {
        "id": "1f478-1f3ff",
        "name": "princess: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f934": {
        "id": "1f934",
        "name": "prince",
        "category": "people",
        "diversities": [
            "1f934-1f3fb",
            "1f934-1f3fc",
            "1f934-1f3fd",
            "1f934-1f3fe",
            "1f934-1f3ff"
        ]
    },
    "1f934-1f3fb": {
        "id": "1f934-1f3fb",
        "name": "prince: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f934-1f3fc": {
        "id": "1f934-1f3fc",
        "name": "prince: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f934-1f3fd": {
        "id": "1f934-1f3fd",
        "name": "prince: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f934-1f3fe": {
        "id": "1f934-1f3fe",
        "name": "prince: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f934-1f3ff": {
        "id": "1f934-1f3ff",
        "name": "prince: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f936": {
        "id": "1f936",
        "name": "Mrs. Claus",
        "category": "people",
        "diversities": [
            "1f936-1f3fb",
            "1f936-1f3fc",
            "1f936-1f3fd",
            "1f936-1f3fe",
            "1f936-1f3ff"
        ]
    },
    "1f936-1f3fb": {
        "id": "1f936-1f3fb",
        "name": "Mrs. Claus: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f936-1f3fd": {
        "id": "1f936-1f3fd",
        "name": "Mrs. Claus: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f936-1f3fc": {
        "id": "1f936-1f3fc",
        "name": "Mrs. Claus: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f936-1f3fe": {
        "id": "1f936-1f3fe",
        "name": "Mrs. Claus: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f936-1f3ff": {
        "id": "1f936-1f3ff",
        "name": "Mrs. Claus: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f385": {
        "id": "1f385",
        "name": "Santa Claus",
        "category": "people",
        "diversities": [
            "1f385-1f3fb",
            "1f385-1f3fc",
            "1f385-1f3fd",
            "1f385-1f3fe",
            "1f385-1f3ff"
        ]
    },
    "1f385-1f3fb": {
        "id": "1f385-1f3fb",
        "name": "Santa Claus: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f385-1f3fc": {
        "id": "1f385-1f3fc",
        "name": "Santa Claus: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f385-1f3fd": {
        "id": "1f385-1f3fd",
        "name": "Santa Claus: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f385-1f3fe": {
        "id": "1f385-1f3fe",
        "name": "Santa Claus: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f385-1f3ff": {
        "id": "1f385-1f3ff",
        "name": "Santa Claus: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f9b8": {
        "id": "1f9b8",
        "name": "superhero",
        "category": "people",
        "diversities": [
            "1f9b8-1f3fb",
            "1f9b8-1f3fc",
            "1f9b8-1f3fd",
            "1f9b8-1f3fe",
            "1f9b8-1f3ff"
        ],
        "genders": [
            "1f9b8-2642",
            "1f9b8-2640"
        ]
    },
    "1f9b8-1f3fb": {
        "id": "1f9b8-1f3fb",
        "name": "superhero: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9b8-1f3fb-2642",
            "1f9b8-1f3fb-2640"
        ]
    },
    "1f9b8-1f3fc": {
        "id": "1f9b8-1f3fc",
        "name": "superhero: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9b8-1f3fc-2642",
            "1f9b8-1f3fc-2640"
        ]
    },
    "1f9b8-1f3fd": {
        "id": "1f9b8-1f3fd",
        "name": "superhero: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9b8-1f3fd-2642",
            "1f9b8-1f3fd-2640"
        ]
    },
    "1f9b8-1f3fe": {
        "id": "1f9b8-1f3fe",
        "name": "superhero: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9b8-1f3fe-2642",
            "1f9b8-1f3fe-2640"
        ]
    },
    "1f9b8-1f3ff": {
        "id": "1f9b8-1f3ff",
        "name": "superhero: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9b8-1f3ff-2642",
            "1f9b8-1f3ff-2640"
        ]
    },
    "1f9b8-2640": {
        "id": "1f9b8-2640",
        "name": "woman superhero",
        "category": "people",
        "diversities": [
            "1f9b8-1f3fb-2640",
            "1f9b8-1f3fc-2640",
            "1f9b8-1f3fd-2640",
            "1f9b8-1f3fe-2640",
            "1f9b8-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9b8-1f3fb-2640": {
        "id": "1f9b8-1f3fb-2640",
        "name": "woman superhero: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9b8-1f3fc-2640": {
        "id": "1f9b8-1f3fc-2640",
        "name": "woman superhero: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9b8-1f3fd-2640": {
        "id": "1f9b8-1f3fd-2640",
        "name": "woman superhero: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9b8-1f3fe-2640": {
        "id": "1f9b8-1f3fe-2640",
        "name": "woman superhero: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9b8-1f3ff-2640": {
        "id": "1f9b8-1f3ff-2640",
        "name": "woman superhero: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9b8-2642": {
        "id": "1f9b8-2642",
        "name": "man superhero",
        "category": "people",
        "diversities": [
            "1f9b8-1f3fb-2642",
            "1f9b8-1f3fc-2642",
            "1f9b8-1f3fd-2642",
            "1f9b8-1f3fe-2642",
            "1f9b8-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9b8-1f3fb-2642": {
        "id": "1f9b8-1f3fb-2642",
        "name": "man superhero: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9b8-1f3fc-2642": {
        "id": "1f9b8-1f3fc-2642",
        "name": "man superhero: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9b8-1f3fd-2642": {
        "id": "1f9b8-1f3fd-2642",
        "name": "man superhero: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9b8-1f3fe-2642": {
        "id": "1f9b8-1f3fe-2642",
        "name": "man superhero: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9b8-1f3ff-2642": {
        "id": "1f9b8-1f3ff-2642",
        "name": "man superhero: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9b9": {
        "id": "1f9b9",
        "name": "supervillain",
        "category": "people",
        "diversities": [
            "1f9b9-1f3fb",
            "1f9b9-1f3fc",
            "1f9b9-1f3fd",
            "1f9b9-1f3fe",
            "1f9b9-1f3ff"
        ],
        "genders": [
            "1f9b9-2642",
            "1f9b9-2640"
        ]
    },
    "1f9b9-1f3fb": {
        "id": "1f9b9-1f3fb",
        "name": "supervillain: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9b9-1f3fb-2642",
            "1f9b9-1f3fb-2640"
        ]
    },
    "1f9b9-1f3fc": {
        "id": "1f9b9-1f3fc",
        "name": "supervillain: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9b9-1f3fc-2642",
            "1f9b9-1f3fc-2640"
        ]
    },
    "1f9b9-1f3fd": {
        "id": "1f9b9-1f3fd",
        "name": "supervillain: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9b9-1f3fd-2642",
            "1f9b9-1f3fd-2640"
        ]
    },
    "1f9b9-1f3fe": {
        "id": "1f9b9-1f3fe",
        "name": "supervillain: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9b9-1f3fe-2642",
            "1f9b9-1f3fe-2640"
        ]
    },
    "1f9b9-1f3ff": {
        "id": "1f9b9-1f3ff",
        "name": "supervillain: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9b9-1f3ff-2642",
            "1f9b9-1f3ff-2640"
        ]
    },
    "1f9b9-1f3fb-2640": {
        "id": "1f9b9-1f3fb-2640",
        "name": "woman supervillain: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9b9-2640": {
        "id": "1f9b9-2640",
        "name": "woman supervillain",
        "category": "people",
        "diversities": [
            "1f9b9-1f3fb-2640",
            "1f9b9-1f3fc-2640",
            "1f9b9-1f3fd-2640",
            "1f9b9-1f3fe-2640",
            "1f9b9-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9b9-1f3fc-2640": {
        "id": "1f9b9-1f3fc-2640",
        "name": "woman supervillain: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9b9-1f3fd-2640": {
        "id": "1f9b9-1f3fd-2640",
        "name": "woman supervillain: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9b9-1f3fe-2640": {
        "id": "1f9b9-1f3fe-2640",
        "name": "woman supervillain: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9b9-1f3ff-2640": {
        "id": "1f9b9-1f3ff-2640",
        "name": "woman supervillain: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9b9-2642": {
        "id": "1f9b9-2642",
        "name": "man supervillain",
        "category": "people",
        "diversities": [
            "1f9b9-1f3fb-2642",
            "1f9b9-1f3fc-2642",
            "1f9b9-1f3fd-2642",
            "1f9b9-1f3fe-2642",
            "1f9b9-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9b9-1f3fb-2642": {
        "id": "1f9b9-1f3fb-2642",
        "name": "man supervillain: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9b9-1f3fc-2642": {
        "id": "1f9b9-1f3fc-2642",
        "name": "man supervillain: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9b9-1f3fd-2642": {
        "id": "1f9b9-1f3fd-2642",
        "name": "man supervillain: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9b9-1f3fe-2642": {
        "id": "1f9b9-1f3fe-2642",
        "name": "man supervillain: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9b9-1f3ff-2642": {
        "id": "1f9b9-1f3ff-2642",
        "name": "man supervillain: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9d9": {
        "id": "1f9d9",
        "name": "mage",
        "category": "people",
        "diversities": [
            "1f9d9-1f3fb",
            "1f9d9-1f3fc",
            "1f9d9-1f3fd",
            "1f9d9-1f3fe",
            "1f9d9-1f3ff"
        ],
        "genders": [
            "1f9d9-2642",
            "1f9d9-2640"
        ]
    },
    "1f9d9-1f3fb": {
        "id": "1f9d9-1f3fb",
        "name": "mage: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9d9-1f3fb-2642",
            "1f9d9-1f3fb-2640"
        ]
    },
    "1f9d9-1f3fc": {
        "id": "1f9d9-1f3fc",
        "name": "mage: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9d9-1f3fc-2642",
            "1f9d9-1f3fc-2640"
        ]
    },
    "1f9d9-1f3fd": {
        "id": "1f9d9-1f3fd",
        "name": "mage: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9d9-1f3fd-2642",
            "1f9d9-1f3fd-2640"
        ]
    },
    "1f9d9-1f3fe": {
        "id": "1f9d9-1f3fe",
        "name": "mage: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9d9-1f3fe-2642",
            "1f9d9-1f3fe-2640"
        ]
    },
    "1f9d9-1f3ff": {
        "id": "1f9d9-1f3ff",
        "name": "mage: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9d9-1f3ff-2642",
            "1f9d9-1f3ff-2640"
        ]
    },
    "1f9d9-2640": {
        "id": "1f9d9-2640",
        "name": "woman mage",
        "category": "people",
        "diversities": [
            "1f9d9-1f3fb-2640",
            "1f9d9-1f3fc-2640",
            "1f9d9-1f3fd-2640",
            "1f9d9-1f3fe-2640",
            "1f9d9-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9d9-1f3fb-2640": {
        "id": "1f9d9-1f3fb-2640",
        "name": "woman mage: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9d9-1f3fc-2640": {
        "id": "1f9d9-1f3fc-2640",
        "name": "woman mage: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9d9-1f3fd-2640": {
        "id": "1f9d9-1f3fd-2640",
        "name": "woman mage: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9d9-1f3fe-2640": {
        "id": "1f9d9-1f3fe-2640",
        "name": "woman mage: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9d9-1f3ff-2640": {
        "id": "1f9d9-1f3ff-2640",
        "name": "woman mage: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9d9-2642": {
        "id": "1f9d9-2642",
        "name": "man mage",
        "category": "people",
        "diversities": [
            "1f9d9-1f3fb-2642",
            "1f9d9-1f3fc-2642",
            "1f9d9-1f3fd-2642",
            "1f9d9-1f3fe-2642",
            "1f9d9-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9d9-1f3fb-2642": {
        "id": "1f9d9-1f3fb-2642",
        "name": "man mage: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9d9-1f3fc-2642": {
        "id": "1f9d9-1f3fc-2642",
        "name": "man mage: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9d9-1f3fd-2642": {
        "id": "1f9d9-1f3fd-2642",
        "name": "man mage: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9d9-1f3fe-2642": {
        "id": "1f9d9-1f3fe-2642",
        "name": "man mage: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9d9-1f3ff-2642": {
        "id": "1f9d9-1f3ff-2642",
        "name": "man mage: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9dd": {
        "id": "1f9dd",
        "name": "elf",
        "category": "people",
        "diversities": [
            "1f9dd-1f3fb",
            "1f9dd-1f3fc",
            "1f9dd-1f3fd",
            "1f9dd-1f3fe",
            "1f9dd-1f3ff"
        ],
        "genders": [
            "1f9dd-2642",
            "1f9dd-2640"
        ]
    },
    "1f9dd-1f3fb": {
        "id": "1f9dd-1f3fb",
        "name": "elf: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9dd-1f3fb-2642",
            "1f9dd-1f3fb-2640"
        ]
    },
    "1f9dd-1f3fc": {
        "id": "1f9dd-1f3fc",
        "name": "elf: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9dd-1f3fc-2642",
            "1f9dd-1f3fc-2640"
        ]
    },
    "1f9dd-1f3fd": {
        "id": "1f9dd-1f3fd",
        "name": "elf: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9dd-1f3fd-2642",
            "1f9dd-1f3fd-2640"
        ]
    },
    "1f9dd-1f3fe": {
        "id": "1f9dd-1f3fe",
        "name": "elf: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9dd-1f3fe-2642",
            "1f9dd-1f3fe-2640"
        ]
    },
    "1f9dd-1f3ff": {
        "id": "1f9dd-1f3ff",
        "name": "elf: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9dd-1f3ff-2642",
            "1f9dd-1f3ff-2640"
        ]
    },
    "1f9dd-2640": {
        "id": "1f9dd-2640",
        "name": "woman elf",
        "category": "people",
        "diversities": [
            "1f9dd-1f3fb-2640",
            "1f9dd-1f3fc-2640",
            "1f9dd-1f3fd-2640",
            "1f9dd-1f3fe-2640",
            "1f9dd-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9dd-1f3fb-2640": {
        "id": "1f9dd-1f3fb-2640",
        "name": "woman elf: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9dd-1f3fc-2640": {
        "id": "1f9dd-1f3fc-2640",
        "name": "woman elf: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9dd-1f3fd-2640": {
        "id": "1f9dd-1f3fd-2640",
        "name": "woman elf: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9dd-1f3fe-2640": {
        "id": "1f9dd-1f3fe-2640",
        "name": "woman elf: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9dd-1f3ff-2640": {
        "id": "1f9dd-1f3ff-2640",
        "name": "woman elf: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9dd-2642": {
        "id": "1f9dd-2642",
        "name": "man elf",
        "category": "people",
        "diversities": [
            "1f9dd-1f3fb-2642",
            "1f9dd-1f3fc-2642",
            "1f9dd-1f3fd-2642",
            "1f9dd-1f3fe-2642",
            "1f9dd-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9dd-1f3fb-2642": {
        "id": "1f9dd-1f3fb-2642",
        "name": "man elf: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9dd-1f3fc-2642": {
        "id": "1f9dd-1f3fc-2642",
        "name": "man elf: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9dd-1f3fd-2642": {
        "id": "1f9dd-1f3fd-2642",
        "name": "man elf: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9dd-1f3fe-2642": {
        "id": "1f9dd-1f3fe-2642",
        "name": "man elf: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9dd-1f3ff-2642": {
        "id": "1f9dd-1f3ff-2642",
        "name": "man elf: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9db": {
        "id": "1f9db",
        "name": "vampire",
        "category": "people",
        "diversities": [
            "1f9db-1f3fb",
            "1f9db-1f3fc",
            "1f9db-1f3fd",
            "1f9db-1f3fe",
            "1f9db-1f3ff"
        ],
        "genders": [
            "1f9db-2642",
            "1f9db-2640"
        ]
    },
    "1f9db-1f3fb": {
        "id": "1f9db-1f3fb",
        "name": "vampire: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9db-1f3fb-2642",
            "1f9db-1f3fb-2640"
        ]
    },
    "1f9db-1f3fc": {
        "id": "1f9db-1f3fc",
        "name": "vampire: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9db-1f3fc-2642",
            "1f9db-1f3fc-2640"
        ]
    },
    "1f9db-1f3fd": {
        "id": "1f9db-1f3fd",
        "name": "vampire: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9db-1f3fd-2642",
            "1f9db-1f3fd-2640"
        ]
    },
    "1f9db-1f3fe": {
        "id": "1f9db-1f3fe",
        "name": "vampire: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9db-1f3fe-2642",
            "1f9db-1f3fe-2640"
        ]
    },
    "1f9db-1f3ff": {
        "id": "1f9db-1f3ff",
        "name": "vampire: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9db-1f3ff-2642",
            "1f9db-1f3ff-2640"
        ]
    },
    "1f9db-2640": {
        "id": "1f9db-2640",
        "name": "woman vampire",
        "category": "people",
        "diversities": [
            "1f9db-1f3fb-2640",
            "1f9db-1f3fc-2640",
            "1f9db-1f3fd-2640",
            "1f9db-1f3fe-2640",
            "1f9db-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9db-1f3fb-2640": {
        "id": "1f9db-1f3fb-2640",
        "name": "woman vampire: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9db-1f3fc-2640": {
        "id": "1f9db-1f3fc-2640",
        "name": "woman vampire: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9db-1f3fd-2640": {
        "id": "1f9db-1f3fd-2640",
        "name": "woman vampire: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9db-1f3fe-2640": {
        "id": "1f9db-1f3fe-2640",
        "name": "woman vampire: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9db-1f3ff-2640": {
        "id": "1f9db-1f3ff-2640",
        "name": "woman vampire: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9db-2642": {
        "id": "1f9db-2642",
        "name": "man vampire",
        "category": "people",
        "diversities": [
            "1f9db-1f3fb-2642",
            "1f9db-1f3fc-2642",
            "1f9db-1f3fd-2642",
            "1f9db-1f3fe-2642",
            "1f9db-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9db-1f3fb-2642": {
        "id": "1f9db-1f3fb-2642",
        "name": "man vampire: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9db-1f3fc-2642": {
        "id": "1f9db-1f3fc-2642",
        "name": "man vampire: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9db-1f3fd-2642": {
        "id": "1f9db-1f3fd-2642",
        "name": "man vampire: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9db-1f3fe-2642": {
        "id": "1f9db-1f3fe-2642",
        "name": "man vampire: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9db-1f3ff-2642": {
        "id": "1f9db-1f3ff-2642",
        "name": "man vampire: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9df": {
        "id": "1f9df",
        "name": "zombie",
        "category": "people",
        "genders": [
            "1f9df-2642",
            "1f9df-2640"
        ]
    },
    "1f9df-2640": {
        "id": "1f9df-2640",
        "name": "woman zombie",
        "category": "people",
        "gender": "2640"
    },
    "1f9df-2642": {
        "id": "1f9df-2642",
        "name": "man zombie",
        "category": "people",
        "gender": "2642"
    },
    "1f9de": {
        "id": "1f9de",
        "name": "genie",
        "category": "people",
        "genders": [
            "1f9de-2642",
            "1f9de-2640"
        ]
    },
    "1f9de-2640": {
        "id": "1f9de-2640",
        "name": "woman genie",
        "category": "people",
        "gender": "2640"
    },
    "1f9de-2642": {
        "id": "1f9de-2642",
        "name": "man genie",
        "category": "people",
        "gender": "2642"
    },
    "1f9dc": {
        "id": "1f9dc",
        "name": "merperson",
        "category": "people",
        "diversities": [
            "1f9dc-1f3fb",
            "1f9dc-1f3fc",
            "1f9dc-1f3fd",
            "1f9dc-1f3fe",
            "1f9dc-1f3ff"
        ],
        "genders": [
            "1f9dc-2642"
        ]
    },
    "1f9dc-1f3fb": {
        "id": "1f9dc-1f3fb",
        "name": "merperson: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9dc-1f3fb-2642"
        ]
    },
    "1f9dc-1f3fc": {
        "id": "1f9dc-1f3fc",
        "name": "merperson: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9dc-1f3fc-2642"
        ]
    },
    "1f9dc-1f3fd": {
        "id": "1f9dc-1f3fd",
        "name": "merperson: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9dc-1f3fd-2642"
        ]
    },
    "1f9dc-1f3fe": {
        "id": "1f9dc-1f3fe",
        "name": "merperson: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9dc-1f3fe-2642"
        ]
    },
    "1f9dc-1f3ff": {
        "id": "1f9dc-1f3ff",
        "name": "merperson: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9dc-1f3ff-2642"
        ]
    },
    "1f9dc-2640": {
        "id": "1f9dc-2640",
        "name": "mermaid",
        "category": "people",
        "diversities": [
            "1f9dc-1f3fb-2640",
            "1f9dc-1f3fc-2640",
            "1f9dc-1f3fd-2640",
            "1f9dc-1f3fe-2640",
            "1f9dc-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9dc-1f3fb-2640": {
        "id": "1f9dc-1f3fb-2640",
        "name": "mermaid: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9dc-1f3fc-2640": {
        "id": "1f9dc-1f3fc-2640",
        "name": "mermaid: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9dc-1f3fd-2640": {
        "id": "1f9dc-1f3fd-2640",
        "name": "mermaid: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9dc-1f3fe-2640": {
        "id": "1f9dc-1f3fe-2640",
        "name": "mermaid: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9dc-1f3ff-2640": {
        "id": "1f9dc-1f3ff-2640",
        "name": "mermaid: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9dc-2642": {
        "id": "1f9dc-2642",
        "name": "merman",
        "category": "people",
        "diversities": [
            "1f9dc-1f3fb-2642",
            "1f9dc-1f3fc-2642",
            "1f9dc-1f3fd-2642",
            "1f9dc-1f3fe-2642",
            "1f9dc-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9dc-1f3fb-2642": {
        "id": "1f9dc-1f3fb-2642",
        "name": "merman: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9dc-1f3fc-2642": {
        "id": "1f9dc-1f3fc-2642",
        "name": "merman: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9dc-1f3fd-2642": {
        "id": "1f9dc-1f3fd-2642",
        "name": "merman: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9dc-1f3fe-2642": {
        "id": "1f9dc-1f3fe-2642",
        "name": "merman: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9dc-1f3ff-2642": {
        "id": "1f9dc-1f3ff-2642",
        "name": "merman: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9da": {
        "id": "1f9da",
        "name": "fairy",
        "category": "people",
        "diversities": [
            "1f9da-1f3fb",
            "1f9da-1f3fc",
            "1f9da-1f3fd",
            "1f9da-1f3fe",
            "1f9da-1f3ff"
        ],
        "genders": [
            "1f9da-2642",
            "1f9da-2640"
        ]
    },
    "1f9da-1f3fb": {
        "id": "1f9da-1f3fb",
        "name": "fairy: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9da-1f3fb-2642",
            "1f9da-1f3fb-2640"
        ]
    },
    "1f9da-1f3fc": {
        "id": "1f9da-1f3fc",
        "name": "fairy: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9da-1f3fc-2642",
            "1f9da-1f3fc-2640"
        ]
    },
    "1f9da-1f3fd": {
        "id": "1f9da-1f3fd",
        "name": "fairy: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9da-1f3fd-2642",
            "1f9da-1f3fd-2640"
        ]
    },
    "1f9da-1f3fe": {
        "id": "1f9da-1f3fe",
        "name": "fairy: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9da-1f3fe-2642",
            "1f9da-1f3fe-2640"
        ]
    },
    "1f9da-1f3ff": {
        "id": "1f9da-1f3ff",
        "name": "fairy: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9da-1f3ff-2642",
            "1f9da-1f3ff-2640"
        ]
    },
    "1f9da-2640": {
        "id": "1f9da-2640",
        "name": "woman fairy",
        "category": "people",
        "diversities": [
            "1f9da-1f3fb-2640",
            "1f9da-1f3fc-2640",
            "1f9da-1f3fd-2640",
            "1f9da-1f3fe-2640",
            "1f9da-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9da-1f3fb-2640": {
        "id": "1f9da-1f3fb-2640",
        "name": "woman fairy: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9da-1f3fc-2640": {
        "id": "1f9da-1f3fc-2640",
        "name": "woman fairy: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9da-1f3fd-2640": {
        "id": "1f9da-1f3fd-2640",
        "name": "woman fairy: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9da-1f3fe-2640": {
        "id": "1f9da-1f3fe-2640",
        "name": "woman fairy: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9da-1f3ff-2640": {
        "id": "1f9da-1f3ff-2640",
        "name": "woman fairy: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9da-2642": {
        "id": "1f9da-2642",
        "name": "man fairy",
        "category": "people",
        "diversities": [
            "1f9da-1f3fb-2642",
            "1f9da-1f3fc-2642",
            "1f9da-1f3fd-2642",
            "1f9da-1f3fe-2642",
            "1f9da-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9da-1f3fb-2642": {
        "id": "1f9da-1f3fb-2642",
        "name": "man fairy: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9da-1f3fc-2642": {
        "id": "1f9da-1f3fc-2642",
        "name": "man fairy: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9da-1f3fd-2642": {
        "id": "1f9da-1f3fd-2642",
        "name": "man fairy: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9da-1f3fe-2642": {
        "id": "1f9da-1f3fe-2642",
        "name": "man fairy: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9da-1f3ff-2642": {
        "id": "1f9da-1f3ff-2642",
        "name": "man fairy: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f47c": {
        "id": "1f47c",
        "name": "baby angel",
        "category": "people",
        "diversities": [
            "1f47c-1f3fb",
            "1f47c-1f3fc",
            "1f47c-1f3fd",
            "1f47c-1f3fe",
            "1f47c-1f3ff"
        ]
    },
    "1f47c-1f3fb": {
        "id": "1f47c-1f3fb",
        "name": "baby angel: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f47c-1f3fc": {
        "id": "1f47c-1f3fc",
        "name": "baby angel: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f47c-1f3fd": {
        "id": "1f47c-1f3fd",
        "name": "baby angel: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f47c-1f3fe": {
        "id": "1f47c-1f3fe",
        "name": "baby angel: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f47c-1f3ff": {
        "id": "1f47c-1f3ff",
        "name": "baby angel: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f930": {
        "id": "1f930",
        "name": "pregnant woman",
        "category": "people",
        "diversities": [
            "1f930-1f3fb",
            "1f930-1f3fc",
            "1f930-1f3fd",
            "1f930-1f3fe",
            "1f930-1f3ff"
        ]
    },
    "1f930-1f3fb": {
        "id": "1f930-1f3fb",
        "name": "pregnant woman: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f930-1f3fc": {
        "id": "1f930-1f3fc",
        "name": "pregnant woman: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f930-1f3fd": {
        "id": "1f930-1f3fd",
        "name": "pregnant woman: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f930-1f3fe": {
        "id": "1f930-1f3fe",
        "name": "pregnant woman: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f930-1f3ff": {
        "id": "1f930-1f3ff",
        "name": "pregnant woman: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f931": {
        "id": "1f931",
        "name": "breast-feeding",
        "category": "people",
        "diversities": [
            "1f931-1f3fb",
            "1f931-1f3fc",
            "1f931-1f3fd",
            "1f931-1f3fe",
            "1f931-1f3ff"
        ]
    },
    "1f931-1f3fb": {
        "id": "1f931-1f3fb",
        "name": "breast-feeding: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f931-1f3fc": {
        "id": "1f931-1f3fc",
        "name": "breast-feeding: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f931-1f3fd": {
        "id": "1f931-1f3fd",
        "name": "breast-feeding: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f931-1f3fe": {
        "id": "1f931-1f3fe",
        "name": "breast-feeding: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f931-1f3ff": {
        "id": "1f931-1f3ff",
        "name": "breast-feeding: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f647": {
        "id": "1f647",
        "name": "person bowing",
        "category": "people",
        "diversities": [
            "1f647-1f3fb",
            "1f647-1f3fc",
            "1f647-1f3fd",
            "1f647-1f3fe",
            "1f647-1f3ff"
        ],
        "genders": [
            "1f647-2642",
            "1f647-2640"
        ]
    },
    "1f647-1f3fb": {
        "id": "1f647-1f3fb",
        "name": "person bowing: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f647-1f3fb-2642",
            "1f647-1f3fb-2640"
        ]
    },
    "1f647-1f3fc": {
        "id": "1f647-1f3fc",
        "name": "person bowing: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f647-1f3fc-2642",
            "1f647-1f3fc-2640"
        ]
    },
    "1f647-1f3fd": {
        "id": "1f647-1f3fd",
        "name": "person bowing: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f647-1f3fd-2642",
            "1f647-1f3fd-2640"
        ]
    },
    "1f647-1f3fe": {
        "id": "1f647-1f3fe",
        "name": "person bowing: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f647-1f3fe-2642",
            "1f647-1f3fe-2640"
        ]
    },
    "1f647-1f3ff": {
        "id": "1f647-1f3ff",
        "name": "person bowing: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f647-1f3ff-2642",
            "1f647-1f3ff-2640"
        ]
    },
    "1f647-2640": {
        "id": "1f647-2640",
        "name": "woman bowing",
        "category": "people",
        "diversities": [
            "1f647-1f3fb-2640",
            "1f647-1f3fc-2640",
            "1f647-1f3fd-2640",
            "1f647-1f3fe-2640",
            "1f647-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f647-1f3fb-2640": {
        "id": "1f647-1f3fb-2640",
        "name": "woman bowing: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f647-1f3fc-2640": {
        "id": "1f647-1f3fc-2640",
        "name": "woman bowing: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f647-1f3fd-2640": {
        "id": "1f647-1f3fd-2640",
        "name": "woman bowing: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f647-1f3fe-2640": {
        "id": "1f647-1f3fe-2640",
        "name": "woman bowing: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f647-1f3ff-2640": {
        "id": "1f647-1f3ff-2640",
        "name": "woman bowing: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f647-2642": {
        "id": "1f647-2642",
        "name": "man bowing",
        "category": "people",
        "diversities": [
            "1f647-1f3fb-2642",
            "1f647-1f3fc-2642",
            "1f647-1f3fd-2642",
            "1f647-1f3fe-2642",
            "1f647-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f647-1f3fb-2642": {
        "id": "1f647-1f3fb-2642",
        "name": "man bowing: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f647-1f3fc-2642": {
        "id": "1f647-1f3fc-2642",
        "name": "man bowing: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f647-1f3fd-2642": {
        "id": "1f647-1f3fd-2642",
        "name": "man bowing: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f647-1f3fe-2642": {
        "id": "1f647-1f3fe-2642",
        "name": "man bowing: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f647-1f3ff-2642": {
        "id": "1f647-1f3ff-2642",
        "name": "man bowing: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f481": {
        "id": "1f481",
        "name": "person tipping hand",
        "category": "people",
        "diversities": [
            "1f481-1f3fb",
            "1f481-1f3fc",
            "1f481-1f3fd",
            "1f481-1f3fe",
            "1f481-1f3ff"
        ],
        "genders": [
            "1f481-2642",
            "1f481-2640"
        ]
    },
    "1f481-1f3fb": {
        "id": "1f481-1f3fb",
        "name": "person tipping hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f481-1f3fb-2642",
            "1f481-1f3fb-2640"
        ]
    },
    "1f481-1f3fc": {
        "id": "1f481-1f3fc",
        "name": "person tipping hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f481-1f3fc-2642",
            "1f481-1f3fc-2640"
        ]
    },
    "1f481-1f3fd": {
        "id": "1f481-1f3fd",
        "name": "person tipping hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f481-1f3fd-2642",
            "1f481-1f3fd-2640"
        ]
    },
    "1f481-1f3fe": {
        "id": "1f481-1f3fe",
        "name": "person tipping hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f481-1f3fe-2642",
            "1f481-1f3fe-2640"
        ]
    },
    "1f481-1f3ff": {
        "id": "1f481-1f3ff",
        "name": "person tipping hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f481-1f3ff-2642",
            "1f481-1f3ff-2640"
        ]
    },
    "1f481-2640": {
        "id": "1f481-2640",
        "name": "woman tipping hand",
        "category": "people",
        "diversities": [
            "1f481-1f3fb-2640",
            "1f481-1f3fc-2640",
            "1f481-1f3fd-2640",
            "1f481-1f3fe-2640",
            "1f481-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f481-1f3fb-2640": {
        "id": "1f481-1f3fb-2640",
        "name": "woman tipping hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f481-1f3fc-2640": {
        "id": "1f481-1f3fc-2640",
        "name": "woman tipping hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f481-1f3fd-2640": {
        "id": "1f481-1f3fd-2640",
        "name": "woman tipping hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f481-1f3fe-2640": {
        "id": "1f481-1f3fe-2640",
        "name": "woman tipping hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f481-1f3ff-2640": {
        "id": "1f481-1f3ff-2640",
        "name": "woman tipping hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f481-2642": {
        "id": "1f481-2642",
        "name": "man tipping hand",
        "category": "people",
        "diversities": [
            "1f481-1f3fb-2642",
            "1f481-1f3fc-2642",
            "1f481-1f3fd-2642",
            "1f481-1f3fe-2642",
            "1f481-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f481-1f3fb-2642": {
        "id": "1f481-1f3fb-2642",
        "name": "man tipping hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f481-1f3fc-2642": {
        "id": "1f481-1f3fc-2642",
        "name": "man tipping hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f481-1f3fd-2642": {
        "id": "1f481-1f3fd-2642",
        "name": "man tipping hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f481-1f3fe-2642": {
        "id": "1f481-1f3fe-2642",
        "name": "man tipping hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f481-1f3ff-2642": {
        "id": "1f481-1f3ff-2642",
        "name": "man tipping hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f645": {
        "id": "1f645",
        "name": "person gesturing NO",
        "category": "people",
        "diversities": [
            "1f645-1f3fb",
            "1f645-1f3fc",
            "1f645-1f3fd",
            "1f645-1f3fe",
            "1f645-1f3ff"
        ],
        "genders": [
            "1f645-2642",
            "1f645-2640"
        ]
    },
    "1f645-1f3fb": {
        "id": "1f645-1f3fb",
        "name": "person gesturing NO: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f645-1f3fb-2642",
            "1f645-1f3fb-2640"
        ]
    },
    "1f645-1f3fc": {
        "id": "1f645-1f3fc",
        "name": "person gesturing NO: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f645-1f3fc-2642",
            "1f645-1f3fc-2640"
        ]
    },
    "1f645-1f3fd": {
        "id": "1f645-1f3fd",
        "name": "person gesturing NO: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f645-1f3fd-2642",
            "1f645-1f3fd-2640"
        ]
    },
    "1f645-1f3fe": {
        "id": "1f645-1f3fe",
        "name": "person gesturing NO: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f645-1f3fe-2642",
            "1f645-1f3fe-2640"
        ]
    },
    "1f645-1f3ff": {
        "id": "1f645-1f3ff",
        "name": "person gesturing NO: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f645-1f3ff-2642",
            "1f645-1f3ff-2640"
        ]
    },
    "1f645-2640": {
        "id": "1f645-2640",
        "name": "woman gesturing NO",
        "category": "people",
        "diversities": [
            "1f645-1f3fb-2640",
            "1f645-1f3fc-2640",
            "1f645-1f3fd-2640",
            "1f645-1f3fe-2640",
            "1f645-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f645-1f3fb-2640": {
        "id": "1f645-1f3fb-2640",
        "name": "woman gesturing NO: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f645-1f3fc-2640": {
        "id": "1f645-1f3fc-2640",
        "name": "woman gesturing NO: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f645-1f3fd-2640": {
        "id": "1f645-1f3fd-2640",
        "name": "woman gesturing NO: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f645-1f3fe-2640": {
        "id": "1f645-1f3fe-2640",
        "name": "woman gesturing NO: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f645-1f3ff-2640": {
        "id": "1f645-1f3ff-2640",
        "name": "woman gesturing NO: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f645-2642": {
        "id": "1f645-2642",
        "name": "man gesturing NO",
        "category": "people",
        "diversities": [
            "1f645-1f3fb-2642",
            "1f645-1f3fc-2642",
            "1f645-1f3fd-2642",
            "1f645-1f3fe-2642",
            "1f645-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f645-1f3fb-2642": {
        "id": "1f645-1f3fb-2642",
        "name": "man gesturing NO: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f645-1f3fc-2642": {
        "id": "1f645-1f3fc-2642",
        "name": "man gesturing NO: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f645-1f3fd-2642": {
        "id": "1f645-1f3fd-2642",
        "name": "man gesturing NO: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f645-1f3fe-2642": {
        "id": "1f645-1f3fe-2642",
        "name": "man gesturing NO: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f645-1f3ff-2642": {
        "id": "1f645-1f3ff-2642",
        "name": "man gesturing NO: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f646": {
        "id": "1f646",
        "name": "person gesturing OK",
        "category": "people",
        "diversities": [
            "1f646-1f3fb",
            "1f646-1f3fc",
            "1f646-1f3fd",
            "1f646-1f3fe",
            "1f646-1f3ff"
        ],
        "genders": [
            "1f646-2642",
            "1f646-2640"
        ]
    },
    "1f646-1f3fb": {
        "id": "1f646-1f3fb",
        "name": "person gesturing OK: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f646-1f3fb-2642",
            "1f646-1f3fb-2640"
        ]
    },
    "1f646-1f3fc": {
        "id": "1f646-1f3fc",
        "name": "person gesturing OK: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f646-1f3fc-2642",
            "1f646-1f3fc-2640"
        ]
    },
    "1f646-1f3fd": {
        "id": "1f646-1f3fd",
        "name": "person gesturing OK: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f646-1f3fd-2642",
            "1f646-1f3fd-2640"
        ]
    },
    "1f646-1f3fe": {
        "id": "1f646-1f3fe",
        "name": "person gesturing OK: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f646-1f3fe-2642",
            "1f646-1f3fe-2640"
        ]
    },
    "1f646-1f3ff": {
        "id": "1f646-1f3ff",
        "name": "person gesturing OK: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f646-1f3ff-2642",
            "1f646-1f3ff-2640"
        ]
    },
    "1f646-2640": {
        "id": "1f646-2640",
        "name": "woman gesturing OK",
        "category": "people",
        "diversities": [
            "1f646-1f3fb-2640",
            "1f646-1f3fc-2640",
            "1f646-1f3fd-2640",
            "1f646-1f3fe-2640",
            "1f646-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f646-1f3fb-2640": {
        "id": "1f646-1f3fb-2640",
        "name": "woman gesturing OK: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f646-1f3fc-2640": {
        "id": "1f646-1f3fc-2640",
        "name": "woman gesturing OK: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f646-1f3fd-2640": {
        "id": "1f646-1f3fd-2640",
        "name": "woman gesturing OK: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f646-1f3fe-2640": {
        "id": "1f646-1f3fe-2640",
        "name": "woman gesturing OK: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f646-1f3ff-2640": {
        "id": "1f646-1f3ff-2640",
        "name": "woman gesturing OK: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f646-2642": {
        "id": "1f646-2642",
        "name": "man gesturing OK",
        "category": "people",
        "diversities": [
            "1f646-1f3fb-2642",
            "1f646-1f3fc-2642",
            "1f646-1f3fd-2642",
            "1f646-1f3fe-2642",
            "1f646-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f646-1f3fb-2642": {
        "id": "1f646-1f3fb-2642",
        "name": "man gesturing OK: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f646-1f3fc-2642": {
        "id": "1f646-1f3fc-2642",
        "name": "man gesturing OK: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f646-1f3fd-2642": {
        "id": "1f646-1f3fd-2642",
        "name": "man gesturing OK: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f646-1f3fe-2642": {
        "id": "1f646-1f3fe-2642",
        "name": "man gesturing OK: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f646-1f3ff-2642": {
        "id": "1f646-1f3ff-2642",
        "name": "man gesturing OK: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f64b": {
        "id": "1f64b",
        "name": "person raising hand",
        "category": "people",
        "diversities": [
            "1f64b-1f3fb",
            "1f64b-1f3fc",
            "1f64b-1f3fd",
            "1f64b-1f3fe",
            "1f64b-1f3ff"
        ],
        "genders": [
            "1f64b-2642",
            "1f64b-2640"
        ]
    },
    "1f64b-1f3fb": {
        "id": "1f64b-1f3fb",
        "name": "person raising hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f64b-1f3fb-2642",
            "1f64b-1f3fb-2640"
        ]
    },
    "1f64b-1f3fc": {
        "id": "1f64b-1f3fc",
        "name": "person raising hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f64b-1f3fc-2642",
            "1f64b-1f3fc-2640"
        ]
    },
    "1f64b-1f3fd": {
        "id": "1f64b-1f3fd",
        "name": "person raising hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f64b-1f3fd-2642",
            "1f64b-1f3fd-2640"
        ]
    },
    "1f64b-1f3fe": {
        "id": "1f64b-1f3fe",
        "name": "person raising hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f64b-1f3fe-2642",
            "1f64b-1f3fe-2640"
        ]
    },
    "1f64b-1f3ff": {
        "id": "1f64b-1f3ff",
        "name": "person raising hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f64b-1f3ff-2642",
            "1f64b-1f3ff-2640"
        ]
    },
    "1f64b-2640": {
        "id": "1f64b-2640",
        "name": "woman raising hand",
        "category": "people",
        "diversities": [
            "1f64b-1f3fb-2640",
            "1f64b-1f3fc-2640",
            "1f64b-1f3fd-2640",
            "1f64b-1f3fe-2640",
            "1f64b-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f64b-1f3fb-2640": {
        "id": "1f64b-1f3fb-2640",
        "name": "woman raising hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f64b-1f3fc-2640": {
        "id": "1f64b-1f3fc-2640",
        "name": "woman raising hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f64b-1f3fd-2640": {
        "id": "1f64b-1f3fd-2640",
        "name": "woman raising hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f64b-1f3fe-2640": {
        "id": "1f64b-1f3fe-2640",
        "name": "woman raising hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f64b-1f3ff-2640": {
        "id": "1f64b-1f3ff-2640",
        "name": "woman raising hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f64b-2642": {
        "id": "1f64b-2642",
        "name": "man raising hand",
        "category": "people",
        "diversities": [
            "1f64b-1f3fb-2642",
            "1f64b-1f3fc-2642",
            "1f64b-1f3fd-2642",
            "1f64b-1f3fe-2642",
            "1f64b-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f64b-1f3fb-2642": {
        "id": "1f64b-1f3fb-2642",
        "name": "man raising hand: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f64b-1f3fc-2642": {
        "id": "1f64b-1f3fc-2642",
        "name": "man raising hand: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f64b-1f3fd-2642": {
        "id": "1f64b-1f3fd-2642",
        "name": "man raising hand: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f64b-1f3fe-2642": {
        "id": "1f64b-1f3fe-2642",
        "name": "man raising hand: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f64b-1f3ff-2642": {
        "id": "1f64b-1f3ff-2642",
        "name": "man raising hand: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f926": {
        "id": "1f926",
        "name": "person facepalming",
        "category": "people",
        "diversities": [
            "1f926-1f3fb",
            "1f926-1f3fc",
            "1f926-1f3fd",
            "1f926-1f3fe",
            "1f926-1f3ff"
        ],
        "genders": [
            "1f926-2642",
            "1f926-2640"
        ]
    },
    "1f926-1f3fb": {
        "id": "1f926-1f3fb",
        "name": "person facepalming: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f926-1f3fb-2642",
            "1f926-1f3fb-2640"
        ]
    },
    "1f926-1f3fc": {
        "id": "1f926-1f3fc",
        "name": "person facepalming: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f926-1f3fc-2642",
            "1f926-1f3fc-2640"
        ]
    },
    "1f926-1f3fd": {
        "id": "1f926-1f3fd",
        "name": "person facepalming: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f926-1f3fd-2642",
            "1f926-1f3fd-2640"
        ]
    },
    "1f926-1f3fe": {
        "id": "1f926-1f3fe",
        "name": "person facepalming: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f926-1f3fe-2642",
            "1f926-1f3fe-2640"
        ]
    },
    "1f926-1f3ff": {
        "id": "1f926-1f3ff",
        "name": "person facepalming: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f926-1f3ff-2642",
            "1f926-1f3ff-2640"
        ]
    },
    "1f926-2640": {
        "id": "1f926-2640",
        "name": "woman facepalming",
        "category": "people",
        "diversities": [
            "1f926-1f3fb-2640",
            "1f926-1f3fc-2640",
            "1f926-1f3fd-2640",
            "1f926-1f3fe-2640",
            "1f926-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f926-1f3fb-2640": {
        "id": "1f926-1f3fb-2640",
        "name": "woman facepalming: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f926-1f3fc-2640": {
        "id": "1f926-1f3fc-2640",
        "name": "woman facepalming: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f926-1f3fd-2640": {
        "id": "1f926-1f3fd-2640",
        "name": "woman facepalming: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f926-1f3fe-2640": {
        "id": "1f926-1f3fe-2640",
        "name": "woman facepalming: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f926-1f3ff-2640": {
        "id": "1f926-1f3ff-2640",
        "name": "woman facepalming: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f926-2642": {
        "id": "1f926-2642",
        "name": "man facepalming",
        "category": "people",
        "diversities": [
            "1f926-1f3fb-2642",
            "1f926-1f3fc-2642",
            "1f926-1f3fd-2642",
            "1f926-1f3fe-2642",
            "1f926-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f926-1f3fb-2642": {
        "id": "1f926-1f3fb-2642",
        "name": "man facepalming: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f926-1f3fc-2642": {
        "id": "1f926-1f3fc-2642",
        "name": "man facepalming: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f926-1f3fd-2642": {
        "id": "1f926-1f3fd-2642",
        "name": "man facepalming: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f926-1f3fe-2642": {
        "id": "1f926-1f3fe-2642",
        "name": "man facepalming: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f926-1f3ff-2642": {
        "id": "1f926-1f3ff-2642",
        "name": "man facepalming: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f937": {
        "id": "1f937",
        "name": "person shrugging",
        "category": "people",
        "diversities": [
            "1f937-1f3fb",
            "1f937-1f3fc",
            "1f937-1f3fd",
            "1f937-1f3fe",
            "1f937-1f3ff"
        ],
        "genders": [
            "1f937-2642",
            "1f937-2640"
        ]
    },
    "1f937-1f3fb": {
        "id": "1f937-1f3fb",
        "name": "person shrugging: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f937-1f3fb-2642",
            "1f937-1f3fb-2640"
        ]
    },
    "1f937-1f3fc": {
        "id": "1f937-1f3fc",
        "name": "person shrugging: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f937-1f3fc-2642",
            "1f937-1f3fc-2640"
        ]
    },
    "1f937-1f3fd": {
        "id": "1f937-1f3fd",
        "name": "person shrugging: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f937-1f3fd-2642",
            "1f937-1f3fd-2640"
        ]
    },
    "1f937-1f3fe": {
        "id": "1f937-1f3fe",
        "name": "person shrugging: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f937-1f3fe-2642",
            "1f937-1f3fe-2640"
        ]
    },
    "1f937-1f3ff": {
        "id": "1f937-1f3ff",
        "name": "person shrugging: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f937-1f3ff-2642",
            "1f937-1f3ff-2640"
        ]
    },
    "1f937-2640": {
        "id": "1f937-2640",
        "name": "woman shrugging",
        "category": "people",
        "diversities": [
            "1f937-1f3fb-2640",
            "1f937-1f3fc-2640",
            "1f937-1f3fd-2640",
            "1f937-1f3fe-2640",
            "1f937-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f937-1f3fb-2640": {
        "id": "1f937-1f3fb-2640",
        "name": "woman shrugging: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f937-1f3fc-2640": {
        "id": "1f937-1f3fc-2640",
        "name": "woman shrugging: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f937-1f3fd-2640": {
        "id": "1f937-1f3fd-2640",
        "name": "woman shrugging: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f937-1f3fe-2640": {
        "id": "1f937-1f3fe-2640",
        "name": "woman shrugging: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f937-1f3ff-2640": {
        "id": "1f937-1f3ff-2640",
        "name": "woman shrugging: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f937-2642": {
        "id": "1f937-2642",
        "name": "man shrugging",
        "category": "people",
        "diversities": [
            "1f937-1f3fb-2642",
            "1f937-1f3fc-2642",
            "1f937-1f3fd-2642",
            "1f937-1f3fe-2642",
            "1f937-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f937-1f3fb-2642": {
        "id": "1f937-1f3fb-2642",
        "name": "man shrugging: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f937-1f3fc-2642": {
        "id": "1f937-1f3fc-2642",
        "name": "man shrugging: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f937-1f3fd-2642": {
        "id": "1f937-1f3fd-2642",
        "name": "man shrugging: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f937-1f3fe-2642": {
        "id": "1f937-1f3fe-2642",
        "name": "man shrugging: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f937-1f3ff-2642": {
        "id": "1f937-1f3ff-2642",
        "name": "man shrugging: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f64e": {
        "id": "1f64e",
        "name": "person pouting",
        "category": "people",
        "diversities": [
            "1f64e-1f3fb",
            "1f64e-1f3fc",
            "1f64e-1f3fd",
            "1f64e-1f3fe",
            "1f64e-1f3ff"
        ],
        "genders": [
            "1f64e-2642",
            "1f64e-2640"
        ]
    },
    "1f64e-1f3fb": {
        "id": "1f64e-1f3fb",
        "name": "person pouting: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f64e-1f3fb-2642",
            "1f64e-1f3fb-2640"
        ]
    },
    "1f64e-1f3fc": {
        "id": "1f64e-1f3fc",
        "name": "person pouting: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f64e-1f3fc-2642",
            "1f64e-1f3fc-2640"
        ]
    },
    "1f64e-1f3fd": {
        "id": "1f64e-1f3fd",
        "name": "person pouting: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f64e-1f3fd-2642",
            "1f64e-1f3fd-2640"
        ]
    },
    "1f64e-1f3fe": {
        "id": "1f64e-1f3fe",
        "name": "person pouting: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f64e-1f3fe-2642",
            "1f64e-1f3fe-2640"
        ]
    },
    "1f64e-1f3ff": {
        "id": "1f64e-1f3ff",
        "name": "person pouting: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f64e-1f3ff-2642",
            "1f64e-1f3ff-2640"
        ]
    },
    "1f64e-2640": {
        "id": "1f64e-2640",
        "name": "woman pouting",
        "category": "people",
        "diversities": [
            "1f64e-1f3fb-2640",
            "1f64e-1f3fc-2640",
            "1f64e-1f3fd-2640",
            "1f64e-1f3fe-2640",
            "1f64e-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f64e-1f3fb-2640": {
        "id": "1f64e-1f3fb-2640",
        "name": "woman pouting: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f64e-1f3fc-2640": {
        "id": "1f64e-1f3fc-2640",
        "name": "woman pouting: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f64e-1f3fd-2640": {
        "id": "1f64e-1f3fd-2640",
        "name": "woman pouting: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f64e-1f3fe-2640": {
        "id": "1f64e-1f3fe-2640",
        "name": "woman pouting: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f64e-1f3ff-2640": {
        "id": "1f64e-1f3ff-2640",
        "name": "woman pouting: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f64e-2642": {
        "id": "1f64e-2642",
        "name": "man pouting",
        "category": "people",
        "diversities": [
            "1f64e-1f3fb-2642",
            "1f64e-1f3fc-2642",
            "1f64e-1f3fd-2642",
            "1f64e-1f3fe-2642",
            "1f64e-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f64e-1f3fb-2642": {
        "id": "1f64e-1f3fb-2642",
        "name": "man pouting: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f64e-1f3fc-2642": {
        "id": "1f64e-1f3fc-2642",
        "name": "man pouting: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f64e-1f3fd-2642": {
        "id": "1f64e-1f3fd-2642",
        "name": "man pouting: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f64e-1f3fe-2642": {
        "id": "1f64e-1f3fe-2642",
        "name": "man pouting: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f64e-1f3ff-2642": {
        "id": "1f64e-1f3ff-2642",
        "name": "man pouting: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f64d": {
        "id": "1f64d",
        "name": "person frowning",
        "category": "people",
        "diversities": [
            "1f64d-1f3fb",
            "1f64d-1f3fc",
            "1f64d-1f3fd",
            "1f64d-1f3fe",
            "1f64d-1f3ff"
        ],
        "genders": [
            "1f64d-2642",
            "1f64d-2640"
        ]
    },
    "1f64d-1f3fb": {
        "id": "1f64d-1f3fb",
        "name": "person frowning: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f64d-1f3fb-2642",
            "1f64d-1f3fb-2640"
        ]
    },
    "1f64d-1f3fc": {
        "id": "1f64d-1f3fc",
        "name": "person frowning: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f64d-1f3fc-2642",
            "1f64d-1f3fc-2640"
        ]
    },
    "1f64d-1f3fd": {
        "id": "1f64d-1f3fd",
        "name": "person frowning: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f64d-1f3fd-2642",
            "1f64d-1f3fd-2640"
        ]
    },
    "1f64d-1f3fe": {
        "id": "1f64d-1f3fe",
        "name": "person frowning: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f64d-1f3fe-2642",
            "1f64d-1f3fe-2640"
        ]
    },
    "1f64d-1f3ff": {
        "id": "1f64d-1f3ff",
        "name": "person frowning: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f64d-1f3ff-2642",
            "1f64d-1f3ff-2640"
        ]
    },
    "1f64d-2640": {
        "id": "1f64d-2640",
        "name": "woman frowning",
        "category": "people",
        "diversities": [
            "1f64d-1f3fb-2640",
            "1f64d-1f3fc-2640",
            "1f64d-1f3fd-2640",
            "1f64d-1f3fe-2640",
            "1f64d-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f64d-1f3fb-2640": {
        "id": "1f64d-1f3fb-2640",
        "name": "woman frowning: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f64d-1f3fc-2640": {
        "id": "1f64d-1f3fc-2640",
        "name": "woman frowning: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f64d-1f3fd-2640": {
        "id": "1f64d-1f3fd-2640",
        "name": "woman frowning: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f64d-1f3fe-2640": {
        "id": "1f64d-1f3fe-2640",
        "name": "woman frowning: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f64d-1f3ff-2640": {
        "id": "1f64d-1f3ff-2640",
        "name": "woman frowning: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f64d-2642": {
        "id": "1f64d-2642",
        "name": "man frowning",
        "category": "people",
        "diversities": [
            "1f64d-1f3fb-2642",
            "1f64d-1f3fc-2642",
            "1f64d-1f3fd-2642",
            "1f64d-1f3fe-2642",
            "1f64d-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f64d-1f3fb-2642": {
        "id": "1f64d-1f3fb-2642",
        "name": "man frowning: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f64d-1f3fc-2642": {
        "id": "1f64d-1f3fc-2642",
        "name": "man frowning: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f64d-1f3fd-2642": {
        "id": "1f64d-1f3fd-2642",
        "name": "man frowning: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f64d-1f3fe-2642": {
        "id": "1f64d-1f3fe-2642",
        "name": "man frowning: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f64d-1f3ff-2642": {
        "id": "1f64d-1f3ff-2642",
        "name": "man frowning: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f487": {
        "id": "1f487",
        "name": "person getting haircut",
        "category": "people",
        "diversities": [
            "1f487-1f3fb",
            "1f487-1f3fc",
            "1f487-1f3fd",
            "1f487-1f3fe",
            "1f487-1f3ff"
        ],
        "genders": [
            "1f487-2642",
            "1f487-2640"
        ]
    },
    "1f487-1f3fb": {
        "id": "1f487-1f3fb",
        "name": "person getting haircut: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f487-1f3fb-2642",
            "1f487-1f3fb-2640"
        ]
    },
    "1f487-1f3fc": {
        "id": "1f487-1f3fc",
        "name": "person getting haircut: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f487-1f3fc-2642",
            "1f487-1f3fc-2640"
        ]
    },
    "1f487-1f3fd": {
        "id": "1f487-1f3fd",
        "name": "person getting haircut: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f487-1f3fd-2642",
            "1f487-1f3fd-2640"
        ]
    },
    "1f487-1f3fe": {
        "id": "1f487-1f3fe",
        "name": "person getting haircut: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f487-1f3fe-2642",
            "1f487-1f3fe-2640"
        ]
    },
    "1f487-1f3ff": {
        "id": "1f487-1f3ff",
        "name": "person getting haircut: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f487-1f3ff-2642",
            "1f487-1f3ff-2640"
        ]
    },
    "1f487-2640": {
        "id": "1f487-2640",
        "name": "woman getting haircut",
        "category": "people",
        "diversities": [
            "1f487-1f3fb-2640",
            "1f487-1f3fc-2640",
            "1f487-1f3fd-2640",
            "1f487-1f3fe-2640",
            "1f487-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f487-1f3fb-2640": {
        "id": "1f487-1f3fb-2640",
        "name": "woman getting haircut: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f487-1f3fc-2640": {
        "id": "1f487-1f3fc-2640",
        "name": "woman getting haircut: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f487-1f3fd-2640": {
        "id": "1f487-1f3fd-2640",
        "name": "woman getting haircut: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f487-1f3fe-2640": {
        "id": "1f487-1f3fe-2640",
        "name": "woman getting haircut: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f487-1f3ff-2640": {
        "id": "1f487-1f3ff-2640",
        "name": "woman getting haircut: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f487-2642": {
        "id": "1f487-2642",
        "name": "man getting haircut",
        "category": "people",
        "diversities": [
            "1f487-1f3fb-2642",
            "1f487-1f3fc-2642",
            "1f487-1f3fd-2642",
            "1f487-1f3fe-2642",
            "1f487-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f487-1f3fb-2642": {
        "id": "1f487-1f3fb-2642",
        "name": "man getting haircut: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f487-1f3fc-2642": {
        "id": "1f487-1f3fc-2642",
        "name": "man getting haircut: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f487-1f3fd-2642": {
        "id": "1f487-1f3fd-2642",
        "name": "man getting haircut: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f487-1f3fe-2642": {
        "id": "1f487-1f3fe-2642",
        "name": "man getting haircut: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f487-1f3ff-2642": {
        "id": "1f487-1f3ff-2642",
        "name": "man getting haircut: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f486": {
        "id": "1f486",
        "name": "person getting massage",
        "category": "people",
        "diversities": [
            "1f486-1f3fb",
            "1f486-1f3fc",
            "1f486-1f3fd",
            "1f486-1f3fe",
            "1f486-1f3ff"
        ],
        "genders": [
            "1f486-2642",
            "1f486-2640"
        ]
    },
    "1f486-1f3fb": {
        "id": "1f486-1f3fb",
        "name": "person getting massage: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f486-1f3fb-2642",
            "1f486-1f3fb-2640"
        ]
    },
    "1f486-1f3fc": {
        "id": "1f486-1f3fc",
        "name": "person getting massage: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f486-1f3fc-2642",
            "1f486-1f3fc-2640"
        ]
    },
    "1f486-1f3fd": {
        "id": "1f486-1f3fd",
        "name": "person getting massage: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f486-1f3fd-2642",
            "1f486-1f3fd-2640"
        ]
    },
    "1f486-1f3fe": {
        "id": "1f486-1f3fe",
        "name": "person getting massage: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f486-1f3fe-2642",
            "1f486-1f3fe-2640"
        ]
    },
    "1f486-1f3ff": {
        "id": "1f486-1f3ff",
        "name": "person getting massage: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f486-1f3ff-2642",
            "1f486-1f3ff-2640"
        ]
    },
    "1f486-2640": {
        "id": "1f486-2640",
        "name": "woman getting massage",
        "category": "people",
        "diversities": [
            "1f486-1f3fb-2640",
            "1f486-1f3fc-2640",
            "1f486-1f3fd-2640",
            "1f486-1f3fe-2640",
            "1f486-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f486-1f3fb-2640": {
        "id": "1f486-1f3fb-2640",
        "name": "woman getting massage: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f486-1f3fc-2640": {
        "id": "1f486-1f3fc-2640",
        "name": "woman getting massage: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f486-1f3fd-2640": {
        "id": "1f486-1f3fd-2640",
        "name": "woman getting massage: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f486-1f3fe-2640": {
        "id": "1f486-1f3fe-2640",
        "name": "woman getting massage: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f486-1f3ff-2640": {
        "id": "1f486-1f3ff-2640",
        "name": "woman getting massage: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f486-2642": {
        "id": "1f486-2642",
        "name": "man getting massage",
        "category": "people",
        "diversities": [
            "1f486-1f3fb-2642",
            "1f486-1f3fc-2642",
            "1f486-1f3fd-2642",
            "1f486-1f3fe-2642",
            "1f486-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f486-1f3fb-2642": {
        "id": "1f486-1f3fb-2642",
        "name": "man getting massage: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f486-1f3fc-2642": {
        "id": "1f486-1f3fc-2642",
        "name": "man getting massage: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f486-1f3fd-2642": {
        "id": "1f486-1f3fd-2642",
        "name": "man getting massage: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f486-1f3fe-2642": {
        "id": "1f486-1f3fe-2642",
        "name": "man getting massage: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f486-1f3ff-2642": {
        "id": "1f486-1f3ff-2642",
        "name": "man getting massage: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f9d6": {
        "id": "1f9d6",
        "name": "person in steamy room",
        "category": "people",
        "diversities": [
            "1f9d6-1f3fb",
            "1f9d6-1f3fc",
            "1f9d6-1f3fd",
            "1f9d6-1f3fe",
            "1f9d6-1f3ff"
        ],
        "genders": [
            "1f9d6-2642",
            "1f9d6-2640"
        ]
    },
    "1f9d6-1f3fb": {
        "id": "1f9d6-1f3fb",
        "name": "person in steamy room: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f9d6-1f3fb-2642",
            "1f9d6-1f3fb-2640"
        ]
    },
    "1f9d6-1f3fc": {
        "id": "1f9d6-1f3fc",
        "name": "person in steamy room: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f9d6-1f3fc-2642",
            "1f9d6-1f3fc-2640"
        ]
    },
    "1f9d6-1f3fd": {
        "id": "1f9d6-1f3fd",
        "name": "person in steamy room: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f9d6-1f3fd-2642",
            "1f9d6-1f3fd-2640"
        ]
    },
    "1f9d6-1f3fe": {
        "id": "1f9d6-1f3fe",
        "name": "person in steamy room: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f9d6-1f3fe-2642",
            "1f9d6-1f3fe-2640"
        ]
    },
    "1f9d6-1f3ff": {
        "id": "1f9d6-1f3ff",
        "name": "person in steamy room: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f9d6-1f3ff-2642",
            "1f9d6-1f3ff-2640"
        ]
    },
    "1f9d6-2640": {
        "id": "1f9d6-2640",
        "name": "woman in steamy room",
        "category": "people",
        "diversities": [
            "1f9d6-1f3fb-2640",
            "1f9d6-1f3fc-2640",
            "1f9d6-1f3fd-2640",
            "1f9d6-1f3fe-2640",
            "1f9d6-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f9d6-1f3fb-2640": {
        "id": "1f9d6-1f3fb-2640",
        "name": "woman in steamy room: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f9d6-1f3fc-2640": {
        "id": "1f9d6-1f3fc-2640",
        "name": "woman in steamy room: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f9d6-1f3fd-2640": {
        "id": "1f9d6-1f3fd-2640",
        "name": "woman in steamy room: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f9d6-1f3fe-2640": {
        "id": "1f9d6-1f3fe-2640",
        "name": "woman in steamy room: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f9d6-1f3ff-2640": {
        "id": "1f9d6-1f3ff-2640",
        "name": "woman in steamy room: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f9d6-2642": {
        "id": "1f9d6-2642",
        "name": "man in steamy room",
        "category": "people",
        "diversities": [
            "1f9d6-1f3fb-2642",
            "1f9d6-1f3fc-2642",
            "1f9d6-1f3fd-2642",
            "1f9d6-1f3fe-2642",
            "1f9d6-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f9d6-1f3fb-2642": {
        "id": "1f9d6-1f3fb-2642",
        "name": "man in steamy room: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f9d6-1f3fc-2642": {
        "id": "1f9d6-1f3fc-2642",
        "name": "man in steamy room: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f9d6-1f3fd-2642": {
        "id": "1f9d6-1f3fd-2642",
        "name": "man in steamy room: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f9d6-1f3fe-2642": {
        "id": "1f9d6-1f3fe-2642",
        "name": "man in steamy room: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f9d6-1f3ff-2642": {
        "id": "1f9d6-1f3ff-2642",
        "name": "man in steamy room: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f485": {
        "id": "1f485",
        "name": "nail polish",
        "category": "people",
        "diversities": [
            "1f485-1f3fb",
            "1f485-1f3fc",
            "1f485-1f3fd",
            "1f485-1f3fe",
            "1f485-1f3ff"
        ]
    },
    "1f485-1f3fb": {
        "id": "1f485-1f3fb",
        "name": "nail polish: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f485-1f3fc": {
        "id": "1f485-1f3fc",
        "name": "nail polish: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f485-1f3fd": {
        "id": "1f485-1f3fd",
        "name": "nail polish: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f485-1f3fe": {
        "id": "1f485-1f3fe",
        "name": "nail polish: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f485-1f3ff": {
        "id": "1f485-1f3ff",
        "name": "nail polish: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f933": {
        "id": "1f933",
        "name": "selfie",
        "category": "people",
        "diversities": [
            "1f933-1f3fb",
            "1f933-1f3fc",
            "1f933-1f3fd",
            "1f933-1f3fe",
            "1f933-1f3ff"
        ]
    },
    "1f933-1f3fb": {
        "id": "1f933-1f3fb",
        "name": "selfie: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f933-1f3fc": {
        "id": "1f933-1f3fc",
        "name": "selfie: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f933-1f3fd": {
        "id": "1f933-1f3fd",
        "name": "selfie: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f933-1f3fe": {
        "id": "1f933-1f3fe",
        "name": "selfie: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f933-1f3ff": {
        "id": "1f933-1f3ff",
        "name": "selfie: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f483": {
        "id": "1f483",
        "name": "woman dancing",
        "category": "people",
        "diversities": [
            "1f483-1f3fb",
            "1f483-1f3fc",
            "1f483-1f3fd",
            "1f483-1f3fe",
            "1f483-1f3ff"
        ]
    },
    "1f483-1f3fb": {
        "id": "1f483-1f3fb",
        "name": "woman dancing: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f483-1f3fc": {
        "id": "1f483-1f3fc",
        "name": "woman dancing: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f483-1f3fd": {
        "id": "1f483-1f3fd",
        "name": "woman dancing: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f483-1f3fe": {
        "id": "1f483-1f3fe",
        "name": "woman dancing: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f483-1f3ff": {
        "id": "1f483-1f3ff",
        "name": "woman dancing: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f57a": {
        "id": "1f57a",
        "name": "man dancing",
        "category": "people",
        "diversities": [
            "1f57a-1f3fb",
            "1f57a-1f3fc",
            "1f57a-1f3fd",
            "1f57a-1f3fe",
            "1f57a-1f3ff"
        ]
    },
    "1f57a-1f3fb": {
        "id": "1f57a-1f3fb",
        "name": "man dancing: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f57a-1f3fc": {
        "id": "1f57a-1f3fc",
        "name": "man dancing: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f57a-1f3fd": {
        "id": "1f57a-1f3fd",
        "name": "man dancing: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f57a-1f3ff": {
        "id": "1f57a-1f3ff",
        "name": "man dancing: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f57a-1f3fe": {
        "id": "1f57a-1f3fe",
        "name": "man dancing: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f46f": {
        "id": "1f46f",
        "name": "people with bunny ears",
        "category": "people",
        "genders": [
            "1f46f-2642",
            "1f46f-2640"
        ]
    },
    "1f46f-2640": {
        "id": "1f46f-2640",
        "name": "women with bunny ears",
        "category": "people",
        "gender": "2640"
    },
    "1f46f-2642": {
        "id": "1f46f-2642",
        "name": "men with bunny ears",
        "category": "people",
        "gender": "2642"
    },
    "1f574": {
        "id": "1f574",
        "name": "man in suit levitating",
        "category": "people",
        "diversities": [
            "1f574-1f3fb",
            "1f574-1f3fc",
            "1f574-1f3fd",
            "1f574-1f3fe",
            "1f574-1f3ff"
        ]
    },
    "1f574-1f3fb": {
        "id": "1f574-1f3fb",
        "name": "man in suit levitating: light skin tone",
        "category": "people",
        "diversity": "1f3fb"
    },
    "1f574-1f3fc": {
        "id": "1f574-1f3fc",
        "name": "man in suit levitating: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc"
    },
    "1f574-1f3fd": {
        "id": "1f574-1f3fd",
        "name": "man in suit levitating: medium skin tone",
        "category": "people",
        "diversity": "1f3fd"
    },
    "1f574-1f3fe": {
        "id": "1f574-1f3fe",
        "name": "man in suit levitating: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe"
    },
    "1f574-1f3ff": {
        "id": "1f574-1f3ff",
        "name": "man in suit levitating: dark skin tone",
        "category": "people",
        "diversity": "1f3ff"
    },
    "1f6b6": {
        "id": "1f6b6",
        "name": "person walking",
        "category": "people",
        "diversities": [
            "1f6b6-1f3fb",
            "1f6b6-1f3fc",
            "1f6b6-1f3fd",
            "1f6b6-1f3fe",
            "1f6b6-1f3ff"
        ],
        "genders": [
            "1f6b6-2642",
            "1f6b6-2640"
        ]
    },
    "1f6b6-1f3fb": {
        "id": "1f6b6-1f3fb",
        "name": "person walking: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f6b6-1f3fb-2642",
            "1f6b6-1f3fb-2640"
        ]
    },
    "1f6b6-1f3fc": {
        "id": "1f6b6-1f3fc",
        "name": "person walking: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f6b6-1f3fc-2642",
            "1f6b6-1f3fc-2640"
        ]
    },
    "1f6b6-1f3fd": {
        "id": "1f6b6-1f3fd",
        "name": "person walking: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f6b6-1f3fd-2642",
            "1f6b6-1f3fd-2640"
        ]
    },
    "1f6b6-1f3fe": {
        "id": "1f6b6-1f3fe",
        "name": "person walking: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f6b6-1f3fe-2642",
            "1f6b6-1f3fe-2640"
        ]
    },
    "1f6b6-1f3ff": {
        "id": "1f6b6-1f3ff",
        "name": "person walking: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f6b6-1f3ff-2642",
            "1f6b6-1f3ff-2640"
        ]
    },
    "1f6b6-2640": {
        "id": "1f6b6-2640",
        "name": "woman walking",
        "category": "people",
        "diversities": [
            "1f6b6-1f3fb-2640",
            "1f6b6-1f3fc-2640",
            "1f6b6-1f3fd-2640",
            "1f6b6-1f3fe-2640",
            "1f6b6-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f6b6-1f3fb-2640": {
        "id": "1f6b6-1f3fb-2640",
        "name": "woman walking: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f6b6-1f3fc-2640": {
        "id": "1f6b6-1f3fc-2640",
        "name": "woman walking: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f6b6-1f3fd-2640": {
        "id": "1f6b6-1f3fd-2640",
        "name": "woman walking: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f6b6-1f3fe-2640": {
        "id": "1f6b6-1f3fe-2640",
        "name": "woman walking: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f6b6-1f3ff-2640": {
        "id": "1f6b6-1f3ff-2640",
        "name": "woman walking: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f6b6-2642": {
        "id": "1f6b6-2642",
        "name": "man walking",
        "category": "people",
        "diversities": [
            "1f6b6-1f3fb-2642",
            "1f6b6-1f3fc-2642",
            "1f6b6-1f3fd-2642",
            "1f6b6-1f3fe-2642",
            "1f6b6-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f6b6-1f3fb-2642": {
        "id": "1f6b6-1f3fb-2642",
        "name": "man walking: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f6b6-1f3fc-2642": {
        "id": "1f6b6-1f3fc-2642",
        "name": "man walking: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f6b6-1f3fd-2642": {
        "id": "1f6b6-1f3fd-2642",
        "name": "man walking: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f6b6-1f3fe-2642": {
        "id": "1f6b6-1f3fe-2642",
        "name": "man walking: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f6b6-1f3ff-2642": {
        "id": "1f6b6-1f3ff-2642",
        "name": "man walking: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f3c3": {
        "id": "1f3c3",
        "name": "person running",
        "category": "people",
        "diversities": [
            "1f3c3-1f3fb",
            "1f3c3-1f3fc",
            "1f3c3-1f3fd",
            "1f3c3-1f3fe",
            "1f3c3-1f3ff"
        ],
        "genders": [
            "1f3c3-2642",
            "1f3c3-2640"
        ]
    },
    "1f3c3-1f3fb": {
        "id": "1f3c3-1f3fb",
        "name": "person running: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "genders": [
            "1f3c3-1f3fb-2642",
            "1f3c3-1f3fb-2640"
        ]
    },
    "1f3c3-1f3fc": {
        "id": "1f3c3-1f3fc",
        "name": "person running: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "genders": [
            "1f3c3-1f3fc-2642",
            "1f3c3-1f3fc-2640"
        ]
    },
    "1f3c3-1f3fd": {
        "id": "1f3c3-1f3fd",
        "name": "person running: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "genders": [
            "1f3c3-1f3fd-2642",
            "1f3c3-1f3fd-2640"
        ]
    },
    "1f3c3-1f3fe": {
        "id": "1f3c3-1f3fe",
        "name": "person running: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "genders": [
            "1f3c3-1f3fe-2642",
            "1f3c3-1f3fe-2640"
        ]
    },
    "1f3c3-1f3ff": {
        "id": "1f3c3-1f3ff",
        "name": "person running: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "genders": [
            "1f3c3-1f3ff-2642",
            "1f3c3-1f3ff-2640"
        ]
    },
    "1f3c3-2640": {
        "id": "1f3c3-2640",
        "name": "woman running",
        "category": "people",
        "diversities": [
            "1f3c3-1f3fb-2640",
            "1f3c3-1f3fc-2640",
            "1f3c3-1f3fd-2640",
            "1f3c3-1f3fe-2640",
            "1f3c3-1f3ff-2640"
        ],
        "gender": "2640"
    },
    "1f3c3-1f3fb-2640": {
        "id": "1f3c3-1f3fb-2640",
        "name": "woman running: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2640"
    },
    "1f3c3-1f3fc-2640": {
        "id": "1f3c3-1f3fc-2640",
        "name": "woman running: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2640"
    },
    "1f3c3-1f3fd-2640": {
        "id": "1f3c3-1f3fd-2640",
        "name": "woman running: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2640"
    },
    "1f3c3-1f3fe-2640": {
        "id": "1f3c3-1f3fe-2640",
        "name": "woman running: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2640"
    },
    "1f3c3-1f3ff-2640": {
        "id": "1f3c3-1f3ff-2640",
        "name": "woman running: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2640"
    },
    "1f3c3-2642": {
        "id": "1f3c3-2642",
        "name": "man running",
        "category": "people",
        "diversities": [
            "1f3c3-1f3fb-2642",
            "1f3c3-1f3fc-2642",
            "1f3c3-1f3fd-2642",
            "1f3c3-1f3fe-2642",
            "1f3c3-1f3ff-2642"
        ],
        "gender": "2642"
    },
    "1f3c3-1f3fb-2642": {
        "id": "1f3c3-1f3fb-2642",
        "name": "man running: light skin tone",
        "category": "people",
        "diversity": "1f3fb",
        "gender": "2642"
    },
    "1f3c3-1f3fc-2642": {
        "id": "1f3c3-1f3fc-2642",
        "name": "man running: medium-light skin tone",
        "category": "people",
        "diversity": "1f3fc",
        "gender": "2642"
    },
    "1f3c3-1f3fd-2642": {
        "id": "1f3c3-1f3fd-2642",
        "name": "man running: medium skin tone",
        "category": "people",
        "diversity": "1f3fd",
        "gender": "2642"
    },
    "1f3c3-1f3fe-2642": {
        "id": "1f3c3-1f3fe-2642",
        "name": "man running: medium-dark skin tone",
        "category": "people",
        "diversity": "1f3fe",
        "gender": "2642"
    },
    "1f3c3-1f3ff-2642": {
        "id": "1f3c3-1f3ff-2642",
        "name": "man running: dark skin tone",
        "category": "people",
        "diversity": "1f3ff",
        "gender": "2642"
    },
    "1f46b": {
        "id": "1f46b",
        "name": "man and woman holding hands",
        "category": "people"
    },
    "1f46d": {
        "id": "1f46d",
        "name": "two women holding hands",
        "category": "people"
    },
    "1f46c": {
        "id": "1f46c",
        "name": "two men holding hands",
        "category": "people"
    },
    "1f491": {
        "id": "1f491",
        "name": "couple with heart",
        "category": "people"
    },
    "1f469-2764-1f468": {
        "id": "1f469-2764-1f468",
        "name": "couple with heart: woman, man",
        "category": "people"
    },
    "1f469-2764-1f469": {
        "id": "1f469-2764-1f469",
        "name": "couple with heart: woman, woman",
        "category": "people"
    },
    "1f468-2764-1f468": {
        "id": "1f468-2764-1f468",
        "name": "couple with heart: man, man",
        "category": "people"
    },
    "1f48f": {
        "id": "1f48f",
        "name": "kiss",
        "category": "people"
    },
    "1f469-2764-1f48b-1f468": {
        "id": "1f469-2764-1f48b-1f468",
        "name": "kiss: woman, man",
        "category": "people"
    },
    "1f469-2764-1f48b-1f469": {
        "id": "1f469-2764-1f48b-1f469",
        "name": "kiss: woman, woman",
        "category": "people"
    },
    "1f468-2764-1f48b-1f468": {
        "id": "1f468-2764-1f48b-1f468",
        "name": "kiss: man, man",
        "category": "people"
    },
    "1f46a": {
        "id": "1f46a",
        "name": "family",
        "category": "people"
    },
    "1f468-1f469-1f466": {
        "id": "1f468-1f469-1f466",
        "name": "family: man, woman, boy",
        "category": "people"
    },
    "1f468-1f469-1f467": {
        "id": "1f468-1f469-1f467",
        "name": "family: man, woman, girl",
        "category": "people"
    },
    "1f468-1f469-1f467-1f466": {
        "id": "1f468-1f469-1f467-1f466",
        "name": "family: man, woman, girl, boy",
        "category": "people"
    },
    "1f468-1f469-1f466-1f466": {
        "id": "1f468-1f469-1f466-1f466",
        "name": "family: man, woman, boy, boy",
        "category": "people"
    },
    "1f468-1f469-1f467-1f467": {
        "id": "1f468-1f469-1f467-1f467",
        "name": "family: man, woman, girl, girl",
        "category": "people"
    },
    "1f469-1f469-1f466": {
        "id": "1f469-1f469-1f466",
        "name": "family: woman, woman, boy",
        "category": "people"
    },
    "1f469-1f469-1f467": {
        "id": "1f469-1f469-1f467",
        "name": "family: woman, woman, girl",
        "category": "people"
    },
    "1f469-1f469-1f467-1f466": {
        "id": "1f469-1f469-1f467-1f466",
        "name": "family: woman, woman, girl, boy",
        "category": "people"
    },
    "1f469-1f469-1f466-1f466": {
        "id": "1f469-1f469-1f466-1f466",
        "name": "family: woman, woman, boy, boy",
        "category": "people"
    },
    "1f469-1f469-1f467-1f467": {
        "id": "1f469-1f469-1f467-1f467",
        "name": "family: woman, woman, girl, girl",
        "category": "people"
    },
    "1f468-1f468-1f466": {
        "id": "1f468-1f468-1f466",
        "name": "family: man, man, boy",
        "category": "people"
    },
    "1f468-1f468-1f467": {
        "id": "1f468-1f468-1f467",
        "name": "family: man, man, girl",
        "category": "people"
    },
    "1f468-1f468-1f467-1f466": {
        "id": "1f468-1f468-1f467-1f466",
        "name": "family: man, man, girl, boy",
        "category": "people"
    },
    "1f468-1f468-1f466-1f466": {
        "id": "1f468-1f468-1f466-1f466",
        "name": "family: man, man, boy, boy",
        "category": "people"
    },
    "1f468-1f468-1f467-1f467": {
        "id": "1f468-1f468-1f467-1f467",
        "name": "family: man, man, girl, girl",
        "category": "people"
    },
    "1f469-1f466": {
        "id": "1f469-1f466",
        "name": "family: woman, boy",
        "category": "people"
    },
    "1f469-1f467": {
        "id": "1f469-1f467",
        "name": "family: woman, girl",
        "category": "people"
    },
    "1f469-1f467-1f466": {
        "id": "1f469-1f467-1f466",
        "name": "family: woman, girl, boy",
        "category": "people"
    },
    "1f469-1f466-1f466": {
        "id": "1f469-1f466-1f466",
        "name": "family: woman, boy, boy",
        "category": "people"
    },
    "1f469-1f467-1f467": {
        "id": "1f469-1f467-1f467",
        "name": "family: woman, girl, girl",
        "category": "people"
    },
    "1f468-1f466": {
        "id": "1f468-1f466",
        "name": "family: man, boy",
        "category": "people"
    },
    "1f468-1f467": {
        "id": "1f468-1f467",
        "name": "family: man, girl",
        "category": "people"
    },
    "1f468-1f467-1f466": {
        "id": "1f468-1f467-1f466",
        "name": "family: man, girl, boy",
        "category": "people"
    },
    "1f468-1f466-1f466": {
        "id": "1f468-1f466-1f466",
        "name": "family: man, boy, boy",
        "category": "people"
    },
    "1f468-1f467-1f467": {
        "id": "1f468-1f467-1f467",
        "name": "family: man, girl, girl",
        "category": "people"
    },
    "1f9e5": {
        "id": "1f9e5",
        "name": "coat",
        "category": "people"
    },
    "1f45a": {
        "id": "1f45a",
        "name": "woman’s clothes",
        "category": "people"
    },
    "1f455": {
        "id": "1f455",
        "name": "t-shirt",
        "category": "people"
    },
    "1f456": {
        "id": "1f456",
        "name": "jeans",
        "category": "people"
    },
    "1f454": {
        "id": "1f454",
        "name": "necktie",
        "category": "people"
    },
    "1f457": {
        "id": "1f457",
        "name": "dress",
        "category": "people"
    },
    "1f459": {
        "id": "1f459",
        "name": "bikini",
        "category": "people"
    },
    "1f458": {
        "id": "1f458",
        "name": "kimono",
        "category": "people"
    },
    "1f97c": {
        "id": "1f97c",
        "name": "lab coat",
        "category": "people"
    },
    "1f460": {
        "id": "1f460",
        "name": "high-heeled shoe",
        "category": "people"
    },
    "1f461": {
        "id": "1f461",
        "name": "woman’s sandal",
        "category": "people"
    },
    "1f462": {
        "id": "1f462",
        "name": "woman’s boot",
        "category": "people"
    },
    "1f45e": {
        "id": "1f45e",
        "name": "man’s shoe",
        "category": "people"
    },
    "1f45f": {
        "id": "1f45f",
        "name": "running shoe",
        "category": "people"
    },
    "1f97e": {
        "id": "1f97e",
        "name": "hiking boot",
        "category": "people"
    },
    "1f97f": {
        "id": "1f97f",
        "name": "woman’s flat shoe",
        "category": "people"
    },
    "1f9e6": {
        "id": "1f9e6",
        "name": "socks",
        "category": "people"
    },
    "1f9e4": {
        "id": "1f9e4",
        "name": "gloves",
        "category": "people"
    },
    "1f9e3": {
        "id": "1f9e3",
        "name": "scarf",
        "category": "people"
    },
    "1f3a9": {
        "id": "1f3a9",
        "name": "top hat",
        "category": "people"
    },
    "1f9e2": {
        "id": "1f9e2",
        "name": "billed cap",
        "category": "people"
    },
    "1f452": {
        "id": "1f452",
        "name": "woman’s hat",
        "category": "people"
    },
    "1f393": {
        "id": "1f393",
        "name": "graduation cap",
        "category": "people"
    },
    "26d1": {
        "id": "26d1",
        "name": "rescue worker’s helmet",
        "category": "people"
    },
    "1f451": {
        "id": "1f451",
        "name": "crown",
        "category": "people"
    },
    "1f45d": {
        "id": "1f45d",
        "name": "clutch bag",
        "category": "people"
    },
    "1f45b": {
        "id": "1f45b",
        "name": "purse",
        "category": "people"
    },
    "1f45c": {
        "id": "1f45c",
        "name": "handbag",
        "category": "people"
    },
    "1f4bc": {
        "id": "1f4bc",
        "name": "briefcase",
        "category": "people"
    },
    "1f392": {
        "id": "1f392",
        "name": "school backpack",
        "category": "people"
    },
    "1f453": {
        "id": "1f453",
        "name": "glasses",
        "category": "people"
    },
    "1f576": {
        "id": "1f576",
        "name": "sunglasses",
        "category": "people"
    },
    "1f97d": {
        "id": "1f97d",
        "name": "goggles",
        "category": "people"
    },
    "1f302": {
        "id": "1f302",
        "name": "closed umbrella",
        "category": "people"
    },
    "1f9b0": {
        "id": "1f9b0",
        "name": "red-haired",
        "category": "people"
    },
    "1f9b1": {
        "id": "1f9b1",
        "name": "curly-haired",
        "category": "people"
    },
    "1f9b3": {
        "id": "1f9b3",
        "name": "white-haired",
        "category": "people"
    },
    "1f9b2": {
        "id": "1f9b2",
        "name": "bald",
        "category": "people"
    },
    "1f697": {
        "id": "1f697",
        "name": "automobile",
        "category": "travel"
    },
    "1f695": {
        "id": "1f695",
        "name": "taxi",
        "category": "travel"
    },
    "1f699": {
        "id": "1f699",
        "name": "sport utility vehicle",
        "category": "travel"
    },
    "1f68c": {
        "id": "1f68c",
        "name": "bus",
        "category": "travel"
    },
    "1f68e": {
        "id": "1f68e",
        "name": "trolleybus",
        "category": "travel"
    },
    "1f3ce": {
        "id": "1f3ce",
        "name": "racing car",
        "category": "travel"
    },
    "1f693": {
        "id": "1f693",
        "name": "police car",
        "category": "travel"
    },
    "1f691": {
        "id": "1f691",
        "name": "ambulance",
        "category": "travel"
    },
    "1f692": {
        "id": "1f692",
        "name": "fire engine",
        "category": "travel"
    },
    "1f690": {
        "id": "1f690",
        "name": "minibus",
        "category": "travel"
    },
    "1f69a": {
        "id": "1f69a",
        "name": "delivery truck",
        "category": "travel"
    },
    "1f69b": {
        "id": "1f69b",
        "name": "articulated lorry",
        "category": "travel"
    },
    "1f69c": {
        "id": "1f69c",
        "name": "tractor",
        "category": "travel"
    },
    "1f6f4": {
        "id": "1f6f4",
        "name": "kick scooter",
        "category": "travel"
    },
    "1f6b2": {
        "id": "1f6b2",
        "name": "bicycle",
        "category": "travel"
    },
    "1f6f5": {
        "id": "1f6f5",
        "name": "motor scooter",
        "category": "travel"
    },
    "1f3cd": {
        "id": "1f3cd",
        "name": "motorcycle",
        "category": "travel"
    },
    "1f6a8": {
        "id": "1f6a8",
        "name": "police car light",
        "category": "travel"
    },
    "1f694": {
        "id": "1f694",
        "name": "oncoming police car",
        "category": "travel"
    },
    "1f68d": {
        "id": "1f68d",
        "name": "oncoming bus",
        "category": "travel"
    },
    "1f698": {
        "id": "1f698",
        "name": "oncoming automobile",
        "category": "travel"
    },
    "1f696": {
        "id": "1f696",
        "name": "oncoming taxi",
        "category": "travel"
    },
    "1f6a1": {
        "id": "1f6a1",
        "name": "aerial tramway",
        "category": "travel"
    },
    "1f6a0": {
        "id": "1f6a0",
        "name": "mountain cableway",
        "category": "travel"
    },
    "1f69f": {
        "id": "1f69f",
        "name": "suspension railway",
        "category": "travel"
    },
    "1f683": {
        "id": "1f683",
        "name": "railway car",
        "category": "travel"
    },
    "1f68b": {
        "id": "1f68b",
        "name": "tram car",
        "category": "travel"
    },
    "1f69e": {
        "id": "1f69e",
        "name": "mountain railway",
        "category": "travel"
    },
    "1f69d": {
        "id": "1f69d",
        "name": "monorail",
        "category": "travel"
    },
    "1f684": {
        "id": "1f684",
        "name": "high-speed train",
        "category": "travel"
    },
    "1f685": {
        "id": "1f685",
        "name": "bullet train",
        "category": "travel"
    },
    "1f688": {
        "id": "1f688",
        "name": "light rail",
        "category": "travel"
    },
    "1f682": {
        "id": "1f682",
        "name": "locomotive",
        "category": "travel"
    },
    "1f686": {
        "id": "1f686",
        "name": "train",
        "category": "travel"
    },
    "1f687": {
        "id": "1f687",
        "name": "metro",
        "category": "travel"
    },
    "1f68a": {
        "id": "1f68a",
        "name": "tram",
        "category": "travel"
    },
    "1f689": {
        "id": "1f689",
        "name": "station",
        "category": "travel"
    },
    "1f6eb": {
        "id": "1f6eb",
        "name": "airplane departure",
        "category": "travel"
    },
    "1f6ec": {
        "id": "1f6ec",
        "name": "airplane arrival",
        "category": "travel"
    },
    "1f6e9": {
        "id": "1f6e9",
        "name": "small airplane",
        "category": "travel"
    },
    "1f4ba": {
        "id": "1f4ba",
        "name": "seat",
        "category": "travel"
    },
    "1f9f3": {
        "id": "1f9f3",
        "name": "luggage",
        "category": "travel"
    },
    "1f6f0": {
        "id": "1f6f0",
        "name": "satellite",
        "category": "travel"
    },
    "1f680": {
        "id": "1f680",
        "name": "rocket",
        "category": "travel"
    },
    "1f6f8": {
        "id": "1f6f8",
        "name": "flying saucer",
        "category": "travel"
    },
    "1f681": {
        "id": "1f681",
        "name": "helicopter",
        "category": "travel"
    },
    "1f6f6": {
        "id": "1f6f6",
        "name": "canoe",
        "category": "travel"
    },
    "26f5": {
        "id": "26f5",
        "name": "sailboat",
        "category": "travel"
    },
    "1f6a4": {
        "id": "1f6a4",
        "name": "speedboat",
        "category": "travel"
    },
    "1f6e5": {
        "id": "1f6e5",
        "name": "motor boat",
        "category": "travel"
    },
    "1f6f3": {
        "id": "1f6f3",
        "name": "passenger ship",
        "category": "travel"
    },
    "26f4": {
        "id": "26f4",
        "name": "ferry",
        "category": "travel"
    },
    "1f6a2": {
        "id": "1f6a2",
        "name": "ship",
        "category": "travel"
    },
    "26fd": {
        "id": "26fd",
        "name": "fuel pump",
        "category": "travel"
    },
    "1f6a7": {
        "id": "1f6a7",
        "name": "construction",
        "category": "travel"
    },
    "1f6a6": {
        "id": "1f6a6",
        "name": "vertical traffic light",
        "category": "travel"
    },
    "1f6a5": {
        "id": "1f6a5",
        "name": "horizontal traffic light",
        "category": "travel"
    },
    "1f68f": {
        "id": "1f68f",
        "name": "bus stop",
        "category": "travel"
    },
    "1f5fa": {
        "id": "1f5fa",
        "name": "world map",
        "category": "travel"
    },
    "1f5ff": {
        "id": "1f5ff",
        "name": "moai",
        "category": "travel"
    },
    "1f5fd": {
        "id": "1f5fd",
        "name": "Statue of Liberty",
        "category": "travel"
    },
    "1f5fc": {
        "id": "1f5fc",
        "name": "Tokyo tower",
        "category": "travel"
    },
    "1f3f0": {
        "id": "1f3f0",
        "name": "castle",
        "category": "travel"
    },
    "1f3ef": {
        "id": "1f3ef",
        "name": "Japanese castle",
        "category": "travel"
    },
    "1f3df": {
        "id": "1f3df",
        "name": "stadium",
        "category": "travel"
    },
    "1f3a1": {
        "id": "1f3a1",
        "name": "ferris wheel",
        "category": "travel"
    },
    "1f3a2": {
        "id": "1f3a2",
        "name": "roller coaster",
        "category": "travel"
    },
    "1f3a0": {
        "id": "1f3a0",
        "name": "carousel horse",
        "category": "travel"
    },
    "26f2": {
        "id": "26f2",
        "name": "fountain",
        "category": "travel"
    },
    "26f1": {
        "id": "26f1",
        "name": "umbrella on ground",
        "category": "travel"
    },
    "1f3d6": {
        "id": "1f3d6",
        "name": "beach with umbrella",
        "category": "travel"
    },
    "1f3dd": {
        "id": "1f3dd",
        "name": "desert island",
        "category": "travel"
    },
    "1f3dc": {
        "id": "1f3dc",
        "name": "desert",
        "category": "travel"
    },
    "1f30b": {
        "id": "1f30b",
        "name": "volcano",
        "category": "travel"
    },
    "26f0": {
        "id": "26f0",
        "name": "mountain",
        "category": "travel"
    },
    "1f3d4": {
        "id": "1f3d4",
        "name": "snow-capped mountain",
        "category": "travel"
    },
    "1f5fb": {
        "id": "1f5fb",
        "name": "mount fuji",
        "category": "travel"
    },
    "1f3d5": {
        "id": "1f3d5",
        "name": "camping",
        "category": "travel"
    },
    "26fa": {
        "id": "26fa",
        "name": "tent",
        "category": "travel"
    },
    "1f3e0": {
        "id": "1f3e0",
        "name": "house",
        "category": "travel"
    },
    "1f3e1": {
        "id": "1f3e1",
        "name": "house with garden",
        "category": "travel"
    },
    "1f3d8": {
        "id": "1f3d8",
        "name": "houses",
        "category": "travel"
    },
    "1f3da": {
        "id": "1f3da",
        "name": "derelict house",
        "category": "travel"
    },
    "1f3d7": {
        "id": "1f3d7",
        "name": "building construction",
        "category": "travel"
    },
    "1f3ed": {
        "id": "1f3ed",
        "name": "factory",
        "category": "travel"
    },
    "1f3e2": {
        "id": "1f3e2",
        "name": "office building",
        "category": "travel"
    },
    "1f3ec": {
        "id": "1f3ec",
        "name": "department store",
        "category": "travel"
    },
    "1f3e3": {
        "id": "1f3e3",
        "name": "Japanese post office",
        "category": "travel"
    },
    "1f3e4": {
        "id": "1f3e4",
        "name": "post office",
        "category": "travel"
    },
    "1f3e5": {
        "id": "1f3e5",
        "name": "hospital",
        "category": "travel"
    },
    "1f3e6": {
        "id": "1f3e6",
        "name": "bank",
        "category": "travel"
    },
    "1f3e8": {
        "id": "1f3e8",
        "name": "hotel",
        "category": "travel"
    },
    "1f3ea": {
        "id": "1f3ea",
        "name": "convenience store",
        "category": "travel"
    },
    "1f3eb": {
        "id": "1f3eb",
        "name": "school",
        "category": "travel"
    },
    "1f3e9": {
        "id": "1f3e9",
        "name": "love hotel",
        "category": "travel"
    },
    "1f492": {
        "id": "1f492",
        "name": "wedding",
        "category": "travel"
    },
    "1f3db": {
        "id": "1f3db",
        "name": "classical building",
        "category": "travel"
    },
    "26ea": {
        "id": "26ea",
        "name": "church",
        "category": "travel"
    },
    "1f54c": {
        "id": "1f54c",
        "name": "mosque",
        "category": "travel"
    },
    "1f54d": {
        "id": "1f54d",
        "name": "synagogue",
        "category": "travel"
    },
    "1f54b": {
        "id": "1f54b",
        "name": "kaaba",
        "category": "travel"
    },
    "26e9": {
        "id": "26e9",
        "name": "shinto shrine",
        "category": "travel"
    },
    "1f6e4": {
        "id": "1f6e4",
        "name": "railway track",
        "category": "travel"
    },
    "1f6e3": {
        "id": "1f6e3",
        "name": "motorway",
        "category": "travel"
    },
    "1f5fe": {
        "id": "1f5fe",
        "name": "map of Japan",
        "category": "travel"
    },
    "1f391": {
        "id": "1f391",
        "name": "moon viewing ceremony",
        "category": "travel"
    },
    "1f3de": {
        "id": "1f3de",
        "name": "national park",
        "category": "travel"
    },
    "1f305": {
        "id": "1f305",
        "name": "sunrise",
        "category": "travel"
    },
    "1f304": {
        "id": "1f304",
        "name": "sunrise over mountains",
        "category": "travel"
    },
    "1f320": {
        "id": "1f320",
        "name": "shooting star",
        "category": "travel"
    },
    "1f387": {
        "id": "1f387",
        "name": "sparkler",
        "category": "travel"
    },
    "1f386": {
        "id": "1f386",
        "name": "fireworks",
        "category": "travel"
    },
    "1f9e8": {
        "id": "1f9e8",
        "name": "firecracker",
        "category": "travel"
    },
    "1f307": {
        "id": "1f307",
        "name": "sunset",
        "category": "travel"
    },
    "1f306": {
        "id": "1f306",
        "name": "cityscape at dusk",
        "category": "travel"
    },
    "1f3d9": {
        "id": "1f3d9",
        "name": "cityscape",
        "category": "travel"
    },
    "1f303": {
        "id": "1f303",
        "name": "night with stars",
        "category": "travel"
    },
    "1f30c": {
        "id": "1f30c",
        "name": "milky way",
        "category": "travel"
    },
    "1f309": {
        "id": "1f309",
        "name": "bridge at night",
        "category": "travel"
    },
    "1f512": {
        "id": "1f512",
        "name": "locked",
        "category": "objects"
    },
    "1f513": {
        "id": "1f513",
        "name": "unlocked",
        "category": "objects"
    },
    "1f301": {
        "id": "1f301",
        "name": "foggy",
        "category": "travel"
    }
};

import { commonServicesModule } from './common-services.module';
commonServicesModule.constant('EMOJI_DATA', EMOJI_DATA);
