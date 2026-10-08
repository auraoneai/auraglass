/** audit backdrop thresholds — constants (PLAT-319). Remote service enforces; CLI sends. */

export const AUDIT_THRESHOLDS = {
  /** max share of page pixels covered by translucent surfaces */
  maxTranslucentCoverage: 0.6,
  /** max stacked translucent layers before blend collapse */
  maxStackDepth: 3,
  /** min contrast ratio text-on-glass */
  minTextContrast: 4.5,
  /** max backdrop-filter blur radius (px) before performance cliff */
  maxBlurPx: 48,
} as const;

export type AuditThresholds = typeof AUDIT_THRESHOLDS;
