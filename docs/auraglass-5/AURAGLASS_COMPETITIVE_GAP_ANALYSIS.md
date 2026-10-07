# AuraGlass 5.0 — Competitive Gap Analysis and Visual Benchmark (Deliverable C)

Date: 2026-10-06. Subject: `aura-glass` 4.1.0 (HEAD `15b6de6f7`).

Evidence base:
- AuraGlass state comes from:
  - the 15 subsystem autopsies in `docs/auraglass-5/autopsy/`. Finding IDs cite the current reports, and verdicts from each report's "Verification (adversarial)" section are honored: CONFIRMED is stated as fact, PARTIAL is marked, REFUTED is not used. `visual-quality.md` has no verification section; its figures are first-pass pixel measurements.
  - `autopsy/runtime-local.md`.
  - `autopsy/runtime-remote.md` with `autopsy/remote-evidence/`.
  - `component-inventory.json`.
- **Inventory counts.** The file has 500 records. Three are `_`-prefixed meta rows and one is the informational `NOTE: non-root or internal pieces in this shard` row; dropping them leaves **496 component records**. Two of those 496 are aggregate "internals" rows (0 lines, both REMOVE), so the per-component figures are effectively 494 entries; all disposition counts below use 496.
- Competitor and platform facts come from `research/competitors.md`, `research/apple-liquid-glass.md`, `research/web-glass-techniques.md` and `research/translucent-a11y-perf.md`. Competitor facts tagged [V] there are primary-source verified. Competitor *scores* in that brief are the researcher's judgement [I] and were not validated against any autopsy.
- **Visual evidence comes in two kinds, and neither was judged by eye.**
  - **Certification PNGs.** Pixel statistics and OCR over the 766 certification and ancillary PNGs (`autopsy/visual-quality.md`, Method).
  - **Remote browser run.** 624 fresh page loads in remote headless Chromium 141, software raster, on gated EC2 workers (`autopsy/runtime-remote.md`). The run covers 42 stories at 1440×900 and 390×844, over default/white/black/busy backgrounds. 12 of those stories were also run under reduced-motion, `contrast: more` and forced-colors. It recorded computed styles, contrast samples, backdrop-filter counts, rAF FPS and console errors.
  - **Not covered by either.** Specular quality, radius rhythm and optical hierarchy. WebKit and Firefox. GPU compositing.
  - **Remote input caveat.** The remote run used the prebuilt `storybook-static/`. It is dated 2026-09-05 03:42 PDT, about 6.5 h *before* the HEAD commit `15b6de6f7`, which touched about 100 `src/` files. It is gitignored and not regenerated with source (storybook-showcase §Outdated). Remote figures therefore describe a build that may lag HEAD.

---

## 1. Competitive matrix

**How to read it.** The AuraGlass column states the measured 4.1 reality. Every other cell gives AuraGlass's position **relative to that column**, then a short reason:
- **A**: AuraGlass is ahead
- **=**: roughly equal
- **B**: AuraGlass is behind
- **SB**: AuraGlass is substantially behind
- **n/a**: the dimension doesn't apply to that column

Apple Liquid Glass is a native, system-level reference, not a web library. Its column compares *principles and outcomes*, not shipping code. Cells marked [I] are inference where the research has no direct evidence.

Column keys:
- **shadcn**: shadcn/ui
- **Base**: Base UI
- **RA**: React Aria / Spectrum 2
- **Hero**: HeroUI v3
- **Mant**: Mantine 9
- **MUI**: Material UI v9
- **Chak**: Chakra v3 / Ark UI
- **Mag/Ace**: Magic UI / Aceternity UI
- **Motion**: Motion and Motion UI
- **LGR/kits**: liquid-glass-react and the small glass kits
- **Apple**: Apple Liquid Glass (reference)

### 1a. Material and perception

| Dimension | AuraGlass 4.1 (measured) | shadcn | Base | RA | Hero | Mant | MUI | Chak | Mag/Ace | Motion | LGR/kits | Apple |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Material realism | One fixed blur + saturate + white-gradient recipe, hand-written in 9+ places with conflicting values (MATERIAL-ENGINE-03, confirmed; 19–20 distinct saturate values, 22 blur literals). On screen: 266/353 certified desktop frames are pure grayscale (p90 saturation <3/255), and 351/356 sit on a near-white canvas (median rgb 245; visual-quality §1, §3). Remote: the typical computed fill is `rgba(255,255,255,0.02)` plus a 0.106→0.02 white gradient, i.e. close to fully transparent (runtime-remote §1) | **A, narrow.** No material layer | **A, narrow.** Unstyled | **A, narrow.** Little visual material | **A, narrow.** Polished but opaque | **A, narrow** | **A, narrow.** No glass found in v9 | **A, narrow** | **B.** Visually rich effect catalogs | **=.** Motion, not material | **B.** Real displacement plus aberration in Chromium | **SB.** Lensing, adaptive tint, thickness scaling |
| Refraction | None real. `LiquidGlassGPU` refracts a hard-coded indigo→pink canvas (MATERIAL-ENGINE-02, confirmed). HeatGlass displaces its own content. `ior` only gates saturate 1.4→1.5 (MATERIAL-ENGINE §7; TOKENS-THEME-13) | = none | = none | = none | = none | = none | = none | = none | = (decorative distortion only) [I] | = none | **SB.** SVG `feDisplacementMap` backdrop (Chromium only) | **SB.** Edge lensing is the defining trait |
| Edge lighting / specular | 1px inset top highlight plus radial sheen. 0 `@property` registrations. No light model (MATERIAL-ENGINE §2, §5). The shadow ladder tops out at 0.24 alpha, so depth reads as "card shadow" (visual-quality §9) | **A.** None | **A** | **A** | **A** | **A** | **A** | **A** | **=.** Glow/shimmer effects | **=** | **B.** Specular rim plus elastic highlight | **SB.** Geometry-aware highlights that react to motion and touch |
| Adaptive contrast | Adaptive tint computed then overwritten by a constant (MATERIAL-ENGINE-01, confirmed). Sampler reads transparent layers as black (-08, confirmed). ContrastGuard measures white text by default and reports fabricated passes (ACCESSIBILITY-01, -02, confirmed). `prefers-contrast: high` never matches (ACCESSIBILITY-06, confirmed). **Measured in a browser:** glass tint changed between white, black and busy backgrounds in 0 of 84 story×viewport pairs. With the story stage removed, 266/342 text samples fail WCAG on black (median 1.93:1), against 2/342 on white. `contrast: more` changes 0.0% of pixels on 12/12 stories (runtime-remote §1, §3) | **B.** Opaque surfaces with deterministic token contrast | **n/a** | **B.** Opaque, deterministic | **B.** OKLCH tokens | **B** | **B** | **B** | **=.** Not a focus | **n/a** | **=.** Kits claim AA without evidence | **SB.** Tint and dynamic range shift per backdrop; glyphs flip light/dark |
| Motion | No motion language: 8 motion token sources, 53 duration literals, 106 distinct keyframe names, 25 stiffness values (MOTION-05, confirmed). Internal `Motion` (`MotionFramer`) cannot play mount entrances (MOTION-06, confirmed by code; not observed in a browser). "100% reduced motion" is a tautology (MOTION-04). `animate={reduced ? {} : …}` leaves content invisible under reduced motion in 84 places (MOTION-01). `MotionPreferenceProvider` is never mounted (MOTION-02). Remote: the global reduced-motion rule does stop CSS infinite animations (4→0 on modal and app-shell; runtime-remote §5). The JS paths in MOTION-01/-02 were not exercised | **=.** Minimal but correct | **=.** CSS hooks | **=** | **B.** All-CSS, `data-reduce-motion` | **=** | **=** | **=** | **B.** Motion-first catalogs | **SB.** MotionScore grading, 5 named transitions, `reducedMotion: "calm"` | **=** | **SB.** Materialize transitions, morphing, reduced-motion contract |

