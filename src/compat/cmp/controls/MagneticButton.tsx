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
  magnetic?: unknown;
  magneticStrength?: number;
  magneticRadius?: number;
}

type MotionModule = typeof import('../../../motion');
type MotionState = MotionModule | 'missing' | null;

/* Resolves aura-glass/motion on mount; 'missing' when the optional peer is
   absent (the import rejects), null while loading. */
function useMotionModule(enabled: boolean): MotionState {
  const [mod, setMod] = React.useState<MotionState>(null);
  React.useEffect(() => {
    if (!enabled) return;
    let live = true;
    import(/* webpackIgnore: true */ '../../../motion')
      .then((m) => { if (live) setMod(m); })
      .catch(() => { if (live) setMod('missing'); });
    return () => { live = false; };
  }, [enabled]);
  return mod;
}

type MagneticInnerProps = GlassButtonProps & { mod: MotionModule; magneticStrength?: number };

function MagneticInner({ mod, magneticStrength, ...rest }: MagneticInnerProps) {
  const { ref, style } = mod.magnetic({ strength: magneticStrength });
  return <GlassButton {...rest} ref={ref} style={style as React.CSSProperties} />;
}

export function MagneticButton({ magnetic, magneticStrength, magneticRadius, ...rest }: MagneticButtonProps) {
  warnDeprecated(DEP);
  if (magneticRadius !== undefined) drop('magneticRadius');
  const wanted = magnetic !== undefined || magneticStrength !== undefined;
  const mod = useMotionModule(wanted);
  if (!wanted) return <GlassButton {...rest} />;
  if (mod === 'missing') {
    warnDeprecated(`${DEP}.peer.motion`);
    return <GlassButton {...rest} />;
  }
  if (mod === null) return <GlassButton {...rest} />;
  return <MagneticInner mod={mod} magneticStrength={magneticStrength} {...rest} />;
}

/** 4.x also shipped `GlassMagneticButton` (DEP-C0041) — same adapter. */
export { MagneticButton as GlassMagneticButton } from './MagneticButton';
