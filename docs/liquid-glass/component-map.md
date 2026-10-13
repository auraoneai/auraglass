# Liquid Glass Component Map

In 5.0 there is no separate `LiquidGlass*` component family in the public API: the liquid material is the material engine applied through canonical components (the 4.x `Glass*` / `LiquidGlass*` names survive only as deprecated adapters in `aura-glass/compat`). Choose by job:

| Existing (4.x) component | 5.0 path | Action |
| --- | --- | --- |
| `GlassToolbar` / `LiquidGlassToolbar` | `Toolbar` (group with `SurfaceGroup`) | Prefer for grouped floating toolbars. |
| `GlassSidebar` / `LiquidGlassInsetSidebar` | `Sidebar` from `aura-glass/app-shell` | Prefer for inset split views. |
| `GlassTabBar` / `LiquidGlassTabBar` | `TabBar` | Prefer for minimizing tab bars and bottom accessories. |
| `GlassSegmentedControl` / `LiquidGlassSegmentedControl` | `SegmentedControl` | Prefer for shared material selection controls. |
| `GlassBottomSheet`, `GlassDrawer`, `GlassModal` / `LiquidGlassAdaptiveSheet` | `Sheet` / `Dialog` | Use for adaptive source-aware presentations. |
| `GlassPopover` / `LiquidGlassPopoverMenu` | `Popover` / `Menu` | Use for source-anchored menus. |
| `GlassButton` / `LiquidGlassButtonStyle` | `Button` with `variant` | Use the material `variant` axis for prominent liquid buttons. |
| `GlassCommandPalette`, `GlassSpotlightSearch` / `LiquidGlassCommandSurface` | `CommandPalette` | Use for unified command/search surfaces. |
| Media players | `Surface` with `variant="clear"` over media | Use clear variant over media with local dimming. |