### 1b. Foundation and engineering

| Dimension | AuraGlass 4.1 (measured) | shadcn | Base | RA | Hero | Mant | MUI | Chak | Mag/Ace | Motion | LGR/kits | Apple |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| a11y foundation | Bespoke. Internal primitives (DismissableLayer, FocusScope, RovingFocusGroup) are used by about 6 of 348 components (api-consistency §1). The CSS fallback layer is real but misses the canonical material (ACCESSIBILITY-07). `jest-axe` runs in 359 files, in jsdom only, with no real-browser axe (ACCESSIBILITY-15, PARTIAL: some Playwright specs do emulate forced colors). Remote forced-colors run: blur drops to 0 on core/button/card/input/select/navigation with 0/46 contrast failures, but `liquid-glass-material` keeps 1/1 and the showcase 12/12 backdrop filters (runtime-remote §4). Score 3/10 (accessibility §Summary) | **SB.** Base UI/Radix/RA base | **SB.** 35 accessible components | **SB.** Best in class | **SB.** RA-based | **B.** Own implementation | **B** | **B.** Zag state machines | **A.** Weak a11y [S] | **n/a** | **A.** None claimed | **SB.** System-level settings contract |
| Keyboard / APG | Slider has no key handler (ACCESSIBILITY-08). Tooltip opens on hover only (-10). Select's keyboard model breaks once open when `searchable` (-11, PARTIAL). DatePicker has no grid/dialog (-09). Menubar Escape blurs to body, and menus have no roving tabindex (-12). Accordion uses tab roles; TreeItem handles only Left/Right (-13). DataGrid is `role="table"` with no grid cell navigation (accessibility §Mediocre) | **SB** | **SB** | **SB** | **SB** | **SB** [I] | **SB** [I] | **SB** [I] | **A** [I] | **n/a** | **n/a** | **n/a** (native) |
| Component breadth | 496 component records, 393 flagged root-exported. Dispositions: 7 KEEP, 49 POLISH, 75 REDESIGN, 157 CONSOLIDATE, 152 REMOVE, 34 DEPRECATE, 22 REPLACE. Mean overall 3.04/10 (inventory). **Usable breadth (KEEP + POLISH) is 56** | **B.** Large, coherent set | **=.** 35 primitives, all usable | **=.** 50+ | **B.** 75+ coherent | **B.** 100+ [S] | **B.** Plus MUI X | **=** | **A.** Effect catalog | **A** | **A.** 1 to 48 components | **n/a** |
| Product surfaces (AI / data / workspace) | AI components are simulations (random GAN/DeepDream, `setTimeout` "AI"). No streaming, tool-call, citation or role model (SERVER-SERVICES-AI-06, confirmed). GlassChat is 2.5 REDESIGN. The saas-admin-shell recipe stacks the sidebar above main on desktop because its layout classes ship no CSS (APPSHELL-WORKSPACE-RECIPES-CLI-01, confirmed). The two 3.2 App Shell stories fail contrast on their own default stage: dark ink on a dark navy surface, 1.1–2.1:1 (runtime-remote §2). About 20–23 chart records (20 by `category`, 23 including name matches). Of the 23: 9 REMOVE, 11 CONSOLIDATE, 2 DEPRECATE, 1 REDESIGN, none KEEP/POLISH (inventory) | **SB.** Chat (Jun 2026), Questionnaire, data table, charts | **=.** Headless only | **B.** Virtualization, DnD | **B.** Pro templates | **B.** Schedule; no data table | **SB.** X Data Grid, charts, x-chat alpha | **B** | **=.** Marketing blocks | **B.** Motion UI sections | **A.** None | **n/a** |
| Theming / tokens | At least 5 parallel token layers, each claiming to be canonical. radius-md is 6/8/12/16px across them and primary is 4 different hues (TOKENS-THEME-01, confirmed; the two layers that actually paint agree on 16px). About 570 of 621 generated `--aura-*` vars (569 first pass, 571 verifier) are never read (-03). The Theme Engine emits 17 vars and only `--glass-theme-text` is read (-06). Personas are dark-only accent swaps (-05) | **SB.** CSS vars plus presets; the de facto interchange format | **n/a** | **B.** S2 macros | **SB.** OKLCH, standalone styles package | **SB** | **B** | **SB.** Recipes | **B.** Rides shadcn tokens | **B.** Motion tokens | **A** | **SB.** One material, variant discipline |
| RSC / SSR | The root is one `"use client"` boundary (PACKAGING-SSR-DX-03). The `primitives`/`theme` subpaths drop the directive and crash in Server Components (-04, confirmed). `ssr`/`server` entries are styled-components no-ops (-14, PARTIAL). `AuraGlassClientBoundary` causes a hydration mismatch (-07; HOOKS-UTILS-TYPES-23). The Next gate runs only `next dev` with all-client pages (-05) | **SB.** Per-file source, user-owned [I] | **B** [I] | **B** [I] | **B.** No provider required [V] | **B** [I] | **B** [I] | **B** [I] | **B.** Copy-in [I] | **B** [I] | **=** [I] | **n/a** |
| Bundle / perf | Single unminified root file of 5.76 MB (5.5 MiB), 1.04 MB gzip (PERFORMANCE-01). `import { GlassButton }` bundles to 1.98 MB minified / about 558 KB gzip, of which about 447 KB is AuraGlass's own code (PACKAGING-SSR-DX-02, PERFORMANCE-01, both confirmed). Root, CSS and `three` gzip budgets fail; `tokens` passes. No workflow runs `bundlesize` (PERFORMANCE-06; PACKAGING-SSR-DX-11, PARTIAL: 3 of 4 budgets fail, not all). The CI tree-shaking gate passes at 1.62 MB against a 1.7 MB budget only because it externalizes framer-motion and chart.js (PACKAGING-SSR-DX-02). `LiquidGlassMaterial` defaults to always-on backdrop sampling with a subtree MutationObserver plus scroll/resize listeners on 30 consumers (PERFORMANCE-04, PARTIAL: the `will-change` part applies only to interactive ones). ESM root import takes about 0.6 s; 304 of the 323 modules a CJS root load pulls in are `date-fns` (runtime-local §2). **Remote runtime:** median 60 fps, but modal 12 fps, dialog 13–14 fps and the 3.2 app shells 19–23 fps under scripted hover and scroll. Those stories have 4 infinite animations, 12–29 backdrop-filter elements, nesting depth up to 4 and 40px blur (runtime-remote §5; software raster, so only the relative gap is meaningful) | **SB.** Copy-in, tree-shaken | **SB.** Whole library is 146.9 KB gzip | **SB** | **SB** | **SB** | **B.** Emotion runtime | **B** | **B** | **SB.** About 12 KB layout animations; perf grading | **SB.** Single small component | **n/a** |

