/* scripts/release/lib/policy.mjs — the only code copy of the §4.4 change-class
   taxonomy (PRD-1 §4.4, D-27) and the single paths module for scripts/release/*.
   Line-neutral: lands identically on release/4.x. Human copy: docs/release/change-classes.md. */

// ---- classes ---------------------------------------------------------------
export const CLASSES = ['C-I', 'C-I-VF', 'C-E', 'C-D', 'C-D-IL', 'C-B'];
export const CLASS_NAMES = {
  'C-I': 'C-I',
  'C-I-VF': 'C-I (visual fix)',
  'C-E': 'C-E',
  'C-D': 'C-D',
  'C-D-IL': 'C-D (install-level)',
  'C-B': 'C-B',
};
// Rank for "maximum source class" and for the changeset floor.
export const CLASS_RANK = { 'C-I': 0, 'C-I-VF': 0, 'C-E': 1, 'C-D': 2, 'C-D-IL': 2, 'C-B': 3 };
// Minimum .changeset bump type per class (patch >= C-I, minor >= C-E/C-D, major = C-B).
export const CLASS_CHANGESET_FLOOR = { 'C-I': 'patch', 'C-I-VF': 'patch', 'C-E': 'minor', 'C-D': 'minor', 'C-D-IL': 'minor', 'C-B': 'major' };
export const BUMP_RANK = { patch: 0, minor: 1, major: 2 };

// ---- targets and allowed classes ------------------------------------------
export const TARGETS = ['4x-patch', '4x-minor', '4x-4.4', 'next-pre', '5x-patch', '5x-minor'];
// §4.4 "Allowed on" column. 4.x patches allow C-I, C-I (visual fix) plus exception
// deprecation entries (checked separately). 4.3 is the last minor that may add a
// 5.0 deprecation; 4.4 only takes late-find C-D entries whose B-id exists.
export const ALLOWED = {
  '4x-patch': ['C-I', 'C-I-VF'],
  '4x-minor': ['C-I', 'C-I-VF', 'C-E', 'C-D', 'C-D-IL'],
  '4x-4.4': ['C-I', 'C-I-VF', 'C-D'],
  'next-pre': ['C-I', 'C-I-VF', 'C-E', 'C-D', 'C-D-IL', 'C-B'],
  '5x-patch': ['C-I', 'C-I-VF'],
  '5x-minor': ['C-I', 'C-I-VF', 'C-E', 'C-D'],
};

export function allowedOn(cls, target) {
  const list = ALLOWED[target];
  if (!list) throw new Error(`policy: unknown target '${target}' (known: ${TARGETS.join(', ')})`);
  return list.includes(cls);
}

// ---- marker rules -----------------------------------------------------------
// A commit '!' or 'BREAKING CHANGE:' with a computed class below C-B fails;
// a computed C-B without either fails; any '!' on release/4.x fails.
export function checkMarkers(cls, { hasBang = false, hasBreaking = false, line = '5x' } = {}) {
  const errors = [];
  if (line === '4x' && hasBang) errors.push("a '!' marker is never allowed on release/4.x");
  if (CLASS_RANK[cls] < CLASS_RANK['C-B'] && (hasBang || hasBreaking)) {
    errors.push(`commit '!'/'BREAKING CHANGE:' marker but computed class is ${CLASS_NAMES[cls]} (< C-B)`);
  }
  if (cls === 'C-B' && !(hasBang || hasBreaking)) {
    errors.push("computed class C-B but the commits carry no '!' or 'BREAKING CHANGE:' marker");
  }
  return errors;
}

// Changeset bump types must be >= the computed class.
export function checkChangesetBump(cls, bumps) {
  const floor = BUMP_RANK[CLASS_CHANGESET_FLOOR[cls]];
  if (!bumps.length) return [];
  const top = Math.max(...bumps.map((b) => BUMP_RANK[b] ?? -1));
  return top >= floor ? [] : [`changeset bump '${bumps.join("', '")}' is below the floor for ${CLASS_NAMES[cls]} ('${CLASS_CHANGESET_FLOOR[cls]}')`];
}

// ---- visual tolerance (REQ-PLAT-19) ----------------------------------------
export const VISUAL_TOLERANCE = { pixelmatchThreshold: 0.1, includeAA: false, changedRatio: 0.001 };

// ---- install-level move conditions (§4.4 C-D (install-level)) ---------------
// Returns the list of unmet conditions (empty = move satisfies all four).
export function installLevelViolations({ depEntry, version, sources = {}, doctorReport, releaseNotes }) {
  const violations = [];
  const pkg = depEntry?.pkg ?? depEntry?.symbol ?? null;
  if (!(depEntry && depEntry.kind === 'dependency' && depEntry.since === version)) {
    violations.push(`no kind 'dependency' deprecation entry with since '${version}'`);
  }
  if (pkg) {
    const files = Object.keys(sources);
    const lazy = files.length === 0
      ? false
      : files.every((f) => /import\s*\(|createRequire|require\(/.test(sources[f]) &&
          sources[f].includes(`[aura-glass] ${pkg} is now an optional peer`));
    if (!lazy) violations.push(`importers of '${pkg}' do not all load it lazily with the missing-install error`);
    if (!(doctorReport && Array.isArray(doctorReport.undeclared))) {
      violations.push('doctor --v5 report with undeclared consumer imports is absent');
    }
    const first = releaseNotes && releaseNotes.firstList ? releaseNotes.firstList : [];
    if (!first.some((s) => String(s).includes(pkg))) violations.push(`release notes do not list '${pkg}' first`);
  }
  return violations;
}

// ---- paths module -----------------------------------------------------------
import { join } from 'node:path';
export const relPaths = (root = process.cwd()) => ({
  root,
  artifacts: (line) => join(root, '.artifacts', line === '4x' ? 'plat' : 'qual'),
  visualReport: (line) =>
    line === '4x' ? join(root, '.artifacts/plat/plat-test-visual-4x/visual-class.json')
                  : join(root, '.artifacts/qual/visual-class.json'),
  changeClassOut: join(root, '.artifacts/plat/change-class/change-class.json'),
  deprecationCoverage: join(root, '.artifacts/plat/deprecation-coverage.json'),
  changeClassesDoc: join(root, 'docs/release/change-classes.md'),
  visualFixesDir: join(root, 'docs/release/visual-fixes'),
  exceptionAllowlist: join(root, 'docs/release/exception-allowlist.json'),
  breakingRegister: join(root, 'docs/release/breaking-changes.json'),
  ledgerCorrections: join(root, 'docs/release/ledger-corrections.json'),
  decisionsDir: join(root, 'docs/release/decisions'),
  removalsDir: join(root, 'docs/release/decisions/removals'),
  schemaPath: join(root, 'docs/schemas/deprecations.schema.json'),
  deprecationsJson: join(root, 'deprecations.json'),
  generatedTs: join(root, 'src/internal/deprecations.generated.ts'),
  docsMigrationOut: join(root, 'apps/docs/generated/migration/deprecations.md'),
  capabilityLedger: join(root, 'docs/auraglass-5/capability-ledger.json'),
  fragmentsDir: join(root, 'fragments'),
  packageJson: join(root, 'package.json'),
});
