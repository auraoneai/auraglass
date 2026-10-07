# PROMPT-01e (REL): 4.3 contracts — breaking register, 4.3 deprecations, compat/codemod coverage, comms, LTS, frozen fixture, Storybook migration

You are working in `/Users/gurbakshchahal/platforms/AuraGlass`. Source PRD: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (key REL, alias PRD-01) §4.6, §4.7, §5.6 (REQ-REL-27 contract half), §5.7, §5.8 (REQ-REL-36 draft, 38, 39 5.0 half), §6 (doc pointers, `bin`), §11.1–11.4, §13 (SB-REL-1..5), §14 (RESP-REL-2..4), §15 (A11Y-REL-1..4, 7), §20 steps 8–9. Requirements: **REQ-REL-27 (contract), 33, 34, 35, 36 (draft), 38 (verifier + banners), 39 (5.0 half)**, plus SB-REL-1..5, RESP-REL-2..4 and A11Y-REL-1..4/7. Acceptance: **AC-REL-06, AC-REL-14**, the coverage half of **AC-REL-15**, the fixture freeze for **AC-REL-12**, and the 01e share of AC-REL-04. Tasks: REL-100..REL-124.

Branches: deprecation entries and the `bin` notice land on `release/4.x` (4.3.0 content) and are forward-merged to `main` with a `forward/4.x-<topic>` PR that touches only the deprecations file and generated files (REQ-REL-09). Scripts, tests and docs land on `main` first and are cherry-picked to `release/4.x` where the 4.x CI needs them.

## Common rules

