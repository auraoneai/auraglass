# Design System Enforcement

AuraGlass enforces glassmorphism quality through inventory audits, lint rules, Storybook certification, visual tests, and documentation coverage.

## Required Gates

- `npm run audit:components`: verifies inventory coverage across stories, docs, tests, accessibility metadata, and visual certification.
- `npm run lint:tokens`: rejects raw styling that should use design tokens.
- `npm run lint:styles`: checks glass styling and interaction rules.
- `npm run typecheck`: keeps exported TypeScript contracts valid.
- Storybook visual certification: validates all inventory components across desktop and mobile screenshots.

## Component Rules

- Use token-backed colors, spacing, blur, radius, elevation, and motion.
- Keep text contrast readable on translucent surfaces.
- Preserve visible focus and semantic accessibility.
- Respect `prefers-reduced-motion`.
- Add component docs inside `docs/components/<numbered-section>/`.
