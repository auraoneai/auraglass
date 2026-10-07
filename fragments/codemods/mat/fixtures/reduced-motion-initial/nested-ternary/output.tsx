import { motion } from "framer-motion";

export function Shimmer({
  prefersReducedMotion,
  hover,
}: {
  prefersReducedMotion: boolean;
  hover: boolean;
}) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { backgroundPosition: "0% 0%" }}
      animate={hover ? { backgroundPosition: "200% 0%" } : { backgroundPosition: "100% 100%" }}
    />
  );
}
