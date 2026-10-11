import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const bell: IconNode[] = [
  ["path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" }],
  ["path", { d: "M10 21h4" }],
];

export const BellIcon = /*#__PURE__*/ createIcon('Bell', bell);
export const NotificationIcon = BellIcon;
