/* REQ-QUAL-12 (QUAL, FIN-429). Shard count for the L6 capture matrix (PRD-QUAL §4.3):
     shards = ceil(captures ÷ (measuredRate × 3,600))
   so each shard captures for at most 60 minutes. `measuredRate` (captures per second) is the rate recorded in a lane
   manifest for the runner tag; it is never assumed. Each cell produces CAPTURES_PER_CELL captures (the cell, its
   text-hidden twin and the surface-hidden scene). The ≤200 `parallel` cap and the child-pipeline YAML are the shard
   planner's (REQ-QUAL-65, scripts/qual/shard-plan.mjs). */

export const CAPTURES_PER_CELL = 3;
export const SHARD_SECONDS = 3600;

export function captureCount(cells: number, capturesPerCell: number = CAPTURES_PER_CELL): number {
  if (!Number.isInteger(cells) || cells < 0) throw new Error(`shard: cell count must be a non-negative integer (got ${cells})`);
  return cells * capturesPerCell;
}

export function shardCount(captures: number, measuredRate: number): number {
  if (!Number.isInteger(captures) || captures < 0) throw new Error(`shard: captures must be a non-negative integer (got ${captures})`);
  if (!Number.isFinite(measuredRate) || measuredRate <= 0) throw new Error(`shard: measured capture rate must be > 0 captures/s (got ${measuredRate})`);
  return Math.max(1, Math.ceil(captures / (measuredRate * SHARD_SECONDS)));
}

/** FNV-1a 32-bit; a stable assignment so a cell stays in its shard when unrelated cells are added. */
function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** 1-based shard index (Playwright `--shard=<i>/<n>` / GitLab CI_NODE_INDEX convention) for a cell id. */
export function shardOf(cellId: string, shards: number): number {
  if (!Number.isInteger(shards) || shards < 1) throw new Error(`shard: shard total must be an integer ≥ 1 (got ${shards})`);
  return (fnv1a(cellId) % shards) + 1;
}

/** Parses `CI_NODE_INDEX`/`CI_NODE_TOTAL` (or AG_SHARD="i/n"); null when the job is not sharded. */
export function shardFromEnv(env: Record<string, string | undefined>): { index: number; total: number } | null {
  let index: number | undefined;
  let total: number | undefined;
  if (env.AG_SHARD) {
    const m = /^(\d+)\/(\d+)$/.exec(env.AG_SHARD);
    if (!m) throw new Error(`shard: AG_SHARD must be "<index>/<total>" (got ${env.AG_SHARD})`);
    index = Number(m[1]); total = Number(m[2]);
  } else if (env.CI_NODE_TOTAL) {
    index = Number(env.CI_NODE_INDEX); total = Number(env.CI_NODE_TOTAL);
  } else {
    return null;
  }
  if (!Number.isInteger(total) || total < 1 || !Number.isInteger(index) || index < 1 || index > total) {
    throw new Error(`shard: invalid shard ${index}/${total}`);
  }
  return { index, total };
}
