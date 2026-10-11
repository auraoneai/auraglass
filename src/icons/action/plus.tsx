import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const plus: IconNode[] = [
  ["path", { d: "M12 5v14" }],
  ["path", { d: "M5 12h14" }],
];

export const PlusIcon = /*#__PURE__*/ createIcon('Plus', plus);
