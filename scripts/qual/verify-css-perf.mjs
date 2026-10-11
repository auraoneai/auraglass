#!/usr/bin/env node
/* scripts/qual/verify-css-perf.mjs — REQ-QUAL-44 CSS perf gate (REQ-FIN-105, FIN-446, L1).

   Lints `src/**\/*.css`, `dist/**\/*.css` and the QUAL-owned CSS globs
   (showcase/, stories/qual/, .storybook/; seeded `fixtures/` excluded) with the QUAL perf plugins in
   scripts/qual/stylelint-perf/ (stylelint Node API; no postcss dependency) and
   writes a per-owner report.

   Enforcement (REQ-QUAL-44 / contract §4.11 non-blocking rollout):
     - `error` for QUAL-owned paths (contracts/ownership.json) and for dist/;
     - report-only for every other stream's source paths until RC-1. RC-1 mode
       (`--enforce-all`, or package.json version >= 5.0.0-rc.1) makes every
       finding an error.
   dist/ is produced by the package build; when it is absent the report records
   `dist.status: "missing"` and the run exits 1 only with `--require-dist`
   (the L1/L2 CI job passes it once the package artifact is wired as a need).

   Usage: node scripts/qual/verify-css-perf.mjs [--root <dir>] [--src <glob>] [--dist <dir>]
            [--out <file>] [--enforce-all] [--require-dist] [--json]
   Exit: 0 clean (or report-only findings only), 1 enforced findings / missing required dist. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import picomatch from 'picomatch';
import stylelint from 'stylelint';
import { config as perfConfig, ruleNames } from './stylelint-perf/index.mjs';

// QUAL-owned CSS (contracts/ownership.json A16, B10, F07); seeded negative fixtures excluded.
export const QUAL_CSS_GLOBS = ['showcase/**/*.css', 'stories/qual/**/*.css', '.storybook/**/*.css'];
export const IGNORE_GLOBS = ['**/node_modules/**', '**/fixtures/**', '**/__fixtures__/**'];

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');

