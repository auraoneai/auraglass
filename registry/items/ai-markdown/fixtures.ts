// fixtures.ts — deterministic sample data for ai-markdown (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.

export const MARKDOWN_BODY = '# Deploy report\n\nShip window **04:12–04:19** UTC.\n\n- no errors\n- 2 restarts';

/** A mid-stream slice that leaves emphasis/fences open. */
export const MARKDOWN_STREAMING_SLICE = MARKDOWN_BODY.slice(0, 40);
