import {createDistrictState, saveDistrictCamera, selectDistrict} from './district-state.mjs';
import {districtForTarget, localTargetsInLevelOrder} from './district-catalogue.mjs';
import {migrateJourneyCamera} from './semantic-migration.mjs';
import {clampTransform, fitRegionScale, sceneScaleLimits} from './viewport.mjs';

// Both modes resolve the same district-local catalogue. The old level-wide
// scene coordinates remain a compatibility detail outside the renderer.
export function resolveGameContext(levels, {mode, campaign, continuous}) {
  const levelId = mode === 'continuous' ? continuous.levelId : campaign.currentLevelId;
  const level = levels.find(item => item.id === levelId) || levels[0];
  const progress = mode === 'continuous' ? continuous : campaign.levels[level.id];
  const district = level.districts.find(item => item.id === progress.districtState?.activeDistrictId) || level.districts[0];
  const allTargets = localTargetsInLevelOrder(level);
  const targets = mode === 'continuous'
    ? continuous.targetIds.map(id => allTargets.find(target => target.id === id)).filter(Boolean)
    : allTargets;
  return {level, progress, district, targets, allTargets};
}

export function hydrateDistrictProgress(progress, level, options = {}) {
  if (progress.legacyCamera) {
    const {contentVersion, camera} = progress.legacyCamera;
    const migrated = migrateJourneyCamera(camera, level, {...options, contentVersion});
    if (migrated.legacyCamera) return {...progress, districtState: progress.districtState || migrated.districtState};
    const {legacyCamera, ...resolved} = progress;
    return {...resolved, districtState: migrated.districtState, camera: migrated.districtState.cameras[migrated.districtState.activeDistrictId]};
  }
  if (progress.districtState) return progress;
  let districtState = createDistrictState(level);
  if (progress.camera) districtState = saveDistrictCamera(districtState, districtState.activeDistrictId, progress.camera);
  return {...progress, districtState};
}

export function snapshotDistrictProgress(progress, districtState, camera) {
  return {...progress, camera: camera ? {...camera} : null,
    districtState: saveDistrictCamera(districtState, districtState.activeDistrictId, camera)};
}

export function focusDistrictTarget(progress, level, targetId, {viewport, pixelRatio = 1, hint = false} = {}) {
  const district = districtForTarget(level, targetId);
  if (!district) return progress;
  const hydrated = hydrateDistrictProgress(progress, level, {viewport, pixelRatio});
  let districtState = selectDistrict(hydrated.districtState, level, district.id);
  if (hint && viewport?.width > 0 && viewport?.height > 0) {
    const region = district.targets.find(target => target.id === targetId).hintRegion;
    const scale = fitRegionScale(viewport, region, sceneScaleLimits(viewport, district, pixelRatio));
    const camera = clampTransform({
      x: viewport.width / 2 - (region.x + region.width / 2) * scale,
      y: viewport.height / 2 - (region.y + region.height / 2) * scale,
      scale,
    }, viewport, district);
    districtState = saveDistrictCamera(districtState, district.id, camera);
  }
  return {...hydrated, districtState};
}

