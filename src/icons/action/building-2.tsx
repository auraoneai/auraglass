import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const Building2Icon = /*#__PURE__*/ createIcon('Building2', [
  ["rect", { x: 4, y: 3, width: 16, height: 18, rx: 2 }],
  ["path", { d: "M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" }],
]);
