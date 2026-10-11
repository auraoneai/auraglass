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
