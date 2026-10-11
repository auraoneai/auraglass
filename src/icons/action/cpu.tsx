import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const x: IconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const CpuIcon = /*#__PURE__*/ createIcon('Cpu', [
  ["rect", { x: 8, y: 8, width: 8, height: 8, rx: 1 }],
  [
    "path",
    { d: "M4 10h4M4 14h4M16 10h4M16 14h4M10 4v4M14 4v4M10 16v4M14 16v4" },
  ],
]);
