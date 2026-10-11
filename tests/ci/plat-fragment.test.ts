/* @jest-environment node */
// PLAT-010..017: structural assertions on ci/plat.gitlab-ci.yml.
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'yaml';

const doc = yaml.parse(readFileSync('ci/plat.gitlab-ci.yml', 'utf8')) as Record<string, any>;
const job = (n: string) => doc[n];

const REQUIRED = [
  'plat:gate:glass-quality',
  'plat:integration:next',
  'plat:integration:vite',
  'plat:gate:change-class',
];
const JOBS = [
  'plat:build:dist', 'plat:gate:glass-quality', 'plat:test:pack-matrix', 'plat:test:react19',
  'plat:test:visual-4x', 'plat:package:pack', 'plat:gate:change-class', 'plat:integration:next',
  'plat:integration:vite', 'plat:test:canaries', 'plat:test:cli', 'plat:test:registry',
  'plat:test:docs', 'plat:gate:removal', 'plat:build:docs', 'pages', 'plat:release:notes',
  'plat:publish:npm', 'plat:release:verify-dist-tags', 'plat:audit:backdrop',
];

describe('plat fragment job set', () => {
  it.each(JOBS)('defines %s', (n) => expect(job(n)).toBeDefined());
  it('uses only .plat-* / root templates', () => {
    for (const [k, v] of Object.entries(doc)) {
      if (k.startsWith('.') || typeof v !== 'object' || v === null) continue;
      const ex = ([] as string[]).concat(v.extends ?? []);
      for (const e of ex) expect(e).toMatch(/^\.(plat-|ag-)/);
    }
  });
  it.each(REQUIRED)('%s starts allow_failure:true pending PLAT-015 activation', (n) => {
    expect(job(n).allow_failure).toBe(true);
  });
});

describe('plat:test:pack-matrix', () => {
  const j = job('plat:test:pack-matrix');
  it('is a 4x-only parallel matrix on Node 20/npm10 + Node 24/npm11', () => {
    const legs = j.parallel.matrix;
    expect(legs).toHaveLength(2);
    expect(legs.map((l: any) => l.AG_PACK_NPM_VERSION)).toEqual(['10.9.4', '11.21.0']);
    expect(yaml.stringify(j.rules)).toContain('$AG_LINE == "4x"');
    expect(j.timeout).toBe('45 minutes');
  });
  it('runs prepublishOnly equivalent + npm publish --dry-run', () => {
    // prepublishOnly = require-ci-publish guard + prepublish:verify; the guard refuses
    // every job but plat:publish:npm, so the matrix runs the verify half directly.
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.scripts.prepublishOnly).toBe('node scripts/ci/require-ci-publish.js && npm run prepublish:verify');
    const s = yaml.stringify(j.script);
    expect(s).toContain('npm run prepublish:verify');
    expect(s).toContain('npm publish --dry-run');
  });
});

describe('plat:test:react19', () => {
  const j = job('plat:test:react19');
  it('has react19-smoke and unit-react19 legs', () => {
    expect(j.parallel.matrix.map((l: any) => l.AG_REACT19_LEG)).toEqual(['react19-smoke', 'unit-react19']);
  });
});

describe('plat:test:visual-4x', () => {
  const j = job('plat:test:visual-4x');
  it('writes the VisualClassReport to the job dir the change-class reader uses', () => {
    expect((j.script as string[]).join('\n')).toContain(
      '--class-report .artifacts/plat/plat-test-visual-4x/visual-class.json',
    );
    expect(j.artifacts.paths).toContain('.artifacts/plat/plat-test-visual-4x/');
    expect(yaml.stringify(j.rules)).toContain('$AG_LINE == "4x"');
  });
  it('runs the consumer-4x vite fixture as a plain, fail-closed step (REQ-PLAT-63)', () => {
    const lines = (j.script as string[]).filter((l) => l.includes('AG_CONSUMER_4X'));
    expect(lines).toEqual(['AG_CONSUMER_4X=1 node scripts/ci/run-vite-integration.js --skip-build']);
    // runs after the visual suite, inside the same evidence-producing job
    const idx = (j.script as string[]).indexOf(lines[0]);
    expect(idx).toBeGreaterThan(
      (j.script as string[]).findIndex((l) => l.includes('test:visual:app-chrome')),
    );
  });
  it('keeps allow_failure: true only while visual-4x has no activation row', () => {
    const rows = JSON.parse(readFileSync('ci/plat/activation.json', 'utf8')).activations as any[];
    const activated = rows.some((r) => r.job === 'plat:test:visual-4x' && r.line === '4x');
    expect(j.allow_failure).toBe(!activated);
  });
});

