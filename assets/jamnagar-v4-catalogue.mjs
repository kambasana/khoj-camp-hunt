// Frozen identities from the pre-cutover staging catalogue. Versions 3 and 4
// share target semantics; version 3 stored a stitched-scene camera.
const rows=[
  ['jamnagar-1','Rooftop peacock',1,'jamnagar-1'],
  ['jamnagar-2','Sewing machine',1,'jamnagar-2'],
  ['jamnagar-3','Black cat',1,'jamnagar-3'],
  ['jamnagar-4','Child’s pinwheel',2,null],
  ['jamnagar-5','Tall brass lantern',2,null],
  ['jamnagar-6','Walking striped cat',2,null],
  ['jamnagar-7','Painted elephant',3,null],
  ['jamnagar-8','Wooden comb',3,null],
  ['jamnagar-9','White conch',3,null],
  ['jamnagar-10','Walking white-pawed cat',4,null],
  ['jamnagar-11','Dog under the table',4,null],
  ['jamnagar-12','Coiled rope',4,null],
];

export const jamnagarV4Map=Object.freeze(Object.fromEntries(rows.map(([id,name,district,targetId])=>[id,Object.freeze({
  outcome:targetId===null?'removed':targetId===id?'same':'mapped',sourceName:name,targetName:name,targetId,districtId:`jamnagar-district-${district}`,
})])));
const targets=Object.freeze(rows.map(([id,name,district])=>Object.freeze({id,name:Object.freeze({en:name}),districtId:`jamnagar-district-${district}`})));
export const jamnagarV4Catalogue=Object.freeze({id:'jamnagar',contentVersion:4,targets,districts:Object.freeze([1,2,3,4].map(index=>Object.freeze({
  id:`jamnagar-district-${index}`,width:1536,height:1024,targets:Object.freeze(targets.filter(target=>target.districtId===`jamnagar-district-${index}`)),
})))});
