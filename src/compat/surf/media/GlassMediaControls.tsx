'use client';
import { warnDeprecated } from '../../../internal';
import { LiquidGlassMediaControls, type LiquidGlassMediaControlsProps } from './LiquidGlassMediaControls';

export type GlassMediaControlsProps = LiquidGlassMediaControlsProps;

/** @deprecated GlassMediaControls DEP-S0601 since 4.2.0, removed in 6.0.0. {@link MediaControls.Root from aura-glass/media} */
export function GlassMediaControls(props: GlassMediaControlsProps) {
  warnDeprecated('DEP-S0601';
  return <LiquidGlassMediaControls {...props} />;
}
