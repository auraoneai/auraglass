# Summary

Describe the change and the user-facing behavior it affects.

## Scope

- [ ] Package source
- [ ] Documentation or README
- [ ] GitHub/community metadata
- [ ] Release evidence
- [ ] Tests or audit tooling
- [ ] Website handoff only; no website repo edits in this PR

## Package Checks

Run the focused checks that match the change. Do not mark a gate complete unless it was run on this branch.

- [ ] `npm run typecheck`
- [ ] `npm run lint:check`
- [ ] `npm run lint:tokens`
- [ ] `npm run lint:styles`
- [ ] `npm test -- --runInBand`
- [ ] `npm run audit:components`
- [ ] `npm run audit:exports`
- [ ] `npm run audit:api`
- [ ] `npm run audit:runtime`
- [ ] `npm run build`
- [ ] `npm run verify:pack`
- [ ] `npm run test:integration:next -- --skip-build`
- [ ] `npm run release:dry-run`

## Visual QA

- [ ] Storybook preview checked
- [ ] Desktop viewport checked
- [ ] Mobile viewport checked
- [ ] Reduced motion checked
- [ ] Dark theme checked
- [ ] Screenshots or contact sheets attached when visual output changed

## Documentation

- [ ] README/npm-facing copy updated if public behavior changed
- [ ] Component docs updated if API or usage changed
- [ ] Changelog updated
- [ ] 3.1 evidence scaffold updated when a launch gate changed

## Risk

List known risks, follow-ups, and any gates intentionally not run.
