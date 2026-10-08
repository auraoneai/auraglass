import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const send: IconNode[] = [
  ["path", { d: "M22 2 11 13" }],
  ["path", { d: "m22 2-7 20-4-9-9-4Z" }],
];

export const SendIcon = /*#__PURE__*/ createIcon('Send', send);
