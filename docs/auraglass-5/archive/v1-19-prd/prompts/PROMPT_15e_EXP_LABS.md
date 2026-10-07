# PROMPT-15e (EXP): `@auraglass/labs` package shell and admission gate (interim §16 PRD-21)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md` (Key **EXP**, self-id PRD-15), §5.7. This PRD is the **interim owner of architecture §16 PRD-21** (SC-37 in `docs/auraglass-5/prd/_shared-contracts.md`) until a labs PRD is filed; MAT keeps the cinematic engine contract. Requirements: **REQ-EXP-37, -38, -39, -40** (and REQ-EXP-05 for labs residents, REQ-EXP-10 extended to `packages/labs/src/**`). Acceptance: **AC-EXP-16**. Tasks: `docs/auraglass-5/tasks/EXP.json` EXP-094..EXP-100. Index: `docs/auraglass-5/prompts/PROMPT_15_EXP.md`. Architecture anchors: D-16, D-23, §13.4.

This prompt builds the package shell and the gate only. It adds **no resident**; residents (parallax, particles, magnetic cursor, cinematic lens) come from their owners under this gate, each with a ledger row.

## 1. Context

Repo `/Users/gurbakshchahal/platforms/AuraGlass`, baseline `aura-glass` 4.1.0 at HEAD `15b6de6f7`; no `packages/` directory exists at HEAD. Workspace directories are fixed by SC-13 (`packages/{cli,qa,registry,mcp,labs}`, PKG owns the package map); QA-001 introduces the root `workspaces` entry with `packages/qa`. Package name `@auraglass/labs`, fallback `aura-glass-labs` if the D-23 scope decision (recorded in `docs/release/decisions/`) says the `@auraglass` scope did not verify. Branch `exp/15e-labs` from `main`.

## 2. Files you may touch

- NEW `packages/labs/package.json`, `packages/labs/src/index.ts`, `packages/labs/README.md` (EXP-094, EXP-095)
- MODIFY root `package.json`: only add `packages/labs` to the existing `workspaces` array created by QA-001
- NEW `scripts/ci/verify-labs-admission.mjs` (EXP-097)
- NEW `tests/labs/{package,admission,promotion}.test.ts`, NEW `tests/labs/fixtures/{math-random,deep-import,side-effect,no-pause}/**` (EXP-096, EXP-098, EXP-100)
- MODIFY `.github/workflows/certify-pr.yml` (QA owns it, QA-031): add one L1 Static step group for labs (EXP-099)

Must not touch: `src/**`, `eslint-plugin-auraglass.js` (PROMPT-15b registers `no-simulation`; its `eslint.config.js` object already lists `packages/labs/**`), `.github/workflows/publish-npm.yml` (REL, SC-05), `build/exports.manifest.json`, other PRDs.

## 3. Prerequisites (owner prompts named)

- PROMPT-15a merged (ledger + `verify-capability-ledger.mjs`, EXP-009) and PROMPT-15b's EXP-036 (no-simulation enabled for `packages/labs/**`).
- QA-001 (QA prompt): root `workspaces` exists; QA-031 `certify-pr.yml` exists.
- PKG-005 (exports manifest) and PKG-042 (`scripts/ci/verify-side-effects.mjs`) from the PKG prompt.
- If any is missing, stop that task, report the exact missing file, and continue with the others; never create a substitute.

## 4. Steps

