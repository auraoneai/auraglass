import { motion } from "framer-motion";

export function Badge({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={reducedMotion ? {} : { y: 0, opacity: 1 }}
    />
  );
}
