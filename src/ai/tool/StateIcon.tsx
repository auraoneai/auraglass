import * as React from 'react';
import type { AgToolDisplayState } from '../types';

/**
 * REQ-SURF-120 / REQ-SURF-123: one glyph per display state (icon + text, never
 * colour alone). Server-safe: no directive, no hooks — AgentSteps (a server
 * module) and ToolCall both render it. Pure 24×24 path data, `aria-hidden`;
 * the visible state text next to it is the accessible name.
 */
export type AgStateIconName = AgToolDisplayState | 'skipped';

export const STATE_ICON_PATHS: Record<AgStateIconName, string> = {
  // clock
  queued: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7z',
  // circular arrows
  running: 'M12 4V1L8 5l4 4V6a6 6 0 0 1 5.7 7.9l1.5 1.5A8 8 0 0 0 12 4zm0 14a6 6 0 0 1-5.7-7.9L4.8 8.6A8 8 0 0 0 12 20v3l4-4-4-4z',
  // raised hand / attention
  'needs-approval': 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  // check
  succeeded: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
  // cross in circle
  failed: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 13.6L15.6 17 12 13.4 8.4 17 7 15.6 10.6 12 7 8.4 8.4 7l3.6 3.6L15.6 7 17 8.4 13.4 12z',
  // no-entry
  denied: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM4 12a8 8 0 0 1 12.9-6.3L5.7 16.9A7.9 7.9 0 0 1 4 12zm8 8a7.9 7.9 0 0 1-4.9-1.7L18.3 7.1A8 8 0 0 1 12 20z',
  // skip-forward
  skipped: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
};

export interface StateIconProps {
  state: AgStateIconName;
  size?: number;
}

export function StateIcon({ state, size = 16 }: StateIconProps) {
  return (
    <svg
      aria-hidden="true"
      data-ag-part="state-icon"
      data-ag-icon={state}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
    >
      <path d={STATE_ICON_PATHS[state]} />
    </svg>
  );
}
