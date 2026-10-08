import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const mic: IconNode[] = [
  ["rect", { x: 9, y: 2, width: 6, height: 12, rx: 3 }],
  ["path", { d: "M5 10a7 7 0 0 0 14 0" }],
  ["path", { d: "M12 17v5" }],
  ["path", { d: "M8 22h8" }],
];

const micOff: IconNode[] = [...mic, ["path", { d: "m2 2 20 20" }]];

export const MicOffIcon = /*#__PURE__*/ createIcon('MicOff', micOff);
