# API report: `@auraglass/cli`

Generated for lane 1e (PLAT-346). Programmatic surface used by tests and by
other packages' tooling; the CLI itself is the bin `auraglass` (`./dist/bin.js`).

## Commands (`src/commands/*`)

| Export | Signature | Exit codes |
|---|---|---|
| `migrateCommand` | `(args: string[], flags: Record<string, string\|boolean>) => Promise<number>` | 0 ok, 1 validation/TODO, 2 usage, 3 safety, 4 network |
| `doctorCommand` | same | 0 ok, 1 findings, 2 usage |
| `auditCommand` | `('deps'|'imports'|'backdrop')` subcommands | 0/1/2/4 |
| `initCommand` | same | 0/2/3 |
| `addCommand` | `(names: string[], flags)` | 0/1/3/4 |
| `diffCommand` | `([], flags)` | 0/1/4 |
| `updateCommand` | `([], flags)` | 0/1/4 |
| `listCommand` / `infoCommand` | `([], flags)` / `([name], flags)` | 0/2/4 |

## Codemod engine (`src/migrate/4to5/`)

- `runMigration(opts: { cwd; dryRun?; transforms?; allowDirty?; allowNoGit?; allowTodo? })` → `{ report, writes, diffs, hasTodos }` — returns a write plan; the caller persists via `atomicWrite`.
- `runOnSource(unit: FileUnit, transforms, { mappings, docBase })` → `{ final, changes, todos }`.
- `selectTransforms(ids?: string[])` — frozen order `TRANSFORM_ORDER` (14 ids); unknown id throws (exit 2 upstream).
- `loadCompiledMappings(dir?)` → `CompiledMappings` compiled from `fragments/codemods/*.ts` (cwd-independent when `dir` passed).
- `walkFiles(cwd, roots?)` → absolute paths, skipping `node_modules`, `dist`, `.git`, `legacy`.

## Legacy parity (`src/migrate/legacy/icons.ts`)

- `migrateIcons(cwd, 'lucide'|'radix'|'mui', write)` → `LegacyResult { lines, report, changed }`.
- `reportOnly(cwd, kind)` → report with `reportOnly: true`; `--write` on radix/mui exits 2 (`report-only; no automated migration`).

## Safety (`src/core/`)

- `ensureInsideCwd(cwd, target)` — exits 3 on escape (`Refusing to write outside the current project: <path>`).
- `assertClean(cwd, touched, { allowDirty, allowNoGit })` — exits 3 on dirty tree (`Refusing to write into a dirty tree`) unless flagged.
- `atomicWrite(cwd, target, contents)` — temp+rename, same-filesystem.

## Meta (`src/meta.ts`)

`PACKAGE_NAME` `@auraglass/cli`, `PACKAGE_VERSION`, `MOVED_NOTICE`.

## Doctor (`src/doctor/`)

`runChecks(cwd)` → `CheckResult[]` (4.x parity); `runV5(cwd)` → `{ findings, byCodemod }` (the `--v5` golden report).

## Audit (`src/audit/thresholds.ts`)

`AUDIT_THRESHOLDS` `{ maxTranslucentCoverage, maxStackDepth, minTextContrast, maxBlurPx }` — sent to the remote endpoint (`AURAGLASS_AUDIT_ENDPOINT`); no local scoring.
