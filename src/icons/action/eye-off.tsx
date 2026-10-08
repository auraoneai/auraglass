import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const eyeOff: IconNode[] = [
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M10.6 10.6a2 2 0 0 0 2.8 2.8" }],
  ["path", { d: "M6.4 6.4C3.7 8.2 2 12 2 12s4 7 10 7c1.7 0 3.2-.5 4.5-1.2" }],
  ["path", { d: "M14 5.2c4.9 1 8 6.8 8 6.8a17.5 17.5 0 0 1-2.2 3.1" }],
];

export const EyeOffIcon = /*#__PURE__*/ createIcon('EyeOff', eyeOff);
