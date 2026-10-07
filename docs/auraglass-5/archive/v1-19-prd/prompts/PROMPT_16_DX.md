# PROMPT-16 (DX): CLI, codemods, registry, docs app, agent DX — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key **DX**, program self-id PRD-16 is an alias only; REQ-DX-01..91, AC-DX-01..22, DoD 1–8, open items §21 OI-DX-01..10). It implements the architecture §16 boundaries **PRD-18** (CLI, codemods, registry, compat adapters) and **PRD-20** (docs app, generated migration guide, selector tables, `llms.txt`, MCP, generated claims), so sibling PRDs that say "PRD-18"/"PRD-20" mean this work. Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-14, D-17, D-18, D-22, D-23, D-27, D-32; §3.1, §4.4, §5.4–5.5, §10, §11.2, §14.1–14.6, §15.2–15.3, §16). Task fragment: `docs/auraglass-5/tasks/DX.json` (DX-001..DX-150). Binding cross-PRD contracts: `docs/auraglass-5/prd/_shared-contracts.md` (the registry wins over any PRD or prompt text; DX must fix SC-02, SC-24, SC-32, SC-38, SC-40).

The PRD has 91 requirements over five products (CLI, codemod engine, registry, docs app, agent DX) and four release stops (4.2, 4.3, 5.0 alpha/beta/RC, GA). One agent session can't hold all of it, so it is split into seven prompts. Each one runs on its own: it restates the common rules, names its REQ/AC IDs and file scope, and lists the prerequisite checks it must run before it edits anything.

| Prompt | Scope | REQ-DX | AC-DX | Tasks | Branch | Hard prerequisites |
|---|---|---|---|---|---|---|
| `PROMPT_16a_DX_CLI_CORE.md` | `packages/cli` scaffold, meta constants, allowlist, router/flags/exit codes, fs-safety, git-guard, dry-run/report, project detection, config, registry client, list/info, ported audit + legacy migrate, coverage, `cli.yml`, scope decision, `paths.mjs`, 5.0 `package.json` bin removal, legacy script deletion | 01–10, 26, 28, 84 (constant), 03 | 01 (pre-publish), 02, 03 (path half) | DX-001..DX-022, DX-149 | `main` | PKG-008 `tsdown.config.ts`, PKG-057 `scripts/ci/verify-deps.mjs`, PKG-056 allowlist |
| `PROMPT_16b_DX_INIT_ADD_DOCTOR.md` | `init` (Next, Vite, install, shadcn), `add`, header hash, `"use client"`/alias, `diff`, `update`, eject, `doctor` (+ shadcn, `--v5`), `audit backdrop` (unit + remote) | 11–25, 27, 52 (test half) | 02, 03, 04 (inputs), 10 (input) | DX-023..DX-040, DX-150 | `main`; DX-150 on `release/4.x` for 4.2 | 16a merged; DS-016/DS-090 `styles.css`/`tailwind.css`; A11Y-029/032/034 provider, script, `auraGlassPrepaintScript`; TRUST-075 + REL-010 root `deprecations.json`; REL-115 consumer-4x; QA-018 remote config |
| `PROMPT_16c_DX_CODEMODS_COMPAT.md` | `migrate 4to5` runner, catalogue machine copy, mapping generation, 8 core transforms + fixtures, meta-tests, canary, recipes-4x, perf, AuraOne consumer report, `aura-glass/compat` adapters | 29–42 | 03 (5/5), 05, 06 | DX-041..DX-066 | `main` | 16a + 16b merged; REL-070 `gen-deprecations.mjs`, REL-106 §11.2 catalogue (SC-33), REL-115 consumer-4x, REL-072 `warnDeprecated`; flagship `.meta.ts` `migration` tables CTL-057, OVL-131, NAV-095, DATA-108, AI-075, MED-155 (4.3 code freeze); area transforms AI-115, NAV-145, MOT-001, MOT-090 |
| `PROMPT_16d_DX_REGISTRY.md` | registry index, base, lint, 10 blocks, D-17 + AI items, render gate, build, certification SHA, `@auraglass/registry`, recipe fates + 4.2 entries, block stories, `registry.yml`, legacy gate deletion | 43–53 | 07, 08, 09, 10, 11 | DX-067..DX-100 | `main` (DX-096 on `release/4.x`) | 16b merged; block content per SC-32 (NAV-106, AI-107/108, DATA-133, MED-153, OVL-164, OVL-143); QA-018/QA-039 pixel gates + 8 scenes; DS-090 shadcn interchange vars; SB-048 preview; NAV-136 recipes removal |
| `PROMPT_16e_DX_DOCS_APP.md` | `apps/docs` (tarball-only), IA, components, generated pages, selector tables, snippet/import/link gates, redirects, 4.x docs deletion, migrate-from pages, generated migration guide, a11y + Lighthouse lanes, `docs.yml` | 69–76, 81–83, 72 | 14, 15, 16, 18, 21, 22 (IA) | DX-101..DX-118 | `main` | 16c fixtures; TRUST-002 npm-pack + PKG-009 build, PKG-005 exports manifest; FND-005 parts/meta registry; REL-070 `--docs` output, REL-100 `breaking-changes.json`; FND-142 4.x docs deletion (SC-38) |
| `PROMPT_16f_DX_QUICKSTART_TYPES_GUIDES.md` | quickstarts, alpha-smoke target, timed quickstart lane, README quickstart generation, 10 guides, autocomplete/completions/TSDoc tests | 54–68 | 04, 12, 13, 22 | DX-119..DX-133 | `main` | 16b + 16d (base + `app-frame`) + 16e (`compile-snippets`, docs components) merged |
| `PROMPT_16g_DX_CLAIMS_AGENT_RELEASE.md` | claims pipeline, claim ids/artifacts, `lint-claims`, README template, INSTALLATION removal, `/docs/ai-agents`, `llms.txt`/`llms-full.txt`, per-component md, `@auraglass/mcp`, publish workflow, 4.3 CLI beta, release blocker, published-quickstart check | 77–80, 85–91 | 01, 17, 19, 20 | DX-134..DX-148 | `main` (DX-140 4.2 run on `release/4.x`) | 16e + 16f merged; QA-091 `claims.json`; PERF-042 `perf-grades.json`; TRUST-077/TRUST-079 `publish-npm.yml` + guard (SC-05, owner REL) |

