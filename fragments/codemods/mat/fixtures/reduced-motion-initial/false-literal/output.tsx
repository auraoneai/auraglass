import { motion } from "framer-motion";

export function Pair({
  prefersReducedMotion,
  disabled,
}: {
  prefersReducedMotion: boolean;
  disabled: boolean;
}) {
  return (
    <>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        initial={disabled ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    </>
  );
}
