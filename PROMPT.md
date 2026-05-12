# AuraGlass 3.0.7 Final Ship Prompt

You are working on the AuraGlass package release. Your job is to get `aura-glass@3.0.7` shipped in full, not to keep reworking the website.

Package repo:

```text
/Users/gurbakshchahal/AuraGlass
```

Website proof repo:

```text
/Users/gurbakshchahal/auraglasswebsite
```

Current date:

```text
2026-05-12
```

Canonical GitHub repo:

```text
https://github.com/auraoneai/auraglass
```

Primary objective:

```text
Publish aura-glass@3.0.7 to npm and verify the public registry reports 3.0.7.
```

Do not claim success until:

```bash
npm view aura-glass version
```

returns:

```text
3.0.7
```

As of the latest verified state, public npm still returns:

```text
3.0.6
```

So 3.0.7 is not shipped yet.

---

## 0. Current Known State

This is the current release state. Do not waste time re-fixing already-verified source work unless fresh evidence proves it regressed.

### Package State

- Local package repo is versioned as `aura-glass@3.0.7`.
- Latest pushed release commit:

```text
78e8fe45 Ship AuraGlass 3.0.7 release candidate
```

- `main` and `origin/main` currently point at `78e8fe45`.
- Public npm latest is still `3.0.6`.
- Local publish attempts were blocked by npm auth/permission:
  - `npm publish --provenance --access public` failed locally because provenance is not supported outside a recognized provider.
  - `npm publish --access public` failed locally for the same local provenance config issue.
  - `npm publish --access public --provenance=false` reached npm but failed with `E404 Not Found - PUT https://registry.npmjs.org/aura-glass - Not found` / no permission.
  - `npm whoami` returned `E401 Unauthorized`.

### GitHub Workflow State

GitHub auth works via `gh` as user `gchahal1982`.

Workflow:

```text
.github/workflows/publish-npm.yml
```

Existing workflow run:

```text
Run ID: 25739972652
URL: https://github.com/auraoneai/auraglass/actions/runs/25739972652
Head SHA: 78e8fe456bdf314bc740465b86753636a9baedec
Conclusion: failure
```

The workflow got through all release gates and failed only at npm publish.

Exact failure from GitHub Actions:

```text
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
npm notice publish Signed provenance statement with source and build information from GitHub Actions
npm notice publish Provenance statement published to transparency log: https://search.sigstore.dev/?logIndex=1519212848
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/aura-glass - Not found
npm error 404 The requested resource 'aura-glass@3.0.7' could not be found or you do not have permission to access it.
```

Interpretation:

- Trusted publishing is reaching npm and creating provenance.
- The final PUT is rejected because the GitHub trusted publisher / npm package ownership is not authorized for `aura-glass`, or the npm package is owned by a different user/org than this workflow is permitted to publish.
- The workflow did not use an `NPM_TOKEN`; the token path was skipped. `secrets.NPM_TOKEN` is likely absent.

### Verified Package Evidence

Do not redo this work unless a file changed after commit `78e8fe45`.

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
- `npm publish --dry-run --provenance --access public` completed.
- Dry tarball metadata:

```text
name: aura-glass
version: 3.0.7
package size: 8.0 MB
unpacked size: 42.7 MB
total files: 2038
```

Previously recorded local dry-run shasum:

```text
1d793ccb1a4bba8dcbcec4861a1279bc3a9427a0
```

GitHub publish workflow tarball shasum:

```text
78b2f63b000c1ffae62ced3f9fe0dedf5a6b2651
```

If shasums differ, do not panic by default. GitHub may rebuild generated artifacts in a clean environment. Verify package contents and gate output before treating this as a blocker.

### Verified Website Canary Evidence

Website repo:

```text
/Users/gurbakshchahal/auraglasswebsite
```

The website installed the local `aura-glass-3.0.7.tgz` and passed the final canary gates.

Focused motion sweep:

```text
/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.7-motion/motion-sweep.json
```

Expected evidence:

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

Full website gate:

```bash
cd /Users/gurbakshchahal/auraglasswebsite
AUDIT_URL=http://localhost:3021 AUDIT_REPORT_DIR=reports/website-3.0.7-final bash scripts/audit/run.sh
```

Expected evidence:

```text
[verify] ALL THIRTEEN CHECKS PASSED
```

Final website artifacts:

```text
/Users/gurbakshchahal/auraglasswebsite/reports/website-3.0.7-final/
```

Expected proof:

- typecheck passed
- build passed
- runtime passed across 20 routes, including `/components?page=12`
- contrast passed
- symmetry passed
- reachability passed
- inventory passed
- empty previews: 0 findings
- geometry: 0 findings
- visual density: 0 findings
- contact sheet generated
- `page-01.png` through `page-16.png` generated

