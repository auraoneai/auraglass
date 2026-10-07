# PROMPT-07b (PERF): Runtime-hygiene lint rules

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PERFORMANCE_PRD.md` (Key PERF; alias PRD-07) §4.4, §5.3, §6 (`eslint-plugin-auraglass.js` row, seed-script row), §8, §12, §20 Wave 0 and Wave 3.
Requirement IDs: REQ-PERF-23 (JS/TSX half: `no-transition-all`, `no-permanent-will-change`, `no-translatez-hack`), REQ-PERF-28 (`raf-requires-cancel`, `raf-requires-visibility-gate`), REQ-PERF-29 (`no-global-pointer-listener`).
Acceptance inputs: AC-PERF-05 (source half), AC-PERF-11 (static half). Tasks: `docs/auraglass-5/tasks/PERF.json` PERF-025..PERF-036. The report→error flip is 07e PERF-077.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Architecture decisions win; deviations go in the final report with evidence.
- This prompt is static only. Locally allowed: `node_modules/.bin/jest tests/lint/<file>`, `node_modules/.bin/eslint <paths>`, `npm run typecheck`. No browser, no Docker, no full build. The full `eslint src` count runs in CI (L1 Static: the `perf-static` step 07a adds inside the required `Glass Quality Gates` check).
- No fake completion: no `.skip`/`.only`/`.todo`, no `--passWithNoTests`, no `eslint-disable` comments added to source to reduce counts, no lowered baselines except by real fixes, no rule options that exempt the 4.x offenders by path.
- Do not add dependencies. ESLint is 8.57.1 at HEAD; `@typescript-eslint/parser` 8.x and `typescript` resolve. Rules are CommonJS objects in the existing `module.exports.rules` map of `eslint-plugin-auraglass.js` (pattern: `'no-inline-glass'` at line 10).
- **SC-16 (binding).** `eslint-plugin-auraglass.js` and its `eslint.config.js` wiring are owned by PKG (PKG-015); the six `auraglass/*` rules here are PERF-owned and every plugin task (PERF-025..030) is a MODIFY of the existing file, never a CREATE. Coordinate with MOT (`PROMPT_06e_MOT_LINT.md`, MOT-071/072) which adds `motion-*` rules to the same file and `tests/lint/motion-rules.test.ts`; never edit their rules. MAT owns `no-optics-outside-material` (MAT-004), PKG the hydration rules, A11Y `no-document-escape`.

## Prerequisites

1. Hard — PKG `PROMPT_02a_PKG_BUILD.md` task PKG-015 (ESM conversion of `eslint-plugin-auraglass.js`/`eslint.config.js`) merged, or not yet started (then work on the current CommonJS file and rebase). Check `git status --short eslint-plugin-auraglass.js eslint.config.js .eslintrc.js` is clean before starting (rebase onto any 06e/04a edits).
2. Soft: `src/motion/ticker.ts` (MOT-040) and `src/motion/pointerLight.ts` (MOT-042), both from MOT `PROMPT_06c_MOT_RUNTIME.md` (REQ-MOT-33/40), may not exist yet. The allowlist in `no-global-pointer-listener` names them anyway; the rule test uses virtual filenames, so it does not depend on them.

## May touch

- `eslint-plugin-auraglass.js` (MODIFY of PKG's file: six new rule entries only)
- `eslint.config.js`, `.eslintrc.js` (registration of the six rules, scoped `files`/`overrides`)
- NEW `tests/lint/layer-forcing-rules.test.ts`, NEW `tests/lint/raf-rules.test.ts`, NEW `tests/lint/no-global-pointer-listener.test.ts`, NEW `tests/lint/perf-lint-ratchet.test.ts`
- NEW `tests/lint/baselines/perf-lint.baseline.json`
- Delete `scripts/audit/3.1-frame-loop-audit.js`, `scripts/audit/runtime-cleanliness-audit.js`, `scripts/scan-motion-performance.js` (only in PERF-036, after their checks are ported) and their `package.json` script entries

## Must not touch

`src/**` (no fixes in this prompt; fixes belong to the component PRDs), other rules in the plugin, PRD-06/PRD-04 tests, `reports/**`.

## Steps

1. **Read the seeds.** `scripts/audit/3.1-frame-loop-audit.js`, `scripts/audit/runtime-cleanliness-audit.js`, `scripts/scan-motion-performance.js`. List every pattern they detect; each must map to one of the six rules, REQ-MOT-65/66 (PRD-06) or 07a's `verify-css-perf.mjs`. Put the mapping table in the final report.
2. **PERF-025 `auraglass/no-transition-all`.** Reports a `Property` node named `transition` whose literal/template value matches `/(^|,)\s*all\b/`, or `transitionProperty` equal to `'all'`, inside a JSX `style={{…}}` object, an object passed to `Object.assign(el.style, …)`, a `styled`/CSS-in-JS object, or an assignment `el.style.transition = '…all…'`. Message id `transitionAll`.
3. **PERF-026 `auraglass/no-permanent-will-change`.** Reports `willChange` / `will-change` with any value other than `'auto'` in those same contexts, and `el.style.willChange = '<non-auto>'`, unless the file is under `src/motion/**` (REQ-MOT-17 lifecycle owner). A conditional value (`willChange: animating ? 'transform' : 'auto'`) is still reported: the contract is the `[data-ag-animating]` CSS selector, not JS state. Message id `permanentWillChange`.
4. **PERF-027 `auraglass/no-translatez-hack`.** Reports string/template literals in style contexts containing `translateZ(0)`, `translateZ(0px)`, `translate3d(0,0,0)` (any whitespace, `0px` variants), and `backfaceVisibility: 'hidden'` / `WebkitBackfaceVisibility: 'hidden'`. Excludes `src/three/**` (real 3D). Message id `layerHack`.
5. **PERF-028 `auraglass/raf-requires-cancel`.** For each `requestAnimationFrame(…)` call (global, `window.`, `globalThis.`): the return value must be assigned to an identifier or member (`ref.current`, `this.id`); that identifier must be passed to `cancelAnimationFrame` within (a) the cleanup function returned by the enclosing `useEffect`/`useLayoutEffect` callback, or (b) a function or method named `stop`, `dispose`, `destroy`, `cancel` or `unsubscribe` in the same module scope. Unassigned calls are reported (`rafUnassigned`), assigned-but-never-cancelled are reported (`rafNotCancelled`).
6. **PERF-029 `auraglass/raf-requires-visibility-gate`.** A rAF *loop* (a function that calls `requestAnimationFrame` with itself, directly or via a const alias) must, in the same module, either read `document.visibilityState` / `document.hidden` or add a `visibilitychange` listener, or import from `src/motion/ticker` (relative or `@/motion/ticker`) and call its subscribe API instead. Message id `rafNoVisibilityGate`.
7. **PERF-030 `auraglass/no-global-pointer-listener`.** Reports `window|document|globalThis|document.documentElement|document.body` `.addEventListener('<t>', …)` and `on<t> =` assignments where `<t>` ∈ {`mousemove`, `pointermove`, `scroll`, `deviceorientation`, `touchmove`, `wheel`} (the last two added by this prompt because they are the same global-listener class; record as deviation), unless the filename is `src/motion/pointerLight.ts` or `src/motion/ticker.ts`. Also reports `useEventListener('<t>', …)`-style hooks whose target argument is omitted or is `window`/`document`.
8. **PERF-031 Wiring (report-only, Wave 0).** Register all six in `eslint.config.js` and `.eslintrc.js` as `'warn'`. Scopes: `no-transition-all`, `no-permanent-will-change`, `no-translatez-hack`, `no-global-pointer-listener` → `src/**/*.{ts,tsx,js,jsx}` excluding stories/tests; `raf-requires-cancel`, `raf-requires-visibility-gate` → `src/three/**`, `src/media/**`, `src/backdrops/**`, `src/motion/**` plus `packages/labs/src/**` if it exists (component and primitive directories are covered by PRD-06 `motion-raf-via-ticker`, `src/material/**` by REQ-MAT-53).
9. **PERF-032 Baseline + ratchet.** Run the six rules over `src/` in CI (`node_modules/.bin/eslint src --rule … --format json`) at the merge base; write per-rule counts and per-file counts to `tests/lint/baselines/perf-lint.baseline.json` (generated by a node snippet, not hand-typed; the snippet is part of `perf-lint-ratchet.test.ts`). `tests/lint/perf-lint-ratchet.test.ts` runs ESLint's Node API with only these rules and fails if any rule's count, or any file's count, exceeds the baseline. Known 4.x offenders that must appear in the baseline: `src/components/tree-view/TreeItem.tsx:378` (will-change), `src/components/advanced/GlassMagneticCursor.tsx` (global mousemove), `src/animations/hooks/useMouseMagneticEffect.ts:110-120`. (`src/hooks/useEnhancedPerformance.ts:70-88` is outside the rAF rules' scope; its removal is PRD-16's and is verified at runtime by 07d `settled-idle.spec.ts`.)
10. **PERF-033/034/035 RuleTester suites.** Use `RuleTester` from `eslint` with `@typescript-eslint/parser`, JSX on, and per-case `filename`. Minimums: ≥3 valid and ≥3 invalid per rule (PRD floor), and these specific cases:
    - `layer-forcing-rules.test.ts`: invalid `style={{transition:'all 200ms'}}`, `el.style.transition='opacity .2s, all .3s'`, `style={{willChange:'transform'}}`, `style={{willChange: a ? 'opacity' : 'auto'}}`, `style={{transform:'translateZ(0)'}}`, `` style={{transform:`translate3d(0, 0, 0)`}} ``, `style={{backfaceVisibility:'hidden'}}`; valid `transition:'opacity 200ms'`, `willChange:'auto'`, `src/three/Scene.tsx` with `translateZ(0)`, `src/motion/x.ts` with dynamic `willChange`.
    - `raf-rules.test.ts`: invalid unassigned `requestAnimationFrame(tick)` in `src/media/a.ts`; assigned but cleanup missing; loop without visibility gate in `src/backdrops/b.ts`; valid: effect with `const id = requestAnimationFrame(f); return () => cancelAnimationFrame(id)`, class with `stop(){cancelAnimationFrame(this.id)}`, loop gated by `document.visibilityState === 'hidden'`, loop using `ticker.subscribe`.
    - `no-global-pointer-listener.test.ts`: invalid `window.addEventListener('mousemove',f)`, `document.addEventListener('pointermove',f,{passive:true})`, `window.onscroll=f`, `window.addEventListener('deviceorientation',f)`; valid same calls with `filename: 'src/motion/pointerLight.ts'`, `el.addEventListener('pointermove',f)` on an element ref, `window.addEventListener('resize',f)`.
11. **PERF-036 Retire seeds.** After step 1's mapping shows every seed check is covered, delete the three seed scripts and any `package.json` script or workflow step referencing them (`rg -n '3.1-frame-loop-audit|runtime-cleanliness-audit|scan-motion-performance' package.json .github scripts`). If a seed check has no successor, keep the script and report the gap instead of deleting.

## Tests to run

Local: `node_modules/.bin/jest tests/lint/layer-forcing-rules.test.ts tests/lint/raf-rules.test.ts tests/lint/no-global-pointer-listener.test.ts tests/lint/perf-lint-ratchet.test.ts`; `node_modules/.bin/eslint eslint-plugin-auraglass.js`; `npm run typecheck`. Remote: CI `perf-static` (or `glass-quality-gates` if 07a has not landed) runs the same files plus `npm run lint:check`; record the run URL. No visual evidence (static prompt).

## Exit criteria

- The six rules exist, are registered as `warn` in both configs, with the scopes of step 8.
- RuleTester suites green with the minimum case counts; each invalid case asserts the exact `messageId`.
- `perf-lint-ratchet.test.ts` green with a committed baseline generated in CI; introducing one new `window.addEventListener('mousemove',…)` in a scratch file makes it fail (verify on a throwaway branch, then delete the branch).
- Seed scripts retired or a written gap list (step 11).
- Feeds AC-PERF-05 (source half of layer forcing) and AC-PERF-11 (static half); those ACs close in 07a/07d/07e.

## Final report

```
PROMPT-07b result: DONE | PARTIAL | BLOCKED
SHA / branch:
Tasks PERF-025..036 -> status each
Rules: name -> valid/invalid case counts, baseline count at merge base
Seed mapping: seed check -> successor rule/gate
Tests: file -> pass/fail, CI run URL
Deviations: (touchmove/wheel addition; anything else, with evidence)
```
