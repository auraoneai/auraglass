import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

export const CameraIcon = /*#__PURE__*/ createIcon('Camera', [
  [
    "path",
    {
      d: "M5 7h3l2-3h4l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z",
    },
  ],
  ["circle", { cx: 12, cy: 13, r: 4 }],
]);
