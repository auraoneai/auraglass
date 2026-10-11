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

// Recorded contract C-items (docs/release/decisions/gitlab-ci-verification.md
// §"Contract C-items"): the only permitted deviations from the v1.1 block,
// applied to the normalized contract lines before comparison. Each is a
// line replacement (`from` → `to[]`) or an insertion after an anchor line
// (`after`, scoped to a job via `within`).
type Delta =
  | { item: string; from: string; to: string[] }
  | { item: string; within: string; after: string; insert: string[] };
const C_ITEMS: Delta[] = [
  {
    item: 'stages package before certify',
    from: 'stages: [contract, build, test, certify, package, deploy, publish]',
    to: [
      '# package precedes certify: qual:certify:* need plat:package:pack (FIN-B fix; recorded for contract v1.2-final).',
      'stages: [contract, build, test, package, certify, deploy, publish]',
    ],
  },
  {
    item: 'R1 workflow prefixes',
    from: ' - if: $CI_COMMIT_BRANCH == "release/4.x"',
    to: [' - if: $CI_COMMIT_BRANCH == "release/4.x" || $CI_COMMIT_BRANCH == "release/4.1.x"'],
  },
  {
    item: 'R1 workflow prefixes',
    from: ' - if: $CI_COMMIT_BRANCH =~ /^4x-(plat|mat|cmp|surf|qual)\\// || $CI_COMMIT_BRANCH =~ /^sync\\/fragments-codemods-/',
    to: [' - if: $CI_COMMIT_BRANCH =~ /^4x-(plat|mat|cmp|surf|qual|fin)\\// || $CI_COMMIT_BRANCH =~ /^4x11-(plat|mat|cmp|surf|qual|fin)\\// || $CI_COMMIT_BRANCH =~ /^sync\\/fragments-codemods-/'],
  },
  {
    item: 'R1 workflow prefixes',
    from: ' - if: $CI_COMMIT_BRANCH =~ /^next-(plat|mat|cmp|surf|qual)\\// || $CI_COMMIT_BRANCH =~ /^sync\\/fragments-deprecations-/ || $CI_COMMIT_BRANCH =~ /^contract\\//',
    to: [' - if: $CI_COMMIT_BRANCH =~ /^next-(plat|mat|cmp|surf|qual|fin)\\// || $CI_COMMIT_BRANCH =~ /^sync\\/fragments-deprecations-/ || $CI_COMMIT_BRANCH =~ /^contract\\// || $CI_COMMIT_BRANCH =~ /^sync\\//'],
  },
  {
    item: 'contract:ci-fragments fetches its base ref',
    within: 'contract:ci-fragments:',
    after: ' stage: contract',
    insert: [' variables: { GIT_DEPTH: "0" }'],
  },
  {
    item: 'contract:ci-fragments fetches its base ref',
    within: 'contract:ci-fragments:',
    after: ' script:',
    insert: [
      ' - BASE=$([ "$AG_LINE" = "4x" ] && echo release/4.x || echo next)',
      ' - git fetch --no-tags origin "+refs/heads/$BASE:refs/remotes/origin/$BASE"',
    ],
  },
];

function applyCItems(lines: string[]): string[] {
  let out = [...lines];
  for (const d of C_ITEMS) {
    if ('from' in d) {
      const i = out.indexOf(d.from);
      expect({ item: d.item, found: i >= 0 }).toEqual({ item: d.item, found: true });
      out.splice(i, 1, ...d.to);
    } else {
      const start = out.indexOf(d.within);
      expect({ item: d.item, found: start >= 0 }).toEqual({ item: d.item, found: true });
      const rel = out.slice(start).indexOf(d.after);
      expect({ item: d.item, anchor: rel >= 0 }).toEqual({ item: d.item, anchor: true });
      out.splice(start + rel + 1, 0, ...d.insert);
    }
  }
  return out;
}

describe('root .gitlab-ci.yml vs contract §4.13.3', () => {
  it('is verbatim the contract block modulo the five PLAT-settable values and recorded C-items', () => {
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
    expect(normalize(disk)).toEqual(applyCItems(normalize(block)));
  });
  it('every applied C-item is recorded in the decision record', () => {
    const rec = readFileSync('docs/release/decisions/gitlab-ci-verification.md', 'utf8');
    for (const item of new Set(C_ITEMS.map((d) => d.item))) {
      expect(rec).toContain(`contract C-item: ${item}`);
    }
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
