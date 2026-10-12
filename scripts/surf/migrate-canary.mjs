#!/usr/bin/env node
/* REQ-SURF-15 (REQ-FIN-80, AC-FIN-80; FIN-F.3 next-fin/f-migrate-canary): the
   L11 migrate-4to5 canary over the frozen SURF consumer cases
   tests/fixtures/consumer-4x/cases/surf/** (expectations: canary.json there).

   Remote only: GitLab job surf:package:migrate-canary (ci/surf.gitlab-ci.yml),
   registered as an L11 subject in fragments/lanes/surf.ts. Outside CI it exits 2
   and prints the remote command (PRD-F §12 rule 6).

   Steps (each recorded in <out>/report.json; any failure exits 1):
     1. manifest   canary.json classifies every <Family>.page.tsx exactly once.
     2. install    a scratch consumer app outside the repo (so nothing resolves
                   from the repo's node_modules) with aura-glass@4.1.0 and the
                   cases, leading `// @ts-nocheck` lines stripped.
     3. tsc-4.1.0  the frozen cases type-check against the published 4.1.0.
     4. migrate    `auraglass migrate 4to5 --json --allow-todo --report` with the
                   packed CLI (AURAGLASS_CLI_TARBALL / .artifacts/pack/aura-glass-cli-*.tgz),
                   else the CLI built from this commit (`npm run build -w packages/cli`).
     5. todos      flagship subset: 0 TODOs; chart pages: exactly 1 'removed' TODO;
                   handler-only items: render={<button type="button" onClick={…} />}.
     6. swap       install the 5.0 tarball (AURAGLASS_TARBALL from plat:package:pack,
                   .artifacts/pack/aura-glass-*.tgz, else `npm run build && npm pack`).
     7. tsc-5      the migrated flagship subset type-checks against the tarball.
     8. render     each flagship page renders with react-dom/server: no throw,
                   non-empty markup, 0 console.error calls.

   Usage: node scripts/surf/migrate-canary.mjs [--out <dir>] [--tarball <tgz>] [--cli <tgz|bin.js>]
*/
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { evaluateCase, listCaseFiles, stripTsNocheck, validateManifest } from './migrate-canary-lib.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CASES = join(ROOT, 'tests/fixtures/consumer-4x/cases/surf');
const LIB_URL = pathToFileURL(join(ROOT, 'scripts/surf/migrate-canary-lib.mjs')).href;
const REMOTE_CMD = 'GitLab job surf:package:migrate-canary (node scripts/surf/migrate-canary.mjs --out .artifacts/surf/migrate-canary)';

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};

if (!process.env.CI) {
  console.error(`migrate-canary: remote only (installs packages, builds and packs). Run it in ${REMOTE_CMD}.`);
  process.exit(2);
}

const OUT = resolve(ROOT, opt('out') ?? '.artifacts/surf/migrate-canary');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const report = { req: 'REQ-SURF-15', reqFin: 'REQ-FIN-80', sha: process.env.CI_COMMIT_SHA ?? null, job: process.env.CI_JOB_URL ?? null, steps: [], cases: [], render: [] };
const step = (id, ok, detail = {}) => {
  report.steps.push({ id, ok, ...detail });
  console.log(`[${ok ? 'pass' : 'FAIL'}] ${id}${detail.summary ? ` — ${detail.summary}` : ''}`);
  return ok;
};
const finish = () => {
  report.ok = report.steps.every((s) => s.ok);
  writeFileSync(join(OUT, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(OUT, 'todo-report.md'), todoMarkdown());
  console.log(`migrate-canary: ${report.ok ? 'green' : 'red'} — evidence in ${OUT}`);
  process.exit(report.ok ? 0 : 1);
};

function run(cmd, argv, opts = {}) {
  const r = spawnSync(cmd, argv, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...opts });
  return { status: r.status ?? 1, stdout: r.stdout ?? '', stderr: (r.stderr ?? '') + (r.error ? String(r.error) : '') };
}
function log(name, r) {
  writeFileSync(join(OUT, name), `$ exit ${r.status}\n--- stdout\n${r.stdout}\n--- stderr\n${r.stderr}\n`);
}
const rootPkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const pin = (name) => {
  const v = rootPkg.devDependencies?.[name] ?? rootPkg.dependencies?.[name];
  if (!v) throw new Error(`root package.json does not pin ${name}`);
  return v;
};

