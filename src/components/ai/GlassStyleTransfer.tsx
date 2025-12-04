"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { useGlassSound } from "../../utils/soundDesign";

export interface StyleModel {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  strength: number;
  category: "artistic" | "photographic" | "abstract" | "vintage" | "modern";
}

export interface GlassStyleTransferProps {
  sourceImage?: string;
  styleModels?: StyleModel[];
  selectedStyle?: string;
  transferStrength?: number;
  realTimePreview?: boolean;
  showProgressIndicator?: boolean;
  showStyleLibrary?: boolean;
  showAdvancedControls?: boolean;
  preserveColors?: boolean;
  enhanceDetails?: boolean;
  blendMode?: "normal" | "multiply" | "screen" | "overlay" | "soft-light";
  resolution?: "low" | "medium" | "high" | "ultra";
  onStyleSelect?: (styleId: string) => void;
  onTransferComplete?: (result: string) => void;
  onProgressUpdate?: (progress: number) => void;
  className?: string;
}

const defaultStyleModels: StyleModel[] = [
  {
    id: "van-gogh",
    name: "Van Gogh Starry Night",
    description: "Impressionistic swirls and bold brushstrokes",
    previewUrl: "/styles/van-gogh.jpg",
    strength: 0.8,
    category: "artistic",
  },
  {
    id: "picasso",
    name: "Picasso Cubism",
    description: "Geometric fragmentation and multiple perspectives",
    previewUrl: "/styles/picasso.jpg",
    strength: 0.7,
    category: "artistic",
  },
  {
    id: "monet",
    name: "Monet Water Lilies",
    description: "Soft impressionistic light and color",
    previewUrl: "/styles/monet.jpg",
    strength: 0.6,
    category: "artistic",
  },
  {
    id: "film-noir",
    name: "Film Noir",
    description: "High contrast black and white cinematography",
    previewUrl: "/styles/film-noir.jpg",
    strength: 0.9,
    category: "photographic",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    description: "Retro-futuristic neon aesthetics",
    previewUrl: "/styles/synthwave.jpg",
    strength: 0.8,
    category: "modern",
  },
  {
    id: "kandinsky",
    name: "Kandinsky Abstract",
    description: "Geometric abstraction with vibrant colors",
    previewUrl: "/styles/kandinsky.jpg",
    strength: 0.7,
    category: "abstract",
  },
];

export const GlassStyleTransfer = forwardRef<
  HTMLDivElement,
  GlassStyleTransferProps
