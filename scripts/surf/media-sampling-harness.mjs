// scripts/surf/media-sampling-harness.mjs — REQ-SURF-151/152/153 shared
// harness for the owned-pixel sampler in a real browser engine.
//
// It bundles the REAL sampler (src/backdrops/sampling) with esbuild into an
// IIFE that exposes globalThis.__agSampling = { sampleOwnedPixels,
// classifyTone, TONE_* }, serves it next to the 8 QUAL scenes
// (certification/scenes, S-42) from a loopback HTTP server, and samples each
// scene in-page as <img crossOrigin="anonymous">. Used by
// scripts/surf/calibrate-media-tone.mjs (CI calibration),
// tests/e2e/surf/media/sampling-engines.spec.ts (L8, 3 engines) and
// tests/perf/browser/surf/media-sampling.spec.ts (L10). Remote runners only:
// nothing here launches a browser.
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const SCENES_DIR = join(ROOT, 'certification/scenes');
export const FIXTURE_PATH = join(ROOT, 'src/backdrops/sampling/__fixtures__/scene-stats.json');
export const ANCHORS_PATH = join(ROOT, 'src/backdrops/sampling/__fixtures__/scene-anchors.json');

/** The frozen S-42 scene ids, read from the contract so there is one source. */
export function sceneIds() {
  const src = readFileSync(join(ROOT, 'src/contracts/testing.ts'), 'utf8');
  const m = /export const SCENES = \[([^\]]+)\] as const/.exec(src);
  if (!m) throw new Error('media-sampling-harness: SCENES not found in src/contracts/testing.ts');
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

/** [{ id, file }] for every S-42 id from certification/scenes/scenes.manifest.json.
 * Throws (never skips) when an id or its file is missing. */
export function readScenes(dir = SCENES_DIR) {
  const manifestPath = join(dir, 'scenes.manifest.json');
  if (!existsSync(manifestPath)) throw new Error(`media-sampling-harness: ${manifestPath} is missing (QUAL S-42 scenes)`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const missing = [];
  const scenes = sceneIds().map((id) => {
    const file = manifest[id]?.file;
    if (typeof file !== 'string' || !existsSync(join(dir, file))) missing.push(id);
    return { id, file };
  });
  if (missing.length) {
    throw new Error(`media-sampling-harness: scene assets missing from ${dir}: ${missing.join(', ')} (producer: QUAL S-42 scenes)`);
  }
  return scenes;
}

/** IIFE bundle of the real sampler. `mode` sets NODE_ENV for its dev warning. */
export async function bundleSampler({ mode = 'development' } = {}) {
  const { build } = await import('esbuild');
  const out = await build({
    stdin: {
      contents: [
        "import { sampleOwnedPixels } from './src/backdrops/sampling/sampleOwnedPixels';",
        "import * as tone from './src/backdrops/sampling/classifyTone';",
        'globalThis.__agSampling = { sampleOwnedPixels, ...tone };',
      ].join('\n'),
      resolveDir: ROOT,
      loader: 'ts',
      sourcefile: 'ag-sampling-harness.ts',
    },
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    banner: { js: `var process = { env: { NODE_ENV: ${JSON.stringify(mode)} } };` },
    logLevel: 'silent',
  });
  return out.outputFiles[0].text;
}

const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.webm': 'video/webm' };

/** Loopback server: '/' harness page, '/sampler.js' the bundle, '/scenes/<file>'
 * the scene assets. `cors: false` omits Access-Control-Allow-Origin so a page on
 * another origin gets a tainted canvas. Resolves { origin, close }. */
export function startSamplingServer({ bundle, dir = SCENES_DIR, cors = true }) {
  const page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>AuraGlass sampling harness</title>'
    + '<script src="/sampler.js"></script></head><body></body></html>';
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const headers = cors ? { 'access-control-allow-origin': '*' } : {};
    if (url.pathname === '/') {
      res.writeHead(200, { ...headers, 'content-type': 'text/html; charset=utf-8' }).end(page);
      return;
    }
    if (url.pathname === '/sampler.js' && bundle) {
      res.writeHead(200, { ...headers, 'content-type': 'text/javascript; charset=utf-8' }).end(bundle);
      return;
    }
    if (url.pathname.startsWith('/scenes/')) {
      const file = normalize(join(dir, decodeURIComponent(url.pathname.slice('/scenes/'.length))));
      if (file.startsWith(dir + sep) && existsSync(file)) {
        res.writeHead(200, { ...headers, 'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' })
          .end(readFileSync(file));
        return;
      }
    }
    res.writeHead(404).end();
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ origin: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(() => r(undefined))) });
    });
  });
}

/** In-page: for each scene append <img crossOrigin=…> to the body, await
 * decode(), run the real sampleOwnedPixels and classifyTone. Returns
 * [{ id, naturalWidth, stats, tone }] (stats null when the sampler refused). */
export function sampleScenesInPage(page, { origin, scenes, crossOrigin = 'anonymous' }) {
  return page.evaluate(async ({ origin: o, scenes: list, crossOrigin: co }) => {
    const api = globalThis.__agSampling;
    if (!api) throw new Error('sampler bundle not loaded on the harness page');
    const results = [];
    for (const { id, file } of list) {
      const img = document.createElement('img');
      if (co) img.crossOrigin = co;
      img.alt = '';
      img.src = `${o}/scenes/${file}`;
      document.body.append(img);
      await img.decode();
      const stats = api.sampleOwnedPixels(img);
      results.push({ id, naturalWidth: img.naturalWidth, stats, tone: stats ? (api.classifyTone(stats) ?? null) : null });
    }
    return results;
  }, { origin, scenes, crossOrigin });
}
