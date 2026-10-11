// tests/labs/package.test.ts — REQ-SURF-166 (AC-SURF-28), REQ-PLAT-12/-15 labs clauses (REQ-FIN-87).
// packages/labs has the mandated shape (peers, sideEffects false, exports per
// resident + ./package.json only, no bin, dist-only files), builds with tsdown,
// and `npm pack --dry-run --json -w packages/labs` ships package.json plus every
// exports target. A synthetic resident proves the per-resident build + pack path.
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = join(__dirname, '../..');
const LABS = join(ROOT, 'packages/labs');
const PKG = join(LABS, 'package.json');
const pkg = JSON.parse(readFileSync(PKG, 'utf8'));
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/** Every string leaf of an exports map (handles conditional exports objects). */
const exportTargets = (exportsMap: Record<string, unknown>): string[] => {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === 'string') out.push(v);
    else if (v && typeof v === 'object') Object.values(v as Record<string, unknown>).forEach(walk);
  };
  walk(exportsMap);
  return out;
};

interface PackEntry { name: string; filename: string; files: Array<{ path: string }> }
/** npm pack --json: an array (npm 10/11) or an object keyed by package name (npm >= 12);
    lifecycle output may precede the JSON. */
const parsePack = (stdout: string): PackEntry[] => {
  const start = stdout.search(/^[[{]\s*$/m);
  const parsed = JSON.parse(start >= 0 ? stdout.slice(start) : stdout.trim());
  return Array.isArray(parsed) ? parsed : Object.values(parsed);
};

const pack = (args: string[], cwd: string): PackEntry[] =>
  parsePack(execFileSync(NPM, ['pack', '--dry-run', '--json', ...args], {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, npm_config_loglevel: 'error' },
  }));

describe('@auraglass/labs package shape', () => {
  it('is 0.x ESM, public scope', () => {
    expect(pkg.name).toBe('@auraglass/labs');
    expect(pkg.version).toMatch(/^0\./);
    expect(pkg.type).toBe('module');
    expect(pkg.publishConfig?.access).toBe('public');
  });
  it('declares sideEffects: false', () => {
    expect(pkg.sideEffects).toBe(false);
  });
  it('peers aura-glass ^5.0.0 and react/react-dom ^19', () => {
    expect(pkg.peerDependencies['aura-glass']).toBe('^5.0.0');
    expect(pkg.peerDependencies.react).toMatch(/^\^19/);
    expect(pkg.peerDependencies['react-dom']).toMatch(/^\^19/);
    expect(pkg.dependencies ?? {}).toEqual({});
  });
  it('has no bin', () => {
    expect(pkg.bin).toBeUndefined();
  });
  it('exports one entry per resident (src/<kebab>/) plus ./package.json', () => {
    expect(pkg.exports['./package.json']).toBe('./package.json');
    for (const key of Object.keys(pkg.exports)) {
      if (key === './package.json') continue;
      expect(key).toMatch(/^\.\/[a-z0-9]+(-[a-z0-9]+)*$/);
      const resident = key.slice(2);
      expect(['ts', 'tsx'].some((e) => existsSync(join(LABS, 'src', resident, `index.${e}`)))).toBe(true);
    }
  });
  it('files list is dist + README only (no source or fixtures ship)', () => {
    for (const f of pkg.files) expect(['dist', 'README.md']).toContain(f);
  });
});

describe('@auraglass/labs build + pack (tsdown)', () => {
  it('build and prepack both run tsdown with the package config', () => {
    expect(pkg.scripts.build).toBe('tsdown');
    expect(pkg.scripts.prepack).toBe('tsdown');
    expect(existsSync(join(LABS, 'tsdown.config.ts'))).toBe(true);
  });

  it('npm pack --dry-run --json -w packages/labs ships package.json and every exports target', () => {
    const [entry] = pack(['-w', 'packages/labs'], ROOT);
    expect(entry).toBeDefined();
    expect(entry!.name).toBe('@auraglass/labs');
    expect(entry!.filename).toMatch(/^auraglass-labs-0\.\d+\.\d+\.tgz$/);
    const files = new Set(entry!.files.map((f) => f.path));
    expect(files.has('package.json')).toBe(true);
    expect(files.has('dist/index.js')).toBe(true);
    expect(files.has('dist/index.d.ts')).toBe(true);
    for (const target of exportTargets(pkg.exports)) {
      expect({ target, packed: files.has(target.replace(/^\.\//, '')) }).toEqual({ target, packed: true });
    }
    // Nothing outside dist/, README.md and package.json ships.
    for (const f of files) expect(f === 'package.json' || f === 'README.md' || f.startsWith('dist/')).toBe(true);
  }, 120_000);

  describe('with a synthetic resident', () => {
    const tmp = resolve(ROOT, '.artifacts/surf/labs-pack-test');
    beforeAll(() => {
      rmSync(tmp, { recursive: true, force: true });
      mkdirSync(tmp, { recursive: true });
      for (const f of ['package.json', 'tsdown.config.ts', 'tsconfig.json', 'README.md']) cpSync(join(LABS, f), join(tmp, f));
      cpSync(join(LABS, 'src'), join(tmp, 'src'), { recursive: true });
      const p = JSON.parse(readFileSync(join(tmp, 'package.json'), 'utf8'));
      p.name = '@fixture/labs-pack';
      p.exports = {
        './orb': { types: './dist/orb/index.d.ts', default: './dist/orb/index.js' },
        './package.json': './package.json',
      };
      writeFileSync(join(tmp, 'package.json'), `${JSON.stringify(p, null, 2)}\n`);
      mkdirSync(join(tmp, 'src/orb'), { recursive: true });
      writeFileSync(join(tmp, 'src/orb/index.ts'), "export const orbSize = (r: number): number => r * 2;\n");
    });
    afterAll(() => rmSync(tmp, { recursive: true, force: true }));

    it('builds dist/<resident>/index.{js,d.ts} and packs every exports target', () => {
      const [entry] = pack([], tmp);
      const files = new Set(entry!.files.map((f) => f.path));
      expect(files.has('dist/orb/index.js')).toBe(true);
      expect(files.has('dist/orb/index.d.ts')).toBe(true);
      const p = JSON.parse(readFileSync(join(tmp, 'package.json'), 'utf8'));
      for (const target of exportTargets(p.exports)) {
        expect({ target, packed: files.has(target.replace(/^\.\//, '')) }).toEqual({ target, packed: true });
      }
      expect(readFileSync(join(tmp, 'dist/orb/index.js'), 'utf8')).toContain('orbSize');
    }, 120_000);

    it('an exports entry without a src/<resident>/index fails the build', () => {
      const p = JSON.parse(readFileSync(join(tmp, 'package.json'), 'utf8'));
      p.exports['./ghost'] = './dist/ghost/index.js';
      writeFileSync(join(tmp, 'package.json'), `${JSON.stringify(p, null, 2)}\n`);
      expect(() => execFileSync(NPM, ['run', 'build'], { cwd: tmp, encoding: 'utf8', stdio: 'pipe' }))
        .toThrow(/exports \.\/ghost has no src\/ghost\/index\.ts\(x\)/);
    }, 120_000);
  });
});

describe('@auraglass/labs publishing (REQ-PLAT-12 / -15 labs clauses)', () => {
  it('prepublishOnly runs the CI-only publish guard first, at an existing path', () => {
    const first = String(pkg.scripts?.prepublishOnly ?? '').split('&&')[0]!.trim();
    const m = /^node (\S+require-ci-publish\.js)$/.exec(first);
    expect(m).not.toBeNull();
    expect(existsSync(resolve(LABS, m![1]!))).toBe(true);
  });

  it('the guard refuses a local publish context', () => {
    const guard = resolve(LABS, '../../scripts/ci/require-ci-publish.js');
    const env = { ...process.env };
    delete env.GITLAB_CI;
    delete env.NPM_ID_TOKEN;
    expect(() => execFileSync(process.execPath, [guard], { env, stdio: 'pipe' })).toThrow();
  });

  it('PUBLISHING.md records the trusted publisher fields and names no npm token variable', () => {
    const t = readFileSync(join(LABS, 'PUBLISHING.md'), 'utf8');
    for (const field of ['chahal-foundation-group/github-auraoneai', '`auraglass`', '`.gitlab-ci.yml`', '`npm-publish`',
      'docs/release/trusted-publishers.md', 'scripts/ci/require-ci-publish.js', 'plat:publish:npm', 'aura-glass-labs']) {
      expect({ field, present: t.includes(field) }).toEqual({ field, present: true });
    }
    expect(t).not.toMatch(/NPM_TOKEN|NODE_AUTH_TOKEN/);
  });
});
