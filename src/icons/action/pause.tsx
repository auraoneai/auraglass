import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const pause: IconNode[] = [
  ["path", { d: "M8 5v14" }],
  ["path", { d: "M16 5v14" }],
];

export const PauseIcon = /*#__PURE__*/ createIcon('Pause', pause);
