import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const trendingDown: IconNode[] = [
  ["path", { d: "m3 7 6 6 4-4 8 8" }],
  ["path", { d: "M14 17h7v-7" }],
];

export const TrendingDownIcon = /*#__PURE__*/ createIcon('TrendingDown', trendingDown);
