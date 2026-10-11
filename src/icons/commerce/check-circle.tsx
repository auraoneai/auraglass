import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const check: IconNode[] = [["path", { d: "m5 12 4 4L19 6" }]];

export const CheckCircleIcon = /*#__PURE__*/ createIcon('CheckCircle', [
  ...circle,
  ...check,
]);
export const CheckCircle2 = CheckCircleIcon;
export const SuccessIcon = CheckCircleIcon;
