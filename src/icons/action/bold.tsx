import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const bold: IconNode[] = [
  ["path", { d: "M7 5h6a4 4 0 0 1 0 8H7Z" }],
  ["path", { d: "M7 13h7a4 4 0 0 1 0 8H7Z" }],
  ["path", { d: "M7 5v16" }],
];

export const BoldIcon = /*#__PURE__*/ createIcon('Bold', bold);
