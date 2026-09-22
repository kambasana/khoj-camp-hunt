import {createDistrictState} from './district-state.mjs';
import {clampTransform, sceneScaleLimits} from './viewport.mjs';
import {generateContinuousRound} from './continuous.mjs';
import {historicalCatalogues} from './historical-catalogues.mjs';
import {navratriV4Map, navratriV4Catalogue} from './navratri-v4-catalogue.mjs';
import {ahmedabadV4Map, ahmedabadV4Catalogue} from './ahmedabad-v4-catalogue.mjs';
import {jamnagarV4Map, jamnagarV4Catalogue} from './jamnagar-v4-catalogue.mjs';
import {kutchV4Map, kutchV4Catalogue} from './kutch-v4-catalogue.mjs';

const artworkCutovers = Object.freeze({
  navratri: Object.freeze({contentVersion: 5, sourceVersions: Object.freeze([3,4]), map: navratriV4Map, catalogue: navratriV4Catalogue}),
  ahmedabad: Object.freeze({contentVersion: 5, sourceVersions: Object.freeze([3,4]), map: ahmedabadV4Map, catalogue: ahmedabadV4Catalogue}),
  jamnagar: Object.freeze({contentVersion: 5, sourceVersions: Object.freeze([3,4]), map: jamnagarV4Map, catalogue: jamnagarV4Catalogue}),
  kutch: Object.freeze({contentVersion: 5, sourceVersions: Object.freeze([3,4]), map: kutchV4Map, catalogue: kutchV4Catalogue}),
});

export function artworkCutoverFor(level, version) {
  const cutover = artworkCutovers[level?.id];
  return cutover && level.contentVersion === cutover.contentVersion && cutover.sourceVersions.includes(version) ? cutover : null;
}

// Authoritative catalogue: 5033130 (contentVersion 2), levels.mjs plus
// extra-levels.mjs. Numeric suffixes were reused for DIFFERENT objects in v3.
// Rows are deliberately explicit; never derive a destination from ID equality.
const present = (legacyId, sourceName, targetId, districtId, targetName = sourceName) =>
  [legacyId, Object.freeze({outcome: legacyId === targetId ? 'same' : 'mapped', sourceName, targetId, districtId, targetName, requiresArt: false})];
const art = (legacyId, sourceName, targetId, districtId, evidence = {}) =>
  [legacyId, Object.freeze({outcome: 'mapped', sourceName, targetId, districtId, targetName: sourceName, requiresArt: true, ...evidence})];
const table = rows => Object.freeze(Object.fromEntries(rows));

