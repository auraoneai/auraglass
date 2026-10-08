import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const arrowUp: IconNode[] = [
  ["path", { d: "M12 19V5" }],
  ["path", { d: "m6 11 6-6 6 6" }],
];

export const ArrowUpIcon = /*#__PURE__*/ createIcon('ArrowUp', arrowUp);
