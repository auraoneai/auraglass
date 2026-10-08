/* MAT-265/267/268 (A11Y-026): storage adapters + the preference store —
   persistence round-trip, corrupt JSON tolerance, throwing-storage fallback,
   floors that keep the user value while resolved clamps, one-time legacy
   migration, and attributes written only on change. */
import { describe, expect, it, jest } from '@jest/globals';
import { createMemoryStorage, createLocalStorageAdapter } from '../preferences/storage';
import { createPreferenceStore } from '../preferences/store';
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
});
