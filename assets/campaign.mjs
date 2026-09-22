import {applyCampaignClue} from './assistance.mjs';
import {artworkCutoverFor, hasHistoricalCompletion, migrateJourneyV2} from './semantic-migration.mjs';
import {createDistrictState} from './district-state.mjs';

export const SAVE_KEY='hidden-gujarat-v2';
export function freshLevel(level){return {contentVersion:level.contentVersion,foundIds:[],hintStages:{},hintsRemaining:3,elapsedMs:0,camera:null,complete:false};}
export function createCampaign(levels){return {schemaVersion:1,currentLevelId:levels[0].id,unlockedLevelIds:[levels[0].id],clearedLevelIds:[],locale:'en',levels:Object.fromEntries(levels.map(l=>[l.id,freshLevel(l)]))};}
export function findCampaignTarget(state,levels,levelId,targetId){
  const level=levels.find(l=>l.id===levelId),progress=state.levels[levelId];
  if(!level||!state.unlockedLevelIds.includes(levelId)||!level.targets.some(t=>t.id===targetId)||progress.complete||progress.foundIds.includes(targetId))return state;
  const foundIds=[...progress.foundIds,targetId],complete=foundIds.length===level.targets.length;
  const next=levels[levels.indexOf(level)+1];
  return {...state,clearedLevelIds:complete?[...new Set([...(state.clearedLevelIds||[]),levelId])]:state.clearedLevelIds,unlockedLevelIds:complete&&next?[...new Set([...state.unlockedLevelIds,next.id])]:state.unlockedLevelIds,levels:{...state.levels,[levelId]:{...progress,foundIds,complete}}};
}
export function useCampaignHint(state,levels,levelId,targetId){
  const {blocked,...legacy}=applyCampaignClue(state,levels,levelId,targetId,{unlimitedClues:false});
  return legacy;
}
export function saveProgress(storage,state){
  if(state.migrationBlocked)return {saved:false,warning:state.migrationBlocked};
  try{storage.setItem(SAVE_KEY,JSON.stringify(state));return {saved:true,warning:null};}catch{return {saved:false,warning:'storage'};}
}
export function loadProgress(storage,levels){
  const state=createCampaign(levels);
  try{
    const text=storage.getItem(SAVE_KEY);if(!text)return {state,restored:false,warning:null};
    let raw=JSON.parse(text);if(raw?.schemaVersion!==1||!raw.levels||typeof raw.levels!=='object'||Array.isArray(raw.levels))return {state,restored:false,warning:'invalid'};
    let migrationWarning=null;
    if(levels.some(level=>(raw.levels[level.id]?.contentVersion===2&&[4,5].includes(level.contentVersion))||artworkCutoverFor(level,raw.levels[level.id]?.contentVersion))){
      const result=migrateJourneyV2(raw,levels);
      if(!result.state){
        state.locale=raw.locale==='gu'?'gu':'en';
        state.migrationBlocked=result.warning;
        return {state,restored:false,warning:result.warning,sourcePreserved:true,requirements:result.requirements};
      }
      raw=result.state;migrationWarning=result.warning;
    }
    state.locale=raw.locale==='gu'?'gu':'en';if(raw.migrationBlocked)state.migrationBlocked=raw.migrationBlocked;let changed=false,reset=false;
    for(const level of levels){
      const old=raw.levels[level.id];if(!old)continue;
      if(old.contentVersion!==level.contentVersion){
        changed=true;
        if(!(old.contentVersion===3&&level.contentVersion===4)){reset=true;continue;}
      }
      const p=state.levels[level.id];const valid=new Set(level.targets.map(t=>t.id));
      p.foundIds=[...new Set(Array.isArray(old.foundIds)?old.foundIds.filter(id=>valid.has(id)):[])];
      p.complete=p.foundIds.length===level.targets.length;
      p.hintStages=Object.fromEntries(Object.entries(old.hintStages||{}).filter(([id,stage])=>valid.has(id)&&[1,2].includes(stage)));
      const spent=Object.values(p.hintStages).reduce((sum,n)=>sum+n,0);
      p.hintsRemaining=Number.isInteger(old.hintsRemaining)&&old.hintsRemaining>=0&&old.hintsRemaining<=3?old.hintsRemaining:Math.max(0,3-spent);
      p.elapsedMs=Number.isFinite(old.elapsedMs)?Math.max(0,Math.min(old.elapsedMs,864000000)):0;
      if(old.camera&&['x','y','scale'].every(k=>Number.isFinite(old.camera[k]))&&old.camera.scale>0&&old.camera.scale<=8)p.camera={x:old.camera.x,y:old.camera.y,scale:old.camera.scale};
      if(old.contentVersion===3&&level.contentVersion===4&&Array.isArray(level.districts)&&p.camera)p.legacyCamera={contentVersion:3,camera:{...p.camera}};
      if(old.migration?.version===1&&[2,3,4].includes(old.migration.fromContentVersion)){
        p.migration=structuredClone(old.migration);
        if(hasHistoricalCompletion(p,level))p.complete=true;
      }
      if(old.districtState&&Array.isArray(level.districts)){
        p.districtState=createDistrictState(level,old.districtState.activeDistrictId);
        for(const id of Object.keys(p.districtState.cameras)){
          const camera=old.districtState.cameras?.[id];
          if(camera&&['x','y','scale'].every(k=>Number.isFinite(camera[k]))&&camera.scale>0&&camera.scale<=8)p.districtState.cameras[id]={x:camera.x,y:camera.y,scale:camera.scale};
        }
      }
      if([2,3].includes(old.legacyCamera?.contentVersion)){
        const camera=old.legacyCamera.camera;
        if(camera&&['x','y','scale'].every(k=>Number.isFinite(camera[k]))&&camera.scale>0&&camera.scale<=8)p.legacyCamera={contentVersion:old.legacyCamera.contentVersion,camera:{x:camera.x,y:camera.y,scale:camera.scale}};
      }
    }
    const earned=new Set(Array.isArray(raw.clearedLevelIds)?raw.clearedLevelIds:[]);
    for(let i=0;i<levels.length;i++){
      if(!state.levels[levels[i].id].complete&&!earned.has(levels[i].id))break;
      state.clearedLevelIds.push(levels[i].id);
      if(i+1<levels.length)state.unlockedLevelIds.push(levels[i+1].id);
    }
    state.currentLevelId=state.unlockedLevelIds.includes(raw.currentLevelId)?raw.currentLevelId:state.unlockedLevelIds.at(-1);
    return {state,restored:!state.migrationBlocked,warning:state.migrationBlocked||(reset?'progress-reset':migrationWarning||(changed?'updated':null))};
  }catch{return {state,restored:false,warning:'storage'};}
}