### 1c. Product, distribution and trust

| Dimension | AuraGlass 4.1 (measured) | shadcn | Base | RA | Hero | Mant | MUI | Chak | Mag/Ace | Motion | LGR/kits | Apple |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DX: install to beautiful | Score 3.5/10 (packaging §1). Install pulls Express, Redis, JWT, OpenAI, Pinecone, Google Vision and `@sentry/node`, an estimated 150–200 MB of trees (PACKAGING-SSR-DX-01, PARTIAL: no UI entry imports them, but published `./services/*` subpaths do; HISTORY-HYGIENE-02). `aura-glass/styles` ships Storybook-only CSS: unprefixed `.flex`/`.grid` shims and `.sb-story !important` (TOKENS-THEME-12; APPSHELL-WORKSPACE-RECIPES-CLI-05). It also ships 12 Aeonik font files with no font license (DOCS-README-14). 832 referenced `glass-*` classes have no CSS rule (PACKAGING-SSR-DX-09; count not reproduced). The CLI recipes are the one fast path (appshell §Keep) | **SB.** CLI v4, MCP, skills, presets | **B.** llms.txt, markdown docs | **B.** MCP servers | **SB.** MCP, skills, llms.txt, no provider | **SB.** MCP server | **B** | **B.** Snippet CLI | **SB.** Paste, instantly striking | **SB.** shadcn-CLI install | **B.** One-line wrapper, instant effect | **n/a** |
| Distribution / registry | npm package plus a CLI reading a TS recipe array. No `$schema`, `registryDependencies` or `cssVars` (APPSHELL-WORKSPACE-RECIPES-CLI-08, PARTIAL). Recipes import `aura-glass` instead of vendoring. 0 of 28 recipes use their declared tokens (-07). They carry 75 `!important` and about 114 hex literals (-04). 156 downloads/week (competitors.md §2) | **SB.** `registry:base`, public/private registries, directory | **=** model; **SB** adoption (19.3M/wk) | **=** model; **SB** adoption | **=** model; **SB** adoption | **=** model; **SB** adoption | **=** model; **SB** adoption | **B.** Hybrid model | **SB.** Registry-native | **SB.** Via shadcn registry | **B.** 45k/wk | **n/a** |
| Docs / showcase | Docs 4/10. 79 of 278 copy-pasteable snippets (28%) fail `tsc` against the shipped types (DOCS-README-01). 85 of 518 imported bindings (16%) name exports missing from their entry (-02). Both are CONFIRMED by cause; the aggregate counts were not re-derived. 37–40 doc files import from `@/`, `../src` or a fictional `@aura/glass` (-08). 142 stub pages (-11). Six release lines (-09). 0 RSC docs (-06). No README screenshots (-26). Storybook 3/10: 351/356 certification shots have mean luminance >200 and 330/356 have colorfulness <8 (STORYBOOK-SHOWCASE-02, confirmed). Most Category Galleries render no components (-07, PARTIAL: IconsGallery does) | **SB** | **B** | **SB** | **SB** | **SB** | **SB** | **B** | **SB.** Visual-first | **SB** | **B.** Demo-led README | **SB.** HIG plus WWDC sessions |
| Certification / evidence | "498 certified green" has no reproducible artifact. The repo's own verifier reports FAIL 0/498 at HEAD (QA-CERTIFICATION-01, confirmed; the summary was generated after release, so it proves staleness now, not falsity at release). No CI workflow runs the full unit suite, the token-purity audit, the Storybook certification or the evidence verifier (-02). No pixel-diff regression exists: `visual-baselines/` is empty (-03). Certification passes any non-empty glass/svg node: 3 fully blank targets "passed" (-04; visual-quality §5). The 498 count is inflated by aliases and duplicate evidence (-05). The fresh remote run found 0 console or page errors across 624 loads (runtime-remote §6). That is the one claim class the evidence supports | **B.** No false claims [I] | **B.** Releases with size data [V] | **SB.** Deep behavioral testing [I] | **SB.** Behavioral suite since 3.2.4 [V] | **B** [I] | **B** [I] | **B** [I] | **=.** No certification | **SB.** Public S–F perf grade, ships nothing below C | **=.** Kits claim AA without evidence | **n/a** |

