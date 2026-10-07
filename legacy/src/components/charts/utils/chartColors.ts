export const DEFAULT_CHART_COLORS = [
  "#70d6ff",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#22d3ee",
  "#fb7185",
  "#c084fc",
  "#60a5fa",
  "#94a3b8",
];

const CSS_TOKEN_PATTERN = /\b(var|color-mix|hsl\(var|rgb\(var)\(/;
const CSS_VAR_PATTERN = /var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/;

const clampAlpha = (alpha: number) => Math.max(0, Math.min(1, alpha));

const expandHex = (hex: string) => {
  const normalized = hex.trim();
  if (/^#[0-9a-f]{3}$/i.test(normalized)) {
    return `#${normalized
      .slice(1)
      .split("")
      .map((part) => part + part)
      .join("")}`;
  }
  return normalized;
};

export const resolveChartColor = (
  color: string | undefined,
  fallback = DEFAULT_CHART_COLORS[0]
): string => {
  const candidate = color?.trim();
  if (!candidate || candidate === "currentColor") {
    return fallback;
  }

  if (!CSS_TOKEN_PATTERN.test(candidate)) {
    return candidate;
  }

  if (typeof window === "undefined") {
    return fallback;
  }

  const variableMatch = candidate.match(CSS_VAR_PATTERN);
  if (!variableMatch) {
    return fallback;
  }

  const [, variableName, rawFallback] = variableMatch;
  const root = document.documentElement;
  const resolved = window
    .getComputedStyle(root)
    .getPropertyValue(variableName)
    .trim();

  if (resolved && !CSS_TOKEN_PATTERN.test(resolved)) {
    return resolved;
  }

  if (rawFallback) {
    return resolveChartColor(rawFallback.trim(), fallback);
  }

  return fallback;
};

export const chartColorWithAlpha = (
  color: string | undefined,
  alpha: number,
  fallback = DEFAULT_CHART_COLORS[0]
): string => {
  const resolved = expandHex(resolveChartColor(color, fallback));
  const safeAlpha = clampAlpha(alpha);

  const hexMatch = resolved.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (hexMatch) {
    const value = hexMatch[1];
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
  }

  const rgbMatch = resolved.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i
  );
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${safeAlpha})`;
  }

  return chartColorWithAlpha(fallback, safeAlpha, DEFAULT_CHART_COLORS[0]);
};

export const resolveChartPalette = (palette?: string[]): string[] => {
  const source = palette && palette.length > 0 ? palette : DEFAULT_CHART_COLORS;
  return source.map((color, index) =>
    resolveChartColor(
      color,
      DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]
    )
  );
};
