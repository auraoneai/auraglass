import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const search: IconNode[] = [
  ["circle", { cx: 11, cy: 11, r: 7 }],
  ["path", { d: "m20 20-4.2-4.2" }],
];

const plus: IconNode[] = [
  ["path", { d: "M12 5v14" }],
  ["path", { d: "M5 12h14" }],
];

export const ZoomInIcon = /*#__PURE__*/ createIcon('ZoomIn', [...search, ...plus]);
