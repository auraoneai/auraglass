// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Frozen 4.x consumer usage — AuroraBackground + GlassBackdrop +
// DynamicAtmosphere + WaveBackdrop.
import { AuroraBackground, GlassBackdrop, DynamicAtmosphere, WaveBackdrop } from 'aura-glass';

export function LandingPage() {
  return (
    <>
      <AuroraBackground intensity="strong">
        <h1>Welcome</h1>
      </AuroraBackground>
      <GlassBackdrop blur="lg" />
      <DynamicAtmosphere source="video" />
      <WaveBackdrop animated />
    </>
  );
}
