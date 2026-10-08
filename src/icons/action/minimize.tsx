import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const minimize: IconNode[] = [
  ["path", { d: "M8 3v5H3" }],
  ["path", { d: "M16 3v5h5" }],
  ["path", { d: "M21 16h-5v5" }],
  ["path", { d: "M3 16h5v5" }],
];

export const MinimizeIcon = /*#__PURE__*/ createIcon('Minimize', minimize);
export const Minimize2 = /*#__PURE__*/ MinimizeIcon;
