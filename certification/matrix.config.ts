/* certification/matrix.config.ts — QUAL (REQ-QUAL-06, -12). The sentinel set added to every affected-subject PR lane
   (L5, L6 reduced, L7, L8, L9): Surface regular/regular, Button Playground, Dialog open, so a PR that touches nothing
   "affected" still certifies the material root, the canonical control and the canonical overlay. A sentinel whose story
   is not in the build yet, or whose component is still a contract seed (`@ag-contract-seed` / `data-ag-seed`), is
   reported `pending` by the capture plan and the lane runner (packages/qa/src/evidence/laneRunner.ts), never dropped. */
import type { LaneRegistration } from '../src/contracts/fragments';
import type { Sentinel } from '../packages/qa/src/matrix/plan';

export const SENTINELS: readonly Sentinel[] = [
  // Surface regular/regular: the T0 Surface story (its default render is variant regular, thickness regular).
  { subject: 'Surface', story: 'playground' },
  { subject: 'Button', story: 'playground' },
  { subject: 'Dialog', state: 'open' },
];

/** Lanes whose PR scope runs affected subjects only, and therefore always adds the sentinel set. */
export const SENTINEL_LANES: readonly LaneRegistration['lane'][] = ['L5', 'L6', 'L7', 'L8', 'L9'];

export default SENTINELS;
