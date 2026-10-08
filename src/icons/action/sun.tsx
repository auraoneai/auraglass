import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const sun: IconNode[] = [
  ["circle", { cx: 12, cy: 12, r: 4 }],
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M12 20v2" }],
  ["path", { d: "m4.9 4.9 1.4 1.4" }],
  ["path", { d: "m17.7 17.7 1.4 1.4" }],
  ["path", { d: "M2 12h2" }],
  ["path", { d: "M20 12h2" }],
  ["path", { d: "m4.9 19.1 1.4-1.4" }],
  ["path", { d: "m17.7 6.3 1.4-1.4" }],
];

export const SunIcon = /*#__PURE__*/ createIcon('Sun', sun);
