/* REQ-PLAT-26 (S-37): the single home of `cn`. Every class-name join in src/
   goes through this module (lint: auraglass/no-cn-outside-internal); no other
   file may import clsx / tailwind-merge / classnames or define `cn`.
   Pure re-binding of clsx: no listeners, timers or console output at import. */
import clsx, { type ClassValue } from 'clsx';

export type { ClassValue };

/** Join class names; falsy values are dropped (clsx semantics). */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}

export default cn;