// B3-6 (4x) — REQ-FIN-10 transfer, REQ-PLAT-05 item 8, REQ-PLAT-19.
describe('plat:gate:change-class (4x wiring)', () => {
  const j = job('plat:gate:change-class');
  const v = job('plat:test:visual-4x');

  // Evaluates the simple `rules:if` expressions used in this fragment
  // ($VAR, "literal", ==, !=, &&, ||, parens) for one variable set.
  const ifMatches = (expr: string, vars: Record<string, string>) => {
    const js = expr
      .replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, n) => JSON.stringify(vars[n] ?? ''))
      .replace(/==/g, '===')
      .replace(/!=/g, '!==');
    // eslint-disable-next-line no-new-func
    return Boolean(new Function(`return (${js});`)());
  };
  const runs = (jb: any, vars: Record<string, string>) =>
    (jb.rules as any[]).some((r) => r.when !== 'never' && (r.if == null || ifMatches(r.if, vars)));
  const pipelines = [
    { AG_LINE: '4x', AG_SCOPE: 'pr', CI_COMMIT_TAG: '' },
    { AG_LINE: '4x', AG_SCOPE: 'main', CI_COMMIT_TAG: '' },
    { AG_LINE: '4x', AG_SCOPE: 'nightly', CI_COMMIT_TAG: '' },
    { AG_LINE: '4x', AG_SCOPE: 'release', CI_COMMIT_TAG: 'v4.3.0' },
    { AG_LINE: '5x', AG_SCOPE: 'pr', CI_COMMIT_TAG: '' },
    { AG_LINE: '5x', AG_SCOPE: 'release', CI_COMMIT_TAG: 'v5.0.0-rc.1' },
  ];

  it('needs plat:test:visual-4x with its artifacts (ordered after it)', () => {
    const needs = (j.needs as any[]).map((n) => (typeof n === 'string' ? { job: n } : n));
    const vis = needs.find((n) => n.job === 'plat:test:visual-4x');
    expect(vis).toEqual({ job: 'plat:test:visual-4x', artifacts: true, optional: true });
  });

  it('visual-4x runs in every 4x pipeline where change-class runs, so the need always resolves on 4x', () => {
    const fourX = pipelines.filter((p) => p.AG_LINE === '4x' && runs(j, p));
    expect(fourX.map((p) => p.AG_SCOPE).sort()).toEqual(['main', 'pr', 'release']);
    for (const p of fourX) expect([p.AG_SCOPE, runs(v, p)]).toEqual([p.AG_SCOPE, true]);
  });

  it('the need is optional only because 5x pipelines have no visual-4x job', () => {
    for (const p of pipelines.filter((x) => x.AG_LINE === '5x')) {
      expect([p.AG_SCOPE, runs(j, p), runs(v, p)]).toEqual([p.AG_SCOPE, true, false]);
    }
  });

  it('the report path visual-4x writes is the one classify-change reads on 4x', () => {
    // policy.mjs is ESM; resolve the reader path in a child node process.
    const reader = execFileSync(process.execPath, [
      '--input-type=module',
      '-e',
      "import { relPaths } from './scripts/release/lib/policy.mjs';" +
        "process.stdout.write(relPaths('/ROOT').visualReport('4x').replace('/ROOT/', ''));",
    ], { encoding: 'utf8' });
    expect(reader).toBe('.artifacts/plat/plat-test-visual-4x/visual-class.json');
    expect((v.script as string[]).join('\n')).toContain(`--class-report ${reader}`);
    // the needed job uploads that directory, so the gate downloads it
    expect(v.artifacts.paths).toContain(reader.replace('visual-class.json', ''));
  });
});

