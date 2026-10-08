// MAT-077: tokens/generated/persona-preset-map.json — map each 4.x persona
// (src/theme/designMatrix.ts at 15b6de6f7) to the nearest 5.0 theme preset by
// dE2000 between dark canvases, with the equivalent createBrandTheme call.
// Run: node scripts/tokens/persona-map.mjs
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const COMMIT = '15b6de6f7';

const deltaE2000 = (l1, l2) => {
  // CIEDE2000; lab = [L, a, b]
  const [L1, a1, b1] = l1, [L2, a2, b2] = l2;
  const rad = Math.PI / 180;
  const c1 = Math.hypot(a1, b1), c2 = Math.hypot(a2, b2);
  const cBar = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(cBar ** 7 / (cBar ** 7 + 25 ** 7)));
  const a1p = a1 * (1 + g), a2p = a2 * (1 + g);
  const c1p = Math.hypot(a1p, b1), c2p = Math.hypot(a2p, b2);
  const h1p = (Math.atan2(b1, a1p) + 2 * Math.PI) % (2 * Math.PI);
  const h2p = (Math.atan2(b2, a2p) + 2 * Math.PI) % (2 * Math.PI);
  const dLp = L2 - L1, dCp = c2p - c1p;
  const dhp = c1p * c2p === 0 ? 0 : Math.abs(h1p - h2p) <= Math.PI ? h2p - h1p : h2p - h1p + (h2p <= h1p ? 2 : -2) * Math.PI;
  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin(dhp / 2);
  const lBar = (L1 + L2) / 2, cBarP = (c1p + c2p) / 2;
  const hBar = c1p * c2p === 0 ? h1p + h2p : Math.abs(h1p - h2p) <= Math.PI ? (h1p + h2p) / 2 : (h1p + h2p + (h1p + h2p < 2 * Math.PI ? 2 : -2) * Math.PI) / 2;
  const t = 1 - 0.17 * Math.cos(hBar - rad * 30) + 0.24 * Math.cos(2 * hBar) + 0.32 * Math.cos(3 * hBar + rad * 6) - 0.2 * Math.cos(4 * hBar - rad * 63);
  const sL = 1 + (0.015 * (lBar - 50) ** 2) / Math.sqrt(20 + (lBar - 50) ** 2);
  const sC = 1 + 0.045 * cBarP;
  const sH = 1 + 0.015 * cBarP * t;
  const rT = -2 * Math.sqrt(cBarP ** 7 / (cBarP ** 7 + 25 ** 7)) * Math.sin(rad * 60 * Math.exp(-(((hBar / rad - 275) / 25) ** 2)));
  return Math.sqrt((dLp / sL) ** 2 + (dCp / sC) ** 2 + (dHp / sH) ** 2 + rT * (dCp / sC) * (dHp / sH));
};

const hexToLab = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const srgb = [n >> 16 & 255, n >> 8 & 255, n & 255].map((x) => x / 255);
  const lin = srgb.map((c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const [r, g, b] = lin;
  // sRGB -> XYZ D65 -> Bradford D50 -> Lab
  let x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  let y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  let z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
  x = (1.0478112 * x + 0.0228866 * y - 0.0501270 * z) / 0.96422;
  z = (0.0295424 * x + 0.9904844 * y + 0.0170491 * z) / 0.82521; // NOTE: uses raw x (pre-adapted); matches src/theme/color.ts
  y = y;
  const f = (t) => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
  const [fx, fy, fz] = [x, y, z].map(f);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

const src = execSync(`git show ${COMMIT}:src/theme/designMatrix.ts`, { cwd: ROOT, encoding: 'utf8' });
const personas = [];
const re = /"([a-z-]+)":\s*\{\s*meta:\s*\{[^}]*?name:\s*"([^"]+)"[\s\S]*?colors:\s*\{[^}]*?background:\s*\{\s*canvas:\s*"(#[0-9a-fA-F]{6})"[\s\S]*?accent:\s*\{\s*primary:\s*"(#[0-9a-fA-F]{6})"/g;
let m;
while ((m = re.exec(src))) personas.push({ id: m[1], name: m[2], canvas: m[3], accent: m[4] });
if (personas.length !== 10) throw new Error(`expected 10 personas, parsed ${personas.length}`);

const { oklchToSrgb, srgbToHex } = await import('./color.mjs');
const presets = {};
for (const id of ['aura', 'graphite', 'daylight', 'midnight']) {
  const f = JSON.parse(readFileSync(join(ROOT, `tokens/presets/${id}.tokens.json`), 'utf8'));
  const v = f.preset[id].$value;
  const darkHex = srgbToHex(oklchToSrgb({ l: v.canvas.dark.components[0], c: v.canvas.dark.components[1], h: v.canvas.dark.components[2] }));
  presets[id] = { name: v.name, canvasDarkHex: darkHex };
}
const entries = {};
for (const p of personas) {
  let best = null;
  for (const [pid, pres] of Object.entries(presets)) {
    const dE = deltaE2000(hexToLab(p.canvas), hexToLab(pres.canvasDarkHex));
    if (!best || dE < best.dE) best = { preset: pid, dE: +dE.toFixed(3) };
  }
  entries[p.id] = {
    name: p.name,
    canvas4x: p.canvas,
    accent4x: p.accent,
    ...best,
    createBrandTheme: `createBrandTheme('${p.accent}', { preset: '${best.preset}' })`,
  };
}
mkdirSync(join(ROOT, 'tokens/generated'), { recursive: true });
writeFileSync(join(ROOT, 'tokens/generated/persona-preset-map.json'), JSON.stringify(entries, null, 2) + '\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, v.preset + ' dE=' + v.dE])), null, 1));
