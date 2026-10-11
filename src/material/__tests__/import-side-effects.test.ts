/* MAT-151 — importing src/material has zero side effects: no listeners, no
   timers, no MutationObserver, no injected styles, no document mutations. */
import { describe, expect, it, jest } from '@jest/globals';

describe('import side effects', () => {
  it('index.ts performs no global work at import', async () => {
    const addEvent = jest.spyOn(document.documentElement, 'addEventListener');
    const docAddEvent = jest.spyOn(document, 'addEventListener');
    const moSpy = jest.fn();
    const origMO = globalThis.MutationObserver;
    (globalThis as any).MutationObserver = class {
      constructor(cb: MutationCallback) { moSpy(cb); }
      observe() {} disconnect() {} takeRecords() { return []; }
    };
    const appendSpy = jest.spyOn(document.head, 'appendChild');

    const headAttrs = document.documentElement.getAttributeNames().join(',');
    const styleCount = document.querySelectorAll('style').length;

    // jsdom's nwsapi selector engine registers internal mouseover/mouseout
    // listeners lazily on the first querySelector call — not a module effect.
    addEvent.mockClear();
    docAddEvent.mockClear();
    moSpy.mockClear();
    appendSpy.mockClear();

    jest.resetModules();
    await import('../index');

    expect(addEvent).not.toHaveBeenCalled();
    expect(docAddEvent).not.toHaveBeenCalled();
    expect(moSpy).not.toHaveBeenCalled();
    expect(appendSpy).not.toHaveBeenCalled();
    expect(document.documentElement.getAttributeNames().join(',')).toBe(headAttrs);
    expect(document.querySelectorAll('style').length).toBe(styleCount);

    addEvent.mockRestore();
    docAddEvent.mockRestore();
    appendSpy.mockRestore();
    (globalThis as any).MutationObserver = origMO;
  });
});
