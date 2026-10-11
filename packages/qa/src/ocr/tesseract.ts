/* REQ-QUAL-13 OCR text contrast — tesseract driver (QUAL, FIN-430).
   tesseract 5 is a system binary of the job image (AG_PLAYWRIGHT_IMAGE, FIN-B ci/plat/**); its version is recorded in
   the lane manifest. The capture (straight RGBA from the browser) is upscaled 2× with a Lanczos-3 kernel here, written as
   a binary PPM (P6 — read natively by tesseract's Leptonica; no PNG encoder/decoder dependency), and read with
   `--psm 11` (sparse text) as TSV. Word boxes are mapped back to the capture's device pixels. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Rect, Rgba } from '../pixel/raster';

export interface OcrWord {
  text: string;
  /** tesseract confidence 0..100 */
  conf: number;
  /** device px of the source raster (upscale undone) */
  box: Rect;
}

// ---- Lanczos-3 resampling (separable) --------------------------------------------------------------------------------
const A = 3;
function lanczos(x: number): number {
  if (x === 0) return 1;
  if (x <= -A || x >= A) return 0;
  const px = Math.PI * x;
  return (A * Math.sin(px) * Math.sin(px / A)) / (px * px);
}

/** Integer-factor Lanczos-3 upscale of an RGBA raster (alpha forced opaque: captures are opaque screenshots). */
export function lanczosUpscale(src: Rgba, factor: number): Rgba {
  if (!Number.isInteger(factor) || factor < 1) throw new Error(`lanczosUpscale: factor must be a positive integer, got ${factor}`);
  if (factor === 1) return { width: src.width, height: src.height, data: new Uint8ClampedArray(src.data) };
  const W = src.width * factor; const H = src.height * factor;
  // per-output-coordinate taps (same for every row/column): source index + weight, normalised
  const taps = (n: number, len: number): Array<{ idx: Int32Array; w: Float64Array }> => {
    const out: Array<{ idx: Int32Array; w: Float64Array }> = [];
    for (let o = 0; o < n; o++) {
      const center = (o + 0.5) / factor - 0.5;
      const first = Math.floor(center) - A + 1;
      const idx = new Int32Array(2 * A); const w = new Float64Array(2 * A);
      let sum = 0;
      for (let k = 0; k < 2 * A; k++) {
        const s = first + k;
        idx[k] = Math.min(len - 1, Math.max(0, s));
        w[k] = lanczos(center - s);
        sum += w[k]!;
      }
      for (let k = 0; k < 2 * A; k++) w[k] = w[k]! / sum;
      out.push({ idx, w });
    }
    return out;
  };
  const tx = taps(W, src.width); const ty = taps(H, src.height);
  // horizontal pass into float RGB
  const mid = new Float32Array(W * src.height * 3);
  for (let y = 0; y < src.height; y++) {
    const row = y * src.width;
    for (let x = 0; x < W; x++) {
      const { idx, w } = tx[x]!;
      let r = 0; let g = 0; let b = 0;
      for (let k = 0; k < 2 * A; k++) { const o = (row + idx[k]!) * 4; const wk = w[k]!; r += src.data[o]! * wk; g += src.data[o + 1]! * wk; b += src.data[o + 2]! * wk; }
      const m = (y * W + x) * 3; mid[m] = r; mid[m + 1] = g; mid[m + 2] = b;
    }
  }
  const data = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) {
    const { idx, w } = ty[y]!;
    for (let x = 0; x < W; x++) {
      let r = 0; let g = 0; let b = 0;
      for (let k = 0; k < 2 * A; k++) { const m = (idx[k]! * W + x) * 3; const wk = w[k]!; r += mid[m]! * wk; g += mid[m + 1]! * wk; b += mid[m + 2]! * wk; }
      const o = (y * W + x) * 4; data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255; // clamped by the array type
    }
  }
  return { width: W, height: H, data };
}

/** Binary PPM (P6) of the RGB channels. */
export function toPpm(img: Rgba): Buffer {
  const header = Buffer.from(`P6\n${img.width} ${img.height}\n255\n`, 'ascii');
  const body = Buffer.alloc(img.width * img.height * 3);
  for (let i = 0, j = 0; i < img.data.length; i += 4, j += 3) { body[j] = img.data[i]!; body[j + 1] = img.data[i + 1]!; body[j + 2] = img.data[i + 2]!; }
  return Buffer.concat([header, body]);
}

