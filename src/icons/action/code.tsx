import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const code: IconNode[] = [
  ["path", { d: "m8 16-4-4 4-4" }],
  ["path", { d: "m16 8 4 4-4 4" }],
  ["path", { d: "m14 4-4 16" }],
];

export const CodeIcon = /*#__PURE__*/ createIcon('Code', code);
export const Code2 = /*#__PURE__*/ CodeIcon;
