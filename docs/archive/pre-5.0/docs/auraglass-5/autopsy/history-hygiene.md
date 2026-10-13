# AuraGlass 5.0 Autopsy: Git History and Repo Hygiene

Scope: `git log` (1,108 commits), tags, npm registry metadata, GitHub issues/PRs, tracked-file inventory, debt markers, orphaned source, committed artifacts, and the release documents (CHANGELOG.md, RELEASE_NOTES_*.md, reports/3.0.7-*.md, reports/fix_plan.md, reports/breaking-change-review.md, reports/CRITICAL_ADDENDUM_installation_failure.md). I verified everything with git, rg, and read-only `npm view` / `gh` calls. I did not trust the certification reports.

## Summary and score: 3 / 10

Over 13 months the repository has grown into a 2.95 GB tracked tree. 99.4% of it is audit output: `reports/` takes 2,930 MB and `src/` takes 14 MB. A fresh clone pulls a 1.86 GB pack. 77% of all commits are mechanical rather than authored. There are 454 "stage complete AuraGlass payload batch NNNN" commits, made on a single day to push the bloated tree past GitHub limits, and 276 one-screenshot-per-commit "certification" commits. Most of the real engineering history is inside about six megacommits of 40k to 136k lines each, with subjects like "feat: comprehensive glassmorphism component updates" and "chore: save changes before push (via Codex CLI)".

The library's identity drifted twice. In September 2025 the experimental "quantum / consciousness / biometric / eye-tracking" code arrived in one 122k-line dump. In November 2025 an Express/Redis/OpenAI/Pinecone "production AI infrastructure" landed. Its server stack is now a runtime dependency of the published UI package (`aura-glass@4.1.0` on npm installs express, ioredis, redis, socket.io, jsonwebtoken, bcryptjs, openai, @pinecone-database/pinecone, @google-cloud/vision, and more).

Release bookkeeping is unreliable. npm has 73 published versions, including 39 2.0.x patch releases in about 3 days and a jump from 2.0.39 to 2.0.98. There are 31 git tags. The CHANGELOG has entries for versions that were never published (3.4.8, 2.17.0, 2.16.4), is missing 3.5.0 (which was published), still lists 3.0.7 as "Unreleased" (it was published), and has an "Unreleased" header with the Keep-a-Changelog preamble in the middle of the file.

Some things are good. Production `src` is nearly free of TODO/console noise, there are 460 stories and 436 test files, npm OIDC trusted publishing works, old npm versions carry real deprecation notices, and there are issue/PR templates, SECURITY.md, and per-version release notes. These are worth keeping. The repo is still not one that a premium first-party design system would let outside contributors clone.

## What exists (counts)

