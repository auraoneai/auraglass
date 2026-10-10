/* src/compat/mat/index.ts — MAT compat surface (lane 2e-B). Re-exported by
   the contract-owned src/compat/index.ts aggregate. REQ-MAT-24 adapters. */
export {
  OptimizedGlass,
  GlassCore,
  OptimizedGlassAdvanced,
  type OptimizedGlassCompatProps,
} from './material/OptimizedGlass';
export {
  LiquidGlassMaterial,
  LiquidGlassEffectGroup,
  LiquidGlassLayerProvider,
  LiquidGlassScrollEdge,
  LiquidGlassConcentricFrame,
  type LiquidGlassMaterialCompatProps,
  type LiquidGlassEffectGroupCompatProps,
  type LiquidGlassScrollEdgeCompatProps,
  type LiquidGlassConcentricFrameCompatProps,
} from './material/LiquidGlassMaterial';
// REQ-MAT-45 (D.3-27): the 4.x createGlassTheme `motionPolicy` option (DEP-M0902).
export {
  createGlassTheme,
  type CompatCreateGlassThemeOptions,
  type GlassMotionPolicy,
} from './createGlassTheme';
