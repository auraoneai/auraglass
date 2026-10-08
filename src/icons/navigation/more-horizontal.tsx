import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const moreHorizontal: IconNode[] = [
  ["circle", { cx: 6, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 12, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 18, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
];

export const MoreHorizontalIcon = /*#__PURE__*/ createIcon('MoreHorizontal', moreHorizontal);
