# PROMPT-06e (MOT): Motion lint — `auraglass/motion-*` ESLint rules, CSS motion checker, motion categories of DS's literal rule

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` (PRD-06) §5.8, §5.4 (REQ-35), §12 (T17), §18.
Requirement IDs: REQ-MOT-35 (enforcement), -60, -61, -62, -63, -64 (5.x port of the 06a rule), -65, -66, -67, -68; test REQ-MOT-T17.
Acceptance: **AC-MOT-04**, **AC-MOT-05**. Tasks: MOT-065..MOT-075.
Contract registry: `docs/auraglass-5/prd/_shared-contracts.md` wins. SC-16: every rule is `auraglass/<kebab>` in the existing `eslint-plugin-auraglass.js` (plugin file and `eslint.config.js` wiring owned by PKG-015; every MOT task is MODIFY, never CREATE); MOT rules use the `motion-` prefix; PERF owns `no-transition-all`, `no-permanent-will-change`, `raf-requires-cancel`, `raf-requires-visibility-gate`; PKG owns `no-random-in-render`. SC-17: motion literals are the `duration|easing|spring` categories of DS's `auraglass/no-raw-design-values` with the single baseline `scripts/tokens/gates/literals-baseline.json`; there is no `motion-no-literals` rule and no `motion-literal-baseline.json`. SC-38: no hover/press transform allow-list. All rules run in lane L1 Static (SC-29).

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main`. Architecture §8 (motion lint) and D-24 win; deviations reported with evidence.
- No fake completion: rules must actually detect the fixtures; no `// eslint-disable` added to source to get green, no rule downgraded below the level stated here, no baseline inflated, no skipped tests. Unfinishable ⇒ BLOCKED.
- Local is fine for lint (light): `node_modules/.bin/eslint`, `node scripts/ci/verify-motion-css.mjs`, `npm test -- tests/lint/motion-rules.test.ts`. Use `node_modules/.bin/*`, not `npx`.
- No new dependencies: ESLint 8.57 `RuleTester` (from `eslint`), `@typescript-eslint/parser` 8.x and PostCSS 8.5 are resolvable.

## Prerequisites (verify)

1. PROMPT-06b merged: `src/motion/css/motion.css` has scalar-only hover/press rules (no transform) and `loading.css` nests `ag-sweep` under `[data-ag-continuous="on"]`.
1a. PKG-015 has wired `eslint-plugin-auraglass.js` into `eslint.config.js` (`PROMPT_02a_PKG_BUILD.md`); DS-071/072/073 exist (`PROMPT_03d_DS_GATES_LINT.md`). If not, mark MOT-066/074 BLOCKED on those ids.
2. PROMPT-06c merged: `src/motion/ticker.ts` exports `subscribe` (needed for the REQ-MOT-65 message).
3. A11Y preferences path is `src/theme/preferences/**` (SC-23, A11Y-027); it goes into the REQ-MOT-63 allow-list.
4. `auraglass/motion-no-empty-animate` (landed by TRUST-045 under that single name, extended by MOT-004 in 06a) exists on `release/4.x`; port it to `main` unchanged (MOT-069).

## May touch

`eslint-plugin-auraglass.js` (MODIFY: MOT rules only), `eslint.config.js`, `.eslintrc.js` (until PKG removes it; MOT rule severities only), `stylelint-plugin-auraglass/rules/no-raw-design-values.js` and the ESLint `no-raw-design-values` rule (MODIFY: add the `duration|easing|spring` category matchers only, MOT-066), `package.json` `scripts` (`lint:motion`, `lint:ci` only), NEW `scripts/ci/verify-motion-css.mjs`, NEW `tests/lint/motion-rules.test.ts`, NEW `tests/lint/fixtures/motion/**`.

## Must not touch

Source files under `src/**` (fixes belong to 06f and the component PRDs), `scripts/tokens/gates/literals.mjs` and `literals-baseline.json` (DS), `scripts/ci/token-lint.js`, PERF/PKG-owned rules, `reports/**`.

## Steps

