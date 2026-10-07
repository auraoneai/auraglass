import { motion } from "framer-motion";

export function Panel({ canAnimate }: { canAnimate: boolean }) {
  return (
    <motion.div
      initial={canAnimate ? { x: -16, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
    />
  );
}
