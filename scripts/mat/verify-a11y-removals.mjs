#!/usr/bin/env node
/* MAT-323 (beta gate): asserts the §9 removals held at the seam level.
   (a) no §9 symbol in any dist entry/subpath .d.ts or runtime export keys;
   (b) matchMedia( usage outside src/theme/preferences/media.ts = 0, and
       reduced-motion hooks / settings providers = 0 (1 store, 1 provider);
   (c) focus traps outside src/primitives/FocusScope.tsx = 0, live regions
       outside src/theme/announcer = 0, focus CSS outside src/a11y/css/focus.css = 0;
   (d) delegates to verify-a11y-css.mjs --enforce-zero and
       verify-apg-coverage.mjs --enforce.
   Exit non-zero on any finding. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const rg = (args) => {
  try {
    return execFileSync('rg', args, { cwd: root, encoding: 'utf8' });
  } catch (e) {
    return e.status === 1 ? '' : (() => { throw e; })();
  }
};

// ---- §9 banned symbols (4.x-era preferences surface) ----
const BANNED = [
  'ThemeProvider', 'useTheme', 'GlassThemeProvider', 'PreferencesProvider',
  'setColorScheme', 'prefersReducedMotion', 'GlassConfig', 'AuraConfig',
];
const distFiles = [];
const walkDist = (d) => {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkDist(p);
    else if (/\.(d\.ts|mjs|js|cjs)$/.test(e.name)) distFiles.push(p);
  }
};
walkDist(path.join(root, 'dist'));
for (const f of distFiles) {
  const src = fs.readFileSync(f, 'utf8');
  for (const sym of BANNED) {
    if (new RegExp(`\\b${sym}\\b`).test(src)) {
      failures.push(`§9 symbol ${sym} in ${path.relative(root, f)}`);
    }
  }
}
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const key of Object.keys(pkg.exports ?? {})) {
  for (const sym of BANNED) {
    if (key.toLowerCase().includes(sym.toLowerCase())) {
      failures.push(`§9-named export subpath ${key} in package.json`);
    }
  }
}

// ---- single-owner media/preference plumbing ----
const mm = rg(['-l', 'matchMedia\\s*\\(', 'src']).trim().split('\n').filter(Boolean)
  .filter((f) => f !== 'src/theme/preferences/media.ts');
if (mm.length) failures.push(`matchMedia( outside preferences/media.ts: ${mm.join(', ')}`);
const rmHooks = rg(['-l', 'useReducedMotion|ReducedMotionProvider|MotionSettings', 'src']).trim().split('\n')
  .filter(Boolean).filter((f) => !f.startsWith('src/theme/'));
if (rmHooks.length) failures.push(`reduced-motion hooks/providers outside src/theme: ${rmHooks.join(', ')}`);

// ---- single-owner focus plumbing (shipped code only: tests, stories,
// contract type definitions and fixtures legitimately mention these) ----
const isShipped = (f) =>
  !/(__tests__|\.test\.|\.spec\.|\.stories\.|\/stories\/|^src\/contracts\/|__fixtures__|\.md$)/.test(f);
const traps = rg(['-l', 'focus-trap|trapFocus|FocusTrap', 'src']).trim().split('\n').filter(Boolean)
  .filter((f) => f !== 'src/primitives/FocusScope.tsx' && !f.startsWith('tests/') && isShipped(f));
if (traps.length) failures.push(`focus traps outside FocusScope: ${traps.join(', ')}`);
const live = rg(['-l', 'aria-live', 'src']).trim().split('\n').filter(Boolean)
  .filter((f) => !f.startsWith('src/theme/announcer') && isShipped(f));
if (live.length) failures.push(`live regions outside theme/announcer: ${live.join(', ')}`);
const focusCss = rg(['-l', ':focus-visible|:focus\\s*\\{', 'src', '--glob', '*.css']).trim().split('\n').filter(Boolean)
  .filter((f) => f !== 'src/a11y/css/focus.css');
if (focusCss.length) failures.push(`focus CSS outside a11y/css/focus.css: ${focusCss.join(', ')}`);

// ---- delegate to the css gate + apg coverage ----
for (const [script, args] of [
  ['scripts/mat/verify-a11y-css.mjs', ['--enforce-zero']],
  ['scripts/mat/verify-apg-coverage.mjs', ['--enforce']],
]) {
  try {
    execFileSync('node', [script, ...args], { cwd: root, stdio: 'pipe' });
  } catch (e) {
    failures.push(`${script} ${args.join(' ')} failed:\n${String(e.stdout ?? e.message).slice(0, 2000)}`);
  }
}

for (const f of failures) console.error(`FAIL ${f}`);
if (failures.length) process.exit(1);
console.log('a11y removals: ok');
