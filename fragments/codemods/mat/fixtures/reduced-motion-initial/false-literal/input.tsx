// @ts-nocheck
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
        initial={{ opacity: 0 }}
        animate={prefersReducedMotion ? false : { opacity: 1 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={disabled ? undefined : { opacity: 1 }}
      />
    </>
  );
}
