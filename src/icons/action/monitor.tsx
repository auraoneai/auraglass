import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const MonitorIcon = /*#__PURE__*/ createIcon('Monitor', [
  ["rect", { x: 3, y: 4, width: 18, height: 13, rx: 2 }],
  ["path", { d: "M8 21h8M12 17v4" }],
]);
