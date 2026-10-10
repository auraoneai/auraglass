/**
 * @jest-environment node
 */
/* REQ-QUAL-07 (FIN-427): content bands asserted on the committed scene files (decoded here, not read from the manifest).
   flat-white mean >= 245; flat-black <= 12; dark-media <= 70; video-frame still <= 100; photo and saturated-abstract
   sigma >= 40; saturated-abstract Hasler–Süsstrunk colourfulness >= 60; hf-pattern >= 30 % of 8×8 blocks with a
   >= 40-level luma range; dense-text >= 400 OCR-readable words (tesseract 5, `--psm 3`, confidence >= 60);
   video-frame.webm is a 2 s loop at the still's size. tesseract is required: it ships in AG_PLAYWRIGHT_IMAGE; a
   machine without it fails this test with the remote command rather than skipping it. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeImage, sceneStats, webmDuration, webmSize } from '../../scripts/qual/scenes/decode.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = join(ROOT, 'certification/scenes');
const manifest = JSON.parse(readFileSync(join(DIR, 'scenes.manifest.json'), 'utf8'));
const cache = new Map();
const stats = (id) => {
  if (!cache.has(id)) {
    const img = decodeImage(readFileSync(join(DIR, manifest[id].file)));
    cache.set(id, { img, ...sceneStats(img) });
  }
  return cache.get(id);
};

describe('scene content bands (REQ-QUAL-07)', () => {
  it('flat-white mean luminance >= 245', () => { expect(stats('flat-white').meanLuminance).toBeGreaterThanOrEqual(245); });
  it('flat-black mean luminance <= 12', () => { expect(stats('flat-black').meanLuminance).toBeLessThanOrEqual(12); });
  it('dark-media mean luminance <= 70', () => { expect(stats('dark-media').meanLuminance).toBeLessThanOrEqual(70); });
  it('video-frame still mean luminance <= 100', () => { expect(stats('video-frame').meanLuminance).toBeLessThanOrEqual(100); });
  it.each(['photo', 'saturated-abstract'])('%s luminance sigma >= 40', (id) => {
    expect(stats(id).luminanceSigma).toBeGreaterThanOrEqual(40);
  });
  it('saturated-abstract Hasler–Süsstrunk colourfulness >= 60', () => {
    expect(stats('saturated-abstract').colourfulness).toBeGreaterThanOrEqual(60);
  });
  it('hf-pattern: >= 30 % of 8×8 blocks have a luma range >= 40', () => {
    expect(stats('hf-pattern').hfBlockShare).toBeGreaterThanOrEqual(0.3);
  });
  it('the block test rejects a flat field (self-check)', () => {
    expect(stats('flat-white').hfBlockShare).toBe(0);
  });
  it('video-frame.webm is a 2 s loop at the still size', () => {
    const v = readFileSync(join(DIR, manifest['video-frame'].video.file));
    expect(webmDuration(v)).toBeCloseTo(2, 1);
    const { img } = stats('video-frame');
    expect(webmSize(v)).toEqual({ width: img.width, height: img.height });
  });

  it('dense-text has >= 400 OCR-readable words (tesseract 5)', () => {
    let version;
    try { version = execFileSync('tesseract', ['--version'], { encoding: 'utf8' }); } catch {
      throw new Error('tesseract 5 is required (AG_PLAYWRIGHT_IMAGE carries it). Remote: npx jest tests/storybook/scene-bands.test.mjs in a qual:* job');
    }
    expect(version).toMatch(/tesseract (v)?5\./);
    const tsv = execFileSync('tesseract', [join(DIR, manifest['dense-text'].file), '-', '--psm', '3', 'tsv'], { encoding: 'utf8', maxBuffer: 64 << 20 });
    const words = tsv.trim().split('\n').slice(1).map((l) => l.split('\t'))
      .filter((c) => c[0] === '5' && Number(c[10]) >= 60 && /[A-Za-z]{2,}/.test(c[11] ?? ''));
    expect(words.length).toBeGreaterThanOrEqual(400);
  }, 120_000);
});
