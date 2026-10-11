import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const message: IconNode[] = [
  ["path", { d: "M21 12a8 8 0 0 1-8 8H7l-4 3 1.2-5A8 8 0 1 1 21 12Z" }],
];

export const MessageCircleIcon = /*#__PURE__*/ createIcon('MessageCircle', message);
