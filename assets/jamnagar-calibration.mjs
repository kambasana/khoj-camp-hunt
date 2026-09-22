// Reviewed against the accepted 1536×1024 Jamnagar district sources.
const rows = [
  ['jamnagar-1', 1, 'Rooftop peacock', 'છત પરનો મોર', [1114,0,356,188], 'A blue-green lookout balances above the courtyard.', 'વાદળી-લીલો મોર આંગણાની ઉપર સંતુલન રાખે છે.'],
  ['jamnagar-2', 1, 'Sewing machine', 'સીવવાનું મશીન', [840,480,238,386], 'A black treadle machine helps finish the bandhani cloth.', 'કાળું પગથી ચાલતું મશીન બાંધણીનું કાપડ પૂરું કરે છે.'],
  ['jamnagar-3', 1, 'Black cat', 'કાળી બિલાડી', [1272,251,181,91], 'A black cat sleeps on the high stone ledge.', 'કાળી બિલાડી ઊંચી પથ્થરની પાળી પર સૂઈ છે.'],
  ['jamnagar-resting-dog', 2, 'Resting dog', 'આરામ કરતો કૂતરો', [119,657,439,166], 'A brown dog has found a cool step for a nap.', 'ભૂરા કૂતરાને ઊંઘવા ઠંડું પગથિયું મળ્યું છે.'],
  ['jamnagar-silver-pail', 2, 'Silver pail', 'ચાંદીની ડોલ', [705,548,101,176], 'A plain silver pail catches water beside the pool.', 'સાદી ચાંદીની ડોલ કુંડ પાસે પાણી ભરે છે.'],
  ['jamnagar-camel', 2, 'Camel', 'ઊંટ', [1028,274,414,262], 'A decorated camel rests beside the old gateway.', 'શણગારેલો ઊંટ જૂના દરવાજા પાસે આરામ કરે છે.'],
  ['jamnagar-magenta-dye', 3, 'Magenta dye', 'મેજેંટા રંગ', [35,389,542,423], 'The left vat glows with vivid magenta dye.', 'ડાબું કુંડ તેજ મેજેંટા રંગથી ચમકે છે.'],
  ['jamnagar-indigo-dye', 3, 'Indigo dye', 'નીળ રંગ', [720,389,523,348], 'The second vat is filled with deep indigo.', 'બીજું કુંડ ઘેરા નીળ રંગથી ભરેલું છે.'],
  ['jamnagar-cotton-basket', 3, 'Cotton basket', 'કપાસનો ટોપલો', [1030,630,468,275], 'Dry white cotton bundles fill a broad wicker basket.', 'સૂકા સફેદ કપાસના પોટલા પહોળા ટોપલામાં ભરેલા છે.'],
  ['jamnagar-silver-tea-urn', 4, 'Silver tea urn', 'ચાંદીનું ચાનું વાસણ', [82,360,267,421], 'A tall silver urn serves tea at the lakeside market.', 'ઊંચું ચાંદીનું વાસણ તળાવકાંઠાના બજારમાં ચા આપે છે.'],
  ['jamnagar-blue-cloth', 4, 'Blue cloth', 'વાદળી કાપડ', [811,534,203,101], 'One neatly folded blue cloth rests on the counter.', 'એક સરસ રીતે વાળેલું વાદળી કાપડ મેજ પર છે.'],
  ['jamnagar-bangle-display', 4, 'Bangle display', 'બંગડીઓનું પ્રદર્શન', [1264,344,272,540], 'Rows of colourful glass bangles fill a wooden rack.', 'રંગીન કાચની બંગડીઓની હારો લાકડાના સ્ટેન્ડમાં છે.'],
];

function silhouette([x,y,width,height]) {
  const right=x+width,bottom=y+height;
  return [[x+width*.18,y],[right-width*.12,y+height*.04],[right,y+height*.31],[right-width*.04,bottom-height*.12],[x+width*.52,bottom],[x+width*.12,bottom-height*.05],[x,y+height*.55],[x+width*.04,y+height*.18]];
}

const silhouetteById=Object.freeze({
  'jamnagar-indigo-dye': [[760,410],[1195,410],[1230,475],[1205,590],[1020,620],[1005,698],[770,695],[730,600],[725,470]],
});

function crop([x,y,width,height]) {
  const left=Math.max(0,x-24),top=Math.max(0,y-24),right=Math.min(1536,x+width+24),bottom=Math.min(1024,y+height+24);
  return {x:left,y:top,width:right-left,height:bottom-top};
}

export const jamnagarTargets=rows.map(([id,district,en,gu,box,enClue,guClue],levelOrder)=>{
  const [x,y,width,height]=box,cx=x+width/2,cy=y+height/2;
  return {
    id,districtId:`jamnagar-district-${district}`,levelOrder,name:{en,gu},
    sourcePanel:`docs/qa/panels/candidates/jamnagar-district-${district}-v2.png`,
    sourceBounds:{x,y,width,height},visualBounds:{x,y,width,height},hitPolygon:silhouetteById[id]||silhouette(box),thumbnailCrop:crop(box),
    hintRegion:{x:cx<768?0:768,y:cy<512?0:512,width:768,height:512},
    clues:{en:[enClue,'Search inside the highlighted area.'],gu:[guClue,'ચિહ્નિત વિસ્તારમાં શોધો.']},calibrationVersion:1,
  };
});
