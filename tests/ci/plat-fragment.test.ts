/* @jest-environment node */
// PLAT-010..017: structural assertions on ci/plat.gitlab-ci.yml.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
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
    const s = yaml.stringify(j.script);
    expect(s).toContain('prepublishOnly');
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
  it('writes the VisualClassReport to .artifacts/plat/visual-4x/', () => {
    expect(yaml.stringify(j.script)).toContain('.artifacts/plat/visual-4x/visual-class.json');
    expect(yaml.stringify(j.rules)).toContain('$AG_LINE == "4x"');
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
  it('plat:audit:backdrop is manual (remote runner pending OD-11)', () => {
    expect(job('plat:audit:backdrop').extends).toBe('.ag-aws-remote');
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
