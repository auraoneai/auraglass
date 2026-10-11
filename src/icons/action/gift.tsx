import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const GiftIcon = /*#__PURE__*/ createIcon('Gift', [
  ["rect", { x: 3, y: 8, width: 18, height: 13, rx: 2 }],
  ["path", { d: "M12 8v13" }],
  ["path", { d: "M3 12h18" }],
  ["path", { d: "M7.5 8A2.5 2.5 0 1 1 12 6a2.5 2.5 0 1 1 4.5 2" }],
]);
