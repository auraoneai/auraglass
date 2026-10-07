import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const target: IconNode[] = [
  ...circle,
  ["circle", { cx: 12, cy: 12, r: 5 }],
  ["circle", { cx: 12, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
];

export const TargetIcon = /*#__PURE__*/ createIcon('Target', target);