| Item | Count / size | Evidence |
| --- | --- | --- |
| Commits | 1,108 (2025-09-08 to 2026-09-05) | `git log --oneline \| wc -l` |
| Commits by month | 2025-09: 18, 2025-11: 142, 2025-12: 5, 2026-05: 422, 2026-06: 14, 2026-07: 16, 2026-08: 490, 2026-09: 1 | `git log --format=%ad` |
| Busiest days | 2026-08-14: 489 commits; 2026-05-05: 380 commits | same |
| Authors | gchahal1982 621, "Audit" 510, Claude 36, Gurbaksh Chahal 14. No external contributors | `git shortlog -sn --all` |
| "stage complete/remaining AuraGlass payload batch" | 456 commits, 47,805 file additions, 5.65M lines | `git log --grep='payload batch'` + numstat |
| "Add glassmorphism certification screenshot(s)" | 276 commits (243 "batch N" + 33 single), all 2026-05-05 | `git log --format=%s` |
| Tags | 31 (v2.0.2 to v4.1.0; no v1.x, v3.0.3-5, v3.0.7, v3.4.5, v3.4.8, v3.5.0) | `git tag` |
| npm versions | 73; 39 of them are 2.0.x | `npm view aura-glass versions` |
| GitHub PRs | 15, all merged, all agent branches (`claude/*`, `codex/*`, `agent/*`) | `gh pr list -R auraoneai/auraglass --state all` |
| GitHub issues | 1 (#16, open: manual screen-reader/touch certification) | `gh issue list` |
| Tracked files | 50,127. reports/ 47,342; src/ 2,053; docs/ 488; scripts/ 88 | `git ls-files` |
| Tracked PNGs | 23,947 | `git ls-files \| rg -c '\.png$'` |
| HEAD tree size | 2,948 MB total; reports/ 2,930 MB; src/ 14 MB | `git ls-tree -r -l HEAD` |
| .git size | 2.0 GB (size-pack 1.86 GiB) | `git count-objects -vH` |
| Hidden audit staging/previous duplicate dirs | 17,344 files, about 1,180 MB | `reports/audit/.visual-all-staging-runtime-audit-full-2026081*/`, `reports/audit/.previous-2026-08-11T19-26-17-161Z/` |
| `reports/audit/full-tint-ledger` | 21,163 files, about 1,040 MB | `git ls-files reports/audit` |
| Root-level ad-hoc Playwright probes | 45 `probe-*.mjs`/`audit-*probe*.mjs`/`inspect-toggle.mjs`/`list-stories.mjs`/`webkit-probe.mjs`/`.audit-inspect.mjs` | `git ls-files \| rg -v /` |
| Root RELEASE_NOTES files | 5 (3.0.0, 3.0.1, 3.0.2, 4.0.0, 4.1.0) | repo root |
| Top-level `reports/*.md/json` | 53 | `git ls-files reports \| rg '^reports/[^/]+$'` |
| `scripts/` top-level runnable files | 52, of which 42 are not referenced by package.json or .github | rg over package.json/.github |
| package.json scripts | 101 | `node -e` |
| Runtime deps / devDeps / peers | 24 / 69 / 12 | package.json |
| Source (non-test, non-story TS/TSX) | 282,164 LOC; 414 component TSX files across 61 `src/components/*` dirs | `git ls-files src` |
| Stories / tests / snapshots | 460 / 436 / 339 | `git ls-files` |
| Published tarball | 2,391 files, 49.2 MB unpacked | `npm view aura-glass@4.1.0 dist` |

Debt markers (src + server + scripts, snapshots excluded):

| Marker | Count | Notes |
| --- | --- | --- |
| TODO / FIXME / XXX | 6 / 5 / 5 | All in `scripts/audit/runtime-cleanliness-audit.js` (the regexes themselves) plus one real TODO at `scripts/ci/style-audit.js:60`. Production src has none. |
| `@deprecated` | 20 in 10 files | e.g. `src/types/glass-api-stable.ts:288` "will be removed in v2.0.0" (still present in 4.1.0); `src/core/mixins/glassMixins.ts:100-169`; `src/primitives/GlassCore.tsx:128,135`; Galileo aliases `src/components/charts/plugins/GalileoElementInteractionPlugin.ts:84,118,281` |
| `@ts-nocheck` | 5 | all AI/auth services: `src/services/ai/{openai,vision,semantic-search,cache}-service.ts:1`, `src/services/auth/middleware.ts:1` |
| `@ts-ignore` | 10 in 7 files | |
| `as any` | 394 in 134 files | |
| `console.*` in production src | 8 in 4 files | good |

## What is excellent (keep)

- Production source is clean of runtime noise. There are 0 TODO/FIXME markers in `src/` and only 8 `console.*` calls outside stories and tests. An audit script enforces this (`scripts/audit/runtime-cleanliness-audit.js:19-21`).
- Real npm hygiene at the registry level. Versions below 4.0 carry a deprecation message (`npm view aura-glass@3.0.0 deprecated` reads "AuraGlass versions before 4.0.0 are unsupported"). Publishing uses OIDC trusted publishing (`.github/workflows/publish-npm.yml:13` `id-token: write`) after the 3.0.7 auth failures documented in `reports/3.0.7-closure.md`.
- Honest closure reporting in places. `reports/3.0.7-completion-audit.md` says "**not complete**" when npm publish was blocked, instead of declaring victory. That is the right reflex.
- `reports/breaking-change-review.md` compares export maps and peers against the published package mechanically and lists what still needs human review. 5.0 should keep this as a CI step.
- Contributor scaffolding exists: `.github/ISSUE_TEMPLATE/{bug_report,component_request,documentation_issue,visual_regression}.yml`, `pull_request_template.md`, `SECURITY.md`, `CONTRIBUTING.md`, per-release notes, and a `npx aura-glass doctor` command referenced in `RELEASE_NOTES_4.1.0.md`.
- Test and story density (460 stories, 436 test files) is a real asset if the subject matter is curated.
- `.npmignore` and `files: [bin, dist, workers, README.md, LICENSE]` keep `reports/` out of the tarball. The 3 GB problem affects the repo, not consumers.

## What is mediocre

- Commit messages carry little signal. Inflated subjects ("Complete glassmorphism architecture overhaul", "Comprehensive glassmorphism system overhaul", "Update code") sit on giant diffs: `66059a3fd` 277 files/+91,672; `cd3767481` 150 files/+135,934; `a114af13d` 844 files/+122,768/-16,920; `841fecd00` "chore: save changes before push (via Codex CLI)" 769 files/+42,102/-65,658. `git blame` and `git bisect` are effectively useless for the core.
- PR process is cosmetic. All 15 PRs are agent branches merged within minutes to hours, with titles like "Claude/ignore jailbreak attempt 011 c usw ei4r..." (#6, #7). There is no review trail, and no PR has existed since #15 (2026-05-12). The 3.2 to 4.1 releases went straight to `main`.
- `CONTRIBUTING.md:7` tells contributors to "Work in the package repo: `/Users/gurbakshchahal/AuraGlass`". That is an absolute personal path, and it is wrong for the current checkout (`/Users/gurbakshchahal/platforms/AuraGlass`). 12 tracked non-report files and 403 report files embed `/Users/gurbakshchahal`, e.g. `CHANGELOG.md:304-305` and `scripts/fix-*.py`.
- `"lint": "eslint src --fix"` (package.json:247) mutates files. A lint script used in CI should not write.
- 101 npm scripts, including `docker:build/up/down/logs` (package.json:255-258) and `test:deployment:compose` (package.json:305). None of these concern a UI library.
- npm deprecation text points users to `aura-glass@4.0.0`, while `RELEASE_NOTES_4.1.0.md` says "Earlier npm versions are deprecated and direct users to upgrade to 4.1.0". The two contradict each other.

## What is outdated

- `src/types/glass-api-stable.ts:288-289`: `@deprecated ... will be removed in v2.0.0 / @removal v2.0.0`. The file is still present two majors later and nothing imports it.
- Deprecated mixins are still shipped. `src/core/foundation/glassFoundation.ts` (247 LOC, 0 importers) and `src/core/mixins/glassBorder.ts` (0 importers by path) are dead. `interactiveGlass` is still re-exported "for backward compatibility" at `src/index.ts:982-986`.
- Galileo-era names live on: 17 files in `src` mention "galileo", with deprecated aliases at `src/components/charts/plugins/GalileoElementInteractionPlugin.ts:84,118,281`. The styled-components SSR firefight from 2.0.24 to 2.0.29 still leaves 2 files referencing styled-components.
- The November 2025 audit artifacts (`reports/fix_plan.md`, "4-5 weeks (1 engineer)" codemod plan; `reports/CRITICAL_ADDENDUM_installation_failure.md`, the Three.js ERESOLVE) describe a 1.x/2.0 package state that has been superseded. They sit beside current release evidence with nothing marking them as historical.
- `reports/3.0.7-closure.md` and `reports/3.0.7-completion-audit.md` say 3.0.7 was "not shipped", but npm now lists `3.0.7`. CHANGELOG still has `## [3.0.7] - Unreleased` (CHANGELOG.md:274). They refer to `3.0.7PRD.md`, `fixes307.md`, and `PROMPT.md`, which are not tracked (PROMPT.md was deleted in `15b6de6f7`).
- One-shot mass-migration scripts from September 2025 are still tracked and runnable, e.g. `scripts/complete-100-percent-migration.js` ("Migrates remaining 232 components"), `scripts/mass-fix-undefined-access.js` ("💀 MASS FIX: UNDEFINED ACCESS ERRORS"), `scripts/fix-all-remaining-issues.py`, `scripts/fix-arrow-braces.py`, `scripts/remove-all-use-client.cjs` next to `scripts/remove-use-client.js` and `remove-remaining-use-client.cjs`, and `scripts/ultrathink-component-review.cjs`. `bfc7cd56d` (2025-11-06) correctly untracked `scripts/`, but `f410cad46` "Track complete scripts tree" (2026-05-06) brought them all back.

## Architectural timeline (reconstructed)

| Era | Dates | What happened | Key commits |
| --- | --- | --- | --- |
| 0. Dump era | 2025-09-08 to 09-13 | 18 commits, about 450k lines added. The whole component set, including `src/components/quantum/*`, `src/utils/consciousnessOptimization.ts`, `src/components/advanced/GlassBiometricAdaptation.tsx`, `src/utils/emotionalIntelligence.ts`, eye-tracking/biometric/predictive workers, and `src/services/ai/*`, arrives in megacommits with no rationale. The quantum, consciousness, and biometric files were all added in `a114af13d` ("comprehensive glassmorphism component updates"), which suggests the features were generated in bulk rather than requested. Mass "unification" scripts (`scripts/*migration*.js`, `fix-*.py`) were written to rewrite hundreds of files by regex. | `66059a3fd`, `cd3767481`, `a114af13d`, `841fecd00` |
| 1. Agent audit era, 1.0 to 2.0 | 2025-11-06 to 11-07 | PRs #1-#13 from Claude web branches: "audit", "compliance", "fix plan". 1.0.0 and 1.1.0 ship. `df9456215` (Claude) adds "complete production AI infrastructure with real API integrations": Express server, OpenAI, Pinecone, Google Vision, remove.bg, JWT, Redis, WebSocket (`server/index.ts` 659 LOC). `CRITICAL_ADDENDUM_installation_failure.md` finds the package uninstallable (three/drei pinned in deps), which forces 2.0.0. | `df9456215`, `7785aa413` |
| 2. Patch storm, 2.0.x | 2025-11-07 to 11-14 | 39 npm 2.0.x releases in about 3 days, each a forward-fix for SSR/hydration/styled-components/duplicate-React breakage in consumers (`fix(ssr)!` 2.0.24 to 2.0.31, `fix(packaging)!` 2.0.32, `fix(deps)!` 2.0.33). Several were flagged breaking (`!`) but shipped as patches. Version jumps 2.0.39 to 2.0.98 to 2.1.0 to 2.16. | `git log` 2025-11-08 |
| 3. Dormancy | 2025-12 to 2026-05-04 | 5 commits (2.16.3/2.16.4, never published to npm). | `9cc6ff168`'s predecessors |
| 4. Relaunch 3.x + "certification" | 2026-05-05 to 05-14 | 380 commits on 2026-05-05, of which 276 are one-PNG-per-commit certification screenshots. 3.0.0 to 3.2.0 published in 8 days. The 3.0.7 npm-auth saga produced 6+ docs-only commits ("Record npm registry absence for 3.0.7", "Sync 3.0.7 PRD with latest npm blocker evidence"). `f410cad46` re-tracks the whole scripts tree. | `83b5cd32e`..`b1568ace4`, `ad1e760f7` |
| 5. Token purity 3.3 to 3.5 | 2026-06-05 to 07-26 | Slate/zinc slab purges, persona blur, CSS var gates, OIDC publishing. **3.3.0 (`9cc6ff168`) moves express/redis/ioredis/helmet/cors/bcryptjs/@pinecone/@google-cloud/vision into runtime `dependencies`.** 3.4.8 "security release" is in the CHANGELOG but was never published. 3.5.0 was published but is absent from the CHANGELOG. | `9cc6ff168`, `50de776e2`, `89c30cf51` |
| 6. Audit payload flood, 4.0 | 2026-08-14 | 489 commits in one day: `b6fe90a0f`/`fe5eaa87e`/`6888797fa` "stage AuraGlass audit payload ..." and then 454 "stage complete AuraGlass payload batch 0001-0454". This commits 47,805 files (46k audit PNG/JSON, 45 root probe scripts), then "merge: restore complete AuraGlass repository state" (`f16bc9362`, which is actually a single-parent commit deleting a story). 4.0.0 (`8c077b4b3`) is 6 files/+89 lines. The major bump was about the visual audit, not an API change. | `2de62fe80`..`dcfa2b843`, `f16bc9362` |
| 7. 4.1 "498 targets certified green" | 2026-09-05 | One commit with 339 files, +4,900/-7,975. | `15b6de6f7` |

## Duplication

- Audit runs are committed several times over. `reports/audit/visual-all` (2,989 files) has 6 sibling `.visual-all-staging-runtime-audit-full-<timestamp>-<uuid>` copies of about 2,988 files each, plus `.previous-2026-08-11T19-26-17-161Z` (2,826). Together that is 17,344 files and about 1.18 GB of near-duplicate screenshots in HEAD.
- There are 45 root-level probe scripts that are near-copies (`probe-pb2.mjs` through `probe-pb6.mjs`, `probe-dom.mjs`/`probe-dom2.mjs`, `probe-inner.mjs`/`probe-inner2.mjs`, `audit-story-probe.mjs`/`audit-story-probe2.mjs`, `probe-bottom-live.mjs`/`probe-bottom2-live.mjs`). Each hardcodes `http://localhost:6006` and a single story id (e.g. `probe-pb6.mjs:2-5`).
- The same job has several migration and fix scripts: `scripts/apply-glass-migration.js`, `comprehensive-glass-migration.js`, `final-glass-migration.js`, `complete-100-percent-migration.js`; `fix-duplicate-classnames.py` and `fix-all-duplicate-classnames.py`; `remove-use-client.js`, `remove-all-use-client.cjs`, `remove-remaining-use-client.cjs`; `scan-all-errors.js`, `scan-context-errors.js`, `scan-javascript-errors.js`, `find-all-context-errors.js`, `find-critical-errors.js`, `final-error-scan.js`.
- Release narrative lives in 4 overlapping places: CHANGELOG.md, root RELEASE_NOTES_*.md (5), `reports/3.x-release/` directories, and `reports/3.0.7-*.md`. They disagree with each other (see HISTORY-HYGIENE-05).
- Three Playwright configs (`playwright.config.ts`, `playwright.visual-ci.config.ts`, `playwright.visual-matrix.config.ts`), two Jest configs, and two ESLint configs (`.eslintrc.js` and `eslint.config.js`) plus `eslint-plugin-auraglass.js` at the root.
- Two Redis clients (`redis` and `ioredis`) and two socket.io packages are all in runtime `dependencies`.

## Fake complexity

- The "quantum/consciousness/biometric/emotional intelligence" layer: `src/components/quantum/*` (GlassQuantumField, GlassSuperpositionalMenu, GlassWaveFunction, QuantumNeuromorphicEngine.ts, ...), `src/utils/consciousnessOptimization.ts`, `src/contexts/ConsciousnessStreamProvider.tsx`, `src/tests/consciousness/*`, `src/components/advanced/GlassBiometricAdaptation.tsx`, and `src/workers/{biometricWorker,eyeTrackingWorker,predictiveWorker}.ts`. That is 52 file paths matching quantum/biometric/consciousness/emotion/predictive. They came from one bulk commit (`a114af13d`) with no product rationale. They are visual effects with sci-fi naming, and their presence lowers the credibility of the serious components. The workers are tracked even though `.gitignore:16` ignores `workers/` (3 files reported by `git ls-files -ci --exclude-standard`).
- A hosted backend inside a component library: `server/index.ts` (659 LOC), `server/api-server.js`, `server/websocket-server.js`, `Dockerfile` ("Multi-stage Docker build for AuraGlass AI System"), `docker-compose.yml` (redis + api), and `nginx.conf`. They are exposed via package exports `./server` (package.json:215) and `./services/ai/openai-service` (package.json:190), and `rollup.config.js:208` builds `src/server/index.ts`. `server/README.md:3` calls it optional, but package.json:486-510 makes the stack mandatory.
- The "certification" machinery is out of proportion. 23,947 PNGs and a 5.9 MB `render-ledger.partial.json` sit next to only one open issue, which asks for the human screen-reader/touch certification that the automated pipeline cannot provide. Hundreds of commits of evidence stand in for review.
- Semver theatre: `fix(ssr)!` breaking markers shipped as 2.0.x patches; a jump from 2.0.39 to 2.0.98; a 3.0.0 "public platform relaunch" major with zero export-key changes (`reports/breaking-change-review.md`, "Removed export keys: 0"); and a 4.0.0 that is +89 lines.

## Dead / orphaned code (verified: zero references by name in src, scripts, .storybook, rollup, package.json)

| File | LOC |
| --- | --- |
| `src/utils/smartColorExtraction.ts` | 1,028 |
| `src/utils/a11yTesting.ts` | 725 |
| `src/client/pages/SettingsPage.tsx` | 507 |
| `src/components/charts/styles/TooltipStyles.tsx` | 474 |
| `src/components/advanced/StorybookVisualShowcase.tsx` (Storybook-only code inside the shipped component tree) | 416 |
| `src/utils/dynamicTheme.ts` | 373 |
| `src/types/glass-api-stable.ts` (1 self-referencing hit) | 315 |
| `src/core/foundation/glassFoundation.ts` | 247 |

That is about 4,085 LOC confirmed dead. A broader import-graph heuristic flagged 68 files, but most of those are subpath entry barrels and need a knip or ts-prune pass to confirm.

## Critical findings

| ID | Severity | Claim | Evidence |
| --- | --- | --- | --- |
| HISTORY-HYGIENE-01 | critical | The repo is 99.4% committed audit artifacts: a 2.95 GB HEAD tree, a 1.86 GB pack, and 23,947 PNGs. Cloning is prohibitive for contributors and CI. | `git ls-tree -r -l HEAD`: reports 2,930 MB vs src 14 MB; `git count-objects -vH` size-pack 1.86 GiB; `reports/audit/full-tint-ledger/` 21,163 files; largest blobs `reports/audit/accessibility-neutral/contact-sheet-0.png` 5.9 MB |
| HISTORY-HYGIENE-02 | critical | The published UI package declares a full backend stack as runtime `dependencies`, so every `npm install aura-glass` pulls express, redis, ioredis, socket.io, jsonwebtoken, bcryptjs, openai, Pinecone, Google Vision, @sentry/node, helmet, cors, and dotenv. This was introduced in 3.3.0. | `package.json:486-510`; `git show 9cc6ff168 -- package.json`; `npm view aura-glass@4.1.0 dependencies` confirms on the registry |
| HISTORY-HYGIENE-03 | high | 454 "payload batch" commits plus 276 single-screenshot commits (66% of history) carry no reviewable change and drown out the real history. | `git log --grep='payload batch'` (47,805 files, 5.65M lines, all 2026-08-14); "Add glassmorphism certification screenshot" commits `83b5cd32e`..`b1568ace4` (2026-05-05) |
| HISTORY-HYGIENE-04 | high | 17,344 tracked files (about 1.18 GB) are duplicate hidden staging and previous copies of the same visual audit run. | `reports/audit/.visual-all-staging-runtime-audit-full-20260813033308-*/`, `...20260814013957-*/`, `reports/audit/.previous-2026-08-11T19-26-17-161Z/` |
| HISTORY-HYGIENE-05 | high | Release records contradict the registry. 3.4.8 "security release" is in the CHANGELOG but not on npm; 3.5.0 is on npm but not in the CHANGELOG; 3.0.7 is "Unreleased" but published; 2.17.0 and 2.16.4 are listed but unpublished; an "Unreleased" header and preamble sit mid-file; 2.0.7 is ordered above 2.0.8; tags are missing for v3.4.8, v3.5.0, v3.0.7, and all of v1. | `CHANGELOG.md:34`, `:274`, `:490-495`, `:497`, `:509`, `:635-637`; `npm view aura-glass versions`; `git tag` |
| HISTORY-HYGIENE-06 | high | The library ships an AI/auth server with 5 `@ts-nocheck` files and Docker/nginx/compose infrastructure. This is out of scope for a design system, and the security surface is shipped to UI consumers. | `server/index.ts` (659 LOC); `src/services/ai/openai-service.ts:1`, `src/services/auth/middleware.ts:1`; `Dockerfile:1`; `docker-compose.yml`; `nginx.conf`; package.json exports `./server` (:215), `./services/ai/openai-service` (:190); `rollup.config.js:208` |
| HISTORY-HYGIENE-07 | medium | Core history is opaque megacommits generated by agents, so blame and bisect are useless for the components that matter. | `cd3767481` +135,934; `a114af13d` 844 files +122,768; `841fecd00` "save changes before push (via Codex CLI)" 769 files; `66059a3fd` +91,672 |
| HISTORY-HYGIENE-08 | medium | Pseudo-science feature families (quantum, consciousness, biometric, eye-tracking, emotional intelligence) arrived in one bulk commit with no rationale and remain in the shipped surface. | `src/components/quantum/QuantumNeuromorphicEngine.ts`, `src/utils/consciousnessOptimization.ts`, `src/components/advanced/GlassBiometricAdaptation.tsx`, `src/workers/eyeTrackingWorker.ts`, all added in `a114af13d` |
| HISTORY-HYGIENE-09 | medium | 45 throwaway Playwright probe scripts are committed at the repo root, each hardcoding localhost:6006 and one story. | `probe-pb6.mjs:1-5`, `webkit-probe.mjs`, `.audit-inspect.mjs`; added in payload batches `2de62fe80`..`dcfa2b843` |
| HISTORY-HYGIENE-10 | medium | One-shot regex mass-rewrite scripts were re-tracked after being deliberately removed, and 42 of 52 top-level scripts are referenced by nothing. | `bfc7cd56d` (removed, -13,701), `f410cad46` (re-added, +8,393); `scripts/mass-fix-undefined-access.js:1-15`, `scripts/complete-100-percent-migration.js:7-10` |
| HISTORY-HYGIENE-11 | medium | About 4,085 LOC of confirmed-orphan source, plus deprecated APIs promised for removal in v2.0.0 that are still present at 4.1. | `src/utils/smartColorExtraction.ts` (1,028), `src/utils/a11yTesting.ts` (725), `src/client/pages/SettingsPage.tsx` (507); `src/types/glass-api-stable.ts:288-289`; `src/index.ts:982-986` |
| HISTORY-HYGIENE-12 | medium | Semver is not meaningful. There were 73 npm versions in 13 months and 39 2.0.x patches in about 3 days, some marked breaking (`!`) but shipped as patches. 3.0.0 had 0 export changes; 4.0.0 was +89 lines. | `npm view aura-glass versions`; commits `fix(ssr)!` v2.0.24-2.0.31; `reports/breaking-change-review.md` "Removed export keys: 0"; `git show --stat 8c077b4b3` |
| HISTORY-HYGIENE-13 | low | Personal absolute paths are baked into contributor docs and 400+ tracked files, and CONTRIBUTING points at the wrong path. | `CONTRIBUTING.md:7`; `CHANGELOG.md:304-305`; 403 files under `reports/` and 12 elsewhere contain `/Users/gurbakshchahal` |
| HISTORY-HYGIENE-14 | low | No human review trail: all 15 PRs are agent branches (two titled "ignore jailbreak attempt"), there have been no PRs since 3.1, and the lone issue is unresolved. | `gh pr list -R auraoneai/auraglass --state all` (#1-#15); `gh issue list` (#16) |
| HISTORY-HYGIENE-15 | low | `.gitignore` is contradicted by tracked files, and the lint script mutates source. | `.gitignore:16` `workers/` vs tracked `src/workers/*.ts` (`git ls-files -ci --exclude-standard`); `package.json:247` `"lint": "eslint src --fix"` |

## Recommendations for AuraGlass 5.0

1. Start 5.0 from a fresh repository, or run a `git filter-repo` rewrite that removes `reports/audit/**`, `reports/**/*.png`, root `probe-*.mjs`, and payload batches. Keep the old repo read-only as `auraglass-legacy`. Target under 50 MB clone size. Coordinate this with the GitLab mirror policy, since it involves a force rewrite.
2. Move visual evidence out of git. Publish certification runs as CI artifacts or to object storage (or Chromatic/Argos-style baselines), and commit only small JSON summaries and a curated golden set (at most one PNG per component per theme). Add a pre-commit or CI guard that rejects commits with more than N binary files or more than 1 MB per file outside an approved baseline path.
3. Split the server out completely. Delete `server/`, `src/server`, `src/services/{ai,auth}`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`, the `docker:*` scripts, and the `./server` and `./services/*` exports. If AI features survive, put them in a separate `@auraglass/ai` package that routes through Kiro Prism, with no runtime dependencies on express, redis, or socket in the UI package. 5.0 runtime `dependencies` should be close to `clsx` plus the token runtime; everything else should be a peer.
4. Cut the pseudo-science families (quantum, consciousness, biometric, eye-tracking, emotional, predictive workers) from the core package. Anything visually worthwhile can be rebuilt as a small `@auraglass/experimental` effects package with honest names.
5. Rebuild the release process around tooling. Use Changesets or release-please so that the CHANGELOG, tag, GitHub release, and npm publish come from one source. Add a CI check that every npm version has a tag and a CHANGELOG entry. Delete the root RELEASE_NOTES_* files and the `reports/3.0.7-*` and `3.x-release` folders, moving the historical ones to the legacy repo. Make the 5.0 deprecation message point to the current version.
6. Require PRs into `main` with a human approver, conventional commits, and a size limit. Ban "save changes before push" and "comprehensive overhaul" style megacommits by CI policy (for example, fail PRs over 2k changed lines unless labeled).
7. Remove dead code and debt before porting anything. Run knip or ts-prune and delete confirmed orphans (the about 4k LOC above), `glass-api-stable.ts`, deprecated mixins, Galileo aliases, and `StorybookVisualShowcase` in `src/components`. Ratchet `as any` down from 394 and require zero `@ts-nocheck`.
8. Cut `scripts/` to a documented set, with every script referenced from package.json or CI and none of the one-shot regex rewrites. Reduce the 101 npm scripts to about 20 and keep `lint` non-mutating (`lint:fix` separate).
9. Fix the contributor experience. Remove absolute paths from CONTRIBUTING, CHANGELOG, and scripts. Use a single ESLint, Jest, and Playwright config each. Write a five-minute setup that does not need Docker, Redis, or API keys.
10. Use semver strictly. Majors should mean API removals, documented by the automated export-map and peer diff from `breaking-change-review.md`, which should run in CI. Never ship `!` commits as patches.

## Verification (adversarial)

An independent pass re-ran every claim against git, the working tree, npm, and GitHub on 2026-10-06. It made no source changes.

| id | verdict | note |
|---|---|---|
| HISTORY-HYGIENE-01 | CONFIRMED | `git ls-tree -r -l HEAD` gives 2948.3 MB total: `reports/` is 2930.2 MB (99.39%) and `src/` is 14.1 MB. `git count-objects -vH` gives size-pack 1.86 GiB. `git ls-files '*.png'` returns 23,947. `reports/audit/full-tint-ledger` has 21,163 tracked files. `reports/` holds 47,342 tracked files. |
| HISTORY-HYGIENE-02 | CONFIRMED | `package.json:486-510` lists express, express-rate-limit, redis, ioredis, socket.io, jsonwebtoken, bcryptjs, openai, @pinecone-database/pinecone, @google-cloud/vision, @sentry/node, helmet, cors, compression, and dotenv under `dependencies`. In 3.2.0 (`git show 9cc6ff168^:package.json`), openai and @google-cloud/vision were only peers and none of the backend packages were runtime deps, so 9cc6ff168 (3.3.0) introduced them. `npm view aura-glass@4.1.0 dependencies` returns the same set. |
| HISTORY-HYGIENE-03 | PARTIAL | The counts are wrong, and the real numbers are worse. `git log --grep='payload batch'` returns 456 commits (454 "stage complete" plus 2 "stage remaining"), touching 47,856 file entries and 5,656,419 added lines, all dated 2026-08-14. The range 83b5cd32e^..b1568ace4 has 375 certification commits (not 276), all dated 2026-05-05; 229 of them change 1 file. Together that is 831 of 1,108 commits (75%, not 66%). "No reviewable change" is also wrong: the payload batches touched 664 distinct `src/` files plus scripts, tests, and .storybook. That is real source change buried in bulk commits, so it is unreviewable rather than absent. |
| HISTORY-HYGIENE-04 | CONFIRMED | `git ls-tree` gives exactly 17,344 tracked files and 1.180 GB under the 6 `.visual-all-staging-runtime-audit-full-2026081*` directories plus `.previous-2026-08-11T19-26-17-161Z`. Nuance: these are separate staging runs of the same audit, not byte-identical copies. That does not change the conclusion. |
| HISTORY-HYGIENE-05 | CONFIRMED | `CHANGELOG.md:34` has 3.4.8, which is not on npm. 3.5.0 is on npm but has no CHANGELOG heading. `CHANGELOG.md:274` says "3.0.7 - Unreleased", but 3.0.7 is on npm. 2.17.0 (:497) and 2.16.4 (:509) are not on npm. A mid-file `## Unreleased` sits at :490. `CHANGELOG.md:635-637` puts 2.0.7 before 2.0.8. `git tag` (31 tags) has no v3.4.8, v3.5.0, v3.0.7, or v1. |
| HISTORY-HYGIENE-06 | PARTIAL | `server/index.ts` is a 659-line Express app (express/cors/helmet imports at :1-3). `src/services/ai/openai-service.ts:1` and `src/services/auth/middleware.ts:1` are `@ts-nocheck`. The `./services/ai/*` and `./services/websocket/collaboration-service` subpaths are exported (`package.json:180-200`). But the `./server` subpath (`package.json:215-219`, `rollup.config.js:208`) builds `src/server/index.ts`, an SSR-utility entry, not the Express server. Dockerfile, nginx.conf, and docker-compose.yml are not in `files` (`package.json:232-238`: bin, dist, workers, README, LICENSE), so they are not exported or shipped. They are only wired up as npm scripts (`package.json:244-258`). The real issue is the exported AI/websocket service subpaths and the backend deps, not a shipped Docker or nginx stack. |
| HISTORY-HYGIENE-07 | CONFIRMED | `git show --shortstat`: cd3767481 changes 150 files (+135,934/-4,368); a114af13d changes 844 files (+122,768/-16,920); 841fecd00, "save changes before push (via Codex CLI)", changes 769 files (+42,102/-65,658); 66059a3fd changes 277 files (+91,672). "Useless" overstates it slightly, since bisect still works between megacommits, but attribution within them is effectively lost. |
| HISTORY-HYGIENE-08 | PARTIAL | The files exist and are shipped: `src/index.ts:518-540` exports GlassEyeTracking and GlassBiometricAdaptation, and quantum/consciousness appears 16 times in `src/index.ts`. They did not arrive in one commit, though. Per `git log --diff-filter=A`, consciousnessOptimization.ts and GlassBiometricAdaptation.tsx came in a114af13d. QuantumNeuromorphicEngine.ts came in 24f1e3e50 ("finalize export surface and bump to 2.0.8"). eyeTrackingWorker.ts came in 64de958d0 ("implement Web Workers for consciousness features (v2.0.19)"). "No rationale" holds in substance: no commit gives a design justification. |
| HISTORY-HYGIENE-09 | CONFIRMED | There are exactly 45 root-level `.mjs` files (probe-*, audit-*-probe, inspect-toggle, list-stories, webkit-probe, .audit-inspect), and all 45 contain `localhost:6006`. The 46th root file with that string is `.lighthouserc.js`, which is legitimate config. Each probe was added in a "stage complete AuraGlass payload batch" commit. |
| HISTORY-HYGIENE-10 | CONFIRMED | bfc7cd56d changes 56 files (-13,701) and f410cad46 changes 43 files (+8,393), as claimed. `scripts/mass-fix-undefined-access.js:1-15` is a self-described codebase-wide regex rewrite. `scripts/` has 52 top-level script files. The unreferenced count depends on method: excluding self, reports, and CHANGELOG, I find 36 that no other tracked file mentions, not 42. Either way it is the large majority. |
| HISTORY-HYGIENE-11 | CONFIRMED | Line counts match: 1028, 725, 507, 474, and 416, totaling 3,150 LOC for the five named files. The rest of the ~4,085 figure comes from files not listed here. `git grep -w` over src, .storybook, and stories finds no reference to any of the five outside its own file. `src/types/glass-api-stable.ts:288-289` says "@deprecated ... will be removed in v2.0.0" / "@removal v2.0.0", and it is still present at 4.1.0. `src/index.ts:982` has a deprecated interactiveGlass note that is still exported. |
| HISTORY-HYGIENE-12 | PARTIAL | npm lists 73 versions, and 39 of them are 2.0.x, published from 2025-11-07 to 2025-11-11 (about 4 days). There are 8 `fix(ssr)!` commits. 8c077b4b3 (4.0.0) changes 6 files (+89/-6). Two inaccuracies: the npm package was created on 2025-11-07, so the span is about 11 months, not 13. And `reports/breaking-change-review.md:5-18` compares only top-level `exports` subpath keys (20 vs 20) against 2.16.2. It does not show "zero export changes" at the symbol level. |
| HISTORY-HYGIENE-13 | CONFIRMED | `git grep -l '/Users/gurbakshchahal'` matches 403 files under reports and 15 outside it: CHANGELOG.md, CONTRIBUTING.md, 10 scripts, and 3 `src/workers/*.ts`. That is 15, not 12, and 3 of them are shipped source. `CONTRIBUTING.md:7` points at `/Users/gurbakshchahal/AuraGlass`, but the repo is at `/Users/gurbakshchahal/platforms/AuraGlass`. |
| HISTORY-HYGIENE-14 | CONFIRMED | `gh pr list --state all` returns 15 PRs, all authored by gchahal1982 on `claude/*`, `codex/*`, or `agent/*` branches. #6 and #7 are "Claude/ignore jailbreak attempt". The latest is #15 (2026-05-12, ship 3.1); there are none after it. `gh issue list --state all` returns only #16 (open). |
| HISTORY-HYGIENE-15 | CONFIRMED | `.gitignore:16` is `workers/`, unanchored, so it also matches `src/workers/`. `git ls-files -ci --exclude-standard` lists 3 tracked files: `src/workers/{biometric,eyeTracking,predictive}Worker.ts`. `package.json:247` is `"lint": "eslint src --fix"`, with a separate `lint:check` at :248. |
