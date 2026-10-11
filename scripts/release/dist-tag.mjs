#!/usr/bin/env node
/* dist-tag.mjs (REQ-PLAT-14): pure dist-tag policy + monotonic guard.
   Library (network-free):
     distTagFor(version, { ga, rollback, v4DistTag }) -> 'next' | 'latest' | v4DistTag; throws otherwise.
     cmpSemver(a, b) -> -1 | 0 | 1 (full semver 2.0 precedence, prerelease < release).
     monotonicViolation(tag, newVersion, currentVersion, { rollbackOk }) -> null | message.
   CLI:
     node scripts/release/dist-tag.mjs <version> [--ga true|false] [--rollback true] [--v4-dist-tag t]
     node scripts/release/dist-tag.mjs --check <tag> --line <4x|5x> --v4-dist-tag t [--ga true|false]
            [--package aura-glass] [--out .artifacts/plat/<slug>/dist-tags.json]
   Rules: pre-release -> 'next'; 4.x stable -> 'latest' before 5.0 GA, v4DistTag after GA,
   'latest' again on an explicit rollback; 5.x stable -> 'latest'; anything else throws.
   The registry is read only by the CLI (--check, and GA detection when --ga is not given)
   and by publish.mjs; distTagFor itself never touches the network. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

export function parseSemver(v) {
  const m = SEMVER.exec(String(v).replace(/^v/, ''));
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]), pre: m[4] ? m[4].split('.') : [] };
}

export function distTagFor(version, { v4DistTag = 'latest', ga = false, rollback = false } = {}) {
  const p = parseSemver(version);
  if (!p) throw new Error(`dist-tag: not semver: ${version}`);
  if (p.pre.length) return 'next';
  if (p.major === 4) {
    // Deliberate rollback publish: 'latest' moves back to 4.x (AG_ROLLBACK_LATEST_TO_4X).
    if (rollback) return 'latest';
    return ga ? v4DistTag : 'latest';
  }
  if (p.major === 5) return 'latest';
  throw new Error(`dist-tag: no rule for major ${p.major} (${version})`);
}

// Semver 2.0 §11 precedence.
export function cmpSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) throw new Error(`dist-tag: cannot compare non-semver ${!pa ? a : b}`);
  for (const k of ['major', 'minor', 'patch']) {
    if (pa[k] !== pb[k]) return pa[k] < pb[k] ? -1 : 1;
  }
  if (!pa.pre.length && !pb.pre.length) return 0;
  if (!pa.pre.length) return 1;
  if (!pb.pre.length) return -1;
  const n = Math.max(pa.pre.length, pb.pre.length);
  for (let i = 0; i < n; i++) {
    const x = pa.pre[i];
    const y = pb.pre[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xn = /^\d+$/.test(x);
    const yn = /^\d+$/.test(y);
    if (xn && yn) {
      if (Number(x) !== Number(y)) return Number(x) < Number(y) ? -1 : 1;
    } else if (xn !== yn) {
      return xn ? -1 : 1;
    } else if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  return 0;
}

// Monotonic guard (REQ-PLAT-14): a publish to `tag` must be semver-greater than the
// version the tag holds now. The only exception is a 4.x publish to 'latest' when the
// release owner set the protected variable AG_ROLLBACK_LATEST_TO_4X=true.
export function monotonicViolation(tag, newVersion, currentVersion, { rollbackOk = false } = {}) {
  if (!currentVersion) return null;
  if (cmpSemver(newVersion, currentVersion) > 0) return null;
  if (tag === 'latest' && rollbackOk && parseSemver(newVersion)?.major === 4) return null;
  return (
    `dist-tag '${tag}' would not move forward: ${currentVersion} -> ${newVersion}` +
    (tag === 'latest' ? ' (a deliberate 4.x rollback needs AG_ROLLBACK_LATEST_TO_4X=true)' : '')
  );
}

// GA marker: 5.0 GA exists once a stable 5.x.y holds 'latest'.
export function isGaFromDistTags(map) {
  const latest = map?.latest;
  const p = latest ? parseSemver(latest) : null;
  return Boolean(p && p.major >= 5 && !p.pre.length);
}

function registryDistTags(pkg) {
  const out = execFileSync('npm', ['view', pkg, 'dist-tags', '--json'], {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return JSON.parse(out || '{}');
}

function main(argv) {
  const arg = (n) => {
    const i = argv.indexOf(`--${n}`);
    return i >= 0 ? argv[i + 1] : null;
  };
  const check = arg('check');
  const v4DistTag = arg('v4-dist-tag') ?? process.env.AG_V4_DIST_TAG ?? 'latest';
  const line = arg('line') ?? process.env.AG_LINE ?? '';
  const pkg = arg('package') ?? 'aura-glass';
  const out = arg('out');
  const rollback = arg('rollback') === 'true' || process.env.AG_ROLLBACK_LATEST_TO_4X === 'true';

  if (check) {
    // Read-only verification of the registry after a publish (plat:release:verify-dist-tags).
    const version = check.replace(/^v/, '');
    if (!parseSemver(version)) {
      console.error(`dist-tag --check: '${check}' is not a release tag`);
      return 1;
    }
    let map;
    try {
      map = registryDistTags(pkg);
    } catch (e) {
      console.error(`dist-tag --check: registry read failed: ${e.message}`);
      return 1;
    }
    const ga = arg('ga') != null ? arg('ga') === 'true' : isGaFromDistTags(map);
    const expected = distTagFor(version, { v4DistTag, ga, rollback });
    const holding = Object.entries(map).filter(([, v]) => v === version).map(([t]) => t);
    const ok = holding.includes(expected);
    const record = {
      package: pkg,
      tag: check,
      version,
      line,
      ga,
      rollback,
      expected,
      holding,
      registry: map,
      ok,
      checkedAt: new Date().toISOString(),
      pipeline: process.env.CI_PIPELINE_URL ?? null,
      job: process.env.CI_JOB_URL ?? null,
    };
    if (out) {
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, JSON.stringify(record, null, 2) + '\n');
      console.log(`dist-tag --check: wrote ${out}`);
    }
    if (!ok) {
      console.error(
        `dist-tag --check FAIL: ${pkg}@${version} expected on '${expected}' (line ${line || 'n/a'}), ` +
          `registry has it on [${holding.join(', ') || 'none'}]`,
      );
      return 1;
    }
    console.log(`dist-tag --check OK: ${pkg}@${version} -> ${expected}`);
    return 0;
  }

  const version = argv[0];
  if (!version || version.startsWith('-')) {
    console.error('usage: dist-tag.mjs <version> [--ga true|false] [--rollback true] [--v4-dist-tag t] | --check <tag> ...');
    return 2;
  }
  let ga = arg('ga') === 'true';
  if (arg('ga') == null) {
    try {
      ga = isGaFromDistTags(registryDistTags(pkg));
    } catch (e) {
      console.error(`dist-tag: cannot determine GA state (pass --ga true|false): ${e.message}`);
      return 1;
    }
  }
  try {
    console.log(distTagFor(version, { v4DistTag, ga, rollback }));
  } catch (e) {
    console.error(e.message);
    return 1;
  }
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)));
}