describe('plat:package:pack', () => {
  const j = job('plat:package:pack');
  it('needs the four gates within the fragment', () => {
    const names = j.needs.map((n: any) => n.job ?? n);
    for (const g of REQUIRED) expect(names).toContain(g);
  });
  it('runs dry-run.mjs --tag on release scope and writes the AURAGLASS_TARBALL dotenv', () => {
    const s = yaml.stringify(j.script);
    expect(s).toContain('dry-run.mjs --tag "$CI_COMMIT_TAG" --line "$AG_LINE"');
    expect(j.artifacts.reports.dotenv).toBe('.artifacts/plat/pack.env');
  });
});

describe('publish/release jobs', () => {
  it('plat:publish:npm is the §4.13.7 verbatim job', () => {
    const j = job('plat:publish:npm');
    expect(j.extends).toEqual(['.ag-node', '.ag-evidence-release']);
    expect(j.tags).toEqual(['saas-linux-small-amd64']);
    expect(j.environment).toEqual({ name: 'npm-publish', deployment_tier: 'production' });
    expect(j.id_tokens.NPM_ID_TOKEN.aud).toBe('npm:registry.npmjs.org');
    expect(j.id_tokens.SIGSTORE_ID_TOKEN.aud).toBe('sigstore');
    const s = yaml.stringify(j.script);
    expect(s).toContain('verify-release-verdict.mjs');
    expect(s).toContain('publish.mjs');
    expect(s).toContain('$AG_V4_DIST_TAG');
  });
  it('plat:release:notes creates a GitLab Release via the release: keyword', () => {
    const j = job('plat:release:notes');
    expect(j.stage).toBe('publish');
    expect(yaml.stringify(j.rules)).toContain('$AG_SCOPE == "release"');
    expect(j.release.tag_name).toBe('$CI_COMMIT_TAG');
    expect(yaml.stringify(j.release.assets)).toContain('dist-maps.tgz');
    expect(yaml.stringify(j.release.assets)).toContain('release-notes.md');
  });
  it('plat:release:verify-dist-tags is manual on release scope', () => {
    const r = job('plat:release:verify-dist-tags').rules[0];
    expect(r.when).toBe('manual');
    expect(r.if).toContain('release');
  });
});

