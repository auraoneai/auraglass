# Visual Testing Guide

AuraGlass visual tests protect glass surfaces, tokens, layout stability, accessibility states, and responsive behavior.

## Commands

- `npm run test:visual`: run the visual test suite.
- `npm run test:visual:components`: run component visual tests.
- `npm run test:visual:responsive`: run responsive visual tests.
- `npm run test:visual:a11y`: run accessibility-oriented visual tests.
- `npm run test:visual:update`: update visual baselines after approved changes.

## Certification

The full Storybook visual certification is separate from family-level visual specs. Use `reports/glassmorphism-storybook-visual-certification.json` as the certification evidence source.
