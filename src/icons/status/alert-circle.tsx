import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const alertCircle: IconNode[] = [
  ...circle,
  ["path", { d: "M12 7v6" }],
  ["path", { d: "M12 17h.01" }],
];

export const AlertCircleIcon = /*#__PURE__*/ createIcon('AlertCircle', alertCircle);
export const ErrorIcon = /*#__PURE__*/ AlertCircleIcon;
