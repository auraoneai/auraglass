# AuraGlass Migration CLI

AuraGlass migration CLI commands audit and migrate away from MUI, Radix, and Lucide in core app chrome. For 3.3, the same CLI remains part of the release gate while package subpath, recipe render, Vite, and Next integration checks verify the expanded package surface.

## Commands

```bash
aura-glass audit deps
aura-glass audit imports
aura-glass migrate icons --from lucide
aura-glass migrate radix
aura-glass migrate mui
aura-glass doctor
```

All migration commands support:

```bash
--cwd <dir>
--dry-run
--write
--json
```

`migrate icons --from lucide` can rewrite known named imports when `--write` is passed. `migrate radix` and `migrate mui` are report-first because behavior and layout replacements need intentional review.

## JSON For CI

```bash
aura-glass audit deps --json
aura-glass audit imports --json
aura-glass doctor --json
```

Use JSON output when a project wants to block new forbidden core UI dependencies before the full 3.3 CI gate is wired.

## Local Gate Scripts

Package maintainers can run:

```bash
node scripts/ci/verify-no-core-ui-deps.js
node scripts/ci/verify-tree-shaking.js
```

The first script is the dependency and import gate. The second script is the export-map and bundle-sovereignty gate. Strict bundle checks can be enabled with:

```bash
node scripts/ci/verify-tree-shaking.js --strict
```

## Recommended Migration Order

1. Run `aura-glass audit deps` and remove forbidden core UI packages from production metadata.
2. Run `aura-glass audit imports` to inventory source imports.
3. Run `aura-glass migrate icons --from lucide --dry-run`.
4. Apply icon rewrites with `--write`.
5. Replace Radix surfaces one component at a time.
6. Replace MUI app shell, forms, overlays, and workflow surfaces by route.
7. Run `aura-glass doctor`.

## 3.3 Evidence

Current 3.3 package and migration-adjacent evidence is tracked in:

- `reports/3.3-release/README.md`
- `reports/3.3-release/recipe-evidence.md`
- `reports/3.3-release/recipe-render-evidence.md`
