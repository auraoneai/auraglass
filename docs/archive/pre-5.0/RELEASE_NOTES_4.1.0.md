# AuraGlass 4.1.0

AuraGlass 4.1.0 certifies the full visual surface: all 498 targets (470 component exports plus 28 recipes) pass token-purity and layout gates on desktop, tablet, and mobile. It fixes the defects the certification run surfaced and hardens the audit harness itself.

## Highlights

- Full visual gate: 498 passed, 0 failed, 0 blocked across all three viewports.
- Modal scrims (GlassDialog, GlassDrawer, GlassModal) use the canonical slate scrim `rgb(15, 23, 42)` at alpha 0.20, satisfying both the gradient-stop band and the whole-viewport tint census.
- Light-context tertiary text unified at 65% opacity via the new `--glass-opacity-65` scale step, holding 4.5:1 contrast and the 0.50 effective-alpha floor on frosted backdrops.
- GlassOrbitalMenu shortcut badge renders at full primary contrast on small viewports.
- Analytics recipe heatmaps resolve cell values to dark text on light cells; recipe evidence regenerated from the fixed build.
- Audit harness settle now requires opacity stability across consecutive polls, so rAF entrances are measured at rest instead of mid-fade.

## Verified Release Evidence

| Gate | Result |
| --- | --- |
| Full visual gate | 498 passed, 0 blocked |
| Renderable component exports | 470 |
| Package recipes | 28 |
| Typecheck (`tsc --noEmit`) | Passed |
| Glass violation scanner | 0 violations |
| Token linter | Passed |
| Style linter | Passed |
| Recipe render gate | 28 recipes passed |

Local gates and the AWS Playwright certification were all observed green for this release.

## Install

```bash
npm install aura-glass@4.1.0
```

Import the stylesheet once at the application root:

```tsx
import { GlassButton, GlassCard } from 'aura-glass';
import 'aura-glass/styles';
```

## Upgrade Notes

- No import changes: 4.1.0 is a drop-in hardening release over 4.0.0.
- Tertiary text on light surfaces renders slightly darker (65% vs 50–60%) to hold WCAG AA contrast; review screenshots with eyebrow or caption copy.
- Modal scrims shift from neutral dark to the canonical slate tint at a lower alpha; the dimming effect is preserved with less viewport color cast.
- Run `npx aura-glass doctor --json` after upgrading and perform a focused visual review of local overrides.

## Support Policy

AuraGlass 4.1.0 is the supported release line. Earlier npm versions are deprecated and direct users to upgrade to 4.1.0.
