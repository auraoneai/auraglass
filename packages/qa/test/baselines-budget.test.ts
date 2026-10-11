/* G-14 / REQ-QUAL-24 (FIN-432): committed L7 baselines stay inside the budget — each PNG ≤ 80 KB, tree ≤ 30 MB, Linux
   names only, image chunks only — and the regression comparison reports `changed` on a 1 % pixel change. */
import { describe, expect, test } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { BASELINE_FILE_MAX_BYTES, BASELINE_TREE_MAX_BYTES, checkBaselineFile, checkBaselineTree } from '../src/evidence/baselines';
import {
  allowedDiffPixels, baselinePath, parseBaselinePath, REGRESSION_CONFIGS, screenshotOptions, snapshotName, snapshotPathTemplate,
} from '../src/evidence/regression';
import { compareRgba } from '../src/evidence/visualClass';
import { decodePng, encodePng, pngChunks, type RgbaImage } from '../src/pixel/png';

const ROOT = join(__dirname, '../../..');

function solid(width: number, height: number, rgb: [number, number, number]): RgbaImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) { data[i] = rgb[0]; data[i + 1] = rgb[1]; data[i + 2] = rgb[2]; data[i + 3] = 255; }
  return { width, height, data };
}

/** Changes exactly `n` pixels (first n in row-major order) to a far colour. */
function withChangedPixels(img: RgbaImage, n: number): RgbaImage {
  const data = new Uint8ClampedArray(img.data);
  for (let i = 0; i < n; i++) { data[i * 4] = 255 - data[i * 4]!; data[i * 4 + 1] = 255 - data[i * 4 + 1]!; data[i * 4 + 2] = 255 - data[i * 4 + 2]!; }
  return { ...img, data };
}

const GOOD = 'linux/chromium/Button/default__photo__light__1440.png';

describe('the committed baseline tree', () => {
  test('certification/baselines/ is within budget (an absent tree is empty)', () => {
    const r = checkBaselineTree(join(ROOT, 'certification/baselines'));
    expect(r.violations).toEqual([]);
    expect(r.bytes).toBeLessThanOrEqual(BASELINE_TREE_MAX_BYTES);
  });
});

