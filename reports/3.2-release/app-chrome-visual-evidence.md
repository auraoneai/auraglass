# 3.2 App-Chrome Visual Evidence

Generated at: 2026-05-14T06:56:12.058Z

Command:

```bash
node scripts/ci/verify-app-chrome-visuals.js
```

Result: pass. The script packed `aura-glass@3.2.0`, installed the tarball into a temporary Vite app, rendered the app-chrome surfaces from public package entrypoints, loaded each target in Chromium, and captured visual baselines.

| Target | Viewport | Reduced motion | Screenshot |
| --- | --- | --- | --- |
| `icon-gallery` | 1280x920 | `no-preference` | [icon-gallery.png](./app-chrome-visuals/icon-gallery.png) |
| `dropdown-menu` | 1280x920 | `no-preference` | [dropdown-menu.png](./app-chrome-visuals/dropdown-menu.png) |
| `select` | 1280x920 | `no-preference` | [select.png](./app-chrome-visuals/select.png) |
| `dialog` | 1280x920 | `no-preference` | [dialog.png](./app-chrome-visuals/dialog.png) |
| `drawer` | 1280x920 | `no-preference` | [drawer.png](./app-chrome-visuals/drawer.png) |
| `popover` | 1280x920 | `no-preference` | [popover.png](./app-chrome-visuals/popover.png) |
| `tooltip` | 1280x920 | `no-preference` | [tooltip.png](./app-chrome-visuals/tooltip.png) |
| `tabs` | 1280x920 | `no-preference` | [tabs.png](./app-chrome-visuals/tabs.png) |
| `command-palette` | 1280x920 | `no-preference` | [command-palette.png](./app-chrome-visuals/command-palette.png) |
| `mobile-shell` | 390x844 | `no-preference` | [mobile-shell.png](./app-chrome-visuals/mobile-shell.png) |
| `reduced-motion` | 1280x920 | `reduce` | [reduced-motion.png](./app-chrome-visuals/reduced-motion.png) |

## Keyboard QA

The same packed-package fixture also runs browser keyboard and interaction checks:

| Check | Status |
| --- | --- |
| dropdown opens from keyboard and closes on escape | Pass |
| select opens from keyboard and closes on escape | Pass |
| tabs support arrow-key activation | Pass |
| dialog opens from button and closes on escape | Pass |
| drawer opens from button and closes on escape | Pass |
| tooltip appears on pointer hover | Pass |
| command palette search input filters commands | Pass |
