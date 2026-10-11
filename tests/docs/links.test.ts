/**
 * @jest-environment node
 */
/* tests/docs/links.test.ts — REQ-PLAT-102 (PLAT-383 / DX-109). The link
   checker is case-sensitive on every OS (fs.realpathSync.native) and
   route-aware: absolute links on docs pages must be docs routes (static
   export or source-derived), redirect sources or public files; relative links
   on docs pages must land on another page. Seeded fixtures: wrong-case file,
   wrong-case route, missing route, non-page relative link, bad anchor, a
   redirect, a public file, and out/ mode. The repo case runs the checker over
   docs + apps/docs with the PRD-F §4.3 rule 3 expiring baseline
   scripts/integration/baselines/docs-links.json. */
import { describe, expect, it, beforeAll } from '@jest/globals';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { anchorsOf, checkLinks, discoverPages, existsExactCase, extractLinks, main, routesFromOut } from '../../scripts/docs/verify-markdown-links.js';
import { applyBaseline, loadBaseline, packageVersion } from '../../scripts/docs/lib/baseline.mjs';

const REPO = join(__dirname, '..', '..');

function tree(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'ag-links-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '5.0.0-alpha.0' }));
  for (const [p, text] of Object.entries(files)) {
    mkdirSync(join(root, p, '..'), { recursive: true });
    writeFileSync(join(root, p), text);
  }
  return root;
}

describe('parsing', () => {
  it('extracts inline, image and reference links but not code', () => {
    const src = 'a [x](./a.md) ![i](/img.png)\n`[no](./code.md)`\n```md\n[no](./fence.md)\n```\n[ref]: ./ref.md "t"\n[t](<./sp ace.md> "title")';
    expect(extractLinks(src).map((l) => `${l.line}:${l.href}`)).toEqual(['1:./a.md', '1:/img.png', '6:./ref.md', '7:./sp ace.md']);
  });
  it('slugs headings like GitHub, with duplicate suffixes and explicit ids', () => {
    expect([...anchorsOf('# Hello World!\n## Hello World\n<a id="x-y"></a>')]).toEqual(['hello-world', 'hello-world-1', 'x-y']);
  });
});

describe('case-sensitive resolution', () => {
  it('existsExactCase rejects a wrong-case spelling of an existing file', () => {
    const root = tree({ 'docs/Guide.md': '# g' });
    expect(existsExactCase(join(root, 'docs/Guide.md'))).toBe(true);
    expect(existsExactCase(join(root, 'docs/guide.md'))).toBe(false);
    expect(existsExactCase(join(root, 'Docs/Guide.md'))).toBe(false);
  });
});

