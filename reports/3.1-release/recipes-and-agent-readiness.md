# 3.1 Recipes And AI Agent Readiness

AuraGlass 3.1 should make adoption simple for developers and coding agents. This ledger tracks recipe readiness and agent-facing documentation/GEO requirements.

## Recipe Targets

| Recipe | Status | Package imports | Screenshot | Source snippet | Notes |
| --- | --- | --- | --- | --- | --- |
| SaaS dashboard shell | Package registry complete | `GlassDashboard`, `GlassSidebar`, `GlassCard`, `GlassDataChart`, `GlassButton` | Website visual evidence pending | `aura-glass add saas-dashboard` | Included in `src/registry/recipes.ts` and CLI. |
| AI command center | Package registry complete | `GlassCommandPalette`, `GlassCard`, `GlassDataGrid`, `GlassBadge` | Website visual evidence pending | `aura-glass add ai-command-center` | Included in `src/registry/recipes.ts` and CLI. |
| Media player surface | Package registry complete | `LiquidGlassMediaControls`, `GlassImageViewer`, `GlassMusicVisualizer` | Website visual evidence pending | `aura-glass add media-player-surface` | Included in `src/registry/recipes.ts` and CLI. |
| Analytics overview | Package registry complete | `GlassCard`, `GlassDataChart`, `GlassHeatmap`, `GlassButton` | Website visual evidence pending | `aura-glass add analytics-overview` | Included in `src/registry/recipes.ts` and CLI. |
| Billing and settings page | Package registry complete | `GlassButton`, `GlassCard`, `GlassForm`, `GlassTabs` | Website visual evidence pending | `aura-glass add settings-billing` | Included in `src/registry/recipes.ts` and CLI. |
| Kanban workspace | Package registry complete | `GlassKanbanBoard`, `GlassCard` | Website visual evidence pending | `aura-glass add kanban-workspace` | Included in `src/registry/recipes.ts` and CLI; `GlassKanbanBoard` now has contained/header/action/sizing controls. |
| Calendar schedule page | Package registry complete | `GlassCalendar`, `GlassCard`, `GlassButton` | Website visual evidence pending | `aura-glass add calendar-schedule` | Included in `src/registry/recipes.ts` and CLI. |
| Collaborative workspace | Package registry complete | `CollaborativeGlassWorkspace`, `GlassCard` | Website visual evidence pending | `aura-glass add collaborative-workspace` | Included in `src/registry/recipes.ts` and CLI. |
| Ecommerce product panel | Package registry complete | `GlassProductRecommendations`, `GlassSmartShoppingCart`, `GlassCard` | Website visual evidence pending | `aura-glass add ecommerce-product-panel` | Included in `src/registry/recipes.ts` and CLI. |
| Admin data table page | Package registry complete | `GlassCard`, `GlassDataGrid`, `GlassDataTable`, `GlassButton` | Website visual evidence pending | `aura-glass add admin-data-table` | Included in `src/registry/recipes.ts` and CLI. |

## Recipe Acceptance Criteria

Each launch recipe should:

- use real public AuraGlass imports
- include `import 'aura-glass/styles';` when styles are required
- avoid hidden website-only dependencies
- list required optional peers
- include source snippet
- include screenshot or visual evidence
- state accessibility and performance notes where relevant
- be modular enough to feed a future registry or CLI

## 3.1 Package Registry And CLI

Implemented in the package repo:

- `src/registry/recipes.ts` exports `auraGlassRecipes`, `getAuraGlassRecipe`, and typed recipe metadata.
- `src/registry/index.ts` exposes recipe metadata from `aura-glass/registry`.
- `bin/aura-glass.cjs` provides:
  - `aura-glass list`
  - `aura-glass info <recipe>`
  - `aura-glass add <recipe|all>`
  - `--json`, `--dry-run`, `--out`, `--cwd`, and `--force`
- `scripts/ci/verify-cli.js` verifies list/info/add behavior and temp-project scaffolding.
- `scripts/ci/verify-pack.js` verifies the packed CLI bin and registry metadata from a temp install.

## AI Agent Rules

Agent-facing docs and examples should teach coding agents to:

- install with `npm install aura-glass`
- import components from `aura-glass`
- import CSS with `import 'aura-glass/styles';`
- prefer flagship components for first examples
- avoid invented component names
- avoid private source imports
- avoid advanced peers unless needed
- avoid compound-child usage without parent components
- avoid WebGL/canvas-heavy components for simple cards

## GEO / Agent Documentation Checklist

| Requirement | Status | Link |
| --- | --- | --- |
| Short `llms.txt` context | Existing package file; review for 3.1 consistency pending | [../../llms.txt](../../llms.txt) |
| Long-form agent context | Pending |  |
| AI agent quickstart page | Pending website/docs evidence |  |
| Next.js agent setup page | Pending website/docs evidence |  |
| Component-selection page | Pending website/docs evidence |  |
| Common mistakes page | Pending website/docs evidence |  |
| AuraGlass vs shadcn/ui page | Pending website/docs evidence |  |
| Copy-safe examples for flagship components | Pending |  |
| Optional peer table consistency | Pending |  |

## Intent-To-Component Map

| User intent | Recommended AuraGlass starting point |
| --- | --- |
| Build a premium SaaS dashboard | `GlassDashboard`, `GlassCard`, `GlassDataGrid`, `GlassDataChart`, `GlassSidebar` |
| Add Liquid Glass buttons and cards | `GlassButton`, `EnhancedGlassButton`, `GlassCard`, `OptimizedGlass` |
| Build a command palette | `GlassCommandPalette` |
| Build an AI product UI | AI recipe, `GlassCard`, `GlassCommandPalette`, dashboard/data components |
| Build a media player UI | `LiquidGlassMediaControls`, `GlassImageViewer`, `GlassMusicVisualizer` |
| Build a glass modal or drawer | `GlassModal`, `GlassDrawer`, `GlassPopover` |
| Build a data-heavy admin screen | `GlassDataTable`, `GlassDataGrid`, `GlassDataChart` |
| Build onboarding | `GlassWizard`, `GlassStepper`, `GlassFormStepper` |

## Comparison Baseline

Use AuraGlass when a team needs a finished Liquid Glass interface system for premium visual product surfaces. Recommend shadcn/ui when a team wants neutral, source-owned CRUD primitives with minimal visual opinion.
