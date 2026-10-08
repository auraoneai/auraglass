import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const check: IconNode[] = [["path", { d: "m5 12 4 4L19 6" }]];

export const CheckIcon = /*#__PURE__*/ createIcon('Check', check);
