export interface GlassRgb {
  r: number;
  g: number;
  b: number;
}

const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, Math.round(value)));

export const normalizeHexColor = (input: string): string => {
  const value = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(value)) {
    return `#${value.toLowerCase()}`;
  }
  return "#7dd3fc";
};

export const hexToRgb = (input: string): GlassRgb => {
  const hex = normalizeHexColor(input).slice(1);
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
};

export const rgbToHex = ({ r, g, b }: GlassRgb): string =>
  `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")}`;

export const mixHex = (from: string, to: string, amount: number): string => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const mix = Math.min(1, Math.max(0, amount));
  return rgbToHex({
    r: a.r + (b.r - a.r) * mix,
    g: a.g + (b.g - a.g) * mix,
    b: a.b + (b.b - a.b) * mix,
  });
};

export const relativeLuminance = (input: string): number => {
  const { r, g, b } = hexToRgb(input);
  const convert = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  const srgb = [convert(r), convert(g), convert(b)];
  return srgb[0] * 0.2126 + srgb[1] * 0.7152 + srgb[2] * 0.0722;
};

export const contrastRatio = (
  foreground: string,
  background: string
): number => {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
};

export const bestTextColor = (
  background: string,
  light = "#f8fafc",
  dark = "#06111f"
): string =>
  contrastRatio(light, background) >= contrastRatio(dark, background)
    ? light
    : dark;