// ---- 1. manifest
const manifest = JSON.parse(readFileSync(join(CASES, 'canary.json'), 'utf8'));
const caseFiles = listCaseFiles(CASES);
const manifestErrors = validateManifest(manifest, caseFiles);
if (!step('manifest', manifestErrors.length === 0, { summary: `${caseFiles.length} case pages`, errors: manifestErrors })) finish();
const flagship = manifest.cases.filter((c) => c.subset === 'flagship');

// ---- 2. scratch consumer app on aura-glass@4.1.0
const APP = mkdtempSync(join(tmpdir(), 'surf-migrate-canary-'));
report.app = APP;
const appPkg = {
  name: 'surf-migrate-canary',
  version: '0.0.0',
  private: true,
  type: 'module',
  dependencies: {
    'aura-glass': '4.1.0',
    'date-fns': '4.1.0', // DateFnsDirect.page.tsx imports it directly; a consumer declares it (REQ-PLAT-63)
    react: pin('react'),
    'react-dom': pin('react-dom'),
  },
  devDependencies: {
    typescript: pin('typescript'),
    '@types/react': pin('@types/react'),
    '@types/react-dom': pin('@types/react-dom'),
  },
};
writeFileSync(join(APP, 'package.json'), `${JSON.stringify(appPkg, null, 2)}\n`);
writeFileSync(join(APP, '.gitignore'), 'node_modules/\n.canary/\nmigrate-report.json\n');
const tsconfig = (include) => ({
  compilerOptions: {
    target: 'es2022', module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true,
    noEmit: true, skipLibCheck: true, esModuleInterop: true, isolatedModules: true, types: ['react', 'react-dom'],
  },
  files: include,
});
for (const c of manifest.cases) {
  const dest = join(APP, 'src', c.file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, stripTsNocheck(readFileSync(join(CASES, c.file), 'utf8')));
}
const allSrc = manifest.cases.map((c) => `src/${c.file}`);
const flagshipSrc = flagship.map((c) => `src/${c.file}`);
writeFileSync(join(APP, 'tsconfig.json'), `${JSON.stringify(tsconfig(allSrc), null, 2)}\n`);
const git = (...a) => execFileSync('git', ['-c', 'user.name=surf-migrate-canary', '-c', 'user.email=surf-migrate-canary@invalid', '-c', 'commit.gpgsign=false', ...a], { cwd: APP, encoding: 'utf8' });
git('init', '-q');
git('add', '-A');
git('commit', '-q', '-m', 'frozen 4.x consumer (aura-glass@4.1.0)');

const npmInstall = (extra, name) => {
  const r = run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error', ...extra], { cwd: APP });
  log(name, r);
  return r;
};
// 4.1.0 declares server-only peers (redis, openai, three, …) a UI consumer never
// installs, so the 4.x baseline install skips peer auto-install.
const i41 = npmInstall(['--legacy-peer-deps'], 'npm-install-4.1.0.log');
const installed41 = existsSync(join(APP, 'node_modules/aura-glass/package.json'))
  ? JSON.parse(readFileSync(join(APP, 'node_modules/aura-glass/package.json'), 'utf8')).version
  : null;
if (!step('install-4.1.0', i41.status === 0 && installed41 === '4.1.0', { summary: `aura-glass ${installed41 ?? 'missing'}` })) finish();
git('add', '-A');
git('commit', '-q', '--allow-empty', '-m', 'lockfile (aura-glass@4.1.0)');

