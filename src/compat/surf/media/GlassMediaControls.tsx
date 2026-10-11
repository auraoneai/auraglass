/* GlassMediaControls — 4.x compat adapter (REQ-SURF-13, DEP-S0601) →
   MediaControls.Root, sharing the LiquidGlassMediaControls mapping (one
   warning: this adapter's own DEP id). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LegacyMediaControls, type LiquidGlassMediaControlsProps } from './LiquidGlassMediaControls';

export type GlassMediaControlsProps = LiquidGlassMediaControlsProps;

/**
 * 4.x `GlassMediaControls` compat adapter (DEP-S0601).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link MediaControls.Root from aura-glass/media}.
 */
export function GlassMediaControls(props: GlassMediaControlsProps) {
  warnDeprecated('DEP-S0601');
  return <LegacyMediaControls {...props} />;
}
