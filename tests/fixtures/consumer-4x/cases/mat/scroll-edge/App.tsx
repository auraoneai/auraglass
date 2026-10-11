// @ts-nocheck
/* Frozen 4.x consumer case — scroll edge treatment + concentric frame on a
   4.x settings page. */
import * as React from 'react';
import { LiquidGlassConcentricFrame, LiquidGlassScrollEdge } from 'aura-glass';

export function SettingsPage() {
  return (
    <div style={{ height: 400, overflowY: 'auto' }}>
      <LiquidGlassScrollEdge edge="top" styleMode="soft" active asContainer />
      <LiquidGlassConcentricFrame radius="lg" inset={8} shape="concentric">
        <section>
          <h3>Notifications</h3>
          <p>Choose where alerts appear.</p>
        </section>
      </LiquidGlassConcentricFrame>
      <LiquidGlassScrollEdge edge="bottom" styleMode="hard" active={false} />
    </div>
  );
}

export default SettingsPage;
