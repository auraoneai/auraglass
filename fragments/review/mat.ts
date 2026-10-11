/* fragments/review/mat.ts — MAT owns this file on both branches (§3.4). */
import type { ReviewItem } from '../../src/contracts/fragments';
export default [
  // --- lane 2e-B begin ---
  // MAT-350: L14 human visual review for the Material subjects. Sign-off is by a
  // named human reviewer only (QA-099 rubric); these rows register the subjects,
  // they do not assert a result. The six product surfaces are reviewed through
  // the ModesMatrix subjects at release scope.
  { id: 'MAT-R-01', subject: 'mat/modes-matrix — six product surfaces', criterion: 'specular-quality' },
  { id: 'MAT-R-02', subject: 'mat/modes-matrix — six product surfaces', criterion: 'optical-hierarchy' },
  { id: 'MAT-R-03', subject: 'mat/modes-matrix — six product surfaces', criterion: 'radius-rhythm' },
  { id: 'MAT-R-04', subject: 'mat/modes-matrix — six product surfaces', criterion: 'one-hand' },
  { id: 'MAT-R-05', subject: 'mat/modes-matrix — T0 matrix', criterion: 'specular-quality', note: 'T0 (non-material) surfaces keep zero specular response' },
  { id: 'MAT-R-06', subject: 'mat/motion-interactions', criterion: 'other', note: 'motion review: specular response, materialization, no bounce' },
  // --- lane 2e-B end ---
] satisfies ReviewItem[];
