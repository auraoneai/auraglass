"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { useGlassSound } from "../../utils/soundDesign";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { normalizeColorInputValue } from "../../utils/colorInput";

export interface FilterEffect {
  id: string;
  name: string;
  description: string;
  category: "artistic" | "color" | "blur" | "distortion" | "vintage" | "modern";
  intensity: number;
  parameters?: FilterParameters;
}

export type FilterParameterValue = number | string;
export type FilterParameters = Record<string, FilterParameterValue>;
type ProcessingQuality = ProcessingSettings["quality"];

export interface ProcessingSettings {
  quality: "low" | "medium" | "high" | "ultra";
  fps: number;
  enableGPU: boolean;
  batchSize: number;
}

export interface GlassLiveFilterProps {
  videoSource?: string | MediaStream;
  imageSource?: string;
  availableFilters?: FilterEffect[];
  selectedFilters?: string[];
  processingSettings?: Partial<ProcessingSettings>;
  compact?: boolean;
  showHeader?: boolean;
  showActions?: boolean;
  showFilterLibrary?: boolean;
  showPreview?: boolean;
  showControls?: boolean;
  enableRealTimeProcessing?: boolean;
  enableChaining?: boolean;
  enableCustomFilters?: boolean;
  maxFilters?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  onFilterApply?: (filterId: string, params: FilterParameters) => void;
  onProcessingComplete?: (processedData: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

const defaultFilters: FilterEffect[] = [
  {
    id: "grayscale",
    name: "Grayscale",
    description: "Convert to black and white",
    category: "color",
    intensity: 1.0,
    parameters: { strength: 1.0 },
  },
  {
    id: "sepia",
    name: "Sepia",
    description: "Vintage sepia tone effect",
    category: "vintage",
    intensity: 0.8,
    parameters: { warmth: 0.8 },
  },
  {
    id: "blur",
    name: "Gaussian Blur",
    description: "Smooth blur effect",
    category: "blur",
    intensity: 1.0,
    parameters: { radius: 5 },
  },
  {
    id: "sharpen",
    name: "Sharpen",
    description: "Enhance image details",
    category: "artistic",
    intensity: 0.6,
    parameters: { amount: 0.6 },
  },
  {
    id: "brightness",
    name: "Brightness",
    description: "Adjust image brightness",
    category: "color",
    intensity: 1.2,
    parameters: { level: 1.2 },
  },
  {
    id: "contrast",
    name: "Contrast",
    description: "Adjust image contrast",
    category: "color",
    intensity: 1.3,
    parameters: { level: 1.3 },
  },
  {
    id: "saturation",
    name: "Saturation",
    description: "Adjust color saturation",
    category: "color",
    intensity: 1.5,
    parameters: { level: 1.5 },
  },
  {
    id: "hue-shift",
    name: "Hue Shift",
    description: "Shift color hues",
    category: "color",
    intensity: 0.5,
    parameters: { degrees: 30 },
  },
  {
    id: "edge-detect",
    name: "Edge Detection",
    description: "Detect and highlight edges",
    category: "artistic",
    intensity: 1.0,
    parameters: { threshold: 0.5 },
  },
  {
    id: "emboss",
    name: "Emboss",
    description: "3D embossed effect",
    category: "artistic",
    intensity: 0.8,
    parameters: { strength: 0.8 },
  },
  {
    id: "vintage",
    name: "Vintage Film",
    description: "Old film camera effect",
    category: "vintage",
    intensity: 0.9,
    parameters: { grain: 0.3, vignette: 0.5 },
  },
  {
    id: "neon",
    name: "Neon Glow",
    description: "Cyberpunk neon effect",
    category: "modern",
    intensity: 1.2,
    parameters: { glow: 1.2, color: "var(--glass-color-secondary)" },
  },
];

const defaultProcessingSettings: ProcessingSettings = {
  quality: "medium",
  fps: 30,
  enableGPU: true,
  batchSize: 4,
};

const readableGlassTextStyle = {
  "--glass-text-primary": "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
  "--typography-text-primary":
    "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
  "--glass-theme-text": "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
  color: "var(--glass-theme-text, rgba(255, 255, 255, 0.95))",
} as React.CSSProperties;

export const GlassLiveFilter = forwardRef<HTMLDivElement, GlassLiveFilterProps>(
  (
    {
      videoSource,
      imageSource,
      availableFilters = defaultFilters,
      selectedFilters = [],
      processingSettings = {},
      compact = false,
      showHeader = !compact,
      showActions = !compact,
      showFilterLibrary = true,
      showPreview = true,
      showControls = false,
      enableRealTimeProcessing = true,
      enableChaining = true,
      enableCustomFilters = false,
      maxFilters = 5,
      canvasWidth = 640,
      canvasHeight = 360,
      onFilterApply,
      onProcessingComplete,
      onError,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeFilters, setActiveFilters] =
      useState<string[]>(selectedFilters);
    const [filterParameters, setFilterParameters] = useState<
      Record<string, FilterParameters>
    >({});
    const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
    const [originalImageUrl, setOriginalImageUrl] = useState<string>(
      imageSource || ""
    );
    const [processingProgress, setProcessingProgress] = useState(0);

    const [settings, setSettings] = useState<ProcessingSettings>({
      ...defaultProcessingSettings,
      ...processingSettings,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const animationFrameRef = useRef<number>();
    const processedCanvasRef = useRef<HTMLCanvasElement>(null);

    const id = useA11yId("glass-live-filter");
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();

    // Initialize video stream
    const initializeVideo = useCallback(async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        if (videoSource instanceof MediaStream) {
          video.srcObject = videoSource;
        } else if (typeof videoSource === "string") {
          video.src = videoSource;
        }
        await video.play();
      } catch (error) {
        onError?.(error as Error);
      }
    }, [videoSource, onError]);

    // Apply filters to image data
    const applyFilters = useCallback(
      (imageData: ImageData, filters: FilterEffect[]): ImageData => {
        let processedData = new ImageData(
          new Uint8ClampedArray(imageData.data),
          imageData.width,
          imageData.height
        );

        filters.forEach((filter) => {
          const params = filterParameters[filter.id] || filter.parameters || {};

          switch (filter.id) {
            case "grayscale":
              processedData = applyGrayscale(
                processedData,
                getNumericParam(params, "strength", 1.0)
              );
              break;
            case "sepia":
              processedData = applySepia(
                processedData,
                getNumericParam(params, "warmth", 0.8)
              );
              break;
            case "blur":
              // Simplified blur - in production would use proper convolution
              processedData = applyBlur(
                processedData,
                getNumericParam(params, "radius", 5)
              );
              break;
            case "brightness":
              processedData = applyBrightness(
                processedData,
                getNumericParam(params, "level", 1.2)
              );
              break;
            case "contrast":
              processedData = applyContrast(
                processedData,
                getNumericParam(params, "level", 1.3)
              );
              break;
            case "saturation":
              processedData = applySaturation(
                processedData,
                getNumericParam(params, "level", 1.5)
              );
              break;
            case "hue-shift":
              processedData = applyHueShift(
                processedData,
                getNumericParam(params, "degrees", 30)
              );
              break;
            case "edge-detect":
              processedData = applyEdgeDetection(
                processedData,
                getNumericParam(params, "threshold", 0.5)
              );
              break;
            case "emboss":
              processedData = applyEmboss(
                processedData,
                getNumericParam(params, "strength", 0.8)
              );
              break;
            case "vintage":
              processedData = applyVintage(processedData, params);
              break;
            case "neon":
              processedData = applyNeonGlow(processedData, params);
              break;
          }
        });

        return processedData;
      },
      [filterParameters]
    );

    // Filter implementations
    const applyGrayscale = (
      imageData: ImageData,
      strength: number
    ): ImageData => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(
          0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        );
        data[i] = data[i] + (gray - data[i]) * strength;
        data[i + 1] = data[i + 1] + (gray - data[i + 1]) * strength;
        data[i + 2] = data[i + 2] + (gray - data[i + 2]) * strength;
      }
      return imageData;
    };

    const applySepia = (imageData: ImageData, warmth: number): ImageData => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const tr = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        const tg = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        const tb = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);

