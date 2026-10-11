import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const HardDriveIcon = /*#__PURE__*/ createIcon('HardDrive', [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "M7 18h.01M11 18h.01" }],
]);
