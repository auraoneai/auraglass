/* MAT-172 — typed matrix metadata for Material.Matrix. The story grid is
   generated from this file (variants × thickness), never hand-written. */
import type { MaterialVariant, Thickness } from '../types';

export interface MatrixCell {
  variant: MaterialVariant | 'content-raised';
  thickness: Thickness;
}

export const MATRIX_VARIANTS: readonly MatrixCell['variant'][] = [
  'regular', 'clear', 'identity', 'content-raised',
];
export const MATRIX_THICKNESSES: readonly Thickness[] = ['thin', 'regular', 'thick'];

export const MATRIX_CELLS: readonly MatrixCell[] = MATRIX_VARIANTS.flatMap((variant) =>
  MATRIX_THICKNESSES.map((thickness) => ({ variant, thickness })));
