import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const XIcon = /*#__PURE__*/ createIcon('X', x);
export const CloseIcon = /*#__PURE__*/ XIcon;
