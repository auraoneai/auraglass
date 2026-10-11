import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const search: IconNode[] = [
  ["circle", { cx: 11, cy: 11, r: 7 }],
  ["path", { d: "m20 20-4.2-4.2" }],
];

const minus: IconNode[] = [["path", { d: "M5 12h14" }]];

export const ZoomOutIcon = /*#__PURE__*/ createIcon('ZoomOut', [...search, ...minus]);
