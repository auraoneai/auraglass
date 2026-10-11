/* REQ-QUAL-32 (QUAL, FIN-434) — ported 4.x measurement layer: CSS colour / filter parsing helpers.
   Verbatim port of v4.1.0:tests/visual/design-system/token-purity-layout-audit.spec.ts (= legacy/tests/visual/design-system/token-purity-layout-audit.spec.ts at 21044a761)
   lines 662-792 and 2924-2956. Read from the tag, never imported; only `export`, imports, type-only `!`/tuple assertions (strict tsconfig; erased at compile time) and this header were added. */

export const parseRgba = (
  value: string
): { r: number; g: number; b: number; a: number } | null => {
  const match = value.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/
  );
  if (!match) return null;
  const alpha =
    match[4] === undefined
      ? 1
      : match[4].endsWith("%")
        ? Number.parseFloat(match[4]) / 100
        : Number.parseFloat(match[4]);
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: alpha,
  };
};

export const parseHex = (
  value: string
): { r: number; g: number; b: number; a: number } | null => {
  const match = value.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!match) return null;
  let hex = match[1]!;
  if (hex.length === 3 || hex.length === 4) {
    hex = [...hex].map((c) => `${c}${c}`).join("");
  }
  if (hex.length === 6) hex = `${hex}ff`;
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
    a: Number.parseInt(hex.slice(6, 8), 16) / 255,
  };
};

export const normalizeAlpha = (alpha: string | undefined): number =>
  alpha === undefined
    ? 1
    : alpha.endsWith("%")
      ? Number.parseFloat(alpha) / 100
      : Number.parseFloat(alpha);

export const parseColor = (
  value: string
): { r: number; g: number; b: number; a: number } | null => {
  const rgba = parseRgba(value);
  if (rgba) return rgba;
  const hex = parseHex(value);
  if (hex) return hex;
  // Chromium serializes modern color syntax as
  // color(srgb r g b / a) / color(srgb r g b) and percentage alphas.
  const modern = value.match(
    /^color\(\s*(srgb|display-p3|srgb-linear)\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/
  );
  if (!modern) return null;
  const toChannel = (channel: string): number => {
    if (channel.endsWith("%")) return (Number.parseFloat(channel) / 100) * 255;
    return Number(channel);
  };
  // Serialized sRGB values are already in 0..255 (Chromium emits
  // color(srgb 0.98 0.98 0.98 / 0.5) with 0..1 ranges in modern spec, but
  // computed styles return 0..255 scaled values).
  const r = toChannel(modern[2]!);
  const g = toChannel(modern[3]!);
  const b = toChannel(modern[4]!);
  // If values look like 0..1 (modern serialization), scale to 0..255.
  const max = Math.max(r, g, b);
  const scale = max <= 1 ? 255 : 1;
  return {
    r: r * scale,
    g: g * scale,
    b: b * scale,
    a: normalizeAlpha(modern[5]),
  };
};

export const extractColorAlphas = (
  value: string
): Array<{ alpha: number; rgb: string }> => {
  const out: Array<{ alpha: number; rgb: string }> = [];
  const rgbaRe =
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/g;
  let match: RegExpExecArray | null;
  while ((match = rgbaRe.exec(value))) {
    out.push({
      rgb: `${match[1]},${match[2]},${match[3]}`,
      alpha: normalizeAlpha(match[4]),
    });
  }
  const modernRe =
    /color\(\s*(srgb|display-p3|srgb-linear)\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/g;
  while ((match = modernRe.exec(value))) {
    const toChannel = (channel: string): number => {
      if (channel.endsWith("%"))
        return (Number.parseFloat(channel) / 100) * 255;
      return Number(channel);
    };
    const r = toChannel(match[2]!);
    const g = toChannel(match[3]!);
    const b = toChannel(match[4]!);
    const max = Math.max(r, g, b);
    const scale = max <= 1 ? 255 : 1;
    out.push({
      rgb: `${r * scale},${g * scale},${b * scale}`,
      alpha: normalizeAlpha(match[5]),
    });
  }
  return out;
};

export const isDarkChannel = (color: { r: number; g: number; b: number }) => {
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  return luminance < 80;
};

export const parseBlurPx = (filter: string): number | null => {
  const match = filter.match(/blur\(\s*([\d.]+)px\s*\)/);
  return match ? Number(match[1]) : null;
};

export const parseFilterComponent = (
  filter: string,
  name: "saturate" | "brightness" | "contrast"
) => {
  const match = filter.match(new RegExp(`${name}\\(\\s*([\\d.]+)\\s*\\)`));
  return match ? Number(match[1]) : null;
};

export const isWhiteNeutral = (color: { r: number; g: number; b: number }) =>
  Math.min(color.r, color.g, color.b) >= 245 &&
  Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b) <=
    6;

export const isPermittedScrim = (color: {
  r: number;
  g: number;
  b: number;
  a: number;
}) =>
  Math.abs(color.r - 15) <= 2 &&
  Math.abs(color.g - 23) <= 2 &&
  Math.abs(color.b - 42) <= 2 &&
  color.a >= 0.2 &&
  color.a <= 0.3;

export const splitCssList = (value: string): string[] => {
  const entries: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    else if (value[index] === ")") depth = Math.max(0, depth - 1);
    else if (value[index] === "," && depth === 0) {
      entries.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  const finalEntry = value.slice(start).trim();
  if (finalEntry) entries.push(finalEntry);
  return entries;
};
