/* REQ-QUAL-03 distinctness wired into L6 and REQ-QUAL-73 review inputs from the L6/L7 captures
   (packages/qa/src/evidence/laneVisualEvidence.ts, folded by the lane runner). Fixture evidence directories hold
   generated PNGs exactly where certification/lanes/environment-visual.spec.ts and regression.spec.ts write them. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { SCENES } from '../../../src/contracts/testing.ts';
import type { Cell } from '../src/matrix/axes.ts';
import { decodePng, encodePng, type RgbaImage } from '../src/pixel/png.ts';
import {
  DISTINCTNESS_FILE, distinctnessCell, distinctnessResult, inventoryClassOf, writeL6ReviewInputs, writeL7ReviewInputs,
} from '../src/evidence/laneVisualEvidence.ts';
import { REPO, cleanupRepos, fakeTool, makeRepo, results, row } from './helpers/laneFixture.ts';
import { runLanes } from '../src/evidence/laneRunner.ts';

const made: string[] = [];
afterAll(() => { for (const d of made.splice(0)) rmSync(d, { recursive: true, force: true }); cleanupRepos(); });
const tmp = () => { const d = mkdtempSync(join(tmpdir(), 'ag-lve-')); made.push(d); return d; };
const write = (file: string, data: string | Buffer) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, data); };

/** A smooth per-seed pattern (distinct seeds → distinct dHash). */
function pattern(seed: number, width = 48, height = 32): RgbaImage {
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const v = Math.round(127 + 120 * Math.sin((x + seed * 7) / (4 + (y % 5)) + y / 9 + seed));
    data.set([v, (v * 3 + seed * 40) % 256, 255 - v, 255], (y * width + x) * 4);
  }
  return { width, height, data };
}
const cell = (scene: string, over: Partial<Cell> = {}): Cell => ({ engine: 'chromium', scene: scene as Cell['scene'], scheme: 'light', transparency: 'glass',
  preference: 'default', tier: 'standard', viewport: '1440', ...over });

/** Writes an L6 evidence dir: environment-visual/captures-1.jsonl + png/<n>.png. */
function l6(captures: Array<{ subject: string; cell: Cell; image: RgbaImage | 'not-a-png'; state?: string; kind?: string; noPng?: boolean }>): string {
  const dir = tmp();
  const lines = captures.map((c, i) => {
    const png = `png/${i}.png`;
    if (!c.noPng) write(join(dir, 'environment-visual', png), c.image === 'not-a-png' ? 'x' : encodePng(c.image));
    return JSON.stringify({ id: `${c.subject.toLowerCase()}--default|${c.cell.scene}|${i}`, subject: c.subject, state: c.state ?? 'default', kind: c.kind ?? 'component', cell: c.cell, png });
  });
  write(join(dir, 'environment-visual', 'captures-1.jsonl'), `${lines.join('\n')}\n`);
  return dir;
}
const classes = (m: Record<string, 'visual' | 'alias' | 'nonvisual'>) => () => inventoryClassOf(Object.entries(m).map(([name, c]) => ({ entry: '.', name, class: c })));

