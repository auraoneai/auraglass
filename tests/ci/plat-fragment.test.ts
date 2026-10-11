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
  'plat:publish:npm', 'plat:release:verify-dist-tags', 'plat:audit:backdrop', 'plat:tag:release-ledger',
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
  it('runs the build + verify steps explicitly, then npm publish --dry-run --ignore-scripts (PLAT-05 item 2)', () => {
    const lines: string[] = j.script;
    const s = lines.join('\n');
    // prepublishOnly starts with require-ci-publish.js, which exits 1 outside plat:publish:npm.
    expect(s).not.toContain('prepublishOnly');
    expect(s).not.toContain('require-ci-publish');
    const idx = (needle: string) => lines.findIndex((l) => l.includes(needle));
    const build = lines.indexOf('npm run build');
    const verify = idx('for s in verify:pack verify:css-vars');
    const prepack = idx('npm run prepack');
    const publish = lines.indexOf('npm publish --dry-run --ignore-scripts');
    expect(build).toBeGreaterThanOrEqual(0);
    expect(verify).toBeGreaterThan(build);
    expect(prepack).toBeGreaterThan(verify);
    expect(publish).toBeGreaterThan(prepack);
    expect(publish).toBe(lines.length - 1);
    // every publish line is the lifecycle-free dry run
    expect(lines.filter((l) => /npm publish/.test(l))).toEqual(['npm publish --dry-run --ignore-scripts']);
    // a missing verify script fails closed
    expect(lines[verify]).toMatch(/\{ echo "PENDING: npm script \$s \(lane 1b\)"; exit 1; \}/);
  });
});

