/** @jest-environment node */
// MAT-061 (+ MAT-059 ratchet): literal lint tests — the five fixture files are
// each flagged by the shared matchers; exempt paths are allowed; the ratchet
// fails on +1, passes on -1, --update rewrites downward, and --update with an
// increase exits 1.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const require2 = createRequire(join(ROOT, 'lint/rules/mat/noop.js'));
const { scanText, isExempt } = require2(join(ROOT, 'lint/rules/mat/_literals.cjs'));

const F = join(ROOT, 'tests/tokens/fixtures/literals');
const GATE = join(ROOT, 'scripts/tokens/gates/literals.mjs');

const run = (args: string[]) => {
  try {
    const out = execFileSync('node', [GATE, ...args], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('literal lint (MAT-061)', () => {
  for (const [file, category] of [
    ['hex.tsx', 'color'],
    ['rgba.tsx', 'color'],
    ['blur.css', 'blur'],
    ['duration.tsx', 'duration'],
    ['bezier.css', 'easing'],
  ] as const) {
    test(`${file} flagged as ${category}`, () => {
      const hits = scanText(readFileSync(join(F, file), 'utf8'), file);
      expect(hits.some((h: any) => h.category === category)).toBe(true);
    });
  }

  test('exempt paths are allowed', () => {
    for (const p of ['tokens/ref/x.tokens.json', 'src/tokens/generated/tokens.ts', 'dist/css/tokens.css'])
      expect({ p, exempt: isExempt(p) }).toEqual({ p, exempt: true });
    // same literal content inside an exempt file never reaches the ratchet
    expect(isExempt('src/tokens/generated/manifest.ts')).toBe(true);
  });

  test('ratchet: +1 on a baselined file fails; baseline otherwise exits 0', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-lit-'));
    mkdirSync(join(dir, 'src'), { recursive: true });
    writeFileSync(join(dir, 'src', 'a.ts'), `export const s = { color: '#fff' };\n`);
    const baseline = join(dir, 'baseline.json');
    // seed baseline at 1 hit
    writeFileSync(baseline, JSON.stringify({ version: 1, files: { 'src/a.ts': { color: 1 } } }));
    // real measurement has 1 hit -> equal -> exit 0
    expect(run(['--src', dir, '--baseline', baseline, '--quiet']).code).toBe(0);
    // +1 hit -> exit 1
    writeFileSync(join(dir, 'src', 'a.ts'), `export const s = { color: '#fff', background: '#000' };\n`);
    const r = run(['--src', dir, '--baseline', baseline]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('src/a.ts');
  });

  test('ratchet: -1 passes and --update lowers the baseline', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-lit-'));
    mkdirSync(join(dir, 'src'), { recursive: true });
    writeFileSync(join(dir, 'src', 'a.ts'), `export const s = { color: '#fff' };\n`);
    const baseline = join(dir, 'baseline.json');
    writeFileSync(baseline, JSON.stringify({ version: 1, files: { 'src/a.ts': { color: 2 } } }));
    const r = run(['--src', dir, '--baseline', baseline, '--update']);
    expect(r.code).toBe(0);
    expect(r.out).toContain('baseline updated downward');
    const written = JSON.parse(readFileSync(baseline, 'utf8'));
    expect(written.files['src/a.ts'].color).toBe(1);
  });

  test('ratchet: --update with an increase exits 1 and does not write', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-lit-'));
    mkdirSync(join(dir, 'src'), { recursive: true });
    writeFileSync(join(dir, 'src', 'a.ts'), `export const s = { color: '#fff', background: '#000' };\n`);
    const baseline = join(dir, 'baseline.json');
    const seed = JSON.stringify({ version: 1, files: { 'src/a.ts': { color: 1 } } });
    writeFileSync(baseline, seed);
    const r = run(['--src', dir, '--baseline', baseline, '--update']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('increase refused');
    expect(readFileSync(baseline, 'utf8')).toBe(seed);
  });

  test('committed baseline exists and real gate exits 0', () => {
    expect(existsSync(join(ROOT, 'scripts/tokens/gates/literals-baseline.json'))).toBe(true);
    expect(run(['--quiet']).code).toBe(0);
  });
});
