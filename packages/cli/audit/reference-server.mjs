#!/usr/bin/env node
/**
 * Reference endpoint for `auraglass audit backdrop` (REQ-PLAT-89).
 *
 * This is the remote half of the command: the CLI bundle never resolves a
 * browser; this server does, and it runs only where Playwright and Chromium
 * are installed (the manual GitLab job `plat:audit:backdrop`, Playwright
 * image, `-c packages/cli/audit/playwright.config.ts`). It never touches
 * `certification/**`.
 *
 *   node packages/cli/audit/reference-server.mjs [--port 4791] [--host 127.0.0.1]
 *
 * Contract: POST /audit with `schema/audit-backdrop.json#/$defs/request`,
 * reply `#/$defs/response`. GET /healthz → 200 once listening.
 *
 * Per `[data-ag-surface]` (optionally scoped by `selector`):
 *   - lumVariance: σ of Rec. 709 luma (8-bit levels) of the rendered pixels
 *     under the surface's border box, captured with only that surface hidden
 *     (architecture §15.2 "material presence": fails glass over nothing).
 *   - ocrContrast: for every element that renders text inside the surface,
 *     two captures of its box — text painted and text made transparent — give
 *     a per-pixel glyph mask (pixels that change by > GLYPH_DELTA levels) and,
 *     per glyph pixel, the WCAG ratio between ink and the pixel behind it. The
 *     run's contrast is the INK_PERCENTILE of those ratios (anti-aliased edge
 *     pixels are excluded by the percentile). The surface reports the run with
 *     the worst margin against its size class (body 4.5:1, large 3:1).
 *   - rung: `solid` when the computed backdrop-filter is none; otherwise
 *     `tinted` when the nearest `[data-ag-transparency]` says so, else `glass`.
 *
 * Security: unauthenticated, and it navigates to any http(s) URL it is given.
 * It binds 127.0.0.1 by default; expose it only inside a CI job or private
 * network.
 */
import http from 'node:http';
import { pathToFileURL } from 'node:url';

const GLYPH_DELTA = 8;
const INK_PERCENTILE = 0.9;
const VIEWPORT = { width: 1440, height: 900 };
const MAX_BODY = 64 * 1024;
const RUNGS = new Set(['glass', 'tinted', 'solid']);

function argValue(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function loadChromium() {
  for (const mod of ['@playwright/test', 'playwright', 'playwright-core']) {
    try {
      const m = await import(mod);
      if (m.chromium) return m.chromium;
    } catch {
      /* try the next module */
    }
  }
  throw new Error('reference-server needs Playwright (npm i -D @playwright/test && npx playwright install chromium)');
}

let browserPromise;
function browser() {
  browserPromise ??= loadChromium().then((c) => c.launch());
  return browserPromise;
}

/** Request checks mirroring schema/audit-backdrop.json#/$defs/request. */
function checkRequest(body) {
  const errors = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return ['request must be an object'];
  for (const k of Object.keys(body)) if (!['url', 'selector', 'thresholds'].includes(k)) errors.push(`unexpected property "${k}"`);
  if (typeof body.url !== 'string' || !/^https?:\/\/\S+$/u.test(body.url)) errors.push('url must be an http(s) URL');
  if (body.selector !== undefined && (typeof body.selector !== 'string' || body.selector.length === 0)) errors.push('selector must be a non-empty string');
  const t = body.thresholds;
  const num = (v, lo, hi) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;
  if (!t || typeof t !== 'object') errors.push('thresholds required');
  else {
    if (!num(t.lumVariance?.minLevels, 0, 255)) errors.push('thresholds.lumVariance.minLevels must be 0..255');
    if (!num(t.ocrContrast?.body, 1, 21) || !num(t.ocrContrast?.large, 1, 21)) errors.push('thresholds.ocrContrast.{body,large} must be 1..21');
    if (!Array.isArray(t.rungs) || !t.rungs.length || !t.rungs.every((r) => RUNGS.has(r))) errors.push('thresholds.rungs must list known rungs');
    if (!Array.isArray(t.translucentRungs) || !t.translucentRungs.every((r) => RUNGS.has(r))) errors.push('thresholds.translucentRungs must list known rungs');
  }
  return errors;
}

/** Runs in a blank page: decode PNGs with the browser's own image decoder. */
const PIXEL_STATS = async ({ shown, hidden, glyphDelta, inkPercentile }) => {
  const decode = async (b64) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = new OffscreenCanvas(bmp.width, bmp.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bmp, 0, 0);
    return ctx.getImageData(0, 0, bmp.width, bmp.height).data;
  };
  const luma = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  const lin = (v) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  const relLum = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
  const a = await decode(shown);
  if (!hidden) {
    let n = 0, sum = 0, sq = 0;
    for (let i = 0; i < a.length; i += 4) { const l = luma(a, i); n++; sum += l; sq += l * l; }
    const mean = sum / Math.max(1, n);
    return { sigma: Math.sqrt(Math.max(0, sq / Math.max(1, n) - mean * mean)), pixels: n };
  }
  const b = await decode(hidden);
  const ratios = [];
  for (let i = 0; i < Math.min(a.length, b.length); i += 4) {
    if (Math.abs(luma(a, i) - luma(b, i)) <= glyphDelta) continue;
    const la = relLum(a, i), lb = relLum(b, i);
    ratios.push((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05));
  }
  if (!ratios.length) return { contrast: null, glyphPixels: 0 };
  ratios.sort((x, y) => x - y);
  return { contrast: ratios[Math.min(ratios.length - 1, Math.floor(inkPercentile * ratios.length))], glyphPixels: ratios.length };
};

