/* REQ-QUAL-30 L12 coverage floors: the committed floors, the --coverageThreshold JSON (seed dirs excluded), floors only
   increase against the merge base, and a src/material change below 90 % lines makes jest exit non-zero. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildCoveragePlan, compareRatchets, evaluateCoverage, flagshipDirs, mergeBaseRatchets, parseRatchets, readRatchets, seedDirs,
  type Ratchets,
} from '../src/evidence/coverageThreshold.ts';
import { REPO, cleanupRepos, makeRepo } from './helpers/laneFixture.ts';

afterAll(cleanupRepos);

const committed = readRatchets(REPO);

describe('certification/ratchets.json', () => {
  it('holds the REQ-QUAL-30 floors (lines/branches)', () => {
    expect(committed.floors).toEqual({
      global: { lines: 70, branches: 60 },
      'src/material/': { lines: 90, branches: 85 },
      'src/theme/': { lines: 80, branches: 70 },
      flagship: { lines: 85, branches: 75 },
    });
  });

  it('rejects malformed ratchets', () => {
    expect(() => parseRatchets('{"version":1,"floors":{"global":{"lines":70,"branches":60}}}')).toThrow('floors.flagship is required');
    expect(() => parseRatchets('{"version":1,"floors":{"global":{"lines":170,"branches":60},"flagship":{"lines":1,"branches":1}}}')).toThrow("floors['global']");
    expect(() => parseRatchets('{"version":1,"floors":{"global":{"lines":1,"branches":1},"flagship":{"lines":1,"branches":1},"material":{"lines":1,"branches":1}}}')).toThrow('src/<dir>/');
  });
});

describe('floors only increase', () => {
  const lower = (r: Ratchets, key: string, field: 'lines' | 'branches', by = 1): Ratchets =>
    ({ ...r, floors: { ...r.floors, [key]: { ...r.floors[key]!, [field]: r.floors[key]![field] - by } } }) as Ratchets;

  it('flags every lowered or removed floor, accepts raises', () => {
    expect(compareRatchets(committed, committed)).toEqual([]);
    expect(compareRatchets(committed, lower(committed, 'src/material/', 'lines'))).toEqual(["floor 'src/material/' lines decreased 90 → 89"]);
    expect(compareRatchets(committed, lower(committed, 'global', 'branches', 10))).toEqual(["floor 'global' branches decreased 60 → 50"]);
    const { 'src/theme/': _t, ...rest } = committed.floors;
    expect(compareRatchets(committed, { ...committed, floors: rest as Ratchets['floors'] })).toEqual(["floor 'src/theme/' was removed (base 80/70)"]);
    expect(compareRatchets(committed, lower(committed, 'flagship', 'lines', -5))).toEqual([]);
  });

  it('compares against ratchets.json at the merge base (a real git history)', () => {
    const root = makeRepo({ files: { 'certification/ratchets.json': JSON.stringify(committed) } });
    const git = (...a: string[]) => execFileSync('git', ['-c', 'user.email=t@example.invalid', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', ...a], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    git('init', '-q', '-b', 'next');
    git('add', '-A'); git('commit', '-qm', 'base');
    git('checkout', '-qb', 'next-fin/g-x');
    writeFileSync(join(root, 'certification/ratchets.json'), JSON.stringify(lower(committed, 'src/material/', 'lines', 5)));
    git('commit', '-qam', 'lower');
    const base = mergeBaseRatchets(root, 'next');
    expect(base).toEqual(committed);
    expect(compareRatchets(base!, readRatchets(root))).toEqual(["floor 'src/material/' lines decreased 90 → 85"]);
    expect(() => mergeBaseRatchets(root, 'origin/does-not-exist')).toThrow();
  });
});

describe('--coverageThreshold plan', () => {
  it('has a group per floor directory and per flagship directory, and excludes seed directories (pending)', () => {
    const plan = buildCoveragePlan(committed, { flagship: ['src/components/button/', 'src/material/lens/', 'src/date/'], seed: ['src/date/', 'src/contracts/'] });
    expect(plan.threshold).toEqual({
      global: { lines: 70, branches: 60 },
      './src/components/button/': { lines: 85, branches: 75 },
      './src/material/': { lines: 90, branches: 85 },
      './src/material/lens/': { lines: 85, branches: 75 },
      './src/theme/': { lines: 80, branches: 70 },
    });
    expect(plan.pending).toEqual([{ key: './src/date/', reason: 'src/date/ carries @ag-contract-seed' }]);
    expect(plan.coveragePathIgnorePatterns).toEqual(['/node_modules/', '<rootDir>/src/date/', '<rootDir>/src/contracts/']);
  });

  it('derives flagship and seed directories from the repository', () => {
    const flags = flagshipDirs(REPO);
    expect(flags.length).toBeGreaterThan(0);
    for (const d of flags) expect(existsSync(join(REPO, d))).toBe(true);
    expect(seedDirs(REPO)).toContain('src/contracts/');
  });

  it('a src/material change below 90 % lines makes the jest run exit non-zero', () => {
    const root = makeRepo({
      files: {
        'src/material/half.js': 'exports.used = (x) => x + 1;\nexports.unused = (x) => {\n  const y = x * 2;\n  return y - 1;\n};\n',
        'src/other/full.js': 'exports.f = () => 1;\n',
        'src/theme/full.js': 'exports.t = () => 2;\n',
        'tests/half.test.js': "const h = require('../src/material/half.js'); const o = require('../src/other/full.js'); const t = require('../src/theme/full.js');\ntest('used', () => { expect(h.used(1)).toBe(2); expect(o.f()).toBe(1); expect(t.t()).toBe(2); });\n",
      },
    });
    const plan = buildCoveragePlan(committed, { flagship: [], seed: [] });
    const config = JSON.stringify({ rootDir: root, testEnvironment: 'node', transform: {}, testMatch: ['<rootDir>/tests/**/*.test.js'] });
    const run = spawnSync(process.execPath, [join(REPO, 'node_modules/jest/bin/jest.js'), '--config', config, '--ci', '--coverage',
      `--coverageThreshold=${JSON.stringify(plan.threshold)}`, `--coverageDirectory=${join(root, 'cov')}`, '--coverageReporters=json-summary',
      '--collectCoverageFrom=src/**/*.js'], { cwd: root, encoding: 'utf8' });
    expect(run.status).not.toBe(0);
    const out = `${run.stdout}${run.stderr}`;
    expect(out).toMatch(/Coverage for lines \(50%\) does not meet "\.\/src\/material\/" threshold \(90%\)/);
    expect(out).not.toMatch(/src\/theme\/|global threshold/);
    const groups = evaluateCoverage(JSON.parse(readFileSync(join(root, 'cov/coverage-summary.json'), 'utf8')), plan.threshold, root);
    expect(groups.find((g) => g.key === './src/material/')).toMatchObject({ state: 'fail', files: 1, lines: 50 });
    expect(groups.find((g) => g.key === './src/theme/')).toMatchObject({ state: 'pass', files: 1 });
    expect(groups.find((g) => g.key === 'global')).toMatchObject({ state: 'pass', files: 1, lines: 100 });
    // a floor directory with no coverage data fails (as jest does), it is never a vacuous pass
    const empty = evaluateCoverage({ total: { lines: { total: 0, covered: 0 }, branches: { total: 0, covered: 0 } } }, plan.threshold, root);
    expect(empty.find((g) => g.key === './src/theme/')).toMatchObject({ state: 'fail', files: 0, reason: 'no coverage data for this group' });
  });
});
