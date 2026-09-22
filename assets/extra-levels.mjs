// Metadata is separate from the visually calibrated target data.
const temporaryPanelSelections = {
  navratri: [1, 2, 3, 4],
  ahmedabad: [1, 2, 3, 4],
  jamnagar: [1, 2, 3, 4],
  kutch: [1, 2, 3, 4],
  junagadh: [1, 2, 3, 4],
  surat: [1, 3, 4, 5],
  patan: [1, 2, 3, 4],
  garba: [1, 3, 4, 5],
};

const legacyOffsets = [[384, 256], [1920, 256], [384, 1280], [1920, 1280]];

export function temporaryDistrictsFor(levelId, panels = temporaryPanelSelections[levelId]) {
  if (!Object.hasOwn(temporaryPanelSelections, levelId)) throw new Error(`Unknown temporary district level: ${levelId}`);
  if (!Array.isArray(panels)) throw new Error(`Invalid temporary district panel selection: ${levelId}`);
  return panels.map((panel, index) => ({
    id: `${levelId}-district-${index + 1}`,
    name: {en: `District ${index + 1}`, gu: `વિસ્તાર ${index + 1}`},
    image: `docs/qa/panels/${levelId}-${panel}.png`,
    preview: `docs/qa/panels/${levelId}-${panel}.png`,
    width: 1536,
    height: 1024,
    legacyOffset: {x: legacyOffsets[index][0], y: legacyOffsets[index][1]},
    targets: [],
  }));
}

const extraLevelMetadata = [
  {
    "id": "ahmedabad",
    "contentVersion": 3,
    "name": {
      "en": "Uttarayan Rooftops",
      "gu": "ઉત્તરાયણની છતો"
    },
    "area": {
      "en": "Ahmedabad Pol & Uttarayan Rooftops",
      "gu": "ઉત્તરાયણની છતો"
    },
    "difficulty": {
      "en": "Challenging",
      "gu": "પડકારજનક"
    },
    "image": "./assets/scenes/ahmedabad.webp",
    "preview": "./assets/scenes/ahmedabad-preview.webp",
    "width": 3840,
    "height": 2560
  },
  {
    "id": "jamnagar",
    "contentVersion": 3,
    "name": {
      "en": "Bandhani Bazaar",
      "gu": "બાંધણી બજાર"
    },
    "area": {
      "en": "Jamnagar Bandhani Bazaar",
      "gu": "બાંધણી બજાર"
    },
    "difficulty": {
      "en": "Hard",
      "gu": "મુશ્કેલ"
    },
    "image": "./assets/scenes/jamnagar.webp",
    "preview": "./assets/scenes/jamnagar-preview.webp",
    "width": 3840,
    "height": 2560
  },
  {
    "id": "kutch",
    "contentVersion": 3,
    "name": {
      "en": "Kutch Craft Fair",
      "gu": "કચ્છનો હસ્તકલા મેળો"
    },
    "area": {
      "en": "Kutch Craft Fair",
      "gu": "કચ્છનો હસ્તકલા મેળો"
    },
    "difficulty": {
      "en": "Hard",
      "gu": "મુશ્કેલ"
    },
    "image": "./assets/scenes/kutch.webp",
    "preview": "./assets/scenes/kutch-preview.webp",
    "width": 3840,
    "height": 2560
  },
  {
    "id": "junagadh",
    "contentVersion": 3,
    "name": {
      "en": "Junagadh Market",
      "gu": "જૂનાગઢનું બજાર"
    },
    "area": {
      "en": "Junagadh Street Market",
      "gu": "જૂનાગઢનું બજાર"
    },
    "difficulty": {
      "en": "Hard",
      "gu": "મુશ્કેલ"
    },
    "image": "./assets/scenes/junagadh.webp",
    "preview": "./assets/scenes/junagadh-preview.webp",
    "width": 3840,
    "height": 2560
  },
  {
    "id": "surat",
    "contentVersion": 3,
    "name": {
      "en": "Surat Food Market",
      "gu": "સુરતનું ખાણીપીણી બજાર"
    },
    "area": {
      "en": "Surat Food Market",
      "gu": "સુરતનું ખાણીપીણી બજાર"
    },
    "difficulty": {
      "en": "Very hard",
      "gu": "ખૂબ મુશ્કેલ"
    },
    "image": "./assets/scenes/surat.webp",
    "preview": "./assets/scenes/surat-preview.webp",
    "width": 3840,
    "height": 2560
  },
  {
    "id": "patan",
    "contentVersion": 3,
    "name": {
      "en": "Weavers’ Quarter",
      "gu": "વણકરોનો વિસ્તાર"
    },
    "area": {
      "en": "Patan Weavers' Quarter",
      "gu": "વણકરોનો વિસ્તાર"
    },
    "difficulty": {
      "en": "Very hard",
      "gu": "ખૂબ મુશ્કેલ"
    },
    "image": "./assets/scenes/patan.webp",
    "preview": "./assets/scenes/patan-preview.webp",
    "width": 3840,
    "height": 2560
  },
  {
    "id": "garba",
    "contentVersion": 3,
    "name": {
      "en": "Grand Garba Night",
      "gu": "ગરબાની મહારાત"
    },
    "area": {
      "en": "Grand Garba Night",
      "gu": "ગરબાની મહારાત"
    },
    "difficulty": {
      "en": "Expert",
      "gu": "નિષ્ણાત"
    },
    "image": "./assets/scenes/garba.webp",
    "preview": "./assets/scenes/garba-preview.webp",
    "width": 3840,
    "height": 2560
  }
];

