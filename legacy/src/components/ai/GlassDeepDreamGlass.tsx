"use client";
import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { useGlassSound } from "../../utils/soundDesign";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

export interface NeuralLayer {
  id: string;
  name: string;
  description: string;
  type: "conv" | "pool" | "dense" | "inception" | "residual";
  depth: number;
  features: string[];
  strength: number;
}

export interface DeepDreamSettings {
  layers: string[];
  iterations: number;
  learningRate: number;
  octaveScale: number;
  octaves: number;
  maxLoss: number;
  stepSize: number;
  tileSize: number;
}

export interface GlassDeepDreamGlassProps {
  imageSource?: string;
  availableLayers?: NeuralLayer[];
  selectedLayers?: string[];
  dreamSettings?: Partial<DeepDreamSettings>;
  compact?: boolean;
  showHeader?: boolean;
  showActions?: boolean;
  showLayerSelector?: boolean;
  showPreview?: boolean;
  showSettings?: boolean;
  enableRealTime?: boolean;
  enableAnimation?: boolean;
  enableTiling?: boolean;
  animationSpeed?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  onDreamGenerated?: (imageUrl: string, settings: DeepDreamSettings) => void;
  onLayerActivation?: (layerId: string, activation: number[]) => void;
  onProgress?: (progress: number, iteration: number) => void;
  className?: string;
}

const defaultNeuralLayers: NeuralLayer[] = [
  {
    id: "conv2d_1",
    name: "Early Features",
    description: "Basic edges and textures",
    type: "conv",
    depth: 1,
    features: ["edges", "lines", "basic_shapes"],
    strength: 0.5,
  },
  {
    id: "conv2d_5",
    name: "Texture Patterns",
    description: "Complex textures and patterns",
    type: "conv",
    depth: 5,
    features: ["textures", "patterns", "repetition"],
    strength: 0.7,
  },
  {
    id: "mixed3a",
    name: "Object Parts",
    description: "Parts of objects and shapes",
    type: "inception",
    depth: 10,
    features: ["object_parts", "curves", "complex_shapes"],
    strength: 1.0,
  },
  {
    id: "mixed4a",
    name: "Abstract Objects",
    description: "Abstract object representations",
    type: "inception",
    depth: 15,
    features: ["abstract_objects", "compositions", "spatial_relations"],
    strength: 1.2,
  },
  {
    id: "mixed4d",
    name: "Complex Structures",
    description: "Complex architectural structures",
    type: "inception",
    depth: 18,
    features: ["buildings", "architecture", "complex_structures"],
    strength: 1.5,
  },
  {
    id: "mixed5b",
    name: "High-Level Concepts",
    description: "Abstract concepts and scenes",
    type: "inception",
    depth: 25,
    features: ["scenes", "concepts", "abstract_ideas"],
    strength: 2.0,
  },
];

const defaultSettings: DeepDreamSettings = {
  layers: ["mixed3a"],
  iterations: 20,
  learningRate: 0.01,
  octaveScale: 1.4,
  octaves: 4,
  maxLoss: 10.0,
  stepSize: 1.5,
  tileSize: 512,
};

const readableGlassTextStyle: React.CSSProperties = {
  color: "var(--glass-theme-text, var(--glass-text-primary))",
} as React.CSSProperties;

export const GlassDeepDreamGlass = forwardRef<
  HTMLDivElement,
  GlassDeepDreamGlassProps
