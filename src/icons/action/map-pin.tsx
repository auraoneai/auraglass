import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const mapPin: IconNode[] = [
  ["path", { d: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" }],
  ["circle", { cx: 12, cy: 10, r: 3 }],
];

export const MapPinIcon = /*#__PURE__*/ createIcon('MapPin', mapPin);
