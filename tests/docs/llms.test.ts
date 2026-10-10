/**
 * @jest-environment node
 */
/* tests/docs/llms.test.ts — REQ-PLAT-106 (REQ-FIN-44). llms.txt is generated
   (scripts/docs/gen-llms.mjs) from llms.txt.tmpl, package.json, the exports
   manifest and the component metas; it is ≤12 KB, names the package.json
   version, recommends no Glass* names, and ships in the aura-glass tarball.
   llms-full.txt is Pages-only. */
import { describe, expect, it, beforeAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FULL_MAX, LLMS_MAX, generate, verify } from '../../scripts/docs/gen-llms.mjs';
import { loadMetas, loadSubpaths, slugOf } from '../../scripts/docs/agent-data.mjs';
import { checkComms, versionsSection } from '../../scripts/release/verify-release-comms.mjs';

const root = join(__dirname, '..', '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tracked = readFileSync(join(root, 'llms.txt'), 'utf8');

let out: { llms: string; full: string; version: string };
let metas: Array<{ meta: { name: string; entry: string; flagship?: number } }>;

beforeAll(async () => {
  out = await generate(root);
  metas = await loadMetas(root);
}, 60_000);

describe('llms.txt', () => {
  it('the tracked file is exactly the generator output (a version or meta change without regeneration fails)', () => {
    expect(tracked).toBe(out.llms);
  });

  it('carries the package.json version in the H1 and fits in 12 KB', () => {
    expect(tracked.split('\n')[0]).toBe(`# AuraGlass ${pkg.version}`);
    expect(Buffer.byteLength(tracked)).toBeLessThanOrEqual(LLMS_MAX);
  });

  it('names no Glass* symbol anywhere', () => {
    expect(tracked.split('\n').filter((l) => /\bGlass[A-Z]\w*/.test(l))).toEqual([]);
  });

  it('has the REQ sections in order: blockquote summary, Install, Subpaths, Components, Do not, Versions', () => {
    expect(tracked.split('\n')[2]).toMatch(/^> /);
    const h2 = tracked.split('\n').filter((l) => l.startsWith('## ')).map((l) => l.slice(3));
    expect(h2).toEqual(['Install', 'Subpaths', 'Components', 'Do not', 'Versions', 'Optional']);
  });

  it('lists every public subpath from the exports manifest', () => {
    for (const { subpath } of loadSubpaths(root)) {
      if (subpath === './package.json') continue;
      const spec = subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.slice(2)}`;
      expect(tracked).toContain(`- \`${spec}\``);
    }
  });

  it('has one line per flagship meta linking /components/<slug>.md, in flagship order', () => {
    const flagships = metas.filter(({ meta }) => meta.flagship != null && !/^(Liquid)?Glass[A-Z]/.test(meta.name));
    expect(flagships.length).toBeGreaterThan(0);
    const lines = tracked.split('\n').filter((l) => /^- \[[A-Za-z]+\]\(.*\/components\/[a-z0-9-]+\.md\)/.test(l));
    expect(lines).toHaveLength(flagships.length);
    for (const { meta } of flagships) {
      expect(lines.filter((l) => l.startsWith(`- [${meta.name}](`) && l.includes(`/components/${slugOf(meta.name)}.md)`))).toHaveLength(1);
    }
    const order = lines.map((l) => metas.find(({ meta }) => l.startsWith(`- [${meta.name}](`))!.meta.flagship!);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('has the do-not list (Glass* names, inline optics, !important, data-ag-part styling)', () => {
    const section = tracked.slice(tracked.indexOf('## Do not'), tracked.indexOf('## Versions'));
    expect(section).toContain('`Glass*`');
    expect(section).toMatch(/inline optics/);
    expect(section).toContain('`!important`');
    expect(section).toContain('data-ag-part');
  });

  it('has a Versions section that verify-release-comms accepts for this version', () => {
    expect(versionsSection(tracked)).toContain(pkg.version);
    const { errors } = checkComms({ readme: '<!-- AG-RELEASE-BANNER -->v5<!-- /AG-RELEASE-BANNER -->', llms: tracked, pkgVersion: pkg.version });
    expect(errors).toEqual([]);
  });

  it('ships in the aura-glass tarball; llms-full.txt and the template do not', () => {
    const json = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
    // npm ≤11 prints an array of pack results; npm 12 an object keyed by package name.
    const packed = Array.isArray(json) ? json[0] : json[pkg.name];
    const files = (packed.files as Array<{ path: string }>).map((f) => f.path);
    expect(files).toContain('llms.txt');
    expect(files).not.toContain('llms-full.txt');
    expect(files).not.toContain('llms.txt.tmpl');
  }, 120_000);

  it('verify() rejects an oversized file, a version mismatch and a Glass* recommendation', () => {
    expect(verify(out)).toEqual([]);
    expect(verify({ ...out, llms: out.llms + 'x'.repeat(LLMS_MAX) }).join()).toMatch(/> 12288B/);
    expect(verify({ ...out, version: '9.9.9' }).join()).toMatch(/version 9\.9\.9/);
    expect(verify({ ...out, llms: `${out.llms}\nPrefer GlassCard for panels.\n` }).join()).toMatch(/GlassCard/);
  });
});

describe('llms-full.txt (Pages only)', () => {
  it('is ≤400 KB and carries llms.txt, every component section and the guides', () => {
    expect(Buffer.byteLength(out.full)).toBeLessThanOrEqual(FULL_MAX);
    expect(out.full.startsWith(out.llms.trimEnd())).toBe(true);
    for (const { meta } of metas) expect(out.full).toContain(`### ${meta.name}\n`);
    expect(out.full).toContain('<!-- docs/quickstart/next.md -->');
  });

  it('is not tracked at the repo root (it is written to apps/docs/public for the Pages build)', () => {
    const files = execFileSync('git', ['ls-files', 'llms-full.txt', 'apps/docs/public/llms-full.txt'], { cwd: root, encoding: 'utf8' }).trim();
    expect(files).toBe('');
  });
});
