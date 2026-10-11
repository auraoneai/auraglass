import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const ContrastIcon = /*#__PURE__*/ createIcon('Contrast', [
  ...circle,
  [
    "path",
    { d: "M12 3a9 9 0 0 0 0 18Z", fill: "currentColor", stroke: "none" },
  ],
]);