Inventory proof:

```text
aura-glass@3.0.7
449 package component-like exports
449 website registry entries
100.0% coverage
0 missing
0 duplicates
1 intentional website-only entry
```

---

## 1. Hard Rules

- Do not say 3.0.7 is shipped until `npm view aura-glass version` returns `3.0.7`.
- Do not publish if package gates fail.
- Do not publish if website canary gates fail against the final tarball or final npm install.
- Do not hide package problems in website CSS.
- Do not replace real AuraGlass components with hand-rolled website mockups.
- Do not silently ignore npm publish failures.
- Do not reset or revert unrelated user changes.
- Do not commit `.env`, npm tokens, browser caches, Playwright caches, local logs with secrets, or unrelated scratch files.
- Preserve backwards compatibility for deprecated names such as `GalileoElementInteractionPlugin`.
- Keep canonical docs on the new org repo:

```text
https://github.com/auraoneai/auraglass
```

---

## 2. Use 6 Parallel Agents

Use six parallel agents or lanes. Do not have every agent redo the same audit. Each lane owns a distinct outcome.

### Agent 1 — Release Captain / Source Of Truth

Owns final status and stops duplication.

Tasks:

1. Confirm repo state:

```bash
cd /Users/gurbakshchahal/AuraGlass
git status --short
git rev-parse --short HEAD
git log -1 --oneline
node -p "require('./package.json').version"
npm view aura-glass version
```

2. Confirm `HEAD` is the pushed release candidate:

```text
78e8fe45
```

3. Read:

```text
fixes307.md
3.0.7PRD.md
reports/3.0.7-closure.md
```

4. Build a current checklist:

- package gates
- website gates
- docs
- git pushed
- npm publish
- npm latest verification

5. Keep a single live status table.

Acceptance:

- No duplicated work.
- Every lane reports a concrete pass/fail.
- Final answer is based on current command output, not stale summaries.

### Agent 2 — npm Publish Auth / Trusted Publishing

Owns the real blocker.

Tasks:

1. Pull and summarize the failed GitHub workflow logs:

```bash
gh run view 25739972652 --repo auraoneai/auraglass --json conclusion,status,url,headSha,createdAt,updatedAt
gh run view 25739972652 --repo auraoneai/auraglass --log-failed
```

2. Determine which path will publish:

Option A: npm trusted publishing.

Configure npm trusted publishing for package `aura-glass`:

```text
GitHub organization/repo: auraoneai/auraglass
Workflow filename: publish-npm.yml
Branch/ref: main
Environment: none unless npm requires one
Package: aura-glass
```

The npm CLI supports this directly. After authenticating as an npm owner/collaborator who can publish `aura-glass`, run:

```bash
npm trust github aura-glass --repo auraoneai/auraglass --file publish-npm.yml -y
npm trust list aura-glass
```

Validated dry-run shape:

```bash
npm trust github aura-glass --repo auraoneai/auraglass --file publish-npm.yml --dry-run --json
```

Expected dry-run payload:

```json
{
  "package": "aura-glass",
  "file": "publish-npm.yml",
  "repository": "auraoneai/auraglass"
}
```

Option B: `NPM_TOKEN` GitHub secret.

Create an npm automation/publish token with access to package `aura-glass`, then add it to:

```text
Repo: auraoneai/auraglass
Secret name: NPM_TOKEN
```

3. If local publish is attempted, first verify:

```bash
npm whoami
npm access ls-packages
npm owner ls aura-glass
```

4. Do not ask the package source agents to keep changing code if the only failure is npm permission.

Acceptance:

- Publish path is explicitly chosen.
- If blocked, exact human action is documented.
- If unblocked, workflow is rerun and watched to completion.

### Agent 3 — Package Gate Verifier

Owns package release quality, not npm permissions.

Tasks:

1. From package repo:

```bash
cd /Users/gurbakshchahal/AuraGlass
npm run typecheck -- --pretty false
npm run build
npm run verify:pack
npm run release:dry-run
```

2. If `release:dry-run` is too slow, do not skip it silently. Explain and run the intended equivalent release suite from `package.json`.

3. Verify package metadata:

```bash
node - <<'NODE'
const p = require('./package.json')
console.log({
  name: p.name,
  version: p.version,
  repository: p.repository,
  bugs: p.bugs,
  homepage: p.homepage
})
NODE
```

Expected:

```text
name: aura-glass
version: 3.0.7
repository: git+https://github.com/auraoneai/auraglass.git
bugs: https://github.com/auraoneai/auraglass/issues
```

4. If any package gate fails, fix root cause in the package and rerun the gate.

Acceptance:

- Package gate evidence is current after any edits.
- No source gate failure remains before publish.