export const legacyTargetMap = Object.freeze({
  navratri: table([
    present('navratri-1', 'Rooftop cat', 'navratri-1', 'navratri-district-1'),
    present('navratri-2', 'Basket cat', 'navratri-basket-cat', 'navratri-district-2'),
    present('navratri-3', 'White goat', 'navratri-2', 'navratri-district-1'),
    present('navratri-4', 'Brown dog', 'navratri-brown-dog', 'navratri-district-2'),
    present('navratri-5', 'Striped pot', 'navratri-striped-pot', 'navratri-district-2'),
    present('navratri-6', 'Blue kite', 'navratri-blue-kite', 'navratri-district-3'),
    present('navratri-7', 'Red-green kite', 'navratri-red-green-kite', 'navratri-district-3'),
    present('navratri-8', 'Green turban', 'navratri-green-turban', 'navratri-district-3'),
    present('navratri-9', 'Golden canopy top', 'navratri-golden-canopy-top', 'navratri-district-4'),
    // Same painted vessel beside the wicker baskets: old (1308,939,42,54),
    // current panel-1 (1308,941,42,50). Renaming did not change its identity.
    present('navratri-10', 'Patterned vessel', 'navratri-3', 'navratri-district-1', 'Painted little pot'),
  ]),
  ahmedabad: table([
    present('ahmedabad-1', 'Ledge cat', 'ahmedabad-ledge-cat', 'ahmedabad-district-1'),
    present('ahmedabad-2', 'Purple bird', 'ahmedabad-purple-bird', 'ahmedabad-district-2'),
    present('ahmedabad-3', 'Telescope', 'ahmedabad-2', 'ahmedabad-district-1'),
    present('ahmedabad-4', 'Resting dog', 'ahmedabad-resting-dog', 'ahmedabad-district-2'),
    present('ahmedabad-5', 'Blue bag', 'ahmedabad-1', 'ahmedabad-district-1'),
    present('ahmedabad-6', 'Lotus pond', 'ahmedabad-lotus-pond', 'ahmedabad-district-2'),
    present('ahmedabad-7', 'Orange kite', 'ahmedabad-orange-kite', 'ahmedabad-district-3'),
    present('ahmedabad-8', 'Yellow reel', 'ahmedabad-yellow-reel', 'ahmedabad-district-3'),
    present('ahmedabad-9', 'Purple bucket', 'ahmedabad-purple-bucket', 'ahmedabad-district-3'),
    present('ahmedabad-10', 'Pink kite', 'ahmedabad-pink-kite', 'ahmedabad-district-4'),
  ]),
  jamnagar: table([
    present('jamnagar-1', 'Rooftop peacock', 'jamnagar-1', 'jamnagar-district-1'),
    // Same sleeping dark cat on the far-left ledge: old (17,223,48,27),
    // current panel-1 (17,224,53,28); the current clue still describes a nap.
    present('jamnagar-2', 'Sleeping cat', 'jamnagar-3', 'jamnagar-district-1', 'Black cat'),
    present('jamnagar-3', 'Resting dog', 'jamnagar-resting-dog', 'jamnagar-district-2'),
    present('jamnagar-4', 'Sewing machine', 'jamnagar-2', 'jamnagar-district-1'),
    present('jamnagar-5', 'Silver pail', 'jamnagar-silver-pail', 'jamnagar-district-2'),
    present('jamnagar-6', 'Camel', 'jamnagar-camel', 'jamnagar-district-2'),
    present('jamnagar-7', 'Magenta dye', 'jamnagar-magenta-dye', 'jamnagar-district-3'),
    present('jamnagar-8', 'Indigo dye', 'jamnagar-indigo-dye', 'jamnagar-district-3'),
    present('jamnagar-9', 'Cotton basket', 'jamnagar-cotton-basket', 'jamnagar-district-3'),
    present('jamnagar-10', 'Silver tea urn', 'jamnagar-silver-tea-urn', 'jamnagar-district-4'),
    present('jamnagar-11', 'Blue cloth', 'jamnagar-blue-cloth', 'jamnagar-district-4'),
    present('jamnagar-12', 'Bangle display', 'jamnagar-bangle-display', 'jamnagar-district-4'),
  ]),
  kutch: table([
    present('kutch-1', 'White goats', 'kutch-white-goats', 'kutch-district-1'),
    present('kutch-2', 'Black goat', 'kutch-1', 'kutch-district-1'),
    present('kutch-3', 'Brown goat', 'kutch-brown-goat', 'kutch-district-1'),
    present('kutch-4', 'Seated camel', 'kutch-seated-camel', 'kutch-district-2'),
    present('kutch-5', 'Potter’s wheel', 'kutch-potters-wheel', 'kutch-district-2'),
    present('kutch-6', 'Round drum', 'kutch-round-drum', 'kutch-district-2'),
    present('kutch-7', 'String musician', 'kutch-string-musician', 'kutch-district-3'),
    present('kutch-8', 'Toy elephant', 'kutch-toy-elephant', 'kutch-district-3'),
    present('kutch-9', 'Hobby-horse child', 'kutch-hobby-horse-child', 'kutch-district-3'),
    present('kutch-10', 'Colourful parasol', 'kutch-colourful-parasol', 'kutch-district-4'),
    present('kutch-11', 'Carved seats', 'kutch-carved-seats', 'kutch-district-4'),
    present('kutch-12', 'Loom', 'kutch-loom', 'kutch-district-4'),
  ]),
  junagadh: table([
    present('junagadh-1', 'Wall monkey', 'junagadh-1', 'junagadh-district-1'),
    art('junagadh-2', 'Gateway monkey', 'junagadh-gateway-monkey', 'junagadh-district-2'),
    art('junagadh-3', 'Balcony monkey', 'junagadh-balcony-monkey', 'junagadh-district-2'),
    present('junagadh-4', 'White cow', 'junagadh-3', 'junagadh-district-1'),
    present('junagadh-5', 'Bicycle', 'junagadh-2', 'junagadh-district-1'),
    art('junagadh-6', 'Juice press', 'junagadh-juice-press', 'junagadh-district-2'),
    art('junagadh-7', 'Three glasses', 'junagadh-three-glasses', 'junagadh-district-3'),
    art('junagadh-8', 'Banana basket', 'junagadh-banana-basket', 'junagadh-district-3'),
    art('junagadh-9', 'Woven tray', 'junagadh-woven-tray', 'junagadh-district-3'),
    art('junagadh-10', 'Hanging pan', 'junagadh-hanging-pan', 'junagadh-district-4'),
    art('junagadh-11', 'Dark spices', 'junagadh-dark-spices', 'junagadh-district-4'),
    art('junagadh-12', 'Red spices', 'junagadh-red-spices', 'junagadh-district-4'),
  ]),
  surat: table([
    art('surat-1', 'Jalebi pan', 'surat-jalebi-pan', 'surat-district-1'),
    art('surat-2', 'Vegetable pan', 'surat-vegetable-pan', 'surat-district-1'),
    art('surat-3', 'White sweets', 'surat-white-sweets', 'surat-district-2'),
    art('surat-4', 'Four dosas', 'surat-four-dosas', 'surat-district-2'),
    art('surat-5', 'Green basket', 'surat-green-basket', 'surat-district-2'),
    art('surat-6', 'Cane press', 'surat-cane-press', 'surat-district-3'),
    art('surat-7', 'Juice glass', 'surat-juice-glass', 'surat-district-3'),
    art('surat-8', 'Clay pot', 'surat-clay-pot', 'surat-district-3'),
    art('surat-9', 'Tea tray', 'surat-tea-tray', 'surat-district-4'),
    // Two separate stools share the same name: the v2 object is under the
    // grey-shirted diner, NOT current surat-2 under the turquoise-shirted diner
    // at (407,494,56,65). Name equality alone is not object identity.
    art('surat-10', 'Red stool', 'surat-grey-diner-red-stool', 'surat-district-1', {
      sourceBounds: Object.freeze({x: 304, y: 479, width: 34, height: 55}),
      sourceContext: 'Red stool under the grey-shirted diner at the left side of the shared dining table; distinct from the turquoise-shirted diner’s red stool.',
    }),
    art('surat-11', 'Hanging lantern', 'surat-hanging-lantern', 'surat-district-4'),
    art('surat-12', 'Khaman display', 'surat-khaman-display', 'surat-district-4'),
  ]),
  patan: table([
    art('patan-1', 'Courtyard cat', 'patan-courtyard-cat', 'patan-district-1'),
    art('patan-2', 'Left duck', 'patan-left-duck', 'patan-district-1'),
    art('patan-3', 'Right duck', 'patan-right-duck', 'patan-district-1'),
    art('patan-4', 'Roof pigeon', 'patan-roof-pigeon', 'patan-district-2'),
    art('patan-5', 'Perched pigeon', 'patan-perched-pigeon', 'patan-district-2'),
    art('patan-6', 'Resting pigeon', 'patan-resting-pigeon', 'patan-district-2'),
    art('patan-7', 'Large wheel', 'patan-large-wheel', 'patan-district-3'),
    art('patan-8', 'Small wheel', 'patan-small-wheel', 'patan-district-3'),
    art('patan-9', 'Yellow dye', 'patan-yellow-dye', 'patan-district-3'),
    art('patan-10', 'Red dye', 'patan-red-dye', 'patan-district-3'),
    art('patan-11', 'Head-carried pots', 'patan-head-carried-pots', 'patan-district-4'),
    art('patan-12', 'White bull', 'patan-white-bull', 'patan-district-4'),
    art('patan-13', 'Green spools', 'patan-green-spools', 'patan-district-4'),
    art('patan-14', 'Brass water pot', 'patan-brass-water-pot', 'patan-district-4'),
  ]),
  garba: table([
    art('garba-1', 'Left speaker', 'garba-left-speaker', 'garba-district-1'),
    art('garba-2', 'Right speaker', 'garba-right-speaker', 'garba-district-1'),
    art('garba-3', 'Pink lantern', 'garba-pink-lantern', 'garba-district-1'),
    art('garba-4', 'Table mirror', 'garba-table-mirror', 'garba-district-2'),
    art('garba-5', 'Lotus flower', 'garba-lotus-flower', 'garba-district-2'),
    art('garba-6', 'Small mirror', 'garba-small-mirror', 'garba-district-2'),
    art('garba-7', 'Blue dancer', 'garba-blue-dancer', 'garba-district-3'),
    art('garba-8', 'Yellow dancer', 'garba-yellow-dancer', 'garba-district-3'),
    art('garba-9', 'Outfit helper', 'garba-outfit-helper', 'garba-district-3'),
    art('garba-10', 'Man in purple', 'garba-man-in-purple', 'garba-district-3'),
    art('garba-11', 'Golden lamp', 'garba-golden-lamp', 'garba-district-4'),
    art('garba-12', 'Stage singer', 'garba-stage-singer', 'garba-district-4'),
    art('garba-13', 'Stage drum', 'garba-stage-drum', 'garba-district-4'),
    art('garba-14', 'Pink dancer', 'garba-pink-dancer', 'garba-district-4'),
  ]),
});

