/* stories/mat/_shared.tsx — MAT lane 2e-B story helpers: pending callout and
   safe glob readers for cross-lane artifacts that may not have merged yet. */
/// <reference types="vite/client" />
import * as React from 'react';

/** Visible "pending" marker for cross-lane inputs that have not merged. */
export function PendingCallout({ what }: { what: string }) {
  return (
    <div
      data-ag-pending={what}
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

/** Read optional JSON/text assets without breaking the build when absent. */
export function globJson(pattern: string): Record<string, unknown> | null {
  const found = import.meta.glob<Record<string, unknown>>([pattern], { eager: true, import: 'default' });
  const values = Object.values(found);
  return values.length > 0 ? (values[0] as Record<string, unknown>) : null;
}

export function globUrls(pattern: string): string[] {
  const found = import.meta.glob<string>([pattern], { eager: true, query: '?url', import: 'default' });
  return Object.values(found);
}

/** WCAG "adjusted" threshold used by presets playground marking. */
export const CONTRAST_FLOOR = 4.5;
