# PROMPT-18d (QA): Scenes, `certify:1` mode, matrix, pixel/OCR/material gate library

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §3 items 3–4, §4.4, §4.5, §5.2, §12.1, §13, §14, §15 item 7, §16 (scenes ≤6 MB).
Requirements: REQ-QA-10, -11 (decorator), -12, -13, -14, -15, -16, -17, -73 (the library and its unit tests; the lane specs are 18e). Acceptance: AC-QA-04, AC-QA-02 (matrix half), AC-QA-05 (detector half). Tasks: QA-038..QA-055.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture. Record deviations with evidence.
- Remote only for anything that renders. That covers dense-text generation, OCR fixture PNG rendering and any Storybook check: GitHub-hosted runners in the cert image, or `auraone-remote-run`. Read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` first. Never use a browser or Docker on the Mac.
- Locally allowed: `node_modules/.bin/jest packages/qa/test/{scenes-manifest,matrix-prune,thresholds,pixel-gates,material-presence,preference-delta,readback,console-gate,exemptions,focus-contrast}.test.ts` and `node certification/scenes/generate.mjs` (pure pngjs, no browser). `ocr-contrast.test.ts` needs the tesseract binary, so it runs in the cert container in CI.
- No fake completion: none of the following are allowed: hand-typed manifest statistics, scenes that miss a band (replace the asset, never relax the band), thresholds other than the numbers below, gates that return pass when inputs are missing, or `.skip`.
- Licences: `photo`/`dark-media` must be CC0-1.0 (record source URL + author) or owned. Downloading a CC0 file is allowed. Uploading project data anywhere is not.
- Leave the uncommitted PRD-TRUST files alone. Never commit captures.

## Prerequisites
1. 18a merged: `test -f packages/qa/src/inventory/buildInventory.ts && test -f certification/thresholds.json`.
2. 18b QA-017 image digest exists (needed for the OCR test and remote rendering): `test -f certification/image.lock.json`.
3. Soft: PRD-DS `tokens/generated/opacity-floors.json` (REQ-DS-15). If it is missing, `materialPresence` returns `provider missing` and the fixture test uses `packages/qa/fixtures/presence/opacity-floors.json`.
4. Soft: Storybook PRD `StoryRoot` `[data-ag-story-content]` (REQ-SB-05) and whether `PROMPT_17c` has rewritten `.storybook/preview.tsx`. Check `rg -n "data-ag-story-content|StorySurface" .storybook`. Add the `certify` branch to whichever structure exists.

## May touch
NEW `certification/scenes/**` (8 stills + `video-frame.webm` + `scenes.manifest.json` + `generate.mjs`), NEW `certification/matrix.config.ts`, `certification/thresholds.json` (add the 5.0 keys), NEW `certification/console-allowlist.json` (`[]`), NEW `certification/exemptions.json` (`[]`), NEW `packages/qa/src/matrix/{axes,prune,force,shard,readback}.ts`, NEW `packages/qa/src/pixel/{notBlank,separation,frameFill,density,neon,intentDeltaE,containment,materialPresence,preferenceDelta,focusContrast}.ts`, NEW `packages/qa/src/ocr/{tesseract,textHiddenTwin,wordContrast}.ts`, NEW `packages/qa/src/gates/{console,exemptions}.ts`, NEW tests and fixtures under `packages/qa/{test,fixtures}`, and `.storybook/preview.tsx` (the `certify` branch only).

## Must not touch
Non-cert behaviour in `.storybook/**`, including the `environment` toolbar global (owned by the Storybook PRD and PRD-MAT); `.storybook/main.ts` (`staticDirs` is the Storybook PRD's); `src/**`; `tokens/**`.

## Steps
1. **QA-038/039/040** Scenes. `generate.mjs` produces `flat-white`, `flat-black`, `hf-pattern` and `saturated-abstract` deterministically, and writes manifest statistics computed from the pixels. `dense-text` is ≥400 OCR-readable words of public-domain prose, rendered once in remote Chromium. `photo` and `dark-media` are CC0 or owned. Every still is ≥2880×1800 and the total is ≤6 MB. The bands from REQ-SB-04 must hold:
   - flat-white mean ≥245
   - flat-black mean ≤12
   - dark-media mean ≤70
   - video-frame still mean ≤100
   - photo and saturated-abstract stddev ≥40
   - saturated-abstract colourfulness ≥60
   - hf-pattern: ≥30% of 8×8 blocks with a range ≥40
2. **QA-041** `certify` global (0|1). In cert mode:
   - render no `StorySurface`, no `ContrastGuard`, no SkipLinks and no padding
   - drop the forced `reducedMotion: true` (`:168-174`)
   - paint the scene as `<body>` background (`cover/center/fixed`, `/scenes/<file>`)
   - the only wrapper is `[data-ag-story-content]`
   - set `body[data-ag-cert-ready="true"]` after `document.fonts.ready` and two rAFs
3. **QA-042/043** Matrix. Axes and prune rules as in §4.4. Counts are computed, never constants: T0 180, flagship 148 (+32), T2 29, PR-reduced 24. `force.ts` sets the `data-ag-*` attributes and `emulateMedia`. `shard.ts` = `ceil(captures ÷ (rate × 3600))`, with the rate taken from the last manifest for the host. The AC-QA-02 stub-subject test: one new flagship subject in a fixture manifest adds exactly 148 cells.
4. **QA-044** Add the 5.0 threshold keys with exactly the values listed in task QA-044. `thresholds.test.ts` pins them.
5. **QA-045/046** Pixel gates, as pure functions with fixture tests at the PRD boundary values: 39 vs 40 deviation, 24.9% vs 25% separation, 1.01% neon, 4 hue families, ΔE 9.9 vs 10, right-edge contact at 390, density 0.31, 7 fine / 4 coarse layers.
6. **QA-047/048** Material presence:
   - σ<4 under the surface while the scene σ≥20 → `glass-over-nothing`
   - white−black interior delta ≥30 for regular
   - delta ≤ (1−floorAlpha)·255+5, with `floorAlpha` read from `opacity-floors.json`
   - the 4.x-like 255/22 fixture with floorAlpha 0.30 fails
7. **QA-049/050** OCR:
   - tesseract 5, `--psm 11`, TSV output, 2× Lanczos-3 upscale written in-house (no `sharp`), confidence ≥60
   - glyph median vs the median of the same box in the text-hidden twin
   - floors: large-text 3:1, body 4.5:1, contrast-more 7:1
   - APCA reported but never gated
   - the "legible text exists" rule
   - the banned-copy regex for `scene`/`showcase` kinds
   - the OCR fixture PNGs are rendered remotely from `packages/qa/fixtures/ocr/*.html`, ≤40 KB each
8. **QA-051** Preference deltas (REQ-QA-15): `preference-noop` on a zero delta. **QA-052** Label read-back (REQ-QA-17): `label-mismatch`. **QA-053** Console gate, with an allowlist of ≤90-day entries that starts empty. **QA-054** Exemptions (≤180 days). `ocr-contrast` and `console` cannot be exempted. **QA-055** Focus-indicator contrast ≥3:1.

## Tests (named)
`packages/qa/test/scenes-manifest.test.ts`, `matrix-prune.test.ts`, `thresholds.test.ts`, `pixel-gates.test.ts`, `material-presence.test.ts`, `ocr-contrast.test.ts` (in the cert container on CI), `preference-delta.test.ts`, `readback.test.ts`, `console-gate.test.ts`, `exemptions.test.ts`, `focus-contrast.test.ts`. Remote: a `workflow_dispatch` run that builds Storybook with `certify:1` and screenshots the 8 `scenes--*` stories (if they exist), plus one flagship in chromium, so a human can check that the stage is gone.

## Visual evidence
Remote screenshots of `iframe.html?id=<id>&globals=environment:<scene>;certify:1` for each of the 8 scenes, uploaded as an artifact (retention 14) for human review. Also contact sheets of the 8 scene assets from `generate.mjs --contact-sheet` (artifact, not committed).

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-04 | 8 scenes with licence entries; `scenes-manifest.test.ts` green; total ≤6 MB |
| AC-QA-02 (matrix) | `matrix-prune.test.ts` stub-subject case green; no count constants (`rg "\b(470|498|356|180|148|29)\b" packages/qa/src/matrix certification/matrix.config.ts` = 0) |
| AC-QA-05 (detector) | `material-presence.test.ts` opaque-ancestor case green. The 3-engine lane proof is in 18e |
| REQ-QA-11 decorator | Remote screenshot artifact + DOM dump shows no `StorySurface`/`glass-contrast-guard` under `certify:1` |

## Final report
```
PROMPT-18d REPORT
SHA / PRs:
Tasks QA-038..055: status each
Scenes: id, licence, source, mean, stddev, bytes (from manifest) + band check result
Tests: name -> pass/fail (CI URL for container-only tests)
Remote visual artifact: <run URL> <artifact name>
AC-QA-04 / -02 (matrix) / -05 (detector): status
Deviations / Operator actions:
```
