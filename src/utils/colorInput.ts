"use client";

const TOKEN_COLOR_FALLBACKS: Record<string, string> = {
  "--glass-color-primary": "#3b82f6",
  "--glass-color-primary-light": "#60a5fa",
  "--glass-color-secondary": "#8b5cf6",
  "--glass-color-accent": "#06b6d4",
  "--glass-color-info": "#3b82f6",
  "--glass-color-success": "#22c55e",
  "--glass-color-success-light": "#4ade80",
  "--glass-color-warning": "#f59e0b",
  "--glass-color-warning-light": "#fbbf24",
  "--glass-color-danger": "#ef4444",
  "--glass-color-danger-dark": "#b91c1c",
  "--glass-gray-500": "#64748b",
  "--glass-black": "#000000",
  "--glass-white": "#ffffff",
};

const clampByte = (value: number) =>
  Math.max(0, Math.min(255, Math.round(value)));

const byteToHex = (value: number) =>
  clampByte(value).toString(16).padStart(2, "0");

const rgbToHex = (r: number, g: number, b: number) =>
  `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;

const normalizeHex = (value: string): string | null => {
  const trimmed = value.trim();
  const short = /^#([a-f\d])([a-f\d])([a-f\d])$/i.exec(trimmed);
  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase();
  }

  const long = /^#([a-f\d]{6})([a-f\d]{2})?$/i.exec(trimmed);
  return long ? `#${long[1]}`.toLowerCase() : null;
};

const parseRgb = (value: string): string | null => {
  const rgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(value);
  return rgb ? rgbToHex(Number(rgb[1]), Number(rgb[2]), Number(rgb[3])) : null;
};

const hslToHex = (h: number, s: number, l: number): string => {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = Math.max(0, Math.min(100, s)) / 100;
  const lightness = Math.max(0, Math.min(100, l)) / 100;

  if (saturation === 0) {
    const gray = lightness * 255;
    return rgbToHex(gray, gray, gray);
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const hueToRgb = (t: number) => {
    let channel = t;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;
    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
  };

  return rgbToHex(
    hueToRgb(hue + 1 / 3) * 255,
    hueToRgb(hue) * 255,
    hueToRgb(hue - 1 / 3) * 255
  );
};

const parseHsl = (value: string): string | null => {
  const normalized = value
    .trim()
    .replace(/^hsla?\(\s*/i, "")
    .replace(/\s*\)$/i, "")
    .replace(/\s*\/\s*[\d.]+%?$/, "")
    .replace(/,/g, " ");
  const hsl = /^(-?[\d.]+)(?:deg)?\s+([\d.]+)%\s+([\d.]+)%$/i.exec(normalized);
  return hsl ? hslToHex(Number(hsl[1]), Number(hsl[2]), Number(hsl[3])) : null;
};

const parseColorToHex = (value: string): string | null =>
  normalizeHex(value) || parseRgb(value) || parseHsl(value);

const getTokenName = (value: string): string | null => {
  const match = /var\(\s*(--[\w-]+)/.exec(value);
  return match?.[1] ?? null;
};

const resolveTokenValue = (tokenName: string): string | null => {
  if (typeof document === "undefined") return null;
  const root = document.documentElement;
  const computed = window
    .getComputedStyle(root)
    .getPropertyValue(tokenName)
    .trim();
  return computed || null;
};

/**
 * Native <input type="color"> controls only accept #rrggbb. AuraGlass APIs can
 * still accept tokens; this adapter resolves or falls back before touching the DOM value.
 */
export function normalizeColorInputValue(
  value: string | null | undefined,
  fallback = "#3b82f6"
): string {
  const normalizedFallback = normalizeHex(fallback) || "#3b82f6";
  if (!value) return normalizedFallback;

  const direct = parseColorToHex(value);
  if (direct) return direct;

  const tokenName = getTokenName(value);
  if (!tokenName) return normalizedFallback;

  const resolved = resolveTokenValue(tokenName);
  if (resolved) {
    const resolvedHex = parseColorToHex(resolved);
    if (resolvedHex) return resolvedHex;
  }

  return TOKEN_COLOR_FALLBACKS[tokenName] ?? normalizedFallback;
}
