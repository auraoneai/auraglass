import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const heart: IconNode[] = [
  [
    "path",
    {
      d: "M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    },
  ],
];

export const HeartIcon = /*#__PURE__*/ createIcon('Heart', heart);
