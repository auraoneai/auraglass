# PROMPT-13e (AI): Fixtures, stories, AI Workspace showcase composition, APG specs and remote certification

You are implementing part of PRD-AI (key `AI`; self-id PRD-13 is an alias, §16 PRD-12; AI Primitives) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Work on a branch off `main` (5.0 line). Every browser, visual, OCR, perf, motion, Storybook and `next build` step runs remotely.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_AI_PRD.md` §4.7 (recorded fixtures, deterministic replay, no network), §8 fixtures rows, §12 Playwright/visual/perf rows, §13 (Storybook: groups, required states, scene, docs pages, play tests), §14 REQ-AI-49..55, §15 REQ-AI-56..65, §16 (all budgets), §17 AC-AI-05..15, 19, §18 DoD, §20 steps 5, 7, 8.
- Architecture: §11.3 (per-flagship deliverables), §15.1 (matrix), §15.2 (lanes), §15.4 (scenes, no gallery stories), §4.7 (surface budget).
- Owners you plug into (key, anchor task, owner prompt): QA = `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (§16 PRD-19; `certification/playwright.cert.config.ts` QA-018 in `PROMPT_18a_QA_HARNESS_FOUNDATION.md`; scenes QA-038/039 and OCR QA-049 in `PROMPT_18d_QA_SCENES_GATES.md`; L6 Environment visual QA-056 in `PROMPT_18e_QA_ENVIRONMENT_LANES.md`; L5 Behaviour QA-082 and L11 Consumer canaries QA-086 in `PROMPT_18g_QA_CONSUMER_LANES.md`; lanes cited L5/L6/L7/L9/L10/L11/L13/L14 per SC-29); PERF = `AURAGLASS_PERFORMANCE_PRD.md` (`tests/perf/harness/run-perf.mjs` PERF-039 and runtime `tests/perf/harness/budgets.json`, `PROMPT_07c_PERF_HARNESS.md`); A11Y = `AURAGLASS_ACCESSIBILITY_PRD.md` (`tests/a11y/apg/harness.ts` A11Y-073, `tests/a11y/browser/axe.spec.ts` A11Y-078, `tests/a11y/manual/sr-record.schema.json` A11Y-084, `PROMPT_05f_A11Y_HARNESS_CERT.md`); SB = `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` (`.storybook/preview.tsx` SB-048 in `PROMPT_17c_SB_ENVIRONMENT_SCENES.md`; `showcase/ai-command-center/` SB-109 and `npm run test-storybook` in `PROMPT_17f_SB_SHOWCASES_CERT.md`); PKG (`canaries/next16` PKG-121/122, `canaries/next15`, `PROMPT_02d_PKG_CANARIES_R19.md`; `docs/size-budgets.json` PKG-048/049); NAV `AppShell` (NAV-016, `PROMPT_11b_NAV_FRAME.md`). Shared contracts: `_shared-contracts.md` SC-15, SC-28, SC-29, SC-30, SC-31.
- Tasks: `docs/auraglass-5/tasks/AI.json` AI-071..AI-097 and AI-119..AI-123 (APG specs).

Requirements verified or delivered here: REQ-AI-07 (canary), 09, 10, 12, 13, 14, 26 (WebKit), 29, 30, 38, 45 (lane), 46, 49–55, 56–63 (57 via the APG specs AI-119..123), 65 (visual rtl) and lane evidence for all others. Acceptance: AC-AI-05, 06, 07, 09, 10, 11, 12, 13, 14, 15, 19, plus AC-AI-01 at RC (AI-097).

