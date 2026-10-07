export function Hero({ children }: { children: React.ReactNode }) {
  // TODO(aura-glass 5): Motion preset="fadeIn" has no 5.x equivalent — attach a
  // Shared/motionTokens-driven transition, see docs/motion.md
  return <div>{children}</div>;
}
