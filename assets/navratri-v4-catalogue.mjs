// Frozen pre-cutover identities from e6fe3b4: target-calibration.mjs and
// district catalogue. Evidence: tests/fixtures/navratri-v4-catalogue.json.
// v3 used these same target semantics but a stitched camera coordinate space.
const rows = [
  ['navratri-1','Rooftop cat',1,'navratri-1'],
  ['navratri-2','White goat',1,'navratri-2'],
  ['navratri-3','Painted little pot',1,'navratri-3'],
  ['navratri-4','Brass owl',2,null],
  ['navratri-5','Sleeping dog',2,null],
  ['navratri-6','Stone elephant',2,null],
  ['navratri-7','Perched peacock',3,null],
  ['navratri-8','Little doll',3,null],
  ['navratri-9','Painted owl',3,null],
  ['navratri-10','Wheeled horse',4,'navratri-wheeled-horse'],
  ['navratri-11','Balcony cat',4,null],
  ['navratri-12','Carved elephant',4,null],
];
export const navratriV4Map = Object.freeze(Object.fromEntries(rows.map(([id,name,district,targetId]) => [id,Object.freeze({
  outcome: targetId === null ? 'removed' : targetId === id ? 'same' : 'mapped',
  sourceName:name, targetName:name, targetId, districtId:`navratri-district-${district}`,
})])));
const targets = Object.freeze(rows.map(([id,name,district]) => Object.freeze({id,name:Object.freeze({en:name}),districtId:`navratri-district-${district}`})));
export const navratriV4Catalogue = Object.freeze({id:'navratri',contentVersion:4,targets,
  districts:Object.freeze([1,2,3,4].map(index => Object.freeze({id:`navratri-district-${index}`,width:1536,height:1024,
    targets:Object.freeze(targets.filter(target => target.districtId === `navratri-district-${index}`))}))),
});
