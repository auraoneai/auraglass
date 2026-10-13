# PROMPT-4 (SURF): Product Surfaces — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` (PRD-4, key **SURF**; REQ-SURF-01..196, AC-SURF-01..31, open items OI-01..OI-15). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/SURF.json` (SURF-001..SURF-645, field `lane`).

SURF ships flagships 14 and 22–44: `./app-shell`, root navigation (`Tabs`, `TabBar`, `Breadcrumbs`, `Pagination`, `Command`, `CommandPalette`, `SourceTransition`, `Timeline`, `ActivityFeed`), `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./three` (empty at 5.0), 5.1 `./charts`, `@auraglass/labs`, the SURF registry blocks/items and the capability ledger. It is split into **five internal lanes that start on day 0 and run at the same time**. No lane waits for another lane, and the stream waits for no other PRD.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). Every SURF lane starts on day 0; no other PRD, stream or task has to finish first.

## Lane table

| Prompt | Lane | Scope | REQ-SURF | AC-SURF (primary) | Tasks |
|---|---|---|---|---|---|
| `Work package 4a` | W1 Shell & navigation | `./app-shell` (AppShell, Sidebar + SidebarDrawer, TopBar, StatusBar, Inspector, MobileShell, ResizablePanels), root Tabs, TabBar, Breadcrumbs, Pagination, Command/CommandPalette, SourceTransition; `app-frame`, `mobile-settings`, `app-shell-workspace` | 16..65 (+ W1 share of 01..15, 170, 171, 188..196) | 04, 06, 07, 08, 09, 29 (+ W1 rows of 01, 05, 11, 12, 13, 23, 24, 25, 26) | SURF-001..133 |
| `Work package 4b` | W2 Data & date | `./data` (Table, internal VirtualList, TreeView, FilterBar, Chip, KeyValueEditor, StatCard, Sparkline, ChartFrame), root Timeline/ActivityFeed, `./date`, 5.1 `./charts`; data blocks/items | 66..105, 161..164, 174, 178 (+ W2 share) | 10, 14, 30 (+ W2 rows of 01, 02, 11, 12, 13, 23, 24, 25, 26) | SURF-134..275 |
| `Work package 4c` | W3 AI | `./ai` (types, Thread, Message, StreamingText, Composer, ToolCall, Reasoning, AgentSteps, SourceList, Citation, UsageMeter, ProviderErrorState), AI SDK interim harness, `ai-workspace` (Kiro Prism route), `ai-*` items | 106..129, 172, 173 (+ W3 share) | 15, 16, 17 (+ W3 rows of 01, 03, 11, 12, 23, 24, 25, 26) | SURF-276..395 |
| `Work package 4d` | W4 Media & backdrops | `./media` (useMediaElement, MediaControls, MediaScrubber, NowPlayingBar, ImageViewer, CarouselRail, owned-pixel sampling, 5.1 Waveform), `./backdrops`, `./three`; media blocks/items | 130..160, 165, 175 (+ W4 share) | 18, 19, 20, 21, 22 (+ W4 rows of 01, 11, 12, 13, 23, 24, 25, 26) | SURF-396..523 |
| `Work package 4e` | W5 Platform glue | CI fragment, purity gate, lint rules, capability ledger + gates, labs package + admission, deprecation skeleton on `release/4.x`, 4.x cases index, cross-cutting gates (prop grammar, directives, RTL, targets, focus, idle), commerce/presence/comment blocks, docs, API reports for root/compat | 01..15 (stream-wide), 166..170, 176..187, 190, 192..196 | 02, 03, 27, 28, 31 (+ W5 rows of 05, 11, 12, 24, 25, 26) | SURF-524..645 |

The PRD §20 workstreams W1..W5 are these lanes. Each REQ-SURF id is covered by at least one task; `reqs` and `acceptance` on every task name it. Tasks are re-keyed archived NAV/DATA/AI/MED/EXP tasks (`source` field) plus contract-driven new tasks (`source: "new (contract-v1.1)"`).

## Concurrency model (hard rules)

1. **No cross-PRD dependency.** Every need on PLAT, MAT, CMP or QUAL is met by a frozen contract seam (S-01..S-55) that exists from C0 as a type, seed, double, pre-declared file or fragment kind. `depends_on` only names SURF tasks in the same lane; cross-stream needs are in `contract_seams`. 4.x release ordering is `gate: "G-07"`, never a dependency.
2. **One owner per path.** SURF edits only its globs (PRD §6, contract §3.2 rows A07, A11, A14–A18, A20, B20a, B22a, B23a, C04, C07, C08, D02, D03, D08, E03, F02, F05). Inside SURF each lane owns disjoint paths (lane prompts list them). Read-only for SURF: `src/contracts/**`, `contracts/**`, `tests/contract-doubles/**`, `src/index.ts`, `src/compat/index.ts`, `package.json`, `package-lock.json`, `.gitlab-ci.yml`, `eslint.config.js`, `jest.config.js`, `playwright.config.ts`, `.storybook/**`, `certification/**`, `showcase/**`, `registry/registry.json`, `deprecations.json`, `docs/size-budgets.json`, `legacy/**`.
3. **Lines.** 5.0 work merges into `next` from `next-surf/<lane>-<topic>` branches. On `release/4.x` SURF writes only `fragments/deprecations/surf.ts` (branches `4x-surf/<topic>`) and its CI fragment; every 4.x code fix in SURF's domain (GlassCommandPalette regex escape, `isStorybookDataMedia`, GlassWorkspaceTabs prop leak, chart.js registration, `dateAdapters`) is PLAT's (contract §2.4.1). Both lines run at the same time.
4. **Worktrees.** One worktree per lane: `git worktree add ../AuraGlass.wt/surf-<lane> -b next-surf/<lane>-<topic> origin/next` (4.x: `-b 4x-surf/<topic> origin/release/4.x`). Merge small PRs into `next` at least daily when the GitLab pipeline for the PR head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, or `glab ci status`; paste the pipeline URL into the PR).
5. **Integration is continuous, GA is a checklist.** QUAL lanes run on whatever has merged (including 4.x code today); lanes report `pending` or `double-pass` until real inputs land and neither counts as a pass nor blocks a SURF PR. GA is the G-01..G-16 checklist on the release SHA, not a dependency.

### Shared SURF files: one decision

A handful of files aggregate rows from every lane. **Decision: they are shared inside SURF through a verbatim skeleton with one delimited block per lane (interface I-2), not split per lane** (fragments may import only `src/contracts/**`, OI-13). Any lane whose PR first touches one of them applies the skeleton byte-for-byte; identical edits from several lanes merge cleanly in git, and afterwards each lane writes only between its own markers, so concurrent PRs touch different lines. The files: `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,side-effects,review}/surf.ts`, `fragments/{playwright,a11y-baseline,literals-baseline}/surf.json`, `src/root/surf.ts`, `src/compat/surf/index.ts`, `ci/surf.gitlab-ci.yml`, `lint/rules/surf/_strict.cjs`, `scripts/surf/verify-surf-purity.mjs`, `tests/capability/purity-gate.test.ts`. Everything else belongs to exactly one lane.

**I-2 skeleton** (TypeScript fragments; JSON fragments use `{ "W1": [], "W2": [], "W3": [], "W4": [], "W5": [] }` merged by key; YAML uses `# --- lane Wn begin/end ---` comments; the `.cjs`/`.mjs` files use the same `// ---` markers around per-lane arrays):

```ts
// <kind> fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { /* the S-38..S-45 type for this kind */ } from '../../src/contracts/fragments';
// --- lane W1 begin ---
const w1 = [] as const;
// --- lane W1 end ---
// --- lane W2 begin ---
const w2 = [] as const;
// --- lane W2 end ---
// --- lane W3 begin ---
const w3 = [] as const;
// --- lane W3 end ---
// --- lane W4 begin ---
const w4 = [] as const;
// --- lane W4 end ---
// --- lane W5 begin ---
const w5 = [] as const;
// --- lane W5 end ---
export default [...w1, ...w2, ...w3, ...w4, ...w5];
```

Deprecation ids are pre-allocated per lane so concurrent PRs never collide: W1 `DEP-S0001..0199`, W2 `0200..0399`, W3 `0400..0599`, W4 `0600..0799`, W5 `0800..0999`. A barrel line in `src/root/surf.ts` or an entry `index.ts` is added only when that component's import graph has no `@ag-contract-seed` marker (contract §5.2 rule 3).

### Intra-stream interfaces (frozen here; no lane waits)

| Id | Interface | Owner lane | Consumers | How consumers proceed without waiting |
|---|---|---|---|---|
| I-1 | `VirtualList<T>` (internal, `src/data/virtual-list/`): props `items, getItemKey, renderItem, estimateSize, overscan=6, orientation, anchor: 'start' \| 'end', onEndReached, endReachedThreshold=200, role?: 'list' \| 'log' \| 'listbox'`; handle `scrollToIndex(i, { align })`, `scrollToKey(key, { align })`; `measureElement` for dynamic rows; 0 rAF/intervals idle (REQ-SURF-80) | W2 (its first PR) | W1 `Command` (>100 items), W3 `Thread` (>`virtualizeAfter`) | Both render non-virtualized (functionally correct below the threshold) and switch the import when I-1 merges; the >threshold tests report `pending`, never skipped |
| I-2 | Aggregate skeleton above | every lane | every lane | apply verbatim |
| I-3 | Cross-lane block composition through public entries only: `data-workspace` (W2) uses `Pagination` (W1); `support-inbox` (W2) uses `Thread` (W3); `ai-workspace` (W3) uses `AppShell` (W1) | block owner | — | The block is written against the PRD §5 props; its PR merges once the imported name is exported on `next`. Nothing else in any lane waits for it |

## Contract seams consumed (day-0 forms)

