# PROMPT-4 (SURF): Product Surfaces — stream index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` (PRD-4, key **SURF**; REQ-SURF-01..196, AC-SURF-01..31, open items OI-01..OI-15). Binding contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` stay valid. Task fragment: `docs/auraglass-5/tasks/SURF.json` (SURF-001..SURF-645, field `lane`).

SURF ships flagships 14 and 22–44: `./app-shell`, root navigation (`Tabs`, `TabBar`, `Breadcrumbs`, `Pagination`, `Command`, `CommandPalette`, `SourceTransition`, `Timeline`, `ActivityFeed`), `./data`, `./date`, `./ai`, `./media`, `./backdrops`, `./three` (empty at 5.0), 5.1 `./charts`, `@auraglass/labs`, the SURF registry blocks/items and the capability ledger. It is split into **five internal lanes that start on day 0 and run at the same time**. No lane waits for another lane, and the stream waits for no other PRD.

## Lane table

| Prompt | Lane | Scope | REQ-SURF | AC-SURF (primary) | Tasks |
|---|---|---|---|---|---|
| `PROMPT_4a_SURF_SHELL_NAV.md` | W1 Shell & navigation | `./app-shell` (AppShell, Sidebar + SidebarDrawer, TopBar, StatusBar, Inspector, MobileShell, ResizablePanels), root Tabs, TabBar, Breadcrumbs, Pagination, Command/CommandPalette, SourceTransition; `app-frame`, `mobile-settings`, `app-shell-workspace` | 16..65 (+ W1 share of 01..15, 170, 171, 188..196) | 04, 06, 07, 08, 09, 29 (+ W1 rows of 01, 05, 11, 12, 13, 23, 24, 25, 26) | SURF-001..133 |
| `PROMPT_4b_SURF_DATA_DATE.md` | W2 Data & date | `./data` (Table, internal VirtualList, TreeView, FilterBar, Chip, KeyValueEditor, StatCard, Sparkline, ChartFrame), root Timeline/ActivityFeed, `./date`, 5.1 `./charts`; data blocks/items | 66..105, 161..164, 174, 178 (+ W2 share) | 10, 14, 30 (+ W2 rows of 01, 02, 11, 12, 13, 23, 24, 25, 26) | SURF-134..275 |
| `PROMPT_4c_SURF_AI.md` | W3 AI | `./ai` (types, Thread, Message, StreamingText, Composer, ToolCall, Reasoning, AgentSteps, SourceList, Citation, UsageMeter, ProviderErrorState), AI SDK interim harness, `ai-workspace` (Kiro Prism route), `ai-*` items | 106..129, 172, 173 (+ W3 share) | 15, 16, 17 (+ W3 rows of 01, 03, 11, 12, 23, 24, 25, 26) | SURF-276..395 |
| `PROMPT_4d_SURF_MEDIA_BACKDROPS.md` | W4 Media & backdrops | `./media` (useMediaElement, MediaControls, MediaScrubber, NowPlayingBar, ImageViewer, CarouselRail, owned-pixel sampling, 5.1 Waveform), `./backdrops`, `./three`; media blocks/items | 130..160, 165, 175 (+ W4 share) | 18, 19, 20, 21, 22 (+ W4 rows of 01, 11, 12, 13, 23, 24, 25, 26) | SURF-396..523 |
| `PROMPT_4e_SURF_PLATFORM_GLUE.md` | W5 Platform glue | CI fragment, purity gate, lint rules, capability ledger + gates, labs package + admission, deprecation skeleton on `release/4.x`, 4.x cases index, cross-cutting gates (prop grammar, directives, RTL, targets, focus, idle), commerce/presence/comment blocks, docs, API reports for root/compat | 01..15 (stream-wide), 166..170, 176..187, 190, 192..196 | 02, 03, 27, 28, 31 (+ W5 rows of 05, 11, 12, 24, 25, 26) | SURF-524..645 |

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
