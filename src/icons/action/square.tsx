import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const square: IconNode[] = [
  ["rect", { x: 5, y: 5, width: 14, height: 14, rx: 2 }],
];

export const SquareIcon = /*#__PURE__*/ createIcon('Square', square);
