/* FIN-G lane fixture (G-18, REQ-QUAL-21..23): pending vs failure.

   A lane whose producer has not landed (no flagship subjects in the subject
   index, a scene asset missing, …) must not pass. Before release it raises
   an `AgPendingProducer` error whose message starts with `pending:` — the
   QUAL lane runner (certification/run.mjs, G-03) classifies that as
   `pending` (PRD-F §4.3 rule 2; same convention as tests/helpers perf.bci).
   At AG_SCOPE=release the same condition is a plain failure (REQ-QUAL-06). */

export const LANE_SCOPE = (process.env.AG_SCOPE ?? 'pr') as 'pr' | 'main' | 'nightly' | 'release';

export class AgPendingProducer extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgPendingProducer';
  }
}

/** Throws: `pending:` before release, a failure at release scope. */
export function pendingOrFail(reason: string, producer: string): never {
  if (LANE_SCOPE === 'release') throw new Error(`release scope: ${reason} (producer: ${producer})`);
  throw new AgPendingProducer(`pending: ${reason} (producer: ${producer})`);
}