// ---- 3. baseline: the frozen cases compile against the published 4.1.0
const tscBin = join(APP, 'node_modules/typescript/bin/tsc');
const t41 = run(process.execPath, [tscBin, '-p', 'tsconfig.json', '--pretty', 'false'], { cwd: APP });
log('tsc-4.1.0.log', t41);
step('tsc-4.1.0', t41.status === 0, { summary: t41.status === 0 ? `${allSrc.length} files` : `${(t41.stdout.match(/error TS/g) ?? []).length} errors`, log: 'tsc-4.1.0.log' });

// ---- 4. migrate 4to5
function resolveCli() {
  const explicit = opt('cli') ?? process.env.AURAGLASS_CLI_TARBALL;
  const packDir = join(ROOT, '.artifacts/pack');
  const packed = explicit
    ? resolve(ROOT, explicit)
    : existsSync(packDir) ? readdirSync(packDir).filter((f) => /^aura-glass-cli-.*\.tgz$/.test(f)).map((f) => join(packDir, f))[0] : undefined;
  if (packed && packed.endsWith('.js')) return { bin: packed, source: `explicit ${packed}` };
  if (packed && existsSync(packed)) {
    const dir = mkdtempSync(join(tmpdir(), 'surf-canary-cli-'));
    writeFileSync(join(dir, 'package.json'), '{"name":"cli-host","version":"0.0.0","private":true}\n');
    const r = run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error', packed], { cwd: dir });
    log('npm-install-cli.log', r);
    const bin = join(dir, 'node_modules/aura-glass-cli/dist/bin.js');
    if (r.status === 0 && existsSync(bin)) return { bin, source: `packed ${packed}` };
    report.cliPackNote = `packed CLI ${packed} has no dist/bin.js (install exit ${r.status}); built from this commit instead`;
  }
  const b = run('npm', ['run', 'build', '-w', 'packages/cli'], { cwd: ROOT });
  log('cli-build.log', b);
  const bin = join(ROOT, 'packages/cli/dist/bin.js');
  if (b.status !== 0 || !existsSync(bin)) return { bin: null, source: 'workspace build failed (cli-build.log)' };
  return { bin, source: `packages/cli built at ${report.sha ?? 'HEAD'}` };
}
const cli = resolveCli();
report.cli = cli.source;
if (!step('cli', Boolean(cli.bin), { summary: cli.source })) finish();

const m = run(process.execPath, [cli.bin, 'migrate', '4to5', '--cwd', APP, '--json', '--allow-todo', '--report', 'migrate-report.json'], { cwd: APP });
log('migrate.log', m);
const reportPath = join(APP, 'migrate-report.json');
if (m.status !== 0 || !existsSync(reportPath)) {
  // The engine aborts the whole tree on one failing file; isolate each case so
  // the evidence names the file(s) that crash it.
  const perFile = manifest.cases.map((c) => {
    const dir = mkdtempSync(join(tmpdir(), 'surf-canary-one-'));
    mkdirSync(join(dir, 'src', dirname(c.file)), { recursive: true });
    cpSync(join(APP, 'src', c.file), join(dir, 'src', c.file));
    writeFileSync(join(dir, 'package.json'), `${JSON.stringify(appPkg, null, 2)}\n`);
    const r = run(process.execPath, [cli.bin, 'migrate', '4to5', '--cwd', dir, '--allow-no-git', '--allow-todo', '--json'], { cwd: dir });
    return { file: c.file, exit: r.status, error: r.status === 0 ? null : r.stderr.trim().split('\n')[0] };
  });
  step('migrate', false, { summary: `engine exit ${m.status}: ${m.stderr.trim().split('\n')[0]}`, perFile: perFile.filter((p) => p.exit !== 0), log: 'migrate.log' });
  finish();
}
const migrated = JSON.parse(readFileSync(reportPath, 'utf8'));
cpSync(reportPath, join(OUT, 'migrate-report.json'));
writeFileSync(join(OUT, 'migrate.diff'), git('diff', '--no-color'));
step('migrate', true, { summary: `${migrated.summary.filesChanged} files changed, ${migrated.summary.changes} changes, ${migrated.summary.todos} TODOs` });
git('add', '-A');
git('commit', '-q', '--allow-empty', '-m', 'migrate 4to5');

