import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const lineChart: IconNode[] = [
  ["path", { d: "M3 19h18" }],
  ["path", { d: "m5 15 4-4 4 3 6-8" }],
];

export const LineChartIcon = /*#__PURE__*/ createIcon('LineChart', lineChart);
