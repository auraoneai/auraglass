import { DEFAULT_PERSONA_ID, PERSONA_IDS, type PersonaId } from "./designMatrix";

// Theme constants
export const THEME_NAMES = [
  "default",
  "dark",
  "light",
  "glass",
  "minimal",
  "neon",
  "vapor",
  "cyber",
] as const;

export const THEME_VARIANTS = [
  "default",
  "compact",
  "expanded",
] as const;

export const GLASS_QUALITY_TIERS = [
  "low",
  "medium",
  "high",
  "ultra",
] as const;

export const BLUR_STRENGTHS = [
  "none",
  "subtle",
  "light",
  "standard",
  "strong",
  "intense",
] as const;

export const GLOW_INTENSITIES = [
  "none",
  "subtle",
  "medium",
  "strong",
  "intense",
] as const;

export const PERSONA_DEFAULT: PersonaId = DEFAULT_PERSONA_ID;

export const AVAILABLE_PERSONAS: readonly PersonaId[] = PERSONA_IDS;
