# PROMPT-18e (QA): L6 environment-visual lanes, a11y pixel artifact, known-failure proofs

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §4.2 (L6), §4.4, §5.2, REQ-QA-22, §12.2, §12.3, §13, §14, §15.
Requirements: REQ-QA-11 (isolation assertions), -12, -13, -14, -15, -16, -17, -22 as lanes; §12.3; §14. Acceptance: AC-QA-01, AC-QA-05, AC-QA-06 (lane half), AC-QA-07 (lane half). Tasks: QA-056..QA-064.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture. Record deviations with evidence.
- Every Playwright run is remote. Use `certify-pr`/`certify-main`/`workflow_dispatch` on GitHub-hosted runners in the cert image, or the offline bundle on EC2 via `auraone-remote-run` (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` first; the egress CA is expired, so use the bundle only). Never run a browser or Docker on the Mac. `guard.ts` enforces this.
- No fake completion:
  - no fixed sleeps; wait for `body[data-ag-cert-ready="true"]`
  - no `retries`, no `.skip`/`.fixme`
  - no new exemptions or allowlist entries to get green
  - no relaxed `thresholds.json`
  - `known-failures.spec.ts` may not pass by asserting fewer failures than §12.3 lists
- A certification system that passes 4.1.0 is broken. If a 4.1 case does not fail, fix the detector.
- Agents do not judge screenshots. Upload them and let humans review.
- Leave the uncommitted PRD-TRUST files alone. Never commit captures.

## Prerequisites
1. 18b: `test -f certification/playwright.cert.config.ts && test -f certification/runner/build-bundle.mjs`.
2. 18c: `test -f .github/workflows/certify-pr.yml && test -f packages/qa/src/lanes/runLane.ts`.
3. 18d: `test -f certification/scenes/scenes.manifest.json && test -f packages/qa/src/ocr/wordContrast.ts && test -f packages/qa/src/pixel/materialPresence.ts && rg -q "certify" .storybook/preview.tsx`.
4. Soft: PRD-MAT `Surface` (`rg -n "export .*Surface" src/material/index.ts`) for QA-061. Without it, the fixture story fails with `provider missing: src/material` and AC-QA-05 is BLOCKED on PRD-MAT.
5. Soft: Storybook PRD `.storybook/cert-manifest.json` and `scenes--*` stories. Without them, 5.0 subject sets are empty, so the lane fails (it never passes empty). The sentinel 4.x `GlassButton` still runs through `legacy4x-subjects.json`.

## May touch
NEW `certification/lanes/{environment-visual,preference-modes,console,cost,known-failures}.spec.ts`, NEW `packages/qa/src/evidence/a11yPixelContrast.ts` and its test, NEW `packages/qa/fixtures/known-failures-4.1.json`, NEW `src/stories/certification/CertFixtures.stories.tsx` (tag `cert-fixture`, `!autodocs`), `certification/lanes.config.ts` (L6 entries), `.github/workflows/certify-{pr,main,nightly}.yml` (only the L6 job steps and the `a11y-pixel-contrast` job), and `certification/runner/README.md` (run links).

## Must not touch
Gate implementations in `packages/qa/src/pixel|ocr|gates` (18d owns them; fix bugs there in an 18d follow-up that names the REQ); `.storybook/**`; component source.

## Steps
1. **QA-056** `environment-visual.spec.ts`. Generate one test per (subject-state × cell) from `matrix.ts` for `AG_CERT_SET`. For each cell:
   - build the URL as `iframe.html?id=<id>&globals=environment:<scene>;certify:1;scheme:<s>;transparency:<t>;contrast:<c>;tier:<tier>;motion:<m>`
   - apply `force.ts`
   - wait for ready
   - drive the state from `parameters.ag.states[].drive`
   - take three captures: the cell, the text-hidden twin and the surface-hidden capture
   - run every gate
   - write the cell JSON and lane manifest
   - store captures as JPEG q85 unless the cell is a regression cell

   Add the test `certify-mode isolation`, with assertions (a) and (b) of REQ-QA-11. Per-test timeout is 60 s.
2. **QA-057** `a11y-pixel-contrast.json`, as specified in PRD-A11Y REQ-A11Y-19:
   - one row per visible DOM text run, with no cap
   - `contrastRows` schema plus `engine`, `scheme`, `transparency`, `tier`, `runId`, `sha`
   - written by a CI job named exactly `a11y-pixel-contrast` in `certify-main.yml` and `certify-nightly.yml`
3. **QA-058** `preference-modes.spec.ts`: compare against the default cell using `preferenceDelta.ts`.
4. **QA-059** `console.spec.ts`: covers every cell.
5. **QA-060** `cost.spec.ts`: layers, depth, max blur, scrim-only full-viewport blur ≤12 px, refraction ≤2 at ≤¼ area.
6. **QA-061** `CertFixtures.stories.tsx`: `cert-fixture-opaque-wrapper` (a `#808080` opaque div between scene and `Surface`) and `cert-fixture-clean`. The opaque wrapper must fail `glass-over-nothing` in chromium, webkit and firefox. The clean one must pass.
7. **QA-062** `known-failures.spec.ts` + `known-failures-4.1.json`. Build `storybook-static/` from 15b6de6f7 in CI and include it in the bundle. Assert each expected failure with its gate id:
   - `3-2-app-shell--saa-s-app-shell` → `ocr-contrast`, ≤2.2:1
   - `surfaces-modals-glass-modal--default` → `cost`, 12 > 6
   - the 12 desktop entries in `docs/auraglass-5/autopsy/remote-evidence/pixel-diff.json` that carry a `contrast-more` field (all 0) → `preference-noop` under contrast-more
   - `showcases-liquid-glass-showcase--app-experience` under forced-colors → `preference` (12 backdrop filters)
   - the `PageTransitionDemo` story (`src/components/interactive/PageTransitionDemo.stories.tsx`; resolve its id from `index.json` at 15b6de6f7) → `console` (`Invalid easing type 'ease-in-out'`)

   Any expected failure that is not reported fails the spec.
8. **QA-063** Responsive cells. 390×844 uses DSF 3, `hasTouch`, `isMobile`. The containment gate runs with ancestor `overflow-x` clipping disabled. Product scenes also run at 768×1024, with layout gates only.
9. **QA-064** Run `known-failures` remotely (GitHub-hosted shards from the bundle) and link the run plus the lane manifest in `certification/runner/README.md` and the PR.

## Tests (named)
Remote: `certification/lanes/environment-visual.spec.ts` (set `pr` on the sentinel set, set `main` on all subjects), `preference-modes.spec.ts`, `console.spec.ts`, `cost.spec.ts`, `known-failures.spec.ts` on the 15b6de6f7 bundle. CI unit: `packages/qa/test/a11y-pixel-contrast.test.ts`. Check that `cert-fixture-*` runs on all 3 engines (lane manifest `browserVersions` has all three).

## Visual evidence
- Review composites (one per failing 4.1 case) and per-cell captures, uploaded as artifacts (retention 14 for PR runs, 30 for main).
- `a11y-pixel-contrast.json` as an artifact.
- A human reviews them. The report lists the artifact names; the agent does not judge them.

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-01 | `known-failures.spec.ts` green remotely on 15b6de6f7: every §12.3 case reported with the right gate id, and 0 of them pass |
| AC-QA-05 | `cert-fixture-opaque-wrapper` fails `glass-over-nothing` in chromium, webkit and firefox; `cert-fixture-clean` passes (or BLOCKED on PRD-MAT `Surface`) |
| AC-QA-06 (lane) | OCR gate and `a11y-pixel-contrast.json` produced on main; GA values in 18j |
| AC-QA-07 (lane) | `preference-modes.spec.ts` runs on main; GA values in 18j |

## Final report
```
PROMPT-18e REPORT
SHA / PRs:
Tasks QA-056..064: status each
known-failures: case -> gate id observed -> run URL
Lane runs: set, engines, cells, failures, artifact names
a11y-pixel-contrast artifact: run URL
AC-QA-01/05/06(lane)/07(lane): status + evidence
Deviations / Operator actions / Blockers (PRD + path):
```
