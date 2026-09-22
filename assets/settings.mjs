export const SETTINGS_KEY = 'hidden-gujarat-settings-v1';

const DEFAULT_SETTINGS = Object.freeze({
  schemaVersion: 1,
  unlimitedClues: true,
  sound: true,
  motion: 'system',
  contrast: 'standard',
  coachDismissed: false,
  updatedAt: 0,
});

const validValues = {
  unlimitedClues: (value) => typeof value === 'boolean',
  sound: (value) => typeof value === 'boolean',
  motion: (value) => value === 'system' || value === 'reduced',
  contrast: (value) => value === 'standard' || value === 'high',
  coachDismissed: (value) => typeof value === 'boolean',
  updatedAt: (value) => Number.isSafeInteger(value) && value >= 0,
};

export function createSettings() {
  return {...DEFAULT_SETTINGS};
}

function normalizeSettings(raw) {
  const state = createSettings();
  if (!raw || typeof raw !== 'object' || raw.schemaVersion !== state.schemaVersion) return state;
  for (const [key, valid] of Object.entries(validValues)) {
    if (valid(raw[key])) state[key] = raw[key];
  }
  return state;
}

export function loadSettings(storage) {
  const state = createSettings();
  try {
    const text = storage.getItem(SETTINGS_KEY);
    if (!text) return {state, restored: false, warning: null};
    const raw = JSON.parse(text);
    if (!raw || typeof raw !== 'object' || raw.schemaVersion !== state.schemaVersion) return {state, restored: false, warning: 'invalid'};
    return {state: normalizeSettings(raw), restored: true, warning: null};
  } catch (error) {
    return {state, restored: false, warning: error instanceof SyntaxError ? 'invalid' : 'storage'};
  }
}

export function saveSettings(storage, settings) {
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
    return {saved: true, warning: null};
  } catch {
    return {saved: false, warning: 'storage'};
  }
}

export function updateSetting(settings, key, value) {
  if (!Object.hasOwn(validValues, key) || !validValues[key](value) || key === 'updatedAt') return settings;
  const state = normalizeSettings(settings);
  return {...state, [key]: value, updatedAt: Math.max(Date.now(), state.updatedAt + 1)};
}