/** Runs in the audited page: tag surfaces and text runs, describe them. */
const DESCRIBE = ({ scope }) => {
  const cssPath = (el) => {
    if (el.id) return `#${CSS.escape(el.id)}`;
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      if (node.id) { parts.unshift(`#${CSS.escape(node.id)}`); break; }
      const tag = node.tagName.toLowerCase();
      const same = node.parentElement ? [...node.parentElement.children].filter((c) => c.tagName === node.tagName) : [];
      parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };
  let surfaces = [...document.querySelectorAll('[data-ag-surface]')];
  if (scope) surfaces = surfaces.filter((el) => el.matches(scope) || el.closest(scope));
  return surfaces.map((el, i) => {
    el.setAttribute('data-ag-audit-surface', String(i));
    const cs = getComputedStyle(el);
    const bf = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
    const declared = el.closest('[data-ag-transparency]')?.getAttribute('data-ag-transparency');
    const rung = bf === 'none' ? 'solid' : declared === 'tinted' ? 'tinted' : 'glass';
    const runs = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const host = t.parentElement;
      if (!host || seen.has(host) || !t.textContent.trim()) continue;
      const hs = getComputedStyle(host);
      const r = host.getBoundingClientRect();
      if (hs.visibility !== 'visible' || hs.display === 'none' || r.width < 1 || r.height < 1) continue;
      seen.add(host);
      const id = `${i}-${runs.length}`;
      host.setAttribute('data-ag-audit-text', id);
      const size = parseFloat(hs.fontSize);
      const weight = Number(hs.fontWeight) || 400;
      runs.push({ id, large: size >= 24 || (size >= 18.66 && weight >= 700) });
    }
    return { index: i, selector: cssPath(el), rung, runs };
  });
};

async function clipOf(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.floor(r.left));
    const y = Math.max(0, Math.floor(r.top));
    const w = Math.min(window.innerWidth, Math.ceil(r.right)) - x;
    const h = Math.min(window.innerHeight, Math.ceil(r.bottom)) - y;
    return w > 0 && h > 0 ? { x, y, width: w, height: h } : null;
  }, selector);
}

async function shot(page, clip) {
  return (await page.screenshot({ clip, animations: 'disabled', caret: 'hide' })).toString('base64');
}

async function withStyle(page, css, fn) {
  const handle = await page.addStyleTag({ content: css });
  try {
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    return await fn();
  } finally {
    await handle.evaluate((n) => n.remove());
  }
}

