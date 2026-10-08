import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const alertTriangle: IconNode[] = [
  ["path", { d: "M12 3 22 20H2L12 3Z" }],
  ["path", { d: "M12 9v5" }],
  ["path", { d: "M12 17h.01" }],
];

export const AlertTriangleIcon = /*#__PURE__*/ createIcon('AlertTriangle', alertTriangle);
export const WarningIcon = /*#__PURE__*/ AlertTriangleIcon;