describe('baseline file rules', () => {
  const png = encodePng(solid(40, 20, [10, 20, 30]));

  test('a small Linux PNG at a valid path passes', () => {
    expect(checkBaselineFile(GOOD, png)).toEqual([]);
  });

  test('-darwin names and a darwin platform directory fail', () => {
    expect(checkBaselineFile('linux/chromium/Button/default__photo__light__1440-darwin.png', png).map((v) => v.code)).toEqual(expect.arrayContaining(['platform-name']));
    expect(checkBaselineFile('darwin/chromium/Button/default__photo__light__1440.png', png).map((v) => v.code)).toContain('platform-name');
  });

  test('a file over 80 KB fails', () => {
    // incompressible noise: 160×160 RGBA ≈ 100 KB after deflate
    const noise: RgbaImage = { width: 160, height: 160, data: new Uint8ClampedArray(randomBytes(160 * 160 * 4)) };
    const big = encodePng(noise);
    expect(big.length).toBeGreaterThan(BASELINE_FILE_MAX_BYTES);
    expect(checkBaselineFile(GOOD, big).map((v) => v.code)).toEqual(['file-too-large']);
  });

  test('non-image chunks (tEXt, tIME, iTXt) fail; tRNS/PLTE are image chunks', () => {
    const text = encodePng(solid(4, 4, [0, 0, 0]), [{ type: 'tEXt', data: Buffer.from('Software\0playwright') }]);
    expect(checkBaselineFile(GOOD, text)).toEqual([expect.objectContaining({ code: 'metadata-chunk', message: expect.stringContaining('tEXt') })]);
    const time = encodePng(solid(4, 4, [0, 0, 0]), [{ type: 'tIME', data: Buffer.alloc(7) }, { type: 'iTXt', data: Buffer.from('k\0\0\0\0v') }]);
    expect(checkBaselineFile(GOOD, time)[0]!.message).toMatch(/tIME, iTXt/);
  });

  test('a non-PNG and a path outside the ten configs fail', () => {
    expect(checkBaselineFile(GOOD, Buffer.from('not a png')).map((v) => v.code)).toEqual(['not-png']);
    // firefox has only photo / light / 1440
    expect(checkBaselineFile('linux/firefox/Button/default__photo__dark__1440.png', png).map((v) => v.code)).toEqual(['bad-path']);
    expect(checkBaselineFile('linux/chromium/Button/extra/default__photo__light__1440.png', png).map((v) => v.code)).toEqual(['bad-path']);
  });

  test('a tree over 30 MB fails as a whole', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-baselines-'));
    try {
      // 440 valid baselines (10 configs × 44 subjects) of ≈ 73 KB incompressible noise each ≈ 32 MB in total
      const big = encodePng({ width: 135, height: 135, data: new Uint8ClampedArray(randomBytes(135 * 135 * 4)) });
      expect(big.length).toBeLessThanOrEqual(BASELINE_FILE_MAX_BYTES);
      let n = 0;
      for (const cfg of REGRESSION_CONFIGS) for (let s = 0; s < 44; s++) {
        const rel = baselinePath(`S${s}`, 'default', cfg, '.', 'linux').slice(2);
        mkdirSync(join(dir, rel, '..'), { recursive: true });
        writeFileSync(join(dir, rel), big);
        n++;
      }
      const r = checkBaselineTree(dir);
      expect(r.files).toBe(n);
      expect(r.bytes).toBeGreaterThan(BASELINE_TREE_MAX_BYTES);
      expect(r.violations).toEqual([expect.objectContaining({ code: 'tree-too-large' })]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('L7 configs and paths', () => {
  test('ten configs per subject-state, exactly the REQ-QUAL-24 set', () => {
    expect(REGRESSION_CONFIGS.map((c) => `${c.engine}/${c.scene}/${c.scheme}/${c.viewport}`).sort()).toEqual([
      'chromium/flat-white/dark/1440', 'chromium/flat-white/light/1440', 'chromium/photo/dark/1440', 'chromium/photo/light/1440', 'chromium/photo/light/390',
      'firefox/photo/light/1440',
      'webkit/flat-white/dark/1440', 'webkit/flat-white/light/1440', 'webkit/photo/dark/1440', 'webkit/photo/light/1440',
    ]);
  });

  test('the Playwright template expands to the baseline path', () => {
    const cfg = REGRESSION_CONFIGS[0]!;
    const [dir, file] = snapshotName('Button', 'hover', cfg);
    const expanded = snapshotPathTemplate('certification/baselines/')
      .replace('{platform}', 'linux').replace('{projectName}', cfg.engine).replace('{arg}', `${dir}/${file.replace(/\.png$/, '')}`).replace('{ext}', '.png');
    expect(expanded).toBe(baselinePath('Button', 'hover', cfg));
    expect(expanded).toBe('certification/baselines/linux/chromium/Button/hover__photo__light__1440.png');
    expect(parseBaselinePath(expanded.slice('certification/baselines/'.length))).toEqual({ platform: 'linux', subject: 'Button', state: 'hover', cfg });
  });

  test('toHaveScreenshot options: threshold 0.1, ratio 0.002, floor 20 below 10,000 px²', () => {
    expect(screenshotOptions(200 * 100)).toEqual({ threshold: 0.1, maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide', scale: 'device' });
    expect(screenshotOptions(99 * 100)).toMatchObject({ maxDiffPixels: 20, maxDiffPixelRatio: 0.002 });
    expect(allowedDiffPixels(50 * 50, 50 * 50)).toBe(20);
    expect(allowedDiffPixels(400 * 300, 400 * 300)).toBe(240);
    expect(() => screenshotOptions(0)).toThrow(/area/);
  });
});

describe('regression comparison', () => {
  test('a 1 % pixel change is reported changed (beyond the 0.2 % tolerance)', () => {
    const base = solid(100, 100, [40, 90, 160]);
    const head = withChangedPixels(base, 100); // 1 % of 10,000
    const c = compareRgba(decodePng(encodePng(base)), decodePng(encodePng(head)));
    expect(c.diffPixels).toBe(100);
    expect(c.changedRatio).toBeCloseTo(0.01, 6);
    expect(c.diffPixels).toBeGreaterThan(allowedDiffPixels(10_000, 10_000));
    expect(c.changed).toBe(true);
  });

  test('an identical capture is not changed', () => {
    const base = solid(100, 100, [40, 90, 160]);
    expect(compareRgba(base, solid(100, 100, [40, 90, 160]))).toMatchObject({ diffPixels: 0, changed: false });
  });

  test('the PNG codec round-trips and lists only image chunks for its own output', () => {
    const img = withChangedPixels(solid(7, 5, [1, 2, 3]), 9);
    const png = encodePng(img);
    expect(pngChunks(png).map((c) => c.type)).toEqual(['IHDR', 'IDAT', 'IEND']);
    const back = decodePng(png);
    expect([back.width, back.height]).toEqual([7, 5]);
    expect(Buffer.from(back.data).equals(Buffer.from(img.data))).toBe(true);
    const corrupt = Buffer.from(png);
    corrupt[corrupt.length - 20]! ^= 0xff;
    expect(() => pngChunks(corrupt)).toThrow(/CRC mismatch/);
  });
});
