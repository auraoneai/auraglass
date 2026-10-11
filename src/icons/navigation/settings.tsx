import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const settings: IconNode[] = [
  ["circle", { cx: 12, cy: 12, r: 3 }],
  ["path", { d: "M12 2v3" }],
  ["path", { d: "M12 19v3" }],
  ["path", { d: "M2 12h3" }],
  ["path", { d: "M19 12h3" }],
  ["path", { d: "m4.9 4.9 2.1 2.1" }],
  ["path", { d: "m17 17 2.1 2.1" }],
  ["path", { d: "m19.1 4.9-2.1 2.1" }],
  ["path", { d: "m7 17-2.1 2.1" }],
];

export const SettingsIcon = /*#__PURE__*/ createIcon('Settings', settings);