const acceptedDistrictMetadata = Object.freeze({
  ahmedabad: [
    {en: 'Old City Rooftops', gu: 'જૂના શહેરની છતો'},
    {en: 'Kite Garden', gu: 'પતંગ બગીચો'},
    {en: 'Rooftop Workshop', gu: 'છતની કાર્યશાળા'},
    {en: 'Festival Terrace', gu: 'ઉત્સવની અગાશી'},
  ],
  jamnagar: [
    {en: 'Bandhani Atelier', gu: 'બાંધણીનું આંગણું'},
    {en: 'Caravan Courtyard', gu: 'કારવાંનું આંગણું'},
    {en: 'Dye Courtyard', gu: 'રંગકામનું આંગણું'},
    {en: 'Lakeside Bazaar', gu: 'તળાવકાંઠાનું બજાર'},
  ],
  kutch: [
    {en: 'Goat Courtyard', gu: 'બકરીઓનું આંગણું'},
    {en: 'Potter’s Courtyard', gu: 'કુંભારનું આંગણું'},
    {en: 'Music & Toy Court', gu: 'સંગીત અને રમકડાંનું આંગણું'},
    {en: 'Weaving Pavilion', gu: 'વણાટનું મંડપ'},
  ],
});

export const extraLevels = extraLevelMetadata.filter((level) => acceptedDistrictMetadata[level.id]).map((level) => ({
  ...level,
  ...(acceptedDistrictMetadata[level.id] ? {
    contentVersion: 5,
    width: 1536,
    height: 1024,
    image: `./img/scenes/${level.id}-district-1.webp`,
    preview: `./img/scenes/${level.id}-district-1-preview.webp`,
    districts: acceptedDistrictMetadata[level.id].map((name, index) => ({
      id: `${level.id}-district-${index + 1}`,
      name,
      image: `./img/scenes/${level.id}-district-${index + 1}.webp`,
      preview: `./img/scenes/${level.id}-district-${index + 1}-preview.webp`,
      width: 1536,
      height: 1024,
      reviewStatus: 'accepted-production',
    })),
  } : {
    contentVersion: 4,
    districts: temporaryDistrictsFor(level.id),
  }),
}));
