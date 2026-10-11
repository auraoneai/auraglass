/**
 * @jest-environment node
 */
/* REQ-QUAL-55 (REQ-FIN-106, FIN-451): scripts/qual/lint-stories.mjs — six story-glass checks, each with ≥4 valid and
   ≥4 invalid fixtures, inline disable comments that do not disable anything, severity by owner, per-stream counts, the
   expiring baseline (new offender / stale row / RC-1) and the CLI exit code on a planted QUAL-path violation. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CHECKS, baselineExpired, classify, lintSource } from '../../../scripts/qual/lint-stories.mjs';

const SCRIPT = join(__dirname, '..', '..', '..', 'scripts', 'qual', 'lint-stories.mjs');
const STORY = 'stories/cmp/components/Fixture.stories.tsx';
const LIB = "import { Surface, Environment } from 'aura-glass';\nimport { Button } from '../../../src/components/button';\n";
const checksOf = async (code: string, file = STORY) => (await lintSource(code, file)).map((v) => v.check);

type Case = [string, string];
const CASES: Record<string, { valid: Case[]; invalid: Case[] }> = {
  'story-no-optics': {
    valid: [
      ['layout style', `${LIB}export const A = () => <Surface style={{ padding: 16, display: 'grid' }} />;`],
      ['opacity is not an optic', `${LIB}export const A = () => <div style={{ opacity: 0.5 }}><Surface /></div>;`],
      ['optics reset to none in CSS', "export const css = `.x { backdrop-filter: none; filter: none; }`;"],
      ['the word filter in copy', `${LIB}export const A = () => <Surface>Use the filter bar to narrow results</Surface>;`],
    ],
    invalid: [
      ['backdropFilter in style', `${LIB}export const A = () => <div style={{ backdropFilter: 'blur(8px)' }} />;`],
      ['WebkitBackdropFilter via a const style', `${LIB}const s = { WebkitBackdropFilter: 'blur(4px)' };\nexport const A = () => <Surface style={s} />;`],
      ['filter in a spread style', `${LIB}const base = { filter: 'saturate(2)' };\nexport const A = () => <Surface style={{ ...base, padding: 4 }} />;`],
      ['mixBlendMode in style', `${LIB}export const A = () => <span style={{ mixBlendMode: 'screen' }}>x</span>;`],
      ['backdrop-filter in CSS-in-JS', "export const css = `.card { backdrop-filter: blur(12px); }`;"],
      ['backdrop-filter string', "export const v = 'backdrop-filter';"],
    ],
  },
  'story-no-important': {
    valid: [
      ['plain CSS', "export const css = `.a { color: inherit; }`;"],
      ['important in copy without the bang', `${LIB}export const A = () => <Surface>An important update</Surface>;`],
      ['comment mentioning it', `${LIB}/* no !important here */\nexport const A = () => <Surface />;`],
      ['style object', `${LIB}export const A = () => <Surface style={{ margin: 0 }} />;`],
    ],
    invalid: [
      ['style value', `${LIB}export const A = () => <Surface style={{ margin: '0 !important' }} />;`],
      ['CSS-in-JS declaration', "export const css = `.a { padding: 0 !important; }`;"],
      ['declaration list string', "export const s = 'margin: 0 !important;';"],
      ['spaced bang', "export const css = `.a { margin: 0 ! important }`;"],
    ],
  },
  'story-no-ink-override': {
    valid: [
      ['color on a non-library element', `${LIB}export const A = () => <><span style={{ color: 'red' }}>x</span><Surface /></>;`],
      ['layout on a wrapper', `${LIB}export const A = () => <div style={{ display: 'flex' }}><Button /></div>;`],
      ['public knob on a wrapper', `${LIB}export const A = () => <div style={{ '--ag-light-angle': '20deg' } as never}><Surface /></div>;`],
      ['local component is not a library component', "const Local = (p: object) => null;\nexport const A = () => <Local style={{ color: 'red' }} />;"],
    ],
    invalid: [
      ['color on a library component', `${LIB}export const A = () => <Button style={{ color: '#fff' }} />;`],
      ['color on a wrapper', `${LIB}export const A = () => <div style={{ color: '#fff' }}><p><Surface /></p></div>;`],
      ['--ag-on-surface override', `${LIB}export const A = () => <Surface style={{ '--ag-on-surface': '#000' } as never} />;`],
      ['--glass-text-* override on a wrapper', `${LIB}export const A = () => <section style={{ '--glass-text-primary': '#000' } as never}><Button /></section>;`],
    ],
  },
  'story-no-tone-class': {
    valid: [
      ['ordinary classes', `${LIB}export const A = () => <Surface className="card wide" />;`],
      ['glass in another position', `${LIB}export const A = () => <Surface className="my-glass-on-x" />;`],
      ['glass alone', `${LIB}export const A = () => <div className="glass" />;`],
      ['tone word in copy', `${LIB}export const A = () => <Surface>glass-on-dark looks best here</Surface>;`],
    ],
    invalid: [
      ['glass-on-dark', `${LIB}export const A = () => <Surface className="glass-on-dark" />;`],
      ['glass-contrast in a template', `${LIB}const t = 'x';\nexport const A = () => <div className={\`a glass-contrast-high \${t}\`} />;`],
      ['liquid-glass-* in a conditional', `${LIB}export const A = ({ on }: { on: boolean }) => <div className={on ? 'liquid-glass-panel' : 'x'} />;`],
      ['glass-level selector in CSS', "export const css = `.glass-level-2 { padding: 0; }`;"],
      ['glass-neutral- class', `${LIB}export const A = () => <span className="glass-neutral-200" />;`],
    ],
  },
  'story-no-stage-background': {
    valid: [
      ['background on Environment', `${LIB}export const A = () => <Environment backdrop="light" style={{ background: '#000' } as never}><Surface /></Environment>;`],
      ['background on a sibling', `${LIB}export const A = () => <><div style={{ background: 'red' }} /><Surface /></>;`],
      ['background on a leaf inside the subject', `${LIB}export const A = () => <Surface><i style={{ background: 'red' }} /></Surface>;`],
      ['background with no library descendant', "export const A = () => <div style={{ backgroundColor: 'red' }}><span /></div>;"],
    ],
    invalid: [
      ['background on a parent', `${LIB}export const A = () => <div style={{ background: 'linear-gradient(#000,#fff)' }}><Surface /></div>;`],
      ['backgroundColor on a grandparent', `${LIB}export const A = () => <main style={{ backgroundColor: '#111' }}><div><Button /></div></main>;`],
      ['backgroundImage via const', `${LIB}const stage = { backgroundImage: 'url(x.jpg)' };\nexport const A = () => <div style={stage}><Surface /></div>;`],
      ['background on a library ancestor', `${LIB}export const A = () => <Surface style={{ background: 'red' }}><Button /></Surface>;`],
    ],
  },
  'story-no-private-vars': {
    valid: [
      ['public var', `${LIB}export const A = () => <Surface style={{ '--ag-specular': 0.3 } as never} />;`],
      ['component-looking public name', "export const v = 'var(--ag-radius-inner)';"],
      ['underscore elsewhere', "export const v = '--_x-ag';"],
      ['private var under .storybook/lab', "export const v = 'var(--_ag-surface-fill)';", '.storybook/lab/X.tsx'] as unknown as Case,
    ],
    invalid: [
      ['private var key', `${LIB}export const A = () => <Surface style={{ '--_ag-blur': '4px' } as never} />;`],
      ['private var read', "export const v = 'var(--_ag-surface-fill)';"],
      ['private var in CSS-in-JS', "export const css = `.a { --_ag-tint: 0; }`;"],
      ['private var in .storybook outside lab', "export const v = 'var(--_ag-rim)';", '.storybook/contract/X.tsx'] as unknown as Case,
    ],
  },
};

