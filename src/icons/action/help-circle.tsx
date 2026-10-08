import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const HelpCircleIcon = /*#__PURE__*/ createIcon('HelpCircle', [
  ...circle,
  ["path", { d: "M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" }],
  ["path", { d: "M12 17h.01" }],
]);
