import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const AccessibilityIcon = /*#__PURE__*/ createIcon('Accessibility', [
  ...circle,
  ["path", { d: "M12 7v10" }],
  ["path", { d: "M8 10h8" }],
  ["path", { d: "m9 21 3-6 3 6" }],
]);
