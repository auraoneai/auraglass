# Completeness review: AuraGlass 5.0 planning set

Date: 2026-10-06. Scope: every file under `docs/auraglass-5/`, checked against the program brief (deliverables A–L plus the cross-cutting requirements). Checks were run with node scripts over the files. They were not judged by eye. Repo source was read only to resolve paths and was not modified.

## 1. Deliverables A–L

| Letter | Required | Where | Verdict |
|---|---|---|---|
| A | Executive assessment | `AURAGLASS_CURRENT_STATE_AUTOPSY.md` §A1 | Present, substantive |
| B | Scorecard | autopsy §A2; master PRD §2.1 | Present |
| C | Competitive gap analysis | `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`, `research/` | Present |
| D | Technical autopsy | autopsy §B1–B4 and §D; 14 subsystem reports plus runtime reports in `autopsy/` | Present |
| E | Component inventory and disposition | `component-inventory.{json,csv}` (496 components plus 4 notes), `prd/appendix/component-dispositions.md` | Present |
| F | Missing-capability map | `AURAGLASS_MISSING_CAPABILITY_MAP.md`; EXP capability ledger | Present |
| G | Target architecture | `AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-01..D-32, §16), `architecture/` proposals | Present |
| H | PRD suite, 20 sections each | 19 PRDs in `prd/` | Present. All 19 have §1–§20 (plus §21 open items). The thinnest section has 76 words (PKG §14 Responsive), so no section is a stub |
| I | Agent execution prompts | 149 files (19 index prompts, 130 sub-prompts) | Present; see §3 |
| J | File-level task ledger | `AURAGLASS_5_IMPLEMENTATION_TASKLIST.{md,csv}` from `tasks/*.json` | Present: 2,405 tasks, 0 validation problems |
| K | Migration strategy | `prd/AURAGLASS_RELEASE_MIGRATION_PRD.md`; master PRD §8 | Present |
| L | Certification plan | `prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (L1–L14); master PRD §9 | Present |

Each cross-cutting requirement has an owner:

- Motion as a first-class concern: MOT PRD.
- Accessibility with glass: A11Y PRD, covering rungs, OS floors and the contrast matrix.
- Performance tiers: PERF PRD and D-04/D-05/D-10.
- SSR/RSC: PKG PRD and canaries.
- DX: DX PRD.
- Flagship tier of 30–60 components: 44 flagships (architecture §11.2) with the §11.3 deliverables.
- Showcases: SB PRD, with 6 certified S1 scenes and 4 S2 scenes (music player, spatial control center, ecommerce, analytics).
- QA gates, mechanical vs human: L1–L12 are mechanical and L13/L14 are human (master PRD §11.2).
- Backwards-compatibility classes: D-27 and master PRD §7.1.
- "Don't chase component count": master PRD §10.
- Visual quality bar and anti-patterns: master PRD §11.

## 2. Task fragments (`tasks/*.json`)

- All 19 fragments parse, and every task has all 12 required fields with no empty values.
- Ids are unique and every `depends_on` resolves. `tools/build-tasklist.mjs` reports 0 problems.
- **Fixed: paths that tasks modified but no task created.** For each one, the creating task already described the file, but its `file` field did not list it:
  - `certification/lanes.config.ts` → QA-029
  - `scripts/ci/a11y-baselines/focus-outline-none.json` → A11Y-010
  - `packages/cli/src/core/package-manager.ts` and `config.ts` → DX-009
  - `packages/cli/src/registry/{resolve,hash}.ts` → DX-011
  - `packages/cli/src/registry/install.ts` → DX-027
  - `src/date/date.css` → DATA-032
  - `src/date/index.ts` → DATA-023
- **Fixed: typo in MAT-086.** It created `Material Lab.stories.tsx` (with a space), but MAT-088 and the PRD use `Material.Lab.stories.tsx`.
- **Fixed: `scripts/ci/verify-flagship-deliverables.mjs` had no creating task.** This was open as AI PRD §21 item 7 and OI-MED-07. I added **QA-127** (CREATE the script plus `certification/flagship-deliverables.json`; it depends on QA-029).
  - AI-092, MED-156 and QA-101 now depend on QA-127.
  - QA PRD REQ-QA-80 item 4 names the gate.
  - The AI and MED open items are closed, and the master PRD §12.3 AI row is updated.
  - `PROMPT_18h` carries the task. QA-127 runs ahead of 18h's wave 5, because wave-4 work depends on it.
- I regenerated the ledger. The master PRD §5.2 totals were stale (2,360 tasks and "13 validation problems"), and README showed 2,360 tasks and QA at 126. Both now read 2,405 tasks with QA at 127.
- **Not fixed, by design:** 42 remaining path hits are not real gaps:
  - Parser artefacts: brace or glob patterns, and `NEW: ` written with a space.
  - TEST tasks that author new test files without a `NEW:` prefix.
  - Branch names such as `release/4.x`.
  - `src/internal/deprecations.generated.ts`, which is generator output from REL-070.

## 3. Prompts

- **Content check of all 130 sub-prompts.** Every sub-prompt must name its source PRD, files (may touch / must not touch), prerequisites, steps, tests, visual evidence, an integrity / no-fake-completion rule, exit criteria and a final report.
- **Ten sampled in full.** Ten prompts were read fully: 00a, 01c, 04d, 05c, 07c, 07e, 08g, 09c, 11h and 15a. All of them prohibit fake completion: no `.skip` or `-u`, no hand-typed numbers, and the agent may not mark a human review done.
- Four prompts keep their test commands inside the Steps section instead of a separate heading: 01f, 04d, 08g and 11h. They are acceptable as written.
- **Fixed in `PROMPT_07e`:** it had no Prerequisites, Tests or Visual-evidence sections. I added them. The cited paths were checked against PERF/PKG tasks, for example `tests/perf/harness/budgets-frozen.test.ts`.
- **Fixed in `PROMPT_15a`:** it did not state its visual evidence. It now states "none (no UI)".
- **Referenced paths.** 4,867 path-like references were checked. Each one exists in the repo or the docs, is marked NEW or generated, or is created by a task. The 429 unresolved hits were spot-checked. They are:
  - lint rule ids (`auraglass/*`), story titles and branch names
  - relative fragments (`compat/tokens.css`)
  - deliberate negative references, such as "never `docs/deprecations.json`", "no `build/budgets.lock.json`" and "no `a11y-lanes.yml`"
  - test files the prompt itself authors

  No wrong live path was found.
- The 19 index prompts are indexes. They carry common rules and the sub-prompt table, not per-step sections. That is intended.

## 4. Links

- 293 relative Markdown links across all `.md` files (excluding the generated ledger) resolve, including the `#53-prompt-index-execution-order` anchor.
- The only "failures" are regex alternations inside code spans, such as `framer-motion|motion`.
- README and the master PRD link only to real files.

## 5. Other edits

- **README deliverable letters now follow the brief.** The old table used different letters: B was the technical autopsy, D was the debt register, I was the ledger, J was the prompts, and E, G, H, I and J were marked "inferred". The autopsy header was relabelled to match: A = §A1, B = §A2, D = §B1–B4 and §D.
- **AI PRD heading normalised:** `## 21 Open items` became `## 21. Open items`.

## 6. Remaining gaps (not fixable in documents)

1. **No visual verification.** No screenshot was viewed during planning (README, master PRD §11). The visual quality bar is specified and gated, but nobody has checked it against rendered output. It closes only at L14 human review at RC-1.
2. **Showcases: six certified, four reduced.** Only the six S1 showcases are GA-blocking. The four S2 showcases are snapshot-gated at a reduced matrix. This is a scope trade-off recorded in SB PRD header item 2, and the owner should confirm it.
3. **Owner decisions are still open:** master PRD §12.1, and each PRD's §21 (for example OI-QA-02/04/05/07 and SC-24 Button `variant`). These are outside the agent perimeter.
4. **The task-graph validator is not yet in CI.** `scripts/release/verify-task-graph.mjs` (REL-140) does not exist yet. Until it does, the graph is validated only by `tools/build-tasklist.mjs`.
5. **TEST tasks lack `NEW:` prefixes.** Some TEST tasks author new test files without the `NEW:` prefix, for example DX-034, DX-040, DX-066, DX-106, DX-147 and DATA-068. It is a convention inconsistency only, and was left to avoid churn across many fragments.
