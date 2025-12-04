'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HTMLMotionProps, motion } from "framer-motion";
import React, { forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export type DepthLayer =
  | "background"
  | "far"
  | "mid-far"
  | "mid"
  | "mid-near"
  | "near"
  | "foreground"
  | "overlay";

export interface GlassDepthConfig {
  layer: DepthLayer;
  opacity: number;
  blur: number;
  brightness: number;
  zIndex: number;
  transform: string;
  shadow: string;
}

interface DepthLayerProps extends Omit<HTMLMotionProps<"div">, "style"> {
  layer: DepthLayer;
  customConfig?: Partial<GlassDepthConfig>;
  children: React.ReactNode;
  enableParallax?: boolean;
  parallaxStrength?: number;
  enableHover?: boolean;
  hoverLift?: number;
  className?: string;
}

const DEFAULT_DEPTH_CONFIGS: Record<DepthLayer, GlassDepthConfig> = {
  background: {
    layer: "background",
    opacity: 0.02,
    blur: 2,
    brightness: 0.3,
    zIndex: 1,
    transform: "translateZ(-200px) scale(1.8)",
    shadow: "none",
  },
  far: {
    layer: "far",
    opacity: 0.05,
    blur: 8,
    brightness: 0.4,
    zIndex: 10,
    transform: "translateZ(-150px) scale(1.5)",
    shadow:
      "0 4px 20px rgba(var(--glass-color-black) / var(--glass-opacity-10))",
  },
  "mid-far": {
    layer: "mid-far",
    opacity: 0.08,
    blur: 12,
    brightness: 0.5,
    zIndex: 20,
    transform: "translateZ(-100px) scale(1.3)",
    shadow:
      "0 6px 25px rgba(var(--glass-color-black) / var(--glass-opacity-15))",
  },
  mid: {
    layer: "mid",
    opacity: 0.12,
    blur: 16,
    brightness: 0.6,
    zIndex: 30,
    transform: "translateZ(-50px) scale(1.1)",
    shadow:
      "0 8px 30px rgba(var(--glass-color-black) / var(--glass-opacity-20))",
  },
  "mid-near": {
    layer: "mid-near",
    opacity: 0.16,
    blur: 20,
    brightness: 0.7,
    zIndex: 40,
    transform: "translateZ(0px) scale(1)",
    shadow: "0 10px 35px rgba(0, 0, 0, 0.25)",
  },
  near: {
    layer: "near",
    opacity: 0.22,
    blur: 24,
    brightness: 0.8,
    zIndex: 50,
    transform: "translateZ(50px) scale(0.9)",
    shadow:
      "0 12px 40px rgba(var(--glass-color-black) / var(--glass-opacity-30))",
  },
  foreground: {
    layer: "foreground",
    opacity: 0.3,
    blur: 28,
    brightness: 0.9,
    zIndex: 60,
    transform: "translateZ(100px) scale(0.8)",
    shadow: "0 16px 50px rgba(0, 0, 0, 0.4)",
  },
  overlay: {
    layer: "overlay",
    opacity: 0.4,
    blur: 32,
    brightness: 1,
    zIndex: 70,
    transform: "translateZ(200px) scale(0.6)",
    shadow:
      "0 20px 60px rgba(var(--glass-color-black) / var(--glass-opacity-50))",
  },
};

export const GlassDepthLayer = forwardRef<HTMLDivElement, DepthLayerProps>(
  (
    {
      layer,
      customConfig,
      children,
      enableParallax = false,
      parallaxStrength = 0.5,
      enableHover = true,
      hoverLift = 10,
      className="",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

    const config = useMemo(
      () => ({
        ...DEFAULT_DEPTH_CONFIGS[layer],
        ...customConfig,
      }),
      [layer, customConfig]
    );

    const glassStyle = useMemo(
      () => createGlassStyle({ intent: "neutral", elevation: "level2" }),
      [config]
    );

    const motionProps = {
      style: glassStyle,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: enableHover
        ? {
            transform: `${config.transform} translateY(-${hoverLift}px)`,
            boxShadow: `0 ${20 + hoverLift}px ${60 + hoverLift}px rgba(0, 0, 0, 0.4)`,
            transition: { duration: 0.3, ease: "easeOut" },
          }
        : undefined,
      ...(enableParallax && {
        drag: false,
        onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;

          const rotateX = (y - 0.5) * parallaxStrength * 10;
          const rotateY = (x - 0.5) * parallaxStrength * 10;

          event.currentTarget.style.transform = `${config.transform} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        },
        onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => {
          event.currentTarget.style.transform = config.transform;
        },
      }),
      ...props,
    };

    return (
      <motion.div ref={ref} className={className} {...motionProps}>
        {children}
      </motion.div>
    );
  }
);

GlassDepthLayer.displayName = "GlassDepthLayer";

interface DepthSceneProps {
  children: React.ReactNode;
  perspective?: number;
  className?: string;
}

export const GlassDepthScene: React.FC<DepthSceneProps> = ({
  children,
  perspective = 1000,
  className="",
}) => {
  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

interface LayeredGlassStackProps {
  layers: {
    content: React.ReactNode;
    layer: DepthLayer;
    config?: Partial<GlassDepthConfig>;
  }[];
  enableParallax?: boolean;
  enableHover?: boolean;
  className?: string;
}

export const LayeredGlassStack: React.FC<LayeredGlassStackProps> = ({
  layers,
  enableParallax = true,
  enableHover = true,
  className="",
}) => {
  const sortedLayers = useMemo(
    () =>
      [...layers].sort(
        (a, b) =>
          DEFAULT_DEPTH_CONFIGS[a.layer].zIndex -
          DEFAULT_DEPTH_CONFIGS[b.layer].zIndex
      ),
    [layers]
  );

  return (
    <GlassDepthScene className={className}>
      {sortedLayers.map((layerData, index) => (
        <GlassDepthLayer
          key={`${layerData.layer}-${index}`}
          layer={layerData.layer}
          customConfig={layerData.config}
          enableParallax={enableParallax}
          enableHover={enableHover}
          className='glass-absolute glass-inset-0'
        >
          {layerData.content}
        </GlassDepthLayer>
      ))}
    </GlassDepthScene>
  );
};

export const useDepthAnimation = (layer: DepthLayer) => {
  const config = DEFAULT_DEPTH_CONFIGS[layer];

  return useMemo(
    () => ({
      initial: {
        opacity: 0,
        z: -200,
        scale: 0.8,
      },
      animate: {
        opacity: config.opacity,
        z: 0,
        scale: 1,
        transition: {
          duration: 1,
          ease: [0.23, 1, 0.32, 1],
          delay: config.zIndex * 0.1,
        },
      },
      exit: {
        opacity: 0,
        z: -200,
        scale: 0.8,
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      },
    }),
    [config]
  );
};

export { DEFAULT_DEPTH_CONFIGS };