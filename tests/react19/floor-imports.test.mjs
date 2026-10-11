/* @jest-environment node */
/* REQ-FIN-37 / REQ-PLAT-72 (PLAT-271): runtime floors.
   1. No named import of a feature-detected/unstable React API anywhere in
      src/ or dist/ (no path filter) — those exports do not exist on
      react@19.0.0, so a named import breaks the peer floor. Feature
      detection through the namespace (`React.unstable_ViewTransition ?? …`)
      is the sanctioned form.
   2. Floor-import matrix: every built entry of build/exports.manifest.json is
      imported by package subpath from a scratch install whose only React is
      react@19.0.0 (the peer floor) and react@19.3.x (latest minor). The
      package (package.json + dist) is copied into the scratch node_modules,
      so Node resolves `react` from the scratch install, never from the repo.
      AG_REACT_FLOOR_VERSIONS overrides the comma-separated version list. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';
import { BANNED_REACT_NAMED_IMPORT } from '../../scripts/ci/lib/react19-gate.mjs';

const VERSIONS = (process.env.AG_REACT_FLOOR_VERSIONS ?? '19.0.0,19.3.0').split(',').map((v) => v.trim()).filter(Boolean);
const rel = (f) => f.replace(`${ROOT}/`, '');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/* Third-party deps the built entries may import: dependencies at their pins,
   peers (minus react/react-dom/tailwindcss) at the version installed in the
   repo, so the matrix varies React only. */
const scratchDeps = () => {
  const out = Object.entries(pkg.dependencies ?? {}).map(([n, v]) => `${n}@${v}`);
  for (const name of Object.keys(pkg.peerDependencies ?? {})) {
    if (['react', 'react-dom', 'tailwindcss'].includes(name)) continue;
    const p = join(ROOT, 'node_modules', name, 'package.json');
    if (existsSync(p)) out.push(`${name}@${JSON.parse(readFileSync(p, 'utf8')).version}`);
  }
  return out;
};

const builtEntries = () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, 'build/exports.manifest.json'), 'utf8'));
  return (manifest.entries ?? manifest)
    .filter((e) => typeof e.default === 'string' && e.default.endsWith('.js') && existsSync(join(ROOT, e.default)))
    .map((e) => (e.subpath === '.' ? 'aura-glass' : `aura-glass/${e.subpath.replace(/^\.\//, '')}`));
};

describe('react 19: runtime floors (REQ-PLAT-72)', () => {
  it('the named-import pattern catches named imports, not namespace feature detection', () => {
    expect(BANNED_REACT_NAMED_IMPORT.test("import { unstable_ViewTransition as VT } from 'react';")).toBe(true);
    expect(BANNED_REACT_NAMED_IMPORT.test("import { useState, experimental_useEffectEvent } from 'react'")).toBe(true);
    expect(BANNED_REACT_NAMED_IMPORT.test("const VT = React.ViewTransition ?? React.unstable_ViewTransition ?? null;")).toBe(false);
  });

  it('0 named imports of feature-detected React APIs in src/ or dist/', () => {
    ensureBuilt();
    const scan = (dir) => walk(dir, (p) => /\.(js|mjs|ts|tsx|d\.ts)$/.test(p))
      .filter((f) => BANNED_REACT_NAMED_IMPORT.test(readFileSync(f, 'utf8')))
      .map(rel);
    expect([...scan(join(ROOT, 'src')), ...scan(DIST)]).toEqual([]);
  }, 300_000);

  for (const version of VERSIONS) {
    it(`every built entry imports under react@${version}`, () => {
      ensureBuilt();
      const specifiers = builtEntries();
      expect(specifiers.length).toBeGreaterThan(0);
      const dir = mkdtempSync(join(tmpdir(), `ag-react-floor-${version}-`));
      try {
        writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'ag-react-floor', private: true, type: 'module' }));
        execFileSync('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts', '--legacy-peer-deps',
          `react@${version}`, `react-dom@${version}`, ...scratchDeps()],
        { cwd: dir, stdio: 'pipe', timeout: 240_000 });
        const target = join(dir, 'node_modules', 'aura-glass');
        mkdirSync(target, { recursive: true });
        cpSync(join(ROOT, 'package.json'), join(target, 'package.json'));
        cpSync(DIST, join(target, 'dist'), { recursive: true });

        const probe = join(dir, 'probe.mjs');
        writeFileSync(probe, `
import { createRequire } from 'node:module';
const specifiers = ${JSON.stringify(specifiers)};
const React = (await import('react')).default;
const fromPkg = createRequire(${JSON.stringify(join(target, 'dist', 'index.js'))}).resolve('react/package.json');
const bad = [];
for (const s of specifiers) {
  try { await import(s); } catch (e) { bad.push(s + ' :: ' + String(e && e.message || e).split('\\n')[0].slice(0, 200)); }
}
console.log(JSON.stringify({ version: React.version, fromPkg, bad }));
`);
        const r = spawnSync(process.execPath, [probe], { cwd: dir, encoding: 'utf8', maxBuffer: 64 << 20, timeout: 120_000 });
        expect({ status: r.status, stderr: r.status === 0 ? '' : r.stderr }).toEqual({ status: 0, stderr: '' });
        const out = JSON.parse(r.stdout.trim().split('\n').pop());
        expect(out.version).toBe(version);
        expect(out.fromPkg).toBe(join(realpathSync(dir), 'node_modules', 'react', 'package.json'));
        expect(out.bad).toEqual([]);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    }, 420_000);
  }
});
