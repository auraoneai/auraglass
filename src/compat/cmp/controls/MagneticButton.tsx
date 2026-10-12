/* CMP-323 compat: MagneticButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol.
   REQ-CMP-35: when the optional `motion` peer resolves, { magnetic } from
   aura-glass/motion is lazily imported and its binding applied to the button
   ref + style; without the peer the magnetic props drop with a single
   warning — never throws. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButtonMapped } from './_glassButtonMapping';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0007';
/** 4.x also shipped `GlassMagneticButton` (DEP-C0041) — the same adapter under its own id. */
const DEP_GLASS = 'DEP-C0041';

export interface MagneticButtonProps extends GlassButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
  magnetic?: unknown;
  magneticStrength?: number;
  magneticRadius?: number;
}

type MotionModule = typeof import('../../../motion/public');
// Keep native DOM handlers inside buttonProps. Motion otherwise interprets
// names such as onDrag/onAnimationStart as its own gesture/lifecycle callbacks.
// motion.create passes the composed ref as an element prop; React 19 hands it
// to the function component as a plain `ref` prop (no forwardRef, REQ-PLAT-72).
function MotionHost({ buttonProps, style, ref }: {
  buttonProps: GlassButtonProps & { dep: string };
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return <GlassButtonMapped {...{ ...buttonProps, ref, style }} />;
}

function createMotionButton(peer: typeof import('motion/react')) {
  return peer.motion.create(MotionHost);
}

type LoadedMotion = { mod: MotionModule; Button: ReturnType<typeof createMotionButton> };
// the motion-wrapped host's style type (no direct `motion/react` import outside src/motion/adapter, REQ-MOT-60)
type MotionStyle = NonNullable<React.ComponentProps<LoadedMotion['Button']>['style']>;
type MotionState = LoadedMotion | 'missing' | null;

/* Resolves aura-glass/motion on mount; 'missing' when the optional peer is
   absent (the import rejects), null while loading. */
function useMotionModule(enabled: boolean): MotionState {
  const [mod, setMod] = React.useState<MotionState>(null);
  React.useEffect(() => {
    if (!enabled) return;
    let live = true;
    Promise.all([import('../../../motion/public'), import('../../../motion/adapter/peer').then((peer) => peer.importMotionPeer())])
      .then(([mod, peer]) => {
        if (live) setMod({ mod, Button: createMotionButton(peer) });
      })
      .catch(() => { if (live) setMod('missing'); });
    return () => { live = false; };
  }, [enabled]);
  return mod;
}

type MagneticInnerProps = MagneticButtonProps & { loaded: LoadedMotion; dep: string };

function MagneticInner({ loaded, magneticStrength, ref: forwardedRef, style: userStyle, ...rest }: MagneticInnerProps) {
  const { ref: magneticRef, style } = loaded.mod.magnetic(magneticStrength === undefined ? {} : { strength: magneticStrength });
  const ref = React.useCallback((node: HTMLButtonElement | null) => {
    const cleanups: Array<() => void> = [];
    for (const target of [magneticRef, forwardedRef]) {
      if (typeof target === 'function') {
        const cleanup = target(node);
        if (typeof cleanup === 'function') cleanups.push(cleanup);
        else cleanups.push(() => { target(null); });
      } else if (target) {
        target.current = node;
        cleanups.push(() => { target.current = null; });
      }
    }
    return () => { for (const cleanup of cleanups) cleanup(); };
  }, [magneticRef, forwardedRef]);
  const MotionButton = loaded.Button;
  return <MotionButton buttonProps={rest} ref={ref} style={{ ...style, ...userStyle } as MotionStyle} />;
}

function MagneticAdapter({ dep, magnetic, magneticStrength, magneticRadius, ...rest }: MagneticButtonProps & { dep: string }) {
  warnDeprecated(dep);
  if (magneticRadius !== undefined) warnDeprecated(`${dep}.prop.magneticRadius`);
  const wanted = magnetic !== false && (magnetic !== undefined || magneticStrength !== undefined);
  const mod = useMotionModule(wanted);
  if (!wanted) return <GlassButtonMapped dep={dep} {...rest} />;
  if (mod === 'missing') {
    warnDeprecated(`${dep}.peer.motion`);
    return <GlassButtonMapped dep={dep} {...rest} />;
  }
  if (mod === null) return <GlassButtonMapped dep={dep} {...rest} />;
  return <MagneticInner loaded={mod} dep={dep} {...(magneticStrength === undefined ? {} : { magneticStrength })} {...rest} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Button}. */
export function MagneticButton(props: MagneticButtonProps) {
  return <MagneticAdapter dep={DEP} {...props} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Button}. */
export function GlassMagneticButton(props: MagneticButtonProps) {
  return <MagneticAdapter dep={DEP_GLASS} {...props} />;
}
