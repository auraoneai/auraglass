/* fragments/deprecations/plat.ts — PLAT owns this file on both branches (§3.4). */
import type { DeprecationFragment } from '../../src/contracts/fragments';

const REPORT_PATH_ENTRIES = [
  ['component_inventory_json', 'reports/component_inventory.json'],
  ['COMPONENT_INVENTORY_JSON_PATH', 'reports/component_inventory.json'],
  ['component_inventory_json_path', 'reports/component_inventory.json'],
  ['GILDED_TOKENS_CATALOGUE_MD', 'reports/GILDED_TOKENS_CATALOGUE.md'],
  ['REDUCED_MOTION_100_COMPLETE_MD', 'reports/REDUCED_MOTION_100_COMPLETE.md'],
  ['REDUCED_MOTION_101_GUIDE_MD', 'reports/REDUCED_MOTION_101_GUIDE.md'],
  ['GILDED_TOKENS_CATALOGUE_MD_PATH', 'reports/GILDED_TOKENS_CATALOGUE.md'],
  ['REDUCED_MOTION_101_GUIDE_MD_PATH', 'reports/REDUCED_MOTION_101_GUIDE.md'],
  ['REDUCED_MOTION_100_COMPLETE_MD_PATH', 'reports/REDUCED_MOTION_100_COMPLETE.md'],
  ['TYPESCRIPT_FIX_PROGRESS_MD_PATH', 'reports/TYPESCRIPT_FIX_PROGRESS.md'],
  ['REDUCED_MOTION_FINAL_REPORT_JSON_PATH', 'reports/reduced-motion-final-report.json'],
] as const;

// PLAT-115 — the 11 root-exported report-path constants are deprecated:
// reports/ is no longer a tracked artifact directory (evidence lives in CI
// artifacts), so these public path strings are sunset in 5.0.0. Values are
// unchanged for the 4.1.x line.
export default REPORT_PATH_ENTRIES.map(([symbol, value], i) => ({
  id: `DEP-P${String(i + 1).padStart(4, '0')}` as `DEP-P${number}`,
  kind: 'export' as const,
  status: 'active' as const,
  entry: '.',
  symbol,
  since: '4.1.1' as const,
  removeIn: '5.0.0' as const,
  replacement: null,
  codemod: null,
  automation: 'none' as const,
  breaking: 'B14',
  message: `root export '${symbol}' ("${value}") is a tracked-reports path constant; reports/ is untracked evidence now — drop the import.`,
  doc: `#dep-${symbol.toLowerCase()}`,
})) satisfies DeprecationFragment;
