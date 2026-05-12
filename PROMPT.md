# AuraGlass 3.0.7 Final Ship Prompt

You are the release agent for `aura-glass@3.0.7`.

Your job is not to keep reworking the website catalog. Your job is to get the package actually shipped to npm, verify the public registry package, then run the website against the public registry package as the final canary.

Package repo:

```text
/Users/gurbakshchahal/AuraGlass
```

Website proof repo:

```text
/Users/gurbakshchahal/auraglasswebsite
```

Canonical GitHub repo:

```text
https://github.com/auraoneai/auraglass
```

Current date:

```text
2026-05-12
```

## Non-Negotiable Completion Rule

Do not claim 3.0.7 is shipped until all of this is true:

```bash
npm view aura-glass version
```

returns:

```text
3.0.7
```

and the website has installed `aura-glass@3.0.7` from the public npm registry, not from `file:../AuraGlass` and not from a local `.tgz`, and the final website canary gates pass.

As of the latest verified state:

```text
npm view aura-glass version -> 3.0.6
npm whoami -> E401 Unauthorized
```

Therefore `aura-glass@3.0.7` is not shipped yet.

## Current State

The package/source work for 3.0.7 is already complete and pushed. Do not restart the 12-hour website loop unless fresh verification proves a regression.

Latest pushed commit:

```text
ddf9fee5 Record npm registry absence for 3.0.7
```

Important previous release commit:

```text
78e8fe45 Ship AuraGlass 3.0.7 release candidate
```

Public npm still reports:

```text
3.0.6
```

The latest GitHub publish workflow was re-run in case npm trusted publishing was fixed externally:

```text
Workflow: publish-npm.yml
Run ID: 25745656341
URL: https://github.com/auraoneai/auraglass/actions/runs/25745656341
Head SHA: ddf9fee57a34c8dc8515389b55437483dd75faeb
Status at prompt creation: completed
Conclusion: failure
```

It failed with the same npm permission error:

```text
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
npm notice publish Signed provenance statement with source and build information from GitHub Actions
npm notice publish Provenance statement published to transparency log: https://search.sigstore.dev/?logIndex=1519575493
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/aura-glass - Not found
npm error 404 The requested resource 'aura-glass@3.0.7' could not be found or you do not have permission to access it.
```

Inspect it if needed:

```bash
gh run view 25745656341 --repo auraoneai/auraglass --log-failed
```

## What Is Already Verified

Do not redo these unless files changed after `ddf9fee5`, or a gate fails with new evidence.

Package evidence:

- Local package is versioned as `aura-glass@3.0.7`.
- `npm run release:dry-run` passed.
- Package CI path passed.
- Coverage passed:

```text
415 suites passed
2,226 tests passed
339 snapshots passed
```

- `prepublishOnly` passed.
- `verify:pack` passed:
  - no nested `node_modules`
  - no bundled React runtimes
  - no dispatcher artifacts
- Next integration smoke passed.
- React 19 + Next 15 integration smoke passed.
- Dry tarball metadata:

```text
name: aura-glass
version: 3.0.7
package size: 8.0 MB
unpacked size: 42.7 MB
total files: 2038
```

Website canary evidence against the local 3.0.7 tarball:

- Website installed `/Users/gurbakshchahal/AuraGlass/aura-glass-3.0.7.tgz`.
- Full website audit passed under:

```text
/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.7-final/
```

- Expected full gate line:

```text
[verify] ALL THIRTEEN CHECKS PASSED
```

- Focused motion sweep passed under:

```text
/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.7-motion/motion-sweep.json
```

Expected motion sweep evidence:

```text
passed: true
discoveredPages: 16
uniqueCardCount: 281
renderedCardCount: 281
missingTargetIds: []
consoleErrors: []
pageErrors: []
```

Motion targets that passed:

- `glass-animated`
- `glass-animation-sequence`
- `glass-transitions`
- `glass-particles`
- `glass-particle-field`
- `glass-mesh-gradient`
- `glass-liquid-transition`
- `glass-webgl-shader`
- `glass-3d-engine`
- `glass-physics-engine`
- `glass-mood-ring`
- `dynamic-atmosphere`
- `glass-spotlight`
- `glass-carousel`

## Known Publish Blocker

The source work is not the blocker. npm authorization is the blocker.

