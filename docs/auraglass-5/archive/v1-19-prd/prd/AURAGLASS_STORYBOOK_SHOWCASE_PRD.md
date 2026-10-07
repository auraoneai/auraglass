# AuraGlass 5.0 PRD: Storybook, Material Lab and Showcase

| Field | Value |
|---|---|
| Key | **SB** (`PRD-SB`; shared contract registry `prd/_shared-contracts.md` SC-01). Task fragment `tasks/SB.json` (SB-001..SB-128). Anchor tasks other PRDs cite: SB-048 (`.storybook/preview.tsx`), SB-060 (Lab frame) (SC-40) |
| PRD id | Self-id **PRD-17** is an alias only (SC-01: it collides with §16 PRD-17, the 4.2/4.3 bridge, which is interim-owned by PRD-REL per SC-37). `AURAGLASS_5_TARGET_ARCHITECTURE.md` §16 places "the 8 scenes, Material Lab" inside **PRD-19 certification infra**. This document owns the Storybook/Lab half of that §16 PRD-19 row (see deviation 1; architecture erratum E-07). Dependency references below use **§16 numbering** unless written "this PRD"; the key crosswalk is in the next row |
| §16 → key crosswalk (SC-01) | PRD-00 TRUST · PRD-01 REL · PRD-02 PKG · PRD-03 DS · PRD-04 MAT · PRD-05 A11Y · PRD-06 MOT · PRD-07/14/16 FND · PRD-08 CTL · PRD-09 OVL · PRD-10 NAV · PRD-11 DATA · PRD-12 AI · PRD-13 MED · PRD-15 MAT (interim) · PRD-17 REL (interim) · PRD-18/20 DX · PRD-19 QA (certification infra; this PRD holds the Storybook/Lab half) · PRD-21 EXP (interim) · perf policy PERF. Task `depends_on` uses only task ids (SC-40); a "PRD-xx" string never appears there |
| Shared contracts applied | SC-09 (visual gate in QA `certify-pr.yml`; `visual-regression.yml` deleted by QA-119), SC-11 (scripts layout), SC-16 (lint rules are `auraglass/story-*` in `eslint-plugin-auraglass.js`), SC-21 (story-only attributes `data-ag-story-content`, `data-ag-story-kind`, `data-ag-cert-ready`, `data-ag-lab-override`, `data-ag-state-cell`), SC-23 (preference values `system`/`standard`, `glassOpacity`), SC-28 (scenes), SC-29 (lane names L1..L14), SC-30 (test layout `tests/<area>/`), SC-31 (this PRD owns preview, Lab harness, story contract, showcase files; component PRDs own component stories), SC-32 (registry blocks owned by DX), SC-40 (task-id dependencies) |
| Owner area | Storybook and showcase: `.storybook/**` (except the PRD-19 `certify` decorator mode, REQ-QA-11, added by QA-041 as a MODIFY of SB-048), `src/stories/**` (except `src/stories/blocks/**`, DX-097, and the area pages other PRDs add by their own tasks), the `*.stories.tsx` contract (component story **files** belong to the component's PRD, SC-31), story files under `src/components/showcase/**` and `src/components/templates/showcase/**` (component **source** deletion there is Component Remediation PRD RM-08, not this PRD), `examples/**`, the new `showcase/` tree (location, import/lint contract, fixtures harness, tags), `.github/workflows/deploy-storybook.yml` |
| Status | Draft |
| Baseline | `aura-glass` 4.1.0, HEAD `15b6de6f7`, Storybook 9.1.20 |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §1.3, §4.4–4.7, §7, §8, §11.2, §11.3, §12, §13.4, §15.1–15.4, §16; `docs/auraglass-5/autopsy/storybook-showcase.md` (STORYBOOK-SHOWCASE-01..16 with verification verdicts); `docs/auraglass-5/autopsy/runtime-remote.md` (§1, §2, §5); `docs/auraglass-5/autopsy/visual-quality.md`; `docs/auraglass-5/autopsy/qa-certification.md`; `docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md` (C14, TD-31); `docs/auraglass-5/AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md` (§3 item 8, §4.2 pixel gates); `docs/auraglass-5/research/translucent-a11y-perf.md`; `docs/auraglass-5/research/apple-liquid-glass.md`; `docs/auraglass-5/component-inventory.json` |
| Related decisions | D-04 (tiers), D-05 (enhanced opt-in), D-06 (variant union), D-07 (thickness), D-08 (content materials), D-09 (no production downgrade), D-11 (OS floors), D-12 (`clear` without backdrop → `regular`), D-14 (no `Glass` prefix), D-16 (labs), D-24 (layers, zero `!important`), D-25 (CSS motion), D-30 (no simulated AI), D-32 (evidence is CI artifacts) |
| Related PRDs (§16 numbering; keys per crosswalk) | PRD-04 material engine (`Surface`, `Environment`, CSS vars), PRD-05 a11y/preferences (`AuraGlassProvider`, `usePreference`), PRD-06 motion, PRD-07 foundation (`data-ag-part`), PRD-08..PRD-14 flagship and core PRDs (stories per flagship), PRD-13 media/backdrops (`./backdrops`, scene sampling), PRD-16 removal (story deletions), PRD-19 certification infra (pixel gates, scene capture lanes), PRD-20 docs, PRD-21 labs |

**Deviation notes (explicit).**

1. Boundary split with §16 PRD-19 (filed as `prd/AURAGLASS_QA_CERTIFICATION_PRD.md`). §16 gives PRD-19 "The 8 scenes, Material Lab, pixel gates, OCR, engine lanes…". **PRD-19 keeps the 8 scene assets and their manifest** (`certification/scenes/` + `scenes.manifest.json`, REQ-QA-10, ids `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`), the `certify:1` decorator mode (REQ-QA-11), the capture harness, pixel gates, OCR, L5 Behaviour / L9 Motion / L10 Performance lanes and artifact retention. This PRD **consumes** the scene manifest and owns: the Storybook `environment` global that reads it, the Lab harness (`.storybook/lab/**`), the `Material Lab` IA, the Component Lab contract, the certification scene stories, the application showcase tree and the Storybook deploy. **Material Lab story files** are authored by PRD-04 (`prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` §13, `src/material/stories/*.stories.tsx`, incl. `Material.Lab.stories.tsx`) using this PRD's harness; this is the deviation from §16 (which puts the Lab under PRD-19), adopted because PRD-19 itself defers Lab stories to PRD-04. The interface to PRD-19 is the story-tag and story-id contract in REQ-SB-05, REQ-SB-40 and REQ-SB-42; PRD-19 consumes it, it does not re-define it. This split is ratified by the shared contract registry (SC-31) and recorded as architecture erratum E-07 for the architecture owner.
2. Six vs ten showcases. §15.4 says "the six product surfaces". The program asks for ten application showcases. This PRD keeps **six certified product scenes** (tier S1, part of the §15.1 matrix and GA-blocking) and adds **four showcase scenes** (tier S2: music player, spatial control center, ecommerce, analytics) that are snapshot-gated at reduced matrix and are not GA-blocking. That keeps §15.1 matrix cost unchanged.
3. Autopsy correction. `storybook-showcase.md` §Outdated says `storybook-static/` is a "committed" build. `git ls-files storybook-static | wc -l` returns **0** at HEAD; it is gitignored (`.gitignore:87`) and is a **stale local build** (`storybook-static/index.json` mtime 2026-09-05, predating the 4.1.0 commit). The defect is real (tooling and the remote autopsy run read a prebuilt directory not tied to a SHA), but the fix is a freshness gate, not a `git rm`.
4. "Story-supplied glass" is used in this PRD as the name for any story that paints its own optics or overrides library material: inline `backdropFilter`/`backdrop-filter`, `!important`, a hand-rolled stage background behind a component, or a tone class that pins ink. Measured at HEAD: 27 story files contain 49 `backdropFilter`/`backdrop-filter` occurrences; 34 story files contain `!important` (`rg -l` / `rg -c` over `src -g '*.stories.tsx'`).
5. Product-scene composition. Sibling PRDs claim the content of individual product surfaces: the AI PRD (`AURAGLASS_AI_PRD.md`, "AI Workspace certification scene"), the Data PRD (`AURAGLASS_DATA_PRD.md` §13, "data product surface" composition), the App Shell PRD (`AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` S-01, `src/stories/app-shell/ProductShells.stories.tsx`) and the Media PRD (`AURAGLASS_MEDIA_BACKDROPS_PRD.md`, `src/media/MediaShowcase.stories.tsx` "Music Player over Album Art"). Reconciliation (SC-31, binding): this PRD owns the files under `showcase/<id>/` and the import, lint, determinism and tag contract (REQ-SB-22..26); the area PRDs supply compositions and fixtures into those files by MODIFY tasks that depend on this PRD's file-creating task. Showcase ids are exactly `ai-command-center`, `financial-dashboard`, `ops-console`, `media-workspace`, `collaborative-workspace`, `mobile-productivity`, `music-player`, `spatial-control-center`, `ecommerce`, `analytics`. Composition owners: PRD-AI → `ai-command-center` (AI-079, AI-080); PRD-DATA → `financial-dashboard`, `analytics` and the `ops-console` data (DATA-123); PRD-MED → `music-player`, `media-workspace` (MED-161); PRD-NAV → shell parts of `ops-console`, `collaborative-workspace`, `mobile-productivity` (NAV-144). App Shell PRD's `ProductShells`/`AppShell.stories.tsx` (NAV-101) are shell-only component stories under `Flagships/App Shell`, not S1 scenes. `src/stories/AppShell.stories.tsx` and `src/stories/AppChromeVisualBaseline.stories.tsx` are deleted by this PRD (SB-106; NAV-105 only verifies). Registry blocks are a separate artifact owned by PRD-DX (SC-32); a block may reuse a showcase composition but its source of truth is `registry/blocks/<id>/` (REQ-DX-53 authors blocks new).
6. Unit-test runner. The repo test runner is Jest 29 (`package.json:269,465`, `jest.config.js`); there is no Vitest. `*.test.ts(x)` in this PRD run under Jest; `*.test.mjs` run with `node --test`; only the Storybook browser project (REQ-SB-15) adds Vitest, as a devDependency. Test files follow SC-30: Jest and node tests live under `tests/storybook/` and `tests/showcase/`, lint-rule tests under `tests/lint/`; `jest.config.js` is PRD-QA's (QA-003), so adding these roots is a MODIFY that depends on QA-003.
7. Lint namespace (SC-16). The story anti-pattern rules are `auraglass/story-*` rules registered in the existing `eslint-plugin-auraglass.js` (plugin file owned by PRD-PKG, wired by PKG-015). There is no separate `eslint-plugin-aura-stories` package. This PRD owns the six `story-*` rules and their tests; every task that touches the plugin file is MODIFY.

No screenshot was viewed while writing this PRD. Visual statements are measured (remote runtime evidence, pixel statistics in the autopsy) or inferred from code.

---

## 1. Problem

Storybook is the only place a buyer, contributor or certification lane sees AuraGlass, and at 4.1.0 it hides the product.

- **Glass over nothing.** Every story is wrapped in an opaque near-white stage (`.storybook/StorySurface.tsx:88-96`, `glass-on-light`). 351/356 certification screenshots have mean luminance >200, 330/356 are effectively monochrome, 0 are dark (STORYBOOK-SHOWCASE-02, CONFIRMED). Forcing the page background changed **0.000** of the pixels inside the glass (runtime-remote §1). The "media" and "liquid" modes are grey gradients too. A material whose whole value is how it treats what is behind it is never shown with anything behind it.
- **The stage hides real defects.** With the stage removed, 266/342 sampled text runs fail WCAG on black (median 1.92:1); the two flagship 3.2 App Shell stories fail contrast on their own stage (runtime-remote §1–2).
- **Showcases misrepresent the package.** The flagship showcase overrides shipped material with 24 `!important` rules (STORYBOOK-SHOWCASE-04); the State Matrix imports zero library components (-05); 6 "App Shell" domain stories are one aliased story (-10); category galleries render text cards (-07, PARTIAL: `IconsGallery` renders icons).
- **The information architecture is inverted.** Speculative effects hold about 24% of stories (Deep Dream 27 stories) while Tabs, Sidebar, Header, Breadcrumb, Context Menu and Toolbar have 2 each (-14, PARTIAL). 128 titles are generated Default/Variants stubs (-06). Version-named groups `3.2`/`3.3` float unsorted (-15).
- **Certification cannot fail.** The decorator alone satisfies the pass checks, themes are mislabelled, and only one story per component is captured (-01, -03).
- **Tooling and delivery are unreliable.** `storybook-static/` is a stale untracked build that tooling treats as truth; the deploy workflow posts PR preview URLs that are never published and grants `contents: write` to every PR build (-12); 7 `play` functions exist across 1,598 stories, on a mix of deprecated and alpha test packages (-13); motion is forced to reduced for every story (-08, PARTIAL).

5.0 makes Storybook the Material Lab (§15.4): flagship-first, scene-first, built only from the public API, with stories that can fail.

## 2. Evidence from the current codebase

Verdicts are from the adversarial verification table in `autopsy/storybook-showcase.md`. PARTIAL findings are cited with their corrected scope; no REFUTED claim is used.

| # | Finding | Verdict | Evidence (path:line) | Consequence for this PRD |
|---|---|---|---|---|
| E1 | Opaque light stage wraps every story; backgrounds addon has no visible effect | STORYBOOK-SHOWCASE-02 CONFIRMED | `.storybook/StorySurface.tsx:13-56,88-96` (`glass-on-light`, `#ffffff → #f4f4f4 → #e9e9e9`); `.storybook/preview.tsx:116-136` (backgrounds), `:127-129` ("media" grey gradient); runtime-remote §1 (0.000 glass-pixel change) | REQ-SB-01..04: delete the stage, introduce `environment` global with 8 real scenes |
| E2 | Ink is pinned by declared tone class, not by backdrop | runtime-remote §1 | `src/styles/glass.css:78-100` (`.glass-on-light .glass` → black-90); `src/styles/premium-typography.css:113-118` (`[class*="glass-"] { color: … !important }`) | The Lab must never set a tone class; ink comes from PRD-04/PRD-05 resolution (REQ-SB-03) |
| E3 | Certification passes on decorator DOM alone; themes hard-coded; 1 story per component | -01, -03 CONFIRMED | `scripts/audit/storybook-visual-certification.mjs:171,256,296-310,344`; `.storybook/preview.tsx:185-197` (`ContrastGuard className="glass-contrast-guard"`) | REQ-SB-05: `[data-ag-story-content]` measurement root; REQ-SB-41: retire the script |
| E4 | Flagship showcase overrides shipped material with 24 `!important` | -04 CONFIRMED | `src/components/showcase/LiquidGlassShowcase.tsx:33-140` (`:45-56` `.liquid-glass-material`, `:68-71` backdrop-filter); test asserts one string `LiquidGlassShowcase.test.tsx:5-8` | Delete (§9); REQ-SB-30 lint |
| E5 | State Matrix imports zero library components | -05 CONFIRMED | `src/components/showcase/LiquidGlassStateMatrix.stories.tsx:1-2,89-99,102-117`; linked at `src/stories/CuratedComponentGuide.stories.tsx:120` | Delete; replaced by generated Component Lab state grid (REQ-SB-14) |
| E6 | 128 Default/Variants stub titles; 130–132 boilerplate descriptions; empty renders ("No items to display", "Step NaN of 0") | -06 CONFIRMED | `src/components/interactive/GlassCarousel.stories.tsx:13,31-48`; `src/components/data-display/GlassToast.stories.tsx:13` | REQ-SB-12/13: story contract; stub deletion |
| E7 | Category galleries render text cards; copy-pasted `styles` in 9 files; dead sidebar paths; "412" hard-coded | -07 PARTIAL (IconsGallery renders real icons) | `src/stories/ButtonGallery.stories.tsx:4-41`; `src/stories/ComponentGallery.stories.tsx:4-41,54`; `src/stories/IconsGallery.stories.tsx:3,100` | Delete text galleries; keep IconsGallery rebuilt as `Foundations/Icons` |
| E8 | Reduced motion hard-set in `initialSettings`; certification separately emulates `reduce` | -08 PARTIAL (most components read the OS query instead) | `.storybook/preview.tsx:168-174`; `src/hooks/useReducedMotion.tsx:20-40`; `storybook-visual-certification.mjs:233` | REQ-SB-07: motion follows OS; forced reduce only in CI snapshot cell |
| E9 | Stories advertise features they do not enable | -09 CONFIRMED | `src/components/button/GlassButton.stories.tsx:286-331,454-536` vs `src/components/button/GlassButton.tsx:264-288`; invalid default arg `'level2'` at `:59` vs options `:42` | REQ-SB-13: no claim copy; args must be valid against typed metadata |
| E10 | Six App Shell "domain" stories are aliases of one | -10 CONFIRMED | `src/stories/AppShell.stories.tsx:1-33` | Delete; S1 showcases replace (REQ-SB-20..26) |
| E11 | Start Here guide: non-clickable `<code>` links, 4 of 20 broken, stale "3.0 Release Scope", hard-coded 29/65 | -11 PARTIAL (20 links, 4 broken) | `src/stories/CuratedComponentGuide.stories.tsx:18-19,76-87,95-137,286-298` | REQ-SB-09: generated Start Here with validated `linkTo` |
| E12 | Deploy: PR comment URL never published; workflow-level `contents/issues/pull-requests: write` on PR runs; URL ignores `cname` | -12 CONFIRMED | `.github/workflows/deploy-storybook.yml:9-12,34-52` (`cname: storybook.aura-glass.auraone.com` at :40) | REQ-SB-50..54 |
| E13 | 7 `play` functions; deprecated `@storybook/jest ^0.2.3`, `@storybook/testing-library ^0.2.2`, alpha `@storybook/test 9.0.0-alpha.2` alongside `storybook 9.1.20`; 53 files import `@storybook/test` | -13 CONFIRMED | `package.json:326-328,433-437`; story files with `play:` (`GlassSelect.stories.tsx:71`, `GlassCombobox.stories.tsx:55,67`, …) | REQ-SB-15, REQ-SB-45 |
| E14 | Story budget inverted (Effects + Advanced 390/1,598 = 24.4% of stories) | -14 PARTIAL (corrected denominator) | `storybook-static/index.json`; `src/components/ai/GlassDeepDreamGlass.stories.tsx:250-760` | REQ-SB-08 IA; REQ-SB-11 per-title cap |
| E15 | Version-named groups and 6 cross-group duplicates, 5 lowercase titles | -15 CONFIRMED | `src/stories/AppShell.stories.tsx:5`, `AuraGlassIcons.stories.tsx:5`, `ProductionWorkflowComponents.stories.tsx:22`, `AuraGlass33MarketingLaunch.stories.tsx:218`, `AuraGlass33ThemeShowcase.stories.tsx:243`, `AppChromeVisualBaseline.stories.tsx:237`; `preview.tsx:137-154` (`storySort`) | REQ-SB-10 title lint |
| E16 | Story-only props in shipped components | -16 PARTIAL (`forceVisible` is a defensible controlled prop; `previewUsers` bypasses context) | `src/components/collaboration/GlassCollaborativeCursor.tsx:14,66`; `src/components/cookie-consent/CookieConsent.tsx:91-119` | REQ-SB-16: stories use providers/decorators; `GlassCollaborativeCursor` itself is deleted with `src/components/collaboration/**` (Component Remediation PRD RM-04), so no 5.0 story can use `previewUsers` |
| E17 | Backend SDK externals and a `process.env` shim in Storybook config | storybook-showcase §Outdated | `.storybook/main.ts:35-67` (`openai`, `redis`, `bcryptjs`, `jsonwebtoken`, `@pinecone-database/pinecone`, `@google-cloud/vision`) | REQ-SB-46: removed once PRD-16 cuts import edges |
| E18 | `storybook-static/` is untracked, gitignored and stale, yet read by tooling | deviation 3 | `.gitignore:87`; `git ls-files storybook-static` = 0; `index.json` mtime 2026-09-05; actual readers (serve it): `scripts/visual-test-runner.js:109` (`npx http-server storybook-static`), `.github/workflows/visual-regression.yml:36` (`npx serve -s storybook-static`), the remote autopsy runner (runtime-remote "Runs"). `scripts/ci/forbidden-check.js:20`, `scripts/ci/verify-no-core-ui-deps.js:31`, `scripts/ci/stale-3-3-scan.js:15` only list it as an **ignored** directory and do not read it | REQ-SB-55..57 freshness gate |
| E19 | Story-supplied glass | measured at HEAD | 27 `*.stories.tsx` files / 49 `backdropFilter`/`backdrop-filter` occurrences; 34 files with `!important`; 948 inline hex and 275 inline gradients in stories (autopsy counts) | REQ-SB-30..33 lint `auraglass/story-*` |
| E20 | Templates worth keeping | storybook-showcase §Excellent | `.storybook/preview.tsx:157-205` (provider decorator), `src/components/navigation/GlassSidebar.stories.tsx:38-58`, `src/components/media/LiquidGlassPhotoInspector.stories.tsx:21-22`, `src/stories/AppChromeVisualBaseline.stories.tsx:167-168` | Decorator skeleton kept; AppChromeVisualBaseline is the seed of showcase S1-3 (ops console) |
| E21 | Remote perf: modal/dialog/app-shell stories run 4 infinite animations under 12–29 backdrop filters and fall to 12–23 fps | runtime-remote §5 | `docs/auraglass-5/autopsy/remote-evidence/metrics.json` | §16 per-scene budgets |
| E22 | Gap analysis item 8: "the showcase inverts priorities" | gap analysis §3 | `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md:124-140` | IA puts primitives large and first (§15.4) |

## 3. Desired end state

At 5.0 GA, `storybook.aura-glass.auraone.com` is built from the release SHA and shows:

1. **Flagship-first IA.** Sidebar order: `Start Here` → `Material Lab` → `Scenes` → `Showcases` → `Flagships` (44, grouped Controls / Overlays / App Shell / Data / AI / Media, §11.2 order) → `Core` (T2, ~40) → `Foundations` (tokens, icons, motion, preferences) → `Migration` (4.x → 5.0 before/after). No version-named groups, no `Effects + Advanced`, no `Legacy`, no `Reference/Category Galleries`. Labs components are not in this Storybook (D-16; they live in the `@auraglass/labs` Storybook owned by PRD-21).
2. **Every surface is seen over a real scene.** A toolbar `environment` global offers the 8 §15.1 scenes from PRD-19's `certification/scenes/scenes.manifest.json` (`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`). The default is `photo`, not white. `StorySurface` and its grey stage are gone. Scenes are licensed, bundled, deterministic assets owned by PRD-19 (REQ-QA-10).
3. **Material Lab.** One page per material (`regular`, `clear`, `identity`, `content-raised`, `content-sunken`) and per tier (`lightweight`, `standard`, `enhanced`) with live controls for blur, transparency, refraction, tint, thickness, lighting, noise (grain) and motion, a live contrast read-out (worst-case ink ratio over the sampled backdrop) and an "export MaterialSpec patch" button. Large T0 primitives first (`Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`).
4. **Component Lab.** Every flagship and core component has one canonical page with a fixed, generated story contract: Playground, States grid, Variants × thickness matrix, Scenes strip (8 scenes), In-context fragment (gradient, photography, colorful UI, dense dashboard), Light/Dark, Preferences (contrast more, forced colors, reduced transparency, reduced motion), RTL, Mobile (390). Matrices are generated from typed variant metadata (§11.3), never hand-written.
5. **8 certification scenes** exist as stories under `Scenes/*` tagged `cert-scene`, consumed by PRD-19's pixel gates.
6. **Ten application showcases** built only from public `aura-glass` entry points with product-realistic copy: six certified product scenes (S1) and four showcase scenes (S2). No `!important`, no inline optics, no story-only props, no tone classes.
7. **Stories can fail.** Each story renders its subject inside `[data-ag-story-content]`; every flagship has a `Keyboard` story that is the subject of its PRD-05 APG script (`tests/a11y/apg/<kebab-component>.apg.spec.ts`, owned by the component's PRD per SC-30, run by PRD-19 L5 Behaviour in three engines); axe runs in-browser with colour contrast on; PRD-19 gates measure inside the story root, not the decorator.
8. **Fresh, scoped delivery.** The deployed Storybook and every tool that reads a build use a `storybook-static/` produced in the same job from the same SHA, stamped with a manifest. PR previews are real or not advertised. Deploy permissions are job-scoped.

## 4. Architecture

### 4.1 Layers

```text
.storybook/
  main.ts                    framework @storybook/react-vite; stories globs; addons; no backend externals
  preview.tsx                globals (environment, scheme, transparency, glassOpacity, contrast, motion, tier, density, dir, viewport)
                             → one decorator: <AuraGlassProvider> + <StoryEnvironment> + <StoryRoot>
                             (SB-048 owns the file; other PRDs register globals/decorators by MODIFY tasks
                             that depend on SB-048, e.g. QA-041 certify, MOT-091 motion, AI-074 clock, DS-095, NAV-103)
  environment/               StoryEnvironment.tsx, scenes.ts (typed loader over PRD-19's
                             certification/scenes/scenes.manifest.json; assets served via main.ts staticDirs)
  lab/                       LabControls.tsx, ContrastReadout.tsx, spec-export.ts, MaterialLabFrame.tsx (harness
                             used by PRD-04's src/material/stories/*; the ONLY place allowed to write private
                             --_ag-* overrides; lint-allowlisted)
  contract/                  defineComponentStories.tsx (story-contract generator), StatesGrid.tsx,
                             MatrixGrid.tsx, ScenesStrip.tsx, metadata.ts (reads FND <Component>.meta.ts, SC-27)
scripts/storybook/           write-build-manifest.mjs (SHA stamp), verify-fresh.mjs, lint-*.mjs, gates (SC-11)
src/stories/                 Start Here (generated), Scenes, Foundations, Migration
src/**/<Component>.stories.tsx   one file per flagship/core component, authored by the component's PRD with
                             defineComponentStories() (SC-31); this PRD owns the contract and its tests
showcase/                    NEW: application showcases (S1, S2) + scene fragments, public-API imports only
  <id>/<Name>.showcase.tsx, <id>/<Name>.stories.tsx, <id>/data.ts (fixtures), <id>/copy.ts
tests/storybook/, tests/showcase/, tests/lint/story-rules/*.test.ts   Jest + node --test suites (SC-30)
```

### 4.2 Globals and how they map to the library

The decorator does not style components. It only sets the library's own contract attributes (§4.5) through `AuraGlassProvider` (PRD-05) and wraps the story in `Environment` (PRD-04).

| Global | Values | Maps to | Default (interactive) | CI capture |
|---|---|---|---|---|
| `environment` | `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame` (ids exactly as REQ-QA-10) | `<Environment backdrop={scene.backdrop} image={scene.src} video={scene.video}>`; `data-ag-backdrop` | `photo` | every value |
| `scheme` | `light`, `dark` | `data-ag-scheme` via provider | OS | both |
| `transparency` | `system`, `glass`, `tinted`, `solid` (the §7.4 provider union, SC-23) | provider `transparency` (OS floor still applies, D-11) | `system` | `glass`, `tinted`, `solid` |
| `glassOpacity` | `0`, `0.5`, `1` (SC-23 `glassOpacity: 0..1`) | provider `glassOpacity` → `--ag-glass-opacity` | provider default | `0.5` only (Lab `Preferences` page sweeps all three) |
| `contrast` | `system`, `standard`, `more` (SC-23) | provider `contrast` + Playwright `contrast: 'more'` emulation in CI | `system` | `standard`, `more` |
| `forcedColors` | `off`, `active` | CI emulation only (`forcedColors: 'active'`); interactive toggle shows a note | `off` | both |
| `motion` | `system`, `full`, `calm`, `none` (SC-23 provider union; resolved `full|calm|none`, MOT semantics) | `data-ag-motion` via provider; `system` = provider default, which follows `prefers-reduced-motion` (reduce ⇒ at most `calm`, §8) and sets no attribute from the decorator (MOT-091) | `system` | `none` + emulated `reducedMotion: 'reduce'` (snapshot), `full` (PRD-19 L9 Motion, REQ-QA-21) |
| `tier` | `auto`, `lightweight`, `standard`, `enhanced` | `data-ag-tier` on the story subtree; `auto` = `AuraGlassScript` result | `auto` | forced explicitly (§15.1) |
| `density` | `comfortable`, `compact` | `data-ag-density` | `comfortable` | both on Component Lab matrix only |
| `dir` | `ltr`, `rtl` | `dir` on story root | `ltr` | `rtl` on Component Lab `RTL` story |
| `certify` | `0`, `1` | PRD-QA's certify branch (REQ-QA-11), added to `preview.tsx` by QA-041 as a MODIFY of SB-048; this PRD does not define its behaviour | `0` | `1` |

Scene loader (`.storybook/environment/scenes.ts`, NEW) reads PRD-19's `certification/scenes/scenes.manifest.json` (REQ-QA-10: sha256, licence, source, ≥2880×1800, mean luminance, luminance stddev) and adds only Storybook presentation fields kept in `.storybook/environment/scene-presentation.json` (NEW): `{ id, label, backdrop: 'light'|'dark'|'media', focal: {x, y} }`. It never copies or re-encodes assets; `.storybook/main.ts` mounts `certification/scenes` through `staticDirs` at `/scenes`. `video-frame` uses the still frame for every capture; the 2 s `video-frame.webm` loop plays only in the interactive view and PRD-19 L9 Motion. Asset ownership: PRD-19 bundles and licenses them; PRD-13 (Media) library `./backdrops` presets may reuse them but must not import from `.storybook/` or `certification/`. Scene location is fixed by SC-28 (owner PRD-QA, QA-038/039): `certification/scenes/` + `scenes.manifest.json`, mounted at `/scenes`, story ids `scenes--<id>`. The Media PRD's `.storybook/assets/scenes/**` (REQ-MED-77) is superseded by SC-28; PRD-MED must retarget (open item O-SB-03, §21).

### 4.3 Story root contract

`StoryRoot` (NEW, `.storybook/contract/StoryRoot.tsx`) renders `<div data-ag-story-content data-ag-story-kind={kind}>` around the story output. Rules: the decorator renders **no** `.glass*` class, no `ContrastGuard` main and no skip links inside `#storybook-root` (the 4.x `preview.tsx:185-197` wrapper is deleted); a11y landmarks that a showcase needs are rendered by the showcase. PRD-19 measures only inside `[data-ag-story-content]` (fixes STORYBOOK-SHOWCASE-01). `StoryRoot` sets `data-ag-cert-ready="true"` on that element when the subject is ready (REQ-SB-43); in `certify=1` mode QA-041 mirrors it to `body[data-ag-cert-ready]`, which QA-056 waits on. All five story-only attributes (`data-ag-story-content`, `data-ag-story-kind`, `data-ag-cert-ready`, `data-ag-lab-override`, `data-ag-state-cell`) are registered in SC-21 and must never appear in `dist/`.

### 4.4 Story tags (Storybook 9 `tags`)

| Tag | Meaning | Who consumes |
|---|---|---|
| `flagship` / `core` / `foundation` | tier of subject (from inventory `tier` after PRD-16) | sidebar, coverage gate |
| `lab` | Material Lab page | PRD-19 L6 Environment visual (material matrix) |
| `cert-scene` | one of 8 certification scenes | PRD-19 L6 Environment visual (`certify / cert-scene` job, QA-032) and L7 Pixel regression |
| `showcase-s1` / `showcase-s2` | product scene / showcase scene | PRD-19 L6 Environment visual full-scene cells (S1 full matrix; S2 reduced) |
| `matrix` | generated matrix story (excluded from autodocs) | PRD-19 L7 Pixel regression baselines |
| `interaction` | has `play` | `@storybook/addon-vitest` browser project (`storybook-tests.yml`) |
| `apg` | flagship `Keyboard` story targeted by `tests/a11y/apg/<kebab-component>.apg.spec.ts` (SC-30; spec owned by the component's PRD, harness A11Y-073) | PRD-19 L5 Behaviour (REQ-QA-18, QA-082) |
| `!autodocs`, `!dev` | Storybook built-ins | — |

### 4.5 Material Lab control model

Discrete axes (`variant`, `thickness`, `layer`, `content`, `shape`, `tier`, `transparency`, `interactive`, `prominent`, `refraction`) are passed as **public props** to `Surface` (§4.2). Continuous controls split in two:

- **Public knobs** (`--ag-light-angle` 0–360deg, `--ag-specular` 0–1, `--ag-glass-opacity` 0–1): set on the Lab subtree with `style`, which is the documented consumer path.
- **Spec knobs** (blur per thickness 0–32px, saturation 1.0–2.0, brightness 0.9–1.2, tint alpha floor 0–1, grain opacity 0–0.06, refraction bezel 8–32px and scale 0–1, rim width 0.5–2px): written only by `LabControls` as private `--_ag-*` overrides on `[data-ag-lab-override]`. Names are imported from the TS constants that PRD-04's compiler emits (`aura-glass/material` build output, §4.3 "the TS constants for docs and tests"), never typed by hand. When any spec knob differs from the compiled default the Lab shows a "Spec deviation — not shipped" badge and `spec-export.ts` produces a DTCG `glass-material` JSON patch for `defineMaterial()`. Deviation: this is the only sanctioned use of private variables outside `src/material`; it is confined to `.storybook/lab/**` by lint (REQ-SB-31).
- **Motion knobs**: entrance replay, hover/press simulation, `pointerLight` on/off (D-04, PRD-06), duration token select (`--ag-duration-*`). Never animates blur radius (§4.7).
- **Contrast read-out**: `ContrastReadout` samples the rendered backdrop under the subject via a canvas readback of the scene asset at the subject rect (owned pixels, no screen capture), composites the resolved `--ag-surface-fill`, and reports worst-case ratio for `--ag-on-surface` and `--ag-on-surface-muted` against 4.5:1 / 3:1 (§7.3). It labels itself "estimate"; the gate of record is PRD-19 OCR. It is Storybook-only and is **not** a reintroduction of the runtime contrast theatre §7.3 deletes: it imports none of `ContrastGuard`, `useAutoTextContrast`, `validate*Contrast`, `sampleBackdropLuminance`; its WCAG math is the kept `src/theme/color.ts` (consumed via the public export PRD-03 designates) or a local copy tested against it; it never writes to the subject (REQ-SB-21 keeps it out of `dist/`).

### 4.6 Showcase architecture

Each showcase is a plain React tree under `showcase/<name>/` that imports only from `aura-glass`, `aura-glass/<subpath>` public entries (§3.2) and fixture modules in its own folder. Enforced by an ESLint `no-restricted-imports` pattern (`aura-glass/src/**`, `@/**`, `../../src/**`, `.storybook/**` banned) plus a resolve check in `scripts/storybook/verify-showcase-imports.mjs` (NEW) that runs against the **packed tarball** (`npm pack` output installed into a temp workspace), proving the showcase builds with consumer resolution. Each showcase exports one full-page story (`layout: 'fullscreen'`) and 2–4 fragment stories (the regions PRD-19 crops for gates).

## 5. Exact implementation requirements

### 5.A Environment, decorator and globals

- **REQ-SB-01** Delete `.storybook/StorySurface.tsx` and every `previewSurface` parameter (235 story files opt in today, 237 occurrences). `preview.tsx` registers exactly the globals in §4.2 with the listed values and defaults; `parameters.backgrounds` is set to `{ disable: true }`. Test: `storybook-config.test.ts` asserts the `globalTypes` keys, values and defaults, and `rg -l "previewSurface|StorySurface" src .storybook` returns 0.
- **REQ-SB-02** `StoryEnvironment` renders the selected scene through the public `Environment` component (`aura-glass/material`) with `backdrop`, `image`/`video` from the scene manifest. It sets no `background`, `color`, `.glass*` class or tone class on any ancestor of the subject. Test: `StoryEnvironment.test.tsx` renders each of 8 scenes and asserts the subject's ancestor chain contains no `class` matching `/glass-on-|glass-contrast|tone-/` and no inline `background`/`color` except on the `Environment` element itself.
- **REQ-SB-03** Ink is never forced by Storybook: no story or decorator sets `--ag-on-surface`, `--glass-text-*` or `color` on library components. Lint `auraglass/story-no-ink-override` (REQ-SB-30) enforces it.
- **REQ-SB-04** Scene consumption: Storybook uses exactly the 8 assets in PRD-19's `certification/scenes/` (REQ-QA-10); it adds no scene asset of its own and does not re-encode them. Because the default-view acceptance criteria (AC-SB-02/03) depend on scene content, this PRD asserts these bands on the consumed manifest and files a PRD-19 defect if one fails (it does not swap assets itself): `flat-white` mean ≥245, `flat-black` mean ≤12, `dark-media` mean ≤70, `video-frame` still mean ≤100, `photo` and `saturated-abstract` stddev ≥40, `saturated-abstract` Hasler–Süsstrunk colourfulness ≥60, `hf-pattern` ≥30% of 8×8 blocks with ≥40-level range, `dense-text` ≥400 OCR-readable words; every manifest `sha256` matches the file served at `/scenes/<file>` in the built Storybook. Test: `tests/storybook/scene-bands.test.mjs` (NEW, `node --test`, remote CI).
- **REQ-SB-05** `StoryRoot` wraps story output in exactly one `[data-ag-story-content]` element carrying `data-ag-story-kind` ∈ {`lab`,`component`,`matrix`,`scene`,`showcase`}. The decorator renders nothing else inside `#storybook-root` that paints pixels. Test: `StoryRoot.test.tsx` and the PRD-19 harness assertion "pixels outside `[data-ag-story-content]` equal the scene" (diff ≤0.5% of frame).
- **REQ-SB-06** One provider stack: `AuraGlassProvider` (PRD-05) only. The 4.x `AccessibilityProvider`, `AnimationProvider`, `ThemeProvider` and persona toolbar (`preview.tsx:61-88,157-205`) are removed once PRD-05 ships the provider. Tasks: SB-048 rewrites `preview.tsx` with an interim provider slot so the SB-048 anchor does not wait on PRD-A11Y (A11Y-019 depends on QA-031, which reaches SB-048 through QA-008 → SB-055); SB-128 swaps in `AuraGlassProvider` (A11Y-029). Test: `storybook-config.test.ts` asserts `decorators.length === 1`.
- **REQ-SB-07** Motion follows the OS by default (`motion: 'system'`, SC-23). `reducedMotion: true` in `initialSettings` (`preview.tsx:168-174`) is deleted. The CI snapshot run passes `globals=motion:none` with Playwright `reducedMotion: 'reduce'`; PRD-19 L9 Motion passes `motion:full`. The motion global's toolbar entry is added by MOT-091 (MODIFY of SB-048). Test: `storybook-config.test.ts` asserts default `system` and that no decorator sets `data-ag-motion` when the global is `system`; the "entrance actually animates" proof is PRD-19 REQ-QA-21 (≥3 distinct frames in a 12-frame strip) run on the `Flagships/Overlays/Dialog` `Playground` story opened via `defaultOpen` (Button has no entrance).

### 5.B Information architecture and Component Lab

- **REQ-SB-08** `storySort.order` is exactly `['Start Here','Material Lab','Scenes','Showcases','Flagships',['Controls','Overlays','App Shell','Data','AI','Media'],'Core','Foundations','Migration']`. Within `Flagships/*` stories follow §11.2 numbering. Test: `storybook-index.test.mjs` builds `index.json` and asserts every title's first segment is in that list and flagship order matches §11.2.
- **REQ-SB-09** `Start Here` is generated at build time from `index.json` and the inventory: counts (flagships, core, stories, interaction stories) are computed, every link uses `linkTo` / `?path=` and is validated against the index; a broken link fails the build. No literal version string other than the one read from `package.json`. Test: `start-here.test.mjs` asserts 0 unresolved links and 0 numeric literals in `src/stories/StartHere.stories.tsx` other than layout values.
- **REQ-SB-10** Title lint (`scripts/storybook/lint-titles.mjs`, NEW): no title segment matches `/^\d+\.\d+/`; no lowercase-initial leaf; no `Glass` prefix in leaf names (D-14); one title per component export (0 cross-group duplicates); title leaf equals the 5.0 export name. Fails CI.
- **REQ-SB-11** Story budget: each component title has ≤12 non-matrix stories; Flagships ≥ the contract set in REQ-SB-12; no title outside `Flagships`/`Showcases`/`Material Lab` has more stories than the smallest flagship title. Test: `storybook-index.test.mjs`.
- **REQ-SB-12** Ownership (SC-31): this PRD owns `defineComponentStories`, the export set below, the tags and the contract tests; it creates **no** component story file. Each `src/**/<Name>.stories.tsx` is authored by the component's PRD (for example CTL-059 Button, OVL-055 Dialog, NAV-101 App Shell, DATA-043 Table, AI-076 Thread, MED-101 MediaControls, FND-069/099 core) and depends on SB-071. Every flagship and core component's story file is produced with `defineComponentStories(meta, { metadata, fixtures, contexts })` and exposes at least these named exports (additional owner stories such as Table `ResizeAndPin` are allowed within the REQ-SB-11 cap and use the same tags and root contract): `Playground`, `States`, `Matrix`, `Scenes`, `InContext`, `LightDark`, `Preferences`, `RTL`, `Mobile`; flagships additionally export `Keyboard` (tagged `apg`, `parameters.a11y.apgScript` = path of its PRD-05 APG spec). `States` renders rest, disabled, loading, invalid, selected/checked/open as applicable through public props (`disabled`, `loading`, `invalid`, `checked`/`value`, `defaultOpen`), which produce the component's own `data-state`/Base UI attributes. Hover, pressed and focus-visible cannot be forced by props without pseudo-class simulation CSS (banned), so those cells render the rest state with `data-ag-state-cell="hover"|"pressed"|"focus-visible"` and PRD-19 produces them by real input (`locator.hover()`, `mouse.down()`, keyboard `Tab`) at capture. `Matrix` is generated from typed variant metadata (FND `<Component>.meta.ts`, SC-27; prop axes per SC-24: `variant` = `regular|clear|identity`, `thickness`, `prominent`, `intent` where supported; no `material` prop): variant × thickness × (interactive, prominent) where the component supports them. `InContext` renders the component inside four fragments from `.storybook/contract/InContextFragments.tsx`: gradient (`saturated-abstract`), photography (`photo`), colorful UI (a control-grid fragment), dense dashboard (a KPI-row fragment), each in light and dark. The fragments are built from T0 `Surface`/`SurfaceGroup` plus the subject only, so they exist before any showcase lands (showcases may not import `.storybook/**`, REQ-SB-23). Test: `story-contract.test.ts` iterates all files tagged `flagship`/`core` and asserts the required export set is present, that `Matrix` cell count equals the metadata product, and that every `data-ag-state-cell` value is one of the three real-input states.
- **REQ-SB-13** Story content rules: every `args` value is valid against the component's typed props (TS `satisfies Meta<typeof X>` + `StoryObj` with no `as any`); visible copy contains none of the banned strings `glass morphism`, `Lorem`, `Sample `, `This is a`, `Click Me`, `consciousness`, `quantum`, `predictive`, `eye tracking`, `Default` (as rendered text); no story claims a feature in copy that its args do not enable. Test: `scripts/storybook/lint-story-copy.mjs` (reads rendered text from the built index via jsdom render of each story) and `tsc -p tsconfig.storybook.json` with `noImplicitAny`; `rg -c "as any|: any" -g '*.stories.tsx'` = 0.
- **REQ-SB-14** The 128 Default/Variants stub titles and the 12 text-only `src/stories/*Gallery*.stories.tsx` files are deleted (`IconsGallery.stories.tsx`, which renders real icons, is rebuilt as `Foundations/Icons`); components that survive PRD-16 get a contract file per REQ-SB-12 from their owning PRD; components REMOVE'd by PRD-16 lose their stories in the same PR as their source (PRD-FND RM squash PRs FND-118..127). Test: `storybook-index.test.mjs` asserts 0 titles whose story set is exactly {Default, Variants}.
- **REQ-SB-15** Interaction tests use only `storybook/test` (SB9). Keyboard behaviour is **not** gated by Storybook `play` (REQ-QA-18: the mechanism is PRD-05's Playwright harness `tests/a11y/apg/harness.ts` (A11Y-073) + `tests/a11y/apg/<kebab-component>.apg.spec.ts`, each spec owned by the component's PRD (SC-30), run by L5 Behaviour (QA-082) in three engines). This PRD's obligation is that each of the 44 flagship `Keyboard` stories exists, is tagged `apg`, and its story id equals `ApgScript.story` in the matching spec (checked by `story-contract.test.ts` reading the spec files; missing spec = fail). `play` functions are used for Storybook-side smoke flows only: each S1 showcase has ≥1 `play` (6 total) covering its primary task (e.g. S1-1 send → tool call approval; S1-6 Sheet detent change), plus `MaterialLab` control round-trips. Runner: `@storybook/addon-vitest` in browser mode, executed remotely (§1 policy) in `storybook-tests.yml` (NEW).
- **REQ-SB-16** No story-only props: stories pass state through public props, providers or MSW handlers. `previewUsers` (`GlassCollaborativeCursor.tsx:14,66`) is not used by any 5.0 story; `forceVisible` may be used only where it is a documented controlled prop of the 5.0 component. Test: `rg -n "previewUsers" src showcase .storybook -g '*.stories.tsx' -g '*.showcase.tsx'` = 0 (the component itself is deleted by Component Remediation PRD RM-04, FND-121).
- **REQ-SB-17** Docs pages: each flagship has an MDX page `Flagships/<Group>/<Name>/Docs`, authored by this PRD at `src/stories/flagships/<group>/<Name>.mdx` (not colocated with the component's story file) using `.storybook/contract/docs-blocks.tsx`, with sections Usage, Anatomy (`data-ag-part` table generated from metadata), Material role (§11.2 column), Do/Don't (2 pairs, rendered live over scenes), Keyboard (generated from the APG script), Migration from 4.x (generated from the repo-root `deprecations.json`, SC-02: owner PRD-REL, schema REL-010, seeded by TRUST-075, read through REL-070/REL-117 output). Test: `docs-pages.test.mjs` asserts 44 MDX pages each with the 6 headings.

### 5.C Material Lab

- **REQ-SB-18** Story files are authored by PRD-04 under `src/material/stories/` (deviation 1, SC-31: MAT-086 first six stories, MAT-088 remaining six, both on SB-060) on this PRD's `.storybook/lab/**` harness; this PRD owns the titles and order and tests them (SB-068). `Material Lab` contains, in this order: `Overview` (all five materials side by side, 3 thicknesses, over the selected scene, subjects ≥360×240 px at 1440), `Regular`, `Clear`, `Identity`, `Content Raised`, `Content Sunken`, `Tiers` (lightweight / standard / enhanced side by side; enhanced shows an "inert on this engine" label when `data-ag-engine` ≠ chromium), `Nesting & Groups` (`SurfaceGroup` one-backdrop demo, nested collapse, `allowNested` warning), `Shape & Concentricity` (`ConcentricFrame`, capsule, concentric radii read-out of `--ag-radius-inner`), `Scroll Edge` (soft/hard over `dense-text`), `Preferences` (glass/tinted/solid × contrast more × forced colors), `Motion` (entrance, hover/press, pointer light, View Transition optics drop). Test: `storybook-index.test.mjs` asserts these 12 stories exist in order under `Material Lab`.
- **REQ-SB-19** Live controls on each material page: blur (0–32 px, step 1, per thickness), transparency (`glass`/`tinted`/`solid` + `--ag-glass-opacity` 0–1), refraction (`refraction` on/off; bezel 8–32 px; scale 0–1; Chromium only), tint (alpha floor 0–1; scheme light/dark/media), thickness (`thin`/`regular`/`thick`), lighting (`--ag-light-angle` 0–360°, `--ag-specular` 0–1), noise (grain opacity 0–0.06), motion (replay entrance, duration token, `pointerLight`). Control-to-mechanism mapping is exactly §4.5. A "Reset to shipped" button restores compiled defaults; "Export MaterialSpec patch" downloads JSON validating against PRD-03's DTCG `glass-material` schema. Test: `MaterialLab.test.tsx` asserts each control writes only the documented variable/prop, that reset removes every `--_ag-*` inline property, and that the export validates against the schema.
- **REQ-SB-20** Contrast read-out shows worst-case ratio for primary and muted ink under the subject, the threshold (4.5:1 / 3:1; 7:1 under `contrast: more`), and pass/fail. It updates within 1 animation frame after a control change settles (≤100 ms debounce). Test: `ContrastReadout.test.ts` with fixture pixel arrays asserts ratios within ±0.05 of a reference WCAG implementation.
- **REQ-SB-21** The Lab never ships: nothing under `.storybook/lab/**` is importable from `src/**` or `showcase/**` (lint) and no Lab code appears in `dist/` (PRD-PKG tarball-contents test PKG-068 over the TRUST-002 `scripts/ci/lib/npm-pack.js` helper; this PRD adds a TEST that asserts `.storybook/` and the SC-21 story-only attributes are absent from the packed file list and from `dist/**`).

### 5.D Application showcases (public API only)

- **REQ-SB-22** Ten showcases exist under `showcase/`, each with a full-page story and the listed fragments, the listed flagships unmodified, the listed default scene, and product-realistic copy from `copy.ts`:

| ID | Showcase | Tier | Default scene | Flagships/core that must appear (5.0 names) | Fragments (crop stories) |
|---|---|---|---|---|---|
| S1-1 | AI command center | S1 | `dark-media` | AppShell, Sidebar, TopBar, Thread, Message (+StreamingText), Composer, ToolCall (+Reasoning, AgentSteps; all 5 states), SourceList/Citation, CommandPalette, Toast, Button (approve/deny on `needs-approval`), IconButton (stop/regenerate) | Thread, Composer, ToolCall stack |
| S1-2 | Financial dashboard | S1 | `flat-white` | AppShell, TopBar, StatCard ×4, Sparkline, ChartFrame, Table (sort, select, sticky header, 10,000 virtualized rows), FilterBar, DateRangePicker, SegmentedControl, Tabs, Select (currency), Pagination (statement list) | KPI row, Table header + 20 rows |
| S1-3 | Ops console | S1 | `flat-black` | AppShell, Sidebar (rail), TopBar, Table (`grid` mode), Timeline/ActivityFeed, TreeView, ResizablePanels, Menu, Tooltip, AlertDialog, Toast | Incident table, Tree + panel split |
| S1-4 | Media workspace | S1 | `video-frame` | MediaControls, NowPlayingBar, ImageViewer chrome, CarouselRail, Toolbar, Slider, Popover, Sheet | Clear-over-media controls (the canonical `clear` demonstration), Inspector sheet |
| S1-5 | Collaborative workspace | S1 | `saturated-abstract` | AppShell, Tabs, ResizablePanels, Thread, Message, Menu/ContextMenu, Popover, Combobox (multi, chips), Breadcrumbs, Dialog (share settings), Avatar (core) | Document + comments split, Share popover |
| S1-6 | Mobile productivity (390×844) | S1 | `photo` | AppShell `MobileShell`, TabBar (+bottom accessory), Sheet (detents), SearchField, Switch, Checkbox, TextField, RadioGroup and NumberField (settings sheet), Toast, SourceTransition, `GlassPreferencesPanel` (core) | Tab bar + accessory, Sheet at 3 detents |
| S2-1 | Music player | S2 | `photo` (album art) | NowPlayingBar, MediaControls, Slider, CarouselRail, SegmentedControl, IconButton | Now-playing bar |
| S2-2 | Spatial control center | S2 | `hf-pattern` | SurfaceGroup, ButtonGroup/Toolbar, Slider, Switch, SegmentedControl, IconButton, ConcentricFrame; `refraction` on one chrome surface (enhanced, Chromium) | Control grid |
| S2-3 | Ecommerce | S2 | `photo` | CarouselRail, Select, NumberField, RadioGroup, Button (`prominent`), Sheet (cart), Breadcrumbs, Pagination, Toast | Product detail, Cart sheet |
| S2-4 | Analytics | S2 | `dense-text` | StatCard, Sparkline + ChartFrame, Table, FilterBar, DateRangePicker, Tabs, Popover | Filter bar + chart |

  Test: `showcase-coverage.test.ts` renders each full-page story in jsdom and asserts each listed component's root `data-ag-part` is present; the union across S1 rows is **44/44** flagships (as listed above: S1-1..S1-6 together name every §11.2 entry), so no flagship is certified only in isolation. Composition owners per deviation 5.
- **REQ-SB-23** Showcases import only public entry points. `no-restricted-imports` bans `**/src/**`, `@/**`, `.storybook/**`, `aura-glass/compat`, and any 4.x `Glass*` name. `scripts/storybook/verify-showcase-imports.mjs` builds every `showcase/**/*.showcase.tsx` with Vite against the packed tarball (`npm pack` → temp dir, `npm i <tgz>`) and fails on any unresolved import. Runs in CI only.
- **REQ-SB-24** Showcases contain 0 `!important`, 0 `style` props that set `background*`, `backdrop*`, `filter`, `box-shadow`, `border*`, `color`, `opacity`, `mix-blend-mode` on a library component or its ancestors up to `Environment`, 0 hex/rgb/hsl/oklch literals (layout-only `style` such as `gridTemplateColumns` is allowed), and 0 `className` targeting library parts (`[data-ag-part]` selectors). Layout uses consumer CSS modules in `showcase/<name>/<name>.module.css` limited to layout properties (allowlist: `display`, `grid-*`, `flex*`, `gap`, `padding`, `margin`, `inline-size`, `block-size`, `min-*`, `max-*`, `position`, `inset*`, `overflow`, `container-*`). Test: `auraglass/story-*` lint rules (REQ-SB-30) plus `stylelint` (NEW devDependency, exact pin; the repo has none today) with `declaration-property-allowlist` on `showcase/**/*.module.css`.
- **REQ-SB-25** Fixture data is deterministic: seeded generators in `data.ts` (no `Math.random`, `Date.now`, or network in render); times are rendered from a fixed epoch `2026-03-02T09:30:00Z` via a `now` prop. Images are bundled, licensed showcase assets (≤300 KB AVIF each, ≤12 per showcase). Test: `showcase-determinism.test.ts` renders each story twice and asserts identical HTML.
- **REQ-SB-26** Copy is product-realistic: no meta copy about AuraGlass, glass, certification or Storybook inside S1/S2 trees; banned-string list from REQ-SB-13 applies; each showcase has ≥1 data-dense region (≥40 text runs). Test: `lint-story-copy.mjs`.
- **REQ-SB-27** `AppChromeVisualBaseline.stories.tsx` is rebuilt as S1-3's seed and deleted from `src/stories/` when S1-3 lands; `src/stories/AppShell.stories.tsx` (6 aliases) is deleted in the same task (SB-106, the single remover per SC-31/OV-18; NAV-105 only verifies; NAV's shell stories live at `src/app-shell/AppShell.stories.tsx`, NAV-101). `AuraGlass33MarketingLaunch.stories.tsx` is moved to `Showcases/Marketing` only if PRD-16 keeps the marketing components; otherwise deleted.

### 5.E Story-supplied-glass anti-pattern

- **REQ-SB-30** Six story rules are added by MODIFY to the existing `eslint-plugin-auraglass.js` (SC-16: namespace `auraglass/`, plugin file owned by PRD-PKG and wired by PKG-015; no separate plugin package) and enabled in `eslint.config.js` for `**/*.stories.tsx`, `showcase/**`, `.storybook/**` only, all `error` at GA. They complement, and do not replace, PRD-MAT's `auraglass/no-optics-outside-material` (library source). "Library component" is defined syntactically so no type information is needed: a JSX element whose identifier is bound by an import from a specifier matching `^aura-glass(/|$)`, or (for colocated component stories under `src/**`) by a relative import resolving into `src/**` outside `.storybook/`; `Environment` is identified the same way. "Ancestor" means a JSX ancestor in the same component's returned tree (no cross-file analysis). Rules:
  - `story-no-optics`: JSX `style` or CSS-in-JS objects with `backdropFilter`, `WebkitBackdropFilter`, `filter`, `mixBlendMode`; string literals containing `backdrop-filter`.
  - `story-no-important`: any `!important` in template literals, `<style>` children or CSS modules.
  - `story-no-ink-override`: `color`, `--ag-on-surface*`, `--glass-text-*` on library components or wrappers.
  - `story-no-tone-class`: class names matching `/^glass(-on-|-contrast|-neutral-|-level)/` and `.liquid-glass-*`.
  - `story-no-stage-background`: `background*` on any element that is an ancestor of a library component, except `Environment`.
  - `story-no-private-vars`: any `--_ag-*` outside `.storybook/lab/**`.
  Test: `tests/lint/story-rules/*.test.ts` (RuleTester valid/invalid cases per rule, ≥4 each).
- **REQ-SB-31** Allowlist: only `.storybook/lab/**` may set `--_ag-*`; only `.storybook/environment/**` may set background on the scene element. No `eslint-disable` for `auraglass/story-*` anywhere (enforced by `@eslint-community/eslint-plugin-eslint-comments` rule `no-restricted-disable`; NEW devDependency, exact pin). Test: a RuleTester-style fixture with `// eslint-disable-next-line auraglass/story-no-important` fails lint.
- **REQ-SB-32** Ratchet for the transition: at the start of PRD execution the rule set runs as `warn` with a committed count file `scripts/storybook/story-lint-baseline.json` (initial: 49 optics occurrences in 27 files, 34 files with `!important`). CI fails if any count rises. It flips to `error` (count 0) before 5.0 beta.
- **REQ-SB-33** Story files deleted by this PRD: `src/components/showcase/LiquidGlassStateMatrix.stories.tsx`, `src/components/templates/showcase/ComprehensiveShowcase.stories.tsx`, and every story importing the components below. Component **source** (FND-124, RM-08) (`src/components/showcase/LiquidGlassShowcase.tsx` + `.test.tsx`, `src/components/demo/EnhancementShowcase.tsx`, the orphaned `src/components/advanced/StorybookVisualShowcase.tsx`) is deleted by Component Remediation PRD RM-08 (`src/components/{demo,website-components,showcase}/**`, `StorybookVisualShowcase`) under PRD-16's C-D rule; this PRD only guarantees no story or showcase references them. `LiquidGlassShowcase` is a root export today (`src/index.ts:736`), so it needs a repo-root `deprecations.json` entry (SC-02; schema REL-010, instance seeded by TRUST-075, entry added by the RM-08 owner) and the 4.3 dev warning via `warnDeprecated` (REL-072) before 5.0 removal; its codemod is the core `removed` id (SC-33), which leaves `// TODO(aura-glass 5): LiquidGlassShowcase removed, see showcase/ sources`. Test: `rg -l "LiquidGlassShowcase|LiquidGlassStateMatrix|ComprehensiveShowcase|EnhancementShowcase|StorybookVisualShowcase" -g '*.stories.tsx' -g '*.mdx' src showcase .storybook` = 0.

### 5.F Certification scenes and the PRD-19 interface

- **REQ-SB-40** Eight stories `Scenes/<Scene>` (ids `scenes--photo`, `scenes--saturated-abstract`, `scenes--dense-text`, `scenes--dark-media`, `scenes--flat-white`, `scenes--flat-black`, `scenes--hf-pattern`, `scenes--video-frame`), tagged `cert-scene`, each composing over its scene: T0 `Surface` × {regular, clear, identity, content-raised} × {thin, regular, thick} (12 cells, each ≥240×160 px at 1440, ≥160×120 at 390) with a 2-line label and a 14 px body paragraph per cell, plus a strip of 6 flagships at rest (Button, SegmentedControl, Slider, TextField, Tabs, Toast). Scene stories take no per-story axis args; they read `scheme`, `transparency`, `contrast`, `tier`, `motion` from the §4.2 globals only, so PRD-19 forces every §15.1 axis by URL `globals=` (e.g. `?id=scenes--photo&globals=scheme:dark;transparency:tinted;tier:standard`). Test: `cert-scenes.test.ts` asserts 8 ids, 12 `data-ag-surface` cells + 6 flagship roots per story, and that each story's root has `data-ag-backdrop` equal to the manifest value.
- **REQ-SB-41** `scripts/audit/storybook-visual-certification.mjs` and its report outputs are retired; the 4.1 "356 passed" result is void (C14). The deletion itself is PRD-19 REQ-QA-50 (QA-115, the single remover per SC-39); this PRD removes its Storybook-side callers (`audit:storybook:presentation`, `package.json:339`, and `scripts/audit/story-presentation-audit.js`) and supplies the story ids, tags and globals for the replacement. Test: `rg -n "storybook-visual-certification|story-presentation-audit" package.json .github .storybook` = 0.
- **REQ-SB-42** Every story exports a stable id (no generated `name` collisions). Story ids consumed by PRD-19 are listed in `.storybook/cert-manifest.json` (NEW, generated by `scripts/storybook/write-cert-manifest.mjs`) with `{ id, tags, kind, viewports, axes }`; PRD-19 fails closed if an id in the manifest is missing from `index.json` or vice versa for `cert-scene`/`showcase-s1`/`lab`/`matrix` tags.
- **REQ-SB-43** No story reaches its rendered state through timers: overlays use `defaultOpen`/controlled `open`; streaming text uses a deterministic `StreamingText` fixture with `step` controlled by args. The capture harness waits on `document.fonts.ready` and `[data-ag-story-content][data-ag-cert-ready="true"]` (SC-21 attribute, set by `StoryRoot` after the subject's `useLayoutEffect` and decoded images; QA-041 mirrors it to `body` in `certify=1` mode). Test: `story-ready.test.tsx`.

### 5.G Storybook tooling and dependencies

- **REQ-SB-45** Remove `@storybook/jest`, `@storybook/testing-library` and `@storybook/test` (9.0.0-alpha.2) from `package.json` (`:433-437`); rewrite 53 imports to `storybook/test`; add `@storybook/addon-vitest` (same exact version as `storybook`, `9.1.20` at HEAD), `vitest` and its browser provider pinned exactly to the range that addon version supports (Vitest 3.2.x with `@vitest/browser` + `playwright` provider; `@vitest/browser-playwright` only if the program moves to Vitest 4 / Storybook ≥9.2). These are devDependencies; Jest stays the unit runner (deviation 6). `package.json` script `test-storybook` = `vitest run --project=storybook` (the deprecated `@storybook/test-runner` is not added). Test: `rg -l "@storybook/(test|jest|testing-library)['\"]" src .storybook` = 0; `npm ls @storybook/test` empty.
- **REQ-SB-46** `.storybook/main.ts` contains no `process.env` shim and no externals for `openai`, `redis`, `bcryptjs`, `jsonwebtoken`, `@pinecone-database/pinecone`, `@google-cloud/vision` (`main.ts:35-67`). Blocked on PRD-16 removing the server graph; until then the externals list may only shrink. Test: `storybook-config.test.ts` reads `main.ts` and asserts `viteFinal` defines no `external` and no `define['process.env']`.
- **REQ-SB-47** `aura-glass` and its subpaths resolve in Storybook through the package `exports` map (Vite `resolve.conditions` + a workspace self-reference), not through `@/` or `src/` aliases, so stories and showcases see exactly the consumer surface. Every CI/evidence build resolves `aura-glass` to `dist/` through the exports map generated from PRD-PKG's `build/exports.manifest.json` (PKG-005, SC-12); PKG-115's `AG_STORYBOOK_DIST=1` path is the sanctioned CI mechanism and the deploy and certify builds set it. The local dev server (`npm run storybook`, editing aid only, never evidence) may keep PKG-115's `src` alias. Test: `storybook-config.test.ts` asserts that with `CI=true` or `AG_STORYBOOK_DIST=1` no alias maps `aura-glass` to `src`; the Storybook build fails if a story imports a non-exported path.
- **REQ-SB-48** `@storybook/addon-a11y` runs with `parameters.a11y.test = 'error'` and `color-contrast` enabled for every story except those tagged `matrix` (which PRD-19 checks by OCR). Test: `storybook-tests.yml` vitest run reports 0 axe violations.
- **REQ-SB-49** Story build tsconfig `tsconfig.storybook.json` (NEW) with `strict: true`, `noImplicitAny: true`, including `.storybook`, `**/*.stories.tsx`, `showcase/**`. `tsc --noEmit -p tsconfig.storybook.json` is a CI gate.

### 5.H Deploy pipeline

- **REQ-SB-50** Rewrite `.github/workflows/deploy-storybook.yml`: top-level `permissions: contents: read`. Job `build` (all events): `npm ci`, `npm run build-storybook`, write manifest (REQ-SB-55), upload `storybook-static` as an artifact named `storybook-<sha>` (retention 30 days). Job `storybook-tests` calls `./.github/workflows/storybook-tests.yml` as a reusable workflow (`on: workflow_call`), because `needs:` cannot reference a job in another workflow file. Job `deploy-pages` (`if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/tags/v5.'))`, `needs: [build, storybook-tests, cert-scene-gate]`) with job-level `pages: write`, `id-token: write`, using `actions/upload-pages-artifact` + `actions/deploy-pages` to the existing `cname` `storybook.aura-glass.auraone.com` (`deploy-storybook.yml:40`). `peaceiris/actions-gh-pages` and `contents: write` are removed. `main` publishes to `/next/`; tags publish per REQ-SB-52.
- **REQ-SB-51** PR previews: for same-repository PRs only (`github.event.pull_request.head.repo.full_name == github.repository`), job `deploy-preview` uploads the artifact to Cloudflare Pages project `auraglass-storybook` (NEW; provisioned under the existing Cloudflare account per the provider reference, not created by CI) via `cloudflare/wrangler-action` (pinned by commit SHA) with a repo secret scoped to that Pages project, job-level `pull-requests: write`, and comments the **returned** `deployment-url` step output. Fork PRs get the artifact link only; no secrets are exposed to fork code (policy: ci-selection). If the Pages project or secret is absent (`if: secrets` check fails), the job is skipped and no comment is posted; a dead URL is never advertised. Test: `deploy-workflow.test.mjs` parses the YAML and asserts: top-level permissions read-only; no job without an `if` has write permissions; the comment step consumes a step output URL.
- **REQ-SB-52** Versioned paths. `actions/deploy-pages` replaces the whole site on every deploy, so the deploy job assembles the full tree each time: `/next/` (latest `main` build), `/v5/<version>/` for every 5.x tag, `/latest/` (copy of the highest non-prerelease `v5.*`), `/v4/` (built once from `release/4.x`, frozen), and a root `index.html` redirecting to `/latest/`. Prior versions are restored from GitHub Release assets `storybook-static-<version>.tar.gz` (attached by the tag run; Actions artifacts expire at 30 days and are not a version store). Test: `deploy-workflow.test.mjs` asserts the tag trigger, the assemble step's path layout and that it downloads release assets rather than artifacts.
- **REQ-SB-53** `deploy-pages` runs only after `storybook-tests` (vitest interactions + axe) and the PRD-19 L6 Environment visual `cert-scene` job pass on the same SHA. That job is `certify / cert-scene` in PRD-QA's `certify-main.yml` (QA-032; tags run the reusable `certify-release.yml`, QA-034); job `cert-scene-gate` checks it with `gh api repos/{owner}/{repo}/commits/{sha}/check-runs` (job-level `checks: read`) and fails if the `certify / cert-scene` check-run is not `success`. This PRD does not define the job; a rename is a co-change with PRD-QA.
- **REQ-SB-54** Storybook build in CI fails on any build warning about missing story ids, duplicate ids, or unresolved imports (`--quiet` not used; log scanned by `scripts/storybook/check-build-log.mjs`).

### 5.I Stale `storybook-static` fix

- **REQ-SB-55** `scripts/storybook/write-build-manifest.mjs` (NEW) writes `storybook-static/ag-build.json` = `{ sha: git rev-parse HEAD, dirty: boolean, builtAt, storybookVersion, packageVersion, storyCount, indexSha256 }` as the last step of `build-storybook` (`postbuild-storybook` script).
- **REQ-SB-56** `scripts/storybook/verify-fresh.mjs` (NEW) exits non-zero unless `ag-build.json` exists, `sha` equals the current HEAD, `dirty` is false in CI, and `indexSha256` matches `index.json`. Every consumer that serves or reads a built Storybook runs it first: the `deploy-pages`/`deploy-preview` jobs, the PRD-19 harness (`certification/playwright.cert.config.ts` `webServer`) and the remote-runner offline bundle builder (REQ-QA-60..64). PRD-QA's `certify-pr.yml` `build-storybook` job (QA-031) and `certification/playwright.cert.config.ts` `webServer` (QA-018) already call it; this PRD supplies the script and tests that wiring. The visual-change gate runs in `certify-pr.yml` (`regression` job, REL's `visual-class.mjs`, SC-09). The two 4.x readers are deleted on `main` by PRD-QA: `.github/workflows/visual-regression.yml` by QA-119 (REQ-QA-51) and `scripts/visual-test-runner.js` (REQ-QA-52); this PRD does not edit them on `main`. On `release/4.x` only, they gain a `verify-fresh.mjs` step as part of the freshness back-port (TRUST-062 is the only other `visual-regression.yml` edit and is evidence-only). `scripts/ci/forbidden-check.js`, `scripts/ci/verify-no-core-ui-deps.js` and `scripts/ci/stale-3-3-scan.js` only ignore the directory and need no change. Test: `verify-fresh.test.mjs` covers missing manifest, SHA mismatch, dirty tree and hash mismatch.
- **REQ-SB-57** `storybook-static/` stays gitignored (`.gitignore:87`); `scripts/ci/forbidden-check.js` adds a check that `git ls-files storybook-static` is empty. No document or report may cite `storybook-static` content without the `ag-build.json` SHA.

REQ numbers 28–29, 34–39 and 44 are intentionally unused (reserved for review additions).

## 6. Files/directories affected (existing paths)

All verified with `rg --files` / `test -e` at HEAD `15b6de6f7`.

| Path | Change |
|---|---|
| `.storybook/main.ts` | Remove `process.env` shim and backend externals (REQ-SB-46); exports-map resolution (REQ-SB-47); add `@storybook/addon-vitest`; stories globs add `showcase/**/*.stories.tsx` and `src/material/stories/*.stories.tsx`; `staticDirs` adds `{ from: '../certification/scenes', to: '/scenes' }` |
| `.storybook/preview.tsx` | Rewrite: globals (§4.2), single decorator, `storySort` (REQ-SB-08), delete `initialSettings.reducedMotion` (`:168-174`), delete backgrounds (`:116-136`), delete persona/preview-mode toolbars (`:61-88`) |
| `.storybook/StorySurface.tsx` | Delete (REQ-SB-01) |
| `.storybook/README.md` | Rewrite for the 5.0 contract |
| `.github/workflows/deploy-storybook.yml` | Rewrite (REQ-SB-50..53) |
| `.github/workflows/visual-regression.yml` | Deleted on `main` by PRD-QA QA-119 (REQ-QA-51, SC-09); no edit by this PRD on `main`. On `release/4.x` only: `verify-fresh.mjs` step as part of the freshness back-port (REQ-SB-56) |
| `package.json` | Scripts `storybook`, `build-storybook`, `prebuild-storybook` (`:326-328`); add `postbuild-storybook`, `test-storybook`; remove `audit:storybook:presentation` (`:339`) once replaced; devDeps per REQ-SB-45 (`:431-437,462,479`) |
| `eslint-plugin-auraglass.js` | MODIFY (plugin file owned by PRD-PKG, SC-16): add the six `auraglass/story-*` rules (REQ-SB-30) |
| `eslint.config.js` | MODIFY (wiring owned by PKG-015): enable `auraglass/story-*` and `no-restricted-imports` for stories, `.storybook/**` and `showcase/**` |
| `jest.config.js` | MODIFY (owned by PRD-QA, QA-003): add `tests/storybook/**` and `tests/showcase/**` roots |
| `.gitignore` | Unchanged entry `storybook-static` (`:87`); verified by forbidden-check |
| `scripts/audit/storybook-visual-certification.mjs` | Deleted by PRD-19 REQ-QA-50; this PRD removes callers (REQ-SB-41) |
| `scripts/audit/story-presentation-audit.js` | Delete; superseded by `lint-titles.mjs`, `lint-story-copy.mjs`, `storybook-index.test.mjs` |
| `scripts/ensure-component-inventory.js` | Keep; additionally emit `tier` (flagship/core) per record for tags |
| `scripts/visual-test-runner.js` | Deleted on `main` by PRD-QA (REQ-QA-52); `verify-fresh.mjs` guard only on `release/4.x` back-port (REQ-SB-56) |
| `scripts/ci/forbidden-check.js` | Add the `git ls-files storybook-static` = empty check (REQ-SB-57). (It already ignores `storybook-static`, `:20`.) |
| `scripts/ci/verify-no-core-ui-deps.js`, `scripts/ci/stale-3-3-scan.js` | No change (they only ignore `storybook-static`; `stale-3-3-scan.js` is deleted by REQ-QA-52) |
| `scripts/audit/verify-visual-evidence.js` | Unchanged here; PRD-19 points it at the new cert manifest |
| `src/stories/*.stories.tsx` (21 files) | Delete the 12 text galleries (§9 list), `AppShell`, `AuraGlassIcons` (alias), `CuratedComponentGuide`, `GlassAuditCoverage`, `ProductionWorkflowComponents`, `AuraGlass33ThemeShowcase`; rebuild `IconsGallery` → `Foundations/Icons`; `AppChromeVisualBaseline` → S1-3; `AuraGlass33MarketingLaunch` per REQ-SB-27 (12 + 6 + 3 = 21) |
| `src/**/*.stories.tsx` (460 files) | Rewritten via `defineComponentStories` for survivors **by the component's PRD** (SC-31); deleted with their component for REMOVE records (PRD-FND RM PRs). This PRD only tests conformance |
| `src/components/showcase/LiquidGlassStateMatrix.stories.tsx`, `src/components/templates/showcase/ComprehensiveShowcase.stories.tsx` | Delete (REQ-SB-33) |
| `src/components/showcase/LiquidGlassShowcase.tsx` (+ `.test.tsx`), `src/components/demo/EnhancementShowcase.tsx`, `src/components/advanced/StorybookVisualShowcase.tsx` | No edit here; deleted by Component Remediation PRD RM-08 |
| `src/index.ts:736` | `LiquidGlassShowcase` export: 4.3 deprecation, 5.0 removal (PRD-01 / RM-08) |
| `src/components/button/GlassButton.stories.tsx` | Replaced by `Button.stories.tsx` (authored by CTL-059, SC-31/OV-16); claim stories (`:286-331,454-536`) deleted with it |
| `src/components/navigation/GlassSidebar.stories.tsx`, `src/components/media/LiquidGlassPhotoInspector.stories.tsx` | Used as content templates for `InContext` fragments, then replaced by the owning PRD's 5.0 contract files (NAV, MED) |
| `src/components/collaboration/GlassCollaborativeCursor.tsx`, `src/components/cookie-consent/CookieConsent.tsx` | No edit by this PRD (collaboration is deleted by RM-04); stories stop using `previewUsers` (REQ-SB-16) |
| `examples/dashboard.tsx`, `examples/page-button-spacing.tsx` | Delete; superseded by S1-2 and the Component Lab |
| `storybook-static/` (untracked) | Never read without manifest |

## 7. Components affected

This PRD changes stories, not component source. Components whose 5.0 stories must satisfy this PRD's contract (story files authored by the cited PRD per SC-31; this PRD owns the generator, contract tests, MDX docs pages under `src/stories/flagships/**`, and the IA):

- T0 material (PRD-04): `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`.
- Flagships 1–44 (§11.2) via PRD-08..PRD-13: Button, IconButton, ButtonGroup/Toolbar, SegmentedControl, Switch, Slider, Checkbox/CheckboxGroup, RadioGroup, TextField, SearchField, Select, Combobox, NumberField, DateField/TimeField/DatePicker/DateRangePicker; Dialog, AlertDialog, Sheet, Popover, Tooltip, Menu (+ContextMenu, Menubar), Toast; AppShell, Sidebar, TopBar, Tabs, TabBar, Breadcrumbs, Pagination, CommandPalette, ResizablePanels, SourceTransition; Table, TreeView, FilterBar, StatCard, Sparkline + ChartFrame, Timeline/ActivityFeed; Thread, Message, Composer, ToolCall, SourceList/Citation; MediaControls/NowPlayingBar, CarouselRail.
- T2 core (~40, PRD-14), including `Card`, `Avatar`, `Badge`, `Skeleton`, `Accordion`.
- Preferences UI (PRD-05): `GlassPreferencesPanel` appears in the `Foundations/Preferences` page and in S1-6.
- 4.x components used in stories as evidence only (no edit): `GlassButton`, `GlassCarousel`, `GlassToast`, `LiquidGlassMaterial`, `GlassCollaborativeCursor`, `CookieConsent`, `GlassDeepDreamGlass` (stories deleted with PRD-16 removal).

Inventory filter used to size the story workload: `node -e` over `docs/auraglass-5/component-inventory.json` (500 records; 28 `flagship_candidate: true`); the final story list is regenerated from the post-PRD-16 inventory, not hand-maintained.

## 8. New components/files

| Path (all NEW) | Purpose |
|---|---|
| `.storybook/environment/StoryEnvironment.tsx`, `scenes.ts`, `scene-presentation.json` | Scene global over PRD-19's manifest (REQ-SB-02, -04); no assets here |
| `.storybook/contract/StoryRoot.tsx` | `[data-ag-story-content]`, `data-ag-cert-ready` (REQ-SB-05, -43) |
| `.storybook/contract/defineComponentStories.tsx`, `StatesGrid.tsx`, `MatrixGrid.tsx`, `ScenesStrip.tsx`, `InContextFragments.tsx`, `metadata.ts` | Story contract generator (REQ-SB-12) |
| `.storybook/lab/MaterialLabFrame.tsx`, `LabControls.tsx`, `ContrastReadout.tsx`, `spec-export.ts` | Material Lab harness used by PRD-04's `src/material/stories/*` (REQ-SB-18..21) |
| `.storybook/cert-manifest.json` (generated) | PRD-19 interface (REQ-SB-42) |
| `src/stories/StartHere.stories.tsx`, `src/stories/Scenes.stories.tsx`, `src/stories/foundations/*.stories.tsx`, `src/stories/migration/*.mdx`, `src/stories/flagships/<group>/<Name>.mdx` | IA pages and flagship docs pages (Material Lab stories are PRD-04's; component stories are each component PRD's) |
| `showcase/<id>/` × 10 (SC-31 ids; compositions supplied by AI-079/080, DATA-123, MED-161, NAV-144 as MODIFY) (`ai-command-center`, `financial-dashboard`, `ops-console`, `media-workspace`, `collaborative-workspace`, `mobile-productivity`, `music-player`, `spatial-control-center`, `ecommerce`, `analytics`) each with `<Name>.showcase.tsx`, `<Name>.stories.tsx`, `<name>.module.css`, `data.ts`, `copy.ts`, `assets/` | Showcases (REQ-SB-22..26) |
| `tests/lint/story-rules/*.test.ts`, `scripts/storybook/story-lint-ratchet.mjs`, `scripts/storybook/story-lint-baseline.json` | Anti-pattern lint tests and ratchet (REQ-SB-30..32); the rules themselves are MODIFY of `eslint-plugin-auraglass.js` |
| `scripts/storybook/lint-titles.mjs`, `lint-story-copy.mjs`, `write-cert-manifest.mjs`, `write-build-manifest.mjs`, `verify-fresh.mjs`, `verify-showcase-imports.mjs`, `check-build-log.mjs` | Gates |
| devDependencies (exact pins) | `@storybook/addon-vitest`, `vitest` + `@vitest/browser` + `playwright` (REQ-SB-45), `stylelint` (REQ-SB-24), `@eslint-community/eslint-plugin-eslint-comments` (REQ-SB-31), `yaml` for `deploy-workflow.test.mjs` (not in `package.json` today). Dev-only; D-29's runtime allowlist is unaffected |
| `tsconfig.storybook.json` | Strict story typecheck (REQ-SB-49) |
| `vitest.storybook.config.ts` | addon-vitest browser project (REQ-SB-15) |
| `.github/workflows/storybook-tests.yml` | Interaction + axe lane, remote runners only |

## 9. Components/files to remove or deprecate

- Delete (no successor needed): `.storybook/StorySurface.tsx`; 12 text galleries in `src/stories/` (`BackgroundsGallery`, `ButtonGallery`, `ChartsGallery`, `ComponentGallery`, `ComponentsGallery`, `CoreGallery`, `DataDisplayGallery`, `FocusGallery`, `InteractiveGallery`, `LayoutGallery`, `NavigationGallery`, `WidgetsGallery`); `src/stories/AppShell.stories.tsx` (6 aliases); `src/stories/AuraGlassIcons.stories.tsx` (re-export); `src/stories/GlassAuditCoverage.stories.tsx`; `src/stories/ProductionWorkflowComponents.stories.tsx`; `src/stories/AuraGlass33ThemeShowcase.stories.tsx`; `src/stories/CuratedComponentGuide.stories.tsx` (replaced by generated Start Here); `src/components/showcase/LiquidGlassStateMatrix.stories.tsx`; `src/components/templates/showcase/ComprehensiveShowcase.stories.tsx`; `scripts/audit/story-presentation-audit.js`; `examples/dashboard.tsx`, `examples/page-button-spacing.tsx`; 128 Default/Variants stubs. (`scripts/audit/storybook-visual-certification.mjs` is deleted by PRD-19 REQ-QA-50.) Architecture §13.3 counts "13 text-only galleries"; this PRD deletes 12 because `IconsGallery` renders real icons (STORYBOOK-SHOWCASE-07 PARTIAL) and is rebuilt.
- Deleted by Component Remediation PRD RM-08, not here: `LiquidGlassShowcase` (root export, `src/index.ts:736`; `deprecations.json` entry and dev warning in 4.3, removed in 5.0), `EnhancementShowcase`, `StorybookVisualShowcase`. `LiquidGlassStateMatrix`, `ComprehensiveShowcase`, `EnhancementShowcase`, `StorybookVisualShowcase` are not exported from `src/index.ts` (checked with `rg`), so they are C-I deletions.
- Deprecate dev dependencies: `@storybook/jest`, `@storybook/testing-library`, `@storybook/test@9.0.0-alpha.2` (C-I, dev only).
- Deprecated sidebar groups removed: `3.2/*`, `3.3/*`, `Reference/*` (including `Reference/Legacy Components`, 62 stories), `Effects + Advanced`, `Certification`.

## 10. API changes

This PRD adds no runtime API to `aura-glass`. Changes it causes or depends on:

| Change | Surface | Class | Notes |
|---|---|---|---|
| Remove `LiquidGlassShowcase` root export | `aura-glass` root | C-D in 4.3 → C-B in 5.0 | Listed in repo-root `deprecations.json` (SC-02/SC-03); codemod id `removed` (SC-33, DX-041/042 engine) leaves `// TODO(aura-glass 5): ...` pointing to `showcase/` sources |
| Delete internal showcases/demos | not exported | C-I | — |
| `data-ag-story-content`, `data-ag-story-kind`, `data-ag-cert-ready`, `data-ag-lab-override`, `data-ag-state-cell` | Storybook-only attributes (SC-21, story-only row) | C-I | Never emitted by package code; absent from `dist/` (REQ-SB-21) |
| Storybook URL structure `/v5/<version>/`, `/latest/`, `/v4/` | docs hosting | C-E | Old story ids 404; a static `redirects.json` maps the 50 most-linked 4.x ids to 5.0 pages |
| `.storybook/cert-manifest.json` schema | internal contract with PRD-19 | C-I | Versioned `schemaVersion: 1` |
| `previewUsers` no longer exercised | `GlassCollaborativeCursor` | none here | Component deleted with `src/components/collaboration/**` (RM-04) |

## 11. Migration concerns

- **Two Storybooks during the bridge.** `release/4.x` keeps its current Storybook, built once, frozen at `/v4/`, with only REQ-SB-50 (permissions) and REQ-SB-55..57 (freshness) back-ported, because those are CI-safety fixes. 4.x story visuals do not change (D-27 visual-class gate on maintenance branches).
- **Story-per-component churn.** Survivor stories are regenerated, not edited in place. Order: contract generator first, then one PR per family matching PRD-16's per-family removal PRs, so a family's stories, consolidation (§12) and deletions land together and the index never shows both 4.x and 5.0 names for one component.
- **External links.** The deployed 4.x URLs (`?path=/story/...`) break when ids change. `redirects.json` covers the 50 most-linked ids (from the docs site and README); others land on Start Here with a "moved" banner.
- **PRD-19 baselines.** The first 5.0 baselines are captured only after REQ-SB-40 scenes and REQ-SB-05 root exist; no 4.x screenshot is used as a baseline.
- **Licensing.** Scene and showcase images ship inside the deployed Storybook only, never in the npm tarball (verified by PRD-PKG's tarball-contents test PKG-068). Licences must allow redistribution in a public static site.
- **Consumers copying showcases.** Showcases are public-API-only so a registry block may reuse a composition. Blocks are a separate artifact owned by PRD-DX (SC-32: `registry/blocks/<id>/`, 10 GA ids; REQ-DX-53 authors them new); the block source in `registry/` is the source of truth for the block, `showcase/<id>/` for the showcase, and neither imports the other. Any showcase change that a registry block mirrors requires the block's fixture test (DX render harness) to pass.
- **Heavy work stays remote.** Storybook builds for CI, interaction tests in browser mode, scene measurement and pixel capture run in GitHub Actions or the gated remote runner, never on a developer Mac. `npm run storybook` (dev server) remains a local editing tool.

## 12. Tests required

| Test file (NEW unless noted; `*.test.ts(x)` run under the existing Jest config `jest.config.js`, `*.test.mjs` under `node --test`, both remote in CI) | Asserts |
|---|---|
| `tests/storybook/storybook-config.test.ts` | `globalTypes` keys/values/defaults (§4.2); `decorators.length === 1`; no `backgrounds`; default `motion: 'system'`, `contrast` values `system|standard|more`, `glassOpacity` global present (SC-23); `main.ts` has no `process.env` define, no backend externals, no `aura-glass → src` alias |
| `tests/storybook/StoryEnvironment.test.tsx` | 8 scenes render via `Environment`; no tone classes or ink/background on subject ancestors (REQ-SB-02) |
| `tests/storybook/StoryRoot.test.tsx` | exactly one `[data-ag-story-content]`; `data-ag-story-kind` valid; `data-ag-cert-ready` set after fonts/images |
| `tests/storybook/story-ready.test.tsx` | overlays/streaming reach final state without timers (REQ-SB-43) |
| `tests/storybook/MaterialLab.test.tsx` | each control writes only its documented prop/var; reset clears `--_ag-*`; export validates against DTCG schema |
| `tests/storybook/ContrastReadout.test.ts` | ratio within ±0.05 of reference over fixture pixels; thresholds 4.5/3/7 |
| `tests/storybook/story-contract.test.ts` | every `flagship`/`core` file exports the REQ-SB-12 set; `Matrix` cell count = metadata product; flagships have `Keyboard` tagged `apg` |
| `tests/storybook/storybook-index.test.mjs` | `storySort` order; flagship order = §11.2; per-title cap; 0 Default/Variants stubs; 12 Material Lab stories in order; 8 `cert-scene` ids |
| `tests/storybook/start-here.test.mjs` | 0 unresolved links; counts derived |
| `tests/storybook/lint-titles.test.mjs` | rejects version segments, lowercase leaves, `Glass` prefixes, duplicates (fixtures) |
| `tests/storybook/lint-story-copy.test.mjs` | banned strings detected in fixture stories; clean fixture passes |
| `tests/storybook/scene-bands.test.mjs` | REQ-SB-04 luminance/colourfulness/OCR bands on PRD-19's manifest; served `/scenes/*` sha256 matches manifest |
| `tests/storybook/verify-fresh.test.mjs` | missing manifest, SHA mismatch, dirty tree, index hash mismatch each fail |
| `tests/storybook/deploy-workflow.test.mjs` | YAML: read-only top-level permissions; write perms only on gated jobs; preview comment uses a step output; fork PRs get no secrets |
| `tests/showcase/showcase-coverage.test.ts` | each showcase contains its listed `data-ag-part` roots; S1 union = 44/44 flagships |
| `tests/showcase/showcase-determinism.test.ts` | two renders produce identical HTML |
| `tests/showcase/showcase-imports.test.mjs` (wraps `verify-showcase-imports.mjs`, CI) | all showcases build against the packed tarball |
| `tests/lint/story-rules/*.test.ts` | RuleTester ≥4 valid + ≥4 invalid cases per rule (6 rules) |
| `tests/storybook/cert-scenes.test.ts` | 8 scene stories, 12 surface cells + 6 flagship roots, `data-ag-backdrop` matches manifest |
| Storybook `play` functions (in story files, run by addon-vitest in `storybook-tests.yml`) | ≥1 primary-task flow per S1 showcase (6); Material Lab control round-trips. APG keyboard scripts and stacked-overlay Escape/z-order are PRD-05/PRD-19 Playwright specs (REQ-QA-18, -19) targeting this PRD's `apg`-tagged story ids |
| `tests/storybook/story-contract.test.ts` (APG link check) | each of 44 flagship `Keyboard` story ids equals `ApgScript.story` in `tests/a11y/apg/<kebab-component>.apg.spec.ts`; missing spec fails |
| `@storybook/addon-a11y` in the vitest run | 0 violations with color-contrast on (excluding `matrix`) |
| PRD-19 lanes (owned there, inputs from here) | pixel gates on `cert-scene`, `showcase-s1` (full matrix), `showcase-s2` (reduced), `lab`; motion frame strips; engine checks; perf grades |

## 13. Storybook requirements

This PRD is the Storybook requirement. Summary of the contract every other PRD's stories must satisfy:

1. Authored with `defineComponentStories` (REQ-SB-12); titles under `Flagships/<Group>/<Name>` or `Core/<Name>` with 5.0 export names.
2. Rendered inside `StoryEnvironment` with no story-level background, ink, tone class, optics or `!important` (REQ-SB-30).
3. `Keyboard` story for flagships, tagged `apg`, whose story id equals `ApgScript.story` in the component PRD's `tests/a11y/apg/<kebab-component>.apg.spec.ts` (keyboard behaviour is gated by L5 Behaviour, not by `play`; REQ-SB-15).
4. Valid typed args; no `any`; no claim copy (REQ-SB-13).
5. Deterministic fixtures and ready signal (REQ-SB-25, -43).
6. MDX docs page for flagships (REQ-SB-17).
7. Tags per §4.4 so PRD-19 picks the story up automatically, plus `parameters.ag.subject` where PRD-QA's subject resolver needs an explicit mapping (QA-008).
8. Story files are created by the component's PRD (SC-31); globals and decorators are added only through MODIFY tasks on SB-048.

## 14. Responsive requirements

- Viewports registered in `preview.tsx`: `desktop` 1440×900, `laptop` 1280×800, `tablet` 834×1194, `mobile` 390×844. CI capture uses 1440 and 390 (§15.1).
- Every Component Lab `Mobile` story renders at 390 with no horizontal overflow (`scrollWidth ≤ clientWidth + 1` on `[data-ag-story-content]`) and touch targets ≥44×44 CSS px for flagships (24×24 minimum per WCAG 2.5.8 for dense core).
- Showcases S1-1..S1-5 and S2-1..S2-4 render at both 1440 and 390 using `AppShell` container-query collapse (Sidebar → drawer via `Sheet`, Inspector → bottom `Sheet`); S1-6 is mobile-first and also renders at 834. Test: PRD-19 "mobile containment" gate plus `showcase-coverage.test.ts` checks the collapsed parts exist at 390.
- Material Lab subjects scale: cells ≥240×160 at 1440, ≥160×120 at 390, never below the size at which PRD-19 OCR reads 14 px text.
- Scenes use `object-fit: cover` and art-directed focal points (`scenes.ts` `focal: {x, y}`) so the busy region stays behind the subject at both viewports.

## 15. Accessibility requirements

- Storybook chrome and every story pass `@storybook/addon-a11y` (axe) with `color-contrast` on, run in a real browser (REQ-SB-48).
- Interactive globals are keyboard-operable (Storybook toolbar) and each has a visible text label; the Lab controls are native inputs with `<label>`, `aria-valuetext` for slider values (e.g. "Blur 20 pixels"), and the contrast read-out is a `role="status"` live region announcing only on settle.
- Each showcase has one `<main>`, a skip link rendered by the showcase (not the decorator), headings in order, and landmark names; S1-1 Thread is `role="log"`.
- `Preferences` stories exercise forced colors, `contrast: more`, reduced transparency and reduced motion; under forced colors no story may contain information carried only by blur, tint or shadow.
- Motion in Storybook follows the OS (REQ-SB-07); the Lab `Motion` page states the current resolved `data-ag-motion` value.
- Video in `video-frame` and S1-4 (`video-frame.webm`, the PRD-19 2 s loop) is muted, has a pause control and no autoplay sound; it does not autoplay under reduced motion (WCAG 2.2.2).
- Text contrast on rendered pixels over every scene meets 4.5:1 body / 3:1 large and UI (7:1 under `contrast: more`) as measured by PRD-19 OCR; this PRD may not lower a threshold or exclude a scene.
- Manual pass (GA blocker per §15.2, PRD-19 L13 Manual SR): VoiceOver/Safari and NVDA/Chrome walkthrough of S1-1, S1-2 and S1-6, recorded against PRD-A11Y's `tests/a11y/manual/sr-record.schema.json` (A11Y-084) through QA-100 as a SHA-bound artifact.

## 16. Performance requirements

Measured on PRD-PERF's remote harness `tests/perf/harness/run-perf.mjs` (PERF-039), run by PRD-19 L10 Performance (QA-085) (emulated mid-tier mobile: 4× CPU throttle, 390×844, DPR 3; 120 Hz desktop 1440×900). Budgets are initial targets and may only ratchet down. Per SC-15 the runtime rows below (fps, surfaces, long tasks, LCP, Lab repaint) are registered as rows in PRD-PERF's `tests/perf/harness/budgets.json` (file PERF-044, harness PERF-039) by SB-126 (MODIFY); this PRD does not keep a second budget file. Storybook build-artifact budgets (`storybook-static` size, build time, preview JS growth) are Storybook-only, not package byte budgets, and stay in `scripts/storybook/check-build-size.mjs`.

| Metric | Budget |
|---|---|
| Blurred surfaces visible at once in any story or showcase viewport | ≤6 at `(pointer:fine)`, ≤3 at `(pointer:coarse)` (§4.7); refracting ≤2 |
| Infinite animations running after settle | 0 (4.x modal/app-shell: 4; runtime-remote §5) |
| Showcase scripted hover+scroll FPS (2 s) | desktop p50 ≥110 fps on 120 Hz, mobile p50 ≥55 fps; 4.x baseline 12–23 fps |
| Long tasks per showcase load | ≤2 tasks >50 ms and none >150 ms attributable to story code, measured as the delta over the Performance PRD blank-story baseline (REQ-PERF-33), not by filtering Storybook boot tasks by duration |
| Showcase LCP (preview iframe, warm cache) | ≤1.8 s desktop, ≤2.8 s mobile |
| Material Lab control → repaint | ≤16 ms main-thread work per control change on desktop |
| Scene asset weight | owned by PRD-19 (REQ-QA-10: all 8 ≤6 MB total); Storybook adds 0 bytes of scene assets |
| Showcase asset weight | ≤12 images × ≤300 KB per showcase |
| `storybook-static` total size | ≤60 MB (excluding source maps) |
| CI Storybook build time | ≤6 min on a standard GitHub-hosted runner; interaction suite ≤12 min with sharding |
| Preview iframe JS for a single story (gzip) | reported per release; must not grow >10% release over release |

## 17. Acceptance criteria

| ID | Criterion | Measure |
|---|---|---|
| AC-SB-01 | No opaque stage | `rg -l "StorySurface\|previewSurface\|glass-on-light" .storybook showcase -g '!__tests__'` = 0 and `rg -l "StorySurface\|previewSurface\|glass-on-light" src -g '*.stories.tsx' -g '*.mdx'` = 0 (library CSS such as `src/styles/glass.css` is PRD-04's); PRD-19: forcing a different scene changes ≥30% of pixels inside the largest `regular` surface in `scenes--*` (4.x: 0.000) |
| AC-SB-02 | Scenes are real | `scene-bands.test.mjs` green on the PRD-19 manifest (REQ-SB-04); 0 of 8 scenes have mean luminance in 200–245 except `flat-white` |
| AC-SB-03 | Default view is not white | Default `environment` = `photo`; of the 8 scenes exactly 1 (`flat-white`) has mean ≥245, and ≥3 (`flat-black`, `dark-media`, `video-frame`) have mean <100, guaranteed by the REQ-SB-04 bands |
| AC-SB-04 | IA is flagship-first | `storybook-index.test.mjs` green; first 5 sidebar roots are Start Here, Material Lab, Scenes, Showcases, Flagships; 0 version-named groups; 0 cross-group duplicates |
| AC-SB-05 | Component Lab coverage | 44/44 flagships and 100% of T2 core titles export the REQ-SB-12 set; 0 Default/Variants stubs |
| AC-SB-06 | Material Lab | 12 Lab stories present; every control in REQ-SB-19 present and covered by `MaterialLab.test.tsx`; export JSON validates |
| AC-SB-07 | Certification scenes | 8 `cert-scene` stories in `cert-manifest.json`; PRD-19 pixel gates pass on all 8 × §15.1 axes |
| AC-SB-08 | Showcases | 10 showcases; `showcase-coverage.test.ts` green; S1 union = 44/44 flagships; all build against the packed tarball |
| AC-SB-09 | Zero story-supplied glass | `auraglass/story-*` at `error` with 0 violations; `story-lint-baseline.json` counts 0/0; 0 `eslint-disable` for these rules |
| AC-SB-10 | Interaction tests | 44/44 flagship `Keyboard` stories tagged `apg` and linked to an existing `tests/a11y/apg/<kebab-component>.apg.spec.ts` (`story-contract.test.ts`); ≥6 S1 showcase `play` flows 100% pass in `storybook-tests.yml`; 0 imports of deprecated test packages. (APG pass/fail itself is PRD-19 REQ-QA-18.) |
| AC-SB-11 | Axe | 0 violations with color-contrast on across all non-`matrix` stories |
| AC-SB-12 | Pixel quality on showcases | PRD-19 gates on S1 at full matrix: OCR worst-case contrast ≥4.5:1 body, glass density ≤0.3, material presence pass, frame fill ≥3%; S2 at reduced matrix with the same thresholds |
| AC-SB-13 | Performance | All §16 budgets met on the remote harness; 0 infinite animations after settle |
| AC-SB-14 | Deploy safety | `deploy-workflow.test.mjs` green; a PR run has no write token at top level; preview comment URL returns HTTP 200 for same-repo PRs, or no comment is posted |
| AC-SB-15 | Freshness | Every reader runs `verify-fresh.mjs`; a deliberately stale `storybook-static` fails CI (negative test in `verify-fresh.test.mjs`); `git ls-files storybook-static` = 0 |
| AC-SB-16 | Deployed site matches release | `https://storybook.aura-glass.auraone.com/v5/<version>/ag-build.json` `sha` equals the release tag SHA |
| AC-SB-17 | Legacy cert retired | `storybook-visual-certification.mjs` absent (PRD-19 REQ-QA-50) and no `package.json`/`.github`/`.storybook` reference to it or to `story-presentation-audit.js`; no README/release claim cites it |
| AC-SB-18 | No backend in Storybook config | `main.ts` contains none of the 6 backend externals and no `process.env` shim |
| AC-SB-19 | Human review | Specular quality, optical hierarchy, radius rhythm and "reads as one hand" signed off on S1-1..S1-6 from remote captures (PRD-19 L14 Human visual review, §15.2; record schema QA-099, recorded via QA-100) |

## 18. Definition of done

- Every REQ-SB-NN implemented and its named test green in CI on `main`.
- AC-SB-01..19 met on the RC SHA, with evidence as CI artifacts keyed to that SHA (D-32), not committed files.
- PRD-19 consumes `cert-manifest.json` with no story-specific special cases.
- `release/4.x` Storybook frozen at `/v4/` with permissions and freshness back-ports only.
- `docs/auraglass-5/component-inventory.json` (post-PRD-16) and `index.json` agree: every non-REMOVE record has exactly one title.
- `.storybook/README.md` documents the story contract, globals, tags and the lint rules.
- No local Docker, browser automation or heavy build was used to validate; all capture, interaction and perf runs executed in CI or remote runners.

## 19. Dependencies

Key column per SC-01; anchor tasks per SC-40 (these are the ids `tasks/SB.json` uses in `depends_on`).

| PRD (§16 id → key) | Needed for | Anchor tasks | Blocking? |
|---|---|---|---|
| PRD-00 → TRUST | `scripts/ci/lib/npm-pack.js` (packed-tarball checks); `deprecations.json` seed | TRUST-002, TRUST-075 | Yes for REQ-SB-21/23 |
| PRD-01 → REL | `deprecations.json` schema and generated output (`LiquidGlassShowcase` entry, Migration docs); `warnDeprecated`; `release/4.x` branch policy for the back-port; visual-class gate (SC-09) | REL-010, REL-070, REL-072, REL-117, REL-054 | Yes for removal and the 4.x back-port |
| PRD-02 → PKG | Exports manifest (REQ-SB-47), CI dist alias (PKG-115), tarball contents (REQ-SB-21), lint/jest wiring and `eslint-plugin-auraglass.js` (SC-16) | PKG-005, PKG-015, PKG-068, PKG-115 | Yes |
| PRD-03 → DS | DTCG `glass-material` schema and token (`tokens/$schema.json`, `material.tokens.json`); compiler-emitted private-var names (§4.5) | DS-014, DS-016, DS-030, DS-048 | Yes for Lab spec knobs |
| PRD-04 → MAT | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame` (SC-22); **authors the Material Lab story files** (MAT-086, MAT-088) on this PRD's harness; MAT-090 is a contract check of SB-048 | MAT-047, MAT-048, MAT-049, MAT-051, MAT-053 | Yes (Lab, scenes) |
| PRD-05 → A11Y | `AuraGlassProvider`, `usePreference`, `AuraGlassScript` (SC-23), `GlassPreferencesPanel`, APG harness, SR record schema | A11Y-027, A11Y-029, A11Y-032, A11Y-073, A11Y-084, A11Y-088 | Yes (decorator; `Keyboard` linkage) |
| PRD-06 → MOT | `data-ag-motion`, `pointerLight`, motion global (MOT-091 MODIFY of SB-048) | MOT-040, MOT-042 | Yes for Motion page |
| PRD-07/14/16 → FND | Parts registry and `<Component>.meta.ts` (SC-27); core component stories (FND-069, FND-099); RM squash PRs that delete stories with source (RM-01 server graph FND-118, RM-04 FND-121, RM-08 FND-124) | FND-005, FND-069, FND-099, FND-118, FND-121, FND-124 | Yes for Component Lab, REQ-SB-33/46 |
| PRD-08 → CTL | Control flagships and their story files (CTL-059 Button, CTL-015..122) | CTL-055, CTL-059 | Per family |
| PRD-09 → OVL | Overlay flagships and their story files (OVL-055 Dialog, OVL-077..149) | OVL-040, OVL-055 | Per family |
| PRD-10 → NAV | App Shell stories (NAV-101) and shell compositions for S1-3/S1-5/S1-6 (NAV-144) | NAV-101, NAV-144 | Per family / showcase |
| PRD-11 → DATA | Data stories (DATA-043..101) and compositions for S1-2, S2-4, S1-3 data (DATA-123) | DATA-043, DATA-123 | Per family / showcase |
| PRD-12 → AI | AI stories (AI-076/077/078) and the `ai-command-center` composition (AI-079, AI-080) | AI-076, AI-079, AI-080 | Per family / showcase |
| PRD-13 → MED | Media stories (MED-101, MED-124, MED-138) and `music-player`/`media-workspace` compositions (MED-161) | MED-101, MED-161 | Per family / showcase |
| PRD-15 → MAT (interim, SC-37) | `refraction` in Lab `Tiers` and S2-2 | MAT-047 | No (label "inert" until certified) |
| PRD-18/20 → DX | Registry blocks (SC-32), codemod engine for the `removed` codemod (SC-33) | DX-041, DX-067 | Consumer, not blocker |
| PRD-19 → QA | Scene assets + manifest (QA-038/039), `certify` branch (QA-041), cert Playwright config (QA-018), `certify-pr.yml` (QA-031), `certify-main.yml` `certify / cert-scene` (QA-032), L5 Behaviour (QA-082), L6 (QA-056), L10 (QA-085), deletion of 4.x cert scripts (QA-115, QA-119), review records (QA-099/100), jest config (QA-003) | QA-003, QA-018, QA-031, QA-032, QA-038, QA-039, QA-041, QA-056, QA-082, QA-085, QA-099, QA-100, QA-115, QA-119 | **Yes** for REQ-SB-02/04/40 and AC-SB-07/10/12/13 |
| perf policy → PERF | Runtime budget rows and harness (SC-15) | PERF-039 | Yes for AC-SB-13 |
| PRD-21 → EXP (interim) | Separate labs Storybook for removed experimental stories | — | No |

## 20. Execution order

1. **Wave 1 (with PRD-19 start).** REQ-SB-50..57: rewrite `deploy-storybook.yml` permissions, add build manifest and `verify-fresh.mjs`, wire every `storybook-static` consumer. Remove the Storybook-side callers of the 4.x certification (REQ-SB-41; PRD-19 deletes the script). Back-port permissions and freshness to `release/4.x`.
2. Add the six `auraglass/story-*` rules to `eslint-plugin-auraglass.js` (after PKG-015) in `warn` with the `scripts/storybook/story-lint-baseline.json` ratchet (REQ-SB-30..32). Migrate test imports to `storybook/test` and remove deprecated packages (REQ-SB-45); add `tsconfig.storybook.json`.
3. Once PRD-19 lands `certification/scenes/` (REQ-QA-10): land `scenes.ts`, `scene-presentation.json`, the `staticDirs` mount and `scene-bands.test.mjs` (REQ-SB-04).
4. **Wave 2 (after PRD-04/PRD-05 emit).** Replace `StorySurface` with `StoryEnvironment` + `StoryRoot`; single `AuraGlassProvider` decorator; globals; motion follows OS (REQ-SB-01..07). Land `Scenes/*` cert stories and `cert-manifest.json` (REQ-SB-40..43) so PRD-19 can run gates on `Surface`.
5. Build the Material Lab harness (REQ-SB-18..21) against `Surface` and compiler constants; PRD-04 lands its `src/material/stories/*` on it.
6. **Wave 3 (with PRD-07).** Build `defineComponentStories` and prove it on Button and Dialog (story files authored by CTL-059 and OVL-055; this PRD runs the contract test against them), including the `Keyboard` story linked to PRD-05's APG spec and MDX docs (REQ-SB-12, -15, -17). New `storySort` and Start Here generator (REQ-SB-08..11).
7. Delete the galleries, aliases, showcase stories and 4.x certification stories (REQ-SB-14, -27, -33); RM-08 deletes the showcase/demo sources with the C-D for `LiquidGlassShowcase` in 4.3.
8. **Wave 4 (per flagship family, alongside PRD-08..14 and PRD-16).** One PR per family: the component PRD lands its contract story files and deletes absorbed 4.x stories (with the matching FND RM squash PR); this PRD lands the family's MDX docs pages and makes the contract/index tests cover the family.
9. Build showcases as their flagships certify: S1-3 ops console (from `AppChromeVisualBaseline`) and S1-2 financial dashboard first, then S1-1, S1-4, S1-5, S1-6, then S2-1..S2-4 (REQ-SB-22..26). Wire the packed-tarball import check.
10. Flip `auraglass/story-*` to `error` at count 0 before beta; remove `main.ts` backend externals once PRD-16 lands (REQ-SB-46).
11. **Wave 5.** Versioned deploy paths and redirects (REQ-SB-52); full PRD-19 matrix on S1; perf budgets; manual a11y and human visual review on remote captures; sign AC-SB-01..19 at RC.

## 21 Open items

Reconciled on 2026-10-06 against `prd/_shared-contracts.md` (SC-01..SC-40) and the SB section of `prd/_verification-remaining-concerns.md`. Items resolved in this file are listed first so the verification concerns can be closed; open items name an owner and the exact closing action.

### 21.1 Resolved here

| Concern (source) | Resolution |
|---|---|
| Sibling PRDs must adopt the Lab harness, showcase placement and AppShell deletion (verification SB-1) | Ratified by SC-31. Task level already aligned: MAT-086/088 use `.storybook/lab/**` and the REQ-SB-18 order, MAT-090 is a contract check of SB-048; AI-079/080, DATA-123, MED-161, NAV-144 MODIFY `showcase/<id>/`; NAV-105 only verifies SB-106, which now deletes both `src/stories/AppShell.stories.tsx` and `AppChromeVisualBaseline.stories.tsx` (REQ-SB-27, deviation 5). Remaining PRD-text edits are O-SB-01 and O-SB-03 |
| PRD ids do not match §16 (verification SB-3) | Header `Key` = SB plus the §16 → key crosswalk (SC-01); `tasks/SB.json` `depends_on` holds task ids only (SC-40) |
| `glassOpacity` global and value names (verification A11Y) | §4.2 adds `glassOpacity` (0, 0.5, 1) and uses `system`/`standard` (SC-23) |
| How the lint rules identify "a library component or its ancestor" (verification SB-8) | REQ-SB-30 defines it by import specifier (`^aura-glass(/|$)`, or relative import into `src/**` for colocated stories) and same-tree JSX ancestry; no type information needed |
| Showcases lifted into blocks vs blocks authored new (verification DX) | §11: blocks are DX-owned at `registry/blocks/<id>/` (SC-32) and authored new; showcases are separate and neither imports the other |
| Lint namespace | SC-16: rules are `auraglass/story-*` in `eslint-plugin-auraglass.js`; the separate `eslint-plugin-aura-stories` package is dropped |
| Test layout | SC-30: suites moved to `tests/storybook/`, `tests/showcase/`, `tests/lint/story-rules/*.test.ts`; `jest.config.js` roots added by MODIFY on QA-003 |
| Ready attribute | SC-21: `data-ready` renamed `data-ag-cert-ready`; QA-041 mirrors it to `body` in certify mode |
| Visual gate workflow (SC-09) | No `main` edit of `visual-regression.yml` (QA-119 deletes it); freshness is wired in `certify-pr.yml` (QA-031) and the cert config (QA-018); the 4.x guard exists only in the `release/4.x` back-port |
| Deploy gate check name | `certify / cert-scene` is defined by QA-032 in `certify-main.yml`; SB-004 depends on it |
| Storybook resolution vs PKG-115 (verification SB-4, part) | REQ-SB-47: CI/evidence builds resolve to `dist/` via the exports map (`AG_STORYBOOK_DIST=1`, PKG-115); the dev server may keep the `src` alias |
| "Exactly these exports" vs owner-authored extra stories | REQ-SB-12 now requires at least the contract set; extra owner stories stay within the REQ-SB-11 cap |
| GlassSwitch shimmer removal on the D-28 4.2 visual-fix list (verification FND/CTL, "PRD-17") | That "PRD-17" is §16's 4.2/4.3 bridge, interim-owned by PRD-REL (SC-37), not this PRD. No SB action |

### 21.2 Open

| ID | Item | Owner | How to close |
|---|---|---|---|
| O-SB-01 | MAT PRD §13 text still has to say `.storybook/lab/**`, the REQ-SB-18 order and drop "no provider dependency" (SC-31 "Must change"); tasks already comply | MAT | Edit `AURAGLASS_MATERIAL_ENGINE_PRD.md` §13; SB-068 (order test) and SB-079 then pass with no MAT-side override |
| O-SB-02 | Architecture §16 still puts the Material Lab under PRD-19 (deviation 1) | Architecture owner (erratum E-07) | Update §16 to the SB harness / MAT stories split and the `AURAGLASS_*_PRD.md` file names |
| O-SB-03 | Media PRD REQ-MED-77 still names `.storybook/assets/scenes/**` | MED | Retarget REQ-MED-77 to `certification/scenes/` (SC-28); `./backdrops` presets must not import from `.storybook/` or `certification/` |
| O-SB-04 | Component story tasks (e.g. CTL-059: tags `["certified"]`, `parameters.ag.tier`, stories `Overview`/`Density`) do not yet use the REQ-SB-12 export names (`Playground`, `States`, …) or the §4.4 tags (`flagship`/`core`/`apg`) | CTL, OVL, NAV, DATA, AI, MED, FND (each story owner) | Each owner adopts the REQ-SB-12 required set and §4.4 tags in its story task; `tests/storybook/story-contract.test.ts` (SB-079) fails per family until it does. If PRD-QA needs `certified`, it is added as an extra tag, not a replacement |
| O-SB-05 | Whether Storybook Vite resolves `aura-glass` through a workspace self-reference at HEAD is unverified (verification SB-4); REQ-SB-23 depends on the TRUST-002 pack helper | SB (with PKG) | SB-051 first CI build with `AG_STORYBOOK_DIST=1` logs the resolved path of `aura-glass/material`; if the self-reference fails, use PKG-115's dist alias only and record it in `.storybook/README.md` |
| O-SB-06 | REQ-SB-52 assumes GitHub Release assets as the version store and that Pages can deploy from Actions to the existing cname; not checked against repo settings (verification SB-5) | SB (repo settings change by a repo admin) | Read-only `gh api repos/auraoneai/auraglass/pages` must show `build_type: workflow` and `cname: storybook.aura-glass.auraone.com`; if `legacy`, a repo admin switches the source to GitHub Actions. The tag run attaches `storybook-static-<version>.tar.gz` (SB-006 assemble step fails closed when an asset is missing) |
| O-SB-07 | Cloudflare Pages project `auraglass-storybook` and its scoped repo secret do not exist (verification SB-6) | SB (infra, existing Cloudflare account) | Provision the Pages project under the existing account per `~/.config/agent-policy/reference/cloudflare.md`, store a project-scoped token as a repo secret (never printed or committed); until then SB-005 skips and posts no comment, by design |
| O-SB-08 | 44/44 flagship counts (Keyboard stories, MDX pages, S1 union) put this PRD's GA on every flagship PRD's critical path (verification SB-7) | CTL, OVL, NAV, DATA, AI, MED (flagship owners) | Accepted risk; per-family expected counts in SB-079/SB-080 ratchet to 44 by RC. No waiver below 44 |
| O-SB-09 | §16 fps/LCP/long-task budgets are uncalibrated (verification SB-9) | PERF (calibration at 5.0.0-alpha.1, SC-15) | PERF records calibrated rows in `tests/perf/harness/budgets.json`; SB's rows may then only ratchet down |
| O-SB-10 | SC-24 Button grammar (4.x `primary/secondary/ghost/danger` → `prominent` / `variant="regular"` / `variant="identity"` / `intent="danger"`) is listed for human confirmation; the generated `Matrix` axes and S2-3 "Button (`prominent`)" depend on it | FND (owner), human confirmation | Confirm SC-24; if it changes, only the metadata-driven axes change, no SB code edit |
