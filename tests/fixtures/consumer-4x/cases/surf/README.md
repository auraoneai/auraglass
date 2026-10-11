# consumer-4x SURF migration cases

Per REQ-SURF-15 and the consumer-4x fixture index: each `cases/surf/<area>/`
holds frozen 4.x usage that the codemod + compat adapters must still compile
against the 5.0 build. Cases are real code written against the published
`aura-glass@4.1.0` types (the canary type-checks them against 4.1.0 before
migrating). Input pages are named `<Family>.page.tsx` (SURF-642): one page per
absorbed family, none for rejected families. Each page starts with
`// @ts-nocheck` so the repo's own `tsc` (which resolves `aura-glass` to 5.0)
skips them; the canary strips that line before type-checking.

| case | exercises | subset |
| --- | --- | --- |
| `ai/` | `GlassChat`, `GlassChatInput`, `GlassMessageList`, `GlassTypingIndicator` from `aura-glass` | report (compat-only) |
| `app-shell/` | root `GlassAppShell` + `GlassSidebar` page (`AppShellRoot.page.tsx`) and `aura-glass/app-shell` page (`AppShellSub.page.tsx`), both with handler-only nav items | flagship; handler-only items → `render={<button type="button" onClick={…} />}` |
| `data/` | GlassDataTable, GlassDataGrid, GlassTimeline/GlassActivityFeed, GlassStatCard/GlassKPICard, GlassSparkline (flagship); GlassVirtualTable (report); GlassDataChart (chart page) | see `canary.json` |
| `date/` | GlassDatePicker without `format`, a file importing `date-fns` directly | flagship |
| `media/` | LiquidGlassMediaControls, GlassCarousel/GlassGallery/GlassImageViewer, AuroraBackground/AtmosphericBackground/DynamicAtmosphere | report |

## L11 migrate-4to5 canary

`canary.json` classifies every page (`flagship` | `chart` | `report`) and
holds the render props. `scripts/surf/migrate-canary.mjs` (GitLab job
`surf:package:migrate-canary`, registered as an L11 subject in
`fragments/lanes/surf.ts`) installs `aura-glass@4.1.0` in a scratch app,
type-checks the pages, runs `migrate 4to5`, then asserts: flagship subset 0
TODOs, each chart page exactly one `removed` TODO, handler-only items become
`render={<button>}` items; swaps in the 5.0 tarball and runs `tsc` and a
`react-dom/server` render smoke over the flagship subset. Evidence:
`.artifacts/surf/migrate-canary/{report.json,todo-report.md,migrate.diff,*.log}`.
`tests/data/migrate-canary.test.ts` checks the manifest on every PR.

Compat adapter inputs (REQ-SURF-13): `<area>/story-args.ts(x)` hold the
frozen 4.x story props (meta args + Default story props, source story path
per entry) that `tests/{app-shell,data,ai,media}/compat.test.tsx` render every
`aura-glass/compat` SURF adapter from; `compat-ids.ts` maps each compat export
to the DEP-S id it must warn with (checked against the generated deprecations
table by `tests/app-shell/compat-registry.test.ts`). `data/story-args.tsx` also
covers the date adapters.

Adding a case:

1. `cases/surf/<area>/<Family>.page.tsx` — the frozen 4.x source page, valid
   against `aura-glass@4.1.0`.
2. A `canary.json` entry (subset, families, and render props for flagship pages).
3. `cases/surf/<area>/notes.md` — props renamed/dropped, flags consulted.
