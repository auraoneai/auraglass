import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const moon: IconNode[] = [
  ["path", { d: "M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z" }],
];

export const MoonIcon = /*#__PURE__*/ createIcon('Moon', moon);
