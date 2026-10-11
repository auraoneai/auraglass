/* REQ-FIN-04 / AC-FIN-04 (MAT-36, -38, -49, -55; MAT-53 store reuse; PLAT-26
   provider half). Every case runs WITHOUT calling registerProviderMount: the
   provider registers the production mounts itself at render, never at import. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, render } from '@testing-library/react';
import {
  AuraGlassProvider, createBrandTheme, presets, usePreference, usePreferenceActions,
} from '../../src/theme/index';
import { getProviderMounts } from '../../src/theme/providerMounts';
import { warnDeprecated } from '../../src/internal/warnDeprecated';
import { DEPRECATIONS } from '../../src/internal/deprecations.generated';
import { PreferenceStoreContext } from '../../src/theme/preferences/usePreference';

const ATTRS = [
  'data-ag-root', 'data-ag-transparency', 'data-ag-contrast', 'data-ag-motion', 'data-ag-scheme',
  'data-ag-density', 'data-ag-tier', 'data-ag-continuous', 'data-ag-engine',
];

afterEach(() => {
  for (const a of ATTRS) document.documentElement.removeAttribute(a);
  document.documentElement.removeAttribute('style');
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

/* Plain imports: the module registry is per test file, so the first case sees
   the mount registry exactly as `import 'aura-glass/theme'` leaves it. */
const theme = { AuraGlassProvider, createBrandTheme, presets, usePreference, usePreferenceActions };
const mounts = { getProviderMounts };
const internal = { warnDeprecated };
const prefs = { PreferenceStoreContext };
const load = () => ({ theme, mounts, internal, prefs });

