import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const MusicIcon = /*#__PURE__*/ createIcon('Music', [
  ["path", { d: "M9 18V5l12-2v13" }],
  ["circle", { cx: 6, cy: 18, r: 3 }],
  ["circle", { cx: 18, cy: 16, r: 3 }],
]);
