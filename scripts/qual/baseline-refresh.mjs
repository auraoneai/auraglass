#!/usr/bin/env node
/* scripts/qual/baseline-refresh.mjs — QUAL (REQ-QUAL-25, G-14). Job qual:certify:baseline-refresh (manual or scheduled).

   1. Renders every L7 subject-state × config from this pipeline's Storybook with
      `playwright test certification/lanes/regression.spec.ts --update-snapshots all`, AG_BASELINE_ROOT pointing at
      <out>/candidates (the committed tree is never touched), AG_SCOPE=main (every subject).
   2. Compares the candidate tree with certification/baselines/ (same tolerance as toHaveScreenshot: pixelmatch 0.1,
      maxDiffPixelRatio 0.002, floor 20 px below 10,000 px²) → new | changed | unchanged | removed, with base / candidate /
      diff PNGs, `baseline-diff-report.html` and `refresh-summary.json` in <out>.
   3. Checks the candidates against the REQ-QUAL-24 budget (≤ 80 KB, tree ≤ 30 MB, Linux names, image chunks only).

   It never commits: QUAL's operator copies the reviewed candidates into a `next-qual/baselines-<yyyymmdd>` worktree and opens
   the PR (CODEOWNERS design-reviewer approval on certification/baselines/** + an L14 record per changed subject-state).
   Exit: 0 candidates written and within budget · 1 lane crash, 0 candidates, or budget violations · 2 not on CI /
   the gated remote runner · 64 usage. */
