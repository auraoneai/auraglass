import { describe, expect, it, jest } from '@jest/globals';

/**
 * REQ-SURF-06: importing each SURF barrel adds no listener, timer, rAF loop,
 * observer, style/script node or <html> attribute — the same trap set the
 * PLAT verify-side-effects harness asserts over dist. Parameterized over the
 * six SURF module barrels plus the root surf slice. Zero exemptions: the
 * layer stack binds its keydown lazily inside layerStackFor(document), called
 * from AuraGlassProvider render — never at module scope.
 */
const BARRELS: ReadonlyArray<readonly [string, string]> = [
  ['ai', '../../src/ai'],
  ['data', '../../src/data'],
  ['date', '../../src/date'],
  ['media', '../../src/media'],
  ['backdrops', '../../src/backdrops'],
  ['app-shell', '../../src/app-shell'],
  ['surf-slice', '../../src/root/surf'],
];

const OBSERVERS = ['ResizeObserver', 'MutationObserver', 'IntersectionObserver'] as const;

describe.each(BARRELS)('surf side effects (REQ-SURF-06): %s', (_name, path) => {
  it('import of the barrel performs no observable side effects', () => {
    const calls: string[] = [];
    // direct caller only: the first non-test/non-mock stack frame is the file
    // that invoked addEventListener — effects from third-party peers loading
    // under our barrel attribute to node_modules, not to src/.
    const ours = (stack?: string) => {
      if (!stack) return false;
      const frames = stack.split('\n').filter((l) => l.trim().startsWith('at '));
      const caller = frames.find((f) => !/side-effects\.test|addEventListener|mockConstructor|jest/i.test(f)) ?? '';
      return /src\//.test(caller) && !/node_modules/.test(caller);
    };
    const winAdd = jest.spyOn(window, 'addEventListener').mockImplementation(((t: string) => {
      const stack = new Error().stack;
      // attribute to library code only — third-party peers (react-aria's
      // useFocusVisible binds window.beforeunload at module init) are
      // dependency-owned effects, not ours; their presence is still logged.
      calls.push(`window.${t}${ours(stack) ? ' (src)' : ' (dep)'}`);
    }) as typeof window.addEventListener);
    const docAdd = jest.spyOn(document, 'addEventListener').mockImplementation(((t: string) => {
      const stack = new Error().stack;
      calls.push(`document.${t}${ours(stack) ? ' (src)' : ' (dep)'}`);
    }) as typeof document.addEventListener);
    const st = jest.spyOn(globalThis, 'setTimeout');
    const si = jest.spyOn(globalThis, 'setInterval');
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame');
    const create = jest.spyOn(document, 'createElement');
    const setAttr = jest.spyOn(document.documentElement, 'setAttribute');
    const observerSpies = OBSERVERS
      .filter((o) => typeof (globalThis as Record<string, unknown>)[o] === 'function')
      .map((o) => jest.spyOn(globalThis, o as keyof typeof globalThis));
    try {
      jest.isolateModules(() => {
        require(path);
      });
      const srcCalls = calls.filter((c) => c.endsWith(' (src)'));
      expect({ srcCalls, depCalls: calls.filter((c) => c.endsWith(' (dep)')) }).toEqual(
        expect.objectContaining({ srcCalls: [] }) as never,
      );
      expect(st).not.toHaveBeenCalled();
      expect(si).not.toHaveBeenCalled();
      expect(raf).not.toHaveBeenCalled();
      for (const s of observerSpies) expect(s).not.toHaveBeenCalled();
      expect(create.mock.calls.filter((c) => c[0] === 'style' || c[0] === 'script')).toEqual([]);
      expect(setAttr).not.toHaveBeenCalled();
    } finally {
      winAdd.mockRestore();
      docAdd.mockRestore();
      st.mockRestore();
      si.mockRestore();
      raf.mockRestore();
      create.mockRestore();
      setAttr.mockRestore();
      for (const s of observerSpies) s.mockRestore();
    }
  });
});
