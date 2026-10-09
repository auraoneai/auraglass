# AuraGlass 5 Final Completion PRD (FIN)

| Field | Value |
|---|---|
| PRD id | **PRD-F** |
| Key | **FIN** (requirement prefix `REQ-FIN-NN`, acceptance prefix `AC-FIN-NN`) |
| Status | Draft for execution |
| Supersedes | Nothing. This PRD **closes** PRD-1 PLAT, PRD-2 MAT, PRD-3 CMP, PRD-4 SURF and PRD-5 QUAL. Every requirement of those five PRDs stays binding with its original text; this PRD lists what is still open, why, and the work package that finishes it |
| Date of verification | 2026-10-08 |
| Refs verified | `next` @ `84a3b94f1` (5.0 line, read-only checkout `/tmp/ag-next`); `release/4.x` @ `645735fce` (4.x line, `/tmp/ag-4x`); `main` (frozen until GA) |
| Contract | `AURAGLASS_5_CONTRACTS.md` **contract-v1.1** (wins over this PRD; any change here that needs a contract edit is listed as a contract PR in §10 and Appendix C) |
| Sources | `prd/AURAGLASS_{PLATFORM_RELEASE,MATERIAL_SYSTEM,CORE_COMPONENTS,PRODUCT_SURFACES,QUALITY_SHOWCASE}_PRD.md`; `tasks/<KEY>.json`; `prompts/PROMPT_N_<KEY>.md`; `implementation-audit/ag-audit-<KEY>.md` (superseded by this re-verification); GitHub issue **#16** (manual screen-reader + physical-device touch certification, the only open issue on 2026-10-08); open PRs #97 and #77 (stale stacked PRs whose heads are already merged, REQ-FIN-113); PR **#28** (`4x-mat/codemods-fragment` → `release/4.x`, closed without landing) |
| Owner decisions | OD-1..OD-12 (`AURAGLASS_5_MASTER_PRD.md` §OD, contract §7.4) plus new decisions OD-13..OD-21 raised by this audit (§5.9) |

**Scope in one line.** Take every open requirement of the five stream PRDs (572 of 584) from "code was merged" to "requirement verified by a green, fail-closed GitLab pipeline", fix the cross-stream integration breaks that make merged work inert, ship `aura-glass` 4.1.1, 4.2.0 and 4.3.0 from `release/4.x`, and reach a 5.0.0 GA-ready `next` with issue #16 closed.

---

## 1. Problem

### 1.1 "Merged" is not "done"

All five streams merged code to `next` and `release/4.x`. The prior implementation audits (`implementation-audit/ag-audit-<KEY>.md`) marked many rows DONE from file existence. Sampled skeptic passes overturned 40–60 % of those DONE rows. This PRD re-verified **every clause** of every requirement against the two refs. Only **12 of 584** requirements are fully done.

A requirement is **done** only when all of the following hold:

