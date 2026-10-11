# Release rollback & deprecation runbook

How to back out of an AuraGlass release — app-side (a consumer reverting to
4.x) and publish-side (us moving a dist-tag or deprecating a version). Every
scenario is a runbook: copy the commands, then record the drill outcome under
`docs/release/decisions/` (AC-PLAT-19).

## Commandment

**Never `npm unpublish`.** A published tarball may already be pinned in
consumer lockfiles; unpublish breaks every reproducible install. Rollback is
done by *moving dist-tags* and *deprecating the bad version* — history stays
immutable.

## Tiers

`distTagFor(version, { tier })` classifies every rollback:

| `tier` | When | Who |
| --- | --- | --- |
| `standard` | Post-release defect with no security exposure | Release owner + one reviewer |
| `emergency` | Security/legal exposure in the published artifact | Owner + second reviewer, decision record required |

`standard` is the default and covers everything except exposed secrets or a
shipping artifact that is itself the vulnerability.

## Scenarios

### S1 — Consumer reverts to the 4.x LTS line (app-side)

```sh
npm install aura-glass@v4-lts
git checkout .                # discard any half-applied codemod output
npm ci && npm run build       # verify the app builds against 4.x
```

Glass surfaces keep their appearance through `data-ag-transparency` — the
attribute is read on both lines, so a rollback never leaves a surface
transparent-less or opaque-by-accident. Run `git checkout .` *before*
reinstalling so stale `data-ag-*` migrations can't stick.

### S2 — Roll back `latest` to 4.x after a bad 5.x (publish-side)

```sh
AG_ROLLBACK_LATEST_TO_4X=true \
  node scripts/release/dist-tag.mjs --move latest --version 4.9.9
```

`monotonicViolation` fails a backward `latest` move unless
`AG_ROLLBACK_LATEST_TO_4X=true` is set — the env var is the recorded human
intent, not a bypass. `distTagFor(v, { rollback: true })` resolves the bad
version's tag so `latest` lands on the newest 4.x.

### S3 — Deprecate a bad published version

```sh
npm deprecate aura-glass@5.0.0 "Pulled: <reason>. Pin aura-glass@v4-lts instead."
npm dist-tag add aura-glass@4.9.9 latest
```

Deprecation warns on install without breaking existing lockfiles. Do it even
when `latest` has already moved — installed copies still surface the warning.

### S4 — Abort mid-codemod (`migrate 4to5` half-applied)

```sh
git checkout .                # the codemod is a pure worktree rewrite
git clean -fd src/            # drop any files it added
npm install                   # restore the 4.x-installed node_modules
```

### S5 — Bad alpha/beta on `next` or `canary` tag

```sh
npm dist-tag rm aura-glass next                # if the tag must be retired
npm deprecate aura-glass@5.0.0-alpha.7 "bad alpha — superseded"
```

Prerelease tags are safe to move: they carry no `latest` consumers and the
fixed train republishes the next cadence anyway.

### S6 — `emergency` tier: secret or legal exposure in the tarball

```sh
# Recorded decision record + owner sign-off FIRST, then:
npm deprecate aura-glass@<v> "withdrawn — see docs/security/advisories/"
npm dist-tag add aura-glass@<good-v> latest
# npm unpublish only inside npm's window AND only with the recorded exception.
```

`tier="emergency"` is the only path where unpublish is even discussable, and
still only for single versions inside npm's unpublish window.

### S7 — 4.x hotfix must outrank a broken 4.x

```sh
git checkout -b release/4.x-hotfix origin/release/4.x
# fix, changelog, tag v4.x.y
AG_ROLLBACK_LATEST_TO_4X=true \
  node scripts/release/dist-tag.mjs --move latest --version <fixed-4.x>
```

### S8 — Post-GA rollback while `v4-lts` already points correctly

```sh
node scripts/release/verify-release-ledger.mjs --cut 4.1.1   # ledgers must agree
npm dist-tag add aura-glass@4.9.9 latest                     # recorded rollback
```

After GA the `v4-lts` tag already exists — `latest` returns to it while the
LTS clock keeps running.

## Drill record (AC-PLAT-19)

The drill is a CI job, never a hand-typed record. Run the manual job
`plat:release:rollback-drill` on a green `release/4.1.x` pipeline. It executes
S2 and S3 against the job's ephemeral registry (verdaccio service) with a
scratch package (`@ag-drill/aura-glass` at 4.9.9 / 5.0.0):

```sh
node scripts/release/rollback-drill.mjs --registry http://verdaccio:4873 --out-dir docs/release/drills
```

Steps it runs and records (argv, exit code, output): publish both versions
(`latest` = 5.0.0, `v4-lts` = 4.9.9); S2 `dist-tag.mjs --move latest --version
4.9.9` refused without `AG_ROLLBACK_LATEST_TO_4X`, then accepted with it;
S3 `npm deprecate` + `npm dist-tag add`; `npm view` dist-tags/versions after
each scenario. It writes `docs/release/drills/<date>.json` (and
`.artifacts/plat/rollback-drill.json`) with the pipeline and job URLs and a
digest. Commit the artifact file unchanged, then check it:

```sh
node scripts/release/rollback-drill.mjs --verify docs/release/drills/<date>.json
```

`--verify` fails on a non-GitLab pipeline/job URL, a missing or failed step,
any `npm unpublish`, a final `latest` other than 4.9.9, or an edit after the
job wrote the file.
