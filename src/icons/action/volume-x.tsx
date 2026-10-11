import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const volume: IconNode[] = [
  ["path", { d: "M11 5 6 9H3v6h3l5 4Z" }],
  ["path", { d: "M15 9a5 5 0 0 1 0 6" }],
];

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const VolumeXIcon = /*#__PURE__*/ createIcon('VolumeX', [...volume, ...x]);
