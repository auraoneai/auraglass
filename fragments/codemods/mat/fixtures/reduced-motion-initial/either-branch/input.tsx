import { motion } from "framer-motion";

export function Panel({ canAnimate }: { canAnimate: boolean }) {
  return (
    <motion.div
      initial={{ x: -16, opacity: 0 }}
      animate={canAnimate ? { x: 0, opacity: 1 } : {}}
    />
  );
}
