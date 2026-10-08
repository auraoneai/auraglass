import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'framer-motion' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("framer-motion")>("framer-motion");
export default mod;
export const AnimatePresence = lazyMember<
  (typeof import("framer-motion"))["AnimatePresence"]
>("framer-motion", "AnimatePresence");
export const MotionConfig = lazyMember<
  (typeof import("framer-motion"))["MotionConfig"]
>("framer-motion", "MotionConfig");
// `motion` is polymorphic (HTMLElements is unexported upstream) — typed at call sites.
export const motion: any = lazyMember("framer-motion", "motion");
export const useAnimation = lazyMember<
  (typeof import("framer-motion"))["useAnimation"]
>("framer-motion", "useAnimation");
export const useAnimationFrame = lazyMember<
  (typeof import("framer-motion"))["useAnimationFrame"]
>("framer-motion", "useAnimationFrame");
export const useInView = lazyMember<
  (typeof import("framer-motion"))["useInView"]
>("framer-motion", "useInView");
export const useMotionValue = lazyMember<
  (typeof import("framer-motion"))["useMotionValue"]
>("framer-motion", "useMotionValue");
export const useReducedMotion = lazyMember<
  (typeof import("framer-motion"))["useReducedMotion"]
>("framer-motion", "useReducedMotion");
export const useScroll = lazyMember<
  (typeof import("framer-motion"))["useScroll"]
>("framer-motion", "useScroll");
export const useSpring = lazyMember<
  (typeof import("framer-motion"))["useSpring"]
>("framer-motion", "useSpring");
export const useTransform = lazyMember<
  (typeof import("framer-motion"))["useTransform"]
>("framer-motion", "useTransform");