Order: 16a → 16b → 16c → 16d → 16e → 16f → 16g. Some work can overlap. 16c's transforms that need only 4.2-known mappings (`imports-subpaths`, `dead-optical-props`, `providers`, `deps`) can start once 16a is merged and PRD-01's generator exists. 16e can be scaffolded (DX-101..DX-103, DX-107..DX-109) in parallel with 16d. 16f's quickstarts can't reach GA acceptance until 16d's `app-frame` is certified; before that they run on `alpha-smoke` (DX-121).

## Numbering crosswalk (binding for every sub-prompt)

Use the SC-01 task keys. `depends_on` holds only real task ids (`^(TRUST|REL|…|QA)-\d{3}$`) pointing at the owner's anchor task (SC-40); never a `PRD-xx` string. External gates go in the task's `gate` field.

| Key | File | Architecture §16 |
|---|---|---|
| TRUST / REL / PKG / DS / MAT / A11Y / MOT | `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` / `…_RELEASE_MIGRATION_…` / `…_PACKAGING_BUILD_…` / `…_DESIGN_SYSTEM_…` / `…_MATERIAL_ENGINE_…` / `…_ACCESSIBILITY_…` / `…_MOTION_…` | PRD-00 … PRD-06 |
| FND | `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` | PRD-07 + PRD-14 + PRD-16 (removal) |
| CTL / OVL / NAV / DATA / AI / MED | `…_FLAGSHIP_CONTROLS_…` / `…_FLAGSHIP_OVERLAYS_…` / `…_APP_SHELL_NAVIGATION_…` / `…_DATA_…` / `…_AI_…` / `…_MEDIA_BACKDROPS_…` | PRD-08 … PRD-13 |
| PERF / EXP | `…_PERFORMANCE_…` / `…_COMPONENT_EXPANSION_…` | none (EXP is interim owner of PRD-21) |
| SB / QA | `…_STORYBOOK_SHOWCASE_…` / `…_QA_CERTIFICATION_…` | PRD-19 (Storybook/Lab half / certification) |
| REL (interim) | no file | PRD-17 bridge 4.2/4.3 (SC-37): REL holds scope and gates; DX builds `doctor --v5` (DX-037, DX-150); REL-114 prints the moved notice |

Older DX.json text used program self-ids (`PRD-18` = QA, `PRD-17` = SB, `PRD-08` = FND). They have been rewritten to keys and anchor tasks.

## Deviations found while decomposing (with evidence; sub-prompts honour them)

