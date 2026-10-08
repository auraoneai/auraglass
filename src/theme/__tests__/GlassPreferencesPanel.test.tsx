/* MAT-320 (A11Y-089, REQ-MAT-60): GlassPreferencesPanel — native controls via
   materialProps (no CMP imports), fieldset/legend per key, floor-locked
   options aria-disabled + described, change announced politely, keys filter,
   only the changed field re-renders. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { Profiler, createElement as h } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassPreferencesPanel } from '../preferences-panel/GlassPreferencesPanel';
import { AuraGlassProvider } from '../AuraGlassProvider';
import { PreferenceStoreContext } from '../preferences/usePreference';
import { createPreferenceStore } from '../preferences/store';
import type { OsSignals, CapabilitySignals } from '../preferences/types';

const os = (partial: Partial<OsSignals>): OsSignals => ({
  forcedColors: false, contrastMore: false, reducedTransparency: false,
  reducedMotion: false, schemeDark: false, coarsePointer: false, ...partial,
});
const cap = (partial: Partial<CapabilitySignals> = {}): CapabilitySignals => ({
  backdropFilter: true, saveData: false, deviceMemory: null, ...partial,
});

const storeWith = (o: OsSignals) => createPreferenceStore({
  storage: null, signals: { os: () => o, cap: () => cap() },
});

let cssPrev: unknown;
/** jsdom has no backdrop-filter and no window.CSS.supports; the capability
   floor becomes 'solid' unless CSS.supports exists when the store reads it. */
const stubBackdropFilter = (supported = true): void => {
  cssPrev = Object.getOwnPropertyDescriptor(window, 'CSS')?.value;
  Object.defineProperty(window, 'CSS', {
    configurable: true,
    value: { supports: (q: string) => supported && /backdrop-filter/.test(q) },
  });
};
const restoreBackdropFilter = (): void => {
  Object.defineProperty(window, 'CSS', { configurable: true, value: cssPrev });
};

const cleanupDom = () => {
  document.documentElement.removeAttribute('data-ag-root');
  document.documentElement.removeAttribute('data-ag-transparency');
  document.documentElement.removeAttribute('data-ag-contrast');
  document.documentElement.removeAttribute('data-ag-motion');
  document.documentElement.removeAttribute('data-ag-scheme');
  document.documentElement.removeAttribute('data-ag-density');
  document.documentElement.removeAttribute('data-ag-tier');
  document.documentElement.removeAttribute('data-ag-engine');
  document.body.querySelectorAll('[data-ag-portal-root]').forEach((e) => e.remove());
  restoreBackdropFilter();
};
afterEach(cleanupDom);

describe('GlassPreferencesPanel', () => {
  it('fieldset legend names', () => {
    render(h(AuraGlassProvider, { storage: null, children: h(GlassPreferencesPanel) }));
    const legends = Array.from(document.querySelectorAll('fieldset > legend')).map((l) => l.textContent);
    expect(legends).toEqual(expect.arrayContaining([
      'Preferences', 'Transparency', 'Glass opacity', 'Contrast', 'Motion', 'Scheme', 'Density',
    ]));
    expect(document.querySelector('[data-ag-preferences-panel]')).not.toBeNull();
  });

  it('floor-locked options: contrastMoreOS keeps Glass aria-disabled + described; click is a no-op', () => {
    const store = storeWith(os({ contrastMore: true }));
    render(h(PreferenceStoreContext.Provider, {
      value: store, children: h(GlassPreferencesPanel, { keys: ['transparency'] }),
    }));
    const glass = screen.getByRole('radio', { name: /Glass/i });
    const tinted = screen.getByRole('radio', { name: /Tinted/i });
    expect(glass.getAttribute('aria-disabled')).toBe('true');
    expect(tinted.getAttribute('aria-disabled')).toBeNull();
    expect(screen.getByRole('radio', { name: /Solid/i }).getAttribute('aria-disabled')).toBeNull();
    const group = glass.closest('[role=radiogroup]')!;
    const note = group.getAttribute('aria-describedby');
    expect(note).toBeTruthy();
    expect(document.getElementById(note!)!.textContent).toMatch(/Increase Contrast/);
    fireEvent.click(glass);
    expect(store.getSnapshot().transparency).toBe('system');
    expect(store.resolved().transparency).toBe('tinted');
  });

  it('below-floor set persists the user value while resolved stays at floor', () => {
    const store = storeWith(os({ contrastMore: true }));
    store.set('transparency', 'glass');
    render(h(PreferenceStoreContext.Provider, {
      value: store, children: h(GlassPreferencesPanel, { keys: ['transparency'] }),
    }));
    // persisted user value is kept; resolution honours the floor
    expect(store.getSnapshot().transparency).toBe('glass');
    expect(store.resolved().transparency).toBe('tinted');
    expect(document.documentElement.getAttribute('data-ag-transparency')).toBeNull();
  });

  it('change announced: selecting Tinted announces politely', () => {
    stubBackdropFilter();
    render(h(AuraGlassProvider, {
      storage: null,
      children: h(GlassPreferencesPanel, { keys: ['transparency'] }),
    }));
    fireEvent.click(screen.getByRole('radio', { name: /Tinted/i }));
    const polite = Array.from(document.querySelectorAll('[aria-live="polite"]')).pop();
    expect(polite?.textContent).toBe('Transparency set to Tinted');
    expect(document.documentElement.getAttribute('data-ag-transparency')).toBe('tinted');
  });

  it('keys filter limits rendered fields', () => {
    render(h(AuraGlassProvider, {
      storage: null,
      children: h(GlassPreferencesPanel, { keys: ['contrast', 'motion'] }),
    }));
    const prefs = Array.from(document.querySelectorAll('[data-ag-pref]'))
      .map((e) => e.getAttribute('data-ag-pref'));
    expect(prefs.sort()).toEqual(['contrast', 'motion']);
  });

  it('glassOpacity slider steps by 5 with aria-valuetext', () => {
    const onChange = jest.fn();
    render(h(AuraGlassProvider, {
      storage: null,
      children: h(GlassPreferencesPanel, { keys: ['glassOpacity'], onChange }),
    }));
    const slider = screen.getByRole('slider', { name: /Glass opacity/i });
    expect(slider.getAttribute('step')).toBe('5');
    fireEvent.change(slider, { target: { value: '40' } });
    expect((slider as HTMLInputElement).value).toBe('40');
    expect(slider.getAttribute('aria-valuetext')).toBe('40% more opaque');
    expect(onChange).toHaveBeenCalledWith('glassOpacity', 0.4);
  });

  it('re-renders only inside the panel', () => {
    const commits: string[] = [];
    const Sibling = () => {
      commits.push('sibling');
      return h('div', { 'data-testid': 'sibling' });
    };
    const onRender: React.ProfilerOnRenderCallback = (id) => { commits.push(`prof:${String(id)}`); };
    render(h(AuraGlassProvider, {
      storage: null,
      children: h(React.Fragment, null,
        h(Profiler, { id: 'panel', onRender, children: h(GlassPreferencesPanel, { keys: ['motion'] }) }),
        h(Profiler, { id: 'outside', onRender, children: h(Sibling) })),
    }));
    commits.length = 0;
    fireEvent.click(screen.getByRole('radio', { name: /Calm/i }));
    const outsideCommits = commits.filter((c) => c === 'prof:outside').length;
    expect(outsideCommits).toBe(0);
    // the panel itself re-rendered at most a couple of commits (field + floors)
    const panelCommits = commits.filter((c) => c === 'prof:panel').length;
    expect(panelCommits).toBeLessThanOrEqual(2);
  });
});
