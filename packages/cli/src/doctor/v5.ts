/**
 * doctor --v5 (PLAT-315): per-file/line usage of removeIn:'5.0.0' deprecation
 * entries, grouped by codemod id, bucketed {automatic, needsReview, manual}.
 * Deterministic output (sorted) — used by the doctor-v5 golden test.
 */
import { loadCompiledMappings } from '../migrate/4to5/mappings.js';
import { runV5WithEntries, type V5Finding } from './v5-core.js';

export type { V5Finding };
export { runV5WithEntries };

export function runV5(cwd: string): { findings: V5Finding[]; byCodemod: Record<string, V5Finding[]> } {
  return runV5WithEntries(cwd, loadCompiledMappings().deprecations);
}
