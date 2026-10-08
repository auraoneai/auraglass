import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const ServerIcon = /*#__PURE__*/ createIcon('Server', [
  ["rect", { x: 4, y: 3, width: 16, height: 8, rx: 2 }],
  ["rect", { x: 4, y: 13, width: 16, height: 8, rx: 2 }],
  ["path", { d: "M8 7h.01M8 17h.01" }],
]);
