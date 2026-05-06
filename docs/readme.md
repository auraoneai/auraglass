# AuraGlass Documentation

This is the documentation home for AuraGlass. It separates product usage, component references, design-system rules, testing evidence, deployment notes, and release-ready maintenance guidance.

## Current Source Of Truth

- Package version: 3.0.0
- Certified component inventory: 356 components in [reports/component_inventory.json](../reports/component_inventory.json)
- Liquid Glass public surface: 32 value exports plus related type exports from the root package entrypoint.
- Visual certification: 356/356 passed entries in [reports/glassmorphism-storybook-visual-certification.json](../reports/glassmorphism-storybook-visual-certification.json)
- Certification screenshots: 712 desktop/mobile captures in [reports/glassmorphism-storybook-visual-certification/screenshots](../reports/glassmorphism-storybook-visual-certification/screenshots)
- Component selection guide: [docs/components/choosing.md](./components/choosing.md)
- Component audit command: `npm run audit:components`

## Primary Docs

- [Root README](../README.md): package overview, install, API entrypoints, architecture, verification, and release workflow.
- [Component selection guide](./components/choosing.md): developer and AI-agent decision tree for choosing the right AuraGlass family without scanning every export.
- [Installation guide](../INSTALLATION.md): peer dependencies, setup flows, SSR setup, and troubleshooting.
- [3.0 release notes](../RELEASE_NOTES_3.0.0.md): public release highlights and verified gates.
- [Component documentation](./components/readme.md): organized index for every component page.
- [Reports index](../reports/README.md): certification, audit, TypeScript, accessibility, and tooling evidence.

## Documentation Areas

- `docs/ai`: AI service, setup, and production integration guides.
- `docs/components`: numbered component sections with 356/356 direct docs coverage.
- `docs/deployment`: deployment and production runtime notes.
- `docs/features`: feature-level design and implementation notes.
- `docs/guides`: standards, migration guides, accessibility rules, focus management, SSR, visual testing, and house style.
- `docs/primitives`: lower-level liquid glass primitives and material system docs.
- `docs/showcase`: release showcase documentation.
- `docs/tests`: integration and compatibility test notes.
- `docs/tokens`: design token documentation.
- `docs/utilities`: glass utility class and helper documentation.

## Top-Level File Map

- [ai](./ai/): 9 Markdown files
- [components](./components/): 423 Markdown files
- [deployment](./deployment/): 1 Markdown file
- [features](./features/): 1 Markdown file
- [guides](./guides/): 16 Markdown files
- [primitives](./primitives/): 9 Markdown files
- [showcase](./showcase/): 1 Markdown file
- [tests](./tests/): 1 Markdown file
- [tokens](./tokens/): 1 Markdown file
- [utilities](./utilities/): 1 Markdown file

## Maintenance Rules

- Keep component pages inside `docs/components/<numbered-section>/`.
- Keep generated reports in `reports/`; summarize them through `reports/README.md` instead of duplicating long results in this directory.
- Keep internal rebuild prompts, temporary ship-status notes, and one-off migration checklists out of `/docs`.
- Update this index when adding a new docs area.
- Run the Markdown link verifier and `npm run audit:components` after moving documentation.
