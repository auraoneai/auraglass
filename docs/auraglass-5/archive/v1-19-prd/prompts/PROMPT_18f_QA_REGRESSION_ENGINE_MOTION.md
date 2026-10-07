# PROMPT-18f (QA): L7 pixel regression, baseline governance, L3 visual-class inputs, L8 engine, L9 motion

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §3 items 5 and 7, §4.2 (L3, L7, L8, L9), §5.3 REQ-QA-21/-23, §5.4, §11 item 3, §12.2.
Requirements: REQ-QA-21, -23, -24, -25, -26. Acceptance: AC-QA-08, AC-QA-09, AC-QA-14 (L7–L9 half). Tasks: QA-065..QA-077.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture: D-27 (visible pixel change = breaking on maintenance branches) and D-05 (enhanced is Chromium-only). Record deviations with evidence.
- Every capture is remote, on GitHub-hosted runners in the pinned cert image (see `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`). Baselines come only from that image. Darwin baselines are rejected. Never run a browser or Docker on the Mac.
- No fake completion:
  - no `--update-snapshots`/`-u` in any `pull_request` job
  - no raised `threshold`/`maxDiffPixelRatio`
  - no baselines committed by hand or from a local machine
  - no `retries`
  - no `.skip`
  - a regression is fixed in the component PR, never by updating the baseline without the label + design approval
- This PRD writes no classifier logic. `scripts/release/visual-class.mjs` belongs to PRD-REL and is called unmodified.
- The AC-QA-08/09 proofs use throwaway PRs that are closed unmerged.
- Leave the uncommitted PRD-TRUST files alone.

## Prerequisites
1. 18c: `test -f .github/workflows/certify-pr.yml`.
2. 18e QA-056: `test -f certification/lanes/environment-visual.spec.ts`.
3. PRD-REL:
   - `test -f scripts/release/visual-class.mjs` (REQ-REL-12) for QA-072. If it is missing, BLOCKED on PRD-REL.
   - `test -f .github/CODEOWNERS` (REQ-REL-13) for QA-071. If it is missing, BLOCKED on PRD-REL.
   - `git ls-remote origin release/4.x` for QA-072/073. If it is missing, BLOCKED on PRD-REL 01c.
4. SC-09: `visual-regression.yml` is not repurposed. REL-042 is a verification task against QA's `certify-pr / regression` job (QA-072); keep the artifact names `visual-base`/`visual-head` that REL-042 reads. If `rg -n "visual-class" .github/workflows/visual-regression.yml` finds a conversion on `main`, report it to PRD-REL (`PROMPT_01_REL`) and do not extend it; QA-119 deletes the file on `main`.
5. Soft:
   - `rg -n 'data-ag-part="bezel"' src` (PRD-MAT lens, interim owner of §16 PRD-EXP per SC-37) for the Chromium bezel check. If it is missing, the check reports `provider missing` for enhanced cells only.
   - PRD-MOT declared entrances (`parameters.ag.states[].entrance`) for L9. Without them, flagship entrance checks fail with `provider missing: entrance metadata`.

## May touch
NEW `packages/qa/src/capture/elementCrop.ts`, NEW `packages/qa/src/evidence/diffReport.ts`, NEW `certification/lanes/{regression,engine,motion}.spec.ts`, NEW `certification/baselines/linux/{chromium,webkit,firefox}/**` (only via the update job), NEW tests `packages/qa/test/{element-crop,baselines-budget,diff-report}.test.ts`, `.github/workflows/certify-pr.yml` (jobs `regression`, `engine`, `motion`, `baseline-guard`, `baseline-update`), `.github/CODEOWNERS` (two lines), `playwright.config.ts` (remove `:123-128` only), `certification/lanes.config.ts` (L7–L9), `certification/runner/README.md` (proof links).

## Must not touch
`scripts/release/visual-class.mjs`, `.github/workflows/change-class.yml` (PRD-REL); `.github/workflows/visual-regression.yml` (it is deleted in 18j after this job is live); `src/**` (except on throwaway proof branches); branch protection settings (operator).

## Steps
1. **QA-065** `elementCrop.ts`: `locator.screenshot({ animations: 'disabled', caret: 'hide' })` of the subject root.
2. **QA-066** `regression.spec.ts`. There are 10 baseline cells per subject-state:
   - chromium and webkit × {photo, flat-white} × {light, dark} @1440
   - chromium × photo × light @390
   - firefox × photo × light @1440

   Compare with `toHaveScreenshot` at `threshold 0.1` and `maxDiffPixelRatio 0.002`. When the box is <10 000 px², use `maxDiffPixels 20` instead. Path: `certification/baselines/linux/{projectName}/<subject>/<state>__<scene>__<scheme>__<viewport>.png`. CI uses `updateSnapshots: 'none'`, so a missing baseline fails.
