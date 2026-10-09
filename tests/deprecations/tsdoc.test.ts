/* REQ-PLAT-27: TSDoc gate — exec-port into check-tsdoc-deprecated.mjs.
   Cases: exact-form pass, wrong since/removeIn fail, missing {@link} fail,
   planned entries skipped, missing declaration (4x), deprecatedTags shape. */
import { execFileSync } from 'node:child_process';

const SCRIPTS = `${process.cwd()}/scripts/release/check-tsdoc-deprecated.mjs`;
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import(${JSON.stringify(SCRIPTS)}); ${body}`],
  { cwd: process.cwd(), encoding: 'utf8' });

const ENTRY = {
  id: 'DEP-C9999', kind: 'export', status: 'active', symbol: 'GlassThing',
  since: '4.3.0', removeIn: '5.0.0', replacement: 'Thing',
};

const check = (e: Record<string, unknown>, fileContent: string | null, opts: Record<string, unknown> = {}) =>
  EVAL(`const errors = m.checkEntry({ entry: ${JSON.stringify(e)},
    readFile: () => ${JSON.stringify(fileContent ?? '')},
    findFiles: () => ${fileContent == null ? '[]' : `['decl.ts']`},
    ...${JSON.stringify(opts)} });
    console.log(JSON.stringify(errors));`);

const GOOD = `/** @deprecated GlassThing DEP-C9999 since 4.3.0, removed in 5.0.0. {@link Thing} */
export function GlassThing() {}`;

describe('checkEntry', () => {
  it('passes on exact-form tag', () => {
    expect(JSON.parse(check(ENTRY, GOOD))).toEqual([]);
  });
  it('fails when since/removeIn differ', () => {
    const fails = JSON.parse(check(ENTRY, GOOD.replace('since 4.3.0', 'since 4.1.0')));
    expect(fails[0]).toMatch(/since 4\.3\.0/);
  });
  it('fails when {@link replacement} missing', () => {
    const fails = JSON.parse(check(ENTRY, GOOD.replace(' {@link Thing}', '')));
    expect(fails[0]).toMatch(/\{@link Thing/);
  });
  it('skips planned entries (tag not required until shipped)', () => {
    expect(JSON.parse(check({ ...ENTRY, status: 'planned' }, null))).toEqual([]);
  });
  it('fails when declaration missing (missingIsError)', () => {
    const fails = JSON.parse(check(ENTRY, null));
    expect(fails[0]).toMatch(/no source declaration/);
  });
  it('deprecatedTags parses the declared symbol', () => {
    const out = EVAL(`const tags = m.deprecatedTags('/** @deprecated X since 4.3.0, removed in 5.0.0 */\\nexport const X=1;');
      console.log(JSON.stringify({n: tags.length, sym: tags[0].symbol}));`);
    expect(JSON.parse(out)).toEqual({ n: 1, sym: 'X' });
  });
  it('reverse check flags an unlisted @deprecated symbol', () => {
    const out = EVAL(`const errs = m.checkReverse(['f.ts'], [{id:'DEP-C0001',kind:'export',symbol:'Other'}],
      { readFile: () => '/** @deprecated Rogue since 4.3.0, removed in 5.0.0 */\\nexport function Rogue(){}' });
      console.log(JSON.stringify(errs));`);
    expect(JSON.parse(out)[0]).toMatch(/Rogue.*no deprecation entry/);
  });
});
