'use client';
import { warnDeprecated } from '../../../internal';
import { LiquidGlassMediaControls, type LiquidGlassMediaControlsProps } from './LiquidGlassMediaControls';

export type GlassMediaControlsProps = LiquidGlassMediaControlsProps;

export function GlassMediaControls(props: GlassMediaControlsProps) {
  warnDeprecated('DEP-S0601';
  return <LiquidGlassMediaControls {...props} />;
}
