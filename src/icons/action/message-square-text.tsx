import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const message: IconNode[] = [
  ["path", { d: "M21 12a8 8 0 0 1-8 8H7l-4 3 1.2-5A8 8 0 1 1 21 12Z" }],
];

export const MessageSquareTextIcon = /*#__PURE__*/ createIcon('MessageSquareText', [
  ...message,
  ["path", { d: "M8 10h8M8 14h5" }],
]);
