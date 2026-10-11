import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const refresh: IconNode[] = [
  ["path", { d: "M21 12a9 9 0 0 1-15 6.7L3 16" }],
  ["path", { d: "M3 12a9 9 0 0 1 15-6.7L21 8" }],
  ["path", { d: "M3 21v-5h5" }],
  ["path", { d: "M21 3v5h-5" }],
];

export const RefreshCwIcon = /*#__PURE__*/ createIcon('RefreshCw', refresh);
export const RefreshIcon = RefreshCwIcon;
