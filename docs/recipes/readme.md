# AuraGlass 3.3 Recipes

The package recipe registry is exported from `aura-glass/registry` and scaffolded through the `aura-glass` CLI. AuraGlass 3.3 keeps the 3.2 app-surface starters and adds deeper production starters for AI operations, provider-safe search and vision flows, collaboration readiness, support triage, release operations, docs portals, and marketing launch pages.

Recipes are product-surface starters, not decorative preview cards. They should scaffold without MUI, Radix, Lucide, or shadcn/ui for core UI, use AuraGlass icons and package-owned components, and include accessibility and performance notes.

## Commands

```bash
npx aura-glass list
npx aura-glass info ai-ops-control-room
npx aura-glass add ai-ops-control-room --out src/components/auraglass/recipes
npx aura-glass add all --out src/components/auraglass/recipes
npx aura-glass add all --dry-run --json
```

## 3.3 Recipe IDs

| Recipe | Category | Launch Purpose |
| --- | --- | --- |
| `ai-ops-control-room` | `ai` | Provider readiness, cost budget, rate limits, and prompt-safety review. |
| `semantic-search-console` | `ai` | Indexed documents, query testing, relevance tuning, loading/empty states, and provider-unconfigured state. |
| `vision-review-workbench` | `ai` | Image upload review, OCR/object/safe-search panels, and missing-provider state. |
| `collaboration-room-console` | `collaboration` | Room presence, cursor/selection placeholders, and unsupported editing state. |
| `support-triage-workspace` | `support` | Ticket queue, SLA status, notifications, and fail-closed AI summary action. |
| `release-command-center` | `release` | Release checklist, rollout status, changelog preview, evidence links, and rollback actions. |
| `developer-docs-portal` | `docs` | Docs navigation, code examples, package entrypoint selector, and evidence links. |
| `marketing-launch-kit` | `marketing` | Hero, feature grid, install command, changelog, social proof, and visual evidence section. |

The complete registry also includes the 20 3.2 recipes:

```text
saas-dashboard
ai-command-center
media-player-surface
analytics-overview
settings-billing
kanban-workspace
calendar-schedule
collaborative-workspace
admin-data-table
ecommerce-product-panel
saas-admin-shell
ai-product-console
media-review-workspace
commerce-operations-panel
team-collaboration-hub
settings-and-billing-suite
analytics-command-center
calendar-operations-board
customer-support-console
creator-studio-dashboard
```

## Provider-Unconfigured Behavior

AI and hosted-runtime recipes must render safely with no provider keys. The default state should explain that the provider is unconfigured, disable provider-backed actions, and keep the rest of the screen useful for manual review. Do not imply that hosted API routes, semantic search, vision, AI summaries, or collaboration editing are production-ready until those runtime gates are configured and verified.

Use this pattern in recipe code:

```tsx
import { GlassButton, GlassErrorState } from 'aura-glass';

export function ProviderSafeAction() {
  return (
    <GlassErrorState
      severity="warning"
      title="Provider not configured"
      description="This action stays disabled until authenticated provider-backed routes are ready."
      details={<code>OPENAI_API_KEY is unset.</code>}
    />
  );
}
```

## Acceptance Rules

- Every 3.3 recipe must expose `id`, `title`, `category`, `description`, `imports`, `peerDependencies`, `tokens`, `accessibility`, `performance`, and `files`.
- Every recipe file must import only public package entrypoints such as `aura-glass`, `aura-glass/app-shell`, `aura-glass/workspace`, `aura-glass/theme`, `aura-glass/registry`, and `aura-glass/icons/*`.
- AI/server recipes must default to provider-unconfigured UI states unless users wire credentials and authenticated routes.
- Collaboration recipes must label editing as unsupported unless the hosted collaboration runtime ships CRDT/OT support.
- Recipes should include empty, loading, or error states where those states are natural for the product surface.
- Recipe examples should use AuraGlass first-party icons and components for core UI.
- The release gate is `npm run test:recipes:render` after the package has been rebuilt.

## Evidence

- `reports/3.3-release/recipe-evidence.md`
- `reports/3.3-release/theme-evidence.md`
- `reports/3.3-release/marketing-evidence.md`

Historical 3.2 evidence remains under `reports/3.2-release/`.
