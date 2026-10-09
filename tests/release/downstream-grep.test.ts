/* REQ-PLAT-35: bounded downstream grep — structured {file,line,spec} hits,
   fragment-derived removed symbols, PRD-shape report, build/lock excludes. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('${ROOT}/scripts/release/downstream-grep.mjs'); ${body}`],
  { cwd: ROOT, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });

describe('downstream-grep (REQ-PLAT-35)', () => {
  it('safeRoot refuses $HOME and /', () => {
    const out = EVAL(`console.log(JSON.stringify([m.safeRoot('/').ok, m.safeRoot('${homedir()}').ok]))`);
    expect(JSON.parse(out)).toEqual([false, false]);
  });
  it('a missing root reports missing, never clean', async () => {
    const out = EVAL(`const r = await m.scanRoot('/definitely/not/here-xyz');
      console.log(r.status)`);
    expect(out.trim()).toBe('missing');
  });
  it('hits are structured {file,line,spec} and excluded dirs are skipped', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dg-'));
    try {
      writeFileSync(join(dir, 'package.json'),
        JSON.stringify({ dependencies: { 'aura-glass': '3.1.1' } }));
      mkdirSync(join(dir, 'src')); mkdirSync(join(dir, 'dist'));
      writeFileSync(join(dir, 'src/x.ts'), "import { DynamicAtmosphere } from 'aura-glass';\n");
      writeFileSync(join(dir, 'dist/y.ts'), "import { DynamicAtmosphere } from 'aura-glass';\n");
      writeFileSync(join(dir, 'package-lock.json'), '{"deps":{"aura-glass":"3.1.1"}}');
      const out = EVAL(`const r = await m.scanRoot('${dir}');
        console.log(JSON.stringify({ status: r.status, pins: r.pins,
          imports: r.imports, hitCount: r.removedSymbolHits.length }))`);
      const r = JSON.parse(out);
      expect(r.status).toBe('ok');
      expect(r.imports.length).toBe(1); // dist/ excluded — only src/x.ts hits
      expect(r.imports[0].file).toContain('x.ts');
      expect(r.imports[0].line).toBe(1);
      expect(r.pins.length).toBe(1); // package.json pin; lockfile excluded
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('removedSymbols comes from the deprecations fragments', async () => {
    const out = EVAL(`const s = await m.removedSymbols('${ROOT}', '6.0.0');
      console.log(s.length)`);
    expect(Number(out.trim())).toBeGreaterThan(50);
  });
  it('main writes the PRD-shaped report to docs/release/decisions/', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dg2-'));
    const outPath = join(dir, 'downstream-4.2.0.json');
    try {
      writeFileSync(join(dir, 'package.json'), '{}');
      execFileSync('node', ['scripts/release/downstream-grep.mjs',
        '--roots', dir, '--version', '4.2.0', '--remove-in', '6.0.0', '--out', outPath],
        { cwd: ROOT, encoding: 'utf8' });
      const rep = JSON.parse(readFileSync(outPath, 'utf8'));
      for (const k of ['tool', 'version', 'removeIn', 'symbols', 'roots', 'summary'])
        expect(rep).toHaveProperty(k);
      expect(rep.version).toBe('4.2.0');
      expect(rep.summary.roots).toBe(1);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
