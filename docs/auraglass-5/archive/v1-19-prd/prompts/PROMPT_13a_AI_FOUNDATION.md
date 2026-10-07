# PROMPT-13a (AI): Data model, purity gates and the `./ai` entry

You are implementing part of PRD-AI (key `AI`; self-id PRD-13 is an alias, §16 PRD-12; AI Primitives) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Work on a branch off `main` (5.0 line). This is Wave 1: it needs no material, components or browser.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_AI_PRD.md` §4.2 (data model and display-state table), §4.7 (purity gate list), §5.1 (REQ-AI-01..07), §8 (tooling table), §12 rows 1–4, §16 (budget lines), §17 AC-AI-01..04, §20 step 1.
- Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` D-15, D-29, D-30, §3 `./ai` row, §3.6.
- Owning-PRD contracts you plug into: `docs/auraglass-5/prd/AURAGLASS_PACKAGING_BUILD_PRD.md` §4.2 (`build/exports.manifest.json`, `scripts/build/generate-exports.mjs`), REQ-PKG-31 (`scripts/ci/verify-side-effects.mjs`), REQ-PKG-50/53 (`docs/dependency-allowlist.json`, `scripts/ci/verify-deps.mjs`), size budgets (`docs/size-budgets.json`, `scripts/ci/verify-size-budgets.mjs`); `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` / SC-04 (`etc/api/<slug>.api.md`, `etc/api/<slug>.exports.json`, `scripts/release/api-report.mjs`, `scripts/release/export-snapshot.mjs`). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-04, SC-11, SC-12, SC-14, SC-15, SC-16, SC-40 (the registry wins over older PRD text).
- Tasks: `docs/auraglass-5/tasks/AI.json` AI-001..AI-023.

Requirements: REQ-AI-01, -02 (2 of 15 exports at this stage), -03, -04, -05, -06, -07 (directive half), -15 and -19 (static halves). Acceptance: AC-AI-01 (partial), AC-AI-02, AC-AI-03, AC-AI-04 (fixture half).

## 2. Scope
May create or modify:
- NEW `src/ai/types.ts`, `src/ai/tool-state.ts`, `src/ai/text.ts`, `src/ai/index.ts`, `src/ai/__tests__/{tool-state,text}.test.ts`, `src/ai/__tests__/side-effects.test.ts`
- NEW `src/ai/__fixtures__/ui-messages.ai-sdk.json` (generated), `src/ai/__fixtures__/ui-messages.source.ts`, `scripts/build/gen-ai-fixtures.mjs` (SC-11: no `scripts/ai/` directory)
- NEW `tests/types/ai-sdk-compat.test-d.ts`; `tests/types/tsconfig.json` (include/paths only)
- NEW `scripts/ci/verify-ai-purity.mjs`, `tests/ci/verify-ai-purity.test.mjs`, `tests/ci/fixtures/ai-purity/**`
- `eslint-plugin-auraglass.js` (MODIFY after PKG-015: add `no-network-in-ai` only; OV-10), `eslint.config.js` (register it for `src/ai/**`), NEW `tests/lint/no-network-in-ai.test.js`, `jest.config.js` (`testMatch` entry for `tests/lint/**/*.test.js` only if absent)
- `package.json`: `devDependencies.ai` (exact pin) only; `exports` only via the generator
- MODIFY only (files owned by PKG, never create them): `build/exports.manifest.json` (add `./ai` only; after PKG-005), `docs/dependency-allowlist.json` (`./ai` importer scope only; after PKG-056), `docs/size-budgets.json` (4 AI rows; after PKG-048)
- NEW `etc/api/ai.api.md`, `etc/api/ai.exports.json` (slug `ai`), produced by REL's `scripts/release/api-report.mjs` / `export-snapshot.mjs` and the shared root `api-extractor.base.json`; no per-entry extractor config
- `.github/workflows/glass-pipeline.yml` (MODIFY after PKG-038: add AI steps; no new workflow file, SC-10 job names unchanged)

Must NOT touch: any `src/components/**` file (4.x chat/AI components are deleted by FND, §16 PRD-16, not here), `src/index.ts`, `package.json` `dependencies`/`peerDependencies`, other manifest entries, other ESLint rules, `src/services/**`, `src/lib/ai-client.ts`, release branches.

