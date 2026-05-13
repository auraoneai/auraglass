# AuraGlass 3.1 Release Evidence

This directory is the package-repo evidence baseline for the AuraGlass 3.1 launch. It records the launch positioning, required gates, and evidence handoff points without claiming that pending release checks have already passed.

## Positioning Baseline

AuraGlass 3.1 is positioned as:

> Liquid Glass components for React and Next.js.

The launch should describe AuraGlass as a production React and Next.js component system for premium dashboards, AI products, media interfaces, creator tools, and polished SaaS surfaces. It should not lead with raw component count before explaining taxonomy and launch quality.

## Evidence Files

| File | Purpose | Status |
| --- | --- | --- |
| [package-gates.md](./package-gates.md) | Package build, lint, test, pack, export, and integration gates. | Baseline created; gates pending. |
| [flagship-components.md](./flagship-components.md) | 3.1 flagship component list and readiness checklist. | Baseline created; per-component evidence pending. |
| [catalog-and-website-evidence.md](./catalog-and-website-evidence.md) | Website/catalog evidence required by the PRD. | Baseline created; website repo work intentionally out of scope here. |
| [accessibility-and-visual-qa.md](./accessibility-and-visual-qa.md) | Accessibility, reduced-motion, visual, contrast, geometry, and manual QA sign-off. | Baseline created; QA evidence pending. |
| [recipes-and-agent-readiness.md](./recipes-and-agent-readiness.md) | Recipe targets and AI-agent/GEO readiness checklist. | Baseline created; content evidence pending. |

## Required Package Gates

Run and record the relevant command output in [package-gates.md](./package-gates.md):

```bash
npm run audit:components
npm run audit:exports
npm run audit:api
npm run audit:runtime
npm run typecheck
npm run lint:check
npm run lint:tokens
npm run lint:styles
npm run build
npm run verify:pack
npm run test:integration:next -- --skip-build
npm run build-storybook
npm run release:dry-run
git diff --check
```

## Website Handoff

The PRD requires website catalog, SEO, GEO, recipe, and visual evidence. This package repo must not edit the website repo as part of this launch-artifact pass. Website evidence should be linked from [catalog-and-website-evidence.md](./catalog-and-website-evidence.md) after the website repo produces it.

## Evidence Rule

Do not mark a claim as complete unless the linked artifact exists and was produced for the 3.1 release candidate.