describe('route-aware checks (source mode)', () => {
  let root: string;
  beforeAll(() => {
    root = tree({
      'apps/docs/content/plat/intro.mdx': [
        '# Intro',
        '[ok route](/plat/api)',
        '[ok guide](/guides/vite#setup)',
        '[missing route](/plat/registry)',
        '[wrong-case route](/Plat/api)',
        '[redirected](/v4/old)',
        '[public file](/components/button.md)',
        '[relative page](./api.mdx)',
        '[relative non-page](../../../../scripts/x.mjs)',
        '[wrong-case file](./API.mdx)',
        '[bad anchor](/guides/vite#nope)',
        '[self anchor](#intro)',
        '[ext](https://example.com)',
      ].join('\n'),
      'apps/docs/content/plat/api.mdx': '# API\n',
      'docs/guides/vite.md': '# Vite\n## Setup\n',
      'scripts/x.mjs': '',
      'apps/docs/redirects.json': JSON.stringify({ redirects: [{ source: '/v4/:path*' }, { source: '/v4/old', destination: '/', permanent: true }] }),
      'apps/docs/public/components/button.md': '# Button',
      'docs/release/notes.md': '[ok](../guides/vite.md#setup)\n[root ok](/docs/guides/vite.md)\n[gone](./Missing.md)\n[case](../Guides/vite.md)',
      'README.md': '[ok](./docs/release/notes.md)\n[bad](./docs/release/Notes.md)',
    });
  });

  it('derives routes from the docs-app source roots', () => {
    expect([...discoverPages(root).byRoute.keys()].sort()).toEqual(['/guides/vite', '/plat/api', '/plat/intro']);
  });

  it('reports exactly the seeded broken links', () => {
    const { findings, mode } = checkLinks({ root });
    expect(mode).toBe('source');
    expect(findings.map((f) => `${f.file}:${f.line} ${f.href} | ${f.message.split(':')[0]}`)).toEqual([
      'apps/docs/content/plat/intro.mdx:4 /plat/registry | no docs route /plat/registry',
      'apps/docs/content/plat/intro.mdx:5 /Plat/api | route case mismatch',
      'apps/docs/content/plat/intro.mdx:9 ../../../../scripts/x.mjs | relative link to scripts/x.mjs, which is not a docs page (dead href on the site)',
      'apps/docs/content/plat/intro.mdx:10 ./API.mdx | case mismatch',
      'apps/docs/content/plat/intro.mdx:11 /guides/vite#nope | anchor #nope not found on route /guides/vite',
      'README.md:2 ./docs/release/Notes.md | case mismatch',
      'docs/release/notes.md:3 ./Missing.md | target does not exist',
      'docs/release/notes.md:4 ../Guides/vite.md | case mismatch',
    ]);
  });

  it('main exits 1 on findings and 0 on a clean tree', () => {
    expect(main([], root)).toBe(1);
    expect(main([], tree({ 'docs/guides/a.md': '# A\n[b](./b.md)', 'docs/guides/b.md': '# B\n[a](/guides/a)' }))).toBe(0);
  });

  it('an unexpired baseline row excuses only its file; a stale row fails', () => {
    const r = tree({
      'docs/guides/a.md': '[x](/nope)',
      'docs/guides/b.md': '[y](/nope)',
      'scripts/integration/baselines/docs-links.json': JSON.stringify([
        { file: 'docs/guides/a.md', owner: 'PLAT', reqFin: 'REQ-FIN-43', expires: 'RC-1' },
        { file: 'docs/guides/gone.md', owner: 'PLAT', reqFin: 'REQ-FIN-43', expires: 'RC-1' },
      ]),
    });
    const { findings } = checkLinks({ root: r });
    const { rows } = loadBaseline(r, 'docs-links');
    const res = applyBaseline(findings, rows, '5.0.0-alpha.0');
    expect(res.excused.map((f) => f.file)).toEqual(['docs/guides/a.md']);
    expect(res.blocking.map((f) => f.file)).toEqual(['docs/guides/b.md']);
    expect(res.errors).toEqual(['stale baseline row docs/guides/gone.md: no finding left — delete the row']);
    expect(applyBaseline(findings, rows, '5.0.0-rc.1').errors.filter((e) => e.startsWith('expired')).length).toBe(2);
  });
});

describe('static export mode (--out)', () => {
  it('uses out/<route>/index.html as the route set, so an unexported route fails', () => {
    const root = tree({
      'apps/docs/content/plat/intro.mdx': '[api](/plat/api)\n[comp](/components/button#props)\n[nope](/components/nothing)\n[asset](/r/registry.json)',
      'apps/docs/content/plat/api.mdx': '# API',
      'out/index.html': '<html></html>',
      'out/plat/intro/index.html': '<html></html>',
      'out/plat/api/index.html': '<html></html>',
      'out/components/button/index.html': '<h2 id="props">Props</h2>',
      'out/r/registry.json': '{}',
    });
    expect([...routesFromOut(join(root, 'out')).keys()].sort()).toEqual(['/', '/components/button', '/plat/api', '/plat/intro']);
    const { findings, mode } = checkLinks({ root, outDir: join(root, 'out') });
    expect(mode).toBe('out');
    expect(findings.map((f) => `${f.line} ${f.message}`)).toEqual(['3 no docs route /components/nothing in the static export']);
  });
});

describe('repository', () => {
  it('has 0 broken links over docs + apps/docs outside unexpired baseline rows, and no stale or expired row', () => {
    const { findings } = checkLinks({ root: REPO });
    const { rows } = loadBaseline(REPO, 'docs-links');
    const { blocking, errors } = applyBaseline(findings, rows, packageVersion(REPO));
    expect(errors).toEqual([]);
    expect(blocking.map((f) => `${f.file}:${f.line} (${f.href}) ${f.message}`)).toEqual([]);
  });
});
