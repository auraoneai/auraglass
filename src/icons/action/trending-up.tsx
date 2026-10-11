import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const trendingUp: IconNode[] = [
  ["path", { d: "m3 17 6-6 4 4 8-8" }],
  ["path", { d: "M14 7h7v7" }],
];

export const TrendingUpIcon = /*#__PURE__*/ createIcon('TrendingUp', trendingUp);