>(
  (
    {
      sourceImage,
      styleModels = defaultStyleModels,
      selectedStyle = "",
      transferStrength = 0.7,
      realTimePreview = true,
      showProgressIndicator = true,
      showStyleLibrary = true,
      showAdvancedControls = true,
      preserveColors = false,
      enhanceDetails = true,
      blendMode = "normal",
      resolution = "medium",
      onStyleSelect,
      onTransferComplete,
      onProgressUpdate,
      className="",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [uploadedImage, setUploadedImage] = useState<string>(
      sourceImage || ""
    );
    const [selectedStyleId, setSelectedStyleId] = useState(selectedStyle);
    const [transferParams, setTransferParams] = useState({
      strength: transferStrength,
      preserveColors,
      enhanceDetails,
      blendMode,
      resolution,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const id = useA11yId("glass-style-transfer");
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();

    // Simulate style transfer processing
    const processStyleTransfer = useCallback(
      async (imageData: string, styleId: string) => {
        if (!imageData || !styleId) return;

        setIsProcessing(true);
        setProgress(0);
        play("processing");

        // Simulate processing with progress updates
        const steps = [
          { label: "Loading models...", duration: 500 },
          { label: "Analyzing content...", duration: 800 },
          { label: "Extracting style features...", duration: 1000 },
          { label: "Applying style transfer...", duration: 1500 },
          { label: "Optimizing result...", duration: 700 },
          { label: "Finalizing...", duration: 400 },
        ];

        let totalProgress = 0;
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          await new Promise((resolve) => setTimeout(resolve, step.duration));
          totalProgress = ((i + 1) / steps.length) * 100;
          setProgress(totalProgress);
          onProgressUpdate?.(totalProgress);
        }

        // Simulate result generation
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Create a stylized version using advanced canvas rendering
            const selectedStyleModel = styleModels.find(
              (s) => s.id === styleId
            );
            const gradient = ctx.createLinearGradient(
              0,
              0,
              canvas.width,
              canvas.height
            );

            // Apply different effects based on style category
            switch (selectedStyleModel?.category) {
              case "artistic":
                gradient.addColorStop(0, "#FF6B6B");
                gradient.addColorStop(0.5, "#4ECDC4");
                gradient.addColorStop(1, "#45B7D1");
                break;
              case "photographic":
                gradient.addColorStop(0, "#2D3748");
                gradient.addColorStop(0.5, "#4A5568");
                gradient.addColorStop(1, "#718096");
                break;
              case "abstract":
                gradient.addColorStop(0, "#9F7AEA");
                gradient.addColorStop(0.5, "#F093FB");
                gradient.addColorStop(1, "#F9844A");
                break;
              default:
                gradient.addColorStop(0, "#667EEA");
                gradient.addColorStop(1, "#764BA2");
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add style-specific effects
            if (selectedStyleModel?.category === "artistic") {
              // Add brush stroke effect
              for (let i = 0; i < 50; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                ctx.lineWidth = Math.random() * 3 + 1;
                ctx.moveTo(
                  Math.random() * canvas.width,
                  Math.random() * canvas.height
                );
                ctx.lineTo(
                  Math.random() * canvas.width,
                  Math.random() * canvas.height
                );
                ctx.stroke();
              }
            }

            const resultUrl = canvas.toDataURL();
            setPreviewImage(resultUrl);
            onTransferComplete?.(resultUrl);
          }
        }

        setIsProcessing(false);
        play("success");
      },
      [styleModels, onProgressUpdate, onTransferComplete, play]
    );

    // Handle file upload
    const handleFileUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImage(result);
          if (realTimePreview && selectedStyleId) {
            processStyleTransfer(result, selectedStyleId);
          }
        };
        reader.readAsDataURL(file);
      },
      [realTimePreview, selectedStyleId, processStyleTransfer]
    );

    // Handle style selection
    const handleStyleSelect = useCallback(
      (styleId: string) => {
        setSelectedStyleId(styleId);
        onStyleSelect?.(styleId);
        play("select");

        if (realTimePreview && uploadedImage) {
          processStyleTransfer(uploadedImage, styleId);
        }
      },
      [
        realTimePreview,
        uploadedImage,
        processStyleTransfer,
        onStyleSelect,
        play,
      ]
    );

    // Real-time parameter updates
    useEffect(() => {
      if (realTimePreview && uploadedImage && selectedStyleId) {
        const debounceTimer = setTimeout(() => {
          processStyleTransfer(uploadedImage, selectedStyleId);
        }, 500);
        return () => clearTimeout(debounceTimer);
      }
    }, [
      transferParams,
      realTimePreview,
      uploadedImage,
      selectedStyleId,
      processStyleTransfer,
    ]);

    const StyleLibrary = () => (
      <div className='glass-space-y-4'>
        <h4 className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80'>
          Style Library
        </h4>
        <div className='glass-grid glass-grid-cols-2 md:glass-grid-cols-3 glass-gap-3'>
          {styleModels.map((style) => (
            <motion.div
              key={style.id}
              className={`
                relative p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${
                  selectedStyleId === style.id
                    ? "border-blue-400 bg-blue-400/20"
                    : "border-white/20 hover:border-white/40 bg-white/5"
                }
              `}
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={() => handleStyleSelect(style.id)}
            >
              <div className='glass-aspect-square glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-lg glass-mb-2 glass-overflow-hidden'>
                <div
                  className={`
                  w-full h-full bg-gradient-to-br 
                  ${
                    style.category === "artistic"
                      ? "from-red-400 to-blue-400"
                      : style.category === "photographic"
                        ? "from-gray-600 to-gray-800"
                        : style.category === "abstract"
                          ? "from-purple-400 to-pink-400"
                          : style.category === "vintage"
                            ? "from-yellow-600 to-orange-800"
                            : "from-blue-400 to-purple-600"
                  }
                `}
                />
              </div>

              <div className='glass-text-xs glass-text-primary-glass-opacity-90 glass-font-medium glass-mb-1'>
                {style.name}
              </div>
              <div className='glass-text-xs glass-text-primary-glass-opacity-60'>
                {style.description}
              </div>

              <div className='glass-absolute glass-top-2 glass-right-2'>
                <div
                  className={`
                  px-1.5 py-0.5 rounded text-xs font-medium
                  ${
                    style.category === "artistic"
                      ? "bg-red-500/20 text-red-300"
                      : style.category === "photographic"
                        ? "bg-gray-500/20 text-gray-300"
                        : style.category === "abstract"
                          ? "bg-purple-500/20 text-purple-300"
                          : style.category === "vintage"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-blue-500/20 text-blue-300"
                  }
                `}
                >
                  {style.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );

    const AdvancedControls = () => (
      <div className='glass-space-y-4'>
        <h4 className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80'>
          Advanced Controls
        </h4>

        <div className='glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4'>
          <div>
            <label className='glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2'>
              Transfer Strength: {Math.round(transferParams.strength * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={transferParams.strength}
              onChange={(e) =>
                setTransferParams((prev: any) => ({
                  ...prev,
                  strength: parseFloat(e.target.value),
                }))
              }
              aria-label={`Transfer Strength: ${Math.round(transferParams.strength * 100)}%`}
              className='glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer glass-slider'
            />
          </div>

          <div>
            <label className='glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2'>
              Resolution
            </label>
            <select
              value={transferParams.resolution}
              onChange={(e) =>
                setTransferParams((prev: any) => ({
                  ...prev,
                  resolution: e.target.value as any,
                }))
              }
              aria-label="Resolution"
              className='glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm'
            >
              <option value="low">Low (512px)</option>
              <option value="medium">Medium (1024px)</option>
              <option value="high">High (2048px)</option>
              <option value="ultra">Ultra (4096px)</option>
            </select>
          </div>

          <div>
            <label className='glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-2'>
              Blend Mode
            </label>
            <select
              value={transferParams.blendMode}
              onChange={(e) =>
                setTransferParams((prev: any) => ({
                  ...prev,
                  blendMode: e.target.value as any,
                }))
              }
              aria-label="Blend Mode"
              className='glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm'
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="soft-light">Soft Light</option>
            </select>
          </div>
        </div>

        <div className='glass-flex glass-items-center glass-space-x-6'>
          <label className='glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer'>
            <input
              type="checkbox"
              checked={transferParams.preserveColors}
              onChange={(e) =>
                setTransferParams((prev: any) => ({
                  ...prev,
                  preserveColors: e.target.checked,
                }))
              }
              className='glass-w-4 glass-h-4 glass-radius glass-border-white/30'
            />
            <span className='glass-text-sm glass-text-primary-glass-opacity-80'>
              Preserve Colors
            </span>
          </label>

          <label className='glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer'>
            <input
              type="checkbox"
              checked={transferParams.enhanceDetails}
              onChange={(e) =>
                setTransferParams((prev: any) => ({
                  ...prev,
                  enhanceDetails: e.target.checked,
                }))
              }
              className='glass-w-4 glass-h-4 glass-radius glass-border-white/30'
            />
            <span className='glass-text-sm glass-text-primary-glass-opacity-80'>
              Enhance Details
            </span>
          </label>
        </div>
      </div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={`p-6 space-y-6 ${className}`}
        {...props}
      >
        {/* Header */}
        <div className="glass-flex glass-items-center glass-justify-between">
          <div>
            <h3 className='glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90'>
              Style Transfer AI
            </h3>
            <p className='glass-text-sm glass-text-primary-glass-opacity-60'>
              Transform your images with artistic styles
            </p>
          </div>

          <div className='glass-flex glass-items-center glass-space-x-2'>
            {realTimePreview && (
              <div className='glass-flex glass-items-center glass-space-x-1 glass-text-primary'>
                <div className='glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse' />
                <span className="glass-text-xs">Real-time</span>
              </div>
            )}
          </div>
        </div>

        {/* Main interface */}
        <div className='glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6'>
          {/* Source image */}
          <div className='glass-space-y-4'>
            <h4 className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80'>
              Source Image
            </h4>

            <div
              className='glass-relative glass-aspect-square glass-surface-subtle/5 glass-border-2 glass-border-dashed glass-border-white/30 glass-radius-lg glass-overflow-hidden glass-cursor-pointer hover:glass-border-white/50 glass-transition-colors'
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Source"
                  className='glass-w-full glass-h-full glass-object-cover'
                />
              ) : (
                <div className='glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-50'>
                  <div className='glass-text-center'>
                    <div className='glass-text-4xl glass-mb-2'>📷</div>
                    <p>Click to upload image</p>
                    <p className='glass-text-xs glass-mt-1'>PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                aria-label="Upload image file"
                className='glass-hidden glass-touch-target glass-contrast-guard'
              />
            </div>
          </div>

          {/* Preview */}
          <div className='glass-space-y-4'>
            <div className="glass-flex glass-items-center glass-justify-between">
              <h4 className='glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80'>
                Style Preview
              </h4>
              {isProcessing && showProgressIndicator && (
                <div className='glass-flex glass-items-center glass-space-x-2 glass-text-primary'>
                  <div className='glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin' />
                  <span className="glass-text-xs">{Math.round(progress)}%</span>
                </div>
              )}
            </div>

            <div className='glass-relative glass-aspect-square glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden'>
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Styled preview"
                  className='glass-w-full glass-h-full glass-object-cover'
                />
              ) : (
                <div className='glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-50'>
                  <div className='glass-text-center'>
                    <div className='glass-text-4xl glass-mb-2'>🎨</div>
                    <p>Style preview will appear here</p>
                  </div>
                </div>
              )}

              {/* Processing overlay */}
              {isProcessing && (
                <div className='glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center'>
                  <div className='glass-text-center glass-text-primary'>
                    <div className='glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto glass-mb-2' />
                    <div className="glass-text-sm">Processing...</div>
                    <div className='glass-text-xs glass-mt-1'>
                      {Math.round(progress)}% complete
                    </div>
                  </div>
                </div>
              )}
            </div>

            <canvas
              ref={canvasRef}
              width={512}
              height={512}
              className='glass-hidden'
            />
          </div>
        </div>

        {/* Style library */}
        {showStyleLibrary && <StyleLibrary />}

        {/* Advanced controls */}
        {showAdvancedControls && <AdvancedControls />}

        {/* Action buttons */}
        <div className='glass-flex glass-items-center glass-justify-between glass-pt-4 glass-border-t glass-border-white/10'>
          <div className='glass-flex glass-items-center glass-space-x-4'>
            <motion.button
              className='glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors'
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={() =>
                uploadedImage &&
                selectedStyleId &&
                processStyleTransfer(uploadedImage, selectedStyleId)
              }
              disabled={isProcessing || !uploadedImage || !selectedStyleId}
            >
              {isProcessing ? "Processing..." : "Apply Style"}
            </motion.button>

            <motion.button
              className='glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors'
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={() => {
                setPreviewImage("");
                setProgress(0);
              }}
            >
              Clear
            </motion.button>
          </div>

          {previewImage && (
            <motion.a
              href={previewImage}
              download="styled-image.png"
              className='glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors'
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              Download Result
            </motion.a>
          )}
        </div>

        {/* Progress indicator */}
        {isProcessing && showProgressIndicator && (
          <div
            className={`
            p-3 rounded-lg border border-blue-400/30
            ${createGlassStyle({ blur: "sm", opacity: 0.8 }).background}
          `}
          >
            <div className='glass-flex glass-items-center glass-justify-between glass-mb-2'>
              <span className='glass-text-sm glass-text-primary-glass-opacity-80'>
                Processing Style Transfer
              </span>
              <span className='glass-text-sm glass-font-medium glass-text-primary'>
                {Math.round(progress)}%
              </span>
            </div>
            <div className='glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2'>
              <motion.div
                className='glass-surface-blue glass-h-2 glass-radius-full'
                animate={{ width: `${progress}%` }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
                }
              />
            </div>
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassStyleTransfer.displayName = "GlassStyleTransfer";
