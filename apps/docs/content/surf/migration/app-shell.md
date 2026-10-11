# Migrating to the 5.0 app shell

4.x `Layout`, `GlassNavbar`, `GlassSidebar`, and `GlassTopBar` collapse into
one shell: `AppShell` (block `app-frame` for a full-page composition).

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `Layout` | `AppShell` (`aura-glass/app-shell`) |
| `GlassNavbar` | `AppShell.Nav` or `TopNav` (slot) |
| `GlassSidebar` | `AppShell.Rail` / `SideNav` |
| `GlassTopBar` | `TopNav` (slot `top`) |
| `GlassBreadcrumbs` | `Breadcrumbs` (`aura-glass/app-shell`) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `collapsed` | `rail.collapsed` + `onCollapsedChange` | controlled via the §4.9 triple |
| `navItems` | `nav` slot or `<Nav items>` | items keep `{label, href, icon?}` |
| `breadcrumbs` | `<Breadcrumbs items>` | structured `{label, href?}[]` |
| `onMenuToggle` | `onNavOpenChange` | renamed to grammar |

## Compat

`src/compat/surf` carries `Layout`, `GlassNavbar`, `GlassSidebar`,
`GlassTopBar` adapters delegating to `AppShell` with the mapping above; each
warns once and is removed at `6.0`. Set `AG_COMPAT_SHELL=1` to silence.

Codemod: `aura-glass-codemod app-shell` rewrites the imports and renames
the props in the table. Rejected-4.x variants (`GlassMegaMenu`,
`GlassCommandPalette` legacies) are folded into `Command` — see the
command-palette migration note.
