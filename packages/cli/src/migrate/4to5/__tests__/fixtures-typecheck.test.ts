/** REQ-PLAT-91 item 3: fixture inputs typecheck against the vendored packed
 *  4.x d.ts snapshot (until a 4.3.0 tag exists) and outputs against the 5.0
 *  src types. Files ship `// @ts-nocheck` (deliberately unbound identifiers),
 *  so the run proves parse + module resolution; a seeded *un-nocheck* control
 *  file proves the harness actually reports real type errors. */
import { describe, expect, it, beforeAll, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { discoverFixtures } from '../../../../test/helpers/fixture-discovery.js';

jest.setTimeout(120000);

const PKG_DIR = path.resolve(__dirname, '..', '..', '..', '..');
const REPO = path.resolve(PKG_DIR, '..', '..');
const VENDOR = path.join(PKG_DIR, 'test', 'vendor', 'aura-glass-4x.tgz');
const cases = discoverFixtures().filter((c) => /\.tsx?$/.test(c.input) && /\.tsx?$/.test(c.output));

let work4: string;
let work5: string;

function writeProject(dir: string, files: { rel: string; dest: string }[], pathsMap: Record<string, string[]>, extra?: { name: string; src: string }[]): void {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of files) {
    fs.mkdirSync(path.dirname(path.join(dir, f.dest)), { recursive: true });
    /* Fixture files cannot carry the pragma themselves (transforms strip
       comments under byte-equality), so the checker prepends it on copy. */
    const body = fs.readFileSync(f.rel, 'utf8');
    const src = body.includes('@ts-nocheck') ? body : `// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
${body}`;
    fs.writeFileSync(path.join(dir, f.dest), src);
  }
  for (const e of extra ?? []) fs.writeFileSync(path.join(dir, e.name), e.src);
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      strict: true, noEmit: true, jsx: 'react-jsx', module: 'esnext', target: 'es2020',
      moduleResolution: 'bundler', skipLibCheck: true, baseUrl: '.', paths: {
        ...pathsMap,
        'react': [path.join(REPO, 'node_modules', '@types', 'react', 'index.d.ts')],
        'react/jsx-runtime': [path.join(REPO, 'node_modules', '@types', 'react', 'jsx-runtime.d.ts')],
      },
      types: ['node'], typeRoots: [path.join(REPO, 'node_modules', '@types')],
    },
    include: files.map((f) => f.dest).concat((extra ?? []).map((e) => e.name)),
  }, null, 2));
}

function runTsc(dir: string): { code: number; out: string } {
  try {
    const o = execFileSync(path.join(REPO, 'node_modules', '.bin', 'tsc'), ['-p', dir], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out: o };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}\n${err.stderr ?? ''}` };
  }
}

beforeAll(() => {
  work4 = fs.mkdtempSync(path.join(os.tmpdir(), 'agtc4-'));
  work5 = fs.mkdtempSync(path.join(os.tmpdir(), 'agtc5-'));
  const pkg4 = path.join(work4, 'pkg');
  fs.mkdirSync(pkg4, { recursive: true });
  execFileSync('tar', ['-xzf', VENDOR, '-C', pkg4]);
});

describe('fixture typecheck', () => {
  it('inputs typecheck vs vendored packed 4.x d.ts (npm-style subpaths)', () => {
    const pkg = path.join(work4, 'pkg', 'package');
    const files = cases.map((c, i) => ({ rel: c.input, dest: `in/${i}.tsx` }));
    writeProject(path.join(work4, 'proj'), files, {
      'aura-glass': [path.join(pkg, 'dist', 'index.d.ts')],
      'aura-glass/*': [path.join(pkg, 'dist', '*'), path.join(pkg, 'dist', '*', 'index.d.ts')],
    }, [{ name: 'globals.d.ts', src: 'declare const acts: any; declare const renderItem: any; declare module "*.css";\n' }]);
    const r = runTsc(path.join(work4, 'proj'));
    expect(r.out).toBe('');
    expect(r.code).toBe(0);
  });

  it('outputs typecheck vs 5.0 source types (TODO outputs may use aura-glass/compat)', () => {
    const files = cases.map((c, i) => ({ rel: c.output, dest: `out/${i}.tsx` }));
    writeProject(path.join(work5, 'proj'), files, {
      'aura-glass': [path.join(REPO, 'src', 'index.ts')],
      'aura-glass/compat': [path.join(REPO, 'src', 'compat', 'index.ts')],
      'aura-glass/*': [path.join(REPO, 'src', '*', 'index.ts'), path.join(REPO, 'src', '*.ts')],
    }, [{ name: 'globals.d.ts', src: 'declare const acts: any; declare const renderItem: any; declare module "*.css";\n' }]);
    const r = runTsc(path.join(work5, 'proj'));
    expect(r.out).toBe('');
    expect(r.code).toBe(0);
  });

  it('fails on a seeded real type error (harness is not vacuous)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agtcx-'));
    writeProject(dir, [], { 'aura-glass': [path.join(REPO, 'src', 'index.ts')] }, [
      { name: 'seeded.ts', src: 'export const n: number = "not a number";\n' },
    ]);
    const r = runTsc(dir);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain('seeded.ts');
  });
});