## 2. Scope
May create or modify:
- NEW `src/ai/__fixtures__/{thread-2000.json,stream-*.json,replay.ts,__tests__/replay.test.ts}`, NEW `scripts/build/gen-ai-thread-fixture.mjs` (SC-11: no `scripts/ai/`)
- `.storybook/preview.tsx` (MODIFY after SB-048: register the `withAiClock` decorator through SB's decorator contract only)
- NEW `src/ai/**/*.meta.ts` (5 files), NEW `src/ai/**/*.stories.tsx`, NEW `src/ai/**/*.mdx`
- `showcase/ai-command-center/AiCommandCenter.showcase.tsx` and `showcase/ai-command-center/data.ts` (MODIFY after SB-109: the AI Workspace composition and its recorded data only; SB owns the files and the import/determinism contract, SC-31)
- `.storybook/cert-manifest.json` (AI story entries only)
- NEW `tests/ai/*.spec.ts` (behaviour specs, QA L5), NEW `tests/visual/ai/ai-workspace.visual.spec.ts` (L6/L7), NEW `tests/perf/browser/ai-streaming.spec.ts` (L10), NEW `tests/a11y/apg/{thread,message,composer,tool-call,citation}.apg.spec.ts` (AI-119..123); `tests/a11y/browser/axe.spec.ts` (MODIFY after A11Y-078: AI stories only)
- NEW `canaries/next16/app/ai-rsc/page.tsx`, `canaries/next16/app/ai-client/page.tsx`, `canaries/next15/app/ai/page.tsx` (pages inside PKG's canary apps)
- `scripts/ci/verify-flagship-deliverables.mjs` (or its config): the 5 AI entries only. QA has not filed a CREATE task for this script (PRD §21 item 7); if it does not exist, report AI-092 blocked on QA, do not create it
- `docs/size-budgets.json` (AI rows, calibration downward only, with QA L10 sign-off) and the AI rows of `tests/perf/harness/budgets.json` (PERF file)
- `src/ai/message/StreamingText.tsx` (only for the §4.5 fallback, AI-094)
- `etc/api/ai.api.md`, `etc/api/ai.exports.json` (RC freeze)

Must NOT touch: component behaviour in `src/ai/**`, except to fix a real defect a lane exposes. Each such fix gets a separate commit that names the failing test and the REQ. Also off limits: `src/stories/AppShell.stories.tsx` (deleted by SB/NAV, SC-31; not edited here), QA/A11Y/PERF/SB harness code, other stories and showcases, `src/components/**`, `package.json` deps, thresholds anywhere.

## 3. Prerequisites
- 13b, 13c and 13d merged: `./node_modules/.bin/jest src/ai` green and `node -p "require('./etc/api/ai.exports.json').length"` prints 15. Hard.
- QA/SB lanes runnable remotely: `.storybook/cert-manifest.json` exists; SB-048's environment global with the 8 SC-28 scenes (`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`) exists in `.storybook/preview.tsx`; QA-049's OCR package exists (`test -d packages/qa/src/ocr`); QA-056 `certification/lanes/environment-visual.spec.ts` exists. Hard for AI-086/AI-087. Without them, write the specs, report the lane as blocked, and leave the AC open.
- PERF-039 harness `tests/perf/harness/run-perf.mjs`. Hard for AI-089.
- A11Y-073 APG harness `tests/a11y/apg/harness.ts`. Hard for AI-119..123.
- SB-109 `showcase/ai-command-center/` exists. Hard for AI-079/080/095.
- NAV-016 `AppShell` exported. Hard for AI-079.
- PKG-121/122 canaries `canaries/next16`, `canaries/next15`. Hard for AI-091.
- `npm run test-storybook` script (Storybook PRD REQ-SB-45). Hard for AI-078.

## 4. Steps
1. **AI-071..073 fixtures + replay.** Generate the 2,000-message thread with a seeded PRNG inside the generator script only. Author the five stream fixtures to the schema. The replay takes an injected clock; there are no wall-clock timers.
2. **AI-074** Add the `withAiClock` decorator (pause/step/finish exposed to `play`).
3. **AI-075 meta files** for Thread, Message, Composer, ToolCall, SourceList: tier, states, the part/state table (§4.6 verbatim), the selector-change table vs 4.x, registry usage (`ai-workspace`), the APG script (REQ-AI-57 sequence, run by the AI-119..123 specs), the budget line id and codemod fixture ids.
4. **AI-076/077 stories**: every §13 state as a named story under `AI/…`, driven by fixtures and replay over SB's environment global. No gallery or meta copy. **AI-096 docs pages** are generated from the meta files.
5. **AI-078 play tests**: Enter submit, IME, Stop, approve/deny, jump-to-latest, citation focus preview.
6. **AI-079 composition** of the AI Workspace scene inside `showcase/ai-command-center/AiCommandCenter.showcase.tsx` (story `Showcases/AI Command Center`), built from unmodified public components. **AI-080** Supply `showcase/ai-command-center/data.ts` from the recorded fixtures. Do not touch `src/stories/AppShell.stories.tsx`.
7. **AI-081..085 Playwright specs** on 3 engines, with the numeric assertions from each task (≤1px drift, ≤visible+12 articles, ≤2px jump, IME 0/1 submits, grow 1→8/5 rows, dropzone, citation hover/focus/Escape/tap).
8. **AI-086/087 visual + OCR + motion** across the full §15.1 matrix, plus the AI-only 320, zoom200 and rtl variants, the forced-colors backdrop check and the surface-count check.
9. **AI-088** Add the AI stories to A11Y's browser axe spec (MODIFY). **AI-119..123** Write the five APG specs `tests/a11y/apg/{thread,message,composer,tool-call,citation}.apg.spec.ts` on A11Y's `runApgScript` harness; QA L5 imports them (QA-082).
10. **AI-089 perf** in `tests/perf/browser/ai-streaming.spec.ts` with the §16 numbers as rows in PERF's `tests/perf/harness/budgets.json`. **AI-090** PKG size gate over the AI rows of `docs/size-budgets.json` (calibrate down only). **AI-091 canaries** (`next build` + `next start`, 0 hydration warnings; Next 15 floor imports all 15). **AI-092** flagship deliverables entries.
11. **AI-093 manual matrix**: prepare the scene URL and checklist. Human testers run VoiceOver macOS/iOS, NVDA, TalkBack and physical touch. Store the records in the evidence artifact. **AI-094**: resolve §4.5 (ship the fallback if any reader double-announces, then re-verify).
12. **AI-095 human visual review** recorded in the release review. **AI-097 RC freeze** of the API report (exactly 15).

## 5. Tests to run (all remote unless marked)
- Local (jsdom only): `./node_modules/.bin/jest src/ai`, `node scripts/build/gen-ai-thread-fixture.mjs --check`.
- Remote, in GitHub Actions per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md` (QA sharded lanes, `certify-pr.yml`/`certify-main.yml`) or on ephemeral EC2 via the `auraone-remote-run` skill: `npm run build-storybook`; `npm run test-storybook`; `playwright test -c certification/playwright.cert.config.ts tests/ai tests/a11y/apg` on Chromium/WebKit/Gecko (L5); the L6/L7 visual/OCR lane with `tests/visual/ai/` over the showcase and stories; the L9 Motion lane; the browser axe spec; `node tests/perf/harness/run-perf.mjs` with `tests/perf/browser/ai-streaming.spec.ts` (L10); `node scripts/ci/verify-size-budgets.mjs`; the canary `next build && next start`; `node scripts/ci/verify-flagship-deliverables.mjs`.
- Never run a local browser, local Storybook build or local Docker. Tear down any EC2 workers you start (DoD 8).

## 6. Visual evidence (CI artifacts keyed to SHA, never committed)
- Full-matrix captures of `Showcases/AI Command Center` (AI Workspace) and every AI story: 3 engines × 8 SC-28 scenes × light/dark × glass/tinted/solid × 4 preferences × tiers × 1440/390, plus 320, zoom200 and rtl.
- OCR contrast report per cell (worst word per story) compared against E-18 (266/342 failing on black at 4.1.0).
- A forced-colors `backdrop-filter` census, a surface-count census (≤6 fine / ≤3 coarse), a motion frame-strip, and a perf grades JSON.
- Human review sheet for AC-AI-19.

## 7. Integrity rules (binding)
- No network in any story, test or lane. No `Math.random` or wall-clock timers in fixtures/replay at runtime.
- Don't edit components to game a lane. A lane failure means fixing a real defect (separate commit, named REQ) or reporting a blocker. Don't add allowlists, skip cells, shrink the matrix, raise tolerances, lower contrast floors (4.5/3/7:1), loosen perf or size budgets, or run `--update-snapshots`/`-u` to get to green. Baselines are created only on the first run, from human-reviewed captures.
- No `.skip`/`.only`/`xit`/`test.fixme`. A blocked lane is reported, not disabled.
- Manual SR results come from human testers. The agent never fabricates records.

## 8. Exit criteria
- AC-AI-05 (thread-scroll on 3 engines), AC-AI-06 (virtual + perf fling + 0 long tasks), AC-AI-07 (IME WebKit + Chromium), AC-AI-09 (axe 0 + APG scripts pass for all 5 flagships), AC-AI-10 (OCR 0 failures, full matrix), AC-AI-11 (forced colors), AC-AI-12 (reduced motion 0 animations/rAF after 500 ms), AC-AI-13 (all §16 bundle lines within budget; perf grade ≥C for each flagship), AC-AI-14 (manual matrix signed off; §4.5 resolved), AC-AI-15 (Next 16 + Next 15 canaries), AC-AI-19 (human review approved), AC-AI-01 (RC freeze, 15 names).
- REQ-AI-46: `verify-flagship-deliverables.mjs` green for the 5 AI entries.

## 9. Final report format
```
PROMPT-13e REPORT
Branch/SHA:
Tasks: AI-071..AI-097, AI-119..AI-123 -> done|blocked (reason) each
AC table: AC-AI-05,06,07,09,10,11,12,13,14,15,19,01 -> pass|fail|blocked + artifact URL each
OCR: worst word contrast per environment (light/dark); cells run/total
Perf: grades per flagship; fling fps desktop/mobile; long tasks; INP p95
Sizes: each §16 line measured vs budget
Manual matrix: reader -> result; §4.5 decision (fallback shipped yes/no)
Component defects fixed (commit, REQ, failing test):
Remote workers: started/torn down (ids)
Prereq blockers (owner task ids):
Deviations: (each with evidence) or none
Files changed:
```
