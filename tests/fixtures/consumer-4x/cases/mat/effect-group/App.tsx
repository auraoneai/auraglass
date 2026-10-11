// @ts-nocheck
/* Frozen 4.x consumer case — a shared-backdrop LiquidGlassEffectGroup inside
   a LiquidGlassLayerProvider, as shipped by 4.x dashboard surfaces. */
import * as React from 'react';
import { LiquidGlassEffectGroup, LiquidGlassLayerProvider, LiquidGlassMaterial } from 'aura-glass';

export function DashboardRow() {
  return (
    <LiquidGlassLayerProvider contrastPolicy="AA">
      <LiquidGlassEffectGroup spacing={16} morph samplingStrategy="distributed">
        <LiquidGlassMaterial variant="regular" thickness={2}>Revenue</LiquidGlassMaterial>
        <LiquidGlassMaterial variant="regular" thickness={2}>Signups</LiquidGlassMaterial>
        <LiquidGlassMaterial variant="regular" thickness={2}>Churn</LiquidGlassMaterial>
      </LiquidGlassEffectGroup>
    </LiquidGlassLayerProvider>
  );
}

export default DashboardRow;
