import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const video: IconNode[] = [
  ["rect", { x: 3, y: 6, width: 13, height: 12, rx: 2 }],
  ["path", { d: "m16 10 5-3v10l-5-3Z" }],
];

export const VideoIcon = /*#__PURE__*/ createIcon('Video', video);
