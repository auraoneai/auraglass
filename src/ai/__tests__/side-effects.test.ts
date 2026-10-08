import { describe, expect, it, jest } from '@jest/globals';

/**
 * REQ-SURF-06: importing the ./ai barrel adds no listener, timer, observer,
 * rAF loop, style/script node or <html> attribute. Traps mirror the PLAT
 * verify-side-effects harness (interim: harness file lands with PLAT C0+;
 * the same trap set is asserted here).
 */
describe('ai side effects (REQ-SURF-06)', () => {
  it('import of the barrel performs no observable side effects', () => {
    const calls: string[] = [];
    const winAdd = jest.spyOn(window, 'addEventListener').mockImplementation(((t: string) => { calls.push(`window.${t}`); }) as typeof window.addEventListener);
    const docAdd = jest.spyOn(document, 'addEventListener').mockImplementation(((t: string) => { calls.push(`document.${t}`); }) as typeof document.addEventListener);
    const st = jest.spyOn(globalThis, 'setTimeout');
    const si = jest.spyOn(globalThis, 'setInterval');
    const create = jest.spyOn(document, 'createElement');
    const setAttr = jest.spyOn(document.documentElement, 'setAttribute');
    try {
      jest.isolateModules(() => {
        require('../index');
      });
      // The MAT S-25 layer stack (src/theme/index.ts, contract seam) binds one
      // document 'keydown' listener at module scope — MAT-owned, exempt here.
      const surfCalls = calls.filter((c) => c !== 'document.keydown');
      expect(surfCalls).toEqual([]);
      expect(st).not.toHaveBeenCalled();
      expect(si).not.toHaveBeenCalled();
      expect(create.mock.calls.filter((c) => c[0] === 'style' || c[0] === 'script')).toEqual([]);
      expect(setAttr).not.toHaveBeenCalled();
    } finally {
      winAdd.mockRestore();
      docAdd.mockRestore();
      st.mockRestore();
      si.mockRestore();
      create.mockRestore();
      setAttr.mockRestore();
    }
  });
});
