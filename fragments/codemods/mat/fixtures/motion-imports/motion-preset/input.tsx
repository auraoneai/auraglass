// @ts-nocheck
import { Motion } from "aura-glass";

export function Hero({ children }: { children: React.ReactNode }) {
  return <Motion preset="fadeIn">{children}</Motion>;
}
