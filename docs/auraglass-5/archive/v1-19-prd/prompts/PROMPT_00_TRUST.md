# PROMPT-00 (TRUST): AuraGlass 4.1.1 Trust Patch — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` (PRD-00, key TRUST, REQ-TRUST-01..55, AC-TRUST-01..28). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row wins over any other text). Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-01, D-27, D-30, D-31, D-32, §7.5, §9, §13.1, §14.1, §15.3, §16 PRD-00 row). Task fragment: `docs/auraglass-5/tasks/TRUST.json` (TRUST-001..TRUST-091).

PRD-00 has 55 requirements in seven workstreams (PRD §20 execution order). It does not fit one agent session, so it is split into seven independently executable prompts. Each restates the common rules, names its REQ/AC IDs, its file scope and verifiable prerequisite checks. Run them in the order below; 00b, 00c and 00d may run in parallel once 00a is merged.

| Prompt | PRD §20 steps | REQ-TRUST | AC-TRUST | Tasks | Branch | Hard prerequisites |
|---|---|---|---|---|---|---|
| `PROMPT_00a_TRUST_PACK.md` | 1, 2 | 01, 02, 03, 04, 05, 32 | 04, 05 (commit half) | TRUST-001..010 | `release/4.1.1-trust` then `trust/pack-helper` | none (Wave 0) |
| `PROMPT_00b_TRUST_SECURITY.md` | 3, 4 | 13, 14, 15, 16, 17, 18, 19, 20, 43, 44, 45 | 06, 07, 13, 17 (draft), 18 | TRUST-011..027 | `trust/security-privacy` | 00a merged |
| `PROMPT_00c_TRUST_CRASH.md` | 5, 6 | 21, 22, 23, 24, 25, 26, 27, 53, 55 | 08 (hooks half), 09, 10, 11, 25, 27 | TRUST-028..040, TRUST-086, 087, 090, 091 | `trust/crash-hooks`, `trust/hydration-slot` | 00a merged |
| `PROMPT_00d_TRUST_MOTION.md` | 7 | 28, 29, 30, 54 | 12, 26, 28 (rule name) | TRUST-041..046, TRUST-088, 089 | `trust/reduced-motion` | 00a merged; rebase after 00c if both touch `src/components/advanced/*` |
| `PROMPT_00e_TRUST_LINT_FONT.md` | 8, 9 | 09, 11, 12, 46, 47, 48 | 02 (pipeline green), 08 (0 total errors), 19, 23 (tarball), 24 | TRUST-047..057 | `trust/lint-gate`, `trust/font-licence` | 00b, 00c, 00d merged |
| `PROMPT_00f_TRUST_HYGIENE_CLAIMS.md` | 10, 11 | 31, 33, 34, 36, 37, 38, 39, 40, 41, 42 | 05 (tree half), 14, 15, 16 (upload half) | TRUST-058..070 | `trust/repo-hygiene`, `trust/claims` | 00a, 00e merged; advisory draft from 00b exists |
| `PROMPT_00g_TRUST_RELEASE.md` | 12, 13, 14, 15 | 06, 07, 08, 10, 35, 49, 50, 51, 52 | 01, 02, 03, 16, 20, 21, 22, 23, 24, 28 (final verification of all 28) | TRUST-071..085 | `trust/api-baseline`, `trust/publish-pipeline`, `release/4.1.1` | 00a–00f merged; owner confirmations (below) |

REQ coverage check: 01–05, 32 (00a); 13–20, 43–45 (00b); 21–27, 53, 55 (00c); 28–30, 54 (00d); 09, 11, 12, 46–48 (00e); 31, 33, 34, 36–42 (00f); 06–08, 10, 35, 49–52 (00g). All 55 assigned exactly once. Every task id in `tasks/TRUST.json` appears in exactly one prompt.

## Operator actions (outside the agent perimeter; recorded, never performed by an agent)

1. Publish the GitHub Security Advisory drafted by 00b (`docs/security/advisories/2026-10-hosted-runtime.md`) — gates the tag (AC-TRUST-17, D-30).
2. Font licence decision by 2026-10-12 (REQ-TRUST-46 default vs -47) — gates 00e font task.
3. Confirm the npm trusted publisher binding `auraoneai/auraglass` + `publish-npm.yml` (the filename is kept, SC-05, so no npm setting changes) — gates AC-TRUST-01.
4. Approve pushing tag `v4.1.1` (public npm publish is irreversible); 00g prepares everything and records the exact command.

Each prompt's agent lists any open item in the release issue "4.1.1 trust patch" and continues unblocked work.

## Common rules (restated inside every sub-prompt)

- Remote-first: no Docker, Playwright/Chromium, Storybook build, `npm run build`, full `npx jest --ci`, `next build`, integration scripts or pack matrix on the Mac. Use GitHub Actions on the PR, or the `auraone-remote-run` skill for browser/visual lanes.
- No fake completion, no skipped tests, no lowered thresholds, no snapshot updating to pass (single reviewed exception: REQ-TRUST-11).
- No committed evidence (D-32); evidence is CI artifacts keyed to the SHA.
- No change to `package.json` `dependencies`, `peerDependencies`, `exports` (REQ-TRUST-52); no export removed.
- Registry names only (`_shared-contracts.md`): publish workflow `.github/workflows/publish-npm.yml` (never `release.yml`); guard on `GITHUB_WORKFLOW_REF` (SC-05); API reports in `etc/api/` with root slug `index`, tests in `tests/release/` (SC-04); repo-root `deprecations.json`, `version: 1`, `honesty` exception (SC-02/SC-03); helpers in `scripts/ci/lib/` (`npm-pack.js`, `evidence-dir.js`; no `scripts/lib/`, SC-06/SC-07/SC-11); lint rule `auraglass/motion-no-empty-animate` in the existing `eslint-plugin-auraglass.js` (SC-16); artifact `retention-days` 14 PR / 30 main / 90 release (SC-07); existing `glass-pipeline.yml` job names unchanged (SC-10).
- 4.1.1 scope is fixed by SC-36: accepted intake is REQ-TRUST-53/-54/-55 only. Do not implement the deferred items (MOT FPS loops, NAV E-15, DS opacity/`getPersona`, CTL Switch shimmer).
- `tasks/TRUST.json` `depends_on` holds only TRUST task ids (SC-40); external gates are in the task `gate` field.

## Final program report

After 00g, the release owner compiles one table AC-TRUST-01..28 → status, evidence URL (CI run or artifact), SHA; plus the open operator actions, the PRD-01 (REL)/§16 PRD-16 (FND) handoff issue links and the PRD §21 open items filed on their owners (PRD §20 step 15).
