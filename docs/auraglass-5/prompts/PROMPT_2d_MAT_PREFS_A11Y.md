# PROMPT-2d (MAT lane P): Preferences, provider and a11y rungs

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **P**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2d-P"` (80 tasks: MAT-247..326).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside MAT):** `src/theme/{index,public,AuraGlassProvider,announcer,portal}.ts(x)`, `src/theme/{preferences,script,layers,preferences-panel}/**`, `src/a11y/**`, `src/hooks/**`, `scripts/mat/{verify-preference-source,verify-a11y-css,build-prepaint-script}.mjs`, `lint/rules/mat/{no-document-escape,no-runtime-contrast}.cjs`, `tests/lint/mat/{no-document-escape,no-runtime-contrast}.test.ts`, `tests/theme/{resolve,store,usePreference,AuraGlassProvider,portal,LayerStack,announcer,AuraGlassScript,GlassPreferencesPanel}.test.ts(x)`, `tests/a11y/{css,contrast}/**`, `tests/{e2e,visual,ssr,perf/browser}/mat/a11y/**`, `tests/a11y/apg/mat/**`, `tests/a11y/manual/{scripts,records}/mat/**`

**Delivers:** REQ-MAT-52..66

**Order inside the lane:** resolve + store → provider/portal/LayerStack/announcer → script → rungs, focus, targets → panel → catalogue suites and manual records