- Remote-first. Storybook builds, remote screenshots, fixture `next build`/Vite builds, packing and the full Jest suite run in GitHub Actions (public repo; `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or `auraone-remote-run`. No local Docker or browsers.
- No fake completion. A test that reads DX (PRD-18/20 [DX]) fixtures must fail, not skip, when they are missing. No lowered thresholds and no snapshot updates to pass. The frozen fixture is never edited to make a 4.x PR pass.
- 4.3 is a 4.x minor: class ≤ C-D, removals = 0. 4.3.0 is the **last** minor allowed to add a 5.0 deprecation.
- Paths come from `scripts/release/lib/paths.mjs` (01a REL-001) and the registry `docs/auraglass-5/prd/_shared-contracts.md` (SC-08, SC-24, SC-31, SC-33, SC-34 here). PRD numbers follow the key table in `PROMPT_01_REL.md`. The DX PRD is `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`, with engine `packages/cli/src/migrate/4to5/` and fixture root `packages/cli/src/migrate/4to5/__fixtures__/<id>/<case>/`.

## May touch / must not touch

May touch: `docs/release/breaking-changes.json` (NEW), `docs/release/lts-policy.md` (NEW, draft), `scripts/release/{verify-breaking-register,verify-compat-coverage,verify-release-comms}.mjs` (NEW), `scripts/release/gen-deprecations.mjs` (add `--storybook`, `--storybook-mdx`), `scripts/release/verify-deprecations.mjs` (add the automation/TODO rule), the deprecations file (4.3 entries), `README.md` and `llms.txt` (banner and "Versions" blocks only), `docs/guides/migration.md`, `docs/cli/migration.md`, `docs/liquid-glass/migration.md`, `docs/guides/consciousness-migration.md` (top-of-file pointers only), `reports/breaking-change-review.md` (header note only, if still in tree), `bin/aura-glass.cjs` (one stderr notice), `tests/fixtures/consumer-4x/` (NEW), `.github/CODEOWNERS` (add `/tests/fixtures/consumer-4x/`), `.storybook/preview.tsx` (SB-REL-2 toolbar global and SB-REL-4 CI silencing only), `src/stories/migration/*.generated.mdx` (NEW, generated), `tests/release/`.

Must not touch: codemod transforms and fixtures (DX-041/042/053 and the area PRDs), `src/compat/**` (DX-065), the provider/preview implementation (A11Y-029, MAT-101), `.github/workflows/certify-*.yml` (QA), component source, the release notes of shipped versions, and the AuraOne repo.

## Prerequisites (verify; stop with a blocker report if any fails)

1. 01d merged. `git ls-remote --heads origin release/4.x` is non-empty, `node scripts/release/verify-branch-protection.mjs --branch release/4.x` exits 0, and `scripts/release/gen-deprecations.mjs` exists.
2. `npm view aura-glass@4.2.0 version` prints `4.2.0`.
3. DX-041, DX-042 and DX-053 merged (`PROMPT_16c_DX_CODEMODS_COMPAT.md`): `rg --files packages/cli/src/migrate/4to5/__fixtures__ | head` is non-empty and `packages/cli/src/migrate/4to5/catalogue.json` lists the 14 ids. If not, do steps 1–3 and 6–12 and report REL-106 as blocked.
4. `README.md` and `llms.txt` exist (they do at `15b6de6f7`). PRD-00 claim retractions are merged (`rg -n "498 passed" README.md llms.txt` is empty).
5. DS-103 (`PROMPT_03f_DS_COMPAT_RETIRE_CERT.md`) has produced the `--glass-*` → `--ag-*` alias table for B9; MAT-101 (`PROMPT_04e_MAT_BRIDGE_DELETION.md`) for REL-118/124; SB-048 and SB-078 (`PROMPT_17c_SB_ENVIRONMENT_SCENES.md`, `PROMPT_17e_SB_COMPONENT_LAB_IA.md`) for REL-117..120. Missing items block only their steps; record them.

## Steps

1. **REL-100 (§11.1)** `docs/release/breaking-changes.json` has the shape `{ version: 1, items: [{ id: "B1".."B21", title, affected, cdIn: "4.2" | "4.3", migration, codemod: <id|null>, rollback, proposal: bool, owner, tables?: [path] }] }`. Copy B1–B21 from PRD §11.1 one-to-one. Set `proposal: true` for B17–B19 until PRD-02/PRD-03 confirm. For B10, `tables` lists the flagship selector/ARIA table files as they land.
2. **REL-101 (REQ-REL-35)** `verify-breaking-register.mjs` fails unless all three hold:
   - every `Bn` is referenced by ≥1 deprecations entry's `breaking`. B1, B2 and B13 are covered by notice entries (`kind: peer|engine|behavior`, `codemod: null`, `automation: manual|none`).
   - every `Bn` has an anchor `#b-n` in `docs/migration/5.0/deprecations.generated.md`.
   - every B10 table lists an `aria` column (A11Y-REL-4).
3. **REL-103 (REQ-REL-27)** On `release/4.x`, add `since: "4.3.0"` entries so that **every** C-B item in §11.1 has an entry with `since ≤ 4.3.0`. That covers B1, B2 and B13 (notices), B5 (every `Glass*` name, the alias set and the CONSOLIDATE losers; derive the list with node over `component-inventory.json` and `etc/api/index.exports.json`, and record the count), B6 (prop and prop-value entries from the flagship `<Component>.meta.ts` `migration` tables; the Button rows follow SC-24: `primary` → `prominent`, `secondary` → `variant="regular"`, `ghost` → `variant="identity"`, `danger` → `intent="danger"`), B8 (`css-global`), B9 (`css-var`, one per read `--glass-*` from the DS-103 alias table), B10 (`data-attr`), B11, B12, B15 (`cli`), and B17–B19 (`subpath`/`asset`). Set `compat: { entry: "./compat", until: "6.0.0" }` on B5/B6/B8/B9/B21 items that survive into compat. Leave it null for removed components (B3) and everything §11.3 marks "never in compat". Re-point the 01d interim `codemod: null` entries to their transforms (only the 14 SC-33 ids) now that the fixtures exist. Run `deprecations:check`, `deprecations:gen`, `verify-breaking-register` and `change-class` (≤ C-D). Then open the `forward/4.x-deprecations-4.3` PR to `main`.
4. **REL-107 (REQ-REL-34)** In `verify-deprecations.mjs`, fail when an entry's `codemod` has `automation: "full"` and any `output.*` under that transform's fixture directory contains `TODO(aura-glass 5)`.
5. **REL-104 (REQ-REL-33)** `verify-compat-coverage.mjs --exports etc/api/compat.exports.json` fails in three cases: an entry with `compat != null` has no same-name export; an export has no entry; an export's entry has `replacement: null`. Until `aura-glass/compat` exists (5.0 alpha), it checks the `gen-deprecations --compat` manifest against `src/compat/index.ts` exports once that file exists, and otherwise exits 0 with `compat entry not built yet` only on 4.x versions.
6. **REL-108 / REL-109 (REQ-REL-38)**
   - Add `<!-- AG-RELEASE-BANNER -->` … `<!-- /AG-RELEASE-BANNER -->` near the top of `README.md` with the lines `latest: <v>`, `next: <v|none>`, `v4-lts: <v|none>`.
   - Add a `## Versions` section to `llms.txt` with the same three lines.
   - `verify-release-comms.mjs` parses both and compares them to `npm view aura-glass dist-tags --json`. It also checks that each listed train stop's GitHub Release body contains a `Discussion:` link. Wire it into the publish workflow's post-publish step (01b REL-037).
7. **REL-111 (REQ-REL-36)** Draft `docs/release/lts-policy.md` with every REQ-REL-36 clause: 12-month window from the GA date (placeholder token `{{GA_DATE}}`, filled by 01f at GA); classes C-I + `exception:security`; Node/React matrix frozen at the 4.3 canaries (list the exact versions from the QA PRD canary config); the `backport-4.x` label rule; notices at GA, EOL−90 and EOL−30; the exact EOL `npm deprecate` command. Also cover REQ-REL-37 (npm deprecate only for a bad version or EOL).
8. **REL-112 / REL-113 (§6)** Add a top-of-file pointer to the generated 5.0 guide (`https://auraglass.dev/migrate/5`, plus the repo path `docs/migration/5.0/deprecations.generated.md`) in `docs/guides/migration.md`, `docs/cli/migration.md` and `docs/liquid-glass/migration.md`. Mark `docs/guides/consciousness-migration.md` obsolete because its family is deleted in 5.0. If `reports/breaking-change-review.md` is still in the tree, add a header saying it was superseded by the API reports. If PRD-00 removed it, record that it is absent.
9. **REL-114 (REQ-REL-27, B15)** On `release/4.x`, `bin/aura-glass.cjs` prints this to **stderr** once per invocation, before command dispatch: `[aura-glass] DEP-NNNN: the aura-glass CLI moves to @auraglass/cli in 5.0. Run: npx @auraglass/cli <same args>`. The id comes from the B15 `kind: cli` entry. Stdout and exit codes stay unchanged, so `doctor --json` output stays parseable.
10. **REL-115 / REL-116 (§11.4, RESP-REL-3)** Create `tests/fixtures/consumer-4x/`, containing `next-app/` (Next 15 + React 19.0) and `vite-app/` (Vite + React 18.3), installed from the packed tarball:
    - 30 root exports covering every §12 family row, including at least `GlassButton`, `GlassModal`, `GlassTabs`, `GlassSelect`, `GlassInput`, `GlassDataTable`, `GlassCard`, `GlassToast`, `GlassTooltip`, `GlassSidebar`, `GlassAppShell`, and `AuroraBackground` from `aura-glass/marketing`
    - 3 aliases and every surviving subpath
    - `aura-glass/styles` and `aura-glass/tokens/css`
    - 10 literal `--glass-*` reads
    - one `h1`/`.flex` global reliance
    - `elevation`/`intent`/`onChange` props and one theme provider
    - one mobile page `/mobile` with `GlassAppShell` and its nav collapsed at 390 px
    - every directly imported third-party package (including one `date-fns` import) declared in the fixture's own `package.json`
    - `flagship-subset.json` listing the flagship-subset files (SC-08 name)

    Add `/tests/fixtures/consumer-4x/` to CODEOWNERS (release owners), and request that QA add its pages to the `certify-pr.yml` regression cell list (QA-072; REL does not edit that workflow). The freeze point is the merge of this PR on `release/4.x` (PRD §11.4). This is the only copy of the frozen fixture: PKG, DS, DATA and QA consume it, and the QA L11 job `consumer-4x-frozen` in `certify-main.yml` (QA-087) runs it.
11. **REL-117..REL-121 (SB-REL-1..5, RESP-REL-4)** REL-117 is `--storybook`, REL-118 the toolbar, REL-119 the migration MDX, REL-120 CI silencing and REL-121 the ratchet.
    - `gen-deprecations.mjs --storybook` writes `storybook-deprecations.generated.json` (`{ componentName: { id, since, removeIn } }`) for SB's docs blocks (`<MigrationTable>`, SB-078), which render `tags: ['deprecated']` plus the banner (SB-REL-1).
    - On `release/4.x`, add a `preview` toolbar global `off | v5` in `.storybook/preview.tsx` that wraps stories in `data-ag-preview="v5"` (CSS MAT-101) when set to `v5` (SB-REL-2). The default `off` changes no 4.x story pixels. `.storybook/preview.tsx` is SB-owned (SB-048, SC-31): this is a MODIFY that needs SB owner approval in the PR (PRD §21 OI-15).
    - `--storybook-mdx` writes one `src/stories/migration/<Family>.generated.mdx` per §12 family row: 4.x import → 5.0 import, prop table, codemod id, automation, B10 selector/ARIA table, and code snippets read from the codemod fixture `input`/`output` files (SB-REL-3). Prop tables sit inside `<div style="overflow-x:auto">` (RESP-REL-4).
    - When `process.env.STORYBOOK_CI === 'true'`, wrap the decorator in `AuraGlassProvider deprecations="silent"` and nothing else (SB-REL-4).
    - Add the SB-REL-5 ratchet test.
12. **REL-122 / REL-123 (A11Y-REL-1..4, 7)** Add the a11y migration contract test below, and wire the DX docs lint (claims lint `scripts/docs/lint-claims.mjs`, DX-136, plus its heading order, link text and alt text checks) into `release-notes.mjs` output and the generated guide.

## Tests

- `tests/release/breaking-register.test.ts` (REL-102): `breaking-changes.json` has B1–B21; each id is referenced (B1/B2/B13 through notices); each has a guide anchor.
- `tests/release/compat-coverage.test.ts` (REL-105): the three PRD §12 failure cases.
- `tests/release/codemod-catalogue.test.ts` (REL-106) runs against `packages/cli/src/migrate/4to5/__fixtures__/`. Every core §11.2 transform has every listed case (including `button-variant-map` for `prop-grammar`), each of the 6 area ids (`ai-chat`, `app-shell-slots`, `reduced-motion-initial`, `motion-imports`, `motion-props`, `media-backdrops`) has `basic`/`already-migrated`/`todo`, and `canonical-names` and `prop-grammar` also have `preserve-a11y-attrs` (A11Y-REL-2). `automation: "full"` outputs have no `TODO(aura-glass 5)`. Each case run twice through the DX runner is byte-identical. If the fixture root is missing, it fails with a clear message.
- `tests/release/release-comms.test.ts` (REL-110): disagree → fail, agree → pass (mocked `npm view`).
- `tests/release/cli-notice.test.ts` (REL-114, NEW) spawns `node bin/aura-glass.cjs doctor --json`. stderr contains the B15 notice, stdout parses as JSON, and the exit code is unchanged.
- `tests/release/no-storybook-only-props.test.ts` (REL-121): the counts of `previewUsers|forceVisible|isStorybookDataMedia` in `src/` and `.storybook/` don't exceed the baseline recorded in the test, and the test fails on any increase.
- `tests/release/a11y-migration-contract.test.ts` (REL-122) checks three things:
  - DX `mappings/props.json` maps no 4.x prop to an output that sets motion or transparency overrides; `forceVisible` and motion overrides map to `drop+warn` (A11Y-REL-1).
  - Accessible-name props (`label`, `aria-label`, `title`, `ariaLabel`) map to the 5.0 accessible name (A11Y-REL-3; the axe parity check belongs to the DX PRD).
  - The `warnDeprecated` output never touches the DOM (A11Y-REL-5 regression).
- Remote: `consumer-4x` builds (`next build`, `vite build`) and renders on 4.3.0-candidate. The 390 px `/mobile` page has `document.documentElement.scrollWidth ≤ 390`.

## Visual evidence (remote, human review)

- `consumer-4x` default-mode cells at 1440×900 and 390×844, light and dark, on the 4.2.0 and 4.3.0 candidates. `visual-class.json` must show 0 changed cells.
- Storybook `preview: off | v5` side-by-side for the six primitives (SB-REL-2) and the `Migration/<Family>` pages at 390 px (RESP-REL-4), captured by the remote Storybook job.
- `preview="v5"` baselines at both viewports before 4.3 ships (RESP-REL-2; capture belongs to the QA PRD, and this prompt checks the artifact exists).

## Exit criteria

- AC-REL-06: `verify-breaking-register.mjs` exits 0 at `v4.3.0`, and every root-exported REMOVE/DEPRECATE/CONSOLIDATE symbol in `etc/api/index.exports.json` has an entry.
- AC-REL-14: `codemod-catalogue.test.ts` passes.
- AC-REL-15 (coverage half): `verify-compat-coverage.mjs` exits 0.
- AC-REL-12 (freeze half): the fixture is merged, CODEOWNERS-protected, and passes unchanged on 4.3.0.
- `change-class` for 4.2.0→4.3.0 is ≤ C-D with 0 removals (the record is filed in 01f).

## Final report

```
PROMPT-01e REL report
SHAs / PRs: release/4.x <sha/url>; forward/4.x-deprecations-4.3 <url>; main <url>
Register: B1–B21 present; proposals pending: <ids>
4.3 entries: <n> by breaking id; compat-tagged <n>; total entries <n>
Coverage: codemod-catalogue=<pass/fail> compat=<exit> breaking-register=<exit>
Comms: banner/llms.txt match dist-tags=<bool>
consumer-4x: builds next=<ok> vite=<ok>; visual changed cells=<n>; 390 overflow=<px>
Storybook: toolbar approval=<url>; migration pages=<n>
Deviations / blockers: <list>
```
