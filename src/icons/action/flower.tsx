import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const FlowerIcon = /*#__PURE__*/ createIcon('Flower', [
  ["circle", { cx: 12, cy: 12, r: 2 }],
  [
    "path",
    {
      d: "M12 2c2 3 2 5 0 8-2-3-2-5 0-8ZM12 22c-2-3-2-5 0-8 2 3 2 5 0 8ZM2 12c3-2 5-2 8 0-3 2-5 2-8 0ZM22 12c-3 2-5 2-8 0 3-2 5-2 8 0Z",
    },
  ],
]);
