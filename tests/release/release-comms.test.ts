/* REQ-PLAT-34: exact dist-tag rows in README banner + llms.txt compared to
   mocked npm dist-tags; mismatch fails. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ROOT = process.cwd();
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('${ROOT}/scripts/release/verify-release-comms.mjs'); ${body}`],
  { cwd: ROOT, encoding: 'utf8' });

const README = `<!-- AG-RELEASE-BANNER -->
> banner text v5
<!-- dist-tags: latest=4.1.1 next=5.0.0-alpha.0 v4-lts=none -->
<!-- /AG-RELEASE-BANNER -->`;
const LLMS = `## Versions
- \`5.x\` dev line
<!-- dist-tags: latest=4.1.1 next=5.0.0-alpha.0 v4-lts=none -->
## Next
`;

describe('verify-release-comms named tags (REQ-PLAT-34)', () => {
  it('fails when the banner says latest 4.1.1 but npm has 4.1.0', () => {
    const out = EVAL(`const r = m.checkComms({ readme: ${JSON.stringify(README)},
      llms: ${JSON.stringify(LLMS)}, pkgVersion: '5.0.0-alpha.0',
      distTags: { latest: '4.1.0', next: '5.0.0-alpha.0' } });
      console.log(JSON.stringify(r.errors))`);
    expect(JSON.parse(out).join()).toContain('latest');
  });
  it('passes when docs and npm agree (latest=4.1.1 case)', () => {
    const out = EVAL(`const r = m.checkComms({ readme: ${JSON.stringify(README)},
      llms: ${JSON.stringify(LLMS)}, pkgVersion: '5.0.0-alpha.0',
      distTags: { latest: '4.1.1', next: '5.0.0-alpha.0' } });
      console.log(JSON.stringify(r.errors))`);
    expect(JSON.parse(out)).toEqual([]);
  });
  it('fails when docs declare none but the tag exists on npm', () => {
    const out = EVAL(`const r = m.checkComms({ readme: ${JSON.stringify(README)},
      llms: ${JSON.stringify(LLMS)}, pkgVersion: '5.0.0-alpha.0',
      distTags: { latest: '4.1.1', next: '5.0.0-alpha.0', 'v4-lts': '4.1.1' } });
      console.log(JSON.stringify(r.errors))`);
    expect(JSON.parse(out).join()).toContain('v4-lts');
  });
  it('fails when README and llms.txt disagree', () => {
    const out = EVAL(`const r = m.checkComms({ readme: ${JSON.stringify(README)},
      llms: '## Versions\\n<!-- dist-tags: latest=9.9.9 -->',
      pkgVersion: '5.0.0-alpha.0', distTags: { latest: '4.1.1' } });
      console.log(JSON.stringify(r.errors))`);
    expect(JSON.parse(out).length).toBeGreaterThan(0);
  });
  it('fails when neither doc names any dist-tag', () => {
    const out = EVAL(`const r = m.checkComms({ readme: '<!-- AG-RELEASE-BANNER -->text<!-- /AG-RELEASE-BANNER -->',
      llms: '## Versions\\nnone', pkgVersion: '5.0.0-alpha.0',
      distTags: { latest: '4.1.1' } });
      console.log(JSON.stringify(r.errors))`);
    expect(JSON.parse(out).join()).toContain('dist-tag');
  });
  it('parseTagRows reads banner rows and the inline dist-tags comment', () => {
    const out = EVAL(`console.log(JSON.stringify({ a: m.parseTagRows(${JSON.stringify(README)}),
      b: m.parseTagRows(${JSON.stringify(LLMS)}) }))`);
    const r = JSON.parse(out);
    expect(r.a.latest).toBe('4.1.1');
    expect(r.b['v4-lts']).toBe('none');
  });

  it('visible list rows parse the same as inline rows', () => {
    const out = EVAL(`console.log(JSON.stringify(m.parseTagRows('> - \`latest\`: 4.1.0\\n> - \`next\`: none\\n- \`v4-lts\`: 4.9.0')))`);
    expect(JSON.parse(out)).toEqual({ latest: '4.1.0', next: 'none', 'v4-lts': '4.9.0' });
  });
  it('a version named by a tag row is not an "exact version" mismatch, any other one is', () => {
    const readme = '<!-- AG-RELEASE-BANNER -->\n> v5 train\n> - `latest`: 4.1.0\n> also 4.0.3\n<!-- /AG-RELEASE-BANNER -->';
    const out = EVAL(`const r = m.checkComms({ readme: ${JSON.stringify(readme)}, llms: ${JSON.stringify(LLMS)},
      pkgVersion: '5.0.0-alpha.0' }); console.log(JSON.stringify(r.errors))`);
    const errors = JSON.parse(out).join('\n');
    expect(errors).toContain('exact version 4.0.3');
    expect(errors).not.toContain('exact version 4.1.0');
  });
  it('normalizeDistTags unwraps the one-element array some npm versions print, rejects junk', () => {
    const out = EVAL(`const r = [];
      r.push(m.normalizeDistTags([{ latest: '4.1.0' }]).latest);
      r.push(m.normalizeDistTags({ latest: '4.1.0', next: '5.0.0-alpha.1' }).next);
      for (const bad of [[], [{}, {}], {}, null, { error: 'x' }]) {
        try { m.normalizeDistTags(bad); r.push('accepted'); } catch { r.push('rejected'); }
      }
      console.log(JSON.stringify(r))`);
    expect(JSON.parse(out)).toEqual(['4.1.0', '5.0.0-alpha.1', 'rejected', 'rejected', 'rejected', 'rejected', 'rejected']);
  });
  it('the committed README banner and llms.txt name latest, next and v4-lts and agree', () => {
    const out = EVAL(`import('node:fs').then(({ readFileSync }) => {
      const readme = readFileSync('README.md', 'utf8'); const llms = readFileSync('llms.txt', 'utf8');
      const b = m.parseTagRows(m.bannerOf(readme) ?? ''); const l = m.parseTagRows(m.versionsSection(llms) ?? '');
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
      console.log(JSON.stringify({ b, l, errors: m.checkComms({ readme, llms, pkgVersion: pkg.version }).errors }));
    })`);
    const r = JSON.parse(out);
    for (const tag of ['latest', 'next', 'v4-lts']) expect(Object.keys(r.b)).toContain(tag);
    expect(r.l).toEqual(r.b);
    expect(r.errors).toEqual([]);
  });
  it('fails when the README banner marker is absent', () => {
    const out = EVAL(`console.log(JSON.stringify(m.checkComms({ readme: '# x', llms: ${JSON.stringify(LLMS)},
      pkgVersion: '5.0.0-alpha.0' }).errors))`);
    expect(JSON.parse(out).join()).toMatch(/AG-RELEASE-BANNER/);
  });
  it('flags a next dist-tag on the wrong major', () => {
    const out = EVAL(`console.log(JSON.stringify(m.checkComms({ readme: ${JSON.stringify(README)},
      llms: ${JSON.stringify(LLMS)}, pkgVersion: '5.0.0-alpha.1',
      distTags: { latest: '4.1.1', next: '4.9.9' } }).errors))`);
    expect(JSON.parse(out).join()).toMatch(/next dist-tag/);
  });
});

describe('LTS policy clauses (REQ-PLAT-34)', () => {
  const lts = readFileSync('docs/release/lts-policy.md', 'utf8');
  it.each([
    ['12-month window from GA', '12 months of LTS starting at the 5.0.0 GA date'],
    ['accepted classes', "**C-I** (fixes) plus **`exception: 'security'`**"],
    ['frozen matrix', 'frozen at the\n  matrix verified by the **4.3 canaries**'],
    ['backport label', '**`backport-4.x`**'],
    ['unaffected statement', '**"unaffected"** statement'],
    ['EOL message verbatim', 'npm deprecate aura-glass@"<5" "aura-glass 4.x reached end of life on <date>; see <DOCS_BASE_URL>/migrate/5"'],
    ['deprecate only for bad versions and EOL', '**`npm deprecate` is used only for bad versions and EOL**'],
    ['pinned discussion', 'a pinned GitHub Discussion (operator step)'],
    ['banner markers', 'the README banner between the `<!-- AG-RELEASE-BANNER -->` markers'],
    ['llms Versions', 'the `llms.txt` "Versions" section'],
    ['verifier after publish', '`node scripts/release/verify-release-comms.mjs --dist-tags` fails'],
  ])('%s', (_name, literal) => {
    expect(lts).toContain(literal);
  });
  it('EOL notices at GA, EOL-90 and EOL-30', () => {
    for (const row of ['| GA |', '| EOL-90 days |', '| EOL-30 days |']) expect(lts).toContain(row);
  });
  it('comms are owed at every PRD train stop', () => {
    for (const stop of ['4.2', '4.3', '5.0.0-beta.1', '5.0.0-rc.1', '5.0.0)']) expect(lts).toContain(stop);
  });
});
