import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const file: IconNode[] = [
  ["path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" }],
  ["path", { d: "M14 2v6h6" }],
];

const check: IconNode[] = [["path", { d: "m5 12 4 4L19 6" }]];

export const FileCheck2Icon = /*#__PURE__*/ createIcon('FileCheck2', [...file, ...check]);
