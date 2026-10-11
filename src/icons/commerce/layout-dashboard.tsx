import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const LayoutDashboardIcon = /*#__PURE__*/ createIcon('LayoutDashboard', [
  ["rect", { x: 3, y: 3, width: 7, height: 9, rx: 1 }],
  ["rect", { x: 14, y: 3, width: 7, height: 5, rx: 1 }],
  ["rect", { x: 14, y: 12, width: 7, height: 9, rx: 1 }],
  ["rect", { x: 3, y: 16, width: 7, height: 5, rx: 1 }],
]);
export const DashboardIcon = LayoutDashboardIcon;
