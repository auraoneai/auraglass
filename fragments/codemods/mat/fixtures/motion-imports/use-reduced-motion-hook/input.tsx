import { useReducedMotion, useEnhancedReducedMotion } from "aura-glass";

export function Glow() {
  const reduced = useReducedMotion();
  const enhanced = useEnhancedReducedMotion();
  return reduced || enhanced ? null : <div className="glow" />;
}