/** Crops a raster (device px, clamped). */
export function crop(img: Rgba, r: Rect): { raster: Rgba; offset: { x: number; y: number } } {
  const x0 = Math.max(0, Math.floor(r.x)); const y0 = Math.max(0, Math.floor(r.y));
  const x1 = Math.min(img.width, Math.ceil(r.x + r.w)); const y1 = Math.min(img.height, Math.ceil(r.y + r.h));
  if (x1 <= x0 || y1 <= y0) throw new Error(`crop: rect ${JSON.stringify(r)} is outside the ${img.width}x${img.height} raster`);
  const w = x1 - x0; const h = y1 - y0;
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) data.set(img.data.subarray(((y0 + y) * img.width + x0) * 4, ((y0 + y) * img.width + x1) * 4), y * w * 4);
  return { raster: { width: w, height: h, data }, offset: { x: x0, y: y0 } };
}

// ---- tesseract --------------------------------------------------------------------------------------------------------
export const TESSERACT_BIN = process.env.AG_TESSERACT_BIN || 'tesseract';

/** `tesseract --version` → e.g. `5.3.4`; throws (never returns a guess) when the binary is missing or not v5. */
export function tesseractVersion(bin = TESSERACT_BIN): string {
  let out: string;
  try {
    out = execFileSync(bin, ['--version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    throw new Error(`ocr: '${bin} --version' failed (${(err as Error).message.split('\n')[0]}). The L6 image (AG_PLAYWRIGHT_IMAGE) must carry tesseract 5 with the eng traineddata.`);
  }
  const m = /tesseract\s+v?(\d+)\.(\d+)\.(\d+)/i.exec(out);
  if (!m) throw new Error(`ocr: cannot parse tesseract version from: ${out.split('\n')[0]}`);
  if (m[1] !== '5') throw new Error(`ocr: tesseract ${m[1]}.${m[2]}.${m[3]} found; REQ-QUAL-13 requires tesseract 5`);
  return `${m[1]}.${m[2]}.${m[3]}`;
}

/** Parses tesseract TSV output: level-5 (word) rows with non-empty text. Coordinates as emitted. */
export function parseTsv(tsv: string): OcrWord[] {
  const lines = tsv.split(/\r?\n/).filter((l) => l.length > 0);
  if (!lines.length) return [];
  const head = lines[0]!.split('\t');
  const col = (name: string): number => {
    const i = head.indexOf(name);
    if (i < 0) throw new Error(`ocr: TSV header lacks '${name}' (got: ${head.join(',')})`);
    return i;
  };
  const cLevel = col('level'); const cL = col('left'); const cT = col('top'); const cW = col('width'); const cH = col('height'); const cConf = col('conf'); const cText = col('text');
  const words: OcrWord[] = [];
  for (const line of lines.slice(1)) {
    const f = line.split('\t');
    if (f[cLevel] !== '5') continue;
    const text = (f[cText] ?? '').trim();
    if (!text) continue;
    words.push({ text, conf: Number(f[cConf]), box: { x: Number(f[cL]), y: Number(f[cT]), w: Number(f[cW]), h: Number(f[cH]) } });
  }
  return words;
}

export interface OcrRun { words: OcrWord[]; version: string; psm: number; upscale: number }

/** OCR of `img` (optionally a sub-rect): Lanczos upscale, PPM, `tesseract --psm <psm> tsv`; boxes in `img` device px. */
export function ocr(img: Rgba, opts: { psm: number; upscale: number; region?: Rect; bin?: string }): OcrRun {
  const bin = opts.bin ?? TESSERACT_BIN;
  const version = tesseractVersion(bin);
  const { raster, offset } = opts.region ? crop(img, opts.region) : { raster: img, offset: { x: 0, y: 0 } };
  const up = lanczosUpscale(raster, opts.upscale);
  const dir = mkdtempSync(join(tmpdir(), 'ag-ocr-'));
  try {
    const file = join(dir, 'capture.ppm');
    writeFileSync(file, toPpm(up));
    // dpi tells tesseract the effective resolution of the upscaled image (96 CSS dpi × upscale)
    const tsv = execFileSync(bin, [file, 'stdout', '--psm', String(opts.psm), '--dpi', String(96 * opts.upscale), '-l', 'eng', 'tsv'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
    const words = parseTsv(tsv).map((w) => ({
      ...w,
      box: { x: offset.x + w.box.x / opts.upscale, y: offset.y + w.box.y / opts.upscale, w: w.box.w / opts.upscale, h: w.box.h / opts.upscale },
    }));
    return { words, version, psm: opts.psm, upscale: opts.upscale };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
