#!/usr/bin/env node
/**
 * AuraGlass social brand assets — committed, re-runnable renderer.
 *
 * Run from the repo root (or anywhere; paths resolve from this file):
 *   node store-assets/brand/render.mjs
 *
 * Master brand source (all inside this repo — nothing invented):
 *   - Wordmark "AuraGlass" + attribution "by AuraOne": README.md title line.
 *   - Tagline "A liquid-glass design system for React 19": README.md lede.
 *   - Colors: tokens/presets/aura.tokens.json (canvas.light, accent) and
 *     tokens/ref/color.tokens.json (slate + accent ramps), used as verbatim
 *     oklch() values.
 *   - Face: licensed Aeonik committed at public/fonts/aeonik/*.woff2.
 *     Per /Users/gurbakshchahal/fonts/README.md weight discipline, Bold is
 *     used ONLY on the wordmark; tagline/byline are Regular/Medium.
 *
 * Outputs (overwritten each run):
 *   store-assets/brand/social/{profile-400,profile-800,og-1200x630,
 *     twitter-1200x600,banner-x-1500x500,banner-cover-2560x1440}.png
 *   apps/docs/app/icon.png + apple-icon.png        (favicon wiring)
 *   apps/docs/public/brand/{og,twitter}-*.png      (og/twitter wiring)
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { chromium } from "playwright";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  ".."
);
const SOCIAL_DIR = path.join(ROOT, "store-assets", "brand", "social");
const DOCS_PUBLIC_BRAND = path.join(ROOT, "apps", "docs", "public", "brand");
const DOCS_APP = path.join(ROOT, "apps", "docs", "app");
const FONTS = path.join(ROOT, "public", "fonts", "aeonik");

/* --- brand tokens (verbatim from tokens/, oklch passes through Chromium) --- */
const C = {
  canvas: "oklch(0.99 0.004 250)", // aura preset canvas.light / slate.1
  ink: "oklch(0.18 0.012 250)", // slate.12
  inkSoft: "oklch(0.54 0.022 250)", // slate.8
  accent: "oklch(0.64 0.16 235)", // aura preset accent / accent.7
  accent6: "oklch(0.71 0.15 235)",
  accent5: "oklch(0.77 0.13 235)",
  accent4: "oklch(0.83 0.10 235)",
  accent3: "oklch(0.88 0.07 235)",
};

const WORDMARK = "AuraGlass";
const BYLINE = "by AuraOne";
const TAGLINE = "A liquid-glass design system for React 19";

/** Resolve a usable Chromium: playwright's own build first, else newest in cache. */
function resolveChromium() {
  const preferred = chromium.executablePath();
  if (fs.existsSync(preferred)) return preferred;
  const cache = path.join(os.homedir(), "Library", "Caches", "ms-playwright");
  if (fs.existsSync(cache)) {
    const builds = fs
      .readdirSync(cache)
      .filter((d) => /^chromium-\d+$/.test(d))
      .sort((a, b) => Number(b.slice(9)) - Number(a.slice(9)));
    for (const b of builds) {
      const inner = path.join(cache, b, "chrome-mac-arm64");
      const appDir = fs.existsSync(inner)
        ? fs.readdirSync(inner).find((d) => d.endsWith(".app"))
        : null;
      if (appDir) {
        const exe = path.join(
          inner,
          appDir,
          "Contents",
          "MacOS",
          path.basename(appDir, ".app")
        );
        if (fs.existsSync(exe)) return exe;
      }
    }
  }
  throw new Error(
    `No Chromium found (expected ${preferred}). Run: npx playwright install chromium`
  );
}

