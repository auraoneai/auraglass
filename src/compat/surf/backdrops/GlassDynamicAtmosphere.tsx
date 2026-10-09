'use client';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

/* DynamicAtmosphere type/primaryColor/secondaryColor are TODO in the
 * migration row; maps onto the aurora preset. */
export interface GlassDynamicAtmosphereProps {
  type?: string;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  children?: React.ReactNode;
}

/** @deprecated GlassDynamicAtmosphere DEP-S0611 since 4.2.0, removed in 6.0.0. {@link Backdrop presets from aura-glass/backdrops} */
export function GlassDynamicAtmosphere(props: GlassDynamicAtmosphereProps) {
  warnDeprecated('DEP-S0611');
  return <Backdrop preset="aurora" className={props.className}>{props.children}</Backdrop>;
}

/** @deprecated DynamicAtmosphere DEP-S0612 since 4.2.0, removed in 6.0.0. */
export function DynamicAtmosphere(props: GlassDynamicAtmosphereProps) {
  warnDeprecated('DEP-S0612');
  return <GlassDynamicAtmosphere {...props} />;
}
