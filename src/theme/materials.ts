/* eslint-disable auraglass/no-inline-glass -- Theme Engine 2.0 exports raw material token values for downstream CSS variable generation, not inline component styles. */

export type GlassMaterialPreset =
  | "clear"
  | "regular"
  | "dense"
  | "luminous"
  | "inset";

export interface GlassMaterialTokens {
  backdropBlur: string;
  background: string;
  border: string;
  shadow: string;
}

export const glassMaterialPresets: Record<
  GlassMaterialPreset,
  GlassMaterialTokens
> = {
  clear: {
    backdropBlur: "18px",
    background: "rgba(255, 255, 255, 0.06)",
    border: "rgba(255, 255, 255, 0.16)",
    shadow: "0 18px 50px rgba(0, 0, 0, 0.18)",
  },
  regular: {
    backdropBlur: "28px",
    background: "rgba(8, 14, 28, 0.44)",
    border: "rgba(255, 255, 255, 0.14)",
    shadow: "0 24px 70px rgba(0, 0, 0, 0.28)",
  },
  dense: {
    backdropBlur: "36px",
    background: "rgba(5, 10, 22, 0.68)",
    border: "rgba(255, 255, 255, 0.12)",
    shadow: "0 30px 90px rgba(0, 0, 0, 0.36)",
  },
  luminous: {
    backdropBlur: "32px",
    background: "rgba(125, 211, 252, 0.12)",
    border: "rgba(125, 211, 252, 0.34)",
    shadow: "0 24px 84px rgba(56, 189, 248, 0.2)",
  },
  inset: {
    backdropBlur: "22px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.1)",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
  },
};
