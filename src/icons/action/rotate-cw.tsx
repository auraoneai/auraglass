import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const rotateCw: IconNode[] = [
  ["path", { d: "M21 12a9 9 0 1 1-3-6.7L21 8" }],
  ["path", { d: "M21 3v5h-5" }],
];

export const RotateCwIcon = /*#__PURE__*/ createIcon('RotateCw', rotateCw);