>(
  (
    {
      imageSource,
      availableLayers = defaultNeuralLayers,
      selectedLayers = ["mixed3a"],
      dreamSettings = {},
      compact = false,
      showHeader = !compact,
      showActions = !compact,
      showLayerSelector = false,
      showPreview = true,
      showSettings = false,
      enableRealTime = false,
      enableAnimation = true,
      enableTiling = true,
      animationSpeed = 1.0,
      canvasWidth = 800,
      canvasHeight = 600,
      onDreamGenerated,
      onLayerActivation,
      onProgress,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentIteration, setCurrentIteration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [originalImage, setOriginalImage] = useState<string>(
      imageSource || ""
    );
    const [dreamedImage, setDreamedImage] = useState<string>("");
    const [layerActivations, setLayerActivations] = useState<{
      [key: string]: number[];
    }>({});
    const animationFrameRef = useRef(0);
    const [enableTilingState, setEnableTilingState] = useState(enableTiling);
    const [enableAnimationState, setEnableAnimationState] =
      useState(enableAnimation);

    const [settings, setSettings] = useState<DeepDreamSettings>({
      ...defaultSettings,
      ...dreamSettings,
      layers: selectedLayers,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dreamCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    const id = useA11yId("glass-deep-dream");
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();

    // Simulate neural network layer activations
    const simulateLayerActivation = useCallback(
      (layer: NeuralLayer, imageData: ImageData): number[] => {
        const { width, height } = imageData;
        const activations: number[] = [];

        // Simulate different layer types
        switch (layer.type) {
          case "conv":
            // Convolutional layers detect local features
            for (let i = 0; i < 100; i++) {
              const x = Math.floor(Math.random() * width);
              const y = Math.floor(Math.random() * height);
              const pixelIndex = (y * width + x) * 4;

              const r = imageData.data[pixelIndex];
              const g = imageData.data[pixelIndex + 1];
              const b = imageData.data[pixelIndex + 2];

              const activation =
                Math.tanh((r + g + b) / (255 * 3) - 0.5) * layer.strength;
              activations.push(activation);
            }
            break;

          case "inception":
            // Inception layers detect complex patterns
            for (let i = 0; i < 50; i++) {
              const activation = (Math.random() - 0.5) * layer.strength * 2;
              activations.push(Math.tanh(activation));
            }
            break;

          default:
            // Default activation pattern
            for (let i = 0; i < 64; i++) {
              activations.push((Math.random() - 0.5) * layer.strength);
            }
        }

        return activations;
      },
      []
    );

    // Apply deep dream effect
    const applyDeepDream = useCallback(
      (
        imageData: ImageData,
        layer: NeuralLayer,
        intensity: number
      ): ImageData => {
        const data = new Uint8ClampedArray(imageData.data);
        const { width, height } = imageData;

        // Generate dream patterns based on layer type
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;

            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];

            // Apply different effects based on layer type
            switch (layer.type) {
              case "conv":
                // Edge enhancement and texture amplification
                const edgeX = x / width - 0.5;
                const edgeY = y / height - 0.5;
                const edgeStrength = Math.sqrt(edgeX * edgeX + edgeY * edgeY);

                const enhancement =
                  Math.sin(edgeStrength * 20) * intensity * layer.strength * 50;
                r = Math.max(0, Math.min(255, r + enhancement));
                g = Math.max(0, Math.min(255, g + enhancement));
                b = Math.max(0, Math.min(255, b + enhancement));
                break;

              case "inception":
                // Complex pattern generation
                const spiralX = Math.cos((x + y) * 0.05) * Math.sin(x * 0.02);
                const spiralY = Math.sin((x + y) * 0.05) * Math.cos(y * 0.02);
                const spiralIntensity =
                  (spiralX + spiralY) * intensity * layer.strength * 30;

                r = Math.max(0, Math.min(255, r + spiralIntensity));
                g = Math.max(0, Math.min(255, g + spiralIntensity * 0.8));
                b = Math.max(0, Math.min(255, b + spiralIntensity * 0.6));
                break;

              case "dense":
                // Global feature amplification
                const globalPattern = Math.sin(x * 0.01) * Math.cos(y * 0.01);
                const amplification =
                  globalPattern * intensity * layer.strength * 20;

                r = Math.max(0, Math.min(255, r * (1 + amplification / 255)));
                g = Math.max(0, Math.min(255, g * (1 + amplification / 255)));
                b = Math.max(0, Math.min(255, b * (1 + amplification / 255)));
                break;

              default:
                // Default pattern
                const wave = Math.sin(x * 0.03) * Math.cos(y * 0.03);
                const modification = wave * intensity * layer.strength * 15;

                r = Math.max(0, Math.min(255, r + modification));
                g = Math.max(0, Math.min(255, g + modification));
                b = Math.max(0, Math.min(255, b + modification));
            }

            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
          }
        }

        return new ImageData(data, width, height);
      },
      []
    );

    // Generate deep dream
    const generateDeepDream = useCallback(async () => {
      if (!originalImage) return;

      setIsGenerating(true);
      setCurrentIteration(0);
      setProgress(0);
      play("processing");

      const canvas = canvasRef.current;
      const dreamCanvas = dreamCanvasRef.current;

      if (!canvas || !dreamCanvas) return;

      const ctx = canvas.getContext("2d");
      const dreamCtx = dreamCanvas.getContext("2d");

      if (!ctx || !dreamCtx) return;

      // Load original image
      const img = new Image();
      img.onload = async () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let currentImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Process through multiple octaves
        for (let octave = 0; octave < settings.octaves; octave++) {
          // Scale image for current octave
          const scale = Math.pow(settings.octaveScale, octave);
          const octaveWidth = Math.floor(canvas.width / scale);
          const octaveHeight = Math.floor(canvas.height / scale);

          // Process iterations for this octave
          for (
            let iteration = 0;
            iteration < Math.floor(settings.iterations / settings.octaves);
            iteration++
          ) {
            const totalIteration =
              octave * Math.floor(settings.iterations / settings.octaves) +
              iteration;
            setCurrentIteration(totalIteration);
            const pct = (totalIteration / settings.iterations) * 100;
            setProgress(pct);
            onProgress?.(pct, totalIteration);

            // Apply deep dream to selected layers
            for (const layerId of settings.layers) {
              const layer = availableLayers.find((l) => l.id === layerId);
              if (layer) {
                // Simulate layer activation
                const activations = simulateLayerActivation(
                  layer,
                  currentImageData
                );
                setLayerActivations((prev: any) => ({
                  ...prev,
                  [layerId]: activations,
                }));
                onLayerActivation?.(layerId, activations);

                // Apply dream effect
                const intensity = settings.learningRate * settings.stepSize;
                currentImageData = applyDeepDream(
                  currentImageData,
                  layer,
                  intensity
                );
              }
            }

            // Update dream canvas
            dreamCtx.putImageData(currentImageData, 0, 0);

            // Add delay for animation
            await new Promise((resolve) =>
              setTimeout(resolve, ANIMATION.DURATION.fast / animationSpeed)
            );
          }
        }

        const dreamUrl = dreamCanvas.toDataURL();
        setDreamedImage(dreamUrl);
        onDreamGenerated?.(dreamUrl, settings);

        setIsGenerating(false);
        play("success");
      };

      img.src = originalImage;
    }, [
      originalImage,
      settings,
      availableLayers,
      simulateLayerActivation,
      applyDeepDream,
      animationSpeed,
      onProgress,
      onLayerActivation,
      onDreamGenerated,
      play,
    ]);

    // Animation loop
    const animateDeepDream = useCallback(() => {
      if (!enableAnimation || isGenerating) return;

      animationFrameRef.current += 1;

      const canvas = dreamCanvasRef.current;
      if (canvas && dreamedImage) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            // Create animated effect
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(animationFrameRef.current * 0.01);
            ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
            ctx.restore();
          };
          img.src = dreamedImage;
        }
      }

      animationRef.current = requestAnimationFrame(animateDeepDream);
    }, [enableAnimation, isGenerating, dreamedImage]);

    // Handle layer selection
    const toggleLayer = useCallback(
      (layerId: string) => {
        setSettings((prev: any) => {
          const layers = prev.layers.includes(layerId)
            ? prev.layers.filter((id: any) => id !== layerId)
            : [...prev.layers, layerId];
          return { ...prev, layers };
        });
        play("select");
      },
      [play]
    );

    // Initialize
    useEffect(() => {
      if (!enableAnimation || isGenerating) return;

      animationRef.current = requestAnimationFrame(animateDeepDream);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [enableAnimation, isGenerating, animateDeepDream]);

    useEffect(() => {
      if (enableRealTime && originalImage) {
        const debounceTimer = setTimeout(() => {
          generateDeepDream();
        }, 1000);
        return () => clearTimeout(debounceTimer);
      }
    }, [settings, enableRealTime, originalImage, generateDeepDream]);

    // Keep empty previews visibly intentional. A transparent black canvas is
    // indistinguishable from a failed renderer to users and visual tooling.
    useEffect(() => {
      if (originalImage) return;
      const paintEmptyPreview = (
        canvas: HTMLCanvasElement | null,
        label: string
      ) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop(0, "rgba(248, 250, 252, 0.98)");
        gradient.addColorStop(1, "rgba(226, 232, 240, 0.94)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(100, 116, 139, 0.34)";
        ctx.lineWidth = 2;
        for (let y = 48; y < canvas.height; y += 72) {
          ctx.beginPath();
          ctx.moveTo(28, y);
          ctx.bezierCurveTo(
            canvas.width * 0.3,
            y - 20,
            canvas.width * 0.68,
            y + 20,
            canvas.width - 28,
            y
          );
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(30, 41, 59, 0.82)";
        ctx.font = "600 18px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, canvas.width / 2, canvas.height / 2);
      };
      paintEmptyPreview(canvasRef.current, "Source preview");
      paintEmptyPreview(dreamCanvasRef.current, "Dream preview");
    }, [originalImage, canvasWidth, canvasHeight]);

    const LayerSelector = () => (
      <div className="glass-space-y-4">
        <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
          Neural Layers
        </h4>

        <div className="glass-deep-dream-layer-list glass-grid glass-grid-cols-1 glass-gap-2">
          {availableLayers.map((layer) => (
            <motion.div
              key={layer.id}
              role="checkbox"
              aria-checked={settings.layers.includes(layer.id)}
              tabIndex={0}
              className="glass-deep-dream-layer glass-p-3 glass-radius-lg glass-border glass-cursor-pointer"
              style={{
                background: settings.layers.includes(layer.id)
                  ? "rgba(226, 234, 238, 0.78)"
                  : "rgba(255, 255, 255, 0.46)",
                borderColor: settings.layers.includes(layer.id)
                  ? "rgba(71, 93, 105, 0.42)"
                  : "rgba(255, 255, 255, 0.68)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,.8), 0 7px 20px rgba(30,41,59,.06)",
              }}
              whileHover={shouldAnimate ? { scale: 1.01 } : {}}
              whileTap={shouldAnimate ? { scale: 0.99 } : {}}
              onClick={() => toggleLayer(layer.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleLayer(layer.id);
                }
              }}
            >
              <div className="glass-flex glass-items-start glass-justify-between">
                <div className="glass-flex-1">
                  <div className="glass-flex glass-items-center glass-space-x-2 glass-mb-1">
                    <h5 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90">
                      {layer.name}
                    </h5>
                    <span
                      className="glass-px-2 glass-py-0.5 glass-radius-full glass-text-xs glass-font-medium"
                      style={{
                        background: "rgba(71,85,105,.1)",
                        color: "var(--glass-theme-text-secondary, var(--glass-text-secondary))",
                      }}
                    >
                      {layer.type}
                    </span>
                  </div>

                  <p className="glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2">
                    {layer.description}
                  </p>

                  <div className="glass-flex glass-items-center glass-space-x-4 glass-text-xs glass-text-primary-glass-opacity-50">
                    <span>Depth: {layer.depth}</span>
                    <span>Strength: {layer.strength.toFixed(1)}</span>
                  </div>

                  <div className="glass-flex glass-flex-wrap glass-gap-1 glass-mt-2">
                    {layer.features.slice(0, 3).map((feature: any) => (
                      <span
                        key={feature}
                        className="glass-px-1.5 glass-py-0.5 glass-surface-subtle/10 glass-text-primary-glass-opacity-60 glass-radius glass-text-xs"
                      >
                        {feature.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {settings.layers.includes(layer.id) && (
                  <div className="glass-text-primary glass-ml-2">✓</div>
                )}
              </div>

              {/* Layer activation visualization */}
              {layerActivations[layer.id] && (
                <div className="glass-mt-2 glass-pt-2 glass-border-t glass-border-white/10">
                  <div className="glass-flex glass-items-center glass-space-x-1">
                    {layerActivations[layer.id]
                      .slice(0, 20)
                      .map((activation, i) => (
                        <div
                          key={i}
                          className="glass-w-1 glass-surface-blue glass-radius"
                          style={{
                            height: `${Math.abs(activation) * 10 + 2}px`,
                            opacity: Math.abs(activation),
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );

    const SettingsPanel = () => (
      <div className="glass-space-y-4">
        <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
          Dream Settings
        </h4>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-3">
          <div>
            <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
              Iterations: {settings.iterations}
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={settings.iterations}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  iterations: parseInt(e.target.value),
                }))
              }
              aria-label={`Iterations: ${settings.iterations}`}
              className="glass-deep-dream-range glass-w-full glass-cursor-pointer"
            />
          </div>

          <div>
            <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
              Learning Rate: {settings.learningRate.toFixed(3)}
            </label>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={settings.learningRate}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  learningRate: parseFloat(e.target.value),
                }))
              }
              aria-label={`Learning Rate: ${settings.learningRate.toFixed(3)}`}
              className="glass-deep-dream-range glass-w-full glass-cursor-pointer"
            />
          </div>

          <div>
            <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
              Octaves: {settings.octaves}
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={settings.octaves}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  octaves: parseInt(e.target.value),
                }))
              }
              aria-label={`Octaves: ${settings.octaves}`}
              className="glass-deep-dream-range glass-w-full glass-cursor-pointer"
            />
          </div>

          <div>
            <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
              Octave Scale: {settings.octaveScale.toFixed(1)}
            </label>
            <input
              type="range"
              min="1.1"
              max="2.0"
              step="0.1"
              value={settings.octaveScale}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  octaveScale: parseFloat(e.target.value),
                }))
              }
              aria-label={`Octave Scale: ${settings.octaveScale.toFixed(1)}`}
              className="glass-deep-dream-range glass-w-full glass-cursor-pointer"
            />
          </div>

          <div>
            <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
              Step Size: {settings.stepSize.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={settings.stepSize}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  stepSize: parseFloat(e.target.value),
                }))
              }
              aria-label={`Step Size: ${settings.stepSize.toFixed(1)}`}
              className="glass-deep-dream-range glass-w-full glass-cursor-pointer"
            />
          </div>

          <div>
            <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
              Max Loss: {settings.maxLoss.toFixed(1)}
            </label>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="1.0"
              value={settings.maxLoss}
              onChange={(e) =>
                setSettings((prev: any) => ({
                  ...prev,
                  maxLoss: parseFloat(e.target.value),
                }))
              }
              aria-label={`Max Loss: ${settings.maxLoss.toFixed(1)}`}
              className="glass-deep-dream-range glass-w-full glass-cursor-pointer"
            />
          </div>
        </div>

        <div className="glass-flex glass-flex-wrap glass-gap-2">
          {[
            {
              label: "Enable Tiling",
              value: enableTilingState,
              set: setEnableTilingState,
            },
            {
              label: "Animate Result",
              value: enableAnimationState,
              set: setEnableAnimationState,
            },
          ].map((control) => (
            <button
              key={control.label}
              type="button"
              role="switch"
              aria-checked={control.value}
              onClick={() => control.set(!control.value)}
              className="glass-deep-dream-switch glass-flex glass-items-center glass-justify-between glass-gap-3 glass-radius-full glass-px-3 glass-py-2 glass-text-sm"
              style={{
                background: "rgba(255,255,255,.5)",
                border: "1px solid rgba(255,255,255,.72)",
                color: "var(--glass-theme-text, var(--glass-text-primary))",
              }}
            >
              <span>{control.label}</span>
              <span
                aria-hidden="true"
                className="glass-relative glass-radius-full"
                style={{
                  width: 36,
                  height: 21,
                  background: control.value
                    ? "rgba(72,94,106,.84)"
                    : "rgba(100,116,139,.2)",
                }}
              >
                <span
                  className="glass-absolute glass-radius-full"
                  style={{
                    width: 17,
                    height: 17,
                    top: 2,
                    left: control.value ? 17 : 2,
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(15,23,42,.25)",
                    transition: "left 160ms ease",
                  }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        id={id}
        variant="frosted"
        data-glass-component
        style={{
          ...readableGlassTextStyle,
          minWidth: 0,
          overflow: "visible",
        }}
        className={`glass-deep-dream-glass ${compact ? "glass-p-3 glass-space-y-3" : "glass-p-4 glass-space-y-4"} glass-max-w-full ${className}`}
        {...props}
      >
        <style>{`
          #${id} .glass-deep-dream-range { appearance:none; height:28px; background:transparent; }
          #${id} .glass-deep-dream-range::-webkit-slider-runnable-track { height:6px; border-radius:999px; background:rgba(71,85,105,.17); box-shadow:inset 0 1px 2px rgba(15,23,42,.12); }
          #${id} .glass-deep-dream-range::-webkit-slider-thumb { appearance:none; width:20px; height:20px; margin-top:-7px; border-radius:50%; border:1px solid rgba(255,255,255,.92); background:linear-gradient(145deg,#fff,#dce4e8); box-shadow:0 3px 10px rgba(15,23,42,.24); }
          #${id} .glass-deep-dream-range::-moz-range-track { height:6px; border-radius:999px; background:rgba(71,85,105,.17); }
          #${id} .glass-deep-dream-range::-moz-range-thumb { width:20px; height:20px; border-radius:50%; border:1px solid rgba(255,255,255,.92); background:#f8fafc; box-shadow:0 3px 10px rgba(15,23,42,.24); }
          #${id} :where(button,[role="checkbox"],input,label):focus-visible { outline:3px solid rgba(56,116,145,.34); outline-offset:2px; }
          @media (min-width: 720px) { #${id} .glass-deep-dream-layer-list { grid-template-columns:repeat(2,minmax(0,1fr)); } }
          @media (max-width: 480px) { #${id} .glass-deep-dream-layer { padding:10px; } #${id} .glass-deep-dream-switch { width:100%; } }
        `}</style>
        {/* Header */}
        {showHeader && (
          <div className="glass-flex glass-items-center glass-justify-between">
            <div className="glass-min-w-0">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90">
                DeepDream Glass
              </h3>
              <p className="glass-text-sm glass-text-primary-glass-opacity-60">
                Neural network-powered surreal image generation
              </p>
            </div>

            <div className="glass-flex glass-items-center glass-space-x-2">
              {enableRealTime && (
                <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                  <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse" />
                  <span className="glass-text-xs">Real-time</span>
                </div>
              )}
              {isGenerating && (
                <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                  <div className="glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin" />
                  <span className="glass-text-xs">Dreaming...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview area */}
        {showPreview && (
          <div
            className={`glass-grid ${compact ? "glass-grid-cols-2 glass-gap-3" : "glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4"}`}
            style={
              compact
                ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }
                : undefined
            }
          >
            {/* Original */}
            <div className="glass-space-y-2">
              <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
                Original
              </h4>
              <div className="glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="glass-block glass-w-full glass-h-full glass-object-cover"
                />
                {!originalImage && (
                  <div className="glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center glass-text-primary-glass-opacity-50">
                    <div className="glass-text-center">
                      <div
                        className="glass-text-4xl glass-mb-2"
                        aria-hidden="true"
                      >
                        ◇
                      </div>
                      <p>No image loaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DeepDream result */}
            <div className="glass-space-y-2">
              <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
                DeepDream
              </h4>
              <div className="glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden">
                <canvas
                  ref={dreamCanvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="glass-block glass-w-full glass-h-full glass-object-cover"
                />
                {isGenerating && (
                  <div className="glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center">
                    <div className="glass-text-center glass-text-primary">
                      <div className="glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto glass-mb-2" />
                      <div className="glass-text-sm">
                        Iteration {currentIteration}
                      </div>
                      <div className="glass-text-xs glass-mt-1">
                        {Math.round(progress)}% complete
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {isGenerating && (
          <div
            className={`
            p-3 rounded-lg border border-blue-400/30
            ${createGlassStyle({ blur: "sm", opacity: 0.8 }).background}
          `}
          >
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-2">
              <span className="glass-text-sm glass-text-primary-glass-opacity-80">
                Generating Deep Dream...
              </span>
              <span className="glass-text-sm glass-font-medium glass-text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2">
              <motion.div
                className="glass-surface-blue glass-h-2 glass-radius-full"
                animate={{ width: `${progress}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: ANIMATION.DURATION.normal / 1000 }
                }
              />
            </div>
            <div className="glass-flex glass-items-center glass-justify-between glass-mt-1 glass-text-xs glass-text-primary-glass-opacity-60">
              <span>
                Iteration: {currentIteration} / {settings.iterations}
              </span>
              <span>Layers: {settings.layers.length}</span>
            </div>
          </div>
        )}

        {(showLayerSelector || showSettings) && (
          <div className="glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-4">
            {showLayerSelector && <LayerSelector />}
            {showSettings && <SettingsPanel />}
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10">
            <div className="glass-flex glass-items-center glass-space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setOriginalImage(url);
                    play("upload");

                    // Load image to canvas
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        const img = new Image();
                        img.onload = () => {
                          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        };
                        img.src = url;
                      }
                    }
                  }
                }}
                className="glass-hidden"
                id="dream-image-upload"
              />
              <motion.label
                htmlFor="dream-image-upload"
                className="glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-cursor-pointer glass-transition-colors"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              >
                Upload Image
              </motion.label>

              <motion.button
                className="glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors disabled:glass-opacity-50"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                onClick={generateDeepDream}
                disabled={
                  isGenerating || !originalImage || settings.layers.length === 0
                }
              >
                {isGenerating ? "Generating..." : "Generate Dream"}
              </motion.button>
            </div>

            {dreamedImage && (
              <motion.a
                href={dreamedImage}
                download="deep-dream.png"
                className="glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              >
                Download Dream
              </motion.a>
            )}
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassDeepDreamGlass.displayName = "GlassDeepDreamGlass";
