/* Contract seed (QUAL): §6.3 preferences assertions that hold against the seed —
   hooks return SERVER_SNAPSHOT on the server; the provider renders PORTAL_ROOT_MARKUP;
   usePortalContainer resolves each layer root; Escape reaches only the top useLayer entry. */
import * as React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render, act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import {
  AuraGlassProvider, usePreference, usePortalContainer, useLayer, useAnnouncer,
} from '../../src/theme/index';
import { SERVER_SNAPSHOT } from '../../src/contracts/preferences';
import type { LayerEntry } from '../../src/contracts/preferences';

const entry = (onEscape: () => void): LayerEntry => ({
  kind: 'dialog', modal: true, open: true, onEscape, element: null,
});

describe('preferences seeds (S-21..S-26)', () => {
  it('usePreference returns SERVER_SNAPSHOT on the server', () => {
    function Probe() { return <output data-testid="v">{usePreference('scheme')}</output>; }
    const html = renderToString(<Probe />);
    expect(html).toContain(SERVER_SNAPSHOT.scheme);
  });

  it('the provider portals PORTAL_ROOT_MARKUP into document.body', () => {
    render(<AuraGlassProvider><div /></AuraGlassProvider>);
    const root = document.body.querySelector('[data-ag-portal-root]');
    expect(root).not.toBeNull();
    expect(root!.querySelector('[data-ag-layer-root="overlay"]')).not.toBeNull();
    expect(root!.querySelector('[data-ag-layer-root="transient"]')).not.toBeNull();
    expect(root!.querySelector('[data-ag-layer-root="toast"]')).not.toBeNull();
    expect(root!.querySelectorAll('[data-ag-announcer] [aria-live]')).toHaveLength(2);
  });

  it('usePortalContainer resolves each layer root', () => {
    const seen: Record<string, Element | null> = {};
    function Probe() {
      seen.overlay = usePortalContainer('overlay');
      seen.transient = usePortalContainer('transient');
      seen.toast = usePortalContainer('toast');
      return null;
    }
    render(<AuraGlassProvider><Probe /></AuraGlassProvider>);
    expect(seen.overlay?.getAttribute('data-ag-layer-root')).toBe('overlay');
    expect(seen.transient?.getAttribute('data-ag-layer-root')).toBe('transient');
    expect(seen.toast?.getAttribute('data-ag-layer-root')).toBe('toast');
  });

  it('Escape reaches only the top useLayer entry', () => {
    const calls: string[] = [];
    function Layers() {
      useLayer(entry(() => calls.push('bottom')));
      useLayer(entry(() => calls.push('top')));
      return null;
    }
    render(<Layers />);
    act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); });
    expect(calls).toEqual(['top']);
  });

  it('useAnnouncer writes into the announcer regions and clear() empties them', () => {
    let api: ReturnType<typeof useAnnouncer> | null = null;
    function Probe() { api = useAnnouncer(); return null; }
    render(<AuraGlassProvider><Probe /></AuraGlassProvider>);
    act(() => { api!.announce('Saved', { politeness: 'polite' }); });
    const polite = document.querySelector('[data-ag-announcer] [aria-live="polite"]')!;
    expect(polite.textContent).toBe('Saved');
    act(() => { api!.clear(); });
    expect(polite.textContent).toBe('');
  });
});
