// @ts-nocheck
import { usePreference } from "aura-glass";

export function Glow() {
  const reduced = usePreference('motion') !== 'full';
  const enhanced = usePreference('motion') !== 'full';
  return reduced || enhanced ? null : <div className="glow" />;
}