The previous GitHub publish workflow:

```text
Run ID: 25739972652
Commit: 78e8fe456bdf314bc740465b86753636a9baedec
Result: failure
```

It passed the release gates, signed provenance, and failed only at npm publish:

```text
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
npm notice publish Signed provenance statement with source and build information from GitHub Actions
npm notice publish Provenance statement published to transparency log: https://search.sigstore.dev/?logIndex=1519212848
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/aura-glass - Not found
npm error 404 The requested resource 'aura-glass@3.0.7' could not be found or you do not have permission to access it.
```

Interpretation:

- GitHub Actions reached npm trusted-publishing/provenance flow.
- The final package PUT was rejected by npm.
- The npm package `aura-glass` is currently owned by:

```text
veeronecorp <gchahal@veerone.com>
```

- Local npm auth is invalid:

```text
npm whoami -> E401 Unauthorized
```

- `~/.npmrc` may contain a token, but npm rejects it.
- `gh secret list --repo auraoneai/auraglass` showed no `NPM_TOKEN`.
- `npm trust github aura-glass --repo auraoneai/auraglass --file publish-npm.yml --dry-run --json` validated the package/repo/workflow payload, but real trust setup requires a valid npm login.

## Six Parallel Lanes

Use six parallel agents only if the tooling/session supports it. Keep them scoped. Do not let them duplicate work or reopen the website catalog work unless a gate produces fresh failures.

Lane 1: npm Authorization

- Confirm current npm identity:

```bash
npm whoami
npm owner ls aura-glass
npm trust list aura-glass
```

- If npm auth is still `E401`, stop and report the blocker. The user or package owner must either:
  - run `npm login --auth-type=web` with a publish-capable npm account, or
  - configure npm trusted publishing for `auraoneai/auraglass`, or
  - add a valid GitHub secret `NPM_TOKEN`.

- Do not invent a token. Do not claim publish is possible without a valid npm identity/trust path.

Lane 2: GitHub Publish Workflow

- Do not rerun the workflow until npm authorization changes.
- The latest run already failed:

```text
Run ID: 25745656341
Conclusion: failure
Failure: npm E404 / no permission to publish aura-glass@3.0.7
```

- After npm trusted publishing or `NPM_TOKEN` is fixed, trigger a fresh run:

```bash
gh workflow run publish-npm.yml --repo auraoneai/auraglass -f version=3.0.7 --ref main
gh run list --repo auraoneai/auraglass --workflow publish-npm.yml --limit 1
gh run watch <NEW_RUN_ID> --repo auraoneai/auraglass --exit-status
```

- If the fresh run succeeds, immediately verify npm:

```bash
npm view aura-glass version
npm view aura-glass dist-tags --json
npm view aura-glass@3.0.7 repository.url
npm view aura-glass@3.0.7 bugs.url
```

- If it fails with the same npm `E404` / permission error, do not rerun blindly. Move to npm authorization remediation.

Lane 3: Package Gate Evidence

- If source files changed after `ddf9fee5`, rerun:

```bash
cd /Users/gurbakshchahal/AuraGlass
npm run release:dry-run
```

- If no source files changed, do not burn time re-running full test suites unless needed.
- If the package gate fails, fix the package. The package is the source of truth.

Lane 4: Registry Install Canary

Only run this after `npm view aura-glass version` returns `3.0.7`.

```bash
cd /Users/gurbakshchahal/auraglasswebsite
npm install aura-glass@3.0.7 --legacy-peer-deps --no-audit --no-fund --force
node -p "require('./node_modules/aura-glass/package.json').version"
node -p "require('./node_modules/aura-glass/package.json').repository?.url"
node -p "require('./node_modules/aura-glass/package.json').bugs?.url"
npm run typecheck -- --pretty false
npm run build
```

Then run the final website gate from the registry package:

```bash
cd /Users/gurbakshchahal/auraglasswebsite
lsof -ti :3021 | xargs kill -9 2>/dev/null || true
npx next start -p 3021
```

In another shell/session:

```bash
cd /Users/gurbakshchahal/auraglasswebsite
AUDIT_URL=http://localhost:3021 AUDIT_REPORT_DIR=reports/website-3.0.7-registry bash scripts/audit/run.sh
AUDIT_URL=http://localhost:3021 npx tsx scripts/audit/motion-sweep-307.ts
```

