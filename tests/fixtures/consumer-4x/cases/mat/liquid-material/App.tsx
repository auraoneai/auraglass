// @ts-nocheck
/* Frozen 4.x consumer case — LiquidGlassMaterial with the full optical prop
   surface a real 4.x app would pass (ior, adaptToContent, sheen, tintMode). */
import * as React from 'react';
import { LiquidGlassMaterial } from 'aura-glass';

export function SettingsPanel() {
  return (
    <LiquidGlassMaterial
      material="liquid"
      variant="clear"
      elevation="level3"
      ior={1.45}
      thickness={6}
      sheen="soft"
      tintMode="adaptive"
      adaptToContent
      adaptToMotion
      interactive
      performanceLevel="balanced"
      onContrastAdjustment={(ratio: number) => console.log('contrast', ratio)}
    >
      <form>
        <label htmlFor="name">Workspace name</label>
        <input id="name" defaultValue="aurora" />
      </form>
    </LiquidGlassMaterial>
  );
}

export default SettingsPanel;