1. **`auraglass/motion-no-runtime-import` (REQ-MOT-60).** Error on static `import`, `export … from`, `require()`, `import()` of `framer-motion`, `motion`, `motion/react`, `motion/*`, `popmotion`, `react-spring`, `@react-spring/*`, `gsap` when the file is outside `src/motion/adapter/**`.
2. **Motion literal categories (REQ-MOT-61, MOT-066).** MODIFY DS's `auraglass/no-raw-design-values` (ESLint and stylelint, DS-071) to report category `duration|easing|spring` for: numeric literal values of object keys `duration`, `delay`, `stiffness`, `damping`, `mass`, `bounce`, `visualDuration`; string literals/templates containing `cubic-bezier(` or `linear(`; className strings matching `\b(duration|ease|delay)-[\w[\]]+`; CSS `ms`/`s` time literals and `cubic-bezier()` in `transition*`/`animation*` outside `tokens.css`. Exempt `src/motion/**` and DS-generated token files. Counting and the ratchet are DS's: `scripts/tokens/gates/literals.mjs` (DS-072) writes per-file counts by category into `scripts/tokens/gates/literals-baseline.json` (DS-073); MOT writes no baseline. Flagship files must reach 0 (by 5.0.0-beta.1 for the whole tree).
3. **`auraglass/motion-no-hover-transform` (REQ-MOT-62).** CSS (in the checker): error on `scale`, `transform`, `translate`, `rotate` in rules whose selector contains `:hover`, `[data-highlighted]`, `:active` or `[data-pressed]`, with **no** allow-list (SC-38). JS (same rule name): error on JSX attributes `whileHover`/`whileTap` anywhere in `src/**`.
4. **`auraglass/motion-single-preference-source` (REQ-MOT-63).** Error on `matchMedia(` whose argument string contains `prefers-reduced-motion`, and on imports of `useReducedMotion`, `useEnhancedReducedMotion`, `useMotionPreference`, `useMotionPreferenceContext`, `MotionPreferenceContext`, `prefersReducedMotion`, `ReducedMotionProvider`, outside `src/theme/preferences/**` (A11Y) and `src/compat/motion/**` (the documented `useReducedMotion` compat adapter).
5. **`auraglass/motion-no-empty-animate` (REQ-MOT-64).** Port from 4.x; `error` on `src/**`.
6. **`auraglass/motion-raf-via-ticker` (REQ-MOT-65).** Error on `requestAnimationFrame(` and `setInterval(` in `src/components/**`, `src/primitives/**` and every 5.0 component directory (glob list from FND's layout); message "use ticker.subscribe from src/motion/ticker". Also error on a call to a `useState` setter (identifier bound from `const [, setX] = useState`) or `dispatch` inside a callback passed to `subscribe(` or `requestAnimationFrame(`.
7. **`auraglass/motion-gated-continuous` (REQ-MOT-66).** JS: error on `repeat: Infinity`, `iterations: Infinity`, `iterationCount: Infinity` unless inside an `if`/conditional whose test references a binding from `usePreference('allowContinuous')`. CSS (checker): error on `animation-iteration-count: infinite` or `infinite` in an `animation` shorthand unless an ancestor rule's selector contains `[data-ag-continuous="on"]`. No file-level exception for `loading.css`.
8. **`auraglass/motion-no-random` (REQ-MOT-35; MODIFY of the plugin, MOT-072; does not duplicate PKG's `no-random-in-render`, which covers render-time randomness).** Error on `Math.random()` in `src/**` when its value (directly, or through a `const`/`let` binding in the same function scope) reaches: a JSX `style`, `animate`, `initial`, `transition` or `variants` attribute; an object property named `delay`, `duration`, `x`, `y`, `scale`, `rotate`, `opacity`, `translate`; an `el.animate(` keyframe argument; or `style.setProperty(`. `Math.random()` used for IDs only is not flagged. Labs package excluded.
9. **`scripts/ci/verify-motion-css.mjs` (REQ-MOT-67).** PostCSS AST over every shipped CSS file (`src/**/*.css`, `src/**/*.module.css`, built `dist/styles.css` when present) plus CSS-in-JS template literals extracted from `src/**/*.{ts,tsx}` (`css\`…\``, `styled.*\`…\``). Fail on: CSS `transition: all`, `transition-property: all` and the `glass-transition-all` utility (the JS/Tailwind `transition-all` class check is PERF's `auraglass/no-transition-all`; do not duplicate it); animated property outside the REQ-MOT-12 allow-list (`opacity, transform, scale, translate, rotate, color, background-color, border-color, outline-color, --_ag-hover, --_ag-press, --_ag-optics, --ag-specular`, `display`/`overlay` only with `allow-discrete`); `backdrop-filter`/`-webkit-backdrop-filter`/`filter`/`box-shadow`/`width`/`height`/`top`/`left`/`inset`/`border-radius`/`clip-path` in `@keyframes` or `transition*`; any `cubic-bezier()` with y outside `[0,1]`; `!important` inside a rule that sets `transition*`/`animation*` or lives in `src/motion/css/**`; duplicate `@keyframes` names across shipped CSS; `@keyframes` names not prefixed `ag-`; custom properties in transition lists that are not `@property`-registered; time literals (`\d+m?s`) or `cubic-bezier()` in `transition*`/`animation*` outside DS's `tokens.css` (reported by DS's rule; the checker only re-checks `src/motion/css/**`). Output: `file:line rule message`, exit 1 on any violation.
10. **Wiring (DoD §18, MOT-074).** `package.json` `"lint:motion": "node scripts/ci/verify-motion-css.mjs"` and append to `lint:ci`. In PKG-015's `eslint.config.js`/`.eslintrc.js` (severity entries for MOT rules only): REQ-MOT-64 `error`; all others `warn` until PROMPT-06f (step F) completes, then `error` (06f task MOT-088 flips them). Record the current warn counts per rule in the report.

## Tests

- REQ-MOT-T17 `tests/lint/motion-rules.test.ts` (REQ-MOT-68): ESLint `RuleTester` with `@typescript-eslint/parser`, ≥ 1 valid and ≥ 1 invalid case per MOT rule (60, 62-JS, 63, 64, 65, 66-JS, 35), the motion categories of DS's rule (61), and per exception (adapter path for 60; `src/motion/**` for 61; `src/compat/motion/**` for 63; `allowContinuous` guard for 66). CSS checker cases via fixture files in `tests/lint/fixtures/motion/` run through the checker's exported `checkCss(source, filename)`: `transition: all`, animated `backdrop-filter`, overshoot bezier `cubic-bezier(0.68,-0.55,0.265,1.55)`, `!important`, duplicate keyframes, unprefixed keyframes, unregistered var in transition, hover `scale`, press `scale: 0.985` and Card hover `translate: 0 -1px` (all invalid), scalar-only hover/press (valid), ungated `infinite` (invalid) and gated `ag-sweep` (valid).
- Run: `npm test -- tests/lint/motion-rules.test.ts`; `node scripts/ci/verify-motion-css.mjs src/motion` (must be 0).

## Visual evidence

n/a (static lane).

## Exit criteria

- AC-MOT-05: `verify-motion-css.mjs` reports 0 `transition: all`, 0 animated `backdrop-filter`/`filter`, 0 overshoot beziers, 0 `!important`, 0 duplicate `@keyframes` across shipped CSS — reached when 06f completes; in this prompt the checker exists, catches every invalid fixture, and `src/motion/**` is clean.
- AC-MOT-04: DS's `literals.mjs` reports the `duration|easing|spring` categories per file into DS's baseline; an injected extra duration literal fails it (test case); flagship files tracked.
- T17 green.

## Final report format

```
PROMPT-06e REPORT
Commit: <sha>
Tasks MOT-065..075: DONE | BLOCKED(<reason>) each
AC-MOT-04: DS baseline duration/easing/spring totals=<N>, flagship=<n>; AC-MOT-05: current tree violations per category (expected >0 until 06f)
Rule levels: <rule -> warn|error>; warn counts per rule
Tests: T17 -> pass/fail
Files changed: <list>
Deviations: <none | item + evidence>
```
