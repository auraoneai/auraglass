/* Mutation self-test for the contract conformance suite (QUAL, REQ-QUAL-70 / contract §6.3).
   Copies real seeds into an untracked work dir inside the repo (so the change classifier sees
   them as `introduced`, exactly like a PR's own edit), breaks each copy, runs the same check the
   suite runs, and asserts the named failure: seam id, owning stream, classification and path.
   It also proves the other half of the policy: the same violation on an unchanged path is
   recorded `pending` in the evidence report instead of failing (pre-existing, before GA). */
import * as React from 'react';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { cleanup, render } from '@testing-library/react';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LAYER_ORDER_STATEMENT } from '../../../src/contracts/tokens';
import { ROOT, STRICT, changes, classify, conform, ownerOf, readReport, rel } from '../_conformance';
import { checkCssVars, checkLayerFile, checkMetaShape, checkRenderedAttributes, checkShippedAttributes, definedCustomProperties } from '../_checks';
import { PART_NAME_RE } from '../../../src/contracts/components';

const SUITE = '__selftest__';
const WORK = join(__dirname, `.work-${process.pid}`);
const CSS_SEED = join(ROOT, 'contracts', 'stubs', 'reference.css');
const TSX_SEED = join(ROOT, 'src', 'contracts', 'seed.tsx');
let cssCopy: string;
let tsxCopy: string;

beforeAll(() => {
  mkdirSync(WORK, { recursive: true });
  cssCopy = join(WORK, 'reference.css');
  tsxCopy = join(WORK, 'seed.tsx');
  copyFileSync(CSS_SEED, cssCopy);
  copyFileSync(TSX_SEED, tsxCopy);
  // Every work file exists before the first classification: the change set is computed once.
  writeFileSync(join(WORK, 'Probe.meta.ts'), 'export default {};\n');
});

afterAll(() => {
  cleanup();
  rmSync(WORK, { recursive: true, force: true });
});

const expectNamedFailure = (fn: () => unknown, seam: string, file: string, text: string) => {
  let message = '';
  try {
    fn();
  } catch (e) {
    message = (e as Error).message;
  }
  expect(message).toContain(`[${seam} owner=${ownerOf(file)} introduced] ${file}: `);
  expect(message).toContain(text);
};

describe('classifier and policy', () => {
  it('strict mode follows the package version and AG_SCOPE, and the base line resolves', () => {
    const version = (JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string }).version;
    expect(STRICT).toBe(process.env.AG_SCOPE === 'release' || !version.includes('-') || process.env.AG_CONFORMANCE_STRICT === '1');
    expect(changes().paths).not.toBeNull();
  });

  it('classifies the untracked seed copies as introduced and untouched seeds as pre-existing', () => {
    expect(classify(rel(cssCopy))).toBe('introduced');
    expect(classify('contracts/stubs/reference.css')).toBe('pre-existing');
  });

  it('owner names come from contracts/ownership.json', () => {
    expect(ownerOf('contracts/stubs/reference.css')).toBe('CONTRACT');
    expect(ownerOf('src/material/css/material.css')).toBe('MAT');
    expect(ownerOf(rel(cssCopy))).toBe('QUAL');
  });
});

describe('S-04 mutation: seed CSS copy', () => {
  it('the unmodified copy passes the shipped-file layer check', () => {
    expect(checkLayerFile(rel(cssCopy), readFileSync(cssCopy, 'utf8'), undefined, { shipped: true })).toEqual([]);
  });

  it('dropping LAYER_ORDER_STATEMENT yields the named S-04 failure', () => {
    writeFileSync(cssCopy, readFileSync(CSS_SEED, 'utf8').replace(LAYER_ORDER_STATEMENT, ''));
    const v = checkLayerFile(rel(cssCopy), readFileSync(cssCopy, 'utf8'), undefined, { shipped: true });
    expectNamedFailure(() => conform(SUITE, 'layers', v), 'S-04', rel(cssCopy), 'does not start with LAYER_ORDER_STATEMENT');
  });

  it('adding !important yields the named S-04 failure', () => {
    writeFileSync(cssCopy, readFileSync(CSS_SEED, 'utf8').replace(/;(\s*\n\s*--ag-rim)/, ' !important;$1'));
    const v = checkLayerFile(rel(cssCopy), readFileSync(cssCopy, 'utf8'), undefined, { shipped: true });
    expectNamedFailure(() => conform(SUITE, 'layers', v), 'S-04', rel(cssCopy), '1 !important declaration(s)');
  });

  it('a wrong outer layer yields the named S-04 failure against its fragments/css declaration', () => {
    writeFileSync(cssCopy, `${LAYER_ORDER_STATEMENT}\n@layer ag.tokens { :root { --ag-density: 1; } }\n`);
    const v = checkLayerFile(rel(cssCopy), readFileSync(cssCopy, 'utf8'), 'ag.components');
    expectNamedFailure(() => conform(SUITE, 'layers', v), 'S-04', rel(cssCopy), 'top-level layer ag.tokens != fragments/css declaration ag.components');
  });

  it('defining a non-public --ag-* var yields the named S-03 failure', () => {
    writeFileSync(cssCopy, `${LAYER_ORDER_STATEMENT}\n@layer ag.tokens { :root { --ag-not-in-contract: 1px; } }\n`);
    const defs = new Map([...definedCustomProperties(readFileSync(cssCopy, 'utf8'))].map((n) => [n, [rel(cssCopy)]] as const));
    expectNamedFailure(() => conform(SUITE, 'css-vars', checkCssVars(defs)), 'S-03', rel(cssCopy), '--ag-not-in-contract');
  });
});

