import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const moreVertical: IconNode[] = [
  ["circle", { cx: 12, cy: 6, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 12, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 12, cy: 18, r: 1, fill: "currentColor", stroke: "none" }],
];

export const MoreVerticalIcon = /*#__PURE__*/ createIcon('MoreVertical', moreVertical);
