/**
 * AuraGlass Parallax Glass Layers
 * Multi-depth glass layers with mouse/scroll parallax effects
 */

import { cn } from '../../lib/utilsComprehensive';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { OptimizedGlass } from '../../primitives';
import { useA11yId } from '../../utils/a11y';

interface ParallaxLayer {
  depth: number; // 0-10, where 0 is closest
  content: React.ReactNode;
  className?: string;
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  offset?: { x: number; y: number };
}

export interface GlassParallaxLayersProps {
  layers: ParallaxLayer[];
  className?: string;
  mouseIntensity?: number; // 0-1
  scrollIntensity?: number; // 0-1
  perspective?: number;
  autoRotate?: boolean;
  rotateSpeed?: number;
  interactive?: boolean;
  debug?: boolean;
  /** Accessible label for the parallax container */
  'aria-label'?: string;
  /** Reduced motion preference */
  respectMotionPreference?: boolean;
}

export const GlassParallaxLayers = forwardRef<HTMLDivElement, GlassParallaxLayersProps>(({
  layers,
  className,
  mouseIntensity = 0.5,
  scrollIntensity = 0.3,
  perspective = 1200,
  autoRotate = false,
  rotateSpeed = 0.5,
  interactive = true,
  debug = false,
  'aria-label': ariaLabel,
  respectMotionPreference = true,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const componentId = useA11yId('parallax-layers');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (!respectMotionPreference) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [respectMotionPreference]);
  
  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Auto rotation
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setRotation((prev: any) => prev + rotateSpeed);
    }, 16);
    
    return () => clearInterval(interval);
  }, [autoRotate, rotateSpeed]);
  
  // Handle mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [interactive, mouseX, mouseY]);
  
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  // Sort layers by depth (furthest first for proper stacking)
  const sortedLayers = [...layers].sort((a, b) => b.depth - a.depth);
  
  return (
    <div
      ref={ref || containerRef}
      id={componentId}
      className={cn(
        "relative overflow-hidden",
        "transform-gpu will-change-transform",
        className
      )}
      style={{
        perspective: prefersReducedMotion ? 'none' : `${perspective}px`,
        transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
      }}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseEnter={prefersReducedMotion ? undefined : handleMouseEnter}
      onMouseLeave={prefersReducedMotion ? undefined : handleMouseLeave}
      role="presentation"
      aria-label={ariaLabel || "Parallax layers with interactive effects"}
      aria-hidden={!ariaLabel}
    >
      {sortedLayers.map((layer, index) => {
        const depthFactor = layer.depth / 10;
        const parallaxFactor = 1 - depthFactor;
        
        // Calculate transforms based on depth
        const xTransform = useTransform(
          smoothMouseX,
          [-0.5, 0.5],
          [-50 * parallaxFactor * mouseIntensity, 50 * parallaxFactor * mouseIntensity]
        );
        
        const yTransform = useTransform(
          smoothMouseY,
          [-0.5, 0.5],
          [-30 * parallaxFactor * mouseIntensity, 30 * parallaxFactor * mouseIntensity]
        );
        
        const scrollY = useTransform(
          scrollYProgress,
          [0, 1],
          [100 * depthFactor * scrollIntensity, -100 * depthFactor * scrollIntensity]
        );
        
        const rotateXTransform = useTransform(
          smoothMouseY,
          [-0.5, 0.5],
          [15 * parallaxFactor * mouseIntensity, -15 * parallaxFactor * mouseIntensity]
        );
        
        const rotateYTransform = useTransform(
          smoothMouseX,
          [-0.5, 0.5],
          [-15 * parallaxFactor * mouseIntensity, 15 * parallaxFactor * mouseIntensity]
        );
        
        // Blur based on depth
        const blurAmount = Math.round(depthFactor * 4);
        const autoBlur = blurAmount === 0 ? 'none' :
                        blurAmount === 1 ? 'subtle' :
                        blurAmount === 2 ? 'medium' :
                        blurAmount === 3 ? 'strong' : 'intense';

        // Map layer blur values to OptimizedGlass compatible values
        const mapBlurValue = (blur: 'none' | 'sm' | 'md' | 'lg' | 'xl' | undefined): 'none' | 'subtle' | 'medium' | 'strong' | 'intense' | undefined => {
          switch (blur) {
            case 'sm': return 'subtle';
            case 'md': return 'medium';
            case 'lg': return 'strong';
            case 'xl': return 'intense';
            default: return blur;
          }
        };

        const finalBlur = mapBlurValue(layer.blur) || autoBlur;
        
        return (
          <motion.div
            key={`layer-${index}`}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
            animate={{
              opacity: layer.opacity || (1 - depthFactor * 0.2),
              scale: layer.scale || (1 - depthFactor * 0.1)
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              delay: prefersReducedMotion ? 0 : index * 0.1
            }}
            style={{
              x: prefersReducedMotion ? 0 : xTransform,
              y: prefersReducedMotion ? 0 : scrollY,
              rotateX: prefersReducedMotion ? 0 : rotateXTransform,
              rotateY: prefersReducedMotion ? 0 : (autoRotate ? rotation : rotateYTransform),
              z: prefersReducedMotion ? 0 : layer.depth * 50,
              scale: layer.scale || (1 - depthFactor * 0.1),
              opacity: layer.opacity || (1 - depthFactor * 0.2),
              transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
            } as any}
          >
            <OptimizedGlass
              intent="neutral"
              elevation={isHovered ? "level3" : "level1"}
              intensity="medium"
              blur={finalBlur}
              depth={Math.min(layer.depth, 5)}
              className={cn(
                "absolute inset-0",
                "transition-all duration-300",
                layer.className
              )}
            >
            {layer.content}
            
            {debug && (
              <div className="absolute glass-top-2 left-2 glass-surface-dark/20 backdrop-blur-sm p-2 glass-radius-sm text-xs text-primary/90">
                Layer {index + 1} | Depth: {layer.depth}
              </div>
            )}
          </OptimizedGlass>
          </motion.div>
        );
      })}
      
      {/* Interactive indicator */}
      {interactive && !prefersReducedMotion && (
        <motion.div
          className="absolute bottom-4 right-4 text-primary/60 text-xs glass-surface-dark/20 backdrop-blur-sm p-2 glass-radius-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          role="status"
          aria-live="polite"
        >
          {isHovered ? 'Move mouse to parallax' : 'Hover to interact'}
        </motion.div>
      )}
    </div>
  );
});

// Preset layer configurations
export const parallaxPresets = {
  hero: [
    { depth: 0, blur: 'none', content: null }, // Foreground
    { depth: 3, blur: 'sm', content: null },   // Midground
    { depth: 6, blur: 'md', content: null },   // Background
    { depth: 10, blur: 'lg', content: null },  // Far background
  ],
  card: [
    { depth: 0, blur: 'none', scale: 1.05, content: null },
    { depth: 5, blur: 'sm', scale: 1, content: null },
    { depth: 10, blur: 'md', scale: 0.95, content: null },
  ],
  depth: [
    { depth: 0, content: null },
    { depth: 2, content: null },
    { depth: 4, content: null },
    { depth: 6, content: null },
    { depth: 8, content: null },
    { depth: 10, content: null },
  ],
};

// Helper hook for dynamic layer creation
export function useParallaxLayers(count: number = 3, depthRange: [number, number] = [0, 10]) {
  return Array.from({ length: count }, (_, i) => ({
    depth: depthRange[0] + (depthRange[1] - depthRange[0]) * (i / (count - 1)),
    content: null,
    blur: 'none' as const,
  }));
}