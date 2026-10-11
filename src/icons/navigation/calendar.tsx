import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

const calendar: IconNode[] = [
  ["rect", { x: 3, y: 4, width: 18, height: 17, rx: 2 }],
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M3 10h18" }],
];

export const CalendarIcon = /*#__PURE__*/ createIcon('Calendar', calendar);
