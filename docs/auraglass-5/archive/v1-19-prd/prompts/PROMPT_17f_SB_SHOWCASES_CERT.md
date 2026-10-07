# PROMPT-17f (SB): Application showcases, lint flip and release certification

You are implementing the final part of PRD-SB (key SB, self-id alias PRD-17; Storybook, Material Lab and Showcase) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRD numbers use architecture §16 numbering (PRD-02 packaging = PKG, PRD-08..14 flagship/core = CTL, OVL, NAV, DATA, AI, MED, FND, PRD-15 enhanced = MAT interim, PRD-16 removal = FND, PRD-18 registry = DX, PRD-19 certification = QA, perf policy = PERF). Task `depends_on` uses task ids only (SC-40). Ownership (SC-31, PRD deviation 5): you create the files under `showcase/<id>/` (ids `ai-command-center`, `financial-dashboard`, `ops-console`, `media-workspace`, `collaborative-workspace`, `mobile-productivity`, `music-player`, `spatial-control-center`, `ecommerce`, `analytics`) and own the import/lint/determinism/tag contract. Area PRDs then supply compositions by MODIFY tasks that depend on your file-creating task: AI-079/AI-080 → `ai-command-center` (`PROMPT_13e_AI_CERTIFICATION.md`); DATA-123 → `financial-dashboard`, `analytics`, `ops-console` data (`PROMPT_12i_DATA_CERTIFICATION.md`); MED-161 → `music-player`, `media-workspace` (`PROMPT_14h_MED_CERT_MIGRATION.md`); NAV-144 → shell parts of `ops-console`, `collaborative-workspace`, `mobile-productivity` (`PROMPT_11g_NAV_SOURCE_META_STORIES.md`). NAV's `src/app-shell/AppShell.stories.tsx` (NAV-101) stays under `Flagships/App Shell`. Registry blocks are DX's (SC-32, `registry/blocks/<id>/`); a showcase never imports a block or vice versa.

