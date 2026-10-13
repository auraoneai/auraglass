# Workflows and workspace

There are two related surfaces:

1. **Workspace chrome** on `aura-glass/workspace` (same runtime as `aura-glass/workflows`): room frame, header, tabs, inspector, canvas, timeline, and `GlassWorkflowShell`.
2. **Product workflow components** on the root `aura-glass` entrypoint: tables, empty/error/loading states, filters, search, form fields, combobox, toasts, and notification center.

`aura-glass/workflows` re-exports `src/workspace`. It does not export `GlassDataTable` or the other product workflow components.

## Workspace chrome

```tsx
import {
  GlassWorkspace,
  GlassWorkspaceHeader,
  GlassWorkspaceTabs,
  GlassWorkspaceTab,
  GlassWorkspacePanel,
  GlassInspectorPanel,
  GlassCanvasArea,
  GlassTimelineRail,
  GlassWorkflowShell,
} from 'aura-glass/workspace';
```

You can import the same names from `aura-glass/workflows`.

| Component | Role |
| --- | --- |
| `GlassWorkspace` | Room frame. Props: `header`, `commandDock`, `inspector` |
| `GlassWorkspaceHeader` | Extends `GlassPageHeader` |
| `GlassWorkspaceTabs` / `GlassWorkspaceTab` | Workspace tab strip |
| `GlassWorkspacePanel` | Titled panel |
| `GlassInspectorPanel` | Side inspector |
| `GlassCanvasArea` | Main canvas |
| `GlassTimelineRail` | Timeline column |
| `GlassWorkflowShell` | Titled workflow frame |

App frame (top bar, sidebar rail, status bar) stays on `aura-glass/app-shell`. See [app-shell](https://auraglass-48859d.gitlab.io/components/app-shell).

## Product workflow components

Import these from `aura-glass`:

| Product need | Components |
| --- | --- |
| Settings and billing | `GlassForm`, `GlassInput`, `GlassSelect`, `GlassTabs`, `GlassCard` |
| Admin tables | `GlassDataTable`, `GlassDataGrid`, `GlassPagination`, `GlassFilterBar`, `GlassFilterPanel` |
| Empty / load / fail | `GlassEmptyState`, `GlassLoadingState`, `GlassErrorState` |
| Search and filters | `GlassSearchField`, `GlassFilterBar`, `GlassCombobox`, `GlassMultiSelect` |
| Form fields | `GlassFormField`, `GlassFieldGroup`, `GlassValidationMessage`, `GlassDateField`, `GlassTimeField` |
| Page tabs | `GlassPageTabs` |
| Toasts and notifications | `GlassToastProvider`, `GlassNotificationCenter` |
| Ecommerce panels | `GlassProductRecommendations`, `GlassSmartShoppingCart` |
| Collaboration hubs | `CollaborativeGlassWorkspace`, `GlassUserPresence`, `GlassChat` |

Props and accessibility contracts for the dedicated workflow layer are in [production-workflow-components.md](./production-workflow-components.md).

`GlassErrorState` accepts `severity?: "error" | "warning"`, `title`, `description`, `details`, and `onRetry`. Use it for provider-unconfigured UI:

```tsx
import { GlassErrorState } from 'aura-glass';

<GlassErrorState
  severity="warning"
  title="Provider not configured"
  description="This action stays disabled until authenticated provider-backed routes are ready."
  details={<code>OPENAI_API_KEY is unset.</code>}
/>
```

## Collaboration editing

Hosted collaborative **document editing** is not supported. The WebSocket server answers `collaborative-edit` with `COLLABORATION_EDIT_UNSUPPORTED`. Presence, cursor, and selection events are supported. See [deployment.md](../deployment.md).

## Recipes

The registry has 28 starters that compose app shell, workspace, icons, and these workflow states. Scaffold them with `npx aura-glass list` / `npx aura-glass add <id>`. See [registry blocks](https://auraglass-48859d.gitlab.io/guides/shadcn#adding-blocks-and-items).
