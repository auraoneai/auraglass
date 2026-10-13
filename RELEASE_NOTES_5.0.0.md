# aura-glass 5.0.0-alpha.1 release notes

## Breaking

### Dependency floors — handled by the `deps` codemod

- `date-fns` floor updated (run `npx aura-glass-cli migrate 4to5 --transform deps`).
- `chart.js` floor updated (run `npx aura-glass-cli migrate 4to5 --transform deps`).
- `react-chartjs-2` floor updated (run `npx aura-glass-cli migrate 4to5 --transform deps`).
- `zod` floor updated (run `npx aura-glass-cli migrate 4to5 --transform deps`).
- `framer-motion` floor updated (run `npx aura-glass-cli migrate 4to5 --transform deps`).
- `tailwind-merge` floor updated (run `npx aura-glass-cli migrate 4to5 --transform deps`).

- **B1: React ^19.0 floor** — React 18 apps
- **B2: ESM-only, Node >=20.19** — CJS/Jest-CJS consumers
- **B3: Removed components (119 root exports)** — users of those exports
- **B4: Removed subpaths** — subpath users
- **B5: Names: prefix dropped, aliases removed** — everyone
- **B6: Prop grammar** — most call sites
- **B7: Dependency diet** — undeclared transitive users
- **B8: Global CSS removed; layered CSS** — apps relying on heading or utility globals
- **B9: --glass-* renamed to --ag-*** — consumer CSS
- **B10: Base UI DOM, ARIA and data-* changes** — consumer CSS and tests targeting internals
- **B11: New default material (every surface changes pixels)** — everyone visually
- **B12: Content layer is no longer glass by default** — apps expecting glass cards
- **B13: OS signals are floors; reduced motion cannot be overridden** — apps forcing glass or animation
- **B14: Server, services and simulated AI removed** — services/* users
- **B15: CLI moved to aura-glass-cli** — CLI users
- **B16: ssr/server shims removed** — SSR wrapper users
- **B17: Asset subpath renames (icons/env/json/manifest namespaces)** — asset subpath importers
- **B18: Primitives collapse (4.x primitive set folds into the 5.0 primitives entry)** — primitive importers
- **B19: Icons, env vars, .json/.css manifest subpaths removed** — icon/manifest consumers
- **B20: Dead optical props removed** — call sites passing dead optical props
- **B21: Provider trees collapse to the 5.0 provider** — apps composing 4.x providers

## Deprecated

All 4.x deprecations and the new 5.x deprecation entries are listed in the
generated guide (`apps/docs/generated/migration/deprecations.md` in a release
build). Runtime warnings name the codemod that performs the change.

## Added

- `aura-glass/compat` adapters for every deprecated component export.
- `aura-glass/migrate` CLI (4to5 transforms; see the removal train).
- cmp(lane 3b-A): Actions — Button (BU Button/Toggle switch, material+intent+size grammar, loading spinner, prominent dev-guard, pointerLight attr), IconButton (label+icon, capsule/fixed), Toolbar compound (BU Toolbar + SurfaceGroup root), ButtonGroup (server-safe role=group), ToggleGroup (BU ToggleGroup+Toggle, single/multi), SegmentedControl (BU RadioGroup+Radio, indicator part, >5-segments dev hint). Metas with §10.2 migration rows, parts-exact stories, controls families harness + story-contract pilot. (.changeset/cmp-a-actions.md)
- CMP lane 3a (Foundation): foundation seam (defineMeta/parts/state/portal helpers), six primitives rewritten to 5.0 semantics (ref-as-prop, no forwardRef), Base UI pin gate, icons redesign (createIcon factory, PURE-annotated glyph modules, a11y contract), T2 leaf components (EmptyState/ErrorState/LoadingState, Steps, AvatarGroup, Chip), cmp lint rules (no-forward-ref, require-data-ag-part), foundation-pattern + selector-coverage verify scripts, ci fragment jobs, literals/size/perf/css fragments, type tests (meta-shape, change-details, no-legacy-onchange, prop-grammar). (.changeset/cmp-f-foundation.md)
- cmp: Form (BU Form + Field errors/focus) + KeyValueEditor (./data entry) — CMP-048/049 (.changeset/cmp-form-kv-editor.md)
- cmp lane 3h: 4.x compat adapters + deprecation/codemod fragments + registry items (.changeset/cmp-h-compat.md)
- CMP lane 3c (Inputs): Field + Fieldset, Checkbox + CheckboxGroup, RadioGroup (+Radio), Switch, TextField, SearchField, Slider, NumberField on Base UI 1.8.0 — control-shared seam (size/value/messages/meta/controls.css), keys files (Switch enter=tab-toggles, NumberField repeat timings), parse.ts Intl helpers, families registry + parametrised harnesses (contract/hooks/side-effects/ssr/api-report/meta/css), IME + de-DE format tests, stories incl. ControlsDenseForm, root exports, §16 size-budget rows, lint/_strict controls glob, controls CI lanes. (.changeset/cmp-i-inputs.md)
- cmp lane 3e (modal overlays): overlay seam (`overlays/_shared`) — portal-to-layer (.changeset/cmp-o1-modal.md)
- cmp: lane 3f anchored overlays — Popover, Tooltip (+Provider), Menu/ContextMenu/Menubar, Toast/useToast on Base UI 1.8.0 through the overlays/_shared seam; overlay subjects mounted in shared harnesses; stories + metas + css fragments. (.changeset/cmp-o2-anchored.md)
- CMP lane 3d (Pickers): Select + Combobox on BU 1.8.0 (.changeset/cmp-p-pickers.md)
- cmp lane 3i (Q browser specs): 34 APG/e2e/visual/perf spec files + 12 manual screen-reader scripts registered under tests/{a11y/apg,e2e,visual,perf/browser,a11y/manual}/cmp/** — remote-lane authored, contract-v1.1. (.changeset/cmp-q-browser-specs.md)
- CMP lane 3g (T0/T2 components): Text, Heading, Stack, Grid, Container, Card, Badge, Avatar, Alert, Progress (+ProgressRing), Meter, Skeleton, Separator, Kbd, Accordion, Collapsible, Link, ScrollArea, Rating, InlineEdit, FileUpload, ColorPicker, DescriptionList, ImageList, Tour + Icon root export. Server-safe T0 set first, BU 1.8.0-backed composites, metas + css + stories + tests; SSR (t0-server-safe), APG spec registrations, contract-coverage registered set now 47. (.changeset/cmp-t-core.md)
- MAT API reports (MAT-343/345, REQ-MAT-22): scripts/mat/api-report.mjs wraps the frozen `api:update --entry` CLI for material/theme/tokens/motion (appending the ENTRIES diff section), composes etc/api/root.mat.api.md and etc/api/compat.mat.api.md, and writes etc/api/material.css-api.json (public vars + S-01 attributes + a11yOverridable + required rung values). (.changeset/mat-api-reports.md)
- MAT lane 2e-B CI fragment jobs (MAT-329/344/358/362): interim tokens gate, optics/recipe/css-api checks, beta-gate strict optics suite, and the consumer-4x + codemod-fixture job, with the `scripts/mat/` lane helpers they invoke. (.changeset/mat-ci-fragment.md)
- MAT codemod-mapping fragment authored on `next` (MAT-360/361/365): stream renames/props/removed tables plus lane 2e-B areaTransforms specs (reduced-motion-initial, motion-imports, motion-props) and the 18 fixture cases under `fragments/codemods/mat/fixtures/`. (.changeset/mat-codemods-fragment.md)
- MAT 4.x compat adapters (MAT-354/355/356, REQ-MAT-24): `OptimizedGlass`, `GlassCore`, `OptimizedGlassAdvanced`, `LiquidGlassMaterial`, `LiquidGlassEffectGroup`, `LiquidGlassLayerProvider`, `LiquidGlassScrollEdge`, `LiquidGlassConcentricFrame` map onto `Surface`/`SurfaceGroup`/`ScrollEdge`/`ConcentricFrame` via `materialProps`, dropping the deleted optical props with one `warnDeprecated` each. Also fills `src/compat/mat/index.ts`, `src/root/mat.ts` (frozen ROOT_EXPORTS.mat), and `tests/material/exports` (MAT-347). (.changeset/mat-compat-adapters.md)
- Compat token alias map + frozen consumer-4x cases (REQ-MAT-21, H03/D-18, D03): tokens/compat-alias-map.json maps all 807 --glass-* names read in the 4.x snapshot/fixture — 15 -> --ag-* successors (documented + value-equal), 618 frozen at rendered values (light + dark-theme overrides), 174 with no rendered value flagged for review; dist/compat/tokens.css emits at 8.0 KB gz. tests/fixtures/consumer-4x/cases/mat adds 6 frozen 4.x usage cases (glass-card, liquid-material, effect-group, scroll-edge, css-vars, provider-motion). (.changeset/mat-compat-tokens.md)
- MAT lane 2e-B day-0 registrations (MAT-330/331/332/342/346/348/350/359/363/366/367/369/370/371/372/374): lanes, playwright, css, size-budgets, perf-budgets and review fragments for MAT, plus the L1/L4/L12/L11/GA-cert lane scripts under `scripts/mat/`. (.changeset/mat-fragments.md)
- feat(material): Material Lab stories + browser spec suite + perf spec (MAT-155..175) (.changeset/mat-lab-stories.md)
- Freeze 4.x rendered material values (MAT-328): `scripts/tokens/freeze-4x.mjs` extracts the shared gradient/fill/border literals, the backdrop-filter blur ternary, `buildSurfaceStyles()` output for every {intent, elevation, tier}, and all 250 `--glass-*` primitives into `tokens/legacy/4x-rendered.tokens.json` (DTCG, `ag.tier: "legacy"`). (.changeset/mat-legacy-freeze.md)
- MAT stream (lane 2b-M): material engine foundations — MaterialSpec types, defineMaterial validator, no-optics-outside-material lint rule (ratchet warn), optics CSS scanner + glass-recipes metric + recipe-removal and material-runtime gates, material.css-api.json generator. (.changeset/mat-material-engine-gates.md)
- feat(material): material engine + surface components + tier hook + lens defs (MAT-105..149,153,182..184) (.changeset/mat-material-engine.md)
- MAT lane P (2d): preferences engine/store/provider/portal/LayerStack/announcer/prepaint, a11y rungs/focus/targets/scroll-padding CSS + PostCSS gate + baseline, lint rules, HitArea + useStickyScrollPadding, GlassPreferencesPanel (T2) + stories + meta, theme test suites (color/presets/createGlassTheme/createBrandTheme + matrix contract), e2e a11y specs + browser helpers, APG coverage + SR record schema + claims-sources + removals/cert gates. (.changeset/mat-p-prefs-a11y.md)
- MAT Storybook pages (MAT-333..337/368): Tokens.mdx generated from dist/tokens/manifest.json, ModesMatrix (variant x thickness x schemes, SC-28 scene pending semantics), InteractionStates (data-* hooks, disabled-opacity assertion), Presets (createBrandGlassTheme OKLCH playground with contrast pairs/adjusted), ContrastFloors (opacity-floors.json table), and motion/{Tokens,Interactions,ViewTransitions,Physics} Motion Lab pages. Cross-lane inputs report pending, never block. (.changeset/mat-stories.md)
- MAT lane T (tokens + compiler): DTCG schema + hand-rolled validator, token sources (ref/sys/material/preset/mode/contrast), compiler with spring linear(), material ladders/floors, 2160-cell contrast solver, emitters (tokens.css, tokens.ts, material-spec.ts, manifest, tailwind.css bridge, registry-cssvars, compat aliases), gates (undefined-vars, dead-vars, tier-skip, literals, types-runtime) with legacy-gate superset proof, theme functions + 4.x deprecation wrappers, docs/motion.md generator, remote visual/canary specs (MAT-001..094). (.changeset/mat-t-tokens.md)
- MAT lane V (motion): `aura-glass/motion` adapter — toMotionTransition (spring stiffness/damping per REQ-MAT-08, duration ms→s + ease, exit→durationExit+accelerate), MotionProvider (MotionConfig reducedMotion mapping + MotionCapabilityContext), useDragDetents (detent projection v*0.2, rubber-band 0.55, dismiss 25%/800px/s), useMomentum (inertia tc=325, bounds clamp, ≤1s settle, pointerdown stops), magnetic (strength≤0.3, ≤8px offset, fine-pointer+full only, zero state), SharedLayout/Shared (LayoutGroup + layoutId + data-ag-animating/optics lifecycle). Springs analytic response + linear() equivalence tests (MAT-188/189/190/223) + type contract (MAT-235). api-report etc/api/motion.* (7 exports). (.changeset/mat-v-motion-adapter.md)
- MAT lane V (motion): src/motion/css motion.css (four @property scalars, hover/press light-response, popup materialize per §4.6, transition allow-list), motion-modes.css (calm + reduced-motion mirror, none, forced-colors, highlights), loading.css (single ag-sweep keyframe under [data-ag-continuous=on], offscreen pause), view-transition.css (§4.7 optics drop + ag-morph-calm); fragments/css/mat.ts registration; PostCSS T03/T04 parse tests (MAT-191..202, MAT-210). (.changeset/mat-v-motion-css.md)
- MAT-186,216,225..234,236: lane V motion lint battery — plugin rules under (.changeset/mat-v-motion-lint.md)
- MAT-187,224,237..246: lane V remote-only motion specs — helpers (frames/ (.changeset/mat-v-motion-specs.md)
- MAT lane V (motion): src/motion runtime — ticker.ts (shared rAF, dt≤50ms, hidden-pause, shared IntersectionObserver sole owner of data-ag-offscreen, observeOffscreen), tween/onMotionChange/announceFinal, pointerLight.ts (ref-counted per-document install, ≤1 setProperty/frame, rect cache, pointerLightActive gate), viewTransition.ts (startMorph with object+callback VT forms, FLIP fallback, data-ag-vt/-settled lifecycle, useMorphName, reactViewTransition), capability.ts (MotionCapabilityContext). Unit suites MAT-204/207/213 (MAT-203..215). (.changeset/mat-v-runtime.md)
- plat(lane 1d): 5.0 build system — tsdown unbundle config with the @ag-contract-seed pre-release entry filter, post.mjs pipeline (d.ts emit + alias rewrite, CSS assembly with verbatim @layer order, generated exports, ownership + server-safe records, verify-artifact gate), package.json fields (engines >=20.19, sideEffects **/*.css, files list, postbuild/prepublishOnly/artifact:*), deletion of the rollup/eslintrc/bundlesize build chain, fragments/css/plat.ts (ag.reset + globals), and tests/build + tests/exports + tests/css coverage. (.changeset/plat-1d-build.md)
- plat(1d): consumer canaries — next16/next15 (Turbopack+webpack), vite, vite-tailwind4, vite-compiler, types-strict, jest-cjs; real integration runners; release-commit protocol. (.changeset/plat-1d-canaries.md)
- C0 contract bootstrap: contract files, owner seeds, fragments, CI bootstrap and the legacy quarantine (§2.2, contract-v1.1). (.changeset/plat-c0-bootstrap.md)
- PLAT 1a-CI: GitLab CI/CD fragment (§4.2 job set), pages job, npm OIDC trusted (.changeset/plat-ci-bootstrap.md)
- `aura-glass-cli` package + `migrate 4to5` codemod engine (PLAT-299..349): 14-transform frozen-order runner (imports-subpaths, providers, canonical-names, prop-grammar, ai-chat, app-shell-slots, media-backdrops, reduced-motion-initial, motion-imports, motion-props, dead-optical-props, css-vars, deps, removed) driven by compiled `fragments/codemods/*.ts` mappings; fs-safety/git-guard/atomic-write core; `init`, `list`/`info`, `add`, `diff`, `update`, `doctor`/`doctor --v5`, `audit deps|imports|backdrop`, legacy `migrate icons` parity; type-DX + canary/perf specs; 4.x `scripts/{migrate,codemods}` and `verify-{cli,recipes-cli}` removed. (.changeset/plat-cli-codemods.md)
- CP-PLAT-1: workspace dependency set for `packages/cli` (`jscodeshift`, `postcss`, `postcss-value-parser`, `zod`, `picocolors`, `prompts` — exact pins, equal to `packages/cli/dependency-allowlist.json`), plus the `aura-glass-mcp` (`@modelcontextprotocol/sdk@1.32.1`) and `apps/docs` (`next@16.4.0`, `react@19.3.0`) manifests the contract reserves for the program. Lockfile regenerated. (.changeset/plat-cli-workspace-deps.md)
- feat: PLAT registry blocks (auth, settings) and items (kanban, gantt, transfer-list, code-surface, rich-text, diff-viewer, react-hook-form adapter) with deterministic fixtures, showcase stories and layout assertions. (.changeset/plat-dx-blocks.md)
- feat: claims pipeline — gen-claims resolves 14 ids from release artifacts (pending-safe, sha custody, G-14), render-claims fills ag:claim regions, lint-claims bans unsourced numbers in PLAT prose, README.tmpl.md + gen-readme. (.changeset/plat-dx-claims.md)
- feat: docs site scaffold (Next 16 static export), nav order, Example/Claim/PropsTable/PartsTable, plat content, gen-props/selectors/component-docs, compile-snippets with baseline, case-sensitive link checker, lighthouse budgets. (.changeset/plat-dx-docs.md)
- feat: llms.txt + aura-glass-mcp — gen-llms emits llms.txt (12KB cap, tarball-shipped) + llms-full.txt index; stdio MCP server with exactly 5 read-only tools on data/mcp-data.json (zod-validated, permission-model ready); gen-mcp-data bundles registry index + props + docs (5MB cap). (.changeset/plat-dx-llms-mcp.md)
- feat: migration docs — migrate/{5,from-mui,from-radix,from-lucide}.mdx (B1–B21 anchors, dep rows pending 1c), migration-guide test, gen-migration-stories emitting .storybook/blocks-only stories. (.changeset/plat-dx-migration.md)
- feat: quickstart docs + replay spec — next.md and vite.md (6 commands, 0 manual edits, {step} blocks), alpha-smoke fixture, quickstart.spec with timing capture to .artifacts/dx/quickstart-timing.json. (.changeset/plat-dx-quickstart.md)
- PLAT-350..357: registry pipeline — `scripts/docs/paths.mjs` constants (DOCS_BASE_URL=$CI_PAGES_URL until OD-12), `scripts/registry/build.mjs` (shadcn-schema validation + meta.auraglass, certified-SHA publish gate, deterministic outputs incl. `apps/docs/public/r/v/<version>/`), generated `registry:base` item from the token manifest, `scripts/registry/lint.mjs` REQ-PLAT-95 rules, `aura-glass-registry` data package, schema/build/lint tests and the remote shadcn-interop spec. (.changeset/plat-dx-registry.md)
- feat: registry render-gate subject — pixel-gates library, L11 render spec, recipe fates table (16 block / 1 kanban item / 11 delete); removes verify-recipes-render.js successor. (.changeset/plat-dx-render-gate.md)
- SURF day-0 platform glue: capability ledger + gate, labs package shell with (.changeset/surf-day0.md)

## Fixed

_Populated by the fix ledger at RC._

## Visual bug fixes

_Entries come from `docs/release/visual-fixes/*.json` records (change class C-I-VF)._

## Security

_Sourced from the security claims file; see SECURITY.md for the support policy._