// Machine-readable artwork backlog, NOT fictitious playable target records.
// Existing same-object mappings also need to survive replacement/approval.
export const requiredArt = Object.freeze(Object.entries(legacyTargetMap).flatMap(([levelId, mappings]) =>
  Object.entries(mappings).filter(([, mapping]) => mapping.requiresArt).map(([legacyId, mapping]) =>
    Object.freeze({levelId, legacyId, ...mapping}))));

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validCamera = camera => record(camera) && ['x', 'y', 'scale'].every(key => Number.isFinite(camera[key])) && camera.scale > 0 && camera.scale <= 8;
const validViewport = viewport => record(viewport) && ['width', 'height'].every(key => Number.isFinite(viewport[key]) && viewport[key] > 0);
const stitchedOrigins = [[384, 256], [1920, 256], [384, 1280], [1920, 1280]];

export function migrateJourneyCamera(camera, level, {contentVersion = 2, viewport, pixelRatio = 1} = {}) {
  const districtState = createDistrictState(level);
  if (!camera) return {districtState};
  if (!validCamera(camera) || ![2, 3].includes(contentVersion)) throw new Error('Invalid legacy camera');
  if (!validViewport(viewport)) return {districtState, legacyCamera: {contentVersion, camera: {...camera}}};
  const focus = {x: (viewport.width / 2 - camera.x) / camera.scale, y: (viewport.height / 2 - camera.y) / camera.scale};
  // v2 was one native panel. v3 used four native panels inside a matte.
  // Outside the panels, choose the nearest panel then clamp the focus inside it.
  const origins = contentVersion === 3 ? stitchedOrigins : [[0, 0]];
  let index = 0, distance = Infinity;
  origins.forEach(([x, y], candidate) => {
    const dx = Math.max(x - focus.x, 0, focus.x - x - 1536);
    const dy = Math.max(y - focus.y, 0, focus.y - y - 1024);
    if (dx * dx + dy * dy < distance) {distance = dx * dx + dy * dy; index = candidate;}
  });
  const district = level.districts[index], [originX, originY] = origins[index];
  const limits = sceneScaleLimits(viewport, district, pixelRatio);
  const scale = Math.max(limits.min, Math.min(limits.max, camera.scale));
  // Preserve relative local focus if the approved replacement is larger.
  const x = Math.max(0, Math.min(1536, focus.x - originX)) * district.width / 1536;
  const y = Math.max(0, Math.min(1024, focus.y - originY)) * district.height / 1024;
  districtState.activeDistrictId = district.id;
  districtState.cameras[district.id] = clampTransform({x: viewport.width / 2 - x * scale, y: viewport.height / 2 - y * scale, scale}, viewport, district);
  return {districtState};
}

