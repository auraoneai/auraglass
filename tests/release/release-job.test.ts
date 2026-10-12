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
  it('uses the generated release-notes.md as the Release body (REQ-PLAT-16)', () => {
    const notesStep = (j.script as string[]).find((l) => l.includes('scripts/release/release-notes.mjs --tag'))!;
    expect(notesStep).toContain('--out "$AURAGLASS_EVIDENCE_DIR/release-notes.md"');
    expect(j.release.description).toBe('./.artifacts/plat/plat-release-notes/release-notes.md');
  });
  it('links the notes file, dist-maps and job evidence as assets', () => {
    const links = yaml.stringify(j.release.assets.links);
    expect(links).toContain('release-notes.md');
    expect(links).toContain('dist-maps.tgz');
    expect(links).toContain('.artifacts');
  });
});

describe('GitHub Release operator step (REQ-PLAT-16)', () => {
  const doc = readFileSync('docs/release-rollback-deprecation.md', 'utf8');
  it('documents gh release create <tag> --notes-file release-notes.md with the dist-maps.tgz asset', () => {
    expect(doc).toContain('gh release create <tag> --notes-file release-notes.md dist-maps.tgz');
  });
  it('names the job each asset comes from (dist-maps.tgz is the plat:package:pack artifact)', () => {
    expect(doc).toMatch(/`dist-maps\.tgz` is an artifact of\s+`plat:package:pack`/);
    expect(doc).toMatch(/`release-notes\.md` is an artifact of `plat:release:notes`/);
    expect(doc).not.toMatch(/`dist-maps\.tgz` as artifacts of that job/);
  });
});
