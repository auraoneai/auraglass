/* REQ-QUAL-32 (QUAL, FIN-434) — ported 4.x measurement layer: token invariants (material chain, frost, borders, sheen, text floors, paint).
   Verbatim port of v4.1.0:tests/visual/design-system/token-purity-layout-audit.spec.ts (= legacy/tests/visual/design-system/token-purity-layout-audit.spec.ts at 21044a761)
   lines 2229-2275 and 2958-3244. Read from the tag, never imported; only `export`, imports, type-only `!`/tuple assertions (strict tsconfig; erased at compile time) and this header were added. */
import { extractColorAlphas, isDarkChannel, isPermittedScrim, isWhiteNeutral, parseBlurPx, parseColor, parseFilterComponent, splitCssList } from './color';
import type { PaintInspection, SurfaceInspection, TextInspection } from './types';

// These exports deliberately present color-bearing media, generated palettes,
// maps, or scientific simulations as their primary content. Their surrounding
// chrome remains subject to every material/paint invariant; only pixel-level
// findings produced by the semantic content itself are classified here.
export const semanticVisualizationTargetIds = new Set([
  "glass-color-scheme-generator",
  "liquid-glass-map-controls",
  "glass-gallery",
  "glass-image-viewer",
  "glass-lazy-image",
  "dynamic-atmosphere",
  "glass360-viewer",
  "glass-arpreview",
  "glass-biome-simulator",
  "glass-aurora-display",
  "glass-probability-cloud",
  "glass-advanced-video-player",
  "glass-particles",
  "particle-background",
  "glass-heatmap",
]);

export const isSemanticVisualizationPixelFinding = (failure: string) =>
  failure.startsWith("whole-viewport problematic tint:") ||
  failure.startsWith("dominant-canvas-chroma-darkness:") ||
  failure.startsWith("large-surface paint broad low-alpha tint wash") ||
  // Heatmap cells are data ink, not chrome: their fill encodes the value and
  // legitimately spans the full sequential scale, including dark navy lows.
  // Scoped to the cell class so genuinely navy chrome elsewhere still fails.
  (failure.includes("interactive paint dark/navy") &&
    failure.includes("glass-heatmap-cell"));

export const isOpaqueDarkFill = (surface: SurfaceInspection) => {
  const bg = parseColor(surface.backgroundColor);
  if (bg && isDarkChannel(bg) && bg.a >= 0.5) return true;
  for (const image of surface.backgroundImages) {
    const stops = extractColorAlphas(image);
    for (const stop of stops) {
      if (stop.alpha < 0.5) continue;
      const [r, g, b] = stop.rgb.split(",").map(Number) as [number, number, number];
      if (isDarkChannel({ r, g, b })) {
        return true;
      }
    }
  }
  return false;
};

export const checkFilterChain = (
  label: string,
  filter: string,
  surface: SurfaceInspection,
  failures: string[]
) => {
  const canonicalBlurs = new Set([16, 24, 32, 40, 48]);
  if (!filter || filter === "none") {
    failures.push(`${label} must resolve non-none on .${surface.className}`);
    return;
  }
  const blur = parseBlurPx(filter);
  if (blur === null || !canonicalBlurs.has(blur)) {
    failures.push(
      `${label} blur not in canonical scale (16|24|32|40|48px): "${filter}" on .${surface.className}`
    );
  }
  const saturate = parseFilterComponent(filter, "saturate");
  const brightness = parseFilterComponent(filter, "brightness");
  const contrast = parseFilterComponent(filter, "contrast");
  if (saturate === null || saturate < 1.4) {
    failures.push(
      `${label} saturate < 1.4 or missing: "${filter}" on .${surface.className}`
    );
  }
  if (brightness === null || brightness < 1.0) {
    failures.push(
      `${label} brightness < 1.0 or missing: "${filter}" on .${surface.className}`
    );
  }
  if (contrast === null || contrast < 0.95 || contrast > 1.2) {
    failures.push(
      `${label} contrast outside [0.95,1.2]: "${filter}" on .${surface.className}`
    );
  }
};

