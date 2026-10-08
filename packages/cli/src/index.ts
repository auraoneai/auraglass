/** Programmatic surface of @auraglass/cli (drives etc/api/cli.api.md). */
export { PACKAGE_NAME, PACKAGE_VERSION, MOVED_NOTICE, BIN_NAME } from './meta.js';
export { EXIT, CliError, type ExitCode } from './cli/errors.js';
export { parseArgs } from './cli/args.js';
export { runChecks, type CheckResult } from './doctor/checks.js';
export { runV5, type V5Finding } from './doctor/v5.js';
export { runMigration, selectTransforms, TRANSFORM_ORDER, type MigrateReport } from './migrate/4to5/index.js';
export { loadCompiledMappings, type CompiledMappings } from './migrate/4to5/mappings.js';
export { detectProject, type ProjectInfo } from './core/project-detect.js';
export { detectPackageManager } from './core/package-manager.js';
export { readConfig, writeConfig } from './core/config.js';
export { ensureInsideCwd, atomicWrite, isInsideCwd } from './core/fs-safety.js';
export { assertClean, isGitRepo } from './core/git-guard.js';
export { fetchItem, listItems } from './registry/client.js';
export { registryItemSchema, type RegistryItem } from './registry/schema.js';
