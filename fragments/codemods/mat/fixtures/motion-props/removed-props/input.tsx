// @ts-nocheck
import { motion } from "framer-motion";
import { GlassPanel } from "aura-glass";

export function Card({ respectMotionPreference }: { respectMotionPreference?: boolean }) {
  return (
    <GlassPanel
      respectMotionPreference={respectMotionPreference}
      motionPolicy="reduced"
      initialMotionPolicy="full"
      animationPreset="fadeIn"
      disableAnimation={false}
      preset="slideUp"
    />
  );
}