describe('REQ-QUAL-03 distinctness at L6', () => {
  const cells = SCENES.slice(0, 5).flatMap((s) => (['light', 'dark'] as const).map((scheme) => cell(s, { scheme }))); // 10 cells

  it('a visual subject identical to another in every cell fails as duplicate-visual; distinct subjects pass', () => {
    const dir = l6(cells.flatMap((c, i) => [
      { subject: 'Button', cell: c, image: pattern(i) }, { subject: 'ButtonClone', cell: c, image: pattern(i) }, { subject: 'Card', cell: c, image: pattern(i + 50) },
    ]));
    const r = distinctnessResult(dir, classes({ Button: 'visual', ButtonClone: 'visual', Card: 'visual' }))!;
    expect(r.state).toBe('fail');
    expect(r.reason).toContain("duplicate-visual: 'Button' (visual) duplicates ButtonClone in 10/10 cells");
    expect(r.reason).toContain("duplicate-visual: 'ButtonClone' (visual) duplicates Button in 10/10 cells");
    expect(r.reason).not.toContain("'Card'");
    expect(r.subjects).toEqual(['Button', 'ButtonClone', 'Card']);
    const report = JSON.parse(readFileSync(join(dir, 'environment-visual', DISTINCTNESS_FILE), 'utf8'));
    expect(report.duplicatePairs).toHaveLength(10);
  });

  it('the alias of a visual subject passes; 8/10 duplicate cells pass', () => {
    const alias = l6(cells.flatMap((c, i) => [{ subject: 'Button', cell: c, image: pattern(i) }, { subject: 'GlassButton', cell: c, image: pattern(i) }]));
    const a = distinctnessResult(alias, classes({ Button: 'visual', GlassButton: 'alias' }))!;
    expect(a.state).toBe('fail'); // Button is visual and duplicates the alias in every cell
    expect(a.reason).not.toContain("'GlassButton'");
    const eight = l6(cells.flatMap((c, i) => [{ subject: 'A', cell: c, image: pattern(i) }, { subject: 'B', cell: c, image: pattern(i < 8 ? i : i + 70) }]));
    expect(distinctnessResult(eight, classes({ A: 'visual', B: 'visual' }))).toMatchObject({ state: 'pass', tests: 2 });
  });

  it('compares subjects only within the same cell key (scene × engine × axes × state); lone captures are never decoded', () => {
    expect(distinctnessCell({ cell: cell('photo'), state: 'open' })).toBe('photo|chromium|light.glass.default.standard.1440|open');
    const dir = l6([
      { subject: 'A', cell: cell('photo'), image: pattern(1) },
      { subject: 'B', cell: cell('photo', { scheme: 'dark' }), image: pattern(1) }, // same pixels, different cell
      { subject: 'C', cell: cell('flat-white'), image: 'not-a-png' }, // alone in its cell
    ]);
    expect(distinctnessResult(dir, classes({ A: 'visual', B: 'visual', C: 'visual' }))).toMatchObject({ state: 'pass', tests: 3 });
  });

  it('fails on a capture without pixels, is pending without an inventory, and reports nothing without captures', () => {
    const missing = l6([{ subject: 'A', cell: cell('photo'), image: pattern(1), noPng: true }]);
    expect(distinctnessResult(missing, classes({}))).toMatchObject({ state: 'fail', reason: expect.stringContaining('png/0.png missing') });
    const ok = l6([{ subject: 'A', cell: cell('photo'), image: pattern(1) }]);
    expect(distinctnessResult(ok, () => { throw new Error('no src/'); })).toMatchObject({ state: 'pending', reason: expect.stringContaining('export inventory unavailable') });
    expect(distinctnessResult(tmp(), classes({}))).toBeNull();
  });

  it('the lane runner adds the distinctness row to the L6 lane manifest', async () => {
    const spec = 'certification/lanes/environment-visual.spec.ts';
    const root = makeRepo({ builtins: `[${row({ lane: 'L6', kind: 'playwright', path: spec, remote: true })}]`, files: { [spec]: '' } });
    const png = encodePng(pattern(3)).toString('base64');
    // stands in for the L6 spec: two subjects with the same pixels in one cell
    const pw = fakeTool(root, 'playwright', `const fs = require('node:fs'); const path = require('node:path');
const dir = path.join(process.env.AG_LANE_EVIDENCE_DIR, 'environment-visual'); fs.mkdirSync(path.join(dir, 'png'), { recursive: true });
const cell = ${JSON.stringify(cell('photo'))};
const rows = ['Button', 'Twin'].map((subject, i) => { fs.writeFileSync(path.join(dir, 'png', i + '.png'), Buffer.from('${png}', 'base64'));
  return JSON.stringify({ id: subject + '|' + i, subject, state: 'default', cell, png: 'png/' + i + '.png', captures: 2, durationMs: 10 }); });
fs.writeFileSync(path.join(dir, 'plan.json'), JSON.stringify({ cells: ['a', 'b'], subjects: ['Button', 'Twin'] }));
fs.writeFileSync(path.join(dir, 'captures-1.jsonl'), rows.join('\\n') + '\\n');
fs.writeFileSync(process.env.PLAYWRIGHT_JSON_OUTPUT_NAME, JSON.stringify({ stats: { expected: 2, unexpected: 0, flaky: 0 }, suites: [] }));\n`);
    const env = { PATH: process.env.PATH, HOME: process.env.HOME, AG_CERT_ALLOW_LOCAL: '1', CI_JOB_NAME_SLUG: 'fixture' };
    const r = await runLanes(['--lane', 'L6', '--scope', 'pr'], { root, env, tools: { playwrightCli: pw },
      inventory: () => [{ entry: '.', name: 'Button', class: 'visual' }, { entry: '.', name: 'Twin', class: 'visual' }] });
    const d = results(r).find((x) => x.path === 'packages/qa/src/pixel/duplicates.ts');
    expect(d).toMatchObject({ lane: 'L6', stream: 'qual', state: 'fail', reason: expect.stringContaining("duplicate-visual: 'Button'") });
    expect(r.code).toBe(1);
  });
});