### Where AuraGlass is genuinely ahead today

- **Category position.** No mainstream library ships a production-grade, accessible liquid-glass system. The glass field consists of single wrappers or kits under 100 stars (competitors.md §1.4).
- **The accessibility media layer in `glass.css`.** It covers `prefers-reduced-transparency`, `forced-colors` with `Canvas`/`CanvasText`, and `@supports not (backdrop-filter)` (MATERIAL-ENGINE §3). This is rarer among glass libraries than anything else AuraGlass has, and the remote forced-colors run shows it working on the classes it lists (runtime-remote §4). Its gaps:
  - It misses `.liquid-glass-material` and inline glass (MATERIAL-ENGINE-07, PARTIAL; ACCESSIBILITY-07). In the browser, the showcase keeps 12/12 backdrop filters under forced colors.
  - Its contrast branch uses the wrong query value (ACCESSIBILITY-06).
- **Correctly shaped primitives with broken internals.** `LiquidGlassMaterial` is context-aware, and `LiquidGlassLayerProvider` tracks depth. The scroll-edge, concentric-frame and source-transition primitives are small and honest (MATERIAL-ENGINE §3).
- **Keepers.** The CLI's path-containment, `--dry-run` and audit work, and the recipe render harness (appshell §Keep).
- **Small but real.** The few KEEP/POLISH islands (inventory):
  - KEEP: `GlassPageTabs`, `Portal`, `FocusScope`, `Label`, `GlassDateField`/`GlassTimeField`, `GlassStack`.
  - POLISH: `GlassDropdownMenu` and `GlassTabs`.
  - `GlassSelectCompound` is REDESIGN. Its `value`/`defaultValue`/`onValueChange` contract, shared with `GlassTabs`, is still the one to standardize on (api-consistency §3).
- **Runtime hygiene is clean where it was measured.** 0 console errors, 0 page errors, 0 empty roots and 0 horizontal overflow at 390px across 624 remote loads (runtime-remote §6). The overflow result is partly by construction: StorySurface sets `overflowX: hidden` (visual-quality §10).

None of the material or primitive strengths above is visible in a screenshot today.

---

## 2. What prevents AuraGlass from being the global benchmark (ranked)

Ranked by how much each blocks a reasonable evaluator from choosing AuraGlass as the reference glass system, weighted by how much downstream work it gates.

1. **The material does not exist on screen.**
   - Certified captures are pale gray surfaces on a near-white canvas. The median component covers 14.5% of the frame. Surfaces differ from the canvas by about 3% luminance, and 278/353 are *lighter* than it. There is nothing behind them to blur (visual-quality §Executive verdict, §1–2, §4).
   - Remote browser evidence goes further. The computed fill is about 2% white. In 0 of 84 story×viewport pairs did the tint adapt to the backdrop. Ink stays `rgba(0,0,0,.9)` because a declared `glass-on-light` class pins it. As a result, every one of the 42 sampled stories fails contrast over black, and the modal, dialog, drawer, chat and app-shell stories fail over a busy gradient. The Storybook stage hid this: every story paints its own opaque light gradient (runtime-remote §1).
   - In code, the adaptive pipeline is discarded (MATERIAL-ENGINE-01), refraction is synthetic (-02), about 15 "physical" props are no-ops on 166 call sites (-05), and there are 9+ conflicting recipes (-03).
   - A benchmark glass system has to look better than everyone else, and today it doesn't look like glass. This gates everything else: showcase, adoption, the premise of the brand.
2. **Its claims are not credible.**
   - "498 certified green" has no reproducible artifact and fails its own verifier at HEAD (QA-CERTIFICATION-01).
   - No CI workflow runs the full suite, the token-purity audit or the evidence verifier (QA-CERTIFICATION-02), and there is no pixel-diff regression (-03).
   - ContrastGuard's "AA" badge is fabricated (ACCESSIBILITY-01, -02). The "100% reduced motion" claim is a tautology (MOTION-04). "IOR physics" does nothing (MATERIAL-ENGINE §7; TOKENS-THEME-13).
   - A benchmark is a trust position. One falsified headline undoes every other claim, including the true ones.
3. **The interaction and accessibility foundation is bespoke and incomplete in a market that has settled on shared primitives.**
   - Base UI, Radix and React Aria are the 2026 consensus (competitors.md §1.1).
   - AuraGlass hand-rolls its behavior and fails APG on slider, tooltip, select, date picker, menus/menubar, accordion and tree (ACCESSIBILITY-08 to -13).
   - Conditional hooks make `GlassInput` throw when an error appears at runtime (API-CONSISTENCY-02, confirmed and understated).
   - Glass is a skin. Nobody adopts a skin whose controls are less accessible than shadcn's defaults.
4. **The packaging is disqualifying for 2026 React apps.**
   - The backend stack ships as hard dependencies (PACKAGING-SSR-DX-01, PARTIAL; HISTORY-HYGIENE-02).
   - The bundle is a monolith that can't be tree-shaken: a button costs about 0.56 MB gzip (PERFORMANCE-01).
   - The RSC boundary is broken (PACKAGING-SSR-DX-03, -04). The stylesheet ships Storybook shims globally and has no `@layer` (TOKENS-THEME-12; tokens-theme §Outdated).
   - The fonts are commercial, with no license notice (DOCS-README-14; needs legal confirmation).
   - A Next.js App Router team will reject it at install, before seeing a single surface.
