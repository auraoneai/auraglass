# AuraGlass 5.0 shared contract registry

Status: binding program index, 2026-10-06. Inputs: `AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-01..D-32, §16), the 19 PRDs in this directory, `_verification-remaining-concerns.md`, `tasks/<KEY>.json`.

Rules:
1. Each shared artifact or name has exactly one **owner PRD**. Only the owner creates the artifact, defines its schema/value, or renames it. Consumers MODIFY through the owner's contract and set `depends_on` to the owner's anchor task.
2. When a PRD disagrees with a row here, the row wins. The PRD must make the change listed under "Must change". Architecture errata are listed separately (§J) for the architecture owner.
3. Line numbers (`:NNN`) are line numbers in the PRD file at the time of writing.
4. PRDs are named by **task key** (`PRD-CTL`), with the §16 id in parentheses where useful. Self-assigned "program" ids (PRD-09, PRD-13, …) are aliases only and must not be used in `depends_on`.

## SC-01 PRD key crosswalk (numbering)

Owner: REL (maintains this table). Every PRD header must add a `Key` field and cite other PRDs as `PRD-<KEY>` or by §16 id; program self-ids are aliases only.

| Key | File | Self-id (alias) | Architecture §16 boundary |
|---|---|---|---|
| TRUST | AURAGLASS_TRUST_PATCH_4_1_1_PRD.md | PRD-00 | PRD-00 |
| REL | AURAGLASS_RELEASE_MIGRATION_PRD.md | PRD-01 | PRD-01 (+ interim PRD-17, SC-37) |
| PKG | AURAGLASS_PACKAGING_BUILD_PRD.md | PRD-02 | PRD-02 |
| DS | AURAGLASS_DESIGN_SYSTEM_PRD.md | PRD-03 | PRD-03 |
| MAT | AURAGLASS_MATERIAL_ENGINE_PRD.md | PRD-04 | PRD-04 (+ interim PRD-15) |
| A11Y | AURAGLASS_ACCESSIBILITY_PRD.md | PRD-05 | PRD-05 |
| MOT | AURAGLASS_MOTION_PRD.md | PRD-06 | PRD-06 |
| PERF | AURAGLASS_PERFORMANCE_PRD.md | PRD-07 (collides) | none; numeric policy across PRD-02/04/19 |
| FND | AURAGLASS_COMPONENT_REMEDIATION_PRD.md | PRD-08 (collides) | PRD-07 + PRD-14 + PRD-16 |
| CTL | AURAGLASS_FLAGSHIP_CONTROLS_PRD.md | PRD-09 | PRD-08 |
| OVL | AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md | PRD-10 | PRD-09 |
| NAV | AURAGLASS_APP_SHELL_NAVIGATION_PRD.md | PRD-11 | PRD-10 |
| DATA | AURAGLASS_DATA_PRD.md | PRD-12 | PRD-11 |
| AI | AURAGLASS_AI_PRD.md | PRD-13 | PRD-12 |
| MED | AURAGLASS_MEDIA_BACKDROPS_PRD.md | PRD-14 | PRD-13 |
| EXP | AURAGLASS_COMPONENT_EXPANSION_PRD.md | PRD-15 (collides) | none; expansion ledger (+ interim PRD-21) |
| DX | AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md | PRD-16 (collides) | PRD-18 + PRD-20 |
| SB | AURAGLASS_STORYBOOK_SHOWCASE_PRD.md | PRD-17 (collides) | Storybook/Lab half of PRD-19 |
| QA | AURAGLASS_QA_CERTIFICATION_PRD.md | PRD-18 (collides) | PRD-19 (certification infra) |

Task fragments: the `prd` field keeps the self-id, but `depends_on` must never contain a `PRD-xx` string (SC-40). Deviation: every task file except TRUST has `PRD-xx` entries in `depends_on` (counts in §I).

---

## A. Release, governance and evidence

### SC-02 `deprecations.json`: location and envelope
- **Canonical:** the repo-root `deprecations.json`, listed in `package.json` `files`, with `{"$schema": "./docs/schemas/deprecations.schema.json", "version": 1, "entries": [...]}` **from the first 4.1.1 commit**. There is no `schemaVersion: 0` seed and no `migrate-deprecations-v0.mjs`. The file is never "empty": the 4.1.1 seed holds the §13.1 cut entries. The `./deprecations.json` exports key is added in 4.2 (C-E) and kept in 5.x. Readers resolve the path through one constant (`scripts/docs/paths.mjs` `DEPRECATIONS_PATH`).
- **Owner:** REL (schema `docs/schemas/deprecations.schema.json`, gate `scripts/release/verify-deprecations.mjs`, generator `scripts/release/gen-deprecations.mjs`). Instance seeded by TRUST (TRUST-075).
- **Consumers:** all component PRDs, DX (migration guide, doctor, codemods), PKG.
- **Must change:** TRUST REQ-TRUST-51, AC-TRUST-21, deviation 5 (`:21`) and task TRUST-075 change `docs/deprecations.json` to the root `deprecations.json` and use `version: 1`. REL alignment note 4(b) (`:21`), §4.3 (`:172`) and REQ-REL-05 drop the `schemaVersion: 0` seed and the v0 migration script, and REQ-REL-25 drops "empty-but-valid". DX deviation 10 and DX-096 move from `docs/deprecations.json` to the root. PKG §4.2 adds the `./deprecations.json` row to `build/exports.manifest.json`. Tasks AI-098, NAV-122, OVL-014 and OVL-016 change `NEW:` to MODIFY and depend on TRUST-075.

### SC-03 Deprecation entry schema and enums
- **Canonical:** REL §4.3. Required fields: `id` (`DEP-\d{4}`), `kind`, `status` (`active|planned`), `entry`, `symbol`, `since`, `removeIn` (`5.0.0|6.0.0`), `replacement`, `codemod` (an SC-34 id or null), `automation` (`full|mostly|partial|manual|none`), `breaking` (`B\d+`), `message` (≤200 chars), `doc` (`#dep-NNNN`). Optional fields: `compat`, `exception`, `evidence`. The `kind` enum has 13 values: `export|subpath|prop|prop-value|css-var|css-global|peer|dependency|engine|behavior|cli|data-attr|asset`. The **`exception` enum is `security|privacy|crash|legal|honesty`**. `honesty` covers retracted or simulated claims such as ContrastGuard, validateTextContrast and `data-meets-wcag`.
- **Owner:** REL. **Consumers:** TRUST and everyone who writes entries.
- **Must change:** REL §4.3 comment (`:194`) and REQ-REL-05 add `honesty`. TRUST REQ-TRUST-51 adds `status` and the `asset` kind, and maps the ContrastGuard/validateTextContrast entries to `honesty`, not `security`. REL step 2 (`:638`) adds `honesty` to `exception-allowlist.json`.

### SC-04 API reports and export snapshots
- **Canonical:**
  - Report files: `etc/api/<slug>.api.md`, `etc/api/<slug>.exports.json` and `etc/api/manifest.json` (holds `"apiReport": "unanalysable"` records).
  - Slug rule: `.` → `index`; `./a/b` → `a-b` (for example `primitives-slot`).
  - Scripts: `scripts/release/api-report.mjs` and `scripts/release/export-snapshot.mjs` (with `--tarball`), plus the shared root `api-extractor.base.json`.
  - Tests: `tests/release/api-report.test.ts` and `tests/release/export-snapshot.test.ts`.
- **Owner:** REL. TRUST builds the 4.1.1 instance (TRUST-071, TRUST-072).
- **Consumers:** PKG (REQ-PKG-102 inputs), AI, MED, CTL, DX, QA L3.
- **Must change:**
  - TRUST REQ-TRUST-49/-50 and deviation 5 (`:21`, `:293-294`): `api/` → `etc/api/`, slug `root` → `index`, `tests/api/*` → `tests/release/*` (TRUST-074, TRUST-076).
  - REL alignment note 4(a), REQ-REL-03, §6 table (`:343`) and `:303`: `scripts/api/export-snapshot.mjs` → `scripts/release/export-snapshot.mjs` (the task fragments REL-005/006 already resolve to it).
  - PKG REQ-PKG-102 (`:278`): `api/<entry-slug>.api.md` → `etc/api/`.

