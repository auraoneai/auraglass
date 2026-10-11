#!/usr/bin/env node
/* REQ-QUAL-07 (FIN-427): writes certification/scenes/scenes.manifest.json from the committed scene files.
   Every number (sha256, size, dimensions, luminance, sigma, colourfulness, block share, video duration) is
   computed here by decoding the files with scripts/qual/scenes/decode.mjs; licence/source come from the
   machine-written scripts/qual/scenes/provenance.json (fetch-sources.mjs + generate.mjs). Nothing is typed by hand.
   Usage: node scripts/qual/scenes/write-manifest.mjs [--check]   (--check exits 1 when the committed manifest differs) */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeImage, sceneStats, webmDuration, webmSize, LUMINANCE_DEFINITION } from './decode.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const DIR = join(ROOT, 'certification/scenes');
const MANIFEST = join(DIR, 'scenes.manifest.json');

// SCENES / SCENE_BACKDROP are read from the frozen contract source (src/contracts/testing.ts) so this
// script cannot drift from S-42; a TS import would need a loader, the literal is parsed instead.
export function readContractScenes(root = ROOT) {
  const src = readFileSync(join(root, 'src/contracts/testing.ts'), 'utf8');
  const scenes = JSON.parse(src.match(/export const SCENES = (\[[^\]]+\])/)[1].replace(/'/g, '"'));
  const body = src.match(/export const SCENE_BACKDROP[^=]*=\s*\{([^}]+)\}/)[1];
  const backdrop = Object.fromEntries([...body.matchAll(/'?([\w-]+)'?\s*:\s*'(\w+)'/g)].map((m) => [m[1], m[2]]));
  return { scenes, backdrop };
}

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

export function buildManifest(root = ROOT) {
  const prov = JSON.parse(readFileSync(join(root, 'scripts/qual/scenes/provenance.json'), 'utf8'));
  const { scenes, backdrop } = readContractScenes(root);
  const dir = join(root, 'certification/scenes');
  const out = {};
  for (const id of scenes) {
    const d = prov.derivation[id];
    if (!d) throw new Error(`provenance.json has no derivation for ${id}`);
    const buf = readFileSync(join(dir, d.file));
    const img = decodeImage(buf);
    const commons = prov.files[id];
    const source = commons
      ? { kind: 'wikimedia-commons', title: commons.title, page: commons.pageUrl, original: commons.originalUrl, author: commons.author,
        credit: commons.credit, retrievedAt: prov.retrievedAt, originalSha1: commons.sha1, derivation: d.commands }
      : { kind: 'generated', generator: 'scripts/qual/scenes/generate.mjs', description: d.pixels, derivation: d.commands,
        ...(id === 'dense-text' ? { fonts: prov.fonts } : {}) };
    const entry = {
      file: d.file, sha256: sha256(buf), bytes: buf.length,
      licence: commons ? commons.licence : 'MIT', licenceUrl: commons ? commons.licenceUrl : 'https://opensource.org/license/mit',
      source, width: img.width, height: img.height, ...sceneStats(img), luminance: LUMINANCE_DEFINITION, backdrop: backdrop[id],
    };
    if (d.video) {
      const v = readFileSync(join(dir, d.video));
      entry.video = { file: d.video, sha256: sha256(v), bytes: v.length, durationSeconds: webmDuration(v), ...webmSize(v), licence: entry.licence };
    }
    out[id] = entry;
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const next = `${JSON.stringify(buildManifest(), null, 2)}\n`;
  if (process.argv.includes('--check')) {
    const cur = readFileSync(MANIFEST, 'utf8');
    if (cur !== next) { console.error('scenes.manifest.json is stale: run node scripts/qual/scenes/write-manifest.mjs'); process.exit(1); }
    console.log('scenes.manifest.json up to date');
  } else {
    writeFileSync(MANIFEST, next);
    const total = Object.values(JSON.parse(next)).reduce((s, e) => s + e.bytes + (e.video?.bytes ?? 0), 0);
    console.log(`wrote ${MANIFEST} (${Object.keys(JSON.parse(next)).length} scenes, ${total} bytes; manifest ${statSync(MANIFEST).size} bytes)`);
  }
}
