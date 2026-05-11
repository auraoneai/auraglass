"use client";
import { cn } from "../../lib/utilsComprehensive";
import {
  Check,
  Copy,
  Download,
  Palette,
  RotateCcw,
  Shuffle,
  Upload,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { normalizeColorInputValue } from "../../utils/colorInput";

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface GradientPreset {
  id: string;
  name: string;
  type: "linear" | "radial" | "conic";
  angle?: number; // For linear gradients
  stops: GradientStop[];
}

export interface GlassGradientPickerProps {
  /**
   * Current gradient
   */
  value?: string;
  /**
   * Gradient presets
   */
  presets?: GradientPreset[];
  /**
   * Enable custom gradient creation
   */
  enableCustom?: boolean;
  /**
   * Show gradient type selector
   */
  showTypeSelector?: boolean;
  /**
   * Show angle control for linear gradients
   */
  showAngleControl?: boolean;
  /**
   * Show color stops editor
   */
  showStopsEditor?: boolean;
  /**
   * Maximum number of color stops
   */
  maxStops?: number;
  /**
   * Gradient change handler
   */
  onChange?: (
    gradient: string,
    stops: GradientStop[],
    type: string,
    angle?: number
  ) => void;
  /**
   * Preset selection handler
   */
  onPresetSelect?: (preset: GradientPreset) => void;
  /**
   * Custom className
   */
  className?: string;
  /** Compact mode for constrained cards, drawers, and documentation previews. */
  compact?: boolean;
  /** Contain the picker in a bounded viewport. */
  contained?: boolean;
  /** Maximum rendered height when contained or compact. */
  maxHeight?: number | string;
}

/**
 * GlassGradientPicker component
 * Advanced gradient picker with presets and custom creation
 */
export const GlassGradientPicker: React.FC<GlassGradientPickerProps> = ({
  value,
  presets = [],
  enableCustom = true,
  showTypeSelector = true,
  showAngleControl = true,
  showStopsEditor = true,
  maxStops = 5,
  onChange,
  onPresetSelect,
  className,
  compact = false,
  contained = false,
  maxHeight,
  ...props
}) => {
  const [selectedType, setSelectedType] = useState<
    "linear" | "radial" | "conic"
  >("linear");
  const [angle, setAngle] = useState(45);
  const [stops, setStops] = useState<GradientStop[]>([
    { color: "#7CD3FF", position: 0 },
    { color: "#A78BFA", position: 100 },
  ]);
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  // Default presets
  const defaultPresets: GradientPreset[] = [
    {
      id: "sunset",
      name: "Sunset",
      type: "linear",
      angle: 45,
      stops: [
        { color: "#FB7185", position: 0 },
        { color: "#FBBF24", position: 50 },
        { color: "#A78BFA", position: 100 },
      ],
    },
    {
      id: "ocean",
      name: "Ocean",
      type: "linear",
      angle: 90,
      stops: [
        { color: "#7CD3FF", position: 0 },
        { color: "#22D3EE", position: 50 },
        { color: "#60A5FA", position: 100 },
      ],
    },
    {
      id: "forest",
      name: "Forest",
      type: "radial",
      stops: [
        { color: "#86EFAC", position: 0 },
        { color: "#34D399", position: 70 },
        { color: "#059669", position: 100 },
      ],
    },
    {
      id: "fire",
      name: "Fire",
      type: "conic",
      stops: [
        { color: "#FB7185", position: 0 },
        { color: "#FBBF24", position: 25 },
        { color: "#F97316", position: 50 },
        { color: "#DC2626", position: 100 },
      ],
    },
  ];

  const allPresets = [...defaultPresets, ...presets];

  // Generate CSS gradient string
  const generateGradient = useCallback(() => {
    if (stops.length === 0) return "transparent";

    const colorStops = stops
      .sort((a, b) => a.position - b.position)
      .map((stop: any) => `${stop.color} ${stop.position}%`)
      .join(", ");

    switch (selectedType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${colorStops})`;
      case "radial":
        return `radial-gradient(circle, ${colorStops})`;
      case "conic":
        return `conic-gradient(from 0deg, ${colorStops})`;
      default:
        return `linear-gradient(45deg, ${colorStops})`;
    }
  }, [stops, selectedType, angle]);

  // Handle stop change
  const handleStopChange = useCallback(
    (index: number, updates: Partial<GradientStop>) => {
      setStops((prev: any) =>
        prev.map((stop: any, i: any) =>
          i === index ? { ...stop, ...updates } : stop
        )
      );
    },
    []
  );

  // Add new stop
  const handleAddStop = useCallback(() => {
    if (stops.length >= maxStops) return;

    const newStop: GradientStop = {
      color: "var(--glass-white)",
      position: 50,
    };
    setStops((prev: any) => [...prev, newStop]);
    setSelectedStopIndex(stops.length);
  }, [stops.length, maxStops]);

  // Remove stop
  const handleRemoveStop = useCallback(
    (index: number) => {
      if (stops.length <= 2) return; // Keep at least 2 stops

      setStops((prev: any) => prev.filter((_: any, i: any) => i !== index));
      setSelectedStopIndex(null);
    },
    [stops.length]
  );

  // Handle preset selection
  const handlePresetSelect = useCallback(
    (preset: GradientPreset) => {
      setSelectedType(preset.type);
      if (preset.angle !== undefined) {
        setAngle(preset.angle);
      }
      setStops([...preset.stops]);
      setSelectedStopIndex(null);

      const gradient = generateGradient();
      onChange?.(gradient, preset.stops, preset.type, preset.angle);
      onPresetSelect?.(preset);
    },
    [generateGradient, onChange, onPresetSelect]
  );

  // Generate random gradient
  const handleRandomGradient = useCallback(() => {
    const randomColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16);
    const newStops = [
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 },
    ];

    if (Math.random() > 0.5) {
      newStops.push({ color: randomColor(), position: 50 });
    }

    setStops(newStops);
    setSelectedStopIndex(null);

    const gradient = generateGradient();
    onChange?.(gradient, newStops, selectedType, angle);
  }, [generateGradient, selectedType, angle, onChange]);

  // Copy gradient to clipboard
  const handleCopyGradient = useCallback(async () => {
    const gradient = generateGradient();
    try {
      await navigator.clipboard.writeText(gradient);
      setCopied(true);
      setTimeout(() => setCopied(false), ANIMATION.DURATION.normal);
    } catch {
      setCopied(false);
    }
  }, [generateGradient]);

  // Reset to default
  const handleReset = useCallback(() => {
    setSelectedType("linear");
    setAngle(45);
    setStops([
      { color: "#7CD3FF", position: 0 },
      { color: "#A78BFA", position: 100 },
    ]);
    setSelectedStopIndex(null);
  }, []);

  const currentGradient = generateGradient();
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  const effectiveShowTypeSelector = compact ? false : showTypeSelector;
  const effectiveShowAngleControl = compact ? false : showAngleControl;
  const effectiveShowStopsEditor = compact ? false : showStopsEditor;
  const effectivePresets = compact ? allPresets.slice(0, 4) : allPresets;

  return (
    <Motion data-glass-component preset="fadeIn" className="glass-w-full">
      <GlassCard
        className={cn("overflow-hidden", className)}
        style={{
          maxHeight:
            resolvedMaxHeight ?? (compact || contained ? "240px" : undefined),
          overflow:
            compact || contained || resolvedMaxHeight ? "auto" : undefined,
        }}
        {...props}
      >
        <CardHeader className={compact ? "glass-p-3 glass-pb-2" : "glass-pb-3"}>
          <div className="glass-flex glass-items-center glass-justify-between">
            <ContrastGuard>
              <CardTitle
                className={cn(
                  "glass-text-primary glass-font-semibold glass-flex glass-items-center glass-gap-2",
                  compact ? "glass-text-sm" : "glass-text-lg"
                )}
              >
                <Palette
                  className={
                    compact ? "glass-w-4 glass-h-4" : "glass-w-5 glass-h-5"
                  }
                />
                Gradient Picker
              </CardTitle>
            </ContrastGuard>

            <div className="glass-flex glass-gap-2">
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleRandomGradient}
                className="glass-p-2 glass-focus glass-touch-target"
                title="Random Gradient"
                aria-label="Generate random gradient"
              >
                <Shuffle className="glass-w-4 glass-h-4" />
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleCopyGradient}
                className="glass-p-2 glass-focus glass-touch-target"
                title="Copy Gradient"
                aria-label={
                  copied ? "Gradient copied" : "Copy gradient to clipboard"
                }
              >
                {copied ? (
                  <Check className="glass-w-4 glass-h-4" />
                ) : (
                  <Copy className="glass-w-4 glass-h-4" />
                )}
              </GlassButton>
            </div>
          </div>
        </CardHeader>

        <CardContent
          className={cn(
            "glass-pt-0 glass-auto-gap",
            compact
              ? "glass-px-3 glass-pb-3 glass-auto-gap-md"
              : "glass-auto-gap-2xl"
          )}
        >
          {/* Current Gradient Preview */}
          <div className="glass-auto-gap glass-auto-gap-md">
            <div
              className={cn(
                "glass-w-full glass-radius-lg glass-border glass-border-white/20",
                compact ? "glass-h-16" : "glass-h-32"
              )}
              style={{ background: currentGradient }}
            />

            <div className="glass-flex glass-items-center glass-justify-between glass-gap-2">
              <ContrastGuard>
                <code
                  className="glass-text-xs glass-text-primary-glass-opacity-60 glass-surface-subtle/10 glass-px-2 glass-py-1 glass-radius-md glass-font-mono glass-flex-1 glass-min-w-0"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {currentGradient}
                </code>
              </ContrastGuard>

              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="glass-p-2 glass-focus glass-touch-target"
                title="Reset"
                aria-label="Reset gradient to default"
              >
                <RotateCcw className="glass-w-4 glass-h-4" />
              </GlassButton>
            </div>
          </div>

          {/* Gradient Type Selector */}
          {effectiveShowTypeSelector && (
            <div className="glass-auto-gap glass-auto-gap-md">
              <h3 className="glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium">
                Type
              </h3>
              <div className="glass-flex glass-gap-2">
                {(["linear", "radial", "conic"] as const).map((type) => (
                  <GlassButton
                    key={type}
                    variant={selectedType === type ? "primary" : "ghost"}
                    size="sm"
                    onClick={(e) => setSelectedType(type)}
                    className="glass-capitalize glass-focus glass-touch-target"
                  >
                    {type}
                  </GlassButton>
                ))}
              </div>
            </div>
          )}

          {/* Angle Control for Linear */}
          {effectiveShowAngleControl && selectedType === "linear" && (
            <div className="glass-auto-gap glass-auto-gap-md">
              <ContrastGuard>
                <h3 className="glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium">
                  Angle: {angle}°
                </h3>
              </ContrastGuard>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer glass-focus glass-touch-target glass-contrast-guard"
                aria-label="Gradient angle"
              />
            </div>
          )}

          {/* Color Stops Editor */}
          {effectiveShowStopsEditor && enableCustom && (
            <div className="glass-auto-gap glass-auto-gap-md">
              <div className="glass-flex glass-items-center glass-justify-between">
                <ContrastGuard>
                  <h3 className="glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium">
                    Color Stops
                  </h3>
                </ContrastGuard>
                {stops.length < maxStops && (
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={handleAddStop}
                    className="glass-p-1 glass-focus glass-touch-target"
                    aria-label="Add color stop"
                  >
                    <Upload className="glass-w-4 glass-h-4" />
                  </GlassButton>
                )}
              </div>

              {/* Stops List */}
              <div className="glass-auto-gap glass-auto-gap-sm">
                {stops.map((stop, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center glass-gap-3 glass-p-3 glass-radius-lg border transition-all",
                      selectedStopIndex === index
                        ? "border-primary bg-primary/20"
                        : "border-white/20 bg-white/5"
                    )}
                    onClick={(e) => setSelectedStopIndex(index)}
                  >
                    <input
                      type="color"
                      value={normalizeColorInputValue(stop.color)}
                      onChange={(e) =>
                        handleStopChange(index, { color: e.target.value })
                      }
                      className="glass-w-8 glass-h-8 glass-radius-md glass-border glass-border-white/20 glass-cursor-pointer glass-focus glass-touch-target glass-contrast-guard"
                      aria-label={`Color stop ${index + 1} color picker`}
                    />

                    <div className="glass-flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) =>
                          handleStopChange(index, {
                            position: Number(e.target.value),
                          })
                        }
                        className="glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer glass-focus glass-touch-target glass-contrast-guard"
                        aria-label={`Color stop ${index + 1} position`}
                      />
                      <div className="glass-text-xs glass-text-primary-glass-opacity-60 glass-mt-1">
                        Position: {stop.position}%
                      </div>
                    </div>

                    {stops.length > 2 && (
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleRemoveStop(index)}
                        className="glass-p-1 glass-text-primary hover:glass-text-secondary glass-focus glass-touch-target"
                        aria-label={`Remove color stop ${index + 1}`}
                      >
                        <Download className="glass-w-4 glass-h-4" />
                      </GlassButton>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Presets */}
          {allPresets.length > 0 && (
            <div className="glass-auto-gap glass-auto-gap-md">
              <ContrastGuard>
                <h3 className="glass-text-primary-glass-opacity-80 glass-text-sm glass-font-medium">
                  Presets
                </h3>
              </ContrastGuard>
              <div
                className={cn(
                  "glass-grid",
                  compact
                    ? "glass-grid-cols-4 glass-gap-2"
                    : "glass-grid-cols-2 glass-gap-3"
                )}
              >
                {effectivePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="glass-cursor-pointer glass-group glass-focus glass-touch-target"
                    onClick={(e) => handlePresetSelect(preset)}
                    role="button"
                    aria-label={`Select ${preset.name} gradient preset`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePresetSelect(preset);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "glass-w-full glass-radius-lg glass-border glass-border-white/20 glass-group-hover:glass-border-white/40 glass-transition-all",
                        compact ? "glass-h-8" : "glass-h-16"
                      )}
                      style={{
                        background:
                          preset.stops.length > 0
                            ? `${preset.type}-gradient(${preset.angle || 0}deg, ${preset.stops.map((s: any) => `${s.color} ${s.position}%`).join(", ")})`
                            : "transparent",
                      }}
                    />
                    <ContrastGuard>
                      <p className="glass-text-primary-glass-opacity-80 glass-text-xs glass-mt-2 glass-text-center glass-group-hover:glass-text-primary glass-transition-colors">
                        {preset.name}
                      </p>
                    </ContrastGuard>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </GlassCard>
    </Motion>
  );
};

export default GlassGradientPicker;
