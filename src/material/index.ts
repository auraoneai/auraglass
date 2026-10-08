/**
 * Experimental ./material subpath (4.2 bridge, D-19).
 * Points at MAT's row-H build output when the next-line row-H inputs are
 * present on this line; otherwise the export key is pruned at pack time
 * by scripts/ci/prune-bridge-exports.mjs.
 */
export const MATERIAL_BRIDGE_VERSION = "4.3.0-experimental" as const;
