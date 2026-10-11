/* GlassDynamicAtmosphere / DynamicAtmosphere — 4.x compat adapters
   (REQ-SURF-13, DEP-S0611 / DEP-S0612) → Backdrop preset="aurora".
   type/intensity/speed/primaryColor/secondaryColor have no 5.0 counterpart
   (the preset is the replacement; TODO documented in the migration row);
   any non-zero speed keeps motion="drift". Each export warns with its own id. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

export interface GlassDynamicAtmosphereProps {
  type?: string;
  intensity?: number;
  speed?: number;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

function LegacyAtmosphere({ speed, className, children }: GlassDynamicAtmosphereProps) {
  return (
    <Backdrop preset="aurora" motion={speed ? 'drift' : 'static'} {...(className ? { className } : {})}>
      {children}
    </Backdrop>
  );
}

/**
 * 4.x `GlassDynamicAtmosphere` compat adapter (DEP-S0611).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Backdrop presets from aura-glass/backdrops}.
 */
export function GlassDynamicAtmosphere(props: GlassDynamicAtmosphereProps) {
  warnDeprecated('DEP-S0611');
  return <LegacyAtmosphere {...props} />;
}

/**
 * 4.x `DynamicAtmosphere` compat adapter (DEP-S0612).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Backdrop presets from aura-glass/backdrops}.
 */
export function DynamicAtmosphere(props: GlassDynamicAtmosphereProps) {
  warnDeprecated('DEP-S0612');
  return <LegacyAtmosphere {...props} />;
}
