/* @jest-environment node */
/* REQ-MAT-64 (D.3-37, REQ-FIN-59): auraglass/no-runtime-contrast everywhere
   except src/backdrops/**. The real exemption file has no rows (the
   src/media/sampling row was deleted with the code), so canvas getImageData
   anywhere under src/media is reported. The expiring-row mechanics are covered
   with fixture rows (fixtures/a11y-eslint-l1/exemptions.json, loaded through
   AG_NO_RUNTIME_CONTRAST_EXEMPTIONS).
   - RuleTester: canvas getImageData in src/media is reported; with the
     fixture row, src/media/sampling is exempt; src/backdrops/** always is.
   - agConfig: both blocks are 'error' (runtime contrast fails in every stream).
   - Exemption rows expire by package version.
   - scripts/mat/a11y-eslint-l1.mjs: loads the ESM plugin, exits 0 on a clean
     tree, 1 on a getImageData call under src/components, 1 on a missing
     rule, 1 on a stale exemption row. */
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Not named `require`: shadowing it collides with babel's CJS import rewrite (`_require` TDZ).
const requireCjs = createRequire(import.meta.url);
const RULE_PATH = join(__dirname, '../../../lint/rules/mat/no-runtime-contrast.cjs');
const SCRIPT = join(__dirname, '../../../scripts/mat/a11y-eslint-l1.mjs');
const FIX = join(__dirname, 'fixtures/a11y-eslint-l1');
const FIXTURE_ROWS = join(FIX, 'exemptions.json');
const ENV = 'AG_NO_RUNTIME_CONTRAST_EXEMPTIONS';
const withFixtureRows = () => {
  beforeAll(() => { process.env[ENV] = FIXTURE_ROWS; });
  afterAll(() => { delete process.env[ENV]; });
};

type Row = { path: string; expires: string; expired: boolean; owner: string; until: string };
const rule = requireCjs(RULE_PATH) as {
  meta: object;
  create: object;
  agConfig: Array<{ files: string[]; ignores?: string[]; severity: string }>;
  compareSemver: (a: string, b: string) => number;
  loadExemptions: (version?: string, file?: string) => Row[];
  EXEMPTIONS_FILE: string;
};

const tester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

describe('auraglass/no-runtime-contrast — real exemption rows (none)', () => {
  tester.run('no-runtime-contrast', rule as never, {
    valid: [
      { code: 'const img = ctx.getImageData(0, 0, 1, 1);', filename: 'src/backdrops/sampler.ts' },
    ],
    invalid: [
      {
        // REQ-MAT-64: no src/media exemption remains once the row is deleted
        code: 'const img = ctx.getImageData(0, 0, 32, 32);',
        filename: 'src/media/sampling/sampleOwnedPixels.ts',
        errors: [{ messageId: 'imageData' }],
      },
      {
        code: 'const img = ctx.getImageData(0, 0, 32, 32);',
        filename: '/repo/src/media/ImageViewer/ImageViewer.tsx',
        errors: [{ messageId: 'imageData' }],
      },
    ],
  });
});

describe('auraglass/no-runtime-contrast — src/media canvas sampling (fixture row)', () => {
  withFixtureRows();
  tester.run('no-runtime-contrast', rule as never, {
    valid: [
      { code: 'const img = ctx.getImageData(0, 0, 32, 32);', filename: 'src/media/sampling/sampleOwnedPixels.ts' },
      { code: 'const img = ctx.getImageData(0, 0, 32, 32);', filename: '/repo/src/media/sampling/sampleOwnedPixels.ts' },
      { code: 'const img = ctx.getImageData(0, 0, 1, 1);', filename: 'src/backdrops/sampler.ts' },
    ],
    invalid: [
      {
        code: 'const img = ctx.getImageData(0, 0, 32, 32);',
        filename: 'src/media/ImageViewer/tone.ts',
        errors: [{ messageId: 'imageData' }],
      },
      {
        code: 'const img = canvas.getContext("2d").getImageData(0, 0, 1, 1);',
        filename: 'src/media/CarouselRail/CarouselRail.tsx',
        errors: [{ messageId: 'imageData' }],
      },
      {
        code: 'const img = ctx.getImageData(0, 0, 1, 1);',
        filename: 'src/components/badge/Badge.tsx',
        errors: [{ messageId: 'imageData' }],
      },
      {
        // the exemption names src/media/sampling/ only, not look-alike paths
        code: 'const img = ctx.getImageData(0, 0, 1, 1);',
        filename: 'src/media/sampling-extra/x.ts',
        errors: [{ messageId: 'imageData' }],
      },
    ],
  });
});

