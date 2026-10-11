/* CMP-323 compat: MagneticButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol.
   REQ-CMP-35: when the optional `motion` peer resolves, { magnetic } from
   aura-glass/motion is lazily imported and its binding applied to the button
   ref + style; without the peer the magnetic props drop with a single
   warning — never throws. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButton } from './GlassButton';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0007';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface MagneticButtonProps extends GlassButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
  magnetic?: unknown;
  magneticStrength?: number;
  magneticRadius?: number;
}

type MotionModule = typeof import('../../../motion/public');
type LoadedMotion = { mod: MotionModule; Button: React.ComponentType<GlassButtonProps & { ref?: React.Ref<HTMLButtonElement> }> };
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
        if (live) setMod({ mod, Button: peer.motion.create(GlassButton) as LoadedMotion['Button'] });
      })
      .catch(() => { if (live) setMod('missing'); });
    return () => { live = false; };
  }, [enabled]);
  return mod;
}

type MagneticInnerProps = MagneticButtonProps & { loaded: LoadedMotion };

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
  return <MotionButton {...rest} ref={ref} style={{ ...style, ...userStyle } as React.CSSProperties} />;
}

export function MagneticButton({ magnetic, magneticStrength, magneticRadius, ...rest }: MagneticButtonProps) {
  warnDeprecated(DEP);
  if (magneticRadius !== undefined) drop('magneticRadius');
  const wanted = magnetic !== false && (magnetic !== undefined || magneticStrength !== undefined);
  const mod = useMotionModule(wanted);
  if (!wanted) return <GlassButton {...rest} />;
  if (mod === 'missing') {
    warnDeprecated(`${DEP}.peer.motion`);
    return <GlassButton {...rest} />;
  }
  if (mod === null) return <GlassButton {...rest} />;
  return <MagneticInner loaded={mod} {...(magneticStrength === undefined ? {} : { magneticStrength })} {...rest} />;
}

/** 4.x also shipped `GlassMagneticButton` (DEP-C0041) — same adapter. */
export { MagneticButton as GlassMagneticButton } from './MagneticButton';
