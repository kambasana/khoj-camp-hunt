// Hand-calibrated from the persisted 1536×1024 source panels, 2026-09-18.
// Each row is [panel number, EN name, GU name, x, y, width, height,
// EN clue, GU clue, EN location clue, GU location clue]. Coordinates are
// native source pixels, not positions inherited from the previous artwork.
// Assembly translates these rectangles only; no source panel is rescaled.
import {navratriTargets} from './navratri-calibration.mjs';
import {ahmedabadTargets} from './ahmedabad-calibration.mjs';
import {jamnagarTargets} from './jamnagar-calibration.mjs';
import {kutchTargets} from './kutch-calibration.mjs';
export const panelSelection = {
  navratri: [1, 2, 3, 4], ahmedabad: [1, 2, 3, 4],
  jamnagar: [1, 2, 3, 4], kutch: [1, 2, 3, 4],
  junagadh: [1, 2, 3, 4], surat: [1, 3, 4, 5],
  patan: [1, 2, 3, 4], garba: [1, 3, 4, 5],
};
export const panelPositions = [[384, 256], [1920, 256], [384, 1280], [1920, 1280]];
// The build and QA pipeline may use this accepted package before the runtime
// cutover. `calibratedTargets.ahmedabad` remains bound to the staging art until
// its versioned save migration is shipped in the same commit.
export const packagedCalibratedTargets = {navratri: navratriTargets, ahmedabad: ahmedabadTargets, jamnagar: jamnagarTargets, kutch: kutchTargets};
export const calibrationRows = {
  navratri: [
    [1,'Rooftop cat','છત પરની બિલાડી',1480,50,43,38,'A tiny watcher above the dancers.','નૃત્યકારોની ઉપર નાનો દર્શક છે.','Check the red roof at the upper right of the illustrated market.','ચિત્રિત બજારની ઉપર જમણી બાજુની લાલ છત જુઓ.'],
    [1,'White goat','સફેદ બકરી',1286,389,70,71,'Four legs have joined the celebration.','ઉત્સવમાં ચાર પગવાળું મહેમાન આવ્યું છે.','It stands beside the pottery stall on the right.','જમણી બાજુ માટલાંની દુકાન પાસે ઊભી છે.'],
    [1,'Painted little pot','રંગેલું નાનું માટલું',1308,941,42,50,'A little vessel wears blue and orange.','નાનું વાસણ વાદળી અને નારંગી રંગનું છે.','Look beside the large wicker basket in the lower-right corner.','નીચે જમણા ખૂણે મોટા ટોપલા પાસે જુઓ.'],
    [2,'Brass owl','પિત્તળનું ઘુવડ',260,699,67,113,'A wide-eyed ornament guards the crafts.','મોટી આંખોવાળું શણગારનું પક્ષી હસ્તકલા સાચવે છે.','On the left-hand stall, above the little elephants.','ડાબી દુકાનમાં નાના હાથીઓની ઉપર જુઓ.'],
    [2,'Sleeping dog','ઊંઘતો કૂતરો',393,855,207,115,'The celebration has tired this visitor.','ઉત્સવથી આ મહેમાન થાકી ગયો છે.','Curled on the front steps beside the brass pot.','આગળનાં પગથિયાં પર પિત્તળના વાસણ પાસે સૂતો છે.'],
    [2,'Stone elephant','પથ્થરનો હાથી',1163,341,87,176,'A carved guardian stands still.','કોતરેલો રક્ષક શાંતિથી ઊભો છે.','Beside the right-hand stall, behind the flower seller.','જમણી દુકાન પાસે ફૂલ વેચનારની પાછળ જુઓ.'],
    [3,'Perched peacock','બેઠેલો મોર',1180,106,98,177,'Blue feathers above the music.','સંગીતની ઉપર વાદળી પાંખો છે.','High on the right, beside the hanging birdcage.','જમણે ઉપર લટકતા પાંજરા પાસે જુઓ.'],
    [3,'Little doll','નાની ઢીંગલી',418,572,43,117,'A small dancer is being held, not dancing.','નાની નૃત્યકારને હાથમાં પકડી છે.','The girl at the left craft stall holds it.','ડાબી હસ્તકલાની દુકાન પાસેની બાળકીના હાથમાં છે.'],
    [3,'Painted owl','રંગેલું ઘુવડ',229,571,61,70,'Round yellow eyes peek from the display.','પ્રદર્શનમાં ગોળ પીળી આંખો ઝાંખે છે.','Between the yellow elephant and the red jar on the left table.','ડાબા મેજ પર પીળા હાથી અને લાલ ડબ્બા વચ્ચે છે.'],
    [4,'Wheeled horse','પૈડાંવાળો ઘોડો',274,778,149,197,'This colourful horse rolls instead of running.','આ રંગીન ઘોડો દોડવાને બદલે પૈડાં પર ચાલે છે.','On the front craft table, left of the small blue elephant.','આગળના મેજ પર નાના વાદળી હાથીની ડાબે છે.'],
    [4,'Balcony cat','બાલ્કનીની બિલાડી',180,43,76,71,'A striped observer stays above the crowd.','પટ્ટાવાળો દર્શક ભીડથી ઉપર રહે છે.','Look along the upper-left carved balcony.','ઉપર ડાબી કોતરેલી બાલ્કની પર જુઓ.'],
    [4,'Carved elephant','કોતરેલો હાથી',1101,827,132,110,'A little grey giant beside the flowers.','ફૂલો પાસે નાનો રાખોડી હાથી છે.','On a stone block beside the big flower bowl.','મોટા ફૂલના વાસણ પાસે પથ્થરના ચોરસ પર છે.'],
  ],
  ahmedabad: [
    [1,'Blue bag','વાદળી થેલો',177,746,60,42,'Someone set their bag down during lunch.','જમતી વખતે કોઈએ થેલો મૂક્યો છે.','On the near edge of the left rooftop picnic.','ડાબી છત પરના ભોજનની નજીકની ધાર પર છે.'],
    [1,'Telescope','દૂરબીન',910,645,59,105,'It looks farther than a kite string reaches.','તે પતંગની દોરીથી પણ દૂર જુએ છે.','On a tripod beside a rooftop diner at the right.','જમણી છત પર જમનારની પાસે ત્રણ પગના સ્ટેન્ડ પર છે.'],
    [1,'Pink bird','ગુલાબી પક્ષી',968,530,34,47,'A bright bird breaks the line of grey pigeons.','રાખોડી કબૂતરો વચ્ચે તેજ રંગનું પક્ષી છે.','On the wall just left of the right solar heater.','જમણા સોલર હીટરની ડાબે દીવાલ પર છે.'],
    [2,'Fish kite','માછલીનો પતંગ',281,117,77,42,'This fish swims in the sky.','આ માછલી આકાશમાં તરે છે.','Above the flowering balcony on the left.','ડાબી બાજુ ફૂલોવાળી બાલ્કનીની ઉપર છે.'],
    [2,'Sun-face kite','સૂર્યમુખી પતંગ',918,0,141,98,'A smiling sun flies above the real sunset.','સાચા સૂર્યાસ્તની ઉપર હસતો સૂર્ય ઊડે છે.','Near the top edge, just right of centre.','ઉપરની ધાર પાસે મધ્યથી થોડું જમણે છે.'],
    [2,'Toy cow','રમકડાની ગાય',1164,914,131,108,'A tiny white cow wears painted flowers.','નાની સફેદ ગાય પર રંગેલાં ફૂલો છે.','On the foreground wall below the family.','પરિવારની નીચે આગળની દીવાલ પર છે.'],
    [3,'Red toy elephant','લાલ રમકડાનો હાથી',1217,640,96,84,'A bright little elephant joins the kite festival.','તેજ રંગનો નાનો હાથી પતંગના ઉત્સવમાં જોડાયો છે.','On the right parapet beside the toy truck.','જમણી પાળી પર રમકડાના ટ્રક પાસે છે.'],
    [3,'Toy truck','રમકડાનો ટ્રક',1328,684,119,92,'A miniature delivery on the rooftop.','છત પર નાની માલગાડી છે.','On the right wall, between the elephant and the plant.','જમણી દીવાલ પર હાથી અને છોડ વચ્ચે છે.'],
    [3,'Black binoculars','કાળાં દૂરબીન',985,591,140,49,'Two lenses are waiting for a kite watcher.','બે કાચ પતંગ જોનારની રાહ જુએ છે.','Resting on the pale wall behind the pinwheel.','પવનચક્કીની પાછળ આછી દીવાલ પર છે.'],
    [4,'Owl kite','ઘુવડનો પતંગ',918,160,62,71,'Two big eyes watch from the sky.','આકાશમાંથી બે મોટી આંખો જુએ છે.','Above the central rooftops, below the sun-face kite.','મધ્યની છતો ઉપર સૂર્યમુખી પતંગની નીચે છે.'],
    [4,'Wooden birdhouse','લાકડાનું પક્ષીઘર',145,155,81,91,'A little home hangs near the flowers.','ફૂલો પાસે નાનું ઘર લટકે છે.','Beneath the roof at the upper left.','ઉપર ડાબે છતની નીચે છે.'],
    [4,'Red-white ball','લાલ-સફેદ દડો',1070,942,52,59,'This round toy stayed on the ground.','આ ગોળ રમકડું જમીન પર જ રહ્યું છે.','Against the wall near the lower-right chair leg.','નીચે જમણે ખુરશીના પાયા પાસે દીવાલને અડેલો છે.'],
  ],
  jamnagar: [
    [1,'Rooftop peacock','છત પરનો મોર',1060,24,73,143,'A long green tail hangs over the balcony.','બાલ્કની પર લાંબી લીલી પૂંછડી લટકે છે.','Above the orange and red fabrics at the upper right.','ઉપર જમણે નારંગી અને લાલ કાપડની ઉપર છે.'],
    [1,'Sewing machine','સીવવાનું મશીન',1053,455,53,46,'A tailor works beside the colourful bolts.','રંગીન કાપડ પાસે દરજી કામ કરે છે.','On the little white table right of the market lane.','બજારની ગલીની જમણે નાના સફેદ મેજ પર છે.'],
    [1,'Black cat','કાળી બિલાડી',17,224,53,28,'A dark little nap among the textiles.','કાપડ વચ્ચે નાનું કાળું પ્રાણી સૂતું છે.','On the far-left ledge above the blue cloth.','દૂર ડાબી પાળી પર વાદળી કાપડની ઉપર છે.'],
    [2,'Child’s pinwheel','બાળકની પવનચક્કી',905,398,41,67,'A splash of colour spins in a small hand.','નાના હાથમાં રંગીન ચક્કર ફરે છે.','The boy in blue holds it in the middle lane.','મધ્યની ગલીમાં વાદળી કપડાંવાળા છોકરાના હાથમાં છે.'],
    [2,'Tall brass lantern','ઊંચું પિત્તળનું ફાનસ',1066,747,87,193,'A patterned tower holds a light.','નકશીવાળો મિનાર પ્રકાશ રાખે છે.','Near the front-right fruit baskets.','આગળ જમણે ફળના ટોપલાં પાસે છે.'],
    [2,'Walking striped cat','ચાલતી પટ્ટાવાળી બિલાડી',913,514,69,76,'A striped shopper crosses the lane.','પટ્ટાવાળો ગ્રાહક ગલી પાર કરે છે.','Behind the sleeping dog, beneath the pinwheel boy.','સૂતા કૂતરાની પાછળ પવનચક્કીવાળા છોકરાની નીચે છે.'],
    [3,'Painted elephant','રંગેલો હાથી',1108,763,131,114,'Green and red decorate a little elephant.','નાના હાથી પર લીલો અને લાલ રંગ છે.','On the right display beside the brass tea vessel.','જમણા પ્રદર્શનમાં પિત્તળના ચાના વાસણ પાસે છે.'],
    [3,'Wooden comb','લાકડાનો કાંસકો',915,844,163,51,'A row of teeth will never bite.','દાંતની આ હાર ક્યારેય કરડશે નહીં.','On the foreground cloth, below the white shell.','આગળના કાપડ પર સફેદ શંખની નીચે છે.'],
    [3,'White conch','સફેદ શંખ',906,791,105,54,'A pale spiral rests among the crafts.','હસ્તકલા વચ્ચે આછો વળાંકવાળો શંખ છે.','Just above the wooden comb on the right table.','જમણા મેજ પર લાકડાના કાંસકાની બરાબર ઉપર છે.'],
    [4,'Walking white-pawed cat','સફેદ પંજાવાળી બિલાડી',1424,552,102,136,'Four white paws pass the dye vats.','ચાર સફેદ પંજા રંગનાં કુંડ પાસેથી પસાર થાય છે.','At the far-right edge beside the blue dye.','દૂર જમણી ધાર પર વાદળી રંગ પાસે છે.'],
    [4,'Dog under the table','મેજ નીચેનો કૂતરો',503,810,175,116,'A quiet sleeper has found some shade.','શાંત ઊંઘનારને છાંયો મળ્યો છે.','Under the front work table on the left.','ડાબે આગળના કામના મેજની નીચે છે.'],
    [4,'Coiled rope','વીંટાળેલું દોરડું',1297,912,88,73,'A spiral of rough fibre waits for work.','ખરબચડા રેસાનો ગોળો કામની રાહ જુએ છે.','On the front-right table beside the printing block.','આગળ જમણા મેજ પર છાપવાના બીબા પાસે છે.'],
  ],
  kutch: [
    [1,'Black goat','કાળી બકરી',432,523,55,60,'A dark goat walks between the crafts.','હસ્તકલા વચ્ચે કાળી બકરી ચાલે છે.','Near the children, left of the pottery display.','બાળકો પાસે માટલાંના પ્રદર્શનની ડાબે છે.'],
    [1,'White goat','સફેદ બકરી',932,731,65,63,'A pale visitor stands in the open lane.','ખુલ્લી ગલીમાં સફેદ મહેમાન ઊભું છે.','Beside the child in green near the lower right.','નીચે જમણે લીલાં કપડાંવાળા બાળક પાસે છે.'],
    [1,'Purple turban','જાંબલી પાઘડી',218,748,42,30,'A piece of headwear has been set down.','માથાનું વસ્ત્ર નીચે મૂકેલું છે.','On top of the decorated cart at the lower left.','નીચે ડાબે શણગારેલી ગાડીની છત પર છે.'],
    [2,'Brass camel','પિત્તળનો ઊંટ',696,735,108,164,'A little golden traveller stands still.','નાનો સોનેરી પ્રવાસી ઊભો છે.','In the foreground aisle, between the pottery and toy horse.','આગળની ગલીમાં માટલાં અને રમકડાના ઘોડા વચ્ચે છે.'],
    [2,'Sitting cat','બેઠેલી બિલાડી',280,809,106,111,'A furry shopper rests beside the chest.','પેટી પાસે રુંવાટીદાર ગ્રાહક આરામ કરે છે.','At the bottom left, beside the sleeping dog.','નીચે ડાબે સૂતા કૂતરા પાસે છે.'],
    [2,'Ferris wheel','ચકડોળ',1150,15,109,164,'A big circle rises above the tents.','તંબુઓ ઉપર મોટું ચક્ર ઊભું છે.','On the distant skyline at the upper right.','ઉપર જમણે દૂરના આકાશમાં છે.'],
    [3,'Carved owl','કોતરેલું ઘુવડ',1017,613,65,116,'Two round eyes in carved wood.','કોતરેલા લાકડામાં બે ગોળ આંખો છે.','To the right of the colourful pottery display.','રંગીન માટલાંના પ્રદર્શનની જમણે છે.'],
    [3,'Wooden elephant','લાકડાનો હાથી',482,722,145,96,'A pale elephant lifts its trunk.','આછા રંગનો હાથી સૂંઢ ઊંચી કરે છે.','On the front craft table, below the carved sun panel.','આગળના મેજ પર કોતરેલા સૂર્યના પાટિયાની નીચે છે.'],
    [3,'Hand mirror','હાથનો અરીસો',847,875,169,88,'A little oval reflects the sky.','નાનો લંબગોળ અરીસો આકાશ બતાવે છે.','At the front edge of the white-covered table.','સફેદ કાપડવાળા મેજની આગળની ધાર પર છે.'],
    [4,'Wheeled camel','પૈડાંવાળો ઊંટ',460,849,174,157,'This camel travels on wooden wheels.','આ ઊંટ લાકડાનાં પૈડાં પર ચાલે છે.','On the ground beside the front woven stool.','આગળના વણેલા સ્ટૂલ પાસે જમીન પર છે.'],
    [4,'Four-colour kite','ચાર રંગનો પતંગ',1207,848,229,176,'A bright diamond waits for the wind.','તેજ રંગનો પતંગ પવનની રાહ જુએ છે.','Leaning against the front-right craft table.','આગળ જમણા હસ્તકલાના મેજને અડેલો છે.'],
    [4,'Glowing lantern','પ્રકાશતું ફાનસ',936,591,73,180,'A warm light sits beneath an arched handle.','કમાનવાળા હાથાની નીચે ગરમ પ્રકાશ છે.','On the front-right table, beside a round brass cup.','આગળ જમણા મેજ પર ગોળ પિત્તળના પ્યાલા પાસે છે.'],
  ],
  junagadh: [
    [1,'Wall monkey','દીવાલ પરનો વાંદરો',138,35,73,137,'A long-tailed lookout guards the gateway.','લાંબી પૂંછડીવાળો દર્શક દરવાજો જુએ છે.','At the upper-left corner on the old wall.','ઉપર ડાબા ખૂણે જૂની દીવાલ પર છે.'],
    [1,'Bicycle','સાઇકલ',706,568,53,125,'Two wheels squeeze through the market.','બે પૈડાં બજારમાંથી પસાર થાય છે.','Near the centre, just left of the white cow.','મધ્યમાં સફેદ ગાયની ડાબે છે.'],
    [1,'White cow','સફેદ ગાય',786,495,138,132,'A large pale shopper blocks the lane.','મોટું સફેદ પ્રાણી ગલીમાં ઊભું છે.','In the centre-right, beneath the brassware stall.','મધ્યથી જમણે પિત્તળની દુકાનની નીચે છે.'],
    [2,'Brass elephant','પિત્તળનો હાથી',70,781,142,105,'A little golden giant beside the textiles.','કાપડ પાસે નાનો સોનેરી હાથી છે.','On the lower-left stall, above the toy display.','નીચે ડાબી દુકાનમાં રમકડાંની ઉપર છે.'],
    [2,'Resting dog','આરામ કરતો કૂતરો',554,791,144,106,'A patient friend rests at the market edge.','બજારની ધાર પર ધીરજવાળો મિત્ર આરામ કરે છે.','Beside the girl in yellow and the basket of chillies.','પીળાં કપડાંવાળી બાળકી અને મરચાંના ટોપલા પાસે છે.'],
    [2,'Seated saffron sage','બેઠેલા ભગવા સાધુ',1255,372,56,82,'A quiet figure sits away from the bustle.','ભીડથી દૂર શાંત વ્યક્તિ બેઠી છે.','Inside the stone pavilion on the right.','જમણી બાજુ પથ્થરના મંડપની અંદર છે.'],
    [3,'Brass sun face','પિત્તળનો સૂર્યમુખ',241,245,79,90,'A smiling metal sun shines without fire.','હસતો ધાતુનો સૂર્ય અગ્નિ વિના ચમકે છે.','Hanging among the bells in the upper-left stall.','ઉપર ડાબી દુકાનમાં ઘંટડીઓ વચ્ચે લટકે છે.'],
    [3,'Wheeled toy horse','પૈડાંવાળો રમકડાનો ઘોડો',395,738,177,198,'A painted horse is ready to roll.','રંગેલો ઘોડો પૈડાં પર ચાલવા તૈયાર છે.','At the front-left stall beside the wicker basket.','આગળ ડાબી દુકાનમાં ટોપલા પાસે છે.'],
    [3,'Mango monkey','કેરીવાળો વાંદરો',168,3,158,150,'A rooftop visitor has found a yellow snack.','છતના મહેમાનને પીળો નાસ્તો મળ્યો છે.','At the top left, holding fruit above the awning.','ઉપર ડાબે છાજલીની ઉપર ફળ પકડીને બેઠો છે.'],
    [4,'Striped spinning top','પટ્ટાવાળો ભમરડો',812,822,60,78,'A colourful toy balances on a tiny point.','રંગીન રમકડું નાની અણી પર ઊભું છે.','On the ground near the foreground wooden toys.','આગળનાં લાકડાનાં રમકડાં પાસે જમીન પર છે.'],
    [4,'Clay owl','માટીનું ઘુવડ',333,805,69,131,'Big eyes, but no feathers.','મોટી આંખો છે પણ પાંખો નથી.','Among the terracotta animals at the lower left.','નીચે ડાબે માટીનાં પ્રાણીઓ વચ્ચે છે.'],
    [4,'Carved horse','કોતરેલો ઘોડો',1218,731,221,222,'This proud horse is made of wood.','આ ગર્વીલો ઘોડો લાકડાનો છે.','At the front of the right-hand carving stall.','જમણી કોતરકામની દુકાનની આગળ છે.'],
  ],
  surat: [
    [1,'Green turban','લીલી પાઘડી',392,568,40,27,'A green wrap stands out in the food crowd.','ખાણીપીણીની ભીડમાં લીલું માથાનું વસ્ત્ર દેખાય છે.','The vegetable seller near the left foreground wears it.','ડાબે આગળ શાકભાજી વેચનારના માથા પર છે.'],
    [1,'Red stool','લાલ સ્ટૂલ',407,494,56,65,'A little red seat beside a busy table.','વ્યસ્ત મેજ પાસે નાની લાલ બેઠક છે.','Under the diner in turquoise near the left centre.','ડાબે મધ્યમાં આસમાની કપડાંવાળા જમનારની નીચે છે.'],
    [1,'Green-fruit basket','લીલાં ફળનો ટોપલો',462,732,79,53,'Small green fruit fills a round basket.','ગોળ ટોપલામાં નાનાં લીલાં ફળ ભર્યાં છે.','A carrier balances it on their head near the lower left.','નીચે ડાબે એક વ્યક્તિ તેને માથા પર લઈને જાય છે.'],
    [3,'Toy sailboat','રમકડાની સઢવાળી હોડી',1138,505,129,112,'A tiny boat sails on a counter, not the river.','નાની હોડી નદીમાં નહીં પણ મેજ પર છે.','On the metal vessel beside the sugarcane juice glasses.','શેરડીના રસના ગ્લાસ પાસે ધાતુના વાસણ પર છે.'],
    [3,'Acoustic guitar','ગિટાર',1107,302,61,188,'Strings wait for music beside the snacks.','નાસ્તા પાસે તાર સંગીતની રાહ જુએ છે.','Leaning near the juice machine behind the sleeping cat.','રસના મશીન પાસે સૂતી બિલાડીની પાછળ અડેલી છે.'],
    [3,'Parked bicycle','ઊભી સાઇકલ',886,302,146,169,'A two-wheeled visitor waits by the river.','નદી પાસે બે પૈડાંવાળો મહેમાન રાહ જુએ છે.','Against the riverside railing behind the dog.','કૂતરાની પાછળ નદીની રેલિંગને અડેલી છે.'],
    [4,'Ground pigeon','જમીન પરનું કબૂતર',750,810,146,95,'A grey customer searches for crumbs.','રાખોડી ગ્રાહક ખાવાના ભૂકા શોધે છે.','In the front aisle, below the drinking cat.','આગળની ગલીમાં પીતી બિલાડીની નીચે છે.'],
    [4,'Drinking cat','પીતી બિલાડી',822,711,215,109,'A striped visitor has its own little bowl.','પટ્ટાવાળા મહેમાન પાસે પોતાનું નાનું વાટકું છે.','On the ground beside the vegetable cart wheel.','શાકભાજીની લારીના પૈડા પાસે જમીન પર છે.'],
    [4,'Brass teapot','પિત્તળની કીટલી',1357,437,127,134,'A golden spout waits at the tea stall.','ચાની દુકાનમાં સોનેરી નાળચું રાહ જુએ છે.','On the right-hand counter next to the clay cups.','જમણા મેજ પર માટીના પ્યાલા પાસે છે.'],
    [5,'Wooden elephant','લાકડાનો હાથી',750,814,141,88,'A little elephant explores the toy lane.','નાનો હાથી રમકડાંની ગલીમાં છે.','On the ground in front of the toy cart.','રમકડાંની લારીની આગળ જમીન પર છે.'],
    [5,'Rainbow stacking toy','રંગીન ગોઠવણીનું રમકડું',680,774,42,54,'A stack of colours balances on a stool.','રંગોની હાર સ્ટૂલ પર ઊભી છે.','On the small stool beside the wheeled toys.','પૈડાંવાળાં રમકડાં પાસે નાના સ્ટૂલ પર છે.'],
    [5,'Little bell stand','નાનું ઘંટસ્ટેન્ડ',674,660,82,75,'Small brass bells hang above the toys.','રમકડાં ઉપર નાના પિત્તળના ઘંટ લટકે છે.','Behind the toy vehicles, just right of the pinwheels.','રમકડાંનાં વાહનોની પાછળ પવનચક્કીઓની જમણે છે.'],
  ],
  patan: [
    [1,'Spinning wheel','ચરખો',397,685,99,112,'A wooden wheel helps make thread.','લાકડાનું ચક્ર દોરો બનાવવામાં મદદ કરે છે.','In the lower-left weaving courtyard.','નીચે ડાબે વણાટના આંગણામાં છે.'],
    [1,'White goose','સફેદ હંસ',1234,294,29,23,'A little white swimmer crosses the water.','નાનું સફેદ પક્ષી પાણીમાં તરે છે.','In the pool near the right-hand steps.','જમણી બાજુનાં પગથિયાં પાસેના કુંડમાં છે.'],
    [1,'Courtyard dog','આંગણાનો કૂતરો',623,806,64,48,'A brown visitor walks between the yarn.','ભૂરો મહેમાન દોરા વચ્ચે ચાલે છે.','Near the bottom centre, above the red tiled roof.','નીચે મધ્યમાં લાલ નળિયાંવાળી છતની ઉપર છે.'],
    [2,'Yarn ball','દોરાનો દડો',520,868,40,40,'A multicoloured ball invites a cat to play.','રંગીન દડો બિલાડીને રમવા બોલાવે છે.','At the orange cat’s paws in the foreground.','આગળ નારંગી બિલાડીના પંજા પાસે છે.'],
    [2,'Wooden elephant cart','લાકડાની હાથીગાડી',660,858,140,77,'A child has a little wheeled elephant.','બાળક પાસે પૈડાંવાળો નાનો હાથી છે.','In the seated boy’s hands near the bottom centre.','નીચે મધ્યમાં બેઠેલા છોકરાના હાથ પાસે છે.'],
    [2,'Hanging lantern','લટકતું ફાનસ',619,24,47,99,'A dark metal lamp hangs in daylight.','દિવસના પ્રકાશમાં કાળું ધાતુનું ફાનસ લટકે છે.','At the top, beside the carved wooden pillar.','ઉપર કોતરેલા લાકડાના થાંભલા પાસે છે.'],
    [3,'Little tortoise','નાનો કાચબો',959,815,93,63,'A slow visitor carries its home.','ધીમો મહેમાન પોતાનું ઘર સાથે લઈને ફરે છે.','On the path beside the toy car.','રમકડાની ગાડી પાસે રસ્તા પર છે.'],
    [3,'Tailor’s scissors','દરજીની કાતર',302,848,86,30,'Two metal loops lie ready for cutting.','કાપવા માટે બે ધાતુનાં વળાંકો તૈયાર છે.','On the front-left table, beside the comb.','આગળ ડાબા મેજ પર કાંસકા પાસે છે.'],
    [3,'Painted toy car','રંગેલી રમકડાની ગાડી',882,754,108,80,'A bright little car waits in the lane.','તેજ રંગની નાની ગાડી ગલીમાં છે.','On the ground just left of the tortoise.','કાચબાની ડાબે જમીન પર છે.'],
    [4,'Wooden ram','લાકડાનો ઘેટો',970,848,90,132,'A carved animal with curled horns stands by a flower bowl.','ફૂલના વાટકા પાસે વળેલા શિંગડાવાળું કોતરેલું પ્રાણી છે.','On the foreground stool beside the yellow flower.','આગળના સ્ટૂલ પર પીળા ફૂલ પાસે છે.'],
    [4,'Small iron','નાની ઇસ્ત્રી',1333,507,38,47,'A tiny tool waits to smooth cloth.','કાપડ સરખું કરવા નાનું સાધન તૈયાર છે.','On the decorated box behind the boy in blue.','વાદળી કપડાંવાળા છોકરાની પાછળ શણગારેલી પેટી પર છે.'],
    [4,'Playful tabby','રમતી પટ્ટાવાળી બિલાડી',1276,636,135,112,'A striped friend reaches for a red tassel.','પટ્ટાવાળો મિત્ર લાલ ઝુમખું પકડે છે.','Beside the crouching boy at the right.','જમણે વાંકા બેઠેલા છોકરા પાસે છે.'],
    [3,'Balcony cat','બાલ્કનીની બિલાડી',799,34,65,69,'A ginger lookout stands above the looms.','નારંગી દર્શક સાળોની ઉપર ઊભો છે.','High near the centre, above the pink flowers.','ઉપર મધ્ય પાસે ગુલાબી ફૂલોની ઉપર છે.'],
    [4,'Resting ginger cat','આરામ કરતી નારંગી બિલાડી',58,826,249,165,'A sleepy friend rests beside the weaver.','વણકર પાસે ઊંઘાળુ મિત્ર આરામ કરે છે.','On the rug at the bottom left.','નીચે ડાબે પાથરણા પર છે.'],
  ],
  garba: [
    [1,'Pink lotus','ગુલાબી કમળ',1414,807,56,39,'A bright flower floats among the lamps.','દીવાઓ વચ્ચે તેજ રંગનું ફૂલ તરે છે.','In the round pool at the lower right of the illustrated square.','ચિત્રિત ચોકમાં નીચે જમણે ગોળ કુંડમાં છે.'],
    [1,'Stage speaker','મંચનું સ્પીકર',940,94,40,63,'The music travels through a tall dark box.','ઊંચા કાળા ડબ્બામાંથી સંગીત આવે છે.','At the right edge of the raised musicians’ stage.','સંગીતકારોના ઊંચા મંચની જમણી ધાર પર છે.'],
    [1,'Blue-coated dancer','વાદળી કોટવાળો નૃત્યકાર',542,635,67,130,'A dancer in blue faces the centre.','વાદળી કપડાંવાળો નૃત્યકાર મધ્ય તરફ જુએ છે.','In the lower-left dance circle, wearing white trousers.','નીચે ડાબા નૃત્યવર્તુળમાં સફેદ પાયજામો પહેરેલો છે.'],
    [3,'Tree owl','ઝાડનું ઘુવડ',98,37,52,72,'A quiet night watcher perches above the festival.','શાંત રાતનો દર્શક ઉત્સવની ઉપર બેઠો છે.','On the large branch at the upper left.','ઉપર ડાબે મોટી ડાળી પર છે.'],
    [3,'Colourful ball','રંગીન દડો',691,949,43,42,'A little round toy waits near the lantern.','ફાનસ પાસે નાનું ગોળ રમકડું છે.','On the ground at the bottom, beside the small lit lamp.','નીચે જમીન પર નાના પ્રગટેલા દીવા પાસે છે.'],
    [3,'Green parrot','લીલો પોપટ',1404,72,79,106,'A green spectator sits above the food stalls.','લીલો દર્શક ખાણીપીણીની દુકાનો ઉપર બેઠો છે.','On the upper-right wooden perch.','ઉપર જમણે લાકડાની બેઠક પર છે.'],
    [4,'Pond tortoise','કુંડનો કાચબો',891,899,92,58,'A slow visitor watches the floating lights.','ધીમો મહેમાન તરતા દીવાઓ જુએ છે.','On the near-left rim of the lotus pool.','કમળના કુંડની નજીકની ડાબી ધાર પર છે.'],
    [4,'Embroidered ball','ભરતકામવાળો દડો',558,827,90,83,'A kitten has found a richly patterned toy.','બિલાડીના બચ્ચાને નકશીવાળું રમકડું મળ્યું છે.','By the kitten’s paws in the foreground.','આગળ બિલાડીના બચ્ચાના પંજા પાસે છે.'],
    [4,'Small stone elephant','નાનો પથ્થરનો હાથી',1436,507,94,84,'A tiny grey guardian among the crafts.','હસ્તકલા વચ્ચે નાનો રાખોડી રક્ષક છે.','On the far-right display above the peacock fountain.','દૂર જમણે મોરના ફુવારાની ઉપર પ્રદર્શનમાં છે.'],
    [5,'Black toy elephant','કાળો રમકડાનો હાથી',493,753,137,112,'A dark elephant wears a colourful blanket.','કાળો હાથી રંગીન ઓઢણું પહેરે છે.','At the front-left toy stall, beside the little carts.','આગળ ડાબી રમકડાંની દુકાનમાં નાની ગાડીઓ પાસે છે.'],
    [5,'Red toy cart','લાલ રમકડાની ગાડી',156,836,174,108,'Bright wheels carry a tiny wooden cart.','તેજ રંગનાં પૈડાં નાની લાકડાની ગાડી ચલાવે છે.','At the front edge of the left craft display.','ડાબા હસ્તકલાના પ્રદર્શનની આગળની ધાર પર છે.'],
    [5,'Stone elephant statue','પથ્થરના હાથીની પ્રતિમા',1205,496,130,124,'A carved elephant stands by the lake.','તળાવ પાસે કોતરેલો હાથી ઊભો છે.','On a stone pedestal behind the tea stall.','ચાની દુકાનની પાછળ પથ્થરની બેઠક પર છે.'],
    [4,'Open pool lotus','ખીલેલું કુંડનું કમળ',1144,834,84,47,'Pink petals open between the floating lamps.','તરતા દીવાઓ વચ્ચે ગુલાબી પાંખડીઓ ખીલે છે.','Near the centre of the foreground pool.','આગળના કુંડના મધ્ય પાસે છે.'],
    [5,'Hanging brass bell','લટકતો પિત્તળનો ઘંટ',330,130,55,84,'A golden bell hangs above the musicians.','સંગીતકારોની ઉપર સોનેરી ઘંટ લટકે છે.','Beneath the left tree, beside the patterned lantern.','ડાબા ઝાડ નીચે નકશીવાળા ફાનસ પાસે છે.'],
  ],
};

