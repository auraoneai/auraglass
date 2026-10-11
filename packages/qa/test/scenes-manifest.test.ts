/**
 * @jest-environment node
 */
/* REQ-QUAL-07 (FIN-427): certification/scenes manifest integrity.
   - exactly the 8 SCENES ids (S-42), 9 asset files on disk (8 stills + video-frame.webm), nothing unlisted
   - sha256 / bytes / dimensions (>= 2880×1800) of every file match the manifest; backdrop === SCENE_BACKDROP
   - licence recorded for every asset; photo and dark-media are CC0 or owned; Commons sources carry their page URL
   - total <= 6 MB; the manifest equals what scripts/qual/scenes/write-manifest.mjs computes (no hand-typed numbers)
   - `npm pack --dry-run --json` lists no certification/scenes file (scenes ship only in Storybook) */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCENES, SCENE_ASSETS, SCENE_BACKDROP } from '../../../src/contracts/testing';
import { decodeImage } from '../../../scripts/qual/scenes/decode.mjs';
import { buildManifest } from '../../../scripts/qual/scenes/write-manifest.mjs';

const ROOT = join(__dirname, '../../..');
const DIR = join(ROOT, SCENE_ASSETS.dir);
type Entry = {
  file: string; sha256: string; bytes: number; licence: string; licenceUrl: string; width: number; height: number;
  meanLuminance: number; luminanceSigma: number; backdrop: string;
  source: { kind: 'wikimedia-commons' | 'generated'; page?: string; original?: string; generator?: string };
  video?: { file: string; sha256: string; bytes: number; durationSeconds: number; width: number; height: number };
};
const manifest = JSON.parse(readFileSync(join(ROOT, SCENE_ASSETS.manifest), 'utf8')) as Record<string, Entry>;
const ASSET = /\.(jpe?g|png|webp|avif|webm|mp4)$/i;
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const OWNED_OR_CC0 = new Set(['CC0', 'MIT']);   // MIT = generated in-repo (owned), under the repository licence
const REPO_LICENCE = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).license as string;

describe('certification/scenes manifest (REQ-QUAL-07)', () => {
  it('has exactly the 8 SCENES entries', () => {
    expect(Object.keys(manifest).sort()).toEqual([...SCENES].sort());
  });

  it('directory holds exactly 9 asset files, all listed in the manifest', () => {
    const onDisk = readdirSync(DIR).filter((f) => ASSET.test(f)).sort();
    const listed = Object.values(manifest).flatMap((e) => [e.file, ...(e.video ? [e.video.file] : [])]).sort();
    expect(onDisk).toHaveLength(9);
    expect(onDisk).toEqual(listed);
    expect(manifest['video-frame']!.video?.file).toBe('video-frame.webm');
  });

  it.each(SCENES)('%s: sha256, bytes, dimensions and backdrop', (id) => {
    const e = manifest[id]!;
    const buf = readFileSync(join(DIR, e.file));
    expect(sha(buf)).toBe(e.sha256);
    expect(buf.length).toBe(e.bytes);
    const img = decodeImage(buf);
    expect([img.width, img.height]).toEqual([e.width, e.height]);
    expect(e.width).toBeGreaterThanOrEqual(2880);
    expect(e.height).toBeGreaterThanOrEqual(1800);
    expect(e.backdrop).toBe(SCENE_BACKDROP[id]);
    if (e.video) {
      const v = readFileSync(join(DIR, e.video.file));
      expect(sha(v)).toBe(e.video.sha256);
      expect(v.length).toBe(e.video.bytes);
      expect(e.video.width).toBeGreaterThanOrEqual(2880);
      expect(e.video.height).toBeGreaterThanOrEqual(1800);
    }
  });

  it.each(SCENES)('%s: licence and source recorded', (id) => {
    const e = manifest[id]!;
    expect(e.licence).toMatch(/\S/);
    expect(e.licenceUrl).toMatch(/^https?:\/\//);
    if (e.source.kind === 'wikimedia-commons') {
      expect(e.source.page).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(e.source.original).toMatch(/^https:\/\/upload\.wikimedia\.org\//);
    } else {
      expect(e.source.kind).toBe('generated');
      expect(e.source.generator).toBe('scripts/qual/scenes/generate.mjs');
      expect(e.licence).toBe(REPO_LICENCE);
    }
  });

  it('photo and dark-media are CC0 or owned', () => {
    expect(OWNED_OR_CC0.has(manifest.photo!.licence)).toBe(true);
    expect(OWNED_OR_CC0.has(manifest['dark-media']!.licence)).toBe(true);
  });

  it('total size <= 6 MB', () => {
    const total = readdirSync(DIR).filter((f) => ASSET.test(f)).reduce((s, f) => s + readFileSync(join(DIR, f)).length, 0);
    expect(total).toBeLessThanOrEqual(6 * 1024 * 1024);
  });

  it('manifest numbers are exactly what write-manifest.mjs computes from the files', () => {
    expect(manifest).toEqual(buildManifest(ROOT));
  });

  it('npm pack --dry-run lists no certification/scenes file', () => {
    const out = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
    // npm <= 10 prints an array of pack results, npm 11 an object keyed by package name
    type Pack = { files: Array<{ path: string }> };
    const parsed = JSON.parse(out) as Pack[] | Record<string, Pack>;
    const pack = Array.isArray(parsed) ? parsed[0] : Object.values(parsed)[0];
    expect(pack!.files.length).toBeGreaterThan(0);
    expect(pack!.files.filter((f) => f.path.startsWith('certification/'))).toEqual([]);
  }, 120_000);
});
