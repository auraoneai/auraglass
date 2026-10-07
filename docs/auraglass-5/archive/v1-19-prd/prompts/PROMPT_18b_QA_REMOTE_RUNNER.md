# PROMPT-18b (QA): Remote runner, determinism, offline bundle, legacy driver, parity

Source PRD: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (Key QA, self-id PRD-18 / architecture §16 PRD-19; shared contracts `docs/auraglass-5/prd/_shared-contracts.md`), sections §1 item 8, §4.3 (driver), §4.7, §5.10, §11 item 2, §16 (per-test timeout, flake rate), §20 step 2.
Requirements: REQ-QA-60, -61, -62, -63, -64, and the §4.3 legacy driver. Acceptance: AC-QA-16, AC-QA-17 (the flake gate; nightly wiring is in 18c). Tasks: QA-016..QA-028.

## Common rules (binding)
- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Follow the architecture. Record deviations with evidence.
- Remote only. Use GitHub-hosted runners (public repo) or the gated EC2 runner via skill `auraone-remote-run` (launch template `lt-001ac3e8c702c66d7`, r7i.8xlarge, no ingress, no egress, S3 gateway). Read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md`, `ci-selection.md` and `cloud-contexts.md` first. AWS calls go only through `/Users/gurbakshchahal/.local/bin/aws` with its default operator chain. Never use local Docker. Never build the image on the Mac. Workers are tagged `attempt-id`, `sha`, `lane`, `ttl`, `ag-cert=1` and terminated at the end.
- The egress CA expired on 2026-09-27. Never request egress on the worker and never rotate or bypass the CA (operator action). Creating a GitHub OIDC role for EC2 widens IAM trust and is outside autonomous scope: record it, don't do it.
- Locally allowed: `node --test certification/runner/*.test.mjs`, `node_modules/.bin/jest packages/qa/test/{remote-guard,determinism,flake,cert-config}.test.ts`, `shellcheck` if installed, and `node certification/runner/preflight.mjs` against fixtures.
- No fake completion: no `retries` > 0, no `.skip`, no fabricated capture rates. A parity number that was not measured is reported as missing.
- Do not touch the uncommitted PRD-TRUST files. Never commit evidence.

## Prerequisites
1. 18a QA-001, QA-007: `test -f packages/qa/package.json && test -f packages/qa/src/evidence/manifest.ts`.
2. For QA-025/026: 18a QA-004, QA-008, QA-015 merged (`rg -n "packages/qa" tests/visual/design-system/token-purity-layout-audit.spec.ts`).
3. Soft: `scripts/ci/lib/npm-pack.js` (owner PRD-TRUST TRUST-002, extended by PKG-001, SC-06; `PROMPT_00_TRUST`). If it is missing, QA-021 fails with `provider missing: scripts/ci/lib/npm-pack.js`. Do not write a second pack helper.
4. Soft: Storybook PRD `scripts/storybook/verify-fresh.mjs` (SB-011). If it is missing, the `webServer` command fails closed. Report it as blocked on PRD-SB.

## May touch
`package.json` (`@playwright/test` exact pin only); NEW `certification/runner/{image/Dockerfile,static-server.mjs,build-bundle.mjs,build-bundle.test.mjs,worker-entry.sh,worker-entry.test.mjs,preflight.mjs,preflight.test.mjs,list-stale.mjs,list-stale.test.mjs,README.md}`; NEW `certification/image.lock.json`; NEW `certification/quarantine.json` (`[]`); NEW `.github/workflows/certify-image.yml`; NEW `certification/playwright.cert.config.ts`; NEW `certification/lanes/legacy-4x.spec.ts`; NEW `packages/qa/src/{remote/guard.ts,determinism/initScript.ts,evidence/flake.ts}` and their tests.

## Must not touch
The other `.github/workflows/*` (18c owns `certify-*`); `playwright.config.ts` (18f/18j); `.storybook/**`; `src/**`; the EC2 launch template or IAM.

## Steps
1. **QA-016** Pin `@playwright/test` to the exact version in the lockfile.
2. **QA-017** `certification/runner/image/Dockerfile`: Playwright noble image by digest, plus tesseract 5 + eng, Inter/Noto fonts and zstd. Write `/opt/ag-cert/fonts.json`. Add `certify-image.yml` (push to main on `certification/runner/image/**` + `workflow_dispatch`, `packages: write`). The dispatch writes the digest to `certification/image.lock.json` in a PR. This fifth workflow is a deviation; record it.
3. **QA-019** `guard.ts`: exit 2 and print the remote command unless `CI=true` or `AG_CERT_REMOTE=1`. Honour `AG_CERT_ALLOW_LOCAL=1` only when the operator sets it explicitly.
4. **QA-018** `playwright.cert.config.ts`: projects chromium/webkit/firefox; timeout 60 000; retries 0; junit + html into `$CERT_OUT/<sha>/<lane>/`; `globalSetup` = guard. `webServer` = `verify-fresh.mjs` then `static-server.mjs` bound to 127.0.0.1:6106. Add `packages/qa/test/cert-config.test.ts`.
5. **QA-020** `initScript.ts`: stub `Date.now`/`Math.random` with a seed from the cell id, abort every non-127.0.0.1 request, and record fonts in the manifest.
6. **QA-021** `build-bundle.mjs` with the members of PRD §4.7 item 1 and `bundle.manifest.json`. **QA-022** `worker-entry.sh`: sha256 verification, S3 in/out only, a 120-minute self-shutdown and a shutdown trap on exit. **QA-023/024** `preflight.mjs`: exit 78 with the exact text `runner egress CA expired: notAfter=<date>; offline bundle required` (also when ≤7 days remain), and exit 1 on a bundle mismatch or a missing browser.
7. **QA-025** `legacy-4x.spec.ts`: one test per legacy subject × {1440×900, 768×1024, 390×844}, judged by `thresholds.legacy4x`. On `release/4.x` it is report-only for OCR-over-dark and glass-over-nothing (§11 item 2, the only non-fail-closed scope). Everything else blocks.
8. **QA-026** Parity run on 15b6de6f7 (§20 step 2). Build the bundle in CI and run the legacy lane (a) on GitHub-hosted shards and (b) on EC2 through `auraone-remote-run` with the bundle on `s3://auraone-human-ei-test-605199373751-us-west-2/human-ei/sources/<sha>/<attempt-id>/`. Compare the verdict counts with the 2026-08-14 run summary and record `captureRatePerSec` per host. Write the procedure + run URLs into `certification/runner/README.md`. Confirm termination with `describe-instances`.
9. **QA-027** `flake.ts`: at most 0.1% of cells may differ; quarantine lasts ≤7 days and counts as not pass. **QA-028** `list-stale.mjs`: report only. It never terminates anything and ignores untagged instances such as `prism-budget-build`.

## Tests (named)
`packages/qa/test/remote-guard.test.ts`, `determinism.test.ts`, `cert-config.test.ts`, `flake.test.ts`; `certification/runner/preflight.test.mjs`, `build-bundle.test.mjs`, `worker-entry.test.mjs`, `list-stale.test.mjs` (`node --test`). Remote: the `certify-image.yml` run, and the legacy-4x lane on GitHub-hosted shards and on EC2.

## Visual evidence
The legacy-4x lane uploads captures and `lane-manifest.json` as artifacts (14-day retention for PR runs). The README links them for human review. Nothing is committed.

## Exit criteria
| AC | Required |
|---|---|
| AC-QA-16 | Offline-bundle run of the legacy lane completes on EC2 with worker egress disabled (no proxy request in the worker log) **or** on GitHub-hosted shards. Preflight prints the CA status and never attempts rotation. Run URLs recorded. The ≤90-min full release run is verified in 18j |
| AC-QA-17 (gate) | `flake.test.ts` green. Two-run identity is proven on nightly in 18c/18j |
| REQ-QA-60 | Running the cert config locally without env exits 2 (proved by `remote-guard.test.ts`, not by launching a browser) |
| REQ-QA-63 | `@playwright/test` exact; image digest in `certification/image.lock.json`; retries 0 |

## Final report
```
PROMPT-18b REPORT
SHA / PRs:
Tasks QA-016..028: status each (BLOCKED names PRD + path)
Image: ghcr.io/auraoneai/auraglass-cert@sha256:<digest> (run URL)
Parity: GH-hosted run URL + rate; EC2 attempt-id + rate + termination proof; verdict diff vs 2026-08-14
AC-QA-16 / AC-QA-17: status + evidence
Deviations: certify-image.yml (5th workflow), others
Operator actions: OIDC role for EC2 from CI; GPU instance type for L10 profile (a); CA renewal
```
