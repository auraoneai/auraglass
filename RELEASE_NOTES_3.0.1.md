# AuraGlass 3.0.1

AuraGlass 3.0.1 is the final release-readiness patch for the AuraGlass 3.0 relaunch line. The already-published `3.0.0` package established the major release; this patch carries the completed Storybook QA, taxonomy, documentation, and package-hygiene evidence from the final release-prep commit.

## Highlights

- Reorganized Storybook into developer-intent taxonomy: Start Here, Foundations, Controls, Navigation, Surfaces, Data + Visualization, Media, Workflows, AI + Intelligence, Effects + Advanced, Showcases, Reference, and Certification.
- Added `Start Here/Guide` as the curated Storybook entry point for choosing components by job to be done.
- Added shared Storybook preview surfaces and removed the old global decorative wrapper behavior.
- Refreshed static Storybook exhaustive QA against 1,595 stories across desktop Liquid Glass, desktop dark, and mobile Liquid Glass modes.
- Recorded zero hard Storybook failures and zero audit-run errors in `reports/storybook-exhaustive-qa.md`.
- Updated README, docs indexes, reports index, and release notes to reflect the verified historical 356-entry inventory, 3.0 positioning, Storybook taxonomy, and package evidence.
- Kept generated raw Storybook QA JSON and screenshot artifacts out of Git/package contents while committing the compact Markdown evidence report.

## Verified Release Gates

- `npm run typecheck -- --pretty false`
- `npm run audit:components`
- `npm run audit:exports && npm run audit:api && npm run audit:runtime`
- `npm run build`
- `npm run verify:pack`
- `npm run build-storybook`
- `npm pack --dry-run --json`
- `npm publish --dry-run --provenance --access public`

The final `npm publish --dry-run --provenance --access public` run for the completed QA state passed `prepublishOnly`, including both Next.js integration smoke tests, before npm rejected publishing as `3.0.0` because that version already exists. `3.0.1` is the publishable patch version for the final QA state.

## Current Evidence

- Historical certified inventory entries: 356.
- Historical direct Storybook coverage: 356/356.
- Historical direct docs coverage: 356/356.
- Historical direct unit-test coverage: 356/356.
- Historical Storybook visual certification: 356/356 passed with 712 screenshots.
- Static Storybook exhaustive QA: 1,595 stories, 0 hard failures, 0 audit-run errors.
- Public root exports audited: 797.
- Runtime cleanliness findings: 0.
- Package dry-run contents: dist, workers, README, LICENSE, and package metadata only.
- Bundled dependencies: none.

## Install

```bash
npm install aura-glass
```

```tsx
import { GlassButton, GlassCard, OptimizedGlass } from 'aura-glass';
import 'aura-glass/styles';
```
