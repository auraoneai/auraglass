# PROMPT-12e (DATA): server-safe set — Sparkline, StatCard, ChartFrame, Timeline, ActivityFeed

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §2.3 (E-22..E-24), §4.2 (roles and the explicit deviation for #36/#37), §4.4, §4.7, §5.6–§5.9 (REQ-DATA-42..44, 47..49, 52..57, 60, 61), REQ-DATA-07, §8 rows for `stat-card`, `sparkline`, `chart-frame`, `timeline`, §12.1 rows, §12.2 `chart-frame.sr` and `data.forced-colors`, §13 rows, §14 StatCard/ChartFrame/Timeline rows, §15, §16 lines, §19, §21 (OI-02, OI-04); shared contracts SC-15 (budget rows), SC-21 (`data-ag-*`), SC-28 (scenes), SC-38 (StatCard static, `{ Chart }` ≤ 15 KB).
- Architecture: D-08, D-21, §11.2 #35–#37, §3.6.
- Evidence: `docs/auraglass-5/autopsy/visual-quality.md:46,88,165`, `autopsy/api-consistency.md:150`.
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-055..DATA-076.

Requirements: REQ-DATA-42, -43, -44, -47, -48, -49, -52, -53, -54, -55, -56, -57, -60, -61; REQ-DATA-07 for these files. Acceptance: AC-DATA-10, AC-DATA-11, AC-DATA-12 (non-date half), AC-DATA-13 (unit half; the canary is 12i).

Numbering: cite PRDs by key (SC-01: TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, FND, CTL, OVL, NAV, DATA, AI, DX, QA, SB). `DATA.json` `depends_on` holds only real anchor task ids (SC-40); the PRD body uses §16 numbers with the key authoritative. Crosswalk and the shared contracts this PRD consumes: `prompts/PROMPT_12_DATA.md`; binding registry: `docs/auraglass-5/prd/_shared-contracts.md`.

## 2. Scope
May create: `src/data/sparkline/{scale.ts,Sparkline.tsx,Sparkline.test.tsx,Sparkline.stories.tsx}`, `src/data/stat-card/{StatCard.tsx,stat-card.css,StatCard.test.tsx,StatCard.stories.tsx}`, `src/data/chart-frame/{types.ts,chart-frame.types.ts,ChartFrame.tsx,ChartFrameLegend.tsx,ChartFrameTable.tsx,ChartFrameTableToggle.tsx,ChartFramePlot.tsx,chart-frame.css,ChartFrame.test.tsx,ChartFrame.stories.tsx}`, `src/data/timeline/{Timeline.tsx,ActivityFeed.tsx,ActivityFeedLoadMore.tsx,timeline.css,Timeline.test.tsx,ActivityFeed.test.tsx,Timeline.stories.tsx,ActivityFeed.stories.tsx}`, `tests/tokens/chart-palette.test.ts`, `tests/rsc/data-hydration.test.tsx`, `tests/data/chart-frame.sr.spec.ts`, `tests/data/data.forced-colors.spec.ts`, `tests/data/data.responsive-cards.spec.ts`, `docs/adapters/chart-frame-adapters.md`.
May modify: `src/data/index.ts` (DATA-076 exports), `src/data/data.css` (`@import`s).
Must NOT touch: `src/components/**`, token sources (PRD-DS generates `--ag-chart-1..8`, `--ag-sparkline-stroke-*`, `--ag-stat-*`; request them, don't author values), `package.json` (no chart library ever), `src/index.ts`.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 12b merged (lint blocks, `src/data/index.ts` rewritten, React 19): `rg -n "no-restricted-properties" eslint.config.js`.
- PRD-DS tokens exist per scheme (DS-016/DS-022; no DS component-token task exists yet, PRD §21 OI-04): `rg -n "ag-chart-[1-8]|ag-sparkline-stroke|ag-stat-value-size-sm|ag-stat-trend" src/material/css/generated tokens 2>/dev/null`. If missing, implement components against the variable names, keep DATA-068 failing in L4 Token contrast, and report the blocker. Don't add fallback literals.
- PRD-MAT `Surface` and `data-ag-surface` roles `content-raised` and `content` (MAT-047): `rg -n "content-raised" src/material`.
- PRD-A11Y announcer (A11Y-054), `usePreference` (A11Y-027) and provider `locale` (A11Y-029); PRD-CTL `Button` (CTL-055); PRD-OVL `Tooltip` (OVL-066); PRD-FND `Skeleton` (FND-059) and `VisuallyHidden` (FND-038): `test -f src/components/button/Button.client.tsx && test -f src/components/tooltip/Tooltip.client.tsx && test -f src/components/skeleton/Skeleton.tsx && test -f src/primitives/VisuallyHidden.tsx`.
- StatCard motion: decided by SC-38 (StatCard is a static Server Component; MOT REQ-MOT-34 drops it as a consumer, PRD §21 OI-02). Don't add tweening or an `AnimatedNumber` island.

## 4. Steps
1. **Sparkline (DATA-055..058).** `scale.ts` ≤ 60 lines. `Sparkline.tsx` is a Server Component: no `'use client'`, no hooks, `Intl.NumberFormat(locale)` with explicit locale (prop, then provider value passed by the caller; never implicit). The exact label format is `"{label}: {n} points, from {first} to {last}, low {min}, high {max}"`. Degenerate handling per REQ-DATA-49. Stroke 1.5 px with `vector-effect: non-scaling-stroke`. Forced-colors `CanvasText`.
2. **StatCard (DATA-059..062).** Server Component, `<article aria-labelledby>` or one `<a>` (`href`/`asChild`); a dev error when nested interactive content is detected (scan `children`/`description` element types for `a`, `button`, `input`, `select`, `textarea`, `[tabindex]`). Trend arrow `aria-hidden` + visually hidden text ("Up 12.5% vs previous period" / "Down …" / "No change …"); intent from `trendDirection`. Value `tabular-nums`. Use `Intl` only with an explicit locale.
3. **ChartFrame (DATA-063..067).** `ChartFrame.tsx` is server (no directive, no hooks) and renders `<figure data-ag-surface="content-raised">`, `<figcaption>`, and the client islands. Hidden-series state lives in a small client provider inside `ChartFrameLegend.tsx` that also wraps `ChartFramePlot`, so the frame file stays server-only. `ChartFramePlot` owns the single `ResizeObserver` (disconnect on unmount). It calls function children with `ChartContext` and, on server render, outputs a `height`-px placeholder with no width. A function child reaching it from a server render raises a dev error. `ChartFrameTable` is a server `<table>` with `<caption>` = title. Implement the three `table` modes and the last-visible-series guard with PRD-OVL `Tooltip` "At least one series must be visible". `color(key)` returns `var(--ag-chart-N)`.
4. **Timeline/ActivityFeed (DATA-069..071).** Server `<ol>`/`<li>`/`<time dateTime>`. Relative format needs `now` on the server (dev error otherwise). `ActivityFeedLoadMore.tsx` is the only client file: PRD-CTL `Button` "Load more", optional `autoLoad` with one `IntersectionObserver`, and announcements batched at most once per 2 s through the PRD-A11Y announcer.
5. **DATA-068 palette test** (thresholds exactly as in the task; Machado 2009 CVD matrices at severity 1.0; ΔE2000; OKLCH chroma). Implement the colour math in the test helper; add no dependency.
6. **DATA-074 hydration test** for StatCard, Sparkline, Timeline, ActivityFeed, ChartFrame and Table: a child process with `TZ=Pacific/Kiritimati` runs `renderToString` and writes HTML to a temp file; the Jest lane runs with `TZ=Pacific/Pago_Pago` (env in the CI job, not set at runtime) and `hydrateRoot`s it, asserting 0 `console.error`. The `date` case is added by 12g.
7. **DATA-072/073 Playwright specs** (`chart-frame.sr`, `data.forced-colors`, `data.responsive-cards`), all three engines, run remotely.
8. **DATA-075 adapter docs**: Recharts, visx and chart.js 4 examples, compiled in the PRD-DX `apps/docs` type-check (DX-101) against versions pinned in the docs app only.
9. **DATA-076** exports.

## 5. Tests to run
Local: `./node_modules/.bin/jest src/data/sparkline src/data/stat-card src/data/chart-frame src/data/timeline tests/tokens/chart-palette.test.ts tests/rsc/data-directives.test.ts`, `./node_modules/.bin/eslint src/data`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`. Remote: `tests/rsc/data-hydration.test.tsx` (TZ lane), Playwright specs above on three engines, Storybook build, `scripts/ci/verify-size-budgets.mjs` for the `docs/size-budgets.json` rows `{ Sparkline }` ≤ 1.5 KB, `{ StatCard }` ≤ 3 KB, `{ ChartFrame }` ≤ 5 KB, `{ Timeline, ActivityFeed }` ≤ 4 KB, and the `apps/docs` type-check.
Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
Remote screenshots (Chromium + WebKit, 1440 and 390 px, light/dark, `plain` and `photo` scenes): Sparkline `Line`/`Area`/`Bar`/`Intents`, StatCard `TrendMatrix` and `Locales`, ChartFrame `SvgAdapter` with one series hidden and `TableModes`, Timeline `Intents`, ActivityFeed `GroupedByDay`, plus a forced-colors capture of Sparkline and the ChartFrame legend. Upload as a CI artifact gallery for human review, with attention to grey charts (E-09) and sparkline visibility (E-23).

## 7. Integrity rules (binding)
No chart library in `aura-glass` dependencies, peers or devDependencies (the SvgAdapter story is hand-written). Server components must stay hook-free. Don't move logic into a client file just to make the directive test pass. Don't lower palette, contrast or chroma thresholds, and don't hard-code token fallbacks to pass the token lane. No `.skip`/`.only`, no snapshot updates to pass. No local Docker or local browser.

## 8. Exit criteria
- REQ-DATA-07: directive test green for all files in this prompt.
- AC-DATA-10/11: `chart-palette.test.ts` green for light and dark (or blocked on PRD-DS with the exact missing variables).
- AC-DATA-12 (non-date): hydration test 0 warnings across the TZ split.
- REQ-DATA-42..61: unit tests green as named in the tasks; `chart-frame.sr.spec.ts` and `data.forced-colors.spec.ts` green on three engines.
- Budgets reported against the §16 lines.

## 9. Final report format
```
PROMPT-12e REPORT
Branch/SHA:
Tasks: DATA-055..076 -> done|blocked (reason) each
Token lane: per index contrast/ΔE/chroma values (light, dark)
Budgets: Sparkline=…, StatCard=…, ChartFrame=…, Timeline+ActivityFeed=… KB gz (CI URL)
REQ-MOT-34 status: (owner decision or open)
Prereq blockers: (exact output)
Tests: name -> pass/fail (local|remote URL)
Visual evidence: artifact URL + reviewer notes
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
