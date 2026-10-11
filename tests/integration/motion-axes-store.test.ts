/* REQ-FIN-12 (REQ-MAT-46) + transferred REQ-MAT-53 clause: the preference
   store writes data-ag-continuous="on" only when allowContinuous AND resolved
   motion is 'full' (OS reduced motion included), and store.set ignores an
   unknown key or an out-of-domain value (no state, storage, listener or
   attribute change). */
import { describe, expect, it, jest } from '@jest/globals';
import { createMemoryStorage } from '../../src/theme/preferences/storage';
import { createPreferenceStore } from '../../src/theme/preferences/store';
import type { OsSignals, CapabilitySignals } from '../../src/theme/preferences/types';
import { STORAGE_KEY } from '../../src/contracts/preferences';

const osBase: OsSignals = {
  forcedColors: false, contrastMore: false, reducedTransparency: false,
  reducedMotion: false, schemeDark: false, coarsePointer: false,
};
const capBase: CapabilitySignals = { backdropFilter: true, saveData: false, deviceMemory: null };
const signals = (os: Partial<OsSignals> = {}) => ({
  os: () => ({ ...osBase, ...os }),
  cap: () => ({ ...capBase }),
  subscribe: (_notify: () => void) => () => {},
  engine: () => 'chromium',
});

describe('data-ag-continuous gate (REQ-FIN-12)', () => {
  it('is absent by default and set only for allowContinuous && motion=full', () => {
    const target = document.createElement('div');
    const s = createPreferenceStore({ storage: createMemoryStorage(), signals: signals(), target });
    expect(target.hasAttribute('data-ag-continuous')).toBe(false);
    s.set('allowContinuous', true);
    expect(target.getAttribute('data-ag-continuous')).toBe('on');
    for (const m of ['calm', 'none'] as const) {
      s.set('motion', m);
      expect(target.getAttribute('data-ag-motion')).toBe(m);
      expect(target.hasAttribute('data-ag-continuous')).toBe(false);
    }
    s.set('motion', 'full');
    expect(target.getAttribute('data-ag-continuous')).toBe('on');
    s.set('allowContinuous', false);
    expect(target.hasAttribute('data-ag-continuous')).toBe(false);
  });

  it('stays off under OS reduced motion even with allowContinuous and motion=full', () => {
    const target = document.createElement('div');
    const s = createPreferenceStore({
      storage: createMemoryStorage(), signals: signals({ reducedMotion: true }), target,
      app: { allowContinuous: true, motion: 'full' },
    });
    s.set('allowContinuous', true);
    s.set('motion', 'full');
    expect(target.getAttribute('data-ag-motion')).not.toBe('full');
    expect(target.hasAttribute('data-ag-continuous')).toBe(false);
  });
});

describe('store.set validation (REQ-MAT-53 clause, REQ-FIN-12)', () => {
  const invalid: Array<[string, unknown]> = [
    ['bogus', 1],
    ['transparency', 'frosted'],
    ['glassOpacity', 1.5],
    ['glassOpacity', Number.NaN],
    ['glassOpacity', '0.5'],
    ['contrast', 'less'],
    ['motion', 'fast'],
    ['scheme', 'sepia'],
    ['density', 'cozy'],
    ['allowContinuous', 'yes'],
    ['tier', 'lightweight'],
  ];

  it.each(invalid)('set(%p, %p) leaves state, storage, listeners and attributes unchanged', (key, value) => {
    const storage = createMemoryStorage();
    const target = document.createElement('div');
    const s = createPreferenceStore({ storage, signals: signals(), target });
    s.set('density', 'compact');
    const storedBefore = storage.get(STORAGE_KEY);
    const snapBefore = s.getSnapshot();
    const attrsBefore = target.getAttributeNames().map((n) => [n, target.getAttribute(n)]);
    const listener = jest.fn();
    s.subscribe(listener);
    const setter = s.set as unknown as (k: string, v: unknown) => void;
    expect(() => setter(key, value)).not.toThrow();
    expect(storage.get(STORAGE_KEY)).toBe(storedBefore);
    expect(s.getSnapshot()).toEqual(snapBefore);
    expect(target.getAttributeNames().map((n) => [n, target.getAttribute(n)])).toEqual(attrsBefore);
    expect(listener).not.toHaveBeenCalled();
  });

  it('accepts every in-domain value', () => {
    const storage = createMemoryStorage();
    const s = createPreferenceStore({ storage, signals: signals() });
    s.set('transparency', 'tinted');
    s.set('glassOpacity', 0.4);
    s.set('contrast', 'more');
    s.set('motion', 'calm');
    s.set('scheme', 'dark');
    s.set('density', 'spacious');
    s.set('allowContinuous', true);
    expect(JSON.parse(storage.get(STORAGE_KEY) ?? '{}')).toEqual({
      transparency: 'tinted', glassOpacity: 0.4, contrast: 'more', motion: 'calm',
      scheme: 'dark', density: 'spacious', allowContinuous: true,
    });
  });
});