function destination(level, mapping) {
  const targets = level.targets.filter(target => target.id === mapping.targetId);
  const district = level.districts?.find(item => item.id === mapping.districtId);
  const matches = target => target?.name?.en === mapping.targetName && target.districtId === mapping.districtId;
  return targets.length === 1 && matches(targets[0]) && district?.targets?.filter(target => target.id === mapping.targetId && matches(target)).length === 1;
}

const continuousHintsForRound = round => round <= 2 ? 3 : round <= 5 ? 2 : 1;

function directTargetDistrict(level, targetId) {
  const targets = level?.targets?.filter(target => target?.id === targetId) || [];
  const target = targets.length === 1 ? targets[0] : null;
  const districts = level?.districts?.filter(district =>
    district?.id === target?.districtId && district?.targets?.filter(item => item?.id === targetId).length === 1) || [];
  return districts.length === 1 ? target.districtId : null;
}

function validDistrictState(state, level) {
  if (!record(state) || !record(state.cameras) || !Array.isArray(level?.districts)) return false;
  const ids = level.districts.map(district => district?.id);
  if (ids.some(id => typeof id !== 'string') || !ids.includes(state.activeDistrictId)) return false;
  const cameraIds = Object.keys(state.cameras);
  return cameraIds.length === ids.length && ids.every(id => Object.hasOwn(state.cameras, id) &&
    (state.cameras[id] === null || validCamera(state.cameras[id])));
}

