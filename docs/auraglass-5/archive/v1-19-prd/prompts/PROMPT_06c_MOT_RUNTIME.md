# PROMPT-06c (MOT): Motion runtime — ticker, pointer light, View Transitions, capability (5.0)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` (PRD-06) §4.1 (L3–L5), §4.7, §4.8 (capability), §5.3 (REQ-26), §5.4, §5.5, §5.6, §15.
Requirement IDs: REQ-MOT-26, -33 (incl. the `data-ag-offscreen` observer, SC-21), -34 (tween contract; `AnimatedNumber` is registry/compat only and not in `StatCard`, SC-38), -36, -37, -38, -39, -40, -41, -42, -116, -128; tests REQ-MOT-T09, T10, T11.
Acceptance: **AC-MOT-11**, unit side of **AC-MOT-10**. Tasks: MOT-040..MOT-052 (MOT-040 is the PRD-06 anchor task other PRDs depend on; MOT-040 CREATEs `ticker.ts`, MOT-052 MODIFYs it; MOT-042/045 CREATE `pointerLight.ts`/`viewTransition.ts`, later tasks MODIFY).
Contract registry: `docs/auraglass-5/prd/_shared-contracts.md` wins (SC-16 `motion-raf-via-ticker` is MOT's, PERF owns `raf-requires-cancel`/`raf-requires-visibility-gate`; SC-21 MOT-ratified attributes `data-ag-continuous`, `data-ag-offscreen`, `data-ag-vt`, `data-ag-vt-participant`, `data-ag-vt-settled`, `data-ag-pointer-light`, `data-ag-highlights`; SC-23 preference runtime).

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main`. Architecture decisions win; report deviations with evidence.
- No fake completion: no mocks standing in for shipped behaviour (test doubles for `IntersectionObserver`, `document.startViewTransition` and rAF inside unit tests are fine and expected), no placeholder files, no skipped/fixme tests, no lowered thresholds, no snapshot updates to pass. Unfinishable ⇒ BLOCKED with reason.
- Remote-first for browsers: anything needing a real browser runs on CI/remote runner (skill `auraone-remote-run`). Local: `npm test -- <path>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`.
- No new dependencies. No `framer-motion`/`motion` import anywhere in these files (D-25). No React state in any per-frame path.
- Core motion JS budget (REQ-MOT-121): `viewTransition.ts + pointerLight.ts + ticker.ts + capability.ts` ≤ 2.0 KB min+gz total. Check with `node_modules/.bin/esbuild --bundle --minify --format=esm` + gzip locally (light) and record the number.

## Prerequisites (verify)

1. PROMPT-06b merged: `src/motion/css/motion.css` registers `--_ag-pointer`; DS-053 has generated `src/motion/tokens.generated.ts`.
2. A11Y exposes `usePreference('motion')`, `usePreference('transparency')` and a non-React subscription (store `subscribe`/`getSnapshot`) at `src/theme/preferences/{store,usePreference,resolve}.ts` (A11Y-027, SC-23; `PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`). `usePreference('allowContinuous')` is requested but not yet in SC-23 (PRD §21 O-03): treat it as `false` when absent. If only the React hook exists, fall back to observing `data-ag-motion`/`data-ag-transparency` on `document.documentElement` with one shared `MutationObserver`, and report it. Never call `matchMedia('(prefers-reduced-motion…)')` (REQ-MOT-25).
3. MAT exposes `data-ag-tier` on surfaces (MAT-047, `PROMPT_04b_MAT_CSS_ENGINE.md`).

## May touch

NEW `src/motion/ticker.ts`, `src/motion/pointerLight.ts`, `src/motion/viewTransition.ts`, `src/motion/css/view-transition.css`, `src/motion/capability.ts`, `src/motion/index.ts` (internal barrel, not a package entry), `src/motion/__tests__/{ticker,pointerLight,viewTransition}.test.ts`; `build/css-ownership.json` (row mapping `view-transition.css` to `ag.components`, MODIFY of PKG-099).

## Must not touch

Component files (Button/Tabs/etc. adopt these in their own PRDs and in 06g), `src/motion/adapter/**` (06d), `package.json`, A11Y internals (`src/theme/preferences/**`).

## Steps

1. **Ticker (REQ-MOT-33, -128).** `subscribe(cb: (dt: number, now: number) => void, opts?: { element?: Element }): () => void`. One rAF loop for all subscribers; starts on first subscriber, cancels when the set is empty; `dt` capped at 50 ms; on `visibilitychange` hidden it cancels the frame and resumes on visible with `dt` reset; one lazily created shared `IntersectionObserver` tracks `opts.element`, and non-intersecting subscribers are skipped. The same observer is the single writer of `data-ag-offscreen` (SC-21, requested by MED): set it on an observed element while non-intersecting, remove it when it intersects; export internal `observeOffscreen(el): () => void` so MED backdrops/media and CSS loops can pause without their own observers. Not exported from any package entry. Also implement:
   - `tween(el: HTMLElement, from: number, to: number, opts: { duration: number; format(n: number): string })` for REQ-MOT-34: writes `el.textContent` per frame via the ticker; under resolved `calm`/`none` writes the final value immediately; returns a cancel function that jumps to the final value. The live region (REQ-MOT-116) is a separate visually hidden element with `aria-live="polite" aria-atomic="true"` updated once with the final value (helper `announceFinal(region, text)`).
   - REQ-MOT-26: `onMotionChange(cb)` from the A11Y store; every client (tween, pointer light, FLIP) jumps to the final state within one frame when resolved motion leaves `full`.
2. **Pointer light (REQ-MOT-40..42, -100).** `installPointerLight(doc: Document): () => void`, ref-counted per Document (`WeakMap<Document, { count, teardown }>`). Adds exactly one `pointermove` and one `pointerleave` listener `{ passive: true }`. On move: store the last event, schedule one ticker frame. Per frame: `target.closest('[data-ag-pointer-light]')`; rect cached on `pointerenter` of that element and invalidated on `scroll` (capture, passive) and `resize`; write `el.style.setProperty('--_ag-pointer', \`${x.toFixed(1)}% ${y.toFixed(1)}%\`)` once. On leave or element change: `removeProperty('--_ag-pointer')`. Export `pointerLightActive(prefs, tier, win)` returning true only if motion `full`, transparency `glass`, `matchMedia('(hover: hover) and (pointer: fine)')` matches, tier `standard|enhanced`; otherwise install nothing. Components pass `pointerLight?: boolean` as `data-ag-pointer-light` (prop wiring is in the component PRDs; 06g wires Button).
3. **View Transitions (REQ-MOT-36..39).**
   - `startMorph(update, { surfaces, name? }): Promise<void>`: resolved `none` → run `update()` synchronously, resolve. Else set `data-ag-vt` on `surfaces`; if `document.startViewTransition` exists call it with `{ update, types: ['ag-morph'] }`, catching `TypeError` to retry with the callback form; under `calm` add type `ag-morph-calm`. Await `finished`, swallowing `AbortError`/`InvalidStateError`; remove `data-ag-vt`, set `data-ag-vt-settled` for `motionTokens.duration.micro` ms, then remove. `update` runs exactly once in every path (guard flag).
   - FLIP fallback (REQ-MOT-39): measure `getBoundingClientRect` before, run `update`, measure after, `el.animate([{ transform: 'translate(dx,dy) scale(sx,sy)' }, { transform: 'none' }], { duration: <--ag-spring-fluid-duration>, easing: <--ag-spring-fluid> })` reading both values via `getComputedStyle(document.documentElement)`; `transform` only; `--_ag-optics` set to 0 during and restored after; on interruption or preference change `anim.finish()`.
   - Module-scope detection export `reactViewTransition = (React as any).ViewTransition ?? (React as any).unstable_ViewTransition ?? null` for morph components (they render `<ViewTransition name share="ag-morph">` + `startTransition` when non-null, never `startMorph`).
   - `useMorphName(prefix: string): string` from `useId()`, sanitised to `[a-z0-9-]`, prefixed `ag-`; dev-only registry warns on duplicate simultaneously-mounted names. Morph surfaces also render `data-ag-vt-participant` (documented contract for Tabs, SegmentedControl, TabBar, Menu→Sheet, SourceTransition per REQ-MOT-38).
   - `view-transition.css` (`@layer ag.components`): the §4.7 block verbatim, plus `::view-transition-old(*.ag-morph-calm)`, `::view-transition-new(*.ag-morph-calm)` opacity-only over `--ag-duration-micro` and `::view-transition-group(*.ag-morph-calm) { animation: none }`.
4. **Capability (§4.8).** `capability.ts`: `export interface MotionCapability { dragDetents?: …; momentum?: … }` (types matching 06d's `DragBindings`/`MomentumBindings`) and `MotionCapabilityContext = createContext<MotionCapability | null>(null)`. No implementation, no `motion` import.

## Tests

- REQ-MOT-T09 `src/motion/__tests__/ticker.test.ts`: 5 subscribers ⇒ one `requestAnimationFrame` per frame (spy); dt 200 ms gap ⇒ callback receives 50; unsubscribe all ⇒ `cancelAnimationFrame` and no further frames; `visibilityState='hidden'` + `visibilitychange` ⇒ 0 callbacks; mocked IO reporting not intersecting ⇒ that subscriber gets 0 callbacks (REQ-MOT-128) and the element carries `data-ag-offscreen`, removed when it intersects again; `tween` under `calm` writes final value in 0 frames; announce region receives exactly one update.
- REQ-MOT-T10 `src/motion/__tests__/pointerLight.test.ts`: 10 installs ⇒ 1 `pointermove` listener (spy `addEventListener`); 20 moves in one frame ⇒ ≤ 1 `setProperty('--_ag-pointer', …)`; `getBoundingClientRect` called once per entered element; leave ⇒ `removeProperty`; `pointerLightActive` false for motion `calm`/`none`, transparency `tinted`/`solid`, `pointer: coarse`, tier `lightweight`; no React import in `pointerLight.ts`.
- REQ-MOT-T11 `src/motion/__tests__/viewTransition.test.ts`: uses `document.startViewTransition` stub when present, FLIP (`Element.prototype.animate` stub) when absent; `update` called once when `finished` rejects with `AbortError` and with `InvalidStateError`; `data-ag-vt` removed after `finished`; `none` ⇒ synchronous, no VT call; `reactViewTransition` non-null with a mocked React module exposing `ViewTransition`; FLIP keyframes contain only `transform`.
- Run: `npm test -- src/motion/__tests__`. The per-engine browser check (REQ-MOT-T12) is 06g, remote.

## Visual evidence

None from this prompt; morph and pointer-light visuals are captured remotely in 06g.

## Exit criteria

- AC-MOT-11 (unit part): T10 green — 1 listener per document, ≤ 1 write per frame, disabled under calm/none, coarse pointer, tinted/solid, lightweight tier. The "0 React commits during a 2 s sweep" part is verified in 06g T18.
- T09, T11 green; core motion JS size measured ≤ 2.0 KB min+gz; `rg -n "framer-motion|from 'motion" src/motion --glob '!adapter/**'` = 0; `rg -n "useState|setState" src/motion/{ticker,pointerLight}.ts` = 0.

## Final report format

```
PROMPT-06c REPORT
Commit: <sha>
Tasks MOT-040..052: DONE | BLOCKED(<reason>) each
AC-MOT-11 (unit): PASS/FAIL; AC-MOT-10 (unit): PASS/FAIL
Preference source used: PRD-05 store | MutationObserver fallback (reason)
Core motion JS size: <bytes min+gz> per file and total
Tests: <name> -> pass/fail
Files changed: <list>
Deviations: <none | item + evidence>
```
