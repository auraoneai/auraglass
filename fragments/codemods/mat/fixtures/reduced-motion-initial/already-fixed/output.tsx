import { motion } from "framer-motion";

export function Badge({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      initial={reducedMotion ? false : { y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    />
  );
}