export function isValidContinuousState(state, levels) {
  if (!record(state) || state.schemaVersion !== 1 || !Number.isInteger(state.seed) || state.seed < 0 ||
      !Number.isInteger(state.round) || state.round < 1 || !Array.isArray(levels)) return false;
  const level = levels.find(item => item?.id === state.levelId);
  if (state.contentVersion !== undefined && state.contentVersion !== level?.contentVersion) return false;
  if (!level || !Array.isArray(state.targetIds) || state.targetIds.length === 0 ||
      new Set(state.targetIds).size !== state.targetIds.length || !record(state.districtByTarget)) return false;
  const districtKeys = Object.keys(state.districtByTarget);
  if (districtKeys.length !== state.targetIds.length || !state.targetIds.every(id => {
    const districtId = directTargetDistrict(level, id);
    return districtId !== null && Object.hasOwn(state.districtByTarget, id) && state.districtByTarget[id] === districtId;
  })) return false;
  if (!validDistrictState(state.districtState, level)) return false;
  if (!Array.isArray(state.foundIds) || new Set(state.foundIds).size !== state.foundIds.length ||
      !state.foundIds.every(id => state.targetIds.includes(id))) return false;
  if (!record(state.hintStages) || Object.entries(state.hintStages).some(([id, stage]) =>
    !state.targetIds.includes(id) || ![1, 2].includes(stage))) return false;
  if (!Number.isInteger(state.hintsRemaining) || state.hintsRemaining < 0 ||
      state.hintsRemaining > continuousHintsForRound(state.round)) return false;
  if (!Number.isFinite(state.score) || state.score < 0 || !Number.isFinite(state.lastRoundScore) ||
      state.lastRoundScore < 0 || !Number.isFinite(state.elapsedMs) || state.elapsedMs < 0) return false;
  if (state.complete !== (state.foundIds.length === state.targetIds.length)) return false;
  if (state.camera !== null && !validCamera(state.camera)) return false;
  if (state.legacyCamera !== undefined &&
      (!record(state.legacyCamera) || ![2, 3].includes(state.legacyCamera.contentVersion) || !validCamera(state.legacyCamera.camera))) return false;
  return state.previousLevelId === null || levels.some(item => item?.id === state.previousLevelId);
}

function validLegacyContinuousState(state, levels) {
  const historical = historicalCatalogues[3].find(level => level.id === state?.levelId);
  const knownIds = new Set(historical?.targets.map(target => target.id));
  if (!record(state) || state.schemaVersion !== 1 || !historical || !Number.isInteger(state.seed) || state.seed < 0 ||
      !Number.isInteger(state.round) || state.round < 1 || !Array.isArray(state.targetIds) || state.targetIds.length === 0 ||
      new Set(state.targetIds).size !== state.targetIds.length || !state.targetIds.every(id => knownIds.has(id))) return false;
  if (!Array.isArray(state.foundIds) || new Set(state.foundIds).size !== state.foundIds.length ||
      !state.foundIds.every(id => state.targetIds.includes(id))) return false;
  if (!record(state.hintStages) || Object.entries(state.hintStages).some(([id, stage]) =>
    !state.targetIds.includes(id) || ![1, 2].includes(stage))) return false;
  if (!Number.isInteger(state.hintsRemaining) || state.hintsRemaining < 0 ||
      state.hintsRemaining > continuousHintsForRound(state.round)) return false;
  if (!Number.isFinite(state.score) || state.score < 0 || !Number.isFinite(state.lastRoundScore) ||
      state.lastRoundScore < 0 || !Number.isFinite(state.elapsedMs) || state.elapsedMs < 0) return false;
  if (state.complete !== (state.foundIds.length === state.targetIds.length)) return false;
  if (state.camera !== null && !validCamera(state.camera)) return false;
  return state.previousLevelId === null || levels.some(item => item?.id === state.previousLevelId);
}

function continuousCamera(camera, level, contentVersion = 2) {
  if (!camera) return {districtState: createDistrictState(level), camera: null};
  const migrated = migrateJourneyCamera(camera, level, {contentVersion});
  return {...migrated, camera: migrated.districtState.cameras[migrated.districtState.activeDistrictId]};
}

