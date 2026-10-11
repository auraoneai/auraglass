/* src/compat/mat/material/shared.ts — REQ-MAT-24 mapping helpers shared by the
   4.x material compat adapters (MAT-354/355). Dropped optical props warn once
   per adapter id via warnDeprecated (REL-072). */
import { warnDeprecated } from '../../../internal/index';
import type { Thickness } from '../../../contracts/material';

/** The 16 4.x optical props deleted in 5.0 (REQ-MAT-24; type errors on Surface). */
export const OPTICAL_NOOP = [
  'caustics',
  'chromatic',
  'lighting',
  'ior',
  'tier',
  'depth',
  'tint',
  'glowIntensity',
  'glowColor',
  'optimization',
  'hardwareAcceleration',
  'intensity',
  'blur',
  'parallax',
  'magnet',
  'cursorHighlight',
] as const;

/** Adapter-local props with no 5.0 mapping (warnings keep the original names). */
export const EXTRA_NOOP = [
  'rounded',
  'radius',
  'glow',
  'hover',
  'press',
  'animation',
  'performanceMode',
  'liftOnHover',
  'hoverLift',
  'hoverSheen',
  'focusRing',
  'disabled',
  'size',
  'enableMicroInteractions',
  'enableParallax',
  'enableReflection',
  'environmentAdaptation',
  'motionResponsive',
  'adaptToMotion',
  'adaptToContent',
  'contrastLevel',
  'performanceLevel',
  'quality',
  'showDebug',
  'onContrastAdjustment',
  'onBackdropAnalysis',
  'tintMode',
  'sheen',
  'enableTilt',
  'material',
  'morph',
  'samplingStrategy',
  'insideEffectGroup',
  'contrastPolicy',
  'asChild',
  'shape',
  'fallbackRadius',
  'active',
  'height',
  'targetRef',
  'observeScroll',
  'asContainer',
  'edgeClassName',
  'edgeStyle',
  'containerClassName',
  'containerStyle',
  'onOpenChange',
] as const;

const NOOP = new Set<string>([...OPTICAL_NOOP, ...EXTRA_NOOP]);

/**
 * Partition `rest` into the DOM props that still pass through and the dropped
 * props. Fires one warnDeprecated naming the adapter and every dropped prop.
 * Returns the surviving props object (mutated copy — callers must not reuse
 * `rest` afterwards).
 */
export function dropNoopProps(
  adapterId: string,
  rest: Record<string, unknown>,
  extraDropped: string[] = [],
): Record<string, unknown> {
  const dropped: string[] = [];
  for (const key of Object.keys(rest)) {
    if (NOOP.has(key) || extraDropped.includes(key)) {
      delete rest[key];
      dropped.push(key);
    }
  }
  // extraDropped names props the caller destructured out of `rest` before
  // calling (e.g. an unmappable `intent` value) — they still warn.
  for (const key of extraDropped) if (!dropped.includes(key)) dropped.push(key);
  if (dropped.length > 0) warnDeprecated(`${adapterId}:${dropped.join(',')}`);
  return rest;
}

/** REQ-MAT-24: elevation 0|1 -> 'thin', 2 -> 'regular', 3+ -> 'thick'.
 *  Accepts 4.x 'levelN' strings and bare numbers. */
export function elevationToThickness(elevation: string | number | undefined): Thickness | undefined {
  if (elevation === undefined) return undefined;
  const n = typeof elevation === 'number' ? elevation : Number.parseInt(String(elevation).replace(/^level/, ''), 10);
  if (Number.isNaN(n)) return undefined;
  return n <= 1 ? 'thin' : n === 2 ? 'regular' : 'thick';
}

/** LiquidGlassMaterial `thickness` (0-8 px) -> the same 5.0 bands. */
export function thicknessNumberToThickness(thickness: number | undefined): Thickness | undefined {
  if (thickness === undefined || Number.isNaN(thickness)) return undefined;
  return thickness <= 1 ? 'thin' : thickness === 2 ? 'regular' : 'thick';
}

/** 4.x pixel spacing -> the 5.0 4pt-grid SpaceToken (nearest grid step). */
export const SPACE_TOKENS = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'] as const;
export function pxToSpaceToken(spacing: number | string | undefined): (typeof SPACE_TOKENS)[number] | undefined {
  if (spacing === undefined) return undefined;
  const px = typeof spacing === 'number' ? spacing : Number.parseFloat(String(spacing));
  if (Number.isNaN(px)) return undefined;
  const grid = Math.max(0, Math.round(px / 4));
  const str = String(grid);
  const allowed = (SPACE_TOKENS as readonly string[]).includes(str)
    ? str
    : (SPACE_TOKENS as readonly string[]).reduce((a, b) => (Math.abs(Number(b) - grid) < Math.abs(Number(a) - grid) ? b : a));
  return allowed as (typeof SPACE_TOKENS)[number];
}
