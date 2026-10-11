/* @jest-environment node */
// REQ-FIN-110 / REQ-QUAL-72 (FIN-H H3-2): tests/a11y/manual/sr-matrix.template.json
// is exactly what gen-matrix.mjs generates from src/**/*.meta.ts + the Storybook
// CSF index, and it covers every subject issue #16 / REQ-MAT-66 / REQ-SURF-196 need.
// Known gaps owned by other work (flagship 18 meta, missing stories, H3-3 scripts)
// live in the expiring baseline sr-matrix.baseline.json (PRD-F §4.3 rule 3): a new
// gap fails, a stale row fails, and every row fails once package.json reaches
// 5.0.0-rc.1 (expires: RC-1).
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const GEN = 'tests/a11y/manual/gen-matrix.mjs';
const TEMPLATE = 'tests/a11y/manual/sr-matrix.template.json';
const BASELINE = 'tests/a11y/manual/sr-matrix.baseline.json';
const SR_AT = ['voiceover-macos', 'voiceover-ios', 'nvda-chrome', 'talkback-chrome'];
const TOUCH_AT = ['touch-ios', 'touch-android'];
const MOTION = ['button', 'dialog', 'menu', 'sheet', 'tabs'];

interface Row {
  subject: string; name: string; stream: 'mat' | 'cmp' | 'surf'; flagship: number | null;
  pass: 'sr' | 'touch' | 'motion'; at: string; storyId: string | null; script: string; record: string; required: boolean;
}
interface Template {
  version: number; flagships: Record<string, string[]>; missingFlagships: number[];
  missingStories: Array<{ subject: string; owner: string }>; rows: Row[];
}
interface BaselineRow { owner: string; reqFin: string; expires: string }
interface Baseline {
  missingFlagships: Array<BaselineRow & { flagship: number }>;
  missingStories: Array<BaselineRow & { subject: string }>;
  missingScripts: Array<BaselineRow & { script: string }>;
}

const template = JSON.parse(readFileSync(TEMPLATE, 'utf8')) as Template;
const baseline = JSON.parse(readFileSync(BASELINE, 'utf8')) as Baseline;
const version = (JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }).version;

function gen(...args: string[]) {
  const r = spawnSync(process.execPath, [GEN, ...args], { encoding: 'utf8' });
  return { code: r.status ?? -1, out: r.stdout, err: r.stderr };
}

/** expires: 'RC-1' is past once the package version is 5.0.0-rc.N, a 5.x release, or later. */
function pastRc1(v: string): boolean {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+)(?:\.(\d+))?)?/.exec(v);
  if (!m) throw new Error(`unparseable package version ${v}`);
  const major = Number(m[1]);
  if (major !== 5) return major > 5;
  if (Number(m[2]) > 0 || Number(m[3]) > 0 || !m[4]) return true;
  return m[4] === 'rc';
}

function checkBaselineRows(rows: BaselineRow[]) {
  for (const r of rows) {
    expect(typeof r.owner).toBe('string');
    expect(r.reqFin).toMatch(/^REQ-FIN-\d+$/);
    expect(r.expires).toBe('RC-1');
  }
  // Expired rows fail: at RC-1 every baseline list must be empty.
  expect(pastRc1(version) ? rows : []).toEqual([]);
}

