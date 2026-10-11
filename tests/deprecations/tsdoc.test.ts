/* @jest-environment node */
/* tests/deprecations/tsdoc.test.ts — REQ-PLAT-27 (PLAT-188/189), AC-FIN-33.
   The TSDoc gate reads the JSDoc attached to the declaration (compiler API)
   and requires the exact form
     @deprecated since <since>, removed in <removeIn>. Use {@link <replacement>}.
   Replaces tests/release/tsdoc-deprecations.test.mjs. */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { checkEntry, checkReverse, declarations, parseTag } from '../../scripts/release/check-tsdoc-deprecated.mjs';

const ENTRY = {
  id: 'DEP-C9999', kind: 'export', status: 'active', symbol: 'GlassThing',
  since: '4.3.0', removeIn: '5.0.0', replacement: 'Thing',
};
const GOOD = `/**
 * 4.x adapter.
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Thing}.
 */
export function GlassThing() { return null; }
`;
const check = (e: Record<string, unknown>, src: string | null, opts: Record<string, unknown> = {}) =>
  checkEntry({ entry: e, readFile: () => src ?? '', findFiles: () => (src == null ? [] : ['src/compat/x.tsx']), ...opts });

describe('checkEntry (exact form, attached JSDoc)', () => {
  it('passes on the exact form', () => {
    expect(check(ENTRY, GOOD)).toEqual([]);
  });
  it('accepts free text after the exact form and const/class/interface declarations', () => {
    expect(check(ENTRY, GOOD.replace('Use {@link Thing}.', 'Use {@link Thing}. Kept as an adapter.'))).toEqual([]);
    expect(check(ENTRY, '/** @deprecated since 4.3.0, removed in 5.0.0. Use {@link Thing}. */\nexport const GlassThing = () => null;')).toEqual([]);
    expect(check(ENTRY, '/** @deprecated since 4.3.0, removed in 5.0.0. Use {@link Thing}. */\nexport class GlassThing {}')).toEqual([]);
  });
  it('null replacement: no {@link} expected, and a stray link fails', () => {
    const e = { ...ENTRY, replacement: null };
    expect(check(e, '/** @deprecated since 4.3.0, removed in 5.0.0. */\nexport function GlassThing() {}')).toEqual([]);
    expect(check(e, GOOD).join()).toMatch(/must read 'since 4\.3\.0, removed in 5\.0\.0\.'/);
  });
  it('fails when since/removeIn differ', () => {
    expect(check(ENTRY, GOOD.replace('since 4.3.0', 'since 4.1.0')).join())
      .toMatch(/must read 'since 4\.3\.0, removed in 5\.0\.0\. Use \{@link Thing\}\.' \(found 'since 4\.1\.0/);
    expect(check(ENTRY, GOOD.replace('removed in 5.0.0', 'removed in 6.0.0')).join()).toMatch(/must read/);
  });
  it('fails when {@link replacement} is missing or different', () => {
    expect(check(ENTRY, GOOD.replace(' Use {@link Thing}.', '')).join()).toMatch(/must read .*\{@link Thing\}/);
    expect(check(ENTRY, GOOD.replace('{@link Thing}', '{@link Other}')).join()).toMatch(/must read .*\{@link Thing\}/);
  });
  it('fails on the loose forms the old ±30-line window accepted', () => {
    // id/symbol before "since", missing "Use", and a tag on a different declaration
    expect(check(ENTRY, GOOD.replace('@deprecated since', '@deprecated GlassThing DEP-C9999 since')).join()).toMatch(/needs '@deprecated since 4\.3\.0/);
    expect(check(ENTRY, GOOD.replace('Use {@link Thing}.', '{@link Thing}')).join()).toMatch(/must read|needs/);
    const elsewhere = `/** @deprecated since 4.3.0, removed in 5.0.0. Use {@link Thing}. */
export const other = 1;
export function GlassThing() { return null; }
`;
    expect(check(ENTRY, elsewhere).join()).toMatch(/GlassThing' needs '@deprecated since 4\.3\.0/);
  });
  it('fails when the declaration has no @deprecated tag at all', () => {
    expect(check(ENTRY, 'export function GlassThing() {}').join()).toMatch(/needs '@deprecated since 4\.3\.0, removed in 5\.0\.0\. Use \{@link Thing\}\.'/);
  });
  it('prop entries match the property on <Component>*Props', () => {
    const e = { ...ENTRY, id: 'DEP-C9998', kind: 'prop', symbol: 'GlassModal.compact', since: '4.2.0', replacement: null };
    const src = `export interface GlassModalProps {
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  compact?: boolean;
  open?: boolean;
}
export interface OtherProps { compact?: boolean }
`;
    expect(check(e, src)).toEqual([]);
    expect(check(e, src.replace('/** @deprecated since 4.2.0, removed in 5.0.0. */\n', '')).join()).toMatch(/src\/compat\/x\.tsx:2 'GlassModal\.compact' needs/);
  });
  it('planned entries are skipped (tag lands when the minor ships)', () => {
    expect(check({ ...ENTRY, status: 'planned' }, null)).toEqual([]);
  });
  it('missing declaration: error on 4x, skipped on next', () => {
    expect(check(ENTRY, null).join()).toMatch(/no source declaration found for 'GlassThing'/);
    expect(check(ENTRY, null, { missingIsError: false })).toEqual([]);
  });
  it('ignores kinds outside export|prop|prop-value', () => {
    expect(check({ ...ENTRY, kind: 'css-var' }, null)).toEqual([]);
  });
});

describe('declarations / parseTag', () => {
  it('reads the attached tag per declaration', () => {
    const d = declarations(GOOD, 'x.tsx');
    expect(d).toEqual([{ kind: 'export', name: 'GlassThing', owner: null, line: 5, tag: 'since 4.3.0, removed in 5.0.0. Use {@link Thing}.' }]);
  });
  it('parses the exact form only', () => {
    expect(parseTag('since 4.2.0, removed in 6.0.0.')).toEqual({ since: '4.2.0', removeIn: '6.0.0', link: null });
    expect(parseTag('since 4.2.0, removed in 5.0.0. Use {@link Popover}.')).toEqual({ since: '4.2.0', removeIn: '5.0.0', link: 'Popover' });
    expect(parseTag('use createBrandTheme.')).toBeNull();
    expect(parseTag('X since 4.2.0, removed in 5.0.0.')).toBeNull();
  });
});

describe('reverse check (default on)', () => {
  it('flags an exact-form tag with no entry; ignores free-text deprecations', () => {
    const rogue = '/** @deprecated since 4.3.0, removed in 5.0.0. */\nexport function Rogue() {}';
    expect(checkReverse(['f.ts'], [ENTRY], { readFile: () => rogue })).toEqual(["f.ts:2: @deprecated 'Rogue' has no deprecation entry"]);
    expect(checkReverse(['f.ts'], [ENTRY], { readFile: () => GOOD })).toEqual([]);
    expect(checkReverse(['f.ts'], [ENTRY], { readFile: () => '/** @deprecated use X. */\nexport const Y = 1;' })).toEqual([]);
  });
  it('the CLI runs the reverse check unless --no-reverse (temp git tree)', () => {
    const root = realpathSync(mkdtempSync(join(tmpdir(), 'ag-tsdoc-cli-')));
    try {
      mkdirSync(join(root, 'src/compat'), { recursive: true });
      writeFileSync(join(root, 'src/compat/rogue.ts'), '/** @deprecated since 4.3.0, removed in 5.0.0. */\nexport function Rogue() {}\n');
      writeFileSync(join(root, 'entries.json'), '[]');
      execFileSync('git', ['init', '-q'], { cwd: root });
      execFileSync('git', ['add', '-A'], { cwd: root });
      const cli = join(process.cwd(), 'scripts/release/check-tsdoc-deprecated.mjs');
      const opts = { encoding: 'utf8' as const };
      const r = spawnSync('node', ['--input-type=module', '-e',
        `const m = await import(${JSON.stringify(cli)}); process.exitCode = await m.main(['--entries', ${JSON.stringify(join(root, 'entries.json'))}], { root: ${JSON.stringify(root)} });`],
      { ...opts, cwd: root });
      expect(r.status).toBe(1);
      expect(r.stderr).toContain("FAIL src/compat/rogue.ts:2: @deprecated 'Rogue' has no deprecation entry");
      const off = spawnSync('node', ['--input-type=module', '-e',
        `const m = await import(${JSON.stringify(cli)}); process.exitCode = await m.main(['--entries', ${JSON.stringify(join(root, 'entries.json'))}, '--no-reverse'], { root: ${JSON.stringify(root)} });`],
      { ...opts, cwd: root });
      expect(off.status).toBe(0);
      expect(off.stdout).toMatch(/check-tsdoc-deprecated --line 5x: 0 of 0 active/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
