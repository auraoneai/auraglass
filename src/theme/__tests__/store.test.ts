/* MAT-265/267/268 (A11Y-026): storage adapters + the preference store —
   persistence round-trip, corrupt JSON tolerance, throwing-storage fallback,
   floors that keep the user value while resolved clamps, one-time legacy
   migration, and attributes written only on change. MAT-53 (D.3-33): set()
   input validation, one store per document across nested providers, and the
   <=1 commit Profiler check over 50 surfaces. */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { Profiler, createElement as h } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryStorage, createLocalStorageAdapter } from '../preferences/storage';
import { createPreferenceStore } from '../preferences/store';
import type { PreferenceStore } from '../preferences/store';
import { usePreference, usePreferenceStore } from '../preferences/usePreference';
import { AuraGlassProvider } from '../AuraGlassProvider';
import { GlassPreferencesPanel } from '../preferences-panel/GlassPreferencesPanel';
import { Surface } from '../../material/Surface';
import type { OsSignals, CapabilitySignals } from '../preferences/types';

const osBase: OsSignals = {
  forcedColors: false, contrastMore: false, reducedTransparency: false,
  reducedMotion: false, schemeDark: false, coarsePointer: false,
};
const capBase: CapabilitySignals = { backdropFilter: true, saveData: false, deviceMemory: null };

const signals = (os: Partial<OsSignals> = {}, cap: Partial<CapabilitySignals> = {}) => ({
  os: () => ({ ...osBase, ...os }),
  cap: () => ({ ...capBase, ...cap }),
  subscribe: (_notify: () => void) => () => {},
  engine: () => 'chromium',
});

describe('storage adapters', () => {
  it('memory storage round-trips and removes', () => {
    const s = createMemoryStorage();
    s.set('k', 'v');
    expect(s.get('k')).toBe('v');
    s.remove?.('k');
    expect(s.get('k')).toBeNull();
  });

  it('localStorage adapter round-trips in jsdom', () => {
    const s = createLocalStorageAdapter(window);
    s.set('ag:test', '{"a":1}');
    expect(s.get('ag:test')).toBe('{"a":1}');
    s.remove?.('ag:test');
    expect(s.get('ag:test')).toBeNull();
  });

  it('a throwing storage falls back permanently to memory', () => {
    let calls = 0;
    const win = {
      get localStorage() { calls += 1; throw new Error('denied'); },
    } as unknown as Window;
    const s = createLocalStorageAdapter(win);
    s.set('k', 'v');
    expect(s.get('k')).toBe('v'); // served from memory
    const accessCount = calls;
    s.set('k2', 'v2');
    s.get('k');
    expect(calls).toBe(accessCount); // never touches the throwing backing again
  });

  it('null window storage degrades to memory without throwing', () => {
    const s = createLocalStorageAdapter(null);
    s.set('k', 'v');
    expect(s.get('k')).toBe('v');
  });
});