// B3-7 4x port (REQ-FIN-09 / -40 / -41 CI half; REQ-PLAT-89, -91, -92, -93; AC-FIN-09).
describe('plat:test:cli and plat:audit:backdrop wiring (B3-7, 4.3 scope)', () => {
  const root = yaml.parse(readFileSync('.gitlab-ci.yml', 'utf8')) as Record<string, any>;
  const STAGES: string[] = root.stages;
  const cliText = yaml.stringify(job('plat:test:cli').script, { lineWidth: 0 });
  const cliRows = cliText.split('\n').map((l) => l.trim());
  const branch4x = cliText.slice(cliText.indexOf('if [ "$AG_LINE" = "4x" ]'), cliText.indexOf('\n  else\n'));
  const branch5x = cliText.slice(cliText.indexOf('\n  else\n'));

  it('plat:test:cli needs plat:package:pack with artifacts, in a stage after package', () => {
    const j = job('plat:test:cli');
    expect(j.needs).toEqual([{ job: 'plat:package:pack', artifacts: true }]);
    expect(STAGES.indexOf(j.stage)).toBeGreaterThan(STAGES.indexOf(job('plat:package:pack').stage));
    // the need always resolves: pack runs on every scope plat:test:cli runs on
    expect(yaml.stringify(job('plat:package:pack').rules)).toContain('$AG_SCOPE == "pr" || $AG_SCOPE == "main"');
  });
  it('4x runs the @auraglass/cli workspace suite with npm test -w, failing closed without a test script', () => {
    expect(branch4x).toContain('npm test -w packages/cli -- --ci');
    expect(branch4x).toMatch(/PENDING: npm test -w packages\/cli has no test script[^"]*"; exit 1; }/);
    expect(branch4x).toContain('--outputFile="$CI_PROJECT_DIR/.artifacts/plat/$CI_JOB_NAME_SLUG/cli-jest.json"');
    // the 4x workspace exists and has the test script the job runs
    const pkg = JSON.parse(readFileSync('packages/cli/package.json', 'utf8'));
    expect(typeof pkg.scripts.test).toBe('string');
    expect(JSON.parse(readFileSync('package.json', 'utf8')).workspaces).toContain('packages/cli');
  });
  it('4x does not run 5.0-only workspaces or tests/types/plat', () => {
    expect(branch4x).not.toMatch(/packages\/(registry|mcp|labs)/);
    expect(branch4x).not.toContain('tests/types/plat');
  });
  it('5x runs the four workspace suites, then tsc over the packed d.ts, then the canary', () => {
    expect(branch5x).toContain('for w in cli registry mcp labs; do');
    expect(branch5x).toMatch(/PENDING: npm test -w packages\/\$w has no test script[^"]*"; exit 1; }/);
    const ws = cliRows.indexOf('npm test -w packages/cli -w packages/registry -w packages/mcp -w packages/labs');
    const tsc = cliRows.indexOf('npx tsc -p tests/types/plat');
    expect(ws).toBeGreaterThan(-1);
    expect(tsc).toBeGreaterThan(ws);
    expect(cliRows[tsc - 1]).toMatch(/^test -f tests\/types\/plat\/tsconfig\.json \|\| \{ echo "PENDING: [^"]*"; exit 1; \}$/);
    expect(cliRows.indexOf('npx playwright test tests/dx/codemod-canary.spec.ts')).toBeGreaterThan(tsc);
    expect(cliText).not.toContain('npm test -- --ci packages/cli');
  });
  it('plat:test:cli keeps evidence under .artifacts/plat/<slug>/', () => {
    const a = job('plat:test:cli').artifacts;
    expect(a.paths).toEqual(['.artifacts/plat/$CI_JOB_NAME_SLUG/']);
    expect(a.when).toBe('always');
    expect(a.name).toBe('evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA');
  });

  it('plat:audit:backdrop is a manual job on the Playwright image', () => {
    const j = job('plat:audit:backdrop');
    expect(j.extends).toBe('.plat-playwright');
    expect(j.image).toBe('$AG_PLAYWRIGHT_IMAGE');
    expect(root.variables.AG_PLAYWRIGHT_IMAGE).toMatch(/^mcr\.microsoft\.com\/playwright:/);
    // with rules: present, `when` must be on the rule to take effect
    expect(j.rules).toEqual([{ if: '$AG_LINE == "5x" && $AG_SCOPE != "release"', when: 'manual' }]);
    expect(j.allow_failure).toBe(true);
  });
  it('plat:audit:backdrop runs the audit Playwright config', () => {
    const rows = yaml.stringify(job('plat:audit:backdrop').script, { lineWidth: 0 }).split('\n').map((l) => l.trim());
    expect(rows).toContain('- npx playwright test -c packages/cli/audit/playwright.config.ts');
    expect(rows.join('\n')).toMatch(/test -f packages\/cli\/audit\/playwright\.config\.ts \|\| \{ echo "PENDING: [^"]*"; exit 1; \}/);
  });
});

// REQ-PLAT-62 (REQ-FIN-36 producer, REQ-FIN-22 wiring): v4.3 tag gates and the
// @auraglass/cli@0.x publish.
describe('REQ-PLAT-62 tag jobs', () => {
  const V43 = /\$CI_COMMIT_TAG =~ \/\^v4\\\.3\\\.\//;
  const evidence = (n: string) => {
    const a = job(n).artifacts;
    expect(a.name).toBe('evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA');
    expect(a.when).toBe('always');
    expect(a.expire_in).toBe('90 days');
    return a.paths as string[];
  };
  const idTokenJobs = Object.entries(doc)
    .filter(([k, v]) => !k.startsWith('.') && v && typeof v === 'object' && (v as any).id_tokens)
    .map(([k]) => k);

  it('only plat:publish:npm holds id_tokens or the npm-publish environment', () => {
    expect(idTokenJobs).toEqual(['plat:publish:npm']);
    expect(job('plat:publish:npm').stage).toBe('publish');
    const envJobs = Object.entries(doc)
      .filter(([k, v]) => !k.startsWith('.') && v && typeof v === 'object' && (v as any).environment?.name === 'npm-publish')
      .map(([k]) => k);
    expect(envJobs).toEqual(['plat:publish:npm']);
    expect(job('plat:publish:cli')).toBeUndefined();
  });

  it('plat:release:verify-codemods runs on v4.3.* tags and writes per-job evidence', () => {
    const j = job('plat:release:verify-codemods');
    expect(j.stage).toBe('publish');
    expect(j.rules).toHaveLength(1);
    expect(j.rules[0].if).toContain('$AG_SCOPE == "release"');
    expect(j.rules[0].if).toMatch(V43);
    expect(evidence('plat:release:verify-codemods')).toEqual(['.artifacts/plat/$CI_JOB_NAME_SLUG/']);
    const s = (j.script as string[]).join('\n');
    expect(s).toContain('.artifacts/plat/$CI_JOB_NAME_SLUG/codemod-fragments.json');
    for (const f of ['mat', 'cmp', 'surf']) expect(s).toContain(f);
    expect(s).toContain('exit "$fail"');
    expect(s).not.toMatch(/\|\|\s*true/);
    expect(s).toContain('docs/release/codemods-qual.md');
    expect(s).not.toContain('operator-codemods-qual.md');
    expect(existsSync('docs/release/codemods-qual.md')).toBe(true);
  });

  it('plat:release:deprecation-coverage uploads deprecation-coverage.json and gates --ga on v4.3.*', () => {
    const j = job('plat:release:deprecation-coverage');
    expect(j.rules[0].if).toBe('$AG_SCOPE == "release"');
    expect(evidence('plat:release:deprecation-coverage')).toEqual(['.artifacts/plat/deprecation-coverage.json']);
    const s = (j.script as string[]).join('\n');
    expect(s).toMatch(/v4\.3\.\*\)\s+node scripts\/release\/verify-breaking-register\.mjs --coverage-only --ga/);
    expect(existsSync('scripts/release/verify-breaking-register.mjs')).toBe(true);
  });

  it('plat:release:verify-cli is a manual blocking credential-free gate on v4.3.* tags', () => {
    const j = job('plat:release:verify-cli');
    expect(j.stage).toBe('publish');
    expect(j.id_tokens).toBeUndefined();
    expect(j.environment).toBeUndefined();
    expect(j.rules).toHaveLength(1);
    expect(j.rules[0].if).toMatch(V43);
    expect(j.rules[0].when).toBe('manual');
    expect(j.rules[0].allow_failure).toBe(false);
    expect(evidence('plat:release:verify-cli')).toEqual(['.artifacts/plat/$CI_JOB_NAME_SLUG/']);
    const s = (j.script as string[]).join('\n');
    expect(s.indexOf('npm test -w packages/cli')).toBeGreaterThanOrEqual(0);
    expect(s.indexOf('npm run build -w packages/cli')).toBeGreaterThan(s.indexOf('npm test -w packages/cli'));
    expect(s).toContain('migrate 4to5 --dry-run --json --allow-todo --cwd tests/fixtures/consumer-4x');
    expect(s).toContain('filesChanged>0');
    expect(s).not.toMatch(/\|\|\s*true|2>\/dev\/null/);
    expect(existsSync('tests/fixtures/consumer-4x')).toBe(true);
  });

  it('plat:publish:npm publishes @auraglass/cli only on v4.3.* with verify-cli evidence', () => {
    const j = job('plat:publish:npm');
    const needs = j.needs.map((n: any) => n.job ?? n);
    for (const n of ['plat:release:verify-codemods', 'plat:release:deprecation-coverage', 'plat:release:verify-cli']) {
      expect(needs).toContain(n);
    }
    const cli = j.needs.find((n: any) => n.job === 'plat:release:verify-cli');
    expect(cli).toMatchObject({ artifacts: true, optional: true });
    const s = (j.script as string[]).join('\n');
    const caseAt = s.indexOf('v4.3.*)');
    expect(caseAt).toBeGreaterThan(0);
    const guard = s.indexOf('test -s .artifacts/plat/plat-release-verify-cli/migrate-4to5-dry-run.json');
    const publish = s.indexOf('npm publish -w packages/cli --access public --provenance');
    expect(guard).toBeGreaterThan(caseAt);
    expect(publish).toBeGreaterThan(guard);
  });
});

describe('pages job', () => {
  const j = job('pages');
  it('runs only on $AG_PAGES_BRANCH with the pages environment', () => {
    const r = yaml.stringify(j.rules);
    expect(r).toContain('$CI_COMMIT_BRANCH == $AG_PAGES_BRANCH');
    expect(j.environment).toEqual({ name: 'pages', deployment_tier: 'production', url: '$CI_PAGES_URL' });
    expect(j.artifacts.paths).toContain('public/');
  });
  it('needs plat:build:docs and optional qual:build:storybook', () => {
    const names = j.needs.map((n: any) => `${n.job}:${String(n.optional ?? false)}`);
    expect(names).toContain('plat:build:docs:false');
    expect(names).toContain('qual:build:storybook:true');
  });
});

// B3-8 4x port (REQ-FIN-43 / REQ-FIN-26 wiring; REQ-PLAT-99, REQ-PLAT-07; AC-FIN-26).
describe('plat:build:docs wiring (B3-8)', () => {
  const root = yaml.parse(readFileSync('.gitlab-ci.yml', 'utf8')) as Record<string, any>;
  const STAGES: string[] = root.stages;
  const j = job('plat:build:docs');

  // Runs the job's script lines in one bash -eo pipefail shell (GitLab runner
  // semantics) inside a scratch project with a stubbed `npm` on PATH.
  const runScript = (opts: { version: string; tarballs: string[]; docsBuild: boolean; line?: string }) => {
    const dir = mkdtempSync(join(tmpdir(), 'b3-8-'));
    const bin = join(dir, 'bin');
    try {
      mkdirSync(bin);
      mkdirSync(join(dir, '.artifacts/pack'), { recursive: true });
      for (const t of opts.tarballs) writeFileSync(join(dir, '.artifacts/pack', t), 'tgz');
      const scripts = opts.docsBuild ? { 'docs:build': 'stub' } : {};
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'aura-glass', version: opts.version, scripts }));
      // `npm run docs:build` records which tarball the docs build was given.
      writeFileSync(
        join(bin, 'npm'),
        '#!/bin/sh\n[ "$1 $2" = "run docs:build" ] || exit 9\nmkdir -p apps/docs/out\nprintf %s "$AURAGLASS_TARBALL" > apps/docs/out/index.html\n',
      );
      chmodSync(join(bin, 'npm'), 0o755);
      const res = spawnSync('bash', ['-eo', 'pipefail', '-c', (j.script as string[]).join('\n')], {
        cwd: dir,
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, AG_LINE: opts.line ?? '4x', AURAGLASS_TARBALL: '' },
      });
      const out = join(dir, 'apps/docs/out/index.html');
      return { status: res.status, log: `${res.stdout}${res.stderr}`, built: existsSync(out) ? readFileSync(out, 'utf8') : null };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it('needs plat:package:pack with artifacts, in the package stage, before pages', () => {
    expect(j.needs).toEqual([{ job: 'plat:package:pack', artifacts: true }]);
    expect(j.stage).toBe('package');
    expect(STAGES.indexOf(j.stage)).toBeGreaterThanOrEqual(STAGES.indexOf(job('plat:package:pack').stage));
    expect(STAGES.indexOf(job('pages').stage)).toBeGreaterThan(STAGES.indexOf(j.stage));
    // the need always resolves: pack runs on every scope plat:build:docs runs on
    expect(yaml.stringify(j.rules)).toContain('$AG_SCOPE == "pr" || $AG_SCOPE == "main"');
    expect(yaml.stringify(job('plat:package:pack').rules)).toContain('$AG_SCOPE == "pr" || $AG_SCOPE == "main"');
  });
  it('builds the docs from the tarball named by the package.json version, not another tarball in .artifacts/pack', () => {
    const r = runScript({ version: '4.3.0', tarballs: ['aura-glass-4.2.9.tgz', 'aura-glass-4.3.0.tgz'], docsBuild: true });
    expect(r.status).toBe(0);
    expect(r.built).toBe('.artifacts/pack/aura-glass-4.3.0.tgz');
    expect(r.log).toContain('docs consume .artifacts/pack/aura-glass-4.3.0.tgz');
  });
  it('fails closed when the version tarball is missing from the pack artifacts', () => {
    const r = runScript({ version: '4.3.0', tarballs: ['aura-glass-4.2.9.tgz'], docsBuild: true });
    expect(r.status).toBe(1);
    expect(r.log).toContain('.artifacts/pack/aura-glass-4.3.0.tgz missing from the plat:package:pack artifacts');
    expect(r.built).toBeNull();
  });
  it('fails closed (PENDING, exit 1) while the 4.x docs:build producer is absent', () => {
    const r = runScript({ version: '4.3.0', tarballs: ['aura-glass-4.3.0.tgz'], docsBuild: false });
    expect(r.status).toBe(1);
    expect(r.log).toContain('PENDING: npm script docs:build');
  });
  it('pages keeps needs: plat:build:docs and optional plat:test:registry', () => {
    const p = job('pages');
    expect(p.needs).toContainEqual({ job: 'plat:build:docs', artifacts: true });
    expect(p.needs).toContainEqual({ job: 'plat:test:registry', artifacts: true, optional: true });
  });
});

