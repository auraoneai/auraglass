/* AuraGlass 5.0 — material type surface (architecture §4.2, §4.3). Types only: this module
   has no runtime footprint. Contract-frozen shapes come from src/contracts/material.ts and
   are re-exported so consumers have one import site; MaterialSpec is defined here. */
import type * as React from 'react';
import type {
  MaterialVariant, Thickness, Layer, LayerAttr, ContentMaterial, Backdrop, Tier, DomTier,
  Engine, Transparency, Shape, EdgeStyle, MaterialRole, MaterialAttributes,
  SurfaceProps as ContractSurfaceProps, SurfaceGroupProps, EnvironmentProps,
  ScrollEdgeProps, ConcentricFrameProps,
} from '../contracts/material';
import type { RadiusToken, SpaceToken } from '../contracts/tokens';

export type {
  MaterialVariant, Thickness, Layer, LayerAttr, ContentMaterial, Backdrop, DomTier,
  Engine, Transparency, Shape, EdgeStyle, MaterialRole, MaterialAttributes,
  SurfaceGroupProps, EnvironmentProps, ScrollEdgeProps, ConcentricFrameProps,
  RadiusToken, SpaceToken,
};

/**
 * Rendering tier. `lightweight | standard | enhanced` are written to `<html data-ag-tier>`
 * by `AuraGlassScript` (pre-paint) or a subtree override. `cinematic` is never returned by
 * core (`useMaterialTier` resolves it to `standard`); it exists only inside
 * `@auraglass/labs`, whose residents refract library-owned pixels (no DOM rasterisation,
 * ≤ 1 WebGL context per page, paused offscreen and when hidden) and fall back to the
 * standard `Surface` under `calm`/`none` motion, non-`glass` transparency, forced colours
 * or context loss.
 */
export type { Tier };

/** Component-internal size class (D-07): never a public prop; maps to thickness in resolveRole. */
export type SizeClass = 'control' | 'bar' | 'panel' | 'sheet';

/** CSS length literal used inside a MaterialSpec (compiled to token references). */
export type CssLength = `${number}px`;
/** OKLCH colour string, e.g. `oklch(96% 0.01 260)`. */
export type OklchColor = `oklch(${string})`;
/** OKLCH colour with alpha, e.g. `oklch(96% 0.01 260 / 0.6)`. */
export type OklchAlpha = `oklch(${string} / ${number})`;
export type CssAngle = `${number}deg`;
/** Shadow token reference emitted into `--ag-shadow-{thin,regular,thick}`. */
export type ShadowSpec = { ambient: string; key: string };

/** REQ-MAT-09 interaction-state values (the `state` field of MaterialSpec). */
export interface MaterialStateSpec {
  hoverSpecular: number;    // → --ag-state-hover-specular (+0.15)
  pressGlow: number;        // → --ag-state-press-glow (0.25)
  disabledAlpha: number;    // → --ag-state-disabled-alpha (0.45)
  hoverFloor: number;       // → --_ag-state-hover-floor (+0.02)
  pressFloor: number;       // → --_ag-state-press-floor (+0.04)
  selectedTint: number;     // → --_ag-state-selected-tint (accent 0.16)
  loadingAlpha: number;     // → --_ag-state-loading-alpha (0.7)
  draggingLift: string;
  draggingSpecular: number;
  dropTargetRim: CssLength; // → --_ag-state-drop-target-rim (2px accent)
  dropTargetFill: number;   // → --_ag-state-drop-target-fill (+0.06)
}

/**
 * The single material definition (architecture §4.3, DTCG `$type: "glass-material"`).
 * `material/material.tokens.json` is the sole source; `defineMaterial` validates and
 * freezes a literal spec. `opacityFloor` is the *pre-solve* table — the compiler's
 * contrast-solve transform replaces every cell with the solved minimum alpha.
 */
export interface MaterialSpec {
  /** Backdrop blur per thickness; ≤ 32px everywhere (initial 12/20/32). */
  blur: Record<Thickness, CssLength>;
  /** One saturation value shared by every blurred cell (~1.6). */
  saturation: number;
  /** Default (light-scheme) brightness; the dark value travels as a token mode. */
  brightness: number;
  /** Tint alpha per declared backdrop (derived from sys.color.canvas, never authored per preset). */
  tint: Record<'light' | 'dark' | 'media', number>;
  /** SOLVED minimum fill alpha per [transparency][thickness][backdrop] (REQ-MAT-10 output). */
  opacityFloor: Record<Transparency, Record<Thickness, Record<'light' | 'dark' | 'media', number>>>;
  /** Fill for a nested (inner) surface — never blurred. */
  innerFill: Record<'light' | 'dark', OklchAlpha>;
  /** Content materials (D-08): opaque fills, no backdrop filter. */
  content: Record<ContentMaterial, Record<'light' | 'dark', OklchColor>>;
  rim: { width: Record<Thickness, CssLength>; light: OklchAlpha; shade: OklchAlpha };
  specular: { intensity: number; spread: CssAngle };
  refraction: { bezel: Record<Thickness, CssLength>; scale: Record<Thickness, number> };
  grain: { opacity: number; asset: 'ag-grain-128.avif' };
  /** Ambient + key per thickness, scheme-resolved (overlays always take `thick`). */
  shadow: Record<Thickness, Record<'light' | 'dark', ShadowSpec>>;
  /** `modal` alpha for the scrim sibling; `blur` is capped at 12px (REQ-MAT-31). */
  scrim: { clearOverBright: number; modal: number; blur: CssLength };
  /** Lightweight tier fill, alpha ≥ 0.85, scheme-resolved (never a black slab). */
  fallbackFill: Record<'light' | 'dark', OklchAlpha>;
  state: MaterialStateSpec;
}

/** The 17 deleted 4.x optical props (REQ-MAT-24): each is a type error on SurfaceProps. */
export type DeletedGlassProp =
  | 'caustics' | 'chromatic' | 'lighting' | 'ior' | 'tier' | 'depth' | 'tint'
  | 'glowIntensity' | 'glowColor' | 'optimization' | 'hardwareAcceleration' | 'intensity'
  | 'blur' | 'parallax' | 'adaptive' | 'magnet' | 'cursorHighlight';

/**
 * `Surface` props: the contract shape plus never-markers so the deleted 4.x props and
 * `as` fail type-checking even through a spread (REQ-MAT-24; `refraction` keeps its
 * boolean 5.0 meaning and is not deleted).
 */
export interface SurfaceProps extends ContractSurfaceProps {
  as?: never;
  caustics?: never;
  chromatic?: never;
  lighting?: never;
  ior?: never;
  depth?: never;
  tint?: never;
  glowIntensity?: never;
  glowColor?: never;
  optimization?: never;
  hardwareAcceleration?: never;
  intensity?: never;
  blur?: never;
  parallax?: never;
  adaptive?: never;
  magnet?: never;
  cursorHighlight?: never;
  /** `tier` is deleted as a prop; the type name stays free for the Tier value. */
  tier?: never;
}
