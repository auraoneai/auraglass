# aura-glass 4.1.1 release notes

## Changelog

From `CHANGELOG.md` `[4.1.1] - Unreleased`.

Trust patch: documentation retractions, hosted-runtime hardening, and the Aeonik font removal.

### Security and privacy

- Security advisory: the hosted example runtime ships a default JWT secret, has no authorization on its AI routes, and leaves WebSocket rooms open (draft: `docs/security/advisories/2026-10-hosted-runtime.md`; the owner publishes the advisory before the v4.1.1 tag).
- `assertJwtSecret` fails closed at startup; Dockerfile no longer copies `.env.example` over `.env`.
- `enableAdaptiveAI` is opt-in; GlassCanvas executes `onComponentAction` instead of string code (DEP-P0012, DEP-P0013).
- `validateTextContrast`/ContrastGuard report `unverified` honestly instead of unconditional pass (DEP-P0014).
- Font decision D-31: Aeonik (licence unconfirmed) removed; `--glass-font-sans` falls back to the system stack (DEP-P0015).

### Fixed

- Crash fixes: conditional-hook violations hoisted; reduced-motion `animate={{}}` sites rewritten (`prefersReducedMotion ? FINAL : X`).
- Hydration: `useOptional*` readers and hydration-stable helpers avoid SSR/client mismatch fallbacks; `AuraGlassClientBoundary` initialises hydration-safe and `Slot` picks its ref strategy from `React.version` (REQ-PLAT-46).
- RSC client entries: `"use client"` on the primitives and theme barrels, a generated `client-entries.json` checked by `verify-pack`, a hydration-stable `useHydrated`, and the GlassInput hook order hoisted.
- `GlassPredictiveEngine` passes an `enabled` flag to `useOptionalInteractionRecorder` instead of calling the hook conditionally (REQ-PLAT-44).
- Command palette fuzzy search escapes regex metacharacters per query character — a query like `(` can no longer throw or widen the match (REQ-PLAT-49).
- `npm pack --json` output from npm >= 11 is parsed through `scripts/ci/lib/npm-pack`; CI evidence is written under `.artifacts/` (REQ-PLAT-37).

### Added

- 4.x → 5.0 bridge material (MAT-327, MAT-362): `tokens/legacy/4x-rendered.tokens.json` and `tokens/compat-alias-map.json` (every `--glass-*` name with its successor, frozen or flagged status), and `scripts/tokens/build.mjs --platform bridge-4x` emitting `src/material/compat/tokens.css`, `src/styles/{v5,preview-v5}.css` and `dist/tokens/4x/`.

### Docs

- README, `llms.txt` and this changelog retract the "certified" visual-target, "SSR-safe" and "optional backend" claims of 4.1.0; ledger corrections are recorded in `docs/release/ledger-corrections.json`, and `scripts/ci/verify-docs-claims.js` keeps the retracted claims out (REQ-PLAT-52).

### Internal (no change to the published package)

- `auraglass/motion-no-empty-animate` lint rule at error severity on `src/**` (MAT-186). The rule lives in the repository lint plugin, which is not in the published `files`.
- GitLab CI/CD: the §4.2 job set, Pages, the npm OIDC trusted-publishing toolchain, decision records and CI tests; the jsdom import side-effect gate (REQ-PLAT-41); `reports/` is untracked and certification and audit evidence lives in CI artifacts (`.artifacts/`).

## Deprecations added

