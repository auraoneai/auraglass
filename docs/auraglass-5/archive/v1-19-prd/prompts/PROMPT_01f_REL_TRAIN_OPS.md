# PROMPT-01f (REL): Train-stop operations — 4.3.0 → 4.4 → alpha → beta → RC → GA → EOL

You are working in `/Users/gurbakshchahal/platforms/AuraGlass`. Source PRD: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (key REL, alias PRD-01) §4.5, §5.5 (REQ-REL-19 v5 triggers), §5.6 (REQ-REL-26..32 records), §5.8 (REQ-REL-36..39), §11.5, §16, §17, §18, §20 steps 10–14. Requirements: **REQ-REL-02 (5x flip), 14 (GA flip), 19 (v5 triggers), 27 (record), 28, 29, 30, 31, 32, 36 (publish), 37 (EOL), 38 (Discussions), 39 (5.0 notes)**. Acceptance: **AC-REL-04, 05 (4.3 half), 07, 10, 12, 13, 15 (budget half), 17 (RC half), 18, 19, 20**, and the PRD §18 definition of done. Tasks: REL-125..REL-139.

This prompt runs **once per train stop** with `STOP=<4.3.0 | 4.4.0 | alpha | beta | rc | ga | eol>`. Do only the section for that stop plus the "every stop" checks. Dates are estimates: a missed gate moves the date, never the gate (§14.1).

## Common rules