describe('activation.json', () => {
  it('exists with the documented row shape', () => {
    const a = JSON.parse(readFileSync('ci/plat/activation.json', 'utf8'));
    expect(a.version).toBe(1);
    expect(Array.isArray(a.activations)).toBe(true);
  });
});

// REQ-PLAT-05 / REQ-PLAT-39 items fixed in #126 (REQ-FIN-22 ledger AC).
describe('REQ-PLAT-05 fixes (fail-closed tag gates)', () => {
  it.each(REQUIRED)('%s: a $CI_COMMIT_TAG rule comes first and sets allow_failure:false', (n) => {
    const r = job(n).rules[0];
    expect(r.if).toBe('$CI_COMMIT_TAG');
    expect(r.allow_failure).toBe(false);
  });
  it('require-activated.mjs is the first, unconditional script line of plat:package:pack', () => {
    const j = job('plat:package:pack');
    expect(j.before_script).toBeUndefined(); // only the shared .ag-node npm ci install
    expect(j.script[0]).toBe('node scripts/ci/require-activated.mjs --line "$AG_LINE"');
  });
  it('plat:package:pack fails closed on 4x when verify:pack is missing', () => {
    const s = yaml.stringify(job('plat:package:pack').script);
    expect(s).toContain('verify:pack missing on 4x');
    expect(s).not.toMatch(/\|\|\s*echo "PENDING: npm script verify:pack"/);
  });
  it('every PENDING guard is a single YAML string that exits non-zero', () => {
    for (const [k, v] of Object.entries(doc)) {
      if (k.startsWith('.') || typeof v !== 'object' || v === null || !Array.isArray((v as any).script)) continue;
      for (const line of (v as any).script) {
        expect(typeof line).toBe('string'); // an unquoted `{ … }` guard parses as a mapping
        if (/PENDING:/.test(line)) expect(line).toMatch(/exit 1/);
      }
    }
  });
  it('4x plat:build:docs builds the docs site into apps/docs/out (not Storybook) and fails closed until docs:build exists', () => {
    const s = yaml.stringify(job('plat:build:docs').script, { lineWidth: 0 });
    const fourX = s.slice(s.indexOf('"$AG_LINE" = "4x"'), s.indexOf('else'));
    expect(fourX).not.toContain('build-storybook');
    expect(fourX).toContain('npm run docs:build');
    expect(fourX).toMatch(/PENDING: npm script docs:build[^\n]*; exit 1;/);
    expect(fourX).toContain('test -f apps/docs/out/index.html');
    expect(job('plat:build:docs').artifacts.paths).toContain('apps/docs/out/');
  });
  it('pages optionally consumes plat:test:registry artifacts', () => {
    const n = job('pages').needs.find((x: any) => x.job === 'plat:test:registry');
    expect(n).toEqual({ job: 'plat:test:registry', artifacts: true, optional: true });
  });
  it('plat:release:verify-dist-tags is manual on main/pr and writes evidence under .artifacts/plat/<slug>/', () => {
    const j = job('plat:release:verify-dist-tags');
    const mainRule = j.rules.find((r: any) => /main/.test(r.if));
    expect(mainRule).toMatchObject({ when: 'manual', allow_failure: true });
    expect(yaml.stringify(j.script, { lineWidth: 0 })).toContain('--out ".artifacts/plat/$CI_JOB_NAME_SLUG/dist-tags.json"');
  });
});

