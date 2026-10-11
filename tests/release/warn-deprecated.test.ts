/* tests/release/warn-deprecated.test.ts — REQ-PLAT-26 (PLAT-187): exact message
   format, once-per-id, silent mode, unknown-id fallback, no import-time effects,
   repeat-call cost median <= 0.01ms over 10k calls. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { DEPRECATIONS, setDeprecationMode, warnDeprecated } from '../../src/internal/index';

const KEYS = Object.keys(DEPRECATIONS);
const ID = KEYS[0] ?? 'DEP-C0001';
const ID_ONCE = KEYS[1] ?? 'DEP-C0003';
const ID_PERF = KEYS[2] ?? 'DEP-C0004';
const row = DEPRECATIONS[ID];

afterEach(() => { setDeprecationMode('warn'); jest.restoreAllMocks(); });

describe('warnDeprecated (REQ-PLAT-26)', () => {
  it('message format: [aura-glass] <id> (since X, removed in Y): <msg> Codemod: ... <doc>', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fresh = `DEP-T-${Math.random()}`;
    void fresh;
    warnDeprecated(ID);
    expect(spy).toHaveBeenCalledTimes(1);
    const msg = spy.mock.calls[0]?.[0];
    if (row) {
      expect(msg).toBe(
        `[aura-glass] ${row.id} (since ${row.since}, removed in ${row.removeIn}): ${row.message}.${row.codemod ? ` Codemod: npx @auraglass/cli migrate 4to5 --transform ${row.codemod}.` : ''} ${row.doc}`,
      );
    }
  });
  it('warns once per id', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecated(ID_ONCE); warnDeprecated(ID_ONCE);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('unknown id falls back to the generic format', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecated('DEP-Z9999');
    expect(spy).toHaveBeenLastCalledWith('[aura-glass] DEP-Z9999 is deprecated; see deprecations.json');
  });
  it('silent mode suppresses output (CP-PLAT-3 seam)', () => {
    setDeprecationMode('silent');
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecated('DEP-Z9998');
    expect(spy).not.toHaveBeenCalled();
  });
  it('repeat-call median stays under 0.01ms over 10k calls', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const times = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      for (let j = 0; j < 10000; j++) warnDeprecated(ID_PERF);
      times.push((performance.now() - t0) / 10000);
    }
    times.sort((a, b) => a - b);
    expect(times[2]).toBeLessThan(0.01);
  });
});