describe('plat:test:react19', () => {
  const j = job('plat:test:react19');
  it('has react19-smoke and unit-react19 legs', () => {
    expect(j.parallel.matrix.map((l: any) => l.AG_REACT19_LEG)).toEqual(['react19-smoke', 'unit-react19']);
  });
  it('installs React 19 with --no-save before jest (REQ-PLAT-47)', () => {
    const lines: string[] = j.script;
    const install = lines.findIndex((l) => /^npm install --no-save\b/.test(l));
    const jest = lines.findIndex((l) => l.startsWith('npx jest'));
    expect(install).toBeGreaterThanOrEqual(0);
    expect(jest).toBeGreaterThan(install);
    for (const pkg of ['react', 'react-dom', '@types/react', '@types/react-dom']) {
      expect(lines[install].split(/\s+/)).toContainEqual(expect.stringMatching(new RegExp(`^${pkg.replace('/', '\\/')}@19(\\.|$)`)));
    }
    expect(lines[jest]).toContain('tests/react19/$AG_REACT19_LEG');
  });
  it('fails closed when a leg file is missing: no `test -d` / PENDING fallback (REQ-PLAT-05)', () => {
    const s = (j.script as string[]).join('\n');
    expect(s).not.toMatch(/PENDING/);
    expect(s).not.toMatch(/test -d/);
    expect(j.script).toContain('test -f "tests/react19/$AG_REACT19_LEG.test.tsx"');
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

// B3-5 (REQ-FIN-22; REQ-PLAT-05 items 2, 3, 6, 10, 11; REQ-PLAT-34 item 5).
describe('REQ-PLAT-05 defects (B3-5)', () => {
  const raw = readFileSync('ci/plat.gitlab-ci.yml', 'utf8');
  const scriptText = (n: string) => ([] as string[]).concat(job(n).script ?? []).join('\n');

  it('has no `|| echo` / `|| true` fail-open anywhere in the fragment (item 6)', () => {
    const hits = raw.split('\n').map((l, i) => [i + 1, l] as const).filter(([, l]) => /\|\| *(echo|true)/.test(l));
    expect(hits).toEqual([]);
    expect(raw).not.toMatch(/2>\/dev\/null/);
  });

  it('every PENDING guard fails closed (`{ echo "PENDING: …"; exit 1; }` or an else-branch exit 1)', () => {
    for (const [k, v] of Object.entries(doc)) {
      if (k.startsWith('.') || typeof v !== 'object' || v === null || !Array.isArray((v as any).script)) continue;
      for (const line of (v as any).script as string[]) {
        const rows = line.split('\n');
        rows.forEach((row, i) => {
          const m = row.match(/echo "PENDING:[^"]*"(.*)$/);
          if (!m) return;
          const after = `${m[1] ?? ''}\n${rows[i + 1] ?? ''}`;
          const closed =
            /^\s*;\s*exit 1\b/.test(after) ||
            /^\s*\n\s*exit 1\b/.test(after) ||
            (/^\s*;\s*ok=0\b/.test(after) && line.includes('[ "$ok" = 1 ] || exit 1'));
          expect([k, row.trim(), closed]).toEqual([k, row.trim(), true]);
        });
      }
    }
  });

  // Item 3 on 4.x: the removal gate is a 5x-only job (its scripts/removal/*
  // producers live on `next`, where the B3-5 test asserts they exist on disk).
  // On this line the job must never be scheduled, so a 4.x pipeline cannot
  // reach the PENDING branch; the paths stay the canonical `next` paths.
  it('plat:gate:removal runs only on the 5x line and names the canonical scripts/removal paths (item 3, 4.x)', () => {
    const j = job('plat:gate:removal');
    expect(j.rules.length).toBeGreaterThan(0);
    for (const r of j.rules) {
      expect(String(r.if)).toMatch(/^\$AG_LINE == "5x" && /);
      expect(String(r.if)).not.toContain('"4x"');
    }
    const paths = [...scriptText('plat:gate:removal').matchAll(/scripts\/[\w/.-]+\.mjs/g)].map((m) => m[0]);
    expect(new Set(paths)).toEqual(
      new Set([
        'scripts/removal/gen-component-dispositions.mjs',
        'scripts/removal/consumer-grep.mjs',
        'scripts/removal/revert-dry-run.mjs',
      ]),
    );
  });

  it('4x plat:package:pack runs verify:pack unguarded after a fail-closed presence check (item 6)', () => {
    const s = scriptText('plat:package:pack');
    const fourX = s.slice(s.indexOf('if [ "$AG_LINE" = "4x" ]; then\n  # A missing script'), s.indexOf('else\n  node -e'));
    expect(fourX).toMatch(/\|\| \{ echo "verify:pack missing on 4x"; exit 1; \}\n\s*npm run verify:pack\s*$/);
    expect(fourX).not.toMatch(/&&\s*npm run verify:pack/);
  });

  // PLAT-39 item 3: on a v4 tag pipeline (AG_SCOPE=release, AG_LINE=4x on the
  // release SHA) glass-quality cannot fail open and runs the full jest suite
  // and lint:check.
  it('4x plat:gate:glass-quality is allow_failure:false on tags and runs npx jest --ci + npm run lint:check (PLAT-39 item 3)', () => {
    const j = job('plat:gate:glass-quality');
    expect(j.rules[0]).toEqual({ if: '$CI_COMMIT_TAG', allow_failure: false });
    expect(j.rules.some((r: any) => /\$AG_SCOPE == "release"/.test(r.if))).toBe(true);
    for (const r of j.rules) expect(r.when).toBeUndefined(); // never manual
    const lines: string[] = j.script;
    const block = lines.find((l) => l.startsWith('if [ "$AG_LINE" = "4x" ]; then'));
    expect(block).toBeDefined();
    const fourX = block!.slice(0, block!.indexOf('\nelse\n'));
    const rows = fourX.split('\n').map((l) => l.trim());
    expect(rows).toContain('npm run lint:check');
    expect(rows).toContain('npx jest --ci');
    expect(fourX).not.toMatch(/--passWithNoTests|--testPathIgnorePatterns|\|\|/);
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.scripts['lint:check']).toBeDefined();
  });

  it('plat:package:pack fails closed when no aura-glass tarball was packed', () => {
    const s = scriptText('plat:package:pack');
    expect(s).toContain('TARBALL=$(ls .artifacts/pack/aura-glass-*.tgz | head -1)');
    expect(s).toMatch(/if \[ -z "\$TARBALL" \]; then echo "[^"]+"; exit 1; fi/);
    expect(s).toContain('echo "AURAGLASS_TARBALL=$TARBALL" > .artifacts/plat/pack.env');
  });

  it('plat:release:verify-dist-tags is manual on every scope and runs after publish (item 10)', () => {
    const j = job('plat:release:verify-dist-tags');
    const scopes = j.rules.flatMap((r: any) => [...String(r.if).matchAll(/\$AG_SCOPE == "(\w+)"/g)].map((m) => m[1]));
    expect(new Set(scopes)).toEqual(new Set(['release', 'main', 'pr', 'nightly']));
    for (const r of j.rules) expect(r.when).toBe('manual');
    expect(j.rules.find((r: any) => /release/.test(r.if)).allow_failure).toBe(false);
    expect(j.needs).toEqual([{ job: 'plat:publish:npm', optional: true }]);
  });

  it('plat:release:verify-dist-tags writes dist-tags.json from the registry, then checks policy and release comms (item 10, PLAT-34)', () => {
    const lines: string[] = job('plat:release:verify-dist-tags').script;
    const view = lines.indexOf('npm view aura-glass dist-tags --json > ".artifacts/plat/$CI_JOB_NAME_SLUG/dist-tags.json"');
    const policy = lines.findIndex((l) => l.startsWith('node scripts/release/dist-tag.mjs --check'));
    const comms = lines.findIndex((l) => l.includes('node scripts/release/verify-release-comms.mjs --dist-tags'));
    expect(view).toBeGreaterThanOrEqual(0);
    expect(policy).toBeGreaterThan(view);
    expect(comms).toBeGreaterThan(policy);
    // the release-comms exit code is preserved, its log kept in the job dir
    expect(lines[comms]).toContain('> ".artifacts/plat/$CI_JOB_NAME_SLUG/release-comms.log" 2>&1 || rc=$?');
    expect(lines[comms]).toMatch(/exit "\$rc"\s*$/);
    expect(existsSync('scripts/release/verify-release-comms.mjs')).toBe(true);
    expect(existsSync('scripts/release/dist-tag.mjs')).toBe(true);
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
    'plat:tag:release-ledger': '.plat-evidence-release',
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

// REQ-PLAT-41 wiring (FIN-B.1b row #131, `4x11-fin/b-wire-plat41`): the
// shrink-only jsdom import side-effect gate runs in plat:package:pack on the
// 4x line, against the built entry, with no fail-open.
describe('REQ-PLAT-41 import side-effect gate in plat:package:pack', () => {
  const lines: string[] = ([] as string[]).concat(job('plat:package:pack').script ?? []);
  const GATE = 'node scripts/ci/import-side-effects.mjs --dist dist/index.mjs';
  const idx = lines.findIndex((l) => l.includes(GATE));

  it('runs the gate on the built dist/index.mjs entry, inside a 4x-only block', () => {
    expect(idx).toBeGreaterThan(-1);
    const rows = lines[idx].split('\n').map((r) => r.trim()).filter(Boolean);
    expect(rows).toEqual(['if [ "$AG_LINE" = "4x" ]; then', GATE, 'fi']);
  });

  it('is fail-closed (no || / ; true / 2>/dev/null) and never --update the baseline', () => {
    expect(lines[idx]).not.toMatch(/\|\||;\s*true\b|2>\/dev\/null|--update/);
  });

  it('runs after verify:pack and before npm pack, behind require-activated.mjs', () => {
    const verify = lines.findIndex((l) => l.includes('npm run verify:pack'));
    const pack = lines.findIndex((l) => l.trim() === 'npm pack --pack-destination .artifacts/pack');
    expect(lines[0]).toBe('node scripts/ci/require-activated.mjs --line "$AG_LINE"');
    expect(verify).toBeGreaterThan(0);
    expect(idx).toBeGreaterThan(verify);
    expect(pack).toBeGreaterThan(idx);
  });
});

// 4x-fin/b-wire-fin32 (FIN-B.1b row #128; §6.1 REQ-FIN-32 → REQ-FIN-22; the
// #128 ci/plat hunk re-authored from the 4.1.x canonical commits 543866512,
// 388c19a4c, 9e9329999, 22b6cf353, 7363ec27a, 0d3412a30; REQ-PLAT-16, -22,
// -24, -25, -27, -29, -31, -13).
describe('REQ-FIN-32 wiring on 4x: glass-quality, dist-maps producer, release ledger', () => {
  const { execFileSync, spawnSync } = require('node:child_process') as typeof import('node:child_process');
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs') as typeof import('node:fs');
  const { tmpdir } = require('node:os') as typeof import('node:os');
  const { join } = require('node:path') as typeof import('node:path');
  const root = yaml.parse(readFileSync('.gitlab-ci.yml', 'utf8')) as Record<string, any>;
  const STAGES: string[] = root.stages;

  // Run one fragment script block the way the GitLab bash runner does (errexit + pipefail).
  const runBlock = (block: string, cwd: string, env: Record<string, string>) =>
    spawnSync('bash', ['-eo', 'pipefail', '-c', block], { cwd, env: { ...process.env, ...env }, encoding: 'utf8' });
  const tmp = (prefix: string, files: string[] = []) => {
    const dir = mkdtempSync(join(tmpdir(), prefix));
    for (const f of files) {
      mkdirSync(join(dir, f, '..'), { recursive: true });
      writeFileSync(join(dir, f), '{"version":3}');
    }
    mkdirSync(join(dir, 'ev'), { recursive: true });
    return dir;
  };

  describe('plat:gate:glass-quality (4x branch)', () => {
    const block = (job('plat:gate:glass-quality').script as string[]).find((l) => l.includes('npm run lint:check'))!;
    const rows = block.split('\n').map((l) => l.trim());
    const ifAt = rows.indexOf('if [ "$AG_LINE" = "4x" ]; then');
    const elseAt = rows.indexOf('else');
    const DIST_GUARD = rows.find((r) => r.startsWith('if [ ! -f dist/index.d.ts ]; then'))!;
    const FETCH_NEXT = 'git fetch --no-tags --depth=1 origin "+refs/heads/next:refs/remotes/origin/next"';
    const CMDS = [
      'node scripts/release/gen-deprecations.mjs --schema --check', // PLAT-24
      'node scripts/release/check-tsdoc-deprecated.mjs --line 4x', // PLAT-27
      'node scripts/release/gen-deprecations.mjs --docs', // PLAT-29 (guide first)
      'node scripts/release/verify-breaking-register.mjs', // PLAT-29
      DIST_GUARD,
      'node scripts/build/api-report.mjs --line 4x --check', // PLAT-22
      FETCH_NEXT,
      'node scripts/release/verify-deprecations.mjs --line 4x --compare-branch origin/next', // PLAT-25
    ];

    it('runs every change-control/deprecation check, in order, inside the 4x branch', () => {
      expect(DIST_GUARD).toBeDefined();
      const at = CMDS.map((c) => rows.indexOf(c));
      for (const [i, c] of CMDS.entries()) expect([c, at[i]! > ifAt && at[i]! < elseAt]).toEqual([c, true]);
      expect(at).toEqual([...at].sort((a, b) => a - b));
      // after the existing 4x checks, not instead of them
      expect(at[0]).toBeGreaterThan(rows.indexOf('npx jest --ci'));
    });
    it('each check is its own command (no mid-block `&&` list that errexit would not stop)', () => {
      for (const r of rows.filter((x) => x.startsWith('node scripts/release/') || x.startsWith('node scripts/build/'))) {
        expect(r).not.toContain('&&');
        expect(r).not.toContain('||');
      }
    });
    it('the guide is generated right before the register reads it', () => {
      expect(rows.indexOf(CMDS[2]!)).toBe(rows.indexOf(CMDS[3]!) - 1);
    });
    it('verify-deprecations compares against a freshly fetched origin/next', () => {
      expect(rows.indexOf(FETCH_NEXT)).toBe(rows.indexOf(CMDS[7]!) - 1);
    });
    it('api-report reads the built dist: needs plat:build:dist artifacts and fails closed without dist/index.d.ts', () => {
      expect(job('plat:gate:glass-quality').needs).toContainEqual({ job: 'plat:build:dist', artifacts: true, optional: true });
      expect(JSON.parse(readFileSync('package.json', 'utf8')).exports['.'].types).toBe('./dist/index.d.ts');
      const dir = tmp('ag-gq4x-');
      try {
        const r = runBlock(`${DIST_GUARD}\necho reached`, dir, {});
        expect(r.status).toBe(1);
        expect(r.stdout).toContain('dist/index.d.ts missing');
        expect(r.stdout).not.toContain('reached');
        mkdirSync(join(dir, 'dist'));
        writeFileSync(join(dir, 'dist/index.d.ts'), 'export {};\n');
        expect(runBlock(`${DIST_GUARD}\necho reached`, dir, {}).stdout).toContain('reached');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
    it('every wired script is on the line (producer: #408, the re-created #128)', () => {
      for (const c of CMDS.filter((x) => x.startsWith('node '))) {
        const p = c.split(' ')[1]!;
        expect([p, existsSync(p)]).toEqual([p, true]);
      }
    });
    it('a failing check fails the block (errexit applies inside the 4x branch)', () => {
      const dir = tmp('ag-gq-');
      try {
        const r = runBlock('if [ "$AG_LINE" = "4x" ]; then\n  false\n  echo reached\nelse :; fi', dir, { AG_LINE: '4x' });
        expect(r.status).not.toBe(0);
        expect(r.stdout).not.toContain('reached');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });

  describe('plat:package:pack dist-maps.tgz (REQ-PLAT-16, fail-closed producer)', () => {
    const lines: string[] = job('plat:package:pack').script;
    const at = lines.findIndex((l) => l.includes('dist-maps.tgz') && l.includes('tar -czf'));
    const block = lines[at]!;
    const list = (tgz: string) =>
      execFileSync('tar', ['-tzf', tgz], { encoding: 'utf8' }).split('\n').filter(Boolean).sort();

    it('runs after the tarball and pack.env are written, writes into the job dir, once', () => {
      expect(at).toBeGreaterThan(lines.findIndex((l) => l.includes('AURAGLASS_TARBALL=$TARBALL')));
      expect(block).toContain('tar -czf "$AURAGLASS_EVIDENCE_DIR/dist-maps.tgz"');
      expect(block).not.toContain('/dev/null'); // never an empty archive (the 4.1.x 0d3412a30 fallback)
      expect(block).not.toMatch(/\|\|\s*true|\|\|\s*echo/);
      expect(lines.filter((l) => l.includes('dist-maps.tgz') && l.includes('tar -czf'))).toHaveLength(1);
    });
    it('gets dist/ from plat:build:dist', () => {
      expect(job('plat:package:pack').needs).toContainEqual({ job: 'plat:build:dist', artifacts: true, optional: true });
    });
    it('4x: archives exactly dist/**/*.map', () => {
      const dir = tmp('ag-maps-', ['dist/index.mjs.map', 'dist/a/b.cjs.map', 'dist/index.mjs']);
      try {
        const r = runBlock(block, dir, { AG_LINE: '4x', AURAGLASS_EVIDENCE_DIR: 'ev' });
        expect([r.status, r.stderr]).toEqual([0, '']);
        expect(list(join(dir, 'ev/dist-maps.tgz'))).toEqual(['dist/a/b.cjs.map', 'dist/index.mjs.map']);
        expect(r.stdout).toContain('dist-maps.tgz (2 maps from dist/)');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
    it.each([
      ['no dist/ dir', [] as string[], 'dist/ missing'],
      ['dist/ without .map files', ['dist/index.mjs'], 'dist-maps.tgz would be empty'],
    ])('4x fails closed with %s and writes no archive', (_n, files, msg) => {
      const dir = tmp('ag-maps-', files);
      try {
        const r = runBlock(block, dir, { AG_LINE: '4x', AURAGLASS_EVIDENCE_DIR: 'ev' });
        expect(r.status).toBe(1);
        expect(r.stdout).toContain(msg);
        expect(existsSync(join(dir, 'ev/dist-maps.tgz'))).toBe(false);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });

  describe('plat:tag:release-ledger (REQ-PLAT-31 / -13)', () => {
    const j = job('plat:tag:release-ledger');
    it('runs on release scope only, blocking, with 90-day release evidence (.ag-evidence-release)', () => {
      expect(j.extends).toEqual(['.plat-node', '.plat-evidence-release']);
      expect(doc['.plat-evidence-release'].extends).toContain('.ag-evidence-release');
      expect(j.rules).toEqual([{ if: '$AG_SCOPE == "release"' }]);
      expect(j.allow_failure).toBe(false);
      expect(j.needs).toEqual([]);
    });
    it('plat:publish:npm needs it, so a ledger mismatch blocks the publish', () => {
      expect(job('plat:publish:npm').needs).toContainEqual({ job: 'plat:tag:release-ledger', artifacts: false });
      expect(STAGES.indexOf(j.stage)).toBeLessThanOrEqual(STAGES.indexOf(job('plat:publish:npm').stage));
      expect(yaml.stringify(job('plat:publish:npm').rules)).toBe(yaml.stringify(j.rules));
    });
    it('fetches tags before verify-release-ledger.mjs (which reads `git tag -l`)', () => {
      const lines: string[] = j.script;
      const fetch = lines.indexOf('git fetch --no-tags origin "+refs/tags/*:refs/tags/*"');
      const run = lines.findIndex((l) => l.includes('node scripts/release/verify-release-ledger.mjs'));
      expect(fetch).toBeGreaterThanOrEqual(0);
      expect(run).toBeGreaterThan(fetch);
      expect(existsSync('scripts/release/verify-release-ledger.mjs')).toBe(true);
    });
    it.each([[0], [1], [3]])('keeps the ledger log as evidence and preserves exit code %i', (code) => {
      const block = (j.script as string[]).find((l) => l.includes('verify-release-ledger.mjs'))!;
      const dir = tmp('ag-ledger-');
      try {
        mkdirSync(join(dir, 'scripts/release'), { recursive: true });
        writeFileSync(
          join(dir, 'scripts/release/verify-release-ledger.mjs'),
          `console.log('ledger out'); console.error('ledger err'); process.exit(${code});\n`,
        );
        const r = runBlock(block, dir, { AURAGLASS_EVIDENCE_DIR: 'ev' });
        expect(r.status).toBe(code);
        expect(readFileSync(join(dir, 'ev/release-ledger.log'), 'utf8')).toBe('ledger out\nledger err\n');
        expect(r.stdout).toContain('ledger out');
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });
});
