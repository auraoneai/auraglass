#!/usr/bin/env node
/* scripts/removal/consumer-grep.mjs — PLAT-223 (REQ-PLAT-81). Per-family
   consumer scan before an RM PR merges: word-boundary rg over aura-glass
   import specifiers in the known downstream checkouts plus `gh search code`
   (operator part — never blocking; its absence is recorded, not hidden).
   Writes docs/release/decisions/removals/RM-<nn>.json; --verify fails on a
   missing, stale (names drifted from dispositions) or unacknowledged record.

     node scripts/removal/consumer-grep.mjs --family RM-02 \
       [--roots /path/a,/path/b] [--timeout-secs 60] [--verify] [--write] */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DISPOSITIONS = join(ROOT, 'docs/inventory/component-dispositions.md');
export const DEFAULT_ROOTS = ['/Users/gurbakshchahal/AuraOne', '/Users/gurbakshchahal/platforms'];
const EXCLUDED = ['node_modules', '.git', '.next', 'dist', 'reports', 'storybook-static'];

// Family -> legacy path prefixes (PRD RM table; matches record `file` under legacy/).
export const FAMILY_PATHS = {
  'RM-01': ['server/', 'src/services/', 'src/lib/ai-client.ts'],
  'RM-02': ['src/components/ai/', 'src/components/voice/'],
  'RM-03': ['src/components/advanced/GlassBiometric', 'src/components/advanced/GlassEye', 'src/components/advanced/GlassNeuro', 'src/components/advanced/GlassPredictive', 'src/components/advanced/GlassContextual', 'src/components/advanced/GlassContext', 'src/components/advanced/GlassMeta', 'src/components/advanced/GlassSelf', 'src/components/advanced/GlassQuantum', 'src/components/quantum/', 'adaptiveAI', 'emotionalIntelligence', 'aiPersonalization', 'consciousnessOptimization', 'soundDesign'],
  'RM-04': ['src/components/advanced/GlassAchievement', 'src/components/social/', 'src/components/collaboration/'],
  'RM-05': ['src/components/cms/', 'src/components/ecommerce/'],
  'RM-06': ['src/components/effects/', 'src/components/immersive/', 'src/components/ar/', 'src/components/atmospheric/', 'src/components/houdini/', 'src/components/spatial/', 'src/components/experiential/', 'LiquidGlassGPU'],
  'RM-07': ['src/components/charts/', 'ModularGlassDataChart', 'GlassDataChart.tsx'],
  'RM-08': ['src/components/layouts/GlassFractal', 'src/components/layouts/GlassGolden', 'src/components/layouts/GlassTess', 'src/components/layouts/GlassIsland', 'src/components/layouts/GlassOrbital', 'src/components/demo/', 'src/components/website-components/', 'src/components/showcase/', 'examples/', 'visual-baselines/'],
  'RM-09': ['src/components/accessibility/', 'src/utils/contrastGuard.ts', 'useAutoTextContrast'],
  'RM-10': ['src/client/', 'src/ssr/', 'src/data/', 'src/constants/', 'src/registry/', 'src/reports/', 'src/types/glass-api-stable.ts', 'src/theme/tokens.ts', 'src/tokens/designConstants.ts', 'src/hooks/'],
  'RM-11': ['src/components/'],
  'RM-12': ['src/primitives/'],
};

