import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const grid: IconNode[] = [
  ["rect", { x: 3, y: 3, width: 7, height: 7, rx: 1 }],
  ["rect", { x: 14, y: 3, width: 7, height: 7, rx: 1 }],
  ["rect", { x: 3, y: 14, width: 7, height: 7, rx: 1 }],
  ["rect", { x: 14, y: 14, width: 7, height: 7, rx: 1 }],
];

export const GridIcon = /*#__PURE__*/ createIcon('Grid', grid);