1. **Dirty-tree refusal is new, not kept** (PRD E-04, §11.5): `rg "dirty|git status" bin/aura-glass.cjs` = 0. DX-007 builds it.
2. **`verify-deps` file name.** The PRD says `scripts/ci/verify-deps`. PRD-02 names it `scripts/ci/verify-deps.mjs` (`AURAGLASS_PACKAGING_BUILD_PRD.md:158,231`). Use the `.mjs` path.
3. **Flagship-subset file name (resolved, SC-08).** It is `tests/fixtures/consumer-4x/flagship-subset.json` (REL §11.4, REL-115). `scripts/docs/paths.mjs` `CONSUMER_4X_FLAGSHIP_SUBSET` names that one path (DX-019). If REL's prompt still creates `FLAGSHIP_SUBSET.json`, report that to REL; it is not a DX fallback.
4. **Claim-region renderer.** The PRD assigns `packages/qa/src/claims/render.ts` to the QA PRD, but the QA PRD defines only `packages/qa/src/claims/build.ts` (`rg -n "render\.ts|ag:claim" prd/AURAGLASS_QA_CERTIFICATION_PRD.md` = 0). DX-134 depends on QA-091, reports the gap and does not write README values itself.
5. **`audit backdrop` endpoint.** The QA PRD has no remote capture endpoint for the CLI (`rg -n "AURAGLASS_AUDIT_ENDPOINT|audit backdrop" prd/AURAGLASS_QA_CERTIFICATION_PRD.md` = 0). DX-039 stays BLOCKED until one exists (PRD §21 OI-DX-04, owner QA). A mocked pass doesn't count.
6. **`.meta.ts` schema owner.** The PRD cites `src/internal/meta.schema.ts` (PRD-07 → program PRD-08), but no other PRD specifies it (`rg -l "meta\.schema\.ts" prd` = DX PRD only). DX-104 depends on FND-005 (`src/foundation/parts.ts`, SC-27 parts and typed metadata) and is blocked until it lands.
7. **Test runner.** The repo runs Jest (`package.json:269`, `jest ^29.6.0`), and Vitest isn't installed (`rg '"vitest"' package.json` = 0). PRD §12 specifies Vitest, so Vitest is added exact-pinned for `packages/cli` and `tests/dx` only (DX-016). Root Jest stays unchanged.
8. **`packages/registry/`** is a directory chosen here (DX-093). The PRD names only the package.
9. **Docs hosting.** There is no `vercel.json`/`.vercel` in the repo. `docs.yml` (DX-118) reports a missing Vercel project link as an operator blocker and doesn't create credentials.
10. **CI choice.** `gh repo view auraoneai/auraglass --json visibility` = `PUBLIC`, so per `ci-selection.md` heavy lanes use the repo's GitHub Actions hosted runners. Never expose cloud credentials to PR code.
11. **Shared contracts applied (2026-10-06).** Root `deprecations.json` (SC-02); SC-24 prop grammar (`variant` = `regular|clear|identity`, `intent` for status, no `material` prop; needs human confirmation, OI-DX-01); registry `registry/{base,blocks,items}/<id>/` with area-owned block content (SC-32); `ai-eval-dashboard` is an item; 4.x docs deletion belongs to FND-142 and DX-111 only verifies it (SC-38); `src/registry/recipes.ts` removal belongs to NAV-136; codemod ids per SC-33, including `app-shell-slots` and `media-backdrops`.

## Common rules (each sub-prompt restates them in full)

- Remote-first. Browser, visual, axe, Lighthouse, perf and timing work, scaffold-and-build lanes (`next build`, `vite build`, verdaccio), Storybook builds and the full `npm run build` all run remotely, in GitHub Actions on `auraoneai/auraglass` or on an ephemeral EC2 runner via the `auraone-remote-run` skill. Never use local Docker. Never launch a local Playwright browser. Only node-only unit tests may run locally.
- Don't fake completion. That means no mock, stub or placeholder implementations, no `test.skip`/`.only`/`xit`/`describe.skip`/`it.todo`, no lowered thresholds, no `-u`/`--updateSnapshot`/`--update-baselines` to get to green, no hand-edited generated files, and no allowlisting your own violations. Expected-output fixtures come from running the real tool, then a human-style line review.
- A missing prerequisite owned by another PRD means that task is BLOCKED: report the path or symbol and its owner, and don't build it yourself.
- Evidence is CI artifacts keyed to the SHA (D-32), never committed PNGs.

Final report: each sub-prompt defines its own. The orchestrator merges them into one AC-DX-01..22 table with CI artifact links and a DoD 1–8 checklist.