### SC-05 Publish workflow and the trusted-publishing constraint
- **Canonical:** `.github/workflows/publish-npm.yml` is the only publish path. The filename stays because the npm trusted-publisher binding is `auraoneai/auraglass` + `publish-npm.yml`. Renaming it would mean reconfiguring trusted publishing on npmjs.com, a shared-credential change outside the agent perimeter.
  - Trigger: tags only. Auth: OIDC only, with no `NPM_TOKEN` fallback. Command: `npm publish --provenance --access public --tag <derived>`.
  - Guard: `scripts/ci/require-ci-publish.js` passes only when `GITHUB_ACTIONS==='true'` and `GITHUB_WORKFLOW_REF` contains `/.github/workflows/publish-npm.yml@refs/tags/v`.
  - `certify-release.yml` (QA) is a reusable workflow, called from `publish-npm.yml` through `needs:`.
  - `npm dist-tag add` (`v4-lts` at GA, rollbacks) stays a manual runbook step until OIDC support is verified.
- **Owner:** REL. TRUST builds the 4.1.1 instance.
- **Consumers:** QA, PKG, DX (CLI, registry and MCP publish from the same workflow).
- **Must change:**
  - TRUST deviation 5 (`:21`), REQ-TRUST-06 and tasks TRUST-077/078/080: `release.yml` → `publish-npm.yml`.
  - TRUST REQ-TRUST-08 (`:220`) and TRUST-079: replace the `GITHUB_WORKFLOW === "release"` guard with the `GITHUB_WORKFLOW_REF` condition above.
  - QA `:13`, `:28` ("renamed from publish-npm.yml"), REQ-QA-35, `:536` and QA-096: `release.yml` → `publish-npm.yml`.
  - Remaining-concerns TRUST bullet 4 (`release.yml`) is superseded.

### SC-06 npm pack helper
- **Canonical:** `scripts/ci/lib/npm-pack.js` (CommonJS), exporting `parsePackJson(stdout)` and `packToDir(rootDir, destDir, opts)`. Fixtures live in `tests/ci/fixtures/npm-pack/` (npm 10/11/12) and the test is `tests/ci/npm-pack.test.ts`. Every `npm pack` caller uses it, and no second helper exists.
- **Owner:** TRUST (TRUST-002). **Consumers:** PKG (PKG-001 extends), QA, REL, DX.
- **Must change:** none. PKG REQ-PKG-66 already aligned, so the `lib/pack.mjs` concern is closed.

### SC-07 Evidence directory and artifact retention
- **Canonical:**
  - Evidence directory: `process.env.AURAGLASS_EVIDENCE_DIR ?? <repo>/.artifacts`, resolved by `scripts/ci/lib/evidence-dir.js`.
  - `reports/` and `.artifacts/` are gitignored, and evidence is never committed (D-32).
  - Uploads are named `evidence-<job>-${{ github.sha }}`. Every `actions/upload-artifact` sets `retention-days` explicitly: PR 14, main 30, release 90 (QA §4.8).
- **Owner:** QA (artifact retention, §16 PRD-19). TRUST builds the helper.
- **Must change:** TRUST REQ-TRUST-32 (`:256`), §8 (`:378`) and TRUST-006/009: `scripts/lib/evidence-dir.js` → `scripts/ci/lib/evidence-dir.js` (SC-11).

### SC-08 Frozen 4.x consumer fixture
- **Canonical:** `tests/fixtures/consumer-4x/` (contents contract REL §11.4, including `flagship-subset.json`). The CI job `consumer-4x-frozen` in `certify-main.yml` belongs to QA L11.
- **Owner:** REL (REL-115). **Consumers:** QA, DX (doctor/codemod canary), PKG, DS, DATA.
- **Must change:** PKG REQ-PKG-85 (`:271`) and its §8 table (`:371`) drop `canaries/v4-frozen/` and consume the fixture. PKG-133 becomes a consumer, not INFRA/NEW. DS-116 and DATA-114 retarget to `tests/fixtures/consumer-4x/`. QA `:26` drops the dual naming.

### SC-09 Visual-change gate and tolerance
- **Canonical:** `scripts/release/visual-class.mjs` uses `pixelmatch` with `threshold: 0.1` and `includeAA: false`. A cell counts as changed when more than 0.1% of its pixels differ (`changedRatio > 0.001`). Captures come from QA's `certify-pr.yml` `regression` job. `.github/workflows/visual-regression.yml` is deleted on `main` (QA-119). The 4.1.1 evidence-only edit (TRUST-062) lands on `release/4.x` only.
- **Owner:** REL (tolerance, classifier). **Consumers:** QA (L3/L7 capture), SB, MED, DS.
- **Must change:** REL §6 (`:333`) and REL-042/089/116 stop repurposing `visual-regression.yml` and wire into `certify-pr.yml`. SB-014 and MED-003 retarget to `certify-pr.yml`. QA L7 cites REL's tolerance constant.

### SC-10 Required check names and change-class status
- **Canonical:** the required checks are `Glass Quality Gates`, `Next.js npm Integration`, `Vite npm Integration` (job names in `glass-pipeline.yml`) and `change-class`. A rename is a co-change with REL REQ-REL-17. `glass-pipeline.yml` is owned by PKG (artifact gates). Other PRDs add steps by MODIFY that depend on PKG-038.
- **Owner:** REL (names); PKG (file).
- **Must change:** PKG-054/075/110/116/142, PERF-022/078, MED-027 and the REL tasks keep these job names. QA's new lanes are added as new checks, not renames.

### SC-11 Scripts directory layout
- **Canonical:**

| Directory | Contents |
|---|---|
| `scripts/ci/` | per-PR gates |
| `scripts/ci/lib/` | shared helpers: `npm-pack.js`, `evidence-dir.js` |
| `scripts/release/` | API reports, export snapshot, change class, deprecations, dist-tag, ledger, visual-class |
| `scripts/build/` | exports generation |
| `scripts/tokens/` | compiler and gates |
| `scripts/docs/` | docs generation |
| `scripts/registry/` | registry build and lint |
| `scripts/storybook/` | Storybook tooling |
| `scripts/removal/` | consumer-grep gate (FND) |
| `scripts/codemods/internal/` | repo-internal codemods only |
| `scripts/audit/` | dev-only and never a required check |

  The `scripts/api/`, `scripts/lib/` and `scripts/migrate/` directories (4.x, deleted) are not allowed.
- **Owner:** PKG.
- **Must change:** REL (`scripts/api/`, see SC-04); TRUST (`scripts/lib/`, see SC-07).

---

## B. Packaging, build, dependencies and budgets

### SC-12 Exports manifest and entry-point names
- **Canonical:**
  - `exports` is generated from `build/exports.manifest.json` (and its schema) by `scripts/build/generate-exports.mjs`.
  - Entries are exactly architecture §3.2, plus `./package.json` and `./deprecations.json` (4.2+).
  - There are no `./tokens/json`, `./tokens/manifest` or `./tokens.json` entries; DS does not request a JSON artifact row.
  - `./fonts.css` exists only if the D-31 licence clears. `./charts` ships in 5.1.
  - Named exports accepted beyond §3.2 (errata E-04): `TimePicker` and `RangeCalendar` (`./date`); `MediaScrubber` and `formatMediaTime` (`./media`).
  - `Waveform` is **5.1** (C-E), following architecture §3.2 and EXP X-42, so `./media` exports 7 values at 5.0.0.
- **Owner:** PKG (PKG-004/005). **Consumers:** every entry-owning PRD (AI, DATA, MED, NAV, MAT, A11Y, MOT).
- **Must change:**
  - AI-017/037 and MED-020 change `NEW:build/exports.manifest.json` to MODIFY and depend on PKG-005.
  - MED §header (`:19`) and REQ-MED-35..39 move Waveform to 5.1.
  - REL B19 drops "`./tokens/json` kept unless PRD-03 says otherwise".
  - DS §4 confirms no `./tokens.json` row.

### SC-13 Package names, scopes and workspace layout
- **Canonical:**
  - `aura-glass` (runtime).
  - `@auraglass/cli`, `@auraglass/labs`, `@auraglass/registry` (registry data) and `@auraglass/mcp`.
  - `@auraglass/qa` is private and never published.
  - The D-23 fallback is unscoped `aura-glass-cli|aura-glass-labs|aura-glass-registry|aura-glass-mcp`, decided once before 4.2 and recorded in `docs/release/decisions/`.
  - Workspace directories: `packages/{cli,qa,registry,mcp,labs}` and `apps/docs`. `aura-glass` 5.0 has no `bin` (D-22).
- **Owner:** PKG (package map). **Consumers:** DX, QA, REL, EXP, MAT.
- **Must change:** architecture §3.1 lists neither `@auraglass/registry` nor `@auraglass/mcp` (errata E-05).

