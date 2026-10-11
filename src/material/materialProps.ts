/* MAT-135 — final S-05 emission rules. Delegates to internal/resolveRole:
   pure, no style key, no className key (the contract test asserts deep-equal
   against a data-ag-*-only object), no DOM/React/context access. */
import type { MaterialRole, MaterialAttributes } from '../contracts/material';
import { resolveRole } from './internal/resolveRole';

export function materialProps(role: MaterialRole = {}): MaterialAttributes {
  return resolveRole(role) as unknown as MaterialAttributes;
}