3. **QA-067** `baselines-budget.test.ts`:
   - each file ≤80 KB, tree ≤30 MB
   - no `darwin` in any path
   - path pattern as above
   - the PNG `ag-image-digest` tEXt chunk equals `certification/image.lock.json`
4. **QA-069** `diffReport.ts` → `baseline-diff-report.html` showing base | head | diff with the changed ratio.
5. **QA-068** `baseline-update` job, triggered only by `workflow_dispatch` with input `pr_number`. It:
   - checks out the PR head
   - runs `--update-snapshots` in the pinned image
   - stamps the digest chunk
   - uploads the report (retention 14)
   - commits only `certification/baselines/**` to the PR branch
6. **QA-070** `baseline-guard` (pull_request). A PR that touches `certification/baselines/**` must have the label `baseline-update` and a PR-body link to the report artifact. **QA-071** CODEOWNERS: `/certification/baselines/` and `/certification/thresholds.json` → `@auraoneai/auraglass-design @auraoneai/auraglass-qa`. If `gh api orgs/auraoneai/teams/auraglass-design` returns 404, record team creation as an operator action.
7. **QA-072** REQ-QA-26. On release/4.x PRs (and on main once the version is ≥5.0.0):
   - capture element-cropped default-preference cells at 1440×900 and 390×844 for the merge-base and the head into `$CERT_OUT/<sha>/visual-class/{base,head}/`
   - upload them as `visual-base`/`visual-head`
   - run `node scripts/release/visual-class.mjs --base … --head … --out visual-class.json --composites …` as the PRD-REL step, unmodified
8. **QA-075** `engine.spec.ts`:
   - WebKit: a 32×32 probe at least 8 px from edges and text, over `hf-pattern`, shows σ reduced by ≥60% vs surface-hidden
   - Gecko: refraction subjects equal standard within 0.001 and are not blank
   - Chromium enhanced: the bezel rect intersects 0 text rects
9. **QA-076** `motion.spec.ts`:
   - 12 frames at 16 ms must contain ≥3 distinct frames (dHash >2)
   - under reduce, after 500 ms settle: 0 rAF callbacks and 0 running animations for 1000 ms, final opacity 1 and scale 1
   - `::view-transition-*` has no backdrop-filter
   - `video-frame.webm` is used only here
10. **QA-077** Remove the `playwright.config.ts:123-128` screenshot defaults.
11. **QA-074 (AC-QA-08 proof)** On a throwaway PR, change the border radius of the flagship (`Button` if PRD-CTL landed, else the `GlassButton` sentinel) by 2px. Expect `certify-pr / regression` red with a diff artifact, and the guard demanding the label and approval. **QA-073 (AC-QA-09 proof)** On a throwaway PR to release/4.x, change a 1-pixel row colour on `GlassButton` default. Expect `visual-class.json` `changed: true` (ratio >0.001 of the crop) and L3 red without `visual-bug-fix`. Close both PRs unmerged and link the runs.
12. Baseline bootstrap at alpha.1 is 18j QA-123: one PR per flagship family, each with human L14 approval.

## Tests (named)
CI unit: `packages/qa/test/element-crop.test.ts`, `baselines-budget.test.ts`, `diff-report.test.ts`, `workflows.test.ts` (the `--update-snapshots` scoping). Remote: `certification/lanes/regression.spec.ts`, `engine.spec.ts`, `motion.spec.ts` in chromium, webkit and firefox via `certify-pr`, plus the two throwaway-PR proofs.

## Visual evidence
- `baseline-diff-report.html`, the visual-class `composites/`, and the engine-probe crops for WebKit, uploaded as artifacts.
- Human design review approves baselines (L14). The agent links artifacts and never approves.

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-08 | Throwaway-PR run URL: L7 red with a diff image artifact; `baseline-guard` red without the `baseline-update` label; CODEOWNERS line present |
| AC-QA-09 | Throwaway release/4.x PR: `visual-class.json` `changed: true`, ratio >0.001; change-class red without the label (or BLOCKED on PRD-REL) |
| AC-QA-14 (L7–L9) | The manifests of `regression`, `engine` and `motion` list `browserVersions` for chromium, webkit and firefox, each with >0 results |

## Final report
```
PROMPT-18f REPORT
SHA / PRs:
Tasks QA-065..077: status each
Proof runs: AC-QA-08 <url>, AC-QA-09 <url> (PRs closed unmerged)
Lane runs: regression / engine / motion per engine: cells, failures, artifact
AC-QA-08 / -09 / -14(part): status + evidence
Deviations / Operator actions (teams, code-owner review protection) / Blockers:
```
