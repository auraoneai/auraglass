'use client';
import { warnDeprecated } from '../../../internal';
import { GlassFileTree, type GlassFileTreeProps } from './GlassFileTree';

/** @deprecated GlassFileExplorer DEP-S0638 since 4.2.0, removed in 6.0.0. */
export function GlassFileExplorer(props: GlassFileTreeProps) {
  warnDeprecated('DEP-S0638');
  return <GlassFileTree {...props} />;
}