### SC-14 Dependency allowlist
- **Canonical:** the runtime allowlist is `docs/dependency-allowlist.json`, checked by `scripts/ci/verify-deps.mjs`. The CLI's separate allowlist is `packages/cli/dependency-allowlist.json` (DX). `scripts/ci/verify-no-core-ui-deps.js` is deleted (PKG-075).
- **Owner:** PKG (PKG-056). **Consumers:** FND, DATA, MOT, AI, DS, PERF.
- **Must change:** FND-002 and AI-021 change `NEW:` to MODIFY and depend on PKG-056. MOT-055 moves its rule into `docs/dependency-allowlist.json` (`motion` allowed importers) and stops editing `verify-no-core-ui-deps.js`.

### SC-15 Size budgets (per import) and perf budgets (runtime)
- **Canonical byte budgets:**
  - One file, `docs/size-budgets.json`: integer bytes min+gz with peers external, one row per import or CSS file.
  - Gate: `scripts/ci/verify-size-budgets.mjs` (esbuild). Changes are recorded in `docs/size-budgets.changelog.md`.
  - There is **no** `size-limit`, `.size-limit.json`, `build/budgets.lock.json` or `bundlesize`.
  - Rows are submitted by the component's owning PRD. PERF REQ-PERF-01 sets default ceilings, such as 8 KB gz per subpath CSS; a row may be stricter, never looser.
  - Numbers are calibrated at 5.0.0-alpha.1 by QA L10 and then only ratchet down (D-26).
