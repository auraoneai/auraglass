'use client';
import { warnDeprecated } from '../../../internal';
import { GlassFileTree, type GlassFileTreeProps } from './GlassFileTree';

export function GlassFileExplorer(props: GlassFileTreeProps) {
  warnDeprecated('DEP-S0638');
  return <GlassFileTree {...props} />;
}
