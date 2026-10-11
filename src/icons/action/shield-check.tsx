import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const shield: IconNode[] = [
  ["path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" }],
];

const check: IconNode[] = [["path", { d: "m5 12 4 4L19 6" }]];

export const ShieldCheckIcon = /*#__PURE__*/ createIcon('ShieldCheck', [
  ...shield,
  ...check,
]);
