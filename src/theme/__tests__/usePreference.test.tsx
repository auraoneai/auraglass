/* MAT-266/269/270 (A11Y-028): S-21 hooks over useSyncExternalStore — server
   snapshots for RSC/hydration, a lazily created module singleton when no
   provider is mounted, and the shared MediaQueryList registry (one matchMedia
   call per query no matter how many components subscribe). */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { SERVER_SNAPSHOT } from '../../contracts/preferences';
import type { PreferenceValues } from '../../contracts/preferences';

interface FakeMql {
  query: string;
  matches: boolean;
  listeners: Set<() => void>;
  added: number;
  removed: number;
}

const installMatchMedia = (matchesFor: (q: string) => boolean = () => false) => {
  const calls: string[] = [];
  const mqls = new Map<string, FakeMql>();
  const fn = (q: string): MediaQueryList => {
    calls.push(q);
    let e = mqls.get(q);
    if (!e) {
      e = { query: q, matches: matchesFor(q), listeners: new Set(), added: 0, removed: 0 };
      mqls.set(q, e);
    }
    return {
      matches: e.matches, media: q, onchange: null,
      addEventListener: (_t: string, l: () => void) => { e!.listeners.add(l); e!.added += 1; },
      removeEventListener: (_t: string, l: () => void) => { e!.listeners.delete(l); e!.removed += 1; },
      addListener: (l: () => void) => { e!.listeners.add(l); e!.added += 1; },
      removeListener: (l: () => void) => { e!.listeners.delete(l); e!.removed += 1; },
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  };
  const prev = (window as unknown as { matchMedia?: unknown }).matchMedia;
  (window as unknown as { matchMedia?: unknown }).matchMedia = fn;
  return {
    calls,
    mqls,
    fire(q: string) { const e = mqls.get(q); if (e) { e.matches = true; e.listeners.forEach((l) => l()); } },
    restore() {
      if (prev === undefined) delete (window as unknown as { matchMedia?: unknown }).matchMedia;
      else (window as unknown as { matchMedia?: unknown }).matchMedia = prev;
    },
  };
};

const PREF_KEYS = Object.keys(SERVER_SNAPSHOT) as Array<keyof PreferenceValues>;

describe('usePreference', () => {
  it('renderToString uses SERVER_SNAPSHOT for every key', () => {
    const { usePreference } = require('../preferences/usePreference') as typeof import('../preferences/usePreference');
    const seen: Record<string, unknown> = {};
    function Probe() {
      for (const k of PREF_KEYS) seen[k] = usePreference(k);
      return null;
    }
    const html = renderToString(React.createElement(Probe));
    expect(html).toBe('');
    for (const k of PREF_KEYS) expect(seen[k]).toEqual(SERVER_SNAPSHOT[k]);
  });

  it('importing the module calls matchMedia 0 times', () => {
    const mm = installMatchMedia();
    jest.isolateModules(() => {
      require('../preferences/usePreference');
      require('../preferences/media');
      require('../preferences/store');
    });
    expect(mm.calls).toHaveLength(0);
    mm.restore();
  });

  it('hydrateRoot emits 0 hydration warnings', () => {
    const { usePreference } = require('../preferences/usePreference') as typeof import('../preferences/usePreference');
    function Probe() {
      return React.createElement('output', null, `${usePreference('transparency')}|${usePreference('scheme')}`);
    }
    const container = document.createElement('div');
    container.innerHTML = renderToString(React.createElement(Probe));
    document.body.appendChild(container);
    const errors: unknown[] = [];
    const spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { errors.push(a); });
    let root!: { unmount(): void };
    act(() => { root = hydrateRoot(container, React.createElement(Probe)); });
    expect(errors).toHaveLength(0);
    act(() => { root.unmount(); });
    spy.mockRestore();
    document.body.removeChild(container);
  });

  it('shared MQL: 200 subscribers create exactly one matchMedia per query and listeners detach on unmount', () => {
    const mm = installMatchMedia((q) => q === '(prefers-reduced-motion: reduce)');
    const { render } = require('@testing-library/react') as typeof import('@testing-library/react');
    const { usePreference } = require('../preferences/usePreference') as typeof import('../preferences/usePreference');
    const { AuraGlassProvider } = require('../AuraGlassProvider') as typeof import('../AuraGlassProvider');
    function Probe() {
      usePreference('reducedMotionOS');
      return null;
    }
    const utils = render(
      React.createElement(
        AuraGlassProvider, {
          storage: null,
          children: Array.from({ length: 200 }, (_, i) => React.createElement(Probe, { key: i })),
        },
      ),
    );
    const rmCalls = mm.calls.filter((q) => q === '(prefers-reduced-motion: reduce)');
    expect(rmCalls).toHaveLength(1);
    const rmMql = mm.mqls.get('(prefers-reduced-motion: reduce)')!;
    expect(rmMql.added).toBe(1); // one listener per MQL, shared by all subscribers
    utils.unmount();
    expect(rmMql.removed).toBe(1);
    mm.restore();
    document.documentElement.removeAttribute('data-ag-root');
  });

  it('usePreferenceActions().set updates the snapshot and persists', () => {
    const { render, screen } = require('@testing-library/react') as typeof import('@testing-library/react');
    const { usePreference, usePreferenceActions } = require('../preferences/usePreference') as typeof import('../preferences/usePreference');
    const { AuraGlassProvider } = require('../AuraGlassProvider') as typeof import('../AuraGlassProvider');
    const storage = (function () {
      const m = new Map<string, string>();
      return { get: (k: string) => m.get(k) ?? null, set: (k: string, v: string) => void m.set(k, v), remove: (k: string) => void m.delete(k) };
    })();
    function Probe() {
      const v = usePreference('density');
      const { set } = usePreferenceActions();
      return React.createElement('button', { onClick: () => set('density', 'compact') }, v);
    }
    render(
      React.createElement(AuraGlassProvider, {
        storage, children: React.createElement(Probe),
      }),
    );
    expect(screen.getByRole('button').textContent).toBe('regular');
    act(() => { screen.getByRole('button').click(); });
    expect(screen.getByRole('button').textContent).toBe('compact');
    expect(JSON.parse(storage.get('ag:prefs:v1') ?? '{}')).toMatchObject({ density: 'compact' });
  });

  it('no provider: hooks fall back to the lazily created module singleton', () => {
    const { render, screen } = require('@testing-library/react') as typeof import('@testing-library/react');
    const { usePreference, useResolvedPreferences } = require('../preferences/usePreference') as typeof import('../preferences/usePreference');
    function Probe() {
      const s = usePreference('scheme');
      const r = useResolvedPreferences();
      return React.createElement('output', null, `${s}/${r.scheme}`);
    }
    render(React.createElement(Probe));
    expect(screen.getByText('system/light')).toBeTruthy();
  });
});
