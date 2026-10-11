// @ts-nocheck
import { motion } from "framer-motion";

export function GradientBorder({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <motion.div
      className="glass-border-2"
      animate={
        prefersReducedMotion
          ? {}
          : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
      }
      transition={{ duration: 6 }}
    />
  );
}