export const checkTokenInvariants = (
  surfaces: SurfaceInspection[],
  texts: TextInspection[],
  paints: PaintInspection[] = []
) => {
  const failures: string[] = [];
  const realSurfaces = surfaces.filter(
    (surface) => surface.surfaceKind !== "decorative"
  );
  if (realSurfaces.length === 0) {
    failures.push(
      "no glass surface found (backdrop-filter or glass-named element)"
    );
  }

  for (const surface of realSurfaces) {
    // Chromium intentionally drops unsupported -webkit-backdrop-filter
    // declarations from CSSOM and exposes no prefixed computed property, even
    // when the source rule authored both spellings. The independent static
    // material audit proves same-rule authored provenance. Runtime proves the
    // effective chains and their parity instead of fabricating CSSOM presence.
    checkFilterChain(
      "backdrop-filter",
      surface.backdropFilter,
      surface,
      failures
    );
    checkFilterChain(
      "-webkit-backdrop-filter",
      surface.webkitBackdropFilter,
      surface,
      failures
    );
    const filterComponents = (filter: string) => ({
      blur: parseBlurPx(filter),
      saturate: parseFilterComponent(filter, "saturate"),
      brightness: parseFilterComponent(filter, "brightness"),
      contrast: parseFilterComponent(filter, "contrast"),
    });
    const standardComponents = filterComponents(surface.backdropFilter);
    const webkitComponents = filterComponents(surface.webkitBackdropFilter);
    if (
      standardComponents.blur !== webkitComponents.blur ||
      standardComponents.saturate !== webkitComponents.saturate ||
      standardComponents.brightness !== webkitComponents.brightness ||
      standardComponents.contrast !== webkitComponents.contrast
    ) {
      failures.push(
        `effective backdrop-filter spellings diverge on .${surface.className}: standard="${surface.backdropFilter}" webkit="${surface.webkitBackdropFilter}"`
      );
    }

    const bgColor = parseColor(surface.backgroundColor);
    const gradientColors = surface.backgroundImages.flatMap((image) => {
      const colors = extractColorAlphas(image);
      const recognizedRemoved = image
        .replace(
          /rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+(?:[,\s/]+[\d.]+%?)?\s*\)/gi,
          ""
        )
        .replace(
          /color\(\s*(?:srgb|display-p3|srgb-linear)\s+[\d.]+%?\s+[\d.]+%?\s+[\d.]+%?(?:\s*\/\s*[\d.]+%?)?\s*\)/gi,
          ""
        );
      if (
        /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\s*\(/i.test(
          recognizedRemoved
        )
      ) {
        failures.push(
          `gradient contains an unparsed color expression and cannot prove every stop on .${surface.className}: "${image}"`
        );
      }
      return colors;
    });
    let hasWhiteFrost = false;
    gradientColors.forEach(({ alpha, rgb }, stopIndex) => {
      const [r, g, b] = rgb.split(",").map(Number) as [number, number, number];
      const color = { r, g, b, a: alpha };
      if (isWhiteNeutral(color)) {
        hasWhiteFrost = hasWhiteFrost || (alpha >= 0.015 && alpha <= 0.35);
        if (alpha < 0.015 || alpha > 0.35) {
          failures.push(
            `white gradient stop ${stopIndex + 1} alpha ${alpha} outside [0.015,0.35] on .${surface.className}`
          );
        }
      } else if (!isPermittedScrim(color)) {
        failures.push(
          `non-neutral gradient stop ${stopIndex + 1} rgba(${r},${g},${b},${alpha}) is not white frost or canonical scrim on .${surface.className}`
        );
      }
    });

    if (bgColor && bgColor.a > 0) {
      if (isWhiteNeutral(bgColor)) {
        hasWhiteFrost =
          hasWhiteFrost || (bgColor.a >= 0.015 && bgColor.a <= 0.35);
        if (bgColor.a < 0.015 || bgColor.a > 0.35) {
          failures.push(
            `white background-color alpha ${bgColor.a} outside [0.015,0.35] on .${surface.className}`
          );
        }
      } else if (!isPermittedScrim(bgColor)) {
        failures.push(
          `non-neutral background-color rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a}) is not white frost or canonical scrim on .${surface.className}`
        );
      }
    }
    if (!hasWhiteFrost) {
      failures.push(
        `surface lacks a white-neutral frost fill in [0.015,0.35] on .${surface.className}`
      );
    }
    if (isOpaqueDarkFill(surface)) {
      failures.push(`opaque dark fill >= 0.50 on .${surface.className}`);
    }

    const borders =
      surface.borders.length > 0
        ? surface.borders
        : [{ color: surface.borderTopColor, width: surface.borderWidth }];
    for (const borderRecord of borders) {
      const borderWidth = Number.parseFloat(borderRecord.width || "0");
      if (borderWidth <= 0) continue;
      const border = parseColor(borderRecord.color);
      if (!border || border.a < 0.12) {
        failures.push(
          `border alpha ${border?.a ?? "unparsed"} < 0.12 on .${surface.className}`
        );
        break;
      }
    }

    const insetLayers = splitCssList(surface.boxShadow).filter((layer) =>
      /\binset\b/.test(layer)
    );
    const sheenAlphas = [...surface.sheenAlphas];
    const highlightAlphas: number[] = [];
    for (const layer of insetLayers) {
      const whiteColors = extractColorAlphas(layer).filter(({ rgb }) => {
        const [r, g, b] = rgb.split(",").map(Number) as [number, number, number];
        return isWhiteNeutral({ r, g, b });
      });
      const withoutColors = layer
        .replace(/rgba?\([^)]*\)/g, "")
        .replace(/color\([^)]*\)/g, "");
      const dimensions = [...withoutColors.matchAll(/-?[\d.]+px/g)].map(
        (match) => Math.abs(Number.parseFloat(match[0]))
      );
      const blurRadius = dimensions[2] ?? 0;
      for (const color of whiteColors) {
        if (blurRadius > 0) sheenAlphas.push(color.alpha);
        else highlightAlphas.push(color.alpha);
      }
    }
    if (sheenAlphas.some((alpha) => alpha < 0.1 || alpha > 0.18)) {
      failures.push(
        `inner-glow/sheen alpha outside [0.10,0.18] on .${surface.className}`
      );
    }
    if (
      surface.elevationLevel !== null &&
      surface.elevationLevel <= 3 &&
      !sheenAlphas.some((alpha) => alpha >= 0.1 && alpha <= 0.18)
    ) {
      failures.push(
        `level${surface.elevationLevel} surface is missing canonical inner-glow/sheen on .${surface.className}`
      );
    }
    if (surface.specularAlpha !== null)
      highlightAlphas.push(surface.specularAlpha);
    if (highlightAlphas.some((alpha) => alpha > 0.32)) {
      failures.push(`highlight alpha > 0.32 on .${surface.className}`);
    }
    if (
      surface.noiseOpacity !== null &&
      (!Number.isFinite(surface.noiseOpacity) || surface.noiseOpacity > 0.1)
    ) {
      failures.push(
        `noise opacity ${surface.noiseOpacity} > 0.10 on .${surface.className}`
      );
    }
  }

  const roleFloors: Record<TextInspection["role"], number> = {
    primary: 0.9,
    secondary: 0.7,
    tertiary: 0.5,
    unclassified: 0.5,
  };
  for (const text of texts) {
    const floor = roleFloors[text.role];
    if (text.effectiveAlpha < floor) {
      failures.push(
        `${text.role} text effective alpha ${text.effectiveAlpha.toFixed(3)} < ${floor.toFixed(2)} on ${text.selector}.${text.className}: "${text.text}"`
      );
    }
    const largeText =
      text.fontSize >= 24 || (text.fontSize >= 18.66 && text.fontWeight >= 700);
    const contrastFloor = largeText ? 3 : 4.5;
    if (text.contrastRatio === null) {
      failures.push(
        `cannot prove local contrast for ${text.selector}.${text.className}: foreground="${text.foregroundColor}" backdrop="${text.localBackdropColor}" text="${text.text}"`
      );
    } else if (text.contrastRatio < contrastFloor) {
      failures.push(
        `${text.role} text local contrast ${text.contrastRatio.toFixed(2)}:1 < ${contrastFloor.toFixed(1)}:1 on ${text.selector}.${text.className}; foreground="${text.foregroundColor}" effectiveBackdrop="${text.localBackdropColor}" font=${text.fontSize}px/${text.fontWeight}; text="${text.text}"`
      );
    }
  }

  // Apple-like liquid glass uses neutral frost and restrained semantic color,
  // not opaque navy controls or a saturated blue/teal story canvas. Inspect
  // every interactive fill and viewport-dominant painted region, including
  // story wrappers that are deliberately excluded from material-token checks.
  for (const paint of paints) {
    paint.colors.forEach((color, index) => {
      if (color.a < 0.2) return;
      const max = Math.max(color.r, color.g, color.b);
      const min = Math.min(color.r, color.g, color.b);
      const chroma = max - min;
      const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
      const saturatedCanvas =
        (paint.paintRole === "canvas" || paint.paintRole === "large-surface") &&
        color.a >= 0.45 &&
        chroma > 48;
      const darkColoredControl =
        paint.paintRole === "interactive" &&
        color.a >= 0.45 &&
        luminance < 105 &&
        chroma > 18;
      const neutralScrim =
        paint.paintRole !== "interactive" &&
        color.a <= 0.3 &&
        luminance < 45 &&
        chroma <= 30;
      const broadTintWash =
        (paint.paintRole === "canvas" || paint.paintRole === "large-surface") &&
        color.a >= 0.08 &&
        chroma > 18 &&
        !neutralScrim;
      if (saturatedCanvas || darkColoredControl || broadTintWash) {
        failures.push(
          `${paint.paintRole} paint ${saturatedCanvas ? "saturated" : darkColoredControl ? "dark/navy" : "broad low-alpha tint wash"} rgba(${color.r},${color.g},${color.b},${color.a}) chroma=${chroma.toFixed(1)} luminance=${luminance.toFixed(1)} at stop ${index + 1} on ${paint.selector}.${paint.className}; geometry=${paint.x},${paint.y},${paint.width}x${paint.height}; backgroundColor="${paint.backgroundColor}" backgroundImage="${paint.backgroundImage}" boxShadow="${paint.boxShadow}"`
        );
      }
    });
  }
  return failures;
};
