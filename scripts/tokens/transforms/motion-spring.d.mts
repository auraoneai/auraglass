// Declarations for transforms/motion-spring.mjs.
export interface SpringSpec { dampingRatio: number; response: { value: number; unit: string } }
export interface CompiledSpring {
  linear: string;
  durationMs: number;
  zeta: number;
  responseMs: number;
  /** (2π / (responseMs/1000))² */
  stiffness: number;
  /** 2ζ√stiffness */
  damping: number;
}
export function compileSpring(spring: SpringSpec | unknown, tokenPath?: string): CompiledSpring;
export const springToLinear: (v: unknown) => string;
export const springDurationMs: (v: unknown) => number;
