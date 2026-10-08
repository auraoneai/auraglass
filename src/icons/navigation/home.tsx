import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const home: IconNode[] = [
  ["path", { d: "m3 11 9-8 9 8" }],
  ["path", { d: "M5 10v10h14V10" }],
  ["path", { d: "M10 20v-6h4v6" }],
];

export const HomeIcon = /*#__PURE__*/ createIcon('Home', home);