function legacyContinuousVersion(raw) {
  const candidates = [2, 3].filter(version => {
    const level = historicalCatalogues[version].find(level => level.id === raw.levelId);
    return raw.targetIds.every(id => level.targets.some(target => target.id === id));
  });
  if (raw.contentVersion !== undefined) return candidates.includes(raw.contentVersion) ? raw.contentVersion : null;
  if (candidates.length === 1) return candidates[0];
  // The old RNG and catalogue order are frozen. Match the full ordered round,
  // not a guessed ID range or a camera position that can occur in both eras.
  const matching = candidates.filter(version => {
    const challenge = generateContinuousRound(historicalCatalogues[version], raw.seed, raw.round, raw.previousLevelId);
    return challenge.levelId === raw.levelId && challenge.targetIds.length === raw.targetIds.length &&
      challenge.targetIds.every((id, index) => id === raw.targetIds[index]);
  });
  return matching.length === 1 ? matching[0] : null;
}

function continuousMappings(level, contentVersion) {
  if (contentVersion === 2) return legacyTargetMap[level.id];
  const cutover = artworkCutoverFor(level, contentVersion);
  if (cutover) return cutover.map;
  const historical = historicalCatalogues[3].find(item => item.id === level.id);
  return Object.fromEntries(historical.targets.map(target => [target.id, {
    targetId: target.id, targetName: target.name, districtId: directTargetDistrict(level, target.id),
  }]));
}

export function migrateContinuousV1(raw, levels) {
  const failure = warning => ({state: null, migrated: false, warning, sourcePreserved: true});
  if (!record(raw) || !Array.isArray(levels) || !levels.length) return failure('migration-invalid');
  let state;
  try {state = structuredClone(raw);} catch {return failure('migration-invalid');}
  const level = levels.find(item => item.id === raw.levelId);
  if (!level) return failure('migration-invalid');
  const hasDistrictProvenance = Object.hasOwn(raw,'districtByTarget') || Object.hasOwn(raw,'districtState');
  const declaredCutover = artworkCutoverFor(level, raw.contentVersion ?? (hasDistrictProvenance ? 4 : null));
  const districtCutover = Boolean(declaredCutover) && hasDistrictProvenance;
  if (Object.hasOwn(raw, 'districtByTarget') || Object.hasOwn(raw, 'districtState')) {
    if (districtCutover) {
      const oldLevels = levels.map(item => item.id === level.id ? declaredCutover.catalogue : item);
      if (!isValidContinuousState({...state,contentVersion:declaredCutover.catalogue.contentVersion},oldLevels)) return failure('migration-invalid');
    } else {
      if (state.contentVersion === undefined) state.contentVersion = level.contentVersion;
      return isValidContinuousState(state, levels)
        ? {state, migrated: false, warning: null, sourcePreserved: true}
        : failure('migration-invalid');
    }
  }
  if (!districtCutover && !validLegacyContinuousState(raw, levels)) return failure('migration-invalid');
  const contentVersion = districtCutover ? declaredCutover.catalogue.contentVersion : legacyContinuousVersion(raw);
  if (!contentVersion) {
    // Keep the original bytes in storage. This challenge is explicitly
    // temporary and cannot transfer ambiguous finds or hints to other objects.
    const challenge = generateContinuousRound(levels, raw.seed, raw.round, raw.previousLevelId);
    const fallbackLevel = levels.find(level => level.id === challenge.levelId);
    state = {...state, ...challenge, contentVersion: fallbackLevel.contentVersion,
      foundIds: [], hintStages: {}, complete: false, camera: null,
      districtState: createDistrictState(fallbackLevel), migrationBlocked: 'continuous-migration-ambiguous'};
    return {state, migrated: false, warning: state.migrationBlocked, sourcePreserved: true};
  }
  const sourceCutover = artworkCutoverFor(level, contentVersion);
  state.contentVersion = level.contentVersion;
  const mappings = continuousMappings(level, contentVersion);
  const mapped = raw.targetIds.map(id => ({legacyId: id, mapping: mappings[id]}));
  const available = mapped.filter(({mapping}) => destination(level, mapping));
  if (available.length !== mapped.length) {
    const challenge = available.length
      ? {
          levelId: level.id,
          targetIds: available.map(({mapping}) => mapping.targetId),
          districtByTarget: Object.fromEntries(available.map(({mapping}) => [mapping.targetId, mapping.districtId])),
        }
      : generateContinuousRound(levels, raw.seed, raw.round, raw.previousLevelId);
    const targetByLegacyId = Object.fromEntries(available.map(({legacyId, mapping}) => [legacyId, mapping.targetId]));
    const foundIds = raw.foundIds.filter(id => Object.hasOwn(targetByLegacyId, id)).map(id => targetByLegacyId[id]);
    const hintStages = Object.fromEntries(Object.entries(raw.hintStages)
      .filter(([id]) => Object.hasOwn(targetByLegacyId, id))
      .map(([id, stage]) => [targetByLegacyId[id], stage]));
    const recoveredLevel = levels.find(item => item.id === challenge.levelId);
    const camera = recoveredLevel.id === raw.levelId
      ? districtCutover ? {districtState:structuredClone(raw.districtState),camera:raw.camera} : continuousCamera(raw.camera, recoveredLevel, contentVersion)
      : {districtState: createDistrictState(recoveredLevel), camera: null};
    state = {
      ...state,
      ...challenge,
      contentVersion: recoveredLevel.contentVersion,
      foundIds,
      hintStages,
      complete: foundIds.length === challenge.targetIds.length,
      ...camera,
      ...(sourceCutover ? {migrationBlocked:'continuous-artwork-migration-protected'} : {}),
    };
    return isValidContinuousState(state, levels)
      ? {state, migrated: false, warning: sourceCutover ? state.migrationBlocked : 'recovered-round', sourcePreserved: true}
      : failure('migration-invalid');
  }
  const targetIds = mapped.map(({mapping}) => mapping.targetId);
  const targetByLegacyId = Object.fromEntries(mapped.map(({legacyId, mapping}) => [legacyId, mapping.targetId]));
  state = {
    ...state,
    targetIds,
    foundIds: raw.foundIds.map(id => targetByLegacyId[id]),
    hintStages: Object.fromEntries(Object.entries(raw.hintStages).map(([id, stage]) => [targetByLegacyId[id], stage])),
    districtByTarget: Object.fromEntries(mapped.map(({mapping}) => [mapping.targetId, mapping.districtId])),
    ...(districtCutover ? {districtState:structuredClone(raw.districtState),camera:raw.camera} : continuousCamera(raw.camera, level, contentVersion)),
  };
  return isValidContinuousState(state, levels)
    ? {state, migrated: true, warning: 'migrated', sourcePreserved: true}
    : failure('migration-invalid');
}

