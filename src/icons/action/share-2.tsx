import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const Share2Icon = /*#__PURE__*/ createIcon('Share2', [
  ["circle", { cx: 18, cy: 5, r: 3 }],
  ["circle", { cx: 6, cy: 12, r: 3 }],
  ["circle", { cx: 18, cy: 19, r: 3 }],
  ["path", { d: "m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" }],
]);