export async function audit(req) {
  const b = await browser();
  const context = await b.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    const scratch = await context.newPage();
    await page.goto(req.url, { waitUntil: 'load', timeout: 30_000 });
    await page.evaluate(() => document.fonts?.ready);
    if (req.selector) {
      const ok = await page.evaluate((s) => { try { document.querySelector(s); return true; } catch { return false; } }, req.selector);
      if (!ok) throw Object.assign(new Error(`invalid selector: ${req.selector}`), { status: 400 });
    }
    const described = await page.evaluate(DESCRIBE, { scope: req.selector ?? null });
    const { thresholds } = req;
    const surfaces = [];
    for (const s of described) {
      const sel = `[data-ag-audit-surface="${s.index}"]`;
      const clip = await clipOf(page, sel);
      let lumVariance = 0;
      if (clip) {
        const hiddenShot = await withStyle(page, `${sel}, ${sel} * { visibility: hidden !important; }`, () => shot(page, clip));
        lumVariance = (await scratch.evaluate(PIXEL_STATS, { shown: hiddenShot, hidden: null, glyphDelta: GLYPH_DELTA, inkPercentile: INK_PERCENTILE })).sigma;
      }
      let worst = null;
      for (const run of s.runs) {
        const tsel = `[data-ag-audit-text="${run.id}"]`;
        const tclip = await clipOf(page, tsel);
        if (!tclip) continue;
        const shown = await shot(page, tclip);
        const hidden = await withStyle(
          page,
          `${tsel}, ${tsel} * { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; }`,
          () => shot(page, tclip),
        );
        const { contrast } = await scratch.evaluate(PIXEL_STATS, { shown, hidden, glyphDelta: GLYPH_DELTA, inkPercentile: INK_PERCENTILE });
        if (contrast === null) continue;
        const min = run.large ? thresholds.ocrContrast.large : thresholds.ocrContrast.body;
        const margin = contrast / min;
        if (!worst || margin < worst.margin) worst = { contrast, large: run.large, margin, min };
      }
      const reasons = [];
      if (thresholds.translucentRungs.includes(s.rung) && lumVariance < thresholds.lumVariance.minLevels) {
        reasons.push(`glass-over-nothing: lumVariance ${lumVariance.toFixed(2)} < ${thresholds.lumVariance.minLevels}`);
      }
      if (worst && worst.contrast < worst.min) {
        reasons.push(`ocr-contrast: ${worst.contrast.toFixed(2)} < ${worst.min} (${worst.large ? 'large' : 'body'})`);
      }
      surfaces.push({
        selector: s.selector,
        lumVariance: Math.min(255, Number(lumVariance.toFixed(3))),
        ocrContrast: worst ? Math.min(21, Number(worst.contrast.toFixed(3))) : null,
        textSize: worst ? (worst.large ? 'large' : 'body') : null,
        rung: s.rung,
        verdict: reasons.length ? 'fail' : 'pass',
        reasons,
      });
    }
    const res = { version: 1, url: req.url, surfaces };
    if (req.selector) res.selector = req.selector;
    return res;
  } finally {
    await context.close();
  }
}

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/healthz') return send(res, 200, { ok: true });
    if (req.method !== 'POST' || req.url !== '/audit') return send(res, 404, { error: 'POST /audit' });
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (c) => {
      raw += c;
      if (raw.length > MAX_BODY) req.destroy();
    });
    req.on('end', async () => {
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        return send(res, 400, { error: 'request is not JSON' });
      }
      const errors = checkRequest(body);
      if (errors.length) return send(res, 400, { error: errors.join('; ') });
      try {
        send(res, 200, await audit(body));
      } catch (e) {
        send(res, e.status ?? 502, { error: String(e?.message ?? e) });
      }
    });
  });
}

const isMain = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const port = Number(argValue('port', process.env.AG_AUDIT_PORT ?? '4791'));
  const host = argValue('host', '127.0.0.1');
  const server = createServer();
  server.listen(port, host, () => process.stdout.write(`audit backdrop reference endpoint on http://${host}:${port}\n`));
  const stop = async () => {
    server.close();
    if (browserPromise) await (await browserPromise).close().catch(() => {});
    process.exit(0);
  };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}
