/* @jest-environment node */
// PLAT-001/PLAT-002: the root .gitlab-ci.yml is byte-for-byte the contract §4.13.3
// block except the five PLAT-settable values, which must be pinned to real values.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';

const MASKABLE = [
  'AG_NODE_IMAGE',
  'AG_PLAYWRIGHT_IMAGE',
  'AG_NPM_VERSION',
  'AG_PAGES_BRANCH',
  'AG_V4_DIST_TAG',
] as const;

function contractBlock(): string {
  const doc = 'docs/auraglass-5/AURAGLASS_5_CONTRACTS.md';
  if (!existsSync(doc)) return ''; // contract ships on the next line only
  const md = readFileSync(doc, 'utf8');
  const i = md.indexOf('#### 4.13.3');
  expect(i).toBeGreaterThan(-1);
  const seg = md.slice(i);
  const m = seg.match(/```ya?ml\n([\s\S]*?)```/);
  expect(m).not.toBeNull();
  return (m as RegExpMatchArray)[1] ?? '';
}

// Replace the five settable values with a marker, collapse whitespace so
// cosmetic comment alignment does not count, and trim trailing space.
function normalize(text: string): string[] {
  return text
    .split('\n')
    .map((line) => {
      let out = line;
      for (const v of MASKABLE) {
        out = out.replace(new RegExp(`(\\b${v}: )"[^"]*"`), `$1"__SET__"`);
      }
      return out.replace(/[ \t]+/g, ' ').replace(/\s+$/u, '');
    })
    .filter((l, i, a) => !(l === '' && a[i - 1] === ''));
}

describe('root .gitlab-ci.yml vs contract §4.13.3', () => {
  it('is verbatim the contract block modulo the five PLAT-settable values', () => {
    const disk = readFileSync('.gitlab-ci.yml', 'utf8');
    const block = contractBlock();
    if (!block) {
      // no contract on this line: check the frozen shape instead
      for (const t of ['.ag-node', '.ag-playwright', '.ag-aws-remote', '.ag-evidence-release',
        'contract:ownership', 'contract:conformance', 'contract:ci-fragments']) {
        expect(disk).toContain(t);
      }
      expect(disk).toContain('merge_request_event');
      return;
    }
    expect(normalize(disk)).toEqual(normalize(block));
  });
});

describe('pinned values (PLAT-002)', () => {
  const disk = readFileSync('.gitlab-ci.yml', 'utf8');
  const vars = Object.fromEntries(
    MASKABLE.map((v) => [v, disk.match(new RegExp(`${v}: "([^"]*)"`))?.[1] ?? '']),
  );

  it('pins AG_NODE_IMAGE to a sha256 digest', () => {
    expect(vars.AG_NODE_IMAGE).toMatch(/^node:22-bookworm@sha256:[0-9a-f]{64}$/);
  });

  it('pins AG_PLAYWRIGHT_IMAGE to the installed @playwright/test version (§4.12)', () => {
    const installed: string = require('@playwright/test/package.json').version;
    expect(vars.AG_PLAYWRIGHT_IMAGE).toBe(`mcr.microsoft.com/playwright:v${installed}-noble`);
  });

  it('pins AG_NPM_VERSION to an exact version >= 11.5.1', () => {
    expect(vars.AG_NPM_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    const [maj, min, patch] = (vars.AG_NPM_VERSION ?? '0.0.0').split('.').map(Number);
    expect(
      (maj ?? 0) > 11 || ((maj ?? 0) === 11 && (min ?? 0) > 5) || ((maj ?? 0) === 11 && (min ?? 0) === 5 && (patch ?? 0) >= 1),
    ).toBe(true);
  });

  it('keeps AG_PAGES_BRANCH and AG_V4_DIST_TAG on pre-GA values', () => {
    expect(vars.AG_PAGES_BRANCH).toBe('release/4.x');
    expect(vars.AG_V4_DIST_TAG).toBe('latest');
  });
});
