#!/usr/bin/env node
/* scripts/removal/verify-archive.mjs — REQ-PLAT-82 (PLAT-225). Verifies, with
   read-only `gh`, that the private auraoneai/auraglass-server-archive repo
   carries byte-identical copies of the archived server surface, and that the
   GHSA for the 4.x JWT_SECRET exposure is published.

     node scripts/removal/verify-archive.mjs            # report
     node scripts/removal/verify-archive.mjs --verify   # gate: exit 1 on any miss
     node scripts/removal/verify-archive.mjs --write    # write RM-01-archive.json

   Archived paths (release/4.x branch point -> archive repo):
     server/**              (git subtree split --prefix=server -> server/)
     src/services/**        (tree copy -> src/services/)
     src/lib/ai-client.ts   (-> src/lib/ai-client.ts)
     Dockerfile, docker-compose.yml, tsconfig.server.json   */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const ARCHIVE_REPO = 'auraoneai/auraglass-server-archive';
export const BASE_REF = 'release/4.x';
const RECORD = join(ROOT, 'docs/release/decisions/removals/RM-01-archive.json');
const RM01 = join(ROOT, 'docs/release/decisions/removals/RM-01.json');

/* archive-repo path -> 4.x source path (identical except server/ -> server/) */
const MAP = [
  ['server/', 'server/'],
  ['src/services/', 'src/services/'],
  ['src/lib/ai-client.ts', 'src/lib/ai-client.ts'],
  ['Dockerfile', 'Dockerfile'],
  ['docker-compose.yml', 'docker-compose.yml'],
  ['tsconfig.server.json', 'tsconfig.server.json'],
];

const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', timeout: 30000 });

export function checkGhsa(id) {
  if (!id) return { status: 'missing', reason: 'no GHSA id recorded in RM-01.json (owner: publish then set gate.ghsa.id)' };
  try {
    const out = gh(['api', `repos/auraoneai/auraglass/security-advisories/${id}`]);
    const adv = JSON.parse(out);
    return adv.state === 'published'
      ? { status: 'ok', id, url: adv.html_url }
      : { status: 'missing', id, reason: `advisory state ${adv.state} != published` };
  } catch (e) {
    return { status: 'missing', id, reason: `gh api failed: ${String(e.message).split('\n')[0]}` };
  }
}

const gitShow = (spec) => {
  try { return execFileSync('git', ['show', spec], { cwd: ROOT, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }); }
  catch { return null; }
};

const ghFile = (path) => {
  try {
    const out = gh(['api', `repos/${ARCHIVE_REPO}/contents/${path}`, '--jq', '.content']);
    return Buffer.from(out.trim(), 'base64').toString('utf8');
  } catch { return null; }
};

export function compareArchive(root = ROOT) {
  const results = [];
  for (const [archPath, srcPath] of MAP) {
    if (archPath.endsWith('/')) {
      /* directory: compare every file under the 4.x source tree */
      const files = execFileSync('git', ['ls-tree', '-r', '--name-only', `origin/${BASE_REF}`, '--', srcPath],
        { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
      for (const f of files) {
        const arch = f; /* subtree split keeps server/ as repo root? spec: --prefix=server produces content at repo root; the archive preserves it under server/ via tree copy layout */
        const expected = gitShow(`origin/${BASE_REF}:${f}`);
        const actual = ghFile(arch);
        results.push({ path: arch, ok: expected !== null && actual === expected });
      }
    } else {
      const expected = gitShow(`origin/${BASE_REF}:${srcPath}`);
      const actual = ghFile(archPath);
      results.push({ path: archPath, ok: expected !== null && actual === expected });
    }
  }
  return results;
}

export function main(argv = process.argv.slice(2)) {
  const rm01 = existsSync(RM01) ? JSON.parse(readFileSync(RM01, 'utf8')) : {};
  const ghsaId = rm01.gate?.ghsa?.id ?? null;
  const ghsa = checkGhsa(ghsaId);
  let archive;
  try {
    archive = compareArchive();
  } catch (e) {
    archive = { status: 'missing', reason: `archive repo unreachable: ${String(e.message).split('\n')[0]}` };
  }
  const paths = Array.isArray(archive) ? archive : [];
  const bad = paths.filter((p) => !p.ok);
  const out = {
    family: 'RM-01',
    verifiedAt: new Date().toISOString(),
    ghsa,
    archive: Array.isArray(archive)
      ? { status: bad.length ? 'missing' : 'ok', compared: paths.length, mismatched: bad.map((b) => b.path) }
      : archive,
    status: (ghsa.status === 'ok' && Array.isArray(archive) && !bad.length) ? 'ok' : 'missing',
  };
  if (argv.includes('--write')) {
    writeFileSync(RECORD, JSON.stringify(out, null, 2) + '\n');
    console.log(`verify-archive: wrote ${RECORD} status=${out.status}`);
    return out.status === 'ok' ? 0 : 1;
  }
  console.log(JSON.stringify(out, null, 2));
  if (argv.includes('--verify')) return out.status === 'ok' ? 0 : 1;
  return 0;
}
if (process.argv[1]?.endsWith('verify-archive.mjs')) process.exit(main());
