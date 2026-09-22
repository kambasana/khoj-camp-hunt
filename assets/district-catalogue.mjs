function districtsFor(level) {
  return Array.isArray(level?.districts) ? level.districts : [];
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isLocalizedName(value) {
  return isNonEmptyString(value?.en) && isNonEmptyString(value?.gu);
}

function isPositiveDimension(value) {
  return Number.isFinite(value) && value > 0;
}

function isPoint(point, width, height) {
  return Array.isArray(point) && point.length === 2 &&
    Number.isFinite(point[0]) && Number.isFinite(point[1]) &&
    point[0] >= 0 && point[1] >= 0 &&
    (!isPositiveDimension(width) || point[0] <= width) &&
    (!isPositiveDimension(height) || point[1] <= height);
}

function isRect(rect, width, height) {
  return rect && [rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) &&
    rect.x >= 0 && rect.y >= 0 && rect.width > 0 && rect.height > 0 &&
    (!isPositiveDimension(width) || rect.x + rect.width <= width) &&
    (!isPositiveDimension(height) || rect.y + rect.height <= height);
}

function translateRect(rect, offset) {
  if (!rect || !offset) return rect;
  return {...rect, x: rect.x + offset.x, y: rect.y + offset.y};
}

function compatibilityTarget(target, district) {
  const offset = district?.legacyOffset;
  if (!offset || !Number.isFinite(offset.x) || !Number.isFinite(offset.y)) return target;
  return {
    ...target,
    hitPolygon: Array.isArray(target?.hitPolygon)
      ? target.hitPolygon.map(([x, y]) => [x + offset.x, y + offset.y])
      : target?.hitPolygon,
    visualBounds: translateRect(target?.visualBounds, offset),
    thumbnailCrop: translateRect(target?.thumbnailCrop, offset),
    hintRegion: translateRect(target?.hintRegion, offset),
  };
}

export function flattenTargets(level) {
  return districtsFor(level).flatMap((district) =>
    Array.isArray(district?.targets)
      ? district.targets.map((target) => compatibilityTarget(target, district))
      : []
  ).sort((left, right) => {
    const leftOrder = Number.isInteger(left?.levelOrder) ? left.levelOrder : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isInteger(right?.levelOrder) ? right.levelOrder : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

export function localTargetsInLevelOrder(level) {
  return districtsFor(level).flatMap((district) =>
    Array.isArray(district?.targets) ? district.targets : []
  ).sort((left, right) => {
    const leftOrder = Number.isInteger(left?.levelOrder) ? left.levelOrder : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isInteger(right?.levelOrder) ? right.levelOrder : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

export function districtForTarget(level, targetId) {
  return districtsFor(level).find((district) =>
    Array.isArray(district?.targets) && district.targets.some((target) => target?.id === targetId)
  );
}

export function levelTargetIds(level) {
  return flattenTargets(level).map((target) => target.id);
}

export function validateDistrictLevel(level) {
  const errors = [];
  const districts = districtsFor(level);
  if (districts.length !== 4) errors.push(`district-count:${districts.length}`);
  const targetCount = districts.reduce((count, district) =>
    count + (Array.isArray(district?.targets) ? district.targets.length : 0), 0);
  if (targetCount < 12 || targetCount > 14) errors.push(`target-count:${targetCount}`);

  const districtIds = new Set();
  const targetIds = new Set();
  for (const [districtIndex, district] of districts.entries()) {
    const districtId = isNonEmptyString(district?.id) ? district.id : String(districtIndex);
    if (!isNonEmptyString(district?.id)) errors.push(`district-id:${districtIndex}`);
    else if (districtIds.has(district.id)) errors.push(`duplicate-district:${district.id}`);
    else districtIds.add(district.id);
    if (!isLocalizedName(district?.name)) errors.push(`district-name:${districtId}`);
    if (!isNonEmptyString(district?.image)) errors.push(`district-image:${districtId}`);
    if (!isNonEmptyString(district?.preview)) errors.push(`district-preview:${districtId}`);
    if (!isPositiveDimension(district?.width)) errors.push(`district-width:${districtId}`);
    if (!isPositiveDimension(district?.height)) errors.push(`district-height:${districtId}`);
    if (!Array.isArray(district?.targets)) {
      errors.push(`district-targets:${districtId}`);
      continue;
    }
    if (district.targets.length < 3) {
      errors.push(`district-target-count:${districtId}:${district.targets.length}`);
    }
    for (const [targetIndex, target] of district.targets.entries()) {
      const targetId = isNonEmptyString(target?.id) ? target.id : `${districtId}:${targetIndex}`;
      if (!isNonEmptyString(target?.id)) errors.push(`target-id:${targetId}`);
      if (!isLocalizedName(target?.name)) errors.push(`target-name:${targetId}`);
      if (!Array.isArray(target?.hitPolygon) || target.hitPolygon.length < 3 ||
          !target.hitPolygon.every((point) => isPoint(point, district?.width, district?.height))) {
        errors.push(`target-hit-polygon:${targetId}`);
      }
      if (!isRect(target?.visualBounds, district?.width, district?.height)) {
        errors.push(`target-visual-bounds:${targetId}`);
      }
      if (!isRect(target?.thumbnailCrop, district?.width, district?.height)) {
        errors.push(`target-thumbnail-crop:${targetId}`);
      }
      if (!isRect(target?.hintRegion, district?.width, district?.height)) {
        errors.push(`target-hint-region:${targetId}`);
      }
      if (target?.districtId !== district?.id) {
        errors.push(`target-district-mismatch:${targetId}`);
      }
      if (targetIds.has(target?.id)) errors.push(`duplicate-target:${targetId}`);
      else targetIds.add(target?.id);
    }
  }
  return errors;
}
