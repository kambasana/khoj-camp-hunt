const rows = [
  ['kutch-1','White goats',1,'kutch-white-goats'], ['kutch-2','Black goat',1,'kutch-1'], ['kutch-3','Brown goat',1,'kutch-brown-goat'],
  ['kutch-4','Seated camel',2,'kutch-seated-camel'], ['kutch-5','Potter’s wheel',2,'kutch-potters-wheel'], ['kutch-6','Round drum',2,'kutch-round-drum'],
  ['kutch-7','String musician',3,'kutch-string-musician'], ['kutch-8','Toy elephant',3,'kutch-toy-elephant'], ['kutch-9','Hobby-horse child',3,'kutch-hobby-horse-child'],
  ['kutch-10','Colourful parasol',4,'kutch-colourful-parasol'], ['kutch-11','Carved seats',4,'kutch-carved-seats'], ['kutch-12','Loom',4,'kutch-loom'],
];
export const kutchV4Map = Object.freeze(Object.fromEntries(rows.map(([id,name,district,targetId]) => [id, Object.freeze({outcome: targetId === id ? 'same' : 'mapped', sourceName:name, targetName:name, targetId, districtId:`kutch-district-${district}`})])));
const targets = Object.freeze(rows.map(([id,name,district]) => Object.freeze({id,name:Object.freeze({en:name}),districtId:`kutch-district-${district}`})));
export const kutchV4Catalogue = Object.freeze({id:'kutch',contentVersion:4,targets,districts:Object.freeze([1,2,3,4].map(index=>Object.freeze({id:`kutch-district-${index}`,width:1536,height:1024,targets:Object.freeze(targets.filter(target=>target.districtId===`kutch-district-${index}`))})))});