const rect = (x, y, width, height) => ({x, y, width, height});
function makeCalibratedTarget(sceneId, row, index) {
  const [panel, en, gu, lx, ly, width, height, en1, gu1, en2, gu2] = row;
  const slot = panelSelection[sceneId].indexOf(panel);
  if (slot < 0) throw new Error(`Unselected panel ${sceneId}-${panel}`);
  const x = lx, y = ly, cx = x + width / 2, cy = y + height / 2;
  // A 24px context frame is clamped to this panel so thumbnails never show
  // unrelated neighbouring panels or the outer decorative frame.
  const cropX = Math.max(0, x - 24), cropY = Math.max(0, y - 24);
  const cropRight = Math.min(1536, x + width + 24);
  const cropBottom = Math.min(1024, y + height + 24);
  return {
    id: `${sceneId}-${index + 1}`,
    districtId: `${sceneId}-district-${slot + 1}`,
    levelOrder: index,
    name: {en, gu},
    sourcePanel: `docs/qa/panels/${sceneId}-${panel}.png`,
    sourceBounds: rect(lx, ly, width, height),
    visualBounds: rect(x, y, width, height),
    hitPolygon: [[x,y],[x+width,y],[x+width,y+height],[x,y+height]],
    thumbnailCrop: rect(cropX, cropY, cropRight-cropX, cropBottom-cropY),
    clues: {en: [en1, en2], gu: [gu1, gu2]},
    hintRegion: rect(Math.max(0, Math.min(936,cx-300)), Math.max(0, Math.min(524,cy-250)),600,500),
  };
}
export const calibratedTargets = {...Object.fromEntries(Object.entries(calibrationRows).map(([id, rows]) => [id, rows.map((row, index) => makeCalibratedTarget(id, row, index))])), navratri: navratriTargets, ahmedabad: ahmedabadTargets, jamnagar: jamnagarTargets, kutch: kutchTargets};
