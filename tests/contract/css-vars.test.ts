/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): css-vars.test.ts — seams S-03 and S-12.
   Every --ag-* custom property defined in built CSS is in PUBLIC_CSS_VARS or MOTION_CSS_VARS,
   and every one of those is defined. Built CSS = the token compiler's real output (run here
   with --out into a temp dir, exactly as `npm run tokens:build` emits dist/tokens.css,
   dist/compat/tokens.css and the generated material sheets) + every source sheet that PLAT's
   assembly copies into dist/ bundles + dist/**\/*.css when a build is present.
   Dead (defined, not public) fails; undefined public vars are reported pending before GA. */
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PUBLIC_CSS_VARS } from '../../src/contracts/tokens';
import { MOTION_CSS_VARS } from '../../src/contracts/motion';
import { ROOT, conform, distDir, rel, walk, type Violation } from './_conformance';
import { checkCssVars, definedCustomProperties, PUBLIC_AG_VARS, undefinedPublicVars } from './_checks';

const SUITE = 'css-vars';
let out: string;
const defs = new Map<string, string[]>();

function add(file: string, css: string) {
  for (const name of definedCustomProperties(css)) {
    const files = defs.get(name) ?? [];
    if (!files.includes(file)) files.push(file);
    defs.set(name, files);
  }
}

beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), 'ag-contract-tokens-'));
  execFileSync(process.execPath, [join(ROOT, 'scripts', 'tokens', 'build.mjs'), '--out', out], { cwd: ROOT, stdio: 'pipe' });
  // Token-compiler output. Generated sheets that also live in src/ are attributed to their src/ path.
  for (const abs of walk(out, (n) => n.endsWith('.css'), [], new Set())) {
    const r = abs.slice(out.length + 1).split('\\').join('/');
    add(r.startsWith('src/') ? r : `tokens/ (compiled ${r})`, readFileSync(abs, 'utf8'));
  }
  for (const abs of walk(join(ROOT, 'src'), (n) => n.endsWith('.css'))) {
    if (rel(abs).startsWith('src/material/css/generated/')) continue; // compiled fresh above
    add(rel(abs), readFileSync(abs, 'utf8'));
  }
  const dist = distDir();
  if (dist) for (const abs of walk(dist, (n) => n.endsWith('.css'))) add(rel(abs), readFileSync(abs, 'utf8'));
});

afterAll(() => {
  if (out) rmSync(out, { recursive: true, force: true });
});

describe('S-03 / S-12 public custom properties', () => {
  it('the frozen public set is non-empty and in the --ag- namespace', () => {
    expect(PUBLIC_AG_VARS.size).toBeGreaterThan(100);
    for (const m of MOTION_CSS_VARS) expect(PUBLIC_AG_VARS.has(m)).toBe(true);
    expect(PUBLIC_AG_VARS.has('--ag-color-canvas')).toBe(true);
  });

  it('the token compiler emits the token CSS', () => {
    expect(defs.size).toBeGreaterThan(100);
    expect([...defs.values()].flat().some((f) => f.includes('dist/tokens.css'))).toBe(true);
  });

  it('every --ag-* defined in built CSS is public (no dead or undeclared public vars)', () => {
    conform(SUITE, 'dead', checkCssVars(defs));
  });

  it('every contract var (PUBLIC_CSS_VARS incl. readouts and shadcn bridge, MOTION_CSS_VARS) is defined', () => {
    const all = new Set<string>([...(Object.values(PUBLIC_CSS_VARS).flat() as string[]), ...MOTION_CSS_VARS]);
    const missing = undefinedPublicVars(defs, all);
    const violations: Violation[] = missing.map((name) => ({
      seam: name.startsWith('--ag-duration') || name.startsWith('--ag-ease') || name.startsWith('--ag-spring') ? 'S-12' : 'S-03',
      file: 'tokens/', owner: 'MAT', detail: `${name} is not defined in built CSS (seed/undefined)`,
    }));
    conform(SUITE, 'undefined', violations);
  });
});
