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
import { existsSync, mkdirSync, writeFileSync, realpathSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REMOVED_SYMBOLS = [
  'DynamicAtmosphere', 'services', 'api-server', 'createAuraServer',
];

function rg(root, pattern, timeoutMs) {
  try {
    const out = execFileSync('rg', ['--no-messages', '-n', '--max-count', '50',
      '--glob', '!node_modules', '--glob', '!.git', pattern, root],
      { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 4 * 1024 * 1024 });
    return out.split('\n').filter(Boolean);
  } catch (e) { return e.killed || e.signal === 'SIGTERM' ? ['__TIMEOUT__'] : []; }
}

export function safeRoot(root) {
  const real = realpathSync(root);
  const home = realpathSync(homedir());
  if (real === '/' || real === home) return { ok: false, reason: `refusing to scan ${real}` };
  return { ok: true, real };
}

export function scanRoot(root, { timeoutSecs = 60 } = {}) {
  if (!existsSync(root)) return { root, status: 'missing', pins: [], imports: [], servicesImports: [], removedSymbolHits: [] };
  const s = safeRoot(root);
  if (!s.ok) return { root, status: 'refused', reason: s.reason, pins: [], imports: [], servicesImports: [], removedSymbolHits: [] };
  const real = s.real; const ms = timeoutSecs * 1000;
  const pins = rg(real, String.raw`["']aura-glass["']\s*:\s*["'][^"']+["']`, ms);
  const imports = rg(real, String.raw`from\s+["']aura-glass(/[^"']*)?["']|require\(\s*["']aura-glass`, ms);
  const servicesImports = rg(real, String.raw`aura-glass/(services|server|api)[/"']`, ms);
  const removedSymbolHits = REMOVED_SYMBOLS.flatMap((sym) =>
    rg(real, `\\b${sym}\\b`, ms).map((l) => `${sym}: ${l}`));
  const timedOut = [...pins, ...imports, ...servicesImports, ...removedSymbolHits].includes('__TIMEOUT__');
  return { root: real, status: timedOut ? 'partial-timeout' : 'ok', pins, imports, servicesImports, removedSymbolHits };
}

export function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const roots = (arg('--roots') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const timeoutSecs = Number(arg('--timeout-secs') ?? 60);
  const out = resolve(arg('--out') ?? join(ROOT, '.artifacts/plat/downstream-report.json'));
  const results = roots.map((r) => scanRoot(r, { timeoutSecs }));
  const report = { generatedAt: new Date().toISOString(), tool: 'downstream-grep', roots: results };
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));
  const missing = results.filter((r) => r.status === 'missing');
  for (const r of results) console.log(`downstream ${r.root}: ${r.status} pins=${r.pins.length} imports=${r.imports.length} removedHits=${r.removedSymbolHits.length}`);
  console.log(`report -> ${out}`);
  return missing.length === results.length && results.length ? 2 : 0; // all-missing is a signal, not success
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
