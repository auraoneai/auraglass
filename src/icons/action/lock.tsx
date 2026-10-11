import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const lock: IconNode[] = [
  ["rect", { x: 5, y: 11, width: 14, height: 10, rx: 2 }],
  ["path", { d: "M8 11V7a4 4 0 0 1 8 0v4" }],
];

export const LockIcon = /*#__PURE__*/ createIcon('Lock', lock);
