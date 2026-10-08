import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const database: IconNode[] = [
  ["ellipse", { cx: 12, cy: 5, rx: 8, ry: 3 }],
  ["path", { d: "M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" }],
  ["path", { d: "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" }],
];

export const DatabaseIcon = /*#__PURE__*/ createIcon('Database', database);
