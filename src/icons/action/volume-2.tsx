import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const volume: IconNode[] = [
  ["path", { d: "M11 5 6 9H3v6h3l5 4Z" }],
  ["path", { d: "M15 9a5 5 0 0 1 0 6" }],
];

const volume2: IconNode[] = [
  ...volume,
  ["path", { d: "M18 6a9 9 0 0 1 0 12" }],
];

export const Volume2Icon = /*#__PURE__*/ createIcon('Volume2', volume2);
