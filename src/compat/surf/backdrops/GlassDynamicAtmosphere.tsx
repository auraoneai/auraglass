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

export function GlassDynamicAtmosphere(props: GlassDynamicAtmosphereProps) {
  warnDeprecated('GlassDynamicAtmosphere');
  return <Backdrop preset="aurora" className={props.className}>{props.children}</Backdrop>;
}

export function DynamicAtmosphere(props: GlassDynamicAtmosphereProps) {
  warnDeprecated('DynamicAtmosphere');
  return <GlassDynamicAtmosphere {...props} />;
}
