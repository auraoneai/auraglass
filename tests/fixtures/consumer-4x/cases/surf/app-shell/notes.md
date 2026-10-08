# app-shell case notes (SURF-526)

Two frozen 4.x pages, both using the era's handler-only navigation pattern:

- `AppShellRoot.page.tsx` — `GlassAppShell` + `GlassSidebar` +
  `GlassHeader` from the root entry (`aura-glass`). Nav items carry
  `onClick` only (`NavigationItem { id, label, icon?, href?, onClick?,
  children?, disabled?, badge? }` — no `href` set anywhere), the 4.x SPA
  pattern the `app-shell-slots` codemod rewrites to route-aware items.
- `AppShellSub.page.tsx` — same composition from the `aura-glass/app-shell`
  subpath (`GlassAppShell`, `GlassTopBar`, `GlassSidebarRail`, `GlassMain`,
  `GlassPageHeader`, `GlassBreadcrumbs`). Rail items use `onSelect` —
  `GlassSidebarRailItem { id, label, icon?, active?, disabled?, onSelect? }`
  has no href field at all.

Codemod expectations (asserted by PLAT's `migrate 4to5` harness, L11):

- Both specifiers map onto the same 5.0 shell (`imports-subpaths` +
  `app-shell-slots` area transform): `GlassAppShell`'s `header`/`sidebar`/
  `footer` props become slot children; `GlassSidebar`/`GlassSidebarRail`
  item arrays become `Sidebar.Item`/`Rail.Item` children, `onClick`/`onSelect`
  preserved as handlers (handler-only items stay actions; the codemod adds
  `href` only where the page's own router wiring makes it provable).
- Success criterion per SURF-526: pages compile and render with **0 TODOs**.
- `expected.tsx` is deliberately absent: the 5.0 slot API (`AppShell.Root`,
  `Sidebar.Item`, `TabBar.Item`, `parseAppShellCookie`) is W1's contract
  work — this case adds the golden when W1's codemod lands rather than
  guessing the API.
