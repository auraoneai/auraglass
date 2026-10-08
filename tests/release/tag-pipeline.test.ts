/* @jest-environment node */
// PLAT-038..041: the tag pipeline guards — dry-run + verdict + guard script.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import yaml from 'yaml';
import { execFileSync } from 'node:child_process';

describe('tag-pipeline guards', () => {
  it('plat:package:pack runs dry-run.mjs --tag on release scope', () => {
    const doc = yaml.parse(readFileSync('ci/plat.gitlab-ci.yml', 'utf8'));
    const s = yaml.stringify(doc['plat:package:pack'].script);
    expect(s).toContain('$AG_SCOPE" = "release"');
    expect(s).toContain('dry-run.mjs --tag "$CI_COMMIT_TAG"');
  });
  it('dry-run checks version, changelog, ancestry, classify-change, ledger', () => {
    const src = readFileSync('scripts/release/dry-run.mjs', 'utf8');
    for (const k of ['package.json', 'CHANGELOG', 'merge-base --is-ancestor'.split(' ')[0], 'classify-change', 'release-ledger']) {
      expect(src).toContain(k);
    }
  });
  it('verify-release-verdict fails on missing verdict for a v5 GA tag', () => {
    try {
      execFileSync('node', ['scripts/release/verify-release-verdict.mjs', '--tag', 'v5.0.0', '--line', '5x'],
        { encoding: 'utf8' });
      throw new Error('expected non-zero exit');
    } catch (e: any) {
      expect(e.status).toBe(1);
      expect(`${e.stdout}${e.stderr}`).toContain('missing');
    }
  });
  it('verify-release-verdict is advisory for pre-release tags', () => {
    const out = execFileSync('node', ['scripts/release/verify-release-verdict.mjs', '--tag', 'v5.0.0-alpha.9', '--line', '5x'],
      { encoding: 'utf8' });
    expect(out).toContain('advisory');
  });
});