## 3. Prerequisites (check each; on failure write the blocker in the report and continue with what is unblocked)
- Baseline: `git merge-base --is-ancestor 15b6de6f7 HEAD`.
- PKG-005 (`PROMPT_02a_PKG_BUILD.md`): `test -f build/exports.manifest.json && test -f scripts/build/generate-exports.mjs`. If missing, do AI-001..AI-016 and AI-018 and AI-020, write the intended manifest entry in the report, and mark AI-017/AI-019/AI-021 blocked. Never hand-edit `package.json#exports`.
- PKG-042 harness (`PROMPT_07a_PERF_ARTIFACT_GATES.md`): `test -f scripts/ci/verify-side-effects.mjs`. If missing, AI-020 implements the traps inline in the test (same trap list as REQ-PKG-31) and the report says so.
- TRUST-071/072 (`PROMPT_00g_TRUST_RELEASE.md`) and REL-003 (`PROMPT_01a_REL_BASELINE.md`): `test -f scripts/release/export-snapshot.mjs && test -f scripts/release/api-report.mjs` and `rg '"@microsoft/api-extractor"' package.json`. If missing, follow AI-018's DRAFT rule.
- PKG-015 (`PROMPT_02a_PKG_BUILD.md`) for the ESLint plugin wiring, PKG-038 for `glass-pipeline.yml`, PKG-048/056 (`PROMPT_02b_PKG_ARTIFACT.md`) for the budget and allowlist files. If an owner file is missing, record the intended rows in the report and mark the task blocked; never create the owner's file.
- `deprecations.json` is not needed here.

## 4. Steps
1. **AI-001 `src/ai/types.ts`.** Copy the §4.2 block field for field. Add `AgStep` (REQ-AI-36: `{ id; label; state: AgToolDisplayState | 'skipped'; detail?: ReactNode; startedAt?: number; endedAt?: number; children?: AgStep[] }`), `AgRenderers` (`Partial<Record<string, ComponentType<{ part; message }>>>`), and the `*Labels` interfaces with the English defaults named in REQ-AI-10/-17/-22/-28/-33/-35/-37. Types only.
2. **AI-002/003 `toolDisplayState`** per the §4.2 table, plus `DEFAULT_TOOL_STATE_LABELS`. For unknown states, warn once in dev and return `running`. Write the table test.
3. **AI-004/005 `getMessageText`**: text parts joined with `"\n\n"`, everything else excluded.
4. **AI-006** Pin `ai` exactly in `devDependencies` (`npm view ai version` for the latest stable; install with `--save-exact`). Record the version. Confirm that `ai` is not in `dependencies` or `peerDependencies`.
5. **AI-007/008 fixture.** Write `src/ai/__fixtures__/ui-messages.source.ts` with at least 20 fixtures typed `satisfies UIMessage[]`. The list is in AI-007; it must include each of the 7 tool states and exactly one deliberate unknown-type fixture. Write the generator and its `--check` mode, then commit the generated JSON. The JSON header records `aiVersion`. If one of the §4.2 approval states doesn't exist in the pinned version, keep it in `AgToolSdkState`, leave it out of the fixtures, and document it (§4.2 "Unverified" rule).
6. **AI-009/010 type test.** Use plain `tsc` assignability: `const m: AgMessage[] = fixtures` with no cast, an exhaustive mapped type over the SDK's tool-state union, and the chat status. The repo has no `tsd`; don't add it unless you pin it exactly and give a reason. `// @ts-expect-error`, `any` and `as` are banned in this file except for the documented unknown-type fixture.
7. **AI-011/012 purity gate.** Use the TypeScript compiler API, not regex, for code rules. The rules are the AI-011 list exactly. The timer allowlist has exactly two paths. Print `file:line:rule`, exit 1 on any violation, and support `--json`. Fixtures need one failing case per rule.
8. **AI-013..015 ESLint rule** `auraglass/no-network-in-ai`, a RuleTester test, and config registration as `error` for `src/ai/**`.
9. **AI-016 `src/ai/index.ts`.** No directive. Export the types plus `toolDisplayState` and `getMessageText`.
10. **AI-017** Add the `./ai` row to PKG's manifest (MODIFY), regenerate with `scripts/build/generate-exports.mjs`, and run `--check`.
11. **AI-018** Write the API report and the exports snapshot (`["getMessageText","toolDisplayState"]`).
12. **AI-019 `tests/exports/ai-subpath.spec.mjs`** runs against the packed tarball, so run it remotely. It asserts runtime keys == `etc/api/ai.exports.json` ⊆ the REQ-AI-02 list of 15. The `ai.css` assertion runs whenever the manifest lists `./ai.css`; that condition comes from data, so it is not a skip. Add publint/attw for the subpath.
13. **AI-020** Side-effect test: 0 listeners, 0 timers, 0 head nodes, 0 fetch on import.
14. **AI-021/022** Set the allowlist scope and add the four provisional rows (§16) to `docs/size-budgets.json` (integer bytes min+gz, peers external; checked by `scripts/ci/verify-size-budgets.mjs`; no `size-limit`). Budget values are the PRD's; PERF default ceilings apply; don't loosen them.
15. **AI-023** Add the AI steps to `glass-pipeline.yml` (no secrets, no new workflow) and push the branch.