describe.each(CHECKS)('%s', (check: string) => {
  const c = CASES[check]!;
  it('has ≥4 valid and ≥4 invalid fixtures', () => {
    expect(c.valid.length).toBeGreaterThanOrEqual(4);
    expect(c.invalid.length).toBeGreaterThanOrEqual(4);
  });
  it.each(c.valid)('valid: %s', async (_name, code, file = STORY) => {
    expect(await checksOf(code, file)).not.toContain(check);
  });
  it.each(c.invalid)('invalid: %s', async (_name, code, file = STORY) => {
    expect(await checksOf(code, file)).toContain(check);
  });
});

describe('disable comments are ignored', () => {
  it('eslint/stylelint/ts/custom disable comments do not suppress a finding', async () => {
    const code = `${LIB}// eslint-disable-next-line
/* lint-stories-disable story-no-optics */
// @ts-expect-error
export const A = () => <div style={{ backdropFilter: 'blur(2px)' /* lint-stories-disable-line */ }}><Surface /></div>;
export const css = \`/* stylelint-disable */ .a { margin: 0 !important; }\`;`;
    expect((await checksOf(code)).sort()).toEqual(['story-no-important', 'story-no-optics']);
  });
});

describe('MDX and CSS files', () => {
  it('MDX is compiled with the Storybook MDX compiler and checked as JSX', async () => {
    const mdx = "import { Surface } from 'aura-glass';\n\n# Title\n\n<div style={{ background: 'red' }}><Surface /></div>\n";
    expect(await checksOf(mdx, 'src/x/X.mdx')).toEqual(['story-no-stage-background']);
  });
  it('CSS files are parsed with PostCSS', async () => {
    expect((await checksOf('.a { backdrop-filter: blur(2px); margin: 0 !important; }\n.liquid-glass-x {}', 'showcase/x/x.css')).sort())
      .toEqual(['story-no-important', 'story-no-optics', 'story-no-tone-class']);
  });
});