- `DEP-P0001` (export . component_inventory_json, removed in 5.0.0): root export 'component_inventory_json' ("reports/component_inventory.json") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0002` (export . COMPONENT_INVENTORY_JSON_PATH, removed in 5.0.0): root export 'COMPONENT_INVENTORY_JSON_PATH' ("reports/component_inventory.json") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0003` (export . component_inventory_json_path, removed in 5.0.0): root export 'component_inventory_json_path' ("reports/component_inventory.json") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0004` (export . GILDED_TOKENS_CATALOGUE_MD, removed in 5.0.0): root export 'GILDED_TOKENS_CATALOGUE_MD' ("reports/GILDED_TOKENS_CATALOGUE.md") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0005` (export . REDUCED_MOTION_100_COMPLETE_MD, removed in 5.0.0): root export 'REDUCED_MOTION_100_COMPLETE_MD' ("reports/REDUCED_MOTION_100_COMPLETE.md") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0006` (export . REDUCED_MOTION_101_GUIDE_MD, removed in 5.0.0): root export 'REDUCED_MOTION_101_GUIDE_MD' ("reports/REDUCED_MOTION_101_GUIDE.md") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0007` (export . GILDED_TOKENS_CATALOGUE_MD_PATH, removed in 5.0.0): root export 'GILDED_TOKENS_CATALOGUE_MD_PATH' ("reports/GILDED_TOKENS_CATALOGUE.md") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0008` (export . REDUCED_MOTION_101_GUIDE_MD_PATH, removed in 5.0.0): root export 'REDUCED_MOTION_101_GUIDE_MD_PATH' ("reports/REDUCED_MOTION_101_GUIDE.md") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0009` (export . REDUCED_MOTION_100_COMPLETE_MD_PATH, removed in 5.0.0): root export 'REDUCED_MOTION_100_COMPLETE_MD_PATH' ("reports/REDUCED_MOTION_100_COMPLETE.md") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0010` (export . TYPESCRIPT_FIX_PROGRESS_MD_PATH, removed in 5.0.0): root export 'TYPESCRIPT_FIX_PROGRESS_MD_PATH' ("reports/TYPESCRIPT_FIX_PROGRESS.md") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0011` (export . REDUCED_MOTION_FINAL_REPORT_JSON_PATH, removed in 5.0.0): root export 'REDUCED_MOTION_FINAL_REPORT_JSON_PATH' ("reports/reduced-motion-final-report.json") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.
- `DEP-P0012` (export . enableAdaptiveAI, removed in 5.0.0): adaptive AI heuristics now require the explicit 'enableAdaptiveAI' opt-in; unconditional adaptive behavior is removed in 5.0.0.
- `DEP-P0013` (behavior . GlassCanvas string action execution, removed in 5.0.0): GlassCanvas no longer executes string-supplied actions; pass 'onComponentAction' to receive dispatched action descriptors.
- `DEP-P0014` (prop . ContrastGuard unconditional pass, removed in 5.0.0): contrast utilities report 'unverified' instead of passing when the ratio is uncomputable; handle the new state before 5.0.0.
- `DEP-P0015` (css-global . --glass-font-sans (Aeonik), removed in 5.0.0): the bundled Aeonik family is removed (licence unconfirmed, D-31); '--glass-font-sans' resolves to the platform system stack.
- `DEP-P0016` (export . adaptiveAI, removed in 5.0.0): the implicit 'adaptiveAI' export is replaced by the opt-in enableAdaptiveAI surface; implicit adaptive behavior is removed in 5.0.0.
- `DEP-P0017` (export . useAdaptiveAI, removed in 5.0.0): 'useAdaptiveAI' is superseded by the explicit opt-in path; the implicit adaptive hook is removed in 5.0.0.
- `DEP-P0018` (data-attr . data-meets-wcag attribute, removed in 5.0.0): 'data-meets-wcag' claimed a guarantee components could not verify; contrast state is now reported honestly via 'unverified'.
- `DEP-P0019` (prop . data-contrast-ratio attribute, removed in 5.0.0): 'data-contrast-ratio' emitted values for ratios that were not actually computed; consumers should read the honest contrast state instead.
- `DEP-P0020` (prop . cookie banner auto-display, removed in 5.0.0): cookie consent banners no longer auto-display before consent state resolves; wire visibility to your consent provider before 5.0.0.
- `DEP-P0021` (behavior . ContrastGuard onAdjustment status, removed in 5.0.0): ContrastGuard callbacks report status unverified; the component cannot verify contrast over a translucent backdrop.

## Commits since v4.1.0

### Added

