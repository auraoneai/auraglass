import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const italic: IconNode[] = [
  ["path", { d: "M11 5h6" }],
  ["path", { d: "M7 19h6" }],
  ["path", { d: "m14 5-4 14" }],
];

export const ItalicIcon = /*#__PURE__*/ createIcon('Italic', italic);
