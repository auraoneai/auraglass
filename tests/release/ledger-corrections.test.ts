/* REQ-PLAT-31 (REQ-FIN-34): docs/release/ledger-corrections.json is regenerated
   by `verify-release-ledger.mjs --regen` with a computed missingFrom list, and
   a fetch failure on any live source is an error — never an empty set. The
   verifier is ESM, so each case runs it in a child `node` process with the
   sources injected (no network from this test). */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const MOD = JSON.stringify(join(ROOT, 'scripts/release/verify-release-ledger.mjs'));

// Stub helpers available to every EVAL body:
//   execStub({ git, npm, glab, gh }) — each value is stdout text or an Error to throw
//   fetchStub(status, body)         — a fetch that answers every request with one response
const PRELUDE = `
const m = await import(${MOD});
const execStub = (map) => (cmd, args, opts) => {
  const v = map[cmd];
  if (v === undefined) throw new Error('unexpected exec ' + cmd + ' ' + args.join(' '));
  if (v instanceof Error) throw v;
  return v;
};
const fetchStub = (status, body) => async () => ({
  ok: status >= 200 && status < 300, status,
  json: async () => body, headers: { get: () => '' },
});
const out = (x) => process.stdout.write('\\n@@RESULT@@' + JSON.stringify(x));
const failure = async (p) => { try { await p; return null; } catch (e) { return { name: e.name, source: e.source, message: e.message }; } };
`;

const EVAL = (body: string): any => {
  const stdout = execFileSync('node', ['--input-type=module', '-e', PRELUDE + body],
    { cwd: ROOT, encoding: 'utf8', env: { ...process.env, CI_JOB_TOKEN: '', GITLAB_TOKEN: '' } });
  const i = stdout.lastIndexOf('@@RESULT@@');
  if (i < 0) throw new Error(`no result from child: ${stdout}`);
  return JSON.parse(stdout.slice(i + '@@RESULT@@'.length));
};

const GOOD = `{ git: 'v4.1.0\\nv3.4.7\\n', npm: '["3.4.7","3.5.0","4.1.0"]', glab: '[]' }`;

function fixtureRoot(correctionsFile: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-corrections-'));
  mkdirSync(join(dir, 'docs/release'), { recursive: true });
  writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n\n## [4.1.0] - 2026-09-05\n\n## [3.4.8] - 2026-07-23\n\n## [3.4.7] - 2026-07-08\n');
  writeFileSync(join(dir, 'docs/release/ledger-corrections.json'), JSON.stringify(correctionsFile));
  return dir;
}

