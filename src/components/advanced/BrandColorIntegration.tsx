'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "../../lib/utilsComprehensive";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import "./BrandColorIntegration.css";
import { useIntelligentColor } from "./IntelligentColorSystem";

interface EntityBrandColors {
  entityId: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  colorHistory: Array<{
    color: string;
    timestamp: number;
    confidence: number;
  }>;
}

interface BrandColorIntegrationProps {
  entityId?: string;
  brandColors?: string[];
  fallbackColors?: {
    primary: string;
    secondary: string;
  };
  animationDuration?: number;
  className?: string;
  children: React.ReactNode;
}

export function BrandColorIntegration({
  entityId,
  brandColors,
  fallbackColors = {
    primary: "var(--glass-color-primary)",
    secondary: "#1e40af",
  },
  animationDuration = 600,
  className = "",
  children,
}: BrandColorIntegrationProps) {
  const prefersReducedMotion = useReducedMotion();
  const { currentPalette, adaptToBrand } = useIntelligentColor();
  const [entityColors, setEntityColors] = useState<EntityBrandColors | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [colorTransition, setColorTransition] = useState(false);

  // Mock brand color API - replace with actual API call
  const fetchEntityBrandColors = async (
    id: string
  ): Promise<EntityBrandColors> => {
    // Simulate API delay - reduced for better performance
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Mock data - replace with actual API response
    const mockColors: Record<string, EntityBrandColors> = {
      apple: {
        entityId: "apple",
        primaryColor: "#007AFF",
        secondaryColor: "#5856D6",
        logoUrl: "/logos/apple.png",
        colorHistory: [
          {
            color: "#007AFF",
            timestamp: Date.now() - 86400000,
            confidence: 0.95,
          },
          {
            color: "#1D1D1F",
            timestamp: Date.now() - 172800000,
            confidence: 0.87,
          },
        ],
      },
      google: {
        entityId: "google",
        primaryColor: "#4285F4",
        secondaryColor: "#34A853",
        logoUrl: "/logos/google.png",
        colorHistory: [
          {
            color: "#4285F4",
            timestamp: Date.now() - 86400000,
            confidence: 0.98,
          },
          {
            color: "#EA4335",
            timestamp: Date.now() - 172800000,
            confidence: 0.92,
          },
        ],
      },
      microsoft: {
        entityId: "microsoft",
        primaryColor: "#0078D4",
        secondaryColor: "#106EBE",
        logoUrl: "/logos/microsoft.png",
        colorHistory: [
          {
            color: "#0078D4",
            timestamp: Date.now() - 86400000,
            confidence: 0.93,
          },
          {
            color: "#00BCF2",
            timestamp: Date.now() - 172800000,
            confidence: 0.89,
          },
        ],
      },
    };

    return (
      mockColors[id] || {
        entityId: id,
        primaryColor: fallbackColors.primary,
        secondaryColor: fallbackColors.secondary,
        colorHistory: [],
      }
    );
  };

  // Load entity colors when entityId changes
  useEffect(() => {
    if (!entityId) {
      setEntityColors(null);
      return;
    }

    let isMounted = true;

    setIsLoading(true);

    fetchEntityBrandColors(entityId)
      .then((colors) => {
        if (isMounted) {
          setEntityColors(colors);
          setColorTransition(true);
          // Transition reset handled via onAnimationComplete to avoid timers
        }
      })
      .catch((error) => {
        console.error("Failed to fetch brand colors:", error);
        if (isMounted) {
          setEntityColors({
            entityId,
            primaryColor: fallbackColors.primary,
            secondaryColor: fallbackColors.secondary,
            colorHistory: [],
          });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [entityId, fallbackColors.primary, fallbackColors.secondary]); // Remove animationDuration from deps

  // Adapt to brand colors when they change
  useEffect(() => {
    if (brandColors && brandColors.length > 0) {
      adaptToBrand(brandColors);
    }
  }, [brandColors, adaptToBrand]);

  // Generate CSS custom properties for brand colors
  const getBrandColorVars = () => {
    if (!entityColors) return {};

    return {
      "--brand-primary": entityColors.primaryColor,
      "--brand-secondary": entityColors.secondaryColor,
      "--brand-primary-rgb": hexToRgb(entityColors.primaryColor),
      "--brand-secondary-rgb": hexToRgb(entityColors.secondaryColor),
      "--brand-primary-alpha-10": `${entityColors.primaryColor}1A`,
      "--brand-primary-alpha-20": `${entityColors.primaryColor}33`,
      "--brand-primary-alpha-30": `${entityColors.primaryColor}4D`,
      "--brand-secondary-alpha-10": `${entityColors.secondaryColor}1A`,
      "--brand-secondary-alpha-20": `${entityColors.secondaryColor}33`,
      "--brand-secondary-alpha-30": `${entityColors.secondaryColor}4D`,
    };
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 0, 0";
  };

  return (
    <motion.div
      className={`brand-color-integration ${className}`}
      style={{
        ...getBrandColorVars(),
        position: "relative",
      }}
      animate={
        colorTransition
          ? {
              background: [
                "transparent",
                `${entityColors?.primaryColor}04`,
                "transparent",
              ],
            }
          : {}
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: animationDuration / 1000, ease: "easeInOut" }
      }
      onAnimationComplete={() => {
        if (colorTransition) setColorTransition(false);
      }}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className='absolute inset-0 glass-flex glass-items-center glass-justify-center z-50'
            style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn(
                "glass-flex glass-items-center glass-space-x-3 glass-text-primary"
              )}
              initial={{ y: 10, opacity: 0 }}
              animate={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
            >
              <motion.div
                className={cn(
                  "glass-w-5 glass-h-5 glass-border-2 glass-border-primary glass-border-t-transparent glass-radius-full"
                )}
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 1.5, repeat: Infinity, ease: "linear" }
                }
              />
              <span className="glass-text-sm">Loading brand colors...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand color indicator */}
      <AnimatePresence>
        {entityColors && !isLoading && (
          <motion.div
            className='absolute glass-top-2 glass-right-2 z-10'
            initial={{ opacity: 0, scale: 0, y: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -10 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { delay: 0.2, duration: 0.3 }
            }
          >
            <div
              className={cn(
                "glass-flex glass-items-center glass-space-x-1 glass-px-2 glass-py-1 glass-radius-full glass-text-xs glass-font-medium glass-text-primary"
              )}
              style={createGlassStyle({
                intent: "neutral",
                elevation: "level2",
              })}
            >
              <div
                className='w-2 h-2 glass-radius-full'
                style={{ backgroundColor: entityColors.primaryColor }}
              />
              <span>Brand</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color transition effect */}
      <AnimatePresence>
        {colorTransition && entityColors && (
          <motion.div
            className='absolute inset-0 pointer-events-none'
            style={{
              background: `radial-gradient(circle at center, ${entityColors.primaryColor}20 0%, transparent 70%)`,
              borderRadius: "inherit",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: animationDuration / 1000, ease: "easeOut" }
            }
          />
        )}
      </AnimatePresence>

      {children}

      {/* CSS custom properties injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: entityColors
            ? `
          .brand-color-integration {
            --brand-glass-primary: ${entityColors.primaryColor}1A;
            --brand-glass-secondary: ${entityColors.secondaryColor}1A;
            --brand-border-primary: ${entityColors.primaryColor}33;
            --brand-border-secondary: ${entityColors.secondaryColor}33;
            --brand-shadow-primary: 0 8px 32px ${entityColors.primaryColor}20;
            --brand-shadow-secondary: 0 8px 32px ${entityColors.secondaryColor}20;
          }
        `
            : "",
        }}
      />
    </motion.div>
  );
}

// Brand-aware glass button component
export function BrandGlassButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyles = {
    primary: {
      background:
        '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
      border:
        "1px solid var(--brand-border-primary, var(--glass-color-primary, 0.3))",
      boxShadow: "var(--glass-elev-2)",
      color: "var(--brand-primary, var(--glass-color-primary))",
    },
    secondary: {
      background:
        '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
      border: "1px solid var(--brand-border-secondary, rgba(30, 64, 175, 0.3))",
      boxShadow: "var(--glass-elev-2)",
      color: "var(--brand-secondary, #1e40af)",
    },
  };

  return (
    <motion.button
      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${className}`}
      style={{
        ...buttonStyles[variant],
        // Use createGlassStyle() instead,
        // Use createGlassStyle() instead
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={
        !disabled
          ? {
              scale: 1.01,
              y: -0.5,
              boxShadow:
                variant === "primary"
                  ? "var(--brand-shadow-primary, 0 8px 24px var(--glass-color-primary, 0.2))"
                  : "var(--brand-shadow-secondary, 0 8px 24px rgba(30, 64, 175, 0.2))",
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.99, y: 0 } : {}}
      animate={{
        opacity: disabled ? 0.5 : 1,
        filter: disabled ? "grayscale(1)" : "grayscale(0)",
      }}
      {...props}
    >
      {children}

      {/* Brand color pulse effect */}
      <motion.div
        className='absolute inset-0 glass-radius-lg pointer-events-none'
        style={{
          background: `radial-gradient(circle at center, var(--brand-${variant}, var(--glass-color-primary, 0.2)) 0%, transparent 70%)`,
        }}
        animate={
          isPressed
            ? {
                scale: [1, 1.1, 1],
                opacity: [0, 0.2, 0],
              }
            : {}
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.2, ease: "easeOut" }
        }
      />
    </motion.button>
  );
}

// Hook to use brand colors in components
export function useBrandColors(entityId?: string) {
  const [brandColors, setBrandColors] = useState<EntityBrandColors | null>(
    null
  );

  useEffect(() => {
    if (!entityId) return;

    // This would typically fetch from your API
    // For now, using the mock function from BrandColorIntegration
    const fetchColors = async () => {
      try {
        // Mock implementation - replace with actual API call
        const mockColors: Record<string, EntityBrandColors> = {
          apple: {
            entityId: "apple",
            primaryColor: "#007AFF",
            secondaryColor: "#5856D6",
            colorHistory: [],
          },
          google: {
            entityId: "google",
            primaryColor: "#4285F4",
            secondaryColor: "#34A853",
            colorHistory: [],
          },
        };

        setBrandColors(mockColors[entityId] || null);
      } catch (error) {
        console.error("Failed to fetch brand colors:", error);
        setBrandColors(null);
      }
    };

    fetchColors();
  }, [entityId]);

  return brandColors;
}

export default BrandColorIntegration;
