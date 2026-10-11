/** Deprecation coverage (REQ-PLAT-91): every deprecations.json entry whose
 *  codemod is non-null names a real TRANSFORM_ORDER id AND its symbol occurs in
 *  at least one fixture input; outputs of full-automation transforms carry 0
 *  TODO markers. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { TRANSFORM_ORDER } from '../index.js';
import { discoverFixtures } from '../../../../test/helpers/fixture-discovery.js';
import catalogue from '../catalogue.json' with { type: 'json' };

const dep = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'mappings', 'deprecations.json'), 'utf8'),
) as Array<Record<string, unknown>>;
const cases = discoverFixtures();
const inputText = cases.map((c) => fs.readFileSync(c.input, 'utf8')).join('\n');
const FULL = new Set(catalogue.transforms.filter((t) => t.automation === 'full').map((t) => t.id));

describe('deprecation coverage', () => {
  it('every codemod-bearing entry names a TRANSFORM_ORDER id', () => {
    const bad = dep.filter((e) => e.codemod && !TRANSFORM_ORDER.includes(String(e.codemod))).map((e) => e.id);
    expect(bad).toEqual([]);
  });
  it('every codemod-bearing entry symbol appears in >=1 fixture input', () => {
    const missing = dep
      .filter((e) => e.codemod && e.symbol && /^[A-Za-z_$][A-Za-z0-9_$.]*$/.test(String(e.symbol)) && String(e.symbol) !== '*' && !inputText.includes(String(e.symbol)))
      .map((e) => String(e.symbol));
    expect(missing).toEqual([]);
  });
  it('full-automation fixture outputs contain 0 TODO markers', () => {
    const offenders = cases
      .filter((c) => !c.pending && FULL.has(c.transform))
      .filter((c) => fs.readFileSync(c.output, 'utf8').includes('TODO'))
      .map((c) => `${c.stream}/${c.group}/${c.name}`);
    expect(offenders).toEqual([]);
  });
});
