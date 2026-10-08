import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const palette: IconNode[] = [
  [
    "path",
    {
      d: "M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h1a8 8 0 0 0-1-9Z",
    },
  ],
  [
    "circle",
    { cx: 7.5, cy: 10.5, r: 0.7, fill: "currentColor", stroke: "none" },
  ],
  ["circle", { cx: 10, cy: 7.5, r: 0.7, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 14, cy: 7.5, r: 0.7, fill: "currentColor", stroke: "none" }],
];

export const PaletteIcon = /*#__PURE__*/ createIcon('Palette', palette);
