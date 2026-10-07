# PROMPT-00b (TRUST): security advisory, server guard, privacy and security cuts

Source PRD: `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` (PRD-00) §2.2, §2.4, §4.4 (opt-in tracking, honest contrast), §5.3, §5.8, §10, §11, §12, §13, §15, §20 steps 3–4.
Requirements: REQ-TRUST-13, -14, -15, -16, -17, -18, -19, -20, -43, -44, -45. Acceptance: AC-TRUST-06, -07, -13, -17 (draft + SECURITY.md half; publication is the owner's), -18.
Tasks: TRUST-011..TRUST-027. Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`.

## Common rules (binding)

0. Shared contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row wins over PRD or prompt text). Use only registry names: `.github/workflows/publish-npm.yml` (never `release.yml`), `etc/api/` (root slug `index`), `tests/release/`, repo-root `deprecations.json` (`version: 1`), `scripts/ci/lib/{npm-pack,evidence-dir}.js` (no `scripts/lib/`), `auraglass/motion-no-empty-animate`, artifact `retention-days` 14 PR / 30 main / 90 release, unchanged `glass-pipeline.yml` job names (SC-02..SC-07, SC-10, SC-11, SC-16). `depends_on` in `tasks/TRUST.json` holds only real task ids (SC-40).
1. Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` is canonical (§13.1 lists the only behaviour removals allowed outside a major); deviations are declared in the PR with evidence.
2. Remote-first: no Docker (never build or run `Dockerfile`/`docker-compose.yml`), Playwright/Chromium, Storybook build, `npm run build`, full `npx jest --ci` on the Mac. Use GitHub Actions on the PR (read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or the `auraone-remote-run` skill. Local: `rg`, `git`, `npx eslint <files>`, `npx jest <one named test file>`.
3. Forbidden: placeholder implementations, `.skip`/`.only`/`xit`, `--passWithNoTests`, `continue-on-error`, `|| true`, `--no-verify`, lowered thresholds, `jest -u`. The existing `ContrastGuard.test.tsx` snapshot changes **because the attributes are removed by requirement**: update it only with a PR comment quoting the diff and REQ-TRUST-18.
4. D-32: no evidence committed. 5. No change to `package.json` `dependencies`/`peerDependencies`/`exports`; no export removed. 6. Agents never publish the advisory, change repository security settings, or deploy `server/`. 7. Conventional commits, no `!`, `Co-Authored-By: Claude <noreply@anthropic.com>`.
8. Read `/Users/gurbakshchahal/.config/agent-policy/reference/shared-service-access.md` before any `gh`/`npm view` call. Never print secret values.

## Prerequisites

- PROMPT_00a merged: `test -f scripts/ci/lib/npm-pack.js && test -f scripts/ci/lib/evidence-dir.js` and the `pack-matrix` job is green on `main` (`gh run list --workflow glass-pipeline.yml --branch main --limit 1`).

## May touch

`docs/security/advisories/2026-10-hosted-runtime.md` (NEW), `SECURITY.md`, `server/index.ts`, `.env.example`, `Dockerfile` (line 50 only), `tests/deployment/jwt-secret-guard.test.ts` (NEW), `src/utils/adaptiveAI.ts`, `src/index.ts` (add `enableAdaptiveAI` to the existing export at `:915` only), `src/utils/__tests__/adaptiveAI.optin.test.ts` (NEW), `scripts/ci/verify-import-side-effects.js` (NEW), `scripts/ci/import-side-effects-baseline.json` (NEW), `tests/ci/import-side-effects.test.ts` (NEW), `src/components/cms/GlassCanvas.tsx`, `GlassCanvas.stories.tsx`, `GlassCanvas.test.tsx`, `src/components/cms/GlassCanvas.security.test.tsx` (NEW), `src/utils/browserCompatibility.ts` (inline disables at `:197,421,424` only), `eslint.config.js` (`no-new-func`, `no-eval` only), `src/components/media/GlassAdvancedVideoPlayer.tsx`, `GlassAdvancedVideoPlayer.stories.tsx`, `src/components/media/GlassAdvancedVideoPlayer.datasrc.test.tsx` (NEW), `src/components/accessibility/ContrastGuard.tsx`, `ContrastGuard.stories.tsx`, `ContrastGuard.test.tsx`, its `__snapshots__`, `src/components/accessibility/ContrastGuard.honesty.test.tsx` (NEW), `src/utils/contrastGuard.ts`, `src/tokens/glass.ts` (`validateTextContrast` only), `src/tokens/__tests__/validateTextContrast.test.ts` (NEW), `.github/workflows/glass-pipeline.yml` (side-effect gate step only).

## Must not touch

Hook hoisting files (00c), reduced-motion sites (00d), `README.md`/`CHANGELOG.md`/release notes (00f), the repo-root `deprecations.json` (00g, TRUST-075; list your entries in the PR for 00g to seed), `src/services/**` (read-only for the advisory; no edits), `docker-compose.yml`, any npm or GitHub security settings.

## Steps

1. TRUST-011 (REQ-TRUST-43). Determine first affected version: `git log --diff-filter=A --format='%h %ad' -- Dockerfile server/index.ts` and `npm view aura-glass time --json`; map the commit dates to versions. Write `docs/security/advisories/2026-10-hosted-runtime.md`: title "Hosted example runtime: default JWT secret, missing authorization and open WebSocket rooms"; affected versions; scope (deployments built from `Dockerfile`/`server/`, not browser use of the npm package); issues with references `Dockerfile:50`, `.env.example:22`, `server/index.ts:26,272-284,347-348,497-506`, `src/services/auth/auth-service.ts:38-41,109-110,136`; mitigations (unique `JWT_SECRET` ≥32 bytes, do not expose `server/`, rotate secrets equal to the default); proposed CVSS 3.1 score and vector marked "owner to confirm"; patched in 4.1.1 by REQ-TRUST-44.
2. TRUST-012 (REQ-TRUST-45). Run `rg -n "aura-glass/(services|server)|from ['\"]aura-glass['\"].*(openai|vision|collaboration)" /Users/gurbakshchahal/AuraOne --glob '!**/node_modules/**'` (bounded to that repo). Record hit count and file list (no secret values) in the advisory draft. Post the draft path in the release issue as operator action "publish advisory before tag".
3. TRUST-013/-014 (REQ-TRUST-44). In `server/index.ts` right after `dotenv.config()`: if `JWT_SECRET` is unset, equals `your-super-secret-jwt-key-change-in-production`, or `length < 32` → `console.error('[aura-glass server] JWT_SECRET must be set to a unique value of at least 32 characters')` and `process.exit(1)`. Export the check as a pure function `assertJwtSecret(env)` in the same file for testing. `.env.example:22` → `JWT_SECRET=`. Delete `COPY .env.example .env` at `Dockerfile:50`.
4. TRUST-015. `tests/deployment/jwt-secret-guard.test.ts`: default value → exit/throw; 16-char → exit; 32+ chars → proceeds; reads `Dockerfile` text and asserts 0 occurrences of `.env.example`.
5. TRUST-016 (REQ-TRUST-20). `SECURITY.md` Supported Versions: `4.1.x` Active; `4.0.x` Security fixes until 2026-12-31; `< 4.0` Not supported. Add "Hosted runtime" section per PRD text.
6. TRUST-017 (REQ-TRUST-13). `src/utils/adaptiveAI.ts`: constructor stops calling `initializeTracking()`; add private `enabled`, `intervalHandle`, bound listener refs; `enable()` registers the `click`/`scroll` listeners and `setInterval` once; `disable()` removes both listeners and `clearInterval`s; interaction arrays capped at 20 (drop oldest). `adaptiveAI` singleton identity and methods unchanged; `useAdaptiveAI()` returns the same shape and does not call `enable()`.
7. TRUST-018 (REQ-TRUST-14). Export `enableAdaptiveAI(): () => void` (idempotent; returns disposer calling `disable()`; one `console.warn` per page load when `process.env.NODE_ENV !== 'production'` with the exact PRD message). Add it to the existing `src/index.ts:915` export line.
8. TRUST-019. `src/utils/__tests__/adaptiveAI.optin.test.ts` per PRD §12 (spies on `document.addEventListener`/`setInterval`, fake timers): import → 0; enable → 2 listeners + 1 interval; disposer removes 3; second enable idempotent; 1 warning; arrays ≤ 20 after 50 clicks; no `data-ai-*` on `<html>` before enable.
9. TRUST-020/-021 (REQ-TRUST-15). `scripts/ci/verify-import-side-effects.js`: create jsdom, wrap `document.addEventListener`, `window.addEventListener`, `setInterval`, `setTimeout` (delay > 0), `documentElement.setAttribute`, `documentElement.style.setProperty` with recorders capturing a stack, `await import(path.resolve('dist/index.mjs'))`, attribute each effect to a source symbol, fail if any is attributed to `adaptiveAI` or is absent from `scripts/ci/import-side-effects-baseline.json` (seeded from the first CI run; may only shrink — fail if the run finds fewer effects than listed and the entry is not removed). Add step `node scripts/ci/verify-import-side-effects.js` after build in `glass-pipeline.yml`. `tests/ci/import-side-effects.test.ts` runs it against the built dist in CI.
10. TRUST-022/-023/-024 (REQ-TRUST-16). `GlassCanvas.tsx:302-320`: delete `new Function(...)` and its eslint-disable; string `onClick` → no handler + one dev warning per component id (exact PRD text); add `onComponentAction?: (componentId: string, action: "click") => void` and call it on click. Replace string samples in `GlassCanvas.stories.tsx`. `eslint.config.js`: `no-new-func: 'error'`, `no-eval: 'error'` for `src/**`; inline `// eslint-disable-next-line no-new-func` only at `browserCompatibility.ts:197,421,424`. Test `GlassCanvas.security.test.tsx` per PRD §12.
11. TRUST-025 (REQ-TRUST-17). Delete `isStorybookDataMedia` (`GlassAdvancedVideoPlayer.tsx:82-83`); `usePosterSurface = !mediaFile.src` (`:985-986`). Stories that forced the poster use `src: undefined` + `poster`; add one story with a real `data:video/` source. Test `GlassAdvancedVideoPlayer.datasrc.test.tsx`: `<video>` has the data src; control `aria-label`s unchanged.
12. TRUST-026 (REQ-TRUST-18). `ContrastGuard.tsx:245-247`: emit `data-contrast-status="unverified"`; remove `data-meets-wcag`, `data-contrast-ratio`; callback payload `meetsRequirement: undefined`, `status: "unverified"`; update `src/utils/contrastGuard.ts` consumers. JSDoc + every story shows Callout "Unverified: does not measure rendered contrast". Test `ContrastGuard.honesty.test.tsx`.
13. TRUST-027 (REQ-TRUST-19). `src/tokens/glass.ts:931-935`: return type `boolean | "unverified"`, returns `"unverified"`; JSDoc warns it is truthy, compare `=== true`. `rg -n "validateTextContrast" src` callers treat it as not-passed. Test `src/tokens/__tests__/validateTextContrast.test.ts` (`#000/#fff`, `#777/#888` → `"unverified"`).

## Tests to run

Local: each new jest file above individually. Remote (PR CI): full `npx jest --ci`, `lint:check` (for `no-new-func`/`no-eval`), build + `verify-import-side-effects.js`.

## Visual evidence (remote)

Via `auraone-remote-run` against a CI-built `storybook-static/` at the PR SHA (method of `docs/auraglass-5/autopsy/runtime-remote.md`; S3-staged inputs because the runner egress CA is expired): DOM scan of every ContrastGuard story → `[data-meets-wcag]` = 0, `[data-contrast-status="unverified"]` ≥ 1, screenshot showing the Callout; screenshot of the new `data:video/` story showing a `<video>` element, not the poster. Upload as artifacts; link in the PR; commit nothing.

## Exit criteria

AC-TRUST-06 (side-effect gate + optin test green), AC-TRUST-07 (`rg -n "new Function|eval\(" src --glob '!*.test.*'` → only `browserCompatibility.ts:197,421,424`), AC-TRUST-13 (story DOM scan + `validateTextContrast("#000","#fff") === "unverified"`), AC-TRUST-17 draft half (draft file exists, handed to owner; `SECURITY.md` lists `4.1.x`), AC-TRUST-18 (`jwt-secret-guard.test.ts` green; `rg -c "\.env\.example" Dockerfile` → 0).

## Final report

```
## PROMPT_00b report
Branch/PR: <url>  Head SHA: <sha>
| REQ | Status | Commit | Evidence |
| AC  | Status | Evidence |
Tests added + CI run URL:
First affected version (advisory): <version, commit>; AuraOne consumer grep: <N hits, files>
Import side-effect baseline entries: <list>
deprecations.json entries for 00g: adaptiveAI, useAdaptiveAI, enableAdaptiveAI, data-meets-wcag, data-contrast-ratio, validateTextContrast, GlassCanvas string onClick (exception values per REQ-TRUST-51 / SC-03: `privacy` on adaptiveAI; `honesty` on data-meets-wcag, data-contrast-ratio, validateTextContrast; `security` on GlassCanvas)
Remote visual artifacts: <urls>
Operator actions open: publish advisory
Deviations / Blockers:
```
