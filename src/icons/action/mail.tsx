import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const mail: IconNode[] = [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["path", { d: "m3 7 9 6 9-6" }],
];

export const MailIcon = /*#__PURE__*/ createIcon('Mail', mail);
