/* CMP-112 compat: GlassMasonry (4.x) -> Grid masonry (5.0).
   warnDeprecated fires at call time, once per page load per symbol;
   unmappable props drop with a single warning; never throws.
   Mapping: columns -> columns; gap (px number) -> gap length. 4.x defaulted
   role="grid" with no rows/cells, which is invalid ARIA; the adapter sets no
   role unless the caller passes one. Dropped: respectMotionPreference. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Grid } from '../../../components/grid/Grid';

const DEP = 'DEP-C0271';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  /** Gap in px (4.x semantics). */
  gap?: number;
  respectMotionPreference?: boolean;
}

export function GlassMasonry({
  columns = 3,
  gap = 12,
  respectMotionPreference,
  ...rest
}: GlassMasonryProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  warnDeprecated(DEP);
  if (respectMotionPreference !== undefined) drop('respectMotionPreference');
  return <Grid {...rest} masonry columns={columns} gap={`${gap}px`} />;
}
