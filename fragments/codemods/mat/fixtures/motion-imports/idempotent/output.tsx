import { usePreference } from "aura-glass";
import { motionTokens } from "aura-glass/motion/tokens";

export function Glow() {
  const reduced = usePreference('motion') !== 'full';
  return <div style={{ transitionDuration: `${motionTokens.duration.small}ms` }} />;
}