describe('ledger corrections (REQ-PLAT-31)', () => {
  const doc = JSON.parse(readFileSync('docs/release/ledger-corrections.json', 'utf8'));
  const corrections = doc.corrections as { version: string; missingFrom: string[]; note: string }[];

  describe('committed docs/release/ledger-corrections.json', () => {
    it('is the --regen output shape with one row per pre-4.1.1 version', () => {
      expect(Array.isArray(corrections)).toBe(true);
      expect(corrections.length).toBeGreaterThan(0);
      expect(doc.sources).toEqual({
        npm: expect.any(Number), tags: expect.any(Number),
        gitlabReleases: expect.any(Number), changelog: expect.any(Number),
      });
      const versions = corrections.map((c) => c.version);
      expect(new Set(versions).size).toBe(versions.length);
      const atLeast = EVAL(`out(${JSON.stringify(versions)}.filter((v) => /^\\d+\\.\\d+\\.\\d+$/.test(v) && m.atLeast(v, '4.1.1')))`);
      expect(atLeast).toEqual([]);
    });

    it('every row carries a non-empty missingFrom drawn from the known sources', () => {
      const sources = EVAL('out(m.SOURCES)') as string[];
      for (const c of corrections) {
        expect(c.missingFrom.length).toBeGreaterThan(0);
        for (const s of c.missingFrom) expect(sources).toContain(s);
        expect(c.note).toBe('computed 4.1.1-cut regen');
      }
    });

    it('missingFrom "changelog" matches the CHANGELOG.md headings in this checkout (computed, not authored)', () => {
      const headings = EVAL(`out(m.changelogVersions(${JSON.stringify(readFileSync('CHANGELOG.md', 'utf8'))}))`) as string[];
      expect(doc.sources.changelog).toBe(headings.length);
      for (const c of corrections) {
        expect({ version: c.version, missingChangelog: c.missingFrom.includes('changelog') })
          .toEqual({ version: c.version, missingChangelog: !headings.includes(c.version) });
      }
    });

    it('keeps the 4.1.1 claim retractions referenced from CHANGELOG under claimCorrections', () => {
      expect(Array.isArray(doc.claimCorrections)).toBe(true);
      for (const c of doc.claimCorrections) expect(c).toEqual({ doc: expect.any(String), claim: expect.any(String), correction: expect.any(String) });
    });
  });

  describe('computeCorrections / ledgerCheck', () => {
    it('computes missingFrom per version, emits only pre-cut rows, in numeric order', () => {
      const rows = EVAL(`out(m.computeCorrections({
        changelog: ['4.1.1', '3.10.0', '3.5.0', '3.4.8'], tags: ['4.1.1', '3.10.0', '3.4.8'],
        gitlab: ['4.1.1', '3.10.0'], npm: ['4.1.1', '3.10.0', '3.5.0', '3.2.0', '4.2.0'], github: null }))`);
      expect(rows).toEqual([
        { version: '3.2.0', missingFrom: ['changelog', 'tag', 'gitlab-release'], note: 'computed 4.1.1-cut regen' },
        { version: '3.4.8', missingFrom: ['gitlab-release', 'npm'], note: 'computed 4.1.1-cut regen' },
        { version: '3.5.0', missingFrom: ['tag', 'gitlab-release'], note: 'computed 4.1.1-cut regen' },
      ]);
    });

    it('includes github-release only when GitHub Releases were collected', () => {
      const rows = EVAL(`out(m.computeCorrections({ changelog: ['3.4.7'], tags: ['3.4.7'], gitlab: ['3.4.7'], npm: ['3.4.7'], github: [] }))`);
      expect(rows).toEqual([{ version: '3.4.7', missingFrom: ['github-release'], note: 'computed 4.1.1-cut regen' }]);
    });

    it('a post-cut missing row fails the check instead of being corrected', () => {
      const r = EVAL(`out(m.ledgerCheck({ changelog: ['4.1.1'], tags: [], gitlab: ['4.1.1'], npm: ['4.1.1'] },
        { corrections: [{ version: '4.1.1', missingFrom: ['tag'], note: 'x' }] }))`);
      expect(r.errors).toEqual(['4.1.1: missing from tag']);
    });

    it('a recorded row whose missingFrom no longer matches live data is an error', () => {
      const r = EVAL(`out(m.ledgerCheck({ changelog: [], tags: ['3.4.8'], gitlab: [], npm: ['3.4.8'] },
        { corrections: [{ version: '3.4.8', missingFrom: ['changelog'], note: 'hand-authored' }] }))`);
      expect(r.errors).toHaveLength(1);
      expect(r.errors[0]).toMatch(/^3\.4\.8: ledger-corrections\.json says missingFrom \["changelog"\] but live data computes \["changelog","gitlab-release"\]/);
    });
  });

  describe('fetch failure is an error, never an empty set', () => {
    let dir: string;
    beforeEach(() => { dir = fixtureRoot({ corrections: [] }); });
    afterEach(() => rmSync(dir, { recursive: true, force: true }));

    const collect = (exec: string, extra = '') => EVAL(`out(await failure(m.collectLive({ root: ${JSON.stringify(dir)},
      exec: execStub(${exec}), fetchImpl: fetchStub(200, []), env: {} ${extra} })))`);

    it('collects all four ledgers when every source answers (0 GitLab releases is valid data)', () => {
      const live = EVAL(`out(await m.collectLive({ root: ${JSON.stringify(dir)}, exec: execStub(${GOOD}), env: {} }))`);
      expect(live).toEqual({ changelog: ['4.1.0', '3.4.8', '3.4.7'], tags: ['4.1.0', '3.4.7'], gitlab: [], npm: ['3.4.7', '3.5.0', '4.1.0'], github: null });
    });

    it('npm unreachable', () => {
      expect(collect(`{ ...${GOOD}, npm: new Error('ENOTFOUND registry.npmjs.org') }`))
        .toEqual({ name: 'LedgerFetchError', source: 'npm', message: expect.stringContaining('ENOTFOUND') });
    });

    it('npm returns an empty list', () => {
      expect(collect(`{ ...${GOOD}, npm: '[]' }`)).toMatchObject({ source: 'npm' });
    });

    it('git tag fails or returns no tags', () => {
      expect(collect(`{ ...${GOOD}, git: new Error('not a git repository') }`)).toMatchObject({ source: 'tag' });
      expect(collect(`{ ...${GOOD}, git: '' }`)).toMatchObject({ source: 'tag' });
    });

    it('GitLab API answers 404 (private project, no/invalid token)', () => {
      const r = EVAL(`out(await failure(m.collectLive({ root: ${JSON.stringify(dir)}, exec: execStub(${GOOD}),
        fetchImpl: fetchStub(404, { message: '404 Project Not Found' }), env: { CI_JOB_TOKEN: 'job', CI_PROJECT_ID: '87152036' } })))`);
      expect(r).toEqual({ name: 'LedgerFetchError', source: 'gitlab-release', message: expect.stringContaining('HTTP 404') });
    });

    it('GitLab network error', () => {
      const r = EVAL(`out(await failure(m.collectLive({ root: ${JSON.stringify(dir)}, exec: execStub(${GOOD}),
        fetchImpl: async () => { throw new Error('ECONNRESET'); }, env: { GITLAB_TOKEN: 't' } })))`);
      expect(r).toMatchObject({ source: 'gitlab-release', message: expect.stringContaining('ECONNRESET') });
    });

    it('glab CLI fallback fails', () => {
      expect(collect(`{ ...${GOOD}, glab: new Error('glab: 404 Not Found') }`)).toMatchObject({ source: 'gitlab-release' });
    });

    it('gh release list fails under --github', () => {
      expect(collect(`{ ...${GOOD}, gh: new Error('HTTP 502') }`, ', github: true')).toMatchObject({ source: 'github-release' });
    });

    it('CHANGELOG.md missing', () => {
      rmSync(join(dir, 'CHANGELOG.md'));
      expect(collect(GOOD)).toMatchObject({ source: 'changelog' });
    });

    it('main (check mode) rejects instead of passing on a fetch failure', () => {
      const r = EVAL(`out(await failure(m.main([], { root: ${JSON.stringify(dir)},
        exec: execStub({ ...${GOOD}, npm: new Error('E503') }), env: {} })))`);
      expect(r).toMatchObject({ name: 'LedgerFetchError', source: 'npm' });
    });

    it('--regen writes nothing when a source fails', () => {
      const before = readFileSync(join(dir, 'docs/release/ledger-corrections.json'), 'utf8');
      const r = EVAL(`out(await failure(m.main(['--regen'], { root: ${JSON.stringify(dir)},
        exec: execStub(${GOOD}), fetchImpl: fetchStub(404, {}), env: { GITLAB_TOKEN: 't' } })))`);
      expect(r).toMatchObject({ source: 'gitlab-release' });
      expect(readFileSync(join(dir, 'docs/release/ledger-corrections.json'), 'utf8')).toBe(before);
    });
  });

  describe('--regen output', () => {
    it('writes computed rows and moves a legacy claim array under claimCorrections', () => {
      const claims = [{ doc: 'README.md', claim: 'c', correction: 'r' }];
      const dir = fixtureRoot(claims);
      try {
        const code = EVAL(`out(await m.main(['--regen'], { root: ${JSON.stringify(dir)}, exec: execStub(${GOOD}), env: {} }))`);
        expect(code).toBe(0);
        const written = JSON.parse(readFileSync(join(dir, 'docs/release/ledger-corrections.json'), 'utf8'));
        expect(written.sources).toEqual({ npm: 3, tags: 2, gitlabReleases: 0, changelog: 3 });
        expect(written.corrections).toEqual([
          { version: '3.4.7', missingFrom: ['gitlab-release'], note: 'computed 4.1.1-cut regen' },
          { version: '3.4.8', missingFrom: ['tag', 'gitlab-release', 'npm'], note: 'computed 4.1.1-cut regen' },
          { version: '3.5.0', missingFrom: ['changelog', 'tag', 'gitlab-release'], note: 'computed 4.1.1-cut regen' },
          { version: '4.1.0', missingFrom: ['gitlab-release'], note: 'computed 4.1.1-cut regen' },
        ]);
        expect(written.claimCorrections).toEqual(claims);
        // The regenerated file makes the check pass for the same live data.
        const check = EVAL(`out(m.ledgerCheck(await m.collectLive({ root: ${JSON.stringify(dir)}, exec: execStub(${GOOD}), env: {} }),
          { corrections: ${JSON.stringify(written.corrections)} }).errors)`);
        expect(check).toEqual([]);
      } finally { rmSync(dir, { recursive: true, force: true }); }
    });
  });
});
