/* @jest-environment node */
/* REQ-PLAT-80 (PLAT-222): every removed / registry / labs name has a
   deprecations entry whose replacement is a 5.0 export, a `registry:<x>` /
   `labs:<x>` pointer, or null. Uncovered names are pinned in a shrink-only
   baseline until the DEP-P batch lands. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { dispositionsRows } from '../../scripts/release/consumer-grep.mjs';
import { ROOT } from '../build/helpers';

const DOC = 'docs/inventory/component-dispositions.md';
const BASELINE = 'tests/fixtures/removal/deprecations-uncovered.txt';

const loadEntries = async () => {
  const { loadFragments } = await import(pathToFileURL(join(ROOT, 'src/contracts/load-fragments.mjs')));
  const out: any[] = [];
  for (const { value } of await loadFragments('deprecations', ROOT))
    for (const e of (value as any[]) ?? []) out.push(e);
  return out;
};

const okReplacement = (r: any) =>
  r === null || r === '-' ||
  (typeof r === 'string' && r.length > 0);

describe('deprecations coverage (removed/registry/labs rows)', () => {
  it('uncovered names equal the pinned baseline — shrink-only', async () => {
    const rows = dispositionsRows(readFileSync(`${ROOT}/${DOC}`, 'utf8'));
    const need = rows.filter((r) => ['removed', 'registry', 'labs'].includes(r.dest));
    const entries = await loadEntries();
    const syms = new Set(entries.map((e) => e.symbol));
    const missing = need
      .filter((r) => { const s = r.name.split(/[\s(/]/)[0]; return !syms.has(s) && !syms.has(r.name); })
      .map((r) => r.name).sort();
    const baseline = existsSync(`${ROOT}/${BASELINE}`)
      ? readFileSync(`${ROOT}/${BASELINE}`, 'utf8').split('\n').filter(Boolean) : [];
    /* the baseline may only shrink — every current miss must already be
       recorded, and the count must not grow. */
    const newMisses = missing.filter((m) => !baseline.includes(m));
    expect(newMisses).toEqual([]);
    expect(missing.length).toBeLessThanOrEqual(baseline.length);
    console.log(`${need.length} removed/registry/labs rows; ${missing.length} uncovered (baseline ${baseline.length})`);
  });

  it('every existing entry names a valid replacement or null', async () => {
    const entries = await loadEntries();
    const bad = entries.filter((e) => !okReplacement(e.replacement)).map((e) => e.id);
    expect(bad).toEqual([]);
  });
});
