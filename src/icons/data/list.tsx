import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const list: IconNode[] = [
  ["path", { d: "M8 6h13" }],
  ["path", { d: "M8 12h13" }],
  ["path", { d: "M8 18h13" }],
  ["path", { d: "M3 6h.01" }],
  ["path", { d: "M3 12h.01" }],
  ["path", { d: "M3 18h.01" }],
];

export const ListIcon = /*#__PURE__*/ createIcon('List', list);
