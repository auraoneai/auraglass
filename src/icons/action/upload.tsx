import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const upload: IconNode[] = [
  ["path", { d: "M12 16V4" }],
  ["path", { d: "m6 10 6-6 6 6" }],
  ["path", { d: "M4 20h16" }],
];

export const UploadIcon = /*#__PURE__*/ createIcon('Upload', upload);
