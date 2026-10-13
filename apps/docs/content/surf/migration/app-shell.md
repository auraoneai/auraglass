# Migrating to the 5.0 app shell

4.x `Layout`, `GlassNavbar`, `GlassSidebar`, and `GlassTopBar` collapse into
one shell: `AppShell` (block `app-frame` for a full-page composition).

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `Layout` | `AppShell` (`aura-glass/app-shell`) |
| `GlassNavbar` | `TopBar` (`aura-glass/app-shell`) |
| `GlassSidebar` | `Sidebar` (`aura-glass/app-shell`) |
| `GlassTopBar` | `TopBar` (`aura-glass/app-shell`) |
| `GlassBreadcrumbs` | `Breadcrumbs` (`aura-glass`) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `collapsed` | `defaultSidebar="rail"` on `AppShell.Root` | the shell owns sidebar state (`expanded` / `rail` / `collapsed`); toggle it with `AppShell.SidebarToggle` |
| `navItems` | `Sidebar.Nav` + `Sidebar.Item` children | each item is an `href` + label (optional `icon`, `badge`) |
| `breadcrumbs` | `Breadcrumbs` children | compose the items as children; collapse with `maxItems` |
| `onMenuToggle` | — | no callback prop; the shell store owns the state — use `AppShell.SidebarToggle` |

## Compat

`aura-glass/compat` carries `GlassAppShell`, `GlassSidebar` and
`GlassTopBar` adapters delegating to the 5.0 shell with the mapping above;
each warns once and is removed at `6.0`. Silence the warnings with
`<AuraGlassProvider deprecations="silent">`.

Codemod: `npx aura-glass-cli migrate 4to5 --transform app-shell-slots`.
Legacy command surfaces (`GlassCommandPalette` and friends) map to `Command`
and `CommandPalette` from `aura-glass`.
