import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const Columns3Icon = /*#__PURE__*/ createIcon('Columns3', [
  ["rect", { x: 3, y: 4, width: 18, height: 16, rx: 2 }],
  ["path", { d: "M9 4v16" }],
  ["path", { d: "M15 4v16" }],
]);
