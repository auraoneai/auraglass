import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const circle: IconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];

const clock: IconNode[] = [...circle, ["path", { d: "M12 7v5l3 2" }]];

export const ClockIcon = /*#__PURE__*/ createIcon('Clock', clock);
