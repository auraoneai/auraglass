/* src/root/mat.ts — root entry content for MAT (lane 2e-B owns the barrel).
   Re-exports exactly ROOT_EXPORTS.mat (S-35, contract entries.ts):
   Surface, SurfaceGroup, Environment, ScrollEdge, ConcentricFrame,
   AuraGlassProvider, AuraGlassScript, usePreference. */
export { Surface, SurfaceGroup, Environment, ScrollEdge, ConcentricFrame } from '../material/index';
export { AuraGlassProvider, AuraGlassScript, usePreference } from '../theme/index';
