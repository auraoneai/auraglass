import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const PanelsTopLeftIcon = /*#__PURE__*/ createIcon('PanelsTopLeft', [
  ["rect", { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
  ["path", { d: "M3 9h18M9 9v12" }],
]);
