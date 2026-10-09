#!/usr/bin/env node
/* PLAT-296 / REQ-PLAT-78: verify the publishable tarball for AuraGlass 5.0.
   files exactly [dist, deprecations.json, llms.txt, README.md, LICENSE,
   CHANGELOG.md]; no bin; denylist enforced; packed <= 2,000,000 B and
   unpacked <= 8,000,000 B (beta). Sourcemaps ship separately as dist-maps.tgz. */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require2 = createRequire(import.meta.url);
const { parsePackJson } = require2('./lib/npm-pack.cjs');
const { evidenceDir } = require2('./lib/evidence-dir.cjs');

const argvRoot = (() => {
  const i = process.argv.indexOf('--root');
  return i >= 0 ? path.resolve(process.argv[i + 1]) : null;
})();
const ROOT = argvRoot ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PACKED_LIMIT = 2_000_000;
const UNPACKED_LIMIT = 8_000_000;
const TOP_FILES = new Set(['package.json', 'deprecations.json', 'llms.txt', 'README.md', 'LICENSE', 'CHANGELOG.md']);
/* denylist (PLAT-296): repo-root dirs (never shipped) are root-anchored;
   the nested bans apply anywhere in the tarball. dist/contracts/*.d.ts IS
   shipped (public contract types — dist/ is the only contracts dir allowed). */
const DENY = [
  /^bin\//, /\.map$/, /^dist\/esm\//, /__tests__/, /__snapshots__/, /^reports\//, /^scripts\//,
  /^server\//, /^src\//, /^legacy\//, /^contracts\//, /^tests\//, /^fragments\//,
  /(^|\/)services\//, /\.woff2?$/, /storybook-.*\.css$/, /\.tsbuildinfo$/, /^\.github\//, /^\.gitlab\//, /^ci\//,
  /^canaries\//, /\.test\./, /\.spec\./, /\.stories\./,
];

export function run() {
  const problems = [];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-pack-'));
  try {
    const out = execFileSync('npm', ['pack', '--json', '--pack-destination', tmp], { cwd: ROOT, encoding: 'utf8' });
    const packed = parsePackJson(out);
    const names = packed.files.map(f => f.path).sort();
    const sizes = Object.fromEntries(packed.files.map(f => [f.path, f.size ?? 0]));

    const badTop = names.filter(n => !(n.startsWith('dist/') || TOP_FILES.has(n)));
    if (badTop.length) problems.push(`unexpected top-level entries: ${badTop.slice(0, 10).join(', ')}`);
    for (const req of ['dist/', 'deprecations.json', 'llms.txt', 'README.md', 'LICENSE', 'CHANGELOG.md']) {
      if (!names.some(n => n === req.replace(/\/$/, '') || n.startsWith(req))) problems.push(`missing required ${req}`);
    }
    const denied = names.filter(n => DENY.some(re => re.test(n)));
    if (denied.length) problems.push(`denylist: ${denied.slice(0, 15).join(', ')}`);

    const tgz = path.join(tmp, packed.filename);
    const packedBytes = fs.statSync(tgz).size;
    const unpackedBytes = names.reduce((a, n) => a + (sizes[n] || 0), 0);
    if (packedBytes > PACKED_LIMIT) problems.push(`packed ${packedBytes} > ${PACKED_LIMIT}`);
    if (unpackedBytes > UNPACKED_LIMIT) problems.push(`unpacked ${unpackedBytes} > ${UNPACKED_LIMIT}`);

    const exdir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-pack-x-'));
    execFileSync('tar', ['-xzf', tgz, '-C', exdir]);
    const scan = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? scan(p) : [p];
    });
    for (const f of scan(exdir)) {
      const rel = path.relative(exdir, f);
      const text = fs.readFileSync(f);
      if (text.includes('@ag-contract-seed')) problems.push(`@ag-contract-seed inside ${rel}`);
      /* the contract's own ATTRIBUTES table declares 'data-ag-seed' as a type
         key (§1.2 R5) — d.ts declarations may name it; what must never ship
         is the attribute emitted by a module (js/css usage). */
      else if (rel.startsWith('package/dist/') && !rel.endsWith('.d.ts') && text.includes('data-ag-seed')) problems.push(`data-ag-seed inside ${rel}`);
    }
    fs.rmSync(exdir, { recursive: true, force: true });

    /* pack-breakdown: bytes per top-level dist dir — printed and written to
       .artifacts/plat/pack-breakdown.json for the pack job's artifacts. */
    const breakdown = {};
    for (const n of names) {
      const m = /^dist\/([^/]+)\//.exec(n);
      if (m) breakdown[m[1]] = (breakdown[m[1]] ?? 0) + (sizes[n] || 0);
    }
    const platDir = path.join(ROOT, '.artifacts', 'plat');
    fs.mkdirSync(platDir, { recursive: true });
    fs.writeFileSync(path.join(platDir, 'pack-breakdown.json'),
      JSON.stringify({ distDirs: breakdown, packedBytes, unpackedBytes }, null, 2) + '\n');
    console.log(`verify-pack: breakdown ${JSON.stringify(breakdown)}`);

    const dir = evidenceDir('pack');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'verify-pack.json'), JSON.stringify({
      fileCount: names.length, packedBytes, unpackedBytes, packedLimit: PACKED_LIMIT,
      unpackedLimit: UNPACKED_LIMIT, problems, generatedAt: new Date().toISOString(),
    }, null, 2));

    if (problems.length) { problems.forEach(p => console.error(`verify-pack: ${p}`)); return 1; }
    console.log(`verify-pack: ${names.length} files, packed ${packedBytes} B, unpacked ${unpackedBytes} B — clean`);
    return 0;
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(run());
