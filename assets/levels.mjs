import {flattenTargets} from './district-catalogue.mjs';
import {extraLevels} from './extra-levels.mjs';
import {calibratedTargets} from './target-calibration.mjs';

const navratri = {
  "id": "navratri",
  "contentVersion": 5,
  "name": {
    "en": "Navratri Bazaar",
    "gu": "નવરાત્રી બજાર"
  },
  "area": {
    "en": "A night in the old city",
    "gu": "જૂના શહેરની એક રાત"
  },
  "difficulty": {
    "en": "Challenging",
    "gu": "કઠિન"
  },
  "image": "./img/scenes/navratri-district-1.webp",
  "preview": "./img/scenes/navratri-district-1-preview.webp",
  "width": 1536,
  "height": 1024,
  "districts": [
    {en: 'Pottery Courtyard', gu: 'માટલાંનું આંગણું'},
    {en: 'Flower & Footwear Lane', gu: 'ફૂલ અને પગરખાંની ગલી'},
    {en: 'Rooftop Preparations', gu: 'છત પરની તૈયારીઓ'},
    {en: 'Canopy & Toy Courtyard', gu: 'મંડપ અને રમકડાંનું આંગણું'}
  ].map((name, index) => ({id: `navratri-district-${index + 1}`, name,
    image: `./img/scenes/navratri-district-${index + 1}.webp`,
    preview: `./img/scenes/navratri-district-${index + 1}-preview.webp`,
    width: 1536, height: 1024, reviewStatus: 'accepted-production'}))
};

export const levels = [navratri, ...extraLevels].map((level) => {
  const districts = level.districts.map((district) => ({
    ...district,
    targets: calibratedTargets[level.id].filter((target) => target.districtId === district.id),
  }));
  const districtLevel = {...level, districts};
  return {...districtLevel, targets: flattenTargets(districtLevel)};
});
