/* REQ-PLAT-34: exact dist-tag rows in README banner + llms.txt compared to
   mocked npm dist-tags; mismatch fails. */
import { execFileSync } from 'node:child_process';

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
});
