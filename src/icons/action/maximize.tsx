import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const maximize: IconNode[] = [
  ["path", { d: "M8 3H3v5" }],
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "M21 16v5h-5" }],
  ["path", { d: "M3 16v5h5" }],
];

export const MaximizeIcon = /*#__PURE__*/ createIcon('Maximize', maximize);
export const Maximize2 = MaximizeIcon;