- train-checklist stop record written by the tag pipeline
- port #126 FIN-B CI plumbing to release/4.x (REQ-FIN-20/21/22/23/25/26, R1)
- next-fin/<wp>, 4x-fin, 4x11-fin ownership rules (REQ-FIN-30)
- 4.x gen/verify/prior-deprecation tests + G-07 coverage (REQ-PLAT-24/25/28)
- assertJwtSecret(process.env) first in server/index.ts (REQ-PLAT-53)
- hydration-safe init + Slot ref by React.version (REQ-PLAT-46)
- client-entries.json generated + RSC canary (REQ-PLAT-45)
- enabled param on useOptionalInteractionRecorder + hooks-order test (REQ-PLAT-44)
- ContrastGuard honest 'unverified' status only (REQ-PLAT-43)
- GlassCanvas string-action dev warning + isStorybookDataMedia removal (REQ-PLAT-42)
- jsdom import side-effect gate — shrink-only {effects:[{symbol,kind}]} baseline (REQ-PLAT-41)
- opt-in tracking lifecycle — start()/disable(), capped buffers, disposer (REQ-PLAT-40)
- 4.1.1 change-control baseline — seed tests, exception rules, 47-key api reports (REQ-PLAT-55)
- dist-maps.tgz producer + gh release runbook step on 4x (REQ-PLAT-16)
- downstream-grep structured hits + fragment symbols on 4x (REQ-PLAT-35)
- exact dist-tag rows + verify-release-comms compare + LTS clauses on 4x (REQ-PLAT-34)
- line-neutral release-notes (commits+changesets+change-class+fragments) on 4x (REQ-PLAT-32)
- ledger-corrections --regen + tag-pipeline ledger gate on 4x (REQ-PLAT-31)
- train.md + train-checklist.json on 4x (REQ-PLAT-36)
- 21-B-id register + verify-breaking-register on 4x, all referenced & anchored (REQ-PLAT-29)
- TSDoc gate green on 4x — 258 decl tags, active-only rule, reverse default (REQ-PLAT-27)
- untrack deprecations.json, gen at prepack via release script, schema check in CI (REQ-PLAT-24)
- export-snapshot jsdom runner + facade coverage + 4.1.0 snapshot (REQ-PLAT-23)
- port api-report.mjs to 4x + commit 40 etc/api reports + manifest (REQ-PLAT-22)
- visual-fix record validator + 4.1.1-font-fallback JSON (REQ-PLAT-20)
- line-neutral release tooling on 4.x (1c-REL port)
- 1a-CI — full §4.2 GitLab job set, pages, npm OIDC publishing toolchain
- bridge-4x tokens + bridge H cells on release/4.x (MAT-327/362)
- complete DEP-S0600..S0632 rows — compat + removed media/backdrop names
- deprecate absorbed 4.x media/backdrop exports (DEP-S0600..S0628)
- deprecate absorbed 4.x AI/chat exports (DEP-S0400..S0422)
- 4.x motion-no-empty-animate lint rule at error severity (MAT-186)
- deprecate absorbed 4.x data/date/charts exports (DEP-S0200..S0248)
- preview-v5 css scoped under [data-ag-preview=v5] (MAT-177/178)
- deprecate absorbed 4.x shell/navigation exports (DEP-S0001..S0026)
- deprecations fragment skeleton + W5 rows DEP-S0800..0809
- deprecations fragment skeleton + 187 rows DEP-M0800..0986

### Fixed

- verify-pack builds dist when absent (4.1.x)
- fix(4.1.x-batch): npm ci without iltorb, react19 legs on React 19, pack-matrix verify half, cookie-consent snapshots
- contract/*411* branches run the 4x line against release/4.1.x
- MAT 4.x evidence artifacts satisfy contract:ci-fragments
- resync package-lock.json with package.json
- FIN-B.2 rule fixes for the direct-pushed 4.1.x plat jobs
- 4.x specifics for the FIN-B port (REQ-FIN-21/25/26)
- table generator reads whole prop expressions (REQ-PLAT-48)
- SemVer pre-release precedence in verify-deprecations (REQ-PLAT-25)
- prettier-format 4.1.x-baseline.md
- prettier-format persona font-stack test (4.1.x)
- default persona system font stack on 4.1.x (REQ-PLAT-54 font hunk)
- PLAT-41 gate runs on Node >=21 and its test ships its fixtures
- remove Aeonik — full system stack everywhere (REQ-PLAT-54)
- flag + convert empty-object reduced-motion branches (REQ-PLAT-48)
- 26 verify errors — 4.2/4.3 entries planned + exception evidence (REQ-PLAT-25)
- line-aware CI test guards; pin playwright image to 4.x install
- 4.1.1 patch-scope surface + deprecation set + publish guard (PLAT-133..138)
- remove destructive autofix, restore base surface styles
- reduced-motion visibility for all 84 sites + cookie/palette fixes (PLAT-097..107)
- hoist all conditional hook calls + useOptional context readers (PLAT-085..091)
- client entry directives, hydration helpers, GlassInput hook order
- adaptive AI opt-in, no string-code execution, honest contrast states
- parse npm>=11 pack --json output
- quote lazy loading attr in DEP-S0617
- quote preset names in DEP-S0600 rows
- consumer-4x cases — controls/overlays/registry usage (CMP-426)
- correct W5 deprecation rows to real 4.x exports
- deprecations fragment rows audited against real 4.1 exports
- bootstrap CI + fragments on release/4.x

