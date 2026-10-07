# PROMPT-14a (MED): 4.x line: verify TRUST's 4.1.1 `isStorybookDataMedia` cut, 4.2/4.3 deprecations

You are implementing part of the Media & Backdrops PRD (key **MED**, self-id PRD-14, architecture §16 PRD-13) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRDs are cited by SC-01 key (TRUST, REL, PKG, DS, MAT, A11Y, MOT, FND, CTL, OVL, DX, QA, SB, PERF, EXP); shared contracts by `SC-NN` from `docs/auraglass-5/prd/_shared-contracts.md`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`. Read §1 item 2, §2.1 E-03, §6, §9, §10 (API-MED-02..13), §11, §12.1 (last row), §17 AC-MED-15/16, §18 item 4, §20 steps 1 and 3, §21 (OI-MED-10).
- Shared contracts: SC-02 (root `deprecations.json`, `version: 1`), SC-03 (entry schema and enums), SC-09 (visual-change gate), SC-36 (TRUST owns 4.1.1 contents), SC-37 (§16 PRD-17 bridge, interim owner REL).
- Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md`: §13.1, §14 (D-27 change classes).
- Release PRD `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` REQ-REL-05/-07/-08 (schema, `scripts/release/gen-deprecations.mjs`, `src/internal/deprecations.generated.ts`, `src/internal/warnDeprecated.ts`).
- Trust PRD `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` REQ-TRUST-17 (the 4.1.1 fix you verify, not build).
- Tasks: `docs/auraglass-5/tasks/MED.json` MED-001 and MED-003..MED-012. (MED-002 was merged into MED-001; the mapping work formerly in MED-013 moved to PROMPT-14h as meta `migration` fields + transform, SC-33.)

Requirements: REQ-MED-90 (consumer), REQ-MED-91. Acceptance: AC-MED-16, and the `deprecations.json` and warning half of AC-MED-15.

## 2. Scope

**May modify:**
- `deprecations.json` (repo root; seeded by TRUST-075): entries only, by MODIFY. The schema `docs/schemas/deprecations.schema.json` is REL's (REL-010).
- `warnDeprecated(id)` call sites (helper from REL-072), one per symbol, at render or first use, in:
  - `src/components/media/{LiquidGlassMediaControls,LiquidGlassNowPlayingBar,LiquidGlassPhotoInspector,GlassAdvancedAudioPlayer,GlassAdvancedVideoPlayer,GlassMediaProvider}.tsx`
  - `src/components/media/index.ts` (alias `GlassMediaControls`)
  - `src/components/interactive/{GlassVideoPlayer,GlassImageViewer,GlassGallery,GlassLazyImage,GlassCarousel}.tsx`
  - `src/components/data-display/LiquidGlassCarouselRail.tsx`
  - `src/components/social/GlassVoiceWaveform.tsx`
  - `src/components/ai/GlassMusicVisualizer.tsx`
  - `src/components/marketing/{AuroraBackground,AuroraOrb}.tsx`
  - `src/components/backgrounds/{AtmosphericBackground,GlassDynamicAtmosphere,ParticleBackground}.tsx`
  - `src/components/advanced/{GlassMeshGradient,GlassParticles}.tsx`
  - `src/components/immersive/GlassParticleField.tsx`
  - on `release/4.x` only: `src/components/image-list/{ImageList,ImageListItem,ImageListItemBar}.tsx`
- `src/internal/deprecations.generated.ts`: regenerated only, via `node scripts/release/gen-deprecations.mjs` (REL-070).
- NEW `src/components/media/__tests__/media-backdrops-deprecations-4x.test.tsx`
- NEW `tests/deprecations/media-backdrops-coverage.test.ts`

