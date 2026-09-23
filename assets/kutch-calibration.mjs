// Reviewed against the accepted 1536×1024 Kutch district sources.
const rows = [
  ['kutch-white-goats', 1, 'White goats', 'સફેદ બકરીઓ', [40,240,540,460], 'Two white goats stand together by the blue door.', 'બે સફેદ બકરીઓ વાદળા દરવાજા પાસે ઊભી છે.'],
  ['kutch-1', 1, 'Black goat', 'કાળી બકરી', [650,270,300,410], 'A black goat stands in the sunny lane.', 'કાળી બકરી તડકાવાળી ગલીમાં ઊભી છે.'],
  ['kutch-brown-goat', 1, 'Brown goat', 'કથ્થઈ બકરી', [1080,270,350,430], 'A brown goat waits beside the craft stall.', 'કથ્થઈ બકરી હસ્તકલાની દુકાન પાસે ઊભી છે.'],
  ['kutch-potters-wheel', 2, 'Potter’s wheel', 'કુંભારનો ચાક', [20,555,560,315], 'A broad wooden wheel spins the clay pot.', 'પહોળો લાકડાનો ચાક માટલું ફેરવે છે.'],
  ['kutch-round-drum', 2, 'Round drum', 'ગોળાકાર ઢોલ', [760,430,270,300], 'A decorated round drum rests in the courtyard.', 'શણગારેલો ગોળાકાર ઢોલ આંગણામાં છે.'],
  ['kutch-seated-camel', 2, 'Seated camel', 'બેઠેલો ઊંટ', [1040,270,470,390], 'A decorated camel rests by the gate.', 'શણગારેલો ઊંટ દરવાજા પાસે આરામ કરે છે.'],
  ['kutch-string-musician', 3, 'String musician', 'તંતુવાદક', [20,180,540,575], 'A musician plays a long-necked string instrument.', 'સંગીતકાર લાંબી ડોકવાળું તારવાદ્ય વગાડે છે.'],
  ['kutch-toy-elephant', 3, 'Toy elephant', 'રમકડાનો હાથી', [630,500,300,330], 'A painted elephant rolls on four little wheels.', 'રંગેલો હાથી ચાર નાનાં પૈડાં પર ચાલે છે.'],
  ['kutch-hobby-horse-child', 3, 'Hobby-horse child', 'રમકડાના ઘોડા પરનું બાળક', [1090,210,390,640], 'A child rides a painted wooden rocking horse.', 'બાળક રંગેલા લાકડાના ઝૂલતા ઘોડા પર બેઠો છે.'],
  ['kutch-colourful-parasol', 4, 'Colourful parasol', 'રંગબેરંગી છત્રી', [0,20,520,300], 'A bright embroidered parasol shades the courtyard.', 'ચમકતી ભરતકામવાળી છત્રી આંગણાને છાંયો આપે છે.'],
  ['kutch-carved-seats', 4, 'Carved seats', 'કોતરેલી બેઠકો', [300,510,600,360], 'Two carved wooden seats face the loom.', 'બે કોતરેલી લાકડાની બેઠકો સાળ સામે છે.'],
  ['kutch-loom', 4, 'Loom', 'સાળ', [900,100,620,760], 'A full wooden loom holds a red woven cloth.', 'આખી લાકડાની સાળ પર લાલ વણાયેલું કાપડ છે.'],
];

function silhouette([x,y,width,height]) { const r=x+width,b=y+height; return [[x+width*.14,y],[r-width*.1,y+height*.06],[r,y+height*.28],[r-width*.05,b-height*.1],[x+width*.55,b],[x+width*.1,b-height*.06],[x,y+height*.58],[x+width*.04,y+height*.18]]; }
function crop([x,y,width,height]) { const l=Math.max(0,x-24),t=Math.max(0,y-24),r=Math.min(1536,x+width+24),b=Math.min(1024,y+height+24); return {x:l,y:t,width:r-l,height:b-t}; }

const where = {
  'kutch-white-goats': ['Left side, by the blue door.', 'ડાબે, વાદળા દરવાજા પાસે.'],
  'kutch-1': ['Centre, in the sunny lane.', 'મધ્યમાં, તડકાવાળી ગલીમાં.'],
  'kutch-brown-goat': ['Right side, by the craft stall.', 'જમણે, હસ્તકલાની દુકાન પાસે.'],
  'kutch-potters-wheel': ['Lower left, the wooden wheel.', 'નીચે ડાબે, લાકડાનો ચાક.'],
  'kutch-round-drum': ['Centre of the courtyard.', 'આંગણાની મધ્યમાં.'],
  'kutch-seated-camel': ['Right side, seated by the gate.', 'જમણે, દરવાજા પાસે બેઠેલો.'],
  'kutch-string-musician': ['Left side, with the long-necked instrument.', 'ડાબે, લાંબી ડોકવાળા વાદ્ય સાથે.'],
  'kutch-toy-elephant': ['Lower centre, on four little wheels.', 'નીચે મધ્યમાં, ચાર નાનાં પૈડાં પર.'],
  'kutch-hobby-horse-child': ['Right side, on the rocking horse.', 'જમણે, ઝૂલતા ઘોડા પર.'],
  'kutch-colourful-parasol': ['Upper left, shading the courtyard.', 'ઉપર ડાબે, આંગણાને છાંયે.'],
  'kutch-carved-seats': ['Lower centre, facing the loom.', 'નીચે મધ્યમાં, સાળ સામે.'],
  'kutch-loom': ['Right side, the loom with red cloth.', 'જમણે, લાલ કાપડવાળી સાળ.'],
};

export const kutchTargets = rows.map(([id,district,en,gu,box,enClue,guClue], levelOrder) => {
  const [x,y,width,height]=box,cx=x+width/2,cy=y+height/2;
  return {id,districtId:`kutch-district-${district}`,levelOrder,name:{en,gu},sourcePanel:`docs/qa/panels/candidates/kutch-district-${district}-v3.png`,sourceBounds:{x,y,width,height},visualBounds:{x,y,width,height},hitPolygon:silhouette(box),thumbnailCrop:crop(box),hintRegion:{x:cx<768?0:768,y:cy<512?0:512,width:768,height:512},clues:{en:[enClue,where[id][0]],gu:[guClue,where[id][1]]},calibrationVersion:1};
});
