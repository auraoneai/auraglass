// @ts-nocheck
import { motion } from "framer-motion";
import { useReducedMotion } from "aura-glass";

export function GlassFocusRing({ isVisible }: { isVisible: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    />
  );
}
