#!/usr/bin/env node
/* scripts/release/downstream-grep.mjs — PLAT-212. Bounded grep over known
   downstream consumer checkouts, producing .artifacts/plat/downstream-report.json
   with {root, pins, imports, servicesImports, removedSymbolHits} per root.

     node scripts/release/downstream-grep.mjs --roots /path/to/app,/path/to/lib \
       [--timeout-secs 60] [--out .artifacts/plat/downstream-report.json]

   Safety: refuses to scan $HOME or /, refuses roots that don't exist, caps the
   per-root time at 60s (bounded `rg`, no recursion into node_modules). The
   AuraOne checkouts live on the owner's Mac — absent roots are reported as
   'missing', never as clean.                                                 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// Build/lock/vendor dirs are always excluded — hits in them are artifacts,
// not consumer code (REQ-PLAT-35).
const EXCLUDE_GLOBS = ['!node_modules', '!.git', '!dist', '!build', '!.next',
  '!reports', '!storybook-static', '!package-lock.json', '!pnpm-lock.yaml',
  '!yarn.lock', '!bun.lockb', '!coverage', '!.artifacts'];

// Removed symbols come from the deprecations fragments (removeIn '5.0.0'),
// not a hard-coded list — the grep set tracks the register.
export async function removedSymbols(root = ROOT, removeIn = '5.0.0') {
  const { loadFragments } = await import(
    new URL(`file://${resolve(join(root, 'src/contracts/load-fragments.mjs'))}`).href);
  const rows = await loadFragments('deprecations', root);
  const syms = new Set();
  // Fragments may arrive flat or as {stream,file,value:[entries]} blocks.
  const entries = rows.flatMap((raw) => Array.isArray(raw?.value)
    ? raw.value : (raw?.kind ? [raw] : (raw?.value ? [raw.value] : [])));
  for (const e of entries) {
    if (e.removeIn !== removeIn) continue;
    if (['export', 'prop', 'subpath'].includes(e.kind) && e.symbol
        && /^[A-Za-z_$][\w$.]*$/.test(e.symbol)) syms.add(e.symbol);
  }
  return [...syms].sort();
}

function rg(root, pattern, timeoutMs) {
  try {
    const args = ['--no-messages', '-n', '--max-count', '50'];
    for (const g of EXCLUDE_GLOBS) args.push('--glob', g);
    const out = execFileSync('rg', [...args, pattern, root],
      { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 4 * 1024 * 1024 });
    return out.split('\n').filter(Boolean);
  } catch (e) { return e.killed || e.signal === 'SIGTERM' ? ['__TIMEOUT__'] : []; }
}

// 'rg -n' emits '<file>:<line>:<text>' — parse into structured hits.
export function parseHits(lines) {
  return lines.filter((l) => l !== '__TIMEOUT__').map((l) => {
    const m = l.match(/^(.+?):(\d+):(.*)$/);
    return m ? { file: m[1], line: Number(m[2]), spec: m[3].trim() }
      : { file: null, line: null, spec: l };
  });
}

export function safeRoot(root) {
  const real = realpathSync(root);
  const home = realpathSync(homedir());
  if (real === '/' || real === home) return { ok: false, reason: `refusing to scan ${real}` };
  return { ok: true, real };
}

export async function scanRoot(root, { timeoutSecs = 60, symbols = [] } = {}) {
  if (!existsSync(root)) return { root, status: 'missing', pins: [], imports: [], servicesImports: [], removedSymbolHits: [] };
  const s = safeRoot(root);
  if (!s.ok) return { root, status: 'refused', reason: s.reason, pins: [], imports: [], servicesImports: [], removedSymbolHits: [] };
  const real = s.real; const ms = timeoutSecs * 1000;
  const pins = rg(real, String.raw`["']aura-glass["']\s*:\s*["'][^"']+["']`, ms);
  const imports = rg(real, String.raw`from\s+["']aura-glass(/[^"']*)?["']|require\(\s*["']aura-glass`, ms);
  const servicesImports = rg(real, String.raw`aura-glass/(services|server|api)[/"']`, ms);
  const rawHits = symbols.flatMap((sym) =>
    rg(real, `\\b${sym}\\b`, ms).map((l) => ({ symbol: sym, hit: l })));
  const timedOut = [...pins, ...imports, ...servicesImports, ...rawHits.map((r) => r.hit)].includes('__TIMEOUT__');
  return {
    root: real, status: timedOut ? 'partial-timeout' : 'ok',
    pins: parseHits(pins), imports: parseHits(imports), servicesImports: parseHits(servicesImports),
    removedSymbolHits: rawHits.map((h) => ({ symbol: h.symbol, ...parseHits([h.hit])[0] })),
  };
}

export async function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const roots = (arg('--roots') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const timeoutSecs = Number(arg('--timeout-secs') ?? 60);
  const version = arg('--version') ?? JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  const out = resolve(arg('--out') ?? join(ROOT, 'docs/release/decisions', `downstream-${version}.json`));
  const removeIn = arg('--remove-in') ?? '5.0.0';
  const symbols = await removedSymbols(ROOT, removeIn);
  const results = [];
  for (const r of roots) results.push(await scanRoot(r, { timeoutSecs, symbols }));
  // PRD report shape: per-root status + structured hits + the symbol set used.
  const report = {
    generatedAt: new Date().toISOString(), tool: 'downstream-grep', version, removeIn,
    symbols, symbolsCount: symbols.length, roots: results,
    summary: {
      roots: results.length,
      missing: results.filter((r) => r.status === 'missing').map((r) => r.root),
      refused: results.filter((r) => r.status === 'refused').map((r) => r.root),
      removedSymbolHitCount: results.reduce((n, r) => n + r.removedSymbolHits.length, 0),
      importHitCount: results.reduce((n, r) => n + r.imports.length, 0),
    },
  };
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));
  const missing = results.filter((r) => r.status === 'missing');
  for (const r of results) console.log(`downstream ${r.root}: ${r.status} pins=${r.pins.length} imports=${r.imports.length} removedHits=${r.removedSymbolHits.length}`);
  console.log(`report -> ${out}`);
  return missing.length === results.length && results.length ? 2 : 0; // all-missing is a signal, not success
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
