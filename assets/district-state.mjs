function districtIds(level) {
  return Array.isArray(level?.districts)
    ? level.districts.map((district) => district?.id).filter((id) => typeof id === 'string')
    : [];
}

export function createDistrictState(level, preferredId) {
  const ids = districtIds(level);
  const activeDistrictId = ids.includes(preferredId) ? preferredId : ids[0];
  return {
    activeDistrictId,
    cameras: Object.fromEntries(ids.map((id) => [id, null])),
  };
}

export function selectDistrict(state, level, id) {
  const ids = districtIds(level);
  if (!ids.includes(id)) return state;
  if (state?.activeDistrictId === id) return state;
  return {...state, activeDistrictId: id};
}

export function stepDistrict(state, level, delta) {
  const ids = districtIds(level);
  if (ids.length === 0) return state;
  const current = ids.indexOf(state?.activeDistrictId);
  const start = current < 0 ? 0 : current;
  const offset = Number.isFinite(delta) ? Math.trunc(delta) : 0;
  const index = ((start + offset) % ids.length + ids.length) % ids.length;
  return selectDistrict(state, level, ids[index]);
}

export function saveDistrictCamera(state, id, camera) {
  if (!state?.cameras || !Object.hasOwn(state.cameras, id)) return state;
  return {
    ...state,
    cameras: {
      ...state.cameras,
      [id]: camera ? {...camera} : null,
    },
  };
}

export function cameraForDistrict(state, id) {
  const camera = state?.cameras?.[id];
  return camera ? {...camera} : null;
}

export function districtAnnouncement(state, level) {
  const districts = Array.isArray(level?.districts) ? level.districts : [];
  const index = districts.findIndex((district) => district?.id === state?.activeDistrictId);
  if (index < 0) return '';
  const district = districts[index];
  const position = index + 1;
  return `District ${position} of ${districts.length}: ${district.name?.en || ''} · વિસ્તાર ${position} / ${districts.length}: ${district.name?.gu || ''}`;
}