## 5. Tests to run
Local (light, Node only): `./node_modules/.bin/jest src/ai tests/lint/no-network-in-ai.test.js`, `node --test tests/ci/verify-ai-purity.test.mjs`, `node scripts/ci/verify-ai-purity.mjs`, `node scripts/build/gen-ai-fixtures.mjs --check`, `./node_modules/.bin/tsc --noEmit -p tests/types/tsconfig.json` (only if it doesn't need `dist/`; otherwise run it remotely), `./node_modules/.bin/eslint src/ai`. Remote: `npm run build`, `npm pack`, `node tests/exports/ai-subpath.spec.mjs`, `node scripts/ci/verify-deps.mjs`, `node scripts/ci/verify-side-effects.mjs`. Run these in GitHub Actions (`glass-pipeline.yml` and PKG's `artifact.yml`; public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or on an ephemeral EC2 runner via the `auraone-remote-run` skill. Use repo binaries, not `npx`. Never use local Docker.

## 6. Visual evidence
None. This prompt renders no UI; say so in the report.

## 7. Integrity rules (binding)
- No placeholder implementations. `toolDisplayState` must implement the full table. Hand-writing the fixture JSON is forbidden (it is generated).
- No `.skip`, `.only`, `xit`, `todo` or `describe.skip`. No `// @ts-ignore` or `@ts-expect-error` to make the type test pass. Don't narrow the purity rules, add allowlist paths beyond the two named, or exclude files beyond `__tests__`, `__fixtures__` and `*.stories.tsx`.
- No `ai`, `@ai-sdk/*` or provider SDK in `dependencies`/`peerDependencies`. No network in any test.
- Don't edit snapshots or baselines to pass. Don't raise budgets.

## 8. Exit criteria
- AC-AI-02: `verify-ai-purity.mjs` reports 0 violations on `src/ai/`, and every rule has a failing fixture (AI-012). `npm ls` in the packed-tarball consumer shows no `ai`, `@ai-sdk/*`, `openai` or `@google-cloud/vision` *introduced by `./ai`*. The full AC needs FND's deletions (FND-118/119); report the current state.
- AC-AI-03: the type test passes against the pinned `ai`, and the version is recorded.
- AC-AI-04 (fixture half): the generated JSON has ≥20 fixtures covering every part type and all 7 tool states, and `--check` is clean.
- AC-AI-01 (partial): `aura-glass/ai` resolves from the tarball with exports == snapshot ⊆ the 15 names.
- REQ-AI-06: the side-effect test is green.

## 9. Final report format
```
PROMPT-13a REPORT
Branch/SHA:
Pinned ai version: x.y.z (approval states present: list; absent: list)
Tasks: AI-001..AI-023 -> done|blocked (reason) each
Purity: violations=0; rules=N; fixtures per rule: ok
Tests: name -> pass/fail (local | remote run URL)
Prereq blockers: (owner task id, e.g. PKG-005/TRUST-071, exact missing file/command output)
Deviations from PRD/architecture: (each with evidence) or none
Files changed: (list)
```
