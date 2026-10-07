# PROMPT-11a (NAV): Pure modules, shell tokens, `app-shell.css` grid and static geometry fixture

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; self-id PRD-11 is an alias, architecture §16 PRD-10; contracts `prd/_shared-contracts.md`), §4.2, §5.1, §5.8, §5.9, §5.10, §12.1, §14, §20 steps 1–2.
Requirement IDs: REQ-NAV-02 (CSS half), -03, -04, -06, -07, -09 (pure parser), -13 (CSS half), -55/-56 (`getPaginationRange` only), -59, -69.
Acceptance: AC-NAV-01 (static-fixture half), AC-NAV-02 (CSS half), AC-NAV-15 (`commandScore` half). Tasks: NAV-001..NAV-015. Key crosswalk and anchor tasks: `PROMPT_11_NAV.md`.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture decisions win; report any deviation with evidence.
- No fake completion: no stubs, placeholders, `test.skip`/`test.fixme`/`it.todo`/`describe.skip`, lowered thresholds, `jest -u`/`--update-snapshots`, deleted assertions, or jsdom assertions standing in for layout/contrast/blur/motion/frame time (those only via remote real-browser lanes). Committed report files close nothing (D-32). A failed prerequisite check ⇒ BLOCKED with its output.
- Remote-first: Playwright runs only in CI or on the gated remote runner (skill `auraone-remote-run`). No local browser, no local Docker. Local allowed: `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`, `rg`.
- No new dependencies in this prompt.
- CSS: every shipped CSS file starts with exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;` (SC-20, PKG owns the order), rules in `@layer ag.components`, durations only from the PRD-MOT scale `--ag-duration-{instant,micro,small,medium,large}` (SC-19), `--ag-*` tokens only, 0 `!important`, 0 `transition: all`, 0 `will-change`/`transform`/`contain: paint` on shell elements at rest, 0 colour/blur/duration literals.

## Prerequisites (verify, paste output in the report)

1. PRD-PKG (PROMPT for PKG; anchors PKG-005, PKG-105): `build/exports.manifest.json` has the `./app-shell.css` row and the build emits `dist/css/app-shell.css` (`rg -n 'app-shell.css' build/exports.manifest.json`). The class-coverage test exists: `test -f tests/css/class-coverage.test.ts` (PKG-105, REQ-PKG-95). If either is missing, do steps 1–4 and stop 5–9 as BLOCKED.
2. PRD-DS (anchors DS-016, DS-024): the DTCG tree exists (`rg --files tokens | rg '\.tokens\.json$' | head`) and the DS compiler `scripts/tokens/build.mjs` emits `--ag-space-2`, `--ag-space-4`, `--ag-duration-medium` into `dist/tokens.css` (`rg -n -- '--ag-space-2' dist/tokens.css`).
3. PRD-QA remote Playwright lane (QA-018 config, QA-031 `certify-pr.yml`) runs a spec path you pass. If not, run via `auraone-remote-run`.

## May touch

NEW `src/app-shell/{resizePanels,parseAppShellCookie}.ts` + `.test.ts`; NEW `src/components/navigation/{getPaginationRange,commandScore}.ts` + `.test.ts`; NEW `src/app-shell/app-shell.css`, `src/app-shell/app-shell.css.test.ts`; the `--ag-app-shell-*` row request handed to PRD-DS (NAV-009; no file under `tokens/`, SC-18); NEW `tests/e2e/app-shell/fixtures/static-shell.html`, `tests/e2e/app-shell/layout.spec.ts`; scope list inside `tests/css/class-coverage.test.ts` (MODIFY only; PKG-105 owns the file); NEW `docs/auraglass-5/proposals/NAV-to-TRUST-4.1.1-E-22.md`.

## Must not touch

Any 4.x component (`src/app-shell/components.tsx`, `src/components/navigation/Glass*`, `src/workspace/**`), `package.json` and `build/exports.manifest.json` (PRD-PKG owns), anything under `tokens/` and the token compiler (PRD-DS owns, SC-18), `release/4.x`.

## Steps

1. **`resizePanels.ts` (REQ-NAV-69).** Pure, no DOM. `resizePanels(layout: number[], constraints: PanelConstraint[], handleIndex: number, deltaPercent: number): number[]` and `collapsePanel/expandPanel`. `PanelConstraint = { minSize: number; maxSize: number; collapsible: boolean; collapsedSize: number }` (percent). Rules: sum stays 100 ± 0.01; growing past a neighbour's `minSize` pushes the next panel only if it can shrink, else clamps; a collapsible panel dragged below `minSize / 2` snaps to `collapsedSize`; `toPercent("240px", containerPx)` converter exported.
2. **`getPaginationRange.ts` (REQ-NAV-55/56).** `getPaginationRange({ page, pageCount, siblingCount = 1, boundaryCount = 1 }): Array<number | "ellipsis-start" | "ellipsis-end">`; length never exceeds `2*boundaryCount + 2*siblingCount + 3`; length is constant for all `page` when `pageCount` exceeds that number.
3. **`commandScore.ts` (REQ-NAV-59).** `commandScore(query: string, value: string, keywords?: string[]): number` in [0,1]. Case-insensitive, `normalize("NFD").replace(/\p{Diacritic}/gu, "")` folding, subsequence match by index walk. **No `RegExp` built from input** (`rg -n "new RegExp" src/components/navigation/commandScore.ts` = 0). Ranking: exact > prefix > word-start > subsequence > 0.
4. **`parseAppShellCookie.ts` (REQ-NAV-09).** `parseAppShellCookie(value: string | undefined): { sidebar?: "expanded"|"rail"|"collapsed"; inspector?: "open"|"closed" }`. Accepts `sidebar:<s>;inspector:<s>` in any order; ignores unknown keys/values; returns `{}` for input > 4096 chars; never throws. Also export `serializeAppShellCookie(key, state)` returning `ag-shell-<key>=…; Path=/; Max-Age=31536000; SameSite=Lax`.
5. **Token row request (NAV-009, SC-18).** Hand PRD-DS the values (DS lands them in its tree through `scripts/tokens/build.mjs`; NAV creates no file under `tokens/`): `sidebar-width 16rem`, `rail-width 4rem`, `inspector-width 20rem`, `topbar-height 3.25rem` (compact mode 2.75rem), `tabbar-height 3.5rem`, `gap` per density mode → `--ag-space-*` alias; read-only `bp-compact 600px`, `bp-expanded 1024px`, `bp-wide 1440px` with `$description: "documentation only; container queries use compiled constants"`. Once the DS task lands (PRD §21 O-06), confirm `--ag-app-shell-sidebar-width` in `dist/tokens.css`; until then steps 6–8 that read these tokens are BLOCKED.
6. **`app-shell.css`.** First line: the six-name `@layer` order statement (SC-20). Implement PRD §4.2 verbatim: `.ag-app-shell` container `ag-app-shell / inline-size`, the 4×3 named-area grid, `block-size: 100dvh`, `env(safe-area-inset-*)` padding on 4 edges, sidebar/inspector column vars keyed on `data-ag-sidebar`/`data-ag-inspector`, `[data-ag-sidebar-side=end]` area swap, and exactly three `@container ag-app-shell` conditions: `(width < 600px)` one column, `(600px <= width < 1024px)` sidebar column forced to rail width, `(width >= 1440px)` inspector docks; expanded is the base. `.ag-app-shell__main` (`[data-ag-slot=main]`): `grid-area: main; overflow: auto; overscroll-behavior: contain; scroll-padding-block: var(--ag-scroll-padding-top, 0) var(--ag-scroll-padding-bottom, 0)`. `.ag-app-shell:has(> .ag-top-bar[data-ag-placement=overlay])` sets `--ag-scroll-padding-top: calc(var(--ag-app-shell-topbar-height) + var(--ag-space-2))`. `grid-template-columns` transition only under `[data-ag-animating]` with `--ag-duration-medium`, wrapped so it is absent at `[data-ag-motion=calm|none]`. `.ag-app-shell__auto-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr)) }` (E-24). `[data-ag-layout=desktop|mobile]` force overrides.
7. **Static fixture.** `static-shell.html` loads only `dist/tokens.css`, `dist/styles/…` core and `dist/css/app-shell.css` (no Tailwind), with plain elements carrying the 5.0 classes/attributes for sidebar, top, main (tall content), inspector, status; plus a 900px-wide wrapper inside a 1920px viewport, and an `env()` override fixture (`--ag-test-safe-area` via `@supports` shim documented in the spec).
8. **`layout.spec.ts` (static half).** Tests: `desktop sidebar beside main` at 1440 and 1024 (`sidebar.right <= main.left + 1`, `|sidebar.top - main.top| <= topbarHeight`); `layout follows container not viewport` (900px shell in 1920 viewport renders medium: sidebar width = rail); `main owns scroll` (`document.scrollingElement.scrollHeight <= innerHeight`, `main.scrollHeight > main.clientHeight`); `safe-area insets`; `no promoted layers at rest` (computed `transform`, `will-change`, `contain`, `transition-property` on every `.ag-app-shell*` element). Engines: Chromium, WebKit, Gecko. Remote only.
9. **Class-coverage scope (MODIFY of PKG-105's file, OV-27).** Add `src/app-shell/**` and `src/components/navigation/{Tabs,TabBar,Breadcrumbs,BreadcrumbsOverflow,Pagination,Command,CommandPalette}.tsx` to the check's path list (files appear in later prompts; the scope must already be enforced).
10. **E-22 handover to PRD-TRUST (NAV-015, SC-36).** E-22 (escape user input in `GlassCommandPalette.tsx:298-303`) is accepted into 4.1.1 and PRD-TRUST implements it. Write the handover file with file:line, C-I class, the escape rule and a failing-test sketch. E-15 is deferred to 4.2 and handled by NAV-143 in 11i, so it is not part of this handover. Do not edit either 4.x file here.

## Tests (local Jest unless noted)

- `src/app-shell/resizePanels.test.ts` › `sum stays 100`, `clamp and push`, `collapse snap below half min`, `property: 1,000 seeded random drags` (seed logged).
- `src/components/navigation/getPaginationRange.test.ts` › 40 table-driven cases, `stable length`.
- `src/components/navigation/commandScore.test.ts` › `regex metacharacters` (`( [ * + ? \ ^ $ |`), `ranking: prefix > word-start > subsequence`, `diacritic folding`, `fuzz: 10,000 random printable-ASCII strings, 0 exceptions` (AC-NAV-15).
- `src/app-shell/parseAppShellCookie.test.ts` › valid, partial, malformed, > 4 KB; never throws.
- `src/app-shell/app-shell.css.test.ts` › parses built `dist/css/app-shell.css` with postcss: the first statement is the six-name `@layer` order, exactly the three `@container ag-app-shell` conditions, 0 `!important`, 0 `transition: all`, 0 `will-change` outside `[data-ag-animating]`.
- Remote: `tests/e2e/app-shell/layout.spec.ts` (static half) in 3 engines.
Run: `npm test -- src/app-shell src/components/navigation/getPaginationRange.test.ts src/components/navigation/commandScore.test.ts`.

## Visual evidence

Remote screenshots of `static-shell.html` at 390, 768, 1024, 1440, 1920 (and the 900-in-1920 wrapper) uploaded as CI artifacts; geometry JSON (bounding boxes) attached. Human review only; no baseline is committed from this prompt.

## Exit criteria

- NAV-001..015 DONE or BLOCKED with check output.
- AC-NAV-01 (fixture half): `desktop sidebar beside main` green in 3 engines on the static fixture without Tailwind.
- AC-NAV-02 (CSS half): `app-shell.css.test.ts` green; class-coverage scope committed.
- AC-NAV-15 (scorer half): fuzz test green.

## Final report format

```
PROMPT-11a REPORT
Commit: <sha>   Remote run: <CI URL or runner id>
Prerequisites: 1 <ok|missing: output> 2 <...> 3 <...>
Tasks NAV-001..015: DONE | BLOCKED(<reason>) each
REQ-NAV-02/03/04/06/07/09/13/55/56/59/69: test -> pass/fail
AC-NAV-01 (fixture), AC-NAV-02 (CSS), AC-NAV-15 (scorer): PASS/FAIL
Built app-shell.css size: <bytes gz>
Files changed: <list>
Deviations: <none | item + evidence>
```