const FONT_CSS = (() => {
  // Embed the licensed WOFF2 cuts as data URIs: setContent() pages have an
  // opaque origin and block file:// subresources, which silently falls back
  // to a system face. Data URIs keep rendering exact and self-contained.
  const face = (weight, file) => {
    const b64 = fs.readFileSync(path.join(FONTS, file)).toString("base64");
    return `@font-face { font-family:'Aeonik'; src:url(data:font/woff2;base64,${b64}) format('woff2'); font-weight:${weight}; font-style:normal; }`;
  };
  return `\n${face(400, "Aeonik-Regular.woff2")}\n${face(500, "Aeonik-Medium.woff2")}\n${face(700, "Aeonik-Bold.woff2")}\n`;
})();

/**
 * Shared page template. u = one unit = W/100 (layout identical at every size).
 * Glass shards echo the repo's own liquid-glass material identity; text is
 * the only claim-bearing element.
 */
function pageHTML({ w, h, body, extraCSS = "" }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONT_CSS}
* { margin:0; padding:0; box-sizing:border-box; font-synthesis:none; }
html,body { width:${w}px; height:${h}px; overflow:hidden; }
body {
  position:relative;
  background:
    radial-gradient(60% 50% at 18% 12%, color-mix(in oklab, ${C.accent4} 34%, transparent), transparent 70%),
    radial-gradient(55% 45% at 86% 84%, color-mix(in oklab, ${C.accent3} 30%, transparent), transparent 70%),
    ${C.canvas};
  font-family:'Aeonik', sans-serif;
  color:${C.ink};
}
.shard { position:absolute; border:1px solid rgba(255,255,255,.65); background:rgba(255,255,255,.38);
  box-shadow:0 1px 2px rgba(18,22,46,.05), inset 0 1px 0 rgba(255,255,255,.8); }
