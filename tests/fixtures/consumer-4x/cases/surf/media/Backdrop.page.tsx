// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Frozen 4.x consumer usage — AuroraBackground + AtmosphericBackground +
// DynamicAtmosphere (the aura-glass@4.1.0 backdrop family).
import { AuroraBackground, AtmosphericBackground, DynamicAtmosphere } from 'aura-glass';

export function LandingPage() {
  return (
    <>
      <AuroraBackground intensity="strong">
        <h1>Welcome</h1>
      </AuroraBackground>
      <AtmosphericBackground variant="foggy" animated />
      <DynamicAtmosphere type="waves" intensity={0.6} />
    </>
  );
}
