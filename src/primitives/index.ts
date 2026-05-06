// AuraGlass Primitive Components
export { GlassCore, default as GlassPrimitive } from './GlassCore';
export { GlassAdvanced } from './glass/GlassAdvanced';
export { OptimizedGlassCore } from './OptimizedGlassCore';
export { OptimizedGlassAdvanced } from './glass/OptimizedGlassAdvanced';
export { MotionNative } from './MotionNative';
export { MotionFramer } from './motion/MotionFramer';
export {
  LiquidGlassBackdropSampler,
  type LiquidGlassBackdropSamplerProps,
} from './LiquidGlassBackdropSampler';
export {
  LiquidGlassConcentricFrame,
  getConcentricRadiusValue,
  type LiquidGlassConcentricFrameProps,
  type LiquidGlassConcentricRadius,
  type LiquidGlassConcentricShape,
} from './LiquidGlassConcentricFrame';
export {
  LiquidGlassEffectGroup,
  useLiquidGlassEffectGroup,
  type LiquidGlassEffectGroupProps,
  type LiquidGlassSamplingStrategy,
} from './LiquidGlassEffectGroup';
export {
  LiquidGlassLayerProvider,
  LiquidGlassSurfaceLayer,
  useLiquidGlassLayer,
  type LiquidGlassLayerContextValue,
  type LiquidGlassLayerProviderProps,
  type LiquidGlassPerformanceLevel,
  type LiquidGlassVariant,
} from './LiquidGlassLayerProvider';
export {
  LiquidGlassScrollEdge,
  type LiquidGlassScrollEdgeProps,
  type LiquidGlassScrollEdgeSide,
  type LiquidGlassScrollEdgeStyle,
} from './LiquidGlassScrollEdge';
export {
  LiquidGlassDestination,
  LiquidGlassSource,
  LiquidGlassTransitionProvider,
  useLiquidGlassTransition,
  type LiquidGlassDestinationProps,
  type LiquidGlassSourceProps,
  type LiquidGlassTransitionContextValue,
  type LiquidGlassTransitionProviderProps,
} from './LiquidGlassSourceTransition';

// Primitive component types
export type { GlassProps } from './GlassCore';
export type { OptimizedGlassProps } from './OptimizedGlassCore';
export type { MotionProps } from './motion/MotionFramer';
export type { AnimationPreset, AnimationEasing } from './motion/MotionFramer';

// Re-export for convenience (maintaining backward compatibility)
export { GlassCore as Glass } from './GlassCore';
export { GlassCore as GlassBase } from './GlassCore';
export { OptimizedGlassCore as OptimizedGlass } from './OptimizedGlassCore';
export { OptimizedGlassCore as GlassOptimized } from './OptimizedGlassCore';
export { MotionFramer as Motion } from './motion/MotionFramer';
export { MotionFramer as GlassMotion } from './motion/MotionFramer';