.shard.a { background:color-mix(in oklab, ${C.accent3} 22%, rgba(255,255,255,.34)); }
.shard.b { background:color-mix(in oklab, ${C.accent4} 16%, rgba(255,255,255,.34)); }
.hairline { position:absolute; height:1px; background:linear-gradient(90deg, transparent, color-mix(in oklab, ${C.ink} 14%, transparent), transparent); }
${extraCSS}
</style></head><body>
${body}
</body></html>`;
}

/* --- compositions ------------------------------------------------------- */

function profileBody() {
  // Circular safe zone: all text within the centered 62%-diameter circle;
  // shards sit near the edges and may crop on circular displays.
  return `
  <div class="shard" style="left:8%;  top:16%; width:22%; height:34%; border-radius:26% / 18%; transform:rotate(-14deg);"></div>
  <div class="shard a" style="right:9%; top:12%; width:18%; height:30%; border-radius:24% / 20%; transform:rotate(11deg);"></div>
  <div class="shard b" style="left:16%; bottom:10%; width:20%; height:26%; border-radius:22% / 22%; transform:rotate(9deg);"></div>
  <div class="shard" style="right:14%; bottom:8%; width:24%; height:30%; border-radius:26% / 18%; transform:rotate(-8deg);"></div>
  <main style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5.5%; text-align:center;">
    <div class="wordmark">${WORDMARK}</div>
    <div class="rule"></div>
    <div class="byline">${BYLINE}</div>
  </main>`;
}

function profileCSS(w) {
  const u = w / 100;
  return `
  main { padding:0 ${u * 6}px; }
  .wordmark { font-weight:700; font-size:${u * 12.5}px; letter-spacing:-0.015em; white-space:nowrap; line-height:1; }
  .rule { width:${u * 18}px; height:${Math.max(2, u * 0.8)}px; border-radius:99px; background:linear-gradient(90deg, ${C.accent5}, ${C.accent}); }
  .byline { font-weight:500; font-size:${u * 4.6}px; letter-spacing:.01em; color:${C.inkSoft}; }`;
}

function wideBody() {
  return `
  <div class="shard" style="left:4%;  top:-6%; width:20%; height:46%; border-radius:24% / 18%; transform:rotate(-12deg);"></div>
  <div class="shard a" style="right:3%; top:6%; width:17%; height:42%; border-radius:26% / 20%; transform:rotate(10deg);"></div>
  <div class="shard b" style="left:8%; bottom:-8%; width:18%; height:36%; border-radius:24% / 22%; transform:rotate(8deg);"></div>
  <div class="shard" style="right:7%; bottom:-9%; width:20%; height:38%; border-radius:26% / 18%; transform:rotate(-9deg);"></div>
  <div class="hairline" style="left:6%; right:6%; top:9%;"></div>
  <div class="hairline" style="left:6%; right:6%; bottom:9%;"></div>
  <main>
    <div class="byline">${BYLINE}</div>
    <div class="wordmark">${WORDMARK}</div>
    <div class="rule"></div>
    <div class="tagline">${TAGLINE}</div>
  </main>`;
}

/** wordW/wordH in units-of-min-dimension per variant keep text in safe areas. */
function wideCSS({ w, h, safeW, safeH, wordSize, gapSize, tagSize, bySize }) {
  const u = Math.min(w, h) / 100;
  const v = Math.min(w, h) / 100; // vertical unit
  return `
  main { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
    width:${safeW}px; height:${safeH}px; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center; gap:${gapSize * v}px; }
  .wordmark { font-weight:700; font-size:${wordSize * u}px; letter-spacing:-0.015em; white-space:nowrap; line-height:1.05; }
  .rule { width:${wordSize * u * 1.9}px; height:${Math.max(2, 0.9 * v)}px; border-radius:99px; background:linear-gradient(90deg, ${C.accent5}, ${C.accent}); }
  .tagline { font-weight:500; font-size:${tagSize * u}px; color:${C.inkSoft}; letter-spacing:0; line-height:1.3; max-width:92%; }
  .byline { font-weight:500; font-size:${bySize * u}px; color:${C.inkSoft}; letter-spacing:.08em; text-transform:uppercase; }`;
}

function iconBody(letter) {
  return `
  <div class="shard" style="left:-8%; top:-10%; width:64%; height:70%; border-radius:30%; transform:rotate(-14deg);"></div>
  <div class="shard a" style="right:-10%; bottom:-12%; width:60%; height:64%; border-radius:30%; transform:rotate(12deg);"></div>
  <main><span>${letter}</span></main>`;
}

function iconCSS(w) {
  const u = w / 100;
  return `
  body { border-radius:${u * 18}px; }
  main { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
  main span { font-weight:700; font-size:${u * 58}px; letter-spacing:-0.01em; line-height:1;
    background:linear-gradient(160deg, ${C.ink} 30%, ${C.accent6}); -webkit-background-clip:text; background-clip:text; color:transparent; }`;
}

/* --- asset table --------------------------------------------------------- */

const FAVICON_DIR = path.join(ROOT, "store-assets", "brand", "favicon");
const A = (n) => path.join(SOCIAL_DIR, n);
const assets = [
  {
    name: "profile-400.png",
    w: 400,
    h: 400,
    html: () =>
      pageHTML({
        w: 400,
        h: 400,
        body: profileBody(),
        extraCSS: profileCSS(400),
      }),
  },
  {
    name: "profile-800.png",
    w: 800,
    h: 800,
    html: () =>
      pageHTML({
        w: 800,
        h: 800,
        body: profileBody(),
        extraCSS: profileCSS(800),
      }),
  },
  {
    name: "og-1200x630.png",
    w: 1200,
    h: 630,
    // safe zone: central 1080x530 (link unfurl crop tolerance)
    html: () =>
      pageHTML({
        w: 1200,
        h: 630,
        body: wideBody(),
        extraCSS: wideCSS({
          w: 1200,
          h: 630,
          safeW: 1080,
          safeH: 530,
          wordSize: 15.5,
          gapSize: 2.6,
          tagSize: 4.1,
          bySize: 2.3,
        }),
      }),
  },
  {
    name: "twitter-1200x600.png",
    w: 1200,
    h: 600,
    // safe zone: central 1040x500
    html: () =>
      pageHTML({
        w: 1200,
        h: 600,
        body: wideBody(),
        extraCSS: wideCSS({
          w: 1200,
          h: 600,
          safeW: 1040,
          safeH: 500,
          wordSize: 14.2,
          gapSize: 2.5,
          tagSize: 3.9,
          bySize: 2.2,
        }),
      }),
  },
  {
    name: "banner-x-1500x500.png",
    w: 1500,
    h: 500,
    // X header: text within CENTER safe area (central ~62% width, mid band)
    html: () =>
      pageHTML({
        w: 1500,
        h: 500,
        body: wideBody(),
        extraCSS: wideCSS({
          w: 1500,
          h: 500,
          safeW: 920,
          safeH: 300,
          wordSize: 13.5,
          gapSize: 2.4,
          tagSize: 3.7,
          bySize: 2.1,
        }),
      }),
  },
  {
    name: "banner-cover-2560x1440.png",
    w: 2560,
    h: 1440,
    // YouTube channel art: text within CENTER SAFE AREA 1540x423 centered
    html: () =>
      pageHTML({
        w: 2560,
        h: 1440,
        body: wideBody(),
        extraCSS: wideCSS({
          w: 2560,
          h: 1440,
          safeW: 1500,
          safeH: 410,
          wordSize: 10.5,
          gapSize: 2.0,
          tagSize: 2.9,
          bySize: 1.7,
        }),
      }),
  },
  {
    name: "icon-512.png",
    w: 512,
    h: 512,
    dir: FAVICON_DIR,
    html: () =>
      pageHTML({ w: 512, h: 512, body: iconBody("A"), extraCSS: iconCSS(512) }),
    out: [path.join(DOCS_APP, "icon.png")],
  },
  {
    name: "icon-180.png",
    w: 180,
    h: 180,
    dir: FAVICON_DIR,
    html: () =>
      pageHTML({ w: 180, h: 180, body: iconBody("A"), extraCSS: iconCSS(180) }),
    out: [path.join(DOCS_APP, "apple-icon.png")],
  },
];

/** og/twitter wiring copies served by the docs site */
const copies = [
  {
    from: A("og-1200x630.png"),
    to: path.join(DOCS_PUBLIC_BRAND, "og-1200x630.png"),
  },
  {
    from: A("twitter-1200x600.png"),
    to: path.join(DOCS_PUBLIC_BRAND, "twitter-1200x600.png"),
  },
];

async function main() {
  fs.mkdirSync(SOCIAL_DIR, { recursive: true });
  fs.mkdirSync(FAVICON_DIR, { recursive: true });
  fs.mkdirSync(DOCS_PUBLIC_BRAND, { recursive: true });

  const browser = await chromium.launch({ executablePath: resolveChromium() });
  try {
    for (const asset of assets) {
      const page = await browser.newPage({
        viewport: { width: asset.w, height: asset.h },
        deviceScaleFactor: 1,
      });
      await page.setContent(asset.html(), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      // Hard guarantee: refuse to emit an asset rendered in a fallback face.
      const ok = await page.evaluate(async () => {
        for (const w of [400, 500, 700])
          await document.fonts.load(`${w} 40px Aeonik`);
        return [400, 500, 700].every((w) =>
          document.fonts.check(`${w} 40px Aeonik`)
        );
      });
      if (!ok)
        throw new Error(`Aeonik failed to load for ${asset.name}; aborting.`);
      await page.waitForTimeout(60);
      const dest = path.join(asset.dir || SOCIAL_DIR, asset.name);
      await page.screenshot({ path: dest, type: "png" });
      for (const extra of asset.out || []) {
        fs.copyFileSync(dest, extra);
      }
      console.log(
        `rendered ${path.relative(ROOT, dest)} (${asset.w}x${asset.h})`
      );
      await page.close();
    }
  } finally {
    await browser.close();
  }
  for (const c of copies) {
    fs.copyFileSync(c.from, c.to);
    console.log(`wired   ${path.relative(ROOT, c.to)}`);
  }
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
