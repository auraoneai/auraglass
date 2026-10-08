import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const trash: IconNode[] = [
  ["path", { d: "M3 6h18" }],
  ["path", { d: "M8 6V4h8v2" }],
  ["path", { d: "M19 6 18 21H6L5 6" }],
  ["path", { d: "M10 11v6" }],
  ["path", { d: "M14 11v6" }],
];

export const Trash2Icon = /*#__PURE__*/ createIcon('Trash2', trash);
