// @ts-nocheck
import { motion } from "framer-motion";

export function Toast({ shouldAnimate }: { shouldAnimate: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={!shouldAnimate ? {} : { opacity: 1 }}
    />
  );
}