### Agent 4 — Website Canary Verifier

Owns website proof that the package actually works.

Tasks before publish:

1. Repack final package:

```bash
cd /Users/gurbakshchahal/AuraGlass
npm pack --silent
```

2. Install final tarball into website:

```bash
cd /Users/gurbakshchahal/auraglasswebsite
npm install /Users/gurbakshchahal/AuraGlass/aura-glass-3.0.7.tgz --legacy-peer-deps --no-audit --no-fund --force
node -e "const p=require('./node_modules/aura-glass/package.json'); console.log(p.version, p.repository, p.bugs)"
```

3. Run:

```bash
npm run typecheck -- --pretty false
npm run build
```

4. Start local prod server:

```bash
lsof -ti :3021 | xargs kill -9 2>/dev/null || true
npx next start -p 3021
```

5. Run focused motion sweep:

```bash
AUDIT_URL=http://localhost:3021 npx tsx scripts/audit/motion-sweep-307.ts
```

6. Run full website gate:

```bash
AUDIT_URL=http://localhost:3021 AUDIT_REPORT_DIR=reports/website-3.0.7-final bash scripts/audit/run.sh
```

Tasks after publish:

1. Install from public npm, not local tarball:

```bash
cd /Users/gurbakshchahal/auraglasswebsite
npm install aura-glass@3.0.7 --legacy-peer-deps --no-audit --no-fund --force
node -e "const p=require('./node_modules/aura-glass/package.json'); console.log(p.version, p.repository, p.bugs)"
```

2. Rerun website typecheck/build and at least the full audit gate.

Acceptance:

- Local tarball canary passes before publish.
- Registry install canary passes after publish.
- No page 12 slowdown/crash.
- No blank/static motion targets.
- No truncated component cards.
- No dirty button rims/background bleed.
- No PreviewBoundary catches.
- No console/page errors.

### Agent 5 — Docs / Metadata / Closure

Owns the paper trail.

Tasks:

1. Verify and update, if needed:

```text
README.md
CHANGELOG.md
3.0.7PRD.md
fixes307.md
reports/3.0.7-closure.md
llms.txt
docs/**
package.json
```

2. Ensure docs mention:

- `aura-glass@3.0.7`
- Marketing Kit APIs
- `GlassButton variant="aurora"`
- compact/contained/demo fixes
- motion fixes
- `AuraElementInteractionPlugin` as canonical
- `GalileoElementInteractionPlugin` as deprecated alias
- canonical repo `https://github.com/auraoneai/auraglass`
- final package and website gate evidence
- npm publish status

3. Add the exact GitHub workflow publish failure to `reports/3.0.7-closure.md` if it is not already recorded:

```text
GitHub Actions trusted publishing reached npm, signed provenance, then failed with E404 / no permission for aura-glass@3.0.7.
Run ID: 25739972652
```

4. After successful publish, move changelog status from release-candidate/unreleased wording to shipped wording.

Acceptance:

- Docs do not claim 3.0.7 shipped before npm confirms it.
- After publish, docs/changelog accurately say 3.0.7 is shipped.
- No old `GalileoGlass` branding remains except deprecated compatibility notes.
- No stale old repo URL remains where the canonical repo should be used.

### Agent 6 — GitHub Release / Tags / Final Verification

Owns final public release hygiene.

Tasks after npm publish succeeds:

1. Verify npm:

```bash
npm view aura-glass version
npm view aura-glass repository.url
npm view aura-glass bugs.url
npm view aura-glass dist-tags --json
```

Required:

```text
version: 3.0.7
repository: github.com/auraoneai/auraglass
bugs: github.com/auraoneai/auraglass/issues
latest: 3.0.7
```

2. Create and push tag if missing:

```bash
git tag --list "v3.0.7"
git tag -a v3.0.7 -m "Release aura-glass@3.0.7"
git push origin v3.0.7
```

3. Create GitHub release if expected by repo process:

```bash
gh release create v3.0.7 --repo auraoneai/auraglass --title "AuraGlass 3.0.7" --notes-file <release-notes-file>
```

4. Verify install smoke from registry in a clean temp dir:

```bash
tmp="$(mktemp -d)"
cd "$tmp"
npm init -y
npm install aura-glass@3.0.7 react react-dom --no-audit --no-fund
node - <<'NODE'
const pkg = require('aura-glass/package.json')
console.log(pkg.version)
NODE
```

Acceptance:

- npm latest is `3.0.7`.
- Git tag exists on origin.
- GitHub release exists if required.
- Clean install from npm works.

---

## 3. Final Required Command Sequence

This is the clean path once npm permissions/trusted publishing are fixed.

### Trigger GitHub Publish Workflow