describe('REQ-FIN-04 provider mounts', () => {
  it('importing the theme entry registers nothing (registration runs at provider render)', () => {
    const { mounts } = load();
    expect(mounts.getProviderMounts()).toEqual({});
  });

  it('first provider render registers all five production mounts', () => {
    const { theme, mounts } = load();
    render(<theme.AuraGlassProvider storage={null}><div /></theme.AuraGlassProvider>);
    const m = mounts.getProviderMounts();
    expect(Object.keys(m).sort()).toEqual(['brandCss', 'devDiagnostics', 'lensDefs', 'pointerLight', 'presetCss']);
    for (const v of Object.values(m)) expect(typeof v).toBe('function');
  });

  it('brand="#7c3aed" renders exactly one <style data-theme-style> with the brand css', () => {
    const { theme } = load();
    render(<theme.AuraGlassProvider storage={null} brand="#7c3aed"><div /></theme.AuraGlassProvider>);
    const styles = document.querySelectorAll('style[data-theme-style]');
    expect(styles).toHaveLength(1);
    expect(styles[0]!.textContent).toBe(theme.createBrandTheme('#7c3aed').cssText);
  });

  it('preset="midnight" renders one theme style built from the preset accent', () => {
    const { theme } = load();
    render(<theme.AuraGlassProvider storage={null} preset="midnight"><div /></theme.AuraGlassProvider>);
    const styles = document.querySelectorAll('style[data-theme-style]');
    expect(styles).toHaveLength(1);
    const p = theme.presets.midnight;
    expect(styles[0]!.textContent).toBe(theme.createBrandTheme(p.accent, { preset: p.id }).cssText);
  });

  it('LensDefs mounts once for tier enhanced, auto and an undefined tier prop; never for standard/lightweight', () => {
    const { theme } = load();
    const { AuraGlassProvider } = theme;
    const count = () => document.querySelectorAll('svg[data-ag-lens-ready]').length;

    const a = render(<AuraGlassProvider storage={null} tier="enhanced"><div /></AuraGlassProvider>);
    expect(count()).toBe(1);
    a.unmount();
    const b = render(<AuraGlassProvider storage={null}><div /></AuraGlassProvider>);
    expect(count()).toBe(1);
    b.unmount();
    const c = render(<AuraGlassProvider storage={null} tier="standard"><div /></AuraGlassProvider>);
    expect(count()).toBe(0);
    c.rerender(<AuraGlassProvider storage={null} tier="lightweight"><div /></AuraGlassProvider>);
    expect(count()).toBe(0);
    c.unmount();
    // nested providers never add a second defs block
    render(
      <AuraGlassProvider storage={null} tier="enhanced">
        <AuraGlassProvider storage={null} tier="enhanced"><span /></AuraGlassProvider>
      </AuraGlassProvider>,
    );
    expect(count()).toBe(1);
  });

  it('pointer light installs only while a [data-ag-pointer-light] element exists and motion is full', async () => {
    const { theme } = load();
    // jsdom has no matchMedia: give it a fine hover pointer
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (q: string) => ({
        matches: q.includes('hover: hover'), media: q,
        addEventListener: () => {}, removeEventListener: () => {},
        addListener: () => {}, removeListener: () => {},
      }),
    });
    // jsdom has no CSS.supports: report backdrop-filter support so the store
    // resolves transparency 'glass' (pointer light needs glass)
    const hadCss = 'CSS' in window;
    const prevCss = (window as unknown as { CSS?: unknown }).CSS;
    Object.defineProperty(window, 'CSS', {
      configurable: true, writable: true, value: { supports: () => true },
    });
    const add = jest.spyOn(document, 'addEventListener');
    const pointerMoves = () => add.mock.calls.filter(([t]) => t === 'pointermove').length;
    const remove = jest.spyOn(document, 'removeEventListener');
    const removedMoves = () => remove.mock.calls.filter(([t]) => t === 'pointermove').length;
    const flush = () => act(async () => { await Promise.resolve(); });

    const { AuraGlassProvider } = theme;
    function App({ lit }: { lit: boolean }) {
      return lit ? <div data-ag-pointer-light="" /> : <div />;
    }
    const r = render(
      <AuraGlassProvider storage={null} motion="full" transparency="glass"><App lit={false} /></AuraGlassProvider>,
    );
    await flush();
    expect(document.documentElement.getAttribute('data-ag-transparency')).toBe('glass');
    expect(pointerMoves()).toBe(0);

    r.rerender(<AuraGlassProvider storage={null} motion="full" transparency="glass"><App lit /></AuraGlassProvider>);
    await flush();
    expect(pointerMoves()).toBe(1);

    // motion leaves 'full' -> released
    r.rerender(<AuraGlassProvider storage={null} motion="none" transparency="glass"><App lit /></AuraGlassProvider>);
    await flush();
    expect(removedMoves()).toBe(1);

    // back to full -> installed again; element removed -> released
    r.rerender(<AuraGlassProvider storage={null} motion="full" transparency="glass"><App lit /></AuraGlassProvider>);
    await flush();
    expect(pointerMoves()).toBe(2);
    r.rerender(<AuraGlassProvider storage={null} motion="full" transparency="glass"><App lit={false} /></AuraGlassProvider>);
    await flush();
    expect(removedMoves()).toBe(2);
    r.unmount();
    if (hadCss) Object.defineProperty(window, 'CSS', { configurable: true, writable: true, value: prevCss });
    else delete (window as unknown as { CSS?: unknown }).CSS;
    // @ts-expect-error restore jsdom's missing matchMedia
    delete window.matchMedia;
  });

  it('dev diagnostics start in development (surface counter observes the document)', () => {
    const { theme } = load();
    const observe = jest.spyOn(MutationObserver.prototype, 'observe');
    render(<theme.AuraGlassProvider storage={null}><div /></theme.AuraGlassProvider>);
    const targets = observe.mock.calls.map(([t, o]) => ({ t, o }));
    // the surface counter watches documentElement for childList+subtree+attributes
    expect(targets.some(({ t, o }) => t === document.documentElement
      && o?.childList === true && o?.subtree === true && o?.attributes === true
      && o?.attributeFilter === undefined)).toBe(true);
  });
});

