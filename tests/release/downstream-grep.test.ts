/* REQ-PLAT-35: bounded downstream grep — structured {file,line,spec} hits,
   fragment-derived removed symbols, PRD-shape report, build/lock excludes. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('${ROOT}/scripts/release/downstream-grep.mjs'); ${body}`],
  { cwd: ROOT, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });

// Fragment double: a fixture checkout whose fragments/deprecations/* carry a
// known set of rows, so the symbol set is asserted exactly, independent of
// the live register.
function fragmentDouble(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dg-frag-'));
  mkdirSync(join(dir, 'fragments/deprecations'), { recursive: true });
  const row = (o: Record<string, unknown>) => ({ status: 'active', entry: '.', since: '4.2.0',
    replacement: null, codemod: null, automation: 'none', breaking: 'B1', message: 'm', doc: '#dep-x', ...o });
  writeFileSync(join(dir, 'fragments/deprecations/cmp.json'), JSON.stringify([
    row({ id: 'DEP-C9001', kind: 'export', symbol: 'GlassFixtureButton', removeIn: '5.0.0' }),
    row({ id: 'DEP-C9002', kind: 'prop', symbol: 'GlassFixtureCard.glow', removeIn: '5.0.0' }),
    row({ id: 'DEP-C9003', kind: 'export', symbol: 'GlassLaterThing', removeIn: '6.0.0' }),
    row({ id: 'DEP-C9004', kind: 'css-var', symbol: 'GlassCssVarRow', removeIn: '5.0.0' }),
    row({ id: 'DEP-C9005', kind: 'export', symbol: 'not a symbol', removeIn: '5.0.0' }),
  ]));
  // .ts fragments go through the contract loader's esbuild path.
  writeFileSync(join(dir, 'fragments/deprecations/surf.ts'), `export default ${JSON.stringify([
    row({ id: 'DEP-S9001', kind: 'subpath', symbol: 'GlassFixtureSubpath', removeIn: '5.0.0' }),
  ])};\n`);
  return dir;
}

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
  it('removedSymbols comes from the deprecations fragments (removeIn + kind + identifier filter)', () => {
    const frag = fragmentDouble();
    try {
      const five = JSON.parse(EVAL(`console.log(JSON.stringify(await m.removedSymbols('${frag}', '5.0.0')))`));
      expect(five).toEqual(['GlassFixtureButton', 'GlassFixtureCard.glow', 'GlassFixtureSubpath']);
      const six = JSON.parse(EVAL(`console.log(JSON.stringify(await m.removedSymbols('${frag}', '6.0.0')))`));
      expect(six).toEqual(['GlassLaterThing']);
    } finally { rmSync(frag, { recursive: true, force: true }); }
  });
  it('removedSymbolHits are the fragment symbols found in consumer code, build/lock dirs excluded', () => {
    const frag = fragmentDouble();
    const dir = mkdtempSync(join(tmpdir(), 'dg3-'));
    try {
      mkdirSync(join(dir, 'src')); mkdirSync(join(dir, 'dist')); mkdirSync(join(dir, '.next'));
      writeFileSync(join(dir, 'src/a.tsx'), "import { GlassFixtureButton } from 'aura-glass';\n<GlassFixtureButton />;\n");
      writeFileSync(join(dir, 'src/b.tsx'), "const keep = 'GlassLaterThing';\n");
      writeFileSync(join(dir, 'dist/a.js'), 'GlassFixtureButton();\n');
      writeFileSync(join(dir, '.next/a.js'), 'GlassFixtureButton();\n');
      writeFileSync(join(dir, 'yarn.lock'), 'GlassFixtureButton\n');
      const out = EVAL(`const symbols = await m.removedSymbols('${frag}', '5.0.0');
        const r = await m.scanRoot('${dir}', { symbols });
        console.log(JSON.stringify(r.removedSymbolHits))`);
      const hits = JSON.parse(out) as Array<{ symbol: string; file: string; line: number; spec: string }>;
      expect(hits.map((h) => [h.symbol, h.file.replace(/^.*\/src\//, 'src/'), h.line]))
        .toEqual([['GlassFixtureButton', 'src/a.tsx', 1], ['GlassFixtureButton', 'src/a.tsx', 2]]);
    } finally {
      rmSync(frag, { recursive: true, force: true }); rmSync(dir, { recursive: true, force: true });
    }
  });
  it('main writes the PRD-shaped report to docs/release/decisions/', () => {
    const frag = fragmentDouble();
    const dir = mkdtempSync(join(tmpdir(), 'dg2-'));
    const outPath = join(dir, 'downstream-4.2.0.json');
    try {
      writeFileSync(join(dir, 'package.json'), '{}');
      mkdirSync(join(dir, 'src'));
      writeFileSync(join(dir, 'src/x.ts'), 'GlassFixtureButton();\n');
      execFileSync('node', ['scripts/release/downstream-grep.mjs', '--roots', dir,
        '--version', '4.2.0', '--fragments-root', frag, '--out', outPath],
        { cwd: ROOT, encoding: 'utf8' });
      const rep = JSON.parse(readFileSync(outPath, 'utf8'));
      for (const k of ['tool', 'version', 'removeIn', 'symbols', 'roots', 'summary'])
        expect(rep).toHaveProperty(k);
      expect(rep.version).toBe('4.2.0');
      expect(rep.removeIn).toBe('5.0.0');
      expect(rep.symbols).toEqual(['GlassFixtureButton', 'GlassFixtureCard.glow', 'GlassFixtureSubpath']);
      expect(rep.summary.roots).toBe(1);
      expect(rep.summary.removedSymbolHitCount).toBe(1);
      expect(rep.roots[0].status).toBe('ok');
    } finally {
      rmSync(frag, { recursive: true, force: true }); rmSync(dir, { recursive: true, force: true });
    }
  });
});
