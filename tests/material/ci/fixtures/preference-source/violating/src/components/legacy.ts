// @ts-nocheck
// Fixture (REQ-MAT-51): 4.x reduced-motion modules re-exported / loaded by path.
export { MotionPreferenceContext } from '../contexts/MotionPreferenceContext';
export { Gate } from '../primitives/motion/ReducedMotionProvider';

export const load = () => import('../hooks/useEnhancedReducedMotion');
// violating fixture: legacy require() load path (REQ-MAT-51)
export const legacy = require('../hooks/useMotionPreference');
