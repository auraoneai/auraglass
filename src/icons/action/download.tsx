import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const download: IconNode[] = [
  ["path", { d: "M12 4v12" }],
  ["path", { d: "m6 10 6 6 6-6" }],
  ["path", { d: "M4 20h16" }],
];

export const DownloadIcon = /*#__PURE__*/ createIcon('Download', download);
