# Runtime (local, lightweight) autopsy — aura-glass 4.1.0

Date: 2026-10-06. Node v26.9.0, npm 12.2.0. No browsers, Docker, full builds or full typechecks were run. Every number below was measured in this session.

## Verdict

The shipped artifact works. It loads cleanly in CJS and ESM, every export subpath resolves, the narrow jest subsets pass, and `dist/` matches HEAD `src` and the published 4.1.0 tarball. Runtime cost is the weak area. The root entry is a single 5.76 MB ESM / 6.07 MB CJS file. A consumer who imports only `GlassButton` gets **1.66 MB minified / 449 KB gzip** of library code, because 353 top-level `X.displayName = ...` side-effect statements stop tree-shaking. The CI tree-shaking budget is set to 1.7 MB for that case, so the gate accepts the problem. Five "domain" subpaths (`./forms`, `./data`, `./navigation`, `./overlays`, `./marketing`) are only type facades: at runtime they load the whole 6 MB root bundle. Server-only packages (express, helmet, jsonwebtoken, bcryptjs, ioredis, socket.io, pinecone, @sentry/node, dotenv) are hard `dependencies` of a UI library. Score: 5/10.

## 1. dist vs src sync

- Last commit touching `src`: `15b6de6f7` at 2026-09-05 10:10 PDT (the 4.1.0 release commit).
- Build times: `dist/index.js` 12:21:22, `dist/index.mjs` 12:21:21, `dist/esm/*` 12:28, `dist/index.d.ts` 12:33:12 (all 2026-09-05 PDT).
- `find src -newer dist/index.js`: 0 files. `git status` shows no `src` changes.
- `src/index.ts` (1289 lines) and `dist/index.d.ts` (483 lines) both have 16 `export *` and 435 `export {` statements. The sets of re-exported module paths are identical (`diff`: no output).
- `dist/index.d.ts` declares 695 named value exports, and none are missing from runtime `require('./dist/index.js')`, which has 1073 keys.
- `npm view aura-glass`: latest is 4.1.0, published 2026-09-05T19:57:37Z, unpackedSize 49,159,838, fileCount 2391. The local `npm pack --dry-run` gives the same two numbers, so local `dist` is almost certainly the published artifact.
- Conclusion: dist is in sync with HEAD src. One caveat: the tarball was built and published with the 4 uncommitted script fixes in section 6, so HEAD alone cannot reproduce the publish.

## 2. Load cost

| Entry | Time (cold, separate process) | Exports | Heap after |
|---|---|---|---|
| `require('./dist/index.js')` | 111 ms / 106 ms (2 runs) | 1073 | 22 MB |
| `import('./dist/index.mjs')` | 565 ms / 601 ms (2 runs) | 1073 | 49 MB |
| `./three` (ESM) | 115 ms | 14 | — |
| `./services/ai/openai-service` (CJS via require(esm)) | 190 ms (pulls `openai`) | 1 | — |

The CJS root load added 323 modules to `require.cache`:

- date-fns: **304** (the whole barrel loads eagerly)
- react: 4
- react-dom: 2
- scheduler: 2
- chart.js: 2
- one each: framer-motion, motion-dom, motion-utils, react-hook-form, react-chartjs-2, @kurkle/color, clsx, tailwind-merge, and the bundle itself

Notes:

- chart.js and react-chartjs-2 load eagerly from the root entry, even for consumers who never render a chart.
- three, @react-three/* and the server packages are not pulled in by the root entry. They are isolated in `./three` and the `./services/*` subpaths, which is good.
- The bundle starts with a file-wide `"use client"` (`dist/index.mjs:1`). The entire root entry is a client module, including token and utility helpers.
- `dist/index.mjs` defines esbuild's `__require` shim (lines 2-7). `src/utils/dateAdapters.ts:43` `loadOptionalDateLibrary` calls it with `"date-fns"` and `"dayjs"` (`dist/index.mjs:150720, 150728, 150788`). In a browser ESM bundle that call always throws "Dynamic require ... not supported". The catch turns it into a misleading "dayjs is not installed" even when dayjs is installed. date-fns is also treated as optional there, but `package.json` declares it as a hard dependency.
- Odd naming leaks into the shipped bundle, for example `consciousnessResourcePool` Proxy singletons (`dist/index.mjs:~150702`).

## 3. npm pack --dry-run

npm 12 returns an object keyed by package name, not an array. That matters for section 6.

- Tarball 9,651,938 B (9.65 MB). Unpacked 49,159,838 B (49.2 MB). 2391 files.
- Source maps: 811 files totaling **25.9 MB**, 53% of the unpacked size.
- Biggest files:
  - `dist/index.mjs.map` 10.50 MB
  - `dist/index.js.map` 10.39 MB
  - `dist/index.js` 6.07 MB
  - `dist/index.mjs` 5.76 MB
  - `dist/styles/index.css.map` 0.47 MB
  - `dist/three/index.{mjs,js}.map` 0.39 MB each
  - `dist/styles/index.css` 0.37 MB
  - `dist/primitives/index.*.map` 0.31 MB each
- By directory:
  - `dist/esm` (a preserve-modules build) 7.48 MB
  - `dist/components` 1.69 MB
  - `dist/icons` 1.68 MB
  - `dist/styles` 1.29 MB
  - `dist/three` 1.22 MB
  - `dist/primitives` 1.02 MB
- Shipped content that does not belong in a component package:
  - `dist/esm/services` (12 files, 187 KB, including `auth/auth-service.js`, which imports jsonwebtoken and bcryptjs)
  - `dist/server`
  - `dist/reports` and `dist/esm/reports`
  - `dist/scripts` and `dist/esm/scripts`
  - `dist/tools` and `dist/esm/tools`
- The library ships two parallel ESM trees, the single-file `dist/index.mjs` and `dist/esm/**`. The exports map references `dist/esm` 22 times, so consumers can end up with duplicate module instances depending on the subpath they import.

## 4. Narrow jest subset

```
npx --no-install jest --runInBand --ci \
  src/primitives/LiquidGlassMaterial.test.tsx src/primitives/native-primitives.test.tsx \
  src/primitives/glass/GlassAdvanced.test.tsx src/primitives/LiquidGlassBackdropSampler.test.tsx \
  src/__tests__/components/GlassButton.test.tsx
Test Suites: 5 passed, 5 total
Tests:       36 passed, 36 total
Time:        1.069 s
```

The native primitives tests are meaningful: Slot ref merging, FocusScope trap and restore, RovingFocus with Home/End/RTL, DismissableLayer nesting. The material tests are not:

- `LiquidGlassMaterial.test.tsx` only checks for `data-liquid-glass-material="true"`.
- `LiquidGlassBackdropSampler.test.tsx` only checks that the text matches `/mixed|light|dark/`.

jsdom cannot verify anything visual, so these tests say nothing about glass quality. The repo has 774 `*.test.ts*` files. Count is not coverage of rendering.

## 5. test:exports

`npm run test:exports` starts with `npm run build`, a full build, so it was not run as-is. The two halves were run against the existing dist:

- `jest tests/exports/package-exports.test.ts`: 30/30 passed, 0.58 s. It covers 29 of the 47 export keys.
- `node tests/exports/package-exports.spec.mjs`: exit 0, 1.35 s, silent.
- Ad-hoc self-reference load of all 42 JS export keys through both `require` and `import`: all OK. Results:
  - `./forms`, `./data`, `./navigation`, `./overlays`, `./marketing` each return **1073 exports**. `package.json` maps their `import`/`require` to `./dist/index.mjs` / `./dist/index.js`, and only `types` points at a narrow `dist/<x>/index.d.ts`. The narrowing exists only in types, and at runtime they load the full root bundle. `./client` also re-exports the full root.
  - `./services/ai/*` have only `import`/`default` targets pointing at ESM files under `dist/esm`. CJS consumers depend on `require(esm)` support (Node ≥20.19/22.12).

Tree-shaking was checked with esbuild 0.25.12, `--bundle --minify`, all deps external:

| Consumer source | Minified | Gzip |
|---|---|---|
| `import { GlassButton } from "aura-glass"` | 1,658,245 B | 448,812 B |
| `import { Slot } from "aura-glass/primitives/slot"` | 631 B | 414 B |

The root-import output still contains 277 `X.displayName="..."` assignments, plus GlassDataTable, GlassKanban, GlassCommandPalette, AuroraBackground and 18 GlassChart references. The cause is 353 top-level `^X.displayName = ` statements in `dist/index.mjs` (first at line 2964), which bundlers treat as side effects. `package.json` `sideEffects: ["*.css","src/styles/**/*"]` cannot fix this. Its `src/styles/**/*` glob also matches nothing that ships.

`scripts/ci/verify-tree-shaking.js` sets `maxBytes: 1700000` for "GlassButton only" and for the forms/data/navigation/overlays/marketing scenarios. The gate was calibrated to pass at about 1.66 MB rather than to enforce tree-shaking.

## 6. Uncommitted diff (4 files)

These are a real, in-progress compatibility fix for **npm ≥11 `npm pack --json` output shape**. npm now emits `{ "<name>": {...} }` instead of `[{...}]`.

- `scripts/ci/run-next-integration.js:48-50` and `scripts/ci/run-vite-integration.js:46-48` replace `JSON.parse(out)[0]` with an Array-or-`Object.values()[0]` fallback.
- `scripts/ci/verify-pack.js:137-147` changes `indexOf('[')` to `search(/[[{]/)` and adds the same shape fallback. With the old code, `indexOf('[')` landed inside the object's `files` array and parsed garbage.
- `reports/3.2-release/vite-integration.json` is regenerated output: 3.5.0 → 4.1.0, shasum `08fd6660…`, generated 2026-09-05T19:48:05Z. That is 9 minutes before the 4.1.0 publish.

Implication: `prepublishOnly` (`verify:pack`, `test:integration:next`, `test:integration:vite`) is broken at HEAD on npm 12. The 4.1.0 publish depended on these uncommitted edits. They should be committed, or the release is not reproducible from git.

## Recommendations (runtime)

1. Make components tree-shakeable:
   - Set displayName inside the component definition, or wrap it in `/* @__PURE__ */` IIFEs or `Object.assign`.
   - Or ship preserve-modules ESM as the root `import` target.
   - Then cut the GlassButton budget from 1.7 MB to under 60 KB.
2. Give `./forms`, `./data`, `./navigation`, `./overlays` and `./marketing` real runtime entry files, or remove them.
3. Move the server packages out of `dependencies`, and stop shipping `dist/esm/services/auth`, `dist/server`, `dist/reports`, `dist/scripts` and `dist/tools`.
   - Move to optional peers or a separate package: express, helmet, cors, compression, express-rate-limit, jsonwebtoken, bcryptjs, ioredis, redis, socket.io, @pinecone-database/pinecone, @google-cloud/vision, openai, @sentry/node, dotenv.
4. Drop `.map` files from the tarball, or publish them separately (-26 MB unpacked). Collapse the two ESM trees into one.
5. Fix `sideEffects` to name the real dist CSS paths and any genuinely side-effectful modules.
6. Lazy-load chart.js and react-chartjs-2. Replace `loadOptionalDateLibrary`'s dynamic `__require` with static or dynamic `import()`, and import date-fns functions per-path.
7. Commit the npm-11 pack-shape fixes.
