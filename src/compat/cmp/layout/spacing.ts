/* CMP-112 compat helpers: the 4.x layout gap scale (GlassFlex, GlassGrid)
   onto 5.0 SpaceToken indexes. 4.x resolved these names to
   --glass-space-{0,1,2,4,6,8,12}; the indexes below are the same steps. */
export type LegacyGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const LEGACY_GAP: Record<LegacyGap, '0' | '1' | '2' | '4' | '6' | '8' | '12'> = {
  none: '0',
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
};

/** var(--ag-space-N) for a 4.x gap name (used for gapX / gapY inline styles). */
export const legacyGapVar = (g: LegacyGap): string => `var(--ag-space-${LEGACY_GAP[g]})`;
