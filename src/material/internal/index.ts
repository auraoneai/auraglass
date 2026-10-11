/* REQ-MAT-23 (D-07) — internal size-class channel for library components.
   Not re-exported from src/material/index.ts and not a package entry: CMP and
   SURF components import it by path (`src/material/internal`) so a size class
   is never a public prop on SurfaceProps / MaterialRole. Pure: no DOM, no React,
   no context. */
import type { MaterialRole, MaterialAttributes, SizeClass } from '../types';
import { resolveRole } from './resolveRole';

export type { SizeClass } from '../types';

/**
 * `materialProps(role)` plus the component's size class. Thickness resolves
 * explicit `role.thickness` > size class (`control→thin`, `bar→regular`,
 * `panel→regular`, `sheet→thick`) and is emitted as `data-ag-thickness`; with
 * `refraction` the private `data-ag-sizeclass` is the passed size class (never
 * for `sheet`).
 */
export function componentMaterialProps(role: MaterialRole, sizeClass: SizeClass): MaterialAttributes {
  return resolveRole(role, sizeClass) as unknown as MaterialAttributes;
}
