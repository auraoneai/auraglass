/* src/compat/mat/createGlassTheme.ts — REQ-MAT-45 (MAT-45, REQ-FIN-58, D.3-27).
   The 4.x `motionPolicy` option of createGlassTheme is gone from the 5.0
   theme API (no MAT type may raise motion). 4.x callers that still pass it
   import createGlassTheme from aura-glass/compat: the option keeps its 4.x
   REQ-MAT-15 mapping on `tokens.motion` and warns once at call time
   (DEP-M0902, codemod motion-props). Pure: no DOM access. */
import {
  createGlassTheme as createGlassTheme5,
  type CreateGlassThemeOptions,
  type GlassTheme,
  type GlassThemeTokens,
} from '../../theme/createGlassTheme';
import { warnDeprecated } from '../../internal/warnDeprecated';

export type GlassMotionPolicy = 'system' | 'reduced' | 'expressive' | 'none';

export interface CompatCreateGlassThemeOptions extends CreateGlassThemeOptions {
  /**
   * The 4.x theme motion policy (motionPolicy).
   * @deprecated since 4.2.0, removed in 5.0.0. Motion is an OS floor, not a
   * theme option: use {@link the OS motion floor (not overridable in 5.x)}
   * (DEP-M0902; codemod: motion-props).
   */
  motionPolicy?: GlassMotionPolicy;
}

/** 4.x mapping (REQ-MAT-15): reduced -> calm, expressive -> full +
 *  allowContinuous, none -> none, system -> OS. */
const MOTION_AXIS: Record<GlassMotionPolicy, GlassThemeTokens['motion']> = {
  system: { axis: 'system', allowContinuous: false },
  reduced: { axis: 'calm', allowContinuous: false },
  expressive: { axis: 'full', allowContinuous: true },
  none: { axis: 'none', allowContinuous: false },
};

/** 4.x-compatible createGlassTheme that still accepts `motionPolicy`. */
export const createGlassTheme = (options: CompatCreateGlassThemeOptions = {}): GlassTheme => {
  const { motionPolicy, ...rest } = options;
  const theme = createGlassTheme5(rest);
  if (motionPolicy === undefined) return theme;
  warnDeprecated('DEP-M0902');
  const motion = MOTION_AXIS[motionPolicy] ?? MOTION_AXIS.system;
  return { ...theme, tokens: { ...theme.tokens, motion: { ...motion } } };
};