Each showcase (SB-105..SB-116) is one PR. Run it as its own session with this prompt, scoped to that task, once its flagships are certified by their PRD. The shared gates (SB-100..SB-102) land first; SB-103/SB-104 land with the first showcase and are extended per showcase, completing after all ten and their compositions. The release tasks (SB-117..SB-125) run at beta/RC.

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` deviations 2 and 5, §3 item 6, §4.6, §5.D REQ-SB-22..27 (incl. the S1/S2 table), §5.E REQ-SB-32, §11 (licensing, registry), §12 (showcase rows), §14–16, §17 AC-SB-08, -09, -12, -13, -19, §18, §20 steps 9–11.
- Architecture §11.2 (44 flagships), §15.1 matrix, §15.2 manual lanes, §15.4.
- PRD-19 `prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (pixel gates, OCR, perf lanes); the Performance PRD `prd/AURAGLASS_PERFORMANCE_PRD.md` REQ-PERF-33 (blank-story baseline).
- Tasks: `docs/auraglass-5/tasks/SB.json` SB-100..SB-126 (SB-126 registers the §16 runtime budget rows in PERF's file).
- Shared contracts `docs/auraglass-5/prd/_shared-contracts.md`: SC-15 (runtime budgets in `tests/perf/harness/budgets.json`, owner PERF), SC-29 (lane names), SC-31, SC-32, SC-40.

Requirements: REQ-SB-22, -23 (tarball check), -24, -25, -26, -27 (ops-console seed), -32 (flip), plus PRD §14 responsive, §15 a11y and §16 perf. Acceptance: AC-SB-08, AC-SB-09 (final), AC-SB-12, AC-SB-13, AC-SB-19, and the AC-SB-01..19 RC sign-off.

## 2. Scope
May create or modify:
- NEW `showcase/<name>/` for `ai-command-center`, `financial-dashboard`, `ops-console`, `media-workspace`, `collaborative-workspace`, `mobile-productivity`, `music-player`, `spatial-control-center`, `ecommerce`, `analytics`. Each folder holds `<Name>.showcase.tsx`, `<Name>.stories.tsx`, `<name>.module.css`, `data.ts`, `copy.ts` and `assets/` (≤12 licensed AVIF ≤300 KB each, plus `assets/LICENSES.json` with SPDX/grant per file).
- NEW `tests/showcase/{showcase-coverage.test.ts,showcase-determinism.test.ts,showcase-imports.test.mjs}`
- NEW `scripts/storybook/verify-showcase-imports.mjs`, NEW `scripts/storybook/check-build-size.mjs`
- NEW `stylelint.showcase.config.mjs` (or an override in PRD-02's stylelint config if one exists); `package.json` devDependency `stylelint` exact pin, scripts `lint:showcase-css`, `verify:showcase-imports`
- `eslint.config.js` (rule severities `warn` → `error`, SB-117 only), `scripts/storybook/story-lint-baseline.json`, `tsc-stories-baseline.json` (to 0)
- `.github/workflows/storybook-tests.yml`, `.github/workflows/deploy-storybook.yml` (add the size check step only)
- `.storybook/README.md` (rewrite)
- Deletes: `src/stories/AppChromeVisualBaseline.stories.tsx` (after S1-3) **and** `src/stories/AppShell.stories.tsx` (6 aliases) in the same task SB-106 (single remover, SC-31/OV-18; NAV-105 only verifies), `examples/dashboard.tsx` and `examples/page-button-spacing.tsx` (after S1-2)
- `tests/perf/harness/budgets.json` (SB-126, MODIFY of PERF-044's file: add rows only)

Must NOT touch: component source, `.storybook/contract/**`, `.storybook/lab/**`, `.storybook/environment/**`, `certification/**`, `registry/**` (DX, SC-32), `tests/perf/harness/run-perf.mjs` (PERF-039). Showcases may not import `.storybook/**`, `src/**`, `@/**` or `aura-glass/compat`, and may not use any 4.x `Glass*` name.

## 3. Prerequisites
- 17e framework merged: `test -f .storybook/contract/defineComponentStories.tsx && test -f tests/storybook/storybook-index.test.mjs`.
- PRD-02 packed tarball works: `npm pack --dry-run --json` lists `dist/` entries for every subpath the showcase imports (`aura-glass`, `aura-glass/material`, `/app-shell`, `/data`, `/date`, `/ai`, `/media`, `/backdrops`). Run the real `npm pack` only in CI.
- Per showcase: every listed flagship is exported from a public entry and its PRD reports it certified. Create the `showcase/<id>/` files first; the composition owner (AI-079/080, DATA-123, MED-161, NAV-144) then fills them by MODIFY. If an owner's composition task hasn't landed, keep the showcase at its SB-authored skeleton built from the owner PRD's spec, mark the task blocked on that owner task id, and don't fill in the owner's fixtures yourself.
- Showcase images: licensed for redistribution on a public static site (PRD §11). If none are available, use generated fixtures (SVG/canvas rendered to AVIF at build time, committed as files) and record the substitution.

## 4. Shared gates (SB-100..SB-104)
1. **SB-100 stylelint**: `declaration-property-allowlist` on `showcase/**/*.module.css` allows only `display`, `/^grid/`, `/^flex/`, `gap`, `/^(row|column)-gap$/`, `padding*`, `margin*`, `inline-size`, `block-size`, `/^(min|max)-/`, `position`, `/^inset/`, `overflow*`, `/^container/`. It also enforces `declaration-no-important: true` and `color-no-hex: true`, with `function-disallowed-list: ['rgb','rgba','hsl','hsla','oklch','color-mix']`. Add a fixture test for one allowed and one rejected property.
2. **SB-101 `verify-showcase-imports.mjs`** (CI only):
   - `npm pack` → temp dir → `npm init -y && npm i <tgz> react@<repo version> react-dom@<repo version>`.
   - Copy `showcase/` there and run a Vite library build of every `*.showcase.tsx` with default consumer resolution.
   - Fail on any unresolved import, or any import path not in the tarball's `exports`.
   - **SB-102** `showcase-imports.test.mjs` wraps it and adds a negative fixture importing `aura-glass/src/...` that must fail.
3. **SB-103 `showcase-coverage.test.ts`** (Jest, `composeStories`):
   - For each full-page story, assert that each listed component's root `data-ag-part` is present (map name → part from PRD-07 metadata).
   - Assert that the union over S1-1..S1-6 equals the 44 §11.2 flagships.
   - At `matchMedia('(max-width: 390px)')`, assert the collapsed parts exist: Sidebar becomes a drawer `Sheet`, and Inspector becomes a bottom `Sheet`.
   - Assert one `<main>`, a skip link as the first focusable element, ordered headings, and named landmarks. S1-1's Thread must be `role="log"`.
4. **SB-104 `showcase-determinism.test.ts`**: render each showcase story twice in fresh module registries and compare `container.innerHTML` exactly. Also scan sources: `Math.random`, `Date.now`, `new Date()` without an argument, `fetch(` and `setTimeout`/`setInterval` in `showcase/**` = 0. Times derive from the fixed epoch `2026-03-02T09:30:00Z` passed as a `now` prop.

## 5. Showcase recipe (SB-105..SB-116, one PR each)
For each row of the PRD §5.D table:
- **Files and tags.** `<Name>.showcase.tsx` exports `<Name>Showcase({ now })` built only from public entries. `<Name>.stories.tsx` has title `Showcases/<Title>` and tags `showcase-s1` or `showcase-s2`. It exports one full-page story `Page` (`layout: 'fullscreen'`, `globals.environment` = the row's default scene) plus 2–4 fragment stories named exactly after the row's fragments.
- **Data and copy.** `data.ts` uses a local seeded PRNG (mulberry32, seed constant) for fixtures. `copy.ts` holds product-realistic strings: no AuraGlass/glass/certification/Storybook meta copy, no banned strings, and ≥1 region with ≥40 text runs.
- **Styling.** Layout comes from the CSS module only. There are 0 `style` props setting `background*`, `backdrop*`, `filter`, `box-shadow`, `border*`, `color`, `opacity` or `mix-blend-mode`, and no `[data-ag-part]` selectors. Use 0 `!important`.
- **States.** Overlays open through `defaultOpen` or controlled `open` args. `StreamingText` is controlled by a `step` arg.
- **Responsive.** Each showcase renders at 1440 and 390 via `AppShell` container queries; S1-6 is also checked at 834.
- **S1 play.** Each S1 showcase has ≥1 `play` (tag `interaction`) covering its primary task:
  - S1-1: send a message, then approve a `needs-approval` ToolCall, and assert the ToolCall state becomes `approved`.
  - S1-2: sort the Table by amount, select 2 rows, and change the currency `Select`.
  - S1-3: filter the incident Table, open the AlertDialog, and confirm.
  - S1-4: scrub the `Slider` and open the inspector `Sheet`.
  - S1-5: open the Share `Dialog`, add 2 people in the multi `Combobox`, and close with Escape.
  - S1-6: move the `Sheet` through 3 detents and toggle a `Switch` in settings.

Order and specifics:
- **SB-105** S1-3 `ops-console` (`flat-black`) is seeded from `src/stories/AppChromeVisualBaseline.stories.tsx:167-168`. **SB-106** then deletes that file (REQ-SB-27).
- **SB-107** S1-2 `financial-dashboard` (`flat-white`). Its Table has 10,000 virtualized rows and a sticky header. **SB-108** then deletes `examples/dashboard.tsx` and `examples/page-button-spacing.tsx`.
- **SB-109** S1-1 `ai-command-center` (`dark-media`). ToolCall appears in all 5 states.
- **SB-110** S1-4 `media-workspace` (`video-frame`). This is the canonical `clear`-over-media demonstration. Video is muted, has a pause control and doesn't autoplay under reduced motion.
- **SB-111** S1-5 `collaborative-workspace` (`saturated-abstract`).
- **SB-112** S1-6 `mobile-productivity` (`photo`, 390×844). Includes `GlassPreferencesPanel` and `SourceTransition`.
- **SB-113** S2-1 `music-player` (`photo`).
- **SB-114** S2-2 `spatial-control-center` (`hf-pattern`). `refraction` is on one chrome surface; it is labelled inert off Chromium and doesn't block while PRD-15 is uncertified.
- **SB-115** S2-3 `ecommerce` (`photo`). Includes `Button prominent` and a cart `Sheet`.
- **SB-116** S2-4 `analytics` (`dense-text`).

## 6. Release tasks
1. **SB-117 flip (REQ-SB-32, before 5.0 beta).**
   - Set all six `auraglass/story-*` rules to `error`.
   - `scripts/storybook/story-lint-baseline.json` reaches 0/0 for optics, `!important`, copy and timers.
   - `tsc-stories-baseline.json` reaches 0; replace `count-tsc-errors.mjs` with plain `tsc --noEmit -p tsconfig.storybook.json`.
   - `static-gates.mjs` runs with no ratchet keys.
   - Removing violations is done by the 17e family PRs; this task only flips. If anything is non-zero, report the files and stay blocked.
2. **SB-118 `check-build-size.mjs`** (in `deploy-storybook.yml` `build`):
   - `storybook-static` total excluding `*.map` must be ≤60 MB.
   - Report gzip preview-iframe JS for the `scenes--photo` story and fail if it is >10% above the previous release's `ag-build.json` value. Add a `previewJsGzip` field via `write-build-manifest.mjs` (one-line additive change).
   - Build time ≤6 min is reported.
3. **SB-126 then SB-119 perf (AC-SB-13).** SB-126 registers these rows in PERF's `tests/perf/harness/budgets.json` (file PERF-044; calibration by PERF at alpha, O-SB-09). SB-119 runs them through PERF-039 `run-perf.mjs` in PRD-19 L10 Performance (QA-085) on the remote harness (4× CPU throttle, 390×844 DPR 3; 1440×900 at 120 Hz), for all 10 showcases plus the Material Lab Overview:
   - visible blurred surfaces ≤6 at fine pointer and ≤3 at coarse pointer, with ≤2 refracting;
   - 0 infinite animations after settle;
   - scripted hover+scroll p50 ≥110 fps desktop and ≥55 fps mobile;
   - long tasks ≤2 over 50 ms and none over 150 ms, as a delta over the REQ-PERF-33 blank story;
   - LCP ≤1.8 s desktop and ≤2.8 s mobile;
   - showcase assets ≤12 × 300 KB.
4. **SB-120 pixel gates (AC-SB-12, AC-SB-07)** via PRD-19 L6 Environment visual (QA-056; `certify / cert-scene`, QA-032) and L7 Pixel regression:
   - S1 at the full §15.1 matrix and S2 at the reduced matrix;
   - OCR worst-case contrast ≥4.5:1 body (7:1 under `contrast: more`), glass density ≤0.3, material presence pass, frame fill ≥3%;
   - also all 8 `scenes--*` across the §15.1 axes.
5. **SB-121 manual a11y (§15, GA blocker):** VoiceOver/Safari and NVDA/Chrome walkthroughs of S1-1, S1-2 and S1-6 by a human (PRD-19 L13 Manual SR), recorded against A11Y-084's `tests/a11y/manual/sr-record.schema.json` through QA-100 as a SHA-bound artifact. You prepare the script and the remote-preview URLs; you don't run the screen readers or claim the result.
6. **SB-122 human visual review (AC-SB-19):** S1-1..S1-6 remote captures at 1440 and 390 in light and dark, reviewed for specular quality, optical hierarchy, radius rhythm and "reads as one hand". Assemble the artifact index; sign-off is human (PRD-19 L14, rubric and schema QA-099, recorded via QA-100).
7. **SB-123 `.storybook/README.md`:** document the story contract, globals table, tags table, lint rules, ready signal, cert-manifest schema, and the remote-only validation rule. Keep it under 300 lines.
8. **SB-124 interactions (AC-SB-10):** the `vitest` job shows ≥6 S1 `play` flows and the Lab round-trips at 100% pass on the RC SHA.
9. **SB-125 RC sign-off:** one AC-SB-01..19 table with, per row, the CI run URL, artifact name and SHA (D-32). AC-SB-16 comes from 17a's procedure at the tag.

## 7. Tests to run
Local (light): `./node_modules/.bin/jest tests/showcase/showcase-coverage.test.ts tests/showcase/showcase-determinism.test.ts` and `./node_modules/.bin/stylelint "showcase/**/*.module.css" --config stylelint.showcase.config.mjs`. Remote: `storybook-tests.yml` (`lint-gates`, `vitest` shards, `showcase-imports`), `deploy-storybook.yml` (build, size), and PRD-19 `certify-*` lanes. Attach run URLs.

## 8. Integrity rules (binding)
- No hard-coded "certified" flags. No fake data loaders.
- Don't swap a listed flagship for a 4.x component or a hand-built look-alike. If a flagship isn't ready, the showcase is blocked.
- No `!important`, inline optics or tone classes. No `eslint-disable`/`stylelint-disable` for these rules.
- No lowered perf or pixel thresholds. Don't exclude a viewport, scene or showcase.
- No `.skip`/`.only`, no `-u` snapshot updates.
- Don't claim human review or a screen-reader result you didn't receive.
- No local browser, no local Docker.

## 9. Exit criteria
- AC-SB-08: 10 showcases; `showcase-coverage.test.ts` green; S1 union = 44/44; `showcase-imports.test.mjs` green in CI.
- AC-SB-09: rules at `error`, 0 violations, baselines 0/0, 0 disables.
- AC-SB-12: PRD-19 gates pass with the thresholds above.
- AC-SB-13: all §16 budgets met, with the measured table.
- AC-SB-19: human sign-off recorded (or pending, with the artifact index).
- RC: AC-SB-01..19 table complete with SHA-keyed artifacts.

## 10. Final report format
```
PROMPT-17f REPORT
Branch/SHA (shared|showcase=<id>|release):
Tasks: SB-100..SB-126 -> done|blocked (reason) each
Showcases: id -> flagships present N/listed, play pass, determinism, tarball build
Perf: showcase -> blur count fine/coarse, infinite anims, fps p50 d/m, long tasks, LCP d/m
Pixel gates: S1/S2/scenes -> pass/fail with run URL
Human lanes: SR walkthrough status, visual review status (who/when or pending)
AC-SB-01..19: id -> pass|fail|pending -> evidence URL -> SHA
Deviations: (image substitution, composition ownership, others) with evidence
Files changed / deleted:
```