describe('sr-matrix.template.json', () => {
  it('equals the generator output (gen-matrix --check exits 0)', () => {
    const r = gen('--check');
    expect(r.err.split('\n').filter((l) => l.includes('ERROR') || l.includes('DRIFT'))).toEqual([]);
    expect(r.code).toBe(0);
  }, 120_000);

  it('--check exits 1 on drift and --out writes the same bytes as the committed template', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sr-matrix-'));
    try {
      const out = join(dir, 'template.json');
      expect(gen('--out', out).code).toBe(0);
      expect(readFileSync(out, 'utf8')).toBe(readFileSync(TEMPLATE, 'utf8'));
      const drifted = JSON.parse(readFileSync(out, 'utf8')) as Template;
      drifted.rows.pop();
      writeFileSync(out, `${JSON.stringify(drifted, null, 2)}\n`);
      const r = gen('--check', '--out', out);
      expect(r.code).toBe(1);
      expect(r.err).toContain('DRIFT');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120_000);

  it('rows are well formed and unique per (stream, subject, pass, at)', () => {
    const keys = new Set<string>();
    for (const r of template.rows) {
      expect(r.required).toBe(true);
      expect(['mat', 'cmp', 'surf']).toContain(r.stream);
      expect(r.subject).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(r.pass === 'touch' ? TOUCH_AT : SR_AT).toContain(r.at);
      expect(r.record).toBe(`tests/a11y/manual/records/${r.stream}/${r.subject}-${r.at}${r.pass === 'motion' ? '-motion' : ''}.json`);
      const key = `${r.stream}|${r.subject}|${r.pass}|${r.at}`;
      expect(keys.has(key)).toBe(false);
      keys.add(key);
    }
  });

  it('flagship numbers are contiguous 1..44 (gaps only as unexpired baseline rows)', () => {
    const present = new Set(Object.keys(template.flagships).map(Number));
    const missing = Array.from({ length: 44 }, (_, i) => i + 1).filter((n) => !present.has(n));
    expect(template.missingFlagships).toEqual(missing);
    const baselined = baseline.missingFlagships.map((r) => r.flagship).sort((a, b) => a - b);
    expect(missing.filter((n) => !baselined.includes(n))).toEqual([]); // new gap
    expect(baselined.filter((n) => !missing.includes(n))).toEqual([]); // stale row: delete it
    checkBaselineRows(baseline.missingFlagships);
  });

  it('every flagship subject has 4 SR rows and touch on iOS and Android', () => {
    for (const [n, subjects] of Object.entries(template.flagships)) {
      for (const subject of subjects) {
        const rows = template.rows.filter((r) => r.subject === subject && r.flagship === Number(n) && r.pass !== 'motion');
        expect(rows.filter((r) => r.pass === 'sr').map((r) => r.at)).toEqual(SR_AT);
        expect(rows.filter((r) => r.pass === 'touch').map((r) => r.at)).toEqual(TOUCH_AT);
      }
    }
    // ≥ 44 flagships × 5 passes (4 SR + touch) of required rows, once flagship 18 exists.
    const flagshipRows = template.rows.filter((r) => r.flagship !== null && r.pass !== 'motion');
    expect(flagshipRows.length).toBeGreaterThanOrEqual((44 - template.missingFlagships.length) * 6);
  });

  it('all 24 SURF flagships are present (REQ-SURF-196)', () => {
    const surf = new Set(template.rows.filter((r) => r.stream === 'surf' && r.flagship !== null).map((r) => r.flagship));
    expect(surf.size).toBe(24);
  });

  it('MAT subjects: Surface/Material Lab, GlassPreferencesPanel and the reduced-motion pass (REQ-MAT-66)', () => {
    for (const subject of ['surface-material-lab', 'glass-preferences-panel']) {
      const rows = template.rows.filter((r) => r.stream === 'mat' && r.subject === subject);
      expect(rows.map((r) => `${r.pass}:${r.at}`)).toEqual([...SR_AT.map((a) => `sr:${a}`), ...TOUCH_AT.map((a) => `touch:${a}`)]);
    }
    const motion = template.rows.filter((r) => r.pass === 'motion');
    expect([...new Set(motion.map((r) => r.subject))].sort()).toEqual(MOTION);
    for (const subject of MOTION) {
      expect(motion.filter((r) => r.subject === subject).map((r) => r.at)).toEqual(SR_AT);
    }
    for (const r of motion) {
      expect(r.stream).toBe('mat');
      expect(r.script).toBe('tests/a11y/manual/scripts/mat/reduced-motion-pass.md');
    }
    // ledger REQ-MAT-66 minimum: ≥10 MAT SR/touch records + 4 motion records
    expect(template.rows.filter((r) => r.stream === 'mat' && r.pass !== 'motion').length).toBeGreaterThanOrEqual(10);
    expect(motion.length).toBeGreaterThanOrEqual(4);
  });

  it('issue #16 non-flagship subjects are present', () => {
    const subjects = new Set(template.rows.map((r) => r.subject));
    for (const s of ['sidebar-drawer', 'mobile-shell', 'empty-state', 'error-state', 'loading-state', 'orientation-change']) {
      expect(subjects.has(s)).toBe(true);
    }
    expect(template.rows.filter((r) => r.subject === 'orientation-change').map((r) => r.pass)).toEqual(['touch', 'touch']);
  });

  it('every row has a story id (gaps only as unexpired baseline rows)', () => {
    const missing = [...new Set(template.rows.filter((r) => r.storyId === null).map((r) => r.subject))].sort();
    expect(template.missingStories.map((m) => m.subject).sort()).toEqual(missing);
    const baselined = baseline.missingStories.map((r) => r.subject).sort();
    expect(missing.filter((s) => !baselined.includes(s))).toEqual([]);
    expect(baselined.filter((s) => !missing.includes(s))).toEqual([]);
    checkBaselineRows(baseline.missingStories);
  });

  it('every row references an existing script (gaps only as unexpired baseline rows)', () => {
    const missing = [...new Set(template.rows.map((r) => r.script))].filter((s) => !existsSync(s)).sort();
    const baselined = baseline.missingScripts.map((r) => r.script).sort();
    expect(missing.filter((s) => !baselined.includes(s))).toEqual([]);
    expect(baselined.filter((s) => !missing.includes(s))).toEqual([]);
    checkBaselineRows(baseline.missingScripts);
  });

  it('RC-1 expiry is computed from the package version', () => {
    expect(pastRc1('5.0.0-alpha.3')).toBe(false);
    expect(pastRc1('5.0.0-beta.1')).toBe(false);
    expect(pastRc1('5.0.0-rc.1')).toBe(true);
    expect(pastRc1('5.0.0')).toBe(true);
    expect(pastRc1('4.3.0')).toBe(false);
    expect(pastRc1('6.0.0-alpha.0')).toBe(true);
  });
});
