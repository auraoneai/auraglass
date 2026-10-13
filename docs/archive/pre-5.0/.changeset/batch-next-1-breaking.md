---
"aura-glass": major
---

Breaking (C-B) changes carried by the 5.0 integration batch:

- `aura-glass/app-shell` is trimmed to the seven contract names (REQ-SURF-01). `AppShellController`, `AppShellInspectorToggle`, `AppShellSidebarToggle`, `SidebarDrawer`, `parseAppShellCookie` and `serializeAppShellCookie` are no longer exported; use `AppShell.*`, `Sidebar.Drawer` and `AppShell.parseCookie`.
- The `aura-glass/charts` subpath is removed from `exports` for 5.0 (ships in 5.1, REQ-FIN-06).
- The root cmp barrel equals `ROOT_EXPORTS.cmp` (REQ-CMP-23): `ProgressRing`/`ProgressRingProps`, `SheetHandle`, `useSheetDetents` and `resolveDetent` are no longer root exports. Use `<Progress appearance="ring">` and `Sheet.Handle`.
- Frozen contract surfaces (`contracts/`, `src/contracts/`, `build/exports.manifest.json`) are updated.
