# Contributing To AuraGlass by AuraOne

AuraGlass by AuraOne is a production React and Next.js Liquid Glass component system. Contributions should improve package reliability, developer adoption, visual quality, accessibility, SSR behavior, documentation, or release evidence without weakening the package boundary.

## Before You Start

- Work in the package repo: `/Users/gurbakshchahal/AuraGlass`.
- Do not edit the website repo from package changes.
- Do not revert unrelated changes from other contributors.
- Import public components from `aura-glass`, not private `src` paths.
- Include `import 'aura-glass/styles';` in examples that require package styles.
- Keep React and React DOM as peer dependencies.
- Keep optional feature-family peers optional.

## Good First Change Areas

- README, install, peer dependency, and docs clarity.
- Component examples that use public imports only.
- Focused bug fixes with tests.
- Accessibility and reduced-motion improvements.
- Compact or contained component behavior for docs/catalog previews.
- Token, style, export, or runtime audit coverage.
- Release evidence updates under `reports/`.

## Component Quality Bar

Components and recipes should be production-oriented:

- dark theme works by default
- text contrast stays readable on glass surfaces
- keyboard focus is visible
- reduced-motion paths are respected
- SSR and hydration behavior are deterministic
- compact/contained modes work when the component appears in a preview card
- optional peers are documented by feature family
- examples avoid hidden website-only dependencies

## Development Workflow

Install dependencies:

```bash
npm install
```

Run focused checks while developing:

```bash
npm run typecheck
npm run lint:check
npm test -- --runInBand
```

Run package and audit checks as the change scope grows:

```bash
npm run lint:tokens
npm run lint:styles
npm run audit:components
npm run audit:exports
npm run audit:api
npm run audit:runtime
npm run build
npm run verify:pack
```

Full release dry run:

```bash
npm run release:dry-run
```

Do not publish, push, or create external GitHub/npm changes unless that is explicitly requested.

## Pull Request Expectations

Every PR should include:

- clear summary of the change
- changed behavior or documentation surface
- tests/checks run
- screenshots or visual notes when UI output changed
- changelog update for public package behavior
- release evidence update when a 3.1 gate status changes

Use the repository pull request template and leave unchecked any gate that was not run.

## 3.1 Launch Evidence

3.1 claims must be backed by checked-in evidence, not README text alone. Use these ledgers:

- [reports/3.1-release/README.md](./reports/3.1-release/README.md)
- [reports/3.1-release/package-gates.md](./reports/3.1-release/package-gates.md)
- [reports/3.1-release/flagship-components.md](./reports/3.1-release/flagship-components.md)
- [reports/3.1-release/catalog-and-website-evidence.md](./reports/3.1-release/catalog-and-website-evidence.md)
- [reports/3.1-release/accessibility-and-visual-qa.md](./reports/3.1-release/accessibility-and-visual-qa.md)
- [reports/3.1-release/recipes-and-agent-readiness.md](./reports/3.1-release/recipes-and-agent-readiness.md)
