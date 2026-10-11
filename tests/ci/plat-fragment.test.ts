/* @jest-environment node */
// PLAT-010..017: structural assertions on ci/plat.gitlab-ci.yml.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
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
    expect(job('plat:audit:backdrop').extends).toEqual(['.ag-aws-remote', '.plat-evidence-nightly']);
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

// FIN-B.2 (B3-2): direct-pushed release/4.1.x jobs (OD-13 canonical, never
// reverted) must pass every verify-ci-fragments rule.
describe('FIN-B.2 direct-push rule fixes', () => {
  it('plat:tag:release-ledger is release-scoped 90-day evidence under .artifacts/plat/<slug>/', () => {
    const j = job('plat:tag:release-ledger');
    expect(j).toBeDefined();
    expect(j.extends).toBe('.plat-release');
    expect(doc['.plat-release'].extends).toContain('.ag-evidence-release');
    expect(j.rules).toEqual([{ if: '$AG_SCOPE == "release"' }]);
    const s = yaml.stringify(j.script, { lineWidth: 0 });
    expect(s).toContain('verify-release-ledger.mjs');
    expect(s).toContain('set -o pipefail');
    expect(s).toContain('.artifacts/plat/$CI_JOB_NAME_SLUG/release-ledger.log');
  });
  it('verify-ci-fragments reports no rule violation in ci/plat.gitlab-ci.yml', () => {
    let out = '';
    try {
      out = execFileSync('node', ['scripts/ci/verify-ci-fragments.mjs'], { encoding: 'utf8', stdio: 'pipe' });
    } catch (e: any) {
      out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
    }
    expect(out.split('\n').filter((l) => l.startsWith('ci/plat.gitlab-ci.yml:'))).toEqual([]);
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
        if (re) return new RegExp((re[1] ?? '').replace(/\\\//g, '/')).test(branch);
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

// REQ-PLAT-51 / REQ-FIN-22 (B3-4): every PLAT job's evidence lives only under
// .artifacts/plat/$CI_JOB_NAME_SLUG/ (plus its §4.13.2 producer paths), via one
// .plat-evidence-{pr,nightly,release} mixin (14d / 30d / 90d).
describe('REQ-PLAT-51 evidence under .artifacts/plat/<job-slug>/', () => {
  const root = yaml.parse(readFileSync('.gitlab-ci.yml', 'utf8')) as Record<string, any>;
  const SLUG_DIR = '.artifacts/plat/$CI_JOB_NAME_SLUG/';
  const isObj = (v: unknown): v is Record<string, any> => v !== null && typeof v === 'object' && !Array.isArray(v);
  const merge = (a: Record<string, any>, b: Record<string, any>): Record<string, any> => {
    const out: Record<string, any> = { ...a };
    for (const [k, v] of Object.entries(b)) out[k] = isObj(v) && isObj(out[k]) ? merge(out[k], v) : v;
    return out;
  };
  // GitLab `extends`: deep merge, later parent wins, the job's own keys win.
  const resolve = (name: string, key: string): any => {
    const node = doc[name] ?? root[name];
    if (!isObj(node)) return undefined;
    let acc: any;
    for (const e of ([] as string[]).concat(node.extends ?? [])) {
      const v = resolve(e, key);
      if (v !== undefined) acc = isObj(v) && isObj(acc) ? merge(acc, v) : v;
    }
    const own = node[key];
    if (own !== undefined) acc = isObj(own) && isObj(acc) ? merge(acc, own) : own;
    return acc;
  };
  const chain = (name: string): string[] => {
    const node = doc[name] ?? root[name];
    const ex = ([] as string[]).concat(node?.extends ?? []);
    return ex.flatMap((e) => [e, ...chain(e)]);
  };
  const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 63).replace(/^-+|-+$/g, '');

  // §4.13.2 producer paths (contract) and the policy.mjs paths kept until FIN-A REQ-FIN-10.
  const PRODUCER: Record<string, string[]> = {
    'plat:build:dist': ['dist/'],
    'plat:package:pack': ['.artifacts/pack/', '.artifacts/plat/pack.env'],
    'plat:build:docs': ['apps/docs/out/', 'apps/docs/public/', 'storybook-static/'],
    'plat:test:visual-4x': ['.artifacts/plat/visual-4x/'],
    'plat:gate:change-class': ['.artifacts/plat/change-class/'],
    pages: ['public/'],
  };
  // Longest scope each job's rules run on: release 90d > nightly 30d > pr/main 14d.
  const TEMPLATE: Record<string, '.plat-evidence-pr' | '.plat-evidence-nightly' | '.plat-evidence-release'> = {
    'plat:build:dist': '.plat-evidence-release',
    'plat:gate:glass-quality': '.plat-evidence-release',
    'plat:test:pack-matrix': '.plat-evidence-pr',
    'plat:test:react19': '.plat-evidence-pr',
    'plat:test:visual-4x': '.plat-evidence-pr',
    'plat:test:canaries': '.plat-evidence-pr',
    'plat:test:cli': '.plat-evidence-pr',
    'plat:test:registry': '.plat-evidence-pr',
    'plat:test:docs': '.plat-evidence-pr',
    'plat:gate:removal': '.plat-evidence-pr',
    'plat:gate:change-class': '.plat-evidence-release',
    'plat:integration:next': '.plat-evidence-release',
    'plat:integration:vite': '.plat-evidence-release',
    'plat:package:pack': '.plat-evidence-release',
    'plat:build:docs': '.plat-evidence-pr',
    pages: '.plat-evidence-pr',
    'plat:release:notes': '.plat-evidence-release',
    'plat:release:verify-dist-tags': '.plat-evidence-release',
    'plat:audit:backdrop': '.plat-evidence-nightly',
  };
  const EXPIRE = { '.plat-evidence-pr': '14 days', '.plat-evidence-nightly': '30 days', '.plat-evidence-release': '90 days' };
  // Every PLAT job except the §4.13.7 verbatim publish job (B3-6..B3-12 jobs join this list when they land).
  const EVIDENCE_JOBS = JOBS.filter((n) => n !== 'plat:publish:npm');
  const platJobs = Object.keys(doc).filter((k) => !k.startsWith('.') && (k.startsWith('plat:') || k === 'pages'));

  it('covers every PLAT job in the fragment', () => {
    expect([...EVIDENCE_JOBS, 'plat:publish:npm'].sort()).toEqual([...platJobs].sort());
    expect(Object.keys(TEMPLATE).sort()).toEqual([...EVIDENCE_JOBS].sort());
  });

  it('the three mixins write only the job dir with when: always and scoped expiry', () => {
    for (const [t, exp] of Object.entries(EXPIRE)) {
      const a = resolve(t, 'artifacts');
      expect(a).toMatchObject({ name: 'evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA', when: 'always', expire_in: exp });
      expect(a.paths).toEqual([SLUG_DIR]);
      expect(resolve(t, 'variables')).toEqual({ AURAGLASS_EVIDENCE_DIR: '.artifacts/plat/$CI_JOB_NAME_SLUG' });
    }
  });

  it.each(EVIDENCE_JOBS)('%s: artifacts.paths ⊂ .artifacts/plat/<slug>/ ∪ producer paths', (n) => {
    const a = resolve(n, 'artifacts');
    expect(a.paths).toContain(SLUG_DIR);
    for (const p of a.paths) expect([SLUG_DIR, ...(PRODUCER[n] ?? [])]).toContain(p);
    expect(a.paths).not.toContain('.artifacts/');
    expect(a.paths).not.toContain('.artifacts/plat/');
    expect(a.when).toBe('always');
    expect(a.name).toBe(n === 'pages' ? 'pages-$CI_COMMIT_SHORT_SHA' : 'evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA');
  });

  it.each(EVIDENCE_JOBS)('%s: uses exactly its scope mixin and expiry', (n) => {
    const mixins = chain(n).filter((t) => /^\.plat-evidence-(pr|nightly|release)$/.test(t));
    // a mixin may extend another mixin; the first one in the chain is the job's own choice
    expect(mixins[0]).toBe(TEMPLATE[n]);
    const t = TEMPLATE[n];
    expect(t).toBeDefined();
    expect(resolve(n, 'artifacts').expire_in).toBe(EXPIRE[t!]);
    expect(resolve(n, 'variables')?.AURAGLASS_EVIDENCE_DIR).toBe('.artifacts/plat/$CI_JOB_NAME_SLUG');
  });

  it.each(EVIDENCE_JOBS)('%s: mixin matches the longest scope its rules run on', (n) => {
    const rules = yaml.stringify(resolve(n, 'rules'));
    const release = /\$AG_SCOPE == "release"|\$CI_COMMIT_TAG/.test(rules);
    const nightly = /\$AG_SCOPE != "release"|"nightly"/.test(rules);
    const expected = release ? '.plat-evidence-release' : nightly ? '.plat-evidence-nightly' : '.plat-evidence-pr';
    expect(TEMPLATE[n]).toBe(expected);
  });

  it('no PLAT script writes evidence to a flat .artifacts/plat/ path outside the job dir or producer paths', () => {
    const allowed = /^\.artifacts\/plat\/(\$CI_JOB_NAME_SLUG(\/|$)|visual-4x\/|change-class\/|pack\.env$)/;
    for (const n of platJobs) {
      const text = yaml.stringify(doc[n].script ?? [], { lineWidth: 0 });
      for (const m of text.matchAll(/\.artifacts\/plat\/[^\s"']*/g)) expect([n, m[0]]).toEqual([n, expect.stringMatching(allowed)]);
      expect([n, /\.artifacts\/(?!plat\b|pack\b)/.test(text)]).toEqual([n, false]);
    }
  });

  it('plat:package:pack keeps the contract tarball dir and dotenv path', () => {
    const s = yaml.stringify(job('plat:package:pack').script, { lineWidth: 0 });
    expect(s).toContain('npm pack --pack-destination .artifacts/pack');
    expect(resolve('plat:package:pack', 'artifacts').reports).toEqual({ dotenv: '.artifacts/plat/pack.env' });
  });

  it('plat:release:notes writes release-notes.md into its job dir and links it there', () => {
    const j = job('plat:release:notes');
    expect(yaml.stringify(j.script, { lineWidth: 0 })).toContain('--out "$AURAGLASS_EVIDENCE_DIR/release-notes.md"');
    const dir = `.artifacts/plat/${slug('plat:release:notes')}/`;
    const links = j.release.assets.links.map((l: any) => l.url);
    expect(links).toContain(`$CI_JOB_URL/artifacts/file/${dir}release-notes.md`);
    expect(links).toContain(`$CI_JOB_URL/artifacts/browse/${dir}`);
  });

  it('plat:publish:npm stays the §4.13.7 verbatim job on the contract release template', () => {
    expect(job('plat:publish:npm').extends).toEqual(['.ag-node', '.ag-evidence-release']);
    expect(resolve('plat:publish:npm', 'artifacts').expire_in).toBe('90 days');
  });

  it('root AURAGLASS_EVIDENCE_DIR stays the contract default; PLAT jobs override it per job', () => {
    expect(root.variables.AURAGLASS_EVIDENCE_DIR).toBe('.artifacts');
  });
});