function validProgress(progress, validIds, historicalComplete = false) {
  if (!record(progress) || !Array.isArray(progress.foundIds) || !record(progress.hintStages)) return false;
  if (!progress.foundIds.every(id => validIds.has(id))) return false;
  if (!Object.entries(progress.hintStages).every(([id, stage]) => validIds.has(id) && [1, 2].includes(stage))) return false;
  if (!Number.isFinite(progress.elapsedMs) || progress.elapsedMs < 0 || progress.elapsedMs > 864000000) return false;
  if (!Number.isInteger(progress.hintsRemaining) || progress.hintsRemaining < 0 || progress.hintsRemaining > 3) return false;
  if (progress.camera !== null && !validCamera(progress.camera)) return false;
  return typeof progress.complete === 'boolean' && (!progress.complete || historicalComplete || new Set(progress.foundIds).size === validIds.size);
}

// Completion carries an auditable historical certificate, not a blanket
// `complete` flag. This also survives future loads with fewer mapped finds.
export function hasHistoricalCompletion(progress, level) {
  const metadata = progress?.migration, cutover = artworkCutoverFor(level, metadata?.fromContentVersion);
  const mappings = cutover ? cutover.map : legacyTargetMap[level.id];
  if (!mappings || !Array.isArray(progress?.foundIds) || metadata?.version !== 1 ||
      !(metadata.fromContentVersion === 2 || cutover) ||
      !metadata.historicalComplete || !record(metadata.outcomes)) return false;
  if (Object.keys(metadata.outcomes).length !== Object.keys(mappings).length) return false;
  return Object.entries(mappings).every(([legacyId, mapping]) =>
    metadata.outcomes[legacyId] === 'retired-completed' ||
    (metadata.outcomes[legacyId] === mapping.outcome && destination(level, mapping) && progress.foundIds.includes(mapping.targetId)));
}

