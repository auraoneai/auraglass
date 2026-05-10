"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import {
  Droplets,
  Eye,
  Gauge,
  Layers,
  Settings,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { useGlassEffect, useHoudiniGlass } from "./HoudiniGlassProvider";

interface HoudiniGlassCardProps {
  children: React.ReactNode;
  className?: string;
  preset?: "standard" | "frosted" | "minimal" | "heavy" | "crystal";
  effects?: string[];
  enableWorklets?: boolean;
  customProperties?: Record<string, string>;
  interactive?: boolean;
  showControls?: boolean;
  title?: string;
  description?: string;
  "data-testid"?: string;
}

export function HoudiniGlassCard({
  children,
  className = "",
  preset = "standard",
  effects = ["frost"],
  enableWorklets = true,
  customProperties = {},
  interactive = true,
  showControls = false,
  title,
  description,
  "data-testid": dataTestId,
}: HoudiniGlassCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { isSupported, enabledEffects, toggleEffect, performanceMode } =
    useHoudiniGlass();
  const [isHovered, setIsHovered] = useState(false);
  const [showEffectControls, setShowEffectControls] = useState(false);

  // Apply glass effects using the Houdini hook
  const { appliedEffects, canUseWorklets } = useGlassEffect(cardRef, effects, {
    preset,
    customProperties,
    enableWorklets: enableWorklets,
  });

  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
    }
  };

  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case "frost":
        return <Sparkles className="glass-w-4 glass-h-4" />;
      case "caustics":
        return <Sun className="glass-w-4 glass-h-4" />;
      case "border":
        return <Layers className="glass-w-4 glass-h-4" />;
      case "refraction":
        return <Droplets className="glass-w-4 glass-h-4" />;
      default:
        return <Zap className="glass-w-4 glass-h-4" />;
    }
  };

  const getPerformanceIndicator = () => {
    const prefersReducedMotion = useReducedMotion();
    if (performanceMode) {
      return (
        <span title="Performance mode active">
          <Gauge className="glass-w-4 glass-h-4 glass-text-primary" />
        </span>
      );
    }
    return (
      <span title="Full effects active">
        <Zap className="glass-w-4 glass-h-4 glass-text-primary" />
      </span>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        // Base glass foundation with design tokens
        "glass-foundation-complete glass-radius-xl glass-p-4",
        "relative overflow-hidden glass-min-w-0 glass-max-w-full",
        // Houdini-specific classes
        "houdini-glass",
        {
          "houdini-glass-fallback": !isSupported,
          "houdini-glass-performance": performanceMode,
          "cursor-pointer glass-press glass-magnet": interactive,
        },
        // Glass effects
        "glass-overlay-specular glass-parallax",
        "glass-transition glass-focus",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: performanceMode ? 0.15 : 0.3,
              ease: "easeOut",
            }
      }
      data-testid={dataTestId}
    >
      {/* Header */}
      {(title || description || showControls) && (
        <div className="glass-relative glass-z-10 glass-mb-4 glass-min-w-0">
          <div className="glass-flex glass-items-start glass-justify-between">
            <div className="glass-flex-1 glass-min-w-0">
              {title && (
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-1 glass-break-words">
                  {title}
                </h3>
              )}
              {description && (
                <p className="glass-text-sm glass-text-secondary glass-leading-relaxed glass-break-words">
                  {description}
                </p>
              )}
            </div>

            {/* Controls */}
            {showControls && (
              <div className="glass-flex glass-items-center glass-gap-2 glass-ml-4">
                {/* Performance indicator */}
                {getPerformanceIndicator()}

                {/* Effect controls toggle */}
                <button
                  onClick={() => setShowEffectControls(!showEffectControls)}
                  className="glass-p-2 glass-radius-lg hover:glass-surface-subtle/10 glass-transition-colors"
                  title="Toggle effect controls"
                >
                  <Settings className="glass-w-4 glass-h-4 glass-text-secondary dark:glass-text-secondary" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Effect Controls Panel */}
      {showEffectControls && showControls && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-mb-4 glass-p-3 glass-radius-lg glass-surface-dark/5 dark:glass-surface-subtle/5"
        >
          <div className="glass-flex glass-items-center glass-justify-between glass-mb-2">
            <span className="glass-text-sm glass-font-medium glass-text-secondary dark:glass-text-secondary">
              Glass Effects
            </span>
            <span className="glass-text-xs glass-text-secondary dark:glass-text-secondary">
              {appliedEffects.length} active
            </span>
          </div>

          <div className="glass-grid glass-grid-cols-2 glass-gap-2">
            {["frost", "caustics", "border", "refraction"].map(
              (effect: any) => (
                <button
                  key={effect}
                  onClick={() => toggleEffect(effect)}
                  className={`
                  flex items-center gap-2 p-2 rounded-lg text-sm transition-all
                  ${
                    enabledEffects.includes(effect)
                      ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
                  title={`${enabledEffects.includes(effect) ? "Disable" : "Enable"} ${effect} effect`}
                >
                  {getEffectIcon(effect)}
                  <span className="glass-capitalize">{effect}</span>
                  {enabledEffects.includes(effect) && (
                    <Eye className="glass-w-3 glass-h-3 glass-ml-auto" />
                  )}
                </button>
              )
            )}
          </div>

          {/* Worklet status */}
          <div className="glass-mt-2 glass-text-xs glass-text-secondary dark:glass-text-secondary">
            Worklets: {canUseWorklets ? "✅ Supported" : "❌ Fallback"}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="glass-relative glass-z-10 glass-min-w-0 glass-break-words">
        {children}
      </div>

      {/* Hover effect overlay */}
      {interactive && (
        <motion.div
          className="glass-absolute glass-inset-0 glass-z-0 glass-gradient-primary glass-pointer-events-none"
          initial={{ opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: isHovered ? 1 : 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: performanceMode ? 0.1 : 0.2 }
          }
        />
      )}

      {/* Status indicators */}
      {showControls && (
        <div className="glass-absolute glass-top-2 glass-right-2 glass-flex glass-gap-1">
          {appliedEffects.map((effect: any) => (
            <div
              key={effect}
              className="glass-w-2 glass-h-2 glass-radius-full glass-surface-blue glass-opacity-60"
              title={`Active: ${effect}`}
            />
          ))}
        </div>
      )}

      {/* Browser support indicator */}
      {!isSupported && (
        <div className="glass-absolute glass-bottom-2 glass-right-2">
          <div
            className="glass-w-2 glass-h-2 glass-radius-full glass-surface-amber"
            title="Houdini not supported - using fallback styles"
          />
        </div>
      )}
    </motion.div>
  );
}

// Demo component showcasing different Houdini glass effects
export function HoudiniGlassShowcase() {
  const [selectedPreset, setSelectedPreset] = useState<
    "standard" | "frosted" | "minimal" | "heavy" | "crystal"
  >("standard");
  const [selectedEffects, setSelectedEffects] = useState<string[]>(["frost"]);
  const { isSupported, hasPaintAPI, hasPropertyAPI } = useHoudiniGlass();

  const presets = [
    { id: "standard", name: "Standard", description: "Balanced glass effect" },
    {
      id: "frosted",
      name: "Frosted",
      description: "Enhanced blur and opacity",
    },
    { id: "minimal", name: "Minimal", description: "Subtle glass appearance" },
    { id: "heavy", name: "Heavy", description: "Maximum glass intensity" },
    { id: "crystal", name: "Crystal", description: "Ultra-clear glass effect" },
  ] as const;

  const availableEffects = [
    { id: "frost", name: "Frost", description: "Icy glass texture" },
    {
      id: "caustics",
      name: "Caustics",
      description: "Light refraction patterns",
    },
    { id: "border", name: "Border", description: "Animated border effects" },
    {
      id: "refraction",
      name: "Refraction",
      description: "Light bending effects",
    },
  ];

  const toggleEffect = (effectId: string) => {
    setSelectedEffects((prev: any) =>
      prev.includes(effectId)
        ? prev.filter((id: any) => id !== effectId)
        : [...prev, effectId]
    );
  };

  return (
    <div className="glass-space-y-6">
      {/* Browser Support Status */}
      <HoudiniGlassCard
        title="Houdini Glass Support"
        description="Check browser compatibility for CSS Houdini features"
        showControls={true}
      >
        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4">
          <div className="glass-text-center glass-p-3 glass-radius-lg glass-surface-subtle dark:glass-surface-primary">
            <div
              className={`glass-text-2xl glass-mb-2 ${isSupported ? "glass-text-success" : "glass-text-danger"}`}
            >
              {isSupported ? "✅" : "❌"}
            </div>
            <div className="glass-font-medium">Overall Support</div>
            <div className="glass-text-sm glass-text-secondary dark:glass-text-secondary">
              Houdini APIs available
            </div>
          </div>

          <div className="glass-text-center glass-p-3 glass-radius-lg glass-surface-subtle dark:glass-surface-primary">
            <div
              className={`glass-text-2xl glass-mb-2 ${hasPropertyAPI ? "glass-text-success" : "glass-text-danger"}`}
            >
              {hasPropertyAPI ? "✅" : "❌"}
            </div>
            <div className="glass-font-medium">Properties API</div>
            <div className="glass-text-sm glass-text-secondary dark:glass-text-secondary">
              Custom properties support
            </div>
          </div>

          <div className="glass-text-center glass-p-3 glass-radius-lg glass-surface-subtle dark:glass-surface-primary">
            <div
              className={`glass-text-2xl glass-mb-2 ${hasPaintAPI ? "glass-text-success" : "glass-text-danger"}`}
            >
              {hasPaintAPI ? "✅" : "❌"}
            </div>
            <div className="glass-font-medium">Paint API</div>
            <div className="glass-text-sm glass-text-secondary dark:glass-text-secondary">
              Paint worklets support
            </div>
          </div>
        </div>
      </HoudiniGlassCard>

      {/* Preset Selection */}
      <HoudiniGlassCard
        title="Glass Presets"
        description="Choose from predefined glass effect configurations"
        showControls={true}
      >
        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-5 glass-gap-3">
          {presets.map((preset: any) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`
                glass-p-3 glass-radius-lg glass-text-left glass-transition-all
                ${
                  selectedPreset === preset.id
                    ? "glass-surface-blue/20 glass-border-2 glass-border-blue/50 glass-text-primary"
                    : "glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-border-2 glass-border-transparent"
                }
              `}
            >
              <div className="glass-font-medium glass-text-sm">
                {preset.name}
              </div>
              <div className="glass-text-xs glass-text-secondary dark:glass-text-secondary glass-mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </HoudiniGlassCard>

      {/* Effect Selection */}
      <HoudiniGlassCard
        title="Glass Effects"
        description="Enable/disable individual glass effect layers"
        showControls={true}
      >
        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-4 glass-gap-3">
          {availableEffects.map((effect: any) => (
            <button
              key={effect.id}
              onClick={() => toggleEffect(effect.id)}
              className={`
                p-3 rounded-lg text-left transition-all
                ${
                  selectedEffects.includes(effect.id)
                    ? "bg-green-500/20 border-2 border-green-500/50 text-green-700 dark:text-green-300"
                    : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent"
                }
              `}
            >
              <div className="glass-font-medium glass-text-sm glass-flex glass-items-center glass-gap-2">
                {getEffectIcon(effect.id)}
                {effect.name}
              </div>
              <div className="glass-text-xs glass-text-secondary dark:glass-text-secondary glass-mt-1">
                {effect.description}
              </div>
            </button>
          ))}
        </div>
      </HoudiniGlassCard>

      {/* Live Preview */}
      <HoudiniGlassCard
        title="Live Preview"
        description={`Preset: ${selectedPreset} | Effects: ${selectedEffects.join(", ")}`}
        preset={selectedPreset}
        effects={selectedEffects}
        showControls={true}
        interactive={true}
      >
        <div className="glass-space-y-4">
          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4">
            <div className="glass-p-4 glass-radius-lg glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary">
              <h4 className="glass-font-medium glass-text-secondary dark:glass-text-primary glass-mb-2">
                Content Area 1
              </h4>
              <p className="glass-text-sm glass-text-secondary dark:glass-text-secondary">
                This is a preview of how the selected glass effects appear with
                your content. The effects are applied using CSS Houdini for
                maximum performance.
              </p>
            </div>

            <div className="glass-p-4 glass-radius-lg glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary">
              <h4 className="glass-font-medium glass-text-secondary dark:glass-text-primary glass-mb-2">
                Content Area 2
              </h4>
              <p className="glass-text-sm glass-text-secondary dark:glass-text-secondary">
                Experiment with different presets and effects to find the
                perfect glass aesthetic for your application.
              </p>
            </div>
          </div>

          <div className="glass-p-4 glass-radius-lg glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary">
            <h4 className="glass-font-medium glass-text-secondary dark:glass-text-primary glass-mb-2">
              Interactive Element
            </h4>
            <p className="glass-text-sm glass-text-secondary dark:glass-text-secondary glass-mb-3">
              Hover over this card to see the interactive effects in action.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius-lg hover:glass-surface-blue glass-transition-colors">
              Interactive Button
            </button>
          </div>
        </div>
      </HoudiniGlassCard>
    </div>
  );
}

// Helper function for effect icons (used in showcase)
function getEffectIcon(effect: string) {
  switch (effect) {
    case "frost":
      return <Sparkles className="glass-w-4 glass-h-4" />;
    case "caustics":
      return <Sun className="glass-w-4 glass-h-4" />;
    case "border":
      return <Layers className="glass-w-4 glass-h-4" />;
    case "refraction":
      return <Droplets className="glass-w-4 glass-h-4" />;
    default:
      return <Zap className="glass-w-4 glass-h-4" />;
  }
}

export default HoudiniGlassCard;
