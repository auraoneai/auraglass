/* MAT-320 (A11Y-089, REQ-MAT-60): GlassPreferencesPanel — native controls via
   materialProps (no CMP imports), fieldset/legend per key, floor-locked
   options aria-disabled + described, change announced politely, keys filter,
   only the changed field re-renders.
   D.3-36 (REQ-FIN-59): distinct radio names across two panels, Spacious,
   per-option aria-describedby, contrast 'standard' lock. */
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
    // the note is linked per disabled option, not on the radiogroup
    const note = glass.getAttribute('aria-describedby');
    expect(note).toBeTruthy();
    expect(document.getElementById(note!)!.textContent).toMatch(/Increase Contrast/);
    expect(tinted.getAttribute('aria-describedby')).toBeNull();
    expect(glass.closest('[role=radiogroup]')!.getAttribute('aria-describedby')).toBeNull();
    fireEvent.click(glass);
    expect(store.getSnapshot().transparency).toBe('system');
    expect(store.resolved().transparency).toBe('tinted');
  });

  it('two panels on one page render distinct radio names (no shared group)', () => {
    const store = storeWith(os({}));
    render(h(PreferenceStoreContext.Provider, {
      value: store,
      children: h(React.Fragment, null,
        h('section', { 'data-testid': 'a' }, h(GlassPreferencesPanel, { keys: ['transparency', 'density'] })),
        h('section', { 'data-testid': 'b' }, h(GlassPreferencesPanel, { keys: ['transparency', 'density'] }))),
    }));
    const namesIn = (testId: string): string[] => Array.from(
      screen.getByTestId(testId).querySelectorAll<HTMLInputElement>('input[type=radio]'),
    ).map((r) => r.name);
    const a = new Set(namesIn('a'));
    const b = new Set(namesIn('b'));
    // one name per group inside each panel
    expect(a.size).toBe(2);
    expect(b.size).toBe(2);
    for (const n of a) {
      expect(n).not.toBe('');
      expect(b.has(n)).toBe(false);
    }
    // inside one panel, the transparency and density groups are distinct
    const panelA = screen.getByTestId('a');
    const tName = panelA.querySelector<HTMLInputElement>('[data-ag-pref=transparency] input[type=radio]')!.name;
    const dName = panelA.querySelector<HTMLInputElement>('[data-ag-pref=density] input[type=radio]')!.name;
    expect(tName).not.toBe(dName);
  });

  it('density offers Spacious and selecting it sets density=spacious', () => {
    const onChange = jest.fn();
    const store = storeWith(os({}));
    render(h(PreferenceStoreContext.Provider, {
      value: store, children: h(GlassPreferencesPanel, { keys: ['density'], onChange }),
    }));
    const labels = Array.from(document.querySelectorAll('[data-ag-pref=density] [data-ag-option]'))
      .map((l) => l.textContent?.trim());
    expect(labels).toEqual(['Regular', 'Compact', 'Spacious']);
    const spacious = screen.getByRole('radio', { name: /Spacious/i });
    expect(spacious.getAttribute('aria-disabled')).toBeNull();
    fireEvent.click(spacious);
    expect(store.getSnapshot().density).toBe('spacious');
    expect(onChange).toHaveBeenCalledWith('density', 'spacious');
    expect((spacious as HTMLInputElement).checked).toBe(true);
  });

  it.each([
    ['contrastMoreOS', os({ contrastMore: true }), /Increase Contrast/],
    ['forcedColors', os({ forcedColors: true }), /forced-colours/],
  ])('contrast lock under %s: Standard is aria-disabled with its own note; click is a no-op', (_n, signals, noteText) => {
    const onChange = jest.fn();
    const store = storeWith(signals);
    render(h(PreferenceStoreContext.Provider, {
      value: store, children: h(GlassPreferencesPanel, { keys: ['contrast'], onChange }),
    }));
    const standard = screen.getByRole('radio', { name: /Standard/i });
    const more = screen.getByRole('radio', { name: /More/i });
    const system = screen.getByRole('radio', { name: /System/i });
    expect(standard.getAttribute('aria-disabled')).toBe('true');
    expect(more.getAttribute('aria-disabled')).toBeNull();
    expect(system.getAttribute('aria-disabled')).toBeNull();
    // locked option stays focusable (aria-disabled, not disabled)
    expect((standard as HTMLInputElement).disabled).toBe(false);
    const noteId = standard.getAttribute('aria-describedby');
    expect(noteId).toBeTruthy();
    expect(document.getElementById(noteId!)!.textContent).toMatch(noteText);
    expect(more.getAttribute('aria-describedby')).toBeNull();
    fireEvent.click(standard);
    expect(store.getSnapshot().contrast).toBe('system');
    expect(store.resolved().contrast).toBe('more');
    expect(onChange).not.toHaveBeenCalled();
    expect((standard as HTMLInputElement).checked).toBe(false);
  });

  it('contrast is not locked without forced colours or OS more', () => {
    const store = storeWith(os({}));
    render(h(PreferenceStoreContext.Provider, {
      value: store, children: h(GlassPreferencesPanel, { keys: ['contrast'] }),
    }));
    const standard = screen.getByRole('radio', { name: /Standard/i });
    expect(standard.getAttribute('aria-disabled')).toBeNull();
    expect(standard.getAttribute('aria-describedby')).toBeNull();
    expect(document.querySelector('[data-ag-pref=contrast] [data-ag-floor-note]')).toBeNull();
    fireEvent.click(standard);
    expect(store.getSnapshot().contrast).toBe('standard');
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