| Seam | Day-0 form SURF codes and tests against |
|---|---|
| S-01, S-02, S-05, S-06 | `src/contracts/material.ts`; seed `src/material/index.ts` (final `materialProps`, `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `useMaterialTier`); `contracts/stubs/reference.css` via `gotoStory(…, { stub: 'reference' })` until MAT's `material.css` exists |
| S-03, S-04, S-10, S-11 | `src/contracts/tokens.ts` (`PUBLIC_CSS_VARS`, `LAYER_ORDER_STATEMENT`); seed `src/tokens/index.ts` |
| S-12, S-13 | `src/contracts/motion.ts`; seed `src/motion/index.ts` (`subscribeFrame`, `observeOffscreen`, `startMorph` calling `update()` synchronously) |
| S-20..S-26 | `src/contracts/preferences.ts`; seed `src/theme/index.ts` (`AuraGlassProvider`, `usePortalContainer`, `GlassPreferencesPanel`, `useLayer` with kinds `drawer`, `command-palette`, `image-viewer`, `preview-card`, `useAnnouncer`) |
| S-30..S-34 | `src/contracts/components.ts` (`CMP_MODULES`, prop grammar, `BANNED_PROPS`); CMP seeds at `src/components/<dir>/index.ts` for structure; **`tests/contract-doubles/cmp/*.tsx`** for behaviour through SURF's own `tests/{app-shell,data,ai,media}/jest.doubles.cjs` presets (job `surf:test:doubles`; results recorded `double-pass`); seed `src/foundation/index.ts` (`defineMeta`, `toChangeDetails`, `renderElement`); `src/primitives/index.ts` |
| S-35, S-36, S-49, S-52 | `src/contracts/entries.ts` (`ENTRIES`, `ROOT_EXPORTS.surf`); frozen dependency set (contract §4.12); `npm run api:update -- --entry <entry>`, `npm test`, `npm run typecheck` |
| S-37 | seed `src/internal/index.ts` (`warnDeprecated`, `cn`, final) |
| S-38, S-39, S-44, S-45, S-50 | `src/contracts/fragments.ts`, `load-fragments.mjs`; empty `fragments/<kind>/surf.ts` from C0; `tests/contract-doubles/fragments/` |
| S-40..S-43, S-48, S-55 | `src/contracts/testing.ts`; seed `tests/helpers/index.ts` (`renderAg`, `renderAgServer`, `expectParts`, `expectNoBannedAttributes`, `gotoStory`, `listSubjects`, `apg`, `perf`), `tests/a11y/apg/harness.ts` |
| S-46, S-47 | registry layout and SURF block/item ids (contract §3.3); lint rule owners (`no-network-in-ai`, `no-simulation` = SURF) |
| S-51 | seed `.storybook/blocks/index.tsx` (only for optional MDX) |
| S-53, S-54 | verbatim root `.gitlab-ci.yml`, seed `ci/surf.gitlab-ci.yml`; labs publish through PLAT's `plat:publish:npm` |

Residual non-waits (contract §7.3): W-1 (a removal ships at GA only if its SURF deprecation shipped in a published 4.x minor — release gate G-07), W-2 (budget calibration is state-triggered), W-3 (area codemod transform code is PLAT's; SURF ships spec + fixtures), W-4 (blocks/showcases render seeds/doubles/`ShowcasePending` until inputs land), W-6 (mirror latency to GitLab).

## Common rules (binding for every lane prompt)

- **Repo** `/Users/gurbakshchahal/platforms/AuraGlass`; work only in your lane worktree. GitHub `github.com/auraoneai/auraglass` is the git source of truth; PRs are opened and merged on GitHub; the GitLab project `gitlab.com/chahal-foundation-group/github-auraoneai/auraglass` (project 87152036) is its one-way mirror and runs all CI.
- **CI/CD is GitLab CI only.** No GitHub Actions workflow is used, added or edited by SURF. Never reference `publish-npm.yml`, `GITHUB_WORKFLOW_REF`, `gh run` or `actions/*`; use `CI_PIPELINE_SOURCE`, `CI_COMMIT_BRANCH`, `CI_COMMIT_TAG`, `id_tokens`, `glab`. SURF jobs live only in `ci/surf.gitlab-ci.yml` (`surf:<stage>:<name>`, extends root templates, rules on `$AG_SCOPE`/`$AG_LINE`, no `merge_request_event`, cross-stream `needs` only to `CI_JOBS` names with `optional: true`, evidence under `.artifacts/surf/<job-slug>/` with `expire_in`, no credentials, `allow_failure: true` until the job's first green run on `next`, then the owning lane flips it). Lane-level checks register in `fragments/lanes/surf.ts` and run in QUAL's `qual:certify:l*` jobs. Pages (Storybook, Material Lab, docs) are PLAT's `pages` job. Owner decision **OD-8**: replacing the org-managed `mirror-to-gitlab` GitHub Action with GitLab pull mirroring is the user's call; SURF never touches `.github/workflows/mirror-to-gitlab.yml`.
- **Remote-first (machine policy).** Local runs are limited to `npm test -- <paths>`, `npm run typecheck`, `node_modules/.bin/eslint <paths>`, and plain node scripts. Every Playwright, APG, visual, perf, canary and Storybook run happens on GitLab SaaS runners (`.ag-playwright`, image `mcr.microsoft.com/playwright`) or, for GPU/real-device cells, the gated AWS remote runner (`.ag-aws-remote` / `auraone-remote-run`). Never start a local browser for certification, never use local Docker.
- **No fake completion.** Prohibited: mock, placeholder or simulated product behaviour (`Math.random` demos, fake Blobs, fake progress timers, hard-coded demo data in defaults); `test.skip`, `test.fixme`, `it.todo`, `xit`, commented-out assertions; lowering any threshold, budget, contrast floor or timeout; updating snapshots or visual baselines to make a test pass; a jsdom assertion standing in for a layout, contrast, blur, motion or frame-time measurement; closing a requirement with a seed, double (`double-pass`), stub or committed report; shipping anything from `contracts/stubs/**` or `tests/contract-doubles/**` or an `@ag-contract-seed` marker in SURF `src/**`. A task that cannot be finished is reported `BLOCKED` with the exact command output.
- **Code rules.** React 19 ref-as-prop (no `forwardRef`); `"use client"` only on client modules (REQ-SURF-07); no `displayName` sniffing or `cloneElement`; S-30 prop grammar (`value/defaultValue/onValueChange(value, details)`, `open/defaultOpen/onOpenChange`, no `BANNED_PROPS`); styling only through `ag-<component>` classes, `data-ag-part`, S-01 attributes and `data-state`; every `.css` starts with `LAYER_ORDER_STATEMENT` and puts rules in one `@layer ag.components` block; no `!important`, `backdrop-filter`, `filter`, colour/blur/radius/duration literals, `glass-*` utilities or physical-direction properties; private vars only as `--_ag-<component>-*`; all optics through `Surface`/`materialProps`; `Intl.*` with explicit `locale`/`timeZone` (never `toLocale*`); every visible string overridable via `labels`; no network, provider SDK, `process.env` (except `NODE_ENV`) or `import.meta.env` in shipped code; imports only from the contract module paths of PRD §4.4 and your own lane's paths.
- **LLM features.** Kiro Prism is the default LLM layer: the only model call in SURF is consumer code in the `ai-workspace` block route (`https://prism.auraone.ai/v1`, server-side key `PRISM_API_KEY`, tested against a mocked Prism). The library itself never calls a model.
- **Evidence.** Measured on GitLab job artifacts (`.artifacts/**`, `expire_in`), never committed reports. Visual evidence = remote screenshots attached as CI artifacts plus the L14 human review through QUAL; nothing is committed under `reports/` or `certification/`.

## Final report (orchestrator aggregation)

Each lane prompt emits its own report block. The orchestrator joins them into:

```
SURF STREAM REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
REQ-SURF-NN | lane | task ids | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | pipeline URL
AC-SURF-NN  | PASS / FAIL / PENDING | release SHA | artifact path
Open items OI-01..OI-15: status, default in force, owner
Contract PRs opened: contract/ai-sdk-devdeps, contract/three-entry, (5.1) charts peers — state
```

AC-SURF-01..29 and -31 close only on the GA SHA from GitLab artifacts; AC-SURF-30 at 5.1.0/5.2.0.

---

## How to run this prompt

This is the only prompt for this PRD. Give the whole file to one agent. The 5 work packages below touch disjoint files and none waits on another, so an agent that can spawn subagents should run them in parallel (one subagent per work package). Otherwise do them in the order listed. The stream is done when every work package's exit criteria are met.

---

## Work package 4a: SHELL NAV

### PROMPT-4a (SURF lane W1): App shell and root navigation

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.1–§4.4, §5.2, §5.3, §13 (AppShell product shells), §14, §15, §16, §20 row W1. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` contract-v1.1.
Requirement IDs: REQ-SURF-16..65 (owned); W1 rows of REQ-SURF-01, -03, -07..-14, -170, -171, -188..-196.
Acceptance: AC-SURF-04, -06, -07, -08, -09, -29 (owned); W1 rows of AC-SURF-01, -05, -11, -12, -13, -23, -24, -25, -26.
Tasks: `docs/auraglass-5/tasks/SURF.json` lane `W1`, SURF-001..SURF-133. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_11a..11i_NAV_*.md` (tasks NAV-001..145 re-keyed; `source` field).
Flagships: 22 AppShell, 23 Sidebar, 24 TopBar, 25 Tabs, 26 TabBar, 27 Breadcrumbs, 28 Pagination, 29 CommandPalette/Command, 30 ResizablePanels, 31 SourceTransition.

#### Prerequisites

**None** except the frozen contract at C0. Verify once (all exist from C0; if one is missing the contract bootstrap is incomplete — report it, do not create it):

```bash
test -f src/contracts/material.ts && test -f src/contracts/tokens.ts && test -f src/contracts/motion.ts \
 && test -f src/contracts/preferences.ts && test -f src/contracts/components.ts && test -f src/contracts/entries.ts \
 && test -f src/contracts/fragments.ts && test -f src/contracts/testing.ts && test -f contracts/stubs/reference.css \
 && ls tests/contract-doubles/cmp/{dialog,menu,tooltip,collapsible,combobox}.tsx && test -f tests/helpers/index.ts \
 && test -f ci/surf.gitlab-ci.yml && test -f fragments/lanes/surf.ts
```

Seams consumed and what you test against before the real code lands:
S-01/S-02/S-05/S-06 (`materialProps`, `Surface`, `SurfaceGroup`, `ScrollEdge edge/edgeStyle`, `ConcentricFrame` seeds; computed styles via `contracts/stubs/reference.css`), S-03/S-04 (public vars, layer statement), S-12/S-13 (`startMorph` seed calls `update()` synchronously — Tabs indicator and SourceTransition must still be correct on that path), S-21..S-26 (`useLayer({ kind: 'drawer' | 'command-palette' })`, `usePortalContainer('overlay')`, `useAnnouncer`, `GlassPreferencesPanel` for `mobile-settings`), S-30..S-34 (CMP `IconButton`, `Tooltip`, `Menu`, `Sheet`, `Card`, `Toolbar` seeds for structure; Dialog/Menu/Tooltip/Collapsible/Combobox doubles through `tests/app-shell/jest.doubles.cjs` for behaviour), S-35 (`ENTRIES['./app-shell']`, `ROOT_EXPORTS.surf`), S-37 (`warnDeprecated`), S-38/S-39/S-43/S-44/S-45 (fragment schemas), S-40/S-41 (helpers, `parameters.ag`), S-46 (block ids `app-frame`, `mobile-settings`, item `app-shell-workspace`), S-53 (CI fragment). Intra-stream: I-1 `VirtualList` (W2) for `Command` >100 items; I-2 aggregate skeleton.

#### May touch (lane W1 exclusive)

`src/app-shell/**`; `src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition}/**`; `src/compat/surf/{app-shell,navigation}/**`; `tests/app-shell/**` (incl. `jest.doubles.cjs`, `compat.test.tsx`, `migration-rows.test.ts`); `tests/e2e/surf/app-shell/**`; `tests/e2e/surf/motion/{tabs-indicator,tabbar-minimize,source-transition}.spec.ts`; `tests/a11y/apg/surf/{sidebar,splitter,tabs,tabbar,breadcrumbs-overflow,command}.apg.spec.ts`; `tests/perf/browser/surf/{app-shell-scroll,sidebar-toggle,resizable-drag,command-5000}.spec.ts`; `tests/rsc/surf/breadcrumbs-server.spec.ts`; `tests/ssr/surf/hydration.spec.ts`; `tests/a11y/manual/{records,scripts}/surf/{app-shell,sidebar,top-bar,tabs,tab-bar,breadcrumbs,pagination,command,resizable-panels,source-transition}*`; `canaries/next16/app/surf/{app-shell,breadcrumbs-server}/**`; `canaries/vite/src/surf/AppShell.page.tsx`; `registry/blocks/{app-frame,mobile-settings}/**`; `registry/items/app-shell-workspace/**`; `tests/capability/registry/{app-frame,mobile-settings,app-shell-workspace}.test.tsx`; `fragments/codemods/surf/fixtures/app-shell-slots/**`; `tests/fixtures/consumer-4x/cases/surf/app-shell/**`; `etc/api/app-shell.*`; `apps/docs/content/surf/{app-shell.md,migration/app-shell.md}`.
Shared (own `lane W1` block only, I-2): `src/root/surf.ts` (Tabs, TabBar, Breadcrumbs, Pagination, CommandPalette, Command, SourceTransition), `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,review}/surf.ts`, `ci/surf.gitlab-ci.yml`.

#### Must not touch

Other lanes' paths (`src/{data,date,charts,ai,media,backdrops,three}/**`, `src/components/timeline/**`, their tests, blocks and items); other lanes' blocks in shared files; every read-only path of the index (`src/index.ts`, `package.json`, `.gitlab-ci.yml`, `.storybook/**`, `certification/**`, `showcase/**`, `registry/registry.json`, `legacy/**`, `src/contracts/**`, `tests/contract-doubles/**`). Never delete 4.x files (PLAT, contract §3.1a) and never edit `release/4.x` code (PLAT); W1's only 4.x write is its block of `fragments/deprecations/surf.ts` on a `4x-surf/*` branch.

#### Steps (inside the lane; nothing waits on another lane)

1. **Pure modules** (SURF-001..008): `resizePanels.ts` reducer, `Pagination.getRange` (`src/components/pagination/getRange.ts`), `Command.score` (`src/components/command-palette/score.ts`: case-insensitive, NFD diacritic folding, prefix > word-start > subsequence, never builds a RegExp from input), `AppShell.parseCookie` (pure, server-safe, never throws, >4 KB input). Tests first.
2. **`app-shell.css`** (REQ-SURF-17, -19, -24, -36): `container: ag-app-shell / inline-size`; named areas `"skip skip skip" "side top insp" "side main insp" "side status insp"`; columns `var(--_ag-app-shell-side) minmax(0,1fr) var(--_ag-app-shell-insp)`; `block-size: 100dvh`; `env(safe-area-inset-*)`; exactly three `@container ag-app-shell` conditions (compact <600, medium 600–1023, wide ≥1440; expanded is the base); private defaults only (`--_ag-app-shell-*`, no public `--ag-app-shell-*`, contract §4.2 adaptation); grid columns never transition; `:has(> .ag-top-bar[data-ag-placement=overlay])` writes `--ag-scroll-padding-top`. Geometry spec against a static fixture first, remote.
3. **Server frame** (REQ-SURF-16, -18, -20, -23, -26, -34, -35, -39, -40): `AppShell = { Root, Main, PageHeader, SkipLink, SidebarToggle, InspectorToggle, Controller }`, slots by element type + `data-ag-slot` (memo/HOC safe), one `<main tabIndex={-1}>`, SkipLink first focusable; `TopBar` (`<header>`, banner only as a direct shell child, exactly one MAT `ScrollEdge edge="top"` with `edgeStyle`, dev warning on a second); `StatusBar` (no live role; `Live` through `useAnnouncer`, 1,000 ms debounce, silent on mount); `MobileShell` (`layout="mobile"`, overlay bars write scroll padding). Density is the provider's `data-ag-density` — no `density` prop.
4. **State islands** (REQ-SURF-21, -22, -32): per-root `useSyncExternalStore` store (no context across the RSC boundary), toggles as CMP `IconButton`, ARIA by container mode from one `ResizeObserver` (layout effect, no hydration mismatch), `collapseTo`, `mod+B` only with `shortcut`, cookie `ag-shell-<key>=sidebar:<s>;inspector:<s>; Path=/; Max-Age=31536000; SameSite=Lax`, controlled `Controller`.
5. **Sidebar + SidebarDrawer** (REQ-SURF-27..33): `appearance: 'sidebar' | 'inset' | 'floating'`; `Sidebar.Item` is `<a>` (`render` for router links; `<button>` warns); rail keeps accessible names with CMP `Tooltip`; collapsed = `inert` + `display: none` (never `aria-hidden`); compact/medium → `SidebarDrawer` on Base UI Dialog with `useLayer({ kind: 'drawer', modal: true })`, `usePortalContainer('overlay')`, scrim `--ag-scrim-clear`, closes on Escape (top layer only), scrim click and item activation, restores focus; expanded state restored at ≥1024 px.
6. **ResizablePanels → Inspector** (REQ-SURF-37, -38, -42..-46): container-relative pointer math (rect read once on `pointerdown`), pointer capture, rAF-coalesced `flex-basis` writes, React state only on `pointerup`, one `onLayout` per drag; APG window splitter ARIA and keys; sizes sum 100 ± 0.01; `autoSaveId` read in a layout effect; `stackBelow`. Inspector: docked (wide, `content-sunken`), floating (`chrome regular`), compact CMP `Sheet side="bottom" detents={[0.5, 1]}`.
7. **Tabs → TabBar** (REQ-SURF-47..54): Tabs on Base UI Tabs, no landmark, ids from `useId()` + value, APG keys incl. RTL, indicator through MAT `startMorph` with feature-detected CSS fallback (translate/scale only); overflow mask fade + `scrollIntoView({ block: 'nearest', inline: 'nearest' })` on activation (this is the only allowed `scrollIntoView` outside `src/ai`). TabBar `semantics: 'navigation'` = `<nav>` of links with `aria-current="page"` (no tab roles), `'tabs'` requires panels; `appearance: 'bar' | 'floating'` + `placement: 'inline' | 'overlay'`; one `SurfaceGroup` owns the only backdrop filter; `minimizeOnScroll` via CSS scroll-driven animation only.
8. **Breadcrumbs, Pagination** (REQ-SURF-55..59): server Breadcrumbs `nav > ol > li`, `Current` with `aria-current="page"`, client `Overflow` (CMP `IconButton` + `Menu`) only when `maxItems` collapses; Pagination link mode (`getHref`) server, button mode client, stable item count, compact form below 400 px.
9. **Command, CommandPalette** (REQ-SURF-60..63): Base UI Combobox inline list; palette on Base UI Dialog with `useLayer({ kind: 'command-palette', modal: true })`, initial focus on input, Escape clears then closes, IME never selects, one `document` keydown per mounted palette for `hotkey` (the only allowed global key listener). Above 100 items use I-1 `VirtualList`; until W2's PR lands, render non-virtualized and record the 5,000-item test `pending`.
10. **SourceTransition** (REQ-SURF-64, -65): API, `view-transition-name: ag-src-<id>` allocation and focus only; engines are MAT's `startMorph`.
11. **Metas, stories, blocks, migration** (REQ-SURF-09, -10, -12..-15, -41, -170, -171): one `<Name>.meta.ts` per flagship (`defineMeta`, parts = rendered `data-ag-part` set, `budgetKb` = size row, `migration` = codemod props rows); stories per PRD §13.3 (`Saas`, `AiCommandCenter`, `Mail`, `Settings`, `MobileApp`, `CommandCenter`, `ContainerPlayground`, RTL variants; `parameters.ag`; no inline layout/`<style>`); `app-frame`, `mobile-settings` blocks and `app-shell-workspace` item; compat adapters under `src/compat/surf/{app-shell,navigation}/`; W1 block of `fragments/deprecations/surf.ts` on `release/4.x` (ids DEP-S0001..0199; `since` 4.2.0 for `./workspace`/`./workflows` and DEPRECATE/REMOVE names, 4.3.0 for renames/consolidations); `fragments/codemods/surf.ts` W1 rows + `app-shell-slots` spec and fixtures; `cases/surf/app-shell/`; W1 rows of size/perf/lanes/css/review fragments; `etc/api/app-shell.*` via `npm run api:update -- --entry app-shell`.

#### Tests (names are the PRD's; browser specs run remotely only)

Jest (local OK): `resizePanels.test.ts` (seeded 1,000-drag property test), `getRange.test.ts` (40 cases), `score.test.ts` ("regex metacharacters", "ranking", 10,000-string fuzz), `parseCookie.test.ts`, `AppShell.test.tsx` ("slots wrapped in memo/HOC", "single main", "props render as data attributes", "heading level", "landmark inventory"), `appShellStore.test.ts` ("writes cookie", "controlled mode"), `SidebarToggle.test.tsx` ("ARIA by container mode", "collapseTo"), `Sidebar.test.tsx` ("appearance is not variant", "item is a link with aria-current", "render composes router link", "rail keeps names", "collapsed is inert", "uncontrolled toggle", "group containing current opens"), `TopBar.test.tsx` ("one scroll edge per edge"), `MobileShell.test.tsx`, `StatusBar.test.tsx`, `Inspector.test.tsx`, `ResizablePanels.test.tsx` ("drag in a 600 px-offset container", "single onLayout", "separator ARIA", "restores saved layout with no mismatch"), `Tabs.test.tsx` ("unique ids", "active tab scrolled into view", "part contract"), `TabBar.test.tsx` ("navigation semantics", "tabs requires panels", "warns over 5 items", "accessory placement"), `Breadcrumbs.test.tsx`, `Pagination.test.tsx` ("stable item count"), `Command.test.tsx` ("5,000 items", "announces count"), `CommandPalette.test.tsx` ("hotkey opens and restores focus"), `SourceTransition.test.tsx`, `app-shell.css.test.ts`, `tests/app-shell/{labels,meta-coverage,compat,migration-rows}.test.ts(x)`, `tests/capability/registry/{app-frame,mobile-settings}.test.tsx`; behaviour suites also under `jest -c tests/app-shell/jest.doubles.cjs`.
Remote (GitLab `.ag-playwright`, 3 engines, LTR+RTL): `tests/e2e/surf/app-shell/{layout,a11y,sidebar-drawer,inspector,resizable,theme,forced-colors,blur-budget}.spec.ts`, `tests/a11y/apg/surf/{sidebar,splitter,tabs,tabbar,breadcrumbs-overflow,command}.apg.spec.ts`, `tests/e2e/surf/motion/{tabs-indicator,tabbar-minimize,source-transition}.spec.ts`, `tests/perf/browser/surf/{app-shell-scroll,sidebar-toggle,resizable-drag,command-5000}.spec.ts`, `tests/ssr/surf/hydration.spec.ts` (Next 16 + React 19.3 and Next 15 + React 19.0, with/without `rail` cookie, server `TZ=Pacific/Kiritimati`), `tests/rsc/surf/breadcrumbs-server.spec.ts`, Vite canary `canaries/vite/src/surf/AppShell.page.tsx` (L11). All registered in the W1 block of `fragments/lanes/surf.ts`.

#### Visual evidence

Remote screenshots (CI artifacts, `expire_in`) of the six AppShell product shells at 390/768/1024/1440/1920 × light/dark × the 8 QUAL scenes, with/without `rail` cookie, plus `ContainerPlayground` at 320–1920. L14 human review items come from `fragments/review/surf.ts` (specular quality, optical hierarchy, radius rhythm, "reads as one hand"). Nothing is committed.

#### Prohibited

Everything in the index "No fake completion" list, plus: handler-only nav items without `render`; `aria-hidden` on focusable content; `window.innerWidth`, `matchMedia` width queries or resize listeners deciding layout; `transition: all`, `will-change`, `transform` at rest, `!important` on shell elements; a second `role="log"`/live region; building a RegExp from user input; shipping the non-virtualized Command path as "done" for REQ-SURF-63.

#### Exit criteria

- AC-SURF-04: Vite canary without Tailwind at 1440×900 — `app-frame` sidebar right ≤ main left + 1 px, tops differ ≤ top-bar height; 900 px shell in a 1920 px viewport renders medium.
- AC-SURF-05 (shell rows): ≤3 fine / ≤2 coarse blurred surfaces, depth 1, chrome blur ≤32 px; 0 animations/rAF 1 s after load; forced colors 0 backdrop filters with a current-item cue; `contrast: more` diff >0.5 % in TopBar and Sidebar.
- AC-SURF-06: duplicate-value Tabs 0 duplicate ids, no landmark; TabBar navigation and Sidebar 0 `tab`/`tablist`, one `aria-current="page"` per nav; collapsed sidebar 0 tabbables; `StatusBar.Root` no live role.
- AC-SURF-07: ResizablePanels in a 600 px-offset container within 1 px of the pointer; WebKit touch drag; 0 commits during drag; one `onLayout`.
- AC-SURF-08: `Command.score` and `Command` take 10,000 random printable-ASCII queries with 0 exceptions.
- AC-SURF-09: six shells SSR → hydrate in Next 16/19.3 and Next 15/19.0 with 0 warnings, CLS ≤0.01, with/without cookie; Breadcrumbs (no overflow) and the server frame contribute 0 client modules.
- AC-SURF-29: six product shells pairwise non-identical (DOM hash), 0 `<style>`, 0 `!important`, L14 review recorded.
- W1 rows of AC-SURF-01 (root SURF names and `./app-shell` exactly per contract), -11 (W1 APG specs pass 3 engines LTR/RTL), -12 (axe 0), -13 (OCR contrast), -23 (W1 size/perf rows green, grades ≥B/≥C), -24 (W1 deprecations shipped in 4.2/4.3, adapters warn once, fixtures pass), -25 (deliverables for flagships 22–31), -26 (`app-frame`, `mobile-settings`, `app-shell-workspace` render in Vite and Next 16 canaries).
- Every SURF-001..133 task `DONE` or `BLOCKED` with evidence; `npm test`, `npm run typecheck` green; pipeline for the merge SHA `success`.

#### Final report format

```
PROMPT-4a SURF/W1 REPORT
Branches/PRs: <next-surf/w1-*> <4x-surf/*>   Merge SHAs: <sha…>   GitLab pipelines: <URLs>
Contract check: ok | missing <paths>
Tasks SURF-001..133: DONE n / BLOCKED n (<id: reason + command output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (one line per REQ 16..65 and W1 shares)
AC-SURF-04/-06/-07/-08/-09/-29 (+ W1 rows of -01/-05/-11/-12/-13/-23/-24/-25/-26): PASS | FAIL | PENDING + artifact path
I-1 status (Command virtualization): pending | switched in <PR>
Budgets measured (KB / ms) vs rows; files changed; deviations from PRD with evidence
```

---

## Work package 4b: DATA DATE

### PROMPT-4b (SURF lane W2): Data, date and charts

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.1–§4.4, §5.4, §5.5, §5.9 (charts), §5.10 (data blocks/items), §13 (Table, TreeView, FilterBar, StatCard, Sparkline, ChartFrame, Timeline, Date stories), §14, §16, §20 row W2. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1.
Requirement IDs: REQ-SURF-66..105, -161..-164, -174, -178 (owned); W2 rows of REQ-SURF-01..-04, -06..-15, -170, -171, -188, -189, -194..-196.
Acceptance: AC-SURF-10, -14, -30 (owned, -30 for 5.1/5.2 items); W2 rows of AC-SURF-01, -02, -11, -12, -13, -23, -24, -25, -26.
Tasks: `tasks/SURF.json` lane `W2`, SURF-134..SURF-275. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_12a..12j_DATA_*.md` (DATA-001..144 re-keyed; 4.x chart/date fixes on `release/4.x` were dropped: they are PLAT's) and EXP column reorder / inline edit / DateTimePicker tasks.
Flagships: 14 date set, 32 Table, 33 TreeView, 34 FilterBar, 35 StatCard, 36 Sparkline + ChartFrame, 37 Timeline/ActivityFeed; T2 `Chip`, `KeyValueEditor`.

#### Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing, never create):

```bash
test -f src/contracts/components.ts && test -f src/contracts/entries.ts && test -f src/contracts/fragments.ts \
 && ls tests/contract-doubles/cmp/{popover,menu,select,combobox,collapsible,scroll-area}.tsx && test -f tests/helpers/index.ts \
 && node -e "const p=require('./package.json');for(const d of ['@tanstack/react-table','@tanstack/react-virtual','@base-ui/react'])if(!(p.dependencies||{})[d])process.exit(1);for(const d of ['react-aria-components','@internationalized/date'])if(!(p.peerDependencies||{})[d])process.exit(2)"
```

(The dependency set is frozen in contract §4.12; `package.json` is PLAT's and read-only.)
Seams consumed: S-01/S-05/S-06 (`content-raised` for Table/StatCard/ChartFrame, `ScrollEdge` for the sticky header, seeds + `contracts/stubs/reference.css`), S-03/S-04 (chart palette derived from public `--ag-color-*`), S-12, S-20..S-26 (`useAnnouncer` for sort/selection/results, `usePortalContainer`), S-30..S-34 (CMP `Checkbox`, `Skeleton`, `Menu`, `Popover`, `Sheet`, `SearchField`, `ToggleGroup`, `IconButton`, `TextField`, `NumberField`, `Select`, `Button`, `Avatar`, `Card`, `Toolbar`; doubles through `tests/data/jest.doubles.cjs`), S-35 (`./data`, `./date`, `./charts` `ga: '5.1'`, root `Timeline`/`ActivityFeed`), S-37..S-46, S-49 (frozen deps), S-53. Intra-stream: **you own I-1 `VirtualList`** — land it in your first PR exactly as the index defines it; I-3 for `data-workspace` (uses W1 `Pagination`) and `support-inbox` (uses W3 `Thread`).

#### May touch (lane W2 exclusive)

`src/data/**`, `src/date/**`, `src/charts/**`, `src/components/timeline/**`; `src/compat/surf/{data,date}/**`; `tests/{data,date,charts}/**` (incl. `tests/data/jest.doubles.cjs`, `tests/data/exports/**`, `tests/data/css/**`, `tests/data/rsc-hydration.test.tsx`, `tests/data/chart-palette.test.ts`, `tests/data/no-chart-deps.test.ts`); `tests/e2e/surf/{data,date,charts}/**`; `tests/a11y/apg/surf/{table,tree-view,filter-bar,calendar,date-picker,time-picker,date-time-picker}.apg.spec.ts`; `tests/perf/browser/surf/{data-table,data-tree-view,data-date-picker}.spec.ts`; `tests/visual/surf/data/**`; `tests/rsc/surf/data-*`; `tests/types/surf/filter-model.test-d.ts`; `canaries/next16/app/surf/data-server/**`, `canaries/vite/src/surf/DataTable.page.tsx`; `registry/blocks/{data-workspace,analytics-dashboard,support-inbox,audit-log,permissions-matrix}/**`; `registry/items/{query-builder,tree-select,faceted-search,schema-viewer}/**`; `tests/capability/registry/{data-items,data-workspace,support-inbox,analytics-dashboard,audit-log,permissions-matrix}.test.tsx`; `fragments/codemods/surf/fixtures/data-*/**`; `tests/fixtures/consumer-4x/cases/surf/data/**`; `etc/api/{data,date,charts}.*`.
Shared (own `lane W2` block only): `src/root/surf.ts` (Timeline, ActivityFeed), `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,side-effects}/surf.ts`, `fragments/playwright/surf.json`, `lint/rules/surf/_strict.cjs`, `ci/surf.gitlab-ci.yml`.

#### Must not touch

Other lanes' paths and blocks; `apps/docs/content/surf/**` (W5 writes the data/date/chart migration guides from your tables); `package.json` (5.1 d3 peers come by contract PR); legacy 4.x chart/date/table files and every `release/4.x` code path (PLAT); `docs/size-budgets.json`, `deprecations.json`, `build/**`, `registry/registry.json`.

#### Steps

1. **I-1 `VirtualList`** first PR (SURF-134.., REQ-SURF-80): internal, not in any barrel; idle test proves 0 rAF/intervals.
2. **Table core** (REQ-SURF-66..70, -74..-77): one TanStack table, `TableColumnDef` with `meta` keys via declaration merging, controlled/uncontrolled pairs, row models imported per feature, `size: 'sm' | 'md' | 'lg'` (no `density`), virtualization ≤ `ceil(600/40) + 2×8` rows with `aria-rowcount`/`aria-rowindex`, `>500` rows without `virtualize` → dev warning only, sticky header in MAT `ScrollEdge` (`chrome thin`), root `content-raised` (no blur), loading/empty states, no conditional hooks.
3. **Table advanced** (REQ-SURF-71..73, -78): resize separator ARIA + keys (RTL), pinning with `position: sticky` + `inset-inline-*` and auto-pin below 480 px, grid mode (`useGridKeyboard` ≤2.5 KB, focus survives row unmount), column reorder via a CMP `Menu` "Move left/right" (no drag required) with announcement; 5.1 inline edit (REQ-SURF-79).
4. **Display set** (parallel inside the lane): Sparkline (own ≤60-line scale, accessible label, degenerate cases) → StatCard (server, `Intl.NumberFormat`, trend arrow + hidden text, `tabular-nums`, no tween) → ChartFrame (server `<figure>`, client `Legend`/`TableToggle`/`Plot`, `ChartContext`, adapter type only, real `<table>` fallback, private `--_ag-chart-1..8` palette with CVD ΔE checks) → Timeline/ActivityFeed (root, `src/components/timeline/`, `<time dateTime>`, `now` required for relative on the server, batched announcements).
5. **Filter model → FilterBar → Chip, KeyValueEditor** (REQ-SURF-84..89): immutable model exposed as `FilterBar.useModel/serialize/parse` statics, typed operators, URL round-trip, chips with remove buttons, CMP `Popover` editor, `Sheet` below 480 px; `Chip` and `KeyValueEditor` per PRD (moved from archived FND).
6. **TreeView** (REQ-SURF-81..83): React Aria `Tree`, APG tree, `preset: 'files'`, `loadChildren`, virtualized 5,000 nodes ≤40 `treeitem`s.
7. **Date** (REQ-SURF-98..105): `DateProvider` bridging locale/dir into RA `I18nProvider`; DateField/TimeField spinbuttons; Calendar/RangeCalendar APG date grid; DatePicker (CMP `Popover` ≥640 px, `Sheet` below), DateRangePicker (presets listbox, draft-commit, 1/2 months), `week-number.ts` ISO-8601, TimePicker; `@internationalized/date` values only, no `format` prop, no `date-fns`; helpers come from the peer, not re-exported. 5.1 DateTimePicker by additive contract PR.
8. **Entries, statics, CSS, boundaries** (REQ-SURF-01..04, -06..-08): `src/data/index.ts` and `src/date/index.ts` with exactly the contract lists; W2 block of `src/root/surf.ts`; `tests/data/exports/{surf-entries,surf-statics,peer-isolation}.test.ts` on the packed tarball (`AURAGLASS_TARBALL` or `npm pack --pack-destination .artifacts/pack`); `tests/data/no-chart-deps.test.ts`; `tests/data/css/surf-css.test.ts` and logical-properties scan (these scan all SURF CSS and report other lanes' files as `pending` until they exist); `tests/data/rsc-hydration.test.tsx` with a UTC+14 server child process and UTC−11 client.
9. **Migration** (REQ-SURF-12..15): W2 deprecation rows on `release/4.x` (ids DEP-S0200..0399; chart engines and DEPRECATE/REMOVE `since: '4.2.0'`, renames/consolidations `4.3.0`), compat adapters (GlassDataTable, GlassDataGrid, GlassVirtualTable, GlassVirtualList, GlassTreeView, 4.x TreeView, GlassFileTree, GlassFileExplorer, GlassFilterBar, GlassStatCard, GlassKPICard, GlassMetricCard, GlassAnimatedNumber, GlassSparkline, GlassTimeline, GlassActivityFeed, GlassChip, GlassKeyValueEditor, date set with `Date` ↔ `CalendarDate` on the client and required `timeZone` on the server), codemod rows + fixtures, `cases/surf/data/`.
10. **Blocks and items** (REQ-SURF-170, -171, -174, -178): `data-workspace`, `analytics-dashboard`, `support-inbox` (I-3), `query-builder`, `tree-select`, `faceted-search`, `schema-viewer`; 5.2 `audit-log`, `permissions-matrix`. `fixtures.ts` deterministic; QUAL showcases import them.
11. **5.1 charts** (REQ-SURF-161..164): `Chart` implementing `ChartAdapter` on `d3-scale`/`d3-shape` optional peers (contract PR), keyboard cursor, ≤15 KB gz; `./charts` absent from every 5.0.x `latest` map.

#### Tests (remote for every `*.spec.ts`)

Jest: `src/data/table/Table{,.virtual,.resize,.dom-contract,.reorder,.edit}.test.tsx` (incl. "sorting", "range selection", "states", "size", "numeric", "toggle every boolean", "handle"), `src/data/virtual-list/VirtualList.test.tsx` ("idle"), `src/data/tree-view/TreeView.test.tsx`, `src/data/filter-bar/{filter-model.test.ts,FilterBar.test.tsx}` ("round-trip" 40 cases, deep-frozen inputs), `src/data/{chip,key-value-editor,stat-card,sparkline,chart-frame}/*.test.tsx`, `src/components/timeline/*.test.tsx`, `src/date/{DatePicker,DateRangePicker,TimePicker,date-props,DateTimePicker}.test.tsx`, `src/date/week-number.test.ts` (20 cases incl. 2020-12-31 → W53, 2021-01-04 → W1), `tests/types/surf/filter-model.test-d.ts`, `tests/data/{exports/*,no-chart-deps,css/*,rsc-hydration,chart-palette,compat}.test.*`, `tests/capability/registry/{data-items,data-workspace,support-inbox,analytics-dashboard}.test.tsx`, `src/charts/Chart.test.tsx`, `tests/charts/peer-isolation.test.ts`; behaviour suites also under `jest -c tests/data/jest.doubles.cjs`.
Remote: `tests/a11y/apg/surf/{table,tree-view,filter-bar,calendar,date-picker,time-picker,date-time-picker}.apg.spec.ts`; `tests/e2e/surf/data/{table-virtual,table-pinning,table-responsive,tree-virtual,chart-frame-sr,forced-colors,preferences,axe}.spec.ts`; `tests/e2e/surf/date/{locale,date-picker-responsive}.spec.ts`; `tests/e2e/surf/charts/keyboard.spec.ts` (5.1); `tests/perf/browser/surf/{data-table,data-tree-view,data-date-picker}.spec.ts`; `tests/visual/surf/data/**`; canaries `data-server` (Next 16) and `DataTable.page.tsx` (Vite, 1,000 rows).

#### Visual evidence

Remote captures of every §13 data/date story (Table `Default`, `Virtualized100k`, `ResizeAndPin`, `GridMode`, `OverMedia`, `RTL`; StatCard `Locales`; ChartFrame `TableModes`; Date `Mobile`, `Locales`, `TwoMonths`) at 390/1440 × light/dark × 8 scenes as CI artifacts; L14 through QUAL. Nothing committed.

#### Prohibited

Index list, plus: chart.js, react-chartjs-2, date-fns or d3 outside `src/charts/**`; a runtime chart registry; tweened/animated values in StatCard; blurred glass on table content; `toLocale*`; mutating `data` or filter input; automatic virtualization switching; a format-string date prop.

#### Exit criteria

- AC-SURF-10: 10,000 virtualized rows ≤31 `<tr>` in a 600 px container in 3 engines, `aria-rowindex` = data index + 2; scroll p95 ≤16.7 ms mobile, ≤8.3 ms desktop.
- AC-SURF-14: `renderToString` → `hydrateRoot` for StatCard, Sparkline, Timeline, ActivityFeed, ChartFrame, Table, DatePicker with server UTC+14 / client UTC−11: 0 warnings.
- AC-SURF-02 (W2 rows): `rg "chart\.js|react-chartjs-2|date-fns"` over SURF paths = 0; the `{ Button }` and `{ Table }` metafiles carry no RA, `@internationalized/date`, `d3-*`, and `{ Button }` no `@tanstack/*`.
- AC-SURF-13 (W2 rows): chart palette ≥3:1 vs `content-raised`, ΔE2000 ≥15 for indices 1–4 under three CVD simulations, chroma ≥0.08 for 1–6.
- AC-SURF-30 (5.1/5.2): `Chart` ≤15 KB gz and the AC-11/12/13 equivalents; `DateTimePicker`, Table inline edit, `audit-log`, `permissions-matrix` delivered at their releases.
- W2 rows of AC-SURF-01 (`./data`, `./date` exact; `Timeline`, `ActivityFeed` in root; `./charts` absent in 5.0.x), -11, -12, -23 (`{ Table }` ≤45 KB etc.), -24, -25 (flagships 14, 32–37), -26.
- SURF-134..275 `DONE` or `BLOCKED` with evidence; `npm test`, `npm run typecheck` green; merge-SHA pipeline `success`.

#### Final report format

```
PROMPT-4b SURF/W2 REPORT
Branches/PRs: <next-surf/w2-*> <4x-surf/*>   Merge SHAs   GitLab pipelines: <URLs>
I-1 VirtualList: merged in <PR/sha>
Tasks SURF-134..275: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (66..105, 161..164, 174, 178 and W2 shares)
AC-SURF-10/-14/-30 (+ W2 rows of -01/-02/-11/-12/-13/-23/-24/-25/-26): PASS | FAIL | PENDING + artifact
I-3 blocks (data-workspace, support-inbox): merged | waiting for export <name>
Budgets measured vs rows; files changed; deviations with evidence
```

---

## Work package 4c: AI

### PROMPT-4c (SURF lane W3): Presentational AI (`./ai`)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.2 (statics), §4.5 (AI data model), §5.6, §5.10 (REQ-SURF-172, -173), §13 (AI stories), §14, §15, §16, §20 row W3. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1. LLM policy: Kiro Prism (`/Users/gurbakshchahal/kiro-prism/{README,API,SETUP,LLM}.md`) is the model layer for the `ai-workspace` route; the library makes no model or network call.
Requirement IDs: REQ-SURF-106..129, -172, -173 (owned); W3 rows of REQ-SURF-01..-03, -05..-14, -170, -188..-190, -192..-196.
Acceptance: AC-SURF-15, -16, -17 (owned); W3 rows of AC-SURF-01, -02 (no `ai`/`@ai-sdk/*` in a fresh install), -03, -11, -12, -13, -23, -24, -25, -26.
Tasks: `tasks/SURF.json` lane `W3`, SURF-276..SURF-395. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_13a..13f_AI_*.md` (AI-001..123 re-keyed).
Flagships: 38 Thread, 39 Message, 40 Composer, 41 ToolCall, 42 SourceList/Citation.

#### Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing):

```bash
test -f src/contracts/components.ts && test -f src/contracts/preferences.ts && test -f src/contracts/entries.ts \
 && ls tests/contract-doubles/cmp/{collapsible,menu,popover,combobox}.tsx && test -f tests/helpers/index.ts \
 && node -e "const e=require('fs').readFileSync('src/contracts/entries.ts','utf8');if(!/'\.\/ai'/.test(e))process.exit(1)"
```

Seams consumed: S-01/S-05/S-06 (message `content-raised`, composer `chrome thick`, jump pill `chrome thin`), S-03/S-04, S-12 (caret blink tokens, motion `none`), S-21..S-26 (`useAnnouncer` — the only speech path besides `role="log"` and `Composer.Counter`; `useLayer({ kind: 'preview-card' })`; `usePortalContainer('overlay')`), S-30..S-34 (CMP `Collapsible`, `Menu`, `Meter`, `Alert`, `Button`, `TextField`, `Combobox`, `Icon`; doubles via `tests/ai/jest.doubles.cjs`), S-35 (`./ai` = 11 names), S-37..S-46, S-49 (frozen deps — `ai`/`@ai-sdk/*` are **not** in it), S-53 (CI fragment). Intra-stream: I-1 `VirtualList` (W2) for `Thread` above `virtualizeAfter` — until it merges, Thread renders every message (correct below the threshold) and the 2,000-message spec reports `pending`; I-3: `ai-workspace` composes W1 `AppShell` through `aura-glass/app-shell`.

**AI SDK harness (REQ-SURF-106, day 0, no wait):** open additive contract PR `contract/ai-sdk-devdeps` (exact pins of `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`; PLAT regenerates the lockfile inside it). Until it merges every SDK-importing file lives under `ci/surf/ai-sdk/**` (outside the `tsconfig.json` include set) with its own `tsconfig.json`; job `surf:test:ai-sdk` installs the pins into `.artifacts/surf/ai-sdk/` with `npm install --prefix .artifacts/surf/ai-sdk --no-save` and runs `tsc` + Jest there. After the merge one W3 PR moves them to their final paths (task "AI SDK/final paths").

#### May touch (lane W3 exclusive)

`src/ai/**` (incl. `__fixtures__/`, `icons/` internal glyphs, `renderers.tsx`, `ai.css`); `src/compat/surf/ai/**`; `tests/ai/**` (incl. `jest.doubles.cjs`, `compat.test.tsx`, `a11y.axe.test.tsx`, `side-effects.test.ts`, `labels.test.tsx`, `exports/**`); `tests/e2e/surf/ai/**`; `tests/a11y/apg/surf/{thread,message,composer,tool-call,citation}.apg.spec.ts`; `tests/visual/surf/ai/**`; `tests/perf/browser/surf/ai-streaming.spec.ts`; `tests/types/surf/ai-*.test-d.ts`; `tests/a11y/manual/{records,scripts}/surf/ai-*`; `canaries/next16/app/surf/{ai-rsc,ai-client}/**`; `scripts/surf/gen-ai-fixtures.mjs`, `scripts/surf/gen-ai-thread-fixture.mjs`; `ci/surf/ai-sdk/**`; `registry/blocks/ai-workspace/**`; `registry/items/ai-*/**`; `tests/capability/registry/{ai-items,ai-workspace-route,ai-sdk-adapter}.test.ts(x)`; `lint/rules/surf/no-network-in-ai.cjs`, `tests/lint/surf/no-network-in-ai.test.ts`; `fragments/codemods/surf/fixtures/ai-chat/**`; `tests/fixtures/consumer-4x/cases/surf/ai/**` is W5's (do not edit); `etc/api/ai.*`; `apps/docs/content/surf/ai-prism-routing.md` (the one docs file W3 owns).
Shared (own `lane W3` block only): `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,review}/surf.ts`, `ci/surf.gitlab-ci.yml` (jobs `surf:build:ai-fixtures`, `surf:test:ai-sdk`), `lint/rules/surf/_strict.cjs`, `scripts/surf/verify-surf-purity.mjs` (AI rule set), `tests/capability/purity-gate.test.ts` (AI fixtures).

#### Must not touch

Other lanes' paths and blocks; `package.json`/lockfile (contract PR only); `src/icons/**` (contract R-06); `.storybook/**` (the replay decorator lives in SURF story files); `showcase/**` (QUAL imports `registry/blocks/ai-workspace/fixtures.ts`); any 4.x AI file or `src/services/ai/**` removal (PLAT).

#### Steps

1. **Model** (REQ-SURF-106): `src/ai/types.ts` exactly per PRD §4.5 (structural mirror of AI SDK `UIMessage`, no `ai` import in shipped code); `ToolCall.displayState` mapping incl. `denied`; `Message.getText`; generated fixtures `src/ai/__fixtures__/ui-messages.ai-sdk.json` (≥20, every part type and tool state, one unknown type) from `ui-messages.source.ts` by `scripts/surf/gen-ai-fixtures.mjs --check` — never hand-written; `ci/surf/ai-sdk/ai-sdk-compat.test-d.ts` (`expectAssignable<AgMessage[]>`, `AgChatStatus`). Record the pinned SDK version in the first PR (OI-10).
2. **Message, Parts, StreamingText** (REQ-SURF-111..115): `<article>` with a hidden "{author}, {time}" heading (`Intl.DateTimeFormat(locale, { timeZone, timeStyle: 'short' })`, no context read); `Message.Parts` ordering and override precedence (exact > prefix > default; unknown → `null` + one warning; text escapes HTML; `renderText` hook); StreamingText ≤1 commit per frame via `useSyncExternalStore`, `announce: 'complete' | 'sentences' | 'off'`, caret stopped when motion ≠ `full`; actions always in the tab order; file parts; error/aborted states.
3. **Thread** (REQ-SURF-107..110): the only `role="log"`; pin rule (`≤ pinThreshold`), one `scrollTop` write per frame, `overflow-anchor`, no smooth scroll while streaming, `JumpToLatest`, user send re-pins; virtualization via I-1 above `virtualizeAfter` with `anchor: 'end'`; `onReachTop` with one `IntersectionObserver`; handle with 0 `scrollIntoView`.
4. **Composer** (REQ-SURF-116..119): `<form>` on Base UI Field; IME-safe Enter (`!isComposing && keyCode !== 229 && !shiftKey`), Cmd/Ctrl+Enter, Stop swap, Escape stops, draft kept on error; attachments by picker/paste/drop with reasons (`type | size | count`), never read or uploaded; growth 1→`maxRows` with `field-sizing: content`, keyboard inset handling; counter announces at 90 %/100 % only.
5. **Agentic and sources** (REQ-SURF-120..127): ToolCall (Collapsible, 7 SDK states → 6 display states, approval once, focus to trigger), Reasoning (auto open/close, "Thought for {s} s"), AgentSteps (server `<ol>`), SourceList (http/https only, `rel="noopener noreferrer"`), Citation (Base UI PreviewCard on `useLayer({ kind: 'preview-card' })`, activation opens the in-message SourceList), UsageMeter (CMP `Meter`, warning/critical text), ProviderErrorState (`role="alert"` panel, retry countdown — allowlisted timer).
6. **Layout, semantics, statics, entry** (REQ-SURF-01, -02, -128, -129): container queries on Thread/Composer roots, `--ag-scroll-padding-bottom` from composer and pill, no horizontal overflow at 320 px; live-region inventory; statics `Message.Parts`, `Message.getText`, `Thread.RenderersProvider`, `ToolCall.displayState`; `src/ai/index.ts` with exactly the 11 contract names; `etc/api/ai.*`.
7. **Items and block** (REQ-SURF-170, -172, -173): `ai-markdown`, `ai-model-picker`, `ai-artifact-panel` (PLAT `code-surface` only as a `registryDependencies` entry), `ai-trace-tree`, `ai-eval-dashboard` (no hard-coded metrics), `ai-voice-input` (real `MediaRecorder`, permission errors), `ai-sdk-adapter` (`useAuraChat`, interim under `ci/surf/ai-sdk/`); `ai-workspace` block with `app/api/chat/route.ts` (interim `ci/surf/ai-sdk/ai-workspace/…`): `streamText` + `createOpenAICompatible({ name: 'kiro-prism', baseURL: 'https://prism.auraone.ai/v1', apiKey: process.env.PRISM_API_KEY })`, model from `PRISM_MODEL` or the first `/v1/models` entry at request time, `toUIMessageStreamResponse()`, 32 KB cap (413), per-IP 20 req/min bucket (429 + `Retry-After`), 503 `{ kind: 'auth' }` when the key is unset, README says the bucket is per-instance; `fixtures.ts` recorded session replayed deterministically. Tests use a mocked Prism; no CI job holds a Prism key (OI-14).
8. **Gates, lint, CI** (REQ-SURF-05, -06, -195): AI rule set of `verify-surf-purity.mjs` (fetch, XHR, WebSocket, EventSource, sendBeacon, `process.env` other than `NODE_ENV`, `import.meta.env`, provider specifiers, `dangerouslySetInnerHTML`, `scrollIntoView`) with one failing fixture each; `auraglass/no-network-in-ai` rule + test; L2 check `rg "fetch\(|XMLHttpRequest|WebSocket\(|EventSource\("` over `dist/ai/**` = 0; side-effect-free import; W3 jobs in `ci/surf.gitlab-ci.yml`.
9. **Migration** (REQ-SURF-12..14): W3 deprecation rows on `release/4.x` (DEP-S0400..0599; `GlassChat`, `GlassPredictiveChat` + presets, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator`, `GlassVoiceInput`, simulated AI, `NeuralWeightVisualization`, `GlassMusicVisualizer` "no successor until 5.1 (`Waveform`)" — all `since: '4.2.0'`); compat adapters mapping `ChatMessage` → `AgMessage` and naming every dropped prop in the warning; `ai-chat` area spec + fixtures.

#### Tests (remote for every `*.spec.ts`)

Jest: `src/ai/**/{Thread,Message,MessageParts,StreamingText,Composer,ToolCall,Reasoning,AgentSteps,SourceList,Citation,UsageMeter,ProviderErrorState}.test.tsx` (incl. "log semantics", "jump to latest", "user send re-pins", "imperative handle" with `scrollIntoView` spy = 0, "accessible name", "explicit locale/timeZone", "escapes text", "IME composition does not submit", "stop swap", "attachments", "counter", "approval", "rejects javascript: and data: URLs"), `tests/ai/{side-effects,labels,a11y.axe,compat}.test.tsx`, `ci/surf/ai-sdk/{ai-sdk-compat.test-d.ts,ai-workspace-route.test.ts,ai-sdk-adapter/useAuraChat.test.tsx}` (then final paths), `tests/capability/registry/ai-items.test.tsx`, `tests/lint/surf/no-network-in-ai.test.ts`, fixture generators `--check`; behaviour suites also under `jest -c tests/ai/jest.doubles.cjs`.
Remote: `tests/e2e/surf/ai/{thread-scroll,thread-virtual,composer-ime,composer-dropzone,composer-grow,citation-preview}.spec.ts` (3 engines; WebKit iOS emulation; Japanese IME), `tests/a11y/apg/surf/{thread,message,composer,tool-call,citation}.apg.spec.ts`, `tests/visual/surf/ai/ai-workspace.visual.spec.ts` (320, 390, 1440, zoom200, rtl), `tests/perf/browser/surf/ai-streaming.spec.ts`, canaries `ai-rsc`, `ai-client`; L13 records `tests/a11y/manual/records/surf/ai-*.json`.

#### Visual evidence

Remote captures of every §13 AI story (Thread `Long2000Virtualized`, `StreamingPinned`, `StreamingUnpinnedJump`; Message `WithImage`, `Error`; Composer `Dragging`, `NearLimit`; ToolCall per display state; Sources `Twelve`; ProviderErrorState per kind) and the `ai-workspace` block at 320/390/1440/zoom200/RTL × 8 scenes; L14 items from the W3 block of `fragments/review/surf.ts`. Nothing committed.

#### Prohibited

Index list, plus: any network, provider SDK or model call in `src/ai/**`; simulated suggestions, typing indicators driven by timers, `new Blob(["…"])` voice data; HTML injection of model text; `scrollIntoView` or smooth scroll while streaming; additional `aria-live` regions; a hard-coded model id or a Prism key anywhere (including fixtures and CI); hand-written SDK fixtures.

#### Exit criteria

- AC-SURF-15: every fixture in `ui-messages.ai-sdk.json` renders with 0 dev warnings except the unknown-type fixture (exactly 1); `ai-sdk-compat.test-d.ts` passes against the recorded pinned `ai` version.
- AC-SURF-16: pinned drift ≤1 px over 300 streamed frames, unpinned drift ≤1 px, prepend offset ≤1 px (3 engines); 2,000 messages: articles ≤ visible + 12, ≥55 fps desktop / ≥30 fps mobile, 0 long tasks in the 30 s stream.
- AC-SURF-17: 0 submits during IME composition on WebKit and Chromium and exactly 1 on the following Enter; all 7 SDK tool states render the right display state with icon + text; approve/deny calls the handler exactly once.
- AC-SURF-26 (W3 rows): `ai-workspace` route test passes against a mocked Prism and contains no literal or public key; every `ai-*` item validates and renders in the canaries.
- W3 rows of AC-SURF-01 (`./ai` = 11 names + statics), -02, -03, -11, -12 (jest-axe 0 on all AI states), -13, -23 (`{ Thread, Message, Composer }` ≤25 KB etc.), -24, -25 (flagships 38–42, L13 records), -26.
- SURF-276..395 `DONE` or `BLOCKED`; `npm test`, `npm run typecheck`, `surf:test:ai-sdk` green; merge-SHA pipeline `success`.

#### Final report format

```
PROMPT-4c SURF/W3 REPORT
Branches/PRs   Merge SHAs   GitLab pipelines: <URLs>
contract/ai-sdk-devdeps: open | merged <sha>; pinned versions: ai@<v> @ai-sdk/react@<v> @ai-sdk/openai-compatible@<v>
Tasks SURF-276..395: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (106..129, 172, 173 and W3 shares)
AC-SURF-15/-16/-17 (+ W3 rows of -01/-02/-03/-11/-12/-13/-23/-24/-25/-26): PASS | FAIL | PENDING + artifact
I-1 (Thread virtualization): pending | switched in <PR>; OI-08 screen-reader outcome; OI-10 version record
Budgets measured vs rows; files changed; deviations with evidence
```

---

## Work package 4d: MEDIA BACKDROPS

### PROMPT-4d (SURF lane W4): Media, owned-pixel sampling, backdrops and `./three`

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.6, §5.7, §5.8, §5.9 (REQ-SURF-165), §5.10 (REQ-SURF-175), §13 (Media, Backdrop stories), §14, §15, §16, §20 row W4. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1.
Requirement IDs: REQ-SURF-130..160, -165, -175 (owned); W4 rows of REQ-SURF-01, -03, -05, -07..-09, -12..-15, -170, -171, -188, -192, -194..-196.
Acceptance: AC-SURF-18, -19, -20, -21, -22 (owned); W4 rows of AC-SURF-01, -03, -11, -12, -13, -23, -24, -25, -26, -30 (5.1 Waveform, `media-transcript`).
Tasks: `tasks/SURF.json` lane `W4`, SURF-396..SURF-523. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_14a..14h_MED_*.md` (MED-001..167 re-keyed; 4.1.1 `isStorybookDataMedia` removal and all 4.x component edits dropped — PLAT's).
Flagships: 43 MediaControls/NowPlayingBar, 44 CarouselRail (+ ImageViewer, MediaScrubber, `useMediaElement`, Backdrop).

#### Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing):

```bash
test -f src/contracts/motion.ts && test -f src/contracts/testing.ts && test -f src/contracts/entries.ts \
 && ls tests/contract-doubles/cmp/{slider,toolbar,menu,dialog}.tsx && test -f tests/helpers/index.ts \
 && node -e "const t=require('fs').readFileSync('src/contracts/testing.ts','utf8');for(const s of ['photo','dark-media','flat-white','flat-black','video-frame'])if(!t.includes(s))process.exit(1)"
```

Seams consumed: S-01 (`data-ag-backdrop`, `data-ag-media-root`, `data-ag-media-tone`, `data-ag-backdrop-preset`, `data-ag-palette` — SURF setters only), S-03/S-04 (`--ag-scrim-media`, `--ag-target-coarse`, `--ag-duration-ambient`), S-05/S-06 (`SurfaceGroup` `chrome thin` `clear`, `content-raised` slides), S-12/S-13 (`subscribeFrame` for `--_ag-media-progress`, `observeOffscreen` for `[data-ag-offscreen]`, `[data-ag-continuous="on"]` gate), S-21..S-26 (`useLayer({ kind: 'image-viewer' })`, `usePortalContainer('overlay')`, `useAnnouncer`), S-30 (CMP `Slider`, `Toolbar`, `Toggle`, `Menu`, `Icon`, `Grid`; doubles via `tests/media/jest.doubles.cjs`), S-35 (`./media` 7 names, `./backdrops` = `Backdrop`, `./three`), S-37..S-46, S-40/S-42 (QUAL scene assets at `/scenes`, `gotoStory`, `perf`), S-53. No intra-stream interface is consumed.

#### May touch (lane W4 exclusive)

`src/media/**` (incl. `sampling/`, `__fixtures__/`, 5.1 `Waveform/`), `src/backdrops/**` (incl. `assets/grain-112.{avif,png}`), `src/three/**`; `src/compat/surf/{media,backdrops}/**`; `tests/{media,backdrops}/**` (incl. `jest.doubles.cjs`, `compat.test.tsx`, `deprecation-coverage.test.ts`, `exports/**`, `assets.test.ts`); `tests/e2e/surf/{media,backdrops}/**`; `tests/a11y/apg/surf/{media-controls,image-viewer,carousel-rail}.apg.spec.ts`; `tests/visual/surf/media/**`; `tests/perf/browser/surf/{media-playback,media-sampling,backdrops-presets}.spec.ts`; `tests/types/surf/{media,backdrops}.test-d.ts`; `tests/a11y/manual/{records,scripts}/surf/{media,carousel,image-viewer}*`; `scripts/surf/{calibrate-media-tone,gen-grain-tile,gen-peaks-voice}.mjs`; `registry/blocks/media-viewer/**`; `registry/items/{media-video-player,media-audio-player,media-gallery,media-now-playing,media-transcript,backdrop-hero}/**`; `tests/capability/registry/{media-items,media-viewer}.test.tsx`; `fragments/codemods/surf/fixtures/media-backdrops/**`; `tests/fixtures/consumer-4x/cases/surf/media/**`; `etc/api/{media,backdrops,three}.*`.
Shared (own `lane W4` block only): `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,side-effects}/surf.ts`, `fragments/playwright/surf.json` (project `surf:cert-media-sampling`), `scripts/surf/verify-surf-purity.mjs` (media rule set), `tests/capability/purity-gate.test.ts` (media fixtures).

#### Must not touch

Other lanes' paths and blocks; `certification/**` and `certification/scenes/**` (consume via `/scenes` only); `src/theme/color.ts` or any MAT file (SURF implements its own BT.709 luma in `src/media/sampling/luma.ts`); MAT floors and variables (`data-ag-backdrop` on chrome, any `--ag-*` MAT var); 4.x media/backdrop files and `release/4.x` code (PLAT); `showcase/**` (QUAL imports `registry/blocks/media-viewer/fixtures.ts`).

#### Steps

1. **Sampling (pure first)** (REQ-SURF-151..153): `computeLumaStats` and `classifyTone` (constants `TONE_LIGHT_MEAN/P10`, `TONE_DARK_MEAN/P90`) with synthetic-RGBA tests; `sampleOwnedPixels` on a 32×32 `OffscreenCanvas` (detached `<canvas>` fallback), one `getImageData`, `requestIdleCallback` (500 ms timeout), LRU 64 keyed by `(currentSrc, region)`, tainted/zero-size → no tone + one dev warning (exact PRD text), silent in production. Calibrate once at alpha on a remote runner with `scripts/surf/calibrate-media-tone.mjs` over the 8 scenes; commit only `src/media/sampling/__fixtures__/scene-stats.json`, the run artifact goes to `.artifacts/surf/<job>/media-tone-calibration.json`.
2. **`useMediaElement`, store, `formatMediaTime`** (REQ-SURF-130..133): per-element external store over the 16 events of PRD §4.6, snapshots ≤`snapshotHz` (default 4, clamp 1–15) with immediate publish for play/pause/seeked/ended/error/volumechange; `--_ag-media-progress` from one `subscribeFrame` only while playing, visible and intersecting; `NotAllowedError` → `autoplay-blocked`; optional Media Session; one `AbortController` per element; never sets `src`, never `load()`, no `AudioContext`, no fetch; exact server snapshot.
3. **Backdrop presets** (REQ-SURF-155..160): server `Backdrop` with discriminated `preset` union; `aurora`/`mesh` as stacked radial gradients from S-03 colours (one element, no canvas, no `filter`, `%` positions); declarations (photo/video `media`, aurora/mesh `light|dark|auto`, grain none); `photo` `<img aria-hidden alt="">`; `video` muted/playsinline/loop, `preload="metadata"`, no `autoplay`, `BackdropTone` plays only under the continuous gate + intersecting + visible and renders the "Pause background video" toggle (WCAG 2.2.2); `motion="drift"` one keyframe under the gate; grain tile ≤8 KB AVIF / ≤16 KB PNG via `image-set()`; forced colors hide decorative layers.
4. **MediaScrubber → MediaControls → NowPlayingBar** (REQ-SURF-134..139): Scrubber on Base UI Slider (`aria-valuetext` spoken "1 minute 32 seconds of 4 minutes 10 seconds", buffered/chapters as layers whose only inline style is `--_ag-start/--_ag-end`, ≤1 seek per frame, 1 commit); MediaControls as Base UI Toolbar in one `SurfaceGroup` `chrome thin`, default `clear`, parts per PRD, shortcuts only when focus is inside (never `window`/`document`), container-responsive rows (≥480 / 320–479 / <320), Captions over real `TextTrack`s; NowPlayingBar with `role="progressbar"` from `--_ag-media-progress`, `Expand` with `aria-controls`, artwork sampled once per `src`.
5. **ImageViewer** (REQ-SURF-141..145): SURF overlay on Base UI Dialog with `useLayer({ kind: 'image-viewer', modal: true })`, focus to Close and back, id-keyed items (filter 10 → 3, trigger `p7` opens p7, 10/10), zoom 1–8× (wheel only with ctrl/meta or when zoomed, non-passive on Stage only), pan/pinch with pointer capture, `--ag-scrim-media` with no backdrop filter, ≤3 `<img>`, no `new Image()`, Inspector as a side panel ≥768 px / bottom region below (never a second dialog), counter announced once per navigation.
6. **CarouselRail** (REQ-SURF-146..150): APG carousel (`aria-roledescription`, `Indicators as: 'tabs' | 'buttons'`), scroll-snap + `IntersectionObserver` (threshold 0.6, no scroll listeners), Prev/Next `aria-disabled` at ends, autoplay only with `autoplay` **and** `[data-ag-continuous="on"]`, toggle first focusable, pauses on hover/focus/offscreen/hidden; no `backdrop-filter` in `src/media/CarouselRail/**`.
7. **`./three`** (REQ-SURF-165): day 0 `src/three/index.ts` = `export {};` and open contract PR `contract/three-entry` (`exports: []` at 5.0, `ga` kept); no 4.x three component is ported.
8. **Stories, items, block, migration** (REQ-SURF-09, -12..-15, -170, -171, -175): §13 stories (MediaControls `OverVideoClear`, `OverPhotoClear`, `OverFlatCanvas` (falls back to regular, D-12), `HeadlessUseMediaElement`, `CaptionsAndRate`, `Compact`, `EnhancedRefraction`; Scrubber, NowPlayingBar, ImageViewer, CarouselRail, Backdrop sets) using `/scenes` assets only; items `media-video-player`, `media-audio-player` (with `<track kind="captions">`), `media-gallery`, `media-now-playing`, `backdrop-hero`, 5.1 `media-transcript`; `media-viewer` block over `Backdrop preset="photo"`; W4 deprecation rows on `release/4.x` (DEP-S0600..0799, media family `since: '4.2.0'`, `ImageList*` `4.3.0`, sampler names, particle families with the `Backdrop preset="aurora"` hint); 13 compat adapters; `media-backdrops` area spec + fixtures; `cases/surf/media/`.
9. **Gates and fragments** (REQ-SURF-05, -06, -154, -194): media rule set of the purity gate (`AudioContext`, `webkitAudioContext`, `MediaRecorder`, media `.src` assignment, global `keydown`, `elementsFromPoint`/`elementFromPoint`/`html2canvas`/`foreignObject`/`getComputedStyle(` in sampling/backdrops, `.storybook`/`certification` imports); side-effect rows; L6 tone on/off registration; L8 project `surf:cert-media-sampling`; size and perf rows. 5.1: `Waveform` by additive contract PR to `./media`.

#### Tests (remote for every `*.spec.ts`)

Jest: `src/media/sampling/{sampleOwnedPixels,classifyTone,toneCache,sampleErrors}.test.ts` (white 1.000±0.001, black 0.000±0.001; 100 `timeupdate` + 10 `seeked` → 1 `getImageData`), `src/media/**/useMediaElement{,.throttle,.raf,.session}.test.tsx` (60 `timeupdate`/s → ≤4 renders; 0 frame callbacks paused/hidden/offscreen; "listeners aborted"), `tests/media/useMediaElement.ssr.test.tsx`, `MediaControls.{parts,controlled,shortcuts,a11y}.test.tsx`, `MediaScrubber.test.tsx` (valuetext 0, 92, 3725, NaN), `NowPlayingBar.test.tsx`, `ImageViewer.test.tsx` ("filter then open", "≤3 images", "announces once"), `CarouselRail.test.tsx` (fake timers: prop only → no rotation; prop + gate → rotation), `src/backdrops/{Backdrop,Backdrop.ssr,BackdropTone}.test.tsx` (`getAnimations().length === 0`; MutationObserver sees only the two names), `tests/backdrops/assets.test.ts`, `tests/types/surf/{media,backdrops}.test-d.ts` (`@ts-expect-error` for non-media refs and arbitrary elements), `tests/media/{compat,deprecation-coverage}.test.tsx`, `tests/media/exports/*.test.ts`, `tests/capability/registry/{media-items,media-viewer}.test.tsx`, 5.1 `Waveform.test.tsx`; behaviour suites also under `jest -c tests/media/jest.doubles.cjs`.
Remote: `tests/a11y/apg/surf/{media-controls,image-viewer,carousel-rail}.apg.spec.ts`; `tests/e2e/surf/media/{controls-container,scrubber-drag,target-size,now-playing-container,image-viewer-chrome,blur-budget,sampling-engines}.spec.ts`; `tests/e2e/surf/backdrops/{motion,modes}.spec.ts` (L9); `tests/visual/surf/media/clear-over-media.spec.ts` (MediaControls and NowPlayingBar `clear` over 8 scenes × light/dark × glass/tinted/solid × default/contrast-more/forced-colors/reduced-motion × lightweight/standard/enhanced (Chromium) × 1440/390 × 3 engines, tone on/off); `tests/perf/browser/surf/{media-playback,media-sampling,backdrops-presets}.spec.ts` (4× throttle, `performance.measure('ag:sample')`). GPU/real-device cells may use the gated AWS remote runner.

#### Visual evidence

Remote clear-over-media matrix captures, ImageViewer at 390/1440 (inspector placement), CarouselRail `MediaSlidesClearControls`, every Backdrop preset with glass over it (`GlassOverEachPreset`), as CI artifacts; L14 reviews the clear-over-media scene. Nothing committed.

#### Prohibited

Index list, plus: mock waveforms/transcripts/peaks at runtime (fixtures are generated by scripts from real decoded media), DOM-point sampling or sampling anything the library does not own, lowering or overriding a MAT contrast floor from tone, page-wide key listeners, autoplay or loops without the continuous gate, `background-attachment: fixed`, `mix-blend-mode` on the host, setting `src` on consumer media.

#### Exit criteria

- AC-SURF-18: clear-over-media passes every pixel gate over the full matrix (enhanced only if it certifies by RC-1, D-05) with 0 failures; tone forced on vs off never lowers worst-case contrast.
- AC-SURF-19: `classifyTone` correct for all 8 scene fixtures; a CORS-less image yields no tone and exactly one dev warning in 3 engines; `getImageData` once per source across 30 s of playback with 10 seeks, ≤4 ms at 4× throttle.
- AC-SURF-20: 30 s playback + 3 scrubs — 0 long tasks >50 ms, median ≥55 fps scrub, ≤4 commits/s per MediaControls; static gate 0 for global `keydown`, `Math.random`, `fetch`, `AudioContext`, `elementsFromPoint`, `backdrop-filter`, `!important` in `src/media/**` and `src/backdrops/**`.
- AC-SURF-21: every Backdrop preset at defaults — 0 animations, 0 rAF over 5 s, server render without a DOM, `video` paused with poster; reduced motion → carousel autoplay never starts; `autoplay` without `allowContinuous` does not rotate.
- AC-SURF-22: ImageViewer filter-then-open 10/10, ≤3 images; 0 horizontal overflow at 390 px and correct container states at 320/360/480/600 px for MediaControls and NowPlayingBar.
- W4 rows of AC-SURF-01 (`./media` 7 names, `./backdrops`, `./three` per OI-01), -11, -12, -13, -23 (`{ useMediaElement, MediaControls }` ≤14 KB, `{ ImageViewer }` ≤24 KB, grain assets), -24 (13 adapters, fixtures), -25 (flagships 43, 44), -26 (`media-viewer` and media items), -30 (5.1 `Waveform`, `media-transcript`).
- SURF-396..523 `DONE` or `BLOCKED`; `npm test`, `npm run typecheck` green; merge-SHA pipeline `success`.

#### Final report format

```
PROMPT-4d SURF/W4 REPORT
Branches/PRs   Merge SHAs   GitLab pipelines: <URLs>
contract/three-entry: open | merged; tone calibration artifact: <URL>; TONE_* constants: <values>
Tasks SURF-396..523: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (130..160, 165, 175 and W4 shares)
AC-SURF-18..22 (+ W4 rows of -01/-03/-11/-12/-13/-23/-24/-25/-26/-30): PASS | FAIL | PENDING + artifact
Budgets measured vs rows; files changed; deviations with evidence
```

---

## Work package 4e: PLATFORM GLUE

### PROMPT-4e (SURF lane W5): Platform glue — CI, gates, ledger, labs, migration skeleton, cross-cutting checks

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.4, §4.7, §5.1 (stream-wide), §5.9 (labs), §5.10 (ledger, commerce/workspace blocks), §5.11, §6, §9, §11, §20 row W5, §22. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1 §2.3, §2.4, §3.4, §4.11, §4.13 (GitLab CI), §5, §7.2.
Requirement IDs: REQ-SURF-05, -11, -12 (skeleton), -15 (index), -166..-169, -176..-187, -190, -192, -193, -195, -196 (owned); stream-wide scans for REQ-SURF-01..-14; W5 rows of -170, -188, -194.
Acceptance: AC-SURF-03, -27, -28, -31 (owned); W5 rows of AC-SURF-01, -02, -05, -11, -12, -23, -24, -25, -26, -30.
Tasks: `tasks/SURF.json` lane `W5`, SURF-524..SURF-645. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_15a..15e_EXP_*.md` (EXP-001..100 re-keyed; edits to other PRDs, `.github/workflows/*`, `package.json` scripts and `registry/registry.json` were dropped or converted to GitLab jobs and lane registrations).

#### Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing):

```bash
test -f .gitlab-ci.yml && test -f ci/surf.gitlab-ci.yml && test -f src/contracts/fragments.ts && test -f src/contracts/load-fragments.mjs \
 && test -f contracts/lint-rule-owners.json && test -f eslint-plugin-auraglass.js && test -f src/contracts/testing.ts \
 && grep -q 'CI_JOBS' src/contracts/testing.ts && test -f docs/auraglass-5/archive/v1-19-prd/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md
```

Seams consumed: S-35 (`ENTRIES`, `ROOT_EXPORTS.surf`, export enumeration for the budget), S-36 (`@auraglass/labs`, fallback `aura-glass-labs` per `contracts/packages.json`), S-37, S-38/S-39 (deprecation and codemod schemas), S-40..S-43 (helpers, lanes, scenes, job names `CI_JOBS`, `REQUIRED_JOBS`), S-44/S-45/S-50 (fragment schemas and loader), S-46 (block/item ids), S-47 (lint rule owners: `no-simulation`, `no-network-in-ai` = SURF), S-48 (evidence paths), S-49, S-52 (`api:update`, `test`, `typecheck`), S-53 (root `.gitlab-ci.yml` stages, templates `.ag-node`, `.ag-playwright`, `.ag-gpu`, `.ag-aws-remote`, `AG_SCOPE`/`AG_LINE`), S-54 (labs publish through `plat:publish:npm` with GitLab OIDC `id_tokens` and provenance), S-55 (`SubjectIndex` for story ids). No intra-stream interface is consumed; **you publish I-2** (aggregate skeleton) by applying it in your day-0 PRs, but no lane waits for that — any lane may apply it identically.

#### May touch (lane W5 exclusive)

`ci/surf.gitlab-ci.yml` (skeleton, `.surf-*` templates, `surf:test:ledger`, `surf:test:doubles`; other lanes add their own jobs in their blocks); `scripts/surf/{verify-surf-purity,verify-capability-ledger,verify-labs-admission}.mjs` (framework + W5 rules; W3/W4 own their rule-set blocks); `lint/rules/surf/{no-simulation.cjs,_strict.cjs (W5 section)}`; `tests/lint/surf/{no-simulation,restricted-imports}.test.ts` and `tests/lint/surf/fixtures/**`; `docs/auraglass-5/capability-ledger.json`, `capability-ledger.schema.json`; `tests/capability/**` except `tests/capability/registry/{app-frame,mobile-settings,app-shell-workspace,data-*,support-inbox,analytics-dashboard,audit-log,permissions-matrix,ai-*,media-*}.test.*` (those belong to W1–W4); `packages/labs/**`; `tests/labs/**`; `tests/perf/browser/surf/{registry-blocks,labs-spatial-admission}.spec.ts`; `tests/e2e/surf/{rtl,target-size,focus}.spec.ts`, `tests/e2e/surf/motion/idle.spec.ts`; `tests/types/surf/prop-grammar.test-d.ts`; `tests/rsc/surf/directives.test.ts`; `tests/a11y/manual/scripts/surf/README.md`; `tests/fixtures/consumer-4x/cases/surf/{README.md,ai/**}`; `stories/surf/**`; `apps/docs/content/surf/**` except `ai-prism-routing.md` (W3); `registry/blocks/{commerce-cart,commerce-checkout,pricing}/**`; `registry/items/{presence-stack,comment-thread}/**`; `etc/api/{root.surf,compat.surf}.api.md`; `.changeset/surf-*.md`; `fragments/{a11y-baseline,literals-baseline}/surf.json`.
Shared (own `lane W5` block only): `fragments/{deprecations,lanes,review,side-effects,size-budgets,perf-budgets,css,codemods}/surf.ts`, `src/compat/surf/index.ts`, `src/root/surf.ts` (structure only — W5 adds no names).

#### Must not touch

Other lanes' component, test, block and item paths; the root `.gitlab-ci.yml`, `.github/**` (including the org-managed `mirror-to-gitlab.yml` — OD-8 is the user's decision), `package.json` (no `verify:capability` script: the ledger runs as `node scripts/surf/verify-capability-ledger.mjs` from `surf:test:ledger`), `eslint.config.js`, `eslint-plugin-auraglass.js` (verbatim, registers SURF rules by name), `registry/registry.json`, `scripts/registry/**`, `scripts/release/**`, `packages/cli/**`, other PRDs' files.

#### Steps

1. **Day 0 — CI fragment** (REQ-SURF-195): full `ci/surf.gitlab-ci.yml` per contract §4.13.4 with the I-2 YAML lane blocks: `.surf-base` (extends `.ag-node`), `.surf-playwright` (extends `.ag-playwright`; `mcr.microsoft.com/playwright` from root `AG_PLAYWRIGHT_IMAGE`); `surf:test:ledger` (stage `test`, rules `$AG_LINE == "5x"` and `$AG_SCOPE` in `pr|main|release`, script `node scripts/surf/verify-capability-ledger.mjs && node scripts/surf/verify-capability-ledger.mjs --diff "$(git merge-base HEAD origin/next)"`); `surf:test:doubles` (`parallel:matrix` over the four `tests/<area>/jest.doubles.cjs` presets — a missing preset makes that cell report `pending`, it never fails the job); artifacts `name: "evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA"`, `paths: [.artifacts/surf/]`, `expire_in: 14 days`; `allow_failure: true` until the first green run on `next`. No job runs on `merge_request_event`; no credential variable. `tests/capability/ci-fragment.test.ts` enforces naming, templates, rules, artifact paths, no token-like variables and no `.github/workflows/` path in SURF diffs.
2. **Day 0 — lint and purity** (REQ-SURF-05, -11): `auraglass/no-simulation` (`Math.random` outside event-handler props, timers setting literal progress, `new Blob([` with a string literal, default props holding ≥3 object literals) over every SURF path and `packages/labs/src/**`; `_strict.cjs` W5 section (prop-grammar error for SURF globs, `no-forward-ref`, restricted imports for blocks/labs, `three` only in `src/three/**`); `scripts/surf/verify-surf-purity.mjs` framework (AST walk, file:line output, timer allowlist: ProviderErrorState retry countdown, StreamingText sentence flush, StatusBar.Live and Command announcement debounce) with W3/W4 rule blocks left to those lanes; registered as an L1 `node-script` lane; `tests/capability/purity-gate.test.ts` framework.
3. **Day 0 — skeletons** (REQ-SURF-12, -194): apply I-2 to every aggregate; on `release/4.x` (branch `4x-surf/skeleton`) create the `fragments/deprecations/surf.ts` skeleton with the per-lane id ranges (W5 range DEP-S0800..0999 covers subpaths `./workspace`, `./workflows`, commerce/presence/comment 4.x names: `PricingCard`, `GlassCommentThread`, `GlassSmartShoppingCart` family, `GlassTeamCursors`, all `since: '4.2.0'`); baselines `fragments/{a11y-baseline,literals-baseline}/surf.json` empty.
4. **Capability ledger** (REQ-SURF-179..187): `capability-ledger.schema.json` (JSON Schema 2020-12, dependency-free checker), `capability-ledger.json` with the archived 58 rows X-01..X-58 and 13 rejected X-R01..X-R13 carried verbatim except `owner` ∈ `PLAT|MAT|CMP|SURF|QUAL`; `verify-capability-ledger.mjs` failure modes (missing/array/unknown owner, owner in collaborators, duplicate id, `false` rubric on a non-rejected row, bad evidence line, undefined finding, re-admitted rejected name with `X-Rnn rejected: <reason>`), `--report md`, `--report release-notes --version <v>` (each row with a CI artifact URL), `--diff <base-sha>`; export budget (root ≤160, total ≤250, ≥1 root and ≥4 subpath slots free at GA, promotion needs ≥10 demand links); delivery check on the packed tarball (L2); `reqRefs` resolve in the owning PRD file; no alias exports; roadmap story `stories/surf/capability/CapabilityRoadmap.stories.tsx`.
5. **Labs** (REQ-SURF-166..169): `packages/labs/` workspace (`sideEffects: false`, peers `aura-glass ^5.0.0`, `react`/`react-dom ^19.0.0`, one export per resident + `./package.json`, no `bin`); admission gate (ledger row, `no-simulation` 0, public imports only, side-effect-free Node import, loops pause on `visibilitychange`/offscreen and render a static frame under reduced motion/transparency) as an L1 lane with scopes `pr` and `release` so a red run fails the tag pipeline whose `plat:publish:npm` job publishes labs; spatial admission perf spec on the remote mid-tier profile; promotion rules.
6. **Cross-cutting gates** (REQ-SURF-07, -10, -11, -190, -192, -193): `tests/rsc/surf/directives.test.ts`, `tests/types/surf/prop-grammar.test-d.ts`, remote `tests/e2e/surf/{rtl,target-size,focus}.spec.ts` and `tests/e2e/surf/motion/idle.spec.ts` over every SURF subject from `listSubjects` (subjects not yet merged are simply absent; nothing is hard-coded).
7. **Commerce and workspace blocks (5.1/5.2)** (REQ-SURF-176, -177): `commerce-cart`, `commerce-checkout`, `pricing`, `presence-stack`, `comment-thread` with deterministic fixtures, six story states, `registry-only` test (no commerce/workspace name in the tarball `dist/`), block perf spec (≥50 fps median mid-mobile, 0 long tasks >200 ms).
8. **Migration glue and docs** (REQ-SURF-13, -15, -196): `src/compat/surf/index.ts` structure, `etc/api/{root.surf,compat.surf}.api.md` via `npm run api:update`, `cases/surf/README.md` + `ai/` case, `tests/capability/deliverables.test.ts` (24 flagships × §11.3 deliverables), migration guides `apps/docs/content/surf/migration/{app-shell,data-table,date,charts,ai,media}.md` from the lanes' codemod tables, chart adapter guide, rejected-novelty page, one `.changeset/surf-*.md` per SURF PR.
9. **Blocking flip** (AC-SURF-31): after each SURF job's first green run on `next`, flip `allow_failure: false` in the owning lane's block (W5 flips its own; reminds other lanes in the report). By GA every SURF job is blocking.

#### Tests

Jest (local OK): `tests/capability/{ledger-schema,verify-ledger,delivery,report,export-budget,req-refs,no-alias-exports,no-rejected,rejected-absent,registry-only,no-spatial-core,no-network,purity-gate,contract-tests,ci-fragment,deliverables}.test.ts` with fixtures `tests/capability/fixtures/{dup-owner,missing-evidence,bad-line,rubric-false,unknown-finding,rejected-readd}.json` (each exits 1 naming the row) and "export added without row", "promotion without demand"; `tests/capability/registry/{blocks-lint,commerce-cart,commerce-checkout,pricing,presence-stack,comment-thread}.test.tsx` (schema vendored as `tests/capability/registry/__fixtures__/registry-item.schema.json`, JPY 0 decimals, `de-DE` EUR, same id → same colour, `jest.getTimerCount() === 0`, IME-safe submit); `tests/labs/{package,admission,promotion}.test.ts` with fixtures `tests/labs/fixtures/{math-random,deep-import,side-effect,no-pause}/`; `tests/lint/surf/{no-simulation,restricted-imports}.test.ts`; `tests/rsc/surf/directives.test.ts`; `npm run typecheck` for `prop-grammar.test-d.ts`.
Remote: `tests/e2e/surf/{rtl,target-size,focus}.spec.ts`, `tests/e2e/surf/motion/idle.spec.ts`, `tests/perf/browser/surf/{registry-blocks,labs-spatial-admission}.spec.ts`. GitLab: `contract:ci-fragments` green on every W5 push.

#### Visual evidence

Remote captures of the `CapabilityRoadmap` story and every commerce/presence/comment block at 390/768/1024/1440/1920 × 8 scenes as CI artifacts; L14 items in the W5 block of `fragments/review/surf.ts`. Nothing committed.

#### Prohibited

Index list, plus: any `.github/workflows/*` file or edit; a credential in any CI variable or file; `CI_MERGE_REQUEST_*` logic (the mirror has no MRs); editing another stream's PRD, script or registry index; ledger rows dropped silently (undelivered rows become `deferred` with a 5.1 slot by owner decision); lowering export budgets or admission thresholds; publishing labs from anywhere but PLAT's GitLab tag job.

#### Exit criteria

- AC-SURF-03: `verify-surf-purity.mjs`, `no-simulation`, `no-network-in-ai` report 0 violations; side-effect gate 0 for every SURF entry; 0 `@ag-contract-seed` markers in SURF `src/**` (G-02).
- AC-SURF-27: ledger has 58 + 13 rows; `node scripts/surf/verify-capability-ledger.mjs` exits 0 on `next`; each of the 6 negative fixtures exits 1 naming the row; at `5.0.0-rc.1` every 5.0 P0/P1 row `delivered`; at GA root ≤160, total ≤250, ledger = manifest, ≥1 root and ≥4 subpath slots free; 0 REQ-SURF-185 alias names exported.
- AC-SURF-28: `packages/labs` matches REQ-SURF-166; admission gate exits 1 on each of 4 negative fixtures and 0 on the real package; no labs version publishes from a tag pipeline whose admission lane is not `pass`.
- AC-SURF-31: `ci/surf.gitlab-ci.yml` passes `contract:ci-fragments`; every SURF job `allow_failure: false` by GA; no SURF commit adds a file under `.github/workflows/` (G-16).
- W5 rows of AC-SURF-01 (root SURF report), -02, -05 (idle), -11 (RTL), -12 (targets/focus), -23 (block bytes), -24 (deprecation skeleton shipped on `release/4.x`, cases index), -25 (deliverables check), -26 (commerce/workspace blocks, blocks-lint), -30 (5.1/5.2 blocks).
- SURF-524..645 `DONE` or `BLOCKED`; `npm test`, `npm run typecheck` green; merge-SHA pipeline `success`.

#### Final report format

```
PROMPT-4e SURF/W5 REPORT
Branches/PRs (next-surf/w5-*, 4x-surf/*)   Merge SHAs   GitLab pipelines: <URLs>
CI fragment: contract:ci-fragments <pass/fail>; SURF jobs and allow_failure state: <job: true|false>
Tasks SURF-524..645: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending   (05, 11, 12, 15, 166..169, 176..187, 190, 192, 193, 195, 196 and W5 shares)
AC-SURF-03/-27/-28/-31 (+ W5 rows): PASS | FAIL | PENDING + artifact
Ledger: rows, delivered/planned/deferred counts, export budget numbers (root, total)
OD-8 (mirror Action → GitLab pull mirroring): recorded for the owner, untouched
Files changed; deviations with evidence
```

