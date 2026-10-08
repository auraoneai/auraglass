import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const underline: IconNode[] = [
  ["path", { d: "M7 5v6a5 5 0 0 0 10 0V5" }],
  ["path", { d: "M5 21h14" }],
];

export const UnderlineIcon = /*#__PURE__*/ createIcon('Underline', underline);
