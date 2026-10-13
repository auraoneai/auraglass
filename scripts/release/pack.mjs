#!/usr/bin/env node
/* scripts/release/pack.mjs — plat:package:pack producer (REQ-PLAT-11, -16, -78).

   1. Packs every package contracts/packages.json marks `published: true` whose
      `dir` exists and is not `private`, with `npm pack --json` into
      .artifacts/pack/ (root package from the repo root, workspaces with -w).
   2. Writes .artifacts/plat/pack-record.json — per package {file, version,
      integrity, dir, size} — where `integrity` is the sha512 of the tarball on
      disk and must equal the integrity npm reported for the same pack.
      scripts/release/publish.mjs refuses to publish without it.
   3. Writes .artifacts/plat/dist-maps.tgz, the sourcemap release asset linked
      by plat:release:notes: on 5x from dist-maps/ (scripts/build/post.mjs
      stages the maps there so the packed dist/ is map-free), on 4x from
      dist/**\/*.map. No sourcemap at all is a failure, never an empty archive.
   4. Writes .artifacts/plat/pack.env (AURAGLASS_TARBALL=<root tarball>).

     node scripts/release/pack.mjs [--line 5x|4x] [--dest .artifacts/pack]
          [--plat .artifacts/plat]

   Run after the build (dist/ present). Exit 1 on any failure. */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sha512 = (f) => 'sha512-' + createHash('sha512').update(readFileSync(f)).digest('base64');

// npm pack --json prints a JSON array (npm <= 11) or an object keyed by
// package name (npm >= 12); lifecycle-script output may precede either.
// Normalized to the array shape here (scripts/ci/lib/npm-pack.cjs is the
// single-package twin of this logic).
export function parsePackJson(stdout) {
  const lines = String(stdout).split('\n');
  const start = lines.findIndex((l) => {
    const c = l.trimStart().charAt(0);
    return c === '[' || c === '{';
  });
  if (start === -1) throw new Error('npm pack --json output contained no JSON payload');
  const parsed = JSON.parse(lines.slice(start).join('\n'));
  const entries = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {});
  if (!entries.length) throw new Error('npm pack --json returned no entries');
  return entries;
}

export function publishedPackages(root) {
  const cp = join(root, 'contracts/packages.json');
  if (!existsSync(cp)) throw new Error('contracts/packages.json missing — it defines the package set');
  const contract = JSON.parse(readFileSync(cp, 'utf8'));
  const out = [];
  for (const [name, p] of Object.entries(contract.packages ?? {})) {
    if (p?.published !== true) continue;
    const pj = join(root, p.dir ?? '.', 'package.json');
    if (!existsSync(pj)) {
      console.log(`pack: ${name} (${p.dir}) not on this line — not packed`);
      continue;
    }
    const manifest = JSON.parse(readFileSync(pj, 'utf8'));
    if (manifest.private === true) {
      console.log(`pack: ${name} (${p.dir}) is private — not packed`);
      continue;
    }
    if (manifest.name !== name && manifest.name !== p.fallback) {
      throw new Error(`${p.dir}/package.json name ${manifest.name} is neither ${name} nor its fallback ${p.fallback}`);
    }
    out.push({ contractName: name, name: manifest.name, dir: p.dir ?? '.' });
  }
  return out;
}

function listMaps(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.map')) out.push(p);
    }
  };
  walk(dir);
  return out;
}

export function main(argv = process.argv.slice(2), { root = process.cwd() } = {}) {
  const arg = (n, d) => {
    const i = argv.indexOf(`--${n}`);
    return i >= 0 ? argv[i + 1] : d;
  };
  const line = arg('line', process.env.AG_LINE ?? '5x');
  const dest = resolve(root, arg('dest', '.artifacts/pack'));
  const plat = resolve(root, arg('plat', '.artifacts/plat'));
  mkdirSync(dest, { recursive: true });
  mkdirSync(plat, { recursive: true });

  const pkgs = publishedPackages(root);
  if (!pkgs.some((p) => p.dir === '.')) throw new Error('the root package is not in the published set');

  const record = {
    version: 1,
    line,
    sha: process.env.CI_COMMIT_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    pipeline: process.env.CI_PIPELINE_URL ?? null,
    packages: {},
  };
  let rootTarball = null;
  for (const p of pkgs) {
    const args = ['pack', '--json', '--pack-destination', dest];
    if (p.dir !== '.') args.push('-w', p.dir);
    const stdout = execFileSync('npm', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
    const entry = parsePackJson(stdout).find((e) => e.name === p.name);
    if (!entry) throw new Error(`npm pack for ${p.dir} reported no entry named ${p.name}`);
    const file = join(dest, entry.filename);
    if (!existsSync(file)) throw new Error(`npm pack reported ${entry.filename} but ${file} does not exist`);
    const integrity = sha512(file);
    if (entry.integrity && entry.integrity !== integrity) {
      throw new Error(`${p.name}: npm reported integrity ${entry.integrity}, tarball on disk is ${integrity}`);
    }
    record.packages[p.name] = {
      file: entry.filename,
      version: entry.version,
      integrity,
      dir: p.dir,
      size: statSync(file).size,
    };
    if (p.dir === '.') rootTarball = file;
    console.log(`pack: ${p.name}@${entry.version} -> ${relative(root, file)} ${integrity.slice(0, 22)}…`);
  }
  writeFileSync(join(plat, 'pack-record.json'), JSON.stringify(record, null, 2) + '\n');
  console.log(`pack: wrote ${relative(root, join(plat, 'pack-record.json'))} (${pkgs.length} packages)`);

  // dist-maps.tgz (REQ-PLAT-16 / -78)
  const mapsArchive = join(plat, 'dist-maps.tgz');
  if (line === '4x') {
    const maps = listMaps(join(root, 'dist')).map((f) => relative(root, f));
    if (!maps.length) throw new Error('no dist/**/*.map — the build emitted no sourcemaps for dist-maps.tgz');
    execFileSync('tar', ['-czf', mapsArchive, ...maps], { cwd: root });
    console.log(`pack: dist-maps.tgz (${maps.length} maps from dist/)`);
  } else {
    const maps = listMaps(join(root, 'dist-maps'));
    if (!maps.length) {
      throw new Error('dist-maps/ has no .map files — scripts/build/post.mjs stages them; run the build first');
    }
    execFileSync('tar', ['-czf', mapsArchive, 'dist-maps'], { cwd: root });
    console.log(`pack: dist-maps.tgz (${maps.length} maps from dist-maps/)`);
  }

  // gen-claims (REQ-PLAT-104) reads TARBALL_MB + PACK_SHA from pack.env;
  // both are measured here from the root tarball on disk and the pack SHA.
  const tarballMb = Math.round((statSync(rootTarball).size / (1024 * 1024)) * 100) / 100;
  writeFileSync(
    join(plat, 'pack.env'),
    `AURAGLASS_TARBALL=${relative(root, rootTarball)}\nTARBALL_MB=${tarballMb}\nPACK_SHA=${record.sha}\n`,
  );
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    process.exit(main());
  } catch (e) {
    console.error(`pack FAIL: ${e.message}`);
    process.exit(1);
  }
}
