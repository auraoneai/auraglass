# AuraGlass Release Rollback And Deprecation Runbook

This runbook covers a bad `aura-glass` release on any of the three npm dist-tag lines:

| Dist-tag | Line | Published from |
| --- | --- | --- |
| `latest` | 4.x before 5.0 GA, 5.x after GA | `release/4.x` (4.x), `main` (5.x) |
| `next` | 5.0 pre-releases (`-alpha.N`, `-beta.N`, `-rc.N`) | `next` |
| `v4-lts` | 4.x after 5.0 GA | `release/4.x` |

Every npm write below is a release-owner action with their own npm session; the agent and CI
never run these commands outside the tag pipeline (`plat:publish:npm`).

**`npm unpublish` is never a rollback step.** A published version may already be pinned in
consumer lockfiles, and unpublishing breaks every reproducible install. Roll back by moving a
dist-tag and deprecating the bad version. The only exception is an exposed secret or a legal
emergency that meets npm policy; that is an owner action with a decision record under
`docs/release/decisions/`, never part of a scenario below.

## Severity Levels

| Severity | Example | Action |
| --- | --- | --- |
| S1 | Package cannot install, imports crash, React bundled, secrets exposed, or unintended files shipped. | Move the dist-tag immediately, deprecate the bad version, publish a fixed patch, update the release notes. |
| S2 | Important component, type, CSS, token, material or Storybook regression. | Publish a fixed patch after verification; move the dist-tag if the bad version holds it. |
| S3 | Documentation, examples, metadata, warning noise or a minor visual issue. | Fix in the next patch unless the release owner chooses an immediate patch. |

Before any npm write, record the registry state in the incident record:

```bash
npm view aura-glass dist-tags --json
npm view aura-glass@<bad> version dist.integrity time --json
```

## Scenarios

### 1. Bad 4.x release before 5.0 GA

`latest` still points at 4.x. Move it back to the previous good 4.x version and deprecate the
bad one:

```bash
npm dist-tag add aura-glass@<prev> latest
npm deprecate aura-glass@<bad> "<msg>"
npm view aura-glass dist-tags --json
```

Then ship the forward fix as the next 4.x patch from `release/4.x` (or `release/4.1.x` for a
4.1.x patch) through the tag pipeline. A forward patch is preferred over a rollback when the
previous version carries known security or privacy defects (4.1.0).

### 2. Bad LTS patch (`v4-lts`)

After 5.0 GA, 4.x patches publish to `v4-lts`; `latest` stays on 5.x and is not touched:

```bash
npm dist-tag add aura-glass@<prev-4.x> v4-lts
npm deprecate aura-glass@<bad-4.x> "<msg>"
npm view aura-glass dist-tags --json
```

### 3. Bad pre-release (`next`)

Retag `next` to the previous good pre-release and deprecate the bad one. `latest` and `v4-lts`
are not touched; the fixed train publishes the next pre-release on schedule.

```bash
npm dist-tag add aura-glass@<prev-prerelease> next
npm deprecate aura-glass@<bad-prerelease> "<msg>"
```

### 4. Bad 5.0 GA (`latest` back to `v4-lts`)

Move `latest` to the version that `v4-lts` currently holds. 5.0 stays installable by exact
version; it is not unpublished.

```bash
npm view aura-glass dist-tags.v4-lts
npm dist-tag add aura-glass@<current-v4-lts> latest
npm deprecate aura-glass@<bad-5.x> "<msg>"
```

While `latest` is rolled back, a 4.x fix that must also land on `latest` is published by the
tag pipeline with the protected CI variable `AG_ROLLBACK_LATEST_TO_4X=true`. Without it,
`scripts/release/publish.mjs` and `scripts/release/dist-tag.mjs` refuse to move `latest`
backwards from 5.x to 4.x. Remove the variable as soon as a fixed 5.0.x takes `latest` again.

### 5. Tier regression

A rendering tier misbehaves on some devices. Consumers pin the tier while the fix ships:

```tsx
<AuraGlassProvider tier="standard">{app}</AuraGlassProvider>
```

The provider writes `data-ag-tier="standard"` on `<html>`; no package rollback is needed unless
`standard` itself is broken (then scenario 1, 2 or 4).

### 6. Unreadable material

Text over glass is unreadable on a backdrop the contrast solver missed. Consumers switch the
transparency preference while the fix ships:

```tsx
<AuraGlassProvider transparency="tinted">{app}</AuraGlassProvider>
```

or set the attribute directly: `data-ag-transparency="tinted"` (or `data-ag-transparency="solid"`
for no backdrop at all).

### 7. Codemod damage

`npx @auraglass/cli migrate 4to5` refuses to run on a dirty working tree (exit code 3) unless
`--allow-dirty` is passed, so its edits are always the only uncommitted changes. To undo a bad
run:

```bash
git status
git checkout .
npx @auraglass/cli migrate 4to5 --dry-run
```

Report the damaging transform with the `--dry-run` output so the codemod fixture suite gains
the failing case.

### 8. Removed item needed

A consumer depends on a component or export that 5.0 removed. Either stay on the 4.x LTS line:

```bash
npm install aura-glass@v4-lts
```

or install the registry item that replaces it into the app:

```bash
npx @auraglass/cli add <item>
```

The breaking-change register (`docs/release/breaking-changes.json`, B3) lists both paths for
removed exports; the `removed` codemod's TODO comment names the registry item per export where
one exists.

## GitHub Release And Tag Recovery

1. If a GitHub Release exists for the bad version, edit its notes with the bad version, the
   affected install range, the recommended fixed or previous version, the user impact and the
   mitigation commands from the scenario above.
2. Do not rewrite a released Git tag unless the release owner explicitly approves. Prefer a new
   patch tag.
3. Create the GitHub Release for every published tag (operator step, REQ-PLAT-16). The GitLab
   tag pipeline creates the GitLab Release itself (`plat:release:notes`, `release:` keyword) and
   leaves `release-notes.md` and `dist-maps.tgz` as artifacts of that job. After the pipeline is
   green, the release owner downloads those two artifacts and runs, with the existing `gh` login:

   ```bash
   gh release create <tag> --notes-file release-notes.md dist-maps.tgz
   ```

   Add `--prerelease` for `-alpha.N`, `-beta.N` and `-rc.N` tags only.

## Consumer Mitigation Message

```text
aura-glass <bad> has been deprecated because <short reason>.
Use aura-glass@<fixed>. If you cannot upgrade immediately, pin aura-glass@<prev>.

npm install aura-glass@<fixed>
```

## Drill (AC-PLAT-19)

The rollback drill exercises scenarios 3 and 1 on a scratch pre-release in a GitLab pipeline.
Its record, with the real pipeline URL written by the job, lives in
`docs/release/decisions/rollback-drill.md`. The record stays open until that pipeline has run.
