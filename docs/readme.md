# AuraGlass by AuraOne Documentation

This is the documentation home for AuraGlass by AuraOne. It separates product usage, component references, design-system rules, testing evidence, deployment notes, and release-ready maintenance guidance.

## Current Source Of Truth

- Package version: 3.1.1
- Current 3.1 package surface: 804 runtime exports, 439 component-like value exports, 317 Glass-prefixed component-like exports, 121 hook exports, 29 provider exports, 10 launch recipes, 19 functional sub-entrypoints, 6 token formats, and one CLI binary.
- Package surface audit: [reports/3.1-release/package-surface-audit.md](../reports/3.1-release/package-surface-audit.md)
- Historical 3.0 certification inventory: 356 audited entries in [reports/component_inventory.json](../reports/component_inventory.json)
- Historical visual certification: 356/356 passed entries in [reports/glassmorphism-storybook-visual-certification.json](../reports/glassmorphism-storybook-visual-certification.json)
- Historical certification screenshots: 712 desktop/mobile captures in [reports/glassmorphism-storybook-visual-certification/screenshots](../reports/glassmorphism-storybook-visual-certification/screenshots)
- Static Storybook exhaustive QA: 1,595 stories, zero hard failures, zero audit-run errors in [reports/storybook-exhaustive-qa.md](../reports/storybook-exhaustive-qa.md)
- Storybook taxonomy: Start Here, Foundations, Controls, Navigation, Surfaces, Data + Visualization, Media, Workflows, AI + Intelligence, Effects + Advanced, Showcases, Reference, and Certification.
- Component selection guide: [docs/components/choosing.md](./components/choosing.md)
- Marketing Kit guide: [docs/components/marketing/readme.md](./components/marketing/readme.md)
- Component audit command: `npm run audit:components`

## Primary Docs

- [Root README](../README.md): package overview, install, API entrypoints, architecture, verification, and release workflow.
- [Component selection guide](./components/choosing.md): developer and AI-agent decision tree for choosing the right AuraGlass family without scanning every export.
- [Storybook configuration guide](../.storybook/README.md): preview surfaces, taxonomy, maintenance rules, and QA gates.
- [Installation guide](../INSTALLATION.md): peer dependencies, setup flows, SSR setup, and troubleshooting.
- [3.0.1 release notes](../RELEASE_NOTES_3.0.1.md): final release-readiness patch with Storybook taxonomy, exhaustive QA, and package evidence.
- [3.0.0 release notes](../RELEASE_NOTES_3.0.0.md): public major-release highlights and verified gates.
- [Component documentation](./components/readme.md): organized index for every component page.
- [Marketing Kit guide](./components/marketing/readme.md): landing-page, launch-page, aurora CTA, and marketing token guidance.
- [Liquid Glass hub](./liquid-glass/readme.md): Liquid Glass rules, migration, primitives, showcase, and component map.
- [Reports index](../reports/README.md): certification, audit, TypeScript, accessibility, and tooling evidence.

## Documentation Areas

- `docs/ai`: AI service, setup, and production integration guides.
- `docs/components`: numbered component sections for package and historical certification docs.
- `docs/components/marketing`: Marketing Kit discoverability and GEO guidance.
- `docs/liquid-glass`: Liquid Glass design rules, migration, primitives, component map, and showcase.
- `docs/guides`: standards, migration guides, accessibility rules, focus management, SSR, visual testing, and house style.
- `docs/deployment.md`: deployment and production runtime notes.
- `docs/design-tokens.md`: design token documentation.
- `docs/glass-utilities.md`: glass utility class and helper documentation.
- `docs/guides/consciousness-interface.md`: feature-level consciousness interface notes.
- `docs/guides/performance-optimization.md`: performance rules and optimization notes.
- `docs/guides/react19-integration.md`: React 19 integration and compatibility notes.

## Top-Level File Map

- [ai](./ai/): 9 Markdown files
- [components](./components/): 423 Markdown files
- [liquid-glass](./liquid-glass/readme.md): 13 Markdown files
- [guides](./guides/): 16 Markdown files
- [deployment](./deployment.md): 1 Markdown file
- [design tokens](./design-tokens.md): 1 Markdown file
- [glass utilities](./glass-utilities.md): 1 Markdown file

## Maintenance Rules

- Keep component pages inside `docs/components/<numbered-section>/`.
- Keep generated reports in `reports/`; summarize them through `reports/README.md` instead of duplicating long results in this directory.
- Keep internal rebuild prompts, temporary ship-status notes, and one-off migration checklists out of `/docs`.
- Update this index when adding a new docs area.
- Run the Markdown link verifier and `npm run audit:components` after moving documentation.
