import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const paperclip: IconNode[] = [
  [
    "path",
    {
      d: "m21 12-8.5 8.5a6 6 0 0 1-8.5-8.5L13 3a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 0 1-2.8-2.8L15 6.8",
    },
  ],
];

export const PaperclipIcon = /*#__PURE__*/ createIcon('Paperclip', paperclip);