describe('createPreferenceStore', () => {
  it('persistence round-trip: set survives a fresh store on the same storage', () => {
    const storage = createMemoryStorage();
    const a = createPreferenceStore({ storage, signals: signals() });
    a.set('transparency', 'solid');
    a.set('density', 'compact');
    const raw = storage.get('ag:prefs:v1');
    expect(JSON.parse(raw ?? '{}')).toMatchObject({ transparency: 'solid', density: 'compact' });
    const b = createPreferenceStore({ storage, signals: signals() });
    expect(b.getSnapshot().transparency).toBe('solid');
    expect(b.resolved().transparency).toBe('solid');
  });

  it('corrupt JSON is ignored without throwing and resolves to system', () => {
    const storage = createMemoryStorage();
    storage.set('ag:prefs:v1', '{not json');
    const s = createPreferenceStore({ storage, signals: signals() });
    expect(s.getSnapshot().transparency).toBe('system');
    expect(s.resolved().transparency).toBe('glass');
  });

  it('below-floor set keeps the user value but resolved stays at the floor', () => {
    const storage = createMemoryStorage();
    const s = createPreferenceStore({
      storage, signals: signals({ contrastMore: true }),
    });
    s.set('transparency', 'glass');
    expect(JSON.parse(storage.get('ag:prefs:v1') ?? '{}')).toMatchObject({ transparency: 'glass' });
    expect(s.resolved().transparency).toBe('tinted');
    expect(s.resolved().floors.transparency).toBe('tinted');
    expect(s.resolved().reasons).toContain('prefers-contrast-more');
  });

  it('forced colors resolves solid+more absolutely', () => {
    const s = createPreferenceStore({
      storage: createMemoryStorage(),
      signals: signals({ forcedColors: true }),
    });
    expect(s.resolved().transparency).toBe('solid');
    expect(s.resolved().contrast).toBe('more');
    expect(s.resolved().floors.transparency).toBe('solid');
  });

  it('one-time legacy migration maps 4.x settings into the new key', () => {
    const storage = createMemoryStorage();
    storage.set('aura-glass-accessibility-settings', JSON.stringify({
      highContrast: true, reducedTransparency: true,
    }));
    const s = createPreferenceStore({ storage, signals: signals() });
    expect(s.getSnapshot().contrast).toBe('more');
    expect(s.getSnapshot().transparency).toBe('tinted');
    expect(JSON.parse(storage.get('ag:prefs:v1') ?? '{}'))
      .toMatchObject({ contrast: 'more', transparency: 'tinted' });
    // legacy key is read once, never overwritten
    expect(JSON.parse(storage.get('aura-glass-accessibility-settings') ?? '{}'))
      .toMatchObject({ highContrast: true });
  });

  it('existing v1 record wins over legacy', () => {
    const storage = createMemoryStorage();
    storage.set('ag:prefs:v1', JSON.stringify({ transparency: 'solid' }));
    storage.set('aura-glass-accessibility-settings', JSON.stringify({ reducedTransparency: true }));
    const s = createPreferenceStore({ storage, signals: signals() });
    expect(s.getSnapshot().transparency).toBe('solid');
  });

  it('attributes write only on change to the target', () => {
    const target = document.createElement('div');
    const spy = jest.spyOn(target, 'setAttribute');
    const s = createPreferenceStore({
      storage: createMemoryStorage(), signals: signals(), target,
    });
    const initial = spy.mock.calls.length;
    expect(initial).toBeGreaterThan(0);
    spy.mockClear();
    // set an identical value -> re-resolve identical -> no writes
    s.set('transparency', 'system');
    s.set('transparency', 'system');
    expect(spy).toHaveBeenCalledTimes(0);
    s.set('transparency', 'solid');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('data-ag-transparency', 'solid');
    s.set('transparency', 'solid');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('writes data-ag-continuous only when allowed and motion is full', () => {
    const target = document.createElement('div');
    const s = createPreferenceStore({ storage: createMemoryStorage(), signals: signals(), target });
    s.set('allowContinuous', true);
    expect(target.getAttribute('data-ag-continuous')).toBe('on');
    s.set('motion', 'calm');
    expect(target.getAttribute('data-ag-continuous')).toBeNull();
  });

  it('writes the engine attribute unless unknown', () => {
    const t1 = document.createElement('div');
    createPreferenceStore({
      storage: createMemoryStorage(), signals: { ...signals(), engine: () => 'webkit' }, target: t1,
    });
    expect(t1.getAttribute('data-ag-engine')).toBe('webkit');
    const t2 = document.createElement('div');
    createPreferenceStore({
      storage: createMemoryStorage(), signals: { ...signals(), engine: () => 'unknown' }, target: t2,
    });
    expect(t2.getAttribute('data-ag-engine')).toBeNull();
  });

  it('lightweight tier only for saveData, deviceMemory<=2+coarse, or a value', () => {
    const t = document.createElement('div');
    const a = createPreferenceStore({
      storage: createMemoryStorage(),
      signals: signals({}, { saveData: true }), target: t,
    });
    expect(a.resolved().tier).toBe('lightweight');
    expect(t.getAttribute('data-ag-tier')).toBe('lightweight');

    const t2 = document.createElement('div');
    createPreferenceStore({
      storage: createMemoryStorage(),
      signals: signals({ coarsePointer: true }, { deviceMemory: 2 }), target: t2,
    });
    expect(t2.getAttribute('data-ag-tier')).toBe('lightweight');

    const t3 = document.createElement('div');
    createPreferenceStore({
      storage: createMemoryStorage(),
      signals: signals({}, { deviceMemory: 2 }), target: t3,
    });
    expect(t3.getAttribute('data-ag-tier')).toBe('standard');
  });

  it('storage null -> never persists', () => {
    const s = createPreferenceStore({ storage: null, signals: signals() });
    s.set('motion', 'calm');
    expect(s.getSnapshot().motion).toBe('calm');
  });

  it('subscribe fires on set and unsubscribing drops OS listeners', () => {
    let notified = 0;
    const s = createPreferenceStore({ storage: createMemoryStorage(), signals: signals() });
    const off = s.subscribe(() => { notified += 1; });
    s.set('scheme', 'dark');
    expect(notified).toBe(1);
    off();
    s.set('scheme', 'light');
    expect(notified).toBe(1);
  });

  it('reset clears persisted user values and re-resolves', () => {
    const storage = createMemoryStorage();
    const s = createPreferenceStore({ storage, signals: signals() });
    s.set('scheme', 'dark');
    s.reset();
    expect(storage.get('ag:prefs:v1')).toBeNull();
    expect(s.getSnapshot().scheme).toBe('system');
  });

  /* REQ-MAT-53 acceptance: set('bogus' as any, 1) leaves storage unchanged.
     Producer: REQ-FIN-12 (PR 119, store.set validation). */
  it('set() ignores an unknown key or an out-of-domain value (storage, snapshot, listeners)', () => {
    const storage = createMemoryStorage();
    const target = document.createElement('div');
    const s = createPreferenceStore({ storage, signals: signals(), target });
    s.set('transparency', 'tinted');
    const raw = storage.get('ag:prefs:v1');
    expect(JSON.parse(raw ?? '{}')).toEqual({ transparency: 'tinted' });
    const snap = s.getSnapshot();
    const attrs = target.getAttributeNames().map((n) => [n, target.getAttribute(n)]);
    let notified = 0;
    const off = s.subscribe(() => { notified += 1; });

    const loose = s as unknown as { set(key: string, value: unknown): void };
    loose.set('bogus', 1);
    loose.set('transparency', 'opaque');
    loose.set('density', 'huge');
    loose.set('glassOpacity', Number.NaN);
    loose.set('glassOpacity', 2);
    loose.set('allowContinuous', 'yes');

    expect(storage.get('ag:prefs:v1')).toBe(raw);
    expect(s.getSnapshot()).toBe(snap);
    expect(s.getSnapshot().transparency).toBe('tinted');
    expect(target.getAttributeNames().map((n) => [n, target.getAttribute(n)])).toEqual(attrs);
    expect(notified).toBe(0);
    // a valid value still goes through after the rejected ones
    s.set('density', 'compact');
    expect(JSON.parse(storage.get('ag:prefs:v1') ?? '{}'))
      .toEqual({ transparency: 'tinted', density: 'compact' });
    expect(notified).toBe(1);
    off();
  });
});

/* REQ-MAT-53 (MAT-53, D.3-33): one preference store per document. Nested
   providers reuse the outer store (producer: REQ-FIN-04, PR 121); a set()
   from a panel inside an inner provider reaches the outer snapshot and <html>;
   a preference change commits once and re-renders only the hook reader, never
   the 50 surfaces that read no hooks. */
describe('MAT-53 one store per document', () => {
  const ATTR_NAMES = [
    'data-ag-root', 'data-ag-transparency', 'data-ag-contrast', 'data-ag-motion',
    'data-ag-scheme', 'data-ag-density', 'data-ag-tier', 'data-ag-continuous', 'data-ag-engine',
  ];
  let cssPrev: PropertyDescriptor | undefined;

  beforeEach(() => {
    window.localStorage.clear();
    /* jsdom has no window.CSS.supports, so the capability floor would pin
       transparency to 'solid' and no transparency change could be observed. */
    cssPrev = Object.getOwnPropertyDescriptor(window, 'CSS');
    Object.defineProperty(window, 'CSS', {
      configurable: true,
      value: { supports: (q: string) => /backdrop-filter/.test(q) },
    });
  });

  afterEach(() => {
    cleanup();
    const html = document.documentElement;
    for (const n of ATTR_NAMES) html.removeAttribute(n);
    html.style.removeProperty('--ag-glass-opacity');
    document.body.querySelectorAll('[data-ag-portal-root]').forEach((e) => e.remove());
    if (cssPrev) Object.defineProperty(window, 'CSS', cssPrev);
    else delete (window as { CSS?: unknown }).CSS;
    window.localStorage.clear();
  });

  type Captured = { store: PreferenceStore | null; transparency: string | null };
  const capture = (into: Captured) => function Probe(): React.ReactElement {
    into.store = usePreferenceStore();
    into.transparency = usePreference('transparency');
    return h('span', { 'data-probe': '' });
  };

  const nestedTree = (storage: ReturnType<typeof createMemoryStorage>, outer: Captured, inner: Captured) =>
    h(AuraGlassProvider, {
      storage,
      children: [
        h(capture(outer), { key: 'outer' }),
        h(AuraGlassProvider, {
          key: 'inner',
          density: 'compact',
          children: [
            h(capture(inner), { key: 'probe' }),
            h(GlassPreferencesPanel, { key: 'panel', keys: ['transparency'] }),
          ],
        }),
      ],
    });

  it('nested providers share one store instance (identity)', () => {
    const outer: Captured = { store: null, transparency: null };
    const inner: Captured = { store: null, transparency: null };
    render(nestedTree(createMemoryStorage(), outer, inner));
    expect(outer.store).not.toBeNull();
    expect(inner.store).toBe(outer.store);
  });

  it('a set() from a panel in the inner provider updates the outer snapshot and <html>', () => {
    const storage = createMemoryStorage();
    const outer: Captured = { store: null, transparency: null };
    const inner: Captured = { store: null, transparency: null };
    const { container } = render(nestedTree(storage, outer, inner));
    const html = document.documentElement;
    expect(html.getAttribute('data-ag-transparency')).toBe('glass');
    expect(outer.transparency).toBe('system');

    const tinted = screen.getByRole('radio', { name: /Tinted/i });
    act(() => { fireEvent.click(tinted); });

    expect(outer.store?.getSnapshot().transparency).toBe('tinted');
    expect(outer.transparency).toBe('tinted');
    expect(inner.transparency).toBe('tinted');
    expect(html.getAttribute('data-ag-transparency')).toBe('tinted');
    expect(JSON.parse(storage.get('ag:prefs:v1') ?? '{}')).toMatchObject({ transparency: 'tinted' });
    // the inner provider scopes the resolved user value onto its own wrapper
    // and keeps its app override; the override never leaks to <html>
    const wrapper = container.querySelector<HTMLElement>('[data-ag-provider]');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.getAttribute('data-ag-transparency')).toBe('tinted');
    expect(wrapper?.getAttribute('data-ag-density')).toBe('compact');
    expect(html.getAttribute('data-ag-density')).toBe('regular');
  });

  it('Profiler: set() commits at most once and re-renders none of 50 hook-free surfaces', () => {
    const surfaceRenders = new Map<string, number>();
    const onSurface: React.ProfilerOnRenderCallback = (id) => {
      surfaceRenders.set(id, (surfaceRenders.get(id) ?? 0) + 1);
    };
    const treeCommits: string[] = [];
    const onTree: React.ProfilerOnRenderCallback = (_id, phase) => { treeCommits.push(phase); };
    const reader: Captured = { store: null, transparency: null };
    let readerRenders = 0;
    const Probe = capture(reader);
    const Reader = (): React.ReactElement => {
      readerRenders += 1;
      return Probe();
    };
    const surfaces = Array.from({ length: 50 }, (_, i) =>
      h(Profiler, { key: i, id: `surface-${i}`, onRender: onSurface },
        h(Surface, { layer: 'content', variant: 'regular', 'data-testid': `s${i}` } as React.ComponentProps<typeof Surface>)));

    render(h(AuraGlassProvider, {
      storage: createMemoryStorage(),
      children: h(Profiler, { id: 'tree', onRender: onTree }, ...surfaces, h(Reader)),
    }));
    expect(document.querySelectorAll('.ag-surface')).toHaveLength(50);
    expect(reader.store).not.toBeNull();

    treeCommits.length = 0;
    surfaceRenders.clear();
    const readerBefore = readerRenders;
    act(() => { reader.store?.set('transparency', 'tinted'); });

    expect(reader.transparency).toBe('tinted');
    expect(document.documentElement.getAttribute('data-ag-transparency')).toBe('tinted');
    expect(treeCommits).toEqual(['update']);
    expect(readerRenders - readerBefore).toBe(1);
    expect([...surfaceRenders.keys()]).toEqual([]);
  });
});
