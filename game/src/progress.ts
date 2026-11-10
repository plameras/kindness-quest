import {missions, stepIds, type Badge, type Mission} from './story';

export type Progress = {completed: number[]; badges: Badge[]};
export const progressKey = 'kindness-quest-v2';

export function missionBadges(mission: Mission) {
  return stepIds.map(step => mission.badgeByStep[step]);
}

export function readProgress(): Progress {
  try {
    const current = localStorage.getItem(progressKey);
    const saved = JSON.parse(current ?? localStorage.getItem('kindness-quest-v1') ?? 'null');
    if (Array.isArray(saved?.completed) && Array.isArray(saved?.badges)) {
      const earned = new Set(saved.badges);
      if (current === null) {
        // A legacy completion proves the notice and report choices, but help could bypass the check-in.
        for (const [index, mission] of missions.entries()) {
          if (saved.completed.includes(index)) {
            earned.add(mission.badgeByStep.notice);
            earned.add(mission.badgeByStep.report);
          }
        }
      }
      const completed = missions.flatMap((mission, index) =>
        saved.completed.includes(index) && missionBadges(mission).every(badge => earned.has(badge))
          ? [index] : []);
      // A reload starts a new attempt for every unfinished mission.
      return {completed, badges: completed.flatMap(index => missionBadges(missions[index]))};
    }
  } catch { /* Play is still available when storage is disabled. */ }
  return {completed: [], badges: []};
}
