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
