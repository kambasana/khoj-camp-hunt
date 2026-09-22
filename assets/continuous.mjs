import {applyContinuousClue, continuousAssistanceBonus} from './assistance.mjs';
import {createDistrictState} from './district-state.mjs';
import {isValidContinuousState, migrateContinuousV1} from './semantic-migration.mjs';

export const CONTINUOUS_SAVE_KEY = 'hidden-gujarat-continuous-v1';

const SCHEMA_VERSION = 1;
const normalizeSeed = (seed) => (Number.isFinite(seed) ? Math.trunc(seed) >>> 0 : Date.now() >>> 0);
const targetCountForRound = (round) => Math.min(10, 5 + round);
const hintsForRound = (round) => round <= 2 ? 3 : round <= 5 ? 2 : 1;

function randomFor(seed, round) {
  let value = (normalizeSeed(seed) ^ Math.imul(round, 0x9e3779b9)) >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ next >>> 15, next | 1);
    next ^= next + Math.imul(next ^ next >>> 7, next | 61);
    return ((next ^ next >>> 14) >>> 0) / 4294967296;
  };
}

function shuffled(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function generateContinuousRound(levels, seed, round, previousLevelId = null) {
  const eligible = levels.filter((level) => Array.isArray(level.targets) && level.targets.length > 0);
  if (eligible.length === 0) throw new Error('Continuous mode needs at least one playable level.');
  const random = randomFor(seed, round);
  const scenePool = eligible.length > 1 ? eligible.filter((level) => level.id !== previousLevelId) : eligible;
  const level = scenePool[Math.floor(random() * scenePool.length)];
  const targetIds = shuffled(level.targets.map((target) => target.id), random)
    .slice(0, Math.min(targetCountForRound(round), level.targets.length));
  const targetsById = new Map(level.targets.map(target => [target.id, target]));
  const districtByTarget = Object.fromEntries(targetIds.map(id => [id, targetsById.get(id)?.districtId]));
  return { levelId: level.id, targetIds, districtByTarget };
}

function roundState(levels, seed, round, score, previousLevelId) {
  const challenge = generateContinuousRound(levels, seed, round, previousLevelId);
  const level = levels.find(item => item.id === challenge.levelId);
  return {
    schemaVersion: SCHEMA_VERSION,
    contentVersion: level.contentVersion,
    seed: normalizeSeed(seed),
    round,
    score,
    lastRoundScore: 0,
    previousLevelId,
    ...challenge,
    foundIds: [],
    hintStages: {},
    hintsRemaining: hintsForRound(round),
    elapsedMs: 0,
    camera: null,
    districtState: createDistrictState(level),
    complete: false,
  };
}

export function createContinuousRun(levels, seed = Date.now()) {
  return roundState(levels, normalizeSeed(seed), 1, 0, null);
}

export function findContinuousTarget(state, levels, targetId) {
  const level = levels.find((item) => item.id === state.levelId);
  if (state.complete || !level || !state.targetIds.includes(targetId) || state.foundIds.includes(targetId)) return state;
  const foundIds = [...state.foundIds, targetId];
  const complete = foundIds.length === state.targetIds.length;
  const bonus = complete ? 500 + continuousAssistanceBonus(state.hintStages) : 0;
  const score = state.score + 100 + bonus;
  return {
    ...state,
    foundIds,
    complete,
    score,
    lastRoundScore: complete ? foundIds.length * 100 + bonus : 0,
  };
}

export function useContinuousHint(state, levels, targetId) {
  const {blocked, ...legacy} = applyContinuousClue(state, levels, targetId, {unlimitedClues: false});
  return legacy;
}

export function advanceContinuousRound(state, levels) {
  return protectFallback(state, roundState(levels, state.seed, state.round + 1, state.score, state.levelId));
}

const protectFallback = (previous, next) => previous.migrationBlocked ? {...next, migrationBlocked: previous.migrationBlocked} : next;

export function restartContinuousRun(state, levels, seed = Date.now()) {
  return protectFallback(state, createContinuousRun(levels, seed));
}

export function saveContinuousProgress(storage, state) {
  if (state.migrationBlocked) return {saved: false, warning: state.migrationBlocked};
  try {
    storage.setItem(CONTINUOUS_SAVE_KEY, JSON.stringify(state));
    return { saved: true, warning: null };
  } catch {
    return { saved: false, warning: 'storage' };
  }
}

function isValidState(state, levels) {
  return isValidContinuousState(state, levels);
}

function normalizedRestoredState(state) {
  if (!state || typeof state !== 'object') return state;
  const hintStages = state.hintStages === undefined ? {} : state.hintStages;
  const spent = hintStages && typeof hintStages === 'object' ? Object.values(hintStages).reduce((sum, stage) => sum + ([1, 2].includes(stage) ? stage : 0), 0) : 0;
  return {
    ...state,
    hintStages,
    hintsRemaining: state.hintsRemaining === undefined && Number.isInteger(state.round) ? Math.max(0, hintsForRound(state.round) - spent) : state.hintsRemaining,
  };
}

export function loadContinuousProgress(storage, levels, fallbackSeed = Date.now()) {
  const fresh = () => createContinuousRun(levels, fallbackSeed);
  try {
    const text = storage.getItem(CONTINUOUS_SAVE_KEY);
    if (!text) return { state: fresh(), restored: false, warning: null };
    const state = normalizedRestoredState(JSON.parse(text));
    if (isValidState(state, levels)) return { state: {...state, contentVersion: levels.find(level => level.id === state.levelId).contentVersion}, restored: true, warning: null };
    const migration = migrateContinuousV1(state, levels);
    if (!migration.state || !isValidState(migration.state, levels)) return { state: fresh(), restored: false, warning: 'invalid' };
    return { state: migration.state, restored: migration.migrated, warning: migration.warning };
  } catch (error) {
    return { state: fresh(), restored: false, warning: error instanceof SyntaxError ? 'invalid' : 'storage' };
  }
}