        data[i] = r + (tr - r) * warmth;
        data[i + 1] = g + (tg - g) * warmth;
        data[i + 2] = b + (tb - b) * warmth;
      }
      return imageData;
    };

    const applyBlur = (imageData: ImageData, radius: number): ImageData => {
      // Simplified box blur - in production would use Gaussian
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      const output = new Uint8ClampedArray(data);

      const blurRadius = Math.floor(radius);
      for (let y = blurRadius; y < height - blurRadius; y++) {
        for (let x = blurRadius; x < width - blurRadius; x++) {
          let r = 0,
            g = 0,
            b = 0,
            a = 0;
          let count = 0;

          for (let dy = -blurRadius; dy <= blurRadius; dy++) {
            for (let dx = -blurRadius; dx <= blurRadius; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              a += data[idx + 3];
              count++;
            }
          }

          const idx = (y * width + x) * 4;
          output[idx] = r / count;
          output[idx + 1] = g / count;
          output[idx + 2] = b / count;
          output[idx + 3] = a / count;
        }
      }

      return new ImageData(output, width, height);
    };

    const applyBrightness = (
      imageData: ImageData,
      level: number
    ): ImageData => {
      const data = imageData.data;
      const factor = level;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * factor);
        data[i + 1] = Math.min(255, data[i + 1] * factor);
        data[i + 2] = Math.min(255, data[i + 2] * factor);
      }
      return imageData;
    };

    const applyContrast = (imageData: ImageData, level: number): ImageData => {
      const data = imageData.data;
      const factor = level;
      const intercept = 128 * (1 - factor);

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, data[i] * factor + intercept));
        data[i + 1] = Math.max(
          0,
          Math.min(255, data[i + 1] * factor + intercept)
        );
        data[i + 2] = Math.max(
          0,
          Math.min(255, data[i + 2] * factor + intercept)
        );
      }
      return imageData;
    };

    const applySaturation = (
      imageData: ImageData,
      level: number
    ): ImageData => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray =
          0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray + (data[i] - gray) * level;
        data[i + 1] = gray + (data[i + 1] - gray) * level;
        data[i + 2] = gray + (data[i + 2] - gray) * level;
      }
      return imageData;
    };

    const applyHueShift = (
      imageData: ImageData,
      degrees: number
    ): ImageData => {
      const data = imageData.data;
      const radians = (degrees * Math.PI) / 180;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

        // Convert RGB to HSL, shift hue, convert back
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        if (diff === 0) continue;

        let h = 0;
        if (max === r) h = ((g - b) / diff) % 6;
        else if (max === g) h = (b - r) / diff + 2;
        else h = (r - g) / diff + 4;

        h = (h * 60 + degrees) % 360;
        if (h < 0) h += 360;

        const l = (max + min) / 2;
        const s = diff / (1 - Math.abs(2 * l - 1));

        // Convert back to RGB
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;

        let nr = 0,
          ng = 0,
          nb = 0;
        if (h < 60) {
          nr = c;
          ng = x;
          nb = 0;
        } else if (h < 120) {
          nr = x;
          ng = c;
          nb = 0;
        } else if (h < 180) {
          nr = 0;
          ng = c;
          nb = x;
        } else if (h < 240) {
          nr = 0;
          ng = x;
          nb = c;
        } else if (h < 300) {
          nr = x;
          ng = 0;
          nb = c;
        } else {
          nr = c;
          ng = 0;
          nb = x;
        }

        data[i] = Math.round((nr + m) * 255);
        data[i + 1] = Math.round((ng + m) * 255);
        data[i + 2] = Math.round((nb + m) * 255);
      }
      return imageData;
    };

    const applyEdgeDetection = (
      imageData: ImageData,
      threshold: number
    ): ImageData => {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      const output = new Uint8ClampedArray(data.length);

      // Sobel edge detection
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;

          let gx = 0,
            gy = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
              const gray =
                0.299 * data[pixelIdx] +
                0.587 * data[pixelIdx + 1] +
                0.114 * data[pixelIdx + 2];

              // Sobel kernels
              const sobelX = [
                [-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1],
              ];
              const sobelY = [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1],
              ];

              gx += gray * sobelX[dy + 1][dx + 1];
              gy += gray * sobelY[dy + 1][dx + 1];
            }
          }

          const magnitude = Math.sqrt(gx * gx + gy * gy);
          const edge = magnitude > threshold * 255 ? 255 : 0;

          output[idx] = edge;
          output[idx + 1] = edge;
          output[idx + 2] = edge;
          output[idx + 3] = data[idx + 3];
        }
      }

      return new ImageData(output, width, height);
    };

    const applyEmboss = (imageData: ImageData, strength: number): ImageData => {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      const output = new Uint8ClampedArray(data);

      // Emboss kernel
      const kernel = [
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2],
      ];

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let r = 0,
            g = 0,
            b = 0;

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
              const weight = kernel[dy + 1][dx + 1];

              r += data[pixelIdx] * weight;
              g += data[pixelIdx + 1] * weight;
              b += data[pixelIdx + 2] * weight;
            }
          }

          const idx = (y * width + x) * 4;
          output[idx] = Math.max(0, Math.min(255, r * strength + 128));
          output[idx + 1] = Math.max(0, Math.min(255, g * strength + 128));
          output[idx + 2] = Math.max(0, Math.min(255, b * strength + 128));
        }
      }

      return new ImageData(output, width, height);
    };

    const getNumericParam = (
      params: FilterParameters,
      key: string,
      fallback: number
    ): number => {
      const value = params[key];
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
      }
      return fallback;
    };

    const applyVintage = (
      imageData: ImageData,
      params: FilterParameters
    ): ImageData => {
      let result = imageData;
      // Apply sepia first
      result = applySepia(result, 0.7);

      // Add grain
      const grain = getNumericParam(params, "grain", 0.3);
      const data = result.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grain * 255;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }

      return result;
    };

    const applyNeonGlow = (
      imageData: ImageData,
      params: FilterParameters
    ): ImageData => {
      const data = imageData.data;
      const glow = getNumericParam(params, "glow", 1.2);

      // Enhance bright colors and add glow effect
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness > 128) {
          data[i] = Math.min(255, data[i] * glow);
          data[i + 1] = Math.min(255, data[i + 1] * glow);
          data[i + 2] = Math.min(255, data[i + 2] * glow);
        }
      }

      return imageData;
    };

    // Process image/video frame
    const processFrame = useCallback(() => {
      const canvas = canvasRef.current;
      const processedCanvas = processedCanvasRef.current;
      const video = videoRef.current;

      if (!canvas || !processedCanvas) return;

      const ctx = canvas.getContext("2d");
      const processedCtx = processedCanvas.getContext("2d");

      if (!ctx || !processedCtx) return;

      let imageData: ImageData | null = null;

      // Get source image data
      if (video && !video.paused) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } else if (originalImageUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          processImageData(imgData, processedCtx);
        };
        img.src = originalImageUrl;
        return;
      }

      if (imageData) {
        processImageData(imageData, processedCtx);
      }

      if (enableRealTimeProcessing && video && !video.paused) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
      }
    }, [activeFilters, enableRealTimeProcessing, originalImageUrl]);

    const processImageData = (
      imageData: ImageData,
      ctx: CanvasRenderingContext2D
    ) => {
      const activeFilterObjects = availableFilters.filter((f) =>
        activeFilters.includes(f.id)
      );

      if (activeFilterObjects.length === 0) {
        ctx.putImageData(imageData, 0, 0);
        return;
      }

      setIsProcessing(true);

      // Process filters
      const processedData = applyFilters(imageData, activeFilterObjects);
      ctx.putImageData(processedData, 0, 0);

      const processedUrl = ctx.canvas.toDataURL();
      setProcessedImageUrl(processedUrl);
      onProcessingComplete?.(processedUrl);

      setIsProcessing(false);
    };

    // Filter management
    const addFilter = useCallback(
      (filterId: string) => {
        if (activeFilters.length >= maxFilters) {
          play("error");
          return;
        }

        setActiveFilters((prev) => [...prev, filterId]);
        const filter = availableFilters.find((f) => f.id === filterId);
        if (filter) {
          setFilterParameters((prev) => ({
            ...prev,
            [filterId]: { ...filter.parameters },
          }));
          onFilterApply?.(filterId, filter.parameters ?? {});
          play("select");
        }
      },
      [activeFilters, maxFilters, availableFilters, onFilterApply, play]
    );

    const removeFilter = useCallback(
      (filterId: string) => {
        setActiveFilters((prev) => prev.filter((id) => id !== filterId));
        setFilterParameters((prev) => {
          const { [filterId]: removed, ...rest } = prev;
          return rest;
        });
        play("remove");
      },
      [play]
    );

    const updateFilterParameter = useCallback(
      (filterId: string, paramName: string, value: FilterParameterValue) => {
        setFilterParameters((prev) => ({
          ...prev,
          [filterId]: {
            ...prev[filterId],
            [paramName]: value,
          },
        }));
      },
      []
    );

    // Initialize
    useEffect(() => {
      if (videoSource) {
        initializeVideo();
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [videoSource, initializeVideo]);

    useEffect(() => {
      processFrame();
    }, [activeFilters, filterParameters, processFrame]);

    const FilterLibrary = () => (
      <div className="glass-space-y-4">
        <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
          Filter Library
        </h4>

        <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-3 lg:glass-grid-cols-4 glass-gap-3">
          {availableFilters.map((filter) => (
            <motion.div
              key={filter.id}
              className={`
                glass-p-3 glass-radius-lg glass-border glass-cursor-pointer glass-transition-all duration-[${ANIMATION.DURATION.fast}ms]
                ${
                  activeFilters.includes(filter.id)
                    ? "glass-border-blue glass-surface-blue/20"
                    : "glass-border-white/20 hover:glass-border-white/40 glass-surface-subtle/5"
                }
              `}
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={() => {
                if (activeFilters.includes(filter.id)) {
                  removeFilter(filter.id);
                } else {
                  addFilter(filter.id);
                }
              }}
            >
              <div className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90 glass-mb-1">
                {filter.name}
              </div>
              <div className="glass-text-xs glass-text-primary-glass-opacity-60 glass-mb-2">
                {filter.description}
              </div>

              <div className="glass-flex glass-items-center glass-justify-between">
                <span
                  className={`
                  glass-px-2 glass-py-0.5 glass-radius glass-text-xs glass-font-medium
                  ${
                    filter.category === "artistic"
                      ? "glass-surface-primary/20 glass-text-secondary"
                      : filter.category === "color"
                        ? "glass-surface-blue/20 glass-text-secondary"
                        : filter.category === "blur"
                          ? "glass-surface-muted/20 glass-text-secondary"
                          : filter.category === "distortion"
                            ? "glass-surface-red/20 glass-text-secondary"
                            : filter.category === "vintage"
                              ? "glass-surface-amber/20 glass-text-secondary"
                              : "glass-surface-green/20 glass-text-secondary"
                  }
                `}
                >
                  {filter.category}
                </span>

                {activeFilters.includes(filter.id) && (
                  <div className="glass-text-primary">✓</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );

    const ActiveFilters = () => (
      <div className="glass-space-y-4">
        <div className="glass-flex glass-items-center glass-justify-between">
          <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
            Active Filters ({activeFilters.length}/{maxFilters})
          </h4>
          {activeFilters.length > 0 && (
            <button
              onClick={() => {
                setActiveFilters([]);
                setFilterParameters({});
                play("clear");
              }}
              className="glass-text-xs glass-text-primary hover:glass-text-secondary glass-transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {activeFilters.length === 0 ? (
          <p className="glass-text-sm glass-text-primary-glass-opacity-50 glass-italic">
            No filters applied
          </p>
        ) : (
          <div className="glass-space-y-3">
            {activeFilters.map((filterId, index) => {
              const filter = availableFilters.find((f) => f.id === filterId);
              if (!filter) return null;

              return (
                <div
                  key={filterId}
                  className="glass-p-3 glass-radius-lg glass-border glass-border-white/10 glass-surface-subtle/5"
                >
                  <div className="glass-flex glass-items-center glass-justify-between glass-mb-2">
                    <span className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90">
                      {filter.name}
                    </span>
                    <div className="glass-flex glass-items-center glass-space-x-2">
                      <span className="glass-text-xs glass-text-primary-glass-opacity-60">
                        #{index + 1}
                      </span>
                      <button
                        onClick={() => removeFilter(filterId)}
                        className="glass-text-primary hover:glass-text-secondary glass-transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Filter parameters */}
                  {filter.parameters &&
                    Object.entries(filter.parameters).map(
                      ([paramName, defaultValue]) => (
                        <div key={paramName} className="glass-mt-2">
                          <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
                            {paramName.charAt(0).toUpperCase() +
                              paramName.slice(1)}
                            :
                            {typeof defaultValue === "number"
                              ? ` ${getNumericParam(filterParameters[filterId] ?? {}, paramName, defaultValue).toFixed(2)}`
                              : ""}
                          </label>
                          {typeof defaultValue === "number" ? (
                            <input
                              type="range"
                              min={paramName === "degrees" ? -180 : 0}
                              max={
                                paramName === "degrees"
                                  ? 180
                                  : paramName === "radius"
                                    ? 20
                                    : 3
                              }
                              step={paramName === "degrees" ? 1 : 0.1}
                              value={
                                filterParameters[filterId]?.[paramName] ??
                                defaultValue
                              }
                              onChange={(e) =>
                                updateFilterParameter(
                                  filterId,
                                  paramName,
                                  parseFloat(e.target.value)
                                )
                              }
                              className="glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"
                              aria-label={`${paramName.charAt(0).toUpperCase() + paramName.slice(1)} filter parameter`}
                            />
                          ) : (
                            <input
                              type="color"
                              value={normalizeColorInputValue(
                                String(
                                  filterParameters[filterId]?.[paramName] ??
                                    defaultValue
                                )
                              )}
                              onChange={(e) =>
                                updateFilterParameter(
                                  filterId,
                                  paramName,
                                  e.target.value
                                )
                              }
                              className="glass-w-8 glass-h-6 glass-radius glass-border glass-border-white/20"
                              aria-label={`${paramName.charAt(0).toUpperCase() + paramName.slice(1)} color picker`}
                            />
                          )}
                        </div>
                      )
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        data-glass-component
        style={{
          ...readableGlassTextStyle,
          maxHeight: "100%",
          minWidth: 0,
          height: compact ? "100%" : undefined,
          overflow: compact ? "hidden" : undefined,
        }}
        className={`${compact ? "glass-p-3 glass-space-y-3" : "glass-p-4 glass-space-y-4"} glass-max-w-full glass-overflow-auto ${className}`}
        {...props}
      >
        {/* Header */}
        {showHeader && (
          <div className="glass-flex glass-items-center glass-justify-between glass-gap-3 glass-min-w-0">
            <div className="glass-min-w-0">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary-glass-opacity-90 glass-truncate">
                Live Image Filter
              </h3>
              <p className="glass-text-sm glass-text-primary-glass-opacity-60">
                Real-time image and video processing with custom filters
              </p>
            </div>

            <div className="glass-flex glass-items-center glass-gap-2 glass-flex-shrink-0">
              {enableRealTimeProcessing && (
                <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                  <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse" />
                  <span className="glass-text-xs">Real-time</span>
                </div>
              )}
              {isProcessing && (
                <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                  <div className="glass-w-4 glass-h-4 glass-border-2 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin" />
                  <span className="glass-text-xs">Processing</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview area */}
        {showPreview && (
          <div
            className={`glass-grid ${compact ? "glass-grid-cols-2 glass-gap-3" : "glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-3"}`}
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
                  className="glass-w-full glass-h-full glass-object-cover"
                />
                {videoSource && (
                  <video
                    ref={videoRef}
                    className="glass-hidden"
                    autoPlay
                    muted
                    loop
                  />
                )}
              </div>
            </div>

            {/* Processed */}
            <div className="glass-space-y-2">
              <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
                Filtered
              </h4>
              <div className="glass-relative glass-aspect-video glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg glass-overflow-hidden">
                <canvas
                  ref={processedCanvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="glass-w-full glass-h-full glass-object-cover"
                />
                {isProcessing && (
                  <div className="glass-absolute glass-inset-0 glass-surface-dark/50 glass-flex glass-items-center glass-justify-center">
                    <div className="glass-w-8 glass-h-8 glass-border-2 glass-border-white glass-border-t-transparent glass-radius-full glass-animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="glass-grid glass-grid-cols-1 lg:glass-grid-cols-2 glass-gap-6">
            <ActiveFilters />
            <div className="glass-space-y-4">
              <h4 className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80">
                Processing Settings
              </h4>
              <div className="glass-grid glass-grid-cols-2 glass-gap-4">
                <div>
                  <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
                    Quality
                  </label>
                  <select
                    value={settings.quality}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        quality: e.target.value as ProcessingQuality,
                      }))
                    }
                    className="glass-w-full glass-p-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-lg glass-text-primary-glass-opacity-90 glass-text-sm"
                    aria-label="Processing quality"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="glass-block glass-text-xs glass-text-primary-opacity-70 glass-mb-1">
                    FPS: {settings.fps}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={settings.fps}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        fps: parseInt(e.target.value),
                      }))
                    }
                    className="glass-w-full glass-h-2 glass-surface-subtle/20 glass-radius-lg glass-appearance-none glass-cursor-pointer"
                    aria-label="Frames per second"
                  />
                </div>
              </div>

              <div className="glass-flex glass-items-center glass-space-x-4">
                <label className="glass-flex glass-items-center glass-space-x-2 glass-cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableGPU}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        enableGPU: e.target.checked,
                      }))
                    }
                    className="glass-w-4 glass-h-4 glass-radius glass-border-white/30"
                  />
                  <span className="glass-text-sm glass-text-primary-glass-opacity-80">
                    GPU Acceleration
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Filter library */}
        {showFilterLibrary && <FilterLibrary />}

        {/* Action buttons */}
        {showActions && (
          <div className="glass-flex glass-items-center glass-justify-between glass-gap-3 glass-pt-3 glass-border-t glass-border-white/10 glass-flex-wrap">
            <div className="glass-flex glass-items-center glass-gap-2 glass-flex-wrap">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setOriginalImageUrl(url);
                    play("upload");
                  }
                }}
                className="glass-hidden"
                id="image-upload"
              />
              <motion.label
                htmlFor="image-upload"
                className="glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-cursor-pointer glass-transition-colors"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              >
                Upload Image
              </motion.label>

              <motion.button
                className="glass-px-4 glass-py-2 glass-border glass-border-white/30 hover:glass-border-white/50 glass-text-primary-glass-opacity-80 glass-radius-lg glass-text-sm glass-transition-colors"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                onClick={() => processFrame()}
              >
                Apply Filters
              </motion.button>
            </div>

            {processedImageUrl && (
              <motion.a
                href={processedImageUrl}
                download="filtered-image.png"
                className="glass-px-4 glass-py-2 glass-surface-green hover:glass-surface-green glass-text-primary glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors"
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              >
                Download Result
              </motion.a>
            )}
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassLiveFilter.displayName = "GlassLiveFilter";
