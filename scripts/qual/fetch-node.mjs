#!/usr/bin/env node
/* scripts/qual/fetch-node.mjs — fetches official Node.js binaries for REQ-QUAL-47 (node cold import on Node 20.19.0
   and Node 22 LTS). QUAL-owned; runs in GitLab CI only (network). Each archive is verified against the release's
   SHASUMS256.txt before extraction. A bare major ("22") resolves to the newest LTS release of that major from
   https://nodejs.org/dist/index.json.

   Usage: node scripts/qual/fetch-node.mjs [--dest <dir>] <version|major>...
   Prints `export AG_COLD_IMPORT_NODE_BINS=<bin1>,<bin2>` on stdout (eval it in the job script). */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DIST = 'https://nodejs.org/dist';
const args = process.argv.slice(2);
const di = args.indexOf('--dest');
const dest = di >= 0 ? args.splice(di, 2)[1] : join(tmpdir(), 'ag-node-bins');
if (!args.length) { console.error('usage: fetch-node.mjs [--dest <dir>] <version|major>...'); process.exit(64); }

const platform = { linux: 'linux', darwin: 'darwin' }[process.platform];
const arch = { x64: 'x64', arm64: 'arm64' }[process.arch];
if (!platform || !arch) { console.error(`fetch-node: unsupported ${process.platform}/${process.arch}`); process.exit(1); }

const get = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch-node: GET ${url} → ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
};

let index;
async function resolveVersion(v) {
  if (/^\d+\.\d+\.\d+$/.test(v)) return `v${v}`;
  if (!/^\d+$/.test(v)) throw new Error(`fetch-node: bad version ${v}`);
  index ??= JSON.parse((await get(`${DIST}/index.json`)).toString('utf8'));
  const hit = index.find((r) => r.version.startsWith(`v${v}.`) && r.lts);
  if (!hit) throw new Error(`fetch-node: no LTS release for Node ${v}`);
  return hit.version;
}

const bins = [];
mkdirSync(dest, { recursive: true });
for (const want of args) {
  const version = await resolveVersion(want);
  const name = `node-${version}-${platform}-${arch}`;
  const bin = join(dest, name, 'bin', 'node');
  if (!existsSync(bin)) {
    const file = `${name}.tar.gz`;
    const sums = (await get(`${DIST}/${version}/SHASUMS256.txt`)).toString('utf8');
    const expected = sums.split('\n').map((l) => l.trim().split(/\s+/)).find((p) => p[1] === file)?.[0];
    if (!expected) throw new Error(`fetch-node: ${file} not listed in ${version}/SHASUMS256.txt`);
    const buf = await get(`${DIST}/${version}/${file}`);
    const actual = createHash('sha256').update(buf).digest('hex');
    if (actual !== expected) throw new Error(`fetch-node: sha256 mismatch for ${file}: ${actual} != ${expected}`);
    const tgz = join(dest, file);
    writeFileSync(tgz, buf);
    execFileSync('tar', ['-xzf', tgz, '-C', dest]);
    console.error(`fetch-node: ${version} sha256 ${actual} → ${bin}`);
  }
  bins.push(bin);
}
console.log(`export AG_COLD_IMPORT_NODE_BINS=${bins.join(',')}`);
