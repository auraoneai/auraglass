/* CMP-112 compat: GlassGrid (4.x) -> Grid (5.0).
   warnDeprecated fires at call time, once per page load per symbol;
   unmappable props drop with a single warning; never throws.
   Mapping: cols -> columns; responsive {sm,md,lg} -> columns {base: cols,
   sm, md, lg} (5.0 breakpoints are container widths 480/768/1024 px, not
   viewport widths); gap/gapX/gapY names -> space tokens; autoFit +
   minColWidth -> minItemWidth; flow/align/justify -> grid inline styles.
   Dropped: responsive.xl, respectMotionPreference. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Grid } from '../../../components/grid/Grid';
import type { GridColumns } from '../../../components/grid/Grid';
import { LEGACY_GAP, legacyGapVar } from './spacing';
import type { LegacyGap } from './spacing';

const DEP = 'DEP-C0270';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GlassGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: Cols;
  responsive?: { sm?: Cols; md?: Cols; lg?: Cols; xl?: Cols };
  gap?: LegacyGap;
  gapX?: LegacyGap;
  gapY?: LegacyGap;
  autoFit?: boolean;
  minColWidth?: string;
  flow?: 'row' | 'col' | 'row-dense' | 'col-dense';
  align?: 'start' | 'end' | 'center' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  respectMotionPreference?: boolean;
}

const FLOW = { row: 'row', col: 'column', 'row-dense': 'row dense', 'col-dense': 'column dense' } as const;
const JUSTIFY = { start: 'start', end: 'end', center: 'center', between: 'space-between', around: 'space-around', evenly: 'space-evenly' } as const;

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Grid}. */
export function GlassGrid({
  cols = 12,
  responsive,
  gap = 'md',
  gapX,
  gapY,
  autoFit = false,
  minColWidth = '250px',
  flow,
  align,
  justify,
  respectMotionPreference,
  style,
  ...rest
}: GlassGridProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  warnDeprecated(DEP);
  if (respectMotionPreference !== undefined) drop('respectMotionPreference');
  if (responsive?.xl !== undefined) drop('responsive.xl');

  const columns: GridColumns = responsive && (responsive.sm ?? responsive.md ?? responsive.lg) !== undefined
    ? {
        base: cols,
        ...(responsive.sm !== undefined ? { sm: responsive.sm } : {}),
        ...(responsive.md !== undefined ? { md: responsive.md } : {}),
        ...(responsive.lg !== undefined ? { lg: responsive.lg } : {}),
      }
    : cols;

  const s: React.CSSProperties = { ...style };
  if (gapX !== undefined) s.columnGap = legacyGapVar(gapX);
  if (gapY !== undefined) s.rowGap = legacyGapVar(gapY);
  if (flow !== undefined) s.gridAutoFlow = FLOW[flow];
  if (align !== undefined) s.alignItems = align;
  if (justify !== undefined) s.justifyContent = JUSTIFY[justify];

  return (
    <Grid
      {...rest}
      columns={columns}
      gap={LEGACY_GAP[gap]}
      {...(autoFit ? { minItemWidth: minColWidth } : {})}
      style={s}
    />
  );
}
