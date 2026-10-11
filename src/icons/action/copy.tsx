import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const copy: IconNode[] = [
  ["rect", { x: 9, y: 9, width: 12, height: 12, rx: 2 }],
  ["path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }],
];

export const CopyIcon = /*#__PURE__*/ createIcon('Copy', copy);
