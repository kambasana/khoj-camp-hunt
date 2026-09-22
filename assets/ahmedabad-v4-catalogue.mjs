// Frozen pre-cutover identities from the staging district catalogue. Versions
// 3 and 4 used these same target semantics; version 3 used stitched cameras.
const rows = [
  ['ahmedabad-1', 'Blue bag', 1, 'ahmedabad-1'],
  ['ahmedabad-2', 'Telescope', 1, 'ahmedabad-2'],
  ['ahmedabad-3', 'Pink bird', 1, null],
  ['ahmedabad-4', 'Fish kite', 2, null],
  ['ahmedabad-5', 'Sun-face kite', 2, null],
  ['ahmedabad-6', 'Toy cow', 2, null],
  ['ahmedabad-7', 'Red toy elephant', 3, null],
  ['ahmedabad-8', 'Toy truck', 3, null],
  ['ahmedabad-9', 'Black binoculars', 3, null],
  ['ahmedabad-10', 'Owl kite', 4, null],
  ['ahmedabad-11', 'Wooden birdhouse', 4, null],
  ['ahmedabad-12', 'Red-white ball', 4, null],
];

export const ahmedabadV4Map = Object.freeze(Object.fromEntries(rows.map(([id, name, district, targetId]) => [id, Object.freeze({
  outcome: targetId === null ? 'removed' : targetId === id ? 'same' : 'mapped',
  sourceName: name,
  targetName: name,
  targetId,
  districtId: `ahmedabad-district-${district}`,
})])));

const targets = Object.freeze(rows.map(([id, name, district]) => Object.freeze({
  id,
  name: Object.freeze({en: name}),
  districtId: `ahmedabad-district-${district}`,
})));

export const ahmedabadV4Catalogue = Object.freeze({
  id: 'ahmedabad',
  contentVersion: 4,
  targets,
  districts: Object.freeze([1, 2, 3, 4].map(index => Object.freeze({
    id: `ahmedabad-district-${index}`,
    width: 1536,
    height: 1024,
    targets: Object.freeze(targets.filter(target => target.districtId === `ahmedabad-district-${index}`)),
  }))),
});
