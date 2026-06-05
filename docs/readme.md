# AuraGlass by AuraOne Documentation

This is the documentation home for AuraGlass by AuraOne. It separates product usage, component references, design-system rules, testing evidence, deployment notes, and release-ready maintenance guidance.

## Current Source Of Truth

- Package version: 3.3.0 in the current working tree.
- Current 3.3 package surface: dependency-sovereign core app chrome with first-party icons, first-party primitives, native menus/selects for touched app-chrome surfaces, app-shell/workspace entrypoints, focused forms/data/navigation/overlays/workflows/marketing subpaths, Theme Engine 2.0, migration CLI commands, 28 package registry recipes, 6 token formats, optional hosted-runtime contracts, and release evidence.
- Runtime scope: AuraGlass is package-first. The optional hosted runtime is self-hosted infrastructure for AI and collaboration features, not required for package-only apps.
- Hosted runtime ports: API `http://localhost:3002` via `API_SERVER_PORT=3002`; WebSocket `ws://localhost:3001` via `WS_PORT=3001`; public client URLs use `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`.
- Hosted runtime production entrypoints must use the real TypeScript API server built from `server/index.ts` and `server/websocket-server.js`. The legacy `server/api-server.js` path is demo/mock-only and must not be documented as production infrastructure.
- 3.3 release evidence: [reports/3.3-release/README.md](../reports/3.3-release/README.md)
- 3.1 package surface audit: [reports/3.1-release/package-surface-audit.md](../reports/3.1-release/package-surface-audit.md)
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
- [3.3 release evidence](../reports/3.3-release/README.md): package gates, hosted-runtime contracts, recipe, app-chrome, security, AI cache/cost, marketing, theme, and accessibility evidence.
- [3.3 CLI migration guide](./cli/migration.md): package audit and migration commands for Lucide, Radix, and MUI removal.
- [3.3 icon reference](./icons/readme.md): first-party icon entrypoints and accessibility usage.
- [3.3 primitive reference](./primitives/readme.md): native primitive entrypoints and accessibility requirements.
- [3.3 app-shell guide](./app-shell/readme.md): app chrome and MUI layout migration guidance.
- [3.3 workflow guide](./workflows/readme.md): workflow surfaces for admin, AI, settings, commerce, collaboration, support, release operations, docs portals, and marketing apps.
- [3.3 Theme Engine guide](./theme/theme-engine.md): brand, density, motion, contrast, and provider usage.
- [MUI migration](./migration/mui-to-auraglass.md), [Radix migration](./migration/radix-to-auraglass.md), and [Lucide migration](./migration/lucide-to-auraglass-icons.md): replacement guidance for core app chrome.
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

- `docs/ai`: optional AI service, setup, provider-unconfigured, and hosted runtime integration guides.
- `docs/components`: numbered component sections for package and historical certification docs.
- `docs/app-shell`: current app-shell entrypoint and layout migration guidance, including 3.3 evidence links.
- `docs/cli`: current audit and migration CLI guidance for the 3.3 package gate.
- `docs/icons`: first-party icon reference.
- `docs/migration`: MUI, Radix, and Lucide migration pages.
- `docs/primitives`: native primitive reference.
- `docs/theme`: Theme Engine 2.0 guide.
- `docs/workflows`: production workflow surface guidance.
- `docs/components/marketing`: Marketing Kit discoverability and GEO guidance.
- `docs/liquid-glass`: Liquid Glass design rules, migration, primitives, component map, and showcase.
- `docs/guides`: standards, migration guides, accessibility rules, focus management, SSR, visual testing, and house style.
- `docs/deployment.md`: optional hosted runtime deployment notes and package-only boundary.
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
- Keep active docs aligned on the hosted runtime contract: package-only usage needs no server, optional API runs on `3002`, optional WebSocket runs on `3001`, and mock/demo API routes are not production entrypoints.
- Run the Markdown link verifier and `npm run audit:components` after moving documentation.
