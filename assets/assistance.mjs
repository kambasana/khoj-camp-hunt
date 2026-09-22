const clueStage = (hintStages, targetId) => [1, 2].includes(hintStages?.[targetId]) ? hintStages[targetId] : 0;
const remainingHints = (state) => Number.isInteger(state.hintsRemaining) && state.hintsRemaining >= 0 ? state.hintsRemaining : 0;
const result = (state, stage, spent, blocked) => ({state, stage, spent, blocked});

function applyClue(progress, targetIsValid, targetId, settings, replaceProgress) {
  const stage = clueStage(progress?.hintStages, targetId);
  if (!progress || progress.complete || !targetIsValid || progress.foundIds.includes(targetId) || stage >= 2) {
    return result(progress, stage, false, true);
  }
  const unlimited = settings?.unlimitedClues === true;
  const hintsRemaining = remainingHints(progress);
  if (!unlimited && hintsRemaining === 0) return result(progress, stage, false, true);
  const nextProgress = {
    ...progress,
    hintsRemaining: unlimited ? progress.hintsRemaining : hintsRemaining - 1,
    hintStages: {...progress.hintStages, [targetId]: stage + 1},
  };
  return result(replaceProgress(nextProgress), stage + 1, true, false);
}

export function applyCampaignClue(state, levels, levelId, targetId, settings) {
  const progress = state?.levels?.[levelId];
  const level = levels.find((item) => item.id === levelId);
  const targetIsValid = Boolean(level?.targets.some((target) => target.id === targetId));
  const applied = applyClue(progress, targetIsValid, targetId, settings, (nextProgress) => ({
    ...state,
    levels: {...state.levels, [levelId]: nextProgress},
  }));
  return applied.state === progress ? result(state, applied.stage, applied.spent, applied.blocked) : applied;
}

export function applyContinuousClue(state, levels, targetId, settings) {
  const level = levels.find((item) => item.id === state?.levelId);
  const targetIsValid = Boolean(level && state.targetIds?.includes(targetId));
  const applied = applyClue(state, targetIsValid, targetId, settings, (nextState) => nextState);
  return applied;
}

export function continuousAssistanceBonus(hintStages) {
  const usedStages = Object.values(hintStages && typeof hintStages === 'object' ? hintStages : {})
    .reduce((total, stage) => total + ([1, 2].includes(stage) ? stage : 0), 0);
  return Math.max(0, 300 - usedStages * 50);
}
