/* Lane V motion helpers (MAT-237/-244). Remote-only: specs import from here. */
export { frames, pauseAnimations, countDistinctFrames } from './frames';
export type { FrameSample, FramesOptions, AnimationSnapshot } from './frames';
export { decodePng, diffRatio } from './png';
export type { DecodedPng } from './png';
export { settle, willChangeCount } from './settle';
export type { SettleResult, SettleOptions } from './settle';
export { instrumentIdle, readIdle, idleFor } from './idle';
export type { IdleStats } from './idle';
export { writeMotionReport, collectRow, currentSha, MOTION_REPORT_PATH } from './report';
export type { MotionSubjectRow, MotionReport } from './report';
