#!/usr/bin/env node
/* gen-peaks-voice.mjs — SURF-467: decode a licensed/CC0 voice clip with
 * ffmpeg (remote job) and write src/media/__fixtures__/peaks-voice.json —
 * 1,024 max-abs peaks, source + licence + sha256 recorded. Run:
 *   node scripts/surf/gen-peaks-voice.mjs --url <clip-url> --licence CC0 --out src/media/__fixtures__/peaks-voice.json
 * The committed fixture carries its own sha256; this script regenerates it. */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) =>
  a.startsWith('--') ? [a.slice(2), arr[i + 1]] : null).filter(Boolean));
const url = args.url ?? 'https://commons.wikimedia.org/wiki/Special:FilePath/En-us-hello.ogg';
const licence = args.licence ?? 'CC0 / public domain (Wikimedia Commons En-us-hello.ogg)';
const out = args.out ?? new URL('../../src/media/__fixtures__/peaks-voice.json', import.meta.url).pathname;

// Decode mono 8kHz s16le via ffmpeg, then max-abs bucket into 1024 peaks.
const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', url.startsWith('http') ? 'pipe:0' : url,
  '-ac', '1', '-ar', '8000', '-f', 's16le', 'pipe:1'],
  url.startsWith('http') ? { input: execFileSync('curl', ['-sSL', url]) } : {});
const n = Math.floor(pcm.length / 2);
const peaks = [];
for (let i = 0; i < 1024; i++) {
  const lo = Math.floor((i / 1024) * n), hi = Math.max(lo + 1, Math.floor(((i + 1) / 1024) * n));
  let m = 0;
  for (let j = lo; j < hi; j++) m = Math.max(m, Math.abs(pcm.readInt16LE(j * 2)));
  peaks.push(Number((m / 32768).toFixed(4)));
}
const payload = { source: url, licence, peaks };
const json = JSON.stringify(payload, null, 1) + '\n';
payload.sha256 = createHash('sha256').update(json).digest('hex');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(payload, null, 1) + '\n');
console.log(`wrote ${out} (${payload.sha256.slice(0, 12)}…)`);
