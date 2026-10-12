/* CMP-112 compat: GlassFlex (4.x) -> Stack (5.0).
   warnDeprecated fires at call time, once per page load per symbol;
   unmappable props drop with a single warning; never throws.
   Mapping: direction row|col -> Stack direction (4.x default "row" is kept);
   row-reverse|col-reverse -> the same axis plus an inline flex-direction;
   wrap -> Stack wrap (wrap-reverse inline); justify/align -> Stack;
   alignContent -> inline align-content; gap/gapX/gapY names -> space tokens;
   fullWidth/fullHeight -> 100% inline size.
   Dropped: responsive (5.0 Stack has no per-breakpoint direction; compose
   with Grid or container queries), respectMotionPreference. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Stack } from '../../../components/stack/Stack';
import { LEGACY_GAP, legacyGapVar } from './spacing';
import type { LegacyGap } from './spacing';

const DEP = 'DEP-C0268';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

type Dir = 'row' | 'row-reverse' | 'col' | 'col-reverse';

export interface GlassFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Dir;
  responsive?: { sm?: Dir; md?: Dir; lg?: Dir; xl?: Dir; '2xl'?: Dir };
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch';
  gap?: LegacyGap;
  gapX?: LegacyGap;
  gapY?: LegacyGap;
  fullWidth?: boolean;
  fullHeight?: boolean;
  respectMotionPreference?: boolean;
}

const ALIGN_CONTENT = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  stretch: 'stretch',
} as const;

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Stack}. */
export function GlassFlex({
  direction = 'row',
  responsive,
  wrap,
  justify,
  align,
  alignContent,
  gap,
  gapX,
  gapY,
  fullWidth,
  fullHeight,
  respectMotionPreference,
  style,
  ...rest
}: GlassFlexProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  warnDeprecated(DEP);
  if (responsive !== undefined) drop('responsive');
  if (respectMotionPreference !== undefined) drop('respectMotionPreference');

  const s: React.CSSProperties = {};
  if (direction === 'row-reverse') s.flexDirection = 'row-reverse';
  if (direction === 'col-reverse') s.flexDirection = 'column-reverse';
  if (wrap === 'wrap-reverse') s.flexWrap = 'wrap-reverse';
  if (alignContent !== undefined) s.alignContent = ALIGN_CONTENT[alignContent];
  if (gapX !== undefined) s.columnGap = legacyGapVar(gapX);
  if (gapY !== undefined) s.rowGap = legacyGapVar(gapY);
  if (fullWidth) s.inlineSize = '100%';
  if (fullHeight) s.blockSize = '100%';

  return (
    <Stack
      {...rest}
      direction={direction === 'row' || direction === 'row-reverse' ? 'row' : 'column'}
      {...(wrap === 'wrap' || wrap === 'wrap-reverse' ? { wrap: true } : {})}
      {...(justify !== undefined ? { justify } : {})}
      {...(align !== undefined ? { align } : {})}
      {...(gap !== undefined ? { gap: LEGACY_GAP[gap] } : {})}
      style={{ ...s, ...style }}
    />
  );
}
