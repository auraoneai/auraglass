import type { LaneRegistration } from '../../../src/contracts/fragments';
export default [
  { lane: 'L1', kind: 'node-script', path: 'scripts/ci/lint-literals.mjs', scope: 'pr', remote: false, failClosed: true },
] satisfies LaneRegistration[];