describe('severity, baseline and expiry', () => {
  const v = (check: string, file: string, owner: string) => ({ check, file, owner, line: 1, message: 'm' });
  const baseline = { version: 1, gate: 'story-glass', expires: 'RC-1', rows: [
    { check: 'story-no-optics', file: 'stories/mat/P.stories.tsx', owner: 'MAT', reqFin: 'REQ-FIN-59', count: 1 },
    { check: 'story-no-ink-override', file: 'stories/cmp/S.stories.tsx', owner: 'CMP', reqFin: 'REQ-FIN-71', count: 1 },
  ] };
  it('QUAL paths are errors; baselined other-stream offences are report-only with per-stream counts', () => {
    const r = classify([v('story-no-optics', 'stories/mat/P.stories.tsx', 'MAT'), v('story-no-ink-override', 'stories/cmp/S.stories.tsx', 'CMP'),
      v('story-no-important', 'stories/qual/Q.stories.tsx', 'QUAL')], baseline, '5.0.0-alpha.0');
    expect(r.errors.map((e) => e.file)).toEqual(['stories/qual/Q.stories.tsx']);
    expect(r.reported).toHaveLength(2);
    expect(r.stale).toEqual([]);
    expect(r.perStream.MAT?.['story-no-optics']).toBe(1);
    expect(r.perStream.QUAL?.['story-no-important']).toBe(1);
  });
  it('a new offender or a higher count in another stream fails; a fixed row is stale', () => {
    const r = classify([v('story-no-optics', 'stories/mat/P.stories.tsx', 'MAT'), v('story-no-optics', 'stories/mat/P.stories.tsx', 'MAT'),
      v('story-no-tone-class', 'src/data/T.stories.tsx', 'SURF')], baseline, '5.0.0-beta.2');
    expect(r.errors.map((e) => e.why).sort()).toEqual(['count 2 > baseline 1', 'count 2 > baseline 1', 'new-offender']);
    expect(r.stale.map((s) => s.file)).toEqual(['stories/cmp/S.stories.tsx']);
  });
  it('from RC-1 every offence is an error', () => {
    expect(baselineExpired('5.0.0-beta.9')).toBe(false);
    expect(baselineExpired('5.0.0-rc.1')).toBe(true);
    expect(baselineExpired('5.0.0')).toBe(true);
    expect(baselineExpired('4.3.0')).toBe(false);
    const r = classify([v('story-no-optics', 'stories/mat/P.stories.tsx', 'MAT')], baseline, '5.0.0-rc.1');
    expect(r.errors.map((e) => e.why)).toEqual(['baseline-expired']);
  });
});