describe('root .gitlab-ci.yml (R1 workflow prefixes, stage order)', () => {
  const root = yaml.parse(readFileSync('.gitlab-ci.yml', 'utf8')) as Record<string, any>;

  // Evaluate workflow:rules for a branch push: the first rule whose `if`
  // matches wins. Only the $CI_COMMIT_BRANCH forms used by the file are modelled.
  const evalRules = (branch: string) => {
    for (const r of root.workflow.rules) {
      if (!r.if) return r.when === 'never' ? null : r.variables ?? {};
      if (/\$CI_PIPELINE_SOURCE|\$CI_COMMIT_TAG/.test(r.if) && !/\$CI_COMMIT_BRANCH/.test(r.if)) continue;
      const alts = String(r.if).split('||').map((s) => s.trim());
      const hit = alts.some((a) => {
        const eq = a.match(/^\$CI_COMMIT_BRANCH == "([^"]+)"$/);
        if (eq) return branch === eq[1];
        const re = a.match(/^\$CI_COMMIT_BRANCH =~ \/(.+)\/$/);
        if (re) return new RegExp(re[1].replace(/\\\//g, '/')).test(branch);
        return false;
      });
      if (hit) return r.variables ?? {};
    }
    return null;
  };

  it.each([
    ['next-fin/b-ci', '5x'],
    ['4x-fin/b-ci', '4x'],
    ['4x11-fin/b-ci', '4x'],
    ['4x11-plat/react19-legs', '4x'],
    ['4x11-qual/x', '4x'],
    ['contract/c0', '5x'],
    ['sync/anything', '5x'],
    ['sync/fragments-codemods-1', '4x'],
    ['release/4.1.x', '4x'],
  ])('%s runs a pipeline on line %s', (branch, line) => {
    const v = evalRules(branch);
    expect(v).not.toBeNull();
    expect(v!.AG_LINE).toBe(line);
  });
  it('unknown prefixes get when: never', () => {
    expect(evalRules('feature/foo')).toBeNull();
  });
  it('package precedes certify (qual:certify:* need plat:package:pack)', () => {
    expect(root.stages).toEqual(['contract', 'build', 'test', 'package', 'certify', 'deploy', 'publish']);
  });
  it('contract:ci-fragments fetches its base ref before diffing', () => {
    const j = root['contract:ci-fragments'];
    expect(j.variables.GIT_DEPTH).toBe('0');
    const fetchIdx = j.script.findIndex((l: string) => l.startsWith('git fetch'));
    const runIdx = j.script.findIndex((l: string) => l.includes('verify-ci-fragments.mjs'));
    expect(fetchIdx).toBeGreaterThanOrEqual(0);
    expect(fetchIdx).toBeLessThan(runIdx);
    expect(j.script[fetchIdx]).toContain('refs/remotes/origin/$BASE');
  });
});