- **Canonical runtime budgets:** fps, BCI, surface and long-task budgets live in `tests/perf/harness/budgets.json`, owned by PERF and read by `tests/perf/harness/run-perf.mjs`.
- **Canonical Node import timing:** REQ-PERF-09's method (11 cold runs, Node 20.19 and 22, remote). PKG REQ-PKG-33 references it and does not define its own median-of-10.
- **Owner:** PKG (byte file, schema and gate; §16 PRD-02 "per-import budgets"). PERF owns the runtime file.
- **Must change:**
  - PERF `:16` and `:133` (size-limit, `.size-limit.json`, `build/budgets.lock.json`) and REQ-PERF-08 (bundle through `verify-size-budgets.mjs`'s esbuild, not `@size-limit/esbuild`).
  - QA `:393`, `:645` and `:657`: `build/budgets.lock.json` → `docs/size-budgets.json`.
  - PKG REQ-PKG-40 (`:223`): "schema and every number owned by PERF" → "schema PKG; default ceilings PERF; rows by owner".
  - PKG REQ-PKG-33.
  - FND §16: delete the stale `HoverCard ≤15 KB` row and the HoverCard execution item.
  - Tasks AI-022, DS-117, FND-067/098 and OVL-080/096/112/129/153: `NEW:` → MODIFY, depending on PKG-048.
  - DATA-031/132/144: retarget from `verify-tree-shaking.js` (deleted by PKG-054) to `verify-size-budgets.mjs`.
  - NAV and PERF keep distinct rows: `{ AppShell }` all slots (PERF, ≤15 KB) and `app-shell client islands` (NAV, ≤12 KB).
  - OVL's per-import lines (AlertDialog 20, Sheet 24, Popover 14, Tooltip 10, Menu 22, Toast 14 KB) are accepted as rows (errata E-06).

### SC-16 Lint rule namespace and hydration/purity rules
- **Canonical:** all rules are `auraglass/<kebab-name>`, registered in the existing `eslint-plugin-auraglass.js`, which is wired in `eslint.config.js` by PKG-015. Every task touching the plugin is MODIFY, never CREATE. Motion rules use the `motion-` prefix.
- **Canonical rule owners:**
  - PKG: hydration/RSC rules `no-random-in-render` (also covers `Date.now()`/`new Date()` in render, absorbing OVL's `no-date-now-in-render`), `no-dom-lazy-init`, `use-client-required` and `use-client-needless`.
  - MAT: `no-optics-outside-material` and `no-inline-glass`.
  - DS: `no-raw-design-values` (SC-17).
  - MOT: `motion-no-empty-animate` (absorbs TRUST's `no-empty-reduced-animate`), `motion-*` and `motion-raf-via-ticker`.
  - PERF: `no-transition-all`, `no-permanent-will-change`, `no-translatez-hack`, `no-global-pointer-listener`, `raf-requires-cancel` and `raf-requires-visibility-gate`.
  - A11Y: `no-document-escape` and `no-runtime-contrast`.
  - OVL: `no-overlay-global-listeners`.
  - AI: `no-network-in-ai`.
  - EXP: `no-simulation`.
  - FND: `no-forward-ref`.
- **Owner:** PKG (plugin file, namespace and hydration rules).
- **Must change:**
  - OVL drops `no-date-now-in-render` and requests the PKG rule. FND consumes `no-random-in-render`.
  - TRUST-045 renames `no-empty-reduced-animate` to `motion-no-empty-animate` (one name on both branches).
  - Tasks EXP-032, MOT-072, PERF-025..030 and TRUST-045 change action CREATE → MODIFY.

## C. Tokens, CSS and attributes

### SC-17 Raw-value lint and literal ratchet
- **Canonical:**
  - One rule, `auraglass/no-raw-design-values` (ESLint and stylelint), run by the gate `scripts/tokens/gates/literals.mjs`.
  - One baseline, `scripts/tokens/gates/literals-baseline.json`: per-file counts by `category` (`color|blur|radius|shadow|duration|easing|spring`). It ratchets down only and reaches 0 by 5.0.0-beta.1. Architecture §15.2 "≈1,890" is measured on the first run.
  - `certification/ratchets.json` holds coverage ratchets only.
- **Owner:** DS. **Consumers:** QA L1, MOT, FND, MAT.
- **Must change:**
  - FND drops `auraglass/no-literal-style`.
  - MOT REQ-MOT-61 (`:327`), §8 (`:444`) and `motion-no-literals` fold into DS's rule as the `duration|easing|spring` categories, and `scripts/ci/motion-literal-baseline.json` is not created.
  - QA REQ-QA-27 (`:333`) reads the DS baseline instead of keeping a literal count in `certification/ratchets.json`.

### SC-18 Token source tree and generated outputs
- **Canonical:**
  - DTCG sources: `tokens/{ref,sys,…}/<group>.tokens.json`, with motion at **`tokens/sys/motion.tokens.json`** and contrast references at `tokens/contrast/*`.
  - Compiler: `scripts/tokens/build.mjs`.
  - Generated outputs: `dist/tokens.css` (`@layer ag.tokens`), `dist/tokens/manifest.json`, `src/motion/tokens.generated.ts`, `src/material/css/generated/{ladders,floors}.css` and `compat/tokens.css`. All are emitted by the DS compiler only.
  - No other PRD creates files under `tokens/`. They submit token rows through DS tasks; MOT owns the motion values in MOT §4.2.
- **Owner:** DS (DS-016, DS-026, DS-053).
- **Must change:**
  - MOT REQ-MOT-01 (`:102`, `:120`, `:254`, `:431`) moves to `tokens/sys/motion.tokens.json`. MOT-020 becomes a values-only MODIFY that depends on DS-026, and MOT-024 is dropped (DS-053 generates `src/motion/tokens.generated.ts`).
  - NAV-009 (`tokens/sys/app-shell.tokens.json`) becomes a DS-owned row request.
  - A11Y-001 (`tokens/contrast/busy-reference.json`) is dropped in favour of DS-033.
  - `src/theme/createGlassTheme.ts` belongs to DS (DS-083); MOT-026 depends on DS-083.

### SC-19 CSS custom-property naming
- **Canonical:**
  - Public names are `--ag-<group>-<name>` (semver-stable). Private names are `--_ag-*`.
  - `--glass-*` exists only as read aliases in `compat/tokens.css` (`@layer ag.compat`).
  - shadcn interchange names per architecture §4.4.
  - Motion scale (MOT §4.2): `--ag-duration-{instant,micro,small,medium,large}` with `-exit` variants, `--ag-ease-{standard,emphasized,emphasized-decelerate,accelerate}` and `--ag-spring-{snappy,smooth,fluid}` with `-duration`.
  - Accepted additions: `--ag-duration-ambient` (MOT adds the row, for ambient loops gated by `allowContinuous`) and `--ag-scrim-media` (DS adds).
- **Owner:** DS (namespace and compiler); MOT owns the motion values.
- **Must change:**
  - NAV: `--ag-duration-short` → `--ag-duration-small`. `--ag-duration-tooltip-delay` is not a token; the Tooltip `delay` default is an OVL prop constant.
  - MOT §4.2 adds `ambient`; DS adds `scrim-media`.
  - MAT REQ-MAT-69 (`:382`): the owner of `compat/tokens.css` is DS, not PRD-17.

### SC-20 CSS layers
- **Canonical:** every shipped CSS file starts with exactly `@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;`. There is zero `!important`, no library utility layer and no global element selectors outside `compat/globals.css`. `ag.reset` is scoped under `:where([data-ag-root],[data-ag-surface])`.
- **Layer content owners:** `ag.reset`, the order statement, `styles.css` assembly and `compat/globals.css` belong to PKG; `ag.tokens` and `compat/tokens.css` to DS; `ag.material` to MAT; `ag.components` to each component PRD; `ag.a11y` to A11Y. The Tailwind v4 bridge order `@layer theme, base, ag, components, utilities` (§5.5) is PKG's.
- **Owner:** PKG.
- **Must change:** MAT `:150` uses the full six-name statement, with no "ag.compat first when opted in" variant. MOT-037 (`src/styles.css` entry) depends on PKG and edits nothing else. `src/styles/index.css` belongs to PKG (PKG-101); DS-111 and MAT-099/114 depend on it. `src/styles/glass.css` removal belongs to MOT (MOT-084); OVL-010 lands on `release/4.x` only.

### SC-21 `data-ag-*` attribute registry
- **Canonical public (architecture §4.5):** `surface`, `layer`, `variant`, `thickness`, `content`, `shape`, `interactive`, `prominent`, `refraction`, `allow-nested`, `group`, `backdrop`, `engine`, `tier`, `scheme`, `contrast`, `transparency`, `motion`, `density`, `animating`, `part`, `preview` (all `data-ag-*`).
- **Ratified additions (owner):**
  - A11Y: `data-ag-portal-root`, `data-ag-root` (provider root), `data-ag-announcer`, `data-ag-obscured`, `data-ag-focusable`, `data-ag-scroll-container`.
  - MOT: `data-ag-continuous`, `data-ag-offscreen` (offscreen pause observer, owned by the MOT ticker), `data-ag-vt`, `data-ag-vt-participant`, `data-ag-vt-settled`, `data-ag-pointer-light`, `data-ag-highlights`.
  - OVL: `data-ag-overlay`, `data-ag-overlay-depth`, `data-ag-nested-open`.
  - MED: `data-ag-media-root`, `data-ag-media-tone`, `data-ag-backdrop-preset`, `data-ag-palette`.
  - NAV: `data-ag-slot`, `data-ag-sidebar`, `data-ag-sidebar-side`, `data-ag-layout`, `data-ag-placement`, `data-ag-appearance`, `data-ag-inspector`.
  - DATA: `data-ag-pinned-edge`.
  - FND (component-level): `data-ag-size`, `data-ag-intent` (SC-24).
  - MAT (**private, not semver, undocumented**): `data-ag-sizeclass`, `data-ag-radius`, `data-ag-spacing`, `data-ag-inset`, `data-ag-edge`, `data-ag-edge-style`, `data-ag-lens-ready`, `data-ag-full-height`.
  - SB/QA (story-only, must never appear in `dist/`): `data-ag-story-content`, `data-ag-story-kind`, `data-ag-cert-ready`, `data-ag-lab-override`, `data-ag-state-cell`.
  - Banned: `data-ag-material` (D-20).
- **Semantics:** `data-ag-backdrop="auto"` does **not** satisfy `variant="clear"`. Such a surface renders `regular` and logs a dev warning (D-12 fail-safe), so compat `adaptive` → `auto` → regular.
- **Owner:** MAT (registry and §4.5 contract).
- **Must change:**
  - CTL `:159`: `data-ag-button-variant` → `data-ag-intent`.
  - A11Y adds `data-ag-obscured` (requested by OVL REQ-OVL-08), `data-ag-root` and the provider `toasts`/`tooltips` opt-out props.
  - MOT adds the `data-ag-offscreen` observer (requested by MED, not PRD-05).
  - PKG `:285` cites A11Y as the setter of `data-ag-root`.

## D. Runtime API names

### SC-22 Material public API
- **Canonical:** architecture §4.2: `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `materialProps()`, `defineMaterial()` (build-time), `useMaterialTier()`. The types are `MaterialVariant`, `Thickness`, `Layer`, `ContentMaterial` (`content-raised|content-sunken`), `Backdrop`, `Tier`, `Transparency`, `Shape` and `MaterialRole`.
  - **Erratum:** the `ScrollEdge` prop is `edgeStyle: 'soft'|'hard'`, not `style`, which collides with React's `style`. The emitted attribute is `data-ag-edge-style`.
- **Owner:** MAT (`src/material/**`; anchor MAT-047).
- **Consumers:** every component PRD, DS (spec), SB (Lab), DX (registry).
- **Must change:** MAT §5 table (`:176`) and REQ-MAT-10 (`:260`): `style` → `edgeStyle`. NAV `:263`: "maps to `ScrollEdge style`" → `edgeStyle`. Architecture §4.2 (E-01).

### SC-23 Theme and preference runtime
- **Canonical:** `./theme` exports:
  - `AuraGlassProvider` (client).
  - `AuraGlassScript` (server, takes `nonce`).
  - `auraGlassPrepaintScript` (string constant with the same compiled body as `AuraGlassScript`, for Vite/non-RSC heads).
  - `usePreference(key)`, `useResolvedPreferences()`, `usePreferenceActions()`.
  - `GlassPreferencesPanel`, plus DS's `createGlassTheme` and `createBrandTheme`.

  Files:
  - `src/theme/AuraGlassProvider.tsx`, `src/theme/AuraGlassScript.tsx`.
  - `src/theme/preferences/{store,usePreference,resolve}.ts`.
  - `src/theme/layers/LayerStack.ts`.

  Preference keys and values:
  - `transparency: system|glass|tinted|solid`
  - `glassOpacity: 0..1`
  - `contrast: system|standard|more`
  - `motion: system|full|calm|none` (resolved `full|calm|none`, MOT semantics)
  - `scheme`
  - `density: comfortable|compact`

  Storage key `ag:prefs:v1`; the legacy read key is `aura-glass-accessibility-settings`. Only the A11Y store calls `matchMedia` for preferences.
- **Owner:** A11Y (A11Y-027/029/032).
- **Consumers:** MOT, OVL, AI, MED, DATA, SB, DX, MAT, PERF.
- **Must change:**
  - SB globals table (`:113`, `:115`) and REQ-SB-07: `os` → `system` and contrast `default` → `standard`. Add a `glassOpacity` global (0, 0.5, 1).
  - A11Y API table (`:563-565`) adds the `auraGlassPrepaintScript` export required by DX REQ-DX-12.

### SC-24 Component prop grammar (material vs semantic props)
- **Canonical:**
  - On every material-bearing component, the material axes use MaterialRole names: `variant: 'regular'|'clear'|'identity'` (D-06, default `regular`), `thickness`, `prominent` (the one accent primary per view) and `refraction`.
  - Semantic status is `intent` with a component-specific subset of `'neutral'|'info'|'success'|'warning'|'danger'`. It tints text, rim and specular only and never selects material (MAT API-12).
  - There is no `material` prop, no `elevation` and no `as` (use `render`). Value callbacks are `onValueChange`. The styling hooks are `data-ag-part`, `data-state`, Base UI `data-*`, `data-ag-intent` and `data-ag-size`.
  - Button mapping: 4.x `primary` → `prominent`, `secondary` → `variant="regular"`, `ghost` → `variant="identity"`, `danger` → `intent="danger"`.
- **Owner:** FND (PRD-07 wrapping pattern). The per-component tables are supplied by component PRDs.
- **Consumers:** CTL, OVL, NAV, DATA, AI, MED, REL (prop-grammar codemod), DX.
- **Must change:**
  - CTL REQ-CTL-21 (`:256`): replace `variant: primary|secondary|ghost|danger` and `material?` with the grammar above.
  - CTL REQ-CTL-04 (`:234`) and A6 (`:518`): allow status `intent` while still banning material-selecting `intent`/`elevation`.
  - CTL `:159`: `data-ag-button-variant` → `data-ag-intent`.
  - REL §11.2 `prop-grammar` row (`:457`) uses the Button mapping above (keep `intent="danger"`). DX fixtures follow.
  - OVL REQ-OVL-62 (toast `intent`) is already compliant.

### SC-25 Portal root, layer stack and Escape
- **Canonical:**
  - Portal root: one `[data-ag-portal-root]` per document, rendered by `AuraGlassProvider`, which has a `portalContainer` override prop. A11Y owns the portal-root context in `src/theme/layers/`.
  - Accessor: FND's `src/foundation/portal.ts` exports the single accessor **`usePortalContainer()`**, which every Base UI `*.Portal` wrapper uses.
  - Escape: `LayerStack` (A11Y) is the only Escape, `inert` and scroll-lock dispatcher. FND's wrapping pattern routes Base UI per-root dismissal through `LayerStack`, so no root also handles Escape itself.
- **Owner:** A11Y (A11Y-049). FND-007 builds the accessor wrapper.
- **Consumers:** OVL, NAV, DATA, AI, MED, CTL.
- **Must change:** OVL `:161`, `:483` and `:736`: placeholder `useAuraGlassPortalRoot()` → `usePortalContainer()`. OVL REQ-OVL-03 and T-OVL-STACK-01 cite this mechanism.

### SC-26 KEEP primitives
- **Canonical:** `Slot`, `Portal`, `VisuallyHidden`, `FocusScope`, `Label` and `DismissableLayer` live in `src/primitives/` and ship through `./primitives`.
- **Owner:** FND (§16 PRD-07; FND-031/035/038). A11Y supplies behaviour requirements and tests.
- **Must change:** A11Y `:465-467` and `:512` stop claiming `DismissableLayer`/`VisuallyHidden`. Tasks A11Y-052, A11Y-053 and A11Y-056 become TEST/requirement tasks that depend on FND-031/035/038 and create nothing.

### SC-27 Parts and typed metadata
- **Canonical:** each component has `src/**/<Component>.meta.ts`, holding its kebab-case `data-ag-part` names, variants, states and `migration` table. The registry helper is `src/foundation/parts.ts`. Consumers are SB (matrices, docs), QA (`packages/qa/src/inventory/buildInventory.ts`) and DX (codemod mappings).
- **Owner:** FND (FND-005).
- **Must change:** none found. Component PRDs keep one meta file per exported component; NAV's aggregate `src/app-shell/meta.ts` must re-export per-component metas.

## E. Test, certification and Storybook

### SC-28 Certification scenes
- **Canonical:** `certification/scenes/` holds 8 assets plus `scenes.manifest.json`, with ids `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern` and `video-frame` (plus `video-frame.webm`). Storybook mounts them at `/scenes` via `staticDirs`; story ids are `scenes--<id>`. "Backdrop" means the declared `data-ag-backdrop` axis; white/black/busy contrast inputs are called **composites**.
- **Owner:** QA (QA-038/039).
- **Consumers:** SB, MED, MAT, CTL, A11Y, DATA, AI, NAV, PERF.
- **Must change:** CTL `:642`: `high-frequency-pattern` → `hf-pattern`. A11Y REQ-A11Y-15: rename its "backdrop" white/black/busy usage to "composite".

### SC-29 Lanes and workflows
- **Canonical:**
  - Lane ids and names (QA table `:181-194`): L1 Static, L2 Artifact, L3 Change class, L4 Token contrast, L5 Behaviour, L6 Environment visual, L7 Pixel regression, L8 Engine-specific, L9 Motion, L10 Performance, L11 Consumer canaries, L12 Unit, L13 Manual SR, L14 Human visual review.
  - Workflows: `certify-pr.yml`, `certify-main.yml` and `certify-release.yml` (reusable).
  - Lane entry files: `certification/lanes/<lane>.spec.ts`.
  - `jest.config.js`, `playwright.config.ts` and `certification/playwright.cert.config.ts` belong to QA. Other PRDs add projects by MODIFY that depends on QA-003/QA-018.
  - PRDs cite lanes as "L5 Behaviour", never ad-hoc names such as "forced-colors lane".
- **Owner:** QA.
- **Must change:**
  - QA REQ-QA-18 adds the nightly/RC axe run across all 8 scenes (A11Y REQ-A11Y-42).
  - QA REQ-QA-29 wires both `tests/tokens/contrast-matrix.test.ts` (DS) and `tests/a11y/contrast-matrix.test.ts` (A11Y) into L4.
  - QA REQ-QA-70: A11Y's issue-#16 rule (all 44 flagships recorded) governs, and the ≤3 waiver allowance is removed.
  - QA sizes the GPU pool for PERF REQ-PERF-36.
  - CTL-027/121, DATA-030, OVL-036 and PERF-001/052 (config edits) depend on the QA anchors.
  - The A11Y "lanes green" exit wording maps to L5/L6 cells.

### SC-30 Test directory layout and naming
- **Canonical:**
  - Jest tests are `*.test.ts(x)`, either colocated in `src/**/__tests__/` or under `tests/<area>/`. Playwright specs are `*.spec.ts` under `tests/<area>/`.
  - **APG keyboard specs** are `tests/a11y/apg/<kebab-component>.apg.spec.ts`. Each uses `tests/a11y/apg/harness.ts` (A11Y-073) and is owned by the component's PRD, one file per widget.
  - Browser axe runs from `tests/a11y/browser/axe.spec.ts`.
  - Perf browser specs are `tests/perf/browser/<area>-<name>.spec.ts`, driven by `tests/perf/harness/run-perf.mjs` (PERF-039). Perf node tests are `tests/perf/*.test.ts`. The `.perf.ts` suffix is not used.
  - Release tests live in `tests/release/`. Visual pixel specs live in `tests/visual/<area>/`.
- **Owner:** QA (A11Y owns the APG harness, PERF the perf harness).
- **Must change:**
  - CTL `:225`, `:486` and `:597-599`, plus tasks CTL-034/040/046/054/060/071/080/086/088/094/100/107/114/120: `tests/e2e/apg/*.spec.ts` → `tests/a11y/apg/*.apg.spec.ts`.
  - FND `:132`, `:441`, `:451` and `:454`, plus FND-037/066/086..094: same move.
  - OVL `:533-541` and OVL-053/054/074/075/091/092/093/108/125: `tests/behaviour/overlays/*.apg.spec.ts` → `tests/a11y/apg/`. Non-APG overlay specs (OVL-038/039/059/147) move to `tests/e2e/overlays/`.
  - DATA `:212`, `:217` and `:232`, plus DATA-052/083/088/102/103/105.
  - EXP `:396` and `:587` (`tests/date/date-time-picker.apg.spec.ts`).
  - MED `:220`, `:245` and `:258`, plus MED-095/123/137 (`tests/media/*.apg.spec.ts`). MED-145/146/147 (`.perf.ts`) move to `tests/perf/browser/media-*.spec.ts`.
  - CTL and OVL perf specs (`tests/perf/controls/`, `tests/perf/overlays/`) move to `tests/perf/browser/`.
  - A11Y-076/077 (button/dialog APG specs) become harness self-test fixtures, because CTL-060 and OVL-053 own those widget specs.
  - TRUST `tests/api/*` → `tests/release/*` (SC-04).

### SC-31 Storybook, Material Lab and showcases
- **Canonical:**
  - **Files.** `.storybook/preview.tsx` belongs to SB (SB-048) and is the single decorator `StoryEnvironment` + `StoryRoot`. Other PRDs register globals and decorators through SB tasks and depend on SB-048. The Lab harness is `.storybook/lab/**` (SB-060..069); MAT writes the Material Lab stories against it in the REQ-SB-18 order.
  - **Stories.** Component stories are `src/**/<Name>.stories.tsx`, owned by the component's PRD. SB owns the story contract (tags, `Keyboard` story, generated matrices) and creates no component story files.
  - **Showcases.** `showcase/<id>/` uses ids `ai-command-center`, `financial-dashboard`, `ops-console`, `media-workspace`, `collaborative-workspace`, `mobile-productivity`, `music-player`, `spatial-control-center`, `ecommerce` and `analytics`. SB owns the files and the import/determinism contract. Compositions are supplied by AI (ai-command-center), DATA (financial-dashboard, analytics, ops-console data), MED (music-player, media-workspace) and NAV (shell parts).
  - **Deleted stories.** `src/stories/AppShell.stories.tsx` and `src/stories/AppChromeVisualBaseline.stories.tsx` are deleted by SB.
- **Owner:** SB.
- **Must change:**
  - MAT §13 uses `.storybook/lab/**` and the REQ-SB-18 order, and drops its "no provider dependency" note. Its MAT-090 preview edit depends on SB-048.
  - SB-076 (`src/components/button/Button.stories.tsx`) duplicates CTL-059 and becomes a contract check.
  - AI-080 and NAV (rewriting `src/stories/AppShell.stories.tsx`) supply compositions to `showcase/<id>/` instead. NAV-105 removal is dropped in favour of SB-106.
  - AI-074, DS-095, MOT-091, NAV-103, QA-041 and REL-118/120 depend on SB-048.
  - Architecture §16 places the Lab under PRD-19 (errata E-07).

## F. CLI, registry, codemods and compat

### SC-32 Registry layout and block ids
- **Canonical:**
  - **Layout.** Sources live in `registry/{base,blocks,items}/<id>/` with the index `registry/registry.json` (DX-067). Build is `scripts/registry/build.mjs`, lint is `scripts/registry/lint.mjs` and render runs in the DX harness. Output goes to `apps/docs/public/r/<id>.json` (git-ignored), served at `https://auraglass.dev/r/`, and is also published as npm `@auraglass/registry`.
  - **GA blocks.** Exactly 10: `app-frame`, `ai-workspace`, `data-workspace`, `analytics-dashboard`, `media-viewer`, `overlay-flows`, `auth`, `settings`, `mobile-settings` and `support-inbox`.
  - **Later blocks.** `commerce-cart`, `commerce-checkout`, `pricing`, `audit-log` and `permissions-matrix` are 5.x C-E additions through the EXP ledger and are not GA. `ai-eval-dashboard` is a `registry:item`.
  - **Content ownership.** The area PRD owns a block's content: `ai-workspace` AI, `app-frame` NAV, `data-workspace` and `analytics-dashboard` DATA, `media-viewer` MED, `overlay-flows` OVL; `auth`, `settings`, `mobile-settings` and `support-inbox` DX, with OVL/CTL contributions through DX tasks. DX owns the schema, `registry.json`, build, lint and render harness.
- **Owner:** DX.
- **Must change:**
  - AI REQ-AI-41 (`:285-286`) and AI-099..109 move from `registry/ai/<name>/` to `registry/items/ai-<name>/` and `registry/blocks/ai-workspace/`, and type `ai-eval-dashboard` as an item.
  - NAV `:275` and `:487`, plus NAV-062/106: `saas-admin-shell` → `app-frame`. The `workspace` block folds into `app-frame` or becomes an item.
  - DATA-133: `dashboard` → `analytics-dashboard`.
  - EXP `:37` and REQ-EXP-13..19: `registry-src/` → `registry/`.
  - DX-071..076 become registration-only tasks (scaffold, `registry.json` entry, lint) that depend on the area content tasks.
  - AI-110 and EXP-060/070 change `registry.json` by MODIFY, depending on DX-067.

### SC-33 Codemod ids and engine layout
- **Canonical:**
  - **Command.** `npx @auraglass/cli migrate 4to5 [--transform id]`.
  - **Engine.** `packages/cli/src/migrate/4to5/{index.ts, catalogue.json, transforms/<id>.ts, mappings/*.json, __fixtures__/<id>/<case>/{input,output}.*, __tests__/}`.
  - **Ids** are kebab-case in one flat namespace:
    - The 8 core ids: `imports-subpaths`, `canonical-names`, `prop-grammar`, `dead-optical-props`, `providers`, `css-vars`, `deps`, `removed`.
    - Registered area ids: `ai-chat` (AI), `app-shell-slots` (NAV), `reduced-motion-initial`, `motion-imports`, `motion-props` (MOT) and `media-backdrops` (MED).
    - `deprecations.json` `codemod` must be one of these ids or null.
  - **TODO marker.** `// TODO(aura-glass 5): <reason>, see <doc>`.
  - **Mapping data.** Only from generated `mappings/*.json` (`scripts/release/gen-deprecations.mjs --codemods`) and the `migration` fields in `<Component>.meta.ts`.
  - **Internal codemods.** Repo-internal codemods (for example `forwardref-to-ref-prop`) live in `scripts/codemods/internal/`.
- **Owner:** REL (the id catalogue in §11.2 and the schema enum). DX implements the engine (DX-041/042).
- **Must change:**
  - REL §11.2 (`:453-462`) registers the 6 area ids, and the schema enum includes them.
  - AI REQ-AI-48 and `:295`, `:382`: `packages/cli/transforms/` → the 4to5 layout, and `TODO(auraglass-5)` → `TODO(aura-glass 5)`.
  - MOT `:448` and `:557`: `packages/cli/src/codemods/` → `4to5/transforms`.
  - DATA `:292`: `packages/cli/src/migrate/__fixtures__/data/` → `4to5/__fixtures__/<id>/data-*`.
  - MED `:297` and `:404`: `src/media/__codemod__/mapping.json` and `tools/codemods/fixtures/` → meta `migration` fields plus 4to5 fixtures.
  - OVL `:384` and `:491`: `codemods/fixtures/overlays/` → 4to5 fixtures.

### SC-34 Compat entry
- **Canonical:**
  - `aura-glass/compat` is the only migration-aid entry (D-18). Adapters are `src/compat/<area>/<OldName>.tsx`, re-exported from `src/compat/index.ts` (DX-065), and call `warnDeprecated(id)` from `src/internal/warnDeprecated.ts` (REL-072).
  - CSS: `compat/tokens.css` (DS-generated from `compat-alias-map.json`) and `compat/globals.css` (PKG). Everything is removed in 6.0.
  - `GlassHoverCard` → compat adapter over `Popover` with `openOnHover` (OVL mapping). There is no `HoverCard` export.
  - Data/timeline compat follows DATA §9 (no TimelineRail compat, no chart compat names).
- **Owner:** DX (adapters, §16 PRD-18). Prop tables come from component PRDs.
- **Must change:**
  - AI `src/compat/ai.tsx` → `src/compat/ai/*.tsx`.
  - FND regenerates `prd/appendix/gen-component-dispositions.mjs` (`:138-140`, `:184`): Field family → CTL, HoverCard → compat over Popover, GlassTimelineRail and GlassAdvancedDataViz not compat. The resulting totals are core 40 / compat 153 (minus DATA's 2 rows).

### SC-35 Inventory and docs locations
- **Canonical:**
  - The 4.x component inventory input is `docs/inventory/component_inventory.json` (TRUST REQ-TRUST-35).
  - The 5.0 export inventory is a CI artifact built by `packages/qa/src/inventory/buildInventory.ts` (QA) and never committed. It replaces `scripts/audit/public-export-audit.js`.
  - Decision records live in `docs/release/decisions/`, the docs app in `apps/docs/`, and the path constants in `scripts/docs/paths.mjs`.
- **Owner:** QA (5.0 inventory); TRUST (the 4.x relocation).
- **Must change:** none found.

## G. Scope intake, unfiled boundaries and value conflicts

### SC-36 4.1.1 scope intake
- **Canonical:** TRUST is the only owner of 4.1.1 contents. Only §13.1-class fixes (security, privacy, crash, legal, honesty) and CI-only changes are admitted.
  - **Accepted into 4.1.1:**
    - NAV E-22: escape the GlassCommandPalette regex input (crash).
    - MOT: the cookie-consent fix (privacy).
    - FND AC-FND-02: React 19 unit-test matrix on `release/4.x` (CI-only, C-I).
  - **Deferred to 4.2:** these move to the REL/PRD-17 train with D-28 labels where they are visual.
    - MOT: FPS-loop fix.
    - NAV E-15: GlassWorkspaceTabs DOM prop leak.
    - DS: the `--glass-opacity-24/32/52/72` fix (D-28 visual-fix list).
    - CTL: GlassSwitch shimmer removal (D-28 list).
    - DS: the `getPersona` type, which becomes C-D in 4.2 and is removed in 5.0.
- **Owner:** TRUST.
- **Must change:** TRUST §scope adds the 3 accepted items. MOT, NAV, DS and CTL retarget the deferred items to 4.2. REL adds the 2 D-28 entries.

### SC-37 Unfiled §16 boundaries (interim owners)
- **Canonical:** these boundaries have no PRD file. Until a file exists, the interim owner holds the contract.
  - **§16 PRD-15 (enhanced tier: lens maps, bezel clamp, kill switches, `preview/*`):** MAT, including `tests/material/kill-switches.spec.ts` (MAT-079) and `src/material/css/lens.css`. Lens-map motion is **static scale**, with no JS attribute writes (D-09). This resolves the architecture §4.7 "only scale animates" ambiguity.
  - **§16 PRD-17 (4.2/4.3 bridge):** REL holds the release scope and the gates (REQ-REL-26/27, C-D install-level rule). Content tasks stay with their owners: `preview-v5.css` (MAT-101), `compat/tokens.css` (DS), `doctor --v5` (DX), and the 4.2 experimental `aura-glass/material` and `aura-glass/motion` (MAT, MOT).
  - **§16 PRD-21 (`@auraglass/labs`, admission gate):** EXP, at `packages/labs/` with tests in `tests/labs/`. MAT keeps the cinematic engine contract.
- **Owner:** REL (program index).
- **Must change:** PRDs that cite "PRD-15/17/21" in `depends_on` replace those entries with the interim owner's task ids (SC-40).

### SC-38 Cross-PRD value conflicts (decided)
| Topic | Decision | Owner | Must change |
|---|---|---|---|
| StatCard | Static Server Component. There is no tweening AnimatedNumber inside StatCard (architecture §3.2) | DATA | MOT REQ-MOT-34 (`:293`) drops StatCard as a consumer; AnimatedNumber becomes registry/compat only |
| Blurred shell surfaces | ≤3 at fine pointer; StatusBar is `content-sunken`, not blurred | NAV | PERF REQ-PERF-19: 4 → 3, no StatusBar blur |
| `{ Chart }` budget (5.1) | ≤15 KB gz | DATA | none (EXP `:318` is aligned) |
| Waveform | 5.1 | MED (via SC-12) | MED `:19`, REQ-MED-35..39 |
| SegmentedControl | Base UI RadioGroup (radio semantics), with the deviation recorded | CTL | EXP X-09 and architecture §11.2 (errata E-08) |
| Field/Fieldset/FieldGroup/FormField/ValidationMessage, ToggleGroup | Owned by CTL (flagships 3 and 9); FND owns `Form` | CTL | FND appendix generator (SC-34) |
| HoverCard | No export; compat adapter over `Popover openOnHover` | OVL | FND §16 stale lines (SC-15) |
| Press scale 0.985 and Card hover −1px | Rejected. The light response only (architecture §8) | MOT | MOT §4 removes both declared deviations |
| CarouselRail autoplay | Counts as a loop: gated by `allowContinuous` + `motion=full` + the consumer prop | MOT | MED REQ for CarouselRail autoplay |
| 4.x docs deletion | FND (§16 PRD-16 removal) | FND | DX REQ-DX-72 becomes consume-only |
| `src/registry/recipes.ts` removal | NAV-136 (app-shell recipes family) | NAV | AI-112 becomes a dependency, not a removal |

### SC-39 Removed or replaced 4.x CI scripts (one remover each)
| File | Remover | Others must |
|---|---|---|
| `scripts/ci/verify-tree-shaking.js` | PKG-054 | DATA-031/132/144 retarget (SC-15) |
| `scripts/ci/verify-no-core-ui-deps.js` | PKG-075 | MOT-055 retarget (SC-14) |
| `scripts/ci/run-next-integration.js`, `run-vite-integration.js` | PKG-142 (main) | TRUST-007/037 edit only on `release/4.x` |
| `scripts/ci/verify-recipes-render.js` | DX-100 | NAV-114 moves to the registry render harness |
| `scripts/audit/storybook-visual-certification.mjs` | QA-115 | NAV-112/113 move to L6 |
| `scripts/ci/check-undefined-custom-props.mjs` | DS-079 (replaced by the DS dead/undefined var gate) | PKG-112 drops its edit |
| `scripts/build-tokens.js` | DS-112 | PKG-109 drops its removal |
| `src/hooks/useReducedMotion.ts` | MOT-077 | PKG-020 drops the consolidation |
| `src/tokens/designConstants.ts` | DS-109 | MOT-076/085 drop |
| `src/components/accessibility/ContrastGuard.tsx` | TRUST-026 (4.1.1 cut) | FND-125 verifies absence; A11Y-092 tests |
| `.github/workflows/design-system-compliance.yml` | QA-118 | DS-047/061/062/076 add their gates to L1/L4 instead |
| `.github/workflows/artifact.yml` | PKG-073 owns it | EXP-044 MODIFY, depending on PKG-073 |

## H. Ownership overlaps: two PRDs building the same file

Only the owner's task uses CREATE/INFRA/REDESIGN on the file. Every other task is MODIFY (adding rows or entries) or TEST, with `depends_on` set to the owner's task.

| # | File / artifact | Claimants (tasks) | Owner (anchor) |
|---|---|---|---|
| OV-01 | `deprecations.json` | TRUST-075 (CREATE, wrong path), AI-098, NAV-122, OVL-014/016 (NEW), DX-096 | TRUST-075 (instance), REL-010 (schema) |
| OV-02 | `scripts/release/api-report.mjs`, `export-snapshot.mjs` | TRUST-071/072 CREATE, REL-003..006 | TRUST-071/072 create; REL extends |
| OV-03 | publish workflow | TRUST-077/078/080 (`release.yml`), QA-096 (`release.yml`), REL-025/026/037/127, PKG-069/070/076, DX-145 | REL contract; TRUST-077 (as `publish-npm.yml`) |
| OV-04 | `scripts/ci/lib/npm-pack.js` | TRUST-002, PKG-001 | TRUST-002 |
| OV-05 | frozen 4.x fixture | REL-115, PKG-133, DATA-114, DS-116 | REL-115 |
| OV-06 | `.github/workflows/visual-regression.yml` | QA-119 (REMOVE), REL-042/089/116, SB-014, MED-003, TRUST-062 | QA (TRUST-062 on `release/4.x` only) |
| OV-07 | `docs/size-budgets.json` | PKG-048 CREATE; AI-022, DS-117, FND-067/098, OVL-080/096/112/129/153 (NEW) | PKG-048 |
| OV-08 | `docs/dependency-allowlist.json` | PKG-056; FND-002, AI-021 (NEW) | PKG-056 |
| OV-09 | `build/exports.manifest.json` | PKG-005; AI-017/037 (NEW), MED-020 | PKG-005 |
| OV-10 | `eslint-plugin-auraglass.js` | CREATE in EXP-032, MOT-072, PERF-025..030, TRUST-045; MODIFY in many | PKG (PKG-015 wiring); every rule task is MODIFY |
| OV-11 | motion token source | DS-026 (`tokens/sys/motion.tokens.json`), MOT-020 (`tokens/motion.tokens.json`) | DS-026 |
| OV-12 | `src/motion/tokens.generated.ts` | DS-053, MOT-024 | DS-053 |
| OV-13 | `tokens/contrast/busy-reference.json` | DS-033, A11Y-001 | DS-033 |
| OV-14 | `src/primitives/VisuallyHidden.tsx`, `Portal.tsx`, `DismissableLayer.tsx` | FND-038/031/035, A11Y-056/052/053 | FND |
| OV-15 | per-widget APG specs (button, dialog) | A11Y-076/077, CTL-060, OVL-053 | CTL-060, OVL-053 |
| OV-16 | `src/components/button/Button.stories.tsx` | CTL-059, SB-076 | CTL-059 |
| OV-17 | `.storybook/preview.tsx` | SB-048 (REDESIGN); AI-074, DS-095, MAT-090, MOT-091, NAV-103, QA-041, REL-118/120 | SB-048 |
| OV-18 | `src/stories/AppShell.stories.tsx`, `AppChromeVisualBaseline.stories.tsx` | AI-080, NAV (rewrite), NAV-105, SB-106 | SB (delete) |
| OV-19 | registry blocks `ai-workspace`, `app-frame`, `media-viewer`, `settings`, … | DX-071..080 CREATE; AI-107, NAV-062/106, MED-153, OVL-143, DATA-133 | DX (scaffold and registration); content per SC-32 |
| OV-20 | `registry/registry.json` | DX-067; AI-110, EXP-060/070, DX-090 | DX-067 |
| OV-21 | `.github/CODEOWNERS` | REL-053 CREATE, REL-116, QA-071 | REL-053 |
| OV-22 | `jest.config.js`, `playwright.config.ts`, `certification/playwright.cert.config.ts` | QA-003/018/077/112/113; CTL-027/121, DATA-030, OVL-036, PERF-001/052, PKG-015, SB-019 | QA |
| OV-23 | `.github/workflows/glass-pipeline.yml` | PKG-038/054/075/110/116/141/142; MED-027, PERF-022/078, REL-057 | PKG (job names per SC-10) |
| OV-24 | `scripts/ci/verify-side-effects.mjs` | PKG-042; OVL-127, PERF-007 | PKG-042 |
| OV-25 | `src/styles/index.css` | PKG-101; DS-111, MAT-099/114 | PKG-101 |
| OV-26 | `src/theme/createGlassTheme.ts` | DS-083/088; MOT-026 | DS-083 |
| OV-27 | `tests/css/class-coverage.test.ts` | PKG-105; NAV-014/117 | PKG-105 |
| OV-28 | `tests/a11y/manual/sr-record.schema.json` | A11Y-084; AI-093 | A11Y-084 |
| OV-29 | `src/stories/blocks/` | DX-097; EXP-064/066 | DX-097 |
| OV-30 | `src/registry/recipes.ts` (removal) | NAV-136, AI-112 | NAV-136 |
| OV-31 | `src/material/css/generated/*` (inside MAT's tree) | DS-049/059 | DS (generated output); MAT consumes and never hand-edits |
| OV-32 | intra-PRD duplicate CREATEs | MOT-040 + MOT-052 (`src/motion/ticker.ts`); OVL-040..044 (`Dialog.client.tsx`) | first task CREATE, the rest MODIFY |

## I. Task-id cross-reference conventions

### SC-40 `depends_on` and foundation anchors
- **Canonical:**
  1. `depends_on` contains only real task ids matching `^(TRUST|REL|PKG|DS|MAT|A11Y|MOT|PERF|FND|CTL|OVL|NAV|DATA|AI|MED|EXP|DX|SB|QA)-\d{3}$` that exist in `tasks/*.json`. Strings like `PRD-08`, `PRD-02:REQ-PKG-01`, `PERF`, `PRD-PERF` and `PRD-11(§16)` are invalid. A requirement reference belongs in `acceptance` or `description`, not `depends_on`.
  2. A cross-PRD dependency points at the **owner's anchor task** below, never at a consumer's task.
  3. External gates such as product sign-off, npm scope verification or a release being published go in a `gate` field (free text), not `depends_on`.
  4. The `prd` field keeps the file's self-id, and the program index maps it through SC-01.
  5. A file gets exactly one CREATE across all fragments (§H).
- **Owner:** REL. A validator, `scripts/release/verify-task-graph.mjs`, fails on rules 1 and 5.

Foundation anchor tasks (cite these):

| §16 boundary (key) | Anchor tasks |
|---|---|
| PRD-00 (TRUST) | TRUST-002 npm-pack · TRUST-006 evidence-dir · TRUST-071/072 API scripts · TRUST-075 deprecations seed · TRUST-077 publish workflow · TRUST-079 CI-publish guard |
| PRD-01 (REL) | REL-010 deprecations schema · REL-003 api-report extension · REL-070 gen-deprecations · REL-072 `warnDeprecated` · REL-115 frozen 4.x fixture · REL-053 CODEOWNERS |
| PRD-02 (PKG) | PKG-005 exports manifest · PKG-015 lint/jest wiring · PKG-038 pipeline · PKG-042 side-effect gate · PKG-048/049 size budgets · PKG-056 dependency allowlist · PKG-073 artifact workflow |
| PRD-03 (DS) | DS-016 token compiler · DS-022..029 token tree · DS-026 motion tokens · DS-053 motion TS · DS-073 literals baseline · DS-083 `createGlassTheme` |
| PRD-04 (MAT) | MAT-015 `material.css` · MAT-047 `Surface` |
| PRD-05 (A11Y) | A11Y-027 `usePreference` · A11Y-029 provider · A11Y-032 `AuraGlassScript` · A11Y-049 `LayerStack` · A11Y-073 APG harness |
| PRD-06 (MOT) | MOT-040 ticker |
| PRD-07/14/16 (FND) | FND-001 Base UI pin · FND-005 parts registry · FND-007 `usePortalContainer` · FND-031/035/038 KEEP primitives |
| PRD-08 (CTL) | CTL-055 Button (pattern proof with OVL-040) |
| PRD-09 (OVL) | OVL-040 Dialog |
| PRD-18/20 (DX) | DX-041 codemod engine · DX-042 catalogue · DX-065 compat index · DX-067 `registry.json` |
| PRD-19 (QA) | QA-003 jest config · QA-018 cert Playwright config · QA-031 `certify-pr.yml` · QA-038/039 scenes · QA-082 behaviour lane |
| PRD-19 (SB) | SB-048 preview · SB-060 Lab frame |
| perf policy (PERF) | PERF-039 `run-perf.mjs` |

Invalid `depends_on` entries measured on 2026-10-06, by fragment: FND 101, DX 98, DATA 90, MED 82, CTL 76, OVL 76, MOT 72, NAV 72, PERF 67, AI 57, MAT 57, EXP 51, SB 47, DS 36, A11Y 34, QA 30, REL 28, PKG 23, TRUST 0. Every one must be rewritten to an anchor task id. The fragments use §16 numbering in these strings, so `PRD-08` in A11Y means CTL, not FND.

## J. Architecture errata (architecture owner)

- **E-01** §4.2: `ScrollEdge` `style` → `edgeStyle`.
- **E-02** §4.4/§4.6: add the pseudo-element inherit rule for `inherits:false` properties. Ladders and rungs set properties on the host (REQ-MAT-13a).
- **E-03** §4.5: list the ratified additions and private attributes from SC-21. `auto` does not satisfy `clear`.
- **E-04** §3.2: add `./deprecations.json`, TimePicker, RangeCalendar, MediaScrubber and formatMediaTime. Waveform is 5.1. Record PKG's B17–B19 classification of the 18 omitted 4.1.0 subpaths. Reconcile the Timeline/ActivityFeed placement across §3.2, §11.2 and §12.
- **E-05** §3.1: add `@auraglass/registry` and `@auraglass/mcp`.
- **E-06** §3.6: the budget table points to `docs/size-budgets.json` as the source of truth.
- **E-07** §16: the PRD file names are the `AURAGLASS_*_PRD.md` files in SC-01. The Lab is split between SB (harness) and MAT (stories). PRD-15, PRD-17 and PRD-21 are interim-owned per SC-37.
- **E-08** §11.2: SegmentedControl uses RadioGroup. §6 coarse hit area is a span, not a pseudo-element, and the outline count is 109.
- **E-09** §3.5: browser floors are bounded by `@layer` support (Chrome 99 / Safari 15.4 / Firefox 97; REQ-PKG-96).
- **E-10** §4.7: lens maps use static scale (SC-37).
- **E-11** §13/§14.4: inventory counts become 496 components / 152 REMOVE (FND deviation 2).

## K. Per-PRD fix index

The SC rows each PRD (and its task fragment) must change to comply. Rows where the PRD is owner and already compliant are omitted.

| Key | Must fix |
|---|---|
| TRUST | SC-02, SC-03, SC-04, SC-05, SC-07, SC-11, SC-16, SC-36 |
| REL | SC-01, SC-02, SC-03, SC-04, SC-09, SC-11, SC-12, SC-24, SC-33, SC-36, SC-37, SC-40 |
| PKG | SC-02, SC-04, SC-08, SC-10, SC-15, SC-21, SC-39, SC-40 |
| DS | SC-08, SC-12, SC-15, SC-19, SC-20, SC-31, SC-36, SC-39, SC-40 |
| MAT | SC-19, SC-20, SC-22, SC-31, SC-37, SC-40 |
| A11Y | SC-18, SC-21, SC-23, SC-26, SC-28, SC-30, SC-40 |
| MOT | SC-14, SC-16, SC-17, SC-18, SC-19, SC-21, SC-31, SC-33, SC-36, SC-38, SC-39, SC-40 |
| PERF | SC-15, SC-16, SC-29, SC-38, SC-40 |
| FND | SC-15, SC-16, SC-17, SC-30, SC-34, SC-39, SC-40 |
| CTL | SC-21, SC-24, SC-28, SC-29, SC-30, SC-36, SC-40 |
| OVL | SC-02, SC-15, SC-16, SC-20, SC-25, SC-29, SC-30, SC-33, SC-40 |
| NAV | SC-02, SC-18, SC-19, SC-22, SC-27, SC-31, SC-32, SC-36, SC-39, SC-40 |
| DATA | SC-08, SC-15, SC-29, SC-30, SC-32, SC-33, SC-40 |
| AI | SC-02, SC-12, SC-14, SC-15, SC-31, SC-32, SC-33, SC-34, SC-38, SC-40 |
| MED | SC-09, SC-10, SC-12, SC-30, SC-33, SC-38, SC-40 |
| EXP | SC-16, SC-30, SC-32, SC-39, SC-40 |
| DX | SC-02, SC-24, SC-32, SC-38, SC-40 |
| SB | SC-09, SC-23, SC-29, SC-31, SC-40 |
| QA | SC-05, SC-08, SC-15, SC-17, SC-29, SC-40 |

Every PRD header also adds its `Key` field (SC-01).
