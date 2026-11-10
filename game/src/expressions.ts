import type {SceneAction} from './story';

type Point = [number, number];
export type Expression = 'neutral' | 'smile' | 'worried' | 'surprised' | 'listening';

export const faceLines: Record<Expression, Point[][]> = {
  neutral: [[[-4, 7], [4, 7]]],
  smile: [[[-6, 5], [-3, 8], [0, 9], [3, 8], [6, 5]]],
  worried: [[[-6, 9], [-3, 6], [0, 5], [3, 6], [6, 9]], [[-9, -5], [-3, -8]], [[3, -8], [9, -5]]],
  surprised: [[[-3, 5], [0, 3], [3, 5], [3, 8], [0, 10], [-3, 8], [-3, 5]], [[-9, -7], [-3, -7]], [[3, -7], [9, -7]]],
  listening: [[[-4, 7], [0, 8], [4, 7]], [[-9, -5], [-3, -6]], [[3, -6], [9, -5]]],
};

export function reactions(action?: SceneAction): {friend: Expression; player: Expression; adult: Expression} {
  switch (action) {
    case 'support': return {friend: 'smile', player: 'smile', adult: 'neutral'};
    case 'report': return {friend: 'smile', player: 'neutral', adult: 'listening'};
    case 'help':
    case 'vague': return {friend: 'worried', player: 'worried', adult: 'listening'};
    case 'unsafe': return {friend: 'worried', player: 'surprised', adult: 'neutral'};
    case 'pattern':
    case 'mistake': return {friend: 'worried', player: 'worried', adult: 'neutral'};
    default: return {friend: 'neutral', player: 'neutral', adult: 'neutral'};
  }
}
