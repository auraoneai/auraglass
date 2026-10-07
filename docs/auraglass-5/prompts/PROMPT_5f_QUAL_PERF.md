# PROMPT-5f (QUAL lane Q6): Performance

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q6**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5f-Q6"` (84 tasks: QUAL-129..211, 306).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

## Scope

**Owned paths (exclusive inside QUAL):** `tests/perf/**` (QUAL), `packages/qa/src/perf/**`, `scripts/qual/{verify-css-perf.mjs,stylelint-perf/**,verify-dist-perf.mjs}`, `lint/rules/qual/**`, `stories/qual/perf/**`, `fragments/perf-budgets/qual.ts`, `certification/calibration.json`, `docs/certification/real-device-matrix.md`

**Order inside the lane:** lint rules + static CSS/dist gates (-44..-46) → harness, BCI, blank baseline, self-test on a blank page and the 4.1 baseline (-34..-36) → budgets and grades (-37, -38) → node import (-47) → PR ratchet on GPU (-40) → calibration event (-39) → 4.1 regression and leaks (-41..-43) → devices before RC-1 (-48)

**Requirements closed by this lane:** REQ-QUAL-04, REQ-QUAL-05, REQ-QUAL-08, REQ-QUAL-10, REQ-QUAL-20, REQ-QUAL-21, REQ-QUAL-23, REQ-QUAL-24, REQ-QUAL-27, REQ-QUAL-30, REQ-QUAL-31, REQ-QUAL-32, REQ-QUAL-34, REQ-QUAL-35, REQ-QUAL-36, REQ-QUAL-37, REQ-QUAL-38, REQ-QUAL-39, REQ-QUAL-40, REQ-QUAL-41, REQ-QUAL-42, REQ-QUAL-43, REQ-QUAL-44, REQ-QUAL-45, REQ-QUAL-46, REQ-QUAL-47, REQ-QUAL-48, REQ-QUAL-53, REQ-QUAL-54, REQ-QUAL-55, REQ-QUAL-56, REQ-QUAL-59, REQ-QUAL-60, REQ-QUAL-61, REQ-QUAL-62, REQ-QUAL-64.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q6 -b next-qual/q6-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5f-Q6") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-129 | MODIFY | `lint/rules/qual/` | [REQ-QA-41] MODIFY the existing eslint-plugin-auraglass.js (PKG-owned plugin, SC-16) to register no-vacuous-assertions from packages/qa/eslint/no-vacuous-assertions.js, … |  | REQ-QUAL-31 |
| QUAL-130 | MODIFY | `lint/rules/qual/` | MODIFY PKG's eslint-plugin-auraglass.js (SC-16: one plugin, namespace auraglass/, wired by PKG-015; no separate eslint-plugin-aura-stories package). Add a shared … |  | REQ-QUAL-55 |
| QUAL-131 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-optics (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report style/object keys backdropFilter, WebkitBackdropFilter, filter, … | QUAL-130 | REQ-QUAL-55 |
| QUAL-132 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-important (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report `!important` in template literals, string literals, <style> JSX … | QUAL-130 | REQ-QUAL-55 |
| QUAL-133 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-ink-override (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report `color`, `--ag-on-surface*`, `--glass-text-*` set via style or … | QUAL-130 | REQ-QUAL-10, REQ-QUAL-55 |
| QUAL-134 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-tone-class (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report className strings/templates/clsx args matching … | QUAL-130 | REQ-QUAL-55 |
| QUAL-135 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-stage-background (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report background/backgroundColor/backgroundImage/background* on any … | QUAL-130 | REQ-QUAL-55 |
| QUAL-136 | MODIFY | `lint/rules/qual/` | Rule auraglass/story-no-private-vars (REQ-SB-30, SC-16) added to eslint-plugin-auraglass.js. Report any `--_ag-` occurrence (style keys, strings, templates) outside … | QUAL-130 | REQ-QUAL-55 |
| QUAL-137 | MODIFY | `lint/rules/qual/` | Add flat-config blocks: (1) ['**/*.stories.tsx','showcase/**/*.{ts,tsx}','.storybook/**/*.{ts,tsx}'] with TS parser + auraglass/story-* at warn; (2) showcase/** … |  | REQ-QUAL-54, REQ-QUAL-59, REQ-QUAL-55 |
| QUAL-138 | MODIFY | `lint/rules/qual/` | Before 5.0 beta: all six auraglass/story-* rules to error; scripts/storybook/story-lint-baseline.json 0/0 for optics, !important, copy, timers; … |  | REQ-QUAL-55, REQ-QUAL-56 |
| QUAL-139 | MODIFY | `tests/perf/harness/budgets.json` | SC-15: register the PRD §16 runtime rows (blurred surfaces <=6 fine / <=3 coarse, refracting <=2; 0 infinite animations after settle; showcase hover+scroll p50 >=110 … | QUAL-178, QUAL-173 | REQ-QUAL-35 |
| QUAL-140 | MODIFY | `tests/perf/size-budgets.test.ts` | REQ-PERF-01: extend PKG-050's tests/perf/size-budgets.test.ts (PKG creates it; SC-15, OV-07) with PERF's rows: run scripts/ci/verify-size-budgets.mjs --json against CI … |  | REQ-QUAL-34, REQ-QUAL-39 |
| QUAL-141 | TEST | `NEW:tests/perf/size-rows.test.ts` | Assert every PRD §16.1 row and every subject in tests/perf/harness/budgets.json (44 §11.2 flagships + T2 core) has a docs/size-budgets.json row; a graded component with … | QUAL-178 | REQ-QUAL-10 |
| QUAL-142 | MODIFY | `tests/perf/size-budgets-ratchet.test.ts` | REQ-PERF-02/-38: extend PKG-052's tests/perf/size-budgets-ratchet.test.ts (PKG creates it) with the x1.10 assertion: compare docs/size-budgets.json to merge base; any … |  | REQ-QUAL-39, REQ-QUAL-24 |
| QUAL-143 | TEST | `NEW:tests/perf/tree-shake-zero.test.ts` | REQ-PERF-03: for every value export X of '.' in build/exports.manifest.json, esbuild-bundle import { X } (minify, metafile, React external, sideEffects honoured); fail … |  | REQ-QUAL-46 |
| QUAL-144 | MODIFY | `scripts/qual/verify-side-effects.mjs` | REQ-PERF-04: if absent, add traps for globalThis.requestIdleCallback and Storage.prototype.setItem to PRD-02's single side-effect implementation (no new script); … |  | REQ-QUAL-47 |
| QUAL-145 | TEST | `tests/perf/dist-purity.test.ts` | REQ-PERF-05 = REQ-PKG-04: verify only. PKG-024 creates and owns tests/perf/dist-purity.test.ts (acorn parse of dist/**/*.js; impure top-level statements, … |  | REQ-QUAL-32 |
| QUAL-146 | TEST | `NEW:tests/perf/no-global-mutation.test.ts` | REQ-PERF-07: scan src/**/*.{ts,tsx,js} (excluding stories/tests) for ChartJS.register, Chart.defaults, defaults.plugins, module-scope window.<x> = (TypeScript AST … |  | REQ-QUAL-46 |
| QUAL-147 | TEST | `NEW:tests/perf/dev-only-elimination.test.ts` | REQ-PERF-08: esbuild bundle of { AuraGlassProvider } from aura-glass/theme with NODE_ENV=production, minify: 0 'surfaceCounter', 0 /\[aura-glass\][^"']*surface/, 0 … |  |  |
| QUAL-148 | TEST | `NEW:tests/perf/css-budget.test.ts` | REQ-PERF-10: gzip-9 dist/css/styles.css <= 32768 B; each manifest per-subpath CSS (data, date, ai, media, app-shell, backdrops) <= 6144 B (PRD-02 accepted 6 KB); … |  | REQ-QUAL-24 |
| QUAL-149 | CREATE | `NEW:scripts/qual/verify-css-perf.mjs` | REQ-PERF-12/-13/-23: PostCSS AST checker (no stylelint). Rules: backdrop-filter blur radii in {0,12px,20px,32px} with same-file var() resolution (unresolvable = fail); … |  | REQ-QUAL-44 |
| QUAL-150 | TEST | `NEW:tests/perf/css-blur-scale.test.ts` | REQ-PERF-12: run verify-css-perf.mjs strictly over dist/**/*.css, assert 0 blur-scale findings; fixture tests/perf/fixtures/css/blur-40.css must produce >=1 finding. | QUAL-149 | REQ-QUAL-44 |
| QUAL-151 | TEST | `NEW:tests/perf/css-filter-chain.test.ts` | REQ-PERF-13: every shipped backdrop-filter value matches the 3-function chain or ag-lens url regex; 0 contrast(); fixture contrast-chain.css must fail. | QUAL-149 | REQ-QUAL-44 |
| QUAL-152 | TEST | `NEW:tests/perf/css-layer-forcing.test.ts` | REQ-PERF-23 CSS half: verify-css-perf.mjs strict over dist/**/*.css asserts 0 translateZ(0)/translate3d(0,0,0)/backface-visibility:hidden and 0 unscoped will-change; … | QUAL-149 | REQ-QUAL-45 |
| QUAL-153 | INFRA | `NEW:tests/perf/baselines/src-css-perf.baseline.json` | Generate (in CI, at merge base) the per-rule/per-file finding counts of verify-css-perf.mjs over src/**/*.css and src/**/*.module.css (seeds: … | QUAL-149 | REQ-QUAL-04 |
| QUAL-154 | TEST | `NEW:tests/perf/js-animated-properties.test.ts` | REQ-PERF-20 and REQ-PERF-25 JS half: acorn over dist/**/*.js flags .animate( keyframes with backdropFilter, filter, --_ag-blur, … |  | REQ-QUAL-44 |
| QUAL-155 | TEST | `NEW:tests/perf/no-runtime-sampling.test.ts` | REQ-PERF-31: dist/**/*.js has 0 elementsFromPoint; new MutationObserver( only in files whose source-map origin is src/primitives/DismissableLayer* or @base-ui; 0 … |  | REQ-QUAL-46 |
| QUAL-156 | TEST | `NEW:tests/perf/optics-residue.test.ts` | REQ-PERF-14: count backdrop-filter\|backdropFilter\|backdrop-blur in src/** outside src/material/**, stories, tests; ratchet vs NEW … |  | REQ-QUAL-53 |
| QUAL-157 | MODIFY | `NEW:tests/perf/ci-wiring.qual.test.ts` | REQ-PERF-11: parse ci/qual.gitlab-ci.yml and fragments/lanes/qual.ts: QUAL's perf-static and perf-artifact steps exist inside lane jobs L1/L2, none is allow_failure … |  | REQ-QUAL-27 |
| QUAL-158 | MODIFY | `tests/perf/ci-wiring.test.ts` | AC-PERF-19 package.json half, added to PKG-055's tests/perf/ci-wiring.test.ts: no bundlesize key/devDependency, no size-check or check:perf scripts, no … | QUAL-157 |  |
| QUAL-159 | MODIFY | `lint/rules/qual/` | REQ-PERF-23 rule auraglass/no-transition-all: report transition values matching /(^\|,)\s*all\b/ and transitionProperty 'all' in JSX style objects, … |  | REQ-QUAL-45 |
| QUAL-160 | MODIFY | `lint/rules/qual/` | REQ-PERF-23 rule auraglass/no-permanent-will-change: report willChange/will-change with any non-'auto' value (including conditional expressions) in style contexts and … |  | REQ-QUAL-45 |
| QUAL-161 | MODIFY | `lint/rules/qual/` | REQ-PERF-23 rule auraglass/no-translatez-hack: report translateZ(0\|0px), translate3d(0,0,0) any spacing/units, backfaceVisibility/WebkitBackfaceVisibility 'hidden' in … |  | REQ-QUAL-45 |
| QUAL-162 | MODIFY | `lint/rules/qual/` | REQ-PERF-28 rule auraglass/raf-requires-cancel: every requestAnimationFrame return value must be assigned and passed to cancelAnimationFrame in the enclosing … |  | REQ-QUAL-45 |
| QUAL-163 | MODIFY | `lint/rules/qual/` | REQ-PERF-28 rule auraglass/raf-requires-visibility-gate: a self-rescheduling rAF loop must read document.visibilityState/document.hidden, listen to visibilitychange, or … |  | REQ-QUAL-45 |
| QUAL-164 | MODIFY | `lint/rules/qual/` | REQ-PERF-29 rule auraglass/no-global-pointer-listener: report window/document/globalThis/documentElement/body addEventListener or on<type>= for mousemove, pointermove, … |  | REQ-QUAL-45 |
| QUAL-165 | MODIFY | `lint/rules/qual/` | Register the six PERF rules as 'warn' (report-only, ratchet step 0) in eslint.config.js and .eslintrc.js; layer-forcing + pointer rules on src/**/*.{ts,tsx,js,jsx} … | QUAL-159, QUAL-160, QUAL-161, QUAL-162, QUAL-163, QUAL-164 | REQ-QUAL-05 |
| QUAL-166 | TEST | `NEW:tests/lint/qual/perf-lint-ratchet.test.ts` | Generate NEW tests/lint/baselines/perf-lint.baseline.json in CI at merge base (per-rule and per-file counts of the six rules over src/); test fails if any rule or file … | QUAL-165 | REQ-QUAL-30 |
| QUAL-167 | TEST | `NEW:tests/lint/qual/layer-forcing-rules.test.ts` | RuleTester (@typescript-eslint/parser, JSX) for no-transition-all, no-permanent-will-change, no-translatez-hack: >=3 valid and >=3 invalid each, including transition … | QUAL-159, QUAL-160, QUAL-161 |  |
| QUAL-168 | TEST | `NEW:tests/lint/qual/raf-rules.test.ts` | RuleTester for raf-requires-cancel and raf-requires-visibility-gate on virtual filenames under src/media, src/backdrops, src/three, src/motion: >=3 valid/>=3 invalid … | QUAL-162, QUAL-163 |  |
| QUAL-169 | TEST | `NEW:tests/lint/qual/no-global-pointer-listener.test.ts` | RuleTester: invalid window mousemove, document pointermove passive, window.onscroll=, window deviceorientation; valid same in src/motion/pointerLight.ts, element-ref … | QUAL-164 | REQ-QUAL-45 |
| QUAL-170 | REMOVE | `scripts/audit/3.1-frame-loop-audit.js` | After mapping every check of scripts/audit/3.1-frame-loop-audit.js, scripts/audit/runtime-cleanliness-audit.js, scripts/scan-motion-performance.js to a successor (PERF … | QUAL-166, QUAL-149 |  |
| QUAL-171 | CREATE | `NEW:tests/perf/harness/instrument.js` | Page init script: wrappers for rAF/cAF, setInterval/clearInterval, setTimeout, window/document add/removeEventListener per type, Mutation/Resize/IntersectionObserver … | QUAL-184 | REQ-QUAL-42, REQ-QUAL-20 |
| QUAL-172 | CREATE | `NEW:tests/perf/harness/perf-results.schema.json` | JSON Schema 2020-12 for perf-results.json: sha, runnerInstanceType, browser, gpu status, profile (a60\|a120\|b\|c\|d-webkit\|d-gecko), records with every §4.6 metric … |  | REQ-QUAL-34, REQ-QUAL-35 |
| QUAL-173 | CREATE | `NEW:tests/perf/harness/run-perf.mjs` | REQ-PERF-32 core: remote-only guard (exit 2 'remote-only' without AG_REMOTE_RUNNER=1); serves storybook-static on 127.0.0.1; per subject x viewport x tier x scene opens … | QUAL-171, QUAL-172 | REQ-QUAL-34 |
| QUAL-174 | MODIFY | `tests/perf/harness/run-perf.mjs` | Profiles: (a) headed Chromium on GPU worker (g5/g4dn), DPR 2, --enable-gpu-rasterization, vsync on, virtual display 60 Hz and 120 Hz verified from DrawFrame spacing … | QUAL-173 | REQ-QUAL-34, REQ-QUAL-20 |
| QUAL-175 | MODIFY | `tests/perf/harness/run-perf.mjs` | REQ-PERF-33: measure perf-harness-blank--default first per profile; every record carries deltaVsBlank {frameP95, longTasksTotalMs}; grades use absolute frame time and … | QUAL-173 | REQ-QUAL-35 |
| QUAL-176 | CREATE | `NEW:tests/perf/harness/grade.mjs` | REQ-PERF-34: per subject worst cell over profiles a120 and b at standard/photo; column letters per PRD §4.7 (frame, LoAF>100ms, settled idle, heap delta, bundle % of … | QUAL-173, QUAL-178 | REQ-QUAL-37 |
| QUAL-177 | TEST | `NEW:tests/perf/harness/grade.test.ts` | Table-driven boundaries: 8.3 ms->A, 8.31->B, 16.7->C, 25->D, 25.1->F (a120); heap 0.5->A, 0.51->B; bundle 80%->A, 80.1%->B; settled 1->F; LoAF 1->C, 4->F; T2 BCI … | QUAL-176 | REQ-QUAL-37, REQ-QUAL-62 |
| QUAL-178 | CREATE | `NEW:tests/perf/harness/budgets.json` | Provisional targets: subjects (44 §11.2 flagships tier T1 with flagshipNo, ~40 §11.1 T2 Core names, storyIds filled as PRDs land; empty storyIds grades F), scenes (6 … |  | REQ-QUAL-38, REQ-QUAL-34 |
| QUAL-179 | TEST | `NEW:tests/perf/harness/budgets-frozen.test.ts` | REQ-PERF-38: surface/bci/nesting/frame values may not increase vs merge base unless tag v5.0.0-alpha.1 absent and PR labelled perf-budget-raise; after the tag, git log … | QUAL-178 | REQ-QUAL-39 |
| QUAL-180 | MODIFY | `tests/perf/harness/run-perf.mjs` | Label read-back: after load read <html data-ag-tier>, matchMedia pointer coarse, prefers-reduced-motion and preview scene id; any mismatch with the requested cell fails … | QUAL-173 | REQ-QUAL-34, REQ-QUAL-20 |
| QUAL-181 | MODIFY | `tests/perf/harness/run-perf.mjs` | §13.6 metadata contract: read parameters.perf {budget {surfaces, bci}, interaction} from the preview story store; missing on a subject story fails 'missing … | QUAL-173 | REQ-QUAL-34, REQ-QUAL-20 |
| QUAL-182 | TEST | `NEW:tests/perf/harness/self-test.spec.ts` | REQ-PERF-32/-33: run run-perf.mjs on perf-self-test--regression (profiles c and b): exit != 0, longTasks.maxMs >= 190, settled.infinite >= 1 on backdrop-filter; blank … | QUAL-173, QUAL-174, QUAL-175, QUAL-181 | REQ-QUAL-34 |
| QUAL-183 | TEST | `NEW:tests/perf/node-cold-import.test.mjs` | REQ-PERF-09: npm pack -> install into scratch project; per Node 20.19.0 and 22 LTS drop page cache (sudo tee /proc/sys/vm/drop_caches) then 11 fresh processes per entry … |  | REQ-QUAL-47 |
| QUAL-184 | CREATE | `NEW:tests/perf/harness/bci.mjs` | Pure computeBci(elements, viewport) = sum(visibleArea/viewportArea x blurPx/20) for non-none backdrop-filter (::before or host); visibleArea clipped by viewport and … |  | REQ-QUAL-34 |
| QUAL-185 | TEST | `NEW:tests/perf/browser/qual/host-backdrop-root.spec.ts` | REQ-PERF-15, Chromium/WebKit/Gecko: every .ag-surface host in budgets.json subject stories and PRD-04 Material Lab matrix has computed backdrop-filter none, filter … | QUAL-171 | REQ-QUAL-43 |
| QUAL-186 | TEST | `NEW:tests/perf/browser/qual/nesting-collapse.spec.ts` | REQ-PERF-16, x3 engines: perf-nesting--nest-4 allowNestedLevel 0 -> exactly 1 element with non-none ::before backdrop-filter, nesting 1; allowNestedLevel 2 -> 2 and … | QUAL-185 | REQ-QUAL-34 |
| QUAL-187 | TEST | `NEW:tests/perf/browser/qual/surface-budget.spec.ts` | REQ-PERF-17, x3 engines: six product scenes + every T1 default story at scroll top/middle/bottom and with all overlays opened: 1440x900 and 1920x1080 fine -> blurred … | QUAL-185, QUAL-178, QUAL-184 | REQ-QUAL-38 |
| QUAL-188 | TEST | `tests/perf/browser/qual/surface-budget.spec.ts` | §15.1: under forcedColors active, prefers-reduced-transparency reduce (Chromium setEmulatedMedia; attribute-only cell label where an engine lacks it) and … | QUAL-187 | REQ-QUAL-38 |
| QUAL-189 | TEST | `NEW:tests/perf/browser/qual/overlay-cost.spec.ts` | REQ-PERF-18 + REQ-PERF-12 scrim, x3 engines: Dialog open over photo = exactly 2 blurred (scrim <=12 px full viewport, panel 32 px), 0 blurred panel descendants, BCI <= … | QUAL-187 | REQ-QUAL-44 |
| QUAL-190 | TEST | `NEW:tests/perf/browser/qual/appshell-cost.spec.ts` | REQ-PERF-19, x3 engines: AppShell + TopBar + Sidebar + Inspector + StatusBar + 8 Card + Table -> blurred <=3 at fine pointer per SC-38 (TopBar, Sidebar, Inspector; … | QUAL-187 | REQ-QUAL-38 |
| QUAL-191 | TEST | `NEW:tests/perf/browser/qual/svg-lens-budget.spec.ts` | REQ-PERF-21, x3 engines: perf-lens--lens-3 count 10 at enhanced: one svg[data-ag-lens-defs]; filter ids match ^ag-lens-(fixed\|capsule\|concentric)-(control\|bar\|panel)$; … |  | REQ-QUAL-43 |
| QUAL-192 | TEST | `NEW:tests/perf/browser/qual/webgl-budget.spec.ts` | REQ-PERF-22, Chromium: perf-webgl--webgl-3 live contexts <=1; after unmount 0 and loseContext called; real hidden tab (second page bringToFront, verify visibilityState … |  | REQ-QUAL-43 |
| QUAL-193 | TEST | `NEW:tests/perf/browser/qual/will-change-lifecycle.spec.ts` | REQ-PERF-24, x3 engines: Dialog open/close: panel has [data-starting-style] or [data-ag-animating] with will-change != auto during transition; 100 ms after … | QUAL-189 | REQ-QUAL-23 |
| QUAL-194 | TEST | `NEW:tests/perf/browser/qual/settled-idle.spec.ts` | REQ-PERF-26, x3 engines: every T1/T2 subject story 500 ms after last transition/animation end with no input -> pending rAF 0, intervals 0, infinite animations 0; … | QUAL-185, QUAL-178 | REQ-QUAL-23 |
| QUAL-195 | TEST | `NEW:tests/perf/browser/qual/mount-unmount-leak.spec.ts` | REQ-PERF-27, Chromium --js-flags=--expose-gc: per flagship via perf-mount-cycle--default, 10 mount/unmount cycles; window/document listener counts, observers, … | QUAL-171 | REQ-QUAL-42 |
| QUAL-196 | TEST | `NEW:tests/perf/browser/qual/hydration-stability.spec.ts` | REQ-PERF-30, Chromium: NEW helpers/hydration-build.mjs + hydration-page.tsx build each product scene with renderToString (AuraGlassScript in head) and a client bundle … |  | REQ-QUAL-21 |
| QUAL-197 | TEST | `NEW:tests/perf/browser/qual/dev-counter.spec.ts` | REQ-PERF-39, Chromium dev Storybook: perf-budget--budget-7 count 7 fine -> exactly 1 '[aura-glass] surface budget' warning per crossing; 6 -> 0; 4 coarse -> 1; no … |  | REQ-QUAL-34, REQ-QUAL-24 |
| QUAL-198 | TEST | `tests/perf/browser/qual/surface-budget.spec.ts` | §14 resize, Chromium: dashboard scene in the Profiler page, 1440x900 -> 390x844: library commits <=1 per component, 0 new composited layers for .ag-surface (CDP … | QUAL-187, QUAL-196 | REQ-QUAL-38 |
| QUAL-199 | TEST | `NEW:tests/perf/browser/qual/input-latency.spec.ts` | §15.7 (new spec file, recorded deviation): event-timing entries for scripted keydown (ArrowDown x10, Enter, Escape) on Menu, Select, Combobox, Tabs: p95 <=50 ms desktop … | QUAL-174 | REQ-QUAL-38, REQ-QUAL-31 |
| QUAL-200 | TEST | `NEW:tests/perf/browser/qual/component-budgets.spec.ts` | §7 specific budgets (new spec file, recorded deviation): indicator switch LayoutCount delta 0 after first frame, transform only; Table 10,000 rows virtualized (DOM rows … | QUAL-174 | REQ-QUAL-08 |
| QUAL-201 | TEST | `NEW:tests/perf/browser/qual/evidence-captures.spec.ts` | Remote screenshots of Dialog open, AppShell dashboard and the six scenes at 1440 fine and 390 coarse over photo, each with a JSON sidecar of blurred elements and BCI; … | QUAL-187, QUAL-189, QUAL-190 | REQ-QUAL-61, REQ-QUAL-62 |
| QUAL-202 | TEST | `NEW:tests/perf/browser/qual/regression-4x.spec.ts` | REQ-PERF-35: derive NEW tests/perf/baselines/runtime-4x.json by script from docs/auraglass-5/autopsy/remote-evidence/metrics.json (4 stories x desktop/mobile, source … | QUAL-174, QUAL-175, QUAL-189, QUAL-190 | REQ-QUAL-41 |
| QUAL-203 | TEST | `NEW:tests/perf/browser/qual/pr-ratchet.spec.ts` | REQ-PERF-36: download main artifact perf-results-a120-<merge-base-sha>; run profile (a) 120 Hz on 44 flagships at standard; fail if p95 rises > max(10%, 1 ms) or … | QUAL-174 | REQ-QUAL-40 |
| QUAL-204 | MODIFY | `lint/rules/qual/` | Ratchet flip (QUAL-internal, state-triggered): six PERF rules warn -> error in .eslintrc.js and eslint.config.js once their baseline is 0 for src paths shipped in 5.0 … | QUAL-165, QUAL-166 | REQ-QUAL-05 |
| QUAL-205 | TEST | `tests/perf/harness/grade.mjs` | RC: run profiles a60, a120, b, c, d on the RC SHA; grade.mjs writes perf-grades.json for every flagship and T2; gate 0 T1 < C, 0 T2 < D, every T1 frame p95 <=16.7 ms at … | QUAL-176, QUAL-187, QUAL-194, QUAL-195 | REQ-QUAL-37, REQ-QUAL-62 |
| QUAL-206 | CREATE | `NEW:tests/perf/devices/device-farm-run.mjs` | REQ-PERF-37: tagged AWS Device Farm (us-west-2) project via governed aws wrapper; remote-access/Appium sessions on iPhone 13 (Safari 18 and 26), Pixel 7 Chrome, Moto G … | QUAL-171 | REQ-QUAL-48 |
| QUAL-207 | CREATE | `NEW:tests/perf/devices/appium-probe.mjs` | Inject instrument.js; Dialog open/close x10 and AppShell scroll x3 over the six scenes; frame p95 from rAF probe; Android LoAF counts via adb forward tcp:9222 … | QUAL-206 | REQ-QUAL-48 |
| QUAL-208 | DOC | `NEW:docs/certification/real-device-matrix.md` | Manual sign-off record (§16.6): rows device x {Dialog open/close p95, AppShell scroll p95} with OS/browser version, session ARN, SHA, p95, budget, pass/fail, exception … | QUAL-206, QUAL-207 | REQ-QUAL-48, REQ-QUAL-64 |
| QUAL-209 | DOC | `docs/certification/real-device-matrix.md` | DoD 8: hand perf-fixture-captures-<sha> and perf-budget-captures-<sha> for the RC SHA to a named human reviewer through PRD-19 L14 review-record flow (material still … | QUAL-201 | REQ-QUAL-48, REQ-QUAL-62 |
| QUAL-210 | DOC | `docs/certification/real-device-matrix.md` | Build the AC-PERF-01..20 table for the RC SHA from CI artifacts (run URLs + artifact names) in the final report; verify the PLAT docs-site grade page reads … | QUAL-205, QUAL-208 | REQ-QUAL-48, REQ-QUAL-60 |
| QUAL-211 | INFRA | `tests/perf/devices/device-farm-run.mjs` | DoD 9: list every EC2 instance, mac1.metal Dedicated Host, Device Farm project/session tagged with the attempt id; terminate/release/stop; report ids and final states. | QUAL-206, QUAL-205, QUAL-202 | REQ-QUAL-48, REQ-QUAL-05 |
| QUAL-306 | CREATE | `NEW:packages/qa/src/perf/bci.ts` | Implement §4.6 BCI behind perf.bci (S-40; replaces the seed area-weighted fraction): effective nesting per element = ancestors whose ::before computed backdrop-filter … |  | REQ-QUAL-36 |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-39, S-41, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q6 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