describe('REQ-QUAL-73 review inputs', () => {
  const full = (subject: string, state = 'default', skip: string | null = null) => [
    ...SCENES.flatMap((s, i) => (['light', 'dark'] as const).filter((scheme) => `${s}/${scheme}` !== skip)
      .map((scheme) => ({ subject, state, cell: cell(s, { scheme }), image: pattern(i + (scheme === 'dark' ? 20 : 0), 1440, 4) }))),
    { subject, state, cell: cell('photo', { viewport: '390' }), image: pattern(99, 1170, 6) },
    // a non-review cell (webkit) never enters the composite
    { subject, state, cell: cell('photo', { engine: 'webkit' }), image: pattern(98, 1440, 4) },
  ];

  it('L6: one item per subject-state with 8 scenes × light/dark @1440 and the 390 photo frame; incomplete items listed', () => {
    const dir = l6([...full('Button', 'pressed'), ...full('SegmentedControl', 'default', 'dense-text/dark')]);
    const r = writeL6ReviewInputs(dir, 'a'.repeat(40))!;
    expect(r).toMatchObject({ items: 1, incomplete: [{ item: 'segmented-control-default', missing: ['dense-text/dark @1440'] }] });
    const index = JSON.parse(readFileSync(r.file, 'utf8'));
    expect(index).toMatchObject({ version: 1, sha: 'a'.repeat(40), lane: 'L6' });
    const [item] = index.items;
    expect(item.item).toBe('button-pressed');
    expect(Object.keys(item.scenes).sort()).toEqual([...SCENES].sort());
    expect(item.baseline).toBeNull();
    expect(item.current).toBe(item.scenes.photo.light);
    const mobile = decodePng(readFileSync(join(dirname(r.file), item.mobile)));
    expect([mobile.width, mobile.height]).toEqual([390, 2]);
  });

  it('L7: baseline + current per subject-state, photo/light 1440 chromium preferred', () => {
    const dir = tmp();
    const pair = (id: string, c: Cell, baseline: string | null) => JSON.stringify({ id, subject: 'Button', state: 'pressed', storyId: 'button--primary', cell: c, current: `review/${id}/head.png`, baseline });
    write(join(dir, 'regression', 'review-9.jsonl'), [
      pair('dark', cell('photo', { scheme: 'dark' }), 'review/dark/baseline.png'),
      pair('light', cell('photo'), 'review/light/baseline.png'),
      pair('webkit', cell('photo', { engine: 'webkit' }), null),
    ].join('\n'));
    const r = writeL7ReviewInputs(dir, null)!;
    const index = JSON.parse(readFileSync(r.file, 'utf8'));
    expect(index.items).toEqual([{ item: 'button-pressed', baseline: 'review/light/baseline.png', current: 'review/light/head.png', cell: 'light' }]);
    expect(writeL7ReviewInputs(tmp(), null)).toBeNull();
  });

  it('review-record composites merges the L6 and L7 parts by item (the L7 pair is the baseline / current)', () => {
    const dir = l6(full('Button', 'pressed'));
    const l6Part = writeL6ReviewInputs(dir, 'b'.repeat(40))!;
    const reg = join(dir, 'regression');
    write(join(reg, 'review', 'x', 'head.png'), encodePng(pattern(5, 200, 40)));
    write(join(reg, 'review', 'x', 'baseline.png'), encodePng(pattern(5, 200, 40)));
    write(join(reg, 'review-1.jsonl'), JSON.stringify({ id: 'x', subject: 'Button', state: 'pressed', storyId: 's', cell: cell('photo'), current: 'review/x/head.png', baseline: 'review/x/baseline.png' }));
    const l7Part = writeL7ReviewInputs(dir, 'b'.repeat(40))!;
    const out = join(dir, 'out');
    const r = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', join(REPO, 'scripts/qual/review-record.mjs'), 'composites',
      '--inputs', `${l7Part.file},${l6Part.file}`, '--out', out], { cwd: REPO, encoding: 'utf8', timeout: 120_000 });
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
    const index = JSON.parse(readFileSync(join(out, 'index.json'), 'utf8'));
    expect(index).toMatchObject({ sha: 'b'.repeat(40), items: [{ item: 'button-pressed', diffRatio: 0 }] });
    expect(index.items[0].tiles.map((t: { label: string }) => t.label)).toEqual(expect.arrayContaining(['previous baseline', 'current', 'diff heat-map']));
  });
});
