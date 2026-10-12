/* @jest-environment node */
/* REQ-PLAT-53: the hosted-runtime advisory draft carries every element the PRD
   lists — derived affected versions, scope, the three issues with file
   references, mitigations, a CVSS 3.1 vector and the bounded consumer grep. */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';

const ROOT = process.cwd();
const text = readFileSync(join(ROOT, 'docs/security/advisories/2026-10-hosted-runtime.md'), 'utf8');
const section = (h: string) => {
  const i = text.indexOf(`## ${h}`);
  expect(i).toBeGreaterThan(-1);
  const j = text.indexOf('\n## ', i + 3);
  return text.slice(i, j < 0 ? undefined : j);
};

describe('hosted-runtime advisory draft (REQ-PLAT-53)', () => {
  it('derives the affected versions from git log and npm view', () => {
    const s = section('Affected versions');
    expect(s).toContain("git log --diff-filter=A --format='%h %ad %s' --date=iso -- Dockerfile server/index.ts");
    expect(s).toContain('npm view aura-glass time');
    expect(s).toMatch(/1\.0\.0 through 4\.1\.0/);
  });
  it('names the three issues, each with file:line references to files that exist', () => {
    const s = section('Issues');
    const items = s.split(/\n(?=\d\. \*\*)/).filter((b) => /^\d\. \*\*/.test(b));
    expect(items.map((b) => b.match(/^\d\. \*\*([^*]+)\*\*/)![1])).toEqual(
      ['Default JWT secret.', 'Missing authorization.', 'Open WebSocket rooms.']);
    for (const b of items) {
      const refs = [...b.matchAll(/`((?:server|src)\/[\w./-]+|Dockerfile|\.env\.example):(\d+)(?:-\d+)?`/g)];
      expect(refs.length).toBeGreaterThan(0);
      for (const [, file] of refs) expect([file, existsSync(join(ROOT, file!))]).toEqual([file, true]);
    }
  });
  it('proposes a well-formed CVSS 3.1 vector', () => {
    expect(section('Proposed CVSS 3.1')).toMatch(
      /`CVSS:3\.1\/AV:[NALP]\/AC:[LH]\/PR:[NLH]\/UI:[NR]\/S:[UC]\/C:[NLH]\/I:[NLH]\/A:[NLH]`/);
  });
  it('lists mitigations and the bounded consumer grep as counts and files only', () => {
    expect(section('Mitigations (deployer\'s action)')).toMatch(/at least 32 bytes/);
    const g = section('AuraOne consumer grep (bounded)');
    expect(g).toMatch(/\*\*\d+ hits?\*\*/);
    expect(g).toMatch(/\*\*\d+ files?\*\*/);
  });
  it('leaves publishing to the owner', () => {
    expect(section('Owner action required')).toContain('Agents must not');
  });
});
