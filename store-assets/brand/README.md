# AuraGlass brand assets

Added 2026-10-18 (portfolio brand-asset pass). Canonical social/brand images
for AuraGlass, rendered by a committed, re-runnable script — never by hand.

## Re-run

```bash
node store-assets/brand/render.mjs
```

Requires the repo's own `playwright` devDependency plus any Chromium build
in `~/Library/Caches/ms-playwright` (the script resolves the newest one and
falls back from `playwright`'s preferred build). The script embeds the
licensed Aeonik WOFF2 cuts as data URIs and hard-asserts they load, so a
re-run can never silently emit a fallback-font asset.

## Master brand source

Everything derives from committed repo sources (nothing invented):

- Copy: `README.md` — wordmark "AuraGlass", attribution "by AuraOne",
  tagline "A liquid-glass design system for React 19".
- Color: `tokens/presets/aura.tokens.json` + `tokens/ref/color.tokens.json`
  (used as verbatim `oklch()` values).
- Face: licensed Aeonik at `public/fonts/aeonik/` (Bold on the wordmark only,
  per the font-library weight discipline).

## Layout

- `social/` — profile-400/800 (circular safe zone), og-1200x630,
  twitter-1200x600, banner-x-1500x500 (center safe band),
  banner-cover-2560x1440 (text inside the centered 1540×423 safe area).
- `favicon/` — icon-512 / icon-180 canonical copies; the script also wires
  them into `apps/docs/app/icon.png` + `apple-icon.png` and copies the og /
  twitter images into `apps/docs/public/brand/` (root layout metadata
  references them; see `apps/docs/app/layout.tsx`).

Evidence sheet: `evidence-2026-10-18.md` (before/after, sizes, hashes,
verification).
