import { motion } from "framer-motion";

export function GradientBorder({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <motion.div
      className="glass-border-2"
      initial={prefersReducedMotion ? false : undefined}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 6 }}
    />
  );
}
