import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const cloud: IconNode[] = [
  [
    "path",
    { d: "M17.5 19H7a5 5 0 0 1-.5-10 7 7 0 0 1 13.4 2.2A4 4 0 0 1 17.5 19Z" },
  ],
];

export const CloudIcon = /*#__PURE__*/ createIcon('Cloud', cloud);
