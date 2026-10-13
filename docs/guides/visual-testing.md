# Visual Testing Guide

AuraGlass visual tests protect glass surfaces, tokens, layout stability, accessibility states, and responsive behavior.

## Commands

The 4.x `test:visual*` npm scripts no longer exist in 5.0. Visual coverage now runs with the test suites and the Storybook build:

- `npm test`: run the test suites (including visual-regression specs where configured).
- `npm run storybook:build`: build Storybook (emits the certification manifest into `storybook-static`).

## Certification

The full Storybook visual certification is separate from family-level visual specs. Use the certification manifest written by `npm run storybook:build` (`storybook-static`) as the certification evidence source.
