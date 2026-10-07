// @ts-nocheck
import { motion } from "framer-motion";

export function Toast({ shouldAnimate }: { shouldAnimate: boolean }) {
  return (
    <motion.div
      initial={!shouldAnimate ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}