export function migrateJourneyV2(raw, levels, options = {}) {
  const failure = (warning, requirements = []) => ({state: null, migrated: false, warning, sourcePreserved: true, requirements});
  if (!record(raw) || raw.schemaVersion !== 1 || !record(raw.levels) || !Array.isArray(levels) || !levels.length) return failure('migration-invalid');
  if (!Array.isArray(raw.unlockedLevelIds) || !Array.isArray(raw.clearedLevelIds) || !['en', 'gu'].includes(raw.locale)) return failure('migration-invalid');
  let state;
  try {state = structuredClone(raw);} catch {return failure('migration-invalid');}
  let migrated = false;
  const requirements = [];
  const hasCutover = levels.some(level => artworkCutoverFor(level, raw.levels[level.id]?.contentVersion));
  const deferredResets = new Set();
  for (const level of levels) {
    const old = raw.levels[level.id];
    if (!old || old.contentVersion === level.contentVersion) continue;
    // The already-reviewed v3 path remains the campaign loader's responsibility.
    if (old.contentVersion === 3 && level.contentVersion === 4) continue;
    const cutover = artworkCutoverFor(level, old.contentVersion);
    // An artwork cutover must not turn an unrelated unsupported-version
    // reset into a transaction-wide failure. The loader labels those resets.
    if (hasCutover && !cutover && old.contentVersion !== 2) {deferredResets.add(level.id); continue;}
    const mappings = cutover ? cutover.map : legacyTargetMap[level.id];
    const inheritedCompletion = cutover && old.contentVersion === cutover.catalogue.contentVersion && hasHistoricalCompletion(old, cutover.catalogue);
    if ((!cutover && (old.contentVersion !== 2 || ![4,5].includes(level.contentVersion))) || !mappings || !validProgress(old, new Set(Object.keys(mappings)), inheritedCompletion)) return failure('migration-invalid');
    if (cutover && old.contentVersion === 4 && old.districtState && !validDistrictState(old.districtState,level)) return failure('migration-invalid');
    const found = new Set(old.foundIds), historicalComplete = inheritedCompletion || found.size === Object.keys(mappings).length;
    const referenced = new Set([...found, ...Object.keys(old.hintStages)]);
    const progress = {...old, contentVersion: level.contentVersion, foundIds: [], hintStages: {}, complete: historicalComplete,
      migration: inheritedCompletion ? structuredClone(old.migration) : {version: 1, fromContentVersion: old.contentVersion, historicalComplete, outcomes: {}, retiredHintStages: {}}};
    for (const legacyId of referenced) {
      const mapping = mappings[legacyId];
      if (!destination(level, mapping)) {
        if (!historicalComplete) {requirements.push({levelId: level.id, legacyId, ...mapping, cutover: Boolean(cutover)}); continue;}
        progress.migration.outcomes[legacyId] = 'retired-completed';
        if (old.hintStages[legacyId]) progress.migration.retiredHintStages[legacyId] = old.hintStages[legacyId];
        continue;
      }
      if (!inheritedCompletion) progress.migration.outcomes[legacyId] = mapping.outcome;
      if (found.has(legacyId)) progress.foundIds.push(mapping.targetId);
      if (old.hintStages[legacyId]) progress.hintStages[mapping.targetId] = old.hintStages[legacyId];
    }
    Object.assign(progress, old.contentVersion === 4
      ? {districtState:old.districtState ? structuredClone(old.districtState) : createDistrictState(level)}
      : migrateJourneyCamera(old.camera, level, {...options, contentVersion: old.contentVersion}));
    // The old transform belongs to a different coordinate space; keep it only
    // in deferred metadata, never apply it to an arbitrary current district.
    progress.camera = progress.districtState.cameras[progress.districtState.activeDistrictId];
    state.levels[level.id] = progress;
    migrated = true;
  }
  if (requirements.length && !requirements.every(item=>item.cutover)) return failure('migration-required-art', requirements);
  // Validate the result before handing it to the normal save path.
  for (const level of levels) {
    const progress = state.levels[level.id];
    if (!progress || deferredResets.has(level.id)) continue;
    const valid = new Set(level.targets.map(target => target.id));
    const historicalComplete = hasHistoricalCompletion(progress, level);
    if (!validProgress(progress, valid, historicalComplete) ||
        (progress.migration?.historicalComplete && !historicalComplete)) return failure('migration-invalid');
  }
  if (migrated) {
    const earned = new Set(state.clearedLevelIds);
    state.clearedLevelIds = [];
    state.unlockedLevelIds = [levels[0].id];
    for (const [index, level] of levels.entries()) {
      if (!state.levels[level.id]?.complete && !earned.has(level.id)) break;
      state.clearedLevelIds.push(level.id);
      if (levels[index + 1]) state.unlockedLevelIds.push(levels[index + 1].id);
    }
    if (!state.unlockedLevelIds.includes(state.currentLevelId)) state.currentLevelId = state.unlockedLevelIds.at(-1);
  }
  if (requirements.length) return {state:{...state,migrationBlocked:'migration-required-art'},migrated:false,warning:'migration-required-art',sourcePreserved:true,requirements};
  return {state, migrated, warning: migrated ? 'migrated' : null, sourcePreserved: true};
}
