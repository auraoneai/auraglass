# AuraGlass Workflows

AuraGlass 3.3 workflow components should let teams build real admin, settings, billing, AI, media, ecommerce, support, marketing, and collaboration surfaces without falling back to MUI for high-frequency product UI. New projects should prefer the focused `aura-glass/workflows`, `aura-glass/forms`, `aura-glass/data`, `aura-glass/navigation`, `aura-glass/overlays`, and `aura-glass/marketing` subpaths when they only need a specific surface family.

## Target Surfaces

| Workflow | AuraGlass components |
| --- | --- |
| settings and billing | `GlassForm`, `GlassInput`, `GlassSelect`, `GlassTabs`, `GlassCard` |
| admin tables | `GlassDataTable`, `GlassDataGrid`, `GlassPagination`, `GlassFilterPanel` |
| AI command centers | `GlassCommandPalette`, `GlassAdvancedSearch`, `GlassBadge`, `GlassToast` |
| ecommerce panels | `GlassProductRecommendations`, `GlassSmartShoppingCart`, `GlassForm` |
| collaboration hubs | `CollaborativeGlassWorkspace`, `GlassUserPresence`, `GlassChat` |

## Required States

Every production workflow should document and test:

- empty state
- loading state
- error state
- disabled state
- keyboard navigation
- mobile layout
- reduced-motion behavior

## Recipe Link

The 3.3 recipe pass expands the package registry to 28 production starters that use app shell, icons, primitives, and workflow states where natural. Hosted collaboration recipes must stay presence/cursor/selection-only unless a future release adds a real OT/CRDT editing engine.

Final 3.3 evidence belongs in:

- `reports/3.3-release/recipe-evidence.md`
- `reports/3.3-release/recipe-render-evidence.md`
- `reports/3.3-release/README.md`

## Workflow Component Layer

The dedicated workflow component reference lives in [production-workflow-components.md](./production-workflow-components.md). It covers empty, error, loading, filter, search, form-field, validation, date/time, combobox, page-tabs, toast, notification, table, grid, and multiselect surfaces. Its historical 3.2 framing remains useful for the component layer; current 3.3 launch evidence is tracked in `reports/3.3-release`.
