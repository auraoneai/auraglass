# AuraGlass Release Rollback And Deprecation Runbook

This runbook covers bad public `aura-glass` npm releases and matching GitHub tags. It is repository-side operational guidance; executing npm or GitHub changes still requires release-owner credentials and approval.

## Fixed Sequence

Every rollback follows the same five steps in order. Do not reorder; each step's evidence gates the next.

```text
1. Triage        -> classify severity (S1/S2/S3), capture the bad version + dist-tag state
2. Contain       -> move `latest` off the bad version; post the consumer notice
3. Verify fix    -> dry-run evidence (verify:pack + pack --dry-run + install smoke)
4. Deprecate     -> `npm deprecate` the bad version with the notice message
5. Recover       -> publish the fixed patch, realign tags/notes, run post-incident checklist
```

## Preflight Checklist

Run before step 4/5. Every box requires committed or recorded evidence — do not
deprecate or publish from memory.

```text
preflight:
  - [ ] dry-run passed: `npm run release:dry-run` output recorded (integrity + shasum)
  - [ ] pack contents verified: `npm pack --dry-run --json` file list attached to the incident record
  - [ ] install smoke passed on a clean project (both `import` and `require`)
  - [ ] target dist-tag state recorded: `npm view aura-glass dist-tags --json`
  - [ ] deprecation message drafted (see Consumer Mitigation Message template)
  - [ ] decision gate signed off: release owner (2FA-verified) approves the severity class
```

## The First-72-Hours Deprecation Window

A version less than 72 hours on npm may be **deprecated immediately** once the severity class and preflight pass — installs that already fetched it still resolve, so deprecation is the only safe signal. After 72 hours the version may be deeply installed in lockfiles; prefer `latest` moves plus deprecation, and never `npm unpublish` it: unpublish within the npm window breaks every lockfile that already references the tarball.

**Whole-package `npm unpublish` is forbidden.** Only a single version may ever be
unpublished, only inside npm's unpublish window, and only with owner sign-off recorded
in `docs/release/decisions/`.

## Decision Gates

| Gate | Approver | Evidence recorded |
| --- | --- | --- |
| Severity class | Release owner | Incident record in `docs/release/decisions/` |
| Deprecate now vs patch-first | Release owner | Preflight checklist output |
| `npm unpublish` of a single version | Owner + second reviewer | Decision record (rare; window-limited) |
| Tag rewrite | Owner only | Explicit record — default answer is no |

## Scope

- Public npm package releases.
- GitHub release notes and tags.
- Package-only consumers using CJS, ESM, CSS, tokens, recipes, workers, and optional self-hosted runtime exports.

This runbook does not cover live hosted infrastructure rollback. If a hosted runtime is deployed, use the deployment platform rollback process in addition to this package procedure.

## Before Any Release

1. Confirm the release commit passes `npm run release:dry-run`.
2. Confirm `npm run verify:pack` reports a clean install smoke and no nested runtimes.
3. Confirm `npm pack --dry-run --json` does not include unsupported source server entrypoints such as `server/api-server.js`.
4. Record the tarball filename, version, integrity, and shasum from the dry run.
5. Draft release notes that state the supported scope: public package plus optional self-hosted runtime contracts.

## Severity Levels

| Severity | Example | Action |
| --- | --- | --- |
| S1 | Package cannot install, imports crash, React runtime bundled, secrets exposed, or malicious/unintended files shipped. | Move `latest` immediately, publish a patch, deprecate the bad version, and update GitHub release notes. |
| S2 | Important component, type, CSS, token, recipe, worker, or Storybook regression. | Publish a patch after verification; move `latest` if the bad version is already `latest`. |
| S3 | Documentation, examples, metadata, warning noise, or minor visual issue. | Fix in the next patch unless release owner chooses immediate patch. |

## Immediate Containment

1. Identify the currently published version:

   ```bash
   npm view aura-glass version dist-tags versions --json
   ```

2. If the bad version is tagged as `latest`, move `latest` to the last known-good version:

   ```bash
   npm dist-tag add aura-glass@<last-good-version> latest
   npm view aura-glass dist-tags --json
   ```

3. Deprecate the bad version with an actionable message:

   ```bash
   npm deprecate aura-glass@<bad-version> "Do not use this release. Upgrade to <fixed-version> or downgrade to <last-good-version>; see <GitHub release or issue URL>."
   ```

4. Avoid `npm unpublish` except for an exposed-secret or legal/security emergency that meets npm policy and has release-owner approval. Prefer dist-tag movement plus deprecation because unpublish can break reproducible installs.

## Patch Release Procedure

1. Create a patch branch from the bad release tag or current main, whichever contains the fix with the least risk.
2. Apply only the rollback fix and required tests.
3. Run:

   ```bash
   npm run release:dry-run
   npm pack --dry-run --json
   ```

4. Inspect the dry-run pack output for:

   - Expected `dist/`, `bin/`, `workers/`, `README.md`, `LICENSE`, and `package.json` entries.
   - No nested `node_modules`.
   - No React, React DOM, or styled-components runtime bundles.
   - No unsupported source server files such as `server/api-server.js`.
   - No test reports, Playwright artifacts, screenshots, snapshots, caches, or local env files.

5. Publish the fixed patch with provenance when release infrastructure supports it:

   ```bash
   npm publish --access public --provenance
   ```

6. Verify public registry state:

   ```bash
   npm view aura-glass@<fixed-version> version dist.integrity dist.shasum time --json
   npm view aura-glass dist-tags --json
   ```

7. If needed, explicitly set `latest`:

   ```bash
   npm dist-tag add aura-glass@<fixed-version> latest
   ```

## GitHub Release And Tag Recovery

1. If a GitHub release exists for the bad version, edit its notes with:

   - Bad version.
   - Affected install range.
   - Recommended fixed or last-good version.
   - User impact.
   - Mitigation commands.

2. If the bad Git tag points to a released artifact, do not rewrite it unless the release owner explicitly approves. Prefer a new patch tag.
3. If a draft release exists but is unpublished, update or delete the draft before publishing the fixed tag.
4. Link the npm deprecation notice, issue, and fixed release from the GitHub release notes.

## Consumer Mitigation Message

Use this template for release notes, issue comments, and support responses:

```text
AuraGlass <bad-version> has been deprecated because <short reason>.
Use aura-glass@<fixed-version>. If you cannot upgrade immediately, pin aura-glass@<last-good-version>.

npm install aura-glass@<fixed-version>
```

Include any migration steps or known workarounds after the install command.

## Post-Incident Checklist

- [ ] `latest` points to the fixed or last-good version.
- [ ] Bad version is deprecated with a clear message.
- [ ] Fixed patch passes `npm run release:dry-run`.
- [ ] Registry integrity and shasum for the fixed version are recorded.
- [ ] GitHub release notes identify the bad version and the fixed version.
- [ ] Release evidence under `reports/` and [deployment.md](./deployment.md) are updated if the incident changes hosted-runtime or package guidance.
- [ ] A regression test or pack verification is added for the failure mode.

