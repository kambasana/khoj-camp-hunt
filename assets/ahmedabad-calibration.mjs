// Reviewed against the accepted 1536×1024 Ahmedabad district sources.
// This module is deliberately separate from the live staging catalogue: a
// cutover must change artwork, runtime targets and save migration atomically.
const rows = [
  ['ahmedabad-ledge-cat', 1, 'Ledge cat', 'પાળીની બિલાડી', [73,82,137,187], 'A patient cat has claimed the high ledge.', 'ઊંચી પાળી પર એક ધીરજવાળી બિલાડી બેઠી છે.'],
  ['ahmedabad-2', 1, 'Telescope', 'દૂરબીન', [363,209,240,390], 'A kite watcher has left a telescope on its tripod.', 'પતંગ જોનારે ત્રિપાઈ પર દૂરબીન મૂકી છે.'],
  ['ahmedabad-1', 1, 'Blue bag', 'વાદળી થેલી', [1219,724,233,246], 'A blue bag waits beside the rooftop gathering.', 'છત પરની ભીડ પાસે વાદળી થેલી રાહ જુએ છે.'],
  ['ahmedabad-purple-bird', 2, 'Purple bird', 'જાંબલી પક્ષી', [105,320,170,173], 'One small purple bird stands out against the rooftops.', 'છતો વચ્ચે એક નાનો જાંબલી પક્ષી અલગ દેખાય છે.'],
  ['ahmedabad-resting-dog', 2, 'Resting dog', 'આરામ કરતો કૂતરો', [330,565,360,193], 'This tired friend is resting below the kite action.', 'પતંગોની ધમાલ નીચે આ થાકેલો મિત્ર આરામ કરે છે.'],
  ['ahmedabad-lotus-pond', 2, 'Lotus pond', 'કમળનું તળાવ', [795,625,723,348], 'Find the broad pond filled with lotus leaves and flowers.', 'કમળનાં પાન અને ફૂલોથી ભરેલું વિશાળ તળાવ શોધો.'],
  ['ahmedabad-orange-kite', 3, 'Orange kite', 'નારંગી પતંગ', [485,730,464,195], 'A bright orange kite has settled low on the roof.', 'ચમકતું નારંગી પતંગ છત પર નીચે ઉતરીને પડ્યું છે.'],
  ['ahmedabad-yellow-reel', 3, 'Yellow reel', 'પીળી ફિરકી', [918,710,312,119], 'A yellow string reel is ready for the next flight.', 'આવતી ઉડાન માટે પીળી દોરીની ફિરકી તૈયાર છે.'],
  ['ahmedabad-purple-bucket', 3, 'Purple bucket', 'જાંબલી ડોલ', [1377,507,123,166], 'A purple bucket sits apart from the festival toys.', 'ઉત્સવના રમકડાંથી દૂર જાંબલી ડોલ પડી છે.'],
  ['ahmedabad-pink-kite', 4, 'Pink kite', 'ગુલાબી પતંગ', [921,750,361,165], 'A pink kite rests near the far rooftop edge.', 'છતની દૂરની ધાર પાસે ગુલાબી પતંગ આરામ કરે છે.'],
  ['ahmedabad-green-tiffin', 4, 'Green tiffin', 'લીલું ટિફિન', [1368,671,116,180], 'A stacked green lunch tin is tucked near the parapet.', 'પાળી પાસે ગોઠવાયેલું લીલું ટિફિન છે.'],
  ['ahmedabad-blue-watering-can', 4, 'Blue watering can', 'વાદળી ઝારી', [104,754,179,137], 'A blue watering can keeps the rooftop plants happy.', 'વાદળી ઝારી છતના છોડને પાણી આપે છે.'],
];

function boundsPolygon([x, y, width, height]) {
  const right = x + width;
  const bottom = y + height;
  return [[x + 8, y + 6], [right - 12, y], [right, y + height * 0.42], [right - 10, bottom - 6], [x + width * 0.38, bottom], [x, bottom - 12], [x, y + height * 0.34]];
}

const silhouetteById = Object.freeze({
  'ahmedabad-orange-kite': [[744,733],[949,845],[626,923],[485,798],[700,806]],
  'ahmedabad-yellow-reel': [[1012,711],[1192,722],[1230,769],[1198,815],[1017,829],[918,786],[918,754]],
});

function cropFor(bounds) {
  const [x, y, width, height] = bounds;
  const left = Math.max(0, x - 24);
  const top = Math.max(0, y - 24);
  return {x: left, y: top, width: Math.min(1536, x + width + 24) - left, height: Math.min(1024, y + height + 24) - top};
}

const where = {
  'ahmedabad-ledge-cat': ['Upper left, on the high stone ledge.', 'ઉપર ડાબે, ઊંચી પથ્થરની પાળી પર.'],
  'ahmedabad-2': ['Left of centre, on a three-legged stand.', 'મધ્યથી ડાબે, ત્રિપાઈ પર.'],
  'ahmedabad-1': ['Lower right, beside the rooftop gathering.', 'નીચે જમણે, છતની ભીડ પાસે.'],
  'ahmedabad-purple-bird': ['Middle left, against the rooftops.', 'મધ્યમાં ડાબે, છતોની સામે.'],
  'ahmedabad-resting-dog': ['Lower left of centre, under the kites.', 'મધ્યથી ડાબે નીચે, પતંગોની નીચે.'],
  'ahmedabad-lotus-pond': ['Lower right, the broad lotus pond.', 'નીચે જમણે, વિશાળ કમળનું તળાવ.'],
  'ahmedabad-orange-kite': ['Along the bottom, centre of the roof.', 'સૌથી નીચે, છતની મધ્યમાં.'],
  'ahmedabad-yellow-reel': ['Lower right, near the orange kite.', 'નીચે જમણે, નારંગી પતંગ પાસે.'],
  'ahmedabad-purple-bucket': ['Middle right, apart from the toys.', 'મધ્યમાં જમણે, રમકડાંથી દૂર.'],
  'ahmedabad-pink-kite': ['Lower right, at the far roof edge.', 'નીચે જમણે, છતની દૂરની ધારે.'],
  'ahmedabad-green-tiffin': ['Lower right, by the parapet.', 'નીચે જમણે, પાળી પાસે.'],
  'ahmedabad-blue-watering-can': ['Lower left, by the plants.', 'નીચે ડાબે, છોડ પાસે.'],
};

export const ahmedabadTargets = rows.map(([id, district, en, gu, box, enClue, guClue], levelOrder) => {
  const [x, y, width, height] = box;
  const visualBounds = {x, y, width, height};
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  return {
    id,
    districtId: `ahmedabad-district-${district}`,
    levelOrder,
    name: {en, gu},
    sourcePanel: `docs/qa/panels/candidates/ahmedabad-district-${district}-v${district === 1 ? 3 : 2}.png`,
    sourceBounds: {...visualBounds},
    visualBounds,
    hitPolygon: silhouetteById[id] || boundsPolygon(box),
    thumbnailCrop: cropFor(box),
    hintRegion: {x: centerX < 768 ? 0 : 768, y: centerY < 512 ? 0 : 512, width: 768, height: 512},
    clues: {en: [enClue, where[id][0]], gu: [guClue, where[id][1]]},
    calibrationVersion: 1,
  };
});
