# Contributing To AuraGlass by AuraOne

AuraGlass by AuraOne is the liquid-glass design system for React 19 (5.0 is the current release; `aura-glass@5.0.1` on npm `latest`). Contributions should improve package reliability, developer adoption, visual quality, accessibility, SSR behavior, documentation, or release evidence without weakening the package boundary.

## Before You Start

- Work in the package repo: `/Users/gurbakshchahal/platforms/AuraGlass`.
- Do not edit the website repo from package changes.
- Do not revert unrelated changes from other contributors.
- Import public components from `aura-glass`, not private `src` paths.
- Include `import 'aura-glass/styles.css';` in examples that require package styles (the single stylesheet; the material engine ships inside it).
- Keep React and React DOM as peer dependencies (React ^19).
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
npm run lint
npm test -- --runInBand
```

Run package checks as the change scope grows:

```bash
npm run build
npm run test:contract
npm run pack:verify
npm run docs:links
```

Full pre-publish verification (build, pack check, Next and Vite consumer integrations):

```bash
npm run prepublish:verify
```

Do not publish, push, or create external GitHub/npm changes unless that is explicitly requested.

## Pull Request Expectations

Every PR should include:

- clear summary of the change
- changed behavior or documentation surface
- tests/checks run
- screenshots or visual notes when UI output changed
- changelog update for public package behavior
- release evidence update when a release gate status changes

Use the repository pull request template and leave unchecked any gate that was not run.

## Release Evidence

Release claims must be backed by checked-in evidence, not README text alone. The current records are:

- [CHANGELOG.md](./CHANGELOG.md) and [release-notes-5.0.0.md](./release-notes-5.0.0.md) for the shipped 5.0.x line
- [docs/release/](./docs/release/) for the breaking-change register, LTS policy, and release decisions
- [docs/release-rollback-deprecation.md](./docs/release-rollback-deprecation.md) for dist-tag rollback and deprecation procedure
- Pre-5.0 release notes and program records were deleted in the 5.0 GA cleanup (2026-10-13)
