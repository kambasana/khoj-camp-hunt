(() => {
"use strict";
const $ = id => document.getElementById(id);
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const pick = (rng, a) => a[(rng() * a.length) | 0];
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const SETTINGS = JSON.parse(localStorage.getItem("khoj-set") || "{}");
const saveSet = () => localStorage.setItem("khoj-set", JSON.stringify(SETTINGS));
SETTINGS.hints = SETTINGS.hints !== false;
SETTINGS.sfx = SETTINGS.sfx !== false;
SETTINGS.lang = SETTINGS.lang || "both";
SETTINGS.done = SETTINGS.done || [];
const L = {
  en:{found:(a,b)=>a+" of "+b+" found",locked:"Hints locked",cleared:"Scene cleared",wave:n=>"Wave "+n+" cleared",next:"Next place",more:"Next wave",miss:"Not that — keep looking",already:"Already found"},
  gu:{found:(a,b)=>b+"માંથી "+a+" મળ્યા",locked:"ઈશારા બંધ",cleared:"દ્રશ્ય પૂરું",wave:n=>"લહેર "+n+" પૂરી",next:"આગળનું સ્થળ",more:"આગળની લહેર",miss:"આ નહીં — શોધતા રહો",already:"પહેલેથી મળ્યા"}
};
const LEVELS = [
  {id:"amd-terrace",en:"Ahmedabad kite terrace",gu:"અમદાવાદ પતંગ છત",src:"ahmedabad-district-1.webp",targets:[{en:"cat on the jharokha",gu:"ઝરૂખા પર બિલાડી",x:.00,y:.12,w:.12,h:.18},{en:"brass telescope",gu:"પિત્તળનું દૂરબીન",x:.18,y:.22,w:.16,h:.34},{en:"boy flying a kite",gu:"પતંગ ઉડાડતો છોકરો",x:.38,y:.22,w:.14,h:.36},{en:"man with the pink firki",gu:"ગુલાબી ફિરકીવાળો પુરુષ",x:.48,y:.16,w:.13,h:.38},{en:"grandmother's purple kite",gu:"દાદીનો જાંબલી પતંગ",x:.58,y:.38,w:.16,h:.20},{en:"blue shoulder bag",gu:"વાદળી થેલી",x:.78,y:.68,w:.16,h:.22}]},
  {id:"amd-pond",en:"Pol rooftop pond",gu:"પોળની છતનો તળાવ",src:"ahmedabad-district-2.webp",targets:[{en:"purple pigeon",gu:"જાંબલી કબૂતર",x:.04,y:.28,w:.16,h:.20},{en:"dog on the durrie",gu:"દરી પર કૂતરો",x:.18,y:.52,w:.28,h:.22},{en:"lotus pond",gu:"કમળનું તળાવ",x:.48,y:.58,w:.42,h:.30},{en:"woman with bougainvillea",gu:"બોગનવેલિયા વાળી સ્ત્રી",x:.72,y:.28,w:.20,h:.30},{en:"grandfather with chai",gu:"ચા સાથે દાદા",x:.08,y:.16,w:.14,h:.18}]},
  {id:"amd-workshop",en:"Patang workshop",gu:"પતંગની કારખાની",src:"ahmedabad-district-3.webp",targets:[{en:"blue kite on the table",gu:"ટેબલ પર વાદળી પતંગ",x:.08,y:.52,w:.28,h:.16},{en:"white kite in her hands",gu:"હાથમાં સફેદ પતંગ",x:.38,y:.28,w:.18,h:.28},{en:"orange kite",gu:"નારંગી પતંગ",x:.30,y:.62,w:.28,h:.22},{en:"yellow firki of manjha",gu:"માંજાની ફિરકી",x:.58,y:.64,w:.22,h:.16},{en:"purple bucket",gu:"જાંબલી ડોલ",x:.84,y:.48,w:.12,h:.16},{en:"pair of scissors",gu:"કાતર",x:.72,y:.78,w:.16,h:.10}]},
  {id:"amd-sunset",en:"Sunset chai terrace",gu:"સાંજની ચાની છત",src:"ahmedabad-district-4.webp",targets:[{en:"blue watering can",gu:"વાદળી હંડો",x:.04,y:.72,w:.12,h:.18},{en:"pink kite on the stone",gu:"પથ્થર પર ગુલાબી પતંગ",x:.42,y:.72,w:.22,h:.18},{en:"green tiffin dabba",gu:"લીલું ડબ્બું",x:.78,y:.70,w:.10,h:.18},{en:"man making an orange kite",gu:"નારંગી પતંગ બનાવતો પુરુષ",x:.58,y:.38,w:.22,h:.32},{en:"blue-and-white teapot",gu:"નીલી-સફેદ કીટલી",x:.30,y:.54,w:.10,h:.12}]},
  {id:"jam-bandhani",en:"Bandhani courtyard",gu:"બાંધણી આંગણું",src:"jamnagar-district-1.webp",targets:[{en:"peacock on the parapet",gu:"કાંગરે મોર",x:.62,y:.02,w:.28,h:.20},{en:"black cat sleeping",gu:"સૂતેલી કાળી બિલાડી",x:.72,y:.22,w:.14,h:.10},{en:"treadle sewing machine",gu:"સિલાઈ મશીન",x:.48,y:.42,w:.22,h:.22},{en:"man holding red bandhani",gu:"લાલ બાંધણી પકડેલો પુરુષ",x:.42,y:.18,w:.16,h:.36},{en:"basket of tied knots",gu:"બાંધેલી ગાંઠોની ટોપલી",x:.00,y:.72,w:.18,h:.18}]},
  {id:"jam-well",en:"Haveli well yard",gu:"હવેલીનો કૂવો",src:"jamnagar-district-2.webp",targets:[{en:"sleeping dog",gu:"સૂતેલો કૂતરો",x:.02,y:.62,w:.24,h:.20},{en:"woman with the tin bucket",gu:"ડોલવાળી સ્ત્રી",x:.38,y:.40,w:.16,h:.40},{en:"camel with embroidered saddle",gu:"ભરતગૂંથણીવાળી ઊંટ",x:.58,y:.32,w:.28,h:.28},{en:"cart of bandhani bundles",gu:"બાંધણીની ગાડી",x:.02,y:.22,w:.22,h:.28},{en:"stone trough",gu:"પથ્થરની તલાવડી",x:.42,y:.52,w:.22,h:.18}]},
  {id:"jam-dye",en:"Indigo dye yard",gu:"ઈન્ડિગો રંગાઈ",src:"jamnagar-district-3.webp",targets:[{en:"magenta dye vat",gu:"મેજેન્ટા રંગનો કુંડ",x:.04,y:.50,w:.28,h:.28},{en:"indigo dye vat",gu:"ઈન્ડિગોનો કુંડ",x:.42,y:.50,w:.28,h:.26},{en:"basket of white bandhani balls",gu:"સફેદ ગોળાની ટોપલી",x:.62,y:.62,w:.28,h:.28},{en:"woman hanging indigo cloth",gu:"ઈન્ડિગો અટકાવતી સ્ત્રી",x:.68,y:.18,w:.22,h:.42},{en:"folded bandhani stack",gu:"વહેંચેલી બાંધણી",x:.00,y:.72,w:.22,h:.18}]},
  {id:"jam-bazaar",en:"Lakhota evening bazaar",gu:"લખોટા સાંજબજાર",src:"jamnagar-district-4.webp",targets:[{en:"silver tea samovar",gu:"ચાનું સમોવાર",x:.02,y:.42,w:.18,h:.32},{en:"rack of glass bangles",gu:"કાંચની ચૂડીઓ",x:.78,y:.38,w:.20,h:.42},{en:"Lakhota palace on the lake",gu:"તળાવ પર લખોટા",x:.58,y:.18,w:.22,h:.18},{en:"woman in blue bandhani",gu:"વાદળી બાંધણીવાળી સ્ત્રી",x:.38,y:.38,w:.16,h:.42},{en:"stack of printed odhnis",gu:"છાપેલી ઓઢણી",x:.48,y:.58,w:.28,h:.22}]},
  {id:"kutch-goats",en:"Bhunga goat yard",gu:"ભુંગાનું વાડું",src:"kutch-district-1.webp",targets:[{en:"white goat with a bell",gu:"ઘંટડીવાળી ધોળી બકરી",x:.04,y:.28,w:.18,h:.38},{en:"black goat",gu:"કાળી બકરી",x:.44,y:.28,w:.18,h:.38},{en:"brown goat",gu:"કથ્થૈ બકરી",x:.64,y:.32,w:.22,h:.36},{en:"blue carved door",gu:"વાદળી નકશીદાર બારણું",x:.12,y:.12,w:.14,h:.32},{en:"white temple on the rise",gu:"ટેકરી પર મંદિર",x:.48,y:.16,w:.10,h:.12}]},
  {id:"kutch-potter",en:"Rann potter's yard",gu:"રણનો કુંભાર",src:"kutch-district-2.webp",targets:[{en:"potter at the wheel",gu:"ચાકડા પર કુંભાર",x:.04,y:.28,w:.22,h:.42},{en:"painted dhol",gu:"ચિતરેલો ઢોલ",x:.46,y:.42,w:.16,h:.28},{en:"camel in embroidered saddle",gu:"ભરતગૂંથણીવાળી ઊંટ",x:.62,y:.32,w:.32,h:.32},{en:"mud on the board",gu:"પાટિયે માટી",x:.00,y:.78,w:.18,h:.12},{en:"white bhungas on the rann",gu:"રણ પર ભુંગા",x:.52,y:.18,w:.16,h:.10}]},
  {id:"kutch-toys",en:"Folk toy courtyard",gu:"લોકખેલણાંનું આંગણું",src:"kutch-district-3.webp",targets:[{en:"man with the tanpura",gu:"તાનપુરા વગાડનાર",x:.02,y:.18,w:.28,h:.52},{en:"painted wooden elephant",gu:"લાકડાની હાથી",x:.38,y:.50,w:.24,h:.28},{en:"boy on the rocking horse",gu:"ઘોડા પર છોકરો",x:.62,y:.28,w:.28,h:.48},{en:"dhol on the rug",gu:"દરી પર ઢોલ",x:.00,y:.58,w:.12,h:.18},{en:"blue carved door",gu:"વાદળી બારણું",x:.58,y:.18,w:.14,h:.28}]},
  {id:"kutch-loom",en:"Weaver's shade",gu:"વણકરની છાયા",src:"kutch-district-4.webp",targets:[{en:"tassel umbrella",gu:"ફુંદાની છત્રી",x:.02,y:.02,w:.28,h:.38},{en:"woman at the loom",gu:"માઘ પર વણનારી",x:.62,y:.22,w:.28,h:.42},{en:"pair of carved chairs",gu:"નકશીદાર ખુરશીઓ",x:.18,y:.50,w:.36,h:.32},{en:"white cow in the gateway",gu:"બારણે ધોળી ગાય",x:.38,y:.38,w:.10,h:.14},{en:"basket of wool",gu:"ઊનની ટોપલી",x:.82,y:.62,w:.14,h:.22}]},
  {id:"nav-rangoli",en:"Navratri haveli night",gu:"નવરાત્રી હવેલી રાત",src:"navratri-district-1.webp",targets:[{en:"woman hanging marigold",gu:"ગલગોટા લટકાવતી સ્ત્રી",x:.02,y:.22,w:.16,h:.42},{en:"rangoli of diyas",gu:"દીવાની રંગોળી",x:.28,y:.60,w:.28,h:.22},{en:"goat by the pots",gu:"કોઠાઓ પાસે બકરી",x:.78,y:.58,w:.16,h:.24},{en:"cat on the tiled roof",gu:"નળિયાં પર બિલાડી",x:.78,y:.04,w:.12,h:.10},{en:"man in cream kediyu",gu:"ક્રીમ કેડિયું પહેરેલો",x:.46,y:.26,w:.12,h:.32}]},
  {id:"nav-bazaar",en:"Garba night bazaar",gu:"ગરબા રાતનું બજાર",src:"navratri-district-2.webp",targets:[{en:"street dog mid-stride",gu:"ચાલતો શેરીનો કૂતરો",x:.32,y:.54,w:.32,h:.22},{en:"tabby by the flower baskets",gu:"ફૂલો પાસે બિલાડી",x:.12,y:.70,w:.14,h:.18},{en:"mojari cobbler",gu:"મોજરીનો મોચી",x:.70,y:.42,w:.20,h:.32},{en:"woman stringing a garland",gu:"માળા પરોવતી સ્ત્રી",x:.00,y:.22,w:.20,h:.40},{en:"boy in embroidered kediyu",gu:"ભરતગૂંથણીવાળો છોકરો",x:.58,y:.28,w:.12,h:.36}]},
  {id:"nav-balcony",en:"Garba terrace dusk",gu:"ગરબા છતની સાંજ",src:"navratri-district-3.webp",targets:[{en:"man in a green paghdi",gu:"લીલી પાઘડીવાળો",x:.22,y:.28,w:.16,h:.28},{en:"basket of dandiya sticks",gu:"દાંડિયાની ટોપલી",x:.38,y:.52,w:.16,h:.18},{en:"red-and-green kite",gu:"લાલ-લીલો પતંગ",x:.38,y:.72,w:.22,h:.16},{en:"blue kite on the balcony",gu:"ઓટલે વાદળી પતંગ",x:.62,y:.38,w:.12,h:.22},{en:"brass lantern on the rug",gu:"દરી પર પિત્તળની લાલટેન",x:.58,y:.62,w:.08,h:.16}]},
  {id:"nav-mandap",en:"Mandap toy courtyard",gu:"મંડપ અને ખેલણાં",src:"navratri-district-4.webp",targets:[{en:"painted wooden horse",gu:"લાકડાનો ઘોડો",x:.12,y:.48,w:.22,h:.24},{en:"flower-wagon caterpillar",gu:"ફૂલોની ઈયળ",x:.48,y:.64,w:.24,h:.16},{en:"man hanging mandap garlands",gu:"મંડપે માળા લટકાવતો",x:.62,y:.22,w:.16,h:.38},{en:"girl with a flower bowl",gu:"ફૂલની તપેલીવાળી છોકરી",x:.48,y:.32,w:.12,h:.30},{en:"wooden doll on the chest",gu:"સંદૂક પર ગોરી",x:.78,y:.52,w:.10,h:.18}]},
  {id:"surat-food",en:"Surat evening food lane",gu:"સુરતની ખાણીપીણી ગલી",src:"surat-district-1.webp",targets:[{en:"calico cat under the tava",gu:"તવા નીચે બિલાડી",x:.08,y:.78,w:.14,h:.16},{en:"mound of jalebi",gu:"જલેબીનો ઢગલો",x:.52,y:.72,w:.22,h:.20},{en:"street dog at the drain",gu:"નાળા પાસે કૂતરો",x:.82,y:.68,w:.14,h:.22},{en:"red bandhani overhead",gu:"ઉપર લાલ બાંધણી",x:.48,y:.02,w:.18,h:.18},{en:"terracotta locho pot",gu:"લોચોનું માટલું",x:.18,y:.52,w:.14,h:.18}]},
  {id:"patan-loom",en:"Patola loom court",gu:"પાટોળાનું આંગણું",src:"patan-district-1.webp",targets:[{en:"woman at the patola loom",gu:"માઘ પર વણનારી",x:.08,y:.32,w:.22,h:.32},{en:"white cow in the gateway",gu:"બારણે ધોળી ગાય",x:.52,y:.38,w:.14,h:.22},{en:"baskets of white yarn",gu:"સફેદ દોરાની ટોપલી",x:.22,y:.70,w:.22,h:.22},{en:"bougainvillea cascade",gu:"બોગનવેલિયા",x:.62,y:.00,w:.30,h:.22},{en:"pair of carved chairs",gu:"નકશીદાર ખુરશીઓ",x:.48,y:.52,w:.28,h:.30}]},
  {id:"juna-fort",en:"Uparkot market yard",gu:"ઉપરકોટનું આંગણું",src:"junagadh-district-1.webp",targets:[{en:"peacock on the rampart",gu:"કાંગરે મોર",x:.28,y:.18,w:.16,h:.22},{en:"stone lion at the fountain",gu:"ઝરણા પાસે સિંહ",x:.48,y:.62,w:.16,h:.22},{en:"sleeping dog",gu:"સૂતેલો કૂતરો",x:.38,y:.58,w:.16,h:.14},{en:"mango cart",gu:"કેરીની ગાડી",x:.02,y:.38,w:.22,h:.22},{en:"laundry on the fort wall",gu:"કિલ્લા પર કપડાં",x:.52,y:.10,w:.28,h:.12}]},
  {id:"garba-pol",en:"Pol garba night",gu:"પોળની ગરબા રાત",src:"garba-district-1.webp",targets:[{en:"dhol player",gu:"ઢોલી",x:.78,y:.62,w:.18,h:.30},{en:"rangoli of diyas",gu:"દીવાની રંગોળી",x:.32,y:.68,w:.28,h:.20},{en:"goat by the pots",gu:"કોઠા પાસે બકરી",x:.72,y:.58,w:.12,h:.16},{en:"cat on the tiled roof",gu:"નળિયાં પર બિલાડી",x:.78,y:.08,w:.10,h:.08},{en:"central dandiya pair",gu:"મધ્યના દાંડિયા",x:.38,y:.38,w:.18,h:.28}]}
];
const IMAGES={};
function paintFallback(src){
  const cnv=document.createElement("canvas"); cnv.width=1536; cnv.height=1024;
  const c=cnv.getContext("2d");
  const palettes={ahmedabad:["#f4c56a","#c45c26","#6b2d12","#1d4e89"],jamnagar:["#1f4d3a","#c23b4a","#f2d6a6","#16324f"],kutch:["#e8d9b0","#b56a2b","#3d6b4f","#7a3b1a"],navratri:["#1a1020","#c45c26","#f3c36b","#7b1e3a"],surat:["#3b1d12","#e2a04a","#c23b4a","#f6e2c0"],patan:["#2b4c3e","#d7b56a","#8b2e2e","#f3e6c8"],junagadh:["#6d7a4c","#c9a15b","#3a2a1a","#dfe7c8"],garba:["#140c18","#d24b2e","#f3c36b","#2a6b4f"]};
  const key=Object.keys(palettes).find(k=>src.startsWith(k))||"navratri";
  const pal=palettes[key];
  const g=c.createLinearGradient(0,0,0,1024); g.addColorStop(0,pal[0]); g.addColorStop(1,pal[3]||pal[1]);
  c.fillStyle=g; c.fillRect(0,0,1536,1024); c.globalAlpha=.35;
  for(let i=0;i<18;i++){c.fillStyle=pal[i%pal.length]; const x=(i*173)%1400,w=90+((i*37)%160),h=180+((i*53)%420); c.fillRect(x,1024-h-40,w,h); c.fillRect(x+12,1024-h-90,w*0.45,50);}
  c.globalAlpha=1; c.fillStyle=pal[2];
  for(let i=0;i<40;i++){const x=40+(i*37)%1460,y=220+(i*91)%720; c.beginPath(); c.ellipse(x,y,10,16,0,0,Math.PI*2); c.fill(); c.fillRect(x-8,y,16,28);}
  c.fillStyle="rgba(255,250,242,.88)"; c.fillRect(40,40,620,86); c.fillStyle="#161513";
  c.font="600 28px system-ui,sans-serif"; c.fillText("Khoj · painted board pending sync",56,76);
  c.font="20px system-ui,sans-serif"; c.fillText(src.replace(".webp","").replace(/-/g," "),56,108);
  const im=new Image(); im.src=cnv.toDataURL("image/jpeg",.72); return im;
}
function loadScene(src){
  const im=new Image(); im.decoding="async";
  const stem=src.replace(/\.(webp|jpg|png)$/i,"");
  const paths=["./img/scenes/"+src,"./img/scenes/"+stem+".jpg","./img/scenes/"+stem+".webp","./"+src,"./assets/districts/"+src];
  let i=0; im.onerror=()=>{i+=1; if(i<paths.length) im.src=paths[i]; else IMAGES[src]=paintFallback(src);};
  im.src=paths[0]; return im;
}
LEVELS.forEach(lv=>{IMAGES[lv.src]=loadScene(lv.src);});
let AC=null;
function ac(){if(!SETTINGS.sfx)return null;if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();return AC;}
function beep(f,d,type="triangle",g=0.05){const a=ac();if(!a)return;const o=a.createOscillator(),n=a.createGain();o.type=type;o.frequency.value=f;n.gain.value=g;n.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+d);o.connect(n);n.connect(a.destination);o.start();o.stop(a.currentTime+d);}
const sfxFound=()=>{beep(523,.08);setTimeout(()=>beep(784,.12),70);setTimeout(()=>beep(1046,.18),150);};
const sfxMiss=()=>beep(180,.1,"sawtooth",.03);
const sfxHint=()=>beep(880,.12,"sine",.04);
const sfxWin=()=>[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.2),i*90));
const cv=$("scene"), ctx=cv.getContext("2d");
let VW=0,VH=0,DPR=1;
const CAM={x:0,y:0,s:1};
let WORLD={w:1920,h:1080,theme:null,targets:[],found:new Set(),mode:"levels",wave:1,t0:0,img:null};
let FX=[], dragging=false, lastP=null, pointers=new Map();
function resize(){DPR=Math.min(window.devicePixelRatio||1,2.5);VW=cv.clientWidth;VH=cv.clientHeight;cv.width=VW*DPR;cv.height=VH*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
new ResizeObserver(resize).observe(cv);
function worldFromEvent(e){const r=cv.getBoundingClientRect();return {x:CAM.x+(e.clientX-r.left)/CAM.s,y:CAM.y+(e.clientY-r.top)/CAM.s};}
function boxOf(t){return {x:t.x*WORLD.w,y:t.y*WORLD.h,w:t.w*WORLD.w,h:t.h*WORLD.h};}
function buildWorld(theme,mode,wave){
  const img=IMAGES[theme.src];
  const w=(img&&img.naturalWidth)||1920,h=(img&&img.naturalHeight)||1080;
  let targets=theme.targets.slice();
  if(mode==="endless"){
    const rng=mulberry32((Date.now()^wave*9973)>>>0);
    targets=targets.filter(()=>rng()>0.12);
    while(targets.length>6)targets.pop();
    while(targets.length<4&&theme.targets.length)targets.push(theme.targets[targets.length%theme.targets.length]);
  }
  WORLD={w,h,theme,targets,found:new Set(),mode,wave,t0:performance.now(),img};
  CAM.s=Math.min(VW/w,VH/h)*1.12;
  CAM.x=Math.max(0,(w-VW/CAM.s)/2); CAM.y=Math.max(0,(h-VH/CAM.s)/3);
  clampCam(); renderTargets(); updateHud();
}
function renderTargets(){
  const box=$("targets"); box.innerHTML="";
  const img=WORLD.img;
  WORLD.targets.forEach((t,i)=>{
    const el=document.createElement("button"); el.className="t"+(WORLD.found.has(i)?" found":"");
    const cnv=document.createElement("canvas"); cnv.width=104; cnv.height=104; const c=cnv.getContext("2d");
    if(img&&img.complete&&img.naturalWidth){c.drawImage(img,t.x*img.naturalWidth,t.y*img.naturalHeight,t.w*img.naturalWidth,t.h*img.naturalHeight,0,0,104,104);}
    else {c.fillStyle="#efe6d6";c.fillRect(0,0,104,104);}
    const lab=document.createElement("div"); lab.className="lab";
    lab.innerHTML=SETTINGS.lang==="gu"?t.gu:SETTINGS.lang==="en"?t.en:t.en+"<br>"+t.gu;
    el.appendChild(cnv); el.appendChild(lab);
    el.addEventListener("click",()=>{if(WORLD.found.has(i))return;focusOn(t);toast(SETTINGS.lang==="gu"?t.gu:t.en);});
    box.appendChild(el);
  });
}
function updateHud(){
  const th=WORLD.theme,n=WORLD.found.size,tot=WORLD.targets.length;
  $("titleChip").childNodes[0].textContent=WORLD.mode==="endless"?"Endless "+WORLD.wave:(th?th.en:"Khoj");
  $("subChip").textContent=th?th.gu:"ખોજ";
  $("count").textContent=(SETTINGS.lang==="gu"?L.gu:L.en).found(n,tot);
  $("hintBtn").style.display=SETTINGS.hints?"inline-flex":"none";
  const e=((performance.now()-WORLD.t0)/1000)|0;
  $("clock").textContent=((e/60)|0)+":"+String(e%60).padStart(2,"0");
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast._);toast._=setTimeout(()=>t.classList.remove("show"),1600);}
function focusOn(t){const b=boxOf(t);const ts=Math.max(CAM.s,Math.min(2.4,VW/(b.w*2.1)));CAM.s=ts;CAM.x=b.x+b.w/2-VW/(2*ts);CAM.y=b.y+b.h/2-VH/(2.2*ts);clampCam();}
function hint(){if(!SETTINGS.hints){toast(L[SETTINGS.lang==="gu"?"gu":"en"].locked);return;} const i=WORLD.targets.findIndex((_,k)=>!WORLD.found.has(k)); if(i<0)return; const t=WORLD.targets[i]; focusOn(t); const b=boxOf(t); FX.push({type:"ring",x:b.x+b.w/2,y:b.y+b.h/2,t:0}); sfxHint(); toast(SETTINGS.lang==="gu"?t.gu:t.en);}
function hitTarget(wx,wy){for(let i=WORLD.targets.length-1;i>=0;i--){const b=boxOf(WORLD.targets[i]); if(wx>=b.x&&wx<=b.x+b.w&&wy>=b.y&&wy<=b.y+b.h) return i;} return -1;}
function onTap(wx,wy){const idx=hitTarget(wx,wy); if(idx<0){sfxMiss();FX.push({type:"puff",x:wx,y:wy,t:0});toast((SETTINGS.lang==="gu"?L.gu:L.en).miss);return;} if(WORLD.found.has(idx)){toast((SETTINGS.lang==="gu"?L.gu:L.en).already);return;} WORLD.found.add(idx); const b=boxOf(WORLD.targets[idx]); FX.push({type:"burst",x:b.x+b.w/2,y:b.y+b.h/2,t:0}); sfxFound(); renderTargets(); $("targets").children[idx]?.classList.add("pulse"); updateHud(); if(WORLD.found.size===WORLD.targets.length) setTimeout(onWin,420);}
function onWin(){sfxWin(); if(WORLD.mode==="levels"&&WORLD.theme&&!SETTINGS.done.includes(WORLD.theme.id)){SETTINGS.done.push(WORLD.theme.id);saveSet();fillLevels();} $("winTitle").textContent=WORLD.mode==="endless"?L.en.wave(WORLD.wave):L.en.cleared; $("winText").innerHTML=WORLD.mode==="endless"?"Nice eyes. Wave "+WORLD.wave+" done.<br><span class=\"gu\">સારી દૃષ્ટિ.</span>":WORLD.theme.en+" · <span class=\"gu\">"+WORLD.theme.gu+"</span>"; $("nextBtn").textContent=WORLD.mode==="endless"?L.en.more:L.en.next; $("win").classList.add("open");}
function clampCam(){const maxS=3.2,minS=Math.min(VW/WORLD.w,VH/WORLD.h)*0.98; CAM.s=clamp(CAM.s,Math.max(.25,minS),maxS); CAM.x=clamp(CAM.x,0,Math.max(0,WORLD.w-VW/CAM.s)); CAM.y=clamp(CAM.y,0,Math.max(0,WORLD.h-VH/CAM.s));}
function draw(){ctx.fillStyle="#1c1410"; ctx.fillRect(0,0,VW,VH); ctx.save(); ctx.translate(-CAM.x*CAM.s,-CAM.y*CAM.s); ctx.scale(CAM.s,CAM.s); const img=WORLD.img; if(img&&img.complete&&img.naturalWidth) ctx.drawImage(img,0,0,WORLD.w,WORLD.h); else {ctx.fillStyle="#3a2a20";ctx.fillRect(0,0,WORLD.w,WORLD.h);} WORLD.targets.forEach((t,i)=>{if(!WORLD.found.has(i))return; const b=boxOf(t); ctx.strokeStyle="#f3c36b"; ctx.lineWidth=Math.max(3,4/CAM.s); ctx.strokeRect(b.x,b.y,b.w,b.h);}); FX.forEach(f=>{f.t+=.05; if(f.type==="burst"){ctx.strokeStyle="#f3c36b"; ctx.lineWidth=2.4; for(let i=0;i<10;i++){const a=i*Math.PI/5,r=10+f.t*48;ctx.beginPath();ctx.moveTo(f.x+Math.cos(a)*8,f.y+Math.sin(a)*8);ctx.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);ctx.stroke();}} else if(f.type==="ring"){ctx.strokeStyle="rgba(243,195,107,"+(1-f.t)+")"; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(f.x,f.y,20+f.t*70,0,Math.PI*2); ctx.stroke();} else {ctx.globalAlpha=1-f.t; ctx.strokeStyle="#fff"; ctx.beginPath(); ctx.arc(f.x,f.y-f.t*12,8+f.t*10,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1;}}); FX=FX.filter(f=>f.t<1); ctx.restore(); updateHud(); requestAnimationFrame(draw);}
cv.addEventListener("pointerdown",e=>{ac();cv.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){dragging=true;lastP={x:e.clientX,y:e.clientY,t:performance.now()};}});
cv.addEventListener("pointermove",e=>{if(!pointers.has(e.pointerId))return; pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); if(pointers.size===2){const [a,b]=[...pointers.values()]; const dist=Math.hypot(a.x-b.x,a.y-b.y); if(!cv._pd)cv._pd=dist; const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2}; const wr=cv.getBoundingClientRect(); const wx=CAM.x+(mid.x-wr.left)/CAM.s, wy=CAM.y+(mid.y-wr.top)/CAM.s; CAM.s*=dist/cv._pd; cv._pd=dist; CAM.x=wx-(mid.x-wr.left)/CAM.s; CAM.y=wy-(mid.y-wr.top)/CAM.s; clampCam(); dragging=false; return;} if(dragging&&lastP){CAM.x-=(e.clientX-lastP.x)/CAM.s;CAM.y-=(e.clientY-lastP.y)/CAM.s;lastP={x:e.clientX,y:e.clientY,t:lastP.t};clampCam();}});
function endPtr(e){const started=lastP; pointers.delete(e.pointerId); if(pointers.size<2)cv._pd=null; if(pointers.size===0){dragging=false; if(started&&performance.now()-started.t<280&&Math.hypot(e.clientX-started.x,e.clientY-started.y)<12){const w=worldFromEvent(e);onTap(w.x,w.y);} lastP=null;}}
cv.addEventListener("pointerup",endPtr); cv.addEventListener("pointercancel",endPtr);
cv.addEventListener("wheel",e=>{e.preventDefault();const w=worldFromEvent(e);const old=CAM.s;CAM.s*=e.deltaY<0?1.08:.92;clampCam();CAM.x=w.x-(w.x-CAM.x)*old/CAM.s;CAM.y=w.y-(w.y-CAM.y)*old/CAM.s;clampCam();},{passive:false});
function startLevel(lv,mode="levels",wave=1){$("home").classList.remove("open"); $("menu").classList.remove("open"); $("win").classList.remove("open"); const img=IMAGES[lv.src]; const go=()=>buildWorld(lv,mode,wave); if(img&&!img.complete) img.onload=go; go();}
function startEndless(){startLevel(pick(mulberry32(Date.now()&0xffff),LEVELS),"endless",1);}
function fillLevels(){const g=$("levelGrid"); g.innerHTML=""; LEVELS.forEach((lv,i)=>{const locked=i>0&&!SETTINGS.done.includes(LEVELS[i-1].id); const b=document.createElement("button"); b.className="lvl"+(SETTINGS.done.includes(lv.id)?" done":""); b.disabled=locked; b.innerHTML="<b>"+(i+1)+". "+lv.en+"</b><small class=\"gu\">"+lv.gu+"</small>"; b.onclick=()=>startLevel(lv); g.appendChild(b);});}
function syncOpts(){["optHints","optHints2"].forEach(id=>{const b=$(id);if(b){b.textContent=SETTINGS.hints?"Open":"Locked";b.classList.toggle("on",SETTINGS.hints);}}); ["optSfx","optSfx2"].forEach(id=>{const b=$(id);if(b){b.textContent=SETTINGS.sfx?"On":"Off";b.classList.toggle("on",SETTINGS.sfx);}});}
function toggleHints(){SETTINGS.hints=!SETTINGS.hints;saveSet();syncOpts();updateHud();}
function toggleSfx(){SETTINGS.sfx=!SETTINGS.sfx;saveSet();syncOpts();ac();}
$("btnLevels").onclick=()=>toast("Pick a painted place below");
$("btnEndless").onclick=startEndless;
$("menuBtn").onclick=()=>$("menu").classList.add("open");
$("resumeBtn").onclick=()=>$("menu").classList.remove("open");
$("homeBtn").onclick=()=>{$("menu").classList.remove("open");$("home").classList.add("open");};
$("hintBtn").onclick=hint;
$("optHints").onclick=toggleHints; $("optHints2").onclick=toggleHints;
$("optSfx").onclick=toggleSfx; $("optSfx2").onclick=toggleSfx;
$("optLang").onclick=()=>{SETTINGS.lang=SETTINGS.lang==="both"?"en":SETTINGS.lang==="en"?"gu":"both";saveSet();renderTargets();updateHud();$("optLang").textContent=SETTINGS.lang==="gu"?"ગુ":SETTINGS.lang==="en"?"EN":"EN / ગુ";};
$("nextBtn").onclick=()=>{$("win").classList.remove("open");if(WORLD.mode==="endless")startLevel(pick(mulberry32(WORLD.wave*1337),LEVELS),"endless",WORLD.wave+1);else{const i=LEVELS.findIndex(l=>l.id===WORLD.theme.id);startLevel(LEVELS[Math.min(LEVELS.length-1,i+1)]);}};
$("againBtn").onclick=()=>{$("win").classList.remove("open");startLevel(WORLD.theme,WORLD.mode,WORLD.wave);};
fillLevels(); syncOpts(); resize(); requestAnimationFrame(draw);
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
