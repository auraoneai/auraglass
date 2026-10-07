# PROMPT-5c (QUAL lane Q3): Scenes and pixel gates

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q3**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5c-Q3"` (17 tasks: QUAL-092..107, 304).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

## Scope

**Owned paths (exclusive inside QUAL):** `certification/scenes/**`, `packages/qa/src/{pixel,ocr,inspect}/**`, `packages/qa/fixtures/**`, `certification/lanes/{environment-visual,preference-modes,console,engine,known-failures}.spec.ts`, `certification/thresholds.json`

**Order inside the lane:** port 4.x measurement + 10 fixtures (-32) → scenes + manifest (-07) → pixel gates, OCR, glass-over-nothing (-12..-18) → engine lane (-22) → known-failures proof on 4.1.0 (AC-QUAL-01)

**Requirements closed by this lane:** REQ-QUAL-03, REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-09, REQ-QUAL-13, REQ-QUAL-14, REQ-QUAL-15, REQ-QUAL-16, REQ-QUAL-17, REQ-QUAL-18, REQ-QUAL-22, REQ-QUAL-32, REQ-QUAL-38, REQ-QUAL-64.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q3 -b next-qual/q3-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5c-Q3") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-092 | CONSOLIDATE | `NEW:packages/qa/src/inspect/{computedStyle,compositedContrast,census,layout,presentation} …` | [§4.3] Move the measurement code of tests/visual/design-system/token-purity-layout-audit.spec.ts:852-2232 (computed-style extraction, composited local contrast, … |  | REQ-QUAL-32 |
| QUAL-093 | CREATE | `NEW:certification/thresholds.json` | [§4.3] Create thresholds.json with "version": 1 and key "legacy4x" holding the 4.x numbers verbatim from token-purity-layout-audit.spec.ts: blur set {16,24,32,40,48}px, … | QUAL-092 | REQ-QUAL-38, REQ-QUAL-05 |
| QUAL-094 | CREATE | `NEW:packages/qa/src/pixel/dhash.ts` | REQ-QA-03: 64-bit dHash over a 9x8 greyscale downscale; captures of different subjects in the same cell with Hamming <=2 AND pixelmatch diff ratio <0.001 -> … |  | REQ-QUAL-03 |
| QUAL-095 | CREATE | `NEW:certification/scenes/scenes.manifest.json` | [REQ-QA-10] Per asset: id, file, sha256, licence (SPDX id or written-grant reference), source (URL/author or "generated: certification/scenes/generate.mjs"), width, … |  | REQ-QUAL-07 |
| QUAL-096 | MODIFY | `certification/thresholds.json` | Add 5.0 keys from REQ-QA-14/-12/-13/-15/-22: notBlank.minDeviation 40; separation.minShare 0.25, separation.minDelta 10; frameFill.component 0.03, frameFill.matrix … | QUAL-093 | REQ-QUAL-15 |
| QUAL-097 | CREATE | `NEW:packages/qa/src/pixel/{notBlank,separation,frameFill,density,neon,intentDeltaE,contai …` | REQ-QA-14 pure functions over decoded PNG buffers + DOM metadata, thresholds from thresholds.json: notBlank (max deviation from scene >=40), separation (>=25% of … | QUAL-096 | REQ-QUAL-15 |
| QUAL-098 | CREATE | `NEW:packages/qa/src/pixel/materialPresence.ts` | REQ-QA-12: (1) for [data-ag-surface] with data-ag-variant in {regular, clear}: sigma(L) of the scene region under the border box in the surface-hidden capture <4 while … | QUAL-097 | REQ-QUAL-14 |
| QUAL-099 | CREATE | `NEW:packages/qa/src/ocr/{tesseract,textHiddenTwin,wordContrast}.ts` | REQ-QA-13: execFile tesseract 5 (--psm 11, TSV output) on a 2x Lanczos upscale (pngjs + own Lanczos-3 resampler, no sharp); words with conf>=60; contrast = WCAG ratio … | QUAL-096 | REQ-QUAL-13 |
| QUAL-100 | CREATE | `NEW:packages/qa/src/pixel/preferenceDelta.ts` | REQ-QA-15 vs the default cell (same scene/scheme/engine): contrast-more changes >=0.5% of surface pixels AND (worst OCR ratio rises OR >=7:1); tinted lowers … | QUAL-097, QUAL-099 | REQ-QUAL-16 |
| QUAL-101 | CREATE | `NEW:packages/qa/src/pixel/focusContrast.ts` | §15 item 7: in focus-visible state cells, indicator region = pixels changed between focused and unfocused captures; contrast of indicator vs adjacent pixels >=3:1 on … | QUAL-097 | REQ-QUAL-14 |
| QUAL-102 | CREATE | `NEW:certification/lanes/environment-visual.spec.ts` | [REQ-QA-11..14, REQ-QA-17] One Playwright test per (subject-state x cell) generated from packages/qa/src/matrix for the requested subject set (env … | QUAL-097, QUAL-098, QUAL-099 | REQ-QUAL-09, REQ-QUAL-17 |
| QUAL-103 | CREATE | `NEW:certification/lanes/preference-modes.spec.ts` | REQ-QA-15: for every subject-state and each of tinted, solid, contrast-more, forced-colors (engines per matrix.config) compare with the default cell of the same … | QUAL-102, QUAL-100 | REQ-QUAL-16 |
| QUAL-104 | CREATE | `NEW:certification/lanes/console.spec.ts` | REQ-QA-16 across all cells of the set (including cells with no visual gate), using packages/qa/src/gates/console.ts and console-allowlist.json; aggregate per subject. … | QUAL-102 | REQ-QUAL-17 |
| QUAL-105 | TEST | `NEW:certification/lanes/known-failures.spec.ts` | §12.3: against the 15b6de6f7 storybook-static (built in CI from that SHA and put in the offline bundle), assert each expected failure with its gate id: … | QUAL-102, QUAL-103, QUAL-104 | REQ-QUAL-32, REQ-QUAL-64 |
| QUAL-106 | MODIFY | `certification/lanes/environment-visual.spec.ts` | §14: 390x844 cells use DSF 3, hasTouch, isMobile; containment gate disables ancestor overflow-x clipping; product scenes additionally run at 768x1024 for layout gates … | QUAL-102 | REQ-QUAL-04, REQ-QUAL-09 |
| QUAL-107 | CREATE | `NEW:certification/lanes/engine.spec.ts` | REQ-QA-23: WebKit: per standard-tier surface a 32x32 CSS-px probe inside the interior (>=8px from edges and text client rects) over hf-pattern shows sigma(L) reduced … | QUAL-102 | REQ-QUAL-22 |
| QUAL-304 | TEST | `certification/lanes/environment-visual.spec.ts` | Containment, target and focus suites at 390x844 with every ancestor overflow-x clipping disabled: scrollWidth <= clientWidth + 1 on [data-ag-story-content], no subject … |  | REQ-QUAL-18 |

## Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-40, S-41, S-42, S-43. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q3 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
