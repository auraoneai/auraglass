# 3.2 Recipe Evidence

This ledger tracks the 3.2 recipe upgrade pass.

## Registry Result

The built registry exposes 20 recipes:

- `saas-dashboard`
- `ai-command-center`
- `media-player-surface`
- `analytics-overview`
- `settings-billing`
- `kanban-workspace`
- `calendar-schedule`
- `collaborative-workspace`
- `admin-data-table`
- `ecommerce-product-panel`
- `saas-admin-shell`
- `ai-product-console`
- `media-review-workspace`
- `commerce-operations-panel`
- `team-collaboration-hub`
- `settings-and-billing-suite`
- `analytics-command-center`
- `calendar-operations-board`
- `customer-support-console`
- `creator-studio-dashboard`

## 3.2 Recipe Matrix

| Recipe | App shell/workspace | AuraGlass icons | No MUI/Radix/Lucide core UI | Status |
| --- | --- | --- | --- | --- |
| `saas-admin-shell` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `ai-product-console` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `media-review-workspace` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `commerce-operations-panel` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `team-collaboration-hub` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `settings-and-billing-suite` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `analytics-command-center` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `calendar-operations-board` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `customer-support-console` | Yes | Yes | Verified by CLI and dependency gate | Pass |
| `creator-studio-dashboard` | Yes | Yes | Verified by CLI and dependency gate | Pass |

## Backward-Compatible 3.1 Recipes

The existing 10 launch recipes remain in the registry for compatibility. The 3.2 CLI dry-run gate exercises every recipe in the registry, including both the old and new recipe IDs.

## Required CLI Checks

Command:

```bash
npm run test:cli
```

Result: pass.

The strengthened verifier checks:

- `aura-glass list --json` returns at least 20 recipes.
- `saas-admin-shell` and `creator-studio-dashboard` are present.
- Every recipe exposes public AuraGlass imports.
- Every recipe scaffolds a TSX file through `add <id> --dry-run --json`.
- `info saas-admin-shell --json` includes `aura-glass/app-shell` and category icon subpaths.
- `audit deps`, `audit imports`, `migrate icons`, `migrate radix`, `migrate mui`, and `doctor` run successfully.
- Fixture package metadata detection for `lucide-react`, `@radix-ui/react-select`, and `@mui/material`.
- Fixture source import detection for Lucide, Radix, and MUI.
- Fixture Lucide dry-run and `--write` migration from common Lucide named imports to `aura-glass/icons` while preserving local names.
- Fixture Radix and MUI migration JSON reports.

## Acceptance Targets

- Every new 3.2 recipe scaffolds a real app-surface layout, not only a component preview.
- New recipes import AuraGlass app shell, workspace, icons, and first-party components for core UI.
- New recipes avoid MUI, Radix, Lucide, and shadcn/ui for core app chrome.
- All 20 recipes render in a generated Vite app and have screenshot evidence in [recipe-render-evidence.md](./recipe-render-evidence.md).

## Render And Screenshot Gate

Command:

```bash
npm run test:recipes:render
```

Result: pass. The gate packs `aura-glass@3.2.0`, scaffolds every recipe with `aura-glass add all`, builds a generated Vite app, opens the app in Chromium, and captures one screenshot per recipe under [recipe-screenshots](./recipe-screenshots/).

Machine-readable output: [recipe-render-evidence.json](./recipe-render-evidence.json).