describe('REQ-FIN-04 deprecation mode (PLAT-26 provider half)', () => {
  const ids = Object.keys(DEPRECATIONS);
  let next = 0;
  // warnDeprecated warns once per id per module lifetime: each case uses a fresh id
  const firstId = (_internal: unknown): string => ids[next++]!;

  it('deprecations="silent" gives 0 console.warn', () => {
    const { theme, internal } = load();
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    function Uses() {
      React.useEffect(() => { internal.warnDeprecated(firstId(internal)); }, []);
      return null;
    }
    render(<theme.AuraGlassProvider storage={null} deprecations="silent"><Uses /></theme.AuraGlassProvider>);
    expect(spy).not.toHaveBeenCalled();
  });

  it('the default mode warns once, and the message ends with a single period before the codemod/doc', () => {
    const { theme, internal } = load();
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const id = firstId(internal);
    function Uses() {
      React.useEffect(() => { internal.warnDeprecated(id); internal.warnDeprecated(id); }, []);
      return null;
    }
    render(<theme.AuraGlassProvider storage={null}><Uses /></theme.AuraGlassProvider>);
    expect(spy).toHaveBeenCalledTimes(1);
    const msg = String(spy.mock.calls[0]![0]);
    expect(msg).toMatch(/^\[aura-glass\] DEP-[PMCSQ]\d{4} \(since \d+\.\d+\.\d+, removed in \d+\.\d+\.\d+\): /);
    expect(msg).not.toContain('..');
  });

  it('the mode returns to warn when a silent provider unmounts', () => {
    const { theme, internal } = load();
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const r = render(<theme.AuraGlassProvider storage={null} deprecations="silent"><div /></theme.AuraGlassProvider>);
    r.unmount();
    internal.warnDeprecated(firstId(internal));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('REQ-FIN-04 nested providers share one document store (MAT-53)', () => {
  it('identity: the inner provider hands descendants the outer store', () => {
    const { theme, prefs } = load();
    const seen: unknown[] = [];
    function Probe() {
      seen.push(React.useContext(prefs.PreferenceStoreContext));
      return null;
    }
    render(
      <theme.AuraGlassProvider storage={null}>
        <Probe />
        <theme.AuraGlassProvider storage={null} density="compact"><Probe /></theme.AuraGlassProvider>
      </theme.AuraGlassProvider>,
    );
    expect(seen.length).toBeGreaterThanOrEqual(2);
    expect(seen[0]).not.toBeNull();
    expect(new Set(seen).size).toBe(1);
  });

  it('set() from inside an inner provider updates the outer snapshot and <html>; the inner scope keeps its override', () => {
    const { theme } = load();
    let innerSet!: (v: 'dark' | 'light') => void;
    let outerScheme: string | undefined;
    function InnerPanel() {
      const a = theme.usePreferenceActions();
      innerSet = (v) => a.set('scheme', v);
      return null;
    }
    function OuterProbe() {
      outerScheme = theme.usePreference('scheme');
      return null;
    }
    render(
      <theme.AuraGlassProvider storage={null}>
        <OuterProbe />
        <theme.AuraGlassProvider storage={null} density="compact"><InnerPanel /></theme.AuraGlassProvider>
      </theme.AuraGlassProvider>,
    );
    const inner = document.querySelector('div[data-ag-root][data-ag-provider]')!;
    expect(inner.getAttribute('data-ag-density')).toBe('compact');
    act(() => { innerSet('dark'); });
    expect(outerScheme).toBe('dark');
    expect(document.documentElement.getAttribute('data-ag-scheme')).toBe('dark');
    // the user choice reaches the nested scope; its app override is unchanged
    expect(inner.getAttribute('data-ag-scheme')).toBe('dark');
    expect(inner.getAttribute('data-ag-density')).toBe('compact');
    expect(document.documentElement.getAttribute('data-ag-density')).toBe('regular');
  });

  it('a user choice outranks the nested app override, as on the document', () => {
    const { theme } = load();
    let set!: (v: 'compact' | 'regular' | 'spacious') => void;
    function Panel() {
      const a = theme.usePreferenceActions();
      set = (v) => a.set('density', v);
      return null;
    }
    render(
      <theme.AuraGlassProvider storage={null}>
        <Panel />
        <theme.AuraGlassProvider storage={null} density="compact"><span /></theme.AuraGlassProvider>
      </theme.AuraGlassProvider>,
    );
    const inner = document.querySelector('div[data-ag-root][data-ag-provider]')!;
    act(() => { set('regular'); });
    expect(inner.getAttribute('data-ag-density')).toBe('regular');
  });

  it('the inner provider never persists and never retargets the document store', () => {
    const { theme } = load();
    const m = new Map<string, string>();
    const storage = { get: (k: string) => m.get(k) ?? null, set: (k: string, v: string) => void m.set(k, v) };
    const innerSet = jest.fn();
    render(
      <theme.AuraGlassProvider storage={storage}>
        <theme.AuraGlassProvider storage={{ get: () => null, set: innerSet }} scheme="dark"><span /></theme.AuraGlassProvider>
      </theme.AuraGlassProvider>,
    );
    expect(innerSet).not.toHaveBeenCalled();
    // <html> is still the document store's target after the inner mount
    expect(document.documentElement.getAttribute('data-ag-scheme')).toBe('light');
    const inner = document.querySelector('div[data-ag-root][data-ag-provider]')!;
    expect(inner.getAttribute('data-ag-scheme')).toBe('dark');
  });
});
