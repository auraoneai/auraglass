/* eslint-disable auraglass/no-inline-glass -- Theme Engine 2.0 exports raw material token values for downstream CSS variable generation, not inline component styles. */

export type GlassMaterialPreset =
  | "clear"
  | "regular"
  | "dense"
  | "luminous"
  | "inset";

export interface GlassMaterialTokens {
  backdropBlur: string;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  background: string;
  border: string;
  shadow: string;
  sheen: string;
}

export const glassMaterialPresets: Record<
  GlassMaterialPreset,
  GlassMaterialTokens
> = {
  clear: {
    backdropBlur: "16px",
    backdropFilter: "blur(16px) saturate(150%) brightness(1.06) contrast(1.03)",
    WebkitBackdropFilter: "blur(16px) saturate(150%) brightness(1.06) contrast(1.03)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)",
    border: "rgba(255, 255, 255, 0.16)",
    shadow: "0 18px 50px rgba(15, 23, 42, 0.18)",
    sheen: "inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  },
  regular: {
    backdropBlur: "24px",
    backdropFilter: "blur(24px) saturate(160%) brightness(1.08) contrast(1.04)",
    WebkitBackdropFilter: "blur(24px) saturate(160%) brightness(1.08) contrast(1.04)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.12) 100%)",
    border: "rgba(255, 255, 255, 0.20)",
    shadow: "0 24px 70px rgba(15, 23, 42, 0.24)",
    sheen: "inset 0 1px 0 rgba(255, 255, 255, 0.16)",
  },
  dense: {
    backdropBlur: "40px",
    backdropFilter: "blur(40px) saturate(170%) brightness(1.1) contrast(1.05)",
    WebkitBackdropFilter: "blur(40px) saturate(170%) brightness(1.1) contrast(1.05)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.18) 100%)",
    border: "rgba(255, 255, 255, 0.28)",
    shadow: "0 30px 90px rgba(15, 23, 42, 0.28)",
    sheen: "inset 0 1px 0 rgba(255, 255, 255, 0.20)",
  },
  luminous: {
    backdropBlur: "32px",
    backdropFilter: "blur(32px) saturate(175%) brightness(1.12) contrast(1.04)",
    WebkitBackdropFilter: "blur(32px) saturate(175%) brightness(1.12) contrast(1.04)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.16) 100%)",
    border: "rgba(255, 255, 255, 0.32)",
    shadow: "0 24px 84px rgba(15, 23, 42, 0.22)",
    sheen: "inset 0 1px 0 rgba(255, 255, 255, 0.24)",
  },
  inset: {
    backdropBlur: "24px",
    backdropFilter: "blur(24px) saturate(150%) brightness(1.06) contrast(1.03)",
    WebkitBackdropFilter: "blur(24px) saturate(150%) brightness(1.06) contrast(1.03)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.09) 100%)",
    border: "rgba(255, 255, 255, 0.16)",
    shadow: "inset 0 1px 0 rgba(255, 255, 255, 0.14)",
    sheen: "inset 0 -1px 0 rgba(255, 255, 255, 0.10)",
  },
};