- Remote-first. Every gate run (canaries, visual, perf, `migrate 4to5` on canaries, builds) happens in GitHub Actions (public repo; `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or `auraone-remote-run`. No local Docker, browsers or publishing.
- Agents never push release tags, run `npm publish`/`dist-tag`/`deprecate`, pin Discussions or change npm settings. These are owner actions. Prepare the exact command, the generated body and the verification job, then record the owner's run URL.
- No fake completion. A gate record cites artifact URLs for every bullet. "Green" without a run URL counts as not met. No skipped lanes, lowered thresholds, re-baselined snapshots or waived P0s.
- Records go in `docs/release/decisions/<version>-gate.md` (the format below). Evidence stays in CI artifacts linked from the GitHub Release (D-32).
- Paths come from `scripts/release/lib/paths.mjs` (01a REL-001; `etc/api/`, root `deprecations.json`, `.github/workflows/publish-npm.yml`). Numeric claims in any release text come only from `claims.json` of the release run (`release-notes.mjs` enforces this).
- Cross-PRD prerequisites name owner tasks, never `PRD-xx` (SC-40): alpha needs MAT-047 (`Surface` environment matrix) and PERF-039 (remote perf lane); beta needs QA-087 (`consumer-4x-frozen`, L11), DX-060 (codemod canary) and FND-107 (removal gate); rc needs PKG-048 (`docs/size-budgets.json`), DX-060 and QA-087.

## May touch / must not touch

May touch: `docs/release/decisions/*-gate.md` and `*-rollback-drill.md` (NEW), `scripts/release/classify-change.mjs` and `scripts/release/lib/branch-policy.mjs` (only the 4.4 and RC rules), `tests/release/classify-change.test.ts` (add cases), the publish workflow (only the `on.push.tags` list), `scripts/release/api-report.mjs` (only the default-mode switch), `docs/release/lts-policy.md` (fill `{{GA_DATE}}` and the EOL dates), `README.md`/`llms.txt` banner blocks (from generated output), `docs/release/discussions/<version>.md` (NEW, generated Discussion bodies), `CHANGELOG.md` (generated section only).

Must not touch: component source, deprecation entries (4.4 entries go through 01e's rules on `release/4.x`), thresholds in any gate, or the frozen fixture.

## Every stop: prerequisites and checks

1. 01a–01e are merged on the branch this stop publishes from: `rg --files scripts/release | sort` lists `api-report classify-change dist-tag dry-run gen-deprecations release-notes verify-*` and `downstream-grep`.
2. `node scripts/release/verify-branch-protection.mjs --branch main` and `--branch release/4.x` both exit 0.
3. `npm run deprecations:check`, `node scripts/release/verify-release-ledger.mjs --pending <v>` and `node scripts/release/verify-breaking-register.mjs` (from 4.3) exit 0 in CI on the candidate SHA.
4. `change-class` against the previous tag on the same line is allowed for the target (§4.1).
5. The generated release body has passed `release-notes.mjs` + docs lint. AC-REL-18 needs a `Discussion:` link for 4.2, 4.3, beta.1, rc.1 and GA.

## Per-stop sections

**STOP=4.3.0 — REL-125 (REQ-REL-27, AC-REL-05 4.3 half, AC-REL-12 4.3)**
- `change-class --base v4.2.0`: ≤ C-D, removals 0.
- Every §11.1 C-B item has an entry with `since ≤ 4.3.0` (`verify-breaking-register` exit 0).
- The codemod fixture suite passes in `--dry-run`, and `@auraglass/cli@0.x` (or `aura-glass-cli`, D-23) is published (`npm view @auraglass/cli version`).
- The `preview="v5"` T0 baselines pass at both viewports (QA PRD artifact).
- `bin` prints the replacement command (CI log).
- `consumer-4x` passes unchanged.
- The 4.3 Discussion body goes to `docs/release/discussions/4.3.0.md`.

**STOP=4.4.0 — REL-126 (REQ-REL-28)** Before any 4.4 work, add the scope rule in `classify-change.mjs`: on `release/4.x` with a target version `4.4.x`, every added entry is C-D and its `breaking` ids exist in `docs/release/breaking-changes.json` (or are added in the same PR). Anything else fails. Add test cases for both (pass + fail). Publish 4.4.0 only if a beta found a missing deprecation, and record which beta finding triggered it.

**STOP=alpha — REL-127, REL-128, REL-129, REL-130 (REQ-REL-19, 02, 29; AC-REL-19)**
- REL-127: widen the publish workflow tags to `['v4.*.*', 'v5.*.*', 'v5.*.*-alpha.*', 'v5.*.*-beta.*', 'v5.*.*-rc.*']` before the first `5.0.0-alpha.1` tag. Extend `publish-workflow-rel.test.ts` to match.
- REL-128: once `package.json` `version` starts `5.`, `api-report.mjs` defaults to `--mode 5x`, so `unanalysable` is fatal on `main`. Prove it with the existing unanalysable fixture in CI.
- REL-129: each alpha is published from `main` with derived tag `next`. Verify with `verify-dist-tags`: `latest` is unchanged and still 4.x. Entry gate: the PRD-04 [MAT] environment matrix is green for `Surface` (MAT-047; artifact). Each alpha's notes list the §3.6 budget calibration results from the remote perf lane (via `claims.json`). Removals whose entries are `since: "4.3.0"` stay unmerged until 4.3.0 is on npm (checked by `classify-change`).
- REL-130 rollback drill (AC-REL-19), done by the release owner on a throwaway alpha:
  1. `npm dist-tag add aura-glass@<previous alpha> next`
  2. `verify-dist-tags`
  3. `npm dist-tag add aura-glass@<current alpha> next`
  4. `verify-dist-tags`

  Follow only `docs/release-rollback-deprecation.md` and time it (≤ 15 min). Record it in `docs/release/decisions/<date>-rollback-drill.md`: the start and end timestamps, both run URLs, and every point where the runbook was unclear (fix those in a follow-up PR).

**STOP=beta — REL-131 (REQ-REL-30, AC-REL-07, AC-REL-12 post-migrate)**
- `classify-change --base v4.3.0` on the beta SHA reports 0 removals lacking a published 4.x `since`, excluding allow-listed exceptions.
- Every removal is present: inventory REMOVE disposition ∩ root exports = 0 in `etc/api/index.exports.json`.
- All QA PRD consumer canaries are green, including `consumer-4x` after `migrate 4to5` (DX `codemod-canary.spec.ts`).
- The beta.1 Discussion body is generated.

**STOP=rc — REL-132, REL-133 (REQ-REL-31, AC-REL-13, AC-REL-15 budget, AC-REL-17 RC)**
- REL-132: add the RC freeze rule in `classify-change.mjs`. When the base tag matches `v5.0.0-rc.*`, any C-B in `etc/api/*.api.md` fails unless the PR carries label `P0` and the RC release notes list the PR. Add test cases for both.
- REL-133 records:
  - 0 open issues labelled `P0` (`gh issue list --label P0 --state open --json number`)
  - `migrate 4to5` gives 0 errors on every canary and every registry block, and a second run makes 0 changes (AC-REL-13)
  - the compat budget is met: `import { GlassButton } from 'aura-glass/compat'` ≤ the `{ Button }` budget + 2 KB min+gz; `compat/tokens.css` ≤ 8 KB gz; `compat/globals.css` ≤ 1 KB gz (rows in `docs/size-budgets.json`, PKG-048, checked by `scripts/ci/verify-size-budgets.mjs`; no `size-limit`)
  - the second downstream grep is attached with `servicesImports = 0` (01d `downstream-grep.mjs` with the same roots rule)
  - `consumer-4x` passes `next build`, the Vite build and render after `migrate 4to5` with 0 TODOs in the `flagship-subset.json` files, and the 390 px `/mobile` page has `scrollWidth ≤ 390`
  - the rc.1 Discussion body is generated

**STOP=ga — REL-134..REL-137 (REQ-REL-32, 36, 38, 39, 14; AC-REL-10, 18, 20)**
- The GA SHA is ≥ 4 weeks after the first P0-free RC (cite the dates).
- All §15 lanes are green on the GA SHA, and the claims are generated from that run.
- REL-134: the owner pushes `v5.0.0`, and the workflow derives `latest`. This publish is the promotion; no RC is retagged. Then the owner runs `npm dist-tag add aura-glass@<newest 4.x> v4-lts`, followed by `verify-dist-tags` with `expected_latest=5.0.0 expected_v4lts=<newest 4.x>` (AC-REL-10).
- The 5.0.0 notes list `date-fns`, `chart.js`, `react-chartjs-2`, `zod`, `framer-motion` and `tailwind-merge` first, with the `deps` command (REQ-REL-39).
- REL-135: fill `{{GA_DATE}}`, the EOL date (GA + 12 months) and the EOL−90 and EOL−30 dates in `lts-policy.md` and merge it (AC-REL-20).
- REL-136: generate the banners and Discussions. `verify-release-comms.mjs` exits 0. Manually check the 6 Release bodies (4.1.1, 4.2.0, 4.3.0, beta.1, rc.1, 5.0.0) for 0 unsourced numbers and a Discussion link (AC-REL-18).
- REL-137: the 5.x visual gate is enforced on `main` (REQ-REL-14). Prove it with a canary PR on `main` that changes one default cell: it fails without `visual-bug-fix` and approval, and passes with them. Record both run URLs and the composite.

**STOP=eol — REL-138 (REQ-REL-36/37)** EOL−90 and EOL−30 notices come from `lts-policy.md` (Discussion + README banner). At EOL the owner runs `npm deprecate aura-glass@"<5" "aura-glass 4.x reached end of life on <date>; see https://auraglass.dev/migrate/5"` and then `npm view aura-glass@4 deprecated` to verify. Use no other `npm deprecate` text.

**Program close — REL-139 (§18 definition of done, AC-REL-04)** After GA, compile the AC-REL-01..20 table and confirm each §18 bullet:
- every §12 test passes on `main` and `release/4.x`
- each fail-closed demonstration has a URL (`change-class`, `release`, frozen-fixture canaries)
- policies are reviewed
- the DX and QA PRDs' CI reads the deprecations file and `breaking-changes.json` directly (cite the workflow lines)
- B17–B19 are confirmed or replaced
- architecture §3.2/§16 updates are filed as a PR or issue
- no local Docker, browser or laptop publish was used

## Gate record format (`docs/release/decisions/<version>-gate.md`)

```
# <version> gate — <date> — SHA <sha>
| Gate bullet (REQ-REL-xx) | Result | Evidence URL |
|---|---|---|
change-class: <class>, removals <n>, run <url>
Dist-tags after publish: <json> (verify-dist-tags run <url>)
Owner actions performed: <who, what, when>
Open items: <list>
```

## Visual evidence

At each stop, link the remote `visual-class.json` and composites for `consumer-4x` (4.x stops) or the QA PRD default cells (5.x). At GA, also link the canary composite for REL-137. Screenshots are reviewed by a human, not by the agent.

## Exit criteria (by stop)

4.3.0 → AC-REL-05 (second half), AC-REL-12 (4.x half). Alpha → AC-REL-19. Beta → AC-REL-07. RC → AC-REL-12 (rc half), AC-REL-13, AC-REL-15 (budget), AC-REL-17 (rc half). GA → AC-REL-10, AC-REL-18, AC-REL-20. Program close → AC-REL-04 and PRD §18.

## Final report

```
PROMPT-01f REL report — STOP=<stop>
Version / SHA / tag: <v> / <sha> / <tag-run-url>
Gate record: docs/release/decisions/<v>-gate.md (bullets met <n>/<n>)
AC status: <AC id → met|pending|blocked + evidence URL>
Dist-tags: <json>
Owner actions done / pending: <list>
Regressions or runbook gaps found: <list>
```
