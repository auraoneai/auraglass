import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const user: IconNode[] = [
  ["circle", { cx: 12, cy: 8, r: 4 }],
  ["path", { d: "M5 21a7 7 0 0 1 14 0" }],
];

export const UserIcon = /*#__PURE__*/ createIcon('User', user);
export const UserRound = /*#__PURE__*/ UserIcon;