Do not leave `next start` running at the end unless the user explicitly asks for a local preview server.

Lane 5: Documentation and Metadata

Confirm the docs and metadata are not lying.

Required checks:

```bash
cd /Users/gurbakshchahal/AuraGlass
node -p "require('./package.json').version"
node -p "require('./package.json').repository"
node -p "require('./package.json').bugs"
rg -n "github.com/(?!auraoneai/auraglass)|GalileoGlass|GalileoElementInteractionPlugin|3\\.0\\.7" README.md CHANGELOG.md 3.0.7PRD.md docs llms.txt package.json src tests
```

Expected:

- `package.json` version is `3.0.7`.
- repository/bugs point to `github.com/auraoneai/auraglass`.
- New docs use `AuraElementInteractionPlugin`.
- `GalileoElementInteractionPlugin` may remain only as a deprecated compatibility alias.
- README/CHANGELOG/PRD/closure docs must not say 3.0.7 is published until npm proves it.

Lane 6: Final Closure Audit

Update the closure evidence only after the real final state is known.

Relevant docs:

```text
/Users/gurbakshchahal/AuraGlass/fixes307.md
/Users/gurbakshchahal/AuraGlass/3.0.7PRD.md
/Users/gurbakshchahal/AuraGlass/reports/3.0.7-closure.md
/Users/gurbakshchahal/AuraGlass/reports/3.0.7-completion-audit.md
```

If publish succeeds, record:

- npm package version output
- npm dist-tags
- GitHub workflow run ID and conclusion
- package gate status
- registry website canary gate status
- motion sweep status
- final remaining issues, if any

If publish remains blocked, record:

- exact npm error
- exact run ID
- exact npm auth status
- exact next human action required

## If npm Auth Is Fixed Locally

If the shell is authenticated to an npm account that can publish `aura-glass`, use the helper:

```bash
cd /Users/gurbakshchahal/AuraGlass
./scripts/publish-307-after-npm-login.sh
```

This helper should:

- verify npm identity
- run dry release gate
- publish `aura-glass@3.0.7`
- verify public npm returns `3.0.7`
- print the website registry canary commands

If using trusted publishing instead, configure it with:

```bash
cd /Users/gurbakshchahal/AuraGlass
npm login --auth-type=web
./scripts/configure-npm-trusted-publishing-307.sh
```

The expected trust binding is:

```text
Package: aura-glass
Provider: GitHub Actions
Organization: auraoneai
Repository: auraglass
Workflow filename: publish-npm.yml
Branch: main
Environment: none unless npm requires one and the workflow is updated to match
```

Then rerun:

```bash
gh workflow run publish-npm.yml --repo auraoneai/auraglass -f version=3.0.7 --ref main
gh run list --repo auraoneai/auraglass --workflow publish-npm.yml --limit 1
gh run watch <RUN_ID> --repo auraoneai/auraglass --exit-status
```

## What Not To Do

- Do not keep tuning website screenshots unless the registry canary gate fails.
- Do not replace real package components with hand-rolled website HTML/CSS.
- Do not fake motion with website overlays.
- Do not call local tarball verification a shipped release.
- Do not say "done" while npm returns `3.0.6`.
- Do not rerun failed GitHub publish workflows repeatedly without changing npm auth/trust/token state.
- Do not commit `.env`, npm tokens, browser caches, or local scratch files.
- Do not reset or revert unrelated user changes.

## Final Acceptance Criteria

The release is complete only when all checks below are true:

```bash
cd /Users/gurbakshchahal/AuraGlass
npm view aura-glass version
```

returns:

```text
3.0.7
```

and:

```bash
npm view aura-glass dist-tags --json
npm view aura-glass@3.0.7 repository.url
npm view aura-glass@3.0.7 bugs.url
```

show the expected latest tag and `auraoneai/auraglass` metadata.

Then:

```bash
cd /Users/gurbakshchahal/auraglasswebsite
node -p "require('./node_modules/aura-glass/package.json').version"
```

returns:

```text
3.0.7
```

from the public npm install, and:

```text
reports/website-3.0.7-registry/
```

contains a passing final gate and motion sweep.

Only after those pass may you call `aura-glass@3.0.7` shipped.
