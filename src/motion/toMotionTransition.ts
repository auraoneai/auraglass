/* MAT-217 REQ-MOT-52/-53: motionTokens → motion-library transition objects.
   Springs emit {type:'spring', stiffness, damping, mass:1, velocity?} — never
   bounce/visualDuration. Durations emit {duration: ms/1000, ease}; exit uses
   durationExit + ease.accelerate. Only ms→s conversion is applied. */
import { DURATIONS_MS, EASES } from '../contracts/motion';
import type { DurationName, EaseName, MotionTokenName, SpringName } from '../contracts/motion';
import { motionTokens } from './tokens.generated';
import { springParams } from './springs';

export interface SpringTransition {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass: 1;
  velocity?: number;
}
export interface TweenTransition {
  duration: number; // seconds
  ease: readonly [number, number, number, number];
}
export type MotionTransition = SpringTransition | TweenTransition;

export interface ToMotionTransitionOpts {
  exit?: boolean;
  velocity?: number;
  ease?: EaseName;
}

const tokenMs = (dotted: string, dashed: string, fallback: number): number => {
  const mt = motionTokens as Record<string, unknown>;
  const v = mt[dotted] ?? mt[dashed];
  return typeof v === 'number' ? v : fallback;
};

export function toMotionTransition(token: MotionTokenName, opts: ToMotionTransitionOpts = {}): MotionTransition {
  if (token.startsWith('spring-')) {
    const name = token.slice('spring-'.length) as SpringName;
    const { stiffness, damping } = springParams(name);
    const t: SpringTransition = { type: 'spring', stiffness, damping, mass: 1 };
    if (opts.velocity !== undefined) t.velocity = opts.velocity;
    return t;
  }
  const name = token.slice('duration-'.length) as DurationName;
  const base = DURATIONS_MS[name];
  const ms = opts.exit
    ? tokenMs(`duration.${name}-exit`, `duration-${name}-exit`, base.exit)
    : tokenMs(`duration.${name}`, `duration-${name}`, base.enter);
  return { duration: ms / 1000, ease: opts.ease ? EASES[opts.ease] : (opts.exit ? EASES.accelerate : EASES.standard) };
}
