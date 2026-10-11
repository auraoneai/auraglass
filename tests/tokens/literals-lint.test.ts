/** @jest-environment node */
import { afterAll, beforeAll, describe, test, expect } from '@jest/globals';
// MAT-061 (+ MAT-059 ratchet, REQ-MAT-18 D.2-04): literal lint tests — the
// five fixture files are each flagged by the shared matchers; exempt paths are
// allowed; the ratchet fails on +1, passes on -1, --update rewrites downward,
// and --update with an increase exits 1. Every ratchet case runs on a tmp tree
// with a tmp --baseline / --fragments dir: no case may write a repo file (the
// old --update case leaked {"src/a.ts":{"color":1}} into the MAT fragment).
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');

const require2 = createRequire(join(ROOT, 'lint/rules/mat/noop.js'));
const { scanText, isExempt } = require2(join(ROOT, 'lint/rules/mat/_literals.cjs'));

const F = join(ROOT, 'tests/tokens/fixtures/literals');
const GATE = join(ROOT, 'scripts/tokens/gates/literals.mjs');

const FRAGMENTS = join(ROOT, 'fragments/literals-baseline');
const snapshotRepo = () => {
  const out: Record<string, string> = {};
  for (const f of readdirSync(FRAGMENTS).sort()) out[`fragments/literals-baseline/${f}`] = readFileSync(join(FRAGMENTS, f), 'utf8');
  out['scripts/tokens/gates/literals-baseline.json'] = existsSync(join(ROOT, 'scripts/tokens/gates/literals-baseline.json')) ? 'present' : 'absent';
  return out;
};
let before: Record<string, string>;
beforeAll(() => { before = snapshotRepo(); });
afterAll(() => { expect(snapshotRepo()).toEqual(before); });

/** tmp tree with src files { rel: text } */
const tree = (files: Record<string, string>) => {
  const dir = mkdtempSync(join(tmpdir(), 'ag-lit-'));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
  return dir;
};
const fragDir = (frags: Record<string, unknown>) => {
  const dir = mkdtempSync(join(tmpdir(), 'ag-lit-frag-'));
  for (const s of ['plat', 'mat', 'cmp', 'surf', 'qual'])
    writeFileSync(join(dir, `${s}.json`), JSON.stringify(frags[s] ?? { version: 1, files: {} }));
  return dir;
};

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

  test('--update with a custom --baseline writes only that file, never a fragment', () => {
    const dir = tree({ 'src/material/a.ts': `export const s = { color: '#fff' };\n` });
    const baseline = join(dir, 'baseline.json');
    writeFileSync(baseline, JSON.stringify({ version: 1, files: { 'src/material/a.ts': { color: 3 } } }));
    const r = run(['--src', dir, '--baseline', baseline, '--stream', 'mat', '--update']);
    expect(r.code).toBe(0);
    expect(JSON.parse(readFileSync(baseline, 'utf8')).files).toEqual({ 'src/material/a.ts': { color: 1 } });
    // afterAll asserts every repo fragment is byte-identical
  });

  test('--stream measures only the stream-owned files (contracts/ownership.json)', () => {
    const dir = tree({
      'src/material/a.ts': `export const s = { color: '#fff' };\n`,
      'src/components/button/b.tsx': `export const s = { color: '#000', background: '#111' };\n`,
    });
    const frags = fragDir({ mat: { version: 1, files: { 'src/material/a.ts': { color: 1 } } } });
    // mat: equal -> 0 although the cmp file has 2 unbaselined hits
    expect(run(['--src', dir, '--fragments', frags, '--stream', 'mat']).code).toBe(0);
    const cmp = run(['--src', dir, '--fragments', frags, '--stream', 'cmp']);
    expect(cmp.code).toBe(1);
    expect(cmp.out).toContain('src/components/button/b.tsx: color 0 -> 2');
    expect(cmp.out).not.toContain('src/material/a.ts');
  });

  test('--update --stream writes only <stream>.json, downward', () => {
    const dir = tree({ 'src/theme/a.ts': `export const s = { color: '#fff' };\n` });
    const frags = fragDir({
      mat: { version: 1, files: { 'src/theme/a.ts': { color: 2 } } },
      cmp: { version: 1, files: { 'src/components/x.tsx': { color: 4 } } },
    });
    const cmpBefore = readFileSync(join(frags, 'cmp.json'), 'utf8');
    const r = run(['--src', dir, '--fragments', frags, '--stream', 'mat', '--update']);
    expect(r.code).toBe(0);
    expect(JSON.parse(readFileSync(join(frags, 'mat.json'), 'utf8'))).toEqual({ version: 1, files: { 'src/theme/a.ts': { color: 1 } } });
    expect(readFileSync(join(frags, 'cmp.json'), 'utf8')).toBe(cmpBefore);
    // all-stream --update is refused (a stream writes only its own fragment)
    expect(run(['--src', dir, '--fragments', frags, '--update']).code).toBe(2);
  });

  test('no --stream: every stream is checked, only MAT increases exit 1', () => {
    const dir = tree({ 'src/components/button/b.tsx': `export const s = { color: '#000' };\n` });
    const frags = fragDir({});
    const foreign = run(['--src', dir, '--fragments', frags]);
    expect(foreign.code).toBe(0);
    expect(foreign.out).toContain('pre-existing (cmp) src/components/button/b.tsx: color 0 -> 1');
    writeFileSync(join(dir, 'src/components/button/b.tsx'), 'export {};\n');
    mkdirSync(join(dir, 'src/motion'), { recursive: true });
    writeFileSync(join(dir, 'src/motion/m.ts'), `export const e = 'cubic-bezier(0.2, 0, 0, 1)';\n`);
    const mat = run(['--src', dir, '--fragments', frags]);
    expect(mat.code).toBe(1);
    expect(mat.out).toContain('MAT src/motion/m.ts: easing 0 -> 1');
  });

  test('a malformed stream fragment fails that stream and is pre-existing for the others', () => {
    const dir = tree({ 'src/material/a.ts': 'export {};\n' });
    const frags = fragDir({ surf: { W1: [] } });
    const surf = run(['--src', dir, '--fragments', frags, '--stream', 'surf']);
    expect(surf.code).toBe(1);
    expect(surf.out).toContain('not a LiteralsBaseline');
    const all = run(['--src', dir, '--fragments', frags]);
    expect(all.code).toBe(0);
    expect(all.out).toContain('pre-existing (surf)');
  });

  test('unknown --stream exits 2', () => {
    expect(run(['--stream', 'nope']).code).toBe(2);
  });

  test('global baseline is gone; the MAT fragment holds only real src paths and the real gate exits 0', () => {
    expect(existsSync(join(ROOT, 'scripts/tokens/gates/literals-baseline.json'))).toBe(false);
    const mat = JSON.parse(readFileSync(join(FRAGMENTS, 'mat.json'), 'utf8'));
    expect(mat.version).toBe(1);
    for (const f of Object.keys(mat.files)) {
      expect({ f, exists: existsSync(join(ROOT, f)) }).toEqual({ f, exists: true });
      expect(f.startsWith('src/')).toBe(true);
    }
    expect(run(['--stream', 'mat', '--quiet']).code).toBe(0);
  });
});
