/* @jest-environment node */
// PLAT-047/048: plat:release:notes is the GitLab Release producer.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import yaml from 'yaml';

const doc = yaml.parse(readFileSync('ci/plat.gitlab-ci.yml', 'utf8'));
const j = doc['plat:release:notes'];

describe('plat:release:notes', () => {
  it('is a publish-stage job on release scope', () => {
    expect(j.stage).toBe('publish');
    expect(yaml.stringify(j.rules)).toContain('release');
  });
  it('creates the GitLab Release (release: keyword, CI_JOB_TOKEN implicit)', () => {
    expect(j.release).toBeDefined();
    expect(j.release.tag_name).toBe('$CI_COMMIT_TAG');
    expect(j.release.name).toBeTruthy();
  });
  it('links the notes file, dist-maps and job evidence as assets', () => {
    const links = yaml.stringify(j.release.assets.links);
    expect(links).toContain('release-notes.md');
    expect(links).toContain('dist-maps.tgz');
    expect(links).toContain('.artifacts');
  });
});

/* REQ-PLAT-16: the dist-maps.tgz asset link resolves only if plat:package:pack
   writes it and plat:release:notes carries pack's artifacts; the notes come
   from the tag via --tag/--line; the operator GitHub step is in the runbook. */
describe('REQ-PLAT-16 release assets', () => {
  const pack = doc['plat:package:pack'];
  const script = (pack.script as string[]).join('\n');
  it('plat:package:pack writes .artifacts/plat/dist-maps.tgz and fails without it', () => {
    expect(script).toMatch(/tar -czf \.artifacts\/plat\/dist-maps\.tgz/);
    expect(script).toContain('test -f .artifacts/plat/dist-maps.tgz');
    expect(pack.artifacts.paths).toContain('.artifacts/plat/');
  });
  it('plat:release:notes needs pack artifacts so the dist-maps link resolves on its own job', () => {
    expect(j.needs).toEqual(expect.arrayContaining([
      expect.objectContaining({ job: 'plat:package:pack', artifacts: true }),
    ]));
    const link = (j.release.assets.links as Array<{ name: string; url: string }>)
      .find((l) => l.name === 'dist-maps.tgz');
    expect(link?.url).toBe('$CI_JOB_URL/artifacts/file/.artifacts/plat/dist-maps.tgz');
  });
  it('plat:release:notes renders the notes from the tag on the job line', () => {
    expect((j.script as string[]).join('\n')).toContain(
      'node scripts/release/release-notes.mjs --tag "$CI_COMMIT_TAG" --line "$AG_LINE" --out .artifacts/plat/release-notes.md');
  });
  it('the rollback/deprecation runbook carries the operator gh release create step', () => {
    const runbook = readFileSync('docs/release-rollback-deprecation.md', 'utf8');
    expect(runbook).toMatch(/gh release create v4\.x\.y \\\n\s+--notes-file \.artifacts\/plat\/release-notes\.md/);
    expect(runbook).toContain('.artifacts/plat/dist-maps.tgz');
  });
});
