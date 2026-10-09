/* CMP-112 compat: GlassGrid (4.x) -> Grid (5.0).
   warnDeprecated fires at call time, once per page load per symbol. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Grid } from '../../../components/grid/Grid';
import type { GridProps } from '../../../components/grid/Grid';

const DEP = 'DEP-C0224';

export type GlassGridProps = GridProps;

export function GlassGrid(props: GlassGridProps) {
  warnDeprecated(DEP);
  return <Grid {...props} />;
}
