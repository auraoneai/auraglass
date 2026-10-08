import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const rotateCcw: IconNode[] = [
  ["path", { d: "M3 12a9 9 0 1 0 3-6.7L3 8" }],
  ["path", { d: "M3 3v5h5" }],
];

export const RotateCcwIcon = /*#__PURE__*/ createIcon('RotateCcw', rotateCcw);
