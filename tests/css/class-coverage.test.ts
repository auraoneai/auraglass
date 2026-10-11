/* @jest-environment node */
/* REQ-PLAT-74: every ag / glass class name literal used in a production
   className context resolves to a selector shipped in some emitted css bundle.
   The literals that resolve to nothing today all sit in CMP and SURF files;
   they are carried in the expiring cross-stream baseline
   scripts/integration/baselines/class-coverage.json ({file, owner, reqFin,
   expires}, FIN-A, PRD-F §4.3 rule 3) and fixed by their owners (add the rule
   or drop the literal), never here. A file with an unshipped literal and no
   row fails; a row whose file no longer has one is stale and fails; a
   malformed or expired row fails. An absent baseline means no row. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';
import { styleRules } from '../../scripts/build/lib/css.mjs';

const BASELINE = 'scripts/integration/baselines/class-coverage.json';
const EXPIRY_LIB = 'scripts/integration/lib/baseline-expiry.mjs';
const CLASS_CTX = /(?:className\s*=|cn\(|clsx\(|cx\()([^;]{0,400})/g;
const CLASS_TOKEN = /['"`]([a-z-]+-[\w-]+)['"`]/g;

type Row = { file: string; owner: string; reqFin: string; expires: string };

const classLiterals = () => {
  const out = new Map<string, Set<string>>();
  for (const f of walk(join(ROOT, 'src'), (p) => /\.(tsx?|jsx?)$/.test(p) && !/\.(test|stories|spec)\./.test(p) && !p.includes('fixture'))) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(CLASS_CTX))
      for (const q of m[1].matchAll(CLASS_TOKEN)) {
        const token = q[1];
        if (!/^(ag|glass)-[\w-]+$/.test(token)) continue;
        (out.get(token) ?? out.set(token, new Set()).get(token)!).add(f.slice(ROOT.length + 1));
      }
  }
  return out;
};

const shippedClasses = () => {
  const shipped = new Set<string>();
  for (const f of walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('.map')))
    for (const r of styleRules(readFileSync(f, 'utf8')))
      for (const sel of r.selector.split(','))
        for (const m of sel.matchAll(/\.([A-Za-z][\w-]*)/g)) shipped.add(m[1]);
  return shipped;
};

/** file → unshipped class literals it uses */
const offenders = () => {
  const shipped = shippedClasses();
  const byFile = new Map<string, string[]>();
  for (const [token, files] of classLiterals()) {
    if (shipped.has(token)) continue;
    for (const f of files) (byFile.get(f) ?? byFile.set(f, []).get(f)!).push(token);
  }
  return byFile;
};

const loadBaseline = async (): Promise<Row[]> => {
  const p = join(ROOT, BASELINE);
  if (!existsSync(p)) return [];
  const rows = JSON.parse(readFileSync(p, 'utf8'));
  const lib = join(ROOT, EXPIRY_LIB);
  if (!existsSync(lib)) throw new Error(`${BASELINE} exists but ${EXPIRY_LIB} is missing`);
  const { rowProblems } = await import(pathToFileURL(lib).href);
  expect(rowProblems(rows, { gate: 'class-coverage' })).toEqual([]);
  return rows;
};

describe('class coverage (REQ-PLAT-74)', () => {
  it('every src class literal matches a shipped selector, or its file holds a baseline row', async () => {
    ensureBuilt();
    const baselined = new Set((await loadBaseline()).map((r) => r.file));
    const unlisted = [...offenders()]
      .filter(([file]) => !baselined.has(file))
      .map(([file, tokens]) => `${file}: ${[...new Set(tokens)].sort().join(', ')}`);
    expect(unlisted.sort()).toEqual([]);
  });

  it('baseline rows stay honest — a row whose file no longer offends is stale', async () => {
    ensureBuilt();
    const current = offenders();
    const stale = (await loadBaseline()).map((r) => r.file).filter((f) => !current.has(f));
    expect(stale.sort()).toEqual([]);
  });
});
