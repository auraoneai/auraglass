# PROMPT-00e (TRUST): lint gate, stale snapshots, Pipeline Validation green, font licence

Source PRD: `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` (PRD-00) §2.5, §5.2 (REQ-TRUST-09, -11, -12), §5.9, §11 (font change), §14, §15, §16 (tarball row), §20 steps 8–9. Decisions D-31 (font), D-27 (no visible pixel change in a patch except labelled fixes).
Requirements: REQ-TRUST-09, -11, -12, -46, -47, -48. Acceptance: AC-TRUST-02 (Pipeline Validation green half), AC-TRUST-08 (0 total lint errors), AC-TRUST-19, AC-TRUST-23 (tarball size), AC-TRUST-24.
Tasks: TRUST-047..TRUST-057. Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`.

## Common rules (binding)

0. Shared contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row wins over PRD or prompt text). Use only registry names: `.github/workflows/publish-npm.yml` (never `release.yml`), `etc/api/` (root slug `index`), `tests/release/`, repo-root `deprecations.json` (`version: 1`), `scripts/ci/lib/{npm-pack,evidence-dir}.js` (no `scripts/lib/`), `auraglass/motion-no-empty-animate`, artifact `retention-days` 14 PR / 30 main / 90 release, unchanged `glass-pipeline.yml` job names (SC-02..SC-07, SC-10, SC-11, SC-16). `depends_on` in `tasks/TRUST.json` holds only real task ids (SC-40).
1. Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` is canonical; deviations declared in the PR with evidence.
2. Remote-first: no `npm run build`, full `npx jest --ci`, full `lint:check` over `src` if it exceeds a light run, Storybook build, Playwright on the Mac. Use GitHub Actions on the PR (read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or `auraone-remote-run`.
3. Forbidden: `--no-verify`, `continue-on-error`, `|| true`, removing `lint:check` from any workflow, downgrading `auraglass/no-inline-glass` globally, `eslint-disable` comments added to silence it, `.skip`/`.only`, `--passWithNoTests`, lowering thresholds, `jest -u` except the single reviewed REQ-TRUST-11 update described below.
4. Font: agents never decide licensing. The owner's decision (REQ-TRUST-46 default if unconfirmed by 2026-10-12) is read from the release issue; record it, do not infer it.
5. D-32: no evidence committed. No `package.json` `dependencies`/`peerDependencies`/`exports` change. Conventional commits, no `!`, `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

- PROMPT_00b, 00c, 00d merged (hoisting and motion rewrites change the lint count): check `rg --pcre2 "(\?|&&)\s*use[A-Z]\w*\(" src --glob '!*.stories.*' --glob '!*.test.*'` = 0, `rg --pcre2 "animate=\{[^}]*[Rr]educed[^?]*\?\s*\{\}" src` = 0, `rg -n "new Function" src/components/cms/GlassCanvas.tsx` = 0.
- Font task only: the release issue contains the owner's font decision with a date, or 2026-10-12 has passed (then REQ-TRUST-46).

## May touch

`eslint.config.js` (`no-inline-glass` scope override), NEW `eslint/no-inline-glass-baseline.json`, NEW `scripts/ci/verify-no-inline-glass-baseline.js`, source files whose `no-inline-glass` errors are fixed (option a; list each), `package.json` (`lint`, `lint:fix` scripts; `yaml` devDependency only), NEW `tests/ci/no-gate-bypass.test.ts`, `src/components/button/GlassButton.test.tsx`, `src/components/card/GlassCard.test.tsx` and their `__snapshots__/*.snap`, `.github/workflows/glass-pipeline.yml` (baseline check step), NEW `docs/release/decisions/4.1.1-lint-scope.md`, NEW `docs/release/decisions/4.1.1-font-licence.md`, `docs/release-rollback-deprecation.md` (links to the two records), font files: `src/styles/fonts/Aeonik-*.woff2` (12), `src/styles/aeonik.css`, `src/styles/index.css:4`, `src/styles/variables.css:31`, `src/tokens/generated.ts`, `src/tokens/designConstants.ts`, `src/theme/tokens.ts`, `src/components/media/GlassAdvancedAudioPlayer.tsx`, `src/components/media/GlassAdvancedVideoPlayer.tsx`, `src/components/charts/ModularGlassDataChart.tsx`, `src/components/charts/GlassDataChart.tsx`; REQ-TRUST-47 only: NEW `LICENSE-FONTS`, `scripts/build-all.js` (copy to `dist/styles/fonts/LICENSE`), `package.json` `files`; `scripts/ci/verify-pack.js` (font assertion); NEW `tests/ci/tarball-fonts.test.ts`.

## Must not touch

Other `eslint` rules' severities, `README.md` (00f writes the font sentence from your decision record), `CHANGELOG.md`, release notes, `.github/workflows/publish-npm.yml`.

## Steps

1. TRUST-047 (REQ-TRUST-09). Push a branch from `main` and read the CI `lint:check` output; record total errors and per-rule counts (expected `auraglass/no-inline-glass` ≈ 165 before hoisting effects) in the PR.
2. TRUST-048 (REQ-TRUST-09). Choose (a) fix every error, or (b) baseline: generate `eslint/no-inline-glass-baseline.json` (sorted array of repo-relative paths, one per violating file, from the CI ESLint JSON output on this SHA); add an `eslint.config.js` override setting `auraglass/no-inline-glass: 'warn'` only for `files:` = those paths; all other `src/**` stay `error`. Write `scripts/ci/verify-no-inline-glass-baseline.js`: runs ESLint for that rule, fails if a violating file is not in the baseline or a baseline file no longer violates (must be removed). Add it to `glass-pipeline.yml` after `lint:check`.
3. TRUST-049. `docs/release/decisions/4.1.1-lint-scope.md`: option chosen, measured counts with CI run URL, baseline length, ratchet rule, owner of burn-down (PRD-07/PRD-08 per architecture §16). Link it from `docs/release-rollback-deprecation.md`.
4. TRUST-050 (REQ-TRUST-12). `package.json`: `"lint": "eslint src"`, add `"lint:fix": "eslint src --fix"`; `lint:check` unchanged.
5. TRUST-051. `tests/ci/no-gate-bypass.test.ts`: parse every `.github/workflows/*.yml` with the `yaml` package (neither `yaml` nor `js-yaml` is a direct dependency at `15b6de6f7`; add `yaml` as an exact-pinned **devDependency** — allowed by REQ-TRUST-52 — and record the version; 00g's `publish-workflow.test.ts` reuses it): 0 `continue-on-error: true`; no `run:` containing `|| true` or `--no-verify`; `glass-pipeline.yml` contains `npm run lint:check`; `package.json` `lint` lacks `--fix`.
6. TRUST-052 (REQ-TRUST-11). In CI run `npx jest --ci src/components/button/GlassButton.test.tsx src/components/card/GlassCard.test.tsx`; read the snapshot diff. If the only differences are the c07fd7111 fill change (`rgba(255,255,255,0.12)` → `0.018`) and its direct consequences, update those two snapshot files only (`npx jest src/components/button/GlassButton.test.tsx src/components/card/GlassCard.test.tsx -u` run remotely on that SHA, then commit the `.snap` files), and post the PR review comment quoting the diff and stating it is accepted 4.1.0 behaviour (D-27). Any other diff → stop and report.
7. TRUST-053 (REQ-TRUST-09, AC-TRUST-02). After merge, confirm `gh run list --workflow glass-pipeline.yml --branch main --limit 1` = `success` and full `npx jest --ci` reports 0 failed suites and 0 written snapshots (`--ci` forbids writing). Record URL.
8. TRUST-054 (REQ-TRUST-46, default path). Delete the 12 `src/styles/fonts/Aeonik-*.woff2` and `src/styles/aeonik.css`; remove `@import "./aeonik.css"` at `src/styles/index.css:4`; `src/styles/variables.css:31` → `--glass-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; same stack in `src/tokens/generated.ts`, `src/tokens/designConstants.ts`, `src/theme/tokens.ts`, and the 4 media/chart files. Check `rg -n "Aeonik" src scripts` = 0. If `src/tokens/generated.ts` is generated, change the generator input and regenerate in CI.
9. TRUST-055 (REQ-TRUST-46/-47). Write `docs/release/decisions/4.1.1-font-licence.md`: date, decision source (release issue comment URL), outcome "licence unconfirmed → removed" or licensor + licence title + date. REQ-TRUST-47 path instead: commit the owner-supplied `LICENSE-FONTS`, copy to `dist/styles/fonts/LICENSE` in `scripts/build-all.js`, add to `package.json` `files`, keep fonts; skip step 8. Exactly one path ships.
10. TRUST-056 (REQ-TRUST-48). `verify-pack.js`: REQ-46 path → fail if any packed `files[].path` matches `/Aeonik/i`; REQ-47 path → fail unless `dist/styles/fonts/LICENSE` is packed. Also assert packed `size` ≤ 9.25 MB (REQ-46) or ≤ 9.70 MB (REQ-47) (PRD §16). `tests/ci/tarball-fonts.test.ts` runs `parsePackJson` on `npm pack --dry-run --json` output in CI and checks the chosen rule (reads the outcome from the decision record).
11. TRUST-057 (REQ-TRUST-46 labelled visual change, PRD §14/§15). Remote lane via `auraone-remote-run`: run `test:visual:app-chrome` capture at 1440×900 and 390×844 on CI-built storybook for 4.1.0 (`15b6de6f7`) and the PR SHA; produce side-by-side composites; assert `scrollWidth <= innerWidth` for every captured story; compute per-text-node line counts and list every node whose count changed; run the `runtime-remote.md` contrast sampling on the default stage and assert failures ≤ 17/342. Upload as `evidence-font-change-<sha>`. The changed-wrap list goes to 00f for the release notes.

## Tests to run

Remote (PR CI): `lint:check`, `verify-no-inline-glass-baseline.js`, full `npx jest --ci`, `verify:pack`, `tests/ci/tarball-fonts.test.ts`, `tests/ci/no-gate-bypass.test.ts`; step 11 lane. Local: `npx jest tests/ci/no-gate-bypass.test.ts`.

## Visual evidence

Step 11 composites (before/after at both viewports), overflow JSON, wrap-diff list, contrast count; human review sign-off comment on the PR. Artifacts only.

## Exit criteria

AC-TRUST-02 (Pipeline Validation `success` on `main` after this prompt; 0 bypasses per `no-gate-bypass.test.ts`), AC-TRUST-08 (`lint:check` 0 errors), AC-TRUST-19 (decision record + tarball check for the chosen path), AC-TRUST-23 tarball half (size budget asserted in `verify-pack.js`), AC-TRUST-24 (0 failed suites, 0 written snapshots).

## Final report

```
## PROMPT_00e report
PR(s): <urls>  SHAs:
| REQ | Status | Commit | Evidence |
| AC  | Status | Evidence |
Lint: before <total/no-inline-glass> → after <0 errors>; option (a|b); baseline length N
Snapshot diff summary + review comment URL:
Font decision: <REQ-46|REQ-47>, source URL, record path; tarball size <bytes>
Visual lane: overflow failures 0; wrap changes <list>; contrast failures <n>/342; artifact URL
Deviations / Blockers:
```