**Must NOT touch:**
- the 4.1.1 `isStorybookDataMedia` removal in `GlassAdvancedVideoPlayer.tsx:82-83,985-986` and its test `GlassAdvancedVideoPlayer.datasrc.test.tsx`: both are TRUST-025 (REQ-TRUST-17, SC-36). You only verify them.
- any workflow file (`certify-pr.yml` is QA's; `visual-regression.yml` is deleted on `main` by QA-119 and edited only on `release/4.x` by TRUST-062)
- any 4.x public prop type (no C-B on 4.x); visual output of any component (D-27); `src/index.ts` exports; `package.json` dependencies
- `src/primitives/LiquidGlassBackdropSampler.tsx` and `src/hooks/useLiquidGlassBackdrop.ts`, whose entries are MAT's
- the REMOVE-class names `AuroraPro`, `SeasonalParticles`, `GlassAuroraDisplay` and `GlassNebulaClouds`, whose entries are FND's (§16 PRD-16). You only verify them in MED-012.
- any `src/media/**` file

## 3. Prerequisites (check each; if one fails, write a blocker report for the dependent tasks and continue with the others)
- **TRUST-025 (PROMPT_00_TRUST, 4.1.1 vehicle):** `rg -n "isStorybookDataMedia" src/components/media/GlassAdvancedVideoPlayer.tsx` returns nothing on the 4.1.1 commit and `test -f src/components/media/GlassAdvancedVideoPlayer.datasrc.test.tsx`. If not, MED-001/003 are blocked; never apply the fix yourself.
- **TRUST-075 / REL-010 / REL-070 / REL-072:** `test -f deprecations.json && test -f docs/schemas/deprecations.schema.json && test -f src/internal/warnDeprecated.ts && test -f scripts/release/gen-deprecations.mjs`. All are absent at HEAD. Without them, MED-004..012 are blocked. Never write your own warning helper or schema.
- **REL-040 / QA-072 (visual-class gate):** `test -f scripts/release/visual-class.mjs` and the `regression` job exists in `.github/workflows/certify-pr.yml`. Without them, MED-003 is blocked (report; do not build a substitute gate).
- **4.3 work:** `git rev-parse --verify origin/release/4.x`. Without it, MED-011 is blocked.

## 4. Steps
1. **MED-001 (verify).** On the 4.1.1 SHA, confirm TRUST's change: no `isStorybookDataMedia`, `usePosterSurface = !mediaFile.src`, and `./node_modules/.bin/jest src/components/media/GlassAdvancedVideoPlayer.datasrc.test.tsx` green. Confirm the MED-005 warning wiring applies on top without conflict.
2. **MED-003 (remote, verify).** From the 4.1.1 PR's `certify-pr.yml` `regression` artifact, read REL's `visual-class.mjs` result (pixelmatch `threshold: 0.1`, `includeAA: false`, changed when `changedRatio > 0.001`, SC-09): only `GlassAdvancedVideoPlayer` `data:video/` stories may change; every other 4.x cell is unchanged. Any other change fails AC-MED-16.
3. **MED-004.** On `main`, before the `release/4.x` cut at `v4.2.0`, add entries for every §9 name except `ImageList*`, with all SC-03 required fields (`id` `DEP-NNNN`, `kind` `export` unless noted, `status`, `entry`, `symbol`, `since: "4.2.0"`, `removeIn: "5.0.0"`, `replacement`, `codemod`, `automation`, `breaking`, `message` ≤200 chars, `doc`):
   - `LiquidGlassMediaControls`, `GlassMediaControls` → `MediaControls`
   - `LiquidGlassNowPlayingBar` → `NowPlayingBar`
   - `LiquidGlassPhotoInspector` → `ImageViewer.Inspector`
   - `GlassImageViewer` → `ImageViewer`
   - `GlassGallery` → `ImageViewer` + registry item `media-gallery`
   - `GlassLazyImage` → native `<img loading="lazy" decoding="async">`
   - `GlassCarousel`, `LiquidGlassCarouselRail` → `CarouselRail`
   - `GlassVideoPlayer`, `GlassAdvancedVideoPlayer` → `useMediaElement` + `MediaControls` (item `media-video-player`)
   - `GlassAdvancedAudioPlayer` → item `media-audio-player`
   - `GlassMediaProvider` and the `useMedia*` hooks it exports → `useMediaElement` (enumerate with `rg -n "^export (const|function) use" src/components/media/GlassMediaProvider.tsx`)
   - `GlassVoiceWaveform`, `GlassMusicVisualizer` → "no successor until 5.1 (`Waveform`)" (SC-12; updated by MED-167 in 5.1, OI-MED-10)
   - `AuroraBackground`, `AuroraOrb` → `Backdrop preset="aurora"`
   - `AtmosphericBackground`, `GlassDynamicAtmosphere`/`DynamicAtmosphere` → `Backdrop preset="aurora"|"mesh"`
   - `GlassMeshGradient` → `Backdrop preset="mesh"`
   - `ParticleBackground`, `GlassParticles`, `GlassParticleField` → labs `ParticleField` (`@auraglass/labs`, EXP interim owner of §16 PRD-21)

   Set `codemod` to `media-backdrops` (SC-33 area id) where §10 marks the row mostly or full, `imports-subpaths` for pure import moves, and `null` for manual-only rows; `automation` follows §10. Each `message` names the successor and the subpath (`aura-glass/media` / `aura-glass/backdrops`).
4. **MED-005..008.** Wire `warnDeprecated(id)` once per symbol. It must not change render output, must not add a hook that changes render order, and must be silent in production (the helper guarantees this). Do not use `console.warn` directly.
5. **MED-009.** Run `node scripts/release/gen-deprecations.mjs`, then `--check`. Never hand-edit the generated file.
6. **MED-010.** Write `media-backdrops-deprecations-4x.test.tsx`. For each wired id, assert it warns exactly once across two renders, uses the REQ-REL-08 one-line format, and is silent under `NODE_ENV=production`.
7. **MED-011 (`release/4.x`, REL bridge scope).** Add `since: "4.3.0"` entries for `ImageList`, `ImageListItem`, `ImageListItemBar` and their `Glass*` aliases (`rg -n "GlassImageList" src/components/image-list src/index.ts`), with replacement "registry item `media-gallery` (T2 `Grid` + `ImageViewer.Trigger`)". Add their warnings, then forward-port the commit to `main`.
8. **MED-012.** Write `media-backdrops-coverage.test.ts`. It loads the root `deprecations.json` and asserts that every §9 name has an entry with `since`, `removeIn`, `replacement`, and `codemod` set to an SC-33 id or `null`. That covers the MAT-owned sampler names and the FND-owned REMOVE names too: their `message` must contain `Backdrop preset="aurora"` where §9 says so. If an upstream-owned entry is missing, the test fails and you report the owner. Do not add it yourself.

## 5. Tests to run
**Local (light):**
- `./node_modules/.bin/jest src/components/media/__tests__/media-backdrops-deprecations-4x.test.tsx tests/deprecations/media-backdrops-coverage.test.ts`
- `./node_modules/.bin/eslint` on the changed files; `./node_modules/.bin/tsc --noEmit -p tsconfig.json`
- `node scripts/release/gen-deprecations.mjs --check`; `node scripts/release/verify-deprecations.mjs`

**Remote:** the `certify-pr.yml` run for MED-003 (QA-owned) and a Storybook build. Attach the run URLs.

## 6. Visual evidence
For MED-003, link REL's visual-class artifact from the `regression` job, listing changed story ids (only `GlassAdvancedVideoPlayer` `data:video/` stories). A human reviews it from the artifact.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- No mocks of the component under test. No `.skip`/`.only`/`.todo`/`xit`. Never pass `--update-snapshots`/`-u`.
- Do not change REL's tolerance. No 4.x prop removals. No hand edits to `deprecations.generated.ts`.
- Do not create upstream-owned entries, helpers, schemas or the TRUST fix. Do not commit evidence files.

## 8. Exit criteria
- AC-MED-16: MED-001 and MED-003 green (TRUST evidence verified; visual-class reports no other 4.x change).
- AC-MED-15 (deprecation half): MED-004..012 green on `main` (4.2) and on `release/4.x` (4.3); `gen-deprecations --check` and `verify-deprecations` green.

## 9. Final report format
```
PROMPT-14a REPORT
Branches/SHAs: 4.1.1 (TRUST)=… main(4.2 entries)=… release/4.x(4.3)=…
Tasks: MED-001, MED-003..012 -> done|blocked (reason) each
deprecations.json ids added (4.2): […]  (4.3): […]
Upstream-owned ids missing (owner): […]
Visual class (MED-003): changed cells=[…] (artifact URL)
Tests: name -> pass/fail (local|remote URL)
Prereq blockers (owner task id):
Deviations (with evidence) or none
Files changed:
```
