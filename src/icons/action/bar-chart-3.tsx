import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const chartBars: IconNode[] = [
  ["path", { d: "M4 19V9" }],
  ["path", { d: "M12 19V5" }],
  ["path", { d: "M20 19v-7" }],
];

export const BarChart3Icon = /*#__PURE__*/ createIcon('BarChart3', chartBars);