**Requirements closed by this lane:** REQ-MAT-02, REQ-MAT-10, REQ-MAT-11, REQ-MAT-14, REQ-MAT-15, REQ-MAT-16, REQ-MAT-19, REQ-MAT-33, REQ-MAT-39, REQ-MAT-44, REQ-MAT-52, REQ-MAT-53, REQ-MAT-54, REQ-MAT-55, REQ-MAT-56, REQ-MAT-57, REQ-MAT-58, REQ-MAT-59, REQ-MAT-60, REQ-MAT-61, REQ-MAT-62, REQ-MAT-63, REQ-MAT-64, REQ-MAT-65, REQ-MAT-66.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-p -b next-mat/p-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2d-P") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-247 | TEST | `NEW:src/theme/__tests__/color.test.ts` | Create the file (A11Y-006 adds the a11y reference vectors by MODIFY): CSS Color 4 vectors (oklch(0.628 0.2577 29.23) ~ #ff0000, oklch(1 0 0) = #fff, oklch(0 0 0) = … |  | REQ-MAT-15 |
| MAT-248 | TEST | `NEW:src/theme/__tests__/presets.test.ts` | Exactly 4 presets; each has light and dark canvases; no material.* in any preset source; every cell for each preset in opacity-floors.json passes; each … |  | REQ-MAT-14 |
| MAT-249 | TEST | `NEW:src/theme/__tests__/createGlassTheme.test.ts` | All 4.x option names accepted; mode 'system' output has no scheme pin or 'color-scheme: dark'; high-contrast -> contrast 'more'; cssText matches … |  | REQ-MAT-02 |
| MAT-250 | TEST | `NEW:src/theme/__tests__/createBrandTheme.test.ts` | Ramp monotone in L; oklch(0.85 0.1 95) yields adjusted.length > 0, all pairs passing, and one console.warn; NEW fixture src/theme/__tests__/fixtures/brand-colors.json … |  | REQ-MAT-16 |
| MAT-251 | MODIFY | `src/theme/index.ts` | Export createGlassTheme, createBrandTheme, presets and the types ThemePreset, PresetId, GlassTheme, ContrastReport; update the etc/api/theme.api.md report through … |  | REQ-MAT-33 |
| MAT-252 | CREATE | `NEW:tests/a11y/contrast/matrix-contract.json` | Machine-readable matrix contract (A11Y-owned data outside tokens/, SC-18) for the PRD-03 solver: axes preset x scheme{light,dark} x contrast{standard,more} x … |  | REQ-MAT-54, REQ-MAT-33, REQ-MAT-10 |
| MAT-253 | TEST | `src/theme/contrast.ts` | Consumer of DS-109, which deletes src/theme/contrast.ts (re-export pointed at color.ts by DS-055). Verify 0 importers of theme/contrast remain in src (rg -l … |  | REQ-MAT-11 |
| MAT-254 | MODIFY | `src/theme/__tests__/color.test.ts` | DS-056 creates src/theme/__tests__/color.test.ts. Add (MODIFY) the a11y reference vectors: contrastRatio("#777777","#ffffff")=4.48+-0.01; #000 vs #fff = 21; … | MAT-247 | REQ-MAT-11 |
| MAT-255 | INFRA | `NEW:scripts/mat/verify-a11y-css.mjs; scripts/mat/a11y-baselines/focus-outline-none.json` | PostCSS gate with rules layer-order, no-important, max-specificity ((0,2,0); (0,1,1) only forced-colors pseudos), no-prefers-contrast-high (src+dist), … |  | REQ-MAT-19, REQ-MAT-54, REQ-MAT-10, REQ-MAT-61 |
| MAT-256 | TEST | `NEW:tests/a11y/verify-a11y-css.test.ts` | Fixtures scripts/ci/__fixtures__/a11y-css/<rule>/{pass,fail}.(css\|tsx) for each of the 10 rules; each rule fires on fail and is silent on pass; ratchet baseline cannot … | MAT-255 | REQ-MAT-19 |
| MAT-257 | MODIFY | `lint/rules/mat/` | Add rule auraglass/no-runtime-contrast: flags getComputedStyle color/background reads feeding contrast/luminance calls, canvas getImageData, and Resize/MutationObserver … |  | REQ-MAT-64 |
| MAT-258 | MODIFY | `lint/rules/mat/` | Add rule auraglass/no-document-escape: flags document/window keydown\|keyup listeners whose handler compares 'Escape'\|'Esc'\|27; exempt src/theme/layers/**. |  | REQ-MAT-57 |
| MAT-259 | MODIFY | `lint/rules/mat/` | Add rule auraglass/no-outline-none-focus: flags TSX string literals and cn()/clsx() args containing focus:outline-none or focus-visible:outline-none. |  | REQ-MAT-61 |
| MAT-260 | MODIFY | `lint/rules/mat/` | Enable the three new rules as error on src/a11y/**, src/theme/**, src/material/** and warn elsewhere (ratchet). | MAT-257, MAT-258, MAT-259 | REQ-MAT-64, REQ-MAT-61, REQ-MAT-57 |
| MAT-261 | TEST | `NEW:tests/lint/mat/auraglass-a11y-rules.test.ts` | ESLint RuleTester suites for no-runtime-contrast, no-document-escape, no-outline-none-focus with >=3 invalid and >=3 valid cases each. | MAT-257, MAT-258, MAT-259 | REQ-MAT-64, REQ-MAT-57 |
| MAT-262 | CREATE | `NEW:src/theme/preferences/types.ts` | Types PreferenceKey (exact PRD §4.4 list), TransparencySetting, ContrastSetting, MotionSetting, OsSignals, ResolvedPreferences incl. floors.reasons union, … |  | REQ-MAT-53 |
| MAT-263 | CREATE | `NEW:src/theme/preferences/resolve.ts` | Pure resolveTransparency (max of OS floor, capability floor, app, user, glassOpacity>=0.7->tinted; clamp 0..1), resolveContrast (less/custom->standard; never 'high'), … | MAT-262 | REQ-MAT-44 |
| MAT-264 | TEST | `NEW:src/theme/preferences/__tests__/resolve.test.ts` | Generated cartesian product asserted toHaveLength(1024) with no result below any floor; cases 'forced colors is absolute', 'glassOpacity 0.69 stays glass, 0.7 tinted', … | MAT-263 | REQ-MAT-52, REQ-MAT-02 |
| MAT-265 | CREATE | `NEW:src/theme/preferences/storage.ts` | createLocalStorageAdapter (every access try/catch; a throw switches permanently to memory) and createMemoryStorage; key ag:prefs:v1 JSON {transparency, glassOpacity, … | MAT-262 | REQ-MAT-53 |
| MAT-266 | CREATE | `NEW:src/theme/preferences/media.ts` | Shared MediaQueryList registry WeakMap<Window, Map<query, entry>>; lazy creation on first subscribe, never at import; listener removed at 0 subscribers; the 6 queries … | MAT-262 | REQ-MAT-53 |
| MAT-267 | CREATE | `NEW:src/theme/preferences/store.ts` | createPreferenceStore({storage, storageKey, legacyStorageKey, app, target}) with getSnapshot/getServerSnapshot/subscribe/set/resolved; set persists user value, … | MAT-263, MAT-265, MAT-266 | REQ-MAT-53, REQ-MAT-60 |
| MAT-268 | TEST | `NEW:src/theme/preferences/__tests__/store.test.ts` | Cases: persistence round-trip; corrupt JSON ignored without throw; throwing storage -> memory; set('transparency','glass') under contrastMoreOS persists glass but … | MAT-267 | REQ-MAT-53, REQ-MAT-60 |
| MAT-269 | CREATE | `NEW:src/theme/preferences/usePreference.ts` | usePreference(key) via useSyncExternalStore with server snapshots (settings 'system', OS booleans false, glassOpacity 0); useResolvedPreferences(); … | MAT-267 | REQ-MAT-53 |
| MAT-270 | TEST | `NEW:src/theme/preferences/__tests__/usePreference.test.tsx` | renderToString uses server snapshot; hydrateRoot emits 0 console.error hydration warnings; 'shared MQL': 200 components calling usePreference('reducedMotionOS') -> … | MAT-269 | REQ-MAT-53 |
| MAT-271 | CREATE | `NEW:src/theme/AuraGlassProvider.tsx` | 'use client' provider with PRD §10 props (transparency, glassOpacity, contrast, motion, scheme, density, storage\|false, storageKey, legacyStorageKey, portalContainer, … | MAT-269 | REQ-MAT-55 |
| MAT-272 | TEST | `NEW:src/theme/__tests__/AuraGlassProvider.test.tsx` | Cases 'writes only data-ag and --ag-glass-opacity' (walk all elements, style empty except --ag-glass-opacity), 'legacy key migration', 'nested provider scopes … | MAT-271 | REQ-MAT-55 |
| MAT-273 | CREATE | `NEW:src/theme/preferences/prepaint.ts` | Pre-paint function importing resolve.ts (no logic copy): reads storage, 4 OS media queries, CSS.supports backdrop-filter capability; sets preference attributes, … | MAT-263 | REQ-MAT-59 |
| MAT-274 | CREATE | `NEW:src/theme/AuraGlassScript.tsx` | Server Component ({nonce, storageKey='ag:prefs:v1', defaults}) rendering one synchronous inline <script nonce> with PREPAINT and JSON args escaped (< as \u003c); no … | MAT-273 | REQ-MAT-59 |
| MAT-275 | TEST | `NEW:src/theme/__tests__/AuraGlassScript.test.tsx` | Cases 'nonce present', 'no eval', 'minified budget' (Buffer.byteLength<=1536), 'engine and tier fixtures' executing the emitted script in jsdom with mocked … | MAT-274 | REQ-MAT-59 |
| MAT-276 | MODIFY | `src/theme/index.ts` | Export AuraGlassProvider, AuraGlassScript, usePreference, useResolvedPreferences, usePreferenceActions and preference types; PRD-02 per-file directive lint passes … | MAT-271, MAT-274 | REQ-MAT-53, REQ-MAT-55, REQ-MAT-59 |
| MAT-277 | CREATE | `NEW:src/a11y/css/rungs.css` | @layer ag.a11y attribute rungs keyed on :where([data-ag-transparency\|contrast]) [data-ag-surface]: tinted (--_ag-tint-floor: var(--_ag-tint-floor-tinted); … | MAT-255 | REQ-MAT-54 |
| MAT-278 | MODIFY | `src/a11y/css/rungs.css` | Append raise-only floors at equal specificity later in source: @media (prefers-reduced-transparency: reduce) tinted guarded by :not(:where([data-ag-transparency=solid] … | MAT-277 | REQ-MAT-54 |
| MAT-279 | MODIFY | `src/a11y/css/rungs.css` | [data-ag-surface]:is([aria-disabled=true],[data-disabled]) sets --ag-on-surface: var(--ag-color-on-surface-disabled); no opacity on host (gate … | MAT-277 | REQ-MAT-54 |
| MAT-280 | CREATE | `NEW:src/a11y/css/index.css` | Aggregate @import of rungs.css (05d/05e add focus, targets, scroll-padding; .ag-visually-hidden is FND-038 in ag.components, not here) for PRD-02 to emit inside @layer … | MAT-277 | REQ-MAT-54 |
| MAT-281 | TEST | `NEW:tests/a11y/css/supports-fallback.test.ts` | Parse built styles.css: @supports not block exists inside ag.a11y keyed on [data-ag-surface] setting backdrop-filter none on host and ::before. Browser case only if … | MAT-278, MAT-280 | REQ-MAT-54 |
| MAT-282 | CREATE | `NEW:tests/e2e/mat/helpers/surfaces.ts` | Helpers: surfaces.ts listSurfaces, computed(page, sel, pseudo), countVisibleBackdropFilters (host+::before+::after non-none, area>0, visible; runtime-remote run-2 … |  | REQ-MAT-54 |
| MAT-283 | TEST | `NEW:tests/e2e/mat/floors.spec.ts` | With data-ag-transparency=glass on <html> and provider transparency=glass: 'forced colors ignores data-ag-transparency=glass', 'contrast more floor', 'reduced … | MAT-278, MAT-282, MAT-274 | REQ-MAT-54 |
| MAT-284 | TEST | `NEW:tests/e2e/mat/rungs.spec.ts` | Cases 'tinted', 'contrast more', 'solid' (alpha>=0.85, filters none, background-image none), 'clear fail-safe' (clear without data-ag-backdrop computes regular, one dev … | MAT-277, MAT-282 | REQ-MAT-54, REQ-MAT-33 |
| MAT-285 | TEST | `NEW:tests/e2e/mat/forced-colors.spec.ts` | 'zero visible backdrop filters' on every T0/T1 story from Storybook index.json (tier metadata) plus Dialog/Sheet/AlertDialog scrims, AppShell, Toast, Tooltip, Material … | MAT-278, MAT-282 | REQ-MAT-54 |
| MAT-286 | TEST | `NEW:tests/e2e/mat/pixel-modes.spec.ts` | Per story screenshot of largest surface box at default and emulateMedia contrast more; diffRatioInBox > 0.005 on 100% of stories (4.1: 0.000% on 12/12). | MAT-277, MAT-282 | REQ-MAT-54 |
| MAT-287 | TEST | `NEW:tests/e2e/mat/prepaint.spec.ts` | addInitScript rAF probe recording first Surface backdrop-filter per frame; persisted {transparency:'solid'} via context.addInitScript; canary page with AuraGlassScript … | MAT-274, MAT-278 | REQ-MAT-59 |
| MAT-288 | CREATE | `NEW:src/a11y/stories/Rungs.stories.tsx` | A11y/Rungs (Surface per variant x thickness on each scene, read-out of effective transparency/contrast, floor alpha and minRatio imported from … | MAT-277, MAT-269 | REQ-MAT-39 |
| MAT-289 | CREATE | `NEW:src/theme/layers/LayerStack.ts` | createLayerStack(doc): push({id, kind overlay\|transient\|toast, modal, onEscape, restoreFocusTo}) -> pop; top(); one keydown listener per document dispatching Escape to … | MAT-258, MAT-271 | REQ-MAT-57 |
| MAT-290 | CREATE | `NEW:src/theme/layers/useLayer.ts` | useLayer({kind, modal, onEscape, open}): modal sets inert on body children except portal root and on lower [data-ag-layer-root] > * (refcounted); scroll lock refcounted … | MAT-289 | REQ-MAT-57 |
| MAT-291 | MODIFY | `src/theme/AuraGlassProvider.tsx` | Fill 05b slot: createPortal to document.body of exact §4.5 markup (data-ag-portal-root with layer roots overlay/transient/toast role=region aria-label=Notifications, … | MAT-271, MAT-289 | REQ-MAT-55, REQ-MAT-56 |
| MAT-292 | CREATE | `NEW:src/theme/announcer/Announcer.tsx` | Announcer regions (polite + assertive, aria-atomic) in the portal root; NEW:src/theme/announcer/useAnnouncer.ts announce(message,{politeness,id})/clear(); 500ms … | MAT-291 | REQ-MAT-58 |
| MAT-293 | TEST | `NEW:src/theme/__tests__/announcer.test.tsx` | Fake timers: polite/assertive routing, 'coalesces within 500ms', 'clears after 7000ms', 'id replacement', 'streaming budget' (10s stream, token every 50ms -> <=11 … | MAT-292 | REQ-MAT-58 |
| MAT-294 | TEST | `NEW:src/theme/layers/__tests__/LayerStack.test.ts` | Escape to top only, pop order, isComposing guard, inert refcount, scroll-lock refcount; plus AuraGlassProvider.test.tsx 'single portal root' (two nested providers -> 1 … | MAT-290, MAT-291 | REQ-MAT-55, REQ-MAT-56, REQ-MAT-57 |
| MAT-295 | TEST | `NEW:tests/e2e/mat/layer-stack.spec.ts` | 3 engines: 'single portal root' (Dialog+Popover+Tooltip+Toast -> 1), 'stacked escape' (3 Escapes close Tooltip, Popover, Dialog; focus returns to each trigger), 'inert … | MAT-296 | REQ-MAT-55, REQ-MAT-56, REQ-MAT-57 |
| MAT-296 | CREATE | `NEW:src/a11y/stories/LayerStack.stories.tsx` | A11y/LayerStack (Dialog -> Popover -> Tooltip -> Toast built on KEEP Portal/DismissableLayer/FocusScope with Escape-order instructions) and … | MAT-291, MAT-292 | REQ-MAT-39 |
| MAT-297 | CREATE | `NEW:src/a11y/css/focus.css` | PRD §4.6 block verbatim in @layer ag.a11y: :where([data-ag-focusable], .ag-focusable):focus-visible outline var(--ag-focus-width,2px) solid var(--ag-focus-outer), … | MAT-280 | REQ-MAT-61 |
| MAT-298 | TEST | `tests/e2e/mat/forced-colors.spec.ts` | Add case 'focus ring' (Chromium): each focusable in T0/T1 fixtures under forcedColors active computes outline-style solid, outline-width >=2px, outline-color equal to a … | MAT-285, MAT-297 | REQ-MAT-61 |
| MAT-299 | TEST | `NEW:tests/e2e/mat/focus-appearance.spec.ts` | For every focusable part (Tab order) on every T0/T1/T2 story x 8 scenes x 3 engines: capture box+4px unfocused vs focused (2 rAFs); changed-pixel area >= 2 CSS px … | MAT-297, MAT-308 | REQ-MAT-61 |
| MAT-300 | MODIFY | `scripts/mat/a11y-baselines/focus-outline-none.json` | Lower baseline (109 at 4.1) to current rg -c 'focus:outline-none' src total after each flagship/removal PR; add beta-gate invocation verify-a11y-css.mjs --enforce-zero … | MAT-255 | REQ-MAT-61 |
| MAT-301 | CREATE | `NEW:src/a11y/css/targets.css` | [data-ag-part=hit-area] absolute, centred (inset 50% + translate -50%), width/height max(100%, var(--ag-target-min)); @media (pointer: coarse) var(--ag-target-coarse); … | MAT-280 | REQ-MAT-62 |
| MAT-302 | CREATE | `NEW:src/a11y/HitArea.tsx` | Internal server-safe <span data-ag-part="hit-area" aria-hidden="true" /> (deviation 4: not a pseudo-element); internal barrel NEW:src/a11y/index.ts; not a public subpath. | MAT-301 | REQ-MAT-62 |
| MAT-303 | TEST | `NEW:tests/e2e/mat/target-size.spec.ts` | Fine 1440x900: elementsFromPoint on 24px grid -> each part owns >=24x24 or meets 24px-circle spacing exception. 'coarse' (hasTouch, isMobile, 390x844, WebKit + … | MAT-302, MAT-308 | REQ-MAT-62 |
| MAT-304 | CREATE | `NEW:src/a11y/css/scroll-padding.css` | [data-ag-scroll-container], :root { scroll-padding-block: var(--ag-scroll-padding-top,0px) var(--ag-scroll-padding-bottom,0px) } inside ag.a11y; @import in index.css. … | MAT-280 | REQ-MAT-63 |
| MAT-305 | CREATE | `NEW:src/a11y/useStickyScrollPadding.ts` | Client hook useStickyScrollPadding(ref,{edge:'top'\|'bottom', enabled}): one ResizeObserver per element; writes --ag-scroll-padding-<edge> = border-box block size + 8px … | MAT-304 | REQ-MAT-63 |
| MAT-306 | TEST | `NEW:src/a11y/__tests__/useStickyScrollPadding.test.tsx` | Mocked ResizeObserver: exactly 1 observer per element; <=1 style write per callback; 0 writes when size unchanged; unmount removes property and disconnects. | MAT-305 |  |
| MAT-307 | TEST | `NEW:tests/e2e/mat/focus-not-obscured.spec.ts` | On A11y/ScrollPadding (sticky TopBar + bottom TabBar + Composer) at 1440 and 390, 3 engines: Tab through >=50 focusables; for each intersectionArea(chrome, el)/area(el) … | MAT-305, MAT-308 | REQ-MAT-63 |
| MAT-308 | CREATE | `NEW:src/a11y/stories/FocusRing.stories.tsx` | A11y/FocusRing (every focusable part focused on all 8 scenes + aria-disabled), NEW:src/a11y/stories/Targets.stories.tsx A11y/Targets (fine vs coarse with … | MAT-297, MAT-302, MAT-305 | REQ-MAT-39 |
| MAT-309 | CREATE | `NEW:tests/a11y/apg/mat/coverage.json` | Map every interactive T0/T1/T2 component to spec path, owner PRD and required keys[] from the §5.8 table; NEW:tests/a11y/apg/README.md reproduces the table; … |  | REQ-MAT-63 |
| MAT-310 | TEST | `NEW:tests/e2e/mat/axe.spec.ts` | @axe-core/playwright with wcag2a/2aa/21aa/22aa tags and color-contrast on (color-contrast-enhanced under contrast=more). AXE_SCOPE=pr: REQ-QA-18 coverage … |  |  |
| MAT-311 | TEST | `NEW:tests/a11y/storybook-a11y-config.test.ts` | Import .storybook/preview config and assert: addon-a11y color-contrast not disabled; globals transparency, contrast, forcedColors, motion, environment, glassOpacity … | MAT-276 |  |
| MAT-312 | TEST | `NEW:tests/e2e/mat/zoom-reflow.spec.ts` | 200%: viewport 640x400 deviceScaleFactor 2, no text clipped/overlapped (range rects vs clipping ancestor and siblings). 400%: 320x256 and 320x640 deviceScaleFactor 4, … |  | REQ-MAT-65 |
| MAT-313 | TEST | `NEW:tests/e2e/mat/text-spacing.spec.ts` | Inject unlayered WCAG 1.4.12 bookmarklet stylesheet (line-height 1.5, paragraph 2em, letter .12em, word .16em; !important allowed in test code only); assert every text … |  | REQ-MAT-65 |
| MAT-314 | TEST | `NEW:tests/e2e/mat/color-vision.spec.ts` | NEW:tests/a11y/browser/helpers/machado.ts (Machado 2009 protan/deutan/tritan severity 1.0, linear RGB) and helpers/ciede2000.ts (unit-tested in … |  | REQ-MAT-65 |
| MAT-315 | DOC | `NEW:tests/a11y/pixel-contrast.contract.json` | Thresholds body 4.5, large 3 (>=24px or >=18.66px @700), more 7; sample every visible text run, worst sample; matrix 8 SC-28 scenes (photo, saturated-abstract, … |  | REQ-MAT-65 |
| MAT-316 | CREATE | `NEW:tests/a11y/manual/sr-record.schema.json` | JSON Schema 2020-12 requiring sha, cell SR-1..SR-6, at+atVersion, browser+browserVersion, os+osVersion, device (required SR-2/SR-4/touch), tester, date, component, … |  | REQ-MAT-66 |
| MAT-317 | DOC | `NEW:tests/a11y/manual/scripts/mat/_TEMPLATE.md` | Protocol template plus NEW:tests/a11y/manual/scripts/button.md and dialog.md with exact keystrokes/gestures per AT (VoiceOver macOS, VoiceOver iOS, NVDA, TalkBack) and … | MAT-316 | REQ-MAT-66 |
| MAT-318 | TEST | `NEW:tests/a11y/manual/scripts/mat/button.md` | Human tester records SR-1 and SR-3 for Button and Dialog on a pre-release SHA; records uploaded as a11y-manual-<sha>.json via a manual GitLab job (when: manual) and … | MAT-317 | REQ-MAT-66 |
| MAT-319 | CREATE | `NEW:src/theme/GlassPreferencesPanel.tsx` | 'use client' T2 panel on flagship RadioGroup/Slider rendered through Surface; props show (default transparency, glassOpacity, contrast, motion), onChange(key,value), … | MAT-276, MAT-292 | REQ-MAT-60 |
| MAT-320 | TEST | `NEW:src/theme/__tests__/GlassPreferencesPanel.test.tsx` | Cases 'fieldset legend names', 'floor-locked options' (contrastMoreOS true via injected store: Glass aria-disabled + described, click keeps resolved transparency tinted … | MAT-319 | REQ-MAT-60 |
| MAT-321 | CREATE | `NEW:src/theme/GlassPreferencesPanel.stories.tsx` | Theme/GlassPreferencesPanel stories: default, floor-locked (contrast=more global emulation), show subsets, dark scheme, RTL; remote screenshots for human review in PR. | MAT-319 | REQ-MAT-60 |
| MAT-322 | DOC | `NEW:tests/a11y/claims-sources.json` | Map each permitted a11y claim key (WCAG level, contrast minimum, SR coverage, reduced-transparency support, forced-colors support) to source artifact … | MAT-315, MAT-316 |  |
| MAT-323 | TEST | `NEW:scripts/mat/verify-a11y-removals.mjs` | beta-gate job: (a) no §9 symbol in any dist entry/subpath .d.ts or runtime export keys; (b) matchMedia( outside src/theme/preferences/media.ts = 0 and reduced-motion … | MAT-300, MAT-309 |  |
| MAT-324 | TEST | `n/a` | RC SHA: human testers record SR-1..SR-4 for all 44 flagships (176 cells) and iOS + Android touch (88 cells), SR-5/SR-6 non-blocking; validate a11y-manual-<sha>.json … | MAT-318 | REQ-MAT-66 |
| MAT-325 | INFRA | `NEW:scripts/mat/a11y-cert-summary.mjs` | ga-cert job: read contrast-matrix.json, a11y-pixel-contrast.json, axe-results.json, focus-appearance.json, a11y-manual-<sha>.json and budget results; reject any … | MAT-323, MAT-324 |  |
| MAT-326 | CREATE | `NEW:src/theme/GlassPreferencesPanel.meta.ts` | T2 certification row only: add GlassPreferencesPanel.meta.ts beside PRD-05's implementation (directory per PRD-05; resolve with rg), Core/GlassPreferencesPanel stories … | MAT-319 | REQ-MAT-60 |

## Contract seams this lane consumes

S-03, S-04, S-10, S-11, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-39, S-40, S-41, S-42, S-43, S-46, S-49. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE P REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
