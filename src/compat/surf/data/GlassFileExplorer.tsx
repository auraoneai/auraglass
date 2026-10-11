'use client';
import { warnDeprecated } from '../../../internal';
import { GlassFileTree, type GlassFileTreeProps } from './GlassFileTree';

export function GlassFileExplorer(props: GlassFileTreeProps) {
  warnDeprecated('GlassFileExplorer');
  return <GlassFileTree {...props} />;
}
