/* certification/matrix.config.ts — QUAL (REQ-QUAL-06, -12). The sentinel set added to every affected-subject PR lane
   (L5, L6 reduced, L7, L8, L9): Surface regular/regular, Button Playground, Dialog open. A sentinel whose story is not in
   the build yet (still a seed) is reported `pending`, never dropped silently. */
import type { Sentinel } from '../packages/qa/src/matrix/plan';

export const SENTINELS: readonly Sentinel[] = [
  // Surface regular/regular: the T0 Surface story (its default render is variant regular, thickness regular).
  { subject: 'Surface', story: 'playground' },
  { subject: 'Button', story: 'playground' },
  { subject: 'Dialog', state: 'open' },
];

export default SENTINELS;
