# AuraGlass Documentation

This is the documentation home for AuraGlass. It separates product usage, component references, design-system rules, testing reports, deployment notes, and reusable audit prompts.

## Current Source Of Truth

- Package version: 2.16.4
- Component inventory: 356 components in [reports/component_inventory.json](../reports/component_inventory.json)
- Visual certification: 356/356 passed entries in [reports/glassmorphism-storybook-visual-certification.json](../reports/glassmorphism-storybook-visual-certification.json)
- Certification screenshots: 712 desktop/mobile captures in [reports/glassmorphism-storybook-visual-certification/screenshots](../reports/glassmorphism-storybook-visual-certification/screenshots)
- Component audit command: `npm run audit:components`

## Primary Docs

- [Root README](../README.md): package overview, install, API entrypoints, architecture, verification, and release workflow.
- [Installation guide](../INSTALLATION.md): peer dependencies, setup flows, SSR setup, and troubleshooting.
- [Changelog](../CHANGELOG.md): version history.
- [Component documentation](./components/README.md): organized index for every component page.
- [Reports index](../reports/README.md): certification, audit, TypeScript, accessibility, and tooling reports.

## Documentation Areas

- `docs/ai`: AI service, setup, and production integration guides.
- `docs/components`: numbered component sections with 356/356 direct docs coverage.
- `docs/deployment`: deployment and production runtime notes.
- `docs/features`: feature-level design and implementation notes.
- `docs/guides`: standards, migration guides, accessibility rules, focus management, SSR, visual testing, and house style.
- `docs/primitives`: lower-level liquid glass primitives and material system docs.
- `docs/prompts`: reusable audit and certification prompts.
- `docs/tests`: integration and compatibility test notes.
- `docs/tokens`: design token documentation.
- `docs/utilities`: glass utility class and helper documentation.

## Top-Level File Map

- [ai](./ai/): 9 Markdown files
- [components](./components/): 399 Markdown files
- [deployment](./deployment/): 1 Markdown file
- [designmatrix-PRD.md](./designmatrix-PRD.md)
- [features](./features/): 1 Markdown file
- [guides](./guides/): 14 Markdown files
- [primitives](./primitives/): 3 Markdown files
- [prompts](./prompts/): 2 Markdown files
- [tests](./tests/): 1 Markdown file
- [token-violations-fix-prompt.md](./token-violations-fix-prompt.md)
- [tokens](./tokens/): 1 Markdown file
- [utilities](./utilities/): 1 Markdown file

## Maintenance Rules

- Keep component pages inside `docs/components/<numbered-section>/`.
- Keep generated reports in `reports/`; summarize them through `reports/README.md` instead of duplicating long results in this directory.
- Update this index when adding a new docs area.
- Run the Markdown link verifier and `npm run audit:components` after moving documentation.