export function dispositionsRows(text) {
  const rows = [];
  for (const m of text.matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*([A-Z]+)\s*\|\s*(yes|no)\s*\|\s*([a-z]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|$/gm)) {
    rows.push({ i: +m[1], name: m[2].replace(/\\\|/g, '|'), file: m[3] === '-' ? '' : m[3], disp: m[4], pub: m[5] === 'yes', dest: m[6], target: m[7], prd: m[8], note: m[9] });
  }
  return rows;
}
const tokenOf = (name) => name.split(/[\s(/]/)[0];

export function familyNames(family, rows) {
  const prefixes = FAMILY_PATHS[family];
  if (!prefixes) return null;
  const matched = rows.filter((r) => prefixes.some((p) =>
    r.file.startsWith(p) || tokenOf(r.name).startsWith(p.replace(/\.tsx$/, ''))));
  // RM-11 is the catch-all: records under src/components/** not claimed by
  // RM-02..RM-09.
  if (family === 'RM-11') {
    const claimed = new Set();
    for (const f of Object.keys(FAMILY_PATHS)) {
      if (f === 'RM-11' || f === 'RM-01' || f === 'RM-12') continue;
      for (const r of familyNames(f, rows) ?? []) claimed.add(r.name);
    }
    return rows.filter((r) => r.file.startsWith('src/components/') && !claimed.has(r.name));
  }
  return matched;
}

function rgName(root, name, timeoutMs) {
  try {
    const globArgs = EXCLUDED.flatMap((d) => ['--glob', `!${d}`]);
    const out = execFileSync('rg', ['--no-messages', '-n', '--max-count', '25', ...globArgs,
      String.raw`\b${name}\b`, root], { encoding: 'utf8', timeout: timeoutMs, maxBuffer: 4 * 1024 * 1024 });
    return out.split('\n').filter((l) => l.includes('aura-glass')).slice(0, 25);
  } catch { return []; }
}

export function ghSearch(names, { timeoutMs = 30000 } = {}) {
  try {
    const out = execFileSync('gh', ['search', 'code', '--owner', 'auraoneai', '--owner', 'gchahal1982',
      'aura-glass', '--limit', '50', '--json', 'repository,path'], { encoding: 'utf8', timeout: timeoutMs });
    return { status: 'ok', hits: JSON.parse(out) };
  } catch (e) {
    return { status: 'missing', reason: `gh search unavailable: ${String(e.message).split('\n')[0]}` };
  }
}

export function verifyRecord(family, record, currentNames) {
  const errors = [];
  if (!record) return [`no consumer-grep record for ${family}`];
  if (record.family !== family) errors.push(`record family ${record.family} != ${family}`);
  const stale = currentNames.filter((n) => !(record.names ?? []).includes(n));
  if (stale.length) errors.push(`stale: ${stale.length} names not in record (${stale.slice(0, 3).join(', ')}…)`);
  if (record.gh?.status === 'missing' && !record.acknowledged)
    errors.push('gh search missing and record not acknowledged (set acknowledged: true with the operator sign-off)');
  if (record.status === 'missing' && !record.acknowledged)
    errors.push('all roots missing and record not acknowledged');
  return errors;
}

export function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const family = arg('--family');
  const rows = existsSync(DISPOSITIONS) ? dispositionsRows(readFileSync(DISPOSITIONS, 'utf8')) : [];
  const namesFor = (fam) => [...new Set((familyNames(fam, rows) ?? []).map((r) => tokenOf(r.name)).filter(Boolean))].sort();

  /* bare --verify: loop every RM-<nn> record on disk (or every family when
     --all) and verify each — the gate uses this form. */
  if (argv.includes('--verify') && !family) {
    const fams = argv.includes('--all')
      ? Object.keys(FAMILY_PATHS).sort()
      : (readdirSync(join(ROOT, 'docs/release/decisions/removals'))
          .filter((f) => /^RM-\d+\.json$/.test(f)).map((f) => f.replace('.json', '')).sort());
    let bad = 0;
    for (const fam of fams) {
      const recordPath = join(ROOT, `docs/release/decisions/removals/${fam}.json`);
      const record = existsSync(recordPath) ? JSON.parse(readFileSync(recordPath, 'utf8')) : null;
      const errors = verifyRecord(fam, record, namesFor(fam));
      if (errors.length) { bad++; for (const e of errors) console.error(`FAIL consumer-grep --verify ${fam}: ${e}`); }
      else console.log(`consumer-grep --verify ${fam}: record current (${namesFor(fam).length} names)`);
    }
    return bad ? 1 : 0;
  }

  if (!family || !/^RM-\d+$/.test(family)) { console.error('usage: --family RM-<nn> [--verify|--write]'); return 2; }
  const names = namesFor(family);
  const recordPath = join(ROOT, `docs/release/decisions/removals/${family}.json`);

  if (argv.includes('--verify')) {
    const record = existsSync(recordPath) ? JSON.parse(readFileSync(recordPath, 'utf8')) : null;
    const errors = verifyRecord(family, record, names);
    if (errors.length) { for (const e of errors) console.error(`FAIL consumer-grep --verify ${family}: ${e}`); return 1; }
    console.log(`consumer-grep --verify ${family}: record current (${names.length} names)`);
    return 0;
  }

  const roots = (arg('--roots') ?? DEFAULT_ROOTS.join(',')).split(',').filter(Boolean);
  const timeoutMs = Number(arg('--timeout-secs') ?? 60) * 1000;
  const missingRoots = roots.filter((r) => !existsSync(r));
  const scans = roots.filter((r) => existsSync(r)).map((r) => ({
    root: r, hits: names.flatMap((n) => rgName(r, n, timeoutMs)),
  }));
  const gh = ghSearch(names);
  const record = {
    family, generatedAt: new Date().toISOString(), names,
    status: missingRoots.length === roots.length ? 'missing' : 'ok',
    missingRoots, scans: scans.map((s) => ({ root: s.root, hitCount: s.hits.length, hits: s.hits.slice(0, 50) })),
    gh,
    acknowledged: false,
    note: missingRoots.length === roots.length
      ? 'AuraOne checkouts are on the owner machine; record regenerated there at the family\'s PR step.'
      : undefined,
  };
  if (argv.includes('--write')) {
    // Keep the removal commit pointer (revert-dry-run.mjs reads it) on rewrite.
    if (existsSync(recordPath)) {
      const prev = JSON.parse(readFileSync(recordPath, 'utf8'));
      for (const k of ['mergeSha', 'sha']) if (prev[k]) record[k] = prev[k];
    }
    mkdirSync(dirname(recordPath), { recursive: true });
    writeFileSync(recordPath, JSON.stringify(record, null, 2));
    console.log(`consumer-grep ${family}: wrote ${recordPath} (${names.length} names, status=${record.status})`);
  } else {
    console.log(JSON.stringify({ family, names: names.length, status: record.status, gh: gh.status }));
  }
  return 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