1. Every clause of the original REQ text is implemented in the stated file paths on the stated line(s).
2. The REQ's named tests exist, contain real assertions (no early `return` on a missing subject, no `expect([]).toEqual([])`, no source-string grep standing in for behaviour) and pass.
3. The tests run in a GitLab pipeline on the target branch, in a job that is `allow_failure: false` (or activated per contract §2.3), and that pipeline is green with the job URL recorded.
4. Any human-run evidence (L13/L14, issue #16) is committed as a schema-valid record bound to the release SHA.

Under that definition no requirement is done today on the CI criterion, because **no pipeline has ever run on `next` or `release/4.x`** (§1.3). The 12 counted as done satisfy criteria 1–2 and need only criterion 3, which REQ-FIN-20..23 deliver for everything at once.

### 1.2 Current state per stream (verified 2026-10-08)

| Stream | REQs | Done | Partial | Broken | Missing | Agent | CI | Human | Owner decision |
|---|---|---|---|---|---|---|---|---|---|
| PLAT (PRD-1) | 106 | 2 | 49 | 48 | 7 | 79 | 17 | 3 | 5 |
| MAT (PRD-2) | 67 | 1 | 41 | 23 | 2 | 53 | 9 | 1 | 3 |
| CMP (PRD-3) | 142 | 4 | 93 | 38 | 7 | 118 | 19 | 0 | 1 |
| SURF (PRD-4) | 196 | 5 | 132 | 48 | 11 | 158 | 26 | 2 | 5 |
| QUAL (PRD-5) | 73 | 0 | 8 | 6 | 59 | 62 | 8 | 3 | 0 |
| **Total** | **584** | **12** | **323** | **163** | **86** | **470** | **79** | **9** | **14** (of 572 open) |

"Broken" means the code exists but contradicts the REQ, crashes, or makes a dependent feature inert. "Partial" means some clauses are met. "Missing" means no implementation. Counts in the needs columns sum to the 572 open REQs; the per-REQ value is in Appendix A.

The QUAL stream essentially did not land: there are no `next-qual/*` branches, every QUAL file is a C0 seed, `packages/qa`, `certification/run.mjs`, `showcase/` and `scripts/qual/` do not exist, and `ci/qual.gitlab-ci.yml` calls a runner that is not in the tree.

### 1.3 Nothing has been validated by CI

- The org-managed `mirror-to-gitlab` GitHub Action pushes **only `main`** to GitLab project 87152036 and prunes other refs. The project has branch `main` only and **0 pipelines ever**. `next`, `release/4.x`, every stream branch, every tag pipeline (publish, Pages, nightly) has never run.
- Every stream CI job is `allow_failure: true`. `ci/plat/activation.json` has 0 rows.
- The root job `contract:ci-fragments` (not `allow_failure`) would be **red on both lines** today (MAT fragment violations).
- No tags `v4.1.1`, `v4.2.0`, `v4.3.0`, `v5.*` exist. npm `latest` is `4.1.0`.
- The branch-policy merge rule ("merge only when the head SHA pipeline is green") is unsatisfiable; PRs #110 and #112 merged anyway.

### 1.4 Merged work is inert because the seams do not line up

The most damaging defects are integration breaks between streams, where each side is internally plausible but the system does nothing. They are first-class requirements here (FIN-A, §5.1) and are fixed before stream leftovers that depend on them. Examples: the material engine selects `.ag-surface` while `materialProps()` emits only `data-ag-*`, so CMP components render with no material; the token compiler writes `--_ag-mat-*` while the engine reads `--_ag-blur`, so default surfaces blur `0px`; `registerProviderMount` has no production caller, so LensDefs, pointer light, presets and brand CSS never mount; no `src/a11y/css/*` file is in any CSS fragment, so focus rings, OS floors and target sizes never ship; a comment containing `@ag-contract-seed` in `src/root/surf.ts` drops the root `.` export, so `import { Button } from 'aura-glass'` cannot resolve from the tarball.

---

## 2. Evidence

All evidence is in the verified open-item ledger compiled from read-only inspection of `/tmp/ag-next` and `/tmp/ag-4x` (`rg`, `git show`, `git log`; no install, build or browser). Each REQ row in Appendix A carries its status; the per-REQ evidence, remaining work and acceptance text is reproduced in the stream sections of §5 by reference to the original REQ id.

**Ledger custody (binding).** The ledger is committed as `implementation-audit/fin-open-ledger.json`: one object per open REQ with exactly the keys `req`, `status`, `evidence`, `remaining_work`, `acceptance`, `needs`, `key`, and 572 entries whose `req` set equals Appendix A. Wherever this PRD says "per the ledger", "the original REQ's acceptance" or "as amended", the text is the `remaining_work`/`acceptance` of that file; a §5 bullet that is stricter wins. A REQ-FIN agent reads its rows from that file before starting. `node -e` over the file must report 572 entries, 0 duplicate `req`, and set-equality with the Appendix A ids. Key facts:

| Fact | Evidence |
|---|---|
| GitLab mirror has only `main`, 0 pipelines | project 87152036 API: branches = [`main`], pipelines = [] |
| `contract:ci-fragments` red on both lines | `node scripts/ci/verify-ci-fragments.mjs` on `next`: `mat:test:tokens-interim` writes `dist/tokens/`, `mat:certify:l5-material` runs Playwright without `.ag-playwright`; on 4x: `mat:build:bridge` writes `src/material/`, `src/styles/{v5,preview-v5}.css`, `dist/tokens/4x/` |
| `tokens:build` exits 1 at `next` HEAD | `tokens/legacy/4x-rendered.tokens.json` uses `$type: "ag-rendered"` (PR #59, `17f34e11c`), rejected by `tokens/$schema.json`; `formats/compat-aliases.mjs` requires `git show 15b6de6f7` |
| Root export missing | `scripts/build/lib/graph.mjs:56` plain `includes('@ag-contract-seed')`; `src/root/surf.ts:4` contains it in a comment; `src/theme/{public,createGlassTheme}.ts`, `src/motion/public.ts` carry real seeds |
| CLI tests never run | root `jest.config.js` ignores `<rootDir>/packages/`; `packages/cli/test/fixtures.test.ts` filters streams to `plat` |
| SURF/CMP browser specs vacuous | `tests/helpers/index.ts` `listSubjects` falls back to `index.json` and stamps `owner: 'PLAT'`; specs `return` with `console.warn('pending')` |
| 4.x cannot be tagged 4.1.1 | 4x `package.json` is `4.1.1` but deps went 24 → 3 at `c73bfafcf` (4.2 diet) and 4.2/4.3 deprecation entries are merged. The last patch-scope-clean commit `78fd7bda1` (24 deps, 12 peers) carries only the 145-line bootstrap `ci/plat.gitlab-ci.yml`; the full §4.2 job set arrived later in `85e844776` and `f4d5f884b`, and the release tooling in `4dabc703b` (none of the three touches `package.json`) |
| PR #28 not landed | 4x `fragments/codemods/{mat,cmp,surf,qual}.ts` are empty `{}` (210–212 B); on `next` the same files hold 10,208 / 15,292 / 31,776 / 212 B. `scripts/release/sync-fragments.mjs` syncs `codemods` only `next → release/4.x` and `deprecations` only `release/4.x → next` |
| `forwardRef` remains | `rg -c forwardRef src` on `next`: 30 files = 5 CMP files with 42 calls (Menu 15, ContextMenu 9, Toast 7, Popover 7, Tooltip 4), 21 SURF files (media, data, backdrops), `src/theme/AuraGlassProvider.tsx:31` (MAT), one test, and 2 comment-only hits (`src/primitives/Portal.tsx`, `src/icons/createIcon.tsx`) |
| Real seeds block the root entry | `src/index.ts` → `src/root/mat.ts` → `src/theme/index.ts` → `src/theme/createGlassTheme.ts`, whose line 1 is `/* @ag-contract-seed: S-21 …`; so `.` stays excluded after the `src/root/surf.ts` comment is neutralised, until MAT replaces that seed |
| Issue #16 open | manual SR (menus, selects, overlays, app-shell nav, tabs, command palette, toast, workflow states) + physical touch (app shell, overlays, select, combobox, dialog/drawer, toast, reduced motion, orientation) |

---

## 3. Desired end state

1. **`release/4.x`** has published, through the GitLab tag pipeline with OIDC provenance:
   - **4.1.1** (trust patch, patch-scope clean, tagged on a `release/4.1.x` branch created from `78fd7bda1` per OD-13), with the security advisory published before the tag;
   - **4.2.0** (optional-peer diet, real `/forms` and `/data` entries, `./deprecations.json` export, every §14.4 4.2 deprecation active with dev warnings, D-28 visual fixes recorded);
   - **4.3.0** (bridge: `./material`, `preview="v5"`, `./styles/v5.css`, `./compat/{tokens,globals}.css`, every PLAT/MAT/CMP/SURF deprecation with `since ≤ 4.3.0` active, `@auraglass/cli@0.x` published, codemod fixture suites green for every stream including the PR #28 content).
2. **`next`** is 5.0.0 RC-ready: every open REQ of the five PRDs is done (§1.1), `node certification/run.mjs --lane all --scope release --verdict` emits a ReleaseVerdict with all G-01..G-16 items `pass` and `ga: true`, and the 5.0.0 tag pipeline can publish `aura-glass@5.0.0` plus `@auraglass/{cli,registry,mcp,labs}`.
3. **CI**: pipelines run on `next`, `release/4.x`, every `next-*`/`4x-*`/`contract/*`/`sync/*` branch and every `v*` tag; every job named in `REQUIRED_JOBS` and `CERT_JOBS` is `allow_failure: false` with an `activation.json` row recording its first green pipeline URL.
4. **Human evidence**: issue #16 closed with SrRecord JSON for 44 flagships × {VoiceOver macOS, VoiceOver iOS, NVDA/Chrome, TalkBack/Chrome, physical touch iOS/Android} bound to the RC SHA; L14 visual review records for every flagship subject-state, the T0 matrix and the six S1 showcases, all scores ≥3.

---

## 4. Architecture

### 4.1 Unchanged decisions

No architectural decision changes. D-01..D-32, the frozen contract-v1.1 seams S-01..S-55, the per-stream fragment model (`loadFragments(kind)`), the GitLab-only CI model (§4.13), the two-line release model (`release/4.x` for 4.1.1→4.4 LTS, `next` for 5.0, `main` frozen until GA), the per-stream DEP id spaces, and the remote-first execution policy all stand. The one branch addition is the short-lived `release/4.1.x` patch branch (OD-13, Appendix C C-17), which exists only to cut 4.1.1 patch-scope-clean and is frozen after the tag. Where a verified defect can only be fixed by changing a frozen seam, the change goes through one additive contract PR (`contract/v1.2-final`, Appendix C) and is never made silently in a stream PR.

### 4.2 Integration fixes that make streams line up

The streams were built concurrently against seed doubles. The real implementations disagree at these seams; each becomes a REQ-FIN in FIN-A (§5.1) with a single owner, so the fix is made once and every dependent stream REQ inherits it.

| Seam | Producer side | Consumer side | Fix direction (canonical side) |
|---|---|---|---|
| Surface identity | `materialProps()` / `resolveRole` emit `data-ag-surface` + `data-ag-*` only (S-05) | `material.css`, `lens.css`, ladders, floors, `dev/warnings.ts` select `.ag-surface` | Engine selects `[data-ag-surface]`; contract `className: 'ag-surface'` dropped from `MaterialAttributes` (REQ-FIN-02) |
| Material scalars | ladders write `--_ag-mat-{blur,saturation,grain,rim,bezel}`, `--_ag-surface-alpha` on host | engine reads `--_ag-blur`, `--_ag-saturation`, `--_ag-grain-opacity`, `--_ag-rim-width`; `--_ag-blur: 0px` constant | Compiler emits the engine's names on `[data-ag-surface]` cells; WebKit literals on `::before` only (REQ-FIN-03) |
| Floors | floors key `[data-ag-thickness][data-ag-backdrop]` on one element | `data-ag-backdrop` lives on an `Environment` ancestor; thickness omitted by default | Ancestor selectors + default-thickness rows; remove hard-coded 0.6/0.55 (REQ-FIN-03) |
| Provider mounts | `registerProviderMount` registry (S-21) | No production caller; LensDefs, pointer light, dev counter, preset/brand CSS inert; `deprecations` prop not read by `warnDeprecated` | Static registration module imported by `src/theme/index.ts` (REQ-FIN-04) |
| a11y CSS | `src/a11y/css/{rungs,focus,targets,scroll-padding,layers}.css` | Not in any `fragments/css/*.ts`; Storybook globs all CSS so tests see a different sheet set than ships | MAT rows in `fragments/css/mat.ts`; Storybook loads only built CSS (REQ-FIN-05) |
| Entry eligibility | `graph.mjs` drops any entry whose graph text contains `@ag-contract-seed` | comment in `src/root/surf.ts`; real seeds in `src/theme/{public,createGlassTheme}.ts`, `src/motion/public.ts` | Marker matched only as a line-1 header; seeds replaced (REQ-FIN-06) |
| Portals and Escape | `src/theme/portal.ts` (null w/o provider), `LayerStack` (S-23/S-25) | CMP `src/foundation/portal.ts` (document.body), Base UI owns Escape, primitives add document listeners | One `usePortalContainer`, LayerStack is the only Escape dispatcher, push on open (REQ-FIN-07) |
| Test discovery | `listSubjects()` / `gotoStory()` (S-40) | owner hard-coded `PLAT`, readiness set at first effect and never cleared, specs `return` on missing subject | Owner from `contracts/ownership.json`, readiness per story, missing subject = failure (REQ-FIN-08) |
| Package resolution in tests | root Jest maps no `aura-glass`; `packages/` ignored | CLI, registry, capability tests return `PENDING`; codemod fixtures run for `plat` only | Root mapper + `npm test -w packages/*` + all-stream fixture discovery (REQ-FIN-09) |
| Visual class | `qual:certify:l7` → `.artifacts/qual/visual-class.json`; 4x `verify-app-chrome-visuals.js --class-report` | `plat:gate:change-class` (stage `test`, no `needs`) | Gate moves to stage `certify` with optional needs (REQ-FIN-10) |
| Token names | MAT emits `--ag-focus-inner` (colour), `--ag-space-{0..6,8,10,12,16}` | CMP uses `--ag-focus-inner` as a length, `--ag-space-{7,9,48,72}`, `--ag-control-h-*`, `--ag-comp-control-height-*`, `--ag-tint-*` | CMP uses only emitted names; MAT emits the control-height comp tokens (REQ-FIN-11) |
| Motion axes | provider writes `data-ag-motion`; nothing writes `data-ag-continuous` | CMP/SURF loops ungated; calm resets `scale`/`translate` only while popups animate `transform` | Provider writes `data-ag-continuous`; popups use `scale`/`translate` properties (REQ-FIN-12) |
| Deprecation fragments | `release/4.x` (393 entries) | `next` (120 entries; 360 ids only on 4x, 87 DEP-C only on next) | `sync-fragments.mjs` run both ways, generated aggregate via `gen-deprecations.mjs` (REQ-FIN-13) |
| CSS layering | `LAYER_ORDER_STATEMENT`, fragment `layer` field | MAT/CMP/SURF files lack line-1 statement, use `@layer media`/`backdrops`, motion CSS registered as `ag.components` | Every shipped CSS file: statement first, one block equal to its fragment layer (REQ-FIN-14) |

### 4.3 Work-package model

Work packages (WPs) own **disjoint file sets** so every package can start on day 1 and run concurrently:

| WP | Owner stream | Owns (exclusive write) | Must not touch |
|---|---|---|---|
| FIN-A | Integration (one agent per REQ-FIN-01..14, coordinated by PLAT) | exactly the files listed in each REQ-FIN-01..14 "Files" line (union in §6) | anything else |
| FIN-B | PLAT (CI) | `.gitlab-ci.yml`, `ci/plat.gitlab-ci.yml`, `ci/plat/**`, `scripts/ci/{verify-ci-fragments,gitlab-status,assemble-pages,require-activated}.mjs`, `scripts/release/{push-gitlab-refs,verify-branch-protection}.mjs`, the `tests/ci/**` files listed in §6, `docs/release/{branch-policy.md,decisions/gitlab-*.md}`, `.github/CODEOWNERS` | `ci/{mat,cmp,surf,qual}.gitlab-ci.yml` and `ci/{mat,cmp,surf,qual}/**` (stream-owned fragments, contract §4.13) |
| FIN-C | PLAT | PLAT ownership rows of `contracts/ownership.json` minus FIN-A/FIN-B files | `src/{material,motion,theme,a11y,tokens,components,app-shell,data,date,ai,media,backdrops,charts}/**` |
| FIN-D | MAT | MAT rows minus FIN-A files and minus `scripts/mat/verify-a11y-manual.mjs` (FIN-H) | other streams' paths |
| FIN-E | CMP | CMP rows minus FIN-A files | other streams' paths |
| FIN-F | SURF | SURF rows minus FIN-A files | other streams' paths |
| FIN-G | QUAL | QUAL rows (`packages/qa/**`, `certification/**` minus `certification/review/records/**`, `.storybook/**`, `showcase/**`, `scripts/{qual,storybook}/**`, `stories/qual/**`, `tests/{storybook,contract,perf/{harness,qual}}/**`, `ci/qual.gitlab-ci.yml`) minus `tests/helpers/**` (FIN-A) | other streams' paths |
| FIN-H | Humans + owner (plus one agent for the REQ-FIN-110 prerequisites) | `tests/a11y/manual/**`, `scripts/mat/verify-a11y-manual.mjs`, `certification/review/records/**`, `docs/certification/real-device-matrix.md`, `docs/release/decisions/{od-*.md,operator-*.md,removals/RM-*.json,downstream-*.json}` | product code (`src/**`, `packages/**`) |

Rules that keep every WP independent from day 1:

1. **One owner per file.** A file appears in exactly one WP (§6 is the authority). When a requirement mapped to WP X needs a change in a file owned by WP Y, the change is part of WP Y's scope and is listed in §6.1 "Clause transfers"; WP Y implements it from the ledger text, WP X never edits the file.
2. **No WP waits.** Every WP starts on day 1. A consumer writes against the contract-v1.1 type of the seam and runs its dependent tests through the lane runner as `pending` (reported by `certification/run.mjs` or the stream lane, never a `return` inside a spec); the pending state is removed in the PR that sees the producer behaviour.
3. **Expiring baselines for new cross-stream gates.** A gate introduced by one WP that finds offenders in another WP's files (REQ-FIN-07 listener lint, REQ-FIN-11 undefined-vars gate, REQ-FIN-12 loop gate, REQ-FIN-14 CSS-file test, REQ-FIN-21 token scan) lands green with a committed shrink-only baseline `scripts/integration/baselines/<gate>.json` of `{file, owner, reqFin, expires}` rows. The gate fails on any new offender, on a row whose file no longer offends (stale), and on any row after `expires`; `expires` is the RC-1 date. The owning REQ-FIN deletes its rows when it fixes them. AC-FIN-GLOBAL requires every baseline file to be `[]`.

---

## 5. Requirements

Each REQ-FIN lists: **Maps** (original REQ ids; their full text, remaining work and acceptance from the verified ledger stay binding), **Files**, **Work**, **Acceptance**, **Needs** (agent / ci / human / owner). "Ledger" means the verified open-item evidence summarised in Appendix A and the stream PRDs.

### 5.1 FIN-A — Integration breakages (first-class, fix order in §20)

**REQ-FIN-01 Token build green and deterministic.** Maps REQ-MAT-01, -03, -13, -21.
Files: `tokens/$schema.json`, `tokens/legacy/**`, `scripts/tokens/build.mjs`, `scripts/tokens/freeze-4x.mjs`, new `scripts/tokens/drift.mjs`, `scripts/tokens/formats/{compat-aliases,_shared}.mjs`, `tokens/{schema.json,index.json,personas/**}` (deleted; `scripts/tokens/persona-map.mjs` moves to a 4.x-only path under FIN-D).
Work: make `tokens/legacy/4x-rendered.tokens.json` schema-valid (allow `ag.tier: "legacy"`, exempt `ag.legacy` tokens from the `^--_?ag-` pattern, or regenerate in the pre-#59 shape); vendor the 4.1.0 primitives read by `compat-aliases.mjs` from `git show 15b6de6f7` into `tokens/legacy/` and read from disk; delete the second `dist/compat/tokens.css` writer (`build.mjs:298-305`) and add the `[data-theme=dark], .dark` compat block; stop rewriting `tokens/contrast/busy-reference.json`; `prettierFormat` throws when prettier is missing (the pinned devDependency is added by FIN-C, §6.1); delete the 4.x leftovers `tokens/{schema,index}.json`, `tokens/personas/`.
Acceptance: on `git clone --depth 1` of `next`, `npm ci && npm run tokens:build` exits 0 twice with `git status --porcelain` empty; `postcss.parse(dist/compat/tokens.css)` succeeds with 0 `[object Object]`/`$schema`, one `@layer ag.compat`, gzip ≤8192 B; `node scripts/tokens/drift.mjs` (runs the token build, then `git diff --exit-code -- src/tokens src/motion/tokens.generated.ts src/material/css/generated tokens/generated`) exits 0; FIN-D's `mat:test:drift` job (REQ-FIN-53) runs it green (AC-FIN-01). Needs: agent, then ci.

**REQ-FIN-02 Engine keys on `[data-ag-surface]`; interaction states.** Maps REQ-MAT-09, -29, -31, REQ-CMP-34, -78; also implements the `material.css`/`lens.css` clauses of REQ-MAT-26, -42, -43 (§6.1).
Files: `src/material/css/material.css`, `src/material/css/lens.css`, `src/material/dev/warnings.ts`, `scripts/tokens/transforms/glass-material.mjs` (selector strings only), `src/contracts/material.ts` (via contract PR), `src/components/overlays/_shared/{overlaySurface,overlayTypes}.ts`, new `tests/material/state-readers.test.ts`.
Work: replace every `.ag-surface` selector with `[data-ag-surface]` (zero-specificity `:where()` for every rule that must lose to component and app CSS); remove `--_ag-on-surface` host redeclarations that shadow backdrop ancestors; derive `--ag-surface-fill` from `--_ag-fill` only; add `select`/`combobox` overlay kinds with `regular` thickness; add `[data-open]`, `[data-expanded]`, `[data-ag-full-height]` floor rows (or `data-ag-appearance=full-height`, CC-CMP-03). REQ-MAT-09: rewrite the state section on `[data-ag-surface]` reading every `--_ag-state-*` private (hover specular + floor, press glow + floor, selected tint + `--_ag-state-selected-rim-width` + weight cue, loading alpha, `[data-dragging]` lift/specular, drop-target rim/fill), with a `forced-colors: active` block (selected/press → `Highlight`/`HighlightText`, disabled → `GrayText`) and a `[data-ag-contrast=more]` outline form; delete the hard-coded `0.16`/`0.7`/`2px`/`0.06`. REQ-MAT-26/-42/-43 clauses: map `data-ag-spacing`/`data-ag-radius`/`data-ag-inset` to vars and style `data-ag-part="concentric-frame"` and the ScrollEdge background; drop `--_ag-hover` and scope the depth cross-fade so `[data-ag-layer]` does not replace interactive/overlay transition lists; bind `::before` opacity and the `::after` sheen to `--_ag-optics` with a constant `backdrop-filter`, and set `transform-origin` on the resting overlay rule.
Acceptance: rendering CMP `<Button>`, `<Dialog>` (open), `<Select>` popup yields a non-transparent computed background and a non-`none` `::before` `backdrop-filter` for `variant=regular` in a remote Chromium/WebKit/Gecko run; `rg -c '\.ag-surface' src/material/css` = 0; `rg -c 'var\(--_ag-state-' src/material/css/material.css` ≥ 9 and `state-readers.test.ts` fails if any emitted `--_ag-state-*` has no reader; remote check: an `[aria-selected=true]` surface has rim width > 0 and, under forced colours, `Highlight` border colour; `tests/material/tint-formula.test.ts` passes for the 6 opacity inputs (AC-FIN-02). Needs: agent, then ci.

**REQ-FIN-03 Ladder, floor and optics wiring.** Maps REQ-MAT-07, -10, -30, -32, -33, -34, -35, -40.
Files: `scripts/tokens/transforms/{glass-material,contrast-solve}.mjs`, `src/material/css/generated/**` (regenerated), `src/a11y/css/rungs.css` (floor lines only), `tokens/material/material.tokens.json`, `tokens/sys/elevation.tokens.json`.
Work: emit cell scalars `--_ag-blur` (12/20/32), `--_ag-saturation`, `--_ag-brightness` (scheme-resolved), `--_ag-shadow` (two-layer ambient+key per scheme; overlay → thick), `--_ag-rim-width` (thick 1.5px), `--_ag-grain-opacity` on `[data-ag-surface][data-ag-variant][data-ag-thickness]` plus default-thickness rows; never `backdrop-filter` on host; WebKit `-webkit-backdrop-filter: blur(N) saturate(S) brightness(B)` literals on `::before` for standard/enhanced/no-tier only; lightweight `none` and grain ≤0.02; coarse-pointer block (thick 20px, grain ≤0.02); `clear` fail-safe emits the regular row per thickness; drop `auto` from the clear dim selector; floors keyed `[data-ag-transparency=x] [data-ag-surface][data-ag-thickness=y]` with ancestor backdrop; model tinted ≥ glass, solid opaque, every cell over {#fff, #000, busy-min}, 7:1 under contrast=more, 3:1 only for large-only muted; one WCAG module shared with `src/theme/color.ts`; remove hand-written `0.6`/`0.55` floors.
Acceptance: `rg -n 'backdrop-filter' src/material/css/generated/ladders.css` matches only `::before` selectors with no `var(`; a default `<Surface>` with no tier computes `::before` `blur(20px)`; under `[data-ag-backdrop=dark]` `--_ag-tint-floor` equals the regular/dark floors.css value; `rg -n 'tint-floor: *0\.' src/material/css/material.css src/a11y/css` = 0; dead-vars reports 0 unread MAT privates (AC-FIN-03). Needs: agent, then ci (L8 WebKit).

**REQ-FIN-04 Provider mounts register in production; deprecation mode honoured.** Maps REQ-MAT-14 (mount part), -36, -38, -49, -55; feeds REQ-PLAT-26.
Files: `src/theme/providerMounts.ts`, new `src/theme/mounts.ts`, `src/theme/index.ts`, `src/theme/AuraGlassProvider.tsx`, `src/internal/warnDeprecated.ts`.
Work: a side-effect-free registration module (registration runs at provider render, not at import) that registers `lensDefs` (mounted when resolved tier is enhanced/auto, including when the prop is undefined), `pointerLight` (installs only while a `[data-ag-pointer-light]` element exists and motion = full), `devDiagnostics` (dev only, re-arming thresholds), `presetCss`, `brandCss`; provider calls `setDeprecationMode(deprecations ?? 'warn')` in a layout effect; `warnDeprecated` strips a trailing period before appending one; convert `PortalRootMarkup` (`AuraGlassProvider.tsx:31`) from `React.forwardRef` to a ref-as-prop function component. Transferred clauses (§6.1): REQ-MAT-53 nested providers reuse the document store (inner provider scopes app overrides and targets only); REQ-MAT-22 `src/theme/index.ts` stops exporting `createGlassThemeCssVars` and `createBrandGlassTheme` (they move to `src/compat/mat/`, FIN-D).
Acceptance: `rg 'registerProviderMount\(' src -g '!**/__tests__/**'` ≥1 production call; with no manual registration `<AuraGlassProvider brand="#7c3aed">` renders exactly one `<style data-ag-theme-style>`, `tier="enhanced"` on Chromium renders one `svg[data-ag-lens-ready]`, `deprecations="silent"` gives 0 `console.warn`; two nested providers create one store (identity test); `rg -c forwardRef src/theme` = 0; `rg -n 'createGlassThemeCssVars|createBrandGlassTheme' src/theme/index.ts` = 0; the side-effect import gate still reports 0 (AC-FIN-04). Needs: agent.

**REQ-FIN-05 a11y CSS ships.** Maps REQ-MAT-54, -61, -62, -63 (and the shipping clause of -12).
Files: `fragments/css/mat.ts`, `src/a11y/css/{index,rungs,focus,targets,scroll-padding}.css`, new `src/a11y/css/layers.css`, new `src/theme/preferences-panel/GlassPreferencesPanel.css`, `scripts/mat/verify-a11y-css.mjs`. (The Storybook cert-mode CSS import in `.storybook/preview.tsx` is FIN-G's, REQ-FIN-106, §6.1.)
Work: register each a11y CSS file as `{ layer: 'ag.a11y', bundle: 'styles.css' }` (and include in `material.css`); create and register `src/theme/preferences-panel/GlassPreferencesPanel.css` (REQ-MAT-60 transfer: logical properties only, single column under `@media (pointer: coarse)`, `@layer ag.components`); remove `index.css` `@import url()`; rungs read generated floors only, contrast=more uses `color: var(--_ag-on-surface-max)` and `border: 1px solid var(--_ag-border-strong)`, solid uses `var(--_ag-fallback-fill)` (compiler emits these three), no `forced-color-adjust: none`; remove `pointer-events: none` from `[data-ag-part=hit-area]` and add coarse clamp rules; add `[data-ag-layer-root]` z-order from `--ag-z-{overlay,transient,toast}`; reject numeric `var()` fallbacks for `--_ag-tint-floor` and undefined `--_ag-*` refs in the verifier.
Acceptance: built `dist/styles.css` contains `@layer ag.a11y` rules for `[data-ag-surface]`, `[data-ag-focusable]:focus-visible`, `[data-ag-part=hit-area]`, `scroll-padding-block` on `[data-ag-scroll-container]` and `[data-ag-layer-root]` z-index; `node scripts/mat/verify-a11y-css.mjs` exits 0 (AC-FIN-05). Needs: agent.

**REQ-FIN-06 Entry eligibility and root exports.** Maps REQ-CMP-23, -29; unblocks REQ-PLAT-67, -68, -77, REQ-SURF-01, REQ-MAT-50.
Files: `scripts/build/lib/graph.mjs`, `scripts/build/generate-exports.mjs`, `package.json` `exports`/`main`/`types`, new `tests/integration/entry-eligibility.test.ts` with fixtures under `tests/integration/fixtures/seed/`.
Work: a file is a seed only when its **first line** matches `/^\/[*\/] @ag-contract-seed:/` (block or line comment; the real seeds use `/* @ag-contract-seed:`); the marker anywhere else (for example the comment on `src/root/surf.ts:4`) is ignored; `--check` prints every excluded entry with the seed file, its owner from `contracts/ownership.json` and the REQ-FIN that removes the seed, and exits 1 only when an excluded entry has no seed file (stale exclusion); drop `ga: '5.1'` entries on 5.0.x versions (removes `./charts`); add top-level `"types"`; regenerate exports. Seed bodies are replaced by their owners, not here: `src/theme/createGlassTheme.ts` and `src/theme/public.ts` by REQ-FIN-52 (FIN-D), `src/motion/public.ts` by REQ-FIN-58 (FIN-D); `src/contracts/seed.tsx` stays excluded from the package build.
Acceptance: the fixture test proves (a) a line-1 `/* @ag-contract-seed:` file excludes its entry, (b) a line-4 comment does not, (c) `--check` names owner + REQ-FIN for each exclusion; on `next` @ `84a3b94f1` the header-only rule leaves exactly `./material`, `./tokens`, `./icons`, `./forms`, `./data`, `./date` seed-free, and `--check` reports `.`, `./theme`, `./motion`, `./primitives`, `./app-shell`, `./ai`, `./media`, `./backdrops`, `./compat` as excluded because their import closures reach `src/theme/createGlassTheme.ts` (plus `src/theme/public.ts` for `./theme` and `src/motion/public.ts` for `./motion`); this list is the input to REQ-FIN-52, whose acceptance includes `import('aura-glass')` resolving `Button` from the packed tarball; `require('./package.json').exports['./charts']` is undefined on 5.0.x (AC-FIN-06). Needs: agent.

**REQ-FIN-07 One portal, one Escape owner, layers pushed on open.** Maps REQ-MAT-56, -57, REQ-CMP-11, -12, -80, REQ-SURF-60.
Files: `src/theme/{portal.ts,layers/LayerStack.ts,layers/useLayer.ts}`, `src/foundation/portal.ts` (becomes a re-export), `src/components/overlays/_shared/useOverlayLayer.ts`, `src/primitives/{DismissableLayer,FocusScope}.tsx`, `lint/rules/cmp/no-overlay-global-listeners.cjs` (agConfig), `scripts/integration/baselines/no-overlay-global-listeners.json`, new `src/theme/layers/__tests__/layer-stack.integration.test.tsx`. (`src/app-shell/AppShell.SidebarToggle.tsx` and `src/components/command-palette/CommandPalette.tsx` are SURF files: their listener removal and `useLayer` registration are REQ-FIN-80/-82 clauses, §6.1.)
Work: `usePortalContainer` returns `null` without a provider (one implementation); `useLayer` pushes/updates order only while `open`; Escape goes to the topmost **open** entry; modal effects recomputed from the set of open modals (inert below topmost, never the toast root, un-inert the layer-root child containing the top popup); `data-ag-obscured` maintained; Base UI escape dismissal disabled and routed through `onEscape → onOpenChange(false,{reason:'escape-key'})`; the LayerStack API accepts registration from Select, Combobox, Toast, ImageViewer and CommandPalette (each owner wires its component, §6.1); one scroll-lock owner; `DismissableLayer`/`FocusScope` drop document listeners and the `body.style` write; lint at error over `src/components/**`, `src/primitives/**` and SURF overlay dirs, with current offenders outside FIN-A files in the expiring baseline (§4.3 rule 3).
Acceptance: Jest: Dialog → closed Tooltip mounted later → Escape closes Dialog; two stacked modals, pop inner → background still inert; toast root never inert under a modal; Dialog→Popover→Menu depth 0/1/2 = `data-ag-overlay-depth`; `rg -n "document\.(add|remove)EventListener|document\.body\.style" src/primitives src/theme/layers src/foundation -g '!*.test.*'` = 0 and the lint passes with every remaining offender listed in the baseline; `rg -c 'export function usePortalContainer' src` = 1 (AC-FIN-07). Needs: agent.

**REQ-FIN-08 Test-subject discovery, readiness and no vacuous specs.** Maps REQ-QUAL-69; unblocks every APG/e2e/visual/perf REQ of CMP, SURF, MAT.
Files: `tests/helpers/{index.ts,setup.ts}`, new `tests/helpers/__tests__/helpers.test.tsx`.
Work: `listSubjects()` reads `storybook-static/cert-manifest.json` (REQ-QUAL-01 writer, FIN-G) and, until it exists, derives `owner` from `contracts/ownership.json` by story file path (never a literal `'PLAT'`); `gotoStory()` appends `&ag-cert=1`, fixes the globals filter and waits for a per-story readiness token; `perf.frames` cancels its rAF; `perf.bci` delegates to `packages/qa/src/perf/bci.ts`; `renderAg` applies the S-01 attribute set to the document root; `renderAgServer` awaits hydration before restoring console; remove the seed markers; `listSubjects()` throws (never returns `[]`) when neither manifest nor index is reachable; the rule "a missing subject is a failure, never `return`" is enforced by QUAL's vacuous-assertion gate (REQ-FIN-104, REQ-QUAL-31) and each stream converts its own specs (REQ-FIN-59, -70..-76, -80..-90).
Acceptance: `helpers.test.tsx` covers all 9 exports, including an owner derived from `contracts/ownership.json` for a CMP and a SURF story path and a thrown error when the index is unreachable; `rg '@ag-contract-seed' tests/helpers` = 0 (AC-FIN-08). AC-FIN-GLOBAL additionally requires `rg -n "console.warn\([^)]*pending" tests/{e2e,a11y,perf,visual}` = 0. Needs: agent.

**REQ-FIN-09 Package resolution in tests and all-stream codemod fixtures.** Unblocks REQ-PLAT-84..91, REQ-CMP-134, REQ-SURF-14, -170..178, REQ-MAT-67.
Files: `jest.config.js` (via contract PR, the file is frozen), `packages/cli/test/fixtures.test.ts`, `tests/capability/jest.doubles.cjs` (deleted). (The `plat:test:cli` job line `npm test -w packages/{cli,registry,mcp,labs}` is FIN-B's, §6.1.)
Work: root `moduleNameMapper` `'^aura-glass$' → src/index.ts` and `'^aura-glass/(.*)$'` → ENTRIES sources; each workspace package has a `test` script runnable as `npm test -w packages/<name>`; fixture discovery over `fragments/codemods/<every stream>/fixtures/<id>/<case>/` and `packages/cli/src/migrate/4to5/__fixtures__/`, unknown ids `pending` (not a missing transform); delete the CMP-double mappings now that CMP has landed.
Acceptance: `npx jest tests/capability` prints 0 `PENDING`; the cli fixtures test lists `cmp/*`, `mat/*`, `surf/*`, `plat/*` cases (≥120) with 0 mismatches (AC-FIN-09). Needs: agent (contract PR for `jest.config.js`).

**REQ-FIN-10 Visual-class report reaches the change-class gate.** Maps REQ-PLAT-19; consumes REQ-QUAL-26, REQ-PLAT-20.
Files: `scripts/release/{classify-change.mjs,lib/policy.mjs}`, `tests/release/classify-change.test.{mjs,ts}` (both lines), 4x `scripts/ci/verify-app-chrome-visuals.js` (`--class-report`). (The `plat:gate:change-class` stage/needs edit in `ci/plat.gitlab-ci.yml` is FIN-B's, §6.1.)
Work: the gate reads `.artifacts/qual/visual-class.json` (5x) or `.artifacts/plat/plat-test-visual-4x/visual-class.json` (4x) when present (FIN-B moves the job to stage `certify` with the optional needs); 4x visual script writes the report; transferred classify-change clauses: REQ-PLAT-21 (breaking group of each removed symbol from the full merged deprecation set at base and HEAD; `Multi-Family:` trailer read from `git log -1 --format=%B HEAD` only), REQ-PLAT-23 item 8 (diff export snapshots of base and head tarballs), REQ-PLAT-56 install-level cases (dep → optional peer = C-D); missing report on 4x ≥4.2.0 pushes an error; filter cells by `changedRatio > VISUAL_TOLERANCE.changedRatio`; remove `src/index.ts`, `src/root/**`, `src/compat/**`, `deprecations.json` from `CONTRACT_SURFACE`; build real export-snapshot diffs (base worktree + `npm pack`) instead of fixture-only; 4x `classify-change.test.ts` port.
Acceptance: a `next-cmp/*` PR adding a root export classifies C-E; a 4x pipeline with no visual report fails change-class; both lines' classify tests pass with the new cases (AC-FIN-10). Needs: agent, then ci.

**REQ-FIN-11 Token-name seam between MAT and CMP/SURF.** Maps REQ-CMP-19; unblocks REQ-CMP-36, -45, -49, -61, -74, -114, -118.
Files: `tokens/comp/**` (MAT emits comp tokens), new `scripts/tokens/gates/undefined-component-vars.mjs`, `scripts/integration/baselines/undefined-component-vars.json`, new `tests/integration/undefined-component-vars.test.ts`. (CMP CSS replacements and the shared focus mixin in `src/components/control-shared/controls.css` are REQ-FIN-70/-73 clauses, §6.1; SURF's `tokens/sys/app-shell.tokens.json` (deleted here) moves into `tokens/comp/app-shell.tokens.json` as private `--_ag-app-shell-*` per OD-19 in this REQ.)
Work: MAT emits `--ag-comp-control-height-{sm,md,lg}-{compact,default,spacious}` (24/32/44, 28/36/44, 32/40/48), `--ag-switch-track-*`, and intent tint tokens or CMP stops using them; publish the replacement table CMP applies (`--ag-focus-inner` as a length → `--ag-focus-width`, `--ag-color-focus-{outer,ring}` → `--ag-focus-outer`, `--ag-space-{7,9,48,72}`/`--ag-control-h-*`/`--ag-chip-h-*`/`--ag-tint-*` → emitted names) in the gate's error messages; a gate that fails on any `var(--ag-*)` in `src/**/*.css` not in the token manifest or `PUBLIC_CSS_VARS ∪ MOTION_CSS_VARS`.
Acceptance: the gate exits 0 on `next` with every pre-existing offender in the expiring baseline (§4.3 rule 3) and fails on a fixture CSS file using `var(--ag-space-7)`; `dist/tokens.css` declares the 9 `--ag-comp-control-height-*` vars with the listed values; at RC-1 the baseline is `[]`, `rg -n 'outline-offset: var\(--ag-focus-inner\)|0 0 0 var\(--ag-focus-inner\)' src` = 0 and the remote focus spec shows outline ≥2px solid on every focusable CMP part (AC-FIN-11). Needs: agent.

**REQ-FIN-12 Motion axes seam.** Maps REQ-MAT-46; unblocks REQ-CMP-18, -67, -118, REQ-SURF-149, -159, -190.
Files: `src/theme/preferences/store.ts`, `src/motion/css/{motion-modes,loading}.css`, `scripts/mat/verify-motion-css.mjs`, `scripts/integration/baselines/ungated-loops.json`. Transferred clause (§6.1): REQ-MAT-53 runtime validation in `store.set`.
Work: provider writes `data-ag-continuous="on"` only when `allowContinuous && motion === 'full'`; calm resets `transform` as well as `scale`/`translate` for `[data-starting-style]`/`[data-ending-style]` popups (so CMP popups that animate `transform` are covered without a CMP change); move the loading sweep in `loading.css` off `::before`; verifier fails on `infinite` or `--ag-duration-ambient` outside `[data-ag-continuous="on"]` across `src/**`, with current CMP/SURF offenders (Button, Combobox, SearchField, Progress, Skeleton, StateView, `ai.css`) in the expiring baseline; CMP and SURF gate their loops under REQ-FIN-70 (CMP-18), -75 (CMP-118) and -90 (SURF-190).
Acceptance: `verify-motion-css` exits 0 with the baseline and exits 1 on a fixture with an ungated `infinite` animation; at RC-1 the baseline is `[]`; remote browser check shows 0 animations with `iterations === Infinity` 1 s after settle without `allowContinuous` (AC-FIN-12). Needs: agent.

**REQ-FIN-13 Deprecation fragments in sync across lines.** Maps REQ-PLAT-09; unblocks REQ-PLAT-24, -25, -29, REQ-MAT-67, REQ-CMP-132, REQ-SURF-12.
Files: `scripts/release/sync-fragments.mjs`, `tests/release/sync-fragments.test.ts`, `fragments/deprecations/*.ts` on both lines (content changes come from the stream WPs; FIN-A only runs the sync).
Work: direction is fixed by the script and stays: `fragments/deprecations/**` flows `release/4.x → next` (4.x is the source, because every 5.0 removal must ship its entry in a 4.x minor) and `fragments/codemods/**` flows `next → release/4.x` (this is how PR #28's content and every stream's codemod rows reach 4.x). Replace the inline barrel writer with `node scripts/release/gen-deprecations.mjs`; propagate deletions, but refuse (exit 1, listing ids) when the target holds ids absent on the source unless `--allow-delete <id,…>` names them, so the 87 next-only DEP-C ids are never deleted before CMP authors them on `release/4.x` (REQ-FIN-76, CMP-132); fixture-repo test (two bare repos, stubbed `gh`) covering branch name, touched paths, same-day skip, deletion propagation and the target-only refusal; the operator (REQ-FIN-113) runs both directions once per day while any stream has unsynced rows.
Acceptance: after a sync pair, `git diff --stat origin/next origin/release/4.x -- fragments/deprecations fragments/codemods` is empty; generated `src/internal/deprecations.generated.ts` byte-equals `npm run gen:deprecations`; the refusal case exits 1 in the fixture test (AC-FIN-13). Needs: agent + operator.

**REQ-FIN-14 Every shipped CSS file is layer-correct and registered.** Maps REQ-MAT-19, REQ-CMP-09; unblocks REQ-SURF-03.
Files: `fragments/css/{mat,cmp,surf}.ts`, new `scripts/build/verify-css-files.mjs`, `scripts/integration/baselines/css-files.json`, new `tests/integration/css-files.test.ts`. (Each stream fixes line 1 and the outer `@layer` of its own CSS files: MAT under REQ-FIN-58, CMP under REQ-FIN-70 (CMP-08), SURF under REQ-FIN-80 (SURF-03), §6.1. Token-compiler emitter headers are REQ-FIN-01's.)
Work: the verifier enforces, for every `src/**/*.css` and every fragment row: `LAYER_ORDER_STATEMENT` as line 1; exactly one `@layer` block equal to the fragment row's layer (`ag.material` for motion/loading/view-transition; no `@layer media`/`backdrops`); fix the fragment rows (motion CSS → `ag.material`; register `overlays/_shared/overlays.css` and `backdrops/presets/media.css`); no double inclusion (backdrops presets either `@import`ed or registered, not both); no `!important`, no `:root` outside `ag.tokens`/`ag.compat`.
Acceptance: `tests/integration/css-files.test.ts` iterates `find src -name '*.css'` and every fragment row and passes with the expiring baseline; it fails on fixtures for an unregistered file, a missing statement, a wrong layer and an `!important`; at RC-1 the baseline is `[]` (AC-FIN-14). QUAL may import the verifier into its contract suite (REQ-FIN-100). Needs: agent.

### 5.2 FIN-B — CI and validation activation on GitLab

**REQ-FIN-20 Pipelines run for every ref (OD-8).** Maps REQ-PLAT-06.
Owner action (exact, Gurbaksh; outside the agent perimeter per `reference/gitlab-mirror.md`): (1) create a read-only GitHub fine-grained PAT for `auraoneai/auraglass` (Contents: read, Metadata: read) — only Gurbaksh can create it and it is never copied from this Mac's credentials; (2) in GitLab project 87152036 → Settings → Repository → Mirroring repositories, add a **pull** mirror from `https://github.com/auraoneai/auraglass.git` with that PAT, "Mirror only protected branches" **off**, "Trigger pipelines for mirror updates" **on**, "Overwrite diverged branches" **on** (the group is Ultimate-tier, so pull mirroring is available); (3) because the existing `mirror-to-gitlab` workflow force-pushes with `--prune`, disable that workflow for this repo only once the pull mirror is green, otherwise each push-sync deletes the pulled branches. Refs that must reach GitLab: `main`, `next`, `release/4.x`, `release/4.1.x` (OD-13), `next-*/**`, `4x-*/**`, `contract/**`, `sync/**`, tags `v*`. **Fallback** if the PAT is not issued: Gurbaksh (never an agent) runs `node scripts/release/push-gitlab-refs.mjs --apply` from the owner Mac with the existing Keychain GitLab credential after each merge; the script pushes exactly the ref list above, is dry-run by default, refuses under CI or when `$USER` is not the owner, and requires the `--prune` step of `mirror-to-gitlab` to be removed by the owner first (otherwise the next sync deletes the refs). Every applied option is recorded in `docs/release/decisions/gitlab-ci-verification.md`. Agents never push to the GitLab mirror and never edit or re-enable `mirror-to-gitlab.yml`.
Agent work: fix the `glab` fallback in `scripts/ci/gitlab-status.mjs` (`glab api projects/87152036/pipelines?sha=<sha>`); correct W-6 and add the daily merge cadence in `docs/release/branch-policy.md` on both lines.
Acceptance: `node scripts/ci/gitlab-status.mjs --sha $(git rev-parse origin/next)` and the same for `origin/release/4.x` print a pipeline URL (AC-FIN-20). Needs: owner (OD-8), then agent.

**REQ-FIN-21 Root contract gates green on both lines.** Maps REQ-PLAT-02, -04.
Work: `no-github-ci.test.ts` scans the whole tree (`git ls-files`) for `GITHUB_SHA\b|GITHUB_REF\b|GITHUB_EVENT_NAME|GITHUB_WORKFLOW_REF|gh run|secrets\.` with allowed paths only `docs/auraglass-5/archive/**`, `legacy/**` (until deleted), `.github/workflows/mirror-to-gitlab.yml` and an explicit list of contract/PRD files that describe the migration; the four current offenders (`scripts/docs/gen-claims.mjs:38`, `tests/dx/registry-render.spec.ts:46`, `tests/motion/helpers/report.ts:38`, `ci/cmp.gitlab-ci.yml:2`) go into the expiring baseline (§4.3 rule 3) and are fixed by their owners (`CI_COMMIT_SHA`: REQ-FIN-43, -42, -58; comment reworded to "no cloud credentials": REQ-FIN-76); the test also lists the five named workflows and narrows the docs exclusion to `docs/auraglass-5/archive/`; implement verify-ci-fragments rule 5 (evidence name, `when: always`, scoped `expire_in`) and rule 7 (no `<s>:certify:l<n>` outside QUAL); task-graph hook derives base from `AG_LINE` and fails when `docs/auraglass-5/tools/verify-task-graph.mjs` is missing; one fixture per rule asserting its message (rules 1–9, no-github-actions, activation, task-graph hook), plus a `passing/` fixture asserting exit 0. The MAT fragment violations are fixed in `ci/mat.gitlab-ci.yml` by FIN-D under REQ-FIN-53 (`mat:test:tokens-interim` writes under `.artifacts/mat/`; `mat:certify:l5-material` deleted and its specs registered as `fragments/lanes/mat.ts` rows; 4x `mat:build:bridge` writes only to the producer paths added by Appendix C C-8).
Acceptance: `npx jest tests/ci/no-github-ci.test.ts tests/ci/verify-ci-fragments.test.ts` pass on `next` and `release/4.x`; each rule fixture fails with its specific message; `node scripts/ci/verify-ci-fragments.mjs` prints `contract:ci-fragments OK` on both lines once REQ-FIN-53's fragment fix lands, and until then names only `ci/mat.gitlab-ci.yml` jobs (AC-FIN-21). Needs: agent.

**REQ-FIN-22 Fail-closed release gates and activation.** Maps REQ-PLAT-05, -39, -51.
Work: new `scripts/ci/require-activated.mjs --line $AG_LINE`, run as the first script line of `plat:package:pack` on release scope, exits 1 on any tag pipeline where `plat:gate:glass-quality`, `plat:integration:{next,vite}` or `plat:gate:change-class` has effective `allow_failure ≠ false`; `rules: if $CI_COMMIT_TAG → allow_failure: false` on those jobs; `no-gate-bypass.test.ts` reads `ci/plat/activation.json`; every PLAT job writes `.artifacts/plat/$CI_JOB_NAME_SLUG/` with 14d/30d/90d templates; fix the remaining §4.2 job defects listed for REQ-PLAT-05 (removal paths `scripts/removal/*`, 4x react19 job script, 4x `plat:build:docs` → `apps/docs/out`, remove every `|| echo PENDING`, Base UI latest reporting leg, `plat:release:verify-dist-tags` manual on every scope writing `.artifacts/plat/dist-tags.json`). FIN-B also makes every `ci/plat.gitlab-ci.yml` edit requested by another REQ-FIN (§6.1 list), from that REQ's ledger text. Activation procedure for **every stream**: after a job's first green pipeline on a line, the owning WP adds an `activation.json` row `{job, line, pipelineUrl, date}` and flips `allow_failure: false` in the same PR; QUAL lanes follow contract §2.3; `qual:certify:release` is never `allow_failure`.
Acceptance: a synthetic 4x tag pipeline with gates `allow_failure: true` exits 1 at pack; after FIN completion every job in `REQUIRED_JOBS ∪ CERT_JOBS` has an activation row and `allow_failure: false` (AC-FIN-22). Needs: agent, then ci.

**REQ-FIN-23 First green pipelines and recorded facts.** Maps REQ-PLAT-08.
Work: rewrite `docs/release/decisions/gitlab-ci-verification.md` with the four contract facts (multi-ref push pipeline creation, SaaS runner tags on the tier, Playwright image existence, `--provenance` with `SIGSTORE_ID_TOKEN`) × {`next`, `release/4.x`} with result and evidence URL; record multi-ref push FAILED until REQ-FIN-20; OD-11 operator applies config path, protected tags `v*`, nightly schedules on both lines, Pages public, keep-latest-artifacts and records dates in `gitlab-project-settings.md`; `decision-records.test.ts` asserts the 8 rows.
Acceptance: 8 rows with evidence; no PLAT-settable row `missing`; first green pipeline URL per line recorded (AC-FIN-23). Needs: human (OD-11 operator) + ci.

**REQ-FIN-24 Stream CI fragments activated.** Integration requirement with no primary row (the fragment edits are owned by the streams: REQ-CMP-141 → REQ-FIN-76, REQ-SURF-195 → REQ-FIN-90, MAT jobs → REQ-FIN-53, QUAL → REQ-FIN-101).
Work (FIN-B): after each stream's first green job on a line, review and merge the activation row PR (REQ-FIN-22 procedure); keep `verify-ci-fragments` rules authoritative over stream fragments.
Acceptance: every job in `ci/{mat,cmp,surf,qual}.gitlab-ci.yml` has run green on a `next` pipeline and has an `activation.json` row with `allow_failure: false` (AC-FIN-24). Needs: ci, owner (OD-8).

**REQ-FIN-25 Governance under a sole maintainer; forward-port rule.** Maps REQ-PLAT-10, -17.
Work: REQ-PLAT-10: add to `docs/release/branch-policy.md` (both lines) the `forward-port` GitHub label rule (PLAT applies it via `gh` when the touched file survives on `next`), "the file's next owner cherry-picks", security fixes forward-ported within 2 business days, PLAT cherry-picks only PLAT-owned `next` paths; rewrite `tests/ci/no-forward-merge.test.ts` to fail when any non-first parent P of a `git rev-list --merges origin/next` commit satisfies `merge-base --is-ancestor P origin/release/4.x && !merge-base --is-ancestor P origin/main`, with a fixture repo containing a `release/4.x → next` merge (fails) and the real history (passes). REQ-PLAT-17: `verify-branch-protection.mjs` URL-encodes `release%2F4.x`, checks `required_approving_review_count ≥ 1`, per-branch failure counters, status context when OD-9 is on; mocked `gh` test; `.github/CODEOWNERS` on `main` via contract PR; owner decision OD-14 (second reviewer, bot, or documented admin-bypass) applied and recorded.
Acceptance: the no-forward-merge fixture test fails on the fixture and passes on real history; `branch-policy.md` contains `forward-port` and `2 business days`; mocked protection test passes; live run exits 0 for `main`, `next`, `release/4.x`, `release/4.1.x` (AC-FIN-25). Needs: agent, owner.

**REQ-FIN-26 GitLab Pages deploys.** Maps REQ-PLAT-07.
Work: relative lab redirect `../storybook/?path=/story/lab-*`; `pending` in every placeholder `<title>`; registry source `apps/docs/public/r`; `pages` needs `plat:test:registry` (optional); 4x `plat:build:docs` produces `apps/docs/out`; `assemble-pages.mjs` copies `apps/docs/public/_redirects` (written by REQ-FIN-39, PLAT-83) to `public/_redirects` when present and writes a placeholder `_redirects` containing only `/v4/* <release/4.x Pages URL>/:splat 301` otherwise; `tests/ci/assemble-pages.test.ts` asserts the 'pending' titles, the relative `path=/story/lab-` redirect, the `public/r` copy and the `_redirects` copy.
Acceptance: after a `release/4.x` pipeline `curl -sI https://chahal-foundation-group.gitlab.io/github-auraoneai/auraglass/` returns 200 and `/lab/` redirects into Storybook (AC-FIN-26). Needs: agent, ci.

### 5.3 FIN-C — Platform and release leftovers (PLAT)

Each bullet names the original REQ and the remaining work verified in the ledger; the original REQ's acceptance text is the bullet's acceptance unless a stricter one is given.

**REQ-FIN-30 Ownership verifier.** Maps REQ-PLAT-03. (REQ-PLAT-10 is REQ-FIN-25.)
- PLAT-03: add `tests/ci/verify-ownership.test.ts` cases, each asserting its exact message: (a) `zz-unmatched/x` on `next-mat/*` → FAIL naming Z01 PLAT; (b) a real rename in a temp repo (`git init`, commit, `git mv`, run with `--base`) lists old and new paths; (c) `4x-cmp/*` touching `src/components/a.tsx` → FAIL and `fragments/deprecations/cmp.ts` → OK; (d) `sync/fragments-codemods-20261008` with `fragments/codemods/mat.ts` → OK and `src/x.ts` → FAIL; (e) a NONE-owned path → FAIL with the `use tests/<kind>/<stream>/` message; (f) a non-prefixed branch → FAIL; (g) `release/4.1.x` PR branches (`4x11-<stream>/*`) follow the 4x zone rule (OD-13).
Acceptance: ≥1 case per REQ-PLAT-03 rule, the rename case runs real git, all pass on both lines (AC-FIN-30). Needs: agent.

**REQ-FIN-31 Publish chain.** Maps REQ-PLAT-11, -12, -13, -14, -15, -16, -38.
- PLAT-11: `pack-record.json` (sha512 per tarball) written by pack, required by `publish.mjs`; GA verdict must carry `sha === CI_COMMIT_SHA`; package set from `contracts/packages.json`; `tests/release/publish.test.ts` with stub `npm` (≥6 cases).
- PLAT-12: `prepublishOnly` guard first in `packages/{cli,registry,mcp,labs}` pointing at `scripts/ci/require-ci-publish.js`; fix the vacuous `NPM_TOKEN` grep (`git grep -P` or fixed string) and reword PUBLISHING.md files; add GitHub-Actions-env and branch-pipeline guard cases. (`packages/labs/**` clauses are REQ-FIN-87's, §6.1.)
- PLAT-13: `dry-run.mjs` uses `npm publish --dry-run --ignore-scripts`, fetches ancestry refs with `GIT_DEPTH: 0`, calls `verify-release-ledger.mjs`, requires the **first** `## [X.Y.Z]` heading; change-class `PREV` filtered by line; temp-repo test.
- PLAT-14: `distTagFor(version,{ga,rollback,v4DistTag})` pure, rollback case, 7 PRD cases offline; full semver monotonic guard for `latest`, `v4-lts`, `next` with `AG_ROLLBACK_LATEST_TO_4X`; `.artifacts/plat/dist-tags.json`.
- PLAT-15: per-package trusted-publisher table (5 packages × provider, namespace `chahal-foundation-group/github-auraoneai`, project `auraglass`, file, environment `npm-publish`, status, date, first-publish procedure); `packages/{mcp,labs}/PUBLISHING.md`; owner OD-2/OD-10. (`packages/labs/**` clauses are REQ-FIN-87's, §6.1.)
- PLAT-16: `release-notes.mjs --tag --line` on both lines; `dist-maps.tgz` in pack; operator `gh release create` step in the runbook.
- PLAT-38: split `prepublish:verify` from `prepublishOnly`; matrix legs Node 20/npm 10.9 and Node 24/npm 11 green in ≤45 min.
Acceptance: AC-FIN-31. Needs: agent, ci, owner (OD-2, OD-10).

**REQ-FIN-32 Change control.** Maps REQ-PLAT-18, -20, -21, -22, -23.
- PLAT-18: 4x `tests/release/policy.test.ts` (zero bytes today) ported from the `.mjs` test incl. md-table equality.
- PLAT-20: validate `docs/release/visual-fixes/<slug>.json` (id enum, cells, `compositeArtifact`, default-mode filter); convert `4.1.1-font-fallback.md`; 5 negative/positive tests; release-owner reviewer distinct from author (OD-14).
- PLAT-21: the `classify-change.mjs` code (group lookup from the full merged deprecation set, head-commit-only trailer) and its main()-level fixtures and 4x port are delivered by REQ-FIN-10, which owns that file and its test (§6.1); this bullet's acceptance is AC-PLAT-21 evaluated on REQ-FIN-10's tests.
- PLAT-22: call `apiExtractorReport()` and write `.api.md`; 4x mode writes `<slug>.exports.json` with error text; port `api-report.mjs` + `api-extractor.base.json` to 4x and commit 40 4x reports + manifest; regenerate every ENTRIES row incl. `root.cmp`, `compat.plat`; `--all --check` in glass-quality on both lines.
- PLAT-23: jsdom globals in the runner, TS checker for types, `--version`, Node guard, asset `file`, boolean `typesRuntimeMismatch`, committed `etc/snapshots/4.1.0.json`, 4x `tests/release/export-snapshot.test.ts` port with facade (`typesRuntimeMismatch: true`) and `export * from` fixtures; the classify-change wiring (item 8) is REQ-FIN-10's.
Acceptance: AC-FIN-32. Needs: agent.

**REQ-FIN-33 Deprecations and compat composition.** Maps REQ-PLAT-24..30.
- PLAT-24: untrack `deprecations.json`, generate at `prepack` on both lines from `scripts/release/gen-deprecations.mjs` (delete 4x `scripts/ci/gen-deprecations.mjs`); `./deprecations.json` export only from 4.2.0; schema derived from type aliases; `--schema --check` in CI; `tests/deprecations/gen.test.ts`.
- PLAT-25: read `register.items ?? register.changes`; add id-prefix, active/planned vs version, removeIn > since, replacement-in-message, codemod-exists, export-in-snapshot rules; `--compare-branch` both directions; fix the 26 4x errors (DEP-P0001..0011, 6 exception entries, 4.2/4.3 entries → `planned`); `tests/deprecations/verify.test.ts`; wire into glass-quality.
- PLAT-26: `cn` only in `src/internal/cn.ts` (+ lint rule); SURF compat adapters pass DEP-S ids; PRD-regex warning tests incl. production 0 and import side-effect 0 (provider half is REQ-FIN-04).
- PLAT-27: exact TSDoc form on the immediately preceding JSDoc via TS API; reverse check default; 4x TSDoc tags for every active export/prop/prop-value entry; fix `glass-api-stable.ts:295`; `tests/deprecations/tsdoc.test.ts`; wired.
- PLAT-28: coverage against the newest published 4.x tarball incl. props/values/CSS vars/selectors; exact matching; `npm view` since-check with mocked 404; honour exception allowlist; PR non-blocking, GA tag blocking.
- PLAT-29: relabel 4x B-ids (B1, B2, B13), add B12, B15–B19 entries, fix B17/B19 titles, copy `breaking-changes.json` to 4x, wire `gen-deprecations --docs && verify-breaking-register`, `.ts` test; 21 anchors.
- PLAT-30: `src/compat/css/globals.css` as `@layer ag.compat` h1–h6/.flex/.grid ≤1 KB gz; regenerate `compat.cmp.exports.json`; adapters-contract test fails on render error or missing warning (mutation check); per-compat-export size rows (+2 KB); wired.
Acceptance: AC-FIN-33. Needs: agent.

**REQ-FIN-34 Release records, notes, runbook, LTS, train.** Maps REQ-PLAT-31..36.
- PLAT-31: regenerate `ledger-corrections.json` from npm/git/GitLab/CHANGELOG with computed `missingFrom`; `## Ledger corrections` in both CHANGELOGs; fetch failure = error; `.ts` test; tag pipeline step.
- PLAT-32: line-neutral `release-notes.mjs` from commit subjects, `.changeset/*`, change-class artifact, fragments; fixed heading order; numbers traced to artifacts; changesets `version` wiring; test on both lines.
- PLAT-33: rewrite `docs/release-rollback-deprecation.md` (8 scenarios with commands, `AG_ROLLBACK_LATEST_TO_4X`, `tier="standard"`, `data-ag-transparency`, codemod `git checkout .`, no `npm unpublish`); runbook test on both lines; AC-PLAT-19 drill record with a real pipeline URL.
- PLAT-34: missing LTS clauses verbatim; `verify-release-comms` compares exact versions in README banner markers and llms.txt; mocked dist-tags test; run after publish.
- PLAT-35: downstream-grep excludes build/lock dirs, structured hits, fragment-derived removed symbols, PRD report shape at `docs/release/decisions/downstream-<version>.json`; jest test; operator run at the 4.2 cut over AuraOne and `platforms/*` (FIN-H REQ-FIN-113).
- PLAT-36: train gates per stop, `train.md` on both lines, `.ts` test driven by `docs/release/train-checklist.json`.
Acceptance: AC-FIN-34. Needs: agent, ci, human (PLAT-35 operator).

**REQ-FIN-35 4.1.1 trust patch (`release/4.1.x`, cherry-picked to `release/4.x`).** Maps REQ-PLAT-40..50, -52..55. Every bullet's PR targets `release/4.1.x` (OD-13); the same commit is cherry-picked to `release/4.x` in a `4x-plat/*` PR the same day.
- PLAT-40 adaptiveAI opt-in: no tracking in the constructor, `start()/disable()`, capped arrays, idempotent `enableAdaptiveAI()` returning a disposer with one dev warning, `adaptiveAI` stays a 4.1.0-shaped instance, DEP-P0012 kind `export` + exception `privacy`; listener/interval-count test.
- PLAT-41 import side-effect gate: jsdom import of `dist/index.mjs` recording listeners/timers/attribute/style writes against a shrink-only `{effects:[{symbol,kind}]}` baseline; 3 fixture cases.
- PLAT-42 GlassCanvas: `onComponentAction(componentId,'click')`, no string handler, one dev warning; three line-level `no-new-func` disables; delete `isStorybookDataMedia`; DEP-P0013 behaviour/security; Function-spy test.
- PLAT-43 ContrastGuard/validateTextContrast honesty: `data-contrast-status="unverified"` only, callbacks `status:'unverified'`, always-`"unverified"` return, JSDoc + story line, data-attr/behaviour entries.
- PLAT-44 hooks: `enabled` param on `useOptionalInteractionRecorder`; `src/__tests__/hooks-order.test.tsx` (5 spies = 0, rerender toggles); GlassInput aria-id stability; CI-measured count.
- PLAT-45 RSC: `scripts/ci/client-entries.json` generated from source; RSC page imports `aura-glass/theme` with a client child; `next build` in the canary; `use-client-entries.test.ts`.
- PLAT-46 hydration/ref: `useState(false)`+effect in ClientBoundary, reduced-motion and device hooks; Slot ref by `React.version`; hydration and Slot.ref tests on 18.2 and 19; fix the false decision-record claim.
- PLAT-47 React 19 legs: install react@19 `--no-save`, element-ref spy setup, rename decision record, flip after green.
- PLAT-48 reduced motion: lint rule flags empty-object conditional branches; convert the 9 remaining sites; regenerate the 35-file table from `rg`; cookie-consent exception.
- PLAT-49: release-note line for the command-palette regex fix; optional 4.1.0 fixture.
- PLAT-50: `git rm .audit-inspect.mjs`, explicit deny list in `verify-tree-hygiene.js`, Storybook build and `tsc` green on 4x CI.
- PLAT-52 claims: README/llms.txt rewrite per REQ text, exact retraction blocks, `/certified green/i` and `./reports/` link patterns, `tests/docs/claims-lint.test.ts`; GitHub Release text edit as operator action.
- PLAT-53 security: `assertJwtSecret(process.env)` first in `server/index.ts`, `resolveJwtSecret` validates env secrets, spawn test, advisory draft `docs/security/advisories/2026-10-hosted-runtime.md` (6 sections); GHSA publish = OD-21 owner action before the tag.
- PLAT-54 fonts: full system stack in every listed file (fix `designConstants.ts` stray quote, `GlassDataChart.tsx:720`), decision record `4.1.1-font-licence.md`, Aeonik check in `verify-pack.js`, `tests/ci/tarball-fonts.test.ts`, before/after composites.
- PLAT-55 change-control baseline (OD-13): create `release/4.1.x` from `78fd7bda1` (last patch-scope-clean commit; it has only the 145-line bootstrap CI) and cherry-pick the CI and release-tooling commits `85e844776`, `f4d5f884b`, `4dabc703b` (none touches `package.json`) plus every later FIN-B/FIN-C tooling commit; every PLAT-40..54 fix lands on `release/4.1.x` first (PR branches `4x11-<stream>/*`) and is cherry-picked to `release/4.x`; bump `release/4.x` `package.json` to `4.2.0-pre.0`; at the cut commit `etc/api/*.api.md` + `*.exports.json` for all 47 keys and `manifest.json`; `tests/ci/package-json-patch-scope.test.ts` deep-equals `dependencies`/`peerDependencies`/`exports` against `git show 15b6de6f7:package.json`; `tests/deprecations/seed-4.1.1.test.ts` (≥19 entries, honesty exception, no `since: '4.2.0'`, every export symbol present in `etc/api/index.exports.json`). Tagging at `78fd7bda1` itself is not allowed (its CI cannot run the §4.2 publish chain).
Acceptance: AC-FIN-35. Needs: agent, ci, owner (OD-13, OD-21).

**REQ-FIN-36 4.2 and 4.3 bridge (release/4.x).** Maps REQ-PLAT-56..63.
- PLAT-56: `react-hook-form` in one role only; `tests/release/diet-4.2.test.ts` (exact error per moved peer in a sandbox); install-level classify cases; `RELEASE_NOTES_4.2.0.md` with moved deps first.
- PLAT-57: real `src/{forms,data}/index.ts` rollup entries and exports; per-entry gzip table `build/budgets-4x.json` with ratchet test; side-effect report mode in `plat:build:dist`.
- PLAT-58: missing DEP-P entries (keyframes, glassMixins, interactiveGlass, v2 block, getPersona*, 28 `recipe:<id>` cli rows, registry exports); `warnDeprecated` in services, `useGlassProbes`, alias barrels, interactiveGlass; `tests/release/providers-wrap.test.tsx`.
- PLAT-59: destructure `value/onValueChange` in `src/workspace/index.tsx`; delete FPS loops; `prefers-contrast: more`; dark on-surface OKLCH L ≥0.92 C ≤0.02; remove GlassSwitch shimmer; four `docs/release/visual-fixes/*.json` with measured contrast; `tests/release/4x-fixes/` (6 behavioural tests).
- PLAT-60: build steps emitting `dist/material/index.{mjs,cjs,d.ts}`, `dist/styles/v5.css`, `dist/compat/tokens.css`, `dist/compat/globals.css`; prune script checks dist targets; tarball-based `bridge-wiring.test.ts` (0 dangling exports).
- PLAT-61: `doctor --v5` built from `packages/cli/src/doctor/checks.ts` with a JSON parity test; `add` prints the replacement exactly once.
- PLAT-62: port `verify-breaking-register.mjs --coverage` (writes `.artifacts/plat/deprecation-coverage.json`) to 4x and add it to the tag pipeline; publish `@auraglass/cli@0.x` via OIDC after `migrate 4to5 --dry-run` on the consumer fixture and `npm test -w packages/cli`; the `v4.3.0` tag requires non-empty `fragments/codemods/{mat,cmp,surf}.ts` on `release/4.x`, which arrive through the `next → release/4.x` codemods sync (REQ-FIN-13) of the rows authored on `next` by REQ-FIN-57 (MAT, PR #28's content), REQ-FIN-76 (CMP-133) and REQ-FIN-80 (SURF-14); `qual.ts` stays `{}` (QUAL declares no codemods, recorded in `docs/release/decisions/operator-codemods-qual.md`); `release-notes.mjs` on 4x.
- PLAT-63: `consumer-4x` as a real App Router app + Vite app installed from the packed tgz, ≥30 root exports, 3 aliases, every surviving subpath, CSS/vars/props/provider/date-fns usage, `flagship-subset.json`; wired into `run-{next,vite}-integration.js` and `visual-4x`; `consumer-4x-contents.test.ts`; FROZEN only after the first green run.
Acceptance: AC-FIN-36. Needs: agent, ci.

**REQ-FIN-37 5.0 build, module graph, types, exports, runtime floors.** Maps REQ-PLAT-64..73.
- PLAT-64: pin `prettier` as an exact devDependency (REQ-FIN-01 transfer); `build/README.md` (tool choice, Rollup fallback trigger, attw node10 decision, CSS baseline); `single-build.test.ts` asserts deleted legacy files, no rollup/bundlesize, exact scripts, esbuild confinement.
- PLAT-65: `tests/build/{preserve-modules,directives-preserved,dist-purity,externals,no-module-twins}.test.ts`; pure `displayName` emission in `post.mjs`; seed-skipped entries reported, never silent.
- PLAT-66: `tsc -p tsconfig.build.json --noEmit` before emit; JSX-namespace d.ts hygiene; `types-runtime-graph.test.ts` (bundler + node16); `tests/exports/no-foundation-types.test.ts`.
- PLAT-67: decide the `css` export condition (OD-16 contract PR) and regenerate; `./icons/*` row; top-level `types`; `build/v4-exports.snapshot.json` (47 keys); `--list-entries --json`; six `tests/exports/*` suites incl. tarball `removed-subpaths` (ERR_PACKAGE_PATH_NOT_EXPORTED) and `no-duplicate-names`, `root-export-count ≤160`.
- PLAT-68: `tests/exports/node-esm-require.test.mjs` 8/8 on node:20.19.0 and node:22 in pack-matrix (needs REQ-FIN-06).
- PLAT-69: rewrite `use-client-required.cjs` to the spec signal list, error on PLAT globs/warn elsewhere with RC-1 flip, ≥12/12 RuleTester; `server-safe.mjs` from ComponentMeta `rsc:'server'` + cn/tokens/glyphs under `react-server`, committed `build/server-safe-exports.json` with `--check`; delete `legacy/src/server/**`.
- PLAT-70: trap covers `<html>` attribute/style, `head.appendChild`, `webkitAudioContext`, optional peers, `{module,api}` exceptions, semver expiry; bare-import ≤64 B minified via tarball under esbuild and Rolldown; Node trap; cold import median of 11 ≤150 ms on 20.19 and 22.
- PLAT-71: remove `d3-scale`/`d3-shape` peers until 5.1 (or OD-16 contract PR); machine-readable `transitiveCeiling` in `docs/size-budgets.changelog.md`; canary `npm ls` single react/react-dom/@base-ui/react; D-26 calibration job runs nightly and reports `pending` while Button or Dialog entries are seed-excluded, and records the ceiling on its first non-pending run.
- PLAT-72: the 30 `forwardRef` files are converted by their owners (CMP 5 files / 42 calls under REQ-FIN-70 CMP-03; SURF 21 files under REQ-FIN-80 SURF-10; `src/theme/AuraGlassProvider.tsx` under REQ-FIN-04); remove the `PLAT_OWNED` path filter, with remaining offenders in an expiring baseline (§4.3 rule 3); 19.0.0 and 19.3.x floor-import matrix; `canaries/vite-compiler/tests/smoke.spec.ts`.
- PLAT-73: fix `api-report.mjs` ROOT (`'..','..'`) with a repo-root CLI test; `publint --strict`, `attw --pack . --profile esm-only`; generated `canaries/types-strict/src/imports.ts` (no `aura-glass/internal`); `tests/exports/api-report-inputs.test.ts`.
Acceptance: AC-FIN-37. Needs: agent, ci.

**REQ-FIN-38 CSS assembly, Tailwind bridge, size budgets, canaries, tarball.** Maps REQ-PLAT-74..78.
- PLAT-74: `minify: true`; `@supports` guard for `color-mix`; reject unlayered fragment rules; selector-prefix `build/css-ownership.json`; copy MAT outputs (tokens/material/compat tokens) instead of reassembling; five `tests/css/*` suites.
- PLAT-75: rewrite `gen-tailwind-bridge.mjs` (explicit `--color-*`, `--radius-*`, `--shadow-*` mapping; real `glass-*` declarations; `[data-ag-scheme=dark]`); compile with `@tailwindcss/node` in the test; `canaries/vite-tailwind4/tests/bridge.spec.ts`.
- PLAT-76: PLAT rows import real public subpaths; bundle failure = fail unless seed-pending; import `PROVISIONAL_ROWS`/`DEFAULT_CEILINGS`; metafiles to `.artifacts/plat/size/`; base-branch ratchet with `Perf-Budget-Raise:` trailer; compat rows (+2048 B); fixtures.
- PLAT-77: canary layouts import `aura-glass/theme` (the canary job reports `pending`, not pass, while `./theme` is seed-excluded per REQ-FIN-06's `--check` output); generated server pages from `server-safe-exports.json`; fix the vacuous cascade and forced-colours assertions; axe colour-contrast at 1440×900 and 390×844; `next build` wall-time delta; RSC client-reference check; vite-tailwind4, vite-compiler tests; Base UI latest leg; non-`allow_failure` blocking canaries.
- PLAT-78: `pack-breakdown.json`, seed scan of every dist file, `dist-maps.tgz` artifact linked via the pack job's artifact URL, ≥3 negative tarball fixtures.
Acceptance: AC-FIN-38. Needs: agent, ci.

**REQ-FIN-39 Removal of `legacy/**` and server extraction.** Maps REQ-PLAT-79..83.
- PLAT-79: follow-up RM-14 PRs deleting every remaining `legacy/**` path (239 files; incl. workers, server, lib); `scripts/removal/revert-dry-run.mjs`; gate paths fixed and `--family`; `plat:gate:removal` blocking.
- PLAT-80: move the generator to `scripts/removal/`; fix GlassHoverCard (compat → Popover openOnHover), GlassTimelineRail and GlassAdvancedDataViz (removed); R-01..R-18 named assertions; owner/target/codemod columns; `inventory-remove-progress.test.ts`, `deprecations-coverage.test.ts`.
- PLAT-81: `scripts/removal/consumer-grep.mjs` with `{family, sha, hits[], acknowledged[]}`; operator runs RM-01..13 on the owner Mac (REQ-FIN-113); gate rejects missing/stale/unacked; fixture test.
- PLAT-82: owner publishes the GHSA and creates private `auraoneai/auraglass-server-archive` (OD-21); `verify-archive.mjs` byte-identical; delete `legacy/src/server/**`; blocking record check.
- PLAT-83: restore `scripts/docs/gen-redirects.mjs`, `apps/docs/redirects.json`, and write `apps/docs/public/_redirects` with a 301 per docs path deleted in `4842edc5e` plus `/v4/*` (FIN-B's `assemble-pages.mjs` copies it; this WP never edits that script); port the three migration guides in full; restore `tests/docs/{redirects,docs-removed}.test.ts`.
Acceptance: AC-FIN-39 (`git ls-files legacy | wc -l` = 0 before RC). Needs: agent, human, owner.

**REQ-FIN-40 `@auraglass/cli`.** Maps REQ-PLAT-84..92.
- PLAT-84: `packages/cli/schema/output/<command>.json` + validation of every `--json`; fix `files`; colour when enabled; tarball ≤15 MB and no `aura-glass` bin; `--version` p95 ≤300 ms over 20 cold runs; stale-string scan; list/info against a fixture registry.
- PLAT-85: `realpath()` resolves the nearest existing ancestor (fixes the `link/new/file.ts` escape); `assertClean` independent of `allowDirty`, failure = refusal; guard in every writer; unified-diff/hash `--dry-run`; real fs-safety, git-guard, dry-run tests.
- PLAT-86: `init` writes the layer statement before `@import "aura-glass/styles.css" layer(ag)`, tailwind bridge import, AST-edited `app/layout.tsx` + `app/providers.tsx`, Vite `main.tsx` + prepaint inline, full `auraglass.json`, Pages/React Router detection, install execution, idempotence ("no changes"), ≤2 s.
- PLAT-87: DFS with `visiting`/`done` (diamonds OK, cycle path printed); vendored shadcn v4 schema pinned by sha256 in `schema/SOURCE.md`; merged cssVars in one `@layer ag`; dependency install; target/alias honouring; `add <component> --source` eject with literal bans; diff/update four states, `--force` `.auraglass-upstream`; ≤3 s add.
- PLAT-88: duplicate react/base-ui = fail; MUI/Radix "Coexists with AuraGlass; not required"; `--v5` summary totals and per-codemod automation; frozen `doctor-v5.expected.json` ≤5 s; 2,000-file ≤30 s; 4.1.0 audit/migrate-icons goldens; exact report-only wording.
- PLAT-89: §15.2 thresholds; `schema/audit-backdrop.json` request/response validation; per-surface output; mocked tests; no Playwright in the CLI bundle; reference endpoint and manual `plat:audit:backdrop` (else 5.1 per OI-5).
- PLAT-90: positional paths honoured; unknown transform exit 2; `{transform,line,before,after}` report written in dry-run and schema-validated; lint over all transforms incl. template literals; `DOC_NAMES` allowlist removed; preserve/deps/removed tests.
- PLAT-91: `minCases` per id in `catalogue.json` and `catalogue-coverage` asserting discovered ≥ minCases (discovery itself lives in `packages/cli/test/fixtures.test.ts`, REQ-FIN-09); real `tsc` fixtures-typecheck vs a vendored 4.3 d.ts snapshot and 5.0 d.ts; deprecation-coverage asserts `missing` = [] and 0 TODO for `automation: full`.
- PLAT-92: 28 recipe fixtures with `expected-todos.json` + frozen app and `flagship-subset.json`; packed-CLI Playwright canary across 3 browsers (≤15 s each, idempotent); 2,000 files ≤60 s and ≤1.5 GB RSS; dx Playwright config.
Acceptance: AC-FIN-40. Needs: agent, ci.

**REQ-FIN-41 TypeScript DX over the packed d.ts.** Maps REQ-PLAT-93.
Rewrite `tests/types/plat/{autocomplete.test-d.ts,completions.test.ts}` to import `aura-glass` from `.artifacts/pack` (pending when absent): Button `variant` exactly `regular|clear|identity`, intent = meta, banned keys rejected, Surface/Dialog/`aura-glass/data` completions equal `*.meta.ts` sets, compat entries carry the `deprecated` modifier; run `tsc -p tests/types/plat` in `plat:test:cli`. Acceptance: widening Button `variant` to `string` fails the test (AC-FIN-41). Needs: agent.

**REQ-FIN-42 Registry build, lint, PLAT blocks, render gate, recipe fates.** Maps REQ-PLAT-94..98.
- PLAT-94: base item `cssVars.theme` + light/dark from the manifest; fail on unknown `--ag-*`; deps exactly `aura-glass@^5`; `lib/auraglass.ts` re-exports `cn` from `aura-glass`; report copied to `.artifacts/plat/`; shadcn interop spec via dx config; byte-identical double build.
- PLAT-95: fix the 56 lint violations (47 meta-components, 5 declared deps, 3 inline optics, 1 colour literal).
- PLAT-96: map `aura-glass` in Jest (REQ-FIN-09), remove warn-and-return, settings block test, `parameters.ag` per S-41.
- PLAT-97: `tests/dx/registry-render.spec.ts` reads `CI_COMMIT_SHA` (never `GITHUB_SHA`); render gate over packed `aura-glass`/`@auraglass/{cli,registry}` in scaffolded Next 16 and Vite apps; full capture matrix (1440×900, 390×844, 360×740 for mobile-settings × light/dark × glass/solid) with overflow, layout predicates, targets, axe (Chromium+WebKit, forced colours, contrast more, reduced motion), landmarks, Tab reachability, JS ≤60 KB gz, ≤2 long tasks at 4× throttle, pixel gates with OCR; certification artifact consumed by `build.mjs` (`certified == CI_COMMIT_SHA`).
- PLAT-98: correct the 8 recipe-fate rows and assert the exact id → target map with targets on disk.
Acceptance: AC-FIN-42. Needs: agent, ci.

**REQ-FIN-43 Docs app, generated reference, guides, docs gates, quickstart, claims, migration guide.** Maps REQ-PLAT-99..105.
- PLAT-99: MDX catch-all route with `generateStaticParams`, `next/link`, exact nav IA (Components from metas, Surfaces from certified items), Environment + 8 SCENES examples, Sheet mobile nav, focusable code regions, 390 toggle; tgz path from version; `plat:build:docs` needs pack; `docs-artifact.test.ts`, `docs-ia.test.ts`.
- PLAT-100: generation from `*.meta.ts` + TS API over packed d.ts (fix the replacer bug); parts/states/keyboard/RSC/size/Replaces/selectors/examples; `public/components/<slug>.md`; real `--check`; `tsdoc-coverage.test.ts` (100 % T0/T1, ≥95 % T2), `docs-pages.test.ts`.
- PLAT-101: 8 guides (tailwind, plain-css, shadcn, nextjs, vite, react-router, testing, ai-agents) + generated `rsc.md` table; `docs-content.test.ts`; `tests/dx/plain-css.spec.ts`.
- PLAT-102: one strict `ts.Program` snippet check vs packed d.ts incl. examples/README/jsx fences; delete the baseline at 0 failures; import bans; route-aware case-sensitive link checker; `docs-a11y.spec.ts`, `docs-lighthouse.spec.ts`; build ≤10 min, out ≤150 MB.
- PLAT-103: ≤6-command quickstarts to `app-frame`; verdaccio-seeded 4-cell spec (next-tailwind/next-plain/vite-plain/vite-tailwind) with timing, material presence, 0 console errors, glass-regular parity; real `alpha-smoke` fallback; `.artifacts/plat/quickstart-timing.json`; generated README quickstart region.
- PLAT-104: `gen-claims` on `CI_COMMIT_SHA` (removes the `GITHUB_SHA` baseline row of REQ-FIN-21) with per-artifact sha custody, GA = `v5.x.y` tag, aligned artifact paths, `TARBALL_MB`; paired-region `render-claims`; PRD-verbatim `lint-claims` over README, docs, `llms.txt.tmpl`, release body; rewritten `README.tmpl.md`; `readme-generated.test.ts`; chain run in docs and release-notes jobs.
- PLAT-105: `gen-deprecations --docs` → `apps/docs/generated/migration/deprecations.md`; generated `5.mdx` sections (Before you start, Run the codemods, By component, Removed, Rollback); generated Storybook migration pages; test reads `.entries` against built HTML.
Acceptance: AC-FIN-43. Needs: agent, ci.

**REQ-FIN-44 Agent DX.** Maps REQ-PLAT-106.
Generated `llms.txt` ≤12 KB (version, subpath map, flagship lines, do-not list, Versions; no Glass* recommendations) in the tarball; `llms-full.txt` Pages-only; `@auraglass/mcp` on `McpServer` + `StdioServerTransport` with the five tools `search_components`, `get_component`, `list_registry`, `get_registry_item`, `get_migration`, zod schemas, exact zod pin, `data/mcp-data.json {version, sha, …}`, sha in serverInfo, fixed start script; `packages/mcp/test/tools.test.ts` under `node --permission --allow-fs-read`, initialize ≤500 ms; `tests/docs/llms.test.ts`. Acceptance: `tools/list` returns exactly the 5 names (AC-FIN-44). Needs: agent.

**REQ-FIN-45 Release execution (4.1.1, 4.2.0, 4.3.0, 5.0 pre-releases).** Maps no single REQ; it is the integration acceptance of FIN-C §3 item 1 and consumes REQ-PLAT-13, -31, -32, -38, -55, -62, REQ-MAT-67, REQ-CMP-132, REQ-SURF-12.
Procedure: every tag is cut per `AURAGLASS_5_MASTER_PRD.md` train and published only by `plat:publish:npm`; the AuraOne/AuraFoundry production runbook is **not** involved (`aura-glass` is a library); no local `npm publish` ever (the guard refuses). Order: OD-13 decision → `v4.1.1` tagged on `release/4.1.x` (advisory published first, OD-21) → sync fragments (REQ-FIN-13) → `v4.2.0` (downstream grep attached) → `v4.3.0` (`@auraglass/cli@0.x`) → `v5.0.0-alpha.N` from `next` on the fixed train → RC → GA (FIN §18).
Acceptance: `npm view aura-glass versions` contains `4.1.1`, `4.2.0`, `4.3.0`; dist-tags verified by `plat:release:verify-dist-tags` artifacts; GitLab Releases exist with working `dist-maps.tgz` links (AC-FIN-45). Needs: ci, owner.

### 5.4 FIN-D — Material leftovers (MAT)

**REQ-FIN-50 Token source, guards, namespace, colour, scales, motion tokens.** Maps REQ-MAT-02, -04, -05, -06, -08.
- MAT-02: fixtures `{blur-cap,bezier-y,spring-zeta,spring-response,comp-ref-leak}`; key-walking `guardPresets`; ref-leak guard; `createGlassTheme.guard.test.ts` (≥11 guard cases).
- MAT-04: rename non-contract `--ag-*` (app-shell, tinted-floor, scrim-blur, group-spacing, fallback-fill, on-surface-max, border-strong, on-surface-disabled, focus-offset, hit-gap, accent-1..12) to `--_ag-*` or add them through the contract PR; manifest types in the contract union; set-equality test (no whitelists). (The `tokens/sys/app-shell.tokens.json` move is REQ-FIN-11's.)
- MAT-05: `@supports not (color: oklch(0 0 0))` hex/rgb fallbacks for all 13 `--ag-color-*` per scheme with alpha kept; full sRGB shadow strings.
- MAT-06: every `[data-ag-density]` block redeclares `--ag-density` and the 11 `--ag-space-*` reading `var(--ag-density)`; nested-density browser check.
- MAT-08: settle T at the start of the 50 ms hold → 300/470/650 ms; snappy fallback `--ag-ease-standard`; `motionTokens.spring.{name}.{zeta,response,duration,linear,stiffness,damping}`; ≤40 stops/≤600 B test with smooth 322.3/32.31.
Acceptance: AC-FIN-50. Needs: agent.

**REQ-FIN-51 Contrast recompute, modes.** Maps REQ-MAT-11, -12. (REQ-MAT-09 is REQ-FIN-02.)
- MAT-11: parse `generated/floors.css` and assert each row = max cell floor; per-pair thresholds (4.5/7/3) from the PRD model, not the solver; −0.05 mutation fails.
- MAT-12: `[data-ag-transparency="tinted"]` block; reduced-transparency mirror uses the tinted set; forced-colours token block; zero-JS parity visual spec (6 modes × 3 engines ≤0.1 %).
Acceptance: AC-FIN-51. Needs: agent, ci.

**REQ-FIN-52 Presets, createGlassTheme, createBrandTheme.** Maps REQ-MAT-14, -15, -16.
- MAT-14: `data-ag-theme` added to `AG_ATTRIBUTES` via the contract PR (OD-16) or scoped per-preset cssText; neutral ramps from `neutralHue`; `canvas/accent/on-accent/border` as `light-dark()`; provider test without manual registration (reported `pending` by the lane until REQ-FIN-04's mounts are on `next`).
- Seed replacement (first in FIN-D, it gates nine entries per REQ-FIN-06): replace the C0 seed bodies of `src/theme/createGlassTheme.ts` and `src/theme/public.ts` with the real implementation and remove their line-1 `@ag-contract-seed` headers; acceptance: `node scripts/build/generate-exports.mjs --check` no longer excludes `.`, `./theme`, `./primitives`, `./app-shell`, `./ai`, `./media`, `./backdrops`, `./compat`, and from the packed tarball `node -e "import('aura-glass').then(m=>console.log(!!m.Button))"` prints `true`.
- MAT-15: `color-scheme` for mode light/dark/high-contrast; contrast `more` and density applied; one dev warning when `adjusted` is non-empty; dark-scheme pairs; `createGlassThemeCssVars` → `src/compat/mat/theme.ts`.
- MAT-16: `accentShift` default 0 (OD-18); private `--_ag-accent-1..12`; 240 ramp-pair assertions; `createBrandGlassTheme` → `src/compat/mat/` with `warnDeprecated`; `etc/api/theme.*` regenerated.
Acceptance: AC-FIN-52. Needs: agent, owner (OD-16, OD-18).

**REQ-FIN-53 Variable gates, raw-value rule, optics lint, MAT CI fragment.** Maps REQ-MAT-17, -18, -39.
- `ci/mat.gitlab-ci.yml` (MAT-owned fragment): `mat:test:tokens-interim` writes only under `.artifacts/mat/<slug>/` and runs `npm test -- tests/tokens` (vm-modules); delete `mat:certify:l5-material` and register its specs as `fragments/lanes/mat.ts` rows; add `mat:test:drift` (`node scripts/tokens/drift.mjs`) and `mat:lint:literals`; 4x `mat:build:bridge` writes only to Appendix C C-8 producer paths. Acceptance: `node scripts/ci/verify-ci-fragments.mjs` prints `contract:ci-fragments OK` on both lines.
- MAT-17: entries from `loadFragments('css')` mat rows; no generated-file exemption for `--_ag-*`; findings classified by owning stream (`pre-existing (<stream>)`), exit 1 on MAT only; MAT's unread privates wired or deleted; L1 job blocking.
- MAT-18: `literals.mjs --stream <s>` reading/writing `fragments/literals-baseline/<s>.json`; never write a fragment for a custom `--baseline`; restore `mat.json` (it currently holds the leaked fixture `{"src/a.ts":{"color":1}}`) and drive MAT to 0 (delete `src/theme/materials.ts`, tokenise prepaint/store); error on MAT globs, warn elsewhere, mirrored in stylelint; `tests/lint/mat/no-raw-design-values.test.ts`; `mat:lint:literals` job.
- MAT-39: optics lint over `src/**`, `stories/**`, `tests/**`, `apps/**` at error or baseline-tied `--max-warnings`; re-record the recipe baseline (N=11 today vs 2) and run `--ratchet`; retire `no-inline-glass` via contract PR; fix the `isMain` symlink bug in `scripts/mat/*.mjs` (`fileURLToPath` + `realpathSync`).
Acceptance: AC-FIN-53. Needs: agent, ci.

**REQ-FIN-54 shadcn interchange and entry parity.** Maps REQ-MAT-20, -22.
- MAT-20: `data-ag-shadcn-source` in `AG_ATTRIBUTES` (OD-16) or the authoritative block gated off; regenerate; 8-name and cycle assertions.
- MAT-22: drop `createGlassThemeCssVars`/`createBrandGlassTheme` from `./theme`; `./tokens` exports only `tokens` with no `--_ag-*`; fix the `material-css-api.mjs` and `types-runtime.mjs` crashes; `tests/material/exports/entries.test.ts` over ./material, ./theme, ./tokens, ./motion, root.mat; `api:update` for the four entries + root.mat + compat.mat.
Acceptance: AC-FIN-54. Needs: agent.

**REQ-FIN-55 Material API: materialProps, Surface, structural parts, attributes, registered properties.** Maps REQ-MAT-23, -24, -26, -27, -28.
- MAT-23: internal `componentMaterialProps(role, sizeClass)` (not in public types); emit `data-ag-thickness` when derived; Button and Toolbar use it.
- MAT-24: `cn` instead of `clsx`; `style` only when passed; export `GlassPrimitive`, `GlassAdvanced`; one DEP-M id per compat adapter; no adaptive→regular rewrite; `tests/types/mat/surface.test-d.ts`.
- MAT-26: CSS maps `data-ag-spacing`, `data-ag-radius`, `data-ag-inset` to vars; `data-ag-part="concentric-frame"`; concentric fallback radius; visible ScrollEdge background; group/concentric e2e.
- MAT-27: register `data-ag-theme`, `data-ag-shadcn-source`, `data-ag-scroll-locked`, `data-ag-hit-clamp`, `data-ag-focus-inset`, `data-ag-lens-defs` through OD-16 or rename to `data-ag-part`; remove `data-ag-theme-style`; disabled cells on `[data-disabled]/[aria-disabled]`; documented non-ag state attributes; `tests/material/attribute-discipline.test.ts`.
- MAT-28: hand-authored `src/material/css/properties.css` with exactly the 14 registrations and PRD initial values; stop emitting the generated `properties.css` in `scripts/tokens/formats/property-registry.mjs` (the regenerated `src/material/css/generated/**` is committed by REQ-FIN-03's drift run); motion CSS `@property` blocks removed; repo-wide ≤16 unique registrations test.
Acceptance: AC-FIN-55. Needs: agent, owner (OD-16).

**REQ-FIN-56 Cinematic boundary.** Maps REQ-MAT-37. Write `apps/docs/content/mat/cinematic-contract.md` with the 7 admission rules; register `verify-material-runtime.mjs` as an L1 row. Acceptance: L1 log `[verify-material-runtime] OK` (AC-FIN-56). Needs: agent.

**REQ-FIN-57 4.x material bridge and PR #28 content.** Maps REQ-MAT-41, -67.
- MAT-41: port the 5.0 compiler (or `--platform bridge-4x`) to `release/4.x`; delete hand-authored `AG_VALUES` (durations must equal contract 200/320/450); generate `src/material/css/{ladders,floors,properties}.css`, scoped `src/styles/preview-v5.css` over the six 4.x primitives, `src/styles/v5.css`; one writer of `src/material/css/preview-v5.css`; D-28 navy fix via `tokens/legacy` with listed names/values; `src/material/compat/tokens.css` from the alias map; `src/material/__tests__/preview-v5.test.tsx`; frozen consumer fixture pixel-identical without the attribute.
- MAT-67 (PR #28's content): complete `fragments/codemods/mat.ts` on `next` (renames, props for motion/a11y removals, `cssVars` generated from the alias map: every `--glass-*` → `--ag-*` or `null`, resolving the 174 `uncovered`); it reaches `release/4.x` through the `next → release/4.x` codemods sync (REQ-FIN-13). `next` is the codemods source of truth: a direct `4x-mat/` edit of `fragments/codemods/mat.ts` is allowed by the 4x zone rule but would be overwritten by the next sync, so it is not used; `fragments/deprecations/mat.ts` (177 rows) reaches `next` through the `release/4.x → next` sync; MAT fixtures `{reduced-motion-initial,motion-imports,motion-props}` pass byte-equal and idempotent (REQ-FIN-09); ship 4.2.0 (material/motion/a11y rows active) and 4.3.0 (`--glass-*`, mode hooks, personas, theme rows active) per REQ-FIN-45.
Acceptance: AC-FIN-57 (`node scripts/tokens/build.mjs --platform bridge-4x && git diff --exit-code src/material src/styles/v5.css src/styles/preview-v5.css` clean on a 4x pipeline; `Object.keys(cssVars).length` = `--glass-*` count on both lines). Needs: agent, ci, owner (release).

**REQ-FIN-58 Motion.** Maps REQ-MAT-42, -43, -44, -45, -47, -48, -50, -51.
- MAT-42: transition lists in `src/motion/css/{motion,view-transition}.css` ⊆ `ANIMATABLE` (`transition-behavior` for display/overlay, or contract amendment); remove motion `@property` blocks; `ALLOWED_PROPS === ANIMATABLE`; L1. (The `material.css` clauses, `--_ag-hover` and the depth cross-fade scope, are REQ-FIN-02's.)
- MAT CSS layering: line 1 `LAYER_ORDER_STATEMENT` and one `@layer` block equal to the fragment row in every MAT-owned CSS file not in FIN-A (`src/motion/css/{motion,view-transition}.css`, `src/material/css/properties.css`), removing their REQ-FIN-14 baseline rows; `tests/motion/helpers/report.ts:38` reads `CI_COMMIT_SHA`, removing its REQ-FIN-21 baseline row.
- MAT-43: no-mount-motion spec fails on absent subjects; L9 run with `motion-report.json`. (The `::before`/`::after` binding and `transform-origin` are REQ-FIN-02's `material.css` clauses.)
- MAT-44: calm limits `animation: none` to infinite animations (or PRD amendment); settle spec green on 3 engines × 2 widths × 2 OS settings × 3 modes.
- MAT-45: `@ts-expect-error` for every banned motion key on provider/role/Surface/MotionProvider types; `motionPolicy` out of `createGlassTheme` (compat); pointer light off under forced colours.
- MAT-47: ref-counted observed elements in `ticker.ts`; resolved motion only from `data-ag-motion`/store (no `matchMedia` in `src/motion`); Jest in a lane.
- MAT-48: `view-transition-class: ag-morph` or `:active-view-transition-type(ag-morph)`; calm opacity-only 120 ms keyframes; FLIP calm cross-fade; micro duration read from CSS; the morph consumers call `startMorph` in their own files (SegmentedControl indicator: REQ-FIN-72 CMP-42; Tabs indicator and SourceTransition: REQ-FIN-82); remote VT spec.
- MAT-50: remove the `public.ts` seed; browser-safe peer guard (no `node:` imports); `'use client'` on public/adapter files; strengthened adapter tests (MotionConfig mode, 322.3/32.31, drag dismiss/detent, momentum, magnetic ≤8 px + cleanup, Shared `data-ag-animating`).
- MAT-51: guarded dirs extended to components/app-shell/data/ai/media/backdrops/date at error or ratchet; loop check; `scripts/mat/verify-preference-source.mjs` + test; fix or route the listed rAF/matchMedia violations.
Acceptance: AC-FIN-58. Needs: agent, ci.

**REQ-FIN-59 Preferences, store, announcer, prepaint, panel, contrast boundary, catalogue a11y suites.** Maps REQ-MAT-52, -53, -58, -59, -60, -64, -65.
- MAT-52: `resolveContrast` = max(app, user) with forced/OS floors; `spacious` density; contrast more ⇒ ≥ tinted; floors for glass-opacity/contrast; NaN guard; rebuild the prepaint body; 1,024-case loop over forced × contrastMore × reducedTransparency × capability × app × user × glassOpacity{0,0.69,0.7,1} asserting on `resolvePreferences`.
- MAT-53: identity and Profiler (≤1 commit) tests in `src/theme/__tests__/`. (Store reuse in `AuraGlassProvider.tsx` is REQ-FIN-04's; `store.set` validation is REQ-FIN-12's.)
- MAT-58: per-region queue with id replacement; `createStreamingAnnouncer.stop()` flushes the tail as a final write; tests (final token last, ≤11 writes).
- MAT-59: prepaint body ≤1,536 B minified with `LIMIT === 1536` (no self-approved ratchet); persisted/app `standard|enhanced` tier written; unknown engine capped at standard; shared engine detector; drift test; prepaint spec runs from the built package (never skips), 20 reloads × 3 engines, CLS 0; ≤1 ms perf spec.
- MAT-60: `Spacious`; `useId` radio names; per-option `aria-describedby`; contrast lock under forced/OS more; RTL visual case. (`GlassPreferencesPanel.css` is created and registered by REQ-FIN-05.)
- MAT-64: fix the L1 ESM loader (also REQ-FIN-05/07 lint gates); second agConfig block at error; resolve `src/media/sampling` with SURF (move under `src/backdrops/**` or name the exemption). (The move itself is REQ-FIN-86's, §6.1.)
- MAT stories: remove story-supplied optics, ink overrides and private vars from MAT's Floors, Presets and Rungs stories, deleting their rows from QUAL's story-contract baseline (REQ-FIN-106).
- MAT-65: `tests/visual/mat/a11y/pixel-contrast.spec.ts` (8×3×2×3×3×2 matrix), `tests/e2e/mat/coverage.spec.ts`; every MAT a11y spec iterates `listSubjects()` with owner attribution; artifact test fails when absent on release; `deviceScaleFactor` zoom; axe `colorContrast` over MAT subjects; fail-closed lane.
Acceptance: AC-FIN-59. Needs: agent, ci.

### 5.5 FIN-E — Core components leftovers (CMP)

**REQ-FIN-70 Foundation contract.** Maps REQ-CMP-01..08, -10, -13..18, -20..22, -24.
- CMP-01: pin test over every §4.5 Base UI subpath (~34); import confinement (`src/data/chip/Chip.tsx` composes CMP Toggle); `no-foundation-types` against the packed tarball in `cmp:build:dts`. (The `Chip.tsx` edit is REQ-FIN-83's, §6.1.)
- CMP-02: explicit map from every Base UI 1.8 reason into the 10-value `ChangeReason` enum (unknowns → `unknown`); table test.
- CMP-03: convert the 42 `forwardRef` calls (Menu ×15, ContextMenu ×9, Toast ×7, Popover ×7, Tooltip ×4, Menubar) to ref-as-prop; ref/parts contract tests iterate every `*.meta.ts` (≥74), not the hand-authored `contract-coverage.json` (delete it); observer-cleanup ref tests.
- CMP-04: `src/foundation/controllable.ts` `useControllableWarning` in ~20 roots; per-family controlled→uncontrolled single error; `tests/overlays/overlay-contract.test.tsx`.
- CMP-05: remove Card `material`; `lint/rules/cmp/prop-grammar.cjs` (error CMP, warn SURF) + self-test; type test over every exported props type; `Omit<…,'onChange'>` on 85 types; `tests/foundation/prop-grammar.test.tsx`; Button intent = full S-30 union.
- CMP-06: SegmentedControl.Indicator, Slider.Track/Range/Thumb, Menubar `{Root, Menu}`; internalise Portal/Positioner/Popup/Backdrop; CC-CMP-01 for Header/Body/Footer, Tooltip.Provider, Toast.Progress/History/HistoryItem, Combobox.Group/GroupLabel (OD-16); post-seed contract test.
- CMP-07: one normalised `data-state` on Switch, Checkbox, Radio, ToggleGroup, Button-toggle, SegmentedControl, Accordion, Select/Combobox trigger+popup, Combobox loading; interaction tests.
- CMP-08: no `backdrop-filter`, colour literals, `!important`, literal motion fallbacks or non-contract motion vars in CMP CSS; line 1 `LAYER_ORDER_STATEMENT` and one `@layer ag.components` block in every CMP CSS file (removes CMP's REQ-FIN-14 baseline rows); apply REQ-FIN-11's replacement table to every CMP `var(--ag-*)` and add one shared focus mixin in `src/components/control-shared/controls.css` (removes CMP's REQ-FIN-11 baseline rows); regenerate the literals baseline over every CMP file at 0; `tests/lint/cmp/cmp-lint.test.ts`; QUAL rules `no-transition-all`/`no-permanent-will-change` (REQ-FIN-104/105).
- CMP-10: `cmp:test:selectors` job with Storybook build; 0 unmatched selectors.
- CMP-13: disabled opacity off surface roots onto content parts via `--ag-state-disabled-alpha`; `focusableWhenDisabled` on Menu items, Select.Trigger, IconButton; remote spec.
- CMP-14: `tests/foundation/dom-contract.test.tsx` over every meta's stories (banned attrs, deterministic double render).
- CMP-15: hooks-order test over ≥60 components with console-error spy and describedby id stability; lint job run.
- CMP-16: `subscribeFrame` in SheetHandle; overlay MutationObserver only while open; `tests/foundation/side-effects.test.tsx`; `tests/perf/browser/cmp/idle.spec.ts`.
- CMP-17: ImageList server + masonry client island; `tests/ssr/cmp/ssr.test.tsx` over every meta incl. defaultOpen popups; `canaries/next16/app/cmp/server/page.tsx` in L11.
- CMP-18: no loops (or gated per REQ-FIN-12); ANIMATABLE-only transitions; `--ag-ease-spring` → contract eases and per-kind durations; calm/none rules; `tests/e2e/cmp/motion.spec.ts`.
- CMP-20: hit-area span in every interactive part listed; `tests/e2e/cmp/sizing.spec.ts` (coarse 44 px hit tests).
- CMP-21: container queries replace the 5 viewport media rules; `data-ag-size` on every sized component; `tests/visual/cmp/reflow.spec.ts` (390, 320 container, 200 %, text spacing).
- CMP-22: `budgetKb` on every meta equal to its size row (fix 13 mismatches, add 39); rows for Checkbox/CheckboxGroup/Field/Fieldset/T0/primitives/icon; material/apg/flagship/tier; migration `props` = codemod row, `selectors` filled; `tests/foundation/meta-complete.test.ts`.
- CMP-24: `tests/compiler/react-compiler.fixture.test.ts` (`panicThreshold: 'all_errors'`, 0 bail-outs); fix the vite-compiler canary imports and variant.
Acceptance: AC-FIN-70. Needs: agent, ci.

**REQ-FIN-71 Primitives, icons, forms.** Maps REQ-CMP-27, -28, -30, -31.
- CMP-27: stacked-escape APG spec (Dialog → Popover → Menu, Escape closes one layer per press) green on 3 engines; it runs against LayerStack's contract and is reported `pending` by the lane runner until the REQ-FIN-07 behaviour is on `next`.
- CMP-28: FocusScope in Sheet detents and Tour; GlassLabel → Label deprecation + compat (remove from RM-11 removals); `tests/primitives/primitives.test.tsx`.
- CMP-30: AI icons built on `createIcon` from `aura-glass/icons`, no `'use client'`; glyph budget ≤1,024 B gz in CI.
- CMP-31: `src/forms/{index,FormField,useFormField}.ts` (react-hook-form confined to `src/forms/**`); `tests/controls/forms.test.tsx` for 7 controls; Field.Error via `aria-describedby`, not a live region.
Acceptance: AC-FIN-71. Needs: agent, ci.

**REQ-FIN-72 Buttons, toolbars, toggles, segmented control.** Maps REQ-CMP-32, -33, -35..44.
- CMP-32: dev warning once when pressed props flip; remount test.
- CMP-33: icon `aria-hidden`; width-stable loading and static spinner under calm (Playwright).
- CMP-35: APG asserts activation counts and `aria-pressed`; MagneticButton applies `magnetic` from `aura-glass/motion` when present.
- CMP-36: IconButton 28/36/44 squares, 44 hit area, on-surface colour; L6 ≥3:1 in 8 scenes.
- CMP-37: Toolbar root **is** the SurfaceGroup (chrome regular, capsule when horizontal); computed-style spec.
- CMP-38: `loop` prop, item `focusableWhenDisabled`, `toggle-group.apg.spec.ts`.
- CMP-39: ButtonGroup flat (no SurfaceGroup); registered attributes only.
- CMP-40: concentric item radius; `priority='low'` overflow Menu by container query; exact-index APG specs; nesting radius ±0.5 px.
- CMP-41: `orientation`, required `name`, exported Indicator.
- CMP-42: indicator positioning via one ResizeObserver, `startMorph` or snappy transition, `data-ag-animating` lifecycle, transient thin concentric material, jump under calm.
- CMP-43: `SegmentedControl.keys.ts` pin; APG asserts selection, wrap, Home/End, no Space deselect.
- CMP-44: auto `title` from labels; nowrap guard; >5-items-at-390 px warning test.
Acceptance: AC-FIN-72. Needs: agent.

**REQ-FIN-73 Form controls.** Maps REQ-CMP-45..57, -59..77.
- CMP-45/46/47 Switch: 32×18/40×22/52×30 tracks via comp tokens, 2 px inset; thumb `translate` transition with snappy spring, content-sunken track, glass while dragging, calm/none off; APG via `SWITCH_KEYS` in CI.
- CMP-48..51 Slider: Track/Range/Thumb parts; `getAriaValueText` on thumbs; sizes 4/6/8 track, 16/20/24 thumb; specular via `--ag-specular` (fix the invalid box-shadow); DirectionProvider RTL; exact-value key tests incl. vertical; one `onValueChange` per frame via `subscribeFrame`, synchronous keys, flush before `onValueCommitted`; slider perf case.
- CMP-52..54 Checkbox: sm 14 px; pathLength stroke-dashoffset check animation ≤micro, instant under calm; exact mixed→true→false APG; `contrast-color()` in `@supports` with on-accent fallback; 0 backdrop-filter test.
- CMP-55/56 Radio: always-mounted ring; dot 6/8/10; `render={<Card/>}` choice-card story, single radio, no nested surface, first-enabled tab stop.
- CMP-57: SURF date fields wrap CMP Field (seam REQ-FIN-84).
- CMP-59 Fieldset: flat `Fieldset({legend})` per contract (alias `Fieldset.Root`); fix stories/compat/tests; DEP-C0028 on `release/4.x`.
- CMP-60..62 TextField: field-sizing fallback growth to `maxRows`; controlled counter; no `onChange` in props; focus ring on the control; per-size padding/type/height tokens; danger contrast evidence; IME composition suppression and composing-Enter guard; coarse 16 px font; real IME tests.
- CMP-63/64 SearchField: chrome thin capsule material, no blur inside SurfaceGroup, TextField single-line props; empty-Escape propagation, Enter submit, clear tab order tests.
- CMP-65..68 Select: `sideOffset`/`collisionPadding` 8; live `pointer: fine` alignment; Home/End/Space/Tab cases; calm-safe `scale`, `--ag-duration-small-exit`; `--anchor-width`, `calc(100vw - 16px)`, no viewport query; required Field.Error test.
- CMP-69..74 Combobox: chip remove names with item labels, localised Clear; strict keyboard tests (Alt+ArrowDown, chip focus/removal, Enter, Home/End); 500 ms announce throttle test, layered CSS, announced status; virtualisation per OD-15 (owned windowed list on `subscribeFrame` or allowlist amendment) over filtered items with `virtualized`/`index`, filtered `aria-setsize`, 10,000 items ≤60 nodes; Base UI Autocomplete for `mode='autocomplete'`, `loadError` key, debounce test; chip `content-raised` capsule material 24/28/32, create-item Enter paths.
- CMP-75..77 NumberField: controlled `value={null}`; sunken group; real locale parse/format tests (one parser); CSS selectors `group`/`input`; overridable stepper labels; `tabIndex=-1` steppers; exact-value APG per key incl. Home/End and hold-repeat.
Acceptance: AC-FIN-73. Needs: agent, ci, owner (OD-15).

**REQ-FIN-74 Overlays.** Maps REQ-CMP-79, -81..86, -88..110.
- Story ids: add `id: 'overlays-<name>'` to every overlay story meta (or make `gotoStory` resolve `parameters.ag.id`, REQ-FIN-08) so the APG/e2e/perf specs load; remove every conditional assertion (`if (await x.count())`, `after <= before`, `live <= max(1,n)`).
- CMP-79 scrim: `data-ag-layer='scrim'` on Dialog/AlertDialog/Sheet backdrops; CMP CSS keeps layout and opacity only; MAT rule uses `--ag-scrim-{clear,media}`, no `pointer-events: none`, depth via `data-ag-overlay-top`; `tests/overlays/scrim.test.tsx`.
- CMP-81: exact blurred-surface counts per kind (popover/tooltip/menu 1, +1 per submenu ≤3, modal 2, toast stack 1); fixed regex and ids; nested field `content-sunken`.
- CMP-82: idle test spies `setInterval`, wraps in provider, adds Select/Combobox, one timeout per toast, no PENDING test; infinite-animation spec.
- CMP-83: clear `data-ag-animating` when no transition runs; hook on every backdrop; `tests/e2e/cmp/motion.spec.ts`; `data-instant` test.
- CMP-84: `[data-ag-contrast='more']` popup border; forced-colours focus `Highlight`; 0 backdrop filters under forced colours.
- CMP-85: Select/Combobox use `defaultPositionerProps`; `max-block-size: var(--available-height)`, `transform-origin`; geometry assertions; 390 px spec for 5 kinds.
- CMP-86: `size` = sm|md|lg plus `appearance` default|wide|fullscreen; xl/full to compat; decide `modal='trap-focus'` (OD-16).
- CMP-88: single focus/scroll-lock manager (Base UI or LayerStack, recorded); APG with ±0 px clientWidth, initial/final focus, non-modal.
- CMP-89: named 640 px container query (the current `@media (max-inline-size)` is invalid); ConcentricFrame; nested dim in MAT CSS; L7 at 390.
- CMP-90: CPU 4× throttle; click→first paint ≤100 ms; long-task windows A/B; real ids; CommandPalette row reports `pending`, not skip.
- CMP-91: `intent` on `AlertDialog.Action`; container stacking; outside-press/Escape APG.
- CMP-92: non-modal tab-out test; decide `left|right`.
- CMP-93: Sheet.Action = Base.Close rendering Button; documented part or removed.
- CMP-94: `subscribeFrame`; motion `dragDetents`; translate-based detents (no `block-size` transition); `1` = full; detents only for bottom; real Profiler commit counter.
- CMP-95: handle is a plain button "Resize sheet"; announcement by detent value; `data-ag-appearance='full-height'` and MAT floor row (CC-CMP-03).
- CMP-96: container query; side-only handle hiding; left/start sizes; two-profile perf.
- CMP-97..98 Popover: root `MaterialBearingProps` + `openOnHover/delay/closeDelay/modal`; real `Content` = Portal>Positioner>Popup; focus-open in hover mode; `aria-describedby` for non-interactive hover content; `aria-controls`; focus returns to trigger.
- CMP-99..101 Tooltip: `delay`/`closeDelay` on root; 280 px / `100vw-16px`; Escape keeps focus; long-press touch spec with no conditionals; calm rule.
- CMP-102..105 Menu: `kbd aria-hidden`; real `Content`; link items; checkbox items stay open; closed-by-default story and full APG (Tab closes all, ArrowUp last, single `tabindex=0`, 100 ms submenu); 32/44 px items, no disabled opacity, fill-step highlight, `--anchor-width`; ContextMenu long-press tests; `Menubar = {Root, Menu}`.
- CMP-106..110 Toast: manager per Provider; `position` (logical) and `history` on Provider; nested-provider and no-provider dev errors with a no-op API; `useToast` satisfies contract `UseToast` (toast/update/dismiss/promise/toasts/history) and migrate every consumer (registry overlay-flows, compat, stories, subjects, DEP-C0115/C0130 messages); `role='alert'` only for high-priority danger; labelled viewport; action toasts never expire; `--ag-toast-timeout` set; viewport/hidden pause; `tests/overlays/toast-timers.test.tsx`; stacking via `--toast-index`, expand on hover/focus, swipe, `--ag-radius-lg`, 3 px intent border, narrow width, SurfaceGroup host; provider-scoped history with unread/markRead/markAllRead/clear and `Toast.History`; no module-scope manager.
Acceptance: AC-FIN-74 (`tests/types/cmp-contract.test-d.ts` asserts every `COMPOUND_PARTS` key and `useToast satisfies UseToast`). Needs: agent, ci, owner (OD-16).

**REQ-FIN-75 Content and core components.** Maps REQ-CMP-111..130.
- CMP-111 Text/Heading: optional `size`, full role vars (size/leading/weight/tracking), Heading sizes display|title-1..3; Typography/DisplayText compat.
- CMP-112 Grid/Stack: set `--ag-grid-cols-*` from `columns`, own container, `masonry` boolean with `@supports (grid-template-rows: masonry)`, `SpaceToken` gaps, GlassFlex/Box/HStack/VStack/GlassMasonry compat, focusable masonry story.
- CMP-113 Card: `MaterialBearingProps`, `interactive` + `render`; RegularOverMedia story; Default over media = none.
- CMP-114 Badge: real intent tokens and `contrast-color()`; default `max=99`; three absorbed compat names.
- CMP-115 Avatar: initials get `role='img'`.
- CMP-116 Alert: `description`, `appearance: inline|banner`, content-raised, intent rim, href actions, ReactNode actions; banner-roles test.
- CMP-117 Progress `appearance='ring'`, `ProgressRing` removed (compat alias); sunken tracks.
- CMP-118 Skeleton gated shimmer (REQ-FIN-12), content-sunken; LoadingState skeleton/progress variants.
- CMP-119 Kbd sunken; DescriptionList flat `items` + `orientation`, standalone container.
- CMP-120 Collapsible height transition + calm; fix APG part and default-open story; delete duplicate spec.
- CMP-121 Accordion `aria-controls`, Arrow/Home/End APG, typed details.
- CMP-122 ScrollArea unlabeled-overflow dev warning; non-conditional APG.
- CMP-123 Rating on Base UI Radio with roving focus, `"3.5 of 5"`, Home = 0, hit area.
- CMP-124 InlineEdit focus return after commit/cancel; sunken editing material.
- CMP-125 ColorPicker `{space, value}`, Channel/Alpha on CMP Slider, hex/oklch Input, Popover regular.
- CMP-126 FileUpload `onValueChange(files, details)`, `maxFiles`, `selected` status, progress via `onProgress`, Field.Error + announcer, sunken dropzone.
- CMP-127 ImageList flat `items` server path, masonry island, chrome-thin bar, compat adapters.
- CMP-128 Tour uncontrolled Escape, Skip, Buttons, `aria-labelledby`, FocusScope, 8 px collision, focus restore, Start story.
- CMP-129 EmptyState/ErrorState ReactNode actions (RSC-safe), RSC canary.
- CMP-130 `canaries/next16/app/cmp/server/page.tsx` + hydration spec; T2 page ≤1 blurred surface.
Acceptance: AC-FIN-75. Needs: agent, ci.

**REQ-FIN-76 Compat, fragments, registry, changesets, CMP CI fragment.** Maps REQ-CMP-131..142.
- CMP-141 (`ci/cmp.gitlab-ci.yml`, CMP-owned fragment): add `cmp:test:selectors` (with Storybook build), write artifacts under `.artifacts/cmp/<slug>/`, remove the duplicate `npm ci`, reword line 2 to "no cloud credentials" (removes the REQ-FIN-21 baseline row); every job passes `verify-ci-fragments`.
- CMP-131: `src/compat/cmp/core/**` for every §7 core/primitive name (GlassStepper renders `<ol aria-current="step">`, never NumberField); `scripts/cmp/gen-fragments.mjs --report`; `tests/overlays/compat-overlays.test.tsx`, `tests/foundation/compat-core.test.tsx`.
- CMP-132: author `fragments/deprecations/cmp.ts` on `release/4.x` through a `4x-cmp/*` PR containing every one of the 87 DEP-C ids now only on `next` plus the ~60 missing core names (since 4.2.x/4.3.x, compat rows `removeIn: '6.0.0'`); the `release/4.x → next` sync then carries them back with no deletions (REQ-FIN-13 refusal check passes); replace the PENDING test.
- CMP-133: generate codemod props from metas; fix GlassButton (`secondary→regular`, `ghost→identity`) and GlassDrawer side maps; core/primitive rows; path-scoped `fromEntry` rows; meta-vs-fragment test.
- CMP-134: root-button-alias and core fixtures; runner includes `cmp` (REQ-FIN-09).
- CMP-135: consumer-4x harness compiles `cases/cmp` on 4.x and runs `migrate 4to5` + `tsc` on next with 0 TODOs on mappable props.
- CMP-136/137: missing size rows (Checkbox, CheckboxGroup, glyph, primitives ≤4 KB, forms ≤4 KB, 13-family ≤60 KB, styles share ≤19 KB) and perf rows for every §16 subject × 2 profiles × 4 metrics; graded in CI.
- CMP-138: populate `fragments/lanes/cmp.ts` (L1, L5, L6–L8, L9, L10, L11, L12, L13, failClosed, remote for browser); `cmp:`-prefixed Playwright projects incl. `cmp:cert-touch` (`hasTouch`); `tests/visual/cmp` specs.
- CMP-139: L14 review items per family; literals baseline over every CMP file at 0.
- CMP-140: fixtures.ts for confirm-dialog/account-menu, stories for all three, `intent` on Action, public `aura-glass` imports.
- CMP-142: fix `@auraone/auraglass` in `.changeset/cmp-t-core.md`; regenerate `etc/api/{primitives,icons,forms,root.cmp,compat.cmp}.*`.
Acceptance: AC-FIN-76. Needs: agent, ci.

### 5.6 FIN-F — Product surfaces leftovers (SURF)

**REQ-FIN-80 Entries, purity, SSR, grammar, deprecations, compat, codemods.** Maps REQ-SURF-01..15.
- SURF-01: `./app-shell` exactly 7 values (statics instead of extra exports); no `formatTimestamp` at root; packed-tarball entry test over 6 SURF subpaths + root; regenerate `etc/api`.
- SURF-02: `AppShell.parseCookie`, `Pagination.getRange`, `Command.score`, `SourceTransition.start`; 11-static test on packed exports.
- SURF-03 (removes SURF's REQ-FIN-14 baseline rows): layer statement + single `ag.components` block in every SURF CSS (ai, media, backdrops + presets, 6 W1 files); delete the `!important` visually-hidden rule; token literals; test across all SURF CSS (registering `presets/media.css` in `fragments/css/surf.ts` is REQ-FIN-14's).
- SURF-04: compat date adapters lazy or on their own compat subpath (OD-17); esbuild-metafile peer-isolation test.
- SURF-05 (also the REQ-FIN-07 transfer for `AppShell.SidebarToggle.tsx`): fix the double-`ROOT` join (gate currently scans 0 files); AST gate over all SURF roots + labs; keydown, `getComputedStyle`, exact timer allowlist; fix the 7 findings (SidebarToggle Mod+B listener, appShellStore timer, CarouselRail, mediaStore, toneCache, useMediaElement comment); L2 `dist/ai` check.
- SURF-06: 6-entry side-effect test with no keydown exemption; PLAT gate in a pipeline.
- SURF-07: `breadcrumbs-server` canary page; client-manifest assertion; dev error for function children on server ChartFrame.
- SURF-08: cross-TZ (Kiritimati → Pago_Pago) hydration with 0 warnings; rail-cookie fixture; full media snapshot; `no-restricted-properties` for `toLocale*`; `tests/ssr/surf/hydration.spec.ts`.
- SURF-09: every meta has the real subpath, `budgetKb` = size row, `material.layer`, APG URL, rendered parts; `MediaScrubber`/`RangeCalendar` metas; `meta-coverage.test.ts`.
- SURF-10: convert 21 `forwardRef` modules; escalate `no-forward-ref`; pseudo-locale test; RTL safe-area fix; RTL x-order/arrow spec.
- SURF-11: real prop-grammar type test; Sparkline/ProviderErrorState `appearance`; Backdrop `tone` vs `BANNED_PROPS` (OD-17); drop `density`/`backdrop` from AppShell.Root; declared attributes only.
- SURF-12: 4x rows: renamed/consolidated `since: '4.3.0'`, `removeIn: '5.0.0'`, `app-shell-slots` codemod, deduped symbols, Waveform wording; sync to next (all 145 DEP-S ids).
- SURF-13: DEP-S ids in every `warnDeprecated`; 7 missing adapters (GlassSplitPane, GlassSidebarRail, GlassSidebarPanel, LiquidGlassInsetSidebar, GlassNavigationMenu, app-shell GlassBreadcrumbs, LiquidGlassInspectorPanel); drop GlassGallery adapter; 4.x TreeView name; GlassAppShell prop mapping; 4.x story-prop tests.
- SURF-14: `app-shell-slots` emits `render={<button type="button" onClick={h}/>}`; implement or fold `data-grid-columns`; normalised fixture layout; ≥1 fixture per absorbed name (~80).
- SURF-15: L11 migrate-4to5 canary on the 21 consumer cases; split `Stats.page.tsx`.
Acceptance: AC-FIN-80. Needs: agent, ci, owner (OD-17).

**REQ-FIN-81 App shell.** Maps REQ-SURF-17..21, -23..46.
- Layout (17–21, 23–25): Root is the container and an inner frame holds the grid; contract `data-ag-layout` auto|desktop|mobile; delete the ResizeObserver mode logic; compact hides sidebar/inspector (`display: none`); useId main id shared with SkipLink, `:focus-visible` reveal, first-focusable warning; Main `overscroll-behavior: contain` and two-edge scroll padding; scrollable Sidebar/Inspector content; four safe-area edges; Root props = 5 contract props; react-server SSR test; `AppShell.parseCookie`, both cookie keys always written, no render-phase cookie read; page-header wrap <600 px; no animating timer; chrome CSS from public vars only with a real brand theme spec.
- Landmarks and sidebar (26–33): Sidebar.Root not a landmark, duplicate-name dev registry, complementary = 1; sidebar CSS (content scroll, appearances, items); `render` handler composition (the app-shell part calls both the user's and its own `onClick`/`onKeyDown`, user first, via Base UI `mergeProps` inside `src/app-shell/**`; no change to `src/foundation/**`); rail labels visually hidden + CMP Tooltip + 40/44 hit areas; collapsed inert + `display: none` server-side; separate non-persisted `drawer` state, auto-mounted drawer (Base UI Dialog, `useLayer` drawer, `min(85%,20rem)`), focus return, expanded state preserved; drawer `aria-controls` and mode-aware Mod+B; Base UI-driven Collapsible (no static `aria-expanded`/`hidden`), `<li>` root, current-child default open.
- TopBar, inspector, status, mobile, registry (34–41): GlassNavigation/GlassTopBar/GlassHeader deprecations; per-shell ScrollEdge registration (MAT `scrollContainer` API, seam); title/center truncation, keepCenter, solid/forced-colours rules, 320 px no overflow, focus-not-obscured over all focusables; Inspector Section on Base UI, Header `render`, inspector CSS + `@container ag-inspector`, LiquidGlassInspectorPanel adapter; inspector modes by container (docked sunken / floating chrome / compact CMP Sheet `[0.5, 1]`); StatusBar.Live without `aria-live`, debounced announcer; MobileShell `layout='mobile'`, overlaying TabBar with `--ag-scroll-padding-bottom`; `app-shell-workspace` composition (tabs slot, Panels, Timeline, Card, open inspector) and `repeat(auto-fit, minmax(min(100%, 28rem), 1fr))`.
- ResizablePanels (42–46): `onCollapse`/`onExpand`, px sizes, Handle `disabled`/`withGrip`, nested scoping; `touch-action: none` on handle, pointercancel; APG `aria-orientation` (vertical between side-by-side panels), resolvable `aria-controls`, `Resize <label>`, RTL keys; snap-to-collapsed below min/2, restore prior size, 1 px line with 24/44 hit area and focus ring; SSR `defaultLayout`, hydration-safe restore, `stackBelow` stacking.
Acceptance: AC-FIN-81. Needs: agent, ci.

**REQ-FIN-82 Navigation.** Maps REQ-SURF-47..59, -61..65.
- Tabs (47–50): default `appearance='pill'`; `(value, details)`; pill/underline/size CSS; EnhancedGlassTabs/GlassTabItem/TabItem deprecations; resolvable tab/panel ids across instances; jest keyboard and axe; `startMorph` indicator with translate/scale fallback from Base UI `--active-tab-*` vars, calm/none; mask-image edge fade, `scrollIntoView` nearest, `data-state` on every part.
- TabBar (51–54): Tabs.Panel registers via `useTabBarPanel`; Base UI Tabs for `semantics='tabs'`; `appearance` bar|floating + `placement` inline|overlay; 44 px coarse targets; one SurfaceGroup backdrop with refraction forwarded; scroll-timeline minimise, Accessory placement, AppShell hides only the `bar` appearance ≥600.
- Breadcrumbs (55–57): no separator after current, CMP icon separator with RTL flip, static Ellipsis vs Overflow island; IconButton trigger + link menu items + APG; 16ch truncation with full accessible name; RSC canary with 0 breadcrumbs client modules.
- Pagination (58–59): uncontrolled button mode; `labels.page` in button mode; `getRange` static; compact <400 px "Page N of M"; content material; range-cap loop.
- Command (61–63) and the REQ-FIN-07 transfer: `CommandPalette` registers with `useLayer` and `usePortalContainer` (no own portal, no document listeners; removes its REQ-FIN-07 baseline row); `Command.score` with camelCase boundaries on raw value; hotkey/IME/focus-restore tests and real APG; VirtualList >100 items with 5,000-item ≤30 nodes and p95 ≤50 ms; announced count. (SURF-60 is REQ-FIN-07.)
- SourceTransition (64–65): `start(id, update)` allocating names source→destination with flushSync, duplicate-id dev error, composed onClick; `surfaces` passed to `startMorph`, focus moved only if the source had focus, three-engine-path spec.
Acceptance: AC-FIN-82. Needs: agent, ci.

**REQ-FIN-83 Data.** Maps REQ-SURF-66..97.
- Table (66–79): pagination row model only when pagination props are given (today every table silently shows 50 rows); `useAnnouncer`; handle resolves on the full row model; CMP Checkbox selection with Shift+Space range and ≤3 commits; virtualise the full row model (≤31 rows, `aria-rowindex` incl. header, 400,000 px); resize min/max without hard clamps and closest-`[dir]` RTL; right pins use `getAfter('right')`, `data-ag-pinned-edge`, shadow var, auto-pin <480 px; grid-mode roving cell, Enter/Space/PageUp/PageDown, focus re-resolve, ≤2.5 KB budget; loading keeps rows + 8 Skeleton rows, empty `td[colspan]`; 13-part DOM snapshot incl. column menu; per-size padding/height × density, numeric tabular-nums, coarse 44 px; hook-toggle test for all 8 booleans; column menu (CMP Menu) with pinning boundaries; `onCellEditCommit` editing (5.1 C-E scope, `Table.edit.test.tsx`).
- VirtualList/TreeView (80–83): `onEndReached` once per crossing, idle rAF spy over 500 ms; TreeView `loadChildren` on expand with `aria-busy`, CMP icons, CSS indent 20/12 px, required label type; treegrid vs tree roles (OD-20) and real APG; `virtualize` via RAC Virtualizer, 5,000 nodes ≤40 items, expand-all ≤150 ms.
- FilterBar (84–87): literal-narrowed field types and type tests; structural sharing in every op (untouched siblings `===`); `addGroup()` default; stable `useModel` consumed by FilterBar; lossless typed serialisation (40 cases incl. `between`, booleans, separators); CMP SearchField/ToggleGroup/IconButton/Popover/Sheet, valid default operators, focus return to chip, responsive "Filters (n)" Sheet and "+n more".
- Chip, KeyValueEditor, StatCard, Sparkline (88–91): content material, `label` prop, GlassMetricChip compat; Base UI Field + CMP TextField rows with stable ids and focus to the new key; unique labelledby, container-type, locale and trend matrices; forced-colours CSS and spec, required label union, contrast check.
- ChartFrame, Timeline, ActivityFeed (92–97): RSC-safe adapter pattern (no function props across the boundary), three islands, narrow-container legend, toggle label; `dir` from DOM, width-undefined placeholder, three typed docs adapters; CMP Tooltip for last-series, ariaSnapshot SR spec; palette from distinct colour vars per scheme meeting 3:1, chroma, ΔE2000 under CVD, computed from built CSS; Timeline hidden intent text, `timeZone`, container; ActivityFeed CMP Avatar/Button, prepend-only 2 s batched announcements, `GlassInfiniteScroll` mapping.
Acceptance: AC-FIN-83. Needs: agent, ci, owner (OD-20).

**REQ-FIN-84 Date.** Maps REQ-SURF-98..105.
- SURF-98: DateProvider from closest `[lang]`/`[dir]` without SSR mismatch; CMP Popover ≥640 / Sheet below; PLAT doctor peer check; `src/date/DatePicker.test.tsx`; 3-locale spec.
- SURF-99: no duplicated value chain into the inner Calendar (single `onValueChange`); ≥12 prop-forwarding tests incl. ISO form submit.
- SURF-100: one rowheader per week; `Calendar.stories.tsx`; full APG grid spec incl. coarse 44 px.
- SURF-101: CMP Button trigger with value description, contextual Calendar (uncontrolled select updates and closes), LayerStack Escape, bottom sheet <640, initial focus, `DatePicker.test.tsx`, `date-picker-responsive.spec.ts`.
- SURF-102: one grid per visible month, container-driven `visibleMonths`, draft-commit with Apply, presets through the draft, `DateRangePicker.test.tsx`.
- SURF-103: ISO week numbers from `CalendarDate` via `Date.UTC`; 20 cases under two TZs.
- SURF-104: shared controllable value, `selectedKeys`, AM/PM column for `hourCycle 12`, CMP Popover, `TimePicker.test.tsx`.
- SURF-105: DateTimePicker (5.1, additive contract PR) per OD-20.
Acceptance: AC-FIN-84. Needs: agent, owner (OD-20).

**REQ-FIN-85 AI.** Maps REQ-SURF-106..128 (SURF-129 is REQ-FIN-110).
- SDK (106): move the compat type test to `tests/types/surf/ai-sdk-compat.test-d.ts` without `tsd`; delete `ci/surf/ai-sdk/**` duplicates; fixtures typechecked against pinned `ai` types; decide SDK major for approval states (OD-16 contract PR if v6).
- Thread (107–110): `Thread.Viewport` is the `role=log` scroller; virtualised path keeps renderers; one scroll container (VirtualList `getScrollElement`); pinned follow on content growth once per frame; smooth jump at motion full; pill name = visible text; prepend offset preservation; `onReachTop` once per entry; fixture script path; message `id` on `<article>` and working `scrollToMessage`.
- Message (111–115): `Message.Root`; citation `[n]` by number and `[^id]` by source index; `pre-wrap`; `renderText(text,{streaming,messageId})`; dynamic-tool prefix; SourceList when no text part; fixture snapshot; StreamingText external store (1 commit per frame), 600-char complete announcement, sentence batching ≥1,000 ms via rAF timestamps, `aria-busy`, Sending/error announcements; action visibility CSS + container; file links (download only for blob/data, reject `javascript:`).
- Composer (116–119): Base UI Field with real label; part name `textarea` (CSS currently dead); clear uncontrolled draft and keep focus; StrictMode-safe attachment callbacks keyed by id; ComposerMenu so Submit/Stop stay visible <480 px; counter announces only at 90 %/100 % (no `aria-live`); visualViewport fallback; composer block var.
- Tools, reasoning, agents, sources (120–125): ToolCall opens on transition to needs-approval/failed, Base UI Collapsible, per-state icons, no `role=alert`; Approval resets on new approval id, CMP TextField; Reasoning toggle test fixed, panel kept mounted, perf-mock duration; AgentSteps per-state icons and CSS-only running atom; SourceList title fallback and context-scoped registry; Citation on Base UI PreviewCard with `useLayer`, no `role=dialog`, snippet, touch behaviour.
- Meter, errors, layout (126–128): CMP Meter in UsageMeter with `full` vs `compact`; CMP Button retry, interval cleared at 0; Thread container-type, composer ResizeObserver vars, five visual cases with no early returns.
Acceptance: AC-FIN-85. Needs: agent, ci, owner (OD-16 for SDK v6).

**REQ-FIN-86 Media and backdrops.** Maps REQ-SURF-130, -131, -133..160.
- useMediaElement (130–133): PiP/textTracks/playing/loadeddata listeners on the AbortSignal; non-media ref type error; frame loop unsubscribed offscreen/hidden; every listener signalled.
- Controls (134–138): captions toggle via TextTrack; CMP Toolbar.Button roving; real container for responsive layout (Mute, More menu, 320 px minimum); scrubber rAF-coalesced seeks, paused frame-step, drag thumb glass, coarse tooltip, percentage Volume on CMP Slider; shortcuts bound on `shortcutTarget` only incl. F/C/</>; constant Play label + `aria-pressed`, CMP Icon glyphs, Time `aria-hidden` from context, captions Menu, `tests/e2e/surf/media/target-size.spec.ts`.
- NowPlaying, Waveform (139–140): no crash without `expandedId`; controlled progress var; artwork tone sampling; `fixed` prop; server Waveform + client WaveformLevel, forced colours, snapshot (5.1 entry via contract PR).
- ImageViewer (141–145): controlled/defaultOpen/loop tests and required `alt`; single portal, focus to Close only on open, focus return, `aria-labelledby`, one Escape owner; missing id opens nothing; pinch zoom, wheel rules; Stage `data-ag-backdrop='media'` + container + tone, chrome material, Inspector layout, reduced motion, chrome spec.
- CarouselRail (146–150): composable parts, `Indicators as`, container; Indicator focus moves with arrows, Home/End, L5 registration, axe both variants; indicator clicks scroll, smooth unless reduced, fresh index ref, swipe spec; autoplay gate from `[data-ag-continuous=on]` + visibility, correct toggle label, L9 spec; content-raised slides, chrome thin nav, `data-ag-backdrop=media` when over media, media blur-budget spec.
- Sampling (151–154): L8 sampling spec over QUAL scenes in 3 engines without pending; real calibration script and regenerated `scene-stats.json`; sampling wired into Backdrop photo/video, NowPlayingBar, ImageViewer, poster-first video, `performance.measure('ag:sample')` ≤4 ms, 1 `getImageData` per 110 events; glyph-polarity CSS and L6 on/off contrast spec.
- Backdrops (155–160): media props not leaked onto the root div; palette CSS for 5 palettes; filter ban test; pause button only while playing; L9 backdrop specs; `light-dark()` for `auto`; drift offscreen/hidden pause and browser animation counts; `preset='grain'` renders grain, reduced-transparency rule, modes spec, import boundary, tarball asset resolution.
Acceptance: AC-FIN-86. Needs: agent, ci.

**REQ-FIN-87 Charts, three, labs.** Maps REQ-SURF-161..169.
- 161–164: thread `yDomain`; monotone curves via d3-shape (or exact Fritsch–Carlson); pointer crosshair island; d3 imports confined to `src/charts/**`; doctor hint; resolvable `aria-labelledby`; 150 ms debounced announcement; real keyboard spec; `./charts` absent on 5.0.x (REQ-FIN-06); `@tier preview` JSDoc; X-28 delivery guarded by L2 artifact.
- 165: drop three/@react-three peers at 5.0 (contract PR); entries test for `./three` = 0 exports.
- 166–169: labs build + pack test; D-23 name record; admission rule (d) catches module-scope variable side effects and executes the entry; release lane blocking; perf admission spec with the six REQ budgets on L10; WebXR/AR/360 rejection; promotion with `--manifest` in the lane and stale-promotion rule.
Acceptance: AC-FIN-87. Needs: agent, ci.

**REQ-FIN-88 Registry blocks and items.** Maps REQ-SURF-170..178.
- 170: lint scans every source file in each item dir (cross-item relative imports, colour/blur/`!important` literals, complete `files[]` and `registryDependencies` mapped to real registry ids, Loading story for async); verbatim shadcn v4 schema; fix every `registry-item.json`; `fixtures.ts` for media-*/ai-* items.
- 171: media-viewer adds NowPlayingBar + CarouselRail; support-inbox uses Thread, applies the FilterBar model, appends replies; mobile-settings opens GlassPreferencesPanel in a CMP Sheet; PENDING guards deleted; `ga-blocks.test.tsx`; QUAL showcases import fixtures.
- 172: route at `registry/blocks/ai-workspace/app/api/chat/route.ts` with `convertToModelMessages`, streamed 32 KB body cap, token bucket (20, 20/min), 429 `retryAfterMs`, untrusted `x-forwarded-for` handling, README; support-engineering fixture with an approval-gated tool call; live wiring through `useAuraChat` and a replay transport; route test with mocked fetch. LLM traffic defaults to Kiro Prism (`PRISM_*` env), per policy §4.
- 173: `useAuraChat` returns `threadProps`, `messageProps`, `toolCallProps`, `composerProps` with regenerate/approval/files; no cast; ArtifactPanel `renderCode` slot (no dynamic import); streaming-markdown emphasis closing; capability union; mock-transport test.
- 174: tree-select on CMP Select; faceted-search filters results; dependencies; behaviour tests.
- 175: media-gallery on CMP Grid; transcript accepts TextTrack, required `end`, guarded auto-scroll; jsdom seek tests.
- 176–178: PresenceStack and CommentThread to spec (list semantics, colour from chart vars, container clamp, IME guard, resolve); commerce/pricing blocks on CMP NumberField/Sheet/Form/SegmentedControl with JPY/de-DE tests and layout CSS; registry-only check over an extracted tarball; audit-log Sheet filters and server paging; permissions-matrix row headers.
Acceptance: AC-FIN-88. Needs: agent.

**REQ-FIN-89 Capability ledger.** Maps REQ-SURF-179, -181..185, -187.
- 179: all 20 archived fields on all 71 rows, schema `required` updated, verbatim diff against archived EXP §4.4.
- 181: delivery check resolves value export/static, `data-ag-part`, story id, registry item; L2 lane with `--manifest`; flip shipped rows to `delivered`, others `deferred` with a 5.1 slot.
- 182: roadmap text in the report; `--out` for release notes; PLAT reads it (seam REQ-FIN-34); strict artifact-URL match.
- 183: before/after export snapshots derived automatically; evidence written; temp-repo test.
- 184: `--budget` against enumerated packed exports (root ≤160, total ≤250, diff 0); `--ga` slot rule.
- 185: four missing alias names; `no-rejected.test.ts` over stories and manifest.
- 187: roadmap filters, Rejected tab, story ids per part/prop row, story-id check.
Acceptance: AC-FIN-89. Needs: agent, ci.

**REQ-FIN-90 Cross-cutting SURF a11y and perf; SURF CI fragment.** Maps REQ-SURF-188..195.
- 195 (`ci/surf.gitlab-ci.yml`, `ci/surf/**`, SURF-owned): point the AI-SDK job at the final `tests/types/surf/**` files (REQ-FIN-85, SURF-106) and delete `ci/surf/ai-sdk/**`; tee ledger output to `.artifacts/surf/ledger/`; correct the SDK-version comment; every job passes `verify-ci-fragments`.
- 188: `parameters.ag` on the 15 registry stories; `tests/e2e/surf/clear-over-media/*.spec.ts` (`tests/a11y/**` is MAT's, contract D06; re-point the L6 row in `fragments/lanes/surf.ts` and `testDir` in `fragments/playwright/surf.json`); L6 0 SURF failures across the full matrix.
- 189: forced-colours and contrast-more CSS across app-shell, data, media, ai and nav; non-colour current-item cue; rewritten specs with pixel-diff >0.5 %.
- 190: idle spec over every SURF subject × full/calm/none: 0 running animations and 0 rAF 1 s after load.
- 191: blur budgets at exact numbers (≤3 fine / ≤2 coarse, depth 1, chrome ≤32 px, scrims ≤12 px, StatusBar none) via `perf.blurredSurfaces`; media and registry block budgets; lane registration.
- 192: hit areas in every SURF interactive part (with REQ-FIN-05 hit-area fix); coarse `elementFromPoint` spec; registration.
- 193: real Tab-key focus spec (ring tokens, not obscured, overlay focus restore); replace `outline: none` in date/charts; sticky-chrome scroll padding.
- 194: Playwright fragment without duplicate project names and with real testDirs; L14 review items for the six product blocks; baselines match real scans.
Acceptance: AC-FIN-90. Needs: agent, ci.

### 5.7 FIN-G — Quality, certification and showcase (QUAL, all 73 REQs)

QUAL did not land. Each REQ below is implemented from its original PRD-5 text; the bullets record verified state and the extra constraints found by this audit.

**REQ-FIN-100 G1 Contract helpers and conformance.** Maps REQ-QUAL-01, -02, -03, -70 (REQ-QUAL-69 is REQ-FIN-08).
- 01: `packages/qa` (private `@auraglass/qa`) + `jest.qual.config.js` (root Jest ignores `packages/`); `resolveSubject`; `scripts/storybook/write-cert-manifest.mjs` wired into the Storybook build; index/manifest mismatch fails.
- 02: `buildInventory.ts` from ENTRIES with `unclassified-export`; no count literals (`470|498|356`).
- 03: dHash + pixelmatch duplicate detector with 90 % rule.
- 70: the 6 missing contract tests (attributes incl. story-only attrs absent from dist, css-vars, layers, meta, entries, doubles), owner-naming messages, `__selftest__` mutation test; `contract:conformance` green.
Acceptance: AC-FIN-100. Needs: agent.

**REQ-FIN-101 G2 Runner, CI lanes L1–L12, sharding, determinism, remote-only.** Maps REQ-QUAL-05, -06, -27..30, -33, -64..68.
- 05: `certification/run.mjs` + `lanes.config.ts` (built-ins + `loadFragments('lanes')`), lane manifests with every listed key, pre-existing attribution; 12 explicit `qual:certify:lN` jobs (L1–L4/L12 on `.ag-node`).
- 06: fail-closed modes; sentinel set; no `allow_failure` on `qual:certify:release`; `fail-closed.test.ts`, `ci-fragment.test.ts`.
- 27–30: L1 gates registered (lint, showcase stylelint, lint-tests, css/dist perf, story-glass, evidence guard, zero-`!important`); L2–L4 from the packed tarball (`AURAGLASS_TARBALL` or pack fallback), never path-filtered L4; L11 canaries cross-engine from the tarball incl. consumer-4x and `migrate 4to5`; L12 coverage floors with `certification/ratchets.json`.
- 33: `--line 4x` for published and head tarballs in nightly (needs REQ-FIN-20).
- 64–68: the seven QUAL-only jobs; shard planner (`parallel ≤200`); quarantine (≤7 days) and nightly L7 ×2 agreement ≥99.9 %; remote guard (exit 2), offline bundle, preflight CA check (OD-5); exemptions validator.
Acceptance: AC-FIN-101. Needs: agent, ci.

**REQ-FIN-102 G3 Scenes and pixel gates.** Maps REQ-QUAL-04, -07, -08, -12..18.
- 07: 8 licensed scene assets ≥2880×1800, ≤6 MB total, manifest with sha256/licence/dims/luminance/backdrop (only an 800×500 `photo.jpg` and `{}` exist today); band tests; excluded from the tarball.
- 08: `certification/scenes/Scenes.stories.tsx` (8 ids, 12 surface cells + 6 flagship roots).
- 04, 12: live-subject capture from this pipeline's Storybook built against the tarball; matrix axes/prune/shard with exact §4.3 counts; `certification/lanes/environment-visual.spec.ts`; cert config `testDir: certification/lanes` + 3 engines, fragment loader validating shape (CMP/SURF projects currently dropped).
- 13–18: tesseract-5 OCR contrast with text-hidden twin; glass-over-nothing; pixel gates with `certification/thresholds.json` (no PNG decoder dependency); preference modes must change pixels; console allowlist + label read-back; containment, target and focus suites.
Acceptance: AC-FIN-102. Needs: agent, ci.

**REQ-FIN-103 G4 Regression and evidence.** Maps REQ-QUAL-24..26, -32, -60..63.
- 24–25: L7 baselines (10 configs, `certification/baselines/linux/**`, ≤80 KB each, ≤30 MB) produced only in `AG_PLAYWRIGHT_IMAGE`; non-QUAL diffs = pending + artifacts; manual/scheduled `qual:certify:baseline-refresh`; CODEOWNERS for baselines.
- 26: visual-class report in L7 (feeds REQ-FIN-10).
- 32: ported 4.x measurement layer + fixtures; nightly known-failures proof against `v4.1.0` (five gate ids).
- 60–63: no committed evidence (PNG allowlist must admit `src/**/assets/` shipping assets, OD-19-adjacent decision recorded); evidence verifier; computed claims; ReleaseVerdict G-01..G-16 with `RELEASE_CHECKLIST.md`.
- REQ-FIN-111 tooling (transfer): `packages/qa/src/evidence/composite.ts`, `certification/review/visual-rubric.md` (R1–R7, 1–4) and the manual `qual:certify:review-record` job validating records against a schema and the RC SHA.
Acceptance: AC-FIN-103. Needs: agent, ci.

**REQ-FIN-104 G5 Behaviour.** Maps REQ-QUAL-19..23, -31, -71.
- 19: behaviour lane with axe in two scenes × schemes, emulations, location-based discovery of every stream's APG/e2e specs.
- 20: fix the harness `axe` (today `withRules(['color-contrast'])` disables every other rule), impact filtering, step-indexed failures, self-test, pin `@axe-core/playwright` 4.13.0.
- 21–23: SSR/hydration and overlay-stacking lanes; engine-specific lane (WebKit probe, Gecko parity, Chromium bezel); motion lane over all subjects.
- 31: vacuous-assertion AST gate incl. the "missing subject returns" pattern (REQ-FIN-08).
- 71: G-04 deliverables check for exactly 44 unique flagships (metas today have 43 distinct numbers with duplicates; CMP/SURF renumber).
Acceptance: AC-FIN-104. Needs: agent, ci.

**REQ-FIN-105 G6 Performance.** Maps REQ-QUAL-34..48.
- 34–36: `tests/perf/harness/run-perf.mjs` (trace, CDP, LoAF, heap, GPU proxies, remote-only); fixture stories; real BCI (current helper is a capped area fraction).
- 37–41: grades + PerfReport; budgets from fragments with `perf-budget-looser`; calibration and frozen-budget test; PR p95 ratchet on `.ag-gpu`; 4.1 regression spec.
- 42–47: leak spec; browser invariants (backdrop root, SVG lens, WebGL, a11y fallback); CSS perf stylelint plugins; six QUAL lint rules in `lint/rules/qual/` (auto-discovered); dist JS scans + per-export bytes; Node cold import.
- 48: Device Farm + `mac1.metal` runner (`--self-check` offline, tagged and torn down, instance role only) with human sign-off in `docs/certification/real-device-matrix.md` (REQ-FIN-112).
Acceptance: AC-FIN-105. Needs: agent, ci, human (48).

**REQ-FIN-106 G7 Storybook and Material Lab.** Maps REQ-QUAL-09..11, -49..57.
- 09–11: `StoryRoot` with real readiness (fonts, decode, 2 rAF, cleared per story); cert mode, in which `.storybook/preview.tsx` imports only the built `dist/styles.css` (never a `src/**/*.css` glob, REQ-FIN-05 transfer); preview = AuraGlassProvider → Environment → StoryRoot; delete `StorySurface.tsx`; config test; determinism init script.
- 49–52: `storySort` order and title lint; story-contract validator (flagships export Playground/States/Keyboard; only 1 of 44 exports Keyboard today) + copy lint + `tsconfig.storybook.json`; docs blocks with captions and generated 6-section pages; Start Here with computed counts.
- 53–55: 12 Material Lab stories; controls, spec knobs, ContrastReadout, never shipped; zero story-supplied glass (the Floors/Presets/Rungs offender stories are MAT's and are fixed under REQ-FIN-59; QUAL's validator lists them in an expiring baseline, §4.3 rule 3).
- 56–57: dist-backed build, build/cert/apg manifests, freshness check before every browser lane; `@storybook/addon-a11y` registered; S1 flow specs.
- Reconcile MAT's `tests/a11y/storybook-a11y-config.test.ts` with the frozen globals (`scene`, not `environment`). (MAT edits the file under REQ-FIN-59, §6.1.)
Acceptance: AC-FIN-106. Needs: agent, ci.

**REQ-FIN-107 G8 Showcases.** Maps REQ-QUAL-58, -59.
Ten `showcase/<id>/` showcases composed from registry blocks (contract §3.3) with `showcases.json`, copy, assets; hygiene (tarball import build, showcase stylelint, determinism, assets ≤300 KB AVIF ×12, landmarks, 390/834 layouts) with three tests. Acceptance: AC-FIN-107. Needs: agent.

### 5.8 FIN-H — Human certification and operator actions

**REQ-FIN-110 Issue #16: screen-reader and physical-touch matrix (L13).** Maps REQ-MAT-66, REQ-SURF-129, REQ-SURF-196, REQ-QUAL-72.
Agent prerequisites (FIN-H agent, files in FIN-H's rows only): one SrRecord schema at `contracts/schemas/sr-record.schema.json` (Appendix C C-16; delete `tests/a11y/manual/sr-record.schema.json`) and `scripts/mat/verify-a11y-manual.mjs` repointed to it with `--sha`; `tests/a11y/manual/sr-matrix.template.json` generated from every flagship `*.meta.ts` by `tests/a11y/manual/gen-matrix.mjs`; step scripts under `tests/a11y/manual/scripts/<stream>/<subject>.md` for every flagship, the Surface/Material Lab, GlassPreferencesPanel and the reduced-motion pass; `tests/a11y/manual/aggregate.mjs` writing `.artifacts/qual/a11y-manual-<sha>.json`, consumed by QUAL's ReleaseVerdict (REQ-FIN-103). The SURF AI live-region fixes and the 7 AI metas' migration selectors are REQ-FIN-85's.
Human run: practice passes start on day 1 against the latest `next` Storybook build artifact; the binding pass runs on the RC SHA's CI-built Storybook and only records made on that SHA count:

| Pass | Subjects (issue #16) | AT / device |
|---|---|---|
| SR | menus, selects, overlays (Dialog, AlertDialog, Sheet, Popover, Tooltip), app-shell navigation, tabs, command palette, toast, workflow states, every flagship | VoiceOver macOS/Safari, VoiceOver iOS/Safari, NVDA/Chrome, TalkBack/Chrome |
| Touch | app shell (drawer, rail, tab bar), overlays, select, combobox, dialog/drawer detents, toast swipe, reduced motion, orientation change | physical iPhone (iOS 18 and 26) and Android (Pixel 7 class) |
| Motion | Button, Dialog, Menu, Sheet, Tabs under OS reduced motion | 4 platforms |

Records: `tests/a11y/manual/records/<stream>/<subject>-<at>.json` bound to the RC SHA (≥44 × 5 passes + MAT ≥10 records + 4 motion records). Acceptance: `node scripts/mat/verify-a11y-manual.mjs --sha <rc>` and the QUAL aggregator exit 0; issue #16 closed with links (AC-FIN-110). Needs: human.

**REQ-FIN-111 L14 human visual review.** Maps REQ-QUAL-73. Tooling is FIN-G's (REQ-FIN-103 transfer): `packages/qa/src/evidence/composite.ts`, `certification/review/visual-rubric.md` (R1–R7, scores 1–4), manual job `qual:certify:review-record`. Human part (FIN-H): records under `certification/review/records/**`; a named design reviewer scores every flagship subject-state, the T0 matrix and the six S1 showcases at RC-1, all ≥3, none 1. Acceptance: AC-FIN-111. Needs: human.

**REQ-FIN-112 Real-device performance sign-off.** Part of REQ-QUAL-48. After OD-5 (CA rotation) and the runner registration (OD-11), run the six S1 scenes, Dialog and AppShell on the device farm; a human signs `docs/certification/real-device-matrix.md` (p95 ≤16.7 ms, ≤25 ms mid Android). Needs: human.

**REQ-FIN-113 Operator actions.** Parts of REQ-PLAT-08, -35, -81, -82, -09, -16. From a PLAT worktree with existing logins only (no login/refresh/setup per policy): apply OD-11 settings; run downstream grep at the 4.2 cut and file the AuraOne follow-up issue for the two templates pinned at 3.1.1; run `consumer-grep --write` for RM-01..13; run `sync-fragments` both ways; `gh release create` per tag; close open PRs #97 (head `d5d950b59`, already an ancestor of `origin/release/4.x`) and #77 (head `bfc216d0a`, already an ancestor of `origin/next`) as superseded, with a comment naming the containing commit — the open-PR list must be empty of stale stacked PRs before RC-1; record each in `docs/release/decisions/operator-*.md`. Needs: human.

### 5.9 Owner decisions

| ID | Decision | Default if not decided | Blocks |
|---|---|---|---|
| OD-1 | Aeonik licence (carried) | fonts removed (done in 4.1.1 scope) | REQ-PLAT-54 |
| OD-2 | npm scope `@auraglass` ownership; create the org | unscoped `aura-glass-cli`, `aura-glass-labs` | REQ-FIN-31, -87 |
| OD-3 | Base UI sign-off (carried) | Base UI adopted | G-15 |
| OD-4 | No history rewrite (carried) | not rewritten | — |
| OD-5 | Renew the remote-runner egress CA | device lanes `pending` | REQ-FIN-112, REQ-QUAL-67 |
| OD-6 | Button API break (carried) | as contract | — |
| OD-7 | 4.1.1 scope split (carried) | as PLAT §5 | REQ-FIN-35 |
| OD-8 | Issue a read-only GitHub fine-grained PAT; GitLab pull mirroring of all refs with "Trigger pipelines for mirror updates" on; then disable `mirror-to-gitlab` (it force-pushes with `--prune`) for this repo | owner-run `push-gitlab-refs.mjs --apply` after removing `--prune` from the push workflow (REQ-FIN-20 fallback) | **everything needs=ci** |
| OD-9 | GitLab → GitHub status reporting | `gitlab-status.mjs` merge rule | REQ-FIN-25 |
| OD-10 | npm trusted publishing to GitLab for `aura-glass`, then `@auraglass/*` | no publish (fail closed) | REQ-FIN-31, -45 |
| OD-11 | GitLab project settings (protected `v*`, schedules, Pages public, keep latest artifacts, AWS runner tag) | recorded `missing` | REQ-FIN-23, -112 |
| OD-12 | Custom domain on Pages | `$CI_PAGES_URL` | REQ-FIN-26 |
| OD-13 | **4.1.1 cut point**: create `release/4.1.x` from `78fd7bda1`, cherry-pick CI/tooling commits `85e844776`, `f4d5f884b`, `4dabc703b`, land PLAT-40..54 there (PR prefix `4x11-<stream>/`, treated as line `4x` by CI and `verify-ownership`), tag `v4.1.1` there, bump `release/4.x` to `4.2.0-pre.0` | 4.1.1 cannot be tagged | REQ-PLAT-13, -55, REQ-FIN-30, -45 |
| OD-14 | **Sole-maintainer review**: second reviewer, review bot, or documented admin bypass for code-owner review and `docs/release/**` | protection not applied | REQ-PLAT-17, -20 |
| OD-15 | Combobox virtualisation: owned windowed list vs `@tanstack/react-virtual` allowlist amendment (CC-CMP-06) | owned list | REQ-CMP-72 |
| OD-16 | Approve the additive **contract-v1.2-final** bundle (Appendix C) | each item falls back to "stop emitting" | many |
| OD-17 | Backdrop `tone` vs `BANNED_PROPS`; date peers behind `aura-glass/compat` | rename the prop to `mediaTone` (contract PR); compat date adapters on their own compat subpath | REQ-SURF-04, -11 |
| OD-18 | `createBrandTheme` `accentShift` default | 0 (brand hue preserved) | REQ-MAT-16 |
| OD-19 | App-shell tokens namespace (SURF public `--ag-app-shell-*` vs private) and shipping-asset PNG allowlist | private `--_ag-app-shell-*`; allow `src/**/assets/` | REQ-MAT-04, REQ-QUAL-60 |
| OD-20 | TreeView `treegrid` vs `tree` semantics; DateTimePicker in 5.1 | amend PRD to accept RAC `treegrid`; DateTimePicker 5.1 | REQ-SURF-82, -105 |
| OD-21 | Publish the GHSA for the 4.x hosted runtime and create private `auraoneai/auraglass-server-archive` | 4.1.1 not tagged; RM-01 record stays `missing` | REQ-PLAT-53, -82 |

Owner decisions are recorded in `docs/release/decisions/<od>.md`. Outside the autonomous perimeter (policy §2) and therefore never performed by an agent: changing the org mirror, branch-protection writes, npm org/publisher configuration, GHSA publication, credential rotation.

---

## 6. Files

Ownership follows `contracts/ownership.json` plus the WP table of §4.3; this section is the authority and every path has exactly one WP. Inside FIN-A, a file named by two REQ-FINs is owned by the lower-numbered one (it implements the other's lines). `package.json` is split by key: `exports`, `main`, `types` → REQ-FIN-06 (FIN-A); every other key → FIN-C. `jest.config.js` and `src/contracts/**` change only through the contract PR (Appendix C). Shared new directories `scripts/integration/**` (baselines) and `tests/integration/**` belong to FIN-A.

| WP | Paths (exclusive) |
|---|---|
| FIN-A | 01: `tokens/$schema.json`, `tokens/legacy/**`, `tokens/{schema.json,index.json,personas/**}` (deleted), `scripts/tokens/{build,freeze-4x}.mjs`, new `scripts/tokens/drift.mjs`, `scripts/tokens/formats/{compat-aliases,_shared}.mjs` · 02: `src/material/css/{material,lens}.css`, `src/material/dev/warnings.ts`, `src/components/overlays/_shared/{overlaySurface,overlayTypes}.ts`, `tests/material/state-readers.test.ts` · 03: `scripts/tokens/transforms/{glass-material,contrast-solve}.mjs`, `src/material/css/generated/**`, `tokens/material/material.tokens.json`, `tokens/sys/elevation.tokens.json` · 04: `src/theme/{providerMounts,mounts,index}.ts`, `src/theme/AuraGlassProvider.tsx`, `src/internal/warnDeprecated.ts` · 05: `fragments/css/mat.ts`, `src/a11y/css/**`, `src/theme/preferences-panel/GlassPreferencesPanel.css`, `scripts/mat/verify-a11y-css.mjs` · 06: `scripts/build/{generate-exports.mjs,lib/graph.mjs}`, `package.json#{exports,main,types}` · 07: `src/theme/{portal.ts,layers/**}`, `src/foundation/portal.ts`, `src/components/overlays/_shared/useOverlayLayer.ts`, `src/primitives/{DismissableLayer,FocusScope}.tsx`, `lint/rules/cmp/no-overlay-global-listeners.cjs` · 08: `tests/helpers/**` · 09: `jest.config.js` (contract PR), `packages/cli/test/fixtures.test.ts`, `tests/capability/jest.doubles.cjs` (deleted) · 10: `scripts/release/{classify-change.mjs,lib/policy.mjs}`, `tests/release/classify-change.test.{mjs,ts}`, 4x `scripts/ci/verify-app-chrome-visuals.js` · 11: `tokens/comp/**`, `tokens/sys/app-shell.tokens.json`, `scripts/tokens/gates/undefined-component-vars.mjs` · 12: `src/theme/preferences/store.ts`, `src/motion/css/{motion-modes,loading}.css`, `scripts/mat/verify-motion-css.mjs` · 13: `scripts/release/sync-fragments.mjs`, `tests/release/sync-fragments.test.ts` · 14: `fragments/css/{cmp,surf}.ts`, `scripts/build/verify-css-files.mjs` · all: `scripts/integration/**`, `tests/integration/**` |
| FIN-B | `.gitlab-ci.yml`, `ci/plat.gitlab-ci.yml`, `ci/plat/**`, `scripts/ci/{verify-ci-fragments,gitlab-status,assemble-pages,require-activated}.mjs`, `scripts/release/{push-gitlab-refs,verify-branch-protection}.mjs`, `tests/ci/{no-github-ci,verify-ci-fragments,plat-fragment,no-gate-bypass,gitlab-status,assemble-pages,decision-records,no-forward-merge}.test.ts`, `tests/ci/fixtures/ci-fragments/**`, `tests/release/branch-protection.test.ts`, `docs/release/{branch-policy.md,decisions/gitlab-*.md}`, `.github/CODEOWNERS` (contract PR on `main`) |
| FIN-C | `package.json` (keys other than `exports`/`main`/`types`), `scripts/{release,removal,build,docs,registry,ci}/**` and `tests/{ci,release,deprecations,build,exports,css,docs,dx,pack,removal,react19,rsc/plat,lint/plat,types/plat,side-effects,deps,compat}/**` not listed for FIN-A/FIN-B, `packages/{cli,registry,mcp}/**` minus `packages/cli/test/fixtures.test.ts`, `apps/docs/**`, `registry/{base,blocks/{auth,settings},items/{code-surface,diff-viewer,gantt,kanban,react-hook-form,rich-text,transfer-list}}/**`, `canaries/**`, `etc/**` minus stream-owned `etc/api` reports (contract B22a), `build/**`, `docs/release/**` minus FIN-B/FIN-H files, `docs/security/**`, `legacy/**` (deletion), `src/internal/**` minus `warnDeprecated.ts`, `src/compat/{plat,css}/**`, 4x `src/{utils,components/{cms,accessibility,ssr,interactive},hooks,primitives/Slot.tsx,services,workspace}/**` and 4x `server/**`, `.env.example`, `README*`, `llms*.txt*`, `CHANGELOG.md`, `RELEASE_NOTES_*.md`, `fragments/*/plat.ts`, `lint/rules/plat/**` |
| FIN-D | MAT rows: `tokens/**`, `src/{material,motion,theme,a11y,tokens}/**`, `scripts/{mat,tokens}/**`, each minus FIN-A and FIN-H files; `src/compat/mat/**`, `lint/rules/mat/**`, `stylelint.config.mjs`, `fragments/*/mat.ts` minus `fragments/css/mat.ts`, `fragments/literals-baseline/mat.json`, `ci/mat.gitlab-ci.yml`, `ci/mat/**`, `tests/{tokens,material,motion,lint/mat,e2e/mat,visual/mat,a11y/apg/mat,a11y/mat}/**` and `tests/a11y/contrast-matrix.test.ts`, minus FIN-A files |
| FIN-E | `src/{components,primitives,icons,foundation,forms}/**` minus FIN-A files and SURF component dirs, `src/compat/cmp/**`, `lint/rules/cmp/**` minus FIN-A file, `fragments/*/cmp.ts` minus `fragments/css/cmp.ts`, `ci/cmp.gitlab-ci.yml`, `ci/cmp/**`, `.changeset/cmp-*.md`, `registry/{items/{confirm-dialog,account-menu},blocks/overlay-flows}/**`, `stories/cmp/**`, `tests/{foundation,controls,overlays,primitives,compiler,ssr/cmp,e2e/cmp,visual/cmp,perf/browser/cmp,a11y/apg/cmp,lint/cmp,types/cmp}/**`, `tests/types/cmp-contract.test-d.ts` |
| FIN-F | `src/{app-shell,data,date,ai,media,backdrops,charts,three}/**`, `src/root/surf.ts`, `src/components/{tabs,tab-bar,breadcrumbs,pagination,command-palette,source-transition,timeline}/**`, `src/compat/surf/**`, `packages/labs/**` (contract F02), SURF `registry/{blocks,items}/**`, `scripts/surf/**`, `lint/rules/surf/**`, `fragments/*/surf.*` minus `fragments/css/surf.ts`, `ci/surf.gitlab-ci.yml`, `ci/surf/**`, `docs/auraglass-5/capability-ledger.*`, `tests/{app-shell,data,ai,media,backdrops,charts,labs,capability,types/surf,rsc/surf,ssr/surf,e2e/surf,visual/surf,perf/browser/surf,a11y/apg/surf}/**` and `tests/e2e/surf/clear-over-media/**` (not `tests/a11y/**`, which is MAT's, contract D06) minus `tests/capability/jest.doubles.cjs` |
| FIN-G | `packages/qa/**`, `jest.qual.config.js`, `certification/**` minus `certification/review/records/**`, `.storybook/**`, `showcase/**`, `scripts/{qual,storybook}/**`, `stories/qual/**`, `lint/rules/qual/**`, `tests/{storybook,contract,perf/{harness,qual},lint/qual,e2e/qual,a11y/browser}/**`, `tests/a11y/apg/harness.ts`, `ci/qual.gitlab-ci.yml`, `ci/qual/**`, `fragments/*/qual.*`, `stylelint.showcase.config.mjs`, `tsconfig.storybook.json` |
| FIN-H | `tests/a11y/manual/**`, `scripts/mat/verify-a11y-manual.mjs`, `certification/review/records/**`, `docs/certification/real-device-matrix.md`, `docs/release/decisions/{od-*.md,operator-*.md,removals/RM-*.json,downstream-*.json}` |

### 6.1 Clause transfers

A clause of a requirement whose file belongs to another WP is implemented by that file's owner, from the requesting requirement's ledger text. The requesting REQ's acceptance is evaluated after both PRs merge; neither WP waits to start (§4.3 rule 2).

| Requesting clause | Implemented by (owner of the file) |
|---|---|
| REQ-MAT-26, -42, -43 clauses in `material.css` | REQ-FIN-02 |
| REQ-MAT-28 removal of the committed `generated/properties.css` | REQ-FIN-03 (its drift run regenerates `generated/**` from whatever the emitters produce on `next`) |
| REQ-MAT-53 store reuse in `AuraGlassProvider.tsx`; REQ-MAT-22 `src/theme/index.ts` exports; REQ-PLAT-72 `AuraGlassProvider.tsx` forwardRef | REQ-FIN-04 |
| REQ-MAT-60 `GlassPreferencesPanel.css` | REQ-FIN-05 |
| REQ-MAT-04 `tokens/sys/app-shell.tokens.json` move | REQ-FIN-11 |
| REQ-MAT-53 `store.set` validation | REQ-FIN-12 |
| REQ-PLAT-21, REQ-PLAT-23 item 8, REQ-PLAT-56 install-level cases in `classify-change.mjs` | REQ-FIN-10 |
| REQ-FIN-01 pinned `prettier` devDependency | FIN-C (REQ-FIN-37, `package.json`) |
| REQ-FIN-05 Storybook cert-mode CSS import | REQ-FIN-106 |
| REQ-FIN-07 `AppShell.SidebarToggle.tsx` listener; `CommandPalette` layer; Select/Combobox/Toast registration; ImageViewer registration | REQ-FIN-80; REQ-FIN-82; REQ-FIN-73/-74; REQ-FIN-86 |
| REQ-FIN-09 `plat:test:cli` script line; REQ-FIN-10 change-class stage/needs; every "wire into job"/"run in CI" clause of REQ-FIN-26, -31..-44 that edits `ci/plat.gitlab-ci.yml` | REQ-FIN-22 (FIN-B) |
| REQ-FIN-11 CMP var replacements and focus mixin; REQ-FIN-12 CMP loops; REQ-FIN-14 CMP CSS headers; REQ-PLAT-72 CMP forwardRef | REQ-FIN-70 (CMP-03, -08, -18), REQ-FIN-75 (CMP-118) |
| REQ-FIN-11 SURF var uses; REQ-FIN-12 SURF loops; REQ-FIN-14 SURF CSS headers; REQ-PLAT-72 SURF forwardRef | REQ-FIN-80 (SURF-03, -10), REQ-FIN-90 (SURF-190) |
| REQ-FIN-14 MAT CSS headers outside FIN-A; REQ-FIN-21 `tests/motion/helpers/report.ts` | REQ-FIN-58 |
| REQ-FIN-21 MAT fragment violations | REQ-FIN-53 |
| REQ-FIN-21 `ci/cmp.gitlab-ci.yml:2`; REQ-CMP-141 | REQ-FIN-76 |
| REQ-SURF-195 | REQ-FIN-90 |
| REQ-FIN-21 `scripts/docs/gen-claims.mjs`; `tests/dx/registry-render.spec.ts` | REQ-FIN-43 (PLAT-104); REQ-FIN-42 (PLAT-97) |
| REQ-FIN-26 `_redirects` source | REQ-FIN-39 (PLAT-83) |
| REQ-FIN-106 MAT story offenders (Floors, Presets, Rungs) | REQ-FIN-59 |
| REQ-FIN-110 AI live regions and AI meta selectors | REQ-FIN-85 |
| REQ-FIN-111 composite, rubric, review-record job | REQ-FIN-103 |
| REQ-FIN-110 SrRecord schema under `contracts/schemas/` | contract PR (Appendix C C-16) |
| REQ-PLAT-12, -15 clauses in `packages/labs/{package.json,PUBLISHING.md}` (contract F02: SURF) | REQ-FIN-87 |
| REQ-MAT-64 relocation of `src/media/sampling/**` under `src/backdrops/` | REQ-FIN-86 (MAT keeps an expiring exemption row until it lands) |
| REQ-CMP-01 `src/data/chip/Chip.tsx` composes CMP `Toggle` | REQ-FIN-83 |
| REQ-QUAL-49..57 reconciliation of `tests/a11y/storybook-a11y-config.test.ts` (contract D06: MAT) | REQ-FIN-59 |
| REQ-CMP-142, REQ-MAT-16/-22, REQ-SURF API reports: stream-owned `etc/api/{<entry>,root.<s>,compat.<s>}.*` (contract B22a) | the owning stream WP; FIN-C owns the rest of `etc/**` |

## 7. Components

No new public components beyond PRD-3/PRD-4. Components whose public shape changes to reach their original REQ (all already specified there): `Fieldset` (flat), `Menubar` (`{Root, Menu}`), `SegmentedControl.Indicator`, `Slider.{Track,Range,Thumb}`, `Popover.Root` (hover props), `Tooltip.Root` (`delay`), `Toast` (`useToast` = contract `UseToast`, `Toast.History`), `Dialog` (`appearance`), `Progress` (`appearance='ring'`), `DescriptionList` (`items`), `ImageList` (`items`), `ColorPicker` (`{space, value}`), `FileUpload` (`onValueChange`), `AlertDialog.Action` (`intent`), `Sidebar.Drawer` (auto-mounted), `TabBar` (`appearance`, `placement`), `AppShell` statics, `Command.score`, `Pagination.getRange`, `SourceTransition.start`, `Waveform`/`WaveformLevel`, `FormField`/`useFormField` (`./forms`).

## 8. New files

Every new file named in §5 (tests, scripts, docs, configs). Non-test infrastructure: `src/theme/mounts.ts`, `src/a11y/css/layers.css`, `src/forms/{index,FormField,useFormField}.ts`, `src/foundation/controllable.ts`, `src/material/css/properties.css`, `scripts/tokens/gates/undefined-component-vars.mjs`, `scripts/release/push-gitlab-refs.mjs`, `scripts/removal/{gen-component-dispositions,consumer-grep,revert-dry-run}.mjs` (`verify-archive.mjs` already exists), `scripts/ci/require-activated.mjs`, `scripts/tokens/drift.mjs`, `scripts/build/verify-css-files.mjs`, `scripts/integration/baselines/*.json`, `tests/integration/**`, `tests/a11y/manual/{gen-matrix,aggregate}.mjs`, `tests/a11y/manual/sr-matrix.template.json`, `contracts/schemas/sr-record.schema.json` (C-16), `scripts/docs/gen-redirects.mjs`, `scripts/mat/verify-preference-source.mjs`, `scripts/cmp/gen-fragments.mjs`, `scripts/storybook/{write-cert-manifest,write-build-manifest,write-apg-index,verify-fresh,check-build-log,lint-titles,lint-story-copy,verify-showcase-imports}.mjs`, `scripts/qual/{lint-tests,lint-stories,verify-css-perf,verify-dist-perf}.mjs`, `certification/{run.mjs,lanes.config.ts,matrix.config.ts,thresholds.json,ratchets.json,calibration.json,quarantine.json,exemptions.json,console-allowlist.json,RELEASE_CHECKLIST.md}`, `certification/runner/{build-bundle.mjs,worker-entry.sh,preflight.mjs,shard-plan.mjs}`, `certification/lanes/*.spec.ts`, `certification/scenes/{8 assets,Scenes.stories.tsx}`, `.storybook/contract/StoryRoot.tsx`, `.storybook/lab/{MaterialLab.stories.tsx,ContrastReadout.tsx}`, `packages/qa/src/{resolve,inventory,pixel,ocr,matrix,evidence,perf,inspect,deliverables}/**`, `packages/cli/schema/**`, `packages/mcp/data/mcp-data.json`, `showcase/<10 ids>/**`, `stories/qual/{StartHere.mdx,perf/PerfFixtures.stories.tsx}`, `build/{README.md,v4-exports.snapshot.json,server-safe-exports.json,budgets-4x.json}`, `etc/snapshots/4.1.0.json`, `apps/docs/content/mat/cinematic-contract.md`, `docs/release/{train-checklist.json,decisions/downstream-<v>.json}`, `docs/security/advisories/2026-10-hosted-runtime.md`, `docs/certification/real-device-matrix.md`, `tests/react19/element-ref-spy.ts`, `registry/blocks/ai-workspace/app/api/chat/route.ts`.

## 9. Removals

- `legacy/**` (239 files) before RC; `legacy/src/server/**` after OD-21.
- `.storybook/StorySurface.tsx`; `tests/foundation/contract-coverage.json`; `tests/capability/jest.doubles.cjs`; `tests/a11y/manual/sr-record.schema.json`; `ci/surf/ai-sdk/**` (moved to final paths).
- `tokens/{schema.json,index.json,personas/**}`; `tokens/sys/app-shell.tokens.json` (moved to `tokens/comp/`); `src/theme/materials.ts`; generated `src/material/css/generated/properties.css`; 4x `scripts/ci/gen-deprecations.mjs`; the hand copy of 4x `src/material/css/preview-v5.css`; 4x root `.audit-inspect.mjs`.
- The second `dist/compat/tokens.css` writer; `AG_VALUES` in 4x `scripts/tokens/build.mjs`; every `|| echo PENDING` fail-open; `allow_failure: true` on activated jobs.
- Public exports: `ProgressRing`, `SheetHandle`, `useSheetDetents`, `resolveDetent`, root `formatTimestamp`, extra `./app-shell` values, `createGlassThemeCssVars`/`createBrandGlassTheme` from `./theme` (to compat), Dialog `xl|full` (to compat), compound Portal/Positioner/Popup/Backdrop parts.
- 5.0 peers: `d3-scale`/`d3-shape` (until 5.1 unless OD-16), `three`, `@react-three/*`.

## 10. API changes

All within contract-v1.1 except the additive **contract-v1.2-final** bundle (Appendix C, OD-16). 4.x follows the train: 4.1.1 none (patch-scope test); 4.2.0 C-D/C-E only (optional peers, `/forms`, `/data`, `./deprecations.json`); 4.3.0 bridge exports. 5.0 breaking changes are exactly B1–B21 of `docs/release/breaking-changes.json`; this PRD adds none.

## 11. Migration

The `migrate 4to5` engine (REQ-FIN-40) passes the fixtures of **every** stream (≥120 cases) and the L11 canaries: consumer-4x and the 28 recipe fixtures give 0 TODOs on `flagship-subset.json` and exactly the expected TODOs elsewhere; `GlassButton`/`GlassDrawer` mappings corrected; SURF `app-shell-slots` emits `render={<button …/>}`; MAT `cssVars` covers every `--glass-*`. Every 5.0 removal has a dev warning with a DEP id in a published 4.x minor ≥4.2.0 (G-07).

## 12. Tests

Test rules that apply to every REQ-FIN (enforced by REQ-QUAL-31 and the QUAL contract suite):

1. **No vacuous tests.** A missing subject, file or artifact fails (`test.fail()`/`throw`), never `return` with `console.warn('pending')`. Allowed `pending` states are reported by the lane runner (contract §2.3), not swallowed by specs.
2. **Behaviour over source text.** A test that greps source for a string does not satisfy a behavioural clause.
3. **Real resolution.** Package-level tests import `aura-glass` through the root mapper (REQ-FIN-09) or the packed tarball; no hand-written component doubles once the owner stream has landed.
4. **Every line runs its tests.** 4x Jest `testMatch` covers `.ts/.tsx`; `.mjs` tests are ported to `.ts` or run through `node --test` in a registered lane. Zero-byte test files are deleted or filled.
5. **Negative fixtures.** Every gate has at least one failing fixture asserting its specific message.
6. **Remote only** for browser, visual, perf and heavy builds (policy §1); local runs exit 2 with the remote command.

Mandatory suites per WP: FIN-A each REQ's acceptance test; FIN-B `tests/ci/**` on both lines; FIN-C the PRD-1 named tests; FIN-D/E/F the PRD-2/3/4 named tests incl. APG specs per flagship; FIN-G `packages/qa/test/**`, `tests/{storybook,contract}/**`, `certification/lanes/**`.

## 13. Storybook

Storybook is QUAL's (REQ-FIN-106). Stream WPs: every story carries `parameters.ag {subject, kind}`; flagships export `Playground`, `States`, `Keyboard` (tagged `apg`, referenced by the APG spec); story ids are stable and match the specs (CMP overlays currently diverge, REQ-FIN-74); no story-supplied optics, `!important`, ink overrides or private vars; registry blocks and items have stories with `ag:` parameters (REQ-FIN-90). Cert mode serves built `dist/styles.css` so tests see the shipped sheet set (REQ-FIN-106, carrying the REQ-FIN-05 transfer).

## 14. Responsive

Container queries, never viewport queries, inside components (fix the invalid `@media (max-inline-size: …)` rules in Dialog/AlertDialog/Sheet and the viewport rules in Select/Combobox); every `@container` has a declared container (StatCard, Timeline, MediaControls, ImageViewer inspector, CarouselRail, DescriptionList, Grid, AppShell inner frame); required widths per PRD: 320, 390×844, 768/834, 1024, 1440×900, 1920×1080; 200 % zoom and WCAG 1.4.12 text spacing without clipping (REQ-CMP-21, REQ-QUAL-18).

## 15. Accessibility

WCAG 2.2 AA is the floor. Must ship: the a11y CSS (REQ-FIN-05), one focus ring implementation keyed on `[data-ag-focusable]` with 2.4.13 proof in 8 scenes (REQ-MAT-61, REQ-FIN-11), 24 px fine / 44 px coarse targets via working hit areas (REQ-MAT-62, -SURF-192), focus not obscured by sticky chrome (REQ-MAT-63), one Escape owner (REQ-FIN-07), allowed live regions only (REQ-SURF-129), APG specs per flagship, axe serious/critical = 0 with colour contrast on, OCR pixel contrast (REQ-QUAL-13), forced colours with 0 visible backdrop filters, reduced motion and transparency honoured, and the human L13 record set (REQ-FIN-110).

## 16. Performance

Budgets are the PRD numbers, never loosened by this PRD: size rows from fragments with base-branch ratchet and `Perf-Budget-Raise:` trailer; bare import ≤64 B; Node cold import median ≤150 ms; blur budgets (≤3 fine / ≤2 coarse, nesting depth 1, chrome ≤32 px, scrims ≤12 px); frame p95 per profile; 0 rAF/intervals/infinite animations at rest; grades from the QUAL harness (T1 ≥C, T2 ≥D, no letter drop); prepaint ≤1,536 B and ≤1 ms; Dialog open ≤100 ms at 4× CPU; real-device sign-off before RC-1 (REQ-FIN-112). Calibration (REQ-QUAL-39) happens once Button and Dialog are seed-free and is recorded before any budget freezes.

---

## 17. Acceptance criteria

| ID | Measurable criterion |
|---|---|
| AC-FIN-01 | Shallow clone of `next`: `npm ci && npm run tokens:build` exits 0 twice, `git status --porcelain` empty; `dist/compat/tokens.css` parses, ≤8,192 B gz; `mat:test:drift` green |
| AC-FIN-02 | `rg -c '\.ag-surface' src/material/css` = 0; CMP Button/Dialog/Select popup show non-transparent background and non-`none` `::before` filter in 3 engines |
| AC-FIN-03 | Ladder `backdrop-filter` only on `::before`; default Surface `blur(20px)`; floors match on ancestor backdrop; 0 hard-coded tint floors; 0 unread MAT privates |
| AC-FIN-04 | ≥1 production `registerProviderMount`; brand style, LensDefs, pointer light, dev counter mount without manual registration; `deprecations="silent"` = 0 warnings |
| AC-FIN-05 | `dist/styles.css` contains the `ag.a11y` rings, floors, hit areas, scroll padding, layer-root z-index; `verify-a11y-css` exits 0 |
| AC-FIN-06 | `generate-exports --check` exits 0; `import('aura-glass')` resolves from the packed tarball; no `./charts` on 5.0.x |
| AC-FIN-07 | LayerStack Jest cases pass; 0 document listeners/body style writes in components/primitives; one `usePortalContainer` |
| AC-FIN-08 | `helpers.test.tsx` covers 9 exports incl. ownership-derived owner and unreachable-index error; 0 seed markers in `tests/helpers` |
| AC-FIN-09 | 0 `PENDING` in capability tests; ≥120 fixture cases from all streams, 0 mismatches |
| AC-FIN-10 | Root-export PR classifies C-E; 4x without visual report fails |
| AC-FIN-11 | Undefined-component-vars gate exits 0; every focusable CMP part has a ≥2 px solid outline remotely |
| AC-FIN-12 | 0 ungated loops in `src/**`; 0 infinite animations at rest without `allowContinuous` |
| AC-FIN-13 | Deprecation fragments identical across lines after each sync; generated table byte-equal to `gen:deprecations` |
| AC-FIN-14 | Every CSS file registered, statement first, one correct layer, 0 `!important` |
| AC-FIN-20 | `gitlab-status.mjs --sha` prints a pipeline URL for `origin/next` and `origin/release/4.x` |
| AC-FIN-21 | `contract:ci-fragments OK` on both lines; `no-github-ci` and `verify-ci-fragments` tests pass |
| AC-FIN-22 | Synthetic 4x tag with non-activated gates exits 1 at pack; every `REQUIRED_JOBS ∪ CERT_JOBS` job activated with `allow_failure: false` |
| AC-FIN-23 | 8 recorded CI facts with evidence; first green pipeline URL per line |
| AC-FIN-24 | Every stream job green on a `next` pipeline and activated |
| AC-FIN-25 | No-forward-merge fixture fails / real history passes; policy text has `forward-port` and `2 business days`; branch-protection verifier exits 0 for `main`, `next`, `release/4.x`, `release/4.1.x` |
| AC-FIN-26 | Pages root returns 200; `/lab/` redirects into Storybook |
| AC-FIN-30..44 | Each mapped REQ's `acceptance` in `implementation-audit/fin-open-ledger.json` (stricter §5.3 bullet text wins) passes in a green pipeline on its line, with the job URL recorded in the REQ's Appendix A row |
| AC-FIN-45 | npm versions include 4.1.1, 4.2.0, 4.3.0; dist-tags verified; GitLab Releases with working `dist-maps.tgz` |
| AC-FIN-50..59 | Each mapped REQ-MAT ledger `acceptance` (stricter §5.4 text wins) passes in a green pipeline, job URL recorded |
| AC-FIN-70..76 | Each mapped REQ-CMP ledger `acceptance` (stricter §5.5 text wins) passes in a green pipeline, job URL recorded; `cmp-contract.test-d.ts` green |
| AC-FIN-80..90 | Each mapped REQ-SURF ledger `acceptance` (stricter §5.6 text wins) passes in a green pipeline, job URL recorded |
| AC-FIN-100..107 | Each original REQ-QUAL acceptance passes; `node certification/run.mjs --lane all --scope release --verdict` exits 0 with 16 items `pass` |
| AC-FIN-110 | Manual-record verifier exits 0 on the RC SHA; issue #16 closed with links |
| AC-FIN-111 | L14 records for every flagship subject-state, T0 matrix and 6 S1 showcases, all scores ≥3 |
| AC-FIN-112 | Signed real-device matrix within p95 budgets |
| AC-FIN-113 | Each operator action recorded with date and evidence in `docs/release/decisions/` |
| AC-FIN-GLOBAL | Appendix A has 0 rows not `done`; `implementation-audit/` re-run reports 584/584 done; every `scripts/integration/baselines/*.json` is `[]`; 0 `console.warn(…pending)` early returns in `tests/{e2e,a11y,perf,visual}` |

## 18. Definition of done (GA checklist)

5.0.0 GA may be tagged only when **all** of the following are true and recorded in the ReleaseVerdict (`.artifacts/qual/release-verdict.json`, G-01..G-16):

- [ ] All 584 requirements of PRD-1..5 are `done` per §1.1 (Appendix A shows 0 open rows), each with a green job URL.
- [ ] Pipelines run on `next`, `release/4.x`, every stream/contract/sync branch and every `v*` tag (OD-8 or the REQ-FIN-20 alternative).
- [ ] Every job in `REQUIRED_JOBS` and `CERT_JOBS` is `allow_failure: false` with an `ci/plat/activation.json` row; `contract:ci-fragments` and `contract:conformance` green on both lines.
- [ ] `aura-glass@4.1.1`, `4.2.0`, `4.3.0` published from `release/4.x` by `plat:publish:npm` with provenance; `@auraglass/cli@0.x` published; GitLab Releases created; GHSA published before 4.1.1 (OD-21).
- [ ] Deprecation fragments identical across lines; every 5.0 removal covered by a DEP entry shipped in a published 4.x minor ≥4.2.0 (`verify-breaking-register --coverage --require-covered` exits 0 on the GA tag).
- [ ] `git ls-files legacy | wc -l` = 0; removal gate green for RM-01..RM-14 with consumer-grep records.
- [ ] Packed tarball: every export target exists, `import`/`require` 8/8 on Node 20.19 and 22, `publint --strict` and `attw --profile esm-only` clean, size and side-effect budgets green.
- [ ] Canaries (next16, next15, vite, vite-tailwind4, vite-compiler, types-strict, jest-cjs, Base UI latest, consumer-4x) green from the tarball.
- [ ] Lanes L1–L12 green at release scope with 0 quarantined cells; perf grades meet thresholds; real-device matrix signed.
- [ ] Issue #16 closed with SrRecords for 44 flagships × 5 passes on the RC SHA (REQ-FIN-110); L14 review records all ≥3 (REQ-FIN-111).
- [ ] Docs site deployed to Pages from the release pipeline; README, llms.txt and release notes pass `lint-claims` with every number traced to an artifact.
- [ ] Owner decisions OD-1..OD-21 recorded (decided or explicitly defaulted).

## 19. Dependencies (contract seams only)

| Provider → consumer | Seam | REQ-FIN |
|---|---|---|
| MAT → CMP/SURF | S-05 `materialProps` + `[data-ag-surface]` engine | 02, 03 |
| MAT → all | S-03 token names and manifest | 01, 11 |
| MAT → CMP/SURF | S-21 provider mounts, S-23 portal, S-25 LayerStack, S-26 announcer | 04, 07 |
| MAT → all | S-04 layer order + a11y CSS fragments | 05, 14 |
| MAT → CMP/SURF | S-13 ticker, motion axes | 12, 58 |
| PLAT → all | S-35 manifest/exports, entry eligibility | 06 |
| PLAT → all | S-38/S-50 deprecation fragments and sync | 13, 33 |
| PLAT ↔ QUAL | S-55 visual-class report, stage order | 10, 103 |
| QUAL → all | S-40 test helpers, S-41 story contract | 08, 106 |
| PLAT → all | §4.13 CI fragments, activation | 20–24 |
| CMP → SURF | S-30 compound parts, Field, Button, Popover, Sheet, Menu | 70–74 |
| SURF → QUAL | registry fixtures → showcases | 88, 107 |

No WP waits on another (§4.3 rules 1–3): a consumer writes against the seam's contract-v1.1 type, runs dependent tests as `pending` through the lane runner, and removes the pending state in the PR that sees the producer behaviour; cross-stream gates land green with expiring baselines.

## 20. Execution order

**All work packages start at once** (FIN-A … FIN-H). Disjoint file ownership (§4.3, §6) makes this safe.

Within FIN-A all fourteen agents start together; PRs **merge** in this order so each later item's acceptance is observable on `next` when it merges (a PR that is ready early rebases and merges in its slot; no agent stops working):

1. REQ-FIN-01 token build (nothing else can be verified while `npm run build` exits 1).
2. REQ-FIN-06 entry eligibility (packed-tarball tests depend on it).
3. REQ-FIN-09 test resolution and REQ-FIN-08 discovery/readiness (turns vacuous suites into real ones; expect new red tests, which is the point).
4. REQ-FIN-14 CSS layering and REQ-FIN-05 a11y CSS shipping.
5. REQ-FIN-02 selector, then REQ-FIN-03 ladder/floor wiring (03 depends on 02's selector).
6. REQ-FIN-04 provider mounts, REQ-FIN-07 portal/LayerStack, REQ-FIN-11 token-name seam, REQ-FIN-12 motion axes (parallel).
7. REQ-FIN-10 visual-class seam and REQ-FIN-13 fragment sync (their code merges any time; their CI acceptance is observed on the first pipelines from REQ-FIN-20).

FIN-B: OD-8 (owner) and REQ-FIN-21/-22/-25/-26 code start together; REQ-FIN-23/-24 records are written as soon as the first pipelines exist; activation flips continuously as jobs turn green. FIN-D starts with the `createGlassTheme.ts`/`public.ts` seed replacement (REQ-FIN-52) because nine entries depend on it (REQ-FIN-06).

Release train (REQ-FIN-45; releases are milestones, not work packages): OD-13 → 4.1.1 on `release/4.1.x` (gates: FIN-B pipelines on `release/4.1.x`, REQ-FIN-35, OD-10, OD-21) → 4.2.0 → 4.3.0 (needs REQ-FIN-57 PR #28 content and REQ-FIN-13) → 5.0 alphas on the fixed train → RC-1 (needs FIN-G lanes, then FIN-H human passes) → GA (§18).

FIN-H starts on day 1: the agent writes the REQ-FIN-110 scripts, templates and aggregator, and testers run practice passes on each nightly `next` Storybook artifact; only the passes recorded on the RC SHA are binding.

---

## Appendix A. Traceability: every open original REQ → REQ-FIN → work package

Status: **P** partial, **B** broken, **M** missing. Needs: **A** agent, **C** ci, **H** human, **O** owner decision. Every REQ-FIN maps to the WP of its number range: 01–14 FIN-A, 20–26 FIN-B, 30–45 FIN-C, 50–59 FIN-D, 70–76 FIN-E, 80–90 FIN-F, 100–107 FIN-G, 110–113 FIN-H. 572 rows.

### A.1 PLAT (104 open)

| REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-PLAT-02 | B | A | REQ-FIN-21 | FIN-B | REQ-PLAT-03 | P | A | REQ-FIN-30 | FIN-C | REQ-PLAT-04 | B | A | REQ-FIN-21 | FIN-B |
| REQ-PLAT-05 | B | A | REQ-FIN-22 | FIN-B | REQ-PLAT-06 | P | O | REQ-FIN-20 | FIN-B | REQ-PLAT-07 | B | A | REQ-FIN-26 | FIN-B |
| REQ-PLAT-08 | B | H | REQ-FIN-23 | FIN-B | REQ-PLAT-09 | B | A | REQ-FIN-13 | FIN-A | REQ-PLAT-10 | P | A | REQ-FIN-25 | FIN-B |
| REQ-PLAT-11 | P | A | REQ-FIN-31 | FIN-C | REQ-PLAT-12 | P | A | REQ-FIN-31 | FIN-C | REQ-PLAT-13 | B | A | REQ-FIN-31 | FIN-C |
| REQ-PLAT-14 | P | A | REQ-FIN-31 | FIN-C | REQ-PLAT-15 | P | O | REQ-FIN-31 | FIN-C | REQ-PLAT-16 | B | A | REQ-FIN-31 | FIN-C |
| REQ-PLAT-17 | P | O | REQ-FIN-25 | FIN-B | REQ-PLAT-18 | P | A | REQ-FIN-32 | FIN-C | REQ-PLAT-19 | B | A | REQ-FIN-10 | FIN-A |
| REQ-PLAT-20 | B | A | REQ-FIN-32 | FIN-C | REQ-PLAT-21 | P | A | REQ-FIN-32 | FIN-C | REQ-PLAT-22 | B | A | REQ-FIN-32 | FIN-C |
| REQ-PLAT-23 | P | A | REQ-FIN-32 | FIN-C | REQ-PLAT-24 | B | A | REQ-FIN-33 | FIN-C | REQ-PLAT-25 | B | A | REQ-FIN-33 | FIN-C |
| REQ-PLAT-26 | P | A | REQ-FIN-33 | FIN-C | REQ-PLAT-27 | B | A | REQ-FIN-33 | FIN-C | REQ-PLAT-28 | P | A | REQ-FIN-33 | FIN-C |
| REQ-PLAT-29 | P | A | REQ-FIN-33 | FIN-C | REQ-PLAT-30 | B | A | REQ-FIN-33 | FIN-C | REQ-PLAT-31 | P | C | REQ-FIN-34 | FIN-C |
| REQ-PLAT-32 | B | A | REQ-FIN-34 | FIN-C | REQ-PLAT-33 | M | A | REQ-FIN-34 | FIN-C | REQ-PLAT-34 | P | A | REQ-FIN-34 | FIN-C |
| REQ-PLAT-35 | P | H | REQ-FIN-34 | FIN-C | REQ-PLAT-36 | P | A | REQ-FIN-34 | FIN-C | REQ-PLAT-38 | B | C | REQ-FIN-31 | FIN-C |
| REQ-PLAT-39 | B | C | REQ-FIN-22 | FIN-B | REQ-PLAT-40 | P | A | REQ-FIN-35 | FIN-C | REQ-PLAT-41 | B | A | REQ-FIN-35 | FIN-C |
| REQ-PLAT-42 | P | A | REQ-FIN-35 | FIN-C | REQ-PLAT-43 | P | A | REQ-FIN-35 | FIN-C | REQ-PLAT-44 | P | A | REQ-FIN-35 | FIN-C |
| REQ-PLAT-45 | P | A | REQ-FIN-35 | FIN-C | REQ-PLAT-46 | M | A | REQ-FIN-35 | FIN-C | REQ-PLAT-47 | M | C | REQ-FIN-35 | FIN-C |
| REQ-PLAT-48 | P | A | REQ-FIN-35 | FIN-C | REQ-PLAT-49 | P | A | REQ-FIN-35 | FIN-C | REQ-PLAT-50 | P | A | REQ-FIN-35 | FIN-C |
| REQ-PLAT-51 | P | C | REQ-FIN-22 | FIN-B | REQ-PLAT-52 | B | A | REQ-FIN-35 | FIN-C | REQ-PLAT-53 | B | A | REQ-FIN-35 | FIN-C |
| REQ-PLAT-54 | P | A | REQ-FIN-35 | FIN-C | REQ-PLAT-55 | B | O | REQ-FIN-35 | FIN-C | REQ-PLAT-56 | P | A | REQ-FIN-36 | FIN-C |
| REQ-PLAT-57 | M | A | REQ-FIN-36 | FIN-C | REQ-PLAT-58 | P | A | REQ-FIN-36 | FIN-C | REQ-PLAT-59 | B | A | REQ-FIN-36 | FIN-C |
| REQ-PLAT-60 | B | A | REQ-FIN-36 | FIN-C | REQ-PLAT-61 | P | A | REQ-FIN-36 | FIN-C | REQ-PLAT-62 | M | C | REQ-FIN-36 | FIN-C |
| REQ-PLAT-63 | B | A | REQ-FIN-36 | FIN-C | REQ-PLAT-64 | P | A | REQ-FIN-37 | FIN-C | REQ-PLAT-65 | P | A | REQ-FIN-37 | FIN-C |
| REQ-PLAT-66 | P | A | REQ-FIN-37 | FIN-C | REQ-PLAT-67 | B | A | REQ-FIN-37 | FIN-C | REQ-PLAT-68 | P | C | REQ-FIN-37 | FIN-C |
| REQ-PLAT-69 | P | A | REQ-FIN-37 | FIN-C | REQ-PLAT-70 | P | C | REQ-FIN-37 | FIN-C | REQ-PLAT-71 | P | C | REQ-FIN-37 | FIN-C |
| REQ-PLAT-72 | B | A | REQ-FIN-37 | FIN-C | REQ-PLAT-73 | B | A | REQ-FIN-37 | FIN-C | REQ-PLAT-74 | P | A | REQ-FIN-38 | FIN-C |
| REQ-PLAT-75 | B | A | REQ-FIN-38 | FIN-C | REQ-PLAT-76 | P | C | REQ-FIN-38 | FIN-C | REQ-PLAT-77 | B | C | REQ-FIN-38 | FIN-C |
| REQ-PLAT-78 | P | C | REQ-FIN-38 | FIN-C | REQ-PLAT-79 | P | A | REQ-FIN-39 | FIN-C | REQ-PLAT-80 | B | A | REQ-FIN-39 | FIN-C |
| REQ-PLAT-81 | B | H | REQ-FIN-39 | FIN-C | REQ-PLAT-82 | M | O | REQ-FIN-39 | FIN-C | REQ-PLAT-83 | B | A | REQ-FIN-39 | FIN-C |
| REQ-PLAT-84 | P | A | REQ-FIN-40 | FIN-C | REQ-PLAT-85 | B | A | REQ-FIN-40 | FIN-C | REQ-PLAT-86 | B | A | REQ-FIN-40 | FIN-C |
| REQ-PLAT-87 | B | A | REQ-FIN-40 | FIN-C | REQ-PLAT-88 | P | A | REQ-FIN-40 | FIN-C | REQ-PLAT-89 | P | A | REQ-FIN-40 | FIN-C |
| REQ-PLAT-90 | P | A | REQ-FIN-40 | FIN-C | REQ-PLAT-91 | P | A | REQ-FIN-40 | FIN-C | REQ-PLAT-92 | B | C | REQ-FIN-40 | FIN-C |
| REQ-PLAT-93 | B | A | REQ-FIN-41 | FIN-C | REQ-PLAT-94 | P | C | REQ-FIN-42 | FIN-C | REQ-PLAT-95 | B | A | REQ-FIN-42 | FIN-C |
| REQ-PLAT-96 | P | A | REQ-FIN-42 | FIN-C | REQ-PLAT-97 | B | C | REQ-FIN-42 | FIN-C | REQ-PLAT-98 | B | A | REQ-FIN-42 | FIN-C |
| REQ-PLAT-99 | B | A | REQ-FIN-43 | FIN-C | REQ-PLAT-100 | B | A | REQ-FIN-43 | FIN-C | REQ-PLAT-101 | M | A | REQ-FIN-43 | FIN-C |
| REQ-PLAT-102 | B | C | REQ-FIN-43 | FIN-C | REQ-PLAT-103 | B | C | REQ-FIN-43 | FIN-C | REQ-PLAT-104 | B | A | REQ-FIN-43 | FIN-C |
| REQ-PLAT-105 | B | A | REQ-FIN-43 | FIN-C | REQ-PLAT-106 | B | A | REQ-FIN-44 | FIN-C |  |  |  |  |  |

### A.2 MAT (66 open)

| REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-MAT-01 | P | A | REQ-FIN-01 | FIN-A | REQ-MAT-02 | P | A | REQ-FIN-50 | FIN-D | REQ-MAT-03 | B | C | REQ-FIN-01 | FIN-A |
| REQ-MAT-04 | P | A | REQ-FIN-50 | FIN-D | REQ-MAT-05 | P | A | REQ-FIN-50 | FIN-D | REQ-MAT-06 | P | A | REQ-FIN-50 | FIN-D |
| REQ-MAT-07 | P | A | REQ-FIN-03 | FIN-A | REQ-MAT-08 | P | A | REQ-FIN-50 | FIN-D | REQ-MAT-09 | B | A | REQ-FIN-02 | FIN-A |
| REQ-MAT-10 | B | A | REQ-FIN-03 | FIN-A | REQ-MAT-11 | P | A | REQ-FIN-51 | FIN-D | REQ-MAT-12 | P | C | REQ-FIN-51 | FIN-D |
| REQ-MAT-13 | B | A | REQ-FIN-01 | FIN-A | REQ-MAT-14 | P | O | REQ-FIN-52 | FIN-D | REQ-MAT-15 | P | A | REQ-FIN-52 | FIN-D |
| REQ-MAT-16 | P | O | REQ-FIN-52 | FIN-D | REQ-MAT-17 | P | C | REQ-FIN-53 | FIN-D | REQ-MAT-18 | B | A | REQ-FIN-53 | FIN-D |
| REQ-MAT-19 | P | A | REQ-FIN-14 | FIN-A | REQ-MAT-20 | P | A | REQ-FIN-54 | FIN-D | REQ-MAT-21 | B | A | REQ-FIN-01 | FIN-A |
| REQ-MAT-22 | P | A | REQ-FIN-54 | FIN-D | REQ-MAT-23 | P | A | REQ-FIN-55 | FIN-D | REQ-MAT-24 | P | A | REQ-FIN-55 | FIN-D |
| REQ-MAT-26 | P | A | REQ-FIN-55 | FIN-D | REQ-MAT-27 | P | A | REQ-FIN-55 | FIN-D | REQ-MAT-28 | B | A | REQ-FIN-55 | FIN-D |
| REQ-MAT-29 | B | A | REQ-FIN-02 | FIN-A | REQ-MAT-30 | B | A | REQ-FIN-03 | FIN-A | REQ-MAT-31 | P | A | REQ-FIN-02 | FIN-A |
| REQ-MAT-32 | B | A | REQ-FIN-03 | FIN-A | REQ-MAT-33 | P | A | REQ-FIN-03 | FIN-A | REQ-MAT-34 | B | C | REQ-FIN-03 | FIN-A |
| REQ-MAT-35 | B | A | REQ-FIN-03 | FIN-A | REQ-MAT-36 | P | A | REQ-FIN-04 | FIN-A | REQ-MAT-37 | P | A | REQ-FIN-56 | FIN-D |
| REQ-MAT-38 | P | A | REQ-FIN-04 | FIN-A | REQ-MAT-39 | P | A | REQ-FIN-53 | FIN-D | REQ-MAT-40 | M | A | REQ-FIN-03 | FIN-A |
| REQ-MAT-41 | B | A | REQ-FIN-57 | FIN-D | REQ-MAT-42 | P | A | REQ-FIN-58 | FIN-D | REQ-MAT-43 | P | C | REQ-FIN-58 | FIN-D |
| REQ-MAT-44 | P | C | REQ-FIN-58 | FIN-D | REQ-MAT-45 | P | A | REQ-FIN-58 | FIN-D | REQ-MAT-46 | B | A | REQ-FIN-12 | FIN-A |
| REQ-MAT-47 | P | A | REQ-FIN-58 | FIN-D | REQ-MAT-48 | P | A | REQ-FIN-58 | FIN-D | REQ-MAT-49 | B | A | REQ-FIN-04 | FIN-A |
| REQ-MAT-50 | B | A | REQ-FIN-58 | FIN-D | REQ-MAT-51 | P | A | REQ-FIN-58 | FIN-D | REQ-MAT-52 | B | A | REQ-FIN-59 | FIN-D |
| REQ-MAT-53 | P | A | REQ-FIN-59 | FIN-D | REQ-MAT-54 | B | A | REQ-FIN-05 | FIN-A | REQ-MAT-55 | B | A | REQ-FIN-04 | FIN-A |
| REQ-MAT-56 | P | A | REQ-FIN-07 | FIN-A | REQ-MAT-57 | B | A | REQ-FIN-07 | FIN-A | REQ-MAT-58 | P | A | REQ-FIN-59 | FIN-D |
| REQ-MAT-59 | B | C | REQ-FIN-59 | FIN-D | REQ-MAT-60 | P | A | REQ-FIN-59 | FIN-D | REQ-MAT-61 | B | A | REQ-FIN-05 | FIN-A |
| REQ-MAT-62 | B | A | REQ-FIN-05 | FIN-A | REQ-MAT-63 | P | C | REQ-FIN-05 | FIN-A | REQ-MAT-64 | P | A | REQ-FIN-59 | FIN-D |
| REQ-MAT-65 | P | C | REQ-FIN-59 | FIN-D | REQ-MAT-66 | M | H | REQ-FIN-110 | FIN-H | REQ-MAT-67 | P | O | REQ-FIN-57 | FIN-D |

### A.3 CMP (138 open)

| REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-CMP-01 | P | C | REQ-FIN-70 | FIN-E | REQ-CMP-02 | P | A | REQ-FIN-70 | FIN-E | REQ-CMP-03 | B | A | REQ-FIN-70 | FIN-E |
| REQ-CMP-04 | P | A | REQ-FIN-70 | FIN-E | REQ-CMP-05 | B | A | REQ-FIN-70 | FIN-E | REQ-CMP-06 | B | A | REQ-FIN-70 | FIN-E |
| REQ-CMP-07 | P | A | REQ-FIN-70 | FIN-E | REQ-CMP-08 | B | A | REQ-FIN-70 | FIN-E | REQ-CMP-09 | B | A | REQ-FIN-14 | FIN-A |
| REQ-CMP-10 | P | C | REQ-FIN-70 | FIN-E | REQ-CMP-11 | P | A | REQ-FIN-07 | FIN-A | REQ-CMP-12 | B | A | REQ-FIN-07 | FIN-A |
| REQ-CMP-13 | B | A | REQ-FIN-70 | FIN-E | REQ-CMP-14 | P | A | REQ-FIN-70 | FIN-E | REQ-CMP-15 | P | C | REQ-FIN-70 | FIN-E |
| REQ-CMP-16 | P | C | REQ-FIN-70 | FIN-E | REQ-CMP-17 | P | C | REQ-FIN-70 | FIN-E | REQ-CMP-18 | B | A | REQ-FIN-70 | FIN-E |
| REQ-CMP-19 | B | A | REQ-FIN-11 | FIN-A | REQ-CMP-20 | P | A | REQ-FIN-70 | FIN-E | REQ-CMP-21 | P | C | REQ-FIN-70 | FIN-E |
| REQ-CMP-22 | B | A | REQ-FIN-70 | FIN-E | REQ-CMP-23 | B | A | REQ-FIN-06 | FIN-A | REQ-CMP-24 | M | A | REQ-FIN-70 | FIN-E |
| REQ-CMP-27 | P | C | REQ-FIN-71 | FIN-E | REQ-CMP-28 | P | A | REQ-FIN-71 | FIN-E | REQ-CMP-29 | P | A | REQ-FIN-06 | FIN-A |
| REQ-CMP-30 | P | A | REQ-FIN-71 | FIN-E | REQ-CMP-31 | M | A | REQ-FIN-71 | FIN-E | REQ-CMP-32 | P | A | REQ-FIN-72 | FIN-E |
| REQ-CMP-33 | P | A | REQ-FIN-72 | FIN-E | REQ-CMP-34 | P | A | REQ-FIN-02 | FIN-A | REQ-CMP-35 | P | A | REQ-FIN-72 | FIN-E |
| REQ-CMP-36 | P | A | REQ-FIN-72 | FIN-E | REQ-CMP-37 | P | A | REQ-FIN-72 | FIN-E | REQ-CMP-38 | P | A | REQ-FIN-72 | FIN-E |
| REQ-CMP-39 | P | A | REQ-FIN-72 | FIN-E | REQ-CMP-40 | P | A | REQ-FIN-72 | FIN-E | REQ-CMP-41 | P | A | REQ-FIN-72 | FIN-E |
| REQ-CMP-42 | M | A | REQ-FIN-72 | FIN-E | REQ-CMP-43 | P | A | REQ-FIN-72 | FIN-E | REQ-CMP-44 | P | A | REQ-FIN-72 | FIN-E |
| REQ-CMP-45 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-46 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-47 | P | C | REQ-FIN-73 | FIN-E |
| REQ-CMP-48 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-49 | B | A | REQ-FIN-73 | FIN-E | REQ-CMP-50 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-51 | M | A | REQ-FIN-73 | FIN-E | REQ-CMP-52 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-53 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-54 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-55 | B | A | REQ-FIN-73 | FIN-E | REQ-CMP-56 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-57 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-59 | B | A | REQ-FIN-73 | FIN-E | REQ-CMP-60 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-61 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-62 | B | A | REQ-FIN-73 | FIN-E | REQ-CMP-63 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-64 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-65 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-66 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-67 | B | A | REQ-FIN-73 | FIN-E | REQ-CMP-68 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-69 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-70 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-71 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-72 | B | O | REQ-FIN-73 | FIN-E |
| REQ-CMP-73 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-74 | B | A | REQ-FIN-73 | FIN-E | REQ-CMP-75 | P | A | REQ-FIN-73 | FIN-E |
| REQ-CMP-76 | P | A | REQ-FIN-73 | FIN-E | REQ-CMP-77 | B | A | REQ-FIN-73 | FIN-E | REQ-CMP-78 | P | A | REQ-FIN-02 | FIN-A |
| REQ-CMP-79 | B | A | REQ-FIN-74 | FIN-E | REQ-CMP-80 | B | A | REQ-FIN-07 | FIN-A | REQ-CMP-81 | P | C | REQ-FIN-74 | FIN-E |
| REQ-CMP-82 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-83 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-84 | B | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-85 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-86 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-88 | P | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-89 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-90 | B | C | REQ-FIN-74 | FIN-E | REQ-CMP-91 | P | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-92 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-93 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-94 | P | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-95 | B | A | REQ-FIN-74 | FIN-E | REQ-CMP-96 | P | C | REQ-FIN-74 | FIN-E | REQ-CMP-97 | P | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-98 | P | C | REQ-FIN-74 | FIN-E | REQ-CMP-99 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-100 | P | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-101 | B | C | REQ-FIN-74 | FIN-E | REQ-CMP-102 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-103 | P | C | REQ-FIN-74 | FIN-E |
| REQ-CMP-104 | B | A | REQ-FIN-74 | FIN-E | REQ-CMP-105 | P | A | REQ-FIN-74 | FIN-E | REQ-CMP-106 | B | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-107 | B | A | REQ-FIN-74 | FIN-E | REQ-CMP-108 | B | A | REQ-FIN-74 | FIN-E | REQ-CMP-109 | M | A | REQ-FIN-74 | FIN-E |
| REQ-CMP-110 | B | A | REQ-FIN-74 | FIN-E | REQ-CMP-111 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-112 | B | A | REQ-FIN-75 | FIN-E |
| REQ-CMP-113 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-114 | B | A | REQ-FIN-75 | FIN-E | REQ-CMP-115 | P | A | REQ-FIN-75 | FIN-E |
| REQ-CMP-116 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-117 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-118 | P | A | REQ-FIN-75 | FIN-E |
| REQ-CMP-119 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-120 | B | A | REQ-FIN-75 | FIN-E | REQ-CMP-121 | P | A | REQ-FIN-75 | FIN-E |
| REQ-CMP-122 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-123 | B | A | REQ-FIN-75 | FIN-E | REQ-CMP-124 | B | A | REQ-FIN-75 | FIN-E |
| REQ-CMP-125 | B | A | REQ-FIN-75 | FIN-E | REQ-CMP-126 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-127 | P | A | REQ-FIN-75 | FIN-E |
| REQ-CMP-128 | B | A | REQ-FIN-75 | FIN-E | REQ-CMP-129 | P | A | REQ-FIN-75 | FIN-E | REQ-CMP-130 | M | C | REQ-FIN-75 | FIN-E |
| REQ-CMP-131 | P | A | REQ-FIN-76 | FIN-E | REQ-CMP-132 | B | A | REQ-FIN-76 | FIN-E | REQ-CMP-133 | P | A | REQ-FIN-76 | FIN-E |
| REQ-CMP-134 | P | A | REQ-FIN-76 | FIN-E | REQ-CMP-135 | P | C | REQ-FIN-76 | FIN-E | REQ-CMP-136 | P | C | REQ-FIN-76 | FIN-E |
| REQ-CMP-137 | P | C | REQ-FIN-76 | FIN-E | REQ-CMP-138 | M | A | REQ-FIN-76 | FIN-E | REQ-CMP-139 | P | A | REQ-FIN-76 | FIN-E |
| REQ-CMP-140 | P | A | REQ-FIN-76 | FIN-E | REQ-CMP-141 | P | C | REQ-FIN-76 | FIN-E | REQ-CMP-142 | P | A | REQ-FIN-76 | FIN-E |

### A.4 SURF (191 open)

| REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-SURF-01 | P | A | REQ-FIN-80 | FIN-F | REQ-SURF-02 | P | A | REQ-FIN-80 | FIN-F | REQ-SURF-03 | B | A | REQ-FIN-80 | FIN-F |
| REQ-SURF-04 | P | O | REQ-FIN-80 | FIN-F | REQ-SURF-05 | B | A | REQ-FIN-80 | FIN-F | REQ-SURF-06 | P | C | REQ-FIN-80 | FIN-F |
| REQ-SURF-07 | P | C | REQ-FIN-80 | FIN-F | REQ-SURF-08 | P | A | REQ-FIN-80 | FIN-F | REQ-SURF-09 | P | A | REQ-FIN-80 | FIN-F |
| REQ-SURF-10 | P | A | REQ-FIN-80 | FIN-F | REQ-SURF-11 | B | O | REQ-FIN-80 | FIN-F | REQ-SURF-12 | P | A | REQ-FIN-80 | FIN-F |
| REQ-SURF-13 | P | A | REQ-FIN-80 | FIN-F | REQ-SURF-14 | B | A | REQ-FIN-80 | FIN-F | REQ-SURF-15 | P | C | REQ-FIN-80 | FIN-F |
| REQ-SURF-17 | B | A | REQ-FIN-81 | FIN-F | REQ-SURF-18 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-19 | B | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-20 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-21 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-23 | P | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-24 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-25 | M | A | REQ-FIN-81 | FIN-F | REQ-SURF-26 | B | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-27 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-28 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-29 | M | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-30 | B | A | REQ-FIN-81 | FIN-F | REQ-SURF-31 | B | A | REQ-FIN-81 | FIN-F | REQ-SURF-32 | P | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-33 | B | A | REQ-FIN-81 | FIN-F | REQ-SURF-34 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-35 | B | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-36 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-37 | B | A | REQ-FIN-81 | FIN-F | REQ-SURF-38 | M | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-39 | B | A | REQ-FIN-81 | FIN-F | REQ-SURF-40 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-41 | P | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-42 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-43 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-44 | B | A | REQ-FIN-81 | FIN-F |
| REQ-SURF-45 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-46 | P | A | REQ-FIN-81 | FIN-F | REQ-SURF-47 | P | A | REQ-FIN-82 | FIN-F |
| REQ-SURF-48 | P | A | REQ-FIN-82 | FIN-F | REQ-SURF-49 | M | A | REQ-FIN-82 | FIN-F | REQ-SURF-50 | P | A | REQ-FIN-82 | FIN-F |
| REQ-SURF-51 | B | A | REQ-FIN-82 | FIN-F | REQ-SURF-52 | P | C | REQ-FIN-82 | FIN-F | REQ-SURF-53 | P | C | REQ-FIN-82 | FIN-F |
| REQ-SURF-54 | M | A | REQ-FIN-82 | FIN-F | REQ-SURF-55 | P | A | REQ-FIN-82 | FIN-F | REQ-SURF-56 | P | A | REQ-FIN-82 | FIN-F |
| REQ-SURF-57 | M | C | REQ-FIN-82 | FIN-F | REQ-SURF-58 | B | A | REQ-FIN-82 | FIN-F | REQ-SURF-59 | P | C | REQ-FIN-82 | FIN-F |
| REQ-SURF-60 | B | A | REQ-FIN-07 | FIN-A | REQ-SURF-61 | P | A | REQ-FIN-82 | FIN-F | REQ-SURF-62 | P | A | REQ-FIN-82 | FIN-F |
| REQ-SURF-63 | M | C | REQ-FIN-82 | FIN-F | REQ-SURF-64 | B | A | REQ-FIN-82 | FIN-F | REQ-SURF-65 | B | C | REQ-FIN-82 | FIN-F |
| REQ-SURF-66 | B | A | REQ-FIN-83 | FIN-F | REQ-SURF-67 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-68 | P | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-69 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-70 | B | C | REQ-FIN-83 | FIN-F | REQ-SURF-71 | P | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-72 | B | C | REQ-FIN-83 | FIN-F | REQ-SURF-73 | B | A | REQ-FIN-83 | FIN-F | REQ-SURF-74 | B | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-75 | P | C | REQ-FIN-83 | FIN-F | REQ-SURF-76 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-77 | P | C | REQ-FIN-83 | FIN-F |
| REQ-SURF-78 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-79 | M | A | REQ-FIN-83 | FIN-F | REQ-SURF-80 | P | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-81 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-82 | B | O | REQ-FIN-83 | FIN-F | REQ-SURF-83 | M | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-84 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-85 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-86 | B | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-87 | B | A | REQ-FIN-83 | FIN-F | REQ-SURF-88 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-89 | P | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-90 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-91 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-92 | B | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-93 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-94 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-95 | B | A | REQ-FIN-83 | FIN-F |
| REQ-SURF-96 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-97 | P | A | REQ-FIN-83 | FIN-F | REQ-SURF-98 | P | A | REQ-FIN-84 | FIN-F |
| REQ-SURF-99 | P | A | REQ-FIN-84 | FIN-F | REQ-SURF-100 | P | A | REQ-FIN-84 | FIN-F | REQ-SURF-101 | P | A | REQ-FIN-84 | FIN-F |
| REQ-SURF-102 | B | A | REQ-FIN-84 | FIN-F | REQ-SURF-103 | B | A | REQ-FIN-84 | FIN-F | REQ-SURF-104 | P | A | REQ-FIN-84 | FIN-F |
| REQ-SURF-105 | M | O | REQ-FIN-84 | FIN-F | REQ-SURF-106 | B | A | REQ-FIN-85 | FIN-F | REQ-SURF-107 | P | A | REQ-FIN-85 | FIN-F |
| REQ-SURF-108 | B | C | REQ-FIN-85 | FIN-F | REQ-SURF-109 | B | C | REQ-FIN-85 | FIN-F | REQ-SURF-110 | B | A | REQ-FIN-85 | FIN-F |
| REQ-SURF-111 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-112 | B | A | REQ-FIN-85 | FIN-F | REQ-SURF-113 | P | A | REQ-FIN-85 | FIN-F |
| REQ-SURF-114 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-115 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-116 | P | A | REQ-FIN-85 | FIN-F |
| REQ-SURF-117 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-118 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-119 | B | A | REQ-FIN-85 | FIN-F |
| REQ-SURF-120 | B | A | REQ-FIN-85 | FIN-F | REQ-SURF-121 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-122 | P | A | REQ-FIN-85 | FIN-F |
| REQ-SURF-123 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-124 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-125 | P | A | REQ-FIN-85 | FIN-F |
| REQ-SURF-126 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-127 | P | A | REQ-FIN-85 | FIN-F | REQ-SURF-128 | P | C | REQ-FIN-85 | FIN-F |
| REQ-SURF-129 | P | H | REQ-FIN-110 | FIN-H | REQ-SURF-130 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-131 | P | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-133 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-134 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-135 | B | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-136 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-137 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-138 | P | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-139 | B | A | REQ-FIN-86 | FIN-F | REQ-SURF-140 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-141 | P | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-142 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-143 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-144 | P | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-145 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-146 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-147 | P | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-148 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-149 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-150 | M | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-151 | P | C | REQ-FIN-86 | FIN-F | REQ-SURF-152 | P | C | REQ-FIN-86 | FIN-F | REQ-SURF-153 | P | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-154 | P | C | REQ-FIN-86 | FIN-F | REQ-SURF-155 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-156 | P | A | REQ-FIN-86 | FIN-F |
| REQ-SURF-157 | P | C | REQ-FIN-86 | FIN-F | REQ-SURF-158 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-159 | P | C | REQ-FIN-86 | FIN-F |
| REQ-SURF-160 | P | A | REQ-FIN-86 | FIN-F | REQ-SURF-161 | P | A | REQ-FIN-87 | FIN-F | REQ-SURF-162 | B | A | REQ-FIN-87 | FIN-F |
| REQ-SURF-163 | P | A | REQ-FIN-87 | FIN-F | REQ-SURF-164 | B | A | REQ-FIN-87 | FIN-F | REQ-SURF-165 | P | A | REQ-FIN-87 | FIN-F |
| REQ-SURF-166 | P | C | REQ-FIN-87 | FIN-F | REQ-SURF-167 | P | C | REQ-FIN-87 | FIN-F | REQ-SURF-168 | B | A | REQ-FIN-87 | FIN-F |
| REQ-SURF-169 | P | A | REQ-FIN-87 | FIN-F | REQ-SURF-170 | P | A | REQ-FIN-88 | FIN-F | REQ-SURF-171 | P | A | REQ-FIN-88 | FIN-F |
| REQ-SURF-172 | P | A | REQ-FIN-88 | FIN-F | REQ-SURF-173 | P | A | REQ-FIN-88 | FIN-F | REQ-SURF-174 | P | A | REQ-FIN-88 | FIN-F |
| REQ-SURF-175 | P | A | REQ-FIN-88 | FIN-F | REQ-SURF-176 | P | A | REQ-FIN-88 | FIN-F | REQ-SURF-177 | P | A | REQ-FIN-88 | FIN-F |
| REQ-SURF-178 | P | A | REQ-FIN-88 | FIN-F | REQ-SURF-179 | P | A | REQ-FIN-89 | FIN-F | REQ-SURF-181 | P | C | REQ-FIN-89 | FIN-F |
| REQ-SURF-182 | P | A | REQ-FIN-89 | FIN-F | REQ-SURF-183 | P | A | REQ-FIN-89 | FIN-F | REQ-SURF-184 | P | C | REQ-FIN-89 | FIN-F |
| REQ-SURF-185 | P | A | REQ-FIN-89 | FIN-F | REQ-SURF-187 | P | A | REQ-FIN-89 | FIN-F | REQ-SURF-188 | P | C | REQ-FIN-90 | FIN-F |
| REQ-SURF-189 | B | A | REQ-FIN-90 | FIN-F | REQ-SURF-190 | B | A | REQ-FIN-90 | FIN-F | REQ-SURF-191 | B | A | REQ-FIN-90 | FIN-F |
| REQ-SURF-192 | B | A | REQ-FIN-90 | FIN-F | REQ-SURF-193 | B | A | REQ-FIN-90 | FIN-F | REQ-SURF-194 | P | A | REQ-FIN-90 | FIN-F |
| REQ-SURF-195 | P | O | REQ-FIN-90 | FIN-F | REQ-SURF-196 | P | H | REQ-FIN-110 | FIN-H |  |  |  |  |  |

### A.5 QUAL (73 open)

| REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP | REQ | St | Nd | REQ-FIN | WP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-QUAL-01 | M | A | REQ-FIN-100 | FIN-G | REQ-QUAL-02 | M | A | REQ-FIN-100 | FIN-G | REQ-QUAL-03 | M | A | REQ-FIN-100 | FIN-G |
| REQ-QUAL-04 | M | A | REQ-FIN-102 | FIN-G | REQ-QUAL-05 | B | A | REQ-FIN-101 | FIN-G | REQ-QUAL-06 | B | C | REQ-FIN-101 | FIN-G |
| REQ-QUAL-07 | P | A | REQ-FIN-102 | FIN-G | REQ-QUAL-08 | M | A | REQ-FIN-102 | FIN-G | REQ-QUAL-09 | B | A | REQ-FIN-106 | FIN-G |
| REQ-QUAL-10 | P | A | REQ-FIN-106 | FIN-G | REQ-QUAL-11 | M | A | REQ-FIN-106 | FIN-G | REQ-QUAL-12 | M | A | REQ-FIN-102 | FIN-G |
| REQ-QUAL-13 | M | A | REQ-FIN-102 | FIN-G | REQ-QUAL-14 | M | A | REQ-FIN-102 | FIN-G | REQ-QUAL-15 | M | A | REQ-FIN-102 | FIN-G |
| REQ-QUAL-16 | M | C | REQ-FIN-102 | FIN-G | REQ-QUAL-17 | M | A | REQ-FIN-102 | FIN-G | REQ-QUAL-18 | M | C | REQ-FIN-102 | FIN-G |
| REQ-QUAL-19 | M | A | REQ-FIN-104 | FIN-G | REQ-QUAL-20 | B | A | REQ-FIN-104 | FIN-G | REQ-QUAL-21 | M | A | REQ-FIN-104 | FIN-G |
| REQ-QUAL-22 | M | C | REQ-FIN-104 | FIN-G | REQ-QUAL-23 | M | A | REQ-FIN-104 | FIN-G | REQ-QUAL-24 | M | C | REQ-FIN-103 | FIN-G |
| REQ-QUAL-25 | M | A | REQ-FIN-103 | FIN-G | REQ-QUAL-26 | M | A | REQ-FIN-103 | FIN-G | REQ-QUAL-27 | M | A | REQ-FIN-101 | FIN-G |
| REQ-QUAL-28 | M | A | REQ-FIN-101 | FIN-G | REQ-QUAL-29 | M | A | REQ-FIN-101 | FIN-G | REQ-QUAL-30 | M | A | REQ-FIN-101 | FIN-G |
| REQ-QUAL-31 | M | A | REQ-FIN-104 | FIN-G | REQ-QUAL-32 | M | A | REQ-FIN-103 | FIN-G | REQ-QUAL-33 | M | A | REQ-FIN-101 | FIN-G |
| REQ-QUAL-34 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-35 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-36 | B | A | REQ-FIN-105 | FIN-G |
| REQ-QUAL-37 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-38 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-39 | M | A | REQ-FIN-105 | FIN-G |
| REQ-QUAL-40 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-41 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-42 | M | A | REQ-FIN-105 | FIN-G |
| REQ-QUAL-43 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-44 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-45 | M | A | REQ-FIN-105 | FIN-G |
| REQ-QUAL-46 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-47 | M | A | REQ-FIN-105 | FIN-G | REQ-QUAL-48 | M | H | REQ-FIN-105 | FIN-G |
| REQ-QUAL-49 | M | A | REQ-FIN-106 | FIN-G | REQ-QUAL-50 | M | A | REQ-FIN-106 | FIN-G | REQ-QUAL-51 | P | A | REQ-FIN-106 | FIN-G |
| REQ-QUAL-52 | M | A | REQ-FIN-106 | FIN-G | REQ-QUAL-53 | M | A | REQ-FIN-106 | FIN-G | REQ-QUAL-54 | M | A | REQ-FIN-106 | FIN-G |
| REQ-QUAL-55 | M | A | REQ-FIN-106 | FIN-G | REQ-QUAL-56 | M | C | REQ-FIN-106 | FIN-G | REQ-QUAL-57 | P | A | REQ-FIN-106 | FIN-G |
| REQ-QUAL-58 | M | A | REQ-FIN-107 | FIN-G | REQ-QUAL-59 | M | A | REQ-FIN-107 | FIN-G | REQ-QUAL-60 | M | A | REQ-FIN-103 | FIN-G |
| REQ-QUAL-61 | M | A | REQ-FIN-103 | FIN-G | REQ-QUAL-62 | M | A | REQ-FIN-103 | FIN-G | REQ-QUAL-63 | M | A | REQ-FIN-103 | FIN-G |
| REQ-QUAL-64 | P | C | REQ-FIN-101 | FIN-G | REQ-QUAL-65 | M | C | REQ-FIN-101 | FIN-G | REQ-QUAL-66 | P | A | REQ-FIN-101 | FIN-G |
| REQ-QUAL-67 | M | A | REQ-FIN-101 | FIN-G | REQ-QUAL-68 | M | A | REQ-FIN-101 | FIN-G | REQ-QUAL-69 | P | A | REQ-FIN-08 | FIN-A |
| REQ-QUAL-70 | P | A | REQ-FIN-100 | FIN-G | REQ-QUAL-71 | M | A | REQ-FIN-104 | FIN-G | REQ-QUAL-72 | B | H | REQ-FIN-110 | FIN-H |
| REQ-QUAL-73 | M | H | REQ-FIN-111 | FIN-H |  |  |  |  |  |  |  |  |  |  |

### A.6 Rows per REQ-FIN (primary mapping)

01:4 · 02:5 · 03:8 · 04:4 · 05:4 · 06:2 · 07:6 · 08:1 · 10:1 · 11:1 · 12:1 · 13:1 · 14:2 · 20:1 · 21:2 · 22:3 · 23:1 · 25:2 · 26:1 · 30:1 · 31:7 · 32:5 · 33:7 · 34:6 · 35:15 · 36:8 · 37:10 · 38:5 · 39:5 · 40:9 · 41:1 · 42:5 · 43:7 · 44:1 · 50:5 · 51:2 · 52:3 · 53:3 · 54:2 · 55:5 · 56:1 · 57:2 · 58:8 · 59:7 · 70:19 · 71:4 · 72:12 · 73:32 · 74:30 · 75:20 · 76:12 · 80:15 · 81:29 · 82:18 · 83:32 · 84:8 · 85:23 · 86:30 · 87:9 · 88:9 · 89:7 · 90:8 · 100:4 · 101:12 · 102:10 · 103:8 · 104:7 · 105:15 · 106:12 · 107:2 · 110:4 · 111:1 = **572**.

REQ-FIN-09, -24, -45, -112 and -113 have no primary row: they are integration or execution requirements that unblock or complete rows owned by other REQ-FINs (listed in their **Maps/unblocks** lines in §5). Secondary mappings (for example REQ-PLAT-26 also depends on REQ-FIN-04; REQ-QUAL-48 also needs REQ-FIN-112) are stated in §5 and do not change the primary owner.

Per work package: FIN-A 40 · FIN-B 10 · FIN-C 92 · FIN-D 38 · FIN-E 129 · FIN-F 188 · FIN-G 70 · FIN-H 5 = 572 (counts from the table above; e.g. FIN-B = REQ-PLAT-02, -04, -05, -06, -07, -08, -10, -17, -39, -51). Stream CI-fragment REQs sit with their stream (REQ-CMP-141 → REQ-FIN-76, REQ-SURF-195 → REQ-FIN-90) because `ci/<stream>.gitlab-ci.yml` is stream-owned (contract §4.13); REQ-MAT-09 sits in REQ-FIN-02 because its whole remaining work is in `material.css`.

Verification note: the REQ-PLAT-67..88 block was verified in one pass by a single verifier (the ledger lists that chunk as not cross-checked by a second skeptic). Treat its partial/broken verdicts as provisional and re-check each clause when the FIN-C agent starts REQ-FIN-37..40.

## Appendix B. Verified-done requirements

| Stream | Total | Done | Done REQ ids | Remaining for "done" |
|---|---|---|---|---|
| PLAT | 106 | 2 | REQ-PLAT-01, REQ-PLAT-37 | green pipeline evidence (REQ-FIN-20..23) |
| MAT | 67 | 1 | REQ-MAT-25 | green pipeline evidence |
| CMP | 142 | 4 | REQ-CMP-25, -26, -58, -87 | green pipeline evidence |
| SURF | 196 | 5 | REQ-SURF-16, -22, -132, -180, -186 | green pipeline evidence |
| QUAL | 73 | 0 | — | — |
| **Total** | **584** | **12** | | |

These 12 meet every code and test clause; they become fully done (§1.1 criterion 3) when their tests run green in an activated job, which REQ-FIN-20..24 provide without further code.

## Appendix C. Contract-v1.2-final additive bundle (needs OD-16)

One PR on `contract/v1.2-final`, additive only, reviewed by every stream owner. Each row lists the fallback if rejected.

| # | Change | Requested by | Fallback |
|---|---|---|---|
| C-1 | Drop `className: 'ag-surface'` from `MaterialAttributes`; engine keys on `[data-ag-surface]` | REQ-FIN-02 | none (required) |
| C-2 | `AG_ATTRIBUTES` += `data-ag-theme`, `data-ag-shadcn-source`, `data-ag-scroll-locked`, `data-ag-hit-clamp`, `data-ag-focus-inset`, `data-ag-lens-defs` (setter MAT); `data-ag-appearance='full-height'` value (CMP→MAT floor) | REQ-MAT-14, -20, -27, REQ-CMP-95 | stop emitting / rename to `data-ag-part` |
| C-3 | `COMPOUND_PARTS` (CC-CMP-01): Header/Body/Footer, `Tooltip.Provider`, `Toast.{Progress,History,HistoryItem}`, `Combobox.{Group,GroupLabel}`; `Menubar = {Root, Menu}`; `Fieldset` stays flat | REQ-CMP-06, -105, -110 | remove the parts |
| C-4 | `jest.config.js` root `moduleNameMapper` for `aura-glass` and entries | REQ-FIN-09 | per-stream Jest configs registered as lanes |
| C-5 | Export condition `css` in generated exports, or explicit rejection | REQ-PLAT-67 | drop `cond.css` |
| C-6 | 5.0 peers: remove `d3-*`, `three`, `@react-three/*` until 5.1 | REQ-PLAT-71, REQ-SURF-165 | keep only with a documented 5.0 use |
| C-7 | `PUBLIC_CSS_VARS`/`TOKEN_OUTPUTS` additions for MAT outputs actually shipped (or none, all private) | REQ-MAT-03, -04 | rename to `--_ag-*` |
| C-8 | `PRODUCER_PATHS` for the 4x bridge outputs (`src/material/`, `src/styles/{v5,preview-v5}.css`, `dist/tokens/4x/`) | REQ-FIN-21 | move outputs under `.artifacts/mat/` |
| C-9 | `contract:ci-fragments` root job passes `--base` / derives base from `AG_LINE` | REQ-PLAT-04 | script-side derivation only |
| C-10 | `.github/CODEOWNERS` on `main` | REQ-PLAT-17 | none |
| C-11 | Optional: `@tanstack/react-virtual` importers += `src/components/combobox/**` (CC-CMP-06) | REQ-CMP-72 / OD-15 | owned windowed list |
| C-12 | Optional: `ai` SDK major bump for approval tool states | REQ-SURF-106 | stay on 5.0.29 and drop approval states from fixtures |
| C-13 | Optional: Backdrop prop `tone` → `mediaTone` (or `tone` removed from `BANNED_PROPS`) | REQ-SURF-11 / OD-17 | rename |
| C-14 | `./date-time` additions / DateTimePicker (5.1), `./media` Waveform (5.1) | REQ-SURF-105, -140 | 5.1 |
| C-15 | Retire `no-inline-glass` from `contracts/lint-rule-owners.json` | REQ-MAT-39 | keep as alias |
| C-16 | `contracts/schemas/sr-record.schema.json` as the single SrRecord schema (MAT verifier and QUAL aggregator both import it) | REQ-FIN-110 | keep `tests/a11y/manual/sr-record.schema.json` and have QUAL import that path |
| C-17 | Root `.gitlab-ci.yml` `AG_LINE` derivation and workflow rules treat `release/4.1.x` and `4x11-*/*` as line `4x`; ownership.json 4x zone rule applies to `4x11-<s>/` | OD-13, REQ-FIN-30 | tag 4.1.1 from `release/4.x` after reverting the 4.2/4.3 work (not recommended) |

The contract version string in `src/contracts/tokens.ts` (still `contract-v1.0`) is corrected to match the document in the same PR.
