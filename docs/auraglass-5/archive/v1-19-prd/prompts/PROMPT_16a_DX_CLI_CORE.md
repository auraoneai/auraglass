# PROMPT-16a (DX): CLI core: package, safety, contract, ported commands

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key DX; alias PRD-16; contracts in `prd/_shared-contracts.md`, especially SC-02, SC-11, SC-14 and SC-40). Requirements: REQ-DX-01, -02, -03, -04, -05, -06, -07, -08, -09, -10, -26, -28, and the `MOVED_NOTICE` constant of REQ-DX-84. Acceptance: AC-DX-01 (pre-publish half), AC-DX-02, AC-DX-03 (path-escape half; the dirty-tree half completes in 16b/16c). Tasks: `docs/auraglass-5/tasks/DX.json` DX-001..DX-022 and DX-149. Architecture: D-22 (no `bin` in `aura-glass@5`), D-23 (scope fallback), §3.1, §14.2. Index and numbering crosswalk: `docs/auraglass-5/prompts/PROMPT_16_DX.md`.

## 0. Common rules (binding)

- Remote-first. You may run locally: `npx vitest run` inside `packages/cli` and over `tests/dx/*.test.ts` (node-only), `tsc --noEmit` on `packages/cli`, and `node bin/aura-glass.cjs …` to capture 4.1.0 baselines. Run remotely, in GitHub Actions on `auraoneai/auraglass` (public repo, hosted runners per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or on an ephemeral EC2 runner via the `auraone-remote-run` skill: `perf.test.ts` timing, the install-size check in `deps.test.ts`, `npm pack` of the root package, and the full `npm run build`. Never use local Docker. Never launch a local browser.
- Don't fake completion. That means no stub command that prints "not implemented", no mock or placeholder implementation, no `test.skip`/`.only`/`xit`/`describe.skip`/`it.todo`, no lowered coverage or timing thresholds, no `-u`/`--updateSnapshot`, no hand-written "expected" output. The 4.1.0 baselines (DX-013, DX-014) must be captured by running the real `bin/aura-glass.cjs`. Say so in the PR, along with the command.
- Use `git status --porcelain` checks only through `git-guard`. Never run destructive git commands in the repo.
- A missing prerequisite owned by another PRD means that task is BLOCKED: report the exact path and the owner, and don't create a substitute.
- Evidence is CI artifacts (D-32). Don't commit reports.

## 1. Prerequisites (verify first; on failure, stop the affected tasks and report)

1. `rg -n "const ensureInsideCwd" bin/aura-glass.cjs` shows `:295`. `rg -n "report-only-write-requested" bin/aura-glass.cjs` shows `:605`. `rg -n "3.2 target" bin/aura-glass.cjs` shows `:911`. If the line numbers moved, re-anchor on the symbol and note the new lines.
2. The PKG toolchain (PKG-008 tsdown, PKG-057 verify-deps, PKG-056 allowlist): `rg --files | rg "tsdown.config|scripts/ci/verify-deps.mjs"`. If `verify-deps.mjs` is missing, DX-003's CI wiring is BLOCKED on PKG-057, but `deps.test.ts` is still written and must pass.
3. `rg --files packages apps registry 2>/dev/null` is empty (nothing to collide with). If `packages/` already exists (for example `packages/qa` from the QA PRD), keep it and add `packages/cli` beside it. Don't restructure.
4. Scope check for D-23 (read-only): `npm view @auraglass/cli name` and `npm view aura-glass-cli name`. Record both results. Don't log in and don't create tokens.
5. DX-021, DX-022 and DX-149 only: the branch is `main` at or after the `5.0.0-beta.1` cut, and NAV-136 (the `src/registry` removal) is merged or open. DX-149 is the only remover of `bin/aura-glass.cjs` on `main` (PRD §21 OI-DX-08). Otherwise mark all three "deferred to beta.1" and leave them undone.

## 2. File scope

May create: `packages/cli/{package.json,tsconfig.json,tsdown.config.ts,vitest.config.ts,dependency-allowlist.json,PUBLISHING.md,README.md}`, `packages/cli/src/{bin.ts,meta.ts}`, `packages/cli/src/core/{fs-safety,git-guard,report,project-detect,package-manager,config}.ts`, `packages/cli/src/registry/{fetch,resolve,hash}.ts`, `packages/cli/src/commands/{list,info,audit,migrate}.ts`, `packages/cli/src/migrate/legacy/{icons-from-lucide,radix-report,mui-report}.ts`, `packages/cli/schema/{config.json,output/*.json}`, `packages/cli/test/**`, `.github/workflows/cli.yml`, `scripts/docs/paths.mjs`, `tests/dx/{vitest.config.ts,no-bin.test.ts,paths.test.ts}`, `package-lock.json` (workspace entry only).
May modify (5.0.0-beta.1 only): root `package.json` (`bin`, `files`, `scripts` lines named in DX-021, plus a `workspaces` entry `packages/*` if PRD-02 hasn't added one). May delete (beta.1 only): the DX-022 list and, on `main` only, `bin/aura-glass.cjs` (DX-149).
Must not touch: `bin/aura-glass.cjs` on `release/4.x` (the moved notice is REL-114; `doctor --v5` is DX-150 in 16b), `src/**`, `registry/**`, `apps/**`, other PRDs' scripts (`scripts/release/**`, `scripts/build/**`), the repo-root `deprecations.json` (SC-02; TRUST/REL), `docs/auraglass-5/**`.

## 3. Steps

1. **DX-001, DX-002.** Create the package. `meta.ts` exports `PACKAGE_NAME`, `MCP_PACKAGE_NAME`, `REGISTRY_PACKAGE_NAME`, `VERSION` and `MOVED_NOTICE = \`aura-glass CLI moved: use npx ${PACKAGE_NAME} <command>\``. Pick the scope from prerequisite 4. If `@auraglass` ownership can't be verified, use the `aura-glass-cli`/`aura-glass-mcp`/`aura-glass-registry` names (D-23). `bin` is `auraglass` only.
2. **DX-003.** Allowlist plus exact pins: `jscodeshift`, `postcss`, `postcss-value-parser`, `zod`, `picocolors`, `prompts`. Choose current stable versions, write them without `^`/`~`, and record each version in the PR.
3. **DX-004, DX-005.** Write the router with global flags and exit codes 0/1/2/3/4. Write a JSON Schema per command under `schema/output/`. Colour rules: no ANSI when `!isTTY` or `NO_COLOR`, and status words are always printed.
4. **DX-006.** Copy `ensureInsideCwd` from `bin/aura-glass.cjs:295-300` with identical semantics, then extend it with `realpathSync` on both sides (nearest existing ancestor for not-yet-created targets). Writes are staged, then `tmp` + `renameSync`. Use the exact refusal message from REQ-DX-05.
5. **DX-007.** `git-guard` with `--allow-dirty`/`--allow-no-git`. Tests create real temporary repos in `os.tmpdir()` and clean up after themselves.
6. **DX-008.** The report and `--dry-run` (unified diff text, or JSON `changes[]` with sha256 before/after).
7. **DX-009.** Project detection, the package-manager argv table, and the `auraglass.json` zod schema plus `schema/config.json`.
8. **DX-010.** `--version`. Don't port the stale `3.2 target` string or the unused `spawnSync` import.
9. **DX-011, DX-012.** The registry client plus `list`/`info` reading a registry index. `packages/cli/test/fixtures/registry/` holds a small real index with 2 items, `registry.json` + `<name>.json`, written in the shadcn v4 shape. The tests serve it with `node:http` on port 0.
10. **DX-013.** Capture the 4.1.0 `audit deps --json` and `audit imports --json` outputs from the real binary against `packages/cli/test/fixtures/projects/legacy-audit/` into `expected-4.1.0/`, then port the logic. Only `cliVersion` may differ.
11. **DX-014.** Port `migrate icons --from lucide`, and the radix/mui report-only paths. `--write` on radix or mui exits 2 with `report-only; no automated migration`.
12. **DX-015..DX-017.** `perf.test.ts` (p95 ≤300 ms over 20 runs, runner class recorded), `vitest.config.ts` with coverage lines ≥90, `tests/dx/vitest.config.ts`, and `cli.yml` (Node 20.19.x + 22.x matrix, artifacts: coverage, perf JSON, pack size).
13. **DX-018.** `PUBLISHING.md`: the scope evidence, plus the trusted-publisher binding to request (package, `auraoneai/auraglass`, `.github/workflows/publish-npm.yml`). Don't publish anything.
14. **DX-019.** `scripts/docs/paths.mjs` constants (SC-02 `DEPRECATIONS_PATH = deprecations.json`, SC-08 `tests/fixtures/consumer-4x/flagship-subset.json`, SC-04 `API_DIR = etc/api`). `tests/dx/paths.test.ts` fails and names the owner of each missing path; it never skips.
15. **DX-020..DX-022 (beta.1).** Edit root `package.json`, write `no-bin.test.ts` over `npm pack --dry-run --json` (remote job), and delete the legacy scripts once the parity tests from steps 10–11 are green. DX-149 deletes `bin/aura-glass.cjs` on `main` in the same PR as DX-021.

## 4. Tests

- Local: `cd packages/cli && npx vitest run --coverage` (package, deps (allowlist half), contract, fs-safety, git-guard, dry-run, version, project-detect, list-info, audit.compat, migrate-legacy, command-coverage), and `npx vitest run -c tests/dx/vitest.config.ts tests/dx/paths.test.ts`.
- Remote (`cli.yml`): the same suites on Node 20.19 and 22, plus `perf.test.ts`, the `deps.test.ts` install size ≤15 MB, and from beta.1 `no-bin.test.ts`.

## 5. Visual evidence

None (this is a non-UI package). Attach CI logs instead: the `auraglass --help` output, a `--json` sample per command, the exit-code table run, and the coverage summary.

## 6. Exit criteria

- AC-DX-02: every `packages/cli/test/**` suite passes, line coverage is ≥90%, and every command and flag in §5.1 plus `list`/`info`/`audit deps|imports`/`migrate icons|radix|mui` has ≥1 test.
- AC-DX-03 (path half): all 4 fs-safety escape cases exit 3 with the exact message, and "aborts cleanly" passes.
- AC-DX-01 (pre-publish): `PACKAGE_NAME` is locked with evidence. From beta.1, `no-bin.test.ts` is green (`bin` is absent from the packed `aura-glass`).
- `rg "3\.2 target|3\.3|3\.0\.x" packages/cli/src` = 0.

## 7. Final report format

```
PROMPT-16a report
PR: <url>   Branch: main   SHA: <sha>
Prereqs: 1 <ok|re-anchored :lines> 2 <ok|blocked PRD-02> 3 <ok> 4 <@auraglass: result | aura-glass-cli: result> 5 <ok|deferred>
PACKAGE_NAME: <name> (evidence: <commands + output>)
Tasks: DX-001 <done|blocked: reason|deferred> … DX-022, DX-149
Tests local: <cmd> -> <pass>/<total>, 0 skipped; coverage lines <n>%
Remote CI: <run urls>; perf p95 <ms> on <runner>; install size <MB>
Baselines captured from bin/aura-glass.cjs: <commands>
AC: AC-DX-01(pre) <pass|pending beta.1>, AC-DX-02 <pass|fail>, AC-DX-03(path) <pass|fail>
Deviations / blockers: <list with evidence>
```
