import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const folder: IconNode[] = [
  [
    "path",
    {
      d: "M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
    },
  ],
];

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const search: IconNode[] = [
  ["circle", { cx: 11, cy: 11, r: 7 }],
  ["path", { d: "m20 20-4.2-4.2" }],
];

export const FolderSearchIcon = /*#__PURE__*/ createIcon('FolderSearch', [
  ...folder,
  ...search,
]);
