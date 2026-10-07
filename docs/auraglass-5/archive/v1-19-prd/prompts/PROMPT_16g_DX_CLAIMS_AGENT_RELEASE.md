# PROMPT-16g (DX): generated claims, README, `llms.txt`, MCP, publishing

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key DX; alias PRD-16; contracts in `prd/_shared-contracts.md`: SC-05, SC-15, SC-40). Requirements: REQ-DX-77..80 and REQ-DX-85..91, plus DoD 4, 5, 7 and 8 and the 4.3 CLI beta (§20 step 6). Acceptance: AC-DX-01, AC-DX-17, AC-DX-19, AC-DX-20. Tasks: `docs/auraglass-5/tasks/DX.json` DX-134..DX-148. Architecture: §15.3 (claims from CI artifacts), D-23, D-31, D-32, §10 (MCP and `llms.txt` aren't GA blockers, but a stale `llms.txt` is a release blocker). Index and crosswalk: `docs/auraglass-5/prompts/PROMPT_16_DX.md`.

## 0. Common rules (binding)

- Remote-first. You may run locally (node only): `scripts/docs/{gen-claims,lint-claims,gen-readme,gen-llms,gen-mcp-data}.mjs` against downloaded CI artifacts, `npx vitest run -c tests/dx/vitest.config.ts tests/dx/{lint-claims,readme-generated,llms,docs-content,docs-pages}.test.ts`, and `cd packages/mcp && npx vitest run` (the permission-model run is a plain node process). Run remotely (GitHub Actions on `auraoneai/auraglass`, public, hosted runners; or the `auraone-remote-run` skill): the claims build on the release SHA, the docs static build, the publish dry-run, and `published-quickstart.spec.ts`. Never use local Docker. Never launch a local browser.
- Don't fake completion:
  - Never type a number into README, docs prose, `llms.txt.tmpl` or release text. Every number comes from an artifact through a claim.
  - Never add a real claim to `claims-allow.json` to silence the linter. Allow-list entries are non-claims (versions, `1440`, `390`, `20.19`), each with a reason.
  - Don't fabricate `claims.json` or artifact SHAs, and don't run the pipeline on artifacts from a different SHA.
  - The MCP tools return real generated data, not fixtures. No `test.skip`.
- Publishing:
  - Only `.github/workflows/publish-npm.yml` publishes, with OIDC trusted publishing and provenance. Never use or create an npm token, never run `npm login`/`npm token create`, and never set `NPM_TOKEN`/`NODE_AUTH_TOKEN`.
  - Trusted-publisher bindings are an operator action. Record them in `packages/*/PUBLISHING.md` and report them, without working around them.
  - `publish-npm.yml` is REL's contract (SC-05), and TRUST-077 builds the instance. Keep the filename, the tags-only trigger, OIDC only, and the `scripts/ci/require-ci-publish.js` guard (TRUST-079) that checks `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v`. DX-145 adds package steps by MODIFY only.
- The MCP server does no network I/O, no file writes, no child processes and no LLM calls (Kiro Prism policy doesn't apply: it is a data server).
- A missing prerequisite owned by another PRD means that task is BLOCKED: report it.
- Evidence is CI artifacts (D-32).

## 1. Prerequisites

1. QA-091 `packages/qa/src/claims/build.ts` produces `claims.json` (REQ-QA-31) on the release SHA. Check: `rg --files packages/qa/src/claims`. The README region renderer the DX PRD attributes to `packages/qa/src/claims/render.ts` isn't specified by the QA PRD (index deviation 4). If it is absent, report it to the QA owner. DX-134 then only verifies README regions and doesn't write them.
2. Artifacts on the target SHA: `size.json` (PKG, budgets in `docs/size-budgets.json`, PKG-048, SC-15), `perf-grades.json` (PERF-042, REQ-PERF-34), `contrast-matrix.json` (DS/A11Y), `quickstart-timing.json` (16f), `registry-render-results.json` (16d), `etc/api/*.exports.json` (PRD-01).
3. 16e and 16f are merged: `gen-props.mjs`, `compile-snippets.mjs`, `docs-content.test.ts`, `gen-readme.mjs` quickstart region, `docs/quickstart/*`.
4. REL-033 `scripts/release/release-notes.mjs` exists (REQ-REL-23), so lint-claims can lint the generated release body.
5. `packages/{cli,registry}/PUBLISHING.md` exist (16a, 16d). `rg -n "id-token: write" .github/workflows/publish-npm.yml` confirms OIDC.
6. For DX-140's 4.2 run: `release/4.x` exists (`git ls-remote --heads origin release/4.x`).

## 2. File scope

May create: `scripts/docs/{gen-claims,lint-claims,gen-llms,gen-mcp-data}.mjs`, `scripts/docs/claims-allow.json`, `README.tmpl.md`, `llms.txt.tmpl`, `apps/docs/content/ai-agents.mdx`, `packages/mcp/{package.json,tsconfig.json,vitest.config.ts,PUBLISHING.md,README.md}`, `packages/mcp/src/{server.ts,tools/*.ts}`, `packages/mcp/data/mcp-data.json` (generated), `packages/mcp/test/tools.test.ts`, `tests/dx/{lint-claims,llms}.test.ts`, `tests/dx/published-quickstart.spec.ts`, `tests/dx/fixtures/claims/**` (seeded "498 certified" and wrong-SHA artifacts).
May modify:
- `README.md` (the whole file is generated from `README.tmpl.md` on `main` at 5.0; on 4.x leave it to TRUST);
- `llms.txt` (generated only, from 4.2 on `release/4.x` with 4.x names, and on `main` with 5.0 names);
- `scripts/docs/gen-claims.mjs`;
- `scripts/docs/gen-props.mjs` (the component `.md` output mode only);
- `scripts/docs/gen-readme.mjs` (full-template mode);
- `scripts/registry/build.mjs` (emit `registry-counts.json` only);
- `packages/cli/src/migrate/4to5/index.ts` (emit `codemod-counts.json` only);
- `tests/dx/{readme-generated,docs-content,docs-pages}.test.ts` (add cases);
- `.github/workflows/publish-npm.yml` (add the three packages and the `llms.test.ts` required gate);
- `packages/cli/package.json` (`version` for the 4.3 beta only).
May delete (beta.1): `INSTALLATION.md`.
Must not touch: `packages/qa/**`, `scripts/release/**`, `src/**`, `registry/**` content, `.meta.ts` files.

## 3. Steps

1. **DX-134, DX-135.** `gen-claims.mjs` reads the artifacts listed in prerequisite 2 and writes `apps/docs/generated/claims.json` `{id:{value,unit,source:{artifact,sha,path}}}`. A missing artifact or a SHA mismatch exits 1. It verifies that README `<!-- ag:claim id="…" -->…<!-- /ag:claim -->` values equal `claims.json`. These ids must be present: `flagship-count`, `component-count`, `root-value-exports`, `button-gzip-kb`, `styles-css-gzip-kb`, `tarball-mb`, `contrast-min-regular`, `contrast-min-large`, `glass-recipes` (=1), `quickstart-seconds-next`, `quickstart-seconds-vite`, `registry-block-count`, `codemod-transform-count`, `pixel-gates-passed`. It emits `registry-counts.json` and `codemod-counts.json` as artifacts.
2. **DX-136.** `lint-claims.mjs` with the exact regex `\b\d+(\.\d+)?\s?(%|KB|MB|ms|s|components|flagships|targets|recipes|blocks|transforms)\b`. It scans `README.md`, `INSTALLATION.md` (until deleted), `apps/docs/content/**`, `llms.txt.tmpl`, and the release body from `release-notes.mjs`. A claim reference or region exempts a match. Use `claims-allow.json` with reasons. Seeded fixtures: "498 certified" must fail, and a wrong-SHA artifact must fail.
3. **DX-137, DX-138.** `README.tmpl.md` holds the pitch, generated quickstart, the 10 surfaces with links, CLI and registry commands, docs links, and a peer matrix generated from `peerDependenciesMeta`. It has no runbook (assert that the 4.1.0 `README.md:525-576` headings are absent), no agent-directed text, no "final summary", and no font claim. Delete `INSTALLATION.md` at beta.1 (its redirect comes from DX-110).
4. **DX-140, DX-141, DX-142, DX-147.**
   - `llms.txt` comes from `llms.txt.tmpl` and follows the llms.txt convention. The version equals `package.json`. It lists the 44 flagships with links to `/components/<slug>.md`, the "do not" list, and nothing about removed components, and stays ≤12 KB.
   - `llms-full.txt` is ≤400 KB and lives on the site only, not in the tarball.
   - Per-component `.md` files are generated from the same data as the HTML pages.
   - `llms.test.ts` becomes a required check in the publish workflow (REQ-DX-91).
5. **DX-144, DX-143, DX-139.** MCP:
   - `gen-mcp-data.mjs` writes `{version, sha, components, props, parts, registry, migrations}`, ≤5 MB.
   - The `@auraglass/mcp` stdio server has exactly 5 tools with zod inputs.
   - `tools.test.ts`: schema-valid output for known and unknown names; `search_components({query:"modal"})` ranks `Dialog` first; `get_migration({symbol:"GlassModal"})` returns the `canonical-names` entry; `serverInfo` carries version and SHA; startup to `initialize` ≤500 ms.
   - Permission model: run under `node --permission --allow-fs-read=<pkg>` (Node ≥22.13) and `--experimental-permission` (Node 20.19), with no write or child-process grants.
   - Write `/docs/ai-agents` with Claude Code, Cursor and VS Code configs, validated as JSON.
6. **DX-145, DX-146.** Extend `publish-npm.yml` for `packages/cli`, `packages/registry` and `packages/mcp` (OIDC, provenance, after every gate passes). At 4.3, publish the CLI `0.x` beta with `migrate 4to5 --dry-run` once the four codemod gates are green on the publish SHA. If the trusted-publisher binding is missing, the job reports it and stops.
7. **DX-148 (post-GA).** `published-quickstart.spec.ts` runs against the published packages; a >20% deviation from the GA timing files a P1. Record the DX owner's hand run and the "reads as one hand" blind review (DoD 7, 8) in the release issue.

## 4. Tests

- Local: `npx vitest run -c tests/dx/vitest.config.ts tests/dx/lint-claims.test.ts tests/dx/readme-generated.test.ts tests/dx/llms.test.ts tests/dx/docs-content.test.ts tests/dx/docs-pages.test.ts`, and `cd packages/mcp && npx vitest run` on Node 20.19 and 22.x.
- Remote: the claims build on the release SHA, the docs build with generated claims, the `publish-npm.yml` dry-run on a pre-release tag (`npm publish --dry-run --provenance`), and `published-quickstart.spec.ts` after GA.

## 5. Visual evidence

Upload remote captures of the docs home and README render (the GitHub preview of the generated README) at 1440×900 and 390×844 showing the claim values, plus the `claims.json` and `lint-claims` output artifacts for the SHA. For MCP, upload a transcript artifact of each tool call from `tools.test.ts`. No PNGs in git.

## 6. Exit criteria

- AC-DX-17: `lint-claims` finds 0 unsourced numeric claims across README, docs content, `llms.txt` and release notes, and every `<Claim>` resolves to an artifact with the GA SHA.
- AC-DX-19: the `llms.txt` version equals `package.json`, there are 0 symbols outside the runtime export snapshot, and it is ≤12 KB (`llms-full.txt` ≤400 KB).
- AC-DX-20: all 5 MCP tools pass their schema tests, the server runs with no fs-write or child-process permission, and `get_migration("GlassModal")` returns the `canonical-names` entry.
- AC-DX-01: `npm view <PACKAGE_NAME>` shows a CI-published version with provenance, and `npm view aura-glass@5 bin` is empty.
- REQ-DX-80: the README is generated, and the runbook and "final summary" are absent.

## 7. Final report format

```
PROMPT-16g report
PR: <url>  SHA: <sha>
Prereqs: 1 <claims.json ok; render.ts present|absent→reported> 2 <artifacts present: list> 3 <ok> 4 <ok> 5 <OIDC ok; bindings: cli <y/n> registry <y/n> mcp <y/n>> 6 <ok>
Tasks: DX-134 <done|blocked: reason> … DX-148
Claims: ids <n>/14 resolved to SHA <sha>; lint-claims findings 0; seeded failures <n>/<n>
llms.txt: <bytes> B, version <v>; llms-full <KB>
MCP: tools 5/5; permission runs Node20 <pass> Node22 <pass>; startup <ms>
Publish: dry-run <url>; published: <pkg@ver provenance url | pending operator binding>
Artifacts: <urls>
AC: AC-DX-01 <pass|pending>, AC-DX-17 <pass|fail>, AC-DX-19 <pass|fail>, AC-DX-20 <pass|fail>
Operator actions required: <exact list>
Deviations: <list>
```