const notices = {
  en: {
    migrated: 'Your save was migrated to districts. Compatible progress has been preserved.',
    updated: 'This scene now uses districts. Your compatible progress has been preserved.',
    'progress-reset': 'Some saved scenes were incompatible with this update. Their finds, clues, time, and camera were reset. Compatible progress was kept.',
    'migration-required-art': 'Your original Journey save is protected while matching artwork is prepared. You can explore, but new Journey progress is not being saved.',
    'migration-invalid': 'Your original Journey save is protected because it could not be migrated safely. You can explore, but new Journey progress is not being saved.',
    'continuous-migration-ambiguous': 'Your original Continuous save is protected because its artwork version cannot be identified safely. Its seed, round, score, time, and clue budget remain in the protected save. You can play a temporary challenge; old finds and clues were not transferred. New Continuous progress is not being saved.',
    'continuous-artwork-migration-protected': 'Your original Continuous save is protected because some old objects are absent from the new artwork. Compatible finds and clues, seed, round, score, time, and clue budget were preserved in this temporary round. New Continuous progress is not being saved.',
    'recovered-round': 'Recovered round: unavailable historical targets were removed. Compatible finds and clues, seed, round, score, time, and clue budget were preserved. If none survived, a fresh challenge was restored.',
  },
  gu: {
    migrated: 'તમારી સાચવેલી રમત વિસ્તારોમાં ખસેડાઈ છે. સુસંગત પ્રગતિ જાળવવામાં આવી છે.',
    updated: 'આ દૃશ્ય હવે વિસ્તારોમાં વહેંચાયું છે. તમારી સુસંગત પ્રગતિ જાળવવામાં આવી છે.',
    'progress-reset': 'આ અપડેટ સાથે સુસંગત ન હોય તેવાં દૃશ્યોની શોધ, ઈશારા, સમય અને કેમેરા ફરીથી શરૂ થયા છે. સુસંગત પ્રગતિ જાળવવામાં આવી છે.',
    'migration-required-art': 'મેળ ખાતું ચિત્ર તૈયાર થાય ત્યાં સુધી તમારી મૂળ સફર સુરક્ષિત છે. તમે રમી શકો છો, પણ સફરની નવી પ્રગતિ સચવાતી નથી.',
    'migration-invalid': 'તમારી મૂળ સફર સુરક્ષિત રીતે ખસેડી શકાઈ નથી, તેથી તે સુરક્ષિત રાખી છે. તમે રમી શકો છો, પણ સફરની નવી પ્રગતિ સચવાતી નથી.',
    'continuous-migration-ambiguous': 'ચિત્રનું જૂનું સંસ્કરણ ચોક્કસ જાણી શકાતું નથી, તેથી તમારી મૂળ અનંત શોધ સુરક્ષિત છે. મૂળ સીડ, રાઉન્ડ, સ્કોર, સમય અને બાકી ઈશારા સુરક્ષિત સાચવણમાં છે. તમે હંગામી પડકાર રમી શકો છો; જૂની શોધ કે ઈશારા ખસેડ્યા નથી. અનંત શોધની નવી પ્રગતિ સચવાતી નથી.',
    'continuous-artwork-migration-protected': 'નવા ચિત્રમાં કેટલીક જૂની વસ્તુઓ નથી, તેથી તમારી મૂળ અનંત શોધ સુરક્ષિત છે. આ હંગામી રાઉન્ડમાં સુસંગત શોધ અને ઈશારા, સીડ, રાઉન્ડ, સ્કોર, સમય અને બાકી ઈશારા જાળવ્યાં છે. અનંત શોધની નવી પ્રગતિ સચવાતી નથી.',
    'recovered-round': 'પુનઃપ્રાપ્ત રાઉન્ડ: ઉપલબ્ધ ન હોય તેવાં જૂનાં લક્ષ્યો દૂર કર્યાં છે. સુસંગત શોધ અને ઈશારા, સીડ, રાઉન્ડ, સ્કોર, સમય અને બાકી ઈશારા જાળવ્યાં છે. એકપણ લક્ષ્ય ન બચ્યું હોય તો નવો પડકાર પુનઃસ્થાપિત કર્યો છે.',
  },
};

export function migrationNotice(warning, locale = 'en') {
  return (notices[locale] || notices.en)[warning] || '';
}

export function targetPreview(target, level, loadedDistrictId, locale = 'en') {
  const district = districtForTarget(level, target.id);
  const crop = target.thumbnailCrop;
  const x = Math.max(0, Math.min(district.width, crop.x));
  const y = Math.max(0, Math.min(district.height, crop.y));
  const width = Math.max(0, Math.min(district.width, crop.x + crop.width) - x);
  const height = Math.max(0, Math.min(district.height, crop.y + crop.height) - y);
  return {
    available: district.id === loadedDistrictId && width > 0 && height > 0,
    image: district.image,
    crop: {x, y, width, height},
    message: locale === 'gu' ? 'પૂર્વદર્શન માટે વિસ્તાર ખોલો' : 'Open district to preview',
  };
}

export function createGameState(targets) {
  return {
    remaining: targets.map((target) => target.id),
    found: [],
    hints: 3,
    complete: targets.length === 0,
  };
}

export function findTarget(state, targetId) {
  if (!state.remaining.includes(targetId)) return state;

  const remaining = state.remaining.filter((id) => id !== targetId);
  return {
    ...state,
    remaining,
    found: [...state.found, targetId],
    complete: remaining.length === 0,
  };
}

export function spendHint(state, random = Math.random) {
  if (state.hints <= 0 || state.remaining.length === 0) {
    return { state, targetId: null };
  }

  const index = Math.min(
    state.remaining.length - 1,
    Math.floor(random() * state.remaining.length),
  );

  return {
    state: { ...state, hints: state.hints - 1 },
    targetId: state.remaining[index],
  };
}

export function formatElapsed(milliseconds) {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
