# AuraGlass 3.0.2

AuraGlass 3.0.2 is a Storybook screenshot certification patch for the 3.0 release line. It hardens default Storybook previews that previously mounted successfully but produced blank, hidden, clipped, or low-contrast screenshots in the final visual evidence set.

## Highlights

- Revalidated the 356-component Storybook inventory with desktop and mobile screenshots for every certified component.
- Regenerated 712 screenshots and 89 manual QA contact sheets for the final evidence set.
- Added deterministic Storybook preview data for collaborative cursor stories.
- Added Storybook-only visibility hooks for cookie consent previews so persisted consent state cannot hide the default stories.
- Reworked weak generated default stories for late controls/input coverage so default screenshots contain visible sample content.
- Constrained and recolored GlassAlert and glass-panel default previews so mobile screenshots are readable and not clipped.
- Added a manual screenshot QA report covering the final contact-sheet review.

## Verified Release Gates

- `npm run typecheck -- --pretty false`
- `npm run build-storybook`
- `STORYBOOK_URL=http://127.0.0.1:6018 CERT_CONCURRENCY=8 CERT_RENDER_TIMEOUT_MS=20000 CERT_ROOT_WAIT_TIMEOUT_MS=8000 CERT_SETTLE_WAIT_MS=350 node scripts/audit/storybook-visual-certification.mjs`

## Current Evidence

- Certified component inventory: 356.
- Storybook visual certification: 356/356 passed.
- Screenshot count: 712/712.
- Manual contact sheets: 89.
- Manual QA report: `reports/component-screenshot-manual-qa/manual-qa-report.md`.

## Install

```bash
npm install aura-glass
```

```tsx
import { GlassButton, GlassCard, OptimizedGlass } from 'aura-glass';
import 'aura-glass/styles';
```
