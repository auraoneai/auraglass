import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const star: IconNode[] = [
  [
    "path",
    {
      d: "m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1L6.1 20l1.1-6.5L2.5 8.9 9 8Z",
    },
  ],
];

export const StarIcon = /*#__PURE__*/ createIcon('Star', star);