import { spawnSync } from 'node:child_process';
import { existsSync, globSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DPR = { 1440: 1, 390: 3 };

async function loadTs(file) {
  const { build } = await import('esbuild');
  const res = await build({ entryPoints: [file], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);
}

export async function loadDeps(root = ROOT) {
  return {
    ...(await loadTs(join(root, 'packages/qa/src/pixel/png.ts'))),
    ...(await loadTs(join(root, 'packages/qa/src/evidence/visualClass.ts'))),
    ...(await loadTs(join(root, 'packages/qa/src/evidence/baselines.ts'))),
    ...(await loadTs(join(root, 'packages/qa/src/evidence/regression.ts'))),
  };
}

const files = (dir) => (existsSync(dir) ? globSync('**/*.png', { cwd: dir }).filter((f) => statSync(join(dir, f)).isFile()).sort() : []);

/** Candidate tree vs committed tree. Writes base/, candidate/ and diff/ copies under `outDir` for every non-unchanged file. */
export function diffBaselineTrees(baseDir, candDir, outDir, deps) {
  const { decodePng, encodePng, compareRgba, allowedDiffPixels, parseBaselinePath } = deps;
  const base = new Set(files(baseDir));
  const cand = files(candDir);
  const entries = [];
  const keep = (kind, rel, buf) => { const f = join(outDir, kind, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, buf); return relative(outDir, f); };
  for (const rel of cand) {
    const candBuf = readFileSync(join(candDir, rel));
    const parsed = parseBaselinePath(rel);
    if (!base.has(rel)) { entries.push({ file: rel, status: 'new', candidate: keep('candidate', rel, candBuf), subject: parsed?.subject ?? null, state: parsed?.state ?? null }); continue; }
    const baseBuf = readFileSync(join(baseDir, rel));
    const a = decodePng(baseBuf);
    const b = decodePng(candBuf);
    const c = compareRgba(a, b, { diff: true });
    const pixels = b.width * b.height;
    const dpr = DPR[parsed?.cfg.viewport] ?? 1;
    const allowed = c.reason ? 0 : allowedDiffPixels(pixels, pixels / (dpr * dpr));
    const changed = !!c.reason || c.diffPixels > allowed;
    const row = { file: rel, status: changed ? 'changed' : 'unchanged', diffPixels: c.diffPixels, allowedDiffPixels: allowed, changedRatio: c.changedRatio,
      ...(c.reason ? { reason: c.reason } : {}), subject: parsed?.subject ?? null, state: parsed?.state ?? null };
    if (changed) {
      row.base = keep('base', rel, baseBuf);
      row.candidate = keep('candidate', rel, candBuf);
      if (c.diff) row.diff = keep('diff', rel, encodePng(c.diff));
    }
    entries.push(row);
    base.delete(rel);
  }
  for (const rel of [...base].sort()) {
    const parsed = parseBaselinePath(rel);
    entries.push({ file: rel, status: 'removed', base: keep('base', rel, readFileSync(join(baseDir, rel))), subject: parsed?.subject ?? null, state: parsed?.state ?? null });
  }
  return entries;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export function renderDiffReport({ sha, entries, violations }) {
  const counts = Object.fromEntries(['new', 'changed', 'removed', 'unchanged'].map((k) => [k, entries.filter((e) => e.status === k).length]));
  const img = (src, alt) => (src ? `<figure><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"><figcaption>${esc(alt)}</figcaption></figure>` : '<figure><figcaption>—</figcaption></figure>');
  const rows = entries.filter((e) => e.status !== 'unchanged').map((e) => `
  <section class="${esc(e.status)}">
    <h2>${esc(e.file)} <span>${esc(e.status)}${e.diffPixels !== undefined ? ` · ${e.diffPixels} px differ (allowed ${e.allowedDiffPixels})` : ''}${e.reason ? ` · ${esc(e.reason)}` : ''}</span></h2>
    <div class="row">${img(e.base, 'base (committed)')}${img(e.candidate, 'candidate (head)')}${img(e.diff, 'diff')}</div>
  </section>`).join('');
  const v = violations.length ? `<h2>Budget violations (REQ-QUAL-24)</h2><ul>${violations.map((x) => `<li>${esc(x.code)}: ${esc(x.message)}</li>`).join('')}</ul>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>L7 baseline refresh ${esc(sha ?? '')}</title>
<style>body{font:14px/1.4 system-ui,sans-serif;margin:24px;color:#111;background:#fff}h1{font-size:20px}h2{font-size:14px;margin:16px 0 4px}h2 span{font-weight:normal;color:#444}
.row{display:flex;gap:12px;flex-wrap:wrap}figure{margin:0}img{max-width:480px;border:1px solid #888;background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px}
figcaption{font-size:12px;color:#444}</style></head>
<body><main>
<h1>L7 baseline refresh — ${esc(sha ?? 'unknown sha')}</h1>
<p>new ${counts.new} · changed ${counts.changed} · removed ${counts.removed} · unchanged ${counts.unchanged}. Candidates only: commit the reviewed files from a QUAL worktree on <code>next-qual/baselines-&lt;yyyymmdd&gt;</code> with an L14 record per changed subject-state (REQ-QUAL-25).</p>
${v}${rows}
</main></body></html>
`;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  let out = null;
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i] === '--out') out = argv[i + 1];
    else { console.error(`baseline-refresh: unknown argument ${argv[i]}`); return 64; }
  }
  out = resolve(ROOT, out ?? join(env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', env.CI_JOB_NAME_SLUG || 'qual-certify-baseline-refresh'));
  if (!(env.CI === 'true' || env.AG_REMOTE_RUNNER === '1')) {
    console.error(`baseline-refresh: runs only in AG_PLAYWRIGHT_IMAGE on GitLab CI or the gated remote runner.\nRemote command: node scripts/qual/baseline-refresh.mjs ${argv.join(' ')}`);
    return 2;
  }
  const deps = await loadDeps(ROOT);
  const candidates = join(out, 'candidates');
  rmSync(candidates, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const report = join(out, 'playwright-refresh.json');
  const r = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '-c', 'certification/playwright.cert.config.ts',
    'certification/lanes/regression.spec.ts', '--update-snapshots', 'all'], {
    cwd: ROOT, stdio: 'inherit',
    env: { ...env, AG_SCOPE: 'main', AG_BASELINE_ROOT: relative(ROOT, candidates), AG_LANE_EVIDENCE_DIR: out, PLAYWRIGHT_JSON_OUTPUT_NAME: report },
  });
  const tree = deps.checkBaselineTree(join(candidates));
  const entries = diffBaselineTrees(join(ROOT, deps.BASELINE_ROOT), candidates, out, deps);
  const sha = env.CI_COMMIT_SHA ?? null;
  writeFileSync(join(out, 'baseline-diff-report.html'), renderDiffReport({ sha, entries, violations: tree.violations }));
  const summary = { version: 1, sha, playwrightExit: r.status, candidates: tree.files, candidateBytes: tree.bytes, violations: tree.violations,
    counts: Object.fromEntries(['new', 'changed', 'removed', 'unchanged'].map((k) => [k, entries.filter((e) => e.status === k).length])), entries };
  writeFileSync(join(out, 'refresh-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`baseline-refresh: ${JSON.stringify(summary.counts)}; ${tree.files} candidate(s), ${tree.violations.length} budget violation(s); report ${relative(ROOT, join(out, 'baseline-diff-report.html'))}`);
  if (r.error || r.signal) { console.error(`baseline-refresh: playwright crashed: ${r.error?.message ?? r.signal}`); return 1; }
  if (tree.files === 0) { console.error('baseline-refresh: 0 candidate PNGs were written (see playwright-refresh.json)'); return 1; }
  if (tree.violations.length) { console.error(`baseline-refresh: candidates violate the REQ-QUAL-24 budget:\n${tree.violations.map((v) => `  ${v.message}`).join('\n')}`); return 1; }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
}
