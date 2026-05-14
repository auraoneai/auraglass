# AuraGlass Workflows

AuraGlass 3.2 workflow components should let teams build real admin, settings, billing, AI, media, ecommerce, and collaboration surfaces without falling back to MUI for high-frequency product UI.

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

The 3.2 recipe pass should upgrade all shipped recipes into production starters that use app shell, icons, primitives, and workflow states where natural.

Final evidence belongs in `reports/3.2-release/recipe-evidence.md`.

## 3.2 Workflow Component Layer

The dedicated 3.2 workflow component reference lives in [production-workflow-components.md](./production-workflow-components.md). It covers empty, error, loading, filter, search, form-field, validation, date/time, combobox, page-tabs, toast, notification, table, grid, and multiselect surfaces.
