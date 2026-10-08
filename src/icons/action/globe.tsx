import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const GlobeIcon = /*#__PURE__*/ createIcon('Globe', [
  ...circle,
  ["path", { d: "M3 12h18" }],
  ["path", { d: "M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" }],
]);
