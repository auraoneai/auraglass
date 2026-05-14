"use client";
import { cn } from "../../lib/utilsComprehensive";
import { Check, Palette, RotateCcw } from "@/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import { GlassInput } from "./GlassInput";
import { normalizeColorInputValue } from "../../utils/colorInput";

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface GlassColorPickerProps {
  /**
   * Current color value
   */
  value?: string;
  /**
   * Default color value
   */
  defaultValue?: string;
  /**
   * Callback when color changes
   */
  onChange?: (color: string) => void;
  /**
   * Color format (hex, rgb, hsl, rgba, hsla)
   */
  format?: "hex" | "rgb" | "hsl" | "rgba" | "hsla";
  /**
   * Show alpha channel
   */
  showAlpha?: boolean;
  /**
   * Predefined color palette
   */
  palette?: string[];
  /**
   * Show color input field
   */
  showInput?: boolean;
  /**
   * Show color presets
   */
  showPresets?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Popover placement
   */
  placement?: "top" | "bottom" | "left" | "right";
}

// Color conversion utilities
const hexToRgb = (hex: string): Color | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
    hex
  );
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: result[4] ? parseInt(result[4], 16) / 255 : undefined,
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number, a?: number): string => {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  const alpha = a !== undefined ? toHex(a * 255) : "";
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`;
};

const rgbToHsl = (r: number, g: number, b: number, a?: number): HslColor => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100, a };
};

const hslToRgb = (h: number, s: number, l: number, a?: number): Color => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a,
  };
};

// Predefined color palettes
const defaultPalette = [
  "var(--glass-black)",
  "var(--glass-white)",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ffa500",
  "#800080",
  "#ffc0cb",
  "#a52a2a",
  "#808080",
  "#000080",
  "#008000",
];

const materialPalette = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#9e9e9e",
  "#607d8b",
];

/**
 * GlassColorPicker component
 * A comprehensive color picker with multiple selection methods
 */
export const GlassColorPicker: React.FC<GlassColorPickerProps> = ({
  value,
  defaultValue = "#3b82f6",
  onChange,
  format = "hex",
  showAlpha = false,
  palette = defaultPalette,
  showInput = true,
  showPresets = true,
  disabled = false,
  size = "md",
  className,
  placement = "bottom",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(
    normalizeColorInputValue(value || defaultValue)
  );
  const [hsl, setHsl] = useState<HslColor>({ h: 210, s: 100, l: 50 });
  const [rgb, setRgb] = useState<Color>({ r: 59, g: 130, b: 246 });
  const [inputValue, setInputValue] = useState(currentColor);

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const swatchRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLInputElement>(null);
  const satRef = useRef<HTMLInputElement>(null);
  const lightRef = useRef<HTMLInputElement>(null);
  const alphaRef = useRef<HTMLInputElement>(null);
  // apply trigger color without JSX style attr
  useEffect(() => {
    if (triggerRef.current) {
      triggerRef.current.style.backgroundColor = currentColor;
    }
    if (swatchRef.current) {
      swatchRef.current.style.backgroundColor = currentColor;
    }
    if (hueRef.current) {
      hueRef.current.classList.add("glass-color-hue-gradient");
    }
    if (satRef.current) {
      satRef.current.style.background = `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%) 0%, hsl(${hsl.h}, 100%, ${hsl.l}%) 100%)`;
    }
    if (lightRef.current) {
      lightRef.current.style.background = `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%) 0%, hsl(${hsl.h}, ${hsl.s}%, 50%) 50%, hsl(${hsl.h}, ${hsl.s}%, 100%) 100%)`;
    }
    if (alphaRef.current) {
      alphaRef.current.style.background = `linear-gradient(to right, transparent 0%, ${currentColor} 100%)`;
    }
  }, [currentColor, hsl.h, hsl.s, hsl.l]);

  // Size configurations
  const sizeConfigs = {
    sm: { trigger: "glass-w-8 glass-h-8", popover: "glass-w-64" },
    md: { trigger: "glass-w-10 glass-h-10", popover: "glass-w-80" },
    lg: { trigger: "glass-w-12 glass-h-12", popover: "glass-w-96" },
  };

  // Update color when value prop changes
  useEffect(() => {
    if (value) {
      const normalized = normalizeColorInputValue(value);
      setCurrentColor(normalized);
      setInputValue(normalized);
      updateColorValues(normalized);
    }
  }, [value]);

  // Update HSL and RGB when color changes
  const updateColorValues = useCallback((color: string) => {
    const rgbColor = hexToRgb(color);
    if (rgbColor) {
      setRgb(rgbColor);
      const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a);
      setHsl(hslColor);
    }
  }, []);

  // Handle color change
  const handleColorChange = useCallback(
    (newColor: string) => {
      setCurrentColor(newColor);
      setInputValue(newColor);
      updateColorValues(newColor);
      onChange?.(newColor);
    },
    [onChange, updateColorValues]
  );

  // Handle HSL slider changes
  const handleHslChange = useCallback(
    (type: "h" | "s" | "l", value: number) => {
      const newHsl = { ...hsl, [type]: value };
      setHsl(newHsl);

      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l, newHsl.a);
      setRgb(newRgb);

      const hexColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b, newRgb.a);
      handleColorChange(hexColor);
    },
    [hsl, handleColorChange]
  );

  // Handle RGB slider changes
  const handleRgbChange = useCallback(
    (type: "r" | "g" | "b", value: number) => {
      const newRgb = { ...rgb, [type]: value };
      setRgb(newRgb);

      const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b, newRgb.a);
      setHsl(newHsl);

      const hexColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b, newRgb.a);
      handleColorChange(hexColor);
    },
    [rgb, handleColorChange]
  );

  // Handle alpha change
  const handleAlphaChange = useCallback(
    (value: number) => {
      const newRgb = { ...rgb, a: value / 100 };
      setRgb(newRgb);

      const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b, newRgb.a);
      setHsl(newHsl);

      const hexColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b, newRgb.a);
      handleColorChange(hexColor);
    },
    [rgb, handleColorChange]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (newValue: string) => {
      setInputValue(newValue);
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(newValue)) {
        handleColorChange(newValue);
      }
    },
    [handleColorChange]
  );

  // Format color for display
  const formatColorValue = useCallback(
    (color: string) => {
      const rgbColor = hexToRgb(color);
      if (!rgbColor) return color;

      switch (format) {
        case "rgb":
          return rgbColor.a !== undefined
            ? `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${rgbColor.a})`
            : `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
        case "hsl":
          const hslColor = rgbToHsl(
            rgbColor.r,
            rgbColor.g,
            rgbColor.b,
            rgbColor.a
          );
          return hslColor.a !== undefined
            ? `hsla(${Math.round(hslColor.h)}, ${Math.round(hslColor.s)}%, ${Math.round(hslColor.l)}%, ${hslColor.a})`
            : `hsl(${Math.round(hslColor.h)}, ${Math.round(hslColor.s)}%, ${Math.round(hslColor.l)}%)`;
        default:
          return color;
      }
    },
    [format]
  );

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const config = sizeConfigs[size];

  return (
    <div data-glass-component className="glass-relative">
      {/* Color Trigger */}
      <div
        ref={triggerRef}
        className={cn(
          "glass-radius-lg glass-border-2 glass-border-white/20 glass-cursor-pointer",
          "glass-focus",
          config.trigger,
          disabled && "glass-opacity-50",
          className
        )}
        onClick={(e) => !disabled && setIsOpen(!isOpen)}
        role="button"
        aria-label="Choose color"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !disabled && setIsOpen(!isOpen);
          }
        }}
        {...props}
      />

      {/* Color Picker Popover */}
      {isOpen && (
        <Motion
          preset="fadeIn"
          className={cn(
            "absolute z-50 glass-mt-2",
            placement === "top" && "glass-bottom-full",
            placement === "bottom" && "glass-top-full",
            placement === "left" && "glass-right-full",
            placement === "right" && "glass-left-full"
          )}
        >
          <div
            ref={popoverRef}
            role="dialog"
            aria-modal="true"
            aria-label="Color picker"
            className={cn(
              "glass-radius-xl glass-border glass-border-white/20 glass-shadow-2xl glass-backdrop-blur-md glass-surface-dark/30",
              config.popover
            )}
          >
            <GlassCard
              variant="outline"
              className="glass-border-0 glass-bg-transparent"
            >
              <CardHeader className="glass-pb-4">
                <div className="glass-flex glass-items-center glass-justify-between">
                  <CardTitle
                    id="color-picker-title"
                    className="glass-text-lg glass-font-semibold glass-text-primary glass-flex glass-items-center glass-gap-2"
                  >
                    <Palette
                      className="glass-w-5 glass-h-5"
                      aria-hidden="true"
                    />
                    Color Picker
                  </CardTitle>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => setIsOpen(false)}
                    aria-label="Close color picker"
                  >
                    ×
                  </GlassButton>
                </div>
              </CardHeader>

              <CardContent className="glass-space-y-6">
                {/* Current Color Display */}
                <div className="glass-flex glass-items-center glass-gap-4">
                  <div
                    ref={swatchRef}
                    className="glass-w-16 glass-h-16 glass-radius-lg glass-border-2 glass-border-white/20"
                  />
                  <div className="glass-flex-1">
                    {showInput && (
                      <GlassInput
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="var(--glass-black)"
                        className="glass-text-sm"
                      />
                    )}
                    <div className="glass-text-xs glass-text-primary-glass-opacity-60 glass-mt-1">
                      {formatColorValue(currentColor)}
                    </div>
                  </div>
                </div>

                {/* HSL Sliders */}
                <div className="glass-gap-4">
                  <div>
                    <label
                      htmlFor="hue-slider"
                      id="hue-label"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-2 glass-block"
                    >
                      Hue
                    </label>
                    <input
                      ref={hueRef}
                      id="hue-slider"
                      type="range"
                      role="slider"
                      aria-labelledby="hue-label"
                      aria-valuemin={0}
                      aria-valuemax={360}
                      aria-valuenow={Math.round(hsl.h)}
                      aria-valuetext={`${Math.round(hsl.h)} degrees`}
                      min="0"
                      max="360"
                      value={hsl.h}
                      onChange={(e) =>
                        handleHslChange("h", Number(e.target.value))
                      }
                      className="glass-w-full glass-h-2 glass-surface-subtle glass-radius-lg glass-appearance-none glass-cursor-pointer glass-slider"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="saturation-slider"
                      id="saturation-label"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-2 glass-block"
                    >
                      Saturation
                    </label>
                    <input
                      ref={satRef}
                      id="saturation-slider"
                      type="range"
                      role="slider"
                      aria-labelledby="saturation-label"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(hsl.s)}
                      aria-valuetext={`${Math.round(hsl.s)} percent`}
                      min="0"
                      max="100"
                      value={hsl.s}
                      onChange={(e) =>
                        handleHslChange("s", Number(e.target.value))
                      }
                      className="glass-w-full glass-h-2 glass-surface-subtle glass-radius-lg glass-appearance-none glass-cursor-pointer"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lightness-slider"
                      id="lightness-label"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-2 glass-block"
                    >
                      Lightness
                    </label>
                    <input
                      ref={lightRef}
                      id="lightness-slider"
                      type="range"
                      role="slider"
                      aria-labelledby="lightness-label"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(hsl.l)}
                      aria-valuetext={`${Math.round(hsl.l)} percent`}
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={(e) =>
                        handleHslChange("l", Number(e.target.value))
                      }
                      className="glass-w-full glass-h-2 glass-surface-subtle glass-radius-lg glass-appearance-none glass-cursor-pointer"
                    />
                  </div>

                  {showAlpha && (
                    <div>
                      <label
                        htmlFor="alpha-slider"
                        id="alpha-label"
                        className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-2 glass-block"
                      >
                        Alpha
                      </label>
                      <input
                        ref={alphaRef}
                        id="alpha-slider"
                        type="range"
                        role="slider"
                        aria-labelledby="alpha-label"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round((rgb.a || 1) * 100)}
                        aria-valuetext={`${Math.round((rgb.a || 1) * 100)} percent`}
                        min="0"
                        max="100"
                        value={(rgb.a || 1) * 100}
                        onChange={(e) =>
                          handleAlphaChange(Number(e.target.value))
                        }
                        className="glass-w-full glass-h-2 glass-surface-subtle glass-radius-lg glass-appearance-none glass-cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* RGB Inputs */}
                <div className="glass-grid glass-grid-cols-3 glass-gap-4">
                  <div>
                    <label
                      htmlFor="red-input"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-2 glass-block"
                    >
                      R
                    </label>
                    <GlassInput
                      id="red-input"
                      type="number"
                      min="0"
                      max="255"
                      value={rgb.r}
                      onChange={(e) =>
                        handleRgbChange("r", Number(e.target.value))
                      }
                      aria-label="Red channel value"
                      aria-valuemin={0}
                      aria-valuemax={255}
                      aria-valuenow={rgb.r}
                      className="glass-text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="green-input"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-2 glass-block"
                    >
                      G
                    </label>
                    <GlassInput
                      id="green-input"
                      type="number"
                      min="0"
                      max="255"
                      value={rgb.g}
                      onChange={(e) =>
                        handleRgbChange("g", Number(e.target.value))
                      }
                      aria-label="Green channel value"
                      aria-valuemin={0}
                      aria-valuemax={255}
                      aria-valuenow={rgb.g}
                      className="glass-text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="blue-input"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-2 glass-block"
                    >
                      B
                    </label>
                    <GlassInput
                      id="blue-input"
                      type="number"
                      min="0"
                      max="255"
                      value={rgb.b}
                      onChange={(e) =>
                        handleRgbChange("b", Number(e.target.value))
                      }
                      aria-label="Blue channel value"
                      aria-valuemin={0}
                      aria-valuemax={255}
                      aria-valuenow={rgb.b}
                      className="glass-text-sm"
                    />
                  </div>
                </div>

                {/* Color Palette */}
                {showPresets && (
                  <div>
                    <label
                      id="palette-label"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-3 glass-block"
                    >
                      Palette
                    </label>
                    <div
                      role="group"
                      aria-labelledby="palette-label"
                      className="glass-grid glass-grid-cols-5 glass-gap-2"
                    >
                      {palette.map((color, i) => (
                        <button
                          key={`${color}-${i}`}
                          className={cn(
                            "glass-w-8 glass-h-8 glass-radius-lg glass-border-2 glass-focus",
                            currentColor === color
                              ? "glass-border-white glass-scale-110"
                              : "glass-border-white/20"
                          )}
                          ref={(el) => {
                            if (el) el.style.backgroundColor = color;
                          }}
                          onClick={(e) => handleColorChange(color)}
                          aria-label={`Select color ${color}`}
                          aria-pressed={currentColor === color}
                          title={color}
                        >
                          {currentColor === color && (
                            <Check
                              className="glass-w-4 glass-h-4 glass-text-primary glass-mx-auto"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Material Palette */}
                {showPresets && (
                  <div>
                    <label
                      id="material-palette-label"
                      className="glass-text-sm glass-text-primary-glass-opacity-80 glass-mb-3 glass-block"
                    >
                      Material Colors
                    </label>
                    <div
                      role="group"
                      aria-labelledby="material-palette-label"
                      className="glass-grid glass-grid-cols-5 glass-gap-2"
                    >
                      {materialPalette.slice(0, 10).map((color, i) => (
                        <button
                          key={`${color}-${i}`}
                          className="glass-w-8 glass-h-8 glass-radius-lg glass-border-2 glass-border-white/20 hover:glass-border-white/40 glass-transition-all glass-duration-200 glass-focus"
                          ref={(el) => {
                            if (el) el.style.backgroundColor = color;
                          }}
                          onClick={(e) => handleColorChange(color)}
                          aria-label={`Select color ${color}`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="glass-flex glass-justify-between glass-gap-3 glass-pt-4 glass-border-t glass-border-white/10">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleColorChange(defaultValue)}
                  >
                    <RotateCcw className="glass-w-4 glass-h-4 glass-mr-2" />
                    Reset
                  </GlassButton>
                  <div className="glass-flex glass-gap-2">
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => setIsOpen(false)}
                    >
                      Cancel
                    </GlassButton>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={(e) => setIsOpen(false)}
                    >
                      Done
                    </GlassButton>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </Motion>
      )}
    </div>
  );
};

// Color Palette Component
export interface GlassColorPaletteProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GlassColorPalette: React.FC<GlassColorPaletteProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  size = "md",
  className,
}) => {
  const sizeConfigs = {
    sm: "glass-w-6 glass-h-6",
    md: "glass-w-8 glass-h-8",
    lg: "glass-w-10 glass-h-10",
  };

  return (
    <div className={cn("glass-flex glass-flex-wrap glass-gap-2", className)}>
      {colors.map((color, i) => (
        <button
          key={`${color}-${i}`}
          className={cn(
            "glass-radius-lg glass-border-2",
            sizeConfigs[size],
            selectedColor === color
              ? "glass-border-white glass-scale-110 glass-ring-2 glass-ring-white/50"
              : "glass-border-white/20 glass-hover-scale-105"
          )}
          ref={(el) => {
            if (el) el.style.backgroundColor = color;
          }}
          onClick={(e) => onColorSelect?.(color)}
          title={color}
        />
      ))}
    </div>
  );
};

export default GlassColorPicker;