// ---- 5. TODO / handler-item expectations
for (const c of manifest.cases) {
  const todos = migrated.files.find((f) => f.path === `src/${c.file}`)?.todos ?? [];
  const source = readFileSync(join(APP, 'src', c.file), 'utf8');
  report.cases.push(evaluateCase(c, { todos, source }));
}
const caseFailures = report.cases.filter((c) => !c.ok);
step('todos', caseFailures.length === 0, {
  summary: `flagship ${flagship.length} files, chart ${manifest.cases.filter((c) => c.subset === 'chart').length}, ${caseFailures.length} failing`,
  failing: caseFailures.map((c) => ({ file: c.file, failures: c.failures })),
});

// ---- 6. swap to the 5.0 tarball
function resolveTarball() {
  const explicit = opt('tarball') ?? process.env.AURAGLASS_TARBALL;
  if (explicit) {
    const p = isAbsolute(explicit) ? explicit : resolve(ROOT, explicit);
    if (existsSync(p) && /aura-glass-5\.[^/]*\.tgz$/.test(p)) return { path: p, source: 'AURAGLASS_TARBALL / --tarball' };
  }
  const packDir = join(ROOT, '.artifacts/pack');
  const found = existsSync(packDir) ? readdirSync(packDir).find((f) => /^aura-glass-5\..*\.tgz$/.test(f)) : undefined;
  if (found) return { path: join(packDir, found), source: 'plat:package:pack artifact' };
  // Pack fallback (PRD-F §5 rows 27-30): build and pack this commit.
  const b = run('npm', ['run', 'build'], { cwd: ROOT });
  log('build.log', b);
  if (b.status !== 0) return { path: null, source: 'npm run build failed (build.log)' };
  const dest = join(OUT, 'pack');
  mkdirSync(dest, { recursive: true });
  const p = run('npm', ['pack', '--pack-destination', dest], { cwd: ROOT });
  log('pack.log', p);
  const tgz = readdirSync(dest).find((f) => /^aura-glass-5\..*\.tgz$/.test(f));
  return tgz ? { path: join(dest, tgz), source: 'built and packed in this job' } : { path: null, source: 'npm pack produced no aura-glass-5.*.tgz (pack.log)' };
}
const tarball = resolveTarball();
report.tarball = tarball.source;
if (!step('tarball', Boolean(tarball.path), { summary: tarball.path ?? tarball.source })) finish();
const i5 = npmInstall([tarball.path], 'npm-install-5.log');
const installed5 = existsSync(join(APP, 'node_modules/aura-glass/package.json'))
  ? JSON.parse(readFileSync(join(APP, 'node_modules/aura-glass/package.json'), 'utf8')).version
  : null;
report.to = installed5;
if (!step('install-5', i5.status === 0 && /^5\./.test(installed5 ?? ''), { summary: `aura-glass ${installed5 ?? 'missing'}`, log: 'npm-install-5.log' })) finish();

// ---- 7. the migrated flagship subset compiles on 5.0
writeFileSync(join(APP, 'tsconfig.flagship.json'), `${JSON.stringify(tsconfig(flagshipSrc), null, 2)}\n`);
const t5 = run(process.execPath, [tscBin, '-p', 'tsconfig.flagship.json', '--pretty', 'false'], { cwd: APP });
log('tsc-5.log', t5);
step('tsc-5', t5.status === 0, { summary: t5.status === 0 ? `${flagshipSrc.length} files` : `${(t5.stdout.match(/error TS/g) ?? []).length} errors`, log: 'tsc-5.log' });