describe('agConfig severity', () => {
  it('every block is error, including the non-MAT src/** block', () => {
    expect(rule.agConfig).toHaveLength(2);
    expect(rule.agConfig.map((c) => c.severity)).toEqual(['error', 'error']);
    const other = rule.agConfig[1]!;
    expect(other.files).toEqual(['src/**/*.{ts,tsx,js,jsx}']);
    expect(other.ignores).toContain('src/backdrops/**');
    expect(other.ignores).not.toContain('src/media/**');
  });
});

describe('expiring exemption rows', () => {
  it('the real exemption file has no rows (src/media/sampling no longer exists)', () => {
    expect(rule.loadExemptions('5.0.0-alpha.0', rule.EXEMPTIONS_FILE)).toEqual([]);
  });

  it('a row may not name a path that does not exist (real file)', () => {
    for (const r of rule.loadExemptions('5.0.0-alpha.0', rule.EXEMPTIONS_FILE)) {
      expect(existsSync(join(__dirname, '../../..', r.path))).toBe(true);
    }
  });
});

describe('expiring exemption rows (fixture rows)', () => {
  withFixtureRows();
  it('names src/media/sampling for SURF until REQ-FIN-86 and expires at 5.0.0-rc.1', () => {
    const rows = rule.loadExemptions('5.0.0-alpha.0');
    expect(rows.map((r) => [r.path, r.owner, r.expires])).toEqual([['src/media/sampling/', 'SURF', '5.0.0-rc.1']]);
    expect(rows[0]!.until).toMatch(/REQ-FIN-86/);
    expect(rows[0]!.expired).toBe(false);
  });

  it('a row is expired at or after its expires version', () => {
    expect(rule.loadExemptions('5.0.0-rc.1')[0]!.expired).toBe(true);
    expect(rule.loadExemptions('5.0.0')[0]!.expired).toBe(true);
    expect(rule.loadExemptions('5.0.0-beta.9')[0]!.expired).toBe(false);
  });

  it('compareSemver follows SemVer pre-release precedence', () => {
    expect(rule.compareSemver('5.0.0-alpha.0', '5.0.0-rc.1')).toBe(-1);
    expect(rule.compareSemver('5.0.0-rc.10', '5.0.0-rc.2')).toBe(1);
    expect(rule.compareSemver('5.0.0', '5.0.0-rc.1')).toBe(1);
    expect(rule.compareSemver('4.9.9', '5.0.0-rc.1')).toBe(-1);
    expect(rule.compareSemver('5.0.0-rc.1', '5.0.0-rc.1')).toBe(0);
  });
});

const runL1 = (args: string[], rows: string | null = FIXTURE_ROWS) => {
  const env = { ...process.env };
  if (rows) env[ENV] = rows; else delete env[ENV];
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('scripts/mat/a11y-eslint-l1.mjs', () => {
  it('loads both rules from the ESM plugin and reports clean on a clean tree', () => {
    const r = runL1(['--root', join(FIX, 'clean')]);
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/clean \(no-runtime-contrast, no-document-escape; 3 file\(s\)\)/);
  });

  it('exits 1 when a getImageData call is added under src/components', () => {
    const r = runL1(['--root', join(FIX, 'violating')]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/src\/components\/bad\.js:3:\d+ auraglass\/no-runtime-contrast/);
    expect(r.err).not.toMatch(/src\/media\/sampling/);
  });

  it('exits 1 when a rule is missing from the plugin', () => {
    const r = runL1(['--root', join(FIX, 'clean'), '--rules', 'no-runtime-contrast,no-such-rule']);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/missing rule: auraglass\/no-such-rule/);
  });

  it('with the real (empty) rows, src/media/sampling getImageData fails the cell', () => {
    const r = runL1(['--root', join(FIX, 'clean')], null);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/src\/media\/sampling\/sample\.js:3:\d+ auraglass\/no-runtime-contrast/);
    expect(r.err).not.toMatch(/is stale/);
  });

  it('exits 1 when an exemption row names a path that no longer exists', () => {
    const r = runL1(['--root', join(FIX, 'stale')]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/exemption src\/media\/sampling\/ is stale/);
  });
});