describe('S-01 mutation: seed TSX copy', () => {
  it('a seed emitting a banned attribute yields the named S-01 failure', () => {
    writeFileSync(tsxCopy, readFileSync(TSX_SEED, 'utf8').replace(`'data-ag-seed': '', 'data-ag-part': 'root'`, `'data-ag-material': '', 'data-ag-part': 'root'`));
    const v = checkShippedAttributes([{ file: rel(tsxCopy), text: readFileSync(tsxCopy, 'utf8') }]);
    expectNamedFailure(() => conform(SUITE, 'attributes', v), 'S-01', rel(tsxCopy), 'banned attribute data-ag-material');
  });

  it('the rendered seed copy is caught emitting data-ag-seed', () => {
    copyFileSync(TSX_SEED, tsxCopy);
    const seed = require(tsxCopy) as { createSeedComponent: (n: string, t: string) => React.ComponentType };
    const Seeded = seed.createSeedComponent('probe', 'div');
    render(React.createElement(Seeded));
    const v = checkRenderedAttributes(document.body, rel(tsxCopy), 'Seed(probe)');
    expectNamedFailure(() => conform(SUITE, 'rendered', v), 'S-01', rel(tsxCopy), 'renders story-only/seed attribute data-ag-seed');
  });
});

describe('S-31 mutation: meta copy', () => {
  it('a broken meta copy yields the named S-31 failures', () => {
    const metaFile = rel(join(WORK, 'Probe.meta.ts'));
    const broken = { name: 'Probe', owner: 'CMP', entry: './nope', tier: 'T9', rsc: 'client', parts: ['Root'], states: [], variants: {}, migration: [{ from: 'X', automation: 'auto', compat: true }] };
    const v = checkMetaShape(metaFile, broken, { subpaths: new Set(['.']), partRe: PART_NAME_RE });
    expect(v.map((x) => x.seam).sort()).toEqual(['S-31', 'S-31', 'S-33', 'S-35']);
    expectNamedFailure(() => conform(SUITE, 'meta', v), 'S-31', metaFile, 'tier "T9"');
  });
});

describe('pre-existing violations: pending before GA, failing at GA', () => {
  it('the same S-04 violation on an unchanged path follows the mode', () => {
    const v = [{ seam: 'S-04', file: 'contracts/stubs/reference.css', detail: 'synthetic pre-existing probe' }];
    if (STRICT) {
      expect(() => conform(SUITE, 'pre-existing-probe', v)).toThrow('[S-04 owner=CONTRACT pre-existing] contracts/stubs/reference.css: pre-existing-probe: synthetic pre-existing probe');
      return;
    }
    const pending = conform(SUITE, 'pre-existing-probe', v);
    expect(pending).toHaveLength(1);
    expect(pending[0]).toMatchObject({ seam: 'S-04', owner: 'CONTRACT', class: 'pre-existing', status: 'pending' });
    const report = readReport(SUITE)!;
    expect(report.results.filter((r) => r.status === 'fail').length).toBeGreaterThanOrEqual(7);
    expect(report.results).toContainEqual(expect.objectContaining({ detail: 'pre-existing-probe: synthetic pre-existing probe', status: 'pending' }));
  });
});
