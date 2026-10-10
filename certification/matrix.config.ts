/* certification/matrix.config.ts — QUAL (REQ-QUAL-06). Sentinel set for affected-subject PR lanes.

   Affected-subject PR lanes (L5, L6 reduced, L7, L8, L9) always add these three subject-states, so a PR that
   touches nothing "affected" still certifies the material root, the canonical control and the canonical overlay.
   A sentinel whose component is still a contract seed (`@ag-contract-seed` / `data-ag-seed` in its source) is
   reported `pending` by the lane runner (packages/qa/src/evidence/laneRunner.ts), never silently dropped. */
import type { LaneRegistration } from '../src/contracts/fragments';

export interface Sentinel {
  /** ComponentMeta.name (S-31), resolved through the SubjectIndex — never fuzzy-matched. */
  subject: string;
  /** Story export (`Playground`) or state name (`open`, `regular/regular` = variant/thickness). */
  state: string;
}

export const SENTINELS: readonly Sentinel[] = [
  { subject: 'Surface', state: 'regular/regular' },
  { subject: 'Button', state: 'Playground' },
  { subject: 'Dialog', state: 'open' },
];

/** Lanes whose PR scope runs affected subjects only, and therefore always adds the sentinel set. */
export const SENTINEL_LANES: readonly LaneRegistration['lane'][] = ['L5', 'L6', 'L7', 'L8', 'L9'];

export default { SENTINELS, SENTINEL_LANES };
