import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const InfoIcon = /*#__PURE__*/ createIcon('Info', [
  ...circle,
  ["path", { d: "M12 11v5" }],
  ["path", { d: "M12 8h.01" }],
]);
