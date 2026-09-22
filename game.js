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
  en:{found:(a,b)=>a+" of "+b+" found",locked:"Hints locked",cleared:"Camp cleared",wave:n=>"Wave "+n+" cleared",next:"Next camp",more:"Next wave",miss:"Not them — keep looking",already:"Already found"},
  gu:{found:(a,b)=>b+"માંથી "+a+" મળ્યા",locked:"ઈશારા બંધ",cleared:"શિબિર પૂરું",wave:n=>"લહેર "+n+" પૂરી",next:"આગળનું શિબિર",more:"આગળની લહેર",miss:"આ નહીં — શોધતા રહો",already:"પહેલેથી મળ્યા"}
};
const LEVELS = [
  {id:"sabarmati",en:"Sabarmati picnic",gu:"સાબરમતી પિકનિક",place:"place_meadow",crowd:48,targets:5,flavor:"riverfront"},
  {id:"gir",en:"Gir forest camp",gu:"ગીર જંગલ શિબિર",place:"place_woods",crowd:55,targets:5,flavor:"forest"},
  {id:"diu",en:"Diu shore",gu:"દીવ કિનારો",place:"place_shore",crowd:50,targets:5,flavor:"shore"},
  {id:"saputara",en:"Saputara hills",gu:"સાપુતારા ટેકરીઓ",place:"place_woods",crowd:58,targets:6,flavor:"hills"},
  {id:"rann",en:"Rann of Kutch",gu:"કચ્છનું રણ",place:"place_meadow",crowd:62,targets:6,flavor:"rann"},
  {id:"uttarayan",en:"Uttarayan field",gu:"ઉત્તરાયણ મેદાન",place:"place_meadow",crowd:70,targets:6,flavor:"kites"},
  {id:"navratri",en:"Navratri garba",gu:"નવરાત્રી ગરબા",place:"place_campsite",crowd:80,targets:7,flavor:"garba"},
  {id:"dwarka",en:"Dwarka coast",gu:"દ્વારકા કિનારો",place:"place_lakeside",crowd:64,targets:6,flavor:"temple"},
  {id:"undhiyu",en:"Undhiyu farm",gu:"ઉંધિયું વાડું",place:"place_campsite",crowd:60,targets:6,flavor:"farm"},
  {id:"kankaria",en:"Kankaria evening",gu:"કાંકરિયા સાંજ",place:"place_lakeside",crowd:72,targets:7,flavor:"lake"}
];
const HAIR=["short","bob","bun","curly","long","mohawk","pigtails","bald"];
const TOPS=["hoodie","check","plain","kediyu","choli"];
const BOTS=["shorts","trousers","chaniya","dhoti"];
const POSES=["stand","walk","wave","sit","point","cook"];
const AGES=["adult","adult","adult","kid","kid","baby"];
const PLACES={};
["place_woods","place_lakeside","place_campsite","place_shore","place_meadow"].forEach(k=>{const im=new Image();im.src="./img/"+k+".jpg";PLACES[k]=im;});
let AC=null;
function ac(){if(!SETTINGS.sfx)return null;if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();return AC;}
function beep(f,d,type="triangle",g=0.05){const a=ac();if(!a)return;const o=a.createOscillator(),n=a.createGain();o.type=type;o.frequency.value=f;n.gain.value=g;n.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+d);o.connect(n);n.connect(a.destination);o.start();o.stop(a.currentTime+d);}
const sfxFound=()=>{beep(523,.08);setTimeout(()=>beep(784,.12),70);setTimeout(()=>beep(1046,.18),150);};
const sfxMiss=()=>beep(180,.1,"sawtooth",.03);
const sfxHint=()=>beep(880,.12,"sine",.04);
const sfxWin=()=>[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.2),i*90));
function line(c,x0,y0,x1,y1,w){c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.lineWidth=w;c.stroke();}
function ellipse(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
function drawHair(c,k,hx,hy){
  c.fillStyle="#1a1a1a";
  if(k.hair==="bald")return;
  if(k.hair==="short"){ellipse(c,hx,hy-7,9,6);c.fill();}
  else if(k.hair==="bob"){ellipse(c,hx,hy-2,11,10);c.fill();}
  else if(k.hair==="bun"){ellipse(c,hx,hy-8,9,7);c.fill();ellipse(c,hx,hy-16,5,5);c.fill();}
  else if(k.hair==="curly"){for(let i=0;i<6;i++){ellipse(c,hx-8+i*3.2,hy-9+(i%2),3.2,3.2);c.fill();}}
  else if(k.hair==="long"){ellipse(c,hx,hy-6,10,8);c.fill();c.fillRect(hx-10,hy-4,6,18);c.fillRect(hx+4,hy-4,6,18);}
  else if(k.hair==="mohawk"){c.beginPath();c.moveTo(hx-3,hy-6);c.lineTo(hx,hy-20);c.lineTo(hx+3,hy-6);c.fill();}
  else {ellipse(c,hx,hy-6,9,6);c.fill();ellipse(c,hx-12,hy-2,4,4);c.fill();ellipse(c,hx+12,hy-2,4,4);c.fill();}
}
function drawHat(c,k,hx,hy){
  c.fillStyle="#fff";c.strokeStyle="#111";c.lineWidth=1.4;
  if(k.hat==="cap"){c.beginPath();c.ellipse(hx,hy-10,10,5,0,Math.PI,0);c.fill();c.stroke();line(c,hx,hy-10,hx+14,hy-8,2);}
  else if(k.hat==="sun"){c.beginPath();c.ellipse(hx,hy-8,16,4,0,0,Math.PI*2);c.fill();c.stroke();ellipse(c,hx,hy-12,8,5);c.fill();c.stroke();}
  else if(k.hat==="beanie"){ellipse(c,hx,hy-10,10,7);c.fill();c.stroke();}
  else if(k.hat==="paghdi"){ellipse(c,hx,hy-10,13,7);c.fill();c.stroke();ellipse(c,hx+2,hy-16,8,5);c.fill();c.stroke();line(c,hx-8,hy-10,hx+12,hy-18,1.3);}
}
function drawHeld(c,k,x,y){
  c.strokeStyle="#111";c.fillStyle="#fff";c.lineWidth=1.4;
  if(k.held==="kite"){c.beginPath();c.moveTo(x+18,y-54);c.lineTo(x+28,y-44);c.lineTo(x+18,y-34);c.lineTo(x+8,y-44);c.closePath();c.fill();c.stroke();line(c,x+18,y-34,x+22,y-18,1);}
  else if(k.held==="dhol"){ellipse(c,x+16,y-18,8,11);c.fill();c.stroke();line(c,x+8,y-18,x+24,y-18,1);}
  else if(k.held==="diya"){ellipse(c,x+14,y-22,5,3);c.fill();c.stroke();c.beginPath();c.moveTo(x+14,y-24);c.lineTo(x+14,y-32);c.stroke();}
  else if(k.held==="mug"){c.strokeRect(x+12,y-28,7,8);}
  else if(k.held==="camera"){c.strokeRect(x+10,y-30,10,7);ellipse(c,x+15,y-26,2.5,2.5);c.stroke();}
  else if(k.held==="sticks"){line(c,x+10,y-40,x+22,y-18,1.6);line(c,x-10,y-40,x-22,y-18,1.6);}
}
function drawPerson(c,k,x,y,sc){
  c.save();c.translate(x,y);c.scale(sc*(k.flip||1),sc);
  const baby=k.age==="baby",kid=k.age==="kid";
  c.scale(k.build==="wide"?1.18:k.build==="slim"?0.88:1, baby?0.55:kid?0.78:1);
  c.strokeStyle="#111";c.fillStyle="#fff";c.lineJoin="round";c.lineCap="round";c.lineWidth=1.6;
  const pelY=k.pose==="sit"?-14:-22;
  if(!baby||k.pose!=="sit"){
    line(c,-4,pelY,-6,0,3.4);line(c,4,pelY,6,0,3.4);
    if(k.bottom==="chaniya"){c.beginPath();c.moveTo(-8,pelY-6);c.lineTo(-16,2);c.lineTo(16,2);c.lineTo(8,pelY-6);c.closePath();c.fill();c.stroke();}
    else if(k.bottom==="dhoti"){c.beginPath();c.moveTo(-7,pelY);c.lineTo(-5,2);c.lineTo(8,2);c.lineTo(7,pelY);c.closePath();c.fill();c.stroke();}
    else if(k.bottom==="shorts")c.strokeRect(-8,pelY,16,9);
  }
  const bw=k.sex==="f"?11:13;
  if(k.top==="choli"){c.beginPath();c.moveTo(-bw+2,pelY-22);c.lineTo(-bw,pelY-6);c.lineTo(bw,pelY-6);c.lineTo(bw-2,pelY-22);c.closePath();c.fill();c.stroke();}
  else if(k.top==="kediyu"){ellipse(c,0,pelY-12,bw+2,14);c.fill();c.stroke();for(let i=-8;i<=8;i+=4)line(c,i,pelY-20,i,pelY-6,.8);}
  else {c.beginPath();c.moveTo(-bw,pelY-24);c.lineTo(-bw-1,pelY+2);c.lineTo(bw+1,pelY+2);c.lineTo(bw,pelY-24);c.closePath();c.fill();c.stroke();
    if(k.top==="check")for(let i=-8;i<=8;i+=4){line(c,i,pelY-22,i,pelY,.7);line(c,-bw,pelY-16+i*.4,bw,pelY-16+i*.4,.7);}}
  if(k.pose==="wave"){line(c,-10,pelY-20,-14,pelY-6,2.6);line(c,10,pelY-20,14,pelY-38,2.6);}
  else if(k.pose==="point"){line(c,-10,pelY-20,-14,pelY-6,2.6);line(c,10,pelY-20,22,pelY-24,2.6);}
  else if(k.pose==="cook"){line(c,-8,pelY-18,12,pelY-10,2.6);line(c,8,pelY-18,16,pelY-10,2.6);}
  else {line(c,-10,pelY-20,-12,pelY-4,2.6);line(c,10,pelY-20,12,pelY-4,2.6);}
  const hx=0,hy=pelY-32;
  ellipse(c,hx,hy,9,10);c.fill();c.stroke();drawHair(c,k,hx,hy);
  c.fillStyle="#111";ellipse(c,hx-3.2,hy-1,1.1,1.4);c.fill();ellipse(c,hx+3.2,hy-1,1.1,1.4);c.fill();
  c.beginPath();c.arc(hx,hy+3,3,.15*Math.PI,.85*Math.PI);c.stroke();
  if(k.glasses){ellipse(c,hx-3.3,hy-1,3,2.4);c.stroke();ellipse(c,hx+3.3,hy-1,3,2.4);c.stroke();line(c,hx-.4,hy-1,hx+.4,hy-1,1);}
  if(k.beard){c.beginPath();c.ellipse(hx,hy+7,5,3.2,0,0,Math.PI);c.stroke();}
  if(k.bindi){ellipse(c,hx,hy-5,1.3,1.3);c.fill();}
  drawHat(c,k,hx,hy);drawHeld(c,k,0,0);c.restore();
}
function drawProp(c,kind,x,y,sc){
  c.save();c.translate(x,y);c.scale(sc,sc);c.strokeStyle="#111";c.fillStyle="#fff";c.lineWidth=1.6;
  if(kind==="tent"){c.beginPath();c.moveTo(0,-70);c.lineTo(-55,10);c.lineTo(55,10);c.closePath();c.fill();c.stroke();line(c,0,-70,0,10,1.4);}
  else if(kind==="tree"){ellipse(c,0,-50,28,36);c.fill();c.stroke();c.strokeRect(-5,-20,10,22);}
  else if(kind==="pine"){c.beginPath();c.moveTo(0,-90);c.lineTo(-22,-20);c.lineTo(22,-20);c.closePath();c.fill();c.stroke();c.fillRect(-4,-20,8,22);}
  else if(kind==="fire"){ellipse(c,0,0,16,6);c.stroke();c.beginPath();c.moveTo(-8,0);c.lineTo(0,-28);c.lineTo(8,0);c.stroke();}
  else if(kind==="van"){c.strokeRect(-40,-28,70,28);c.strokeRect(10,-42,28,14);ellipse(c,-18,2,7,7);c.stroke();ellipse(c,22,2,7,7);c.stroke();}
  else if(kind==="table"){c.strokeRect(-22,-16,44,10);line(c,-18,-6,-18,8,1.5);line(c,18,-6,18,8,1.5);}
  else if(kind==="sign"){c.fillRect(-2,-40,4,42);c.strokeRect(-18,-40,36,12);}
  else if(kind==="boat"){c.beginPath();c.moveTo(-30,0);c.lineTo(30,0);c.lineTo(18,10);c.lineTo(-18,10);c.closePath();c.fill();c.stroke();}
  else if(kind==="lantern"){ellipse(c,0,-18,7,10);c.stroke();}
  else if(kind==="kitepole"){line(c,0,0,0,-50,1.6);c.beginPath();c.moveTo(0,-50);c.lineTo(16,-36);c.lineTo(0,-22);c.lineTo(-16,-36);c.closePath();c.fill();c.stroke();}
  c.restore();
}
function randKit(rng,fl){
  const age=pick(rng,fl==="garba"?["adult","adult","kid"]:AGES), sex=rng()<.5?"m":"f";
  const k={age,sex,build:pick(rng,["slim","mid","mid","wide"]),hair:pick(rng,HAIR),hat:"none",glasses:rng()<.18,beard:sex==="m"&&age==="adult"&&rng()<.28,bindi:sex==="f"&&rng()<.35,top:pick(rng,TOPS),bottom:sex==="f"&&rng()<.45?"chaniya":pick(rng,BOTS),pose:pick(rng,POSES),held:"none",flip:rng()<.5?-1:1};
  if(age==="baby"){k.hat="none";k.held="none";k.pose="sit";k.bottom="shorts";k.top="plain";}
  if(fl==="kites"&&rng()<.35)k.held="kite";
  if(fl==="garba"){if(rng()<.4)k.held="sticks";if(rng()<.2)k.held="dhol";if(sex==="f"){k.bottom="chaniya";k.top="choli";k.bindi=true;}if(sex==="m"&&rng()<.35)k.hat="paghdi";}
  if(fl==="rann"&&sex==="m"&&rng()<.3)k.hat="paghdi";
  if(fl==="temple"&&rng()<.25)k.held="diya";
  if(k.held==="none"&&rng()<.12)k.held=pick(rng,["mug","camera","kite"]);
  if(k.hat==="none"&&rng()<.2)k.hat=pick(rng,["cap","sun","paghdi","beanie"]);
  return k;
}
function describe(k){
  const ageEn=k.age==="baby"?"baby":k.age==="kid"?(k.sex==="f"?"girl":"boy"):(k.sex==="f"?"woman":"man");
  const ageGu=k.age==="baby"?"બાળક":k.age==="kid"?(k.sex==="f"?"છોકરી":"છોકરો"):(k.sex==="f"?"સ્ત્રી":"પુરુષ");
  let e="",g="";
  if(k.hat==="paghdi"){e=" in a paghdi";g=" પાઘડી સાથે";}
  else if(k.held==="kite"){e=" with a kite";g=" પતંગ સાથે";}
  else if(k.held==="dhol"){e=" with a dhol";g=" ઢોલ સાથે";}
  else if(k.held==="diya"){e=" with a diya";g=" દીવા સાથે";}
  else if(k.held==="sticks"){e=" doing garba";g=" ગરબા કરતાં";}
  else if(k.glasses){e=" with glasses";g=" ચશ્માં સાથે";}
  else if(k.beard){e=" with a beard";g=" દાઢી સાથે";}
  else if(k.bottom==="chaniya"){e=" in a chaniya";g=" ચણિયામાં";}
  else if(k.hat==="cap"){e=" in a cap";g=" ટોપી સાથે";}
  else if(k.hair==="bun"){e=" with a bun";g=" બન વાળ";}
  else if(k.top==="kediyu"){e=" in a kediyu";g=" કેડિયું પહેરી";}
  else if(k.bindi){e=" with a bindi";g=" બિંદી સાથે";}
  else e=k.pose==="wave"?" waving":k.pose==="sit"?" sitting":"";
  return {en:ageEn+e,gu:ageGu+g};
}
function kitKey(k){return [k.age,k.sex,k.hat,k.held,k.glasses?"g":"",k.beard?"b":"",k.bottom,k.hair,k.top].join("|");}
const cv=$("scene"), ctx=cv.getContext("2d");
let VW=0,VH=0,DPR=1;
const CAM={x:0,y:0,s:1};
let WORLD={w:2800,h:1700,people:[],props:[],targets:[],found:new Set(),theme:null,seed:1,mode:"levels",wave:1,t0:0};
let FX=[], dragging=false, lastP=null, pointers=new Map();
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);VW=cv.clientWidth;VH=cv.clientHeight;cv.width=VW*DPR;cv.height=VH*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
new ResizeObserver(resize).observe(cv);
function worldFromEvent(e){const r=cv.getBoundingClientRect();const sx=e.clientX-r.left,sy=e.clientY-r.top;return {x:CAM.x+sx/CAM.s,y:CAM.y+sy/CAM.s};}
function buildWorld(theme,seed,mode,wave){
  const rng=mulberry32(seed);
  const crowd=mode==="endless"?40+wave*8:theme.crowd;
  const nT=mode==="endless"?Math.min(4+((wave/2)|0),8):theme.targets;
  WORLD={w:2600+((crowd/10)|0)*40,h:1600,people:[],props:[],targets:[],found:new Set(),theme,seed,mode,wave,t0:performance.now()};
  const fl=theme.flavor;
  const kinds=fl==="kites"?["tree","tent","kitepole","sign","table"]:fl==="shore"||fl==="lake"?["tree","boat","tent","lantern","table"]:fl==="forest"||fl==="hills"?["pine","tree","tent","fire","sign"]:["tent","tree","van","table","fire","sign","lantern"];
  for(let i=0;i<18;i++)WORLD.props.push({kind:pick(rng,kinds),x:80+rng()*(WORLD.w-160),y:280+rng()*(WORLD.h-360),sc:.7+rng()*.8});
  const used=new Set();
  for(let i=0;i<crowd;i++){
    let kit,g=0;do{kit=randKit(rng,fl);g++;}while(used.has(kitKey(kit))&&g<8);
    used.add(kitKey(kit));
    WORLD.people.push({id:i,kit,x:60+rng()*(WORLD.w-120),y:300+rng()*(WORLD.h-340),sc:kit.age==="baby"?0.7+rng()*0.15:kit.age==="kid"?0.85+rng()*0.15:1+rng()*0.25,found:false});
  }
  WORLD.people.sort((a,b)=>a.y-b.y);WORLD.props.sort((a,b)=>a.y-b.y);
  const scored=WORLD.people.map(p=>{const d=describe(p.kit);let s=0;if(p.kit.hat==="paghdi")s+=3;if(["kite","dhol","diya","sticks"].includes(p.kit.held))s+=3;if(p.kit.glasses||p.kit.beard||p.kit.bindi)s+=1;if(p.kit.bottom==="chaniya"||p.kit.top==="kediyu")s+=2;return {p,d,s};});
  scored.sort((a,b)=>b.s-a.s);
  const uniq=[],seen=new Set();
  for(const s of scored){if(seen.has(s.d.en))continue;seen.add(s.d.en);uniq.push(s);if(uniq.length>=nT)break;}
  while(uniq.length<nT&&scored.length)uniq.push(scored[uniq.length%scored.length]);
  WORLD.targets=uniq.slice(0,nT).map(s=>({person:s.p,label:s.d}));
  CAM.x=WORLD.w*.25;CAM.y=WORLD.h*.2;CAM.s=Math.min(VW/900,VH/700);
  renderTargets();updateHud();
}
function personHit(p,wx,wy){const h=70*p.sc,w=28*p.sc;return wx>p.x-w&&wx<p.x+w&&wy>p.y-h&&wy<p.y+8;}
function renderTargets(){
  const box=$("targets");box.innerHTML="";
  WORLD.targets.forEach((t,i)=>{
    const el=document.createElement("button");
    el.className="t"+(WORLD.found.has(i)?" found":"");
    el.innerHTML='<canvas width="104" height="128"></canvas><div class="lab"></div>';
    const c=el.querySelector("canvas").getContext("2d");c.scale(2,2);c.translate(26,58);drawPerson(c,t.person.kit,0,0,.85);
    el.querySelector(".lab").innerHTML=SETTINGS.lang==="gu"?t.label.gu:SETTINGS.lang==="en"?t.label.en:t.label.en+"<br>"+t.label.gu;
    el.addEventListener("click",()=>{if(WORLD.found.has(i))return;focusOn(t.person);toast(SETTINGS.lang==="gu"?t.label.gu:t.label.en);});
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
function focusOn(p){const ts=Math.max(CAM.s,1.15);CAM.x=p.x-VW/(2*ts);CAM.y=p.y-VH/(1.7*ts);CAM.s=ts;clampCam();}
function hint(){if(!SETTINGS.hints){toast(L[SETTINGS.lang==="gu"?"gu":"en"].locked);return;}const i=WORLD.targets.findIndex((_,k)=>!WORLD.found.has(k));if(i<0)return;const p=WORLD.targets[i].person;focusOn(p);FX.push({type:"ring",x:p.x,y:p.y-30*p.sc,t:0});sfxHint();toast(SETTINGS.lang==="gu"?WORLD.targets[i].label.gu:WORLD.targets[i].label.en);}
function findTargetAt(wx,wy){for(let i=WORLD.people.length-1;i>=0;i--)if(personHit(WORLD.people[i],wx,wy))return WORLD.people[i];return null;}
function onFind(person){
  const idx=WORLD.targets.findIndex(t=>t.person===person);
  if(idx<0){sfxMiss();FX.push({type:"puff",x:person.x,y:person.y-20,t:0});toast((SETTINGS.lang==="gu"?L.gu:L.en).miss);return;}
  if(WORLD.found.has(idx)){toast((SETTINGS.lang==="gu"?L.gu:L.en).already);return;}
  WORLD.found.add(idx);person.found=true;FX.push({type:"burst",x:person.x,y:person.y-36*person.sc,t:0});sfxFound();renderTargets();$("targets").children[idx]?.classList.add("pulse");updateHud();
  if(WORLD.found.size===WORLD.targets.length)setTimeout(onWin,420);
}
function onWin(){
  sfxWin();
  if(WORLD.mode==="levels"&&WORLD.theme&&!SETTINGS.done.includes(WORLD.theme.id)){SETTINGS.done.push(WORLD.theme.id);saveSet();fillLevels();}
  $("winTitle").textContent=WORLD.mode==="endless"?L.en.wave(WORLD.wave):L.en.cleared;
  $("winText").innerHTML=WORLD.mode==="endless"?"Nice eyes. Wave "+WORLD.wave+" done.<br><span class=\"gu\">સારી દૃષ્ટિ.</span>":WORLD.theme.en+" · <span class=\"gu\">"+WORLD.theme.gu+"</span>";
  $("nextBtn").textContent=WORLD.mode==="endless"?L.en.more:L.en.next;
  $("win").classList.add("open");
}
function clampCam(){const maxS=2.4,minS=Math.min(VW/WORLD.w,VH/WORLD.h)*.95;CAM.s=clamp(CAM.s,Math.max(.35,minS),maxS);CAM.x=clamp(CAM.x,0,Math.max(0,WORLD.w-VW/CAM.s));CAM.y=clamp(CAM.y,0,Math.max(0,WORLD.h-VH/CAM.s));}
function draw(){
  ctx.fillStyle="#f4ecdc";ctx.fillRect(0,0,VW,VH);ctx.save();ctx.translate(-CAM.x*CAM.s,-CAM.y*CAM.s);ctx.scale(CAM.s,CAM.s);
  const place=WORLD.theme&&PLACES[WORLD.theme.place];
  if(place&&place.complete&&place.naturalWidth){ctx.globalAlpha=.28;ctx.drawImage(place,0,0,WORLD.w,WORLD.h*.62);ctx.globalAlpha=1;}
  ctx.fillStyle="#fffaf2";ctx.fillRect(0,WORLD.h*.42,WORLD.w,WORLD.h);ctx.strokeStyle="#111";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,WORLD.h*.42);ctx.lineTo(WORLD.w,WORLD.h*.42);ctx.stroke();
  if(WORLD.theme&&WORLD.theme.flavor==="kites"){ctx.strokeStyle="#111";for(let i=0;i<12;i++){const x=(i*217+80)%WORLD.w,y=80+(i%5)*30;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+18,y+14);ctx.lineTo(x,y+28);ctx.lineTo(x-18,y+14);ctx.closePath();ctx.stroke();}}
  const items=[];WORLD.props.forEach(p=>items.push({y:p.y,draw:()=>drawProp(ctx,p.kind,p.x,p.y,p.sc)}));
  WORLD.people.forEach(p=>items.push({y:p.y,draw:()=>{drawPerson(ctx,p.kit,p.x,p.y,p.sc);if(p.found){ctx.save();ctx.strokeStyle="#c45c26";ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(p.x,p.y-30*p.sc,22*p.sc,0,Math.PI*2);ctx.stroke();ctx.restore();}}}));
  items.sort((a,b)=>a.y-b.y);items.forEach(it=>it.draw());
  FX.forEach(f=>{f.t+=.05;if(f.type==="burst"){ctx.strokeStyle="#c45c26";ctx.lineWidth=2;for(let i=0;i<8;i++){const a=i*Math.PI/4,r=8+f.t*36;ctx.beginPath();ctx.moveTo(f.x+Math.cos(a)*6,f.y+Math.sin(a)*6);ctx.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);ctx.stroke();}}else if(f.type==="ring"){ctx.strokeStyle="rgba(196,92,38,"+(1-f.t)+")";ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,16+f.t*40,0,Math.PI*2);ctx.stroke();}else{ctx.globalAlpha=1-f.t;ctx.strokeStyle="#111";ctx.beginPath();ctx.arc(f.x,f.y-f.t*10,8+f.t*8,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}});
  FX=FX.filter(f=>f.t<1);ctx.restore();updateHud();requestAnimationFrame(draw);
}
cv.addEventListener("pointerdown",e=>{ac();cv.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){dragging=true;lastP={x:e.clientX,y:e.clientY,t:performance.now()};}});
cv.addEventListener("pointermove",e=>{
  if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){const [a,b]=[...pointers.values()];const dist=Math.hypot(a.x-b.x,a.y-b.y);if(!cv._pd)cv._pd=dist;const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};const wr=cv.getBoundingClientRect();const wx=CAM.x+(mid.x-wr.left)/CAM.s,wy=CAM.y+(mid.y-wr.top)/CAM.s;CAM.s*=dist/cv._pd;cv._pd=dist;CAM.x=wx-(mid.x-wr.left)/CAM.s;CAM.y=wy-(mid.y-wr.top)/CAM.s;clampCam();dragging=false;return;}
  if(dragging&&lastP){CAM.x-=(e.clientX-lastP.x)/CAM.s;CAM.y-=(e.clientY-lastP.y)/CAM.s;lastP={x:e.clientX,y:e.clientY,t:lastP.t};clampCam();}
});
function endPtr(e){const started=lastP;pointers.delete(e.pointerId);if(pointers.size<2)cv._pd=null;if(pointers.size===0){dragging=false;if(started&&performance.now()-started.t<280&&Math.hypot(e.clientX-started.x,e.clientY-started.y)<10){const w=worldFromEvent(e);const p=findTargetAt(w.x,w.y);if(p)onFind(p);else{sfxMiss();FX.push({type:"puff",x:w.x,y:w.y,t:0});}}lastP=null;}}
cv.addEventListener("pointerup",endPtr);cv.addEventListener("pointercancel",endPtr);
cv.addEventListener("wheel",e=>{e.preventDefault();const w=worldFromEvent(e);const old=CAM.s;CAM.s*=e.deltaY<0?1.08:.92;clampCam();CAM.x=w.x-(w.x-CAM.x)*old/CAM.s;CAM.y=w.y-(w.y-CAM.y)*old/CAM.s;clampCam();},{passive:false});
function startLevel(lv,mode="levels",wave=1){$("home").classList.remove("open");$("menu").classList.remove("open");$("win").classList.remove("open");const seed=mode==="endless"?(Date.now()^(wave*9973)):(1000+LEVELS.indexOf(lv)*97);buildWorld(lv,seed>>>0,mode,wave);}
function startEndless(){const lv=pick(mulberry32(Date.now()&0xffff),LEVELS);startLevel({...lv,crowd:44,targets:4},"endless",1);}
function fillLevels(){const g=$("levelGrid");g.innerHTML="";LEVELS.forEach((lv,i)=>{const locked=i>0&&!SETTINGS.done.includes(LEVELS[i-1].id);const b=document.createElement("button");b.className="lvl"+(SETTINGS.done.includes(lv.id)?" done":"");b.disabled=locked;b.innerHTML="<b>"+(i+1)+". "+lv.en+"</b><small class=\"gu\">"+lv.gu+"</small>";b.onclick=()=>startLevel(lv);g.appendChild(b);});}
function syncOpts(){["optHints","optHints2"].forEach(id=>{const b=$(id);if(b){b.textContent=SETTINGS.hints?"Open":"Locked";b.classList.toggle("on",SETTINGS.hints);}});["optSfx","optSfx2"].forEach(id=>{const b=$(id);if(b){b.textContent=SETTINGS.sfx?"On":"Off";b.classList.toggle("on",SETTINGS.sfx);}});}
function toggleHints(){SETTINGS.hints=!SETTINGS.hints;saveSet();syncOpts();updateHud();}
function toggleSfx(){SETTINGS.sfx=!SETTINGS.sfx;saveSet();syncOpts();ac();}
$("btnLevels").onclick=()=>toast("Pick a camp below");
$("btnEndless").onclick=startEndless;
$("menuBtn").onclick=()=>$("menu").classList.add("open");
$("resumeBtn").onclick=()=>$("menu").classList.remove("open");
$("homeBtn").onclick=()=>{$("menu").classList.remove("open");$("home").classList.add("open");};
$("hintBtn").onclick=hint;
$("optHints").onclick=toggleHints;$("optHints2").onclick=toggleHints;
$("optSfx").onclick=toggleSfx;$("optSfx2").onclick=toggleSfx;
$("optLang").onclick=()=>{SETTINGS.lang=SETTINGS.lang==="both"?"en":SETTINGS.lang==="en"?"gu":"both";saveSet();renderTargets();updateHud();$("optLang").textContent=SETTINGS.lang==="gu"?"ગુ":SETTINGS.lang==="en"?"EN":"EN / ગુ";};
$("nextBtn").onclick=()=>{$("win").classList.remove("open");if(WORLD.mode==="endless"){const lv=pick(mulberry32(WORLD.seed+3),LEVELS);startLevel({...lv,crowd:40+WORLD.wave*8,targets:Math.min(8,4+((WORLD.wave/2)|0))},"endless",WORLD.wave+1);}else{const i=LEVELS.findIndex(l=>l.id===WORLD.theme.id);startLevel(LEVELS[Math.min(LEVELS.length-1,i+1)]);}};
$("againBtn").onclick=()=>{$("win").classList.remove("open");startLevel(WORLD.theme,WORLD.mode,WORLD.wave);};
fillLevels();syncOpts();resize();requestAnimationFrame(draw);
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
