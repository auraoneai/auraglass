/* tests/compat/plat/deprecation-warnings.test.tsx — REQ-PLAT-26, AC-FIN-33.
   Exercises the real src/internal module (not a re-implementation):
   - 3 calls with one id → exactly 1 console.warn matching the PRD regex
   - NODE_ENV=production → 0 warnings
   - setDeprecationMode('silent') → 0 warnings
   - importing src/internal (cn + warnDeprecated + table) registers no
     listener or timer and writes nothing to the console
   - cn is the single class joiner (clsx semantics) */
import { afterEach, describe, expect, it, jest } from '@jest/globals';

const PRD_RE = /^\[aura-glass\] DEP-[PMCSQ]\d{4} \(since \d+\.\d+\.\d+, removed in \d+\.\d+\.\d+\): /;
type Internal = typeof import('../../../src/internal');
const fresh = (): Internal => {
  let mod: Internal | undefined;
  jest.isolateModules(() => { mod = require('../../../src/internal') as Internal; });
  if (!mod) throw new Error('src/internal did not load');
  return mod;
};
const ORIGINAL_ENV = process.env.NODE_ENV;
afterEach(() => { process.env.NODE_ENV = ORIGINAL_ENV; jest.restoreAllMocks(); });

describe('warnDeprecated through src/internal (REQ-PLAT-26)', () => {
  it('the generated table has rows to warn with', () => {
    expect(Object.keys(fresh().DEPRECATIONS).length).toBeGreaterThan(0);
  });

  it('3 calls with one id produce exactly 1 warning in the PRD format', () => {
    const m = fresh();
    const id = Object.keys(m.DEPRECATIONS)[0];
    const row = m.DEPRECATIONS[id];
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    m.warnDeprecated(id); m.warnDeprecated(id); m.warnDeprecated(id);
    expect(warn).toHaveBeenCalledTimes(1);
    const line = String(warn.mock.calls[0][0]);
    expect(line).toMatch(PRD_RE);
    expect(line.startsWith(`[aura-glass] ${row.id} (since ${row.since}, removed in ${row.removeIn}): `)).toBe(true);
    expect(line).toContain(row.doc);
  });

  it('every row of the table renders a PRD-format line', () => {
    const m = fresh();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const ids = Object.keys(m.DEPRECATIONS);
    for (const id of ids) m.warnDeprecated(id);
    expect(warn).toHaveBeenCalledTimes(ids.length);
    for (const [line] of warn.mock.calls) expect(String(line)).toMatch(PRD_RE);
  });

  it('NODE_ENV=production emits 0 warnings', () => {
    process.env.NODE_ENV = 'production';
    const m = fresh();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    for (const id of Object.keys(m.DEPRECATIONS)) m.warnDeprecated(id);
    m.warnDeprecated('DEP-Z9999');
    expect(warn).not.toHaveBeenCalled();
  });

  it("setDeprecationMode('silent') emits 0 warnings", () => {
    const m = fresh();
    m.setDeprecationMode('silent');
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    for (const id of Object.keys(m.DEPRECATIONS)) m.warnDeprecated(id);
    expect(warn).not.toHaveBeenCalled();
  });

  it('import registers no listener or timer and writes nothing to the console', () => {
    const spies = [
      jest.spyOn(window, 'addEventListener'),
      jest.spyOn(document, 'addEventListener'),
      jest.spyOn(globalThis, 'setTimeout'),
      jest.spyOn(globalThis, 'setInterval'),
      jest.spyOn(console, 'warn').mockImplementation(() => {}),
      jest.spyOn(console, 'error').mockImplementation(() => {}),
      jest.spyOn(console, 'log').mockImplementation(() => {}),
    ];
    fresh();
    for (const s of spies) expect(s).not.toHaveBeenCalled();
  });
});

describe('cn (src/internal/cn.ts)', () => {
  it('joins truthy class values with clsx semantics', () => {
    const { cn } = fresh();
    expect(cn('a', false, null, undefined, 0, 'b', { c: true, d: false }, ['e', ['f']])).toBe('a b c e f');
    expect(cn()).toBe('');
  });
  it('the barrel re-exports the cn.ts binding', () => {
    let direct: unknown; let barrel: unknown;
    jest.isolateModules(() => {
      direct = (require('../../../src/internal/cn') as typeof import('../../../src/internal/cn')).cn;
      barrel = (require('../../../src/internal') as Internal).cn;
    });
    expect(barrel).toBe(direct);
  });
});