// ---- 8. render smoke (react-dom/server, the app's own React)
const esbuild = await import('esbuild');
const CANARY = join(APP, '.canary');
mkdirSync(join(CANARY, 'out'), { recursive: true });
const jobs = [];
for (const [i, c] of flagship.entries()) {
  if (!c.render) continue;
  const entry = join(CANARY, `entry-${i}.tsx`);
  const modPath = `../src/${c.file.replace(/\.tsx$/, '')}`;
  writeFileSync(entry, [
    "import { createElement } from 'react';",
    "import { renderToString } from 'react-dom/server';",
    `import * as page from ${JSON.stringify(modPath)};`,
    `export function render(props: Record<string, unknown>): string {`,
    `  const C = (page as Record<string, unknown>)[${JSON.stringify(c.render.export)}];`,
    `  if (typeof C !== 'function') throw new Error('export ${c.render.export} is not a component after migration');`,
    `  return renderToString(createElement(C as never, props as never));`,
    '}',
    '',
  ].join('\n'));
  const outfile = join(CANARY, 'out', `entry-${i}.mjs`);
  try {
    await esbuild.build({
      entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'esm', absWorkingDir: APP,
      jsx: 'automatic', loader: { '.css': 'empty' }, logLevel: 'silent',
      external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
    });
    jobs.push({ file: c.file, export: c.render.export, props: c.render.props, bundle: outfile });
  } catch (e) {
    report.render.push({ file: c.file, export: c.render.export, ok: false, error: `bundle: ${String(e.message ?? e).split('\n').slice(0, 6).join(' | ')}` });
  }
}
writeFileSync(join(CANARY, 'jobs.json'), JSON.stringify(jobs));
writeFileSync(join(CANARY, 'render.mjs'), `import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { reviveProps } from ${JSON.stringify(LIB_URL)};
const jobs = JSON.parse(readFileSync(new URL('./jobs.json', import.meta.url), 'utf8'));
const results = [];
const original = console.error;
for (const j of jobs) {
  const errors = [];
  console.error = (...a) => { errors.push(a.map(String).join(' ').slice(0, 500)); };
  let html = '', error = null;
  try {
    const mod = await import(pathToFileURL(j.bundle).href);
    html = mod.render(reviveProps(j.props));
  } catch (e) { error = String(e && e.stack || e).split('\\n').slice(0, 6).join(' | '); }
  console.error = original;
  results.push({ file: j.file, export: j.export, htmlLength: html.length, consoleErrors: errors, error, ok: !error && html.length > 0 && errors.length === 0 });
}
writeFileSync(new URL('./render-results.json', import.meta.url), JSON.stringify(results, null, 2));
`);
const r = run(process.execPath, [join(CANARY, 'render.mjs')], { cwd: APP, env: { ...process.env, NODE_ENV: 'development' } });
log('render.log', r);
const resultsPath = join(CANARY, 'render-results.json');
if (existsSync(resultsPath)) report.render.push(...JSON.parse(readFileSync(resultsPath, 'utf8')));
const expectedRenders = flagship.filter((c) => c.render).length;
const renderOk = r.status === 0 && report.render.length === expectedRenders && report.render.every((x) => x.ok);
step('render', renderOk, { summary: `${report.render.filter((x) => x.ok).length}/${expectedRenders} pages rendered clean`, log: 'render.log' });

finish();

function todoMarkdown() {
  const lines = ['# SURF migrate-4to5 canary (REQ-SURF-15)', '', `sha: ${report.sha ?? 'n/a'}  job: ${report.job ?? 'n/a'}`, `CLI: ${report.cli ?? 'n/a'}  tarball: ${report.tarball ?? 'n/a'} (${report.to ?? 'n/a'})`, '', '| step | ok | summary |', '| --- | --- | --- |'];
  for (const s of report.steps) lines.push(`| ${s.id} | ${s.ok ? 'pass' : 'FAIL'} | ${String(s.summary ?? '').replace(/\|/g, '\\|')} |`);
  lines.push('', '| case | subset | TODOs | handler buttons | ok | failures |', '| --- | --- | --- | --- | --- | --- |');
  for (const c of report.cases) {
    const todos = c.todos.map((t) => `[${t.transform}] ${t.reason}`).join('<br>');
    lines.push(`| ${c.file} | ${c.subset} | ${c.todos.length}${todos ? `<br>${todos}` : ''} | ${c.handlerButtons} | ${c.ok ? 'pass' : 'FAIL'} | ${c.failures.join('<br>')} |`.replace(/\n/g, ' '));
  }
  return `${lines.join('\n')}\n`;
}