1. **EXP-094 `packages/labs/package.json` (REQ-EXP-37).** `"name": "@auraglass/labs"` (or the D-23 fallback), `"version": "0.1.0"`, `"type": "module"`, `"sideEffects": false`, `"peerDependencies": { "aura-glass": "^5.0.0", "react": <core range>, "react-dom": <core range> }` copied from the root `package.json` peers, `"exports": { "./package.json": "./package.json" }` (residents add entries later), no `bin`, `"files"` limited to `dist`. Add `packages/labs` to root `workspaces`.
2. **EXP-095 barrel and README.** `src/index.ts` exports nothing yet (a comment pointing at §13.4 is fine; no placeholder component). README states 0.x / no-guarantee, the five §13.4 criteria, the promotion path (REQ-EXP-40) and that every resident needs a ledger row with `form: ["labs"]` and an `area`.
3. **EXP-096 `tests/labs/package.test.ts`.** "peer aura-glass ^5", "sideEffects false", "no bin", "every exports entry resolves in the packed tarball" (the last case runs in L2 Artifact on `npm pack -w packages/labs`).
4. **EXP-097 `scripts/ci/verify-labs-admission.mjs` (REQ-EXP-38).** Node ≥20 ESM, no dependencies. For each resident entry in `packages/labs/package.json` `exports` (excluding `./package.json`): (a) a ledger row whose `names` contains it, with `form` incl. `labs` and `area` set; (b) run ESLint programmatically with the repo config over the resident's files and require 0 `auraglass/no-simulation` reports; (c) every import specifier is `react`, `react-dom`, a peer, or an `aura-glass` entry listed in `build/exports.manifest.json` — `aura-glass/compat`, `aura-glass/src/**` and `aura-glass/dist/**` fail; (d) run PKG's `scripts/ci/verify-side-effects.mjs` over the built labs entries; (e) every `requestAnimationFrame`/`setInterval` loop file also references `visibilitychange` and `IntersectionObserver`, and the resident's unit test asserts `cancelAnimationFrame` on hide and a static frame under reduced motion and reduced transparency (`area: "spatial"` residents are additionally measured by `tests/labs/spatial-admission.spec.ts`, PROMPT-15d EXP-088). Print `<resident>: <rule> <message>`; exit 1 on any failure; with zero residents print `labs admission: 0 residents` and exit 0.
5. **EXP-098 `tests/labs/admission.test.ts`.** Each fixture directory is a tiny labs package with one resident and exactly one defect (`Math.random` in render; `import 'aura-glass/src/x'`; module-scope `window.addEventListener`; rAF loop without a visibility pause); spawn the script with `--root <fixture>` and assert exit 1 naming the rule; the real package exits 0.
6. **EXP-099 CI (REQ-EXP-39).** In `certify-pr.yml`, an L1 Static step group with a `paths` filter on `packages/labs/**`: `node scripts/ci/verify-labs-admission.mjs` and `npx jest tests/labs --ci`. Keep QA's job names (SC-10). Publishing stays with REL's `publish-npm.yml` (SC-05); record in the report that labs publish must depend on this step.
7. **EXP-100 `tests/labs/promotion.test.ts` (REQ-EXP-40).** Fixture "promoted resident without core export" (ledger row `form` incl. `export`, no matching name in the fixture exports enumeration) exits 1; a promoted labs entry that re-exports the core symbol warns once (spy on `console.warn`, two imports → one call); the ledger edit must satisfy REQ-EXP-36 (≥10 demand links, reuse EXP-015).

## 5. Running

Local (light): `node scripts/ci/verify-labs-admission.mjs`, `npx jest tests/labs/*.test.ts --ci`. `npm pack`, tarball resolution and any browser/perf probe run only in CI or on an `auraone-remote-run` worker (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` first). Never local Docker or a local browser.

## 6. Prohibitions

No placeholder residents or demo components; no `eslint-disable`; no skipped/only/todo tests; no new dependencies in `packages/labs` beyond peers; no publish workflow; no `continue-on-error` or `|| true`.

## 7. Exit criteria

- AC-EXP-16: `packages/labs/` has the REQ-EXP-37 shape; the 4 negative fixtures exit 1 and the real package exits 0; the certify-pr.yml labs step is green (run URL); promotion fixtures behave as specified.

## 8. Final report

```
PROMPT-15e report
branch / SHA / PR:
package name used (@auraglass/labs | fallback) + decision record path:
fixtures: <name> -> exit, rule (4 lines)
certify-pr.yml run URL (labs step):
residents admitted: 0 (expected)
blockers (missing QA-001 / QA-031 / PKG-005 / PKG-042 / EXP-036):
```
