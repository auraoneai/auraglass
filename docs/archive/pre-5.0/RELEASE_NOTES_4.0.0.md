# AuraGlass 4.0.0

AuraGlass 4.0 is the visual-hardening and certification release for the React and Next.js Liquid Glass component system.

## Highlights

- Reconciles the authoritative public inventory at 470 visually renderable component exports, one explicitly nonvisual public export, and 28 package recipes.
- Completes the neutral-glass material sweep across component implementations, generated CSS, theme and persona tokens, Storybook presentation, and shared utilities.
- Adds release-blocking accessibility story-quality checks for meaningful names, roles, interaction states, and usable examples.
- Adds token-purity and responsive-layout enforcement for unsafe raw visual values, fixed geometry, containment, and overflow.
- Bundles the licensed Aeonik family as the primary interface typography stack.
- Preserves the established public package entrypoints, focused feature subpaths, Theme Engine 2.0, recipe CLI, and optional hosted-runtime boundaries.

## Verified Release Evidence

| Gate | Result |
| --- | --- |
| Full visual gate | 498 passed, 0 blocked |
| Renderable component exports | 470 |
| Package recipes | 28 |
| Glass pipeline | 31 passed, 0 failed, 0 warnings |
| Runtime cleanliness | 760 source files scanned, 0 findings |
| Historical Storybook certification | 356 passed entries retained |
| Package build and install smoke | Passed |
| npm pack verification | Passed; no nested `node_modules` or bundled React runtime |

The complete machine-readable audit summary is committed at `reports/audit/audit-summary.json`. Supporting ledgers, screenshots, and focused audit outputs are stored under `reports/audit/`.

## Install

```bash
npm install aura-glass@4.0.0
```

Import the stylesheet once at the application root:

```tsx
import { GlassButton, GlassCard } from 'aura-glass';
import 'aura-glass/styles';
```

## Upgrade Notes

- Existing public package imports remain the intended migration path.
- Review local overrides that assumed a tinted default surface; 4.0 keeps defaults neutral until semantic, intent, persona, or brand tint is explicitly requested.
- Review screenshot baselines and dense responsive layouts because 4.0 tightens material, typography, containment, and overflow behavior.
- Run `npx aura-glass doctor --json` after upgrading and perform a focused visual review of local overrides.

## Support Policy

AuraGlass 4.0.0 is the supported release line. Earlier npm versions are deprecated and direct users to upgrade to 4.0.0.