describe('CLI on a fixture repository', () => {
  function fixtureRepo(files: Record<string, string>): string {
    const dir = mkdtempSync(join(tmpdir(), 'lint-stories-'));
    const all: Record<string, string> = {
      'package.json': JSON.stringify({ name: 'fixture', version: '5.0.0-alpha.0' }),
      'contracts/ownership.json': JSON.stringify({ version: 1, rows: [
        { id: 'Q', glob: 'stories/qual/**', owner: 'QUAL' }, { id: 'Q2', glob: '.storybook/**', owner: 'QUAL' },
        { id: 'M', glob: 'stories/mat/**', owner: 'MAT' }, { id: 'P', glob: '**', owner: 'PLAT' }] }),
      ...files,
    };
    for (const [p, c] of Object.entries(all)) { mkdirSync(join(dir, p, '..'), { recursive: true }); writeFileSync(join(dir, p), c); }
    execFileSync('git', ['init', '-q'], { cwd: dir });
    execFileSync('git', ['add', '-A'], { cwd: dir });
    return dir;
  }
  const run = (dir: string, ...args: string[]) => spawnSync(process.execPath, [SCRIPT, '--root', dir, ...args], { encoding: 'utf8' });
  const OFFENDER = `${LIB}export const A = () => <div style={{ backdropFilter: 'blur(2px)' }}><Surface /></div>;\n`;

  it('reports per-stream counts and exits 0 when other-stream offenders are baselined', () => {
    const dir = fixtureRepo({ 'stories/mat/P.stories.tsx': OFFENDER, 'stories/qual/Q.stories.tsx': `${LIB}export const A = () => <Surface />;\n` });
    try {
      expect(run(dir, '--init-baseline').status).toBe(0);
      const r = run(dir, '--json', 'out.json');
      expect(r.status).toBe(0);
      expect(r.stdout).toMatch(/MAT\s+1\s+optics=1/);
      const report = JSON.parse(readFileSync(join(dir, 'out.json'), 'utf8'));
      expect(report.perStream.MAT['story-no-optics']).toBe(1);
      expect(report.errors).toBe(0);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('exits non-zero on a planted QUAL-path violation, and on a new other-stream offender', () => {
    const dir = fixtureRepo({ 'stories/mat/P.stories.tsx': OFFENDER });
    try {
      expect(run(dir, '--init-baseline').status).toBe(0);
      mkdirSync(join(dir, 'stories/qual'), { recursive: true });
      writeFileSync(join(dir, 'stories/qual/Q.stories.tsx'), `${LIB}export const A = () => <Surface style={{ margin: '0 !important' }} />;\n`);
      execFileSync('git', ['add', '-A'], { cwd: dir });
      const r = run(dir);
      expect(r.status).toBe(1);
      expect(r.stderr).toContain('[story-no-important] stories/qual/Q.stories.tsx:3 (QUAL, qual-path)');
      rmSync(join(dir, 'stories/qual/Q.stories.tsx'));
      writeFileSync(join(dir, 'stories/mat/N.stories.tsx'), OFFENDER);
      execFileSync('git', ['add', '-A'], { cwd: dir });
      const r2 = run(dir);
      expect(r2.status).toBe(1);
      expect(r2.stderr).toContain('stories/mat/N.stories.tsx:3 (MAT, new-offender)');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('a baseline never grows: --init-baseline refuses to overwrite', () => {
    const dir = fixtureRepo({ 'stories/mat/P.stories.tsx': OFFENDER });
    try {
      expect(run(dir, '--init-baseline').status).toBe(0);
      const again = run(dir, '--init-baseline');
      expect(again.status).toBe(1);
      expect(again.stderr).toContain('it only shrinks');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
