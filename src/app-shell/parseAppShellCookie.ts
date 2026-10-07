/**
 * Server-safe `ag-shell-*` cookie parser (SURF-007).
 * Cookie body is `sidebar:<state>;inspector:<state>` in any key order with
 * extra keys tolerated. Never throws; anything oversized or malformed
 * parses to {}.
 */

export type SidebarState = 'expanded' | 'rail' | 'collapsed';
export type InspectorState = 'open' | 'closed';

export interface AppShellCookie {
  sidebar?: SidebarState;
  inspector?: InspectorState;
}

const SIDEBAR_STATES: ReadonlySet<string> = new Set(['expanded', 'rail', 'collapsed']);
const INSPECTOR_STATES: ReadonlySet<string> = new Set(['open', 'closed']);
const MAX_BYTES = 4096;

export function parseAppShellCookie(value: string | undefined | null): AppShellCookie {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_BYTES) {
    return {};
  }
  const out: AppShellCookie = {};
  for (const part of value.split(';')) {
    const eq = part.indexOf(':');
    if (eq <= 0) continue;
    const key = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (key === 'sidebar' && SIDEBAR_STATES.has(v)) {
      out.sidebar = v as SidebarState;
    } else if (key === 'inspector' && INSPECTOR_STATES.has(v)) {
      out.inspector = v as InspectorState;
    }
    // unknown keys/states ignored
  }
  return out;
}

export function serializeAppShellCookie(state: AppShellCookie): string {
  const parts: string[] = [];
  if (state.sidebar) parts.push(`sidebar:${state.sidebar}`);
  if (state.inspector) parts.push(`inspector:${state.inspector}`);
  return parts.join(';');
}
