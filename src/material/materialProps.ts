/* MAT-135 — final §4.10 emission rules. Delegates to internal/resolveRole:
   pure, no style key, no DOM/React/context access. */
import type { MaterialRole, MaterialAttributes } from '../contracts/material';
import { resolveRole } from './internal/resolveRole';

export function materialProps(role: MaterialRole = {}): MaterialAttributes {
  return {
    className: 'ag-surface',
    ...resolveRole(role),
  } as MaterialAttributes;
}
