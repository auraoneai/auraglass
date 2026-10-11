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

export const FolderOpenIcon = /*#__PURE__*/ createIcon('FolderOpen', [
  ...folder,
  ["path", { d: "M3 18 6 10h15l-3 8" }],
]);
