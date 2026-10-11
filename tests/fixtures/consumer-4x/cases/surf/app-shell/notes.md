# app-shell case notes (SURF-526)

Two frozen 4.x pages, both using the era's handler-only navigation pattern:

- `AppShellRoot.page.tsx` — `GlassAppShell` + `GlassSidebar` +
  `GlassHeader` from the root entry (`aura-glass`). Nav items carry
  `onClick` only (GlassSidebar's item type `{ id, label, href?, icon?,
  badge?, children?, disabled?, onClick? }` — no `href` set anywhere), the
  4.x SPA pattern the `app-shell-slots` codemod rewrites. The root
  `NavigationItem` type of `aura-glass@4.1.0` has no `onClick`, so the page
  types its items from `ComponentProps<typeof GlassSidebar>['items']`.
  4 handler-only items: home, projects, team and the nested billing item.
- `AppShellSub.page.tsx` — same composition from the `aura-glass/app-shell`
  subpath (`GlassAppShell`, `GlassTopBar`, `GlassSidebarRail`, `GlassMain`,
  `GlassPageHeader`, `GlassBreadcrumbs`). Rail items use `onSelect` —
  `GlassSidebarRailItem { id, label, icon?, active?, disabled?, onSelect? }`
  has no href field at all. 2 handler-only items.

Codemod expectations (asserted by the L11 migrate-4to5 canary,
`scripts/surf/migrate-canary.mjs`, from `../canary.json`):

- Both specifiers map onto the same 5.0 shell (`imports-subpaths` +
  `app-shell-slots` area transform): `GlassAppShell`'s `header`/`sidebar`/
  `footer` props become slot children; `GlassSidebar`/`GlassSidebarRail`
  item arrays become `Sidebar.Item`/`Rail.Item` children, and every
  handler-only item becomes `render={<button type="button" onClick={h} />}`
  (REQ-SURF-14/15).
- Success criterion: both pages are in the flagship subset — 0 TODOs, `tsc`
  exit 0 and a clean render on the 5.0 tarball.
- `expected.tsx` is deliberately absent: the canary asserts the properties
  above on the engine's real output instead of a hand-written golden.