function parseArgs(argv) {
  const a = { root: process.cwd(), src: 'src/**/*.css', dist: 'dist', out: '.artifacts/qual/css-perf.json', enforceAll: false, requireDist: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${k} needs a value`);
      return v;
    };
    if (k === '--root') a.root = path.resolve(next());
    else if (k === '--src') a.src = next();
    else if (k === '--dist') a.dist = next();
    else if (k === '--out') a.out = next();
    else if (k === '--enforce-all') a.enforceAll = true;
    else if (k === '--require-dist') a.requireDist = true;
    else if (k === '--json') a.json = true;
    else throw new Error(`unknown argument ${k}`);
  }
  return a;
}

/** RC-1 and later: 5.0.0-rc.N, 5.0.0, or any later version. */
export function isRc1OrLater(version) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(version ?? '');
  if (!m) return false;
  const [maj, min, pat] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (maj !== 5 || min !== 0 || pat !== 0) return maj > 5 || (maj === 5 && (min > 0 || pat > 0));
  if (!m[4]) return true;
  return /^rc\.\d+/.test(m[4]);
}

/** First-match owner over contracts/ownership.json rows on the 5x line (same rule as verify-ownership.mjs). */
function ownerResolver() {
  const rows = JSON.parse(fs.readFileSync(path.join(REPO, 'contracts', 'ownership.json'), 'utf8')).rows;
  const matchers = rows
    .filter((r) => !r.lines || r.lines.includes('5x'))
    .map((r) => ({ owner: r.owner, id: r.id, test: picomatch(r.glob, { dot: true }) }));
  return (rel) => matchers.find((m) => m.test(rel)) ?? { owner: 'PLAT', id: 'Z01' };
}

async function lintFiles(root, patterns) {
  const res = await stylelint.lint({
    files: patterns,
    cwd: root,
    config: perfConfig,
    configBasedir: HERE,
    allowEmptyInput: true,
    ignorePattern: IGNORE_GLOBS,
    globbyOptions: { cwd: root, dot: true },
  });
  return res.results;
}

export async function run(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const pkgPath = path.join(args.root, 'package.json');
  const version = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version : null;
  const enforceAll = args.enforceAll || process.env.AG_CSS_PERF_ENFORCE === 'all' || isRc1OrLater(version);
  const ownerOf = ownerResolver();

  const distAbs = path.resolve(args.root, args.dist);
  const distPresent = fs.existsSync(distAbs) && fs.statSync(distAbs).isDirectory();
  const distRel = path.relative(args.root, distAbs).split(path.sep).join('/');
  const patterns = [args.src, ...QUAL_CSS_GLOBS];
  if (distPresent) patterns.push(`${distRel}/**/*.css`);

  const results = await lintFiles(args.root, patterns);
  const isDist = (rel) => distPresent && (rel === distRel || rel.startsWith(`${distRel}/`));

  const owners = {};
  const violations = [];
  let srcFiles = 0;
  let distFiles = 0;
  for (const r of results) {
    const rel = path.relative(args.root, r.source).split(path.sep).join('/');
    const dist = isDist(rel);
    if (dist) distFiles++;
    else srcFiles++;
    const owner = dist ? 'dist' : ownerOf(rel).owner;
    const enforced = enforceAll || dist || owner === 'QUAL';
    const o = (owners[owner] ??= { files: 0, violations: 0, enforced, byRule: {} });
    o.files++;
    const warnings = [...r.warnings];
    if (r.parseErrors?.length) warnings.push(...r.parseErrors.map((p) => ({ ...p, rule: 'CssSyntaxError' })));
    for (const w of warnings) {
      const rule = w.rule ?? 'CssSyntaxError';
      violations.push({ file: rel, owner, line: w.line, column: w.column, rule, text: w.text, enforced });
      o.violations++;
      o.byRule[rule] = (o.byRule[rule] ?? 0) + 1;
    }
  }

  const enforcedCount = violations.filter((v) => v.enforced).length;
  const report = {
    gate: 'REQ-QUAL-44 css-perf',
    sha: process.env.CI_COMMIT_SHA ?? null,
    pipelineUrl: process.env.CI_PIPELINE_URL ?? null,
    version,
    mode: enforceAll ? 'enforce-all' : 'qual-and-dist-enforced, streams report-only until RC-1',
    rules: ruleNames,
    inputs: {
      src: { globs: [args.src, ...QUAL_CSS_GLOBS], ignore: IGNORE_GLOBS, files: srcFiles },
      dist: distPresent ? { dir: distRel, status: 'present', files: distFiles } : { dir: distRel, status: 'missing', files: 0 },
    },
    owners,
    enforcedViolations: enforcedCount,
    reportOnlyViolations: violations.length - enforcedCount,
    violations,
  };

  const outAbs = path.resolve(args.root, args.out);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, `${JSON.stringify(report, null, 2)}\n`);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(report)}\n`);
  } else {
    console.log(`[css-perf] ${report.mode}; src ${srcFiles} file(s), dist ${distPresent ? `${distFiles} file(s)` : 'missing'}`);
    for (const [owner, o] of Object.entries(owners).sort()) {
      const rules = Object.entries(o.byRule).map(([k, n]) => `${k}=${n}`).join(', ') || '-';
      console.log(`[css-perf]   ${owner.padEnd(5)} ${o.enforced ? 'error ' : 'report'} files=${o.files} violations=${o.violations} ${rules}`);
    }
    for (const v of violations.filter((x) => x.enforced)) console.error(`[css-perf] ERROR ${v.file}:${v.line}:${v.column} ${v.text}`);
    console.log(`[css-perf] report → ${path.relative(args.root, outAbs)}`);
  }

  let code = enforcedCount > 0 ? 1 : 0;
  if (!distPresent && args.requireDist) {
    console.error(`[css-perf] ERROR dist directory '${distRel}' is missing (--require-dist)`);
    code = 1;
  }
  return code;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().then((code) => process.exit(code), (err) => {
    console.error(`[css-perf] ${err.stack ?? err}`);
    process.exit(1);
  });
}
