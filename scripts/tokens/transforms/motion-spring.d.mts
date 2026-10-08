// Declarations for transforms/motion-spring.mjs.
export interface SpringSpec { dampingRatio: number; response: { value: number; unit: string } }
export interface CompiledSpring { linear: string; durationMs: number; stops: Array<[number, number]> }
export function compileSpring(spring: SpringSpec | unknown, tokenPath?: string): CompiledSpring;
export const springToLinear: (v: unknown) => string;
export const springDurationMs: (v: unknown) => number;
