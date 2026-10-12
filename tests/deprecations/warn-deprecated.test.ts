/* tests/deprecations/warn-deprecated.test.ts — REQ-PLAT-26 (PLAT-187): exact message
   format, 3 calls -> 1 log, 0 in production, 0 under silent, unknown-id
   fallback, no import-time listener/timer/console, repeat-call cost median
   <= 0.01ms over 10k calls, and a production Vite build of a fixture contains
   none of the message strings. (Moved from tests/release/.) */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { DEPRECATIONS, setDeprecationMode, warnDeprecated } from '../../src/internal/index';

const ROOT = resolve(__dirname, '../..');
const KEYS = Object.keys(DEPRECATIONS);
const ID = KEYS[0] ?? 'DEP-C0001';
const ID_ONCE = KEYS[1] ?? 'DEP-C0003';
const ID_PERF = KEYS[2] ?? 'DEP-C0004';
const ID_PROD = KEYS[3] ?? 'DEP-C0005';
const row = DEPRECATIONS[ID];
const LINE_RE = /^\[aura-glass\] DEP-[PMCSQ]\d{4} \(since \d+\.\d+\.\d+, removed in \d+\.\d+\.\d+\): /;

afterEach(() => { setDeprecationMode('warn'); jest.restoreAllMocks(); });

describe('warnDeprecated (REQ-PLAT-26)', () => {
  it('message format: [aura-glass] <id> (since X, removed in Y): <msg> Codemod: ... <doc>', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecated(ID);
    expect(spy).toHaveBeenCalledTimes(1);
    const msg = spy.mock.calls[0]?.[0];
    expect(row).toBeDefined();
    if (row) {
      // 03e500ea7: rows already end in '.', the sentence ends exactly once.
      expect(msg).toBe(
        `[aura-glass] ${row.id} (since ${row.since}, removed in ${row.removeIn}): ${row.message.replace(/\.+$/, '')}.${row.codemod ? ` Codemod: npx aura-glass-cli migrate 4to5 --transform ${row.codemod}.` : ''} ${row.doc}`,
      );
      expect(msg).not.toContain('..');
    }
  });
  it('3 calls -> exactly 1 log matching the one-line format', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecated(ID_ONCE); warnDeprecated(ID_ONCE); warnDeprecated(ID_ONCE);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(String(spy.mock.calls[0]?.[0])).toMatch(LINE_RE);
    expect(String(spy.mock.calls[0]?.[0])).not.toContain('\n');
  });
  it('NODE_ENV=production -> 0 logs (and the id is not consumed)', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      warnDeprecated(ID_PROD); warnDeprecated(ID_PROD); warnDeprecated('DEP-Z9997');
    } finally {
      process.env.NODE_ENV = prev;
    }
    expect(spy).not.toHaveBeenCalled();
    // The Set is filled only on a real (dev) call.
    warnDeprecated(ID_PROD);
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
    warnDeprecated(KEYS[4] ?? 'DEP-C0006');
    expect(spy).not.toHaveBeenCalled();
  });
  it('importing src/internal registers no listener, timer or console output', () => {
    const spies = [
      jest.spyOn(window, 'addEventListener'),
      jest.spyOn(document, 'addEventListener'),
      jest.spyOn(globalThis, 'setTimeout'),
      jest.spyOn(globalThis, 'setInterval'),
      jest.spyOn(globalThis, 'queueMicrotask'),
      ...(['log', 'info', 'warn', 'error', 'debug'] as const).map((m) => jest.spyOn(console, m)),
    ];
    let mod: typeof import('../../src/internal/index') | undefined;
    jest.isolateModules(() => {
      mod = require('../../src/internal/index') as typeof import('../../src/internal/index');
    });
    expect(typeof mod?.warnDeprecated).toBe('function');
    for (const s of spies) expect(s).not.toHaveBeenCalled();
  });
  it('repeat-call median stays under 0.01ms over 10k calls', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const times: number[] = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      for (let j = 0; j < 10000; j++) warnDeprecated(ID_PERF);
      times.push((performance.now() - t0) / 10000);
    }
    times.sort((a, b) => a - b);
    expect(times[2]).toBeLessThan(0.01);
  });
});

describe('production Vite build (REQ-PLAT-26)', () => {
  it('a fixture calling warnDeprecated contains none of the message strings', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-warn-prod-'));
    try {
      const entry = join(dir, 'entry.ts');
      const internal = join(ROOT, 'src/internal/index.ts');
      writeFileSync(entry, [
        `import { warnDeprecated, cn } from ${JSON.stringify(internal)};`,
        `export function use(): string { ${KEYS.slice(0, 5).map((k) => `warnDeprecated(${JSON.stringify(k)});`).join(' ')} warnDeprecated('DEP-Z0000'); return cn('a', 'b'); }`,
        '',
      ].join('\n'));
      const script = `
        import { build } from 'vite';
        const r = await build({ root: ${JSON.stringify(dir)}, configFile: false, logLevel: 'silent', mode: 'production',
          define: { 'process.env.NODE_ENV': '"production"' },
          build: { write: false, minify: true, lib: { entry: ${JSON.stringify(entry)}, formats: ['es'], fileName: 'fixture' } } });
        const out = (Array.isArray(r) ? r : [r]).flatMap((b) => b.output).filter((o) => o.type === 'chunk');
        process.stdout.write(out.map((o) => o.code).join('\\n'));`;
      const res = spawnSync(process.execPath, ['--input-type=module', '-e', script], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'production' } });
      expect(res.stderr).toBe('');
      expect(res.status).toBe(0);
      const code = res.stdout;
      expect(code).toMatch(/export\s*\{/); // the fixture really built
      expect(code).not.toContain('[aura-glass]');
      expect(code).not.toContain('is deprecated; see deprecations.json');
      expect(code).not.toContain('npx aura-glass-cli migrate');
      const leaked = Object.values(DEPRECATIONS)
        .map((r) => r.message.replace(/\.+$/, ''))
        .filter((m) => m.length >= 12 && code.includes(m));
      expect(leaked).toEqual([]);
      const leakedIds = KEYS.filter((k) => code.includes(k));
      expect(leakedIds).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 60000);
});
