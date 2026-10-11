import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const SlidersHorizontalIcon = /*#__PURE__*/ createIcon('SlidersHorizontal', [
  ["path", { d: "M3 6h18M3 12h18M3 18h18" }],
  ["circle", { cx: 8, cy: 6, r: 2 }],
  ["circle", { cx: 16, cy: 12, r: 2 }],
  ["circle", { cx: 10, cy: 18, r: 2 }],
]);
