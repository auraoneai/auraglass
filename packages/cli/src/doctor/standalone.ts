/**
 * Bundle entry for the 4.x `aura-glass` bin's `doctor --v5` (REQ-PLAT-61): the
 * @auraglass/cli checks and v5 scan, unchanged, with no migrate/transform
 * imports. scripts/ci/gen-doctor-v5.mjs bundles this file to
 * bin/doctor-v5.generated.cjs; never edit the generated file by hand.
 */
export { runChecks, type CheckResult } from './checks.js';
export { runV5WithEntries, type V5Finding } from './v5-core.js';

/** The `doctor --v5 --json` payload, composed exactly as commands/doctor.ts does. */
export function doctorV5Payload(
  cwd: string,
  deprecations: Array<Record<string, unknown>>,
  runChecks: (cwd: string) => unknown[],
  runV5WithEntries: (cwd: string, d: Array<Record<string, unknown>>) => { findings: unknown[]; byCodemod: Record<string, unknown[]> },
): { version: 1; checks: unknown[]; findings: unknown[]; byCodemod: Record<string, unknown[]> } {
  const checks = runChecks(cwd);
  const { findings, byCodemod } = runV5WithEntries(cwd, deprecations);
  return { version: 1, checks, findings, byCodemod };
}
