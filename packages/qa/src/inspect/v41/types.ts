/* REQ-QUAL-32 (QUAL, FIN-434) — ported 4.x measurement layer: inspection record types.
   Verbatim port of v4.1.0:tests/visual/design-system/token-purity-layout-audit.spec.ts (= legacy/tests/visual/design-system/token-purity-layout-audit.spec.ts at 21044a761)
   lines 312-389. Read from the tag, never imported; only `export`, imports, type-only `!`/tuple assertions (strict tsconfig; erased at compile time) and this header were added. */

export type SurfaceInspection = {
  selector: string;
  className: string;
  inputType: string | null;
  surfaceKind: "backdrop" | "glass-surface" | "liquid" | "decorative";
  x: number;
  y: number;
  width: number;
  height: number;
  backdropFilter: string;
  webkitBackdropFilter: string;
  backdropFilterAuthored: boolean;
  webkitBackdropFilterAuthored: boolean;
  backgroundColor: string;
  backgroundImage: string;
  backgroundImages: string[];
  borderTopColor: string;
  borderWidth: string;
  borders: Array<{ color: string; width: string }>;
  boxShadow: string;
  color: string;
  overflowX: string;
  overflowY: string;
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
  elevationLevel: number | null;
  noiseOpacity: number | null;
  specularAlpha: number | null;
  sheenAlphas: number[];
};

export type TextInspection = {
  selector: string;
  className: string;
  role: "primary" | "secondary" | "tertiary" | "unclassified";
  colorAlpha: number;
  effectiveAlpha: number;
  foregroundColor: string;
  localBackdropColor: string;
  contrastRatio: number | null;
  fontSize: number;
  fontWeight: number;
  text: string;
};

export type PaintInspection = {
  selector: string;
  className: string;
  paintRole: "canvas" | "large-surface" | "interactive";
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage: string;
  boxShadow: string;
  colors: Array<{ r: number; g: number; b: number; a: number }>;
};

export type LayoutIssue = { type: string; detail: string };

export type PresentationIssue = { type: string; detail: string };

export type ViewportColorCensus = {
  sampledPixels: number;
  coloredPixels: number;
  coloredAreaRatio: number;
  tintedNeutralPixels: number;
  tintedNeutralRatio: number;
  coolPixels: number;
  warmPixels: number;
  dominantCast: "cool" | "warm" | "mixed" | "neutral";
  meanChroma: number;
  meanNeutralChroma: number;
  localizedColoredRegions: number;
};