```bash
cd /Users/gurbakshchahal/AuraGlass
gh workflow run publish-npm.yml --repo auraoneai/auraglass -f version=3.0.7 --ref main
```

Find the latest run:

```bash
gh run list --repo auraoneai/auraglass --workflow publish-npm.yml --limit 5
```

Watch it:

```bash
gh run watch <RUN_ID> --repo auraoneai/auraglass --exit-status
```

If it fails:

```bash
gh run view <RUN_ID> --repo auraoneai/auraglass --log-failed
```

Do not proceed until the failure is understood.

### Verify Public npm

```bash
npm view aura-glass version
npm view aura-glass dist-tags --json
npm view aura-glass repository.url
npm view aura-glass bugs.url
```

Required:

```text
3.0.7
```

### Verify Website Against Registry Install

```bash
cd /Users/gurbakshchahal/auraglasswebsite
npm install aura-glass@3.0.7 --legacy-peer-deps --no-audit --no-fund --force
npm run typecheck -- --pretty false
npm run build
lsof -ti :3021 | xargs kill -9 2>/dev/null || true
npx next start -p 3021
AUDIT_URL=http://localhost:3021 AUDIT_REPORT_DIR=reports/website-3.0.7-registry bash scripts/audit/run.sh
AUDIT_URL=http://localhost:3021 npx tsx scripts/audit/motion-sweep-307.ts
```

Required:

```text
[verify] ALL THIRTEEN CHECKS PASSED
motion-sweep passed: true
```

---

## 4. If npm Publish Is Still Blocked

If npm publish still fails with `E404` / permission:

Do not keep editing package source.

Report exactly this class of blocker:

```text
The package and website gates are clean, but npm rejected publish for aura-glass@3.0.7.
The remaining action is npm package ownership/trusted-publisher authorization.
```

Then provide the exact remediation:

### Trusted Publishing Remediation

In npmjs.com for package `aura-glass`, add or repair a trusted publisher:

```text
Provider: GitHub Actions
Organization: auraoneai
Repository: auraglass
Workflow filename: publish-npm.yml
Branch: main
Environment: none, unless npm requires one and the workflow is updated to match
```

Equivalent npm CLI command, once logged in as an npm owner/collaborator with publish rights:

```bash
npm trust github aura-glass --repo auraoneai/auraglass --file publish-npm.yml -y
npm trust list aura-glass
```

Or use the repo helper script:

```bash
cd /Users/gurbakshchahal/AuraGlass
./scripts/configure-npm-trusted-publishing-307.sh
```

Then rerun:

```bash
gh workflow run publish-npm.yml --repo auraoneai/auraglass -f version=3.0.7 --ref main
```

### NPM_TOKEN Remediation

Alternatively, create an npm automation token or publish token that has publish rights for `aura-glass`, then add it as:

```text
GitHub repo secret: NPM_TOKEN
Repo: auraoneai/auraglass
```

Then rerun:

```bash
gh workflow run publish-npm.yml --repo auraoneai/auraglass -f version=3.0.7 --ref main
```

If local publish is desired instead, authenticate this shell first:

```bash
npm login --auth-type=web
npm whoami
npm owner ls aura-glass
./scripts/publish-307-after-npm-login.sh
```

Only do this if the authenticated npm user has publish rights to `aura-glass`.

---

## 5. Final Acceptance Criteria

3.0.7 is complete only when all of these are true:

- `npm view aura-glass version` returns `3.0.7`.
- `npm view aura-glass dist-tags --json` shows `latest: 3.0.7`.
- npm metadata points at `github.com/auraoneai/auraglass`.
- GitHub publish workflow succeeds or local publish succeeds with recorded command output.
- Package release gates pass after final source changes.
- Website passes the full audit gate after installing `aura-glass@3.0.7` from npm registry.
- Website focused motion sweep passes after registry install.
- README and CHANGELOG reflect shipped `3.0.7`.
- `reports/3.0.7-closure.md` records:
  - package gate evidence
  - website gate evidence
  - npm publish evidence
  - npm latest verification
  - GitHub run URL or local publish command
- Git tag `v3.0.7` exists on origin, if this repo uses release tags.
- No unresolved release blocker remains.

---

## 6. Final Response Format

When done, respond with a short factual release report:

```text
AuraGlass 3.0.7 status: shipped / blocked

Package:
- version:
- release gate:
- tarball:

Website:
- registry install:
- full gate:
- motion sweep:

npm:
- npm latest:
- publish method:
- workflow/local publish evidence:

Docs:
- README:
- CHANGELOG:
- closure report:

Remaining blockers:
- none / exact blocker
```

If npm publish is blocked, the final status must be:

```text
blocked
```

not:

```text
done
```

The only acceptable shipped status is public npm latest returning `3.0.7`.
