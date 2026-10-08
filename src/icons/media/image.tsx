import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const image: IconNode[] = [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["circle", { cx: 8, cy: 10, r: 1.5 }],
  ["path", { d: "m21 16-5-5L5 19" }],
];

export const ImageIcon = /*#__PURE__*/ createIcon('Image', image);
