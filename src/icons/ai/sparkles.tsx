import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const sparkles: IconNode[] = [
  ["path", { d: "m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" }],
  ["path", { d: "m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" }],
];

export const SparklesIcon = /*#__PURE__*/ createIcon('Sparkles', sparkles);
export const SparkIcon = SparklesIcon;
