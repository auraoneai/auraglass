/* stories/mat/_shared.tsx — MAT lane 2e-B story helpers: pending callout and
   safe glob readers for cross-lane artifacts that may not have merged yet. */
/// <reference types="vite/client" />
import * as React from 'react';

/** Visible "pending" marker for cross-lane inputs that have not merged. */
export function PendingCallout({ what }: { what: string }) {
  return (
    <div
      data-pending={what}
      style={{
        border: '1px dashed #f59e0b',
        borderRadius: 8,
        padding: '10px 14px',
        fontFamily: 'ui-monospace, monospace',
        fontSize: 13,
        color: '#b45309',
        background: 'rgba(245, 158, 11, 0.08)',
      }}
    >
      pending: {what}
    </div>
  );
}

/** Read optional JSON/text assets without breaking the build when absent.
    Vite only expands `import.meta.glob` with literal patterns, so callers pass
    the eager glob result (`import.meta.glob('/x.json', { eager: true, import:
    'default' })`) and these helpers normalise the possibly-empty match. */
export function globJson(found: Record<string, unknown>): Record<string, unknown> | null {
  const values = Object.values(found);
  return values.length > 0 ? (values[0] as Record<string, unknown>) : null;
}

export function globUrls(found: Record<string, unknown>): string[] {
  return Object.values(found) as string[];
}

/** WCAG "adjusted" threshold used by presets playground marking. */
export const CONTRAST_FLOOR = 4.5;

/** OKLCH -> hex (CSS oklch L in 0..1, C 0..~0.4, H degrees). Local helper so
    the playground exercises the real createBrandGlassTheme today; the 5.0
    theme API (contrast.pairs/contrast.adjusted) substitutes when MAT merges. */
export function oklchToHex(l: number, c: number, h: number): string {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541729 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ ** 3, M = m_ ** 3, S = s_ ** 3;
  const lin = (v: number) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * 255)));
  const r = clamp(lin(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S));
  const g = clamp(lin(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S));
  const bl = clamp(lin(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S));
  return '#' + [r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('');
}
