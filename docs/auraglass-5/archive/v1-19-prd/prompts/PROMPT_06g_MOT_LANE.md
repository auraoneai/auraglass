# PROMPT-06g (MOT): Button/Dialog motion, motion assertions in lane L9, Storybook Motion Lab, budgets — PRD-06 exit

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` (PRD-06) §4.6, §5.9, §7, §12, §13, §14, §15, §16, §17, §20 steps C and G–H.
Requirement IDs: REQ-MOT-11/-14/-16/-41 (applied to Button and Dialog), -15 (T19), -17/-129 (lane check), -23, -70, -71, -72, -73, -74, -75, -76, -77, -78, -90, -91, -92, -93, -94, -101, -102, -104, -111, -112 (lane check), -114, -115, -118, -120, -121, -123, -124, -125, -126, -127, -130; tests REQ-MOT-T05, T08, T12, T13, T18, T19.
Acceptance: **AC-MOT-06, -07, -08, -10, -12, -13, -14, -19, -20 (PRD-06 exit: lane green on Button and Dialog + human review)**. Tasks: MOT-091..MOT-107.
Contract registry: `docs/auraglass-5/prd/_shared-contracts.md` wins. SC-29: lanes are QA's (L9 Motion entry `certification/lanes/motion.spec.ts` QA-076; config `certification/playwright.cert.config.ts` QA-018; workflows `certify-pr.yml`/`certify-main.yml`/`certify-release.yml` QA-031); MOT adds a `motion` project and specs, no config or workflow of its own. SC-30: perf browser specs at `tests/perf/browser/<area>-<name>.spec.ts` via PERF's `run-perf.mjs`. SC-31: `.storybook/preview.tsx` is SB-048's, Lab harness `.storybook/lab/**` SB-060, component stories belong to component PRDs. SC-15: byte rows in `docs/size-budgets.json` (PKG-048), runtime rows in `tests/perf/harness/budgets.json` (PERF). SC-38: no press scale, no Card hover translate. SC-39/SC-11: `scripts/audit/**` is not touched (QA-115 deletes `storybook-visual-certification.mjs`).

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main`. Architecture §15 (certification), D-32 (artifacts keyed to SHA) win; deviations reported with evidence.
- **Every Playwright, Storybook build, screenshot, trace and perf run executes remotely** (QA's `certify-*.yml` workflows, or an ephemeral runner via skill `auraone-remote-run`). Never on the Mac. Bring back reports, traces, frame strips as CI artifacts. Local: `npm test -- <path>`, `npm run typecheck`, `node_modules/.bin/eslint`.
- No fake completion: no stubbed `getAnimations()`, no screenshots of static stories passed off as frame strips, no `forceVisible`, no `test.skip`/`fixme`, no `retries` added to mask flakes, no lowered thresholds (16.7/8.3 ms, 55 fps, 3 frames, 0.99 opacity, KB budgets are fixed), no `--update-snapshots`. A failing budget is reported with its number, not relaxed.
- You cannot view screenshots with the Read tool: visual judgement is a human review of the remote artifacts; list their paths.
- Nothing committed under `reports/`; `motion-report.json` is a CI artifact only.
- No new dependencies.

## Prerequisites (verify)

1. 06b and 06c merged (`src/motion/css/*.css`, `ticker.ts`, `pointerLight.ts`, `viewTransition.ts`). 06e checker exists.
2. CTL has built `Button` (`src/components/button/Button.client.tsx` CTL-055, `Button.css` CTL-056; `PROMPT_09c_CTL_CHROME_CONTROLS.md`) and OVL has built `Dialog` (`src/components/dialog/Dialog.client.tsx` OVL-040, `Dialog.css` OVL-046; `PROMPT_10c_OVL_DIALOG.md`) on Base UI (FND-001) with `data-ag-part`, `data-ag-interactive`, Base UI state attributes, and `<Component>.meta.ts` with a `motion` field slot (FND-005). If absent: BLOCKED for MOT-094/095 and the exit gate.
3. QA provides remote runners, the static Storybook artifact, cert config QA-018, `certify-pr.yml` QA-031, L9 entry QA-076 and the 8 scenes QA-038/039 (`PROMPT_18b_QA_REMOTE_RUNNER.md`, `PROMPT_18c_QA_CI_FAIL_CLOSED.md`, `PROMPT_18f_QA_REGRESSION_ENGINE_MOTION.md`). PERF provides `tests/perf/harness/run-perf.mjs` (PERF-039, `PROMPT_07c_PERF_HARNESS.md`). SB provides `.storybook/preview.tsx` (SB-048) and `.storybook/lab/**` (SB-060) (`PROMPT_17c_SB_ENVIRONMENT_SCENES.md`, `PROMPT_17d_SB_MATERIAL_LAB.md`).
4. A11Y `AuraGlassScript` (A11Y-032) writes `data-ag-motion` (`data-ag-continuous` pending the `allowContinuous` key, PRD §21 O-03); `docs/size-budgets.json` (PKG-048) exists.

## May touch

`.storybook/preview.tsx` (motion globals only, through SB-048's globals contract); `certification/playwright.cert.config.ts` (add the `motion` project only, MODIFY of QA-018); NEW `tests/motion/{settle,continuous,frame-strip,view-transition-optics,no-mount-motion,a11y-focus,responsive}.spec.ts`, NEW `tests/motion/helpers/{frames,settle,idle,report}.ts`; NEW `tests/perf/browser/motion-frame-time.spec.ts` and MOT rows in `tests/perf/harness/budgets.json`; `src/components/button/Button.css` and `src/components/dialog/Dialog.css` (**motion rules only**, MODIFY of CTL-056/OVL-046) plus motion data attributes; play functions in the Button/Dialog stories (MODIFY; files owned by CTL/OVL); NEW `src/motion/metadata.ts` (type-only `MotionMetadata` schema, REQ-MOT-94); NEW `src/stories/motion/{Tokens,Interactions,ViewTransitions,Physics}.stories.tsx` (against `.storybook/lab/**`); NEW `docs/motion.md`; MOT rows in `docs/size-budgets.json` for REQ-MOT-120..123.

## Must not touch

Button/Dialog structure, props or Base UI wiring (CTL/OVL), `src/motion/{ticker,pointerLight,viewTransition}.ts` (06c — file bugs back), `scripts/audit/**`, `certification/lanes/**` and `.github/workflows/certify-*.yml` (QA), `tests/perf/harness/run-perf.mjs` (PERF), visual baselines, `reports/**`.

## Steps

1. **Storybook globals (REQ-MOT-90, MOT-091).** Register through SB's globals contract on SB-048's `preview.tsx`: `motion` = `system` (default, no attribute; OS decides) | `full` | `calm` | `none` → `data-ag-motion` on the story root; `allowContinuous` off by default → `data-ag-continuous="on"` only when on and motion resolves `full`. Cert mode (`certify:1`) never forces `reduce` (QA REQ-QA-21).
2. **Lane project (REQ-MOT-70, MOT-092).** Add a `motion` project to `certification/playwright.cert.config.ts`: chromium/webkit/firefox × viewports 1440×900, 390×844 × `reducedMotion` `no-preference`/`reduce`; `testDir: tests/motion`; `baseURL` = static Storybook build in `certify:1` mode; no forced reduction. It runs as lane L9 in `certify-pr.yml`; agree with QA that QA-076 imports `tests/motion/helpers/frames.ts` instead of duplicating it (PRD §21 O-11).
3. **Helpers (REQ-MOT-71..74).** `frames.ts`: trigger → `document.getAnimations({ subtree: true })` on the subject → pause all → for t ∈ {0, 1/11 … 11/11} × max `endTime` set `currentTime` → `locator.screenshot()` + snapshot `{ name, transitionProperty, currentTime, playState }`; distinct-frame count (pixel diff > 0.5% of the box). Chromium-only CDP `Page.startScreencast` wall-clock check within ±20% of the token. `settle.ts`: wait `--ag-duration-large` + 100 ms; assert no running animations on `[data-ag-part]`, opacity ≥ 0.99, `scale` ∈ {`none`,`1`}, `translate` ∈ {`none`,`0px`}, bbox > 0, `will-change` absent (REQ-MOT-17/-129). `idle.ts`: `page.addInitScript` wrapper of `requestAnimationFrame`/`setInterval` (reusing QA-076's instrument) recording `new Error().stack`; count only stacks containing the AuraGlass chunk path.
4. **Button (MOT-094).** Apply `data-ag-interactive`, `data-ag-pointer-light` when `pointerLight`; install pointer light via `installPointerLight` only when `pointerLightActive(...)`; metadata `motion.interactions` for hover/press/focus. No `scale`/`translate` on hover or press anywhere (SC-38).
5. **Dialog (MOT-095).** Popup/Backdrop parts use the §4.6 "modal emergence" rules (opacity, `scale` 0.96→1, `--_ag-optics` 0→1 over 60% of `medium`, `spring-smooth`; scrim opacity only, static blur). Popup gets `inert` while `data-ending-style` (REQ-MOT-114, FND wrapping pattern — verify, report if missing). Escape is dispatched only by A11Y's `LayerStack` (A11Y-049, SC-25). Focus moves in at open, not after animation (REQ-MOT-115). Nested AlertDialog over Dialog and Escape close in stories.
6. **Stories (REQ-MOT-92, -93).** Every Button/Dialog story gets a `play` function triggering its primary change; an "initially hidden" story for each visibility timer; static scene backgrounds only.
7. **Specs.** Write the six named specs (below) plus `a11y-focus.spec.ts` (REQ-MOT-114/-115: Tab during Dialog/Menu exit never lands inside the exiting Popup; focus ring visible within 1 frame) and `responsive.spec.ts` (REQ-MOT-101: Menu→Sheet morph below 640 px; REQ-MOT-102: 390×844 bottom sheet enters within `medium`, full-height within `large`; REQ-MOT-104: parallax/scroll ≤ 24 px text displacement).
8. **Report (REQ-MOT-78).** `report.ts` writes `motion-report.json` `{ sha, subjects: [{ id, engine, viewport, preference, mode, framesChanged, settlePass, idleRafCount, vtOpticsPass, p95FrameMs, longTasks }] }`; QA's workflow uploads it as an artifact keyed to the SHA (D-32).
9. **Budgets (REQ-MOT-120..123, MOT-102).** Add rows to `docs/size-budgets.json` (checked by `scripts/ci/verify-size-budgets.mjs`, lane L2): core motion CSS ≤ 3.5 KB min+gz; core motion JS ≤ 2.0 KB; `{ Button }` ≤ 10 KB with ≤ 0.5 KB motion share; `{ Dialog }` ≤ 20 KB with ≤ 1.0 KB; `/motion` ≤ 4 KB; 0 bytes `framer-motion`/`motion` in Button/Dialog graphs.
10. **Motion Lab (REQ-MOT-91) and docs (REQ-MOT-94).** `Motion/Tokens` (SVG curves, dot animates only while "Play" is held, spring `linear()` vs analytic with error read-out), `Motion/Interactions` (one story per §4.6 row × QA's 8 scenes `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`; full/calm/none side by side), `Motion/View Transitions` (optics debug outline), `Motion/Physics`. `MotionMetadata = { interactions: Array<{ trigger: string; properties: string[]; token: MotionTokenName; calm: 'opacity' | 'none' | 'same' }> }`. `docs/motion.md`: generated tables, no hand-written numbers (D-32).
11. **Roll-out (REQ-MOT-77).** After the exit gate, each flagship PRD adds its subject to the lane; this prompt's lane is the template (re-run steps 6–8 per flagship).
12. **Manual matrix (REQ-MOT-118, AC-MOT-19).** Produce the checklist for VoiceOver/Safari macOS + iOS (Reduce Motion), NVDA/Chrome (Show animations off), TalkBack/Chrome (Remove animations) × Button, Dialog, Menu, Sheet, Tabs; sign-off is human.

## Tests (all remote)

- REQ-MOT-T05 `tests/motion/settle.spec.ts`: Button and Dialog stories × 3 engines × 2 viewports × {no-preference, reduce} × `data-ag-motion` {full, calm, none} (AC-MOT-06).
- REQ-MOT-T13 `tests/motion/frame-strip.spec.ts`: ≥ 3 distinct frames for Button press and Dialog open (then Menu, Popover, Tabs as they land) under no-preference; under reduce, Popup `scale`/`translate` never differ from settled (REQ-MOT-74); `ag-sweep` luminance change < 10% per frame and ≤ 3 peaks/s (REQ-MOT-112) (AC-MOT-08).
- REQ-MOT-T08 `tests/motion/continuous.spec.ts`: `allowContinuous` off ⇒ 0 infinite running animations and 0 library rAF callbacks 1 s after settle on every story; under reduce 0 for 2 s (REQ-MOT-73, AC-MOT-07); on ⇒ only `ag-sweep` (and MED's `ag-backdrop-drift` on `./backdrops` drift stories); `[data-ag-offscreen]` elements have 0 running animations; loops stop when content resolves and no auto motion > 5 s (REQ-MOT-111) (AC-MOT-09 runtime).
- REQ-MOT-T12 `tests/motion/view-transition-optics.spec.ts`: Tabs, SegmentedControl, TabBar, SourceTransition per engine; `--_ag-optics` 0 during `:active-view-transition`, 1 after `finished` + `micro`; FLIP path on engines without VT (AC-MOT-10; BLOCKED per component until its PRD ships it).
- REQ-MOT-T19 `tests/motion/no-mount-motion.spec.ts`: Stack, Grid, Container, Separator, Text, Heading, Card at rest ⇒ 0 `getAnimations()` 50 ms after mount.
- REQ-MOT-T18 `tests/perf/browser/motion-frame-time.spec.ts` (lane L10 via `run-perf.mjs`, budgets in `tests/perf/harness/budgets.json`): 4× CPU throttle 390×844 and 120 Hz desktop; Dialog open/close p95 ≤ 16.7 ms / ≤ 8.3 ms, 0 long tasks > 50 ms, 0 transition Layout events (REQ-MOT-124, AC-MOT-13); 20-button hover/press sweep with `pointerLight` p95 ≤ 8.3 ms, ≤ 0.5 ms/frame pointer-light scripting, 0 React commits (REQ-MOT-125, AC-MOT-11 runtime); Tabs/SegmentedControl morph setup ≤ 4 ms desktop / ≤ 12 ms mobile (REQ-MOT-126); idle 0 rAF/s (REQ-MOT-127); `Dialog` vs 4.x `glass-modal` scripted hover/scroll in the software-raster harness ≥ 55 fps median (REQ-MOT-130, AC-MOT-14).

## Visual evidence (remote, CI artifacts)

Frame strips (12 frames) for Button hover/press/focus/pointerLight and Dialog open/close/nested/Escape on 3 engines × 2 viewports × 2 preferences; full/calm/none side-by-side composites; View Transition optics debug captures; the Motion Lab pages. Human motion review (L14: specular response, materialization, no bounce, no press scale per SC-38; confirmation of that decision is PRD §21 O-01) is required for AC-MOT-20.

## Exit criteria

- **AC-MOT-20:** REQ-MOT-70..78 green in lane L9 on Button and Dialog; `motion-report.json` attached to the CI run for the SHA; human motion review approved.
- AC-MOT-06, -07, -08, -12, -13, -14 green for Button and Dialog; AC-MOT-10 per morph component as delivered; AC-MOT-19 signed off at RC.

## Final report format

```
PROMPT-06g REPORT
Commit: <sha>; CI run: <url>; artifact: motion-report.json (<name>)
Tasks MOT-091..107: DONE | BLOCKED(<reason>) each
AC table: AC-MOT-06/07/08/10/12/13/14/19/20 -> PASS/FAIL/BLOCKED with measured numbers (p95 ms, fps, KB, frames)
Subjects covered: <list> × engines × viewports × prefs × modes
Human review: requested from <who>, artifact paths, status
Files changed: <list>
Deviations: <none | item + evidence>
```
