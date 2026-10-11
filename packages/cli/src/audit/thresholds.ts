/**
 * `audit backdrop` thresholds (REQ-PLAT-89, architecture §15.2 pixel gates).
 *
 * These constants are the single source the CLI sends to the remote endpoint
 * and re-applies to every surface the endpoint reports. They mirror §15.2:
 *
 * - Material presence ("glass over nothing"): the standard deviation of the
 *   backdrop luminance under a surface's border box, captured with only that
 *   surface hidden, in 8-bit levels (0–255). Below the floor the surface is
 *   glass over a flat backdrop and fails. The level value is the one REQ-QUAL-14
 *   fixes for the same gate (σ(L) < 4 levels → `glass-over-nothing`).
 * - OCR text contrast on rendered pixels: WCAG ratio between glyph ink and the
 *   pixels behind it, ≥ 4.5:1 for body text and ≥ 3:1 for large text.
 * - Transparency rungs: the effective states of architecture §7.2 / §15.1
 *   (`glass`, `tinted`, `solid`). `solid` has no backdrop-filter, so the
 *   material-presence floor does not apply to it.
 */

/** Minimum σ of backdrop luminance (8-bit levels) under a translucent surface. */
export const LUM_VARIANCE_MIN_LEVELS = 4;

/** Minimum rendered-pixel text contrast ratios (WCAG 2.x). */
export const OCR_CONTRAST = {
  body: 4.5,
  large: 3.0,
} as const;

/** Transparency rung ids, in fallback order. */
export const TRANSPARENCY_RUNGS = ['glass', 'tinted', 'solid'] as const;
export type TransparencyRung = (typeof TRANSPARENCY_RUNGS)[number];

/** Rungs that keep a translucent material and therefore need a live backdrop. */
export const TRANSLUCENT_RUNGS: readonly TransparencyRung[] = ['glass', 'tinted'];

/** The threshold object sent in every request (schema `#/$defs/thresholds`). */
export const AUDIT_THRESHOLDS = {
  lumVariance: { minLevels: LUM_VARIANCE_MIN_LEVELS },
  ocrContrast: { body: OCR_CONTRAST.body, large: OCR_CONTRAST.large },
  rungs: [...TRANSPARENCY_RUNGS],
  translucentRungs: [...TRANSLUCENT_RUNGS],
};

export type AuditThresholds = typeof AUDIT_THRESHOLDS;
