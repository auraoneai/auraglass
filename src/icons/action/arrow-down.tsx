import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const arrowDown: IconNode[] = [
  ["path", { d: "M12 5v14" }],
  ["path", { d: "m6 13 6 6 6-6" }],
];

export const ArrowDownIcon = /*#__PURE__*/ createIcon('ArrowDown', arrowDown);
