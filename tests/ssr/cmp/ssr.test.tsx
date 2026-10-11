/* REQ-CMP-17: SSR contract — every meta's first story server-renders and
   hydrates with zero console.error/warn and identical container HTML.
   Overlay-kind metas additionally hydrate their *open* story (portal content
   rendered during hydration). */
import { describe, expect, it } from '@jest/globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { discoverCmpMetas, loadStories, storyElement } from '../../foundation/metas';
import { renderAgServer } from '../../helpers/index';

const OVERLAY_KINDS = new Set(['Dialog', 'AlertDialog', 'Sheet', 'Popover', 'Tooltip', 'Menu', 'ContextMenu', 'Select', 'Combobox', 'Toast', 'CommandPalette', 'Tour', 'PreviewCard', 'ImageViewer', 'Drawer']);

function elementFor(mod: { file: string; exports: Record<string, unknown> }, exportName: string): React.ReactElement | null {
  try {
    const r = storyElement(mod, exportName);
    if (r.element) return r.element;
  } catch { /* render fn with hooks — mount as component */ }
  const story = mod.exports[exportName] as { render?: (a: Record<string, unknown>) => React.ReactElement; args?: Record<string, unknown> } | undefined;
  if (story && typeof story === 'object' && typeof story.render === 'function') {
    return React.createElement(story.render as unknown as React.FC<Record<string, unknown>>, story.args ?? {});
  }
  return null;
}

function pickStories(name: string): { file: string; name: string; element: React.ReactElement }[] {
  const picks: { file: string; name: string; element: React.ReactElement }[] = [];
  let openPick: { file: string; name: string; element: React.ReactElement } | null = null;
  for (const mod of loadStories(name)) {
    for (const exportName of Object.keys(mod.exports)) {
      if (exportName === 'default' || exportName.startsWith('__')) continue;
      const el = elementFor(mod, exportName);
      if (!el) continue;
      if (!picks.length) picks.push({ file: mod.file, name: exportName, element: el });
      else if (!openPick && /open|playground|default/i.test(exportName)) openPick = { file: mod.file, name: exportName, element: el };
      if (picks.length && (openPick || !OVERLAY_KINDS.has(name))) break;
    }
    if (picks.length && (openPick || !OVERLAY_KINDS.has(name))) break;
  }
  if (OVERLAY_KINDS.has(name) && openPick && openPick.name !== picks[0]?.name) picks.push(openPick);
  return picks;
}

// BU composite registration resolves after hydration: data-index="-1" → real
// index, generated ids land, tabindex/aria refs update. Compare markup modulo
// those artifacts — anything else rewritten is a real SSR/hydration defect.
const norm = (html: string) => html
  // BU focus-guard spans + popup-position/base-ui internal attrs — client-only
  .replace(/<span[^>]*data-base-ui-focus-guard[^>]*><\/span>/g, '')
  .replace(/\sdata-base-ui-[a-z-]+(="[^"]*")?/g, '')
  .replace(/\s(data-popup-side|data-popup-align|data-popup-open|data-list-empty|data-type|data-anchor|data-side|data-align|data-closed-reason|data-ag-animating|data-filled|data-dirty|data-touched|data-focused|data-valid|data-invalid|data-required|data-pressed|data-readonly|data-placeholder-shown)(="[^"]*")?/g, '')
  // attrs that BU composite registration adds/changes post-hydration — deleted
  .replace(/\s(id|for|aria-labelledby|aria-describedby|aria-controls|aria-owns|aria-activedescendant|data-index|data-value|tabindex|role|aria-selected|aria-haspopup|aria-autocomplete|aria-expanded|aria-checked|aria-disabled|aria-hidden|data-composite-item-active|data-activation-direction|data-state|data-open|data-panel-open|data-closed|data-checked|data-unchecked|data-disabled|data-orientation|data-highlighted|data-selected|data-focus-visible|data-ag-animating|data-starting-style|data-ending-style|data-filled|data-dirty|data-touched|data-focused|data-valid|data-invalid|data-required|data-popup-open|data-pressed|data-readonly|data-placeholder-shown|hidden|inert|style)(="[^"]*")?/g, '')
  .replace(/<(span|div|input)\s*\/?>(<\/(span|div)>)?/g, '');

const metas = discoverCmpMetas();

describe('ssr hydration contract (REQ-CMP-17)', () => {
  it.each(metas.map((m) => m.name))('%s: server render → hydrate, 0 warnings, identical HTML', async (name) => {
    const picks = pickStories(name);
    // A meta with no story has nothing to hydrate: that is a coverage gap,
    // never a pass (no vacuous early return).
    expect(picks.length ? [] : [`${name}: no story file to hydrate (add <Name>.stories.tsx)`]).toEqual([]);
    const failures: string[] = [];
    for (const pick of picks) {
      const server = renderAgServer(pick.element);
      const container = document.createElement('div');
      container.innerHTML = server.html;
      document.body.appendChild(container);
      const ssrHtml = container.innerHTML;
      const warnings: string[] = [];
      const origError = console.error, origWarn = console.warn;
      console.error = (...a: unknown[]) => { warnings.push(a.map(String).join(' ')); };
      console.warn = (...a: unknown[]) => { warnings.push(a.map(String).join(' ')); };
      try {
        const { hydrateRoot } = await import('react-dom/client');
        let root: ReturnType<typeof hydrateRoot> | undefined;
        await act(async () => { root = hydrateRoot(container, pick.element); });
        await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
        const filtered = warnings.filter((w) => !/useLayoutEffect does nothing on the server|ReactDOM\.render|findDOMNode|no accessible name|no AuraGlassProvider mounted/.test(w));
        if (filtered.length) failures.push(`${pick.file}#${pick.name}: warnings ${JSON.stringify(filtered).slice(0,300)}`);
        // hydration must not rewrite the server markup
        if (norm(container.innerHTML) !== norm(ssrHtml)) failures.push(`${pick.file}#${pick.name}: hydration rewrote markup`);
        if (root) await act(async () => { root!.unmount(); });
      } finally {
        console.error = origError;
        console.warn = origWarn;
        container.remove();
      }
    }
    expect(failures).toEqual([]);
  });
});
