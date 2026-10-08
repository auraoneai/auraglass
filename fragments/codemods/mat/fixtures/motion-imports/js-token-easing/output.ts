// @ts-nocheck
import { motionTokens } from "aura-glass/motion/tokens";

export const springy = {
  // TODO(aura-glass 5): bounce easing has no 5.x token — mapped to ease.standard,
  // re-time against motionTokens, see docs/motion.md
  transition: { duration: 0.4, ease: motionTokens.ease.standard },
};
export const pop = {
  // TODO(aura-glass 5): elastic easing has no 5.x token — mapped to ease.standard,
  // re-time against motionTokens, see docs/motion.md
  transition: { duration: 0.3, ease: motionTokens.ease.standard },
};
