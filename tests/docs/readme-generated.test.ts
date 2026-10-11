/* tests/docs/readme-generated.test.ts — REQ-PLAT-104 (REQ-FIN-43). README.md
   is generated from scripts/docs/readme.tmpl.md by scripts/docs/gen-readme.mjs:
   the committed README equals the rendered template, a hand edit (the seeded
   "498 certified") fails the check, the peer table comes from
   package.json peerDependenciesMeta, and the template carries no
   certification runbook, agent-directed instruction or font claim. */
import { describe, expect, it } from '@jest/globals';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkReadme, fillPeers, generate, main, peerRows } from '../../scripts/docs/gen-readme.mjs';
import { lintText } from '../../scripts/docs/lint-claims.mjs';
import { REGION_RE } from '../../scripts/docs/render-claims.mjs';

const root = join(__dirname, '..', '..');
const read = (rel: string) => readFileSync(join(root, rel), 'utf8');
const TEMPLATE = 'scripts/docs/readme.tmpl.md';

/** Copy just what gen-readme reads into a temp root. */
function fixtureRoot() {
  const dir = mkdtempSync(join(tmpdir(), 'readme-gen-'));
  for (const rel of [TEMPLATE, 'docs/quickstart/next.md', 'package.json', 'README.md']) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    cpSync(join(root, rel), join(dir, rel));
  }
  return dir;
}

describe('README.md is generated from the template', () => {
  it('README.md equals the rendered template (run node scripts/docs/gen-readme.mjs)', () => {
    const { ok, expected, actual } = checkReadme(root);
    expect(actual).toBe(expected);
    expect(ok).toBe(true);
  });

  it('a seeded hand edit ("498 certified") fails the check', () => {
    const dir = fixtureRoot();
    expect(main(['--check'], dir)).toBe(0);
    const readme = readFileSync(join(dir, 'README.md'), 'utf8');
    writeFileSync(join(dir, 'README.md'), readme.replace('## Surfaces', 'All 498 certified components ship today.\n\n## Surfaces'));
    expect(checkReadme(dir).ok).toBe(false);
    expect(main(['--check'], dir)).toBe(1);
  });

  it('a template edit without regenerating README fails the check', () => {
    const dir = fixtureRoot();
    const tmpl = readFileSync(join(dir, TEMPLATE), 'utf8');
    writeFileSync(join(dir, TEMPLATE), tmpl.replace('## Links', '## Links\n\n- Extra link'));
    expect(main(['--check'], dir)).toBe(1);
  });

  it('every number in README.md is a claim region (lint-claims clean) and claim regions are paired', () => {
    const readme = read('README.md');
    expect(lintText(readme, { file: 'README.md' })).toEqual([]);
    expect([...readme.matchAll(REGION_RE)].length).toBeGreaterThanOrEqual(4);
  });
});

describe('peer table is generated from peerDependenciesMeta', () => {
  it('README rows match package.json exactly', () => {
    const pkg = JSON.parse(read('package.json'));
    const region = read('README.md').match(/<!-- generated:peers -->([\s\S]*?)<!-- \/generated:peers -->/)?.[1] ?? '';
    const rows = region.split('\n').filter((l) => /^\| `/.test(l));
    expect(rows).toEqual(peerRows(pkg).map((r: { name: string; range: string; optional: boolean }) => `| \`${r.name}\` | \`${r.range}\` | ${r.optional ? 'optional' : 'required'} |`));
    expect(rows.length).toBe(Object.keys(pkg.peerDependencies).length);
  });

  it('flipping a peer to optional changes the generated row', () => {
    const tmpl = '<!-- generated:peers -->\n<!-- /generated:peers -->';
    const out = fillPeers(tmpl, { peerDependencies: { react: '^19.0.0', three: '>=0.170.0' }, peerDependenciesMeta: { three: { optional: true } } });
    expect(out).toContain('| `react` | `^19.0.0` | required |');
    expect(out).toContain('| `three` | `>=0.170.0` | optional |');
    expect(() => fillPeers('no markers', {})).toThrow(/generated:peers/);
  });
});

describe('template content rules (REQ-PLAT-104)', () => {
  const tmpl = read(TEMPLATE);
  it('has the pitch, generated quick start, surfaces, CLI and registry commands, and links', () => {
    for (const h of ['## Quick start', '## Surfaces', '## CLI and registry', '## Peer dependencies', '## Links']) expect(tmpl).toContain(h);
    expect(tmpl).toMatch(/<!-- generated:quickstart -->\s*<!-- \/generated:quickstart -->/);
    expect(tmpl).toMatch(/npx @auraglass\/cli add /);
    expect(tmpl).toMatch(/shadcn@latest add https:\/\/\S+\/r\/[\w-]+\.json/);
  });
  it('has no certification runbook, no agent-directed instruction, no font claim, no hand-written peer matrix', () => {
    expect(tmpl).not.toMatch(/certif/i);
    expect(tmpl).not.toMatch(/CAPTURE_ALL_VISUALS|playwright test|audit:visual/);
    expect(tmpl).not.toMatch(/\b(AI|coding) agents?\b|\bagents? (must|should)\b/i);
    expect(tmpl).not.toMatch(/\bfont|typeface|Aeonik/i);
    expect(tmpl).not.toMatch(/^\| `(react|react-dom|three|motion|tailwindcss)` \|/m);
    expect(tmpl).not.toMatch(/\bGlass[A-Z]\w+/);
  });
  it('renders without a claims file as pending (never an invented number)', () => {
    const dir = fixtureRoot();
    const out = generate(dir);
    for (const m of out.matchAll(REGION_RE)) expect(m[2]).toBe('pending');
  });
});