5. **There is no single source of truth for material, tokens, motion or API.**
   - At least 5 token layers with disagreeing values (TOKENS-THEME-01).
   - 13 elevation unions and 61–91 `variant` unions (API-CONSISTENCY-05).
   - 8 motion token sources (MOTION-05) and 8 reduced-motion entry points (motion §Duplication; HOOKS-UTILS-TYPES-04).
   - With this much spread the system can't look like one hand (visual-quality §9; MATERIAL-ENGINE §4), and it can't be themed or exported to a registry.
6. **Breadth is noise, and the product surfaces that matter are missing or broken.**
   - Only 56 of 496 component records are KEEP/POLISH. 152 are REMOVE, much of it quantum, consciousness and biometric theater (inventory; HISTORY-HYGIENE-08, PARTIAL).
   - The 2026 table-stakes surfaces are simulated or broken: AI chat with streaming and tool cards, a real data grid, a working app shell (SERVER-SERVICES-AI-06; API-CONSISTENCY-09; APPSHELL-WORKSPACE-RECIPES-CLI-01). The shipped 3.2 app-shell stories also fail contrast and run at 19–23 fps in the remote run (runtime-remote §2, §5).
   - shadcn and MUI already own those surfaces.
7. **Distribution and agent DX are a generation behind.**
   - No shadcn-compatible registry, no MCP server, and an `llms.txt` stuck on "3.0.x" (DOCS-README-09).
   - 28% of copy-paste doc snippets fail `tsc` (DOCS-README-01) and 16% of doc import bindings fail (-02). Neither aggregate was re-derived, but every named cause reproduces. 37–40 doc files use private or fictional imports (-08).
   - 156 downloads a week against Base UI's 19.3M (competitors.md §2).
8. **The showcase inverts priorities.**
   - Primitives get one-line stories and are photographed tiny. Gimmicks get the staged scenes (visual-quality §4, §6; STORYBOOK-SHOWCASE-14, PARTIAL).
   - The flagship showcase restyles components with 24 `!important` rules (STORYBOOK-SHOWCASE-04), so the screenshots don't show what consumers get.
   - The State Matrix showcase imports zero AuraGlass components (-05).
9. **Motion reads as 2019 web motion and is partly broken.**
   - Style: `scale 1.05` hovers, infinite pulses and rainbow glows (motion §What exists, §Outdated; MOTION-08).
   - Entrances that can't play (MOTION-06, inferred from code and Framer semantics; not observed in a browser).
   - An underdamped default spring, 100/10 with ζ≈0.5 (MOTION-05).
   - Motion UI has set a public, graded bar (competitors.md, Motion).
10. **The web platform imposes a hard ceiling, and AuraGlass has to design for it rather than deny it.**
    - Backdrop refraction works only in Chromium. WebKit bug 245510 is open with its patches unmerged. Firefox does not render it, and a secondary source [R] says it also passes `@supports`, so it would fail silently (web-glass-techniques §1.4; the `@supports` behavior is not primary-verified).
    - No web API exposes backdrop luminance (§7).
    - `prefers-reduced-transparency` is unsupported in Safari through 27.2 and disabled by default in Firefox (§8).
    - The benchmark therefore can't be "Apple parity". It has to be "the best legible material the web can produce in every engine, with a measurable lens tier where it exists". Today's marketing ("Apple Liquid Glass parity", `LiquidGlassMaterial.tsx:132`) sets a bar that can't be met.
11. **Repo hygiene taxes every contributor.**
    - The HEAD tree is 2.95 GB, 99.4% of it committed audit artifacts under `reports/`, including 23,947 PNGs (HISTORY-HYGIENE-01).
    - 17,344 tracked files (1.18 GB) are duplicate staging copies of one visual run (-04).
    - There are 45 root probe scripts (-09), and the CHANGELOG, tags and npm disagree (-05).
    - It is a secondary problem, but it blocks outside contributors, and a benchmark needs them.

---

## 3. Liquid Glass material principles, adapted for the web

These principles are derived from Apple's documented *rules* (apple-liquid-glass.md §2–3). They are restated as web mechanisms and testable AuraGlass contracts. Apple's visuals are deliberately not copied: no blobby capsules, no heavy whole-surface distortion, no rainbow rims (§6). Every principle names how it degrades and how it is verified.

