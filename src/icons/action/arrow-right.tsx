import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const arrowRight: IconNode[] = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "m13 6 6 6-6 6" }],
];

export const ArrowRightIcon = /*#__PURE__*/ createIcon('ArrowRight', arrowRight);
