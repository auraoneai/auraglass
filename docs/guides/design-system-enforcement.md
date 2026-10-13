# Design System Enforcement

AuraGlass enforces glassmorphism quality through inventory audits, lint rules, Storybook certification, visual tests, and documentation coverage.

## Required Gates

- `npm run lint`: rejects raw styling that should use design tokens and checks glass styling and interaction rules (ESLint + Stylelint in 5.0; the 4.x `audit:components` / `lint:tokens` / `lint:styles` scripts no longer exist).
- `npm run typecheck`: keeps exported TypeScript contracts valid.
- `npm test`: runs the contract and component test suites.
- Storybook visual certification: validates all inventory components across desktop and mobile screenshots.

## Component Rules

- Use token-backed colors, spacing, blur, radius, elevation, and motion.
- Keep text contrast readable on translucent surfaces.
- Preserve visible focus and semantic accessibility.
- Respect `prefers-reduced-motion`.
- Add component docs with the component's meta and stories (component API pages are generated from each 5.0 component's meta).
