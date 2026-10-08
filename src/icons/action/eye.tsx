import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const eye: IconNode[] = [
  ["path", { d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" }],
  ["circle", { cx: 12, cy: 12, r: 3 }],
];

export const EyeIcon = /*#__PURE__*/ createIcon('Eye', eye);
