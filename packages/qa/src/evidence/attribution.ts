/* QUAL. Which REQ-FIN fixes an offender in a given file (PRD-F §5), for expiring-baseline rows.
   Owner comes from contracts/ownership.json (ownership.ts); the REQ-FIN from the most specific
   path prefix, falling back to the owner's foundation REQ-FIN. This is attribution, not data:
   a wrong row is corrected by the owning WP when it deletes the row. */
const BY_PREFIX: ReadonlyArray<readonly [RegExp, string]> = [
  [/^registry\//, ''],                                  // resolved by owner below (SURF 88 / PLAT 42)
  [/^src\/compat\/cmp\//, 'REQ-FIN-76'],
  [/^src\/compat\/surf\//, 'REQ-FIN-80'],
  [/^src\/compat\/mat\//, 'REQ-FIN-57'],
  [/^src\/(icons|forms|primitives)\//, 'REQ-FIN-71'],
  [/^src\/material\//, 'REQ-FIN-55'],
  [/^src\/theme\//, 'REQ-FIN-52'],
  [/^src\/tokens\//, 'REQ-FIN-50'],
  [/^src\/motion\//, 'REQ-FIN-58'],
  [/^src\/a11y\//, 'REQ-FIN-59'],
  [/^src\/app-shell\//, 'REQ-FIN-81'],
  [/^src\/data\//, 'REQ-FIN-83'],
  [/^src\/date\//, 'REQ-FIN-84'],
  [/^src\/ai\//, 'REQ-FIN-85'],
  [/^src\/(media|backdrops)\//, 'REQ-FIN-86'],
  [/^src\/(charts|three)\//, 'REQ-FIN-87'],
];
const BY_OWNER: Readonly<Record<string, string>> = {
  MAT: 'REQ-FIN-59', CMP: 'REQ-FIN-70', SURF: 'REQ-FIN-80', QUAL: 'REQ-FIN-106', PLAT: 'REQ-FIN-37', CONTRACT: 'REQ-FIN-37',
};
const REGISTRY_BY_OWNER: Readonly<Record<string, string>> = { SURF: 'REQ-FIN-88', PLAT: 'REQ-FIN-42' };

/** Story-file offenders go to the stream's story reconciliation REQ-FIN (MAT: REQ-FIN-59 per the
    QUAL-49..57 transfer); export/source offenders to the REQ-FIN of the source area. */
export function reqFinFor(owner: string, file: string): string {
  if (file.startsWith('registry/') && REGISTRY_BY_OWNER[owner]) return REGISTRY_BY_OWNER[owner]!;
  if (/\.stories\.[cm]?[jt]sx?$/.test(file)) return BY_OWNER[owner] ?? 'REQ-FIN-37';
  const hit = BY_PREFIX.find(([re, req]) => req && re.test(file));
  return hit ? hit[1] : (BY_OWNER[owner] ?? 'REQ-FIN-37');
}
