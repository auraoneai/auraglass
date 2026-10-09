/* CMP-112 compat: GlassMasonry (4.x) -> Grid masonry (5.0).
   warnDeprecated fires at call time, once per page load per symbol. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Grid } from '../../../components/grid/Grid';
import type { GridProps } from '../../../components/grid/Grid';

const DEP = 'DEP-C0225';

export type GlassMasonryProps = Omit<GridProps, 'variant' | 'masonry'>;

export function GlassMasonry(props: GlassMasonryProps) {
  warnDeprecated(DEP);
  return <Grid masonry {...props} />;
}