| # | Principle | Web mechanism | AuraGlass 5 contract (testable) |
|---|---|---|---|
| P1 | **Optics live at the rim; the plate stays calm.** Light bends at the edge, and the reading area is a clear, steady plate | A lens band: SVG `feDisplacementMap` through `backdrop-filter: url()` limited to an outer band of about 8–14px, with the map precomputed per shape and size class (kube.io model). The center is blur + tint only | No displacement ever under text. The lens map is rebuilt only when the size class changes, never on every resize. Without the lens tier, the rim becomes a specular gradient (P8) |
| P2 | **The legibility floor comes before translucency.** Clarity is whatever is left after legibility is guaranteed | A tint opacity floor per surface, computed at build time with a **two-extreme composite test**: text over tint composited on pure white *and* pure black must both pass 4.5:1 (3:1 for large text). Blur never counts toward contrast (translucent-a11y-perf §2.3) | Enforced in CI from the token compiler. APCA is reported as advisory only. Replaces the `return true` validators `validateTextContrast`/`validateLiquidContrast` (MATERIAL-ENGINE §7) and ContrastGuard (ACCESSIBILITY-01, -02). Today's material fails this test outright: with the stage removed, 266/342 sampled text runs fail on black (runtime-remote §1) |
| P3 | **Declare the backdrop; don't guess it.** The web can't see what's behind an element | `data-backdrop="light|dark|media"` on sections, inherited through CSS, flips tint, glyph and rim tokens. Luminance sampling is allowed only for media the library owns (its own image or gradient components), throttled and off by default | No DOM color sniffing at runtime. The current sampler (MATERIAL-ENGINE-08) becomes a dev-time lint at most. Today "adaptation" is only the consumer-declared `glass-on-light` tone class, which pins ink to black-90 regardless of what is behind it (runtime-remote §1). Small controls flip glyph tone; large panels raise opacity instead of flipping (Apple's small/large split) |
| P4 | **Thickness follows size.** Bigger surfaces read as thicker | A size class (`control | bar | panel | sheet`) drives blur radius, opacity floor, shadow depth and lens strength from one table | One `MaterialSpec` × size class × scheme. No per-intent material tables (MATERIAL-ENGINE §9.1) |
| P5 | **Glass is a layer, not a fill.** Only the floating navigation and control layer is glass. Content uses solid or tinted material | Component families split into `glass` (bars, sheets, popovers, toolbars, docks) and `surface` (cards, cells, rows, inputs: opaque or tinted solid). At `depth ≥ 1` a surface automatically drops `backdrop-filter` and renders an "inner" material: fill plus rim. This also avoids the Backdrop Root trap (web-glass-techniques §2) | Dev warning on glass-in-glass. Release metric: live backdrop-filter layers per viewport within the P16 budget (premium systems budget 1–3). Remote baseline: median 3 visible backdrop filters per story, but 12 on modal/dialog/drawer, 18 on the collaborative workspace, 18–21 visible (29 total, nesting depth 4) on the 3.2 app shells and 51 on the state matrix (runtime-remote §5). Nested glass is never suppressed today (PERFORMANCE-09; MATERIAL-ENGINE-06) |
| P6 | **Few variants, never mixed.** | Exactly `regular | clear | solid` as a typed union. `clear` is allowed only over media and requires a dimming scrim (default 35% black over bright backdrops). `solid` is the identity/no-effect state | Lint fails `clear` without `data-backdrop="media"`, and fails mixed variants in one group |
| P7 | **Tint is stained glass and is spent sparingly.** Color maps to the backdrop's brightness and marks the single primary action | Tint is applied as a luminance-mapped blend on the tint layer (OKLCH via `color-mix()`, not `rgba(brand, .6)` paint). One `prominent` tone per view. Brand color otherwise lives in the content layer | Dev warning when more than N tinted controls are visible. A `primary` must differ measurably from `secondary`. Today intent changes only the inset glow and shadow, so `primary` and `danger` `OptimizedGlass` look almost identical (MATERIAL-ENGINE §4; TOKENS-THEME-02). Every `GlassBadge` variant renders the same gray border (visual-quality §3) |
| P8 | **Light is a scene variable.** All surfaces share one light | One global `--ag-light-angle` registered with `@property <angle>`. The rim is a `mask-composite` gradient border whose intensity follows edge-normal vs light angle. Pointer- or scroll-driven light is optional, throttled, and written to a CSS variable without React state | Off under reduced motion. Zero `setState` per pointer or orientation event (fixes PERFORMANCE-08, PARTIAL, and MATERIAL-ENGINE-12) |
| P9 | **Nested shapes are concentric.** | `shape="fixed|capsule|concentric"` with `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-pad)))` and a fallback radius | One radius scale per size class. Retire the four competing scales (MATERIAL-ENGINE §4) and the 6/8/12/16px disagreement (TOKENS-THEME-01) |
| P10 | **Opacity is state, not style.** | Modality, expansion and focus loss raise the opacity floor: a modal gets glass + scrim, a full-height sheet becomes more opaque, an unfocused window recedes | State-to-opacity mapping lives in the material spec, with fixtures for each state |
| P11 | **Groups share one pane.** | A `GlassGroup` renders a single shared backdrop layer, with children as cut-outs, instead of N `backdrop-filter`s. Morphing uses View Transitions or FLIP. The blur fades back in after the snapshot, because View Transitions capture a flat image | Counted backdrop layers per viewport stay under a published budget (P16). No double-frost seams between adjacent controls |
| P12 | **Arrival is optical, and cheap.** Elements materialize rather than just fade | Enter and exit animate the displacement `scale` (cheap) and the opacity of a pre-blurred child layer. Never animate `blur()` radius or `transition: all` | Under reduced motion, enter and exit are a short crossfade with no elastic springs (Apple's Reduce Motion contract). Today 20 animated `filter`/blur keyframe arrays exist (motion §What exists), and `transition: all` is the default on glass surfaces (MATERIAL-ENGINE-12; PERFORMANCE-15) |
| P13 | **The user holds the dial.** Apple's own course correction was a user slider, not a better default (apple-liquid-glass §4) | A persisted `transparency` preference (`glass | tinted | solid`) plus a 0–1 `glassOpacity`, set from the provider prop, a `data-ag-transparency` attribute, and the media queries. This is required because Safari never fires `prefers-reduced-transparency` and Firefox ships it disabled by default | `prefers-contrast: more` (not `high`; ACCESSIBILITY-06) forces at least `tinted` plus a 1px border. Today `contrast: more` changes 0.0% of pixels on 12/12 stories (runtime-remote §3). `forced-colors` forces `solid` with system colors and an `outline` (not shadow) focus ring. Today forced colors still leaves 12/12 backdrop filters on the showcase and 10 of 12 on glass-modal (runtime-remote §4) |
| P14 | **Tiers are chosen by engine, not by `@supports`.** | Three rungs: **Lens** (Chromium: P1 + P8), **Frost** (all engines: blur + saturate + tint floor + rim + grain), **Solid** (fill ≥ 85% opaque, keeping rim and shadow). Engine detection or a pixel probe selects Lens, since `@supports` reportedly cannot detect the Firefox failure ([R] secondary source, web-glass-techniques §1.4) | Fallback rules attach to the single `.ag-material` class, so coverage is 100% by construction (MATERIAL-ENGINE-07). Ship `-webkit-backdrop-filter` with literal values (custom-property resolution in Safari is unverified, web-glass-techniques §2) |
| P15 | **Edges dissolve; dividers disappear.** | `ScrollEdgeEffect soft|hard`: a masked, backdrop-blurred strip where floating bars overlap scrolling content, built into nav and toolbar components. One per view. `scroll-padding` equals the bar height (WCAG 2.4.11) | Automatic in AuraGlass bars, never stacked |
| P16 | **Spend glass on a budget.** Apple warns that too many effects degrade performance | Published caps per viewport for simultaneous backdrop layers and lens surfaces, a per-component cost grade (compositor / paint / filter), and offscreen pausing of every continuous loop | A MotionScore-style grade per component, measured remotely. The repo itself measures only bundle sizes; it has no runtime render-cost gate (frame time, INP, backdrop-layer count) (performance.md recommendations; web-glass-techniques TL;DR 4). The one-off remote run supplies a baseline: median 60 fps; modal 12, dialog 13–14, app shells 19–23 fps; glass-modal desktop has 49 long tasks totalling 4,056 ms (runtime-remote §5; software raster). Continuous loops are not paused offscreen: 0 of 55 rAF component files pause (MOTION-08; PERFORMANCE-05) |

What not to do in the name of these principles: put glass in the content layer, pursue maximum clarity by default (Apple has been moving toward *more* separation since iOS 26.1 and 27), or add motion that only exists for its own sake (NN/g critique, apple-liquid-glass §4).

---

## 4. Visual quality bar

### 4.1 The bar

A component reaches the bar only when a design-literate reviewer would mistake its screenshot for first-party platform documentation, and the screenshot shows what a consumer actually gets. Concretely:

1. **There is a real scene behind every glass surface.** Every story renders over a mandated backdrop set: photo, calm chromatic field, text-dense content, flat light, flat dark. The Storybook stage must not paint its own opaque backdrop, which is what hides the failure today. Glass on a flat field is not evidence of anything (visual-quality §1; STORYBOOK-SHOWCASE-02; runtime-remote §1).
2. **Primitives get the best photography.** Button matrices (size × intent × state), cards with real media, inputs filled/focused/error, and badges and avatars at legible scale. Copy is product-realistic. Primitives are shot first and largest (visual-quality §4, §7).
3. **The sheet reads as one hand.**
   - One material spec.
   - One blur scale: 3–5 steps instead of 22 literals (MATERIAL-ENGINE §2).
   - One radius scale per size class, with concentric insets.
   - A real type scale with 15–17px body text. Today the median OCR word height is 11px, with the body forced to 14px.
   - One elevation-tied shadow scale (visual-quality §8–9).
4. **Hierarchy comes from layering.** Glass sits on two or three floating layers, content is solid or tinted, and a primary is visibly primary.
5. **Every engine and every preference looks designed.** The Frost and Solid tiers, dark mode, reduced transparency, increased contrast and forced colors are each art-directed states, not degraded leftovers.

### 4.2 Mechanically testable gates (pixel-derived, replacing DOM-only certification)

Gates run remotely across {Chromium, WebKit, Firefox} × {light, dark, media backdrop} × {Lens, Frost, Solid} × {default, reduced-transparency, more-contrast, forced-colors} × {desktop 1440, mobile 390}. The pass label is computed from the pixels and never hard-coded. Today `themesInspected` is a constant string (visual-quality §5; STORYBOOK-SHOWCASE-03). The remote run in `runtime-remote.md` is a working prototype of this harness for Chromium only: stage removal, forced backgrounds, emulated media and per-text-run contrast sampling. The "Today" column cites it where it applies.

| Gate | Threshold | Today's failure it catches |
|---|---|---|
| Not blank | Max deviation from backdrop ≥ 40 levels | 3 fully blank targets and 16 that never exceed about 2:1, all certified "passed" (visual-quality §5; QA-CERTIFICATION-04) |
| Surface separation | ≥ 25% of surface pixels differ from backdrop by > 10 levels | The median surface differs from the canvas by about 3% luminance, and 278/353 are lighter than it (visual-quality §2). Remote: the glass interior changes 0.000 of its pixels when the page background is forced, because the stage covers it (runtime-remote §1) |
| Frame fill (primitive stories) | ≥ 3% of frame, with matrix stories ≥ 25% | GlassButton is 0.5% of frame; 88/353 desktop frames use under 6% (visual-quality §4) |
| Text contrast on rendered pixels | Every sampled text run ≥ 4.5:1 (3:1 large), worst case across the backdrop set | Remote: 266/342 fail on black, 20/342 on busy and 17/342 on the default stage. The 3.2 app shells are at 1.1–2.1:1 on their own stage (runtime-remote §1–2). Historical: 100% of quantum words and 56% of trophy words are below 4.5:1 (visual-quality §Ancillary) |
| Legible text exists | If the DOM has text, OCR word count is > 0 | Dark `worker-d-screens` variants have 0 legible words (visual-quality §Ancillary) |
| Glass density | Live backdrop-filter layers per viewport ≤ budget (P5/P16) | Remote: 12 on modal/dialog/drawer, 18–21 visible on app shells (29 total, depth 4), 51 on the state matrix (runtime-remote §5) |
| Neon / hue chaos | ≤ 1% neon pixels and ≤ 3 hue families per component | Historical 22–69% neon sets (visual-quality §Ancillary) |
| Intent distinguishability | ΔE(primary, secondary fill) above a set minimum | All `GlassBadge` variants render identically; `OptimizedGlass` intents differ only in glow and shadow (visual-quality §3; MATERIAL-ENGINE §4) |
| Mobile containment | No right-edge contact at 390px, measured with `overflow-x` clipping disabled | Remote: 0 horizontal overflow at 390px, but StorySurface's `overflowX: hidden` masks bleed by construction (runtime-remote §6; visual-quality §10) |
| No story-level overrides | 0 `!important` in stories and recipes | 24 in the flagship showcase (STORYBOOK-SHOWCASE-04); 75 in recipes (APPSHELL-WORKSPACE-RECIPES-CLI-04) |
| Pixel regression | Tracked baselines with per-target diffs | `visual-baselines/` is empty; Playwright snapshots are gitignored and darwin-only (QA-CERTIFICATION-03) |
| Preference modes | Each mode produces a measurable, art-directed change | `contrast: more` is a 0.0% pixel no-op on 12/12 stories. Forced colors leaves the showcase at 12/12 backdrop filters. Reduced motion stops CSS infinite animations, 4→0 (runtime-remote §3–5) |
| Cost | Backdrop layers per viewport ≤ budget; component perf grade ≥ C | No CI gate measures runtime cost. Remote: 12–23 fps on modal, dialog and app shells vs 60 fps on simple stories (runtime-remote §5) |

Human review stays mandatory for specular quality, optical hierarchy, radius rhythm and "reads as one hand". These can't be measured from pixels, and none of them has been eyeballed in this audit.

### 4.3 Failure modes to avoid (explicit)

| Failure mode | What it looks like | Seen in AuraGlass? |
|---|---|---|
| **Gray slab on a white void** | A translucent white rectangle over a near-white canvas, so the blur has nothing to work on | **Yes. The dominant 4.x failure** (visual-quality §Executive verdict). Remote: the stage hides the inverse failure, a near-transparent surface with fixed dark ink that becomes unreadable over dark content (runtime-remote §1) |
| **2020 glassmorphism / neon** | High saturate, rainbow `hue-rotate` glows, purple-pink gradients, infinite pulse | Historically yes (strict-mobile sets 22–69% neon; visual-quality §Ancillary). Motion still has `rainbow-glow` keyframes and 43 `repeat: Infinity` sites (motion §What exists; MOTION-08) |
| **Glass soup** | Every cell, chip and row is glass; hierarchy collapses; nested surfaces double-frost or go flat (Backdrop Root) | Yes, structurally. Nested glass is never suppressed (MATERIAL-ENGINE-06; PERFORMANCE-09). Remote: 29 backdrop-filter elements nested 4 deep on the 3.2 app shells and 51 visible on the state matrix (runtime-remote §5) |
| **Text over refraction / text over imagery without a floor** | Displacement or busy media under body copy | Not yet, because there is no refraction. P1/P2 must prevent it once the Lens tier ships |
| **Apple cosplay** | Blobby capsules, whole-surface distortion, chromatic fringing everywhere, elastic wobble with no legibility logic | Risk for 5.0. This is exactly what NN/g documented failing in iOS 26 |
| **Fake optics** | A shader refracting a synthetic gradient; props named `caustics`/`ior` that change nothing | Yes (MATERIAL-ENGINE-02, -05) |
| **Broken degradation** | Fallbacks miss the elements that actually carry glass, so reduced-transparency or forced-colors users keep the inline translucent recipe | Yes for `LiquidGlassMaterial` and inline `createGlassStyle` glass (MATERIAL-ENGINE-07, PARTIAL; ACCESSIBILITY-07). Verified in a browser for forced colors: `liquid-glass-material` keeps 1/1, the showcase 12/12 and glass-modal 10 of 12 backdrop filters (runtime-remote §4). The verifier corrected the unsupported-engine case: `glass.generated.css` forces `rgba(0,0,0,0.85) !important` on every `[class*="glass-"]` element, text and icons included. Those engines get an 85% black slab, not the faint gradient (MATERIAL-ENGINE-07, second pass). GlassPageTabs' CSS module handles both preferences itself. Reduced transparency was not run remotely |
| **Silent Lens failure** | Firefox renders nothing for `backdrop-filter: url()` and reportedly passes `@supports` ([R]) | Risk for 5.0 (web-glass-techniques §1.4) |
| **Unreadable dark mode** | Navigation OCRs to 0–3 words on dark; dark is never retested | Historically yes: dark `worker-d-screens` variants have 0 legible words (visual-quality §Ancillary). The dark theme was not run remotely. The closest proxy is light-tone glass over a black page, which fails 266/342 text samples (runtime-remote §1) |
| **Tiny primitive in a void** | A 109×55 button centered in 1440×900 | Yes (visual-quality §4) |
| **Meta copy** | "keeps the overlay from feeling like a blank page" / "Component-owned story coverage sample." | Yes, 61/356 desktop frames (visual-quality §7) |
| **Screenshot ≠ product** | Story CSS `!important` overrides and the opaque Storybook stage make the shot better than the shipped default | Yes. 24 `!important` in the flagship showcase (STORYBOOK-SHOWCASE-04). Story-only props on shipped components (-16, PARTIAL). The stage hides the contrast failure (runtime-remote §1) |
| **Many hands** | 22 blur literals, 4 radius scales, 19–20 saturate values | Yes (MATERIAL-ENGINE §2, §4) |
| **Jank and edge artifacts** | Animated blur radius, `transition: all` on backdrop surfaces, scroll color "pops" at blur edges, banding on large blurs with no grain | Yes for animated blur and `transition: all` (motion §What exists; MATERIAL-ENGINE-12; PERFORMANCE-15). Grain is applied in 4 components only (MATERIAL-ENGINE §2). Remote: modal, dialog and app shells drop to 12–23 fps (runtime-remote §5) |
| **Invisible focus** | Box-shadow focus rings that vanish in forced colors; rings under 3:1 seen through glass | Partly. `.glass-focus` is defined twice, once as an outline and once as `outline:none` plus a shadow ring. The focus color is a single hue (accessibility §Mediocre). `[aria-disabled]` removes the indicator entirely (ACCESSIBILITY-14). The target is a 2px two-tone `outline` meeting 2.4.13 AAA |
| **Restless UI** | Idle infinite shimmer, float and pulse pulling focus | Yes. 43 `repeat: Infinity` sites; the theme's `allowContinuous` flag is never read (MOTION-08). Remote: 4 infinite animations run on modal, dialog and app-shell stories (runtime-remote §5) |

### 4.4 What "benchmark" means for 5.0 (definition of done)

AuraGlass is the benchmark when all four of these hold:
1. Its Frost tier, in every engine, passes §4.2 over the full backdrop set and wins blind side-by-side review against shadcn-style opaque defaults and liquid-glass-react.
2. Its Lens tier is the best measured web refraction with no legibility regressions.
3. Its interaction layer is a recognized primitive base (Base UI first, React Aria where touch and drag-and-drop matter; competitors.md §5.1).
4. Every public claim is reproducible by a stranger from CI output.

None of these holds at 4.1.0.
